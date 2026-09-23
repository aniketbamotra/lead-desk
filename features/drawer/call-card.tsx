"use client"

import { useState } from "react"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import type { Lead } from "@/domain/lead"
import { digitsOnly } from "@/lib/format"
import { useKeys } from "@/features/keyboard/use-key"
import { DrawerCard } from "./drawer-card"

type CopyState = "idle" | "copied" | "failed"

// The one bold spot on the screen: the number and the Call pill.
// Keyed by lead id in the drawer, so "Copied" never carries over to the next lead.
export function CallCard({ lead }: { lead: Lead }) {
  const [copy, setCopy] = useState<CopyState>("idle")
  const phone = lead.phone

  async function copyPhone() {
    if (!phone) return
    try {
      await navigator.clipboard.writeText(phone)
      setCopy("copied")
    } catch {
      setCopy("failed")
    }
    window.setTimeout(() => setCopy("idle"), 1500)
  }

  useKeys({ c: copyPhone }, Boolean(phone))

  if (!phone) {
    return (
      <DrawerCard label="Phone">
        <p className="text-ink-muted">No phone number on record.</p>
      </DrawerCard>
    )
  }

  const digits = digitsOnly(phone)
  const tel = `tel:${digits.length === 10 ? `+1${digits}` : digits}`

  return (
    <DrawerCard label="Phone">
      <p className="tnum text-phone font-light tracking-[-0.02em] select-all">{phone}</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="call" asChild>
          <a href={tel}>
            <Phone aria-hidden />
            Call
          </a>
        </Button>
        <Button variant="secondary" onClick={copyPhone}>
          {copy === "copied" ? "Copied" : copy === "failed" ? "Couldn't copy" : "Copy"}
          <Kbd>C</Kbd>
        </Button>
      </div>
      <span className="sr-only" role="status">
        {copy === "copied" ? "Phone number copied" : ""}
      </span>
    </DrawerCard>
  )
}
