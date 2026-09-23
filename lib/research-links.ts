import type { Lead } from "@/domain/lead"
import type { ResearchLink, VerticalConfig } from "@/verticals/types"

const google = (query: string) => `https://www.google.com/search?q=${encodeURIComponent(query)}`
const maps = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

function join(...parts: (string | null | undefined)[]) {
  return parts.filter(Boolean).join(" ")
}

// Core research links for every vertical, then the vertical's own.
export function researchLinks(lead: Lead, vertical: VerticalConfig): ResearchLink[] {
  const { city, state, line1, zip } = lead.address
  const links: ResearchLink[] = [
    { label: "Google the business name", href: google(join(lead.name, city, state)) },
  ]
  if (lead.tradingName) {
    links.push({ label: "Google the trading name", href: google(join(lead.tradingName, city)) })
  }
  if (lead.possibleTradingName) {
    links.push({ label: "Google the possible trading name", href: google(join(lead.possibleTradingName, city)) })
  }
  if (lead.phone) {
    links.push({ label: "Google the phone number", href: google(`"${lead.phone}"`) })
  }
  links.push({
    label: "Find on Google Maps",
    href: maps(join(lead.tradingName ?? lead.name, line1, city, state, zip)),
  })
  return [...links, ...(vertical.researchLinks?.(lead) ?? [])]
}
