# Marketing assets

Everything generated for socials lives here. Nothing outside this folder is touched.

```
marketing/
├─ posts/       ← what to post, organised by day: posts/<date>/{morning,afternoon,evening}/
├─ social/      ← the first stills + motion clip (standalone assets)
├─ selected/    ← keepers worth repeating, each with its recipe (RECIPE.md)
├─ _source/     ← raw crops the assets are built from (intermediate)
└─ _scripts/    ← the generators, re-runnable
```

## posts/ — the daily plan

One folder per day. Inside each day, three carousels — `morning/`, `afternoon/`,
`evening/` — plus a `PLAN.md` with times and captions. Each slot is a carousel
of individual 9:16 PNGs (`01.png … 05.png`), posted in order.

**House style** (per direction, 2026-07-24): imagery is **un-boxed** — macro
crops of the real UI that bleed off the frame, never a screenshot sitting in a
rounded card. No swipe arrows, no page counters. Copy is about **Booklesss the
product**, not the economics content. Every carousel ends on a **Google
search-bar CTA** ("search booklesss — three s's — first result"). Text/logo stay
inside the social safe area (top ~300px, bottom ~340px, right ~150px clear).

Planned one day at a time — no fixed calendar, because the app changes daily.
Each day's copy is a module: `_scripts/days/<date>.mjs` (title, the note that
opens PLAN.md, and the three slots — post title, caption, slides). Write that
file, then run the generator; it renders the PNGs **and** writes PLAN.md from
the same module, so the captions and the images never drift apart.

```bash
npm run build && npx next start -p 3100        # fonts come from the app's build
node marketing/_scripts/5-day-carousels.mjs    # today, or DAY=2026-07-26 …
```

New crops come from `_scripts/4b-neutralize-capture.mjs`, which screenshots the
real UI with the course tree relabelled to a neutral multi-subject curriculum —
the live app only holds economics, and the posts are about Booklesss holding
every subject. Never post a raw capture of the seeded course.

## social/

All 9:16. Stills are 2160×3840 (1080×1920 @2x); the clip is 1080×1920, 30fps, 18s, no audio.

| File | What it is |
| --- | --- |
| `01-sidebar.png` | Sidebar as a floating panel — "Never lose your place." |
| `02-app.png` | The reader in context — "Your whole course, one glance." |
| `03-detail.png` | Macro shot of the active row + indicator — "Details you can feel." |
| `04-plain.png` | Same panel, no copy — caption it yourself in the app you post from. |
| `05-sidebar-motion.mp4` | 18s screen recording: clicking through lessons, folders opening, the indicator sliding. |
| `05-sidebar-motion.webm` | Same clip, source quality. Use the mp4 for Instagram/TikTok. |

Type is set in the app's own fonts (Familjen Grotesk for headlines, Inter for
body), pulled straight from the build — so the posters and the product match.

## Regenerating

Needs the production server running, because the scripts screenshot the real app:

```bash
npm run build
npx next start -p 3100          # scripts default to http://localhost:3100

node marketing/_scripts/1-capture.mjs   # raw crops   -> _source/
node marketing/_scripts/2-posters.mjs   # stills      -> social/
node marketing/_scripts/3-video.mjs     # motion clip -> social/
```

Point them elsewhere with `BASE_URL=http://localhost:3000`.

Notes:

- Poster copy is plain HTML in `2-posters.mjs` — edit the strings and re-run.
- `3-video.mjs` needs an h264 encoder for the mp4. The one Playwright bundles is
  VP8-only, so it looks for `ffmpeg-static` (or `FFMPEG=<path>`); without one it
  still writes the webm and says so.
- `paths.mjs` hardcodes the hashed font filenames from `.next/static/media`.
  If a Next build changes them, update the two constants there.
