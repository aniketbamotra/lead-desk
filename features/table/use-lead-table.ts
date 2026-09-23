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
    initialState: { sorting: [{ id: "score", desc: true }] },
    enableSortingRemoval: false,
  })
}

export type LeadTableInstance = ReturnType<typeof useLeadTable>
