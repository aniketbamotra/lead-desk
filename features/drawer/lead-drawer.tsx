"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import type { Lead, LeadChange, Stage } from "@/domain/lead"
import type { VerticalConfig } from "@/verticals/types"
import { CallCard } from "./call-card"
import { DetailsCard } from "./details-card"
import { ResearchCard } from "./research-card"
import { ResizeHandle } from "./resize-handle"
import { ReviewCard } from "./review-card"
import { StageCard } from "./stage-card"

const MIN_WIDTH = 360
const MAX_WIDTH = 640
const DEFAULT_WIDTH = 400
const WIDTH_KEY = "lead-desk:drawer-width"

function readWidth() {
  if (typeof window === "undefined") return DEFAULT_WIDTH
  try {
    const stored = Number(window.localStorage.getItem(WIDTH_KEY))
    return stored >= MIN_WIDTH && stored <= MAX_WIDTH ? stored : DEFAULT_WIDTH
  } catch {
    return DEFAULT_WIDTH
  }
}

type Props = {
  lead: Lead
  vertical: VerticalConfig
  onClose: () => void
  onChange: (change: LeadChange) => void
  /** Shown at the top when the last save failed. */
  error: string | null
  onDismissError: () => void
  /**
   * Set for a moment after a review action, before moving to the next lead.
   * Review actions are locked meanwhile so a second press can't land on the
   * next lead.
   */
  confirmation: string | null
}

// Opens beside the table. Cards in the order the owner works through them:
// identity, call, research, review, stage, then reference details.
export function LeadDrawer({ lead, vertical, onClose, onChange, error, onDismissError, confirmation }: Props) {
  // The drawer only renders in the browser (after leads load), so reading
  // localStorage during the first render can't cause a hydration mismatch.
  const [width, setWidth] = useState(readWidth)

  function resize(next: number) {
    setWidth(next)
    try {
      window.localStorage.setItem(WIDTH_KEY, String(next))
    } catch {
      // Width just won't be remembered.
    }
  }

  return (
    <aside
      aria-label={`${lead.name} details`}
      style={{ width }}
      className="relative flex min-h-0 shrink-0 flex-col rounded-xl bg-panel duration-150 animate-in fade-in-0 slide-in-from-right-4"
    >
      <ResizeHandle width={width} min={MIN_WIDTH} max={MAX_WIDTH} onResize={resize} />

      {/* Keyed by lead so a switch to another lead fades in visibly. */}
      <div key={lead.id} className="flex min-h-0 flex-1 flex-col duration-200 animate-in fade-in-0 slide-in-from-bottom-1">
        <div className="flex items-start gap-3 px-4 pt-4 pb-3">
          <div className="grid min-w-0 flex-1 gap-0.5">
            <h2 className="text-title font-normal tracking-[-0.01em] text-balance">{lead.name}</h2>
            {lead.tradingName && <p className="text-ink-muted">Trading as {lead.tradingName}</p>}
            <p className="flex items-center gap-1.5 pt-1 text-label text-ink-muted">
              <Kbd>J</Kbd>
              <Kbd>K</Kbd>
              next and previous
            </p>
          </div>
          <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close details" title="Close (Esc)">
            <X aria-hidden className="size-4" />
          </Button>
        </div>

        {confirmation && (
          <div
            role="status"
            className="mx-2 mb-2 flex items-center gap-2.5 rounded-lg bg-ink px-4 py-3 text-control text-white duration-100 animate-in fade-in-0"
          >
            <Check aria-hidden className="size-4 shrink-0" />
            <span className="flex-1">{confirmation}</span>
            <span className="flex items-center gap-1.5 text-label text-white/70">
              Next lead
              <Kbd className="bg-white/20 text-white">J</Kbd>
            </span>
          </div>
        )}

        {error && (
          <div role="alert" className="mx-2 mb-2 flex items-start gap-3 rounded-lg bg-coral-tint px-4 py-3 text-coral">
            <p className="flex-1">{error}</p>
            <button type="button" onClick={onDismissError} className="text-label underline underline-offset-2">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid min-h-0 flex-1 content-start gap-2 overflow-y-auto px-2 pb-2">
          <CallCard key={`call-${lead.id}`} lead={lead} />
          <ResearchCard lead={lead} vertical={vertical} />
          <ReviewCard key={`review-${lead.id}`} lead={lead} onReview={onChange} locked={confirmation !== null} />
          <StageCard stage={lead.stage} onChange={(stage: Stage) => onChange({ kind: "stage", stage })} />
          <DetailsCard lead={lead} vertical={vertical} />
        </div>
      </div>
    </aside>
  )
}
