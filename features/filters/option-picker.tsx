"use client"

import { useId, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatCount } from "@/lib/format"

type Props = {
  /** Lower-case noun for the button and search box, e.g. "state". */
  noun: string
  options: { option: string; count: number }[]
  selected: string[]
  onChange: (next: string[]) => void
}

// A long list of values (states, cities, specialties). Chosen values show as
// removable chips; the rest are picked from a searchable checkbox list.
export function OptionPicker({ noun, options, selected, onChange }: Props) {
  const [query, setQuery] = useState("")
  const searchId = useId()

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? options.filter(({ option }) => option.toLowerCase().includes(q)) : options
  }, [options, query])

  function toggle(option: string) {
    onChange(selected.includes(option) ? selected.filter((s) => s !== option) : [...selected, option])
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {selected.map((option) => (
        <Chip key={option} pressed onClick={() => toggle(option)} aria-label={`Remove ${option}`}>
          {option}
        </Chip>
      ))}
      <Popover onOpenChange={(open) => !open && setQuery("")}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="px-2.5 text-ink-muted hover:bg-surface hover:text-ink">
            <Plus aria-hidden className="size-3.5" />
            {selected.length ? "Add" : `Choose ${noun}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <label htmlFor={searchId} className="sr-only">
            Search {noun}
          </label>
          <Input
            id={searchId}
            placeholder={`Search ${noun}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-9"
          />
          {visible.length === 0 ? (
            <p className="px-2 py-3 text-ink-muted">No {noun} matches “{query}”.</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {visible.map(({ option, count }) => (
                <li key={option}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 hover:bg-panel">
                    <input
                      type="checkbox"
                      className="size-3.5 accent-ink"
                      checked={selected.includes(option)}
                      onChange={() => toggle(option)}
                    />
                    <span className="flex-1 truncate">{option}</span>
                    <span className="tnum text-label text-ink-muted">{formatCount(count)}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
