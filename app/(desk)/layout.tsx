import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// Protected route group. The proxy already redirects signed-out visitors;
// this check makes the rule hold even if the proxy matcher changes.
export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/sign-in")

  return children
}
