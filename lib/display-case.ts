// NPPES and similar registries store names in upper case. This converts
// all-caps text to title case for display. Text that already has lower-case
// letters is left alone, since someone typed it that way on purpose.

// Business suffixes, credentials and roman numerals that stay upper case.
const KEEP_UPPER = new Set([
  "LLC", "PLLC", "PC", "PA", "LLP", "PLC", "LP", "DBA", "USA", "US",
  "DDS", "DMD", "MD", "MS", "MSD", "PHD", "RDH", "CEO", "COO", "CFO", "CTO", "VP",
  "II", "III", "IV",
])

// Short joining words, lower case unless they start the text.
const LOWER = new Set(["of", "and", "the", "at", "on", "in", "for", "by", "to", "a", "an", "or"])

const ORDINAL = /^(\d+)(ST|ND|RD|TH)$/
const DIGITS_THEN_LETTERS = /^(\d+)([A-Z]+)$/

function capitalizeWord(word: string) {
  // Mc prefix: MCDONALD -> McDonald
  if (/^MC[A-Z]{2,}$/.test(word)) return "Mc" + word.charAt(2) + word.slice(3).toLowerCase()
  // O'BRIEN -> O'Brien, D'ANGELO -> D'Angelo; SMITH'S -> Smith's
  const apostrophe = word.match(/^([A-Z])'([A-Z]+)$/)
  if (apostrophe) return apostrophe[1] + "'" + apostrophe[2].charAt(0) + apostrophe[2].slice(1).toLowerCase()
  return word.charAt(0) + word.slice(1).toLowerCase()
}

function convertWord(word: string, isFirst: boolean) {
  if (!/[A-Z]/.test(word)) return word
  if (KEEP_UPPER.has(word)) return word

  const ordinal = word.match(ORDINAL)
  if (ordinal) return ordinal[1] + ordinal[2].toLowerCase() // 27TH -> 27th

  const mixed = word.match(DIGITS_THEN_LETTERS)
  if (mixed) {
    // 3SF, 3DMD: short letter runs are likely initials; 143DENTAL -> 143Dental
    return mixed[2].length <= 3 ? word : mixed[1] + capitalizeWord(mixed[2])
  }

  const lower = word.toLowerCase()
  if (!isFirst && LOWER.has(lower)) return lower
  return capitalizeWord(word)
}

export function toDisplayCase(text: string): string {
  if (/[a-z]/.test(text)) return text

  let first = true
  // Split on separators but keep them, so "A/B", "A-B" and "A & B" survive.
  return text
    .split(/([\s/\-&(),.]+)/)
    .map((part) => {
      if (!part || /^[\s/\-&(),.]+$/.test(part)) return part
      const converted = convertWord(part, first)
      first = false
      return converted
    })
    .join("")
}
