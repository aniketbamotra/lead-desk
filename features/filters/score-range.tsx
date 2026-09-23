"use client"

import { useId } from "react"

type Props = {
  min: number | null
  max: number | null
  /** Lowest and highest scores in the data, shown as placeholders. */
  bounds: { min: number; max: number } | null
  onChange: (min: number | null, max: number | null) => void
}

function parse(value: string) {
  if (value.trim() === "") return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function ScoreRange({ min, max, bounds, onChange }: Props) {
  const minId = useId()
  const maxId = useId()
  const field =
    "tnum h-8 w-full min-w-0 rounded-full border border-line-strong bg-surface px-3 text-body text-ink placeholder:text-ink-muted"

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-2">
        <label htmlFor={minId} className="sr-only">
          Minimum score
        </label>
        <input
          id={minId}
          type="number"
          inputMode="numeric"
          className={field}
          placeholder="Min"
          value={min ?? ""}
          onChange={(event) => onChange(parse(event.target.value), max)}
        />
        <span aria-hidden className="text-ink-muted">
          to
        </span>
        <label htmlFor={maxId} className="sr-only">
          Maximum score
        </label>
        <input
          id={maxId}
          type="number"
          inputMode="numeric"
          className={field}
          placeholder="Max"
          value={max ?? ""}
          onChange={(event) => onChange(min, parse(event.target.value))}
        />
      </div>
      {bounds && (
        <p className="tnum text-label text-ink-muted">
          Scores run from {bounds.min} to {bounds.max}
        </p>
      )}
    </div>
  )
}
