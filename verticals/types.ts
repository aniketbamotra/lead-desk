import type { DetailValue, Lead } from "@/domain/lead"

// Everything market-specific lives in a VerticalConfig. Adding a market means
// adding a config, not editing screens.

export type DetailField = {
  /** Key in Lead.details. */
  key: string
  label: string
  format?: (value: DetailValue, lead: Lead) => string | null
}

export type VerticalFilter =
  | {
      kind: "toggle"
      id: string
      label: string
      defaultOn: boolean
      /** Leads that pass while the toggle is on. */
      keep: (lead: Lead) => boolean
    }
  | {
      kind: "options"
      id: string
      label: string
      /** The option a lead belongs to, or null when it has none. */
      value: (lead: Lead) => string | null
    }

/** When a business in this market picks up the phone, in its own local time. */
export type CallingHours = {
  /** 0 = Sunday. */
  days: number[]
  /** Hours on a 24-hour clock; `end` is exclusive (17 means until 5 PM). */
  start: number
  end: number
}

export type ResearchLink = { label: string; href: string }

export type VerticalConfig = {
  id: string
  /** Shown under the app name, e.g. "Dental practices". */
  displayName: string
  nouns: { singular: string; plural: string }
  /** Outside these, the table marks a lead's local time as after hours. */
  callingHours: CallingHours
  detailFields: DetailField[]
  filters: VerticalFilter[]
  /** Added after the core research links in the drawer. */
  researchLinks?: (lead: Lead) => ResearchLink[]
}
