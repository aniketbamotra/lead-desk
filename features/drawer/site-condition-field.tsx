"use client"

import { useId, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Kbd } from "@/components/ui/kbd"
import { SITE_CONDITIONS, isSiteCondition, type SiteCondition } from "@/domain/site-condition"
import { useKeys } from "@/features/keyboard/use-key"

type Props = {
  value: SiteCondition | null
  onChange: (condition: SiteCondition | null) => void
  disabled: boolean
}

// How the lead's website looks, judged by a person. Saving it doesn't move
// to the next lead, so the site can be assessed before pressing 1.
export function SiteConditionField({ value, onChange, disabled }: Props) {
  const id = useId()
  const ref = useRef<HTMLSelectElement>(null)

  useKeys({ s: () => ref.current?.focus() }, !disabled)

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="flex items-center justify-between text-label text-ink-muted">
        Site condition
        <Kbd aria-hidden>S</Kbd>
      </label>
      <span className="relative">
        <select
          ref={ref}
          id={id}
          value={value ?? ""}
          disabled={disabled}
          onChange={(event) => onChange(isSiteCondition(event.target.value) ? event.target.value : null)}
          className="h-10 w-full cursor-pointer appearance-none rounded-full border border-line-strong bg-surface pr-9 pl-4 text-control text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Not assessed</option>
          {SITE_CONDITIONS.map((condition) => (
            <option key={condition.key} value={condition.key}>
              {condition.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-ink-muted" />
      </span>
    </div>
  )
}
