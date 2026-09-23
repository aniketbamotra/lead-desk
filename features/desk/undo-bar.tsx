"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

type Props = {
  message: string
  onUndo: () => void
  onDismiss: () => void
}

// The last review action, with a way back. Stays until the next review
// action replaces it or it's dismissed.
export function UndoBar({ message, onUndo, onDismiss }: Props) {
  return (
    <div
      role="status"
      className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-4 text-control text-white shadow-[0_4px_16px_rgba(20,20,20,0.16)] duration-150 animate-in fade-in-0 slide-in-from-bottom-2"
    >
      <Check aria-hidden className="size-4 shrink-0 text-white/70" />
      <span className="truncate">{message}</span>
      <Button size="sm" className="bg-white/12 hover:bg-white/20" onClick={onUndo}>
        Undo <Kbd>Z</Kbd>
      </Button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="grid size-8 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/12 hover:text-white"
      >
        <X aria-hidden className="size-4" />
      </button>
    </div>
  )
}
