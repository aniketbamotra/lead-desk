"use client"

import type { WeekHours } from "@/templates/_shared/content"
import { cn } from "@/lib/utils"

const DAYS = [
  { index: 1, label: "Mon" },
  { index: 2, label: "Tue" },
  { index: 3, label: "Wed" },
  { index: 4, label: "Thu" },
  { index: 5, label: "Fri" },
  { index: 6, label: "Sat" },
  { index: 0, label: "Sun" },
]

const timeInput =
  "h-8 w-[104px] rounded-full border border-line-strong bg-surface px-3 text-body text-ink tnum disabled:opacity-40"

// Opening hours, one row per day, Monday first. Unticked means closed.
export function HoursEditor({ value, onChange }: { value: WeekHours; onChange: (next: WeekHours) => void }) {
  function set(index: number, day: WeekHours[number]) {
    const next = [...value] as WeekHours
    next[index] = day
    onChange(next)
  }

  return (
    <fieldset className="grid gap-1.5">
      <legend className="mb-1.5 text-label text-ink-muted">Opening hours</legend>
      {DAYS.map(({ index, label }) => {
        const day = value[index]
        return (
          <div key={index} className="flex items-center gap-2">
            <label className="flex w-16 cursor-pointer items-center gap-2 text-body">
              <input
                type="checkbox"
                checked={day !== null}
                onChange={(e) => set(index, e.target.checked ? { open: "08:00", close: "17:00" } : null)}
                className="size-4 accent-ink"
              />
              {label}
            </label>
            <input
              type="time"
              aria-label={`${label} opens`}
              value={day?.open ?? ""}
              disabled={!day}
              onChange={(e) => day && set(index, { ...day, open: e.target.value })}
              className={timeInput}
            />
            <span className={cn("text-label text-ink-muted", !day && "opacity-40")}>to</span>
            <input
              type="time"
              aria-label={`${label} closes`}
              value={day?.close ?? ""}
              disabled={!day}
              onChange={(e) => day && set(index, { ...day, close: e.target.value })}
              className={timeInput}
            />
          </div>
        )
      })}
    </fieldset>
  )
}
