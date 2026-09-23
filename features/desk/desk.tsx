"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { reviewSnapshot, type Lead, type LeadChange, type ReviewSnapshot } from "@/domain/lead"
import { reviewStatusLabel } from "@/domain/vocabularies"
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
import { UndoBar } from "./undo-bar"
import { ShortcutsDialog } from "@/features/keyboard/shortcuts-dialog"

const EMPTY: never[] = []

// How long the drawer shows "Has website" (etc.) before moving on. Long
// enough to see, short enough not to slow a fast session. J skips it.
const CONFIRM_MS = 700

type LastReview = { leadId: number; name: string; label: string; before: ReviewSnapshot }

function leadFromQuery(query: string) {
  const value = Number(new URLSearchParams(query).get("lead"))
  return Number.isInteger(value) && value > 0 ? value : null
}

function writeLeadParam(id: number | null) {
  const url = new URL(window.location.href)
  if (id === null) url.searchParams.delete("lead")
  else url.searchParams.set("lead", String(id))
  window.history.replaceState(window.history.state, "", url)
}

export function Desk({ email, initialQuery }: { email: string | null; initialQuery: string }) {
  const vertical = activeVertical
  const leadsQuery = useLeads(vertical.id)
  const leads = leadsQuery.data ?? EMPTY
  const updateLead = useUpdateLead(vertical.id)
  const filtersApi = useFilters(vertical, initialQuery)
  const { filters, update } = filtersApi

  const [railOpen, setRailOpen] = useState(true)
  // The selected lead lives in the URL (?lead=123) so a refresh keeps it.
  const [selectedId, setSelectedId] = useState<number | null>(() => leadFromQuery(initialQuery))
  const [saveError, setSaveError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const [lastReview, setLastReview] = useState<LastReview | null>(null)
  const [flash, setFlash] = useState<{ id: number; n: number } | null>(null)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const advanceTimer = useRef<number | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => {
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current)
  }, [])

  const filtered = useMemo(() => applyFilters(leads, filters, vertical), [leads, filters, vertical])
  const table = useLeadTable(filtered)
  // The order on screen (filtered + sorted). J/K and auto-advance follow it.
  const orderedIds = table.getRowModel().rows.map((row) => row.original.id)

  const select = useCallback((id: number | null) => {
    // Any navigation cancels a pending auto-advance.
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
    setConfirmation(null)
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

  function save(lead: Lead, change: LeadChange) {
    setSaveError(null)
    setFlash((current) => ({ id: lead.id, n: (current?.n ?? 0) + 1 }))
    updateLead.mutate(
      { leadId: lead.id, change, now: new Date().toISOString() },
      { onError: (error) => setSaveError(`${lead.name} wasn't saved. ${error.message}`) }
    )
  }

  function changeLead(change: LeadChange) {
    if (!selectedLead || confirmation !== null) return
    const lead = selectedLead
    save(lead, change)
    if (change.kind !== "review") return

    // Show what happened, then move on to the next lead in the list as it
    // was before the change (the reviewed lead may drop out of the filter).
    const label = reviewStatusLabel[change.review]
    setConfirmation(label)
    setLastReview({ leadId: lead.id, name: lead.name, label, before: reviewSnapshot(lead) })
    const index = orderedIds.indexOf(lead.id)
    const nextId = index === -1 ? null : (orderedIds[index + 1] ?? orderedIds[index - 1] ?? null)
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null
      select(nextId)
    }, CONFIRM_MS)
  }

  function undo() {
    if (!lastReview) return
    const lead = leads.find((l) => l.id === lastReview.leadId)
    setLastReview(null)
    if (!lead) return
    save(lead, { kind: "restore", snapshot: lastReview.before })
    select(lead.id)
  }

  useKeys({
    "/": () => searchRef.current?.focus(),
    j: () => move(1),
    k: () => move(-1),
    z: undo,
    "?": () => setShortcutsOpen(true),
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
          onShowShortcuts={() => setShortcutsOpen(true)}
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
            flash={flash}
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
            confirmation={confirmation}
          />
        )}
      </main>

      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />

      {lastReview && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
          <UndoBar
            key={lastReview.leadId}
            message={`${lastReview.name}: ${lastReview.label}`}
            onUndo={undo}
            onDismiss={() => setLastReview(null)}
          />
        </div>
      )}
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
