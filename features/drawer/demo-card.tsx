"use client"

import { useId, useState } from "react"
import { ChevronDown, Copy, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { buildDemoContent, practiceBaseFromLead, type Demo } from "@/domain/demo"
import type { Lead } from "@/domain/lead"
import { useCreateDemo, useDemo, useUpdateDemo } from "@/data/use-demo"
import { templatesFor, type TemplateId } from "@/templates"
import type { VerticalConfig } from "@/verticals/types"
import { DemoEditForm } from "./demo-edit-form"
import { DrawerCard } from "./drawer-card"

type Props = { lead: Lead; vertical: VerticalConfig }

// A personalised concept site to show the prospect before a call: pick a
// template, share the link, adjust text and hours, download the content
// when they say yes.
export function DemoCard({ lead, vertical }: Props) {
  const demo = useDemo(lead.id)
  const create = useCreateDemo()
  const update = useUpdateDemo()
  const templates = templatesFor(vertical.id)
  const [choice, setChoice] = useState<TemplateId | null>(templates[0]?.id ?? null)

  if (templates.length === 0) return null

  const error = demo.error?.message ?? create.error?.message ?? update.error?.message

  return (
    <DrawerCard label="Demo site">
      {demo.isPending ? (
        <p className="text-ink-muted">Loading…</p>
      ) : demo.data ? (
        <DemoControls
          lead={lead}
          demo={demo.data}
          templates={templates}
          saving={update.isPending}
          onUpdate={(patch) => update.mutate({ demo: demo.data!, patch })}
        />
      ) : (
        <div className="grid min-w-0 gap-3">
          <p className="text-ink-muted">No demo yet. Pick a template to make a link for this lead.</p>
          <div className="flex flex-wrap items-center gap-2">
            <TemplateSelect templates={templates} value={choice} onChange={setChoice} />
            <Button
              size="sm"
              disabled={!choice || create.isPending}
              onClick={() =>
                choice &&
                create.mutate({ leadId: lead.id, template: choice, name: practiceBaseFromLead(lead).name, city: lead.address.city ?? "" })
              }
            >
              Create demo
            </Button>
            {choice && (
              <a href={`/demo/preview/${choice}`} target="_blank" rel="noreferrer" className="text-label text-ink-muted underline underline-offset-2">
                Preview template
              </a>
            )}
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="text-coral">
          {error}
        </p>
      )}
    </DrawerCard>
  )
}

type ControlsProps = {
  lead: Lead
  demo: Demo
  templates: ReturnType<typeof templatesFor>
  saving: boolean
  onUpdate: (patch: { template?: TemplateId; active?: boolean; overrides?: Demo["overrides"] }) => void
}

function DemoControls({ lead, demo, templates, saving, onUpdate }: ControlsProps) {
  const switchId = useId()
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}/demo/${demo.slug}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      window.prompt("Copy the demo link", url)
    }
  }

  // The content a template renders, for a client's own project once they say yes.
  function downloadContent() {
    const content = buildDemoContent(practiceBaseFromLead(lead), demo.overrides)
    const blob = new Blob([JSON.stringify({ template: demo.template, content }, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${demo.slug.replace(/-[a-z0-9]+$/, "")}-content.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="grid min-w-0 gap-3">
      <div className="flex items-center justify-between gap-2">
        <TemplateSelect templates={templates} value={demo.template} onChange={(template) => onUpdate({ template })} />
        <label htmlFor={switchId} className="flex cursor-pointer items-center gap-2 text-body">
          {demo.active ? "Link on" : "Link off"}
          <Switch id={switchId} checked={demo.active} onCheckedChange={(active) => onUpdate({ active })} />
        </label>
      </div>

      {demo.active ? (
        <p className="min-w-0 truncate rounded-full bg-panel px-3.5 py-1.5 text-body text-ink" title={url}>
          {url.replace(/^https?:\/\//, "")}
        </p>
      ) : (
        <p className="text-ink-muted">The link is off. Visitors see &ldquo;This concept is no longer available&rdquo;.</p>
      )}
      {lead.stage === "lost" && demo.active && (
        <p className="text-ink-muted">This lead is lost, so the link shows as no longer available.</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={copyLink} disabled={!demo.active}>
          <Copy aria-hidden />
          {copied ? "Copied" : "Copy link"}
        </Button>
        <Button size="sm" variant="secondary" asChild>
          <a href={`/demo/${demo.slug}`} target="_blank" rel="noreferrer">
            <ExternalLink aria-hidden />
            Open demo
          </a>
        </Button>
        <Button size="sm" variant="secondary" onClick={downloadContent}>
          <Download aria-hidden />
          Download content.json
        </Button>
      </div>

      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 text-control text-ink [&::-webkit-details-marker]:hidden">
          <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
          Edit text and hours
        </summary>
        <div className="pt-3">
          <DemoEditForm
            key={demo.id}
            overrides={demo.overrides}
            defaultName={practiceBaseFromLead(lead).name}
            saving={saving}
            onSave={(overrides) => onUpdate({ overrides })}
          />
        </div>
      </details>
    </div>
  )
}

function TemplateSelect({
  templates,
  value,
  onChange,
}: {
  templates: ReturnType<typeof templatesFor>
  value: TemplateId | null
  onChange: (id: TemplateId) => void
}) {
  return (
    <span className="relative min-w-0">
      <select
        aria-label="Template"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value as TemplateId)}
        className="h-8 max-w-full cursor-pointer appearance-none truncate rounded-full border border-line bg-surface pr-8 pl-3.5 text-body text-ink hover:border-line-strong"
      >
        {templates.map((t) => (
          <option key={t.id} value={t.id} title={t.description}>
            {t.name}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-ink-muted" />
    </span>
  )
}
