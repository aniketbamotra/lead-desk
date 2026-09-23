"use client"

type Props = {
  width: number
  min: number
  max: number
  onResize: (width: number) => void
}

// Drag handle on the drawer's left edge. Also works with arrow keys.
export function ResizeHandle({ width, min, max, onResize }: Props) {
  const clamp = (value: number) => Math.min(max, Math.max(min, value))

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = width
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)

    function onMove(moveEvent: PointerEvent) {
      onResize(clamp(startWidth + (startX - moveEvent.clientX)))
    }
    function onUp() {
      target.removeEventListener("pointermove", onMove)
      target.removeEventListener("pointerup", onUp)
    }
    target.addEventListener("pointermove", onMove)
    target.addEventListener("pointerup", onUp)
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize details panel"
      aria-valuenow={width}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") onResize(clamp(width + 24))
        if (event.key === "ArrowRight") onResize(clamp(width - 24))
      }}
      className="group absolute inset-y-6 -left-2 z-10 flex w-3 cursor-col-resize justify-center rounded-full"
    >
      <span className="h-full w-0.5 rounded-full bg-transparent transition-colors group-hover:bg-line-strong group-focus-visible:bg-coral" />
    </div>
  )
}
