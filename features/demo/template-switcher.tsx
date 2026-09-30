"use client"

import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { TEMPLATES, type TemplateId } from "@/templates"

// Lets the owner, or the prospect, flip between templates on a demo page.
// Viewing only: the links change the address, never the saved demo.
export function TemplateSwitcher({ current, hrefs }: { current: TemplateId; hrefs: Record<TemplateId, string> }) {
  const router = useRouter()
  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-white/70">Template</span>
      <span className="relative">
        <select
          value={current}
          onChange={(event) => router.replace(hrefs[event.target.value as TemplateId])}
          className="h-7 cursor-pointer appearance-none rounded-full border border-white/30 bg-transparent pr-7 pl-3 text-label text-white hover:border-white/60 [&>option]:text-ink"
        >
          {TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-white/70" />
      </span>
    </label>
  )
}
