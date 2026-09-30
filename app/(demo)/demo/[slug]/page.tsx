import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getDemo } from "@/data/get-demo"
import { isTemplateId } from "@/templates"
import { TEMPLATE_COMPONENTS } from "@/templates/components"
import { ConceptNote } from "@/features/demo/concept-note"

// A prospect's personalised concept site. Rendered on every request, so an
// edit made during a call shows on the next refresh; there's no cache to clear.
export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
  /** ?template= shows another template for viewing; the saved one is the default. */
  searchParams: Promise<{ template?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const demo = await getDemo(slug)
  return {
    title: demo ? `${demo.content.practice.name}: website concept` : "Website concept",
    robots: { index: false, follow: false },
  }
}

export default async function DemoPage({ params, searchParams }: Props) {
  const [{ slug }, { template: requested }] = await Promise.all([params, searchParams])
  const demo = await getDemo(slug)
  if (!demo) notFound()
  const template = requested && isTemplateId(requested) ? requested : demo.template
  const Template = TEMPLATE_COMPONENTS[template]
  return (
    <>
      <ConceptNote
        name={demo.content.practice.name}
        template={template}
        hrefFor={(id) => (id === demo.template ? `/demo/${slug}` : `/demo/${slug}?template=${id}`)}
      />
      <Template content={demo.content} />
    </>
  )
}
