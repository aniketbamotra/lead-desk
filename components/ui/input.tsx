import * as React from "react"
import { cn } from "@/lib/utils"

// Text inputs are the one place line-strong borders are used (3:1 control boundary).
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-full border border-line-strong bg-surface px-4 text-control text-ink placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
