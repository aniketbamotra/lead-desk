// Hand-drawn service illustrations: a yellow blob behind an outlined object.
// Colours come from the page's CSS variables.

const common = {
  width: 80,
  height: 80,
  viewBox: "0 0 80 80",
  "aria-hidden": true,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}
const blob = { stroke: "none", style: { fill: "var(--yellow)" } }
const paper = { style: { fill: "var(--bg)" } }

export const serviceIcons: Record<string, React.ReactNode> = {
  checkups: (
    <svg {...common}>
      <path d="M44 14c14 2 25 12 24 27-1 16-14 26-29 25-15-1-26-12-25-27 1-15 14-27 30-25z" {...blob} />
      <path d="M16 62L46 27" strokeWidth={10} />
      <path d="M16 62L46 27" strokeWidth={2.5} style={{ stroke: "var(--bg)" }} />
      <path d="M44 21l9-10 9 8-9 10z" {...paper} />
      <path d="M49 16l8 7" />
      <rect x="44" y="44" width="20" height="20" rx="6" {...paper} />
      <path d="M44 51h20" />
      <path d="M58 44c4-8 10-8 12 0" />
    </svg>
  ),
  fillings: (
    <svg {...common}>
      <path d="M36 18c16-3 30 8 31 23 1 16-11 26-27 27-15 1-27-10-27-25 0-12 9-23 23-25z" {...blob} />
      <path d="M29 16c0-4 4-6 8-5l3 1 3-1c4-1 8 1 8 5 0 3-1 5-2 6H31c-1-1-2-3-2-6z" {...paper} />
      <path d="M34 28l-2-2M40 29v-3M46 28l2-2" />
      <path d="M40 36c-2 0-4-3-9-3-5 0-8 4-8 9 0 5 2 8 3 13 1 6 2 12 5 12 3 0 3-9 9-9s6 9 9 9c3 0 4-6 5-12 1-5 3-8 3-13 0-5-3-9-8-9-5 0-7 3-9 3z" {...paper} />
    </svg>
  ),
  children: (
    <svg {...common}>
      <path d="M40 16c16 0 28 9 28 24S56 66 40 66 11 56 11 41s13-25 29-25z" {...blob} />
      <path d="M31 8c3-1 5 1 5 4l-4 18c-1 4-1 8-2 14l-4 22c-1 3-3 4-5 3-2-1-3-3-2-5l6-22c1-5 3-9 4-13l-1-17c0-2 1-4 3-4z" {...paper} />
      <path d="M30 17l6 2M29 22l6 2" />
      <path d="M55 32c2 0 4 1 3 4l-3 10c-1 3-1 5-2 8l-4 13c-1 2-3 3-4 2-2-1-2-2-2-4l4-13c1-3 2-5 3-8l1-9c1-2 2-3 4-3z" {...paper} />
      <path d="M56 37l-5-1" />
    </svg>
  ),
  emergency: (
    <svg {...common}>
      <path d="M40 26c16-2 30 6 29 20-1 13-14 20-30 20-16 0-29-6-29-19 0-12 13-19 30-21z" {...blob} />
      <circle cx="50" cy="38" r="18" {...paper} />
      <path d="M50 28v10l7 5" />
      <path d="M17 30c2-2 5-2 6 0l4 7c1 2 0 4-2 5l-2 1c2 5 5 9 10 11l1-2c1-2 3-3 5-2l7 4c2 1 2 4 0 6l-3 3c-3 3-8 3-12 0-8-5-14-12-17-20-2-5-1-9 3-13z" {...paper} />
      <path d="M15 18l3 5M25 15l-1 6" />
    </svg>
  ),
  whitening: (
    <svg {...common}>
      <path d="M46 16c13 3 22 13 21 27-1 15-13 24-28 23-15-1-25-11-24-26 1-16 15-28 31-24z" {...blob} />
      <path d="M42 30c-2 0-4-3-9-3-5 0-8 4-8 9 0 5 2 8 3 13 1 6 2 12 5 12 3 0 3-9 9-9s6 9 9 9c3 0 4-6 5-12 1-5 3-8 3-13 0-5-3-9-8-9-5 0-7 3-9 3z" {...paper} />
      <path d="M20 10v10M15 15h10" />
      <path d="M64 14v8M60 18h8" />
      <path d="M67 44v6M64 47h6" />
    </svg>
  ),
  aligners: (
    <svg {...common}>
      <path d="M38 14c17-2 31 9 30 26-1 15-13 25-29 25-16 0-27-9-27-24 0-14 11-25 26-27z" {...blob} />
      <path d="M13 26c0 24 11 38 27 38s27-14 27-38c0-4-9-4-9 0 0 17-7 27-18 27S22 43 22 26c0-4-9-4-9 0z" {...paper} />
      <path d="M18 31c1 11 6 20 12 24M62 31c-1 11-6 20-12 24" strokeWidth={3} />
    </svg>
  ),
  implants: (
    <svg {...common}>
      <path d="M34 22c16-5 32 4 34 20 2 15-9 25-25 26-16 1-29-7-30-21-1-12 8-21 21-25z" {...blob} />
      <path d="M40 16c-2 0-4-3-9-3-5 0-8 4-8 9 0 5 3 8 5 12h24c2-4 5-7 5-12 0-5-3-9-8-9-5 0-7 3-9 3z" {...paper} />
      <rect x="32" y="36" width="16" height="6" rx="2" {...paper} />
      <path d="M34 42h12l-1 20c0 3-2 5-5 5s-5-2-5-5z" {...paper} />
      <path d="M34 49h12M35 56h10" strokeWidth={3} />
    </svg>
  ),
  rootCanal: (
    <svg {...common}>
      <path d="M30 12c18-2 38 8 38 26 0 17-13 26-29 26-16 0-28-10-28-25 0-13 7-26 19-27z" {...blob} />
      <path d="M40 20c-3 0-5-4-11-4-7 0-11 5-11 12 0 6 3 10 4 16 1 8 3 16 7 16 4 0 4-12 11-12s7 12 11 12c4 0 6-8 7-16 1-6 4-10 4-16 0-7-4-12-11-12-6 0-8 4-11 4z" {...paper} />
      <path d="M32 34l6 6 11-12" />
    </svg>
  ),
}

export const serviceGroups = [
  {
    title: "Everyday care",
    items: [
      { icon: "checkups", name: "Checkups & cleanings", desc: "Exams, cleanings and X-rays, usually twice a year." },
      { icon: "fillings", name: "Fillings & crowns", desc: "Tooth-colored fillings and crowns to fix damage." },
      { icon: "children", name: "Children's dentistry", desc: "Easygoing visits for kids, from their very first tooth." },
      { icon: "emergency", name: "Emergency care", desc: "Same-day visits for pain, swelling or broken teeth." },
    ],
  },
  {
    title: "The bigger jobs",
    items: [
      { icon: "whitening", name: "Whitening", desc: "In-office or take-home, for a brighter smile." },
      { icon: "aligners", name: "Clear aligners", desc: "Removable aligners that straighten teeth gradually." },
      { icon: "implants", name: "Dental implants", desc: "A long-lasting replacement for a missing tooth." },
      { icon: "rootCanal", name: "Root canal therapy", desc: "Save an infected tooth and stop the pain." },
    ],
  },
]
