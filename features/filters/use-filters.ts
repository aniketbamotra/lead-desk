"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { VerticalConfig } from "@/verticals/types"
import { defaultFilters, type Filters } from "./filters"
import { filtersFromParams, writeFilterParams } from "./filter-params"

// Filter state for the desk, mirrored into the URL so a refresh or a
// bookmark keeps it. `initialQuery` comes from the server so the first
// render matches on server and client.
export function useFilters(vertical: VerticalConfig, initialQuery: string) {
  const defaults = useMemo(() => defaultFilters(vertical), [vertical])
  const [filters, setFilters] = useState<Filters>(() =>
    filtersFromParams(new URLSearchParams(initialQuery), vertical)
  )

  useEffect(() => {
    const url = new URL(window.location.href)
    writeFilterParams(url.searchParams, filters, vertical)
    window.history.replaceState(window.history.state, "", url)
  }, [filters, vertical])

  const update = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) =>
      setFilters((current) => ({ ...current, [key]: value })),
    []
  )
  const setToggle = useCallback(
    (id: string, on: boolean) =>
      setFilters((current) => ({ ...current, toggles: { ...current.toggles, [id]: on } })),
    []
  )
  const setOption = useCallback(
    (id: string, values: string[]) =>
      setFilters((current) => ({ ...current, options: { ...current.options, [id]: values } })),
    []
  )
  const reset = useCallback(() => setFilters(defaults), [defaults])

  const isDefault = JSON.stringify(filters) === JSON.stringify(defaults)

  return { filters, update, setToggle, setOption, reset, isDefault }
}

export type FiltersApi = ReturnType<typeof useFilters>
