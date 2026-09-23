import { ArrowUpRight, Globe } from "lucide-react"
import type { Lead } from "@/domain/lead"
import { researchLinks } from "@/lib/research-links"
import { displayWebsite } from "@/lib/url"
import type { VerticalConfig } from "@/verticals/types"
import { DrawerCard } from "./drawer-card"

export function ResearchCard({ lead, vertical }: { lead: Lead; vertical: VerticalConfig }) {
  const links = researchLinks(lead, vertical)
  return (
    <DrawerCard label="Research">
      <ul className="grid gap-0.5">
        {lead.website && (
          <li>
            <ResearchLink href={lead.website} icon={<Globe aria-hidden className="size-3.5" />}>
              Open {displayWebsite(lead.website)}
            </ResearchLink>
          </li>
        )}
        {links.map((link) => (
          <li key={link.label}>
            <ResearchLink href={link.href} icon={<ArrowUpRight aria-hidden className="size-3.5" />}>
              {link.label}
            </ResearchLink>
          </li>
        ))}
      </ul>
    </DrawerCard>
  )
}

function ResearchLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="-mx-1.5 flex items-center gap-3 rounded-full px-1.5 py-1 text-body hover:bg-panel"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-panel">{icon}</span>
      <span className="truncate">{children}</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
