"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { applyLeadChange, type Lead, type LeadChange } from "@/domain/lead"
import { personName } from "@/lib/people"
import { WRITE_TABLE, toLeadsUpdate } from "./adapters/lead-queue"
import { queryKeys } from "./query-keys"

type Variables = {
  lead: Lead
  change: LeadChange
  now: string
  /** Signed-in user's email, for the optimistic result. */
  actor: string | null
}

/** Someone else changed the lead's review since it was loaded. */
export class ReviewConflictError extends Error {}

// Review changes only save if the review status is still what this screen
// showed. Two people work in the app; without this, the second review would
// silently overwrite the first.
function guardsReview(change: LeadChange) {
  return change.kind === "review" || change.kind === "restore"
}

// Review actions, stage changes and follow-ups. Optimistic, with rollback.
export function useUpdateLead(vertical: string) {
  const queryClient = useQueryClient()
  const key = queryKeys.leads(vertical)

  const apply = (variables: Variables) =>
    queryClient.setQueryData<Lead[]>(key, (leads) =>
      leads?.map((lead) =>
        lead.id === variables.lead.id
          ? applyLeadChange(lead, variables.change, variables.now, variables.actor)
          : lead
      )
    )

  return useMutation({
    mutationFn: async ({ lead, change, now, actor }: Variables) => {
      const supabase = createClient()
      let query = supabase.from(WRITE_TABLE).update(toLeadsUpdate(change, now)).eq("id", lead.id)
      if (guardsReview(change)) query = query.eq("review_status", lead.reviewStatus)

      const { data, error } = await query.select("id")
      if (error) throw new Error(`Couldn't save: ${error.message}`)
      if (data?.length) return

      // No row updated: either the review changed underneath us, or RLS
      // blocked the write (which fails silently).
      if (guardsReview(change)) {
        const { data: current } = await supabase
          .from(WRITE_TABLE)
          .select("review_status, reviewed_by")
          .eq("id", lead.id)
          .maybeSingle()
        if (current && current.review_status !== lead.reviewStatus) {
          const who = personName(current.reviewed_by, actor) ?? "Someone else"
          throw new ReviewConflictError(
            `${who === "you" ? "You" : who} already reviewed it. The list has been refreshed; your change wasn't saved.`
          )
        }
      }
      throw new Error("Couldn't save: this account isn't allowed to update leads.")
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Lead[]>(key)
      apply(variables)
      return { previous }
    },
    // A background refresh may have landed while saving and replaced the
    // optimistic lead with the old one; apply the change again.
    onSuccess: (_data, variables) => apply(variables),
    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
      if (error instanceof ReviewConflictError) queryClient.invalidateQueries({ queryKey: key })
    },
  })
}
