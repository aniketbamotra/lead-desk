/**
 * Turns what someone pastes ("example.com", "https://example.com/about")
 * into a URL, or null if it can't be one.
 */
export function normalizeWebsite(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(withScheme)
    if (!url.hostname.includes(".") || /\s/.test(trimmed)) return null
    return url.toString().replace(/\/$/, "")
  } catch {
    return null
  }
}

/** "https://www.example.com/" -> "example.com" for display. */
export function displayWebsite(url: string) {
  return url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "")
}
