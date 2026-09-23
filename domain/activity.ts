// Activity log shared by every vertical: calls now, emails and notes later,
// and stage changes recorded automatically.

export const CALL_OUTCOMES = ["no_answer", "voicemail", "spoke", "interested", "not_interested"] as const
export type CallOutcome = (typeof CALL_OUTCOMES)[number]

export const ACTIVITY_TYPES = ["call", "email", "note", "stage_change"] as const
export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export type Activity = {
  id: number
  leadId: number
  type: ActivityType
  outcome: CallOutcome | null
  note: string | null
  createdAt: string
  /** Email of whoever logged it; set by the database. */
  createdBy: string | null
}

export type NewActivity = {
  type: ActivityType
  outcome: CallOutcome | null
  note: string | null
}
