---
target: fifth-street template
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:/Users/aniketbamotra/Desktop/lead-desk/design/source/fifth-street.html"
target_fingerprint: "sha256:d800a0f51e7cfe48adfb3cf38d3b469bfc5976c25ffef25d7912901f532f5ee3"
target_path: /Users/aniketbamotra/Desktop/lead-desk/design/source/fifth-street.html
timestamp: 2026-09-30T20-44-11Z
slug: design-source-fifth-street-html
---
# Critique: Fifth Street (yellow/black bold) - 24/32 (75%, Good)
## Shared across all four templates
- [P0] Hard-coded identity of the fictional practice (city, name in bios, email, hours, parking, neighbourhood) beyond injected name/phone/address; breaks the "made for you" pitch. Sample reviews/bios stay by owner decision; identity strings must bind or be neutral.
- [P1] Grey "Photo:" placeholder boxes (Clearview 8, Fifth Street 4, Harlow 5, incl. every hero). Only Brightwater has real photos.
- [P1] Dead links: Learn more x8, /book, /privacy, /services/*, map embed box, footer #.
- [P1] Prospect name only in 20px header + footer; no name/city in hero.
- [P2] Monotone section rhythm; 8 equal ungrouped service cards.
- [P2] No <title>, no lang, no scroll-margin-top.
Method: dual-agent (design review + detector). Chrome not connected: A reviewed source only; B used headless Chromium at 1440 and 390 with detect.js injected.

## Heuristics
1 3 (no open-now; anchors under sticky header) | 2 4 | 3 3 (menu no Esc/focus) | 4 3 (1px hours rules vs 2px) | 5 2 (dead Learn more, /book) | 6 3 | 7 n/a | 8 3 (every h2 68px/800) | 9 3 | 10 n/a

## Specificity
Most authored: tilted stickers, prices band, Late pill, neighbourhood reviews. Services grid is stock. Detector: cream-palette; gray-on-color = false positive (6.38:1); CLI cramped-padding x4 not reproduced live. Real bug: mobile hero button renders "Call(512) 555-0149" (inline-flex drops the space). No overflow.

## Working
Prices band + costs-explained positioning; conversion scaffolding; warm specific voice.

## Priority issues
- [P0] H1 "East Austin's friendly neighborhood dentist", "right here on 5th Street", "opened Fifth Street Dental in 2015", Austin review neighbourhoods hard-coded; practice.neighborhood unused; stickers not derived from hours -> harden
- [P1] Placeholder hero (21:9 / 4:5 slab) -> type + stickers on yellow, no photo -> bolder
- [P2] "Call(512)" spacing; scroll-margin-top -> polish
- [P2] Dead links; identical h2 scale; group services 4+4 -> distill

## Personas
Prospect: East Austin in h1; prices they don't charge. Casey: 5-line h1 then ~440px grey; desktop flash (vw 1320 initial). Riley: no-Saturday practice contradicts hard-coded why-item.

## Minor
Closed FAQ aria-controls to missing id; no today highlight; no phone in footer.
