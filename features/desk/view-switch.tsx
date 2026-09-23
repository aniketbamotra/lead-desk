import { cn } from "@/lib/utils"

export type DeskView = "table" | "board"

const OPTIONS: { value: DeskView; label: string }[] = [
  { value: "table", label: "Table" },
  { value: "board", label: "Board" },
]

export function ViewSwitch({ view, onChange }: { view: DeskView; onChange: (view: DeskView) => void }) {
  return (
    <div role="group" aria-label="View" className="flex rounded-full border border-line bg-surface p-0.5">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={view === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-7 rounded-full px-3 text-body transition-colors",
            view === option.value ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
