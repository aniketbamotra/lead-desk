"use client"

import { useId, useRef, useState } from "react"

type Link = { label: string; href: string }

type Props = {
  links: Link[]
  /** Extra items after the links, e.g. the phone number. */
  footer?: React.ReactNode
  classNames: { button: string; panel: string; link: string }
}

// Small-screen menu on the native popover API: Escape and outside clicks
// close it and focus returns to the button, with no focus-trap code. Closes
// itself when a link is followed.
export function PopoverMenu({ links, footer, classNames }: Props) {
  const id = useId()
  const panel = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" popoverTarget={id} aria-expanded={open} aria-controls={id} className={classNames.button}>
        {open ? "Close" : "Menu"}
      </button>
      <nav
        ref={panel}
        id={id}
        popover="auto"
        aria-label="Main"
        className={classNames.panel}
        onToggle={(event) => setOpen((event as unknown as ToggleEvent).newState === "open")}
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} className={classNames.link} onClick={() => panel.current?.hidePopover()}>
            {link.label}
          </a>
        ))}
        {footer}
      </nav>
    </>
  )
}
