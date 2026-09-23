"use client"

import { useSyncExternalStore } from "react"

// One clock for the whole app, ticking on the minute, so a thousand local-time
// cells share a single timer.

let now = Date.now()
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setTimeout> | undefined

function tick() {
  now = Date.now()
  listeners.forEach((listener) => listener())
  timer = setTimeout(tick, 60_000 - (now % 60_000))
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) {
    now = Date.now()
    timer = setTimeout(tick, 60_000 - (now % 60_000))
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) clearTimeout(timer)
  }
}

/** The current time, updated at the start of every minute. */
export function useMinuteClock(): Date {
  const ms = useSyncExternalStore(subscribe, () => now, () => now)
  return new Date(ms)
}
