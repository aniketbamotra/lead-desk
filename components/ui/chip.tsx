import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// Toggle chip for filters. Unpressed: white outlined pill, so it reads as a
// button. Pressed: ink fill with a remove mark, matching the active count circle.
function Chip({
  pressed,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { pressed: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3.5 text-body whitespace-nowrap transition-colors",
        pressed
          ? "border-ink bg-ink pr-2.5 text-white hover:bg-[#2A2A2A]"
          : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink",
        className
      )}
      {...props}
    >
      {children}
      {pressed && <X aria-hidden className="size-3.5 text-white/70" />}
    </button>
  )
}

export { Chip }
