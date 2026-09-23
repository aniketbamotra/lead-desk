// A US address's time zone, from its state, with ZIP prefixes for the states
// split across two zones. Close enough for deciding when to call: a few
// border counties (western Kansas, Michigan's Upper Peninsula, Aleutians)
// follow their state's main zone here.

const EASTERN = "America/New_York"
const CENTRAL = "America/Chicago"
const MOUNTAIN = "America/Denver"
const PACIFIC = "America/Los_Angeles"

const STATE_ZONES: Record<string, string> = {
  AL: CENTRAL, AK: "America/Anchorage", AZ: "America/Phoenix", AR: CENTRAL, CA: PACIFIC,
  CO: MOUNTAIN, CT: EASTERN, DC: EASTERN, DE: EASTERN, FL: EASTERN, GA: EASTERN,
  HI: "Pacific/Honolulu", ID: "America/Boise", IL: CENTRAL, IN: "America/Indiana/Indianapolis",
  IA: CENTRAL, KS: CENTRAL, KY: EASTERN, LA: CENTRAL, ME: EASTERN, MD: EASTERN, MA: EASTERN,
  MI: "America/Detroit", MN: CENTRAL, MS: CENTRAL, MO: CENTRAL, MT: MOUNTAIN, NE: CENTRAL,
  NV: PACIFIC, NH: EASTERN, NJ: EASTERN, NM: MOUNTAIN, NY: EASTERN, NC: EASTERN, ND: CENTRAL,
  OH: EASTERN, OK: CENTRAL, OR: PACIFIC, PA: EASTERN, RI: EASTERN, SC: EASTERN, SD: CENTRAL,
  TN: CENTRAL, TX: CENTRAL, UT: MOUNTAIN, VT: EASTERN, VA: EASTERN, WA: PACIFIC, WV: EASTERN,
  WI: CENTRAL, WY: MOUNTAIN,
  PR: "America/Puerto_Rico", VI: "America/St_Thomas", GU: "Pacific/Guam",
  AS: "Pacific/Pago_Pago", MP: "Pacific/Saipan",
}

/** First three ZIP digits that differ from their state's main zone. */
const ZIP_PREFIX_ZONES: Record<string, Record<string, string>> = {
  FL: { "324": CENTRAL, "325": CENTRAL }, // panhandle west of the Apalachicola
  IN: { "463": CENTRAL, "464": CENTRAL, "476": CENTRAL, "477": CENTRAL }, // Gary, Evansville
  KY: { "420": CENTRAL, "421": CENTRAL, "422": CENTRAL, "423": CENTRAL, "424": CENTRAL }, // western Kentucky
  TN: { "373": EASTERN, "374": EASTERN, "376": EASTERN, "377": EASTERN, "378": EASTERN, "379": EASTERN }, // east Tennessee
  TX: { "798": MOUNTAIN, "799": MOUNTAIN, "885": MOUNTAIN }, // El Paso
  ND: { "586": MOUNTAIN }, // southwest
  SD: { "577": MOUNTAIN }, // Rapid City and west
  NE: { "693": MOUNTAIN }, // panhandle
  ID: { "835": PACIFIC, "838": PACIFIC }, // northern panhandle
  OR: { "979": "America/Boise" }, // Malheur County
}

/** IANA time zone for a US state and ZIP, or null when the state is unknown. */
export function usTimeZone(state: string | null, zip: string | null): string | null {
  if (!state) return null
  const code = state.trim().toUpperCase()
  const prefix = zip?.trim().slice(0, 3)
  return (prefix && ZIP_PREFIX_ZONES[code]?.[prefix]) || STATE_ZONES[code] || null
}

const partsFormats = new Map<string, Intl.DateTimeFormat>()
const longNameFormats = new Map<string, Intl.DateTimeFormat>()

function cached(cache: Map<string, Intl.DateTimeFormat>, zone: string, options: Intl.DateTimeFormatOptions) {
  let format = cache.get(zone)
  if (!format) {
    format = new Intl.DateTimeFormat("en-US", { timeZone: zone, ...options })
    cache.set(zone, format)
  }
  return format
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export type LocalTime = {
  /** "2:14 PM" */
  time: string
  /** "EDT", "CST", "HST" */
  zoneName: string
  /** "Eastern Daylight Time", for a tooltip. */
  zoneLongName: string
  /** 0 = Sunday. */
  weekday: number
  /** Minutes since local midnight. */
  minutes: number
}

export function localTime(zone: string, now: Date): LocalTime {
  const parts = cached(partsFormats, zone, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).formatToParts(now)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? ""

  const hour12 = Number(part("hour"))
  const minute = Number(part("minute"))
  const pm = part("dayPeriod") === "PM"
  const hour24 = (hour12 % 12) + (pm ? 12 : 0)

  const zoneLongName =
    cached(longNameFormats, zone, { timeZoneName: "long" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? zone

  return {
    time: `${hour12}:${part("minute")} ${part("dayPeriod")}`,
    zoneName: part("timeZoneName"),
    zoneLongName,
    weekday: WEEKDAYS.indexOf(part("weekday")),
    minutes: hour24 * 60 + minute,
  }
}

/** Minutes ahead of UTC right now (Eastern daylight time is -240). For sorting. */
export function utcOffsetMinutes(zone: string, now: Date): number {
  const { minutes } = localTime(zone, now)
  const utc = now.getUTCHours() * 60 + now.getUTCMinutes()
  let offset = minutes - utc
  if (offset > 14 * 60) offset -= 24 * 60
  if (offset < -14 * 60) offset += 24 * 60
  return offset
}
