"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSignIn } from "@/data/use-session"

export function SignInForm() {
  const signIn = useSignIn()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSigningIn(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign in.")
      setSigningIn(false)
    }
  }

  return (
    <div className="grid w-full max-w-sm gap-6 rounded-2xl bg-surface p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-ink text-control font-semibold tracking-[-0.02em] text-white">
          LD
        </span>
        <h1 className="text-title font-normal tracking-[-0.01em]">Lead Desk</h1>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-1.5">
          <label htmlFor="email" className="text-label text-ink-muted">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="password" className="text-label text-ink-muted">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && (
          <p className="text-coral" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" disabled={signingIn}>
          {signingIn ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </div>
  )
}
