"use client"

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import type { Lead } from "@/domain/lead"
import type { VerticalConfig } from "@/verticals/types"
import { ListHeader } from "@/features/desk/list-header"
import { PossibleName } from "@/components/ui/possible-name"
import { LocalTimeCell } from "./local-time-cell"
import type { LeadTableInstance } from "./use-lead-table"

const RIGHT_ALIGNED = new Set(["score"])

// Fixed column widths (table-layout: fixed). Contact, the last column, has no
// width so it takes any leftover space; long business names truncate.
const COLUMN_WIDTHS: Record<string, number | undefined> = {
  business: 300,
  place: 180,
  phone: 128,
  localTime: 124,
  website: 124,
  site: 132,
  reviewStatus: 116,
  stage: 108,
  score: 72,
}

// Cell padding per column. The first column leaves room for the selection
// dot inside its padding, so names line up with the "Business" header.
function cellPadding(columnId: string) {
  if (columnId === "business") return "pl-7 pr-2.5"
  if (columnId === "contact") return "pl-8 pr-3.5"
  return "px-2.5"
}

type Props = {
  /** Built by the desk, which also needs the sorted order for J/K. */
  table: LeadTableInstance
  totalCount: number
  vertical: VerticalConfig
  selectedId: number | null
  onSelect: (id: number) => void
  /** A row whose status just changed, with a counter so repeats replay. */
  flash: { id: number; n: number } | null
  /** Shown instead of rows when the filters match nothing. */
  emptyState: React.ReactNode
  /** Controls on the right of the table header (due filter, view switch). */
  actions?: React.ReactNode
}

export function LeadTable({ table, totalCount, vertical, selectedId, onSelect, flash, emptyState, actions }: Props) {
  const rows = table.getRowModel().rows

  // Keep the selected row visible when J/K moves past the edge.
  useEffect(() => {
    if (selectedId === null) return
    document.querySelector(`[data-lead-id="${selectedId}"]`)?.scrollIntoView({ block: "nearest" })
  }, [selectedId])

  return (
    <section aria-labelledby="lead-table-title" className="flex min-h-0 min-w-0 flex-1 flex-col rounded-xl bg-panel p-2">
      <ListHeader id="lead-table-title" vertical={vertical} shown={rows.length} total={totalCount} actions={actions} />

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[1464px] table-fixed border-separate border-spacing-y-0.5">
          <colgroup>
            {table.getAllLeafColumns().map((column) => (
              <col key={column.id} style={{ width: COLUMN_WIDTHS[column.id] }} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-10 bg-panel">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const sorted = header.column.getIsSorted()
                  const canSort = header.column.getCanSort()
                  const align = RIGHT_ALIGNED.has(header.column.id) ? "text-right" : "text-left"
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                      className={cn("py-1.5 text-label font-normal whitespace-nowrap text-ink-muted", cellPadding(header.column.id), align)}
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn("group/sort inline-flex items-center gap-1 rounded-sm hover:text-ink", sorted && "text-ink")}
                        >
                          <table.FlexRender header={header} />
                          {sorted === "asc" && <ChevronUp aria-hidden className="size-3" />}
                          {sorted === "desc" && <ChevronDown aria-hidden className="size-3" />}
                          {!sorted && (
                            <ChevronsUpDown
                              aria-hidden
                              className="size-3 opacity-0 transition-opacity group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100"
                            />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row) => {
              const lead = row.original
              const selected = lead.id === selectedId
              const flashing = flash?.id === lead.id
              return (
                <tr
                  // Changing the key replays the flash if the same row changes twice.
                  key={flashing ? `${row.id}-${flash.n}` : row.id}
                  data-lead-id={lead.id}
                  aria-selected={selected}
                  onClick={() => onSelect(lead.id)}
                  className={cn(
                    "group/row cursor-pointer",
                    selected ? "bg-surface" : "hover:bg-surface/60",
                    flashing && "animate-row-flash"
                  )}
                >
                  {row.getAllCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "relative h-12 truncate align-middle whitespace-nowrap first:rounded-l-md last:rounded-r-md",
                        cellPadding(cell.column.id),
                        RIGHT_ALIGNED.has(cell.column.id) && "text-right"
                      )}
                    >
                      {cell.column.id === "business" ? (
                        <BusinessCell lead={lead} selected={selected} onSelect={() => onSelect(lead.id)} />
                      ) : cell.column.id === "localTime" ? (
                        <LocalTimeCell timeZone={lead.timeZone} callingHours={vertical.callingHours} />
                      ) : (
                        <table.FlexRender cell={cell} />
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 && <div className="px-3 py-10">{emptyState}</div>}
      </div>
    </section>
  )
}

function BusinessCell({ lead, selected, onSelect }: { lead: Lead; selected: boolean; onSelect: () => void }) {
  return (
    <>
      {selected && (
        <span aria-hidden className="absolute top-1/2 left-3 size-1.5 -translate-y-1/2 rounded-full bg-coral-bright" />
      )}
      <span className="grid min-w-0">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onSelect()
          }}
          className={cn("truncate rounded-sm text-left", selected && "font-medium")}
        >
          {lead.name}
        </button>
        {lead.possibleTradingName ? (
          <PossibleName name={lead.possibleTradingName} className="truncate text-label text-ink-muted" />
        ) : (
          lead.tradingName && <span className="truncate text-label text-ink-muted">{lead.tradingName}</span>
        )}
      </span>
    </>
  )
}
