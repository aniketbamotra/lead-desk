import * as React from "react"
import { cn } from "@/lib/utils"

// Keyboard hint. Inside ink or coral pills it inverts automatically.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-grid h-5 min-w-5 place-items-center rounded-full bg-ink/7 px-1.5 font-sans text-label text-ink-muted group-data-[variant=default]/button:bg-white/20 group-data-[variant=default]/button:text-white group-data-[variant=call]/button:bg-white/20 group-data-[variant=call]/button:text-white",
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
