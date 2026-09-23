// Site condition: a person's judgement of a lead's website, answering "do they
// need what I sell". Separate from qual_score ("is this the kind of business I
// want"); the two are combined only when sorting.
//
// PROVISIONAL: the points are a first guess, to be tuned after real calls.
// Tune labels and points here only; the control, the table, the filter and
// the stored site_condition_score all read this list. The score is stored
// when an assessment is saved, so after changing points, refresh existing
// rows with the SQL noted in CLAUDE.md.
//
// Ordered best prospect first.

export const SITE_CONDITIONS = [
  { key: "broken", label: "Broken or not loading", short: "Broken", points: 30 },
  { key: "outdated", label: "Dated design, looks years old", short: "Outdated", points: 25 },
  { key: "not_mobile", label: "Doesn't work properly on mobile", short: "Not mobile-friendly", points: 25 },
  { key: "thin", label: "Barely any content, one page", short: "Thin", points: 20 },
  { key: "social_only", label: "Facebook page instead of a website", short: "Social only", points: 20 },
  { key: "directory_only", label: "Only a listing on a directory site", short: "Directory only", points: 20 },
  { key: "template", label: "Generic template, no personality", short: "Template", points: 15 },
  { key: "decent", label: "Fine, could be better", short: "Decent", points: 5 },
  { key: "modern", label: "Modern and well built", short: "Modern", points: 0 },
] as const

export type SiteCondition = (typeof SITE_CONDITIONS)[number]["key"]

const byKey = new Map<string, (typeof SITE_CONDITIONS)[number]>(SITE_CONDITIONS.map((c) => [c.key, c]))

export function isSiteCondition(value: string | null): value is SiteCondition {
  return value !== null && byKey.has(value)
}

export function siteConditionOption(key: SiteCondition) {
  return byKey.get(key)!
}
