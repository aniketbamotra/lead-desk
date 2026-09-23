"use client"

import { ArrowRightLeft, Mail, Phone, StickyNote } from "lucide-react"
import type { Activity, ActivityType } from "@/domain/activity"
import { callOutcomeLabel } from "@/domain/vocabularies"
import { useActivities } from "@/data/use-activities"
import { formatTimestamp } from "@/lib/dates"
import { cn } from "@/lib/utils"
import { DrawerCard } from "./drawer-card"

const ICONS: Record<ActivityType, typeof Phone> = {
  call: Phone,
  email: Mail,
  note: StickyNote,
  stage_change: ArrowRightLeft,
}

function title(activity: Activity) {
  if (activity.type === "call") return activity.outcome ? callOutcomeLabel[activity.outcome] : "Call"
  if (activity.type === "stage_change") return activity.note ?? "Stage changed"
  if (activity.type === "email") return "Email"
  return "Note"
}

export function ActivityCard({ leadId }: { leadId: number }) {
  const activities = useActivities(leadId)

  return (
    <DrawerCard label="Activity">
      {activities.isPending ? (
        <p className="text-ink-muted">Loading activity</p>
      ) : activities.isError ? (
        <p className="text-coral">
          {activities.error.message}. If the table is missing, run supabase/sql/003_lead_activities.sql.
        </p>
      ) : activities.data.length === 0 ? (
        <p className="text-ink-muted">No calls logged yet. Press L to log one.</p>
      ) : (
        <ol className="grid gap-3">
          {activities.data.map((activity) => {
            const Icon = ICONS[activity.type]
            // Stage changes carry their text in the title; don't repeat it.
            const body = activity.type === "stage_change" ? null : activity.note
            return (
              <li key={activity.id} className={cn("flex gap-3", activity.id < 0 && "opacity-70")}>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-panel">
                  <Icon aria-hidden className="size-3.5" />
                </span>
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className={activity.type === "call" ? "font-medium" : undefined}>{title(activity)}</span>
                    <time dateTime={activity.createdAt} className="tnum text-label text-ink-muted">
                      {formatTimestamp(activity.createdAt)}
                    </time>
                  </p>
                  {body && <p className="whitespace-pre-line text-ink-muted">{body}</p>}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </DrawerCard>
  )
}
