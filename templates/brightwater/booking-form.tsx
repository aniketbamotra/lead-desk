"use client"

import { useId, useMemo, useState } from "react"
import type { WeekHours } from "../_shared/content"
import { formatTime } from "../_shared/practice"
import { reasons } from "./sample"
import s from "./brightwater.module.css"

const STEP_LABELS = ["Reason", "Date and time", "Your details"]
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const HINTS = [
  "Choose a reason to continue.",
  "Choose a day and a time to continue.",
  "Add your name and a phone number we can call.",
]

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + (m || 0)
}

function toTime(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
}

/** The next six open days, starting tomorrow. */
function openDays(hours: WeekHours) {
  const days: Date[] = []
  const d = new Date()
  for (let i = 1; i <= 21 && days.length < 6; i++) {
    const next = new Date(d)
    next.setDate(d.getDate() + i)
    if (hours[next.getDay()]) days.push(next)
  }
  return days
}

/** Start times every 90 minutes that leave an hour before closing. */
function slotsFor(hours: WeekHours, day: Date | null) {
  const h = day ? hours[day.getDay()] : null
  if (!h) return []
  const slots: string[] = []
  for (let t = toMinutes(h.open); t + 60 <= toMinutes(h.close); t += 90) slots.push(formatTime(toTime(t)))
  return slots
}

// A stepped appointment request. In a demo it sends nothing; when the site
// goes live, submit() should post to the practice's booking system or inbox.
export function BookingForm({ hours, phone }: { hours: WeekHours; phone: string }) {
  const id = useId()
  const [step, setStep] = useState(0)
  const [reason, setReason] = useState<string | null>(null)
  const [dayIndex, setDayIndex] = useState<number | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [tel, setTel] = useState("")
  const [isNew, setIsNew] = useState(true)
  const [done, setDone] = useState(false)
  const [showHint, setShowHint] = useState(false)

  // Dates depend on today, so they're computed in the browser only.
  const days = useMemo(() => (typeof window === "undefined" ? [] : openDays(hours)), [hours])
  const day = dayIndex !== null ? days[dayIndex] ?? null : null
  const slots = slotsFor(hours, day)

  const valid = [!!reason, day !== null && time !== null && slots.includes(time), name.trim().length > 1 && tel.replace(/\D/g, "").length >= 10]

  function next() {
    if (!valid[step]) {
      setShowHint(true)
      return
    }
    setShowHint(false)
    if (step < 2) setStep(step + 1)
    else setDone(true)
  }

  function reset() {
    setStep(0)
    setReason(null)
    setDayIndex(null)
    setTime(null)
    setName("")
    setTel("")
    setDone(false)
  }

  if (done) {
    const when = day?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    return (
      <div className={s.done} role="status">
        <span className={s.doneMark} aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className={s.doneTitle}>Thanks, {name.trim().split(" ")[0]}.</h3>
        <p className={s.doneText}>
          We&apos;ve noted {reason?.toLowerCase()} on {when} around {time}
          {isNew ? " as a new patient" : ""}. Expect a call at {tel} within one business day. Need us sooner? Call {phone}.
        </p>
        <button type="button" onClick={reset} className={s.btnGhost}>
          Make another request
        </button>
      </div>
    )
  }

  return (
    <div>
      <ol className={s.stepBars} aria-label="Progress">
        {STEP_LABELS.map((label, i) => (
          <li key={label} data-active={i <= step} aria-current={i === step ? "step" : undefined}>
            <span className={s.stepBar} />
            <span className={s.stepLabel}>{label}</span>
          </li>
        ))}
      </ol>
      <p className={s.srOnly} aria-live="polite">
        Step {step + 1} of 3: {STEP_LABELS[step]}
      </p>

      {step === 0 && (
        <fieldset className={s.fieldset}>
          <legend className={s.legend}>What&apos;s the visit for?</legend>
          <div className={s.reasonGrid}>
            {reasons.map((r) => (
              <button key={r} type="button" aria-pressed={reason === r} onClick={() => setReason(r)} className={s.choice}>
                {r}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className={s.fieldset}>
          <legend className={s.legend}>Choose a day</legend>
          <div className={s.dayGrid}>
            {days.map((d, i) => (
              <button
                key={d.toDateString()}
                type="button"
                aria-pressed={dayIndex === i}
                aria-label={d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                onClick={() => {
                  setDayIndex(i)
                  if (time && !slotsFor(hours, d).includes(time)) setTime(null)
                }}
                className={`${s.choice} ${s.dayChoice}`}
              >
                <span className={s.dow}>{DOW[d.getDay()]}</span>
                <span className={s.date}>{d.getDate()}</span>
              </button>
            ))}
          </div>
          <p className={s.legend} id={`${id}-time`}>
            Preferred time
          </p>
          {day ? (
            <div className={s.timeRow} role="group" aria-labelledby={`${id}-time`}>
              {slots.map((t) => (
                <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)} className={`${s.choice} ${s.timeChoice}`}>
                  {t}
                </button>
              ))}
            </div>
          ) : (
            <p className={s.formNote}>Pick a day to see times.</p>
          )}
        </fieldset>
      )}

      {step === 2 && (
        <div className={s.detailsGrid}>
          <label className={s.field}>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Jordan Lee" />
          </label>
          <label className={s.field}>
            Phone
            <input value={tel} onChange={(e) => setTel(e.target.value)} type="tel" autoComplete="tel" inputMode="tel" placeholder="Your mobile number" />
          </label>
          <label className={s.checkbox}>
            <input type="checkbox" checked={isNew} onChange={() => setIsNew(!isNew)} />
            I&apos;m a new patient
          </label>
        </div>
      )}

      <div className={s.formNav}>
        {step > 0 && (
          <button type="button" onClick={() => { setStep(step - 1); setShowHint(false) }} className={s.back}>
            Back
          </button>
        )}
        <p className={s.formHint} role={showHint ? "alert" : undefined}>
          {showHint ? HINTS[step] : `Step ${step + 1} of 3`}
        </p>
        <button type="button" onClick={next} className={s.btnPrimary}>
          {step < 2 ? "Continue" : "Send request"}
        </button>
      </div>
    </div>
  )
}
