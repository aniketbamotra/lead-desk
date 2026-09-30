// The one input every template takes. Plain data with no app or database
// types, so a template can be copied into a client's own project together
// with its content.json.

/** 24-hour "08:00"-style times, or null when closed. */
export type DayHours = { open: string; close: string } | null

/** Index 0 is Sunday, 6 is Saturday. */
export type WeekHours = [DayHours, DayHours, DayHours, DayHours, DayHours, DayHours, DayHours]

export type Practice = {
  name: string
  phone: string
  email: string | null
  street: string
  suite: string | null
  city: string
  state: string
  zip: string
  hours: WeekHours
  /** The practice's own online booking page, if it has one. */
  bookUrl: string | null
}

export type DemoContent = {
  practice: Practice
  /** Replaces the template's hero headline. */
  headline: string | null
  /** Replaces the line under the headline. */
  intro: string | null
}

export type TemplateProps = { content: DemoContent }
