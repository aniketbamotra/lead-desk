"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"

const GROUPS: { title: string; items: { keys: string[]; label: string }[] }[] = [
  {
    title: "Moving around",
    items: [
      { keys: ["J"], label: "Next lead" },
      { keys: ["K"], label: "Previous lead" },
      { keys: ["/"], label: "Search" },
      { keys: ["Esc"], label: "Close the details panel" },
    ],
  },
  {
    title: "Reviewing",
    items: [
      { keys: ["1"], label: "Has website" },
      { keys: ["2"], label: "No website" },
      { keys: ["3"], label: "Disqualify" },
      { keys: ["4"], label: "Skip" },
      { keys: ["5"], label: "Entity only" },
      { keys: ["Z"], label: "Undo the last review" },
    ],
  },
  {
    title: "Calling",
    items: [
      { keys: ["C"], label: "Copy the phone number" },
      { keys: ["L"], label: "Log a call" },
    ],
  },
  {
    title: "Help",
    items: [{ keys: ["?"], label: "Show these shortcuts" }],
  },
]

export function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>They work anywhere except while you&apos;re typing in a field.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5">
          {GROUPS.map((group) => (
            <section key={group.title} className="grid gap-2">
              <h3 className="text-label text-ink-muted">{group.title}</h3>
              <dl className="grid gap-1.5">
                {group.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4">
                    <dt>{item.label}</dt>
                    <dd className="flex gap-1">
                      {item.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
