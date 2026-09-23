import type { VerticalConfig } from "./types"

// Dental practices, sourced from the NPPES NPI Registry. The lead_queue
// adapter puts these fields in Lead.details.

const DSO_THRESHOLD = 3

function asNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null
}

export const dental: VerticalConfig = {
  id: "dental",
  displayName: "Dental practices",
  nouns: { singular: "practice", plural: "practices" },

  detailFields: [
    { key: "specialty", label: "Specialty" },
    { key: "taxonomyGroup", label: "Taxonomy group" },
    { key: "npi", label: "NPI" },
    { key: "npiStatus", label: "NPI status" },
    { key: "enumerationDate", label: "Registered" },
    {
      key: "yearsSinceUpdate",
      label: "Last NPPES update",
      format: (value) => {
        const years = asNumber(value)
        if (years === null) return null
        if (years < 1) return "Within the last year"
        return years === 1 ? "1 year ago" : `${Math.round(years)} years ago`
      },
    },
    {
      key: "officialOrgCount",
      label: "Organisations under this official",
      format: (value) => {
        const count = asNumber(value)
        if (count === null) return null
        return count >= DSO_THRESHOLD ? `${count} (likely a dental group)` : String(count)
      },
    },
  ],

  filters: [
    {
      kind: "toggle",
      id: "hideGroupsAndDuplicates",
      label: "Hide DSOs and duplicates",
      defaultOn: true,
      keep: (lead) =>
        lead.details.isDuplicate !== true &&
        (asNumber(lead.details.officialOrgCount) ?? 0) < DSO_THRESHOLD,
    },
    {
      kind: "options",
      id: "specialty",
      label: "Specialty",
      value: (lead) =>
        typeof lead.details.specialty === "string" && lead.details.specialty
          ? lead.details.specialty
          : null,
    },
  ],
}
