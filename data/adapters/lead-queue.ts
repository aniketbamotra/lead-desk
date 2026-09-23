import {
  REVIEW_STATUSES,
  STAGES,
  WEBSITE_STATUSES,
  type Lead,
  type LeadChange,
  type ReviewStatus,
  type Stage,
  type WebsiteStatus,
} from "@/domain/lead"
import { toDisplayCase } from "@/lib/display-case"

// The only file that knows the shape of lead_queue / leads. Reads come from
// the lead_queue view; writes go to the leads table. If the schema changes or
// a vertical lands in another table, this is what changes.

export const READ_SOURCE = "lead_queue"
export const WRITE_TABLE = "leads"

// lead_queue exposes `vertical` (supabase/sql/001_lead_queue_new_columns.sql),
// so each vertical only loads its own leads.
export const FILTER_BY_VERTICAL = true
const DEFAULT_VERTICAL = "dental"

/** Columns of public.lead_queue this app reads. */
export type LeadQueueRow = {
  id: number
  vertical: string | null
  npi: string | null
  business_name: string | null
  dba_name: string | null
  specialty: string | null
  taxonomy_code: string | null
  taxonomy_group: string | null
  phone: string | null
  address: string | null
  address_2: string | null
  city: string | null
  state: string | null
  zip: string | null
  contact_name: string | null
  contact_title: string | null
  contact_phone: string | null
  contact_email: string | null
  contact_linkedin: string | null
  npi_status: string | null
  enumeration_date: string | null
  last_updated_nppes: string | null
  years_since_update: number | null
  website: string | null
  website_status: string | null
  review_status: string | null
  review_notes: string | null
  reviewed_at: string | null
  status: string | null
  next_follow_up: string | null
  stage_updated_at: string | null
  qual_score: number | null
  official_org_count: number | null
  is_duplicate: boolean | null
}

function blankToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/** Registry text is all caps; show it in title case. */
function display(value: string | null | undefined): string | null {
  const text = blankToNull(value)
  return text ? toDisplayCase(text) : null
}

function oneOf<T extends string>(values: readonly T[], value: string | null, fallback: T): T
function oneOf<T extends string>(values: readonly T[], value: string | null, fallback: null): T | null
function oneOf<T extends string>(values: readonly T[], value: string | null, fallback: T | null) {
  return value !== null && (values as readonly string[]).includes(value) ? (value as T) : fallback
}

export function toLead(row: LeadQueueRow): Lead {
  const name = display(row.business_name) ?? "Unnamed"
  const dba = display(row.dba_name)

  return {
    id: row.id,
    vertical: blankToNull(row.vertical) ?? DEFAULT_VERTICAL,
    name,
    tradingName: dba && dba.toLowerCase() !== name.toLowerCase() ? dba : null,
    phone: blankToNull(row.phone),
    address: {
      line1: display(row.address),
      line2: display(row.address_2),
      city: display(row.city),
      state: blankToNull(row.state),
      zip: blankToNull(row.zip),
    },
    contact: {
      name: display(row.contact_name),
      title: display(row.contact_title),
      phone: blankToNull(row.contact_phone),
      email: blankToNull(row.contact_email),
      linkedin: blankToNull(row.contact_linkedin),
    },
    website: blankToNull(row.website),
    websiteStatus: oneOf<WebsiteStatus>(WEBSITE_STATUSES, row.website_status, null),
    reviewStatus: oneOf<ReviewStatus>(REVIEW_STATUSES, row.review_status, "pending"),
    reviewNotes: blankToNull(row.review_notes),
    reviewedAt: row.reviewed_at,
    stage: oneOf<Stage>(STAGES, row.status, "new"),
    stageUpdatedAt: row.stage_updated_at,
    nextFollowUp: row.next_follow_up,
    score: row.qual_score,
    details: {
      npi: row.npi,
      specialty: display(row.specialty),
      taxonomyCode: blankToNull(row.taxonomy_code),
      taxonomyGroup: display(row.taxonomy_group),
      npiStatus: blankToNull(row.npi_status),
      enumerationDate: row.enumeration_date,
      lastUpdatedNppes: row.last_updated_nppes,
      yearsSinceUpdate: row.years_since_update,
      officialOrgCount: row.official_org_count,
      isDuplicate: row.is_duplicate,
    },
  }
}

/** The `leads` columns to write for a change. Only these fields are touched. */
export function toLeadsUpdate(change: LeadChange, now: string): Record<string, string> {
  if (change.kind === "stage") {
    return { status: change.stage, stage_updated_at: now }
  }

  const reviewed = { review_status: change.review, reviewed_at: now }
  switch (change.review) {
    case "has_website":
      // The one case where the dashboard writes automation fields: a human
      // confirmed the site.
      return {
        ...reviewed,
        website: change.website,
        website_status: "found",
        website_source: "manual",
      }
    case "disqualified":
      return { ...reviewed, review_notes: change.note }
    default:
      return reviewed
  }
}
