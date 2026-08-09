# 2026-08-09 Sunday

9:16. Post each folder's images in order. **No CTA slide on anything** — the
call to action is the caption.

**The dashboard's day.** Everything that landed after Saturday's shots was
session 54's dashboard rebuild finally photographed: the greeting line that
compares instead of counting, the time tile whose footer is the goal you set,
and the finished course card that stopped saying "Resume" over a course with
nothing left to resume. The checkpoint row was meant to lead the day — the
Lordicon doodles came back with their words — and it was shot BROKEN: see the
first note below, which is the most important thing in this file.

| Slot | Time (local) | Folder | Slides | What it is |
|------|------|-------|-------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 3 | **the course card's three claims** — Start, Resume, Done ✓ |
| ☀️ Midday | ~11:00 | `2-midday/` | 4 | **the line under the greeting** — always a comparison now |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 3 | **the time tile** — its footer is the goal you set |
| 🌆 Evening | ~19:00 | `4-evening/` | 3 | brand plates — **the letters**: the seam, the third s, the two Bs |
| 🌙 Night | ~21:30 | `5-night/` | 3 | brand plates — **the system**: the palette, the bar, both papers |

> ⚠️ **Shot from the clean worktree `C:/bkls-shot`, pinned to `4b801bc`** —
> today's HEAD, the commit that landed the Save doodle's own Lottie file.
> **Production serve, not `next dev`**: on dev, lottie-web dies in a loop
> ("this.elements[i].destroy is not a function", StrictMode double-mount) and
> the step page never settles. `npm run build && npx next start -p 3101`.

---

## ⚠️ THE CHECKPOINT DOODLES WERE BROKEN AT SHOT TIME — fixed the same evening

The morning slot was going to be the row settling: Lordicon doodles back,
grey at rest, their own colours when chosen, one word under each mark. It was
shot at `4b801bc` and the shots (`row-*.png` in `_source/feature-capture/`)
show **three floating words with no marks above them** — each answer's player
had mounted an empty 26px div, no SVG inside, no console error, identical on
the production build and on `booklesss.vercel.app` itself. Rule 10: a broken
control is not a subject, so the row came off the slot plan and the dashboard
took all three product slots.

**Cause and fix, landed by the parallel session while this day rendered:**
the CSP had no `'unsafe-eval'`, which lottie-web needs to build its
animations — the fetch succeeded, the player mounted, and the drawing died
silently at the policy line. `fcb216b` fixes the CSP, and three more commits
behind it kept moving the row (gentler words, Save's book mark, doodled note
verdicts, `dd66809` at day's end). **The row is drawing again at HEAD but was
mid-redesign all evening** — the "shoot it LAST" rule cuts the other way
here: it is TOMORROW's morning post, shot fresh once it has sat still for a
day, and `ONLY=row` in cap-0809.mjs is ready for it. The words in ANSWERS
changed after these shots, so do not reuse today's row set for anything.

---

## 🌅 Morning — `1-morning/` · The card's three claims

**Post title:** A finished course finally looks finished

**Slides:** Start (untouched — 0%, no invented figures) → Resume (mid-course,
the fill in the card's own hue) → Done ✓ · Read it again

Friday's own PLAN flagged it in writing: the finished card differed from an
untouched one "by the fill and nothing else" — still said Resume, still read
0d, still wore a decaying score next to finished work. Settled on the 8th,
and the three claims are three different pictures now. The Done card drops
the streak figure (nothing left to keep one on), seats a green check where
the score was — a recency-weighted score DECAYS after the last session, so a
course finished a month ago would read ~25% beside the word Done — and the
bar owns the claim: "Done ✓ · Read it again", pointing at step one, which is
exactly where reading it again starts.

**Caption:**
> A finished course used to look exactly like one you'd never opened 🛠️
> Same card, three claims. Before you start: no invented numbers — a dash, a
> zero, and the first step's name. Mid-course: the button IS the progress
> bar, filled in that course's own colour — the same colour its last
> fortnight of reading draws behind the text. Finished: the streak figure
> goes, a green check takes the score's seat, and the button says the true
> thing at last — Done ✓ · Read it again.
> I caught the old version lying while shooting Friday's posts — a finished
> course wearing "Resume" like it had somewhere left to go. Fixed the next
> day.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

---

## ☀️ Midday — `2-midday/` · The line under the greeting

**Post title:** The dashboard stopped counting and started comparing

**Slides:** "Nothing logged this week yet — you're aiming at 5h." →
"3h 20m of your 5h week — about 1h 40m behind pace." →
"This week's goal is done — 5h 40m against 5h. 5 days in a row." →
"3h 10m this week, 50 min more than you usually do. 2 days in a row."

Four seeded weeks, one pinned greeting, and the only thing that moves between
slides is the claim — which is the ship: the line is ALWAYS a comparison now,
never a bare count. Grouped at render so the greeting holds one position
while the line under it grows from one line to two.

**Known risk, on the record:** this is a text block on a gradient — 750×159px
drawn, the flattest thing posted since the ActionBar was rejected. It was
posted anyway because the states differ in KIND and the sentence is the
component. If the owner's read is "empty frame", the subject was still right
and the crop has no more to give — retire the subject rather than padding
the crop.

**Caption:**
> The line under the greeting stopped counting and started comparing 🛠️
> It used to say "2 sections done across 3 days." True, and useless — a count
> with nothing to measure it against tells you nothing about whether to be
> pleased. Now it's always a comparison: against the weekly goal you set when
> you joined, paced by the study days YOU picked — a day your plan gave you
> off never reads as "behind" — or, with no goal set, against your own usual
> week.
> Every sentence is arithmetic on measured time. Where it can't compare
> honestly, it says less instead of inventing a benchmark.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

---

## 🌤️ Afternoon — `3-afternoon/` · The time tile's footer is the goal

**Post title:** The tile that counts your hours knows what you promised

**Slides:** "+60m vs last week" (never set a goal) → "3h 20m · of 5h" (grey,
short of it) → "5h 40m · of 5h" (lit in the tile's own blue — met)

Third question asked of this tile (8-04: four measures; 8-06: three points in
one history) and a genuinely different one: not what it measures but what it
measures AGAINST. The owner's own note built it — the footer read "+56m first
week" and the reaction was "just say of 7h 30m or whatever the target was."

**Caption:**
> The tile that counts your hours now knows what you promised 🛠️
> Its bottom line is the goal you set at onboarding: grey "of 5h" while the
> week is short of it, lit in the tile's own blue the week you cross it. If
> you never set a goal it doesn't invent one — it keeps comparing you to
> your own last week instead, because that's the only honest yardstick left.
> Being scored against a number you never chose is the thing this dashboard
> refuses to do.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

---

## 🌆 Evening — `4-evening/` · Plates: the letters

**Post title:** Six letters, and what's in them

A plate slot, and the honest reason: the day's fourth product angle was shot
broken (the row, above) and nothing else that shipped is postable — the
security pass is auth surfaces (rule 6), the four UNZA courses are course
content (rule 7), the vertical ladder is spacing with no state axis. Three
NEW plates, each checked against all 43 in `logo-variants.mjs`; the discards
were a letter-spacing specimen (36-bk-rule owns spacing) and a grain plate
(`Brand/` has no grain.png on disk to embed, and synthesising a texture to
stand for the real one is drawing).

1. **46-stack2** (cream) — the word broken at its own seam: "Bkl" over
   "sss". The three letters that spell, the three that hiss. 14-vertical is
   a letter per row and reads as a banner; this is a lockup.
2. **47-third-s** (gradient) — the letter that makes the name ours, in the
   only brand hue. The name is a deliberate misspelling and one letter
   carries it.
3. **48-two-bs** (dark tile) — the same letter, two hands: the word's B in
   Familjen, the icon's B in Burbank with its bar, baseline-aligned.

**Caption:**
> The name is a misspelling on purpose. One letter carries it 🛠️
> The word split at its own seam — three letters that spell, three that
> hiss. The third s in the only colour the brand owns, because that's the
> letter that makes Booklesss ours. And the same B twice: the word's B and
> the app icon's B with its bar — two hands, one letter.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #branding #logodesign #typography #zambia

---

## 🌙 Night — `5-night/` · Plates: the system

**Post title:** The brand is ink — the colour belongs to the numbers

Second plate slot, which is the day's ceiling. Three more, same check:

1. **44-palette** (gradient) — the word above the four hues the dashboard
   actually works in: performance orange, streak purple, coverage green,
   time blue. The claim is the restraint — the brand stays ink.
2. **49-underscore** (cream) — the icon's one gesture, the bar under the B,
   carried across the whole word at the disc's own ratios. "Bklsss" has no
   descenders, so the bar runs clean.
3. **45-grounds** (split) — one word, both papers: the cream every course is
   printed on above, the tile black the icon ships on below.

**Caption:**
> The brand is ink. The colour belongs to the numbers 🛠️
> The four dots are the dashboard's own working hues — performance orange,
> streak purple, coverage green, time blue — and the word stays black above
> all of them. The bar under the whole word is borrowed from the app icon,
> at its exact ratios. And the split frame is the two papers this brand
> prints on: cream for the courses, black for the icon.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #branding #logodesign #typography #zambia

---

## Notes on what did NOT go out

**1. The checkpoint row.** Broken in production — the whole note at the top
of this file. The strongest subject of the weekend, unpostable today.

**2. The security pass** (password floor, `/reset-password`, the headers).
Auth and sign-up surfaces — rule 6. Also half of it is three Supabase
dashboard toggles that aren't done yet.

**3. The four UNZA courses planned from their own paper.** Course content
and school names — rule 7, twice over.

**4. The vertical ladder and the title's trip to Bricolage and back.** A
spacing scale has no state a camera can show, and the before no longer
exists — a re-staged "before" would be fabricated history.

**5. The tab that earns its place.** Active alone on day one, Completed
appearing the day something is finished — a real design story living in a
~300×40 text row. Rule 1's ratio ceiling kills it as a subject; the morning
caption carries the finished-card half of the story instead.

---

## Regenerate

*The working tree is shared with another machine, so serve from the pinned
worktree:*
`git -C C:/bkls-shot checkout --detach 4b801bc`, stop anything on :3101,
clear `platform/.next` (PowerShell `Remove-Item -Recurse -Force`), then —
**production, not dev** (the dev server kills lottie-web in a StrictMode
loop and the step page never settles):

```
cd C:/bkls-shot/platform && npm run build && npx next start -p 3101
BASE_URL=http://localhost:3101 node _scripts/cap-0809.mjs          # all sets
ONLY=row BASE_URL=http://localhost:3101 node _scripts/cap-0809.mjs # the row, when it's fixed
POST=d-card|d-line|d-tile node _scripts/prog-post.mjs
SLOT=4-evening PICK=46-stack2,47-third-s,48-two-bs node _scripts/logo-variants.mjs
SLOT=5-night PICK=44-palette,49-underscore,45-grounds node _scripts/logo-variants.mjs
```

**Pass `DAY=2026-08-09` explicitly on any re-render after midnight.**

---

## Findings worth keeping

- **A control whose artwork arrives by fetch can pass every text assert and
  still be a hole.** The row shots' `expect:` checks all passed — the words
  and `data-answered` are real DOM text — while the marks above them were
  empty divs. For any Lottie/canvas/img subject, probe what's INSIDE the
  mark's box before trusting the crop, and read the PNG.
- **`next dev` cannot photograph this app's Lottie controls at all** —
  StrictMode double-mounts the player and lottie-web dies in a destroy loop.
  Production serve is the honest surface anyway.
- **Capture scripts share one `_source/feature-capture/` namespace.** This
  run's card shots were briefly `card-*.png` and silently overwrote
  cap-0807's `card-3-done.png` before being renamed `cd-*`. Prefix a day's
  shots uniquely; a clobbered source PNG is only re-shootable if its pin is
  still in its PLAN.
- **`Brand/grain.png` does not exist**, despite CLAUDE.md saying every brand
  asset lives in `Brand/` and naming it. Either the move lost it or it was
  never committed — worth settling, since the PDF build scripts reference a
  grain texture.
- **The greeting states were computed before they were filenames.** Writing
  the four target sentences from `studyLine()`'s own arithmetic, then seeding
  weeks to produce them, meant every shot landed first try with its `expect:`
  proving the sentence. Cheaper than shooting and hoping.
