/**
 * A short name for an email: "you" for the signed-in user, otherwise the
 * first part of the address ("priya.s@…" -> "Priya").
 */
export function personName(email: string | null, me: string | null) {
  if (!email) return null
  if (me && email.toLowerCase() === me.toLowerCase()) return "you"
  const first = email.split("@")[0].split(/[._\-+\d]/).find(Boolean) ?? email
  return first.charAt(0).toUpperCase() + first.slice(1)
}
