// An unconfirmed trading name (entity only). "Possibly" marks it as a guess
// in words, not just colour.
export function PossibleName({ name, className }: { name: string; className?: string }) {
  return (
    <span className={className} title="Unconfirmed: a trading name seen at this address">
      Possibly {name}
    </span>
  )
}
