"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { CALL_OUTCOMES, type CallOutcome } from "@/domain/activity"
import { callOutcomeLabel } from "@/domain/vocabularies"
import { addDaysISO, nextWeekISO } from "@/lib/dates"

export type LoggedCall = { outcome: CallOutcome; note: string | null; followUp: string | null }

const QUICK_FOLLOW_UPS = [
  { label: "Tomorrow", date: () => addDaysISO(1) },
  { label: "In 3 days", date: () => addDaysISO(3) },
  { label: "Next week", date: nextWeekISO },
]

type Props = {
  /** The lead's current follow-up date, kept unless changed. */
  currentFollowUp: string | null
  onSave: (call: LoggedCall) => void
  onCancel: () => void
}

export function LogCallForm({ currentFollowUp, onSave, onCancel }: Props) {
  const noteId = useId()
  const dateId = useId()
  const firstOutcome = useRef<HTMLButtonElement>(null)
  const [outcome, setOutcome] = useState<CallOutcome | null>(null)
  const [note, setNote] = useState("")
  const [followUp, setFollowUp] = useState<string | null>(currentFollowUp)

  useEffect(() => firstOutcome.current?.focus(), [])

  function save() {
    if (!outcome) return
    onSave({ outcome, note: note.trim() || null, followUp })
  }

  return (
    <div
      className="grid gap-4 border-t border-line pt-4"
      onKeyDown={(event) => {
        // Handled here so Esc cancels the form instead of closing the drawer.
        if (event.key === "Escape") {
          event.preventDefault()
          onCancel()
        }
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault()
          save()
        }
      }}
    >
      <div role="group" aria-label="Outcome" className="grid gap-2">
        <span className="text-label text-ink-muted">Outcome</span>
        <div className="flex flex-wrap gap-1.5">
          {CALL_OUTCOMES.map((option, index) => (
            <Chip
              key={option}
              ref={index === 0 ? firstOutcome : undefined}
              pressed={outcome === option}
              onClick={() => setOutcome(option)}
            >
              {callOutcomeLabel[option]}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor={noteId} className="text-label text-ink-muted">
          Note
        </label>
        <textarea
          id={noteId}
          rows={2}
          value={note}
          placeholder="Who you spoke to, what they said"
          onChange={(event) => setNote(event.target.value)}
          className="w-full resize-none rounded-md border border-line-strong bg-surface px-3 py-2 text-control text-ink placeholder:text-ink-muted"
        />
      </div>

      <div role="group" aria-label="Follow up" className="grid gap-2">
        <span className="text-label text-ink-muted">Follow up</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip pressed={followUp === null} onClick={() => setFollowUp(null)}>
            None
          </Chip>
          {QUICK_FOLLOW_UPS.map((option) => {
            const date = option.date()
            return (
              <Chip key={option.label} pressed={followUp === date} onClick={() => setFollowUp(date)}>
                {option.label}
              </Chip>
            )
          })}
          <label htmlFor={dateId} className="sr-only">
            Follow-up date
          </label>
          <input
            id={dateId}
            type="date"
            value={followUp ?? ""}
            onChange={(event) => setFollowUp(event.target.value || null)}
            className="tnum h-8 rounded-full border border-line-strong bg-surface px-3 text-body text-ink"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={save} disabled={!outcome}>
          Log call
        </Button>
        <Button size="sm" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        {!outcome && <span className="text-label text-ink-muted">Choose an outcome first</span>}
      </div>
    </div>
  )
}
