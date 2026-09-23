"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { applyLeadChange, type Lead, type LeadChange } from "@/domain/lead"
import { WRITE_TABLE, toLeadsUpdate } from "./adapters/lead-queue"
import { queryKeys } from "./query-keys"

type Variables = { leadId: number; change: LeadChange; now: string }

// Review actions and stage changes. Optimistic, with rollback on error.
export function useUpdateLead(vertical: string) {
  const queryClient = useQueryClient()
  const key = queryKeys.leads(vertical)

  return useMutation({
    mutationFn: async ({ leadId, change, now }: Variables) => {
      const { data, error } = await createClient()
        .from(WRITE_TABLE)
        .update(toLeadsUpdate(change, now))
        .eq("id", leadId)
        .select("id")
      if (error) throw new Error(`Couldn't save: ${error.message}`)
      // RLS blocks silently: no error, no rows.
      if (!data?.length) throw new Error("Couldn't save: this account isn't allowed to update leads.")
    },
    onMutate: async ({ leadId, change, now }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Lead[]>(key)
      queryClient.setQueryData<Lead[]>(key, (leads) =>
        leads?.map((lead) => (lead.id === leadId ? applyLeadChange(lead, change, now) : lead))
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },
  })
}
