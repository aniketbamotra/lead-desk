import type { ReviewStatus, Stage, WebsiteStatus } from "@/domain/lead"
import type { SiteCondition } from "@/domain/site-condition"
import type { VerticalConfig } from "@/verticals/types"

export type WebsiteFilterValue = WebsiteStatus | "unchecked"

/** "unassessed": has a website a person hasn't assessed yet. */
export type SiteConditionFilterValue = SiteCondition | "unassessed"

export type Filters = {
  search: string
  states: string[]
  cities: string[]
  websiteStatuses: WebsiteFilterValue[]
  reviewStatuses: ReviewStatus[]
  stages: Stage[]
  siteConditions: SiteConditionFilterValue[]
  scoreMin: number | null
  scoreMax: number | null
  /** Only leads whose follow-up date is today or earlier. */
  dueOnly: boolean
  /** Vertical toggle filters, by filter id. */
  toggles: Record<string, boolean>
  /** Vertical option filters, by filter id. */
  options: Record<string, string[]>
}

export function defaultFilters(vertical: VerticalConfig): Filters {
  const toggles: Record<string, boolean> = {}
  const options: Record<string, string[]> = {}
  for (const filter of vertical.filters) {
    if (filter.kind === "toggle") toggles[filter.id] = filter.defaultOn
    else options[filter.id] = []
  }
  return {
    search: "",
    states: [],
    cities: [],
    websiteStatuses: [],
    reviewStatuses: [],
    stages: [],
    siteConditions: [],
    scoreMin: null,
    scoreMax: null,
    dueOnly: false,
    toggles,
    options,
  }
}
