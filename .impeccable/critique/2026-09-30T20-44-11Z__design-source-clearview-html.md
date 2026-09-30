---
target: clearview template
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 4
target_identity: "file:/Users/aniketbamotra/Desktop/lead-desk/design/source/clearview.html"
target_fingerprint: "sha256:f1c917b7e1603bf6e39780e35f10ff97947ffd6ecf64992177f86e6c794b22ae"
target_path: /Users/aniketbamotra/Desktop/lead-desk/design/source/clearview.html
timestamp: 2026-09-30T20-44-11Z
slug: design-source-clearview-html
---
# Critique: Clearview (clinical teal) - 20/32 (63%, Acceptable)
## Shared across all four templates
- [P0] Hard-coded identity of the fictional practice (city, name in bios, email, hours, parking, neighbourhood) beyond injected name/phone/address; breaks the "made for you" pitch. Sample reviews/bios stay by owner decision; identity strings must bind or be neutral.
- [P1] Grey "Photo:" placeholder boxes (Clearview 8, Fifth Street 4, Harlow 5, incl. every hero). Only Brightwater has real photos.
- [P1] Dead links: Learn more x8, /book, /privacy, /services/*, map embed box, footer #.
- [P1] Prospect name only in 20px header + footer; no name/city in hero.
- [P2] Monotone section rhythm; 8 equal ungrouped service cards.
- [P2] No <title>, no lang, no scroll-margin-top.
Method: dual-agent (design review + detector). Chrome not connected: A reviewed source only; B used headless Chromium at 1440 and 390 with detect.js injected.

## Heuristics
1 Visibility 2 (Check availability no feedback) | 2 Match 3 | 3 Control 2 (#book loops to itself) | 4 Consistency 3 (phone CTA labels vary) | 5 Error prevention 2 (quick-booking selects do nothing) | 6 Recognition 3 (phone hidden 720-1180) | 7 n/a | 8 Aesthetic 3 | 9 Recovery 2 (dead /services, /privacy) | 10 n/a

## Specificity
Copy-specific, composition interchangeable. Detector: icon-tile-stack x8 (real). Contrast all pass (min 5.31:1). No overflow at 390. CLI cramped-padding x3 = false positives (not reproduced in rendered DOM).

## Working
Copy; a11y basics; mobile sticky Call/Book; live Today badge.

## Priority issues
- [P0] Identity hard-coded ("Priya opened Clearview in 2012", Raleigh, email, hours, Saturdays claim, "Crowns in one visit" implies CEREC) -> harden
- [P1] Placeholder hero -> real photo or type-led hero -> bolder
- [P1] Quick-booking band dead -> remove or make call/book -> distill
- [P1] No name/city in hero -> typeset
- [P2] Monotone rhythm; Emergency care last of 8 -> layout

## Personas
Prospect: Clearview in bios, wrong hours. Riley: empty address_2 gives ", ,"; long PLLC name crowds nav; 0 dentists breaks grid. Casey: no phone in header; dead selects before Services.

## Minor
Select borders ~1.2:1 on grey band; Today badge uses visitor timezone; 3 near-identical tooth icons.
