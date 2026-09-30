"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { makeSlug, type Demo } from "@/domain/demo"
import type { TemplateId } from "@/templates"
import { DEMO_TABLE, toDemo, toDemoInsert, toDemoUpdate, type DemoPatch, type DemoRow } from "./adapters/demos"
import { queryKeys } from "./query-keys"

// The demo for one lead, or null when there isn't one yet.
export function useDemo(leadId: number) {
  return useQuery({
    queryKey: queryKeys.demo(leadId),
    queryFn: async (): Promise<Demo | null> => {
      const { data, error } = await createClient().from(DEMO_TABLE).select("*").eq("lead_id", leadId).maybeSingle()
      if (error) throw new Error(`Couldn't load the demo: ${error.message}`)
      return data ? toDemo(data as DemoRow) : null
    },
  })
}

export function useCreateDemo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ leadId, template, name, city }: { leadId: number; template: TemplateId; name: string; city: string }) => {
      const { data, error } = await createClient()
        .from(DEMO_TABLE)
        .insert(toDemoInsert(leadId, template, makeSlug(name, city)))
        .select("*")
        .single()
      if (error) throw new Error(`Couldn't create the demo: ${error.message}`)
      return toDemo(data as DemoRow)
    },
    onSuccess: (demo, { leadId }) => queryClient.setQueryData(queryKeys.demo(leadId), demo),
  })
}

// Saves template, overrides or the on/off switch. Shown straight away and
// put back if the save fails.
export function useUpdateDemo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ demo, patch }: { demo: Demo; patch: DemoPatch }) => {
      const { error } = await createClient().from(DEMO_TABLE).update(toDemoUpdate(patch)).eq("id", demo.id)
      if (error) throw new Error(`Couldn't save the demo: ${error.message}`)
    },
    onMutate: async ({ demo, patch }) => {
      const key = queryKeys.demo(demo.leadId)
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Demo | null>(key)
      queryClient.setQueryData<Demo | null>(key, { ...demo, ...patch })
      return { previous, key }
    },
    onError: (_error, _variables, context) => {
      if (context) queryClient.setQueryData(context.key, context.previous)
    },
    onSettled: (_data, _error, { demo }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.demo(demo.leadId) })
    },
  })
}
