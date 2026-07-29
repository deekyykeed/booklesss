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

One ship = one post. Two distinct angles on the same ship = two posts (that is
the normal shape: the **shell** in the afternoon, the **content** in the
evening). Give each slot a single sentence you could say out loud —
"a second course landed", "the finance notes show their working" — and build the
slides to prove that one sentence.

Do not pad a day to three slots. Two strong posts beat three, and a stale
evergreen carousel is worse than an empty slot.

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
seeded progress) are all in RULES.md.

Look at every shot with the Read tool before moving on. A crop that cuts a word
in half or leaves 60% empty gradient is a re-crop, not a "good enough".

### 4. Render the carousel

Add a config to `Demand/social/_scripts/prog-post.mjs`. Each config is a thunk
returning `{ slot, slides }`, built from three slide types:

| Type | What it is |
|---|---|
| `cover({eyebrow, title, sub})` | Text on the brand gradient. Opens the post and marks the "in the works" beat. |
| `feature({img, title, sub, top, fadeTop, fadeBot})` | A full-bleed app shot with the headline over it. |
| `searchCTA()` | The closing Google search-bar slide. Always last, never edited. |

```bash
cd Demand/social
POST=<config-name> node _scripts/prog-post.mjs      # writes into today's folder
```

`top`, `fadeTop` and `fadeBot` are the framing controls, and getting them right
is most of the work — the arithmetic is in RULES.md. Render, **read the PNGs
back**, adjust, re-render. Two or three passes is normal.

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
