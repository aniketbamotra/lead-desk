"use client"

import { useEffect, useRef } from "react"

/** True when a keypress belongs to a text field, not to a shortcut. */
export function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [contenteditable=true]"))
}

/**
 * Single-key shortcuts. Ignored while typing in a field or when a modifier
 * key is held, so browser and OS shortcuts keep working.
 */
export function useKeys(handlers: Record<string, () => void>, enabled = true) {
  const ref = useRef(handlers)
  useEffect(() => {
    ref.current = handlers
  })

  useEffect(() => {
    if (!enabled) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return
      if (isTypingTarget(event.target)) return
      const handler = ref.current[event.key.toLowerCase()] ?? ref.current[event.key]
      if (!handler) return
      event.preventDefault()
      handler()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [enabled])
}
