import { REVIEW_STATUSES, STAGES, WEBSITE_STATUSES } from "@/domain/lead"
import { SITE_CONDITIONS } from "@/domain/site-condition"
import type { VerticalConfig } from "@/verticals/types"
import { defaultFilters, type Filters, type SiteConditionFilterValue, type WebsiteFilterValue } from "./filters"

// Filters <-> URL query. Multi-value filters repeat the key
// (?state=AK&state=OR), so values containing commas survive. Only filters
// that differ from the defaults are written, keeping URLs short.

const WEBSITE_VALUES: readonly WebsiteFilterValue[] = [...WEBSITE_STATUSES, "unchecked"]
const SITE_VALUES: readonly SiteConditionFilterValue[] = ["unassessed", ...SITE_CONDITIONS.map((c) => c.key)]

function oneOfList<T extends string>(values: string[], allowed: readonly T[]): T[] {
  return values.filter((v): v is T => (allowed as readonly string[]).includes(v))
}

function toNumber(value: string | null) {
  if (value === null || value.trim() === "") return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function filtersFromParams(params: URLSearchParams, vertical: VerticalConfig): Filters {
  const filters = defaultFilters(vertical)
  filters.search = params.get("q") ?? ""
  filters.states = params.getAll("state")
  filters.cities = params.getAll("city")
  filters.websiteStatuses = oneOfList(params.getAll("website"), WEBSITE_VALUES)
  filters.reviewStatuses = oneOfList(params.getAll("review"), REVIEW_STATUSES)
  filters.stages = oneOfList(params.getAll("stage"), STAGES)
  filters.siteConditions = oneOfList(params.getAll("site"), SITE_VALUES)
  filters.scoreMin = toNumber(params.get("min"))
  filters.scoreMax = toNumber(params.get("max"))
  filters.dueOnly = params.get("due") === "1"
  for (const filter of vertical.filters) {
    const key = `f.${filter.id}`
    if (filter.kind === "toggle") {
      const value = params.get(key)
      if (value === "1" || value === "0") filters.toggles[filter.id] = value === "1"
    } else {
      filters.options[filter.id] = params.getAll(key)
    }
  }
  return filters
}

/** Writes filters into `params`, replacing any filter keys already there. */
export function writeFilterParams(params: URLSearchParams, filters: Filters, vertical: VerticalConfig) {
  const keys = ["q", "state", "city", "website", "review", "stage", "site", "min", "max", "due", ...vertical.filters.map((f) => `f.${f.id}`)]
  keys.forEach((key) => params.delete(key))

  if (filters.search.trim()) params.set("q", filters.search.trim())
  filters.states.forEach((v) => params.append("state", v))
  filters.cities.forEach((v) => params.append("city", v))
  filters.websiteStatuses.forEach((v) => params.append("website", v))
  filters.reviewStatuses.forEach((v) => params.append("review", v))
  filters.stages.forEach((v) => params.append("stage", v))
  filters.siteConditions.forEach((v) => params.append("site", v))
  if (filters.scoreMin !== null) params.set("min", String(filters.scoreMin))
  if (filters.scoreMax !== null) params.set("max", String(filters.scoreMax))
  if (filters.dueOnly) params.set("due", "1")
  for (const filter of vertical.filters) {
    const key = `f.${filter.id}`
    if (filter.kind === "toggle") {
      const on = filters.toggles[filter.id] ?? filter.defaultOn
      if (on !== filter.defaultOn) params.set(key, on ? "1" : "0")
    } else {
      ;(filters.options[filter.id] ?? []).forEach((v) => params.append(key, v))
    }
  }
}
