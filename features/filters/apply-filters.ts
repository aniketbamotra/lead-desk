import type { Lead } from "@/domain/lead"
import { todayISO } from "@/lib/dates"
import { digitsOnly } from "@/lib/format"
import type { VerticalConfig } from "@/verticals/types"
import type { Filters, WebsiteFilterValue } from "./filters"

// Client-side filtering. The one place filter rules live; moving to
// server-side filtering means translating this into the useLeads query.

function matchesSearch(lead: Lead, search: string) {
  const query = search.trim().toLowerCase()
  if (!query) return true

  const queryDigits = digitsOnly(query)
  if (queryDigits.length >= 3) {
    const phones = [lead.phone, lead.contact.phone].map((p) => digitsOnly(p ?? ""))
    if (phones.some((p) => p.includes(queryDigits))) return true
  }

  return [lead.name, lead.tradingName, lead.address.city, lead.contact.name, lead.website]
    .some((field) => field?.toLowerCase().includes(query))
}

function inList<T>(list: T[], value: T) {
  return list.length === 0 || list.includes(value)
}

export function isDue(lead: Lead, today = todayISO()) {
  return lead.nextFollowUp !== null && lead.nextFollowUp <= today
}

export function applyFilters(leads: Lead[], filters: Filters, vertical: VerticalConfig): Lead[] {
  const today = todayISO()
  return leads.filter((lead) => {
    if (filters.dueOnly && !isDue(lead, today)) return false
    if (!inList(filters.states, lead.address.state ?? "")) return false
    if (!inList(filters.cities, lead.address.city ?? "")) return false
    const website: WebsiteFilterValue = lead.websiteStatus ?? "unchecked"
    if (!inList(filters.websiteStatuses, website)) return false
    if (!inList(filters.reviewStatuses, lead.reviewStatus)) return false
    if (!inList(filters.stages, lead.stage)) return false

    if (filters.scoreMin !== null || filters.scoreMax !== null) {
      if (lead.score === null) return false
      if (filters.scoreMin !== null && lead.score < filters.scoreMin) return false
      if (filters.scoreMax !== null && lead.score > filters.scoreMax) return false
    }

    for (const filter of vertical.filters) {
      if (filter.kind === "toggle") {
        if (filters.toggles[filter.id] && !filter.keep(lead)) return false
      } else {
        const chosen = filters.options[filter.id] ?? []
        if (chosen.length && !chosen.includes(filter.value(lead) ?? "")) return false
      }
    }

    return matchesSearch(lead, filters.search)
  })
}

/** Distinct values with counts, most common first. */
export function facet(leads: Lead[], value: (lead: Lead) => string | null) {
  const counts = new Map<string, number>()
  for (const lead of leads) {
    const key = value(lead)
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([option, count]) => ({ option, count }))
    .sort((a, b) => b.count - a.count || a.option.localeCompare(b.option))
}
