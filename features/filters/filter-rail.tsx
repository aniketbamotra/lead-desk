"use client"

import { useId, useMemo } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { REVIEW_STATUSES, STAGES, WEBSITE_STATUSES, type Lead } from "@/domain/lead"
import { reviewStatusLabel, stageLabel, websiteStatusLabel } from "@/domain/vocabularies"
import type { VerticalConfig } from "@/verticals/types"
import { facet } from "./apply-filters"
import { ChipSelect } from "./chip-select"
import { FilterGroup } from "./filter-group"
import type { WebsiteFilterValue } from "./filters"
import { OptionPicker } from "./option-picker"
import { ScoreRange } from "./score-range"
import type { FiltersApi } from "./use-filters"

const WEBSITE_OPTIONS: readonly WebsiteFilterValue[] = [...WEBSITE_STATUSES, "unchecked"]

type Props = {
  leads: Lead[]
  vertical: VerticalConfig
  api: FiltersApi
}

export function FilterRail({ leads, vertical, api }: Props) {
  const { filters, update, setToggle, setOption, reset, isDefault } = api

  const states = useMemo(() => facet(leads, (l) => l.address.state), [leads])
  const cities = useMemo(
    () =>
      facet(
        filters.states.length
          ? leads.filter((l) => filters.states.includes(l.address.state ?? ""))
          : leads,
        (l) => l.address.city
      ),
    [leads, filters.states]
  )
  const scoreBounds = useMemo(() => {
    const scores = leads.map((l) => l.score).filter((s): s is number => s !== null)
    return scores.length ? { min: Math.min(...scores), max: Math.max(...scores) } : null
  }, [leads])

  return (
    <aside aria-label="Filters" className="flex min-h-0 w-full flex-col gap-5 overflow-y-auto rounded-xl bg-panel p-4">
      <div className="flex h-8 items-center justify-between">
        <h2 className="text-heading font-normal">Filters</h2>
        {!isDefault && (
          <Button variant="ghost" size="sm" onClick={reset} className="px-2.5 text-ink-muted hover:bg-surface hover:text-ink">
            <RotateCcw aria-hidden className="size-3.5" />
            Reset
          </Button>
        )}
      </div>

      {vertical.filters.map((filter) =>
        filter.kind === "toggle" ? (
          <ToggleFilter
            key={filter.id}
            label={filter.label}
            on={filters.toggles[filter.id] ?? false}
            onChange={(on) => setToggle(filter.id, on)}
          />
        ) : null
      )}

      <FilterGroup label="State">
        <OptionPicker
          noun="state"
          options={states}
          selected={filters.states}
          onChange={(next) => {
            update("states", next)
            if (next.length) update("cities", [])
          }}
        />
      </FilterGroup>

      <FilterGroup label="City">
        <OptionPicker noun="city" options={cities} selected={filters.cities} onChange={(next) => update("cities", next)} />
      </FilterGroup>

      <FilterGroup label="Website">
        <ChipSelect
          options={WEBSITE_OPTIONS}
          labels={websiteStatusLabel}
          selected={filters.websiteStatuses}
          onChange={(next) => update("websiteStatuses", next)}
        />
      </FilterGroup>

      <FilterGroup label="Review">
        <ChipSelect
          options={REVIEW_STATUSES}
          labels={reviewStatusLabel}
          selected={filters.reviewStatuses}
          onChange={(next) => update("reviewStatuses", next)}
        />
      </FilterGroup>

      <FilterGroup label="Stage">
        <ChipSelect options={STAGES} labels={stageLabel} selected={filters.stages} onChange={(next) => update("stages", next)} />
      </FilterGroup>

      <FilterGroup label="Score">
        <ScoreRange
          min={filters.scoreMin}
          max={filters.scoreMax}
          bounds={scoreBounds}
          onChange={(min, max) => {
            update("scoreMin", min)
            update("scoreMax", max)
          }}
        />
      </FilterGroup>

      {vertical.filters.map((filter) =>
        filter.kind === "options" ? (
          <FilterGroup key={filter.id} label={filter.label}>
            <OptionPicker
              noun={filter.label.toLowerCase()}
              options={facet(leads, filter.value)}
              selected={filters.options[filter.id] ?? []}
              onChange={(next) => setOption(filter.id, next)}
            />
          </FilterGroup>
        ) : null
      )}
    </aside>
  )
}

function ToggleFilter({ label, on, onChange }: { label: string; on: boolean; onChange: (on: boolean) => void }) {
  const id = useId()
  return (
    <div className="flex items-center gap-2.5">
      <Switch id={id} checked={on} onCheckedChange={onChange} />
      <label htmlFor={id} className="cursor-pointer text-body">
        {label}
      </label>
    </div>
  )
}
