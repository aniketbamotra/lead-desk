"use client"

import { Keyboard, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSignOut } from "@/data/use-session"
import type { VerticalConfig } from "@/verticals/types"

type Props = {
  vertical: VerticalConfig
  email: string | null
  search: string
  onSearchChange: (value: string) => void
  searchRef: React.RefObject<HTMLInputElement | null>
  railOpen: boolean
  onToggleRail: () => void
  onShowShortcuts: () => void
}

export function TopBar({ vertical, email, search, onSearchChange, searchRef, railOpen, onToggleRail, onShowShortcuts }: Props) {
  const signOut = useSignOut()
  const initial = email?.charAt(0).toUpperCase() ?? "?"

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="mr-auto flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleRail}
          aria-expanded={railOpen}
          aria-controls="filter-rail"
          aria-label={railOpen ? "Hide filters" : "Show filters"}
          title={railOpen ? "Hide filters" : "Show filters"}
        >
          {railOpen ? <PanelLeftClose aria-hidden /> : <PanelLeftOpen aria-hidden />}
        </Button>
        <span aria-hidden className="grid size-10 place-items-center rounded-full bg-ink text-control font-semibold tracking-[-0.02em] text-white">
          LD
        </span>
        <h1 className="grid text-[17px] leading-5 font-normal">
          <span>Lead Desk</span>
          <span className="text-ink-muted">{vertical.displayName}</span>
        </h1>
      </div>

      <label className="flex h-10 w-72 items-center gap-2.5 rounded-full border border-line bg-surface pr-2 pl-3.5 hover:border-line-strong has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-coral">
        <Search aria-hidden className="size-4 shrink-0 text-ink-muted" />
        <span className="sr-only">Search {vertical.nouns.plural}</span>
        <input
          ref={searchRef}
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") event.currentTarget.blur()
          }}
          placeholder={`Search ${vertical.nouns.plural}`}
          className="min-w-0 flex-1 bg-transparent text-control text-ink outline-none placeholder:text-ink-muted"
        />
        {!search && <Kbd aria-hidden>/</Kbd>}
      </label>

      <Button variant="outline" size="icon" onClick={onShowShortcuts} aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)">
        <Keyboard aria-hidden />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-coral-tint text-body font-medium text-coral"
            aria-label="Account"
          >
            {initial}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60 gap-3 p-3">
          {email && <p className="truncate text-ink-muted">Signed in as {email}</p>}
          <Button variant="secondary" size="sm" className="justify-self-start" onClick={signOut}>
            Sign out
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
