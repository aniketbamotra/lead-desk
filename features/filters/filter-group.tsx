import { useId } from "react"

export function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="grid gap-2">
      <span id={id} className="text-label text-ink-muted">
        {label}
      </span>
      {children}
    </div>
  )
}
