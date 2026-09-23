"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Lead } from "@/domain/lead"
import { normalizeWebsite } from "@/lib/url"

export type EntityOnlyDetails = {
  possibleTradingName: string | null
  possibleWebsite: string | null
  note: string | null
}

type Props = {
  lead: Lead
  locked: boolean
  onSave: (details: EntityOnlyDetails) => void
  onCancel: () => void
}

const field =
  "h-10 w-full rounded-full border border-line-strong bg-surface px-4 text-control text-ink placeholder:text-ink-muted"

// Entity only: the registered name has no web presence and the practice may
// trade under another name. Everything here is optional and pre-filled with
// what's already saved, so saving never wipes earlier notes.
export function EntityOnlyForm({ lead, locked, onSave, onCancel }: Props) {
  const nameId = useId()
  const siteId = useId()
  const noteId = useId()
  const nameRef = useRef<HTMLInputElement>(null)
  const siteRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(lead.possibleTradingName ?? "")
  const [site, setSite] = useState(lead.possibleWebsite ?? "")
  const [note, setNote] = useState(lead.reviewNotes ?? "")
  const [siteError, setSiteError] = useState<string | null>(null)

  useEffect(() => nameRef.current?.focus(), [])

  function save() {
    if (locked) return
    let possibleWebsite: string | null = null
    if (site.trim()) {
      possibleWebsite = normalizeWebsite(site)
      if (!possibleWebsite) {
        setSiteError("That doesn't look like a web address. Leave it empty if there isn't one.")
        siteRef.current?.focus()
        return
      }
    }
    onSave({ possibleTradingName: name.trim() || null, possibleWebsite, note: note.trim() || null })
  }

  return (
    <div
      className="grid gap-3"
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
      <p className="text-ink-muted">
        No web presence under the registered name. Call to hear the name they answer with.
      </p>

      <div className="grid gap-1.5">
        <label htmlFor={nameId} className="text-label text-ink-muted">
          Trading name seen at this address (optional)
        </label>
        <input
          ref={nameRef}
          id={nameId}
          value={name}
          placeholder="e.g. from Google Maps or a sign"
          onChange={(event) => setName(event.target.value)}
          className={field}
        />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor={siteId} className="text-label text-ink-muted">
          Their website, if found (optional)
        </label>
        <input
          ref={siteRef}
          id={siteId}
          type="url"
          inputMode="url"
          value={site}
          aria-invalid={Boolean(siteError)}
          aria-describedby={siteError ? `${siteId}-error` : undefined}
          onChange={(event) => {
            setSite(event.target.value)
            setSiteError(null)
          }}
          className={field}
        />
        {siteError && (
          <p id={`${siteId}-error`} className="text-coral" role="alert">
            {siteError}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label htmlFor={noteId} className="text-label text-ink-muted">
          Notes
        </label>
        <textarea
          id={noteId}
          rows={2}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="w-full resize-none rounded-md border border-line-strong bg-surface px-3 py-2 text-control text-ink placeholder:text-ink-muted"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={save} disabled={locked}>
          Mark as entity only
        </Button>
        <Button size="sm" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
