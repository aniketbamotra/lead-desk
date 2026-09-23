import { createBrowserClient } from "@supabase/ssr"
import { supabaseEnv } from "./env"

// Browser client. The session lives in cookies written by @supabase/ssr,
// so the server and proxy see the same session.
export function createClient() {
  const { url, anonKey } = supabaseEnv()
  return createBrowserClient(url, anonKey)
}
