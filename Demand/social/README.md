# Social — daily carousels & assets

Everything generated for socials lives here. This is the **daily-posting command
centre**: plan a day, regenerate its carousels, post in order. Nothing outside
this folder is touched.

> Moved here from `platform/marketing/` on 2026-07-25 so the daily content lives
> at the top of the workspace, not buried inside the app. The generators still
> borrow Playwright from `platform/` and (for the live-app captures) screenshot
> the running app — see Regenerating.

```
Demand/social/
├─ posts/       ← what to post: posts/<week>/<date + weekday>/{morning,afternoon,evening}/
├─ stills/      ← the standalone stills + motion clip (was social/)
├─ selected/    ← keepers worth repeating, each with its recipe (RECIPE.md)
├─ _source/     ← raw crops the assets are built from + vendored fonts
│  ├─ carousel-crops/   ← the neutral UI superzooms the day carousels reuse
│  └─ fonts/            ← inter.woff2 + familjen-grotesk.woff2 (vendored copies)
└─ _scripts/    ← the generators, re-runnable
```

## posts/ — the daily plan

Days are grouped by week and named with their weekday, so you navigate by
"this week → Saturday" instead of decoding a date:

```
posts/2026-W30 (Jul 20-26)/2026-07-25 Saturday/{morning,afternoon,evening}/
```

Both levels lead with the ISO week / date, so a file explorer still lists them
in chronological order. Inside each day: three carousels — `morning/`,
`afternoon/`, `evening/` — plus a `PLAN.md` with times and captions. Each slot
is a carousel of individual 9:16 PNGs (`01.png … 05.png`), posted in order.

**House style** (per direction, 2026-07-24): imagery is **un-boxed** — macro
crops of the real UI that bleed off the frame, never a screenshot sitting in a
rounded card. No swipe arrows, no page counters. Copy is about **Booklesss the
product**, not the course content. Every carousel ends on a **Google search-bar
CTA** ("search booklesss — three s's — first result"). Text/logo stay inside the
social safe area (top ~300px, bottom ~340px, right ~150px clear).

**All light.** Dark-background posts wait until the app ships a real dark mode —
a light screenshot on a dark canvas doesn't sit right.

Planned one day at a time — no fixed calendar, because the app changes daily.

### Make a day (the common case — self-contained, no server)

`5-day-carousels.mjs` renders the three carousels into the right week/day folder
automatically (it derives the weekday + week number from `DAY`). It reuses the
neutral crops in `_source/carousel-crops/` and embeds the vendored fonts from
`_source/fonts/`, so it needs **no build and no running server**:

```bash
# edit the SLOTS copy in _scripts/5-day-carousels.mjs first, then:
DAY=2026-07-27 node _scripts/5-day-carousels.mjs
# → posts/2026-W31 (Jul 27 - Aug 2)/2026-07-27 Monday/

SLOT=morning DAY=2026-07-27 node _scripts/5-day-carousels.mjs   # one slot only
```

Re-running a day rebuilds its images but leaves that day's `PLAN.md` alone.

⚠️ A blanket run clears **every** slot folder and refills it from `SLOTS` — so
if a slot's images came from another generator (`prog-post.mjs` writes the
progress posts), pass `SLOT=` to rebuild just the one you mean.

**Icons.** Slides take `icon: "<name>"` and stamp it top-right, on the
wordmark's line. They come from Streamline's free Freehand Line set, pulled the
way the app pulls Solar — a local Iconify package
(`@iconify-json/streamline-freehand`, a devDependency of `platform/`) resolved
with `@iconify/utils` and inlined as SVG at render time. No network, nothing
vendored by hand; an unknown name throws. Browse names at
[icones.js.org/collection/streamline-freehand](https://icones.js.org/collection/streamline-freehand).
The premium Freehand set is paywalled and its download URLs are unreachable
from a sandbox anyway — stay on the Iconify package.

Then write that day's `PLAN.md` (copy an existing day's and swap the captions).

## stills/

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
body) — so the posters and the product match.

## Regenerating the crops / stills / video (live-app captures)

> **House rule — capture from the app's MOBILE layout, not desktop.** Posts are
> mostly for mobile feeds (9:16), and the desktop layout doesn't sit right in a
> tall frame. Use the `PHONE` profile in `paths.mjs` (`browser.newPage(PHONE)`)
> when re-capturing. ⚠️ The current `_source/carousel-crops/` + `stills/` were shot
> on **desktop** (1440px) — switching to mobile means re-capturing them *and*
> re-tuning the crop geometries in `5-day-carousels.mjs`. Do that next time the app
> is running locally.

Scripts `1`–`3` (and `4`/`4b`/`6`) **screenshot the real app**, so they need the
production server running:

```bash
cd ../../platform
npm run build
npx next start -p 3100          # scripts default to http://localhost:3100

cd ../Demand/social
node _scripts/1-capture.mjs   # raw crops   -> _source/
node _scripts/2-posters.mjs   # stills      -> stills/
node _scripts/3-video.mjs     # motion clip -> stills/
node _scripts/7-ai-crops.mjs  # top bar, STEP panel, AI composer -> _source/carousel-crops/
```

`4b-neutralize-capture.mjs` and `7-ai-crops.mjs` share one relabelling map
(`neutralize.mjs`): the live app only holds the economics course, and the posts
are about Booklesss holding every subject, so every capture is relabelled to a
neutral multi-subject curriculum before the shot. Never post a raw capture of
the seeded course.

`7-ai-crops.mjs` also stages one thing on purpose: voice mode's glow is driven
by live mic loudness and headless has no mic, so it switches voice mode on for
real — the bold icon, the border ring, the "Voice mode on" hint are all genuine
app state — then writes a mid-sentence loudness value so the still shows what a
speaking frame looks like.

Both accept `CHROMIUM=<path>` for machines with a pre-baked browser.

Point them elsewhere with `BASE_URL=http://localhost:3000`.

Notes:

- Poster copy is plain HTML in `2-posters.mjs` — edit the strings and re-run.
- `3-video.mjs` needs an h264 encoder for the mp4. The one Playwright bundles is
  VP8-only, so it looks for `ffmpeg-static` (or `FFMPEG=<path>`); without one it
  still writes the webm and says so.
- `paths.mjs` hardcodes the hashed font filenames from `platform/.next/static/media`
  for the *live-app* scripts. If a Next build changes them, update the two
  constants there. (The day generator uses the vendored `_source/fonts/` copies
  instead, so it's unaffected.)
- Playwright + its browsers come from `platform/node_modules` — run `npx playwright
  install chromium` in `platform/` if the launch ever fails.
