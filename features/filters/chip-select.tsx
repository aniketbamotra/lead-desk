import { Chip } from "@/components/ui/chip"

type Props<T extends string> = {
  options: readonly T[]
  labels: Record<T, string>
  selected: T[]
  onChange: (next: T[]) => void
}

// A short, fixed vocabulary shown as chips. Nothing selected means "any".
export function ChipSelect<T extends string>({ options, labels, selected, onChange }: Props<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const pressed = selected.includes(option)
        return (
          <Chip
            key={option}
            pressed={pressed}
            onClick={() =>
              onChange(pressed ? selected.filter((s) => s !== option) : [...selected, option])
            }
          >
            {labels[option]}
          </Chip>
        )
      })}
    </div>
  )
}
