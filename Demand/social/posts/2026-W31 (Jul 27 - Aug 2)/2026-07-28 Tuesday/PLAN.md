# 2026-07-28 Tuesday

9:16, all light. Post each folder's images in order (`01 → 07`).

Both slots are **build-in-public progress posts** shot from the live app's mobile
layout. Today's ship (58 commits): **the dashboard was rebuilt around measuring
the studying** — reading time is now tracked and charted a week at a view, with
a momentum line; the four stat tiles gained sparklines and week-on-week deltas;
the course cards were redesigned around a per-course spine. In the same run the
**reader got quieter** — base text up to 18px, breadcrumbs moved into the reading
column, one sidebar instead of two, and the course home rewritten as a page of
prose rather than a second dashboard.

| Slot | Time (local) | Folder | Slides | Type |
|------|------|-------|-------|------|
| ☀️ Morning | — | — | — | none today (see note) |
| 🌤️ Afternoon | ~13:00 | `afternoon/` | 7 | **progress post** — the studying, measured |
| 🌙 Evening | ~19:00 | `evening/` | 6 | **progress post** — the reader got quieter |

> **No morning post**, same as yesterday — the old evergreen set still carries
> the dead "comment" CTA and desktop crops.

---

### 🌤️ Afternoon — `afternoon/` · Your studying, now measured
**Post title:** Your studying, now measured

**Slides:** cover → a week of real minutes (the chart) → *how it counts* (no
screenshot — the accrual rule is the feature) → the four stat tiles → both
courses redesigned → in the works → search CTA

**Caption:**
> Building in public 🛠️ — the Booklesss dashboard now measures what you actually
> read. Minutes per day, a week at a view, with a momentum line through it. And
> it's deliberately strict: hide the tab or stop moving for a minute and the
> clock stops. It would rather undercount than flatter you.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #studytok #zambia #zcas

---

### 🌙 Evening — `evening/` · The reader got quieter
**Post title:** The reader got quieter

**Slides:** cover → bigger, lighter body type → the course home as a page that
reads → one sidebar, one job → in the works → search CTA

**Caption:**
> A whole day spent taking things *off* the page you read on 🛠️ — body text up
> to 18px, the breadcrumb moved down into the column, two sidebars collapsed
> into one, and the course home rewritten as sentences instead of a wall of
> tiles. Most of building this is subtraction.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #designinpublic #studytok #zambia

---

*Regenerate: `node _scripts/cap-dashboard.mjs` (dev server on :3100) for the
shots, then `POST=measured node _scripts/prog-post.mjs` and `POST=quieter node
_scripts/prog-post.mjs`. Both default to today's date. No posting connector —
upload manually.*

> ⚠️ **Shots go stale fast.** The app shipped 6 more commits *during* this
> capture run, one of which renamed the chart heading to "Productive time" — the
> first pass had to be thrown away. Pull immediately before capturing.
