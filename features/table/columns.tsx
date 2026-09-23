import { createColumnHelper } from "@tanstack/react-table"
import { StatusMark } from "@/components/ui/status-mark"
import type { Lead } from "@/domain/lead"
import { siteConditionOption } from "@/domain/site-condition"
import { reviewStatusLabel, stageLabel, stageNeedsAction } from "@/domain/vocabularies"
import { formatShortDay, todayISO } from "@/lib/dates"
import { formatPlace } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { leadTableFeatures } from "./table-features"

const helper = createColumnHelper<typeof leadTableFeatures, Lead>()

export const leadColumns = helper.columns([
  helper.accessor("name", {
    id: "business",
    header: "Business",
    sortFn: "text",
    // Rendered by LeadTable so the name can be the row's select button.
  }),
  helper.accessor((lead) => formatPlace(lead) ?? "", {
    id: "place",
    header: "City",
    sortFn: "text",
  }),
  helper.accessor("phone", {
    header: "Phone",
    enableSorting: false,
    cell: (info) => <span className="tnum">{info.getValue() ?? "–"}</span>,
  }),
  helper.accessor((lead) => lead.websiteStatus ?? "", {
    id: "website",
    header: "Website",
    sortFn: "text",
    cell: (info) => <StatusMark status={info.row.original.websiteStatus} />,
  }),
  // Sorts by the stored points; unassessed leads always sort last, so they
  // never outrank an assessed bad site.
  helper.accessor((lead) => lead.siteConditionScore ?? undefined, {
    id: "site",
    header: "Site",
    sortDescFirst: true,
    sortUndefined: "last",
    cell: (info) => {
      const condition = info.row.original.siteCondition
      if (!condition) return null
      const option = siteConditionOption(condition)
      return (
        <span className="truncate" title={option.label}>
          {option.short}
        </span>
      )
    },
  }),
  helper.accessor("reviewStatus", {
    header: "Review",
    sortFn: "text",
    cell: (info) => reviewStatusLabel[info.getValue()],
  }),
  helper.accessor("stage", {
    header: "Stage",
    sortFn: "text",
    cell: (info) => {
      const followUp = info.row.original.nextFollowUp
      const due = followUp !== null && followUp <= todayISO()
      return (
        <span className="grid min-w-0">
          <span className={stageNeedsAction.has(info.getValue()) ? "font-medium" : undefined}>
            {stageLabel[info.getValue()]}
          </span>
          {followUp && (
            <span className={cn("tnum truncate text-label", due ? "text-coral" : "text-ink-muted")}>
              {due ? "Due" : "Follow up"} {formatShortDay(followUp)}
            </span>
          )}
        </span>
      )
    },
  }),
  helper.accessor("score", {
    header: "Score",
    sortDescFirst: true,
    sortUndefined: "last",
    cell: (info) => <span className="tnum">{info.getValue() ?? "–"}</span>,
  }),
  helper.accessor((lead) => lead.contact.name ?? "", {
    id: "contact",
    header: "Contact",
    sortFn: "text",
    cell: (info) => {
      const { name, title } = info.row.original.contact
      if (!name) return <span className="text-ink-muted">–</span>
      return (
        <span className="grid min-w-0">
          <span className="truncate">{name}</span>
          {title && <span className="truncate text-label text-ink-muted">{title}</span>}
        </span>
      )
    },
  }),
])
