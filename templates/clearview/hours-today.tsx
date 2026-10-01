"use client"

import { useSyncExternalStore } from "react"
import type { WeekHours } from "../_shared/content"
import { formatDayHours, formatTime } from "../_shared/practice"
import s from "./clearview.module.css"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function subscribe() {
  return () => {}
}

// The card over the hero photo: whether the practice is open today, from its
// own hours. The server doesn't know the visitor's day, so it starts with the
// next weekday's hours and settles once the page is running.
export function HoursToday({ hours, tel, phone }: { hours: WeekHours; tel: string; phone: string }) {
  const today = useSyncExternalStore(
    subscribe,
    () => new Date().getDay(),
    () => null
  )

  let title = "Opening hours"
  let detail = `Weekdays from ${hours[1] ? formatTime(hours[1].open) : "9am"}`
  let open = true
  if (today !== null) {
    const day = hours[today]
    if (day) {
      title = "Open today"
      detail = formatDayHours(day)
    } else {
      open = false
      title = "Closed today"
      const next = [1, 2, 3, 4, 5, 6, 7].map((offset) => (today + offset) % 7).find((d) => hours[d])
      detail = next !== undefined && hours[next] ? `Opens ${DAY_NAMES[next]} at ${formatTime(hours[next]!.open)}` : "Call for an appointment"
    }
  }

  return (
    <div className={s.hoursToday}>
      <span className={s.hoursDot} data-open={open} aria-hidden />
      <p>
        <span className={s.hoursTitle}>{title}</span>
        <span className={s.hoursDetail}>{detail}</span>
      </p>
      <a href={tel} className={s.hoursCall} aria-label={`Call ${phone}`}>
        Call
      </a>
    </div>
  )
}
