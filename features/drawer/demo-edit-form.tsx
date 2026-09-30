"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DemoOverrides } from "@/domain/demo"
import { DEFAULT_HOURS } from "@/templates/_shared/practice"
import { HoursEditor } from "./hours-editor"

type Props = {
  overrides: DemoOverrides
  /** Shown as placeholders, so an empty field reads as "uses this". */
  defaultName: string
  saving: boolean
  onSave: (overrides: DemoOverrides) => void
}

const TEXT_FIELDS = [
  { key: "name", label: "Name shown", placeholder: null },
  { key: "headline", label: "Headline", placeholder: "The template's own headline" },
  { key: "email", label: "Email", placeholder: "Hidden until filled in" },
  { key: "bookUrl", label: "Online booking link", placeholder: "Book buttons go to the booking section" },
] as const

// Per-client text and hours. Empty fields fall back to the lead's details or
// the template's own copy.
export function DemoEditForm({ overrides, defaultName, saving, onSave }: Props) {
  const id = useId()
  const [draft, setDraft] = useState<DemoOverrides>(overrides)
  const [hours, setHours] = useState(overrides.hours ?? DEFAULT_HOURS)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  function update(key: keyof DemoOverrides, value: string) {
    setDraft((d) => ({ ...d, [key]: value }))
    setSavedAt(null)
  }

  function save(event: React.FormEvent) {
    event.preventDefault()
    const next: DemoOverrides = {}
    for (const key of ["name", "headline", "intro", "email", "bookUrl"] as const) {
      const value = (draft[key] as string | undefined)?.trim()
      if (value) next[key] = value
    }
    next.hours = hours
    onSave(next)
    setSavedAt(Date.now())
  }

  return (
    <form onSubmit={save} className="grid gap-3">
      {TEXT_FIELDS.map((field) => (
        <label key={field.key} className="grid gap-1.5">
          <span className="text-label text-ink-muted">{field.label}</span>
          <Input
            value={(draft[field.key] as string | undefined) ?? ""}
            onChange={(e) => update(field.key, e.target.value)}
            placeholder={field.placeholder ?? defaultName}
            type={field.key === "email" ? "email" : field.key === "bookUrl" ? "url" : "text"}
          />
        </label>
      ))}
      <label className="grid gap-1.5" htmlFor={`${id}-intro`}>
        <span className="text-label text-ink-muted">Line under the headline</span>
        <textarea
          id={`${id}-intro`}
          value={draft.intro ?? ""}
          onChange={(e) => update("intro", e.target.value)}
          placeholder="The template's own line"
          rows={3}
          className="w-full resize-y rounded-lg border border-line-strong bg-surface px-4 py-2.5 text-control text-ink placeholder:text-ink-muted"
        />
      </label>
      <HoursEditor
        value={hours}
        onChange={(next) => {
          setHours(next)
          setSavedAt(null)
        }}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          Save demo changes
        </Button>
        {savedAt && !saving && <span role="status" className="text-label text-ink-muted">Saved. Refresh the demo to see it.</span>}
      </div>
    </form>
  )
}
