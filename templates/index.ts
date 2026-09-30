// Template list for the desk. Metadata only, so the drawer can offer
// templates without loading their code; components live in ./components.

export const TEMPLATE_IDS = ["clearview", "brightwater", "fifth-street", "harlow"] as const
export type TemplateId = (typeof TEMPLATE_IDS)[number]

export type TemplateInfo = {
  id: TemplateId
  name: string
  /** One line for choosing between them. */
  description: string
  /** The vertical these templates are written for. */
  vertical: string
}

export const TEMPLATES: TemplateInfo[] = [
  { id: "clearview", name: "Clearview", description: "Clean and clinical, teal", vertical: "dental" },
  { id: "brightwater", name: "Brightwater", description: "Warm and editorial, serif, real photos", vertical: "dental" },
  { id: "fifth-street", name: "Fifth Street", description: "Bold and friendly, yellow and black", vertical: "dental" },
  { id: "harlow", name: "Harlow", description: "Quiet luxury for cosmetic work, dark", vertical: "dental" },
]

export function isTemplateId(value: string): value is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(value)
}

export function templatesFor(vertical: string) {
  return TEMPLATES.filter((t) => t.vertical === vertical)
}
