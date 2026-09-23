"use client"

import { useEffect, useRef } from "react"

/** True when a keypress belongs to a text field, not to a shortcut. */
export function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [contenteditable=true]"))
}

/**
 * True when a keypress happens inside an open popover or dialog. That layer
 * handles its own keys (Esc closes it), so desk shortcuts stay out of the way.
 */
function isInsideLayer(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest('[role="dialog"], [data-radix-popper-content-wrapper]'))
  )
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
      if (isTypingTarget(event.target) || isInsideLayer(event.target)) return
      const handler = ref.current[event.key.toLowerCase()] ?? ref.current[event.key]
      if (!handler) return
      event.preventDefault()
      handler()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [enabled])
}
