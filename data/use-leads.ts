"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Lead } from "@/domain/lead"
import {
  FILTER_BY_VERTICAL,
  READ_SOURCE,
  toLead,
  type LeadQueueRow,
} from "./adapters/lead-queue"
import { queryKeys } from "./query-keys"

// Supabase returns at most 1,000 rows per request by default.
const PAGE_SIZE = 1000
const nameCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" })

async function fetchLeads(vertical: string): Promise<Lead[]> {
  const supabase = createClient()
  const rows: LeadQueueRow[] = []

  for (let from = 0; ; from += PAGE_SIZE) {
    let query = supabase
      .from(READ_SOURCE)
      .select("*")
      .order("id")
      .range(from, from + PAGE_SIZE - 1)
    if (FILTER_BY_VERTICAL) query = query.eq("vertical", vertical)

    const { data, error } = await query
    if (error) throw new Error(`Couldn't load leads: ${error.message}`)

    rows.push(...(data as LeadQueueRow[]))
    if (data.length < PAGE_SIZE) break
  }

  // Name order is the tie-break for every table sort (the sort is stable),
  // so leads with equal scores don't come out in database order.
  return rows.map(toLead).sort((a, b) => nameCollator.compare(a.name, b.name))
}

// All leads for a vertical. Filtering happens on the client (see
// features/filters/apply-filters.ts). To move filtering to the server, pass
// the filters in here and into the query key; nothing else changes.
export function useLeads(vertical: string) {
  return useQuery({
    queryKey: queryKeys.leads(vertical),
    queryFn: () => fetchLeads(vertical),
    // Two people work in the app: pick up the other person's reviews and
    // calls every minute and when returning to the tab.
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  })
}
