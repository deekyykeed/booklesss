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

### Selected-state contrast scales with weight *(2026-08-07, the course tabs)*
**Two greys that clearly differ at regular weight stop differing when the type
goes bold.** Heavy strokes put more ink on the page, which narrows the apparent
distance between any two text colours — so a tab row that read correctly as
14px medium (`ink` vs `muted`) read as three headings at 17px bold, and the
owner could not tell which one he was on.

When type gets heavier or larger, the selected state needs **either a bigger
colour gap or a second signal** — not the same pair scaled up. Both is safest:
drop the unselected ones to the faintest text token, and add a mark (a 2px rule
under the active one).

Two rules for that mark, both learned the same day:
- **Every item carries it, transparent when inactive.** Applying the border only
  to the selected one adds 2px to that item and shifts the whole row on each
  switch.
- **Keep the mark grey, not ink.** It is there to say *which*, not to be read —
  ink under ink-weight type competes with the word it underlines.

---

## Layout principles

- **Grid-first:** CSS Grid for all structural layouts. Never `calc(33% - 1rem)` flexbox math.
- **No 3-column equal card layouts** — banned. Use 2-column zig-zag, asymmetric bento (2fr 1fr), or horizontal scroll.
- **No centered Hero sections** at Variance ≥ 5 — use split screen, left-aligned, or asymmetric whitespace.
- **Containment:** `max-width: 1400px` centred. Padding: `1rem` mobile → `4rem` desktop.
- **Full-height:** Always `min-height: 100dvh` — never `height: 100vh` (iOS Safari jump).
- **Breathing room:** `py-24` to `py-32` between sections minimum.

### Wide content on a narrow screen *(2026-08-02)*

Anything that cannot fit a phone — a table, a chip row, a code block — scrolls
**off the edge of the screen**, never inside a visible box. A bordered, rounded
card with the scroll happening inside it draws a hard edge a few pixels short
of the screen, so the column you are scrolling toward is cut off at a boundary
you can see, and the thing reads as *held* rather than as *continuing*.

- Use a full-bleed scroller: negative margin equal to the column's padding,
  the same padding back on the inside, so narrow content still lines up with
  the text and wide content slides out past it. (`.bleed-x` in the reader.)
- Drop the border, radius and shadow from the scroller. Row hairlines are
  enough to hold a table together.
- On a touch device, mark it so a sideways drag scrolls the content rather
  than opening whatever drawer the app has on that gesture.

**A prose table must not be `width: 100%`.** That tells the auto layout to fit
the container, so it squeezes every text cell toward its minimum: a four-column
table on a 390px phone came out at ~150px a column, two words to a line, seven
lines deep. Instead:

- `width: max-content` with `min-width: 100%` — each column asks for the width
  its text wants, and a small table still spans the column.
- Cap **text** cells (`max-width: ~17rem`) so one long cell can't demand a
  single enormous line; it wraps at a readable measure instead.
- Set **numeric** cells `white-space: nowrap`. A figure broken across two lines
  stops being a figure. Numeric columns then stay tight while prose columns
  breathe, which is what you want from each.

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
- **A tight contact layer next to a hairline border reads as a SECOND BORDER.**
  *(2026-08-07, the course cards.)* The other end of the same problem. `0 1px
  2px rgb(0 0 0 / .06)` has no negative spread, so it paints a dark line hugging
  all four edges — 1px outside a border that is itself 1px. The owner's words
  were "too harsh close to the card itself and it looks like a second border",
  which names the mechanism exactly. **Any layer meant to sit under a bordered
  surface needs negative spread at least equal to its blur** (`0 10px 28px
  -10px`), so it only ever appears below and away from the outline. Delete the
  contact layer rather than dimming it — and delete it from `:hover` too, or it
  returns the moment a pointer arrives.
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

## Reproducing a reference *(2026-08-02)*

The owner sends screenshots of an interface and asks for it. Two rules, both
learned the expensive way on the settings dialog.

**Copy its LAYOUT; keep the app's OWN COLOURS.** *(2026-08-03, the landing
page — six rounds of correction.)* A reference's structure is what the owner
is pointing at: the stacking, the order, the proportions. Its palette is not.
Building the landing in the reference's cream (`#FAF9F5`, `#F0EEE6`) put a
page next to the app that read as a different product, and the owner's verdict
was *"I already have colours that look good on my app — why aren't I using
these even for the website?"*

The failure is quieter than it sounds, because it does not arrive as one wrong
colour. It arrives as a drift of near-misses picked up one at a time —
`#e7e7e6` for a border, `#f4f4f3` for a fill, `#a3a3a3` for a placeholder —
each defensible alone and collectively a different **temperature** from the
app's neutral greys. Nobody can point at the culprit, which is why the
complaint comes out as "it looks cream" when no cream exists in the file.

So: **any colour written as a hex in a component is a bug unless it is a
brand-specific one-off with a comment saying why.** Reach for the `@theme`
tokens in `globals.css` — the app's own canvas, line, ink, muted, active.
Audit it by enumerating what is actually painted rather than by looking:

```js
[...new Set([...document.querySelectorAll("body *")]
  .map(e => getComputedStyle(e).backgroundColor)
  .filter(c => c !== "rgba(0, 0, 0, 0)"))]
```

Every value that comes back should be a token you can name. Anything else is
the drift.

**A third-party component's own CSS may beat the appearance API it gives you.**
*(2026-08-03, Clerk.)* Setting `border` on Clerk's field left
`border-width: 0px` because it draws that edge as a box-shadow ring; setting
`boxShadow` through the same API measured unchanged, because Clerk injects its
stylesheet *after* the app's. The fix was a plain class selector in
`globals.css` with `!important`, and the lesson is the method: when a styling
prop appears to do nothing, read the computed style back before trying a
different value. Two rounds were spent changing values that were never
reaching the element.

1. **"Copy this" means copy it.** The first pass adapted the reference to the
   app — kept our headings, our radii, added a header band the reference did
   not have — and every one of those was a defect. When a measured spec is
   given (font sizes, weights, line heights, exact `rgb()` values, paddings),
   those numbers are the brief. Write them down in the file as the spec and say
   they are not to be changed without a new measurement.
2. **Verify by reading computed styles back out of the DOM**, not by looking.
   Render it, `getComputedStyle` the dialog, the heading, a tab, an input, and
   print the values against the spec. Eyeballing a 15px heading against a 19px
   one does not work; a table of measured-vs-specified does.

**Where a replica lives:** its own route, bare, with no app chrome in the frame
(`/workspace`, `/settings`). It is something to compare against the original,
not a decision about the product — so it must never replace a working surface
students depend on. Offer the swap; don't perform it.

**Honour a spec that fights itself.** "No visible border" on a
`rgba(255,255,255,0.5)` field over a white panel is literally true and
invisible in practice. Use the device the spec uses elsewhere (a 1px inset
ring) and note the substitution in the file rather than shipping a control
nobody can find.

**Don't build the parts that have nothing behind them.** A toggle copied from a
notifications panel, in an app with no notifications, is a switch that does
nothing. Either wire it to something real or say plainly that it was left out.

**A design FILE is not the design — screenshot the reference's own render.**
*(2026-08-06, the Framer landing.)* Reading the canvas gave a headline with
`blendingMode: exclusion` and an underlined wordmark. Neither is what Framer
draws: it wraps the content in a z-indexed layer, which makes it its own
stacking context, so the photograph is not in the blend's backdrop and the
attributes do nothing. Implementing them faithfully produced a muddy blue-grey
headline the owner had never seen. **Where a serialised attribute and a
screenshot disagree, the screenshot wins** — it is what was approved. Note the
divergence in the file so the next reader doesn't "fix" it back.

**Render the candidates; don't list them.** *(Same day, six headline options.)*
Injecting each into the live hero and measuring settled the argument in one
screenshot: the owner's own draft was four lines and 184px where every
alternative was two lines and 92px. A layout fact beats a copy opinion, and it
costs one Playwright loop over `h1.textContent`.

---

## Two layout traps that look like design bugs *(2026-08-06)*

Both cost a round of "it looks wrong" and neither is visible in the CSS you
wrote — the browser is doing something correct that you did not ask for.

**Flex and grid CLAMP an item bigger than its container to the start edge.**
`place-items-center` on a 50px logo disc containing a 56px line box put the
glyph at y=0, not the −3px true centre, so the mark sat low and its underline
fell off the circle. This is deliberate — the engine refuses to push content out
of a top edge you could never scroll back to — and no amount of alignment
tweaking fixes it. **Make the child fit** (here, set the line box to the
container's own height) rather than arguing with the alignment.

**Tailwind preflight's `img { max-width: 100% }` squashes any image wider than
its layout box.** A 40px avatar in a 32px overlap slot rendered **32×40** — an
oval. `width` does not override a `max-width`; only `max-width: none` does. This
bites exactly when overlap is the point, which is the one case where an image is
meant to exceed its own slot. If a fixed-size image renders the wrong aspect,
read `max-width` back before touching anything else.

The method for both: `getBoundingClientRect()` against what you specified. A
32×40 disc and a 40×40 disc are hard to tell apart by eye and trivial to tell
apart by number.

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
