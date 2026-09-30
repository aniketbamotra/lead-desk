import "server-only"
import { cache } from "react"
import { createClient } from "@supabase/supabase-js"
import { buildDemoContent } from "@/domain/demo"
import type { DemoContent } from "@/templates/_shared/content"
import type { TemplateId } from "@/templates"
import { supabaseEnv } from "@/lib/supabase/env"
import { GET_DEMO_RPC, toPublicDemo, type PublicDemoRow } from "./adapters/demos"

// Reads a demo for a signed-out visitor. Uses the anon key with no session:
// get_demo is the only thing anon can call, and it returns nothing for a
// switched-off link or a lost lead. Cached per request so the page and its
// metadata share one call.
export const getDemo = cache(async (slug: string): Promise<{ template: TemplateId; content: DemoContent } | null> => {
  const { url, anonKey } = supabaseEnv()
  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await supabase.rpc(GET_DEMO_RPC, { p_slug: slug })
  if (error) {
    console.error(`[demo] Couldn't load demo ${slug}: ${error.message}`)
    return null
  }
  const row = (data as PublicDemoRow[] | null)?.[0]
  const demo = row ? toPublicDemo(row) : null
  if (!demo) return null
  return { template: demo.template, content: buildDemoContent(demo.base, demo.overrides) }
})
