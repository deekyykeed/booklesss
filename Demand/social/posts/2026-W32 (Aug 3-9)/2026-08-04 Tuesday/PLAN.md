# 2026-08-04 Tuesday

9:16, all light. Post each folder's images in order. **No CTA slide on anything
today** — the call to action is the caption now.

**A day with no ship to post.** Today's commits are one feature, the sign-up and
onboarding rebuild, and that is not a subject (RULES.md rule 6). So the day is
two product components and three sets of logo plates.

| Slot | Time (local) | Folder | Slides | What it is |
|------|------|-------|-------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 3 | one course card, at three stages |
| ☀️ Midday | ~11:00 | `2-midday/` | 4 | logo plates |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 4 | one stat tile, at four measures |
| 🌆 Evening | ~19:00 | `4-evening/` | 4 | logo plates |
| 🌙 Night | ~21:30 | `5-night/` | 4 | the offline card, at four states |

**Two plate slots, not three.** The night slot went out as a third set of
plates and came back rejected — *"all of them were very good except that last
one, can you redo it focusing on something else"* — so it is a product
component again: **"Study without data."** Eight of the sixteen plates are now
used; the other eight are still the reserve for a genuinely thin day.

> **The neutral curriculum is four university courses now** — Organisational
> Behaviour, Business Law, Operations Management, Marketing Management, each
> with a real course tree under it. It used to be Mathematics / Physics /
> Computer Science / Data & Statistics, and a dashboard photographed with
> "Mathematics 64%" on it tells a university student the product is for
> somebody doing school maths. Rewritten in `neutralize.mjs`; nothing in the app
> changed.

> ⚠️ **Shot from the clean worktree pinned to `c5a775e`.** The other machine on
> this OneDrive folder is mid-refactor on the onboarding files. Check `git log`
> before posting.

---

## 🌅 Morning — `1-morning/` · One course card, at three stages

**Post title:** A month in, just started, never opened

**Slides:** a month in → just started → never opened

One card, at full width. Not the section that holds four of them — photographing
the section means shrinking all four to fit, which is four components at a third
of the size rather than one at full size.

**Caption:**
> Same card, three courses, three different stories — and none of the numbers on
> it are decoration 📈
> The percentage is how much of the course you've marked as understood, not how
> many pages you've scrolled past. The little flame is consecutive days. The line
> behind the text is a fortnight of your own reading on that subject, so a week
> off shows as a flat stretch and there's no arguing with it.
> The button is the honest part: it says Resume and takes you to the exact step
> you stopped on, or it says Start because you've never opened it. A course
> you've been avoiding looks like a course you've been avoiding.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #studygram #universitylife #zambia

---

## ☀️ Midday — `2-midday/` · Logo plates

**Slides:** the mark on cream → the name in full → one letterform, past the
frame → the mark repeated as brand paper

`03-mark-cream`, `05-name-light`, `11-macro-b`, `15-field` from
`2026-08-03 Monday/6-logo/`.

**Caption:**
> The logo is the word now — no mark, no glyph ✍️
> The old one was a folded square that rendered 32 pixels wide in a browser tab,
> and at that size nobody read it as a shape. It arrived as a dark speck in front
> of the name and the eye went straight past it.
> A mark that has to be enlarged before it's legible isn't doing a mark's job,
> and at tab size there's nowhere to enlarge it to.
> It's drawn from the font's own outlines rather than saved as a picture, so it's
> sharp at any size, on anything, forever.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #branding #logodesign #edtech #zambia

---

## 🌤️ Afternoon — `3-afternoon/` · One stat tile, at four measures

**Post title:** Four numbers, and none of them are how many pages you opened

**Slides:** performance → streak → coverage → time this week

Four tiles is four *states* of one component — the same tile answering a
different question — not four components.

**Caption:**
> Four numbers on your dashboard, and every one of them measures something you'd
> actually want measured 📊
> Performance is how much of what you've read you say you understood — not how
> much you opened. Streak is consecutive days, which is the only honest way to
> measure a habit. Coverage is how much of your course exists behind you.
> Time this week is real minutes, counted only while you're actually reading:
> the tab has to be visible and something has to have happened in the last
> minute, so a step left open while you make tea earns nothing. It undercounts
> on purpose. A number you can inflate is a number that stops meaning anything
> the first week you inflate it.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #studytips #productivity #zambia

---

## 🌆 Evening — `4-evening/` · Logo plates

**Slides:** the mark on light → both forms stacked → the wordmark as its own
edge → one letter per line

`01-mark-light`, `07-both`, `10-outline`, `14-vertical`.

**Caption:**
> Three s's. Booklesss ✍️
> It's a study app for university students — your courses in one place, in order,
> written so you can actually read them, with the boring parts of studying
> (where did I stop, what have I covered, am I keeping it up) counted for you.
> The name is the joke and the promise: no books to carry, nothing to print,
> nothing to lose the week before an exam.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #branding #edtech #studygram #zambia

---

## 🌙 Night — `5-night/` · The offline card, at four states

**Post title:** Study without data

**Slides:** the offer → saving, counting up → saved on this date → the same
card on an iPhone

One component, four states that differ in kind. Every one of them is the card's
own: the count comes from the service worker as it puts each page on the
device, the date is the stamp the card itself wrote when a save finished, and
the iPhone wording is the same `isIos()` branch a student on Safari gets —
Safari has no install API, so directions are the only honest thing to show.

`cap-0804-night.mjs` → `POST=p-offline`. **Needs a production server**, not
`next dev`: the card only renders when a service worker is active, and dev
deliberately unregisters it.

**Caption:**
> Your notes work with no connection, and no data 📥
> One tap saves every lesson in your courses onto the phone itself. Well under a
> megabyte — less than a single photo — and after that the app opens whether
> you have bundles left or not.
> It's opt-in on purpose. Spending someone's data without asking is exactly the
> kind of thing that gets an app deleted, so nothing is downloaded until you
> say so, and it tells you what it's doing while it does it.
> Bus, hostel with bad signal, lecture room with no wifi, the night before an
> exam when the bundle is finished. That's when studying actually happens.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #studygram #universitylife #zambia

---

*Regenerate — the working tree is shared with another machine, so serve the app
from the pinned worktree:*
`git -C C:/bkls-shot checkout --detach c5a775e`, `rm -rf C:/bkls-shot/platform/.next`,
`npx next dev -p 3101`, *then:*
`BASE_URL=http://localhost:3101 node _scripts/cap-0804.mjs`
*then* `POST=p-card|p-tile node _scripts/prog-post.mjs`.

*The night slot is the exception: it needs a **production** server on the same
worktree —* `npm run build && npx next start -p 3101` *— then*
`BASE_URL=http://localhost:3101 node _scripts/cap-0804-night.mjs` *and*
`POST=p-offline node _scripts/prog-post.mjs`.
*The plates are copied from Monday's `6-logo/`; regenerate a different set with*
`SLOT=<slot> node _scripts/logo-variants.mjs`.
*No posting connector — upload manually.*

---

### Write-offs — what was shot today and cannot go out

> **The search palette.** Captured (`sq-a/b/c.png`) and unusable. Search is
> **global, not per-course**, so its result rows are the app's real step titles
> from every course. `MAP` covers lesson names and the step titles the reader
> shots need, not all ~200 — and the banned-word scan cannot help, because an
> unmapped title is *off-syllabus*, not *forbidden*, so nothing throws. Shot as
> it stands it returns a screen of hedging and forward rates under an app headed
> Marketing Management. Two queries were tried inside the fully-mapped course
> before working out that the palette ignores which course you are in. Mapping
> every step title in the index would fix it.

> **The checkpoint row.** `.checkpoint-row` is 370×34 css — the note button and
> the two answer faces, and nothing else. The question it asks lives in an
> `aria-label`, so an isolated shot is three controls floating with nothing to
> answer. Fails rule 2 the same way the tap-to-define card did.

> **The callout, at four kinds.** Only ONE kind is used anywhere in the seeded
> content — 61 `key` callouts and no `warning`, `example` or `exam`. Shooting
> the other three would mean authoring content to photograph, which is drawing
> UI. Worth knowing for whoever writes steps next: the three unused kinds exist
> and nothing uses them.

> **Superseded, nothing posted.** Three earlier cuts of this day are gone: two
> built around the onboarding rebuild (wrong subject, rule 6), and one that put
> the dashboard's whole course section on a slide with all four cards shrunk to
> fit (wrong shape, rule 1) and the tap-to-define card isolated with nothing to
> point at (rule 2).
