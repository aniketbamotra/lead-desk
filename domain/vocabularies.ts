import type { ActivityType, CallOutcome } from "./activity"
import type { ReviewStatus, Stage, WebsiteStatus } from "./lead"

// Display labels, sentence case. Order follows each vocabulary's const array.

export const websiteStatusLabel: Record<WebsiteStatus | "unchecked", string> = {
  found: "Found",
  unverified: "Unverified",
  retry: "Retry",
  not_found: "Not found",
  unchecked: "Not checked",
}

export const reviewStatusLabel: Record<ReviewStatus, string> = {
  pending: "Pending",
  has_website: "Has website",
  no_website: "No website",
  disqualified: "Disqualified",
  skipped: "Skipped",
  entity_only: "Entity only",
}

export const stageLabel: Record<Stage, string> = {
  new: "New",
  contacted: "Contacted",
  follow_up: "Follow up",
  interested: "Interested",
  proposal_sent: "Proposal sent",
  won: "Won",
  lost: "Lost",
}

/**
 * States that need the owner's attention get weight 500 in the table. Only for
 * states that are rare enough for emphasis to mean something: "pending"
 * review is most rows, so it isn't here.
 */
export const stageNeedsAction: ReadonlySet<Stage> = new Set(["follow_up"])

export const callOutcomeLabel: Record<CallOutcome, string> = {
  no_answer: "No answer",
  voicemail: "Left voicemail",
  spoke: "Spoke",
  interested: "Interested",
  not_interested: "Not interested",
}

export const activityTypeLabel: Record<ActivityType, string> = {
  call: "Call",
  email: "Email",
  note: "Note",
  stage_change: "Stage",
}
