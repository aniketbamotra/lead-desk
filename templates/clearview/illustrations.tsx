// Service illustrations for Clearview: one teal line weight, a pale disc
// behind, and a single solid accent detail. Drawn on a 72-unit grid and
// shown at 96px, where every line comes out 2px wide.

const TOOTH =
  "M7.5 3C5 3 3.5 5 3.5 7.5c0 2 1 3 1.4 5 .6 3.2 1 8.5 3.1 8.5 1.8 0 1.6-5.5 4-5.5s2.2 5.5 4 5.5c2.1 0 2.5-5.3 3.1-8.5.4-2 1.4-3 1.4-5C20.5 5 19 3 16.5 3c-2 0-2.8 1-4.5 1S9.5 3 7.5 3z"

function Frame({ children, disc = "36 38" }: { children: React.ReactNode; disc?: string }) {
  const [cx, cy] = disc.split(" ")
  return (
    <svg width="96" height="96" viewBox="0 0 72 72" aria-hidden fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx={cx} cy={cy} r="30" fill="var(--tint)" stroke="none" />
      {children}
    </svg>
  )
}

/** The tooth outline, scaled from its 24px drawing with the stroke kept constant. */
function Tooth({ x = 12, y = 12, scale = 2, fill = "var(--bg)" }: { x?: number; y?: number; scale?: number; fill?: string }) {
  // non-scaling-stroke keeps the line at 2 screen pixels, matching the rest.
  return <path d={TOOTH} transform={`translate(${x} ${y}) scale(${scale})`} vectorEffect="non-scaling-stroke" strokeWidth="2" fill={fill} />
}

function Sparkle({ x, y, size = 4 }: { x: number; y: number; size?: number }) {
  return <path d={`M${x} ${y - size}v${size * 2}M${x - size} ${y}h${size * 2}`} />
}

export const illustrations = {
  checkups: (
    <Frame>
      <Tooth />
      <path d="M28 33l6 6 11-12" />
    </Frame>
  ),
  children: (
    <Frame>
      <Tooth x={15} y={16} scale={1.75} />
      <path d="M31 33v.5M41 33v.5" strokeWidth="2.25" />
      <path d="M31 39c1.6 2.4 8.4 2.4 10 0" />
      <path d="M57 10l1.6 3.6 3.9.4-2.9 2.7.8 3.9-3.4-2-3.4 2 .8-3.9-2.9-2.7 3.9-.4z" fill="var(--accent)" stroke="none" />
    </Frame>
  ),
  fillings: (
    <Frame>
      <Tooth />
      <path d="M30 27c2-2 4 1 6 0s4-3 6 0c1.200 2 .5 4.500-1.500 5.500-3 1.500-6 1.500-9 0-2-1-2.700-3.500-1.500-5.500z" fill="var(--accent)" stroke="none" />
    </Frame>
  ),
  rootCanal: (
    <Frame>
      <Tooth />
      <path d="M31 27h10c1.500 0 2 1.500 1.500 3-1.500 4-1.500 9-2 15M30.500 30c1 4 1.500 9 1.500 15" />
      <circle cx="36" cy="27" r="2.250" fill="var(--accent)" stroke="none" />
    </Frame>
  ),
  implants: (
    <Frame>
      <path
        d="M7 2.5c1.5 0 2.5 1 5 1s3.5-1 5-1c1.6 0 2.5 1.5 2.5 3.3 0 1.5-.8 2.7-1.5 3.700H6C5.300 8.500 4.500 7.300 4.500 5.800 4.500 4 5.400 2.500 7 2.500z"
        transform="translate(12 10) scale(2)"
        vectorEffect="non-scaling-stroke"
        strokeWidth="2"
        fill="var(--bg)"
      />
      <path d="M29 29l4 27h6l4-27z" fill="var(--bg)" />
      <path d="M30.500 37h11M31.500 44h9M32.500 51h7" />
    </Frame>
  ),
  whitening: (
    <Frame>
      <Tooth />
      <Sparkle x={57} y={15} size={5} />
      <Sparkle x={14} y={22} size={3.500} />
      <path d="M36 26l1.800 4.700 4.700 1.800-4.700 1.800L36 39l-1.800-4.700-4.700-1.800 4.700-1.800z" fill="var(--accent)" stroke="none" />
    </Frame>
  ),
  aligners: (
    <Frame>
      <path d="M15 20c0 21 8 33 21 33s21-12 21-33c0-3-7-3-7 0 0 15.500-5 24-14 24s-14-8.500-14-24c0-3-7-3-7 0z" fill="var(--bg)" />
      <path d="M21.500 27c.8 4 2 7.500 3.700 10.500M50.500 27c-.8 4-2 7.500-3.700 10.500M31 45.500c1.600 .8 3.200 1.200 5 1.200s3.400-.4 5-1.200" />
    </Frame>
  ),
  emergency: (
    <Frame>
      <Tooth />
      <path d="M38 22l-6 10h7l-4 9" />
      <circle cx="56" cy="18" r="8" fill="var(--accent)" stroke="none" />
      <path d="M56 14v4.500M56 21.500v.2" stroke="var(--bg)" />
    </Frame>
  ),
} as const

export type IllustrationKey = keyof typeof illustrations
