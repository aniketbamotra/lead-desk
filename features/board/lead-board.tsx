"use client"

import { useEffect, useState } from "react"
import { PossibleName } from "@/components/ui/possible-name"
import { StatusMark } from "@/components/ui/status-mark"
import { STAGES, type Lead, type Stage } from "@/domain/lead"
import { stageLabel } from "@/domain/vocabularies"
import { formatShortDay, todayISO } from "@/lib/dates"
import { formatCount, formatPlace } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { VerticalConfig } from "@/verticals/types"
import { ListHeader } from "@/features/desk/list-header"

// Cards per column before "Show more". Keeps a 900-lead "New" column fast.
const PAGE = 50

type Props = {
  /** Filtered and sorted, in the same order as the table. */
  leads: Lead[]
  totalCount: number
  vertical: VerticalConfig
  selectedId: number | null
  onSelect: (id: number) => void
  flash: { id: number; n: number } | null
  actions?: React.ReactNode
  emptyState: React.ReactNode
}

// The pipeline by stage. Moving a lead between stages happens in the drawer's
// stage select, so there's no drag and drop.
export function LeadBoard({ leads, totalCount, vertical, selectedId, onSelect, flash, actions, emptyState }: Props) {
  const [limits, setLimits] = useState<Partial<Record<Stage, number>>>({})

  const byStage = new Map<Stage, Lead[]>(STAGES.map((stage) => [stage, []]))
  for (const lead of leads) byStage.get(lead.stage)?.push(lead)

  useEffect(() => {
    if (selectedId === null) return
    document.querySelector(`[data-lead-id="${selectedId}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [selectedId])

  return (
    <section aria-labelledby="lead-board-title" className="flex min-h-0 min-w-0 flex-1 flex-col rounded-xl bg-panel p-2">
      <ListHeader id="lead-board-title" vertical={vertical} shown={leads.length} total={totalCount} actions={actions} />

      {leads.length === 0 ? (
        <div className="px-3 py-10">{emptyState}</div>
      ) : (
        <div className="grid min-h-0 flex-1 auto-cols-[260px] grid-flow-col gap-2 overflow-x-auto">
          {STAGES.map((stage) => {
            const column = byStage.get(stage) ?? []
            const limit = limits[stage] ?? PAGE
            return (
              <section key={stage} aria-label={stageLabel[stage]} className="flex min-h-0 flex-col rounded-lg bg-surface/50">
                <h3 className="flex items-baseline gap-2 px-3 pt-3 pb-2">
                  <span>{stageLabel[stage]}</span>
                  <span className="tnum text-label text-ink-muted">{formatCount(column.length)}</span>
                </h3>
                <ol className="grid min-h-0 flex-1 content-start gap-1.5 overflow-y-auto px-1.5 pb-1.5">
                  {column.slice(0, limit).map((lead) => (
                    <li key={flash?.id === lead.id ? `${lead.id}-${flash.n}` : lead.id}>
                      <BoardCard
                        lead={lead}
                        selected={lead.id === selectedId}
                        flashing={flash?.id === lead.id}
                        onSelect={() => onSelect(lead.id)}
                      />
                    </li>
                  ))}
                  {column.length > limit && (
                    <li>
                      <button
                        type="button"
                        onClick={() => setLimits((current) => ({ ...current, [stage]: limit + PAGE }))}
                        className="w-full rounded-md px-3 py-2 text-left text-ink-muted hover:bg-surface hover:text-ink"
                      >
                        Show {formatCount(Math.min(PAGE, column.length - limit))} more
                      </button>
                    </li>
                  )}
                  {column.length === 0 && <li className="px-3 py-2 text-ink-muted">None</li>}
                </ol>
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}

function BoardCard({
  lead,
  selected,
  flashing,
  onSelect,
}: {
  lead: Lead
  selected: boolean
  flashing: boolean
  onSelect: () => void
}) {
  const followUp = lead.nextFollowUp
  const due = followUp !== null && followUp <= todayISO()
  return (
    <button
      type="button"
      data-lead-id={lead.id}
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "grid w-full gap-1.5 rounded-md border bg-surface px-3 py-2.5 text-left",
        selected ? "border-ink" : "border-transparent hover:border-line-strong",
        flashing && "animate-flash"
      )}
    >
      <span className="grid min-w-0">
        <span className={cn("truncate", selected && "font-medium")}>{lead.name}</span>
        {lead.possibleTradingName ? (
          <PossibleName name={lead.possibleTradingName} className="truncate text-label text-ink-muted" />
        ) : (
          <span className="truncate text-label text-ink-muted">{lead.tradingName ?? formatPlace(lead) ?? "–"}</span>
        )}
      </span>
      <span className="flex items-center justify-between gap-2 text-label">
        <StatusMark status={lead.websiteStatus} />
        <span className="flex items-center gap-2">
          {followUp && (
            <span className={cn("tnum", due ? "text-coral" : "text-ink-muted")}>
              {due ? "Due" : "Follow up"} {formatShortDay(followUp)}
            </span>
          )}
          <span className="tnum text-ink-muted">{lead.score ?? "–"}</span>
        </span>
      </span>
    </button>
  )
}
