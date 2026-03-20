---
name: design-system
description: >
  Complete visual design system for Booklesss web and UI work. Use whenever
  building websites, landing pages, web apps, HTML artifacts, or any frontend
  component for Booklesss. Combines agency-tier layout principles, minimalist
  editorial style, and anti-slop bias correction. Triggers on: "build the
  website", "design the landing page", "create a component", "make the UI for",
  or any frontend/web task. Not for PDF generation — use booklesss-pdf for that.
---

# Booklesss Design System

Three design philosophies merged into one reference. Apply all three simultaneously.

---

## Dials — set before every build

| Dial | Level | Range |
|------|-------|-------|
| Design Variance | **8** | 1 = perfect symmetry → 10 = artsy chaos |
| Visual Density | **4** | 1 = art gallery airy → 10 = cockpit packed |
| Motion Intent | **6** | 1 = static → 10 = cinematic physics |
| Creativity | **8** | 1 = ultra-minimal → 10 = bold editorial |

Adapt these dynamically based on what the user requests.

---

## Colour system

### Booklesss brand palette
| Role | Value |
|------|-------|
| Canvas | `#F9FAFB` warm-neutral (never clinical blue-white) |
| Surface / card | `#FFFFFF` |
| Primary text | `#18181B` zinc-950 — never pure black |
| Secondary text | `#71717A` steel |
| Tertiary / meta | `#94A3B8` muted slate |
| Border / divider | `rgba(226,232,240,0.5)` whisper |
| Amber accent | `#C17E3A` — primary brand accent |
| Navy | `#1B2A4A` — cover / strong emphasis |
| Teal | `#0E6B6B` — secondary accent |

### Accent selection rule
Max ONE accent colour per project. Never mix. Saturation below 80%.

### Banned colours
- Purple/violet neon gradients — the "AI purple" aesthetic is banned
- Pure black `#000000` — always off-black or zinc-950
- Oversaturated accents above 80% saturation
- Mixed warm/cool grey systems in the same project

---

## Typography

### Font stack (priority order)
- **Display/headlines:** `Geist`, `Satoshi`, `Cabinet Grotesk`, `Outfit` — tracking tight (`-0.025em`), weight 700–900
- **Body:** Same family at weight 400 — leading 1.65, max-width 65ch
- **Mono:** `Geist Mono`, `JetBrains Mono` — for code, metadata, timestamps

### Banned fonts
- `Inter` — banned in all premium contexts
- Generic serifs (`Times New Roman`, `Georgia`, `Garamond`) — banned in dashboards/software
- If serif is needed for editorial: use `Fraunces`, `Instrument Serif`, or `Editorial New` only

### Scale
- Display: `clamp(2.25rem, 5vw, 3.75rem)`
- Body: `1rem / 1.125rem`
- Meta: `0.8125rem`

### Heading treatment
Precede major H1/H2 with an eyebrow tag:
```html
<span class="eyebrow">CONCEPT 01  ·  TREASURY MANAGEMENT</span>
<h2>The Cash Conversion Cycle</h2>
```
Eyebrow: `font-size: 0.65rem`, `letter-spacing: 0.18em`, `text-transform: uppercase`, amber colour.

---

## Layout principles

- **Grid-first:** CSS Grid for all structural layouts. Never `calc(33% - 1rem)` flexbox math.
- **No 3-column equal card layouts** — banned. Use 2-column zig-zag, asymmetric bento (2fr 1fr), or horizontal scroll.
- **No centered Hero sections** at Variance ≥ 5 — use split screen, left-aligned, or asymmetric whitespace.
- **Containment:** `max-width: 1400px` centred. Padding: `1rem` mobile → `4rem` desktop.
- **Full-height:** Always `min-height: 100dvh` — never `height: 100vh` (iOS Safari jump).
- **Breathing room:** `py-24` to `py-32` between sections minimum.

---

## Component architecture

### The Double-Bezel (premium card treatment)
Never place a card flatly on the background. Nest it:
```html
<!-- Outer shell -->
<div class="ring-1 ring-black/5 p-1.5 rounded-[2rem] bg-black/5">
  <!-- Inner core -->
  <div class="rounded-[calc(2rem-0.375rem)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] p-8">
    content
  </div>
</div>
```

### Buttons
- Primary: flat fill, accent colour, no outer glow
- Active state: `scale(0.98)` or `translateY(-1px)` — tactile push
- If button has trailing icon: wrap icon in its own circular container nested inside the button
- Shape: `rounded-full` for CTA pills, `rounded-sm` for inline actions

### Cards
- Use ONLY when elevation communicates hierarchy
- High-density: replace cards with `border-top` dividers or negative space instead
- Border: `1px solid rgba(226,232,240,0.5)` — whisper, never harsh
- Shadow: `0 20px 40px -15px rgba(0,0,0,0.05)` — wide, diffused, never dark

### Shadows
- Tint shadows to the background hue — never generic grey
- Never `shadow-md`, `shadow-lg`, `shadow-xl` defaults
- Diffused ambient: `0 20px 40px -15px rgba(0,0,0,0.05)`

---

## Motion

### Physics engine
Spring-based exclusively: `stiffness: 100, damping: 20`. No linear easing anywhere.

### Entry animations
Elements never appear statically. Fade-up on viewport entry:
`translateY(12px) + opacity: 0` → `translateY(0) + opacity: 1` over 600ms `cubic-bezier(0.16,1,0.3,1)`.
Use `IntersectionObserver`. Never `window.addEventListener('scroll')`.

### Staggered reveals
Lists and grids cascade: `animation-delay: calc(var(--index) * 80ms)`. Never instant mount.

### Performance rules
- Animate ONLY `transform` and `opacity` — never `top`, `left`, `width`, `height`
- `backdrop-blur` only on fixed/sticky elements — never on scrolling containers
- Grain/noise overlays on `position: fixed; pointer-events: none` pseudo-elements only
- CPU-heavy perpetual animations isolated in leaf components — never trigger parent re-renders

---

## Anti-slop banned patterns

### Visual
- No neon outer glows or default box-shadow glows
- No pure black `#000000`
- No oversaturated accents above 80%
- No excessive gradient text on large headers
- No custom mouse cursors

### Typography
- No `Inter` font
- No oversized H1 that "screams" — control hierarchy with weight and colour, not scale
- No serif on dashboards or software UIs

### Layout and spacing
- No 3-column equal-width feature card layouts
- No `h-screen` — always `min-h-[100dvh]`
- No floating elements with awkward gaps
- No z-index spam (`z-50`, `z-[9999]`) — reserve for navbar, modal, overlay only

### Content
- No generic names: "John Doe", "Acme", "Nexus", "SmartFlow"
- No fake round numbers: `99.99%`, `50%`, `1234567` — use organic values: `47.2%`
- No AI copy clichés: "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize"
- No broken Unsplash links — use `picsum.photos/seed/{context}/800/600`
- No emojis in UI, code, markup, or alt text

---

## Pre-build checklist

Before writing any code:
- [ ] Dial values set — Variance 8, Density 4, Motion 6 (or adjusted per request)
- [ ] Font stack confirmed — no Inter, no generic serif
- [ ] Single accent colour chosen
- [ ] Layout archetype chosen — bento, split, editorial, z-axis cascade
- [ ] Mobile collapse strategy defined

Before outputting code:
- [ ] No banned fonts, colours, layouts, or patterns present
- [ ] All major cards use Double-Bezel or explicit elevation logic
- [ ] Section padding is minimum `py-24`
- [ ] All transitions use custom `cubic-bezier` — no `linear` or `ease-in-out`
- [ ] Layout collapses gracefully below 768px to single-column
- [ ] All animations use only `transform` and `opacity`
- [ ] `backdrop-blur` only on fixed/sticky elements
