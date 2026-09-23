import type { Lead } from "@/domain/lead"
import { displayWebsite } from "@/lib/url"
import type { VerticalConfig } from "@/verticals/types"
import { DrawerCard } from "./drawer-card"

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })

function formatDate(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : dateFormat.format(date)
}

type Row = { label: string; value: React.ReactNode }

export function DetailsCard({ lead, vertical }: { lead: Lead; vertical: VerticalConfig }) {
  const { line1, line2, city, state, zip } = lead.address
  const address = [line1, line2, [city, [state, zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")]
    .filter(Boolean)
    .join("\n")

  const contact = lead.contact
  const rows: Row[] = [
    { label: "Address", value: address || null },
    {
      label: "Contact",
      value: contact.name ? (
        <>
          {contact.name}
          {contact.title && <span className="block text-ink-muted">{contact.title}</span>}
        </>
      ) : null,
    },
    { label: "Contact phone", value: contact.phone && contact.phone !== lead.phone ? <span className="tnum">{contact.phone}</span> : null },
    { label: "Contact email", value: contact.email },
    {
      label: "Website",
      value: lead.website ? (
        <a href={lead.website} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          {displayWebsite(lead.website)}
        </a>
      ) : null,
    },
    { label: "Review notes", value: lead.reviewNotes },
    { label: "Reviewed", value: formatDate(lead.reviewedAt) },
    ...vertical.detailFields.map((field) => {
      const raw = lead.details[field.key] ?? null
      const value = field.format ? field.format(raw, lead) : raw === null ? null : String(raw)
      return { label: field.label, value }
    }),
  ]

  return (
    <DrawerCard label="Details">
      <dl className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-4 gap-y-2.5">
        {rows
          .filter((row) => row.value !== null && row.value !== "")
          .map((row) => (
            <div key={row.label} className="contents">
              <dt className="text-ink-muted">{row.label}</dt>
              <dd className="break-words whitespace-pre-line">{row.value}</dd>
            </div>
          ))}
      </dl>
    </DrawerCard>
  )
}
