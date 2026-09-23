"use client"

import { useState } from "react"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import type { Lead } from "@/domain/lead"
import { formatFollowUp, todayISO } from "@/lib/dates"
import { digitsOnly } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useKeys } from "@/features/keyboard/use-key"
import { DrawerCard } from "./drawer-card"
import { LogCallForm, type LoggedCall } from "./log-call-form"

type CopyState = "idle" | "copied" | "failed"

/** "Follow up tomorrow", "Follow up on Tue, Sep 30", "Follow-up was due yesterday". */
function followUpText(iso: string) {
  const label = formatFollowUp(iso)
  const when = ["Today", "Tomorrow", "Yesterday"].includes(label) ? label.toLowerCase() : `on ${label}`
  return iso < todayISO() ? `Follow-up was due ${when}` : `Follow up ${when}`
}

type Props = {
  lead: Lead
  onLogCall: (call: LoggedCall) => void
  onClearFollowUp: () => void
}

// The one bold spot on the screen: the number and the Call pill.
// Keyed by lead id in the drawer, so "Copied" and an open form never carry
// over to the next lead.
export function CallCard({ lead, onLogCall, onClearFollowUp }: Props) {
  const [copy, setCopy] = useState<CopyState>("idle")
  const [logging, setLogging] = useState(false)
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

  useKeys({ c: copyPhone, l: () => setLogging(true) })

  const digits = phone ? digitsOnly(phone) : ""
  const tel = `tel:${digits.length === 10 ? `+1${digits}` : digits}`
  const followUpDue = lead.nextFollowUp !== null && lead.nextFollowUp <= todayISO()

  return (
    <DrawerCard label="Phone">
      {phone ? (
        <p className="tnum text-phone font-light tracking-[-0.02em] select-all">{phone}</p>
      ) : (
        <p className="text-ink-muted">No phone number on record.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {phone && (
          <>
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
          </>
        )}
        {!logging && (
          <Button variant="secondary" onClick={() => setLogging(true)}>
            Log call <Kbd>L</Kbd>
          </Button>
        )}
      </div>

      {lead.nextFollowUp && !logging && (
        <p className="flex items-center gap-2">
          <span className={cn(followUpDue ? "text-coral" : "text-ink-muted")}>{followUpText(lead.nextFollowUp)}</span>
          <button type="button" onClick={onClearFollowUp} className="text-label text-ink-muted underline underline-offset-2 hover:text-ink">
            Clear
          </button>
        </p>
      )}

      {logging && (
        <LogCallForm
          currentFollowUp={lead.nextFollowUp}
          onCancel={() => setLogging(false)}
          onSave={(call) => {
            onLogCall(call)
            setLogging(false)
          }}
        />
      )}

      <span className="sr-only" role="status">
        {copy === "copied" ? "Phone number copied" : ""}
      </span>
    </DrawerCard>
  )
}
