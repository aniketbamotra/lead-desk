"use client"

import type { CallingHours } from "@/verticals/types"
import { localTime, type LocalTime } from "@/lib/time-zones"
import { useMinuteClock } from "@/lib/use-minute-clock"
import { cn } from "@/lib/utils"

/** Null during calling hours; otherwise why it's a bad time to call. */
function offHours(local: LocalTime, hours: CallingHours) {
  if (!hours.days.includes(local.weekday)) return "Weekend"
  if (local.minutes < hours.start * 60) return "Before hours"
  if (local.minutes >= hours.end * 60) return "After hours"
  return null
}

type Props = { timeZone: string | null; callingHours: CallingHours }

export function LocalTimeCell({ timeZone, callingHours }: Props) {
  const now = useMinuteClock()
  if (!timeZone) return <span className="text-ink-muted">–</span>

  const local = localTime(timeZone, now)
  const closed = offHours(local, callingHours)
  return (
    <span className="grid min-w-0" title={local.zoneLongName}>
      <span className={cn("tnum truncate", closed && "text-ink-muted")}>
        {local.time} <span className="text-ink-muted">{local.zoneName}</span>
      </span>
      {closed && <span className="truncate text-label text-ink-muted">{closed}</span>}
    </span>
  )
}
