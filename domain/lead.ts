// The Lead domain model. Components work with this, never with database rows.
// Shared by every vertical; market-specific data goes in `details`.

export const WEBSITE_STATUSES = ["found", "unverified", "retry", "not_found"] as const
export type WebsiteStatus = (typeof WEBSITE_STATUSES)[number]

export const REVIEW_STATUSES = ["pending", "has_website", "no_website", "disqualified", "skipped"] as const
export type ReviewStatus = (typeof REVIEW_STATUSES)[number]

export const STAGES = ["new", "contacted", "follow_up", "interested", "proposal_sent", "won", "lost"] as const
export type Stage = (typeof STAGES)[number]

export type DetailValue = string | number | boolean | null

export type Lead = {
  id: number
  vertical: string
  name: string
  /** Trading / "doing business as" name, when it differs from the legal name. */
  tradingName: string | null
  phone: string | null
  address: {
    line1: string | null
    line2: string | null
    city: string | null
    state: string | null
    zip: string | null
  }
  contact: {
    name: string | null
    title: string | null
    phone: string | null
    email: string | null
    linkedin: string | null
  }
  website: string | null
  /** What automation found. `null` means not checked yet. */
  websiteStatus: WebsiteStatus | null
  /** How the website was found: automation's guess or a person. */
  websiteSource: string | null
  reviewStatus: ReviewStatus
  reviewNotes: string | null
  reviewedAt: string | null
  stage: Stage
  stageUpdatedAt: string | null
  nextFollowUp: string | null
  score: number | null
  /** Market-specific fields, keyed as the vertical config expects. */
  details: Record<string, DetailValue>
}

/** Every field a review action can touch, so it can be undone exactly. */
export type ReviewSnapshot = Pick<
  Lead,
  "reviewStatus" | "reviewNotes" | "reviewedAt" | "website" | "websiteStatus" | "websiteSource"
>

export function reviewSnapshot(lead: Lead): ReviewSnapshot {
  const { reviewStatus, reviewNotes, reviewedAt, website, websiteStatus, websiteSource } = lead
  return { reviewStatus, reviewNotes, reviewedAt, website, websiteStatus, websiteSource }
}

// A change a person makes to a lead. The adapter turns it into a database
// write; applyLeadChange gives the optimistic result.
export type LeadChange =
  | { kind: "review"; review: "has_website"; website: string }
  | { kind: "review"; review: "no_website" | "skipped" }
  | { kind: "review"; review: "disqualified"; note: string }
  | { kind: "stage"; stage: Stage }
  /** Undo of a review: puts every review field back as it was. */
  | { kind: "restore"; snapshot: ReviewSnapshot }

export function applyLeadChange(lead: Lead, change: LeadChange, now: string): Lead {
  if (change.kind === "stage") {
    return { ...lead, stage: change.stage, stageUpdatedAt: now }
  }
  if (change.kind === "restore") {
    return { ...lead, ...change.snapshot }
  }

  const reviewed = { ...lead, reviewStatus: change.review, reviewedAt: now }
  switch (change.review) {
    case "has_website":
      return { ...reviewed, website: change.website, websiteStatus: "found", websiteSource: "manual" }
    case "disqualified":
      return { ...reviewed, reviewNotes: change.note }
    default:
      return reviewed
  }
}
