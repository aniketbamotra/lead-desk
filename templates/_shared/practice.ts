import type { DayHours, Practice, WeekHours } from "./content"

// Helpers every template uses to turn practice data into display text and
// links. Pure functions only, so templates stay server components.

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "")
  if (digits.length !== 10) return phone
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "")
  return digits.length === 10 ? `tel:+1${digits}` : `tel:${digits}`
}

export function cityLine(p: Practice) {
  return `${p.city}, ${p.state} ${p.zip}`.trim()
}

/** "1204 E 5th Street" -> "E 5th Street": the street without its number. */
export function streetName(p: Practice) {
  return p.street.replace(/^\s*\d+[A-Za-z]?(-\d+)?\s+/, "")
}

export function fullAddress(p: Practice) {
  return [p.street, p.suite, cityLine(p)].filter(Boolean).join(", ")
}

/** Keyless Google Maps embed of the practice address, at street level. */
export function mapEmbedUrl(p: Practice) {
  // The address alone: adding the name turns it into a zoomed-out search.
  return `https://www.google.com/maps?q=${encodeURIComponent(fullAddress(p))}&z=16&output=embed`
}

export function directionsUrl(p: Practice) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress(p))}`
}

/** Where "Book" buttons go: the practice's booking page, or the page's own booking section. */
export function bookHref(p: Practice) {
  return p.bookUrl ?? "#book"
}

// ---- Hours ----

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
/** Monday first, Sunday last: how opening hours are read in the US. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

/** A neutral default until real hours are filled in. */
export const DEFAULT_HOURS: WeekHours = [
  null,
  { open: "08:00", close: "17:00" },
  { open: "08:00", close: "17:00" },
  { open: "08:00", close: "17:00" },
  { open: "08:00", close: "17:00" },
  { open: "08:00", close: "14:00" },
  null,
]

function minutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + (m || 0)
}

/** "08:00" -> "8am", "17:30" -> "5:30pm". */
export function formatTime(time: string) {
  const total = minutes(time)
  const h = Math.floor(total / 60)
  const m = total % 60
  const suffix = h >= 12 ? "pm" : "am"
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`
}

export function formatDayHours(day: DayHours) {
  return day ? `${formatTime(day.open)} – ${formatTime(day.close)}` : "Closed"
}

export type HoursRow = {
  /** "Monday – Thursday" or "Friday". */
  label: string
  time: string
  /** Days covered, 0 = Sunday. */
  days: number[]
  /** Open until 6pm or later. */
  late: boolean
}

/** Consecutive days with the same hours, grouped into one row. */
export function hoursRows(hours: WeekHours): HoursRow[] {
  const rows: HoursRow[] = []
  for (const day of WEEK_ORDER) {
    const time = formatDayHours(hours[day])
    const last = rows[rows.length - 1]
    if (last && last.time === time) {
      last.days.push(day)
    } else {
      const h = hours[day]
      rows.push({ label: "", time, days: [day], late: !!h && minutes(h.close) >= 18 * 60 })
    }
  }
  for (const row of rows) {
    const first = DAY_NAMES[row.days[0]]
    const lastDay = DAY_NAMES[row.days[row.days.length - 1]]
    row.label = row.days.length === 1 ? first : `${first} – ${lastDay}`
  }
  return rows
}

/** Facts derived from the hours, so claims like "Open Saturdays" are only made when true. */
export function hoursFacts(hours: WeekHours) {
  const weekdays = [1, 2, 3, 4, 5].map((d) => hours[d]).filter((h): h is NonNullable<DayHours> => h !== null)
  const lateDays = [1, 2, 3, 4, 5].filter((d) => {
    const h = hours[d]
    return h !== null && minutes(h.close) >= 18 * 60
  })
  return {
    saturday: hours[6] !== null,
    earlyMornings: weekdays.some((h) => minutes(h.open) <= 7 * 60 + 30),
    lateDays: lateDays.map((d) => DAY_NAMES[d]),
  }
}

/** Joins ["Tuesday", "Thursday"] into "Tuesdays and Thursdays". */
export function pluralDays(days: string[]) {
  const plural = days.map((d) => `${d}s`)
  if (plural.length <= 1) return plural.join("")
  return `${plural.slice(0, -1).join(", ")} and ${plural[plural.length - 1]}`
}
