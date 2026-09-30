import { parseOverrides, parseTemplate, type Demo, type DemoOverrides, type PracticeBase } from "@/domain/demo"
import type { TemplateId } from "@/templates"
import { toDisplayCase } from "@/lib/display-case"

// The only file that knows the shape of public.demos and public.get_demo
// (supabase/sql/007_demos.sql).

export const DEMO_TABLE = "demos"
export const GET_DEMO_RPC = "get_demo"

export type DemoRow = {
  id: number
  lead_id: number
  template: string
  slug: string
  overrides: unknown
  active: boolean
  updated_at: string
}

/** One row from get_demo(slug): the demo plus the lead fields a template shows. */
export type PublicDemoRow = {
  template: string
  overrides: unknown
  business_name: string | null
  dba_name: string | null
  phone: string | null
  address: string | null
  address_2: string | null
  city: string | null
  state: string | null
  zip: string | null
}

export function toDemo(row: DemoRow): Demo | null {
  const template = parseTemplate(row.template)
  if (!template) return null
  return {
    id: row.id,
    leadId: row.lead_id,
    template,
    slug: row.slug,
    overrides: parseOverrides(row.overrides),
    active: row.active,
    updatedAt: row.updated_at,
  }
}

export function toDemoInsert(leadId: number, template: TemplateId, slug: string) {
  return { lead_id: leadId, template, slug, overrides: {}, active: true }
}

export type DemoPatch = { template?: TemplateId; overrides?: DemoOverrides; active?: boolean }

export function toDemoUpdate(patch: DemoPatch) {
  return {
    ...(patch.template !== undefined && { template: patch.template }),
    ...(patch.overrides !== undefined && { overrides: patch.overrides }),
    ...(patch.active !== undefined && { active: patch.active }),
  }
}

// Registry text arrives in capitals; show it the way the desk does.
function display(value: string | null) {
  return value ? toDisplayCase(value.trim()) : ""
}

export function toPublicDemo(row: PublicDemoRow): { template: TemplateId; base: PracticeBase; overrides: DemoOverrides } | null {
  const template = parseTemplate(row.template)
  if (!template) return null
  return {
    template,
    overrides: parseOverrides(row.overrides),
    base: {
      name: display(row.dba_name) || display(row.business_name),
      phone: row.phone ?? "",
      street: display(row.address),
      suite: display(row.address_2) || null,
      city: display(row.city),
      state: (row.state ?? "").toUpperCase(),
      zip: (row.zip ?? "").slice(0, 5),
    },
  }
}
