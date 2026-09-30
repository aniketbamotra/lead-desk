import type { DayHours, DemoContent, WeekHours } from "@/templates/_shared/content"
import { DEFAULT_HOURS } from "@/templates/_shared/practice"
import { isTemplateId, type TemplateId } from "@/templates"
import type { Lead } from "./lead"

// A personalised concept site for one lead, shown to the prospect before a
// call. The lead supplies name, phone and address; overrides hold the text
// and hours a person types in per client.

export type DemoOverrides = {
  /** The name to show, when it differs from the lead's trading or legal name. */
  name?: string
  headline?: string
  intro?: string
  email?: string
  /** The practice's own online booking page. */
  bookUrl?: string
  hours?: WeekHours
}

export type Demo = {
  id: number
  leadId: number
  template: TemplateId
  slug: string
  overrides: DemoOverrides
  /** False takes the link down. */
  active: boolean
  updatedAt: string
}

/** Practice details that come from the lead, before any overrides. */
export type PracticeBase = {
  name: string
  phone: string
  street: string
  suite: string | null
  city: string
  state: string
  zip: string
}

export function practiceBaseFromLead(lead: Lead): PracticeBase {
  return {
    name: lead.tradingName ?? lead.name,
    phone: lead.phone ?? "",
    street: lead.address.line1 ?? "",
    suite: lead.address.line2,
    city: lead.address.city ?? "",
    state: lead.address.state ?? "",
    zip: (lead.address.zip ?? "").slice(0, 5),
  }
}

/** What a template renders: lead details, with the person's overrides on top. */
export function buildDemoContent(base: PracticeBase, o: DemoOverrides): DemoContent {
  return {
    practice: {
      ...base,
      name: o.name ?? base.name,
      email: o.email ?? null,
      hours: o.hours ?? DEFAULT_HOURS,
      bookUrl: o.bookUrl ?? null,
    },
    headline: o.headline ?? null,
    intro: o.intro ?? null,
  }
}

// ---- Parsing stored overrides ----

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function day(value: unknown): DayHours {
  if (!value || typeof value !== "object") return null
  const { open, close } = value as { open?: unknown; close?: unknown }
  return typeof open === "string" && typeof close === "string" && TIME.test(open) && TIME.test(close) && open < close
    ? { open, close }
    : null
}

/** Reads overrides from the database, dropping anything malformed. */
export function parseOverrides(value: unknown): DemoOverrides {
  if (!value || typeof value !== "object") return {}
  const v = value as Record<string, unknown>
  const out: DemoOverrides = {}
  for (const key of ["name", "headline", "intro", "email", "bookUrl"] as const) {
    const t = text(v[key])
    if (t) out[key] = t
  }
  if (Array.isArray(v.hours) && v.hours.length === 7) out.hours = v.hours.map(day) as WeekHours
  return out
}

export function parseTemplate(value: unknown): TemplateId | null {
  return typeof value === "string" && isTemplateId(value) ? value : null
}

/** "Riverside Family Dental", "Raleigh" -> "riverside-family-dental-raleigh-k7q2m9". */
export function makeSlug(name: string, city: string) {
  const words = `${name} ${city}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "")
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  const suffix = Array.from(bytes, (b) => "abcdefghijkmnpqrstuvwxyz23456789"[b % 32]).join("")
  return `${words}-${suffix}`
}
