// Follow-up dates are date-only (YYYY-MM-DD) and compared in local time.

const pad = (n: number) => String(n).padStart(2, "0")

function toISODate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function addDaysISO(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

/** Next Monday (or the Monday after, if today is Monday). */
export function nextWeekISO() {
  const date = new Date()
  const daysToMonday = ((8 - date.getDay()) % 7) || 7
  date.setDate(date.getDate() + daysToMonday)
  return toISODate(date)
}

function parseISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

const dayFormat = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" })
const shortDayFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })

/** "Today", "Tomorrow", "Yesterday", or "Tue, Sep 30". */
export function formatFollowUp(iso: string) {
  const today = todayISO()
  if (iso === today) return "Today"
  if (iso === addDaysISO(1)) return "Tomorrow"
  if (iso === addDaysISO(-1)) return "Yesterday"
  return dayFormat.format(parseISODate(iso))
}

/** "Sep 30" for tight spaces like a table cell. */
export function formatShortDay(iso: string) {
  return shortDayFormat.format(parseISODate(iso))
}

/** For timelines: "Today, 2:14 PM", "Yesterday, 9:02 AM", "Sep 20, 4:40 PM". */
export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return timestamp
  const day = toISODate(date)
  const time = timeFormat.format(date)
  if (day === todayISO()) return `Today, ${time}`
  if (day === addDaysISO(-1)) return `Yesterday, ${time}`
  return `${shortDayFormat.format(date)}, ${time}`
}
