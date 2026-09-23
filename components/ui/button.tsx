import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Pills: ink for the one primary action in a group, panel grey for the rest,
// white with a line outline for selects and sort. Coral fill is only for Call.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-medium whitespace-nowrap transition-colors select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-ink text-white hover:bg-[#2A2A2A]",
        secondary: "bg-panel text-ink hover:bg-panel-hover aria-expanded:bg-panel-hover",
        outline: "border-line bg-surface text-ink hover:border-line-strong aria-expanded:border-line-strong",
        ghost: "text-ink hover:bg-panel aria-expanded:bg-panel",
        call: "bg-coral text-white hover:bg-coral-hover",
        link: "rounded-none px-0 text-coral underline-offset-2 hover:underline",
      },
      size: {
        default: "h-10 gap-2.5 px-[18px] text-control",
        sm: "h-8 gap-2 px-3.5 text-body",
        icon: "size-10 border-line bg-surface hover:border-line-strong",
        "icon-sm": "size-8 border-line bg-surface hover:border-line-strong",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
