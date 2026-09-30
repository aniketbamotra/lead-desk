import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { isTemplateId, TEMPLATES } from "@/templates"
import { TEMPLATE_COMPONENTS } from "@/templates/components"
import { SAMPLE_CONTENT } from "@/templates/_shared/sample-practice"
import { ConceptNote } from "@/features/demo/concept-note"

// Each template filled with a fictional practice, for choosing a template
// and checking changes without a lead. Public: it holds no real data.

type Props = { params: Promise<{ template: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { template } = await params
  const info = TEMPLATES.find((t) => t.id === template)
  return {
    title: info ? `${info.name} template preview` : "Template preview",
    robots: { index: false, follow: false },
  }
}

export default async function TemplatePreviewPage({ params }: Props) {
  const { template } = await params
  if (!isTemplateId(template)) notFound()
  const Template = TEMPLATE_COMPONENTS[template]
  return (
    <>
      <ConceptNote name={SAMPLE_CONTENT.practice.name} template={template} hrefFor={(id) => `/demo/preview/${id}`} />
      <Template content={SAMPLE_CONTENT} />
    </>
  )
}
