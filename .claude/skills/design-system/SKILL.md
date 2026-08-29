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

> ⚠️ **`platform/src/app/globals.css` IS THE PALETTE. This file is a summary of
> it, and a summary can go stale — read the tokens before you use them.**
>
> This section used to list an amber/navy/teal palette on a `#F9FAFB` canvas.
> **None of those values exist in the app.** On 2026-08-22 a new surface was
> built for `/dashboard` against this table plus whatever was nearest to hand,
> and the owner's first reaction was *"that green, or whatever colour you keep
> adding, does not match the actual UI that I already have."* It cost a full
> rebuild. A wrong map is worse than no map.

> **`/dashboard` is the exception and has its own palette.** Everything below
> describes the app proper — the reader, the course pages, settings. The
> dashboard shell reads none of it; see "The `.cui` system" further down, and
> keep the two apart.

### The tokens the app actually defines
Use the CSS variable, never the hex — a literal is a value that stops following
the token the day somebody changes it.

| Token | Value | Job |
|---|---|---|
| `--color-canvas` | `#f5f5f5` | app background |
| `--color-card` | `#fcfcfb` | cards sitting ON the canvas |
| `--color-line` | `#dfdfdf` | hairlines, dividers |
| `--color-line-2` | `#d4d4d4` | pills, tags, circle buttons |
| `--color-ink` | `#171717` | primary text |
| `--color-ink-2` | `#525252` | tertiary text |
| `--color-muted` | `#707070` | secondary text |
| `--color-placeholder` | `#b2b2b2` | input placeholders |
| `--color-active` | `#ededed` | selected row, quiet circle buttons |
| `--color-btn` | `#0b0b0b` | THE primary action — solid black |
| `--color-brand` | `#3ecf8e` | the Booklesss green |
| `--color-brand-deep` | `#17754d` | that green, readable as text on white |
| `--color-danger` | `#8d2525` | inline error/link red |

Depth is `--shadow-lift` (a block of content on the reading surface) and
`--shadow-chip` (a control that should read as pressable). Both are deliberately
tiny; nothing blurs past 10px. If two stacked cards' shadows meet in a 12px gap,
the shadow is too big.

### ⚠️ The brand green is a MARK, not a UI colour
`--color-brand` draws the logo and a couple of accents. **It is not the colour of
buttons, surfaces or controls.** The app is cream, white and ink; the one action
that matters on any screen is `--color-btn`, the same value the header's circle
buttons and `.btn[data-variant="primary"]` use.

The one standing exception is the **session call screen** (`/study/…`), which is
dark with a green orb — a deliberate liberty so a student can tell Listen from
Read before reading a word. **Do not treat that screen as licence.** A second
surface borrowed it in August and had to be rebuilt. And note it is itself under
review: PR #178 moves the session screen back onto the app's own light surface.

### Accent selection rule
Max ONE accent colour per project. Never mix. Saturation below 80%.

### Banned colours
- Purple/violet neon gradients — the "AI purple" aesthetic is banned
- Pure black `#000000` — always off-black or zinc-950
- Oversaturated accents above 80% saturation
- Mixed warm/cool grey systems in the same project

---

## The `.cui` system — what `/dashboard` is built from *(2026-08-29)*

**`/dashboard` is a transcription of `claudeuiclone.html`**
(`_dev/reference-ui/`, moved off the repo root 2026-08-29), scoped
under `.cui` in `globals.css`. Owner's call, 2026-08-28: *"100% the ui, that's
where I want to start from."* It is the surface every new app page should now be
built to match, so this section is the spec — read it before adding a page, a
panel or a control to that tree.

**⚠️ IT DOES NOT USE THE TOKENS IN THE SECTION BELOW.** `.cui` ships its own
palette and reads none of `--color-canvas`, `--color-ink`, `--color-accent`.
That is deliberate and it cuts both ways: **do not reach for app tokens inside
`.cui`, and do not reach for `.cui` tokens outside it.** Two warm near-identical
palettes bleeding into each other is the temperature drift this file already
warns about, where every individual near-miss is defensible.

### Tokens — the whole palette, and there is no other

| Token | Value | Job |
|---|---|---|
| `--page-bg` | `#fcfcfb` | the main pane |
| `--sidebar-bg` | `#fafaf9` | the sidebar, one step deeper than the pane |
| `--surface-3` | `#ffffff` | the composer, and anything lifted off the pane |
| `--row-selected` | `#edece8` | the current nav row |
| `--row-hover` / `--fill-ghost-hover` | `rgba(11,11,11,.05)` | every hover fill |
| `--track` | `#f6f6f4` | a segmented control's groove |
| `--track-header` | `rgba(11,11,11,.05)` | the sidebar header's groove |
| `--text-100` | `#0b0b0b` | primary |
| `--text-200` | `#52514e` | secondary — nav labels at rest |
| `--text-300` | `#898781` | tertiary, placeholders, section headings |
| `--border` | `rgba(11,11,11,.1)` | every hairline |
| `--clay` | `#d97757` | the ONE accent |

**The clay is a mark, not a UI colour.** It draws the spark in the greeting and
the unread dot, and nothing else — no buttons, no fills, no links. The same rule
the brand green has in the app proper.

**Three greys of text, and they do real work.** A nav label sits at `--text-200`
and goes `--text-100` when its row is current; a section heading is `--text-300`
permanently. Do not introduce a fourth.

### Geometry

- `--radius: 8px` on rows, ghost buttons and icon buttons. **28px round / 36px
  squircle** on the composer (see below — the pair moves together), **7px** on a
  segmented control's shell and **5px** on its thumb. Nothing else gets a radius
  of its own.
- `--row-h: 32px` is the nav row, the icon button and the segmented control's
  height. A control that is not 32px tall needs a reason.
- The sidebar is **288px**, with `padding: 0 11px 0 8px` — asymmetric on purpose,
  because the icon slot already carries visual left padding.
- The pane's column is `max-width: 40rem` centred, inside `padding: 0 56px`
  stepping to 32px under 900 and 16px under 640.
- Hairlines are `1px solid var(--border)` and never a shadow.

### Type

`--font-sans` (anthropic-sans) for everything, `--font-serif` for the greeting
and the wordmark **only**. Sizes: 14px nav label, 13px section heading and
segmented control, 16px composer editor, `clamp(26px, 3.7vw, 37px)` greeting.

**⚠️ 16px on the composer editor is not a taste decision** — iOS Safari zooms
the viewport on focus for anything smaller, and does not zoom back out. Any new
text input on this surface is 16px.

### The four component patterns

Everything on the page is one of these. Build a fifth only when none fits.

**1. Ghost button.** The hover fill is painted on a `::before` layer at
`z-index: -1`, with `isolation: isolate` on the parent, so that pressing squishes
the *fill* and not the glyph. `transform: scale(.975)` on `:active`, over
`--dur-fast` (60ms) out and `--dur-slow` (.45s) with the `--spring` easing back.
**Scaling the button itself instead makes the icon look blurred rather than
pressed.**

**2. Row.** 32px, `gap: 8px`, a fixed 28px icon slot, then a label that
`text-overflow: ellipsis`. Selected state is a `--row-selected` fill *and* the
label going to `--text-100` — two signals, per the selected-state rule below.

**3. Segmented control.** A `--track` groove with 1px of padding; the active
item is white with `box-shadow: 0 0 0 1px rgba(11,11,11,.1) inset, 0 1px 2px
rgba(0,0,0,.05)`. **The thumb is the item's own background, not a sliding
element** — simpler, and it cannot desynchronise from the selection.

**4. Composer / raised panel.** `--surface-3`, a squircled radius, and an edge
that is part of the shadow rather than a border:

```css
box-shadow: 0 .25rem 1.25rem 0 rgba(0,0,0,.035),   /* glow */
            0 0 0 1px rgba(31,31,30,.15);          /* ring */
```

Three states, and the third is the one people forget:

| state | ring | glow |
|---|---|---|
| rest | `.15` | `.035` |
| hover | `.3` | `.035` |
| focus-within | `.3` | `.075` |

**⚠️ Hover is suppressed while the pointer is over a control inside the panel**,
via `:hover:not(:has(button:hover, a:hover, [role="button"]:hover, label:hover))`.

**⚠️ THE RADIUS IS A PAIR AND BOTH HALVES MOVE TOGETHER.** `corner-shape:
squircle` sits behind `@supports`, and a squircle at a given radius reads
visibly TIGHTER than a round corner at the same number — the superellipse spends
part of the radius easing into the turn instead of meeting the edge at a
tangent. Measured at the reference's original 14, the squircle needed 18 to
match, and the ~1.28 ratio has held at every bump since (14/18 → 22/28 →
**28/36**, the owner's, all on 2026-08-29). Scale both by it; never raise one
alone, or Safari and Firefox — which have no `corner-shape` today — inherit a
number chosen to compensate for a curve they will not draw.

```css
.cui .composer { border-radius: 28px }                    /* round fallback */
@supports (corner-shape: squircle) {
  .cui .composer { corner-shape: squircle; border-radius: 36px }
}
```

**The ceiling is half the panel's height.** The composer is 114px tall with one
line in it, so 36 has 21px of headroom; past 57 the corners meet and it is a
pill. A further bump needs the panel to grow with it.

**The edge survives the corner because it is the ring in the `box-shadow`, and a
box-shadow follows the border shape.** This is also why the corner cannot be cut
with `clip-path`, which would slice the ring and the glow off.
Without it, reaching for a button lights the whole frame, which reads as though
the container were the thing about to activate.

### The modal is patterns 4 and 2, not a fifth *(2026-08-29, the resource packs)*

A full-screen picker looked like it needed a new pattern and did not. The panel
is **pattern 4** (raised panel) and each row is **pattern 2** grown to two
lines — same 8px gap, same fixed 28px slot, only the height changes because a
description needs the room. Reach for the existing two before inventing.

Three things it settled that the next overlay inherits:

- **The radius pair scales with the panel.** The composer is 28 round / 36
  squircle; a smaller panel takes **22 round / 28 squircle** — the same ~1.28
  ratio, not the composer's numbers copied across. A panel that is not the
  composer's size should not wear the composer's corner.
- **Below 640px it stops floating and becomes a bottom sheet.** A centred card
  with 24px of scrim either side wastes the width the content needs, and a
  sheet puts the confirm button under the thumb that opened the control. Square
  off the bottom corners when it docks.
- **Give focus back on close.** Store `document.activeElement` on open and
  restore it in the effect's cleanup. Without it, dismissing drops focus to
  `<body>` — and on this surface the composer is supposed to hold the caret, so
  closing a modal silently undoes the autofocus.

### A control that reports a selection wears the selection *(owner, 2026-08-29)*

The composer's Resources button says **"Resources"** with nothing chosen and
**the pack's name** once something is. *"The selected pack will actually become
the new word there when selected."* Nothing chosen is the invitation; something
chosen is the answer.

Two rules that came out of building it, both of which generalise to any
control that names what is inside it:

- **⚠️ THE NAME COMES FROM THE LIST'S OWN ORDER, NEVER THE ORDER THINGS WERE
  PICKED.** Otherwise the word jumps to whatever was touched last, and a
  control meant to *report state* looks like it is *reacting to the click*.
  Render the picker in the same order so the word always names the row nearest
  the top.
- **A count beside a name is "+N others", not the total.** "+2" reads as "and
  two more"; a bare "3" next to one name reads as a contradiction. Put the full
  list in `title` and `aria-label`.
- **⚠️ A LABEL THAT BECOMES DATA IS UNBOUNDED, AND IT WAS NOT BEFORE.** A fixed
  noun can size itself; a name cannot. **Cap the button AND ellipsise the
  label — one without the other does nothing**, because a flex child with no
  width limit simply grows and `text-overflow` never fires. Cap in `ch` (it is
  bounding text) and remember the cap sits on the *button*, so the icon, gaps
  and count eat into it: 22ch left only 101px for the label and cut a name
  mid-word. Size the cap against the longest real name, not against the
  shortest.

### The composer bar must survive every width, and it wraps before it hides

It shipped as one `white-space: nowrap` row with a single escape hatch (hiding
the model button's effort label under 420px), which was already losing —
measured at 348px of content against 338px of track at 390px wide. Adding one
control spent the rest.

Three mechanisms, applied in the order a real narrowing hits them, so it
degrades a step at a time instead of falling off a cliff:

1. **The bar may wrap.** `flex-wrap: wrap` with `row-gap: 8px`; `bar-right`
   keeps `margin-left: auto` so it stays pushed right on one line and drops as
   a group.
2. **The widest non-control may shrink.** `min-width: 0` is what actually
   allows it — the default `min-width: auto` pins a flex child to its content
   however narrow the track gets.
3. **Labels go last, and only labels.** Never a control. Every button stays on
   screen and stays 32px; that is the rule that does not bend.

**Prove it by sweeping, and prove the sweep.** Measure `scrollWidth >
clientWidth` on the bar and the composer, plus `documentElement.scrollWidth >
innerWidth`, at every width that matters — and then **revert the fix in the
running page and confirm the probe reads dirty**. A sweep that cannot report a
failure is not evidence of passing.

### Icons — Hugeicons Free, and the arithmetic that keeps them consistent

`<HugeIcon name="…" className="i" />`. Add a name to `ICONS` in
`scripts/gen-huge-icons.mjs`, run `npm run gen:icons`. **The keys are the app's
own vocabulary, not the set's** — `chevron-down`, not `arrow-down-01` — so the
generator is the only file that knows which library is underneath. Three sizes, and the classes
are the only place weight is tuned:

| class | size | stroke-width | on screen |
|---|---|---|---|
| `.i` | 20px | 1.5 | 1.25px |
| `.i-16` | 16px | 1.56 | 1.04px |
| `.i-12` | 12px | 1.92 | 0.96px |

`on-screen stroke = stroke-width × rendered size ÷ viewBox`, and the set's
viewBox is 24 (as MynaUI's was before it — which is why swapping sets in August
cost no re-measuring). **The stroke number goes UP as the icon gets smaller** — it is
compensating for the shrinking viewBox so apparent weight stays constant. A new
size follows the same formula; do not eyeball it.

**⚠️ The width is set on the CHILDREN (`.i > *`), never on the `<svg>`.** The set
puts `stroke-width` on each path as a presentation attribute, and a declaration
on an element always beats a value inherited from its parent — so setting it on
`.i` alone does nothing at all and the set's own 1.5 wins in silence.

This replaced a hand-drawn 19-symbol sprite on 2026-08-29 at zero visual cost,
because `1.5 × 20/24 = 1.25` is exactly what the sprite used. **The lesson is
the general one: prefer one real set with a naming convention over hand-drawn
geometry, and check whether the grids agree before assuming a swap will show.**

### Overlays — blur, don't darken *(owner, 2026-08-29)*

An open drawer or modal puts a scrim over the page: **`rgba(11,11,11,.12)` with
`backdrop-filter: blur(10px)`**, not a heavy tint.

Dimming alone has to go quite dark before a light UI reads as *behind* something,
and dark-over-cream turns muddy long before it gets there. Blur says "not this
layer" at almost no cost in contrast, so the page underneath stays legible
instead of being hidden.

**⚠️ Two things about `backdrop-filter` here.** It makes the element a containing
block for `position: fixed` descendants — so the scrim must have none, and the
drawer is a *sibling* at a higher z-index (40 over 30), not a child. And it is a
full-screen blur on a phone, the most expensive thing on the surface: affordable
only because it lives for the few seconds an overlay is open. **Never put one on
persistent chrome.**

### Motion

`--ease: cubic-bezier(.4,0,.2,1)` for state changes at `--dur: .2s`. The drawer
travels over `.42s`. `--spring` (a `linear()` curve) is for a press releasing,
nothing else. Everything transition-based is disabled under
`prefers-reduced-motion`.

### Nothing on this surface is `position: fixed`

The sidebar is a flex column that becomes `position: absolute` against `.app`
below 768px; the composer sits in the flow of its pane. That is deliberate and it
retires the containing-block trap described in the next section — **keep it that
way when you add chrome.**

---

## Engineering traps that look like design bugs

Each of these was paid for in a real session. They present as "the CSS is
wrong" and none of them is.

### `backdrop-filter` makes an element a containing block for `position: fixed`
Exactly as `transform`, `filter`, `perspective`, `contain` and `will-change` do.
In this app `#content-surface` carries `backdrop-filter: blur(16px)` **and is the
scroller**, so anything `position: fixed` rendered inside it is fixed to a box
that scrolls — it rides the page. Symptom, verbatim: *"when I scroll up or down
it moves with the screen instead of being fixed."* Nothing about the element is
wrong; it is in the wrong parent. **Fixed chrome goes in the layout, outside
`<main>`.**

### A border drawn on an inner layer disappears at the corners
If the radius lives on the shell (with `overflow: hidden`) and the edge is an
`inset 0 0 0 1px` shadow on a child that has no radius of its own, you get a
square ring inside a round clip and the border vanishes at all four corners:
*"there's a difference in radius between the white container and the border."*
**Put `border` and `border-radius` on the same element** — one element cannot
disagree with itself.

### Which element scrolls depends on the viewport width
`#content-surface` is the scroller on desktop; the **document** is the scroller
on a phone. A modal scroll-lock has to hold both. A probe that only locked
`#content-surface` moved nothing at 390px wide and would have passed a panel you
could still scroll the page behind — see the probe rule below.

### A backtick inside a CSS-in-JS `<style>` template ends the string
Including one inside a CSS *comment*. The parse error surfaces at the opening
`<style>` tag, pages away from the comment that caused it. Never write a token
name in backticks inside a colocated style block.

### Choose easing for the DISTANCE, not the house default
The app's `cubic-bezier(0.16, 1, 0.3, 1)` is right for a 200px sweep across an
ActionBar and reads as a jump cut over 800px of screen — a per-frame probe had it
71% of the way home 119ms into a 560ms transition. A full-screen morph wants
something like `cubic-bezier(0.32, 0.72, 0, 1)`.

### Verify by SERVING, and make the probe prove it can see a positive
A typecheck and a lint are static; neither resolves a module at runtime nor
parses a stylesheet. And a measurement that reads the same on both sides of an
A/B is void — if the "working" case also reads zero, fix the probe, not the
theory.

**When a behaviour is too fast to observe, widen its window rather than reason
about it.** A 450ms autofocus guard could not be tested honestly — the
tool round-trip is ~660ms, so every simulated interaction landed after the
timer had already fired, and the test "passed" while proving nothing.
Temporarily raising the constant to 3000ms made the guard observable
(interaction at 1133ms → focus never taken), and it went straight back
afterwards. **Put the real value back in the same session and grep for the
test marker before committing** — a widened constant left in is a bug that
looks like a design decision.

### Wrapping a `position: fixed` element in an animated `<div>` breaks it the same way `backdrop-filter` does
The header and sidebar are both `fixed`. An "enter" stagger built by wrapping
each in `<div className="app-enter-top" style={{animationDelay}}>` looked
harmless and would have made both drift for the length of the animation —
`animation`/`transform` on an ancestor makes it a containing block for fixed
descendants, exactly like the `backdrop-filter` trap above, just arriving from
the animation side instead of the blur side. **Put the animation class on the
fixed element itself, never on a wrapper**, and if the caller can't reach
inside the component to pass a per-instance delay, default the delay on the
class in CSS instead (`animation-delay: calc(var(--enter-i, 1) * 55ms)`) — a
piece of fixed chrome wants the same stagger position everywhere it's used
anyway.

### `dynamic = "force-static"` makes `searchParams`/`req.url` query params permanently empty
A force-static route has no request at render time, so every caller reads the
same empty snapshot — `new URL(req.url).searchParams.get("id")` returns `null`
for every request, including ones with a real id on it. It built clean and
typechecked clean; only serving it and hitting the endpoint showed every
response coming back `{ok:false, reason:"no-id"}`. If a static/prerendered
route needs a per-request value, that value has to be a **path segment**
(`generateStaticParams` + `[id]`), never a query string — a segment is part of
the route so it survives prerendering, a query param is part of the request
which prerendering has none of.

---

## Typography

### Font stack (priority order)
- **Display/headlines:** `Geist`, `Satoshi`, `Cabinet Grotesk`, `Outfit` — tracking tight (`-0.025em`), weight 700–900
- **Body:** Same family at weight 400 — leading 1.65, max-width 65ch
- **Mono:** `Geist Mono`, `JetBrains Mono` — for code, metadata, timestamps

### Banned fonts
- `Inter` — banned in NEW marketing/editorial work. ⚠️ **Not a rule about the
  app**: `--font-sans` in `globals.css` IS Inter and is the whole of the app's
  chrome (header, sidebars, dashboard, settings). The app's four faces are
  Inter, Familjen Grotesk (`--font-display`), Aptos (`--font-content`, the
  reading) and Satoshi (`--font-container`, chrome that frames a sentence).
  Match the surface you are building on; do not "fix" it to something else.
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
- **Never run a perpetual animation on the element that owns a border or a
  multi-layer shadow — put it on a child.** "Animate only opacity" is not
  enough on its own: opacity on a bordered, shadowed box makes Safari
  re-rasterise the border and every shadow layer each frame, which is visible
  as choppiness on a phone and invisible in Chrome on a desktop. Move the
  animated fill to an `::after` with nothing but a background colour, and
  promote it (`transform: translateZ(0)` — Safari honours the transform hint
  on a pseudo-element more reliably than `will-change` alone). *(2026-08-08)*

### Loading placeholders
**A placeholder must be the same object it becomes, not a stand-in for it.**
Every property that differs between the skeleton and the real thing — border,
radius, shadow, background — is a separate visible change at the moment they
swap, and a control that changes three times on one load reads as broken
rather than loading. Match the box exactly and let only the *fill* differ.

Two corollaries, both learned from one header avatar:
- **Never draw a settled-looking empty state mid-load.** A bordered circle with
  nothing in it looks finished while the app is still working, which is worse
  than a placeholder that admits it is one. Keep pulsing until there is
  something real to draw.
- **Fade art in when it lands** (~160ms). The box was already reserved so
  nothing moves, but going from nothing to full strength in one frame reads as
  a flicker against the placeholder it replaces.

Count the states before you build the load: three is a glitch, two is a load.

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

## Three layout traps that look like design bugs *(2026-08-06, 2026-08-09)*

Each cost a round of "it looks wrong" and none is visible in the CSS you
wrote — the browser is doing something correct that you did not ask for.

**A grid column with no `grid-template-columns` floors at MIN-CONTENT, and
`truncate` cannot save a box already sized to the text it was meant to cut.**
`grid gap-3 md:grid-cols-2` looks symmetrical and is not: from `md` up Tailwind
writes `repeat(2, minmax(0, 1fr))` — with its zero floor — and below `md` there
is no template at all, so the implicit column is `auto`-sized and `auto` floors
at min-content. One `whitespace-nowrap` line inside (which is what `truncate`
is) reports its *whole untruncated* width as min-content, and the column grows
to fit a string that was always going to be clipped. Cards then run off the
right edge of a phone while every other section on the page sits correctly.

Two clamps are needed and people usually apply one:
- `grid-cols-1` sizes the **track**
- `min-w-0` on the item sizes the **item** — a grid item carries `min-width:
  auto` of its own and will overflow a track that is perfectly sized

An item that sets `overflow: hidden` zeroes its own floor for free, which is
why this hides for months: it only surfaces when a *wrapper* with no overflow
(a drag handle, an animation shell) sits between the grid and the card. And it
needs long enough content to exceed the viewport, so it ships looking fine and
breaks on one student's longer course name.

**The tell: compare against a sibling grid that already works.** On the
dashboard the stat tiles were always correct because their `grid-cols-2` was
explicit. Same container, same padding, different overflow behaviour — that
asymmetry names the cause before you open devtools.

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
