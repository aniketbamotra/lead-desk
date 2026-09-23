import {
  ACTIVITY_TYPES,
  CALL_OUTCOMES,
  type Activity,
  type ActivityType,
  type CallOutcome,
  type NewActivity,
} from "@/domain/activity"

// The only file that knows the shape of public.lead_activities.

export const ACTIVITY_TABLE = "lead_activities"

export type ActivityRow = {
  id: number
  lead_id: number
  type: string
  outcome: string | null
  note: string | null
  created_at: string
  created_by: string | null
}

function oneOf<T extends string>(values: readonly T[], value: string | null): T | null {
  return value !== null && (values as readonly string[]).includes(value) ? (value as T) : null
}

export function toActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    leadId: row.lead_id,
    type: oneOf<ActivityType>(ACTIVITY_TYPES, row.type) ?? "note",
    outcome: oneOf<CallOutcome>(CALL_OUTCOMES, row.outcome),
    note: row.note?.trim() || null,
    createdAt: row.created_at,
    createdBy: row.created_by,
  }
}

// created_by is filled in by the database from the signed-in account.
export function toActivityInsert(leadId: number, activity: NewActivity) {
  return { lead_id: leadId, type: activity.type, outcome: activity.outcome, note: activity.note }
}
