"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import type { Lead, LeadChange } from "@/domain/lead"
import { reviewStatusLabel } from "@/domain/vocabularies"
import { normalizeWebsite } from "@/lib/url"
import { useKeys } from "@/features/keyboard/use-key"
import { DrawerCard } from "./drawer-card"
import { EntityOnlyForm } from "./entity-only-form"

type ReviewChange = Extract<LeadChange, { kind: "review" }>

/** What the card shows below the website field. */
type Mode = "actions" | "disqualify" | "entity_only"

// Keyed by lead id in the drawer, so its form state resets for each lead.
export function ReviewCard({
  lead,
  onReview,
  locked,
}: {
  lead: Lead
  onReview: (change: ReviewChange) => void
  /** True while a review action is being confirmed; nothing can be pressed. */
  locked: boolean
}) {
  const urlId = useId()
  const noteId = useId()
  const urlRef = useRef<HTMLInputElement>(null)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  // Unverified leads already have the site automation found: pre-fill it so
  // confirming is one keypress.
  const [url, setUrl] = useState(lead.website ?? "")
  const [urlError, setUrlError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>("actions")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (mode === "disqualify") noteRef.current?.focus()
  }, [mode])

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

  useKeys(
    {
      "1": markHasWebsite,
      "2": () => onReview({ kind: "review", review: "no_website" }),
      "3": () => setMode("disqualify"),
      "4": () => onReview({ kind: "review", review: "skipped" }),
      "5": () => setMode("entity_only"),
    },
    // Only while the buttons show: a number typed mid-form shouldn't act.
    !locked && mode === "actions"
  )

  return (
    <DrawerCard label="Review">
      <p className="text-ink-muted">
        Currently <span className="text-ink">{reviewStatusLabel[lead.reviewStatus].toLowerCase()}</span>
      </p>

      {mode !== "entity_only" && (
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
                if (!locked) markHasWebsite()
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
      )}

      {mode === "entity_only" ? (
        <EntityOnlyForm
          lead={lead}
          locked={locked}
          onCancel={() => setMode("actions")}
          onSave={(details) => onReview({ kind: "review", review: "entity_only", ...details })}
        />
      ) : mode === "disqualify" ? (
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
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey) && !locked) disqualify()
              if (event.key === "Escape") {
                event.preventDefault()
                setMode("actions")
              }
            }}
            className="w-full resize-none rounded-md border border-line-strong bg-surface px-3 py-2 text-control text-ink placeholder:text-ink-muted"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={disqualify} disabled={locked || !note.trim()}>
              Disqualify
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setMode("actions")}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={markHasWebsite} disabled={locked}>
            Has website <Kbd>1</Kbd>
          </Button>
          <Button size="sm" variant="secondary" disabled={locked} onClick={() => onReview({ kind: "review", review: "no_website" })}>
            No website <Kbd>2</Kbd>
          </Button>
          <Button size="sm" variant="secondary" disabled={locked} onClick={() => setMode("disqualify")}>
            Disqualify <Kbd>3</Kbd>
          </Button>
          <Button size="sm" variant="secondary" disabled={locked} onClick={() => onReview({ kind: "review", review: "skipped" })}>
            Skip <Kbd>4</Kbd>
          </Button>
          <Button size="sm" variant="secondary" disabled={locked} onClick={() => setMode("entity_only")}>
            Entity only <Kbd>5</Kbd>
          </Button>
        </div>
      )}
    </DrawerCard>
  )
}
