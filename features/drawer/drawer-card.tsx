import { useId } from "react"
import { cn } from "@/lib/utils"

export function DrawerCard({
  label,
  className,
  children,
}: {
  label?: string
  className?: string
  children: React.ReactNode
}) {
  const id = useId()
  return (
    <section aria-labelledby={label ? id : undefined} className={cn("grid gap-3 rounded-lg bg-surface p-4", className)}>
      {label && (
        <h3 id={id} className="text-label text-ink-muted">
          {label}
        </h3>
      )}
      {children}
    </section>
  )
}
