import { cn } from "@/lib/utils"
import type { WebsiteStatus } from "@/domain/lead"
import { websiteStatusLabel } from "@/domain/vocabularies"

// Website status: shape and label always; colour only where it means something.
// Coral marks "unverified" because it waits on a human check.
export function StatusMark({ status, className }: { status: WebsiteStatus | null; className?: string }) {
  const key = status ?? "unchecked"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[7px] whitespace-nowrap",
        key === "found" ? "text-ink" : key === "unverified" ? "text-coral" : "text-ink-muted",
        className
      )}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="shrink-0">
        {key === "found" && <circle cx="5" cy="5" r="4.5" fill="currentColor" />}
        {key === "unverified" && (
          <>
            <circle cx="5" cy="5" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 .75a4.25 4.25 0 0 1 0 8.5z" fill="currentColor" />
          </>
        )}
        {key === "retry" && (
          <circle cx="5" cy="5" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 1.6" />
        )}
        {key === "not_found" && (
          <circle cx="5" cy="5" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        )}
        {key === "unchecked" && <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" />}
      </svg>
      {websiteStatusLabel[key]}
    </span>
  )
}
