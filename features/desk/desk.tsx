"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { LeadChange } from "@/domain/lead"
import { useLeads } from "@/data/use-leads"
import { useUpdateLead } from "@/data/use-update-lead"
import { activeVertical } from "@/verticals"
import { LeadDrawer } from "@/features/drawer/lead-drawer"
import { applyFilters } from "@/features/filters/apply-filters"
import { FilterRail } from "@/features/filters/filter-rail"
import { useFilters } from "@/features/filters/use-filters"
import { useKeys } from "@/features/keyboard/use-key"
import { LeadTable } from "@/features/table/lead-table"
import { useLeadTable } from "@/features/table/use-lead-table"
import { TopBar } from "./top-bar"

const EMPTY: never[] = []

function readLeadParam() {
  if (typeof window === "undefined") return null
  const value = Number(new URLSearchParams(window.location.search).get("lead"))
  return Number.isInteger(value) && value > 0 ? value : null
}

function writeLeadParam(id: number | null) {
  const url = new URL(window.location.href)
  if (id === null) url.searchParams.delete("lead")
  else url.searchParams.set("lead", String(id))
  window.history.replaceState(window.history.state, "", url)
}

export function Desk({ email }: { email: string | null }) {
  const vertical = activeVertical
  const leadsQuery = useLeads(vertical.id)
  const leads = leadsQuery.data ?? EMPTY
  const updateLead = useUpdateLead(vertical.id)
  const filtersApi = useFilters(vertical)
  const { filters, update } = filtersApi

  const [railOpen, setRailOpen] = useState(true)
  // The selected lead lives in the URL (?lead=123) so a refresh keeps it.
  // Safe to read on first render: nothing selected shows until leads load.
  const [selectedId, setSelectedId] = useState<number | null>(readLeadParam)
  const [saveError, setSaveError] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => applyFilters(leads, filters, vertical), [leads, filters, vertical])
  const table = useLeadTable(filtered)
  // The order on screen (filtered + sorted). J/K and auto-advance follow it.
  const orderedIds = table.getRowModel().rows.map((row) => row.original.id)

  const select = useCallback((id: number | null) => {
    setSelectedId(id)
    writeLeadParam(id)
  }, [])

  const selectedLead = selectedId === null ? null : (leads.find((l) => l.id === selectedId) ?? null)

  function move(step: 1 | -1) {
    if (orderedIds.length === 0) return
    const index = selectedId === null ? -1 : orderedIds.indexOf(selectedId)
    const next = index === -1 ? (step === 1 ? 0 : orderedIds.length - 1) : index + step
    if (next >= 0 && next < orderedIds.length) select(orderedIds[next])
  }

  function changeLead(change: LeadChange) {
    if (!selectedLead) return
    const lead = selectedLead
    setSaveError(null)

    // Review actions move on to the next lead in the list as it was before
    // the change (the reviewed lead may drop out of the current filter).
    if (change.kind === "review") {
      const index = orderedIds.indexOf(lead.id)
      const nextId = index === -1 ? null : (orderedIds[index + 1] ?? orderedIds[index - 1] ?? null)
      select(nextId)
    }

    updateLead.mutate(
      { leadId: lead.id, change, now: new Date().toISOString() },
      { onError: (error) => setSaveError(`${lead.name} wasn't saved. ${error.message}`) }
    )
  }

  useKeys({
    "/": () => searchRef.current?.focus(),
    j: () => move(1),
    k: () => move(-1),
    escape: () => select(null),
  })

  return (
    <div className="flex h-dvh flex-col gap-3 bg-surface p-3">
      <header className="rounded-xl bg-panel px-4 py-3">
        <TopBar
          vertical={vertical}
          email={email}
          search={filters.search}
          onSearchChange={(value) => update("search", value)}
          searchRef={searchRef}
          railOpen={railOpen}
          onToggleRail={() => setRailOpen((open) => !open)}
        />
      </header>

      <main className="flex min-h-0 flex-1 gap-3">
        {railOpen && (
          <div id="filter-rail" className="flex min-h-0 w-60 shrink-0">
            <FilterRail leads={leads} vertical={vertical} api={filtersApi} />
          </div>
        )}

        {leadsQuery.isPending ? (
          <Notice title={`Loading ${vertical.nouns.plural}`} />
        ) : leadsQuery.isError ? (
          <Notice
            title={`Couldn't load ${vertical.nouns.plural}`}
            body={leadsQuery.error.message}
            action={<Button variant="secondary" onClick={() => leadsQuery.refetch()}>Try again</Button>}
          />
        ) : leads.length === 0 ? (
          <Notice
            title={`No ${vertical.nouns.plural} yet`}
            body="The discovery workflow hasn't added any leads, or this account can't read them. Check the RLS read policy on leads."
          />
        ) : (
          <LeadTable
            table={table}
            totalCount={leads.length}
            vertical={vertical}
            selectedId={selectedId}
            onSelect={select}
            emptyState={
              <div className="grid justify-items-start gap-3">
                <p className="text-control">No {vertical.nouns.plural} match these filters.</p>
                <Button variant="secondary" size="sm" onClick={filtersApi.reset}>
                  Reset filters
                </Button>
              </div>
            }
          />
        )}

        {selectedLead && (
          <LeadDrawer
            lead={selectedLead}
            vertical={vertical}
            onClose={() => select(null)}
            onChange={changeLead}
            error={saveError}
            onDismissError={() => setSaveError(null)}
          />
        )}
      </main>
    </div>
  )
}

function Notice({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div role="status" className="grid flex-1 content-start justify-items-start gap-2 rounded-xl bg-panel p-6">
      <p className="text-heading">{title}</p>
      {body && <p className="max-w-prose text-ink-muted">{body}</p>}
      {action}
    </div>
  )
}
