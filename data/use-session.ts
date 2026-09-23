"use client"

import { useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

// Sign-in and sign-out use a full page load, not router.replace: the client
// router can replay a cached "/ → /sign-in" redirect from before the session
// existed, which leaves you stuck on the sign-in page.

export function useSignOut() {
  return useCallback(async () => {
    await createClient().auth.signOut()
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full load on purpose, see top of file
    window.location.assign("/sign-in")
  }, [])
}

export function useSignIn() {
  return useCallback(async (email: string, password: string) => {
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) {
      throw new Error(
        error.code === "invalid_credentials"
          ? "That email and password don't match."
          : `Couldn't sign in: ${error.message}`
      )
    }
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full load on purpose, see top of file
    window.location.assign("/")
  }, [])
}
