---
target: brightwater template
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 4
target_identity: "file:/Users/aniketbamotra/Desktop/lead-desk/design/source/brightwater.html"
target_fingerprint: "sha256:a8969dc282ac125f8a2cb704172ea737ea3c5fc53486c0639d399ab4f96f42e2"
target_path: /Users/aniketbamotra/Desktop/lead-desk/design/source/brightwater.html
timestamp: 2026-09-30T20-44-11Z
slug: design-source-brightwater-html
---
# Critique: Brightwater (cream/navy editorial) - 21/32 (66%, Acceptable)
## Shared across all four templates
- [P0] Hard-coded identity of the fictional practice (city, name in bios, email, hours, parking, neighbourhood) beyond injected name/phone/address; breaks the "made for you" pitch. Sample reviews/bios stay by owner decision; identity strings must bind or be neutral.
- [P1] Grey "Photo:" placeholder boxes (Clearview 8, Fifth Street 4, Harlow 5, incl. every hero). Only Brightwater has real photos.
- [P1] Dead links: Learn more x8, /book, /privacy, /services/*, map embed box, footer #.
- [P1] Prospect name only in 20px header + footer; no name/city in hero.
- [P2] Monotone section rhythm; 8 equal ungrouped service cards.
- [P2] No <title>, no lang, no scroll-margin-top.
Method: dual-agent (design review + detector). Chrome not connected: A reviewed source only; B used headless Chromium at 1440 and 390 with detect.js injected.

## Heuristics
1 3 (no aria-live on steps) | 2 3 (slots contradict hours) | 3 3 | 4 2 (clickable divs to 404; hover-only insurer chips) | 5 2 (8am Sat, 5:30pm Fri offered) | 6 4 | 7 n/a | 8 3 | 9 1 (no field errors) | 10 n/a

## Specificity
Best copy, only real photos; structure is stock AI landing page. Detector: hero-eyebrow-chip + all-caps-body (Family dentistry · Southeast Portland), italic-serif-display 92px, oversized-h1, kicker-above-heading, cream-palette, layout-transition (header padding), repeating-stripes-gradient (map placeholder). low-contrast on nav = false positive (hover gradient read as bg). CLI x2 counts = duplicate hero variants.

## Working
Nervous section / Raise a hand to pause; stepped form logic; disciplined motion with reduced-motion kill switch.

## Priority issues
- [P0] Identity hard-coded everywhere, no bindings (name/phone 4+, Southeast Portland, #4 bus, Moda, email, (c) 2026, 503 placeholder, $329) -> harden
- [P1] Booking times ignore hours -> derive from hours -> harden
- [P1] Dead ends: /services/*, stray $1 token in team img (line 130), monospace striped map box -> polish
- [P1] 3.55 MB of 1024px PNG icons shown at 72px, not lazy -> optimize
- [P2] Form a11y: inactive step labels #8a8f9a on white 3.24:1 FAIL; colour-only selection, no aria-pressed; outline:none; no type=tel/autocomplete; 17px targets -> audit

## Personas
Jordan: 404 on Learn more; faded Continue unexplained. Casey: 8 full-width service rows; text keyboard for phone; no sticky call bar. Prospect: three invented dentists with faces.

## Minor
Emergency bar not dismissible; header padding transition; new-patient checkbox unused.
