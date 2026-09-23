"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Activity, NewActivity } from "@/domain/activity"
import { ACTIVITY_TABLE, toActivity, toActivityInsert, type ActivityRow } from "./adapters/lead-activities"
import { queryKeys } from "./query-keys"

// Activity for one lead, newest first.
export function useActivities(leadId: number) {
  return useQuery({
    queryKey: queryKeys.activities(leadId),
    queryFn: async (): Promise<Activity[]> => {
      const { data, error } = await createClient()
        .from(ACTIVITY_TABLE)
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false })
        .limit(100)
      if (error) throw new Error(`Couldn't load activity: ${error.message}`)
      return (data as ActivityRow[]).map(toActivity)
    },
  })
}

type Variables = { leadId: number; activity: NewActivity; actor: string | null }

// Adds an activity. It shows in the timeline straight away and is removed
// again if the save fails.
export function useAddActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ leadId, activity }: Variables) => {
      const { error } = await createClient().from(ACTIVITY_TABLE).insert(toActivityInsert(leadId, activity))
      if (error) throw new Error(`Couldn't save the activity: ${error.message}`)
    },
    onMutate: async ({ leadId, activity, actor }) => {
      const key = queryKeys.activities(leadId)
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Activity[]>(key)
      const optimistic: Activity = {
        id: -Date.now(),
        leadId,
        ...activity,
        createdAt: new Date().toISOString(),
        createdBy: actor,
      }
      queryClient.setQueryData<Activity[]>(key, (list) => [optimistic, ...(list ?? [])])
      return { previous, key }
    },
    onError: (_error, _variables, context) => {
      if (context) queryClient.setQueryData(context.key, context.previous)
    },
    onSettled: (_data, _error, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(leadId) })
    },
  })
}
