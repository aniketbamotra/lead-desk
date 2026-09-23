"use client"

import { useTable } from "@tanstack/react-table"
import type { Lead } from "@/domain/lead"
import { leadColumns } from "./columns"
import { leadTableFeatures } from "./table-features"

// Takes already-filtered leads. For server-side sorting later, switch the
// sorting slice to controlled state and pass it to useLeads.
export function useLeadTable(leads: Lead[]) {
  return useTable({
    features: leadTableFeatures,
    columns: leadColumns,
    data: leads,
    getRowId: (lead) => String(lead.id),
    // No sort on load: the list comes in name order (from useLeads), which
    // editing a lead never changes, so rows don't jump while working. Clicking
    // a header sorts; a third click goes back to name order.
    enableSortingRemoval: true,
  })
}

export type LeadTableInstance = ReturnType<typeof useLeadTable>
