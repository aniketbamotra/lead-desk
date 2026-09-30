"use client"

import { useSyncExternalStore } from "react"

// Today's weekday in the visitor's browser (0 = Sunday). The server doesn't
// know the visitor's time zone, so this renders nothing until hydration.
function subscribe() {
  return () => {}
}

export function TodayBadge({ days, className }: { days: number[]; className?: string }) {
  const today = useSyncExternalStore(
    subscribe,
    () => new Date().getDay(),
    () => null
  )
  if (today === null || !days.includes(today)) return null
  return <span className={className}>Today</span>
}
