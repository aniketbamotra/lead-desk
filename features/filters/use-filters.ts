"use client"

import { useCallback, useMemo, useState } from "react"
import type { VerticalConfig } from "@/verticals/types"
import { defaultFilters, type Filters } from "./filters"

// Filter state for the desk. Filters stay in memory for now; persisting them
// to the URL later only changes this hook.
export function useFilters(vertical: VerticalConfig) {
  const initial = useMemo(() => defaultFilters(vertical), [vertical])
  const [filters, setFilters] = useState<Filters>(initial)

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
  const reset = useCallback(() => setFilters(initial), [initial])

  const isDefault = JSON.stringify(filters) === JSON.stringify(initial)

  return { filters, update, setToggle, setOption, reset, isDefault }
}

export type FiltersApi = ReturnType<typeof useFilters>
