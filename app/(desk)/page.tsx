import { Desk } from "@/features/desk/desk"
import { createClient } from "@/lib/supabase/server"

export default async function DeskPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const email = typeof data?.claims.email === "string" ? data.claims.email : null
  return <Desk email={email} />
}
