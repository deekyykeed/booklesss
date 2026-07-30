---
name: daily-post
description: >
  Makes the day's Booklesss social posts — build-in-public 9:16 carousels shot
  from the live course reader. Use whenever the owner asks for today's posts,
  this week's posts, a post about a feature that just shipped, or to redo a
  slot. Triggers: "make content for today's posts", "today's posts", "make a
  post about X", "social for today", "build-in-public post", "regenerate the
  afternoon carousel", "what should we post". Covers the whole pipeline: work
  out what actually shipped, pick the story, capture the app's MOBILE layout,
  render the carousel, write the day's PLAN.md with captions. Read RULES.md in
  this folder first — it holds the accumulated framing and copy rules. Not for
  PDFs (step-skill) or lesson writing (step-skill / lesson-feedback).
---

# daily-post

Booklesss posts are a **build-in-public progress log**. Every carousel is about
a real thing that shipped, shot from the running app — never a mockup, never a
stock claim, never a feature that doesn't work yet described as if it does.

**Two rules are enforced in code and cannot be worked around:**

1. **No post names a course or a school.** Captures are relabelled to a neutral
   curriculum and then scanned; a banned word inside the crop throws instead of
   writing the PNG. Booklesss is not one syllabus.
2. **Every word sits inside the social safe area** (x 96–848, y 300–1400). The
   renderer measures each text block after layout and throws on anything that
   crosses. When it fires, shorten the line — never widen the box.

Both are explained with their reasons at the top of `RULES.md`. Read it first.

Everything lives in `Demand/social/`. Read that folder's `README.md` for the
layout, and **read `RULES.md` next to this file before rendering anything** —
it is the accumulated set of framing numbers and copy rules, and it is where new
lessons get written back.

---

## The pipeline

### 1. Find out what actually shipped

Don't invent a story. Read the repo:

```bash
git log --since="<date of the last post>" --oneline --stat
```

Commit subjects on this repo are written as sentences about what changed, so the
log usually *is* the story. Cross-check against `PROJECT_MEMORY.md`'s last
session entry for anything that shipped but wasn't committed as a headline.

A post is worth making when the change is **visible to a student**. Refactors,
config, and infrastructure are not posts. If a day's commits are all plumbing,
say so and offer the honest alternatives rather than manufacturing news.

### 2. Pick the story, and split it into slots

**The cadence is five slots a day** — `1-morning/` 07:00, `2-midday/` 11:00,
`3-afternoon/` 15:00, `4-evening/` 19:00, `5-night/` 21:30. Google Calendar
holds a daily recurring reminder for each.

A day rarely ships five separate features, and five slots does not mean five
announcements. It means **five angles on what shipped**. Give each slot a single
sentence you could say out loud — "the chart is a rolling seven days", "the
button is the progress bar" — and build its slides to prove that one sentence,
with its own shots. A crop reused across two slots reads as padding.

Rank the angles by how much they'd matter to a student and fill the slots in
that order, so the weakest angle is the one that gets dropped if the day is
thin. **Four honest posts beat five padded ones** — if the fifth would be a
stale evergreen or a restatement of the third, ship four and say so in
`PLAN.md`. Never manufacture news to fill a slot.

### 3. Capture from the live app

The capture scripts screenshot the **running dev server**, so start it first:

```bash
cd platform && npx next dev -p 3100
```

If Next refuses with *"Another next dev server is already running"*, check
whether that server is actually alive and serving before killing it — a wedged
render worker hangs requests while still holding the port. See RULES.md.

Then write a capture script in `Demand/social/_scripts/`. Copy the most recent
`cap-*.mjs` as the starting point; each day's shots differ, so a new day usually
means a new capture script rather than an edit to an old one. The invariants
(mobile viewport, 9:16 clips, dev-badge removal, element-based scrolling,
seeded progress, page-space macro crops) are all in RULES.md.

**If a screen photographs badly, add data — never draw.** The reader is only as
photogenic as the state behind it, and a virgin browser shoots as an empty app.
Seed plausible progress and shoot again. Do not invent a card, a chart, a badge
or a number to make a slide look fuller, and never retouch what the app appears
to do. Cropping, framing and fading are the only liberties.

Look at every shot with the Read tool before moving on. A crop that cuts a word
in half or leaves 60% empty gradient is a re-crop, not a "good enough".

### 4. Render the carousel

Add a config to `Demand/social/_scripts/prog-post.mjs`. Each config is a thunk
returning `{ slot, slides }`, built from three slide types:

| Type | What it is |
|---|---|
| `cover({eyebrow, title, sub})` | Text on the brand gradient. Opens the post and marks the "in the works" beat. |
| `feature({img, title, sub, top, fadeTop, fadeBot, shotLeft})` | A full-bleed app shot with the headline over it. |
| `searchCTA()` | The closing Google search-bar slide. Always last, never edited. |

```bash
cd Demand/social
POST=<config-name> node _scripts/prog-post.mjs      # writes into today's folder
```

`top`, `fadeTop` and `fadeBot` are the framing controls, and getting them right
is most of the work — the arithmetic is in RULES.md. Set `shotLeft: 0` on any
slide built from a tight macro crop. Render, **read the PNGs back**, adjust,
re-render. Two or three passes is normal.

The render refuses to write a slide whose text leaves the safe area, naming the
line and how far over it went. Treat that as the copy being too long for the
frame, not as the frame being too small.

### 5. Write the day's PLAN.md

`Demand/social/posts/<week>/<date + weekday>/PLAN.md`. Copy the previous day's
and swap: the ship summary, the slot table, the slide running order, and each
slot's title + caption. Say plainly in the file when a slot is deliberately
empty and why.

Captions follow the copy rules in RULES.md — in particular the CTA, which is
fixed and is **not** "comment".

---

## What makes a post honest

This is the part that matters most, because it is the part that is easy to get
wrong and expensive to get wrong publicly.

- **Shipped is shipped.** If the composer has no backend, the copy says
  "building this", not "ask it anything".
- **The screenshot is the product.** Never retouch app UI in the poster. Framing,
  cropping and fading are fine; editing what the app appears to do is not.
- **Seeded progress is demo data, and stays plausible.** The dashboard reads
  localStorage, so the shots seed a few cleared checkpoints — someone a couple of
  weeks in, never a finished course that only launched today. The numbers on
  screen must be the app's own arithmetic on real checkpoint ids.
- **Real course material only.** Zambian companies, ZMW, actual ZCAS/UNZA course
  codes. The material in the shot is the material students get.

---

## Feeding this skill

The owner is going to keep changing what these posts look like. When they react
to a rendered slide — "too small", "that's cut off", "don't lead with that",
"keep doing that" — write it into `RULES.md` in this folder, in the section it
belongs to, with the reason. A rule with its reason survives; a bare instruction
gets re-litigated every week.

Rules that turn out to be one-offs get deleted rather than left to accumulate.
