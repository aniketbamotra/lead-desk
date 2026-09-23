"use client"

import { useId } from "react"
import { ChevronDown } from "lucide-react"
import { STAGES, type Stage } from "@/domain/lead"
import { stageLabel } from "@/domain/vocabularies"
import { DrawerCard } from "./drawer-card"

// Native select: keyboard and screen-reader behaviour for free, styled as a pill.
export function StageCard({ stage, onChange }: { stage: Stage; onChange: (stage: Stage) => void }) {
  const id = useId()
  return (
    <DrawerCard className="flex items-center justify-between">
      <label htmlFor={id} className="text-label text-ink-muted">
        Stage
      </label>
      <span className="relative">
        <select
          id={id}
          value={stage}
          onChange={(event) => onChange(event.target.value as Stage)}
          className="h-8 cursor-pointer appearance-none rounded-full border border-line bg-surface pr-8 pl-3.5 text-body text-ink hover:border-line-strong"
        >
          {STAGES.map((option) => (
            <option key={option} value={option}>
              {stageLabel[option]}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-ink-muted" />
      </span>
    </DrawerCard>
  )
}
