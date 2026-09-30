import { TEMPLATE_IDS, type TemplateId } from "@/templates"
import { TemplateSwitcher } from "./template-switcher"

// Who prepared the concept, plus a template switcher. Shown above every
// demo so it's never mistaken for the practice's live site, and so another
// template is one click away during a call. Change the name here.
const AUTHOR = "Aniket Bamotra"

type Props = {
  name: string
  template: TemplateId
  /** Builds the address that shows a given template. */
  hrefFor: (id: TemplateId) => string
}

export function ConceptNote({ name, template, hrefFor }: Props) {
  const hrefs = Object.fromEntries(TEMPLATE_IDS.map((id) => [id, hrefFor(id)])) as Record<TemplateId, string>
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-b border-white/15 bg-ink px-4 py-2 text-center text-label text-white">
      <p>
        A website concept for {name}, prepared by {AUTHOR}. Not the practice&apos;s live site.
      </p>
      <TemplateSwitcher current={template} hrefs={hrefs} />
    </div>
  )
}
