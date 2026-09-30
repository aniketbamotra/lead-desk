---
target: harlow template
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 4
target_identity: "file:/Users/aniketbamotra/Desktop/lead-desk/design/source/harlow.html"
target_fingerprint: "sha256:d99c3c935fcbb68497ceb377f43f2a7c3a1404cc1cd0139374298f910e034818"
target_path: /Users/aniketbamotra/Desktop/lead-desk/design/source/harlow.html
timestamp: 2026-09-30T20-44-11Z
slug: design-source-harlow-html
---
# Critique: Harlow (dark luxury cosmetic) - 22/32 (69%, Acceptable)
## Shared across all four templates
- [P0] Hard-coded identity of the fictional practice (city, name in bios, email, hours, parking, neighbourhood) beyond injected name/phone/address; breaks the "made for you" pitch. Sample reviews/bios stay by owner decision; identity strings must bind or be neutral.
- [P1] Grey "Photo:" placeholder boxes (Clearview 8, Fifth Street 4, Harlow 5, incl. every hero). Only Brightwater has real photos.
- [P1] Dead links: Learn more x8, /book, /privacy, /services/*, map embed box, footer #.
- [P1] Prospect name only in 20px header + footer; no name/city in hero.
- [P2] Monotone section rhythm; 8 equal ungrouped service cards.
- [P2] No <title>, no lang, no scroll-margin-top.
Method: dual-agent (design review + detector). Chrome not connected: A reviewed source only; B used headless Chromium at 1440 and 390 with detect.js injected.

## Heuristics
1 3 | 2 2 (Scottsdale hard-coded; "colour") | 3 3 (menu no Esc/focus return) | 4 3 (five labels for one action) | 5 3 (/book, /treatments dead) | 6 3 | 7 n/a | 8 3 (11 same-rhythm sections) | 9 2 | 10 n/a

## Specificity
Coherent palette, gold used as marks only. Stock section order; slider is the only cosmetic-specific element and shows two greys. Detector found real bugs A missed: horizontal overflow at 390 (scrollWidth 522; slider fixed 280px height + 16:9 forces 498px width) and invisible keyboard focus on slider (opacity:0 input, no focus style). heading-rhythm on Treatments / Meet the dentist; tight-leading edge case; cream-palette; CLI cramped-padding x10 not reproduced live. Gold markers 2.55:1 on light (decoration only).

## Working
Preview/plan/cost promise threaded throughout; accessible native range input; calm close.

## Priority issues
- [P0] Scottsdale, Dr. Elena Harlow in bio and reviews, email, hours hard-coded -> harden
- [P1] Slider overflow at 390 + invisible focus -> adapt
- [P1] Luxury pitch depends on missing photos (88vh grey hero, grey-vs-grey slider) -> bolder
- [P1] "Photos of real patients, shared with their permission" under placeholders: false claim -> clarify
- [P2] Same rhythm x11; make Results full-bleed, fold Insurance into FAQ, drop Learn more -> layout

## Personas
Prospect: Scottsdale since 2010 on an Ohio page; name twice in footer. Casey: h1 below 4:5 grey; sideways scroll; ~140px of chrome. Jordan: slider compares greys.

## Minor
General-care services undercut luxury positioning; hover on non-link treatment rows.
