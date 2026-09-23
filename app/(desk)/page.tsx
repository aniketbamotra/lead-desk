import { Desk } from "@/features/desk/desk"
import { createClient } from "@/lib/supabase/server"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function DeskPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const email = typeof data?.claims.email === "string" ? data.claims.email : null

  // Hand the query string to the client so filters and the selected lead
  // start the same on server and client.
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const v of Array.isArray(value) ? value : value === undefined ? [] : [value]) query.append(key, v)
  }

  return <Desk email={email} initialQuery={query.toString()} />
}
