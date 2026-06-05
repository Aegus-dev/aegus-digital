---
name: Aegus Digital — Public Site
extends: ../DESIGN.md
version: 2026-04-23
colors:
  canvas: "#08090a"
  panel: "#0f1015"
  fg:
    default: "#ffffff"
    dim: "#9ca3af"
  heat:
    default: "#f97316"
    hover: "#fb923c"
  status:
    success: "#10b981"
    warning: "#f59e0b"
    error: "#ef4444"
  surfaces:
    card: "rgba(255,255,255,0.03)"
    card-hover: "rgba(255,255,255,0.06)"
  borders:
    default: "rgba(255,255,255,0.08)"
    strong: "rgba(255,255,255,0.16)"
typography:
  font-sans: "Inter Variable, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
  font-mono: "Berkeley Mono, IBM Plex Mono, JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  scale:
    display-hero:   { size: "72px", letter-spacing: "-1.584px", line-height: "1.00", weight: 510 }
    display-large:  { size: "64px", letter-spacing: "-1.408px", line-height: "1.00", weight: 510 }
    display:        { size: "48px", letter-spacing: "-1.056px", line-height: "1.00", weight: 510 }
    h1:             { size: "32px", letter-spacing: "-0.704px", line-height: "1.13", weight: 400 }
    h2:             { size: "24px", letter-spacing: "-0.288px", line-height: "1.33", weight: 400 }
    h3:             { size: "20px", letter-spacing: "-0.24px",  line-height: "1.33", weight: 590 }
    body-lg:        { size: "18px", line-height: "1.60", weight: 400 }
    body:           { size: "16px", line-height: "1.50", weight: 400 }
    body-ui:        { size: "16px", line-height: "1.50", weight: 510 }
    small:          { size: "15px", line-height: "1.60", weight: 400 }
    caption:        { size: "13px", line-height: "1.50", weight: 510 }
    label:          { size: "12px", line-height: "1.40", weight: 510, letter-spacing: "0.15em" }
  mobile-fallback:
    h1-PageHeader:   "40px"    # PageShell.tsx overrides display-large → 40px on mobile
    h2-Section:      "32px"    # Section overrides display → 32px on mobile
spacing:
  container-max: "1280px"
  page-padding: "24px"
  section-gap: "120px"
  header-top-pad: "120px"
  header-bot-pad: "72px"
frame:
  max-width-content: "860px"   # h1 + primary prose
  max-width-body: "680px"      # body prose columns
---

# Aegus Digital — Public Site

Extends [`../DESIGN.md`](../DESIGN.md). The public marketing + product site — `aegus.digital`. Linear-style display typography, aggressive negative letter-spacing, architectural restraint.

## Overview

Visual influence: Linear's product marketing pages meet a minimalist broadsheet. Large display headlines set with tight negative tracking, heavy vertical whitespace between sections, card surfaces that read as paper rather than plastic. Every interactive element is heat-orange; everything else is a shade of white on the canvas.

## Typography discipline

The display stack (`display-hero` 72px / `display-large` 64px / `display` 48px) all run `letter-spacing: -1.x` and `line-height: 1.00`. That's not a visual flourish — it's how the hero reads "owned" instead of "templated." Every scroll lands on a headline that looks typeset, not defaulted.

**Mobile fallback is mandatory.** 64px headlines wrap one word per line below ~400px viewport. `PageShell.tsx` enforces `text-[40px] md:text-display-large` so the mobile experience reads as 3-4 words per line instead of vertical stack.

Body type is Inter 16px at 1.5 leading. `body-lg` (18px) only for marketing heroes under a title. `label` (12px, uppercase, +0.15em tracking) is reserved for section eyebrows.

## Surfaces + borders

Cards don't have background color — they have **border-only definition** using alpha-white shadows (`0 0 0 1px rgba(255,255,255,0.08)`). The subtle trick: `box-shadow` gives crisper edges than `border` at display scale, especially when combined with light content backgrounds (`rgba(255,255,255,0.03)`). `card-hover` lifts the border alpha to 0.16 and adds a soft 8px drop-shadow for depth.

**No gradients.** No colored outer glows. No glossy reflections. The canvas is near-black; the content is what has visual weight.

## Interactive language

Orange appears on:
- CTAs ("Start the questionnaire →")
- Active tabs
- A-grade badges
- Institute verdicts marked `graded: A`
- Hover state on internal `<a>` elements (border shifts from `0.08` to `heat/30`)

Orange does NOT appear on:
- Default body text
- Dividers / rules
- Card backgrounds
- Icons unless they're the CTA icon

## Copy voice (the paraphrase discipline)

Paragraphs cap at ~40 words. Short sentences. Colons and em-dashes instead of subordinate clauses. Drop hedges (`is currently`, `that spans`, `exclusively on`). Keep every concrete number or name; only cut filler. The 2026-04-23 paraphrase pass applied this to 22 verbose paragraphs across 10 routes.

## Private-beta signaling

Footer carries a single amber disclaimer box (`In active development. Nothing on this site is a finished commercial product...`) for legal positioning. No top-of-page "coming soon" banner — the site is open, the footer is honest.

## Route conventions

- `/` — hero + Institute positioning
- `/services/[product]` — services/{build,content,ledger,mcp,reports,voice}
- `/quote/[product]` — dynamic questionnaire routes for each service
- `/path` — PATH marketing (separate from the dashboard at Aegus-SaaS/frontend)
- `/institute` — reasoning-layer deep-dive
- `/about`, `/pricing`, `/work`, `/video`, `/for-businesses`, `/api-dashboard`

## History

- **2026-04-04** — Repo created, canvas-first foundation.
- **2026-04-11 02:19 EDT** — Palette D locked at the root (see `../DESIGN.md`).
- **2026-04-15** — IA redesign 17 pages → 9. 8 nav → 4 categories.
- **2026-04-22** — Institute hub topology redrawn (center at 50/50, 5 staggered pulses, radial glow).
- **2026-04-23** — PageShell mobile h1/h2 fallbacks landed. Paraphrase pass landed. This DESIGN.md written.
