// Only these two values are public. They must be read as literal
// `process.env.NEXT_PUBLIC_*` expressions so Next can inline them into the
// browser bundle. Every other key stays in server-only code.
export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase settings. Copy .env.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  return { url, anonKey }
}
