import "server-only"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { supabaseEnv } from "./env"

// Server client for server components and route handlers. Create a new one
// per request; never share it.
export async function createClient() {
  // Read cookies first: it marks the route as per-request, so Next never
  // tries to prerender a page that needs a session.
  const cookieStore = await cookies()
  const { url, anonKey } = supabaseEnv()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server components can't set cookies. The proxy refreshes the
          // session on every request, so this is safe to ignore there.
        }
      },
    },
  })
}
