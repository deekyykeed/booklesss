---
name: design-system
description: >
  Complete visual design system for Booklesss web and UI work. Use whenever
  building websites, landing pages, web apps, HTML artifacts, or any frontend
  component for Booklesss. Combines agency-tier layout principles, minimalist
  editorial style, and anti-slop bias correction. Triggers on: "build the
  website", "design the landing page", "create a component", "make the UI for",
  or any frontend/web task. Not for PDF generation — use step-skill for that.
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

### Icons
- **Render candidates before naming one.** Icon names lie: `widget-4` is not a
  2×2 grid, `calendar-minimalistic` has no dots, `book-bold` is a *closed* book
  when you wanted an open one. One throwaway HTML page of candidates, screenshot
  and actually looked at, beats any amount of reasoning from names.
- **Draw them at the real size, in the real colours, on the real surface** —
  20px on the page's own background, not 64px on white. Weight and legibility
  are the decision, and both change with size.
- **A set of icons must share an axis.** Three marks for three things have to
  encode the distinction being taught: chess / calendar / clipboard-and-clock is
  *time horizon*, which is what those three levels are. Three unrelated pictures
  are decoration, and decoration is worse than the plain list it replaced.
- **A bare icon has to survive without its label.** Once the words go, "clipboard"
  no longer says *Later* and a thumb rates the content instead of recording a
  decision. Before dropping labels, read each mark cold and ask what a stranger
  would think it does. Keep `aria-label` and add `title` regardless.
- Adding an icon means adding it to that set's generator (`ICONS` in
  `scripts/gen-*.mjs`) and rerunning — never hand-edit a generated module.

### Buttons
- Primary: flat fill, accent colour, no outer glow
- Active state: `scale(0.98)` or `translateY(-1px)` — tactile push
- If button has trailing icon: wrap icon in its own circular container nested inside the button
- Shape: `rounded-full` for CTA pills, `rounded-sm` for inline actions

### Cards
- Use ONLY when elevation communicates hierarchy
- High-density: replace cards with `border-top` dividers or negative space instead
- Border: `1px solid rgba(226,232,240,0.5)` — whisper, never harsh
- Shadow: see below. On a **reading surface** the wide ambient shadow this
  section used to prescribe is wrong.

### Shadows
- Tint shadows to the background hue — never generic grey
- Never `shadow-md`, `shadow-lg`, `shadow-xl` defaults
- **Width is the thing that reads as harsh, not opacity.** *(2026-08-02, from
  the reader.)* The owner called the step cards' shadow harsh twice. The first
  fix halved every alpha and it was still wrong, because the culprit was a
  `28px` blur: a wide layer spreads grey over enough pixels to read as a band
  even at 9% black. What worked was **deleting the wide layer**, not dimming
  it.
- **Reading surfaces cap at ~10px of blur.** Two tokens carry the whole reader:
  ```css
  --shadow-lift: 0 1px 2px -1px rgb(0 0 0 / 0.04), 0 4px 10px -6px rgb(0 0 0 / 0.05);
  --shadow-chip: 0 1px 1px -0.5px rgb(0 0 0 / 0.04), 0 2px 5px -2px rgb(0 0 0 / 0.06);
  ```
  `lift` raises a block of content, `chip` is the hairline a control wants.
  Depth says "this is its own object"; it does not cast a shadow.
- **The test:** two cards stacked with a 12px gap, viewed at 390px. If their
  shadows meet in the gap, the shadow is still too big. Judge it on a phone —
  a 40px ambient that looks refined on a 1440px hero is a smudge on a 390px
  column, and the reader is on a phone.
- A wide diffused ambient (`0 20px 40px -15px rgba(0,0,0,0.05)`) is still right
  for a **marketing hero or a floating overlay** — something meant to look like
  it hovers. It is wrong for anything a reader reads through.

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
