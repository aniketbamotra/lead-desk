import type { Lead } from "@/domain/lead"

const countFormat = new Intl.NumberFormat("en-US")

export function formatCount(value: number) {
  return countFormat.format(value)
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatPlace(lead: Lead) {
  const { city, state } = lead.address
  if (city && state) return `${city}, ${state}`
  return city ?? state ?? null
}

export function digitsOnly(text: string) {
  return text.replace(/\D/g, "")
}
