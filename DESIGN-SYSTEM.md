# Aegus Digital Agency — Design System v2

## Research-Based Principles (2026 Best Practices)

### What Top Agency Sites Do Right
1. **Generous whitespace** — sections breathe with 120-160px vertical padding, not 40-60px
2. **Type hierarchy** — hero headlines 56-72px, section headlines 36-48px, body 17-18px with 1.6-1.8 line-height
3. **Max content width** — 1200px container, never edge-to-edge. Content blocks 680-800px for readability
4. **Card spacing** — 24-32px internal padding, 24-48px gaps between cards
5. **Subtle depth** — no harsh borders. Use elevation with soft shadows or very subtle border (0.5-1px, 8-10% opacity white)
6. **One accent color** — used sparingly for CTAs and highlights only, not splashed everywhere
7. **Social proof prominent** — logos, testimonials, case study snippets — trust built above the fold
8. **Single CTA focus** — one primary action per section, not competing buttons
9. **Professional photography/illustrations** — or clean geometric patterns, never generic stock
10. **Micro-interactions** — subtle hover states, smooth scroll, fade-in on scroll (not flashy)

### Dark Mode Specifics (2026 Guide)
- Background: NOT pure black (#000). Use #0a0a0f to #0f1117 — easier on eyes
- Card surfaces: 1-2 steps lighter than bg (#141420 to #1a1a2e)
- Text: NOT pure white (#fff). Use #e8e8ed or #f0f0f5 for body, #ffffff only for headlines
- Borders: max 8-12% opacity white, or skip them entirely and use elevation
- Accent colors need 4.5:1 contrast ratio minimum against dark bg
- Font weight: bump body to 400-450 (light text on dark needs slightly heavier weight)
- Line-height: 1.65-1.8 for body text (dark mode needs more breathing room)
- Images: slightly boost brightness/contrast for dark backgrounds

### Common Mistakes (what we were doing wrong)
- ❌ Too many accent colors fighting for attention
- ❌ Gaps between sections too small — feels cramped
- ❌ Body text too small or too light
- ❌ Cards with harsh borders instead of subtle elevation
- ❌ Generic "stat counter" sections that feel template-y
- ❌ Too many CTAs competing per viewport
- ❌ No real social proof or case studies
- ❌ Hero section too busy — headline + subtext + one CTA is enough

## Updated Color Palette

### Backgrounds
- `--bg-deep`: #08080f (deepest, body)
- `--bg-primary`: #0e0e1a (main surface)
- `--bg-card`: #151525 (elevated cards)
- `--bg-card-hover`: #1a1a30 (card hover state)

### Text
- `--text-primary`: #f0f0f5 (headings, emphasis)
- `--text-body`: #c8c8d4 (body copy)
- `--text-muted`: #7a7a8e (captions, labels)
- `--text-faint`: #4a4a5e (disabled, placeholders)

### Accent
- `--accent`: #00d4aa (primary — CTAs, links, highlights)
- `--accent-hover`: #00eabb (hover state)
- `--accent-subtle`: rgba(0, 212, 170, 0.08) (backgrounds, badges)
- `--accent-glow`: rgba(0, 212, 170, 0.15) (card hover glow)

### Secondary (use sparingly)
- `--secondary`: #ff6b8a (alerts, tags, secondary accent)
- Used ONLY for: error states, limited tags, or one accent element per page

### Borders & Elevation
- `--border`: rgba(255, 255, 255, 0.06)
- `--border-hover`: rgba(255, 255, 255, 0.12)
- `--shadow-card`: 0 4px 24px rgba(0, 0, 0, 0.3)
- `--shadow-card-hover`: 0 8px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 212, 170, 0.1)

## Typography

### Font Stack
```css
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```
(Inter loaded from Google Fonts — industry standard for tech/SaaS/agency)

### Scale
- Hero headline: 64px / 700 weight / -0.02em tracking / 1.1 line-height
- Section headline: 40px / 600 weight / -0.015em tracking / 1.2 line-height
- Card title: 22px / 600 weight / 1.3 line-height
- Body: 17px / 400 weight / 1.7 line-height
- Small/caption: 14px / 400 weight / 1.5 line-height
- Label/tag: 13px / 500 weight / 1.4 line-height / uppercase / 0.05em tracking

### Mobile Scale
- Hero: 36px
- Section: 28px
- Card title: 19px
- Body: 16px

## Spacing System (8px base)
- Section padding: 120px vertical (80px mobile)
- Container max: 1200px with 24px side padding
- Card padding: 32px (24px mobile)
- Card gap: 24px
- Element gap (within cards): 16px
- Button padding: 16px 32px

## Components

### Buttons
```css
.btn-primary {
  background: var(--accent);
  color: #08080f;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.01em;
  transition: all 0.2s ease;
  border: none;
}
.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3);
}
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  padding: 16px 32px;
  border: 1px solid var(--border-hover);
  border-radius: 8px;
}
```

### Cards
```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
}
.card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
```

## Page Structure (Landing Page)
1. **Nav** — logo left, 3-4 links center, one CTA right
2. **Hero** — headline + sub (max 2 lines) + one CTA + subtle social proof
3. **Logo bar** — "Trusted by" with muted client/tech logos
4. **Services** — 3-4 cards, icon + title + 2-line description
5. **Process** — 3-4 steps, numbered, clean timeline feel
6. **Social proof** — testimonial quote + name/title + company
7. **Pricing/packages** — 3 tiers if relevant
8. **FAQ** — accordion style
9. **Final CTA** — dark card with accent glow, headline + button
10. **Footer** — minimal, links + email + socials
