import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { supabaseEnv } from "./env"

// Paths a signed-out visitor may open.
const PUBLIC_PATHS = ["/sign-in"]

// Refreshes the session cookie on every request and sends signed-out
// visitors to /sign-in. Called from the root proxy.ts.
export async function updateSession(request: NextRequest) {
  const { url, anonKey } = supabaseEnv()
  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
        // Cache headers that stop a CDN serving one user's session to another.
        Object.entries(headers ?? {}).forEach(([key, value]) =>
          response.headers.set(key, value)
        )
      },
    },
  })

  // Don't put code between createServerClient and getClaims: getClaims is
  // what triggers the refresh and verifies the token.
  const { data, error } = await supabase.auth.getClaims()
  const signedIn = Boolean(data?.claims)
  // "No session" is normal; anything else (network, TLS) looks like being
  // signed out, so say so in the dev terminal.
  if (error && error.name !== "AuthSessionMissingError") {
    console.error(`[auth] Couldn't verify the session: ${error.message}`, error.cause ?? "")
  }
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))

  if (!signedIn && !isPublic) {
    const signIn = request.nextUrl.clone()
    signIn.pathname = "/sign-in"
    signIn.search = ""
    return copyCookies(response, NextResponse.redirect(signIn))
  }

  if (signedIn && pathname === "/sign-in") {
    const home = request.nextUrl.clone()
    home.pathname = "/"
    home.search = ""
    return copyCookies(response, NextResponse.redirect(home))
  }

  return response
}

// A redirect must carry any refreshed session cookies, or the browser and
// server drift out of sync and the user gets signed out.
function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie))
  return to
}
