import { siteConditionOption, type SiteCondition } from "./site-condition"

// The Lead domain model. Components work with this, never with database rows.
// Shared by every vertical; market-specific data goes in `details`.

export const WEBSITE_STATUSES = ["found", "unverified", "retry", "not_found"] as const
export type WebsiteStatus = (typeof WEBSITE_STATUSES)[number]

// entity_only: the registered entity has no findable web presence and the
// practice may trade under another name. Resolved by calling, not research.
export const REVIEW_STATUSES = ["pending", "has_website", "no_website", "disqualified", "skipped", "entity_only"] as const
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
  /** IANA time zone of the address, e.g. "America/Chicago"; null when unknown. */
  timeZone: string | null
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
  /** Entity only: a trading name seen at this address, still unconfirmed. */
  possibleTradingName: string | null
  /** Entity only: a website that might belong to that trading name. */
  possibleWebsite: string | null
  /** A person's assessment of the website (see site-condition.ts). */
  siteCondition: SiteCondition | null
  /** Points stored with the assessment; sorts after score. */
  siteConditionScore: number | null
  reviewStatus: ReviewStatus
  reviewNotes: string | null
  reviewedAt: string | null
  /** Email of whoever last reviewed it; set by the database. */
  reviewedBy: string | null
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
  | "reviewStatus"
  | "reviewNotes"
  | "reviewedAt"
  | "reviewedBy"
  | "website"
  | "websiteStatus"
  | "websiteSource"
  | "possibleTradingName"
  | "possibleWebsite"
  | "siteCondition"
  | "siteConditionScore"
>

export function reviewSnapshot(lead: Lead): ReviewSnapshot {
  return {
    reviewStatus: lead.reviewStatus,
    reviewNotes: lead.reviewNotes,
    reviewedAt: lead.reviewedAt,
    reviewedBy: lead.reviewedBy,
    website: lead.website,
    websiteStatus: lead.websiteStatus,
    websiteSource: lead.websiteSource,
    possibleTradingName: lead.possibleTradingName,
    possibleWebsite: lead.possibleWebsite,
    siteCondition: lead.siteCondition,
    siteConditionScore: lead.siteConditionScore,
  }
}

// A change a person makes to a lead. The adapter turns it into a database
// write; applyLeadChange gives the optimistic result.
export type LeadChange =
  | { kind: "review"; review: "has_website"; website: string }
  | { kind: "review"; review: "no_website" | "skipped" }
  | { kind: "review"; review: "disqualified"; note: string }
  | {
      kind: "review"
      review: "entity_only"
      possibleTradingName: string | null
      possibleWebsite: string | null
      note: string | null
    }
  | { kind: "stage"; stage: Stage }
  /** Assess the website, or clear the assessment. */
  | { kind: "site_condition"; condition: SiteCondition | null }
  /** Set or clear the follow-up date (YYYY-MM-DD). */
  | { kind: "follow_up"; date: string | null }
  /** Undo of a review: puts every review field back as it was. */
  | { kind: "restore"; snapshot: ReviewSnapshot }

/**
 * The optimistic result of a change. `actor` is the signed-in user's email,
 * matching what the database records.
 */
export function applyLeadChange(lead: Lead, change: LeadChange, now: string, actor: string | null): Lead {
  if (change.kind === "stage") {
    return { ...lead, stage: change.stage, stageUpdatedAt: now }
  }
  if (change.kind === "restore") {
    return { ...lead, ...change.snapshot }
  }
  if (change.kind === "follow_up") {
    return { ...lead, nextFollowUp: change.date }
  }
  if (change.kind === "site_condition") {
    return {
      ...lead,
      siteCondition: change.condition,
      siteConditionScore: change.condition ? siteConditionOption(change.condition).points : null,
      reviewedAt: now,
    }
  }

  const reviewed = { ...lead, reviewStatus: change.review, reviewedAt: now, reviewedBy: actor }
  switch (change.review) {
    case "has_website":
      return { ...reviewed, website: change.website, websiteStatus: "found", websiteSource: "manual" }
    case "disqualified":
      return { ...reviewed, reviewNotes: change.note }
    case "entity_only":
      // website and website_status belong to automation; leave them alone.
      return {
        ...reviewed,
        possibleTradingName: change.possibleTradingName,
        possibleWebsite: change.possibleWebsite,
        reviewNotes: change.note,
      }
    default:
      return reviewed
  }
}

/** A website a person can assess: found or unverified by automation, or added by hand. */
export function leadHasWebsite(lead: Lead) {
  return lead.website !== null || lead.websiteStatus === "found" || lead.websiteStatus === "unverified"
}
