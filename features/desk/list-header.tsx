import { capitalize, formatCount } from "@/lib/format"
import type { VerticalConfig } from "@/verticals/types"

// Title, count and controls above the table or the board.
export function ListHeader({
  id,
  vertical,
  shown,
  total,
  actions,
}: {
  id: string
  vertical: VerticalConfig
  shown: number
  total: number
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-3 pt-1 pb-2">
      <h2 id={id} className="text-heading font-normal">
        {capitalize(vertical.nouns.plural)}
      </h2>
      <span className="tnum text-ink-muted" aria-live="polite">
        {formatCount(shown)} of {formatCount(total)}
      </span>
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  )
}
