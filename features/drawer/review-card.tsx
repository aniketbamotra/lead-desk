"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import type { Lead, LeadChange } from "@/domain/lead"
import { reviewStatusLabel } from "@/domain/vocabularies"
import { normalizeWebsite } from "@/lib/url"
import { useKeys } from "@/features/keyboard/use-key"
import { DrawerCard } from "./drawer-card"

type ReviewChange = Extract<LeadChange, { kind: "review" }>

// Keyed by lead id in the drawer, so its form state resets for each lead.
export function ReviewCard({ lead, onReview }: { lead: Lead; onReview: (change: ReviewChange) => void }) {
  const urlId = useId()
  const noteId = useId()
  const urlRef = useRef<HTMLInputElement>(null)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  // Unverified leads already have the site automation found: pre-fill it so
  // confirming is one keypress.
  const [url, setUrl] = useState(lead.website ?? "")
  const [urlError, setUrlError] = useState<string | null>(null)
  const [disqualifying, setDisqualifying] = useState(false)
  const [note, setNote] = useState("")

  useEffect(() => {
    if (disqualifying) noteRef.current?.focus()
  }, [disqualifying])

  function markHasWebsite() {
    const website = normalizeWebsite(url)
    if (!website) {
      setUrlError(url.trim() ? "That doesn't look like a web address." : "Paste the website first.")
      urlRef.current?.focus()
      return
    }
    onReview({ kind: "review", review: "has_website", website })
  }

  function disqualify() {
    if (!note.trim()) {
      noteRef.current?.focus()
      return
    }
    onReview({ kind: "review", review: "disqualified", note: note.trim() })
  }

  useKeys({
    "1": markHasWebsite,
    "2": () => onReview({ kind: "review", review: "no_website" }),
    "3": () => setDisqualifying(true),
    "4": () => onReview({ kind: "review", review: "skipped" }),
  })

  return (
    <DrawerCard label="Review">
      <p className="text-ink-muted">
        Currently <span className="text-ink">{reviewStatusLabel[lead.reviewStatus].toLowerCase()}</span>
      </p>

      <div className="grid gap-1.5">
        <label htmlFor={urlId} className="text-label text-ink-muted">
          Website
        </label>
        <input
          ref={urlRef}
          id={urlId}
          type="url"
          inputMode="url"
          placeholder="Paste the practice's website"
          value={url}
          aria-invalid={Boolean(urlError)}
          aria-describedby={urlError ? `${urlId}-error` : undefined}
          onChange={(event) => {
            setUrl(event.target.value)
            setUrlError(null)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              markHasWebsite()
            }
            if (event.key === "Escape") event.currentTarget.blur()
          }}
          className="h-10 w-full rounded-full border border-line-strong bg-surface px-4 text-control text-ink placeholder:text-ink-muted"
        />
        {urlError && (
          <p id={`${urlId}-error`} className="text-coral" role="alert">
            {urlError}
          </p>
        )}
      </div>

      {disqualifying ? (
        <div className="grid gap-2">
          <label htmlFor={noteId} className="text-label text-ink-muted">
            Why disqualify it?
          </label>
          <textarea
            ref={noteRef}
            id={noteId}
            rows={2}
            value={note}
            placeholder="Part of a group, closed, not a fit…"
            onChange={(event) => setNote(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) disqualify()
              if (event.key === "Escape") {
                event.preventDefault()
                setDisqualifying(false)
              }
            }}
            className="w-full resize-none rounded-md border border-line-strong bg-surface px-3 py-2 text-control text-ink placeholder:text-ink-muted"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={disqualify} disabled={!note.trim()}>
              Disqualify
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setDisqualifying(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={markHasWebsite}>
            Has website <Kbd>1</Kbd>
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onReview({ kind: "review", review: "no_website" })}>
            No website <Kbd>2</Kbd>
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setDisqualifying(true)}>
            Disqualify <Kbd>3</Kbd>
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onReview({ kind: "review", review: "skipped" })}>
            Skip <Kbd>4</Kbd>
          </Button>
        </div>
      )}
    </DrawerCard>
  )
}
