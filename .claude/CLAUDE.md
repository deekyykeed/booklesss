# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Booklesss** is an edtech product for Zambian university finance/business courses. **The course reader at `booklesss.vercel.app` is the product** (`platform/`, Next.js 16 + Supabase): a student reads steps there, ticks checkpoints and says how each section landed. Steps are authored as `.mjs` beside the lesson they belong to and published with `npm run seed:course` → `npm run gen:course`.

The original pipeline — source material (PPTX/PDF) → Python ReportLab script → PDF → posted to Slack — still exists and still builds. It is now **provenance and marketing**: lead magnets, business documents, and the PDFs the reader steps were mined from. Slack-as-the-paid-product was dropped (Linear BOO-7, MSA §3.4); do not rebuild paid Slack channels.

**On the reader:** economics, Corporate Finance (25 steps), Strategic Management (7), Treasury Management (12 — Treasury operations was split into three on 2026-08-01). Also on disk: BBA 1110 (UNZA), PDFs only. **Course codes and school names never appear anywhere a student sees** — see the memory index.
**Slack:** free community only; **workspace situation unresolved** (three workspaces; the public invite link points to `bookless10`, whose Pro trial expired, while SM PDFs went to `booklesss20` — see the top of `Operations/workspace.md`). Confirm the target workspace with the owner before posting anything or writing the invite link anywhere. | Website: `booklesss.framer.ai`
**Founding rate deadline:** April 18, 2026 — **this date has passed.** Do not reference it in new marketing content; ask the owner what offer replaces it.

## Commands

**Generate a PDF:**
```bash
python3 "Schools/[School]/[Course]/[lesson]/sources/build_[course]_[step]_[slug].py"
```

**Transcribe a video lecture:**
```bash
python3 tools/transcribe.py "path/to/video.mp4"
```

**Bulk-transcribe a folder of videos:**
```bash
python3 tools/transcribe_bulk.py "path/to/folder/"
```

No build system, no tests, no linter. Scripts are self-contained.

## Folder Structure

```
Booklesss/
├── README.md                          ← owner's map: status, money model, action queue
├── PROJECT_MEMORY.md                  ← session log, next-session list, dead ends
├── Schools/
│   ├── ZCAS/                          ← Zambia Centre for Accountancy Studies
│   │   ├── Strategic Management/
│   │   ├── Treasury Management/
│   │   ├── Corporate Finance/
│   │   └── _pipeline/                 ← future ZCAS courses (currently empty)
│   └── UNZA/                          ← University of Zambia
│       ├── BBA 1110 — Business Administration/
│       └── _pipeline/                 ← 13 raw UNZA courses (LOCAL ONLY — gitignored)
│
├── _dev/                             ← shared build assets (referenced by ALL build scripts)
│   ├── fonts/                         ← Parastoo, Aptos, Parkinsans, Satoshi
│   ├── step-generator/               ← Python HTML step generator (used by some content_*.py)
│   └── tmp/                           ← scratch previews and text extracts (gitignored)
│
├── tools/                            ← standalone utility scripts (transcribe.py, transcribe_bulk.py)
├── Operations/                        ← workspace.md, leads, revenue, checklist,
│                                        pricing-strategy.md, positioning.md
├── Demand/                            ← demand-side content
│   └── social/                       ← daily 9:16 social carousels + generators (the posting hub)
├── platform/                         ← Next.js 16 course-reader app (booklesss.vercel.app)
└── Brand/                            ← THE brand folder: logo, icon, mark, grain
```

**Every brand asset lives in `Brand/`** (owner's call, 2026-08-03) — the logo,
the app icon, the serif lockup, the diamond mark and `grain.png`. It used to be
split between `_dev/brand/` and a `Brand/` drop zone that nothing read, which
meant "the brand folder" named two places. There is one now, at the root where
the owner looks for it, and `Brand/build_brand.py` regenerates the wordmark and
icon from the font at any size.

See [`WORKSPACE.md`](../WORKSPACE.md) for the full map, per-folder detail, and the
**"do not move"** rules (lesson build scripts, `Brand/`+`_dev/fonts`, marketing generators).

### Active Course Anatomy

Each active course has this structure — every lesson is self-contained:

```
[Course]/
├── _course.md          ← course status tracker (the single source of truth)
├── 01-[slug]/          ← one lesson = one Slack channel; folder slug = channel slug
│   ├── steps/          ← built PDFs (Step 1.1.pdf, Step 1.2.pdf)
│   ├── sources/        ← source files + build scripts for those steps
│   └── lesson.md       ← step status + note of any external sources
├── 02-[slug]/ …
├── sources/            ← course-wide sources & build scripts (outlines, study pills)
├── assignments/        ← current-semester assignment briefs
└── past-papers/        ← past exam papers (only TM has these so far)
```

Course-level extras (`sources/`, `assignments/`, `past-papers/`) exist only where a course has that material. Course-wide output PDFs (course outline, study pill) sit at the course root.

If a source (e.g. a textbook) feeds multiple lessons it is copied into each. The lesson folder is the unit of truth — everything needed to understand or rebuild its steps lives inside it. External dependencies are noted in `lesson.md`.

### Pipeline Courses

`Schools/UNZA/_pipeline/` holds 13 UNZA courses (DEM 1110, ECN 1115, ECN 1215, GMS 1035, HRM 1015, IRS 1035, MATH 1110, PAM 1025, POL 1015, PSY, SOC 1110, DEV 1150, ECN 2115) plus a `_video-archive/` of lecture videos. These are raw source material — not yet in Booklesss. When a course is moved into Booklesss it gets the full lesson structure and is promoted from `_pipeline/` to an active folder in the school.

**`_pipeline/` and `_textbooks/` are gitignored and exist only on the owner's machine + OneDrive** — they contain files over GitHub's 100 MB limit. Never add them to git. In a fresh clone these folders are absent; that is expected.

## Architecture

### Content Pipeline
Each lesson step gets one Python script that lives in that lesson's `sources/` folder (naming: `build_[course]_[step]_[slug].py`). The script is both the content and the build tool — all text is written directly into the script, which outputs a PDF to the sibling `steps/` folder. There are no intermediate markdown files. Exception: TM Step 1.1 uses the legacy name `build_lesson_1_1_tm.py`.

Each script resolves paths using `_ROOT` (5 levels up to the Booklesss project root) for fonts and brand assets, and `../steps` relative to its own location for output. This keeps the lesson self-contained: open any `sources/` folder and you have the source material, the build script, and one `python3 build_*.py` away from regenerating the PDF.

Scripts are ~700 lines and follow a fixed structure:
1. Font registration — scripts use Windows fonts vendored in `_dev/fonts/` (Parastoo, Aptos, Parkinsans)
2. Color palette constants (per-course)
3. Page geometry (A4, 2.2cm side margins)
4. ReportLab `ParagraphStyle` definitions
5. Canvas callbacks for cover page and body pages (header/footer on every page)
6. Helper functions: `hairline()`, `section()`, `callout()`, `resources_box()`
7. `build()` function that assembles `story[]` and writes the PDF
8. `if __name__ == "__main__": build()`

### Course Visual Identity
All courses: cream `#FFFDE8` cover, black type (`#121212`), warm rule `#E0DACB`, Parastoo-Bold display. No navy, no green, no amber.

| Course | School | Cover BG | Accent | Display Font |
|--------|--------|----------|--------|--------------|
| Strategic Management | ZCAS | `#FFFDE8` cream | `#DC2626` cardinal red (eyebrows only) | Parastoo-Bold |
| Treasury Management | ZCAS | `#FFFDE8` cream | none — cream + black | Parastoo-Bold |
| Corporate Finance | ZCAS | `#FFFDE8` cream | none — cream + black | Parastoo-Bold |
| Business Administration | UNZA | `#FFFDE8` cream | none — cream + black | Parastoo-Bold |

### PDF Content Structure (All Lessons)
Every PDF follows this sequence: cover → 4–7 content sections → 2 embedded discussion questions → Key Terms table → Learning Outcomes → Community closer. Section headers always use an eyebrow tag (7pt bold ALL CAPS, accent color) above the H2. Body text is 10.5pt, leading 17pt.

### Community CTA Pattern
No hard CTAs. Two discussion questions embedded mid-content. Guide the reader toward the next step by weaving a natural hint into the body at the point where it's relevant — never a labelled "Next:" pointer.

### Step Cross-References

**In a PDF, a step reference stays plain text.** Do not link it to a Slack file URL: Slack assigns a new unpredictable file ID on every upload, so embedded file links go stale immediately (see PROJECT_MEMORY dead end, 2026-06-04). Older scripts may still carry a `STEP_LINKS` dict and `step_ref()` helper — remove them when touching those scripts. External permanent links (NotebookLM) are fine.

**In the reader, a step reference is a real link, as of 2026-08-07** (owner: *"a course needs to feel like a network of steps"*). Authored `[the words](step:its-slug)`, it is the only visible link in step prose — an `https://` link still renders as nothing, with its site appearing as a chip in the source strip. The Slack reasoning above does not carry over: a slug is authored in the step's own `.mjs`, it is the string the sidebar and the URL are both built from, and **the renderer resolves it to a path at render**, so moving a step between lessons re-points every link to it rather than breaking them. `seed:course` refuses a slug no step answers to, a lesson or group slug (a folder has no page), and a step linking to itself; links are within one course, because seeding runs one course at a time and cannot verify another's slugs. The rule and its budget are **C-8** in `step-skill/RULES.md`.

### Cover ADDED VALUE Box
Each step cover has an accent-bordered "ADDED VALUE" panel listing companion resources as clickable links (NotebookLM audio overviews, linked steps, etc.). Uses the `resources_box([(label, url), ...])` helper defined in each script.

### Lead Magnets
3–4 page PDF teasers for WhatsApp marketing. File name format: `[Hook Title] - Booklesss.pdf`. Use Zambian companies (Zanaco, Zambeef, ZESCO, First Quantum) and ZMW currency in examples. Check `Operations/pricing-strategy.md` for the current offer before writing any pricing or deadline into a lead magnet.

### Skills (Claude Code Extensions)
Custom skills in `.claude/skills/`. **Three** skills, one per surface — course
content, socials, web:
- **`step-skill`** — everything to do with a step: PLAN (what the lessons and
  steps are), WRITE (the reader `.mjs`, or any branded PDF), IMPROVE (the
  feedback loop). **Read it before writing, editing or regenerating any step** —
  `RULES.md` is the house style and `DEBT.md` says what that step owes; both get
  applied in the same edit. Reactions land in `LOG.md` and, when they generalise,
  are promoted to `RULES.md`. It carries the ENGAGEMENT PASS for a step that is
  correct and still not worth reading. **Three** reference files load on demand:
  `reference/planning.md` (course architecture), `reference/disciplines.md`
  (which rules read differently in a quantitative, rule-application, discursive
  or procedural course — read before the first step of any course this skill has
  not written before) and `reference/pdf.md` (the PDF design system).
  Consolidated 2026-08-01 from the former `lesson-skill` + `step-skill` +
  `step-feedback` — the writing rules and the debt they create are one state, and
  splitting them meant whichever skill got invoked read half of it.

  **Before the first line of any step: read the material the course came with**
  (**C-2** — slides, transcript, past papers, marking key, assignment brief),
  then **name the discipline** (**C-11**). Both were added 2026-08-07, and the
  order matters: a step written from general knowledge about a subject can be
  entirely correct and still not be the course the reader is sitting.
- **`daily-post`** — PUBLISH. The build-in-public social pipeline: read what
  actually shipped from the git log, pick the story, capture the reader's mobile
  layout, render the 9:16 carousels, write the day's `PLAN.md`. Its `RULES.md`
  holds the accumulated framing/copy rules and is where the owner's reactions get
  written back. Output lands in `Demand/social/posts/<week>/<day>/`.
- **`design-system`** — Web/UI only (Framer, landing pages). Not for step work.

### Platform Icons (Next.js)

Most icons in `platform/` come from the **MynaUI** set (by Praveen Juge) via the local `@iconify-json/mynaui` package — no MCP, no network. MynaUI became the system on 2026-07-30 (owner's call): the course cards had worn it since they were built, and the rest of the chrome was moved onto it to match. The old `src/lib/icon.tsx` renderer was removed then and has not come back.

**To use an icon:** `<MynaIcon name="search" />` from `platform/src/components/icons/myna.tsx` — plain name for MynaUI Line, `-solid` for its filled twin (what the sidebars mark the current row with). Optional props: `size`, `strokeWidth`, `className`, `style`. Browse names at [icones.js.org/collection/mynaui](https://icones.js.org/collection/mynaui).

**That module is generated.** Adding an icon = add the name to `ICONS` in `platform/scripts/gen-icons.mjs`, run `npm run gen:icons`, done. Only the paths actually drawn are inlined, which is why it works in client components — importing the 2,650-icon set into one would ship the lot to the browser. Never hand-edit the generated file; unknown names fail the generator loudly rather than rendering nothing.

**Five exceptions, all deliberate:**
- The composer's attachment chips use **Streamline Ultimate Colors (Free)** file-type badges (`reader/file-icons.tsx`) and the course cards use **Streamline Plump** gradient marks (`home/plump-glyphs.tsx`, `home/course-glyphs.tsx`). Both are multicolour on purpose — the colour is what carries the meaning — so they keep their own fills rather than following `currentColor`. CC BY 4.0, attribution still owed (as with MynaUI).
- The **profile pictures** are **Streamline Kameleon Colors (Free)** (owner's pick, 2026-08-01) — all **200** of them since 2026-08-04. Each is a finished badge, a full-bleed coloured disc with its subject on it, so nothing is recoloured and nothing needs a shell drawn round it. **They are FILES, not inlined**: `npm run gen:avatars` writes `platform/public/avatars/<id>.svg` plus a 7.7KB `avatar-index.json` of ids and labels, and `identity/avatars.tsx` renders an `<img>`. 340KB on disk, ~0KB in the JS bundle. The `-duo` twins in the package are excluded — same subjects, two tones, 200 near-duplicate rows in a picker.

  **This replaced a standing "never do this" and the reasoning is worth keeping.** The rule used to be *do not extend `AVATARS` to the full set — twelve is already 27.8KB in a client component, ~100 would ship ~250KB to every reader.* That was correct **about inlining**, which is what the module did. The answer was never a smaller set, it was to stop shipping artwork as code — the school crests hit the identical wall the same day and took the identical fix (200KB of base64 → 1.6KB of ids). **The same trap is still live in `home/card-glyphs.tsx` and `home/plump-glyphs.tsx`**; if either needs to grow, move it to `public/` rather than trimming it.

  Old ids are **aliased, not renamed** (`LEGACY` in the generator): the first twelve were hand-named and don't all match their icon — `smiley` is `love-smiley`, `dice` is `dices` — so a stored id would otherwise resolve to nothing and a student would silently lose their face. The generator throws if an alias ever points at an icon the set has dropped.
- The reader sidebar's **lesson caret** is **Mingcute** (owner's pick, 2026-07-31): `<MingcuteIcon name="down-small-line" />` from `platform/src/components/icons/mingcute.tsx`, generated the same way (`ICONS` in `scripts/gen-mingcute-icons.mjs` → `npm run gen:mingcute`). Mingcute's grid draws a much smaller mark than MynaUI's at the same size and strokes it at 2 rather than 1.5, so anything borrowed from it needs its `size`/`strokeWidth` set against the MynaUI icons beside it. Keep this set narrow — MynaUI is still the system.
- **Solar** (by 480 Design) is on **two** surfaces: `/workspace` in Solar **Linear** and the dashboard's four **stat cards** in Solar **Duotone** (owner's pick, 2026-08-01). It was on a third — the reader's **callout kinds**, 2026-08-02 to 2026-08-07 — and **that is now MynaUI in ink** (owner: *"the icon should be a black mynaui icon"*), with the mark moved to the left of the sentence rather than sitting on a line of its own. **The standing lesson below was reached a second time and from the other direction:** a callout is a white box, so it never gave its mark a hue, and a filled Duotone glyph was importing one. The four names were still in `gen-icons.mjs` from when kinds first shipped, so nothing had to be regenerated to come back. `<SolarIcon name="chart-2-bold-duotone" />` from `platform/src/components/icons/solar.tsx`, generated like the rest (`ICONS` in `scripts/gen-solar-icons.mjs` → `npm run gen:solar`). A `-bold-duotone` name draws two `currentColor` fills, the back one at `opacity .5`, so the mark shades itself out of whatever hue its tile sets — no second colour to pass. **The standing lesson, now confirmed twice: Duotone belongs on a tile that gives it its own hue, not on a white surface and not in a row of outline chrome.** On 2026-08-02 the reader briefly had three Duotone marks in the checkpoint row (a thumbs pair on the answers, a bubble on the note button) and the owner moved all three back to MynaUI the same day, because Duotone is *filled* and sat heavy beside the hairlines around it. The callout was argued at the time to be the other case — a mark alone on a container carrying its own hue, like the stat tiles. **Five days of reading it said otherwise**: the stat tile is a coloured tile and a callout is a white box, so the callout was not giving the mark a hue, the mark was bringing one in. The dashboard tiles are the only place left where the argument actually holds. Adding a third surface is a decision, not a convenience.

Everything else monochrome is MynaUI.

### Domain, Link Previews and Sharing (Next.js)

The domain is **`booklesss.app`** (bought 2026-08-02). The brand host is one
constant, `SITE_URL` in `platform/src/lib/site.ts` — changing domain is that
line. **`metadataBase` does not use it**: `layout.tsx` prefers Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`, so previews resolve against whatever the
production host actually is (`booklesss.vercel.app` until the DNS is pointed)
and switch to booklesss.app on the next deploy after the domain is added in
Vercel. Nothing to edit when that happens.

**Every page emits the four tags WhatsApp reads** — `og:title`,
`og:description`, `og:url`, `og:image` — plus a canonical and a Twitter card.
Pages build theirs with `openGraph()` from `lib/site.ts`, and they must:
Next **replaces** a parent's `openGraph` wholesale rather than merging, so a
page setting one field by hand silently drops siteName, type and locale.

**Preview cards** are generated at build, one PNG per course and per step, from
one template in `lib/og.tsx` — 1200×630. They come from a **route handler**,
`app/og/[...slug]/route.tsx`, not the `opengraph-image.tsx` file convention:
Next refuses any file after a catch-all, and the reader is `(reader)/[...slug]`.
Constraints the card is built to, from Meta's own docs: under **600KB**
(WhatsApp drops it silently above that — ours are ~115KB), ≥300px wide, ratio
no narrower than 4:1, `<head>` inside the first 300KB, description shown to ~80
characters. No SVG. A new course gets a correct card with no design work.

**The card wears the social posters' look** (owner's call, 2026-08-03), so a
link preview and a carousel slide are recognisably the same object: the brand
gradient off `prog-post.mjs`, the **"Bklsss" wordmark with no glyph**, a purple
eyebrow, a Familjen Grotesk title and a Satoshi subtitle. Un-boxed — the white
panel inside a grey canvas is gone, because WhatsApp draws its own bubble round
the image and a bordered card inside that is a card inside a card. The wordmark
is suppressed on `/og/home.png` alone, where the title is already the name.

**Familjen Grotesk had to be vendored to get here.** `next/font/google` serves
it as woff2 and Satori reads only ttf/otf/woff, so `platform/assets/FamiljenGrotesk-Medium.ttf`
is the latin subset the app already ships, **instanced at wght 500** with
fontTools and re-flavoured to a plain TTF (the exact command is in `lib/og.tsx`).
Instanced rather than handed over as a variable font: Satori does not reliably
apply a `wght` axis, so a variable file renders at its default 400 whatever the
CSS asks for.

**Sharing** is one control in the header — `ShareControl.tsx`, where a dead
"Feedback" button used to be. It shares whatever page you are on (dashboard →
the app, course page → that course, step → that step; resolved by
`lib/share-target.ts`), opening the native share sheet on a phone and copying
the link where there isn't one. Do not add a second share button to a page
surface: the owner's rule (2026-08-02) is that there is exactly one place in
the app where sharing can be got wrong.

**Referral codes are BUILT** (no longer waiting on an account system — see the
memory index). `?r=deeky-7fq` is read by `lib/referral`, and `AuthForm` passes
`referrer()` into `signUp` as `options.data.referred_by`, so the code is captured
at the one moment it is knowable: when the account is created. Everything else
about a student is answered later in onboarding; who sent them has nowhere else
to live.

### Platform Fonts (Next.js)

**Four faces in the app**, all self-hosted from `_dev/fonts/` and subset by `python3 scripts/subset-fonts.py` (run it after any content change that could add a character — it derives the kept set from `course-data.json`). Three more are registered for the landing page alone — see the end of this section:

| Variable | Face | Where |
|---|---|---|
| `--font-sans` / `font-sans` | **Inter** | App chrome: header, sidebars, dashboard, settings |
| `--font-display` / `font-display` | **Familjen Grotesk** | Headings, step titles, formulas |
| `--font-content` / `font-content` | **Aptos** | **The reading** inside a step: prose, list items, table cells |
| `--font-container` / `font-container` | **Satoshi** | **The containers** inside a step: callouts and cards (label *and* body), source chips, the tap-to-define popup, the section-note menu, table column headings |

**The `content` / `container` split is the owner's rule (2026-08-02)** and it is by *job*, not by element: a sentence someone reads is Aptos, and chrome that frames or annotates a sentence is Satoshi. The whole reading face was briefly swapped to Satoshi and that was too far. Satoshi is Fontshare / Indian Type Foundry (ITF Free Font Licence) and is on no device by default, which is why it is vendored rather than linked.

**Callouts and cards are containers, all the way through** — owner's call, same day, settling the question that was left open when the split first landed. Only their labels were Satoshi and their bodies stayed Aptos, on the reasoning that a callout *holds* a sentence rather than framing one. The owner's reaction on seeing it live: *"in the containers with key point and that you've moved the font back to Aptos, keep it as Satoshi Medium."* **A box lifted off the page to be remembered is not the reading**, and setting it in the reading face made it read as one more paragraph that happened to have a border. Card titles keep `font-semibold`, everything else in a container is `font-container font-medium`.

**Container surfaces set `font-medium` (500)** — owner's call, same day. Satoshi ships a real 500 here, so it is not a synthesised weight, and at chip and popup size the regular sat too light beside the Aptos it annotates. Pair it as `font-container font-medium`. The one exception is a table's column heading, which stays `font-semibold` because it is a heading, not body.

**Three more faces exist for the landing page and for nothing else** (2026-08-06), because the owner's Framer design for `/` uses them: **Burbank Big Condensed** as `font-mark` (the ◯B disc and the "Booklesss" lockup), **Rubik** as `font-hero-meta` ("Trusted by Students"), **Bricolage Grotesque** as `font-hero-cta` ("Get started now"). The tokens are named for the *job*, not the typeface, so changing a face is one line in `globals.css`. Burbank was already vendored in `src/fonts/` — it drew the logo until the mark became an icon — and the other two come through `next/font/google` at one static weight each, self-hosted at build like Inter and Familjen Grotesk.

**They are free on every other route.** `next/font` emits a `@font-face` per family and a browser fetches a face only when something rendered actually asks for it; `/` is the only page that does. **Do not reach for these inside the app** — the four faces above are the system, and the front door is a deliberate exception, not a widened palette.

Everything else monochrome is MynaUI.

**Never** hardcode Framer CDN URLs for icons — always inline SVG so icons respond to `color` CSS.

### Transcription
`tools/transcribe.py` uses OpenAI Whisper (`small.en` model). Outputs `[video-name]_transcript.md` alongside the source video. Skips files already transcribed. Source video collection is in `Schools/UNZA/_pipeline/_video-archive/` (ECO 155 macroeconomics, MIT 14.01SC microeconomics).

### Course Pipeline (Supabase, internal)

What Zambian universities teach, scraped 2026-08-04 and held in the Booklesss
Supabase project as a **ranked backlog of courses to build**. Four tables, a
real hierarchy, now scoped by university:

```text
universities → pipeline_schools → pipeline_programmes (278) → pipeline_programme_subjects (1,397) → pipeline_subjects (602)
```

`pipeline_subjects` is the unit of work: **one row per distinct course, deduped
across programmes AND across universities** — a course taught at ZCAS and at
UNZA is one course to build, which is the whole point. The queue is ranked by
**reach** (`programme_count`), and `pipeline_queue.universities` says how many
campuses one build serves. **602 teachable courses, 4 live, 598 to build.** The
join table is where the codes, years and semesters live.

| University | Programmes | With a curriculum | Course rows |
|---|---|---|---|
| ZCAS | 60 | 41 | 979 |
| UNZA | 111 | 13 | 378 |
| Mulungushi | 107 | 1 | 40 |

**ZCAS is the outlier for publishing a curriculum at all, not the norm.** UNZA's
Courses tab is present on all 111 programme pages and empty on 98 of them
("Coming soon…"); Mulungushi says "No Course List Found!" on 106 of 107. **CBU,
UNILUS, Cavendish, Kwame Nkrumah, Chalimbana, Mukuba and Northrise publish no
course lists anywhere** — programme names and entry requirements only (checked
2026-08-04). UNZA's IDE brochure PDF is entry requirements too — a dead end. So
the remaining curricula are not a scraping job; they need a prospectus, a
department, or students photographing their own timetables.

One scraper per university, because the three sites are shaped differently
enough to need their own parsers, and **one loader**, because reach is only
meaningful computed over all of them at once:

```bash
python3 tools/scrape_zcas_programmes.py          # tables: code | title | year | semester
python3 tools/scrape_unza_programmes.py          # Drupal tab: <strong>Year</strong> + <ul>, codes inline or absent
python3 tools/scrape_mu_programmes.py            # one Programme Structure table per page
python3 tools/load_pipeline.py --university unza --dir _dev/tmp/unza-scrape
# then run tools/recount_pipeline.sql to recompute reach and priority
```

Then `npm run gen:programmes` in `platform/`.

Query it through the views, not the tables: **`pipeline_queue`** (the build
queue), **`pipeline_curriculum`** (the full university→school→programme→course
tree, drills both ways), **`pipeline_school_summary`**.

**Two things onboarding reads, added 2026-08-04 and NOT internal:**

- **`public.universities`** — the ten Zambian campuses the sign-up picker
  offers. Public-read like `courses`, because these names are drawn on screen
  (the picker is the owner's standing exception to the no-school-names rule).
  `npm run gen:schools` reads it with the **anon** key and commits
  `src/lib/school-index.json`. Crests are separate files in
  `platform/public/schools/`, fetched once by `scripts/gen-school-crests.py`.
- **`public.onboarding_curriculum`** — a deliberately NARROW view over the
  pipeline tables that **does not select `code`, the awarding body, or faculty
  names**, so a course code cannot reach the generated file by accident.
  `pipeline_programmes.university_id` is what joins the internal curriculum to
  the public picker. `npm run gen:programmes` reads this one with the **service
  role**, at build only, which is what lets the pipeline tables keep RLS-on-no-
  policies while onboarding still knows the curriculum.

**Excluding the code COLUMN is not enough.** ZCAS types its tables by hand and
one row carried its code inside the *title* — "Doctoral Thesis (Word Limit:
65,000 words) DBA330 – Defense" — which would have shipped a course code to
every student past a view written specifically to prevent that.
`gen-programmes.mjs` now **throws** if any title or programme name matches a
course-code pattern. Fix the row in Supabase; don't loosen the pattern.

**These tables are INTERNAL.** They carry course codes and school names, which
must never reach a student (see the memory index). Unlike `courses`/`lessons`,
which are public-read, all four have **RLS enabled with no policies** —
service-role only — and all three views are `security_invoker = true` so they
cannot bypass it. Supabase's "RLS enabled, no policy" advisor INFO on these is
the intent, not a gap. **Do not add a public read policy.**

**What a second university broke, so a third doesn't rediscover it:** school
name/slug/seq and programme slug/seq were unique GLOBALLY and are only unique
within a university (two "School of Law", three "Bachelor of Business
Administration"); the join table's primary key **included `code`**, so UNZA's
code-less rows could not insert at all; and `gen-programmes.mjs` fetched with
`.range(0, 9999)`, which PostgREST silently caps at its own `db-max-rows` of
1000 — adding two universities made the output file *smaller* and nothing said
so. All four are fixed; the generator pages now.

Known source-side faults, flagged in the data rather than worked around: **19
ZCAS programmes publish no curriculum** (their pages reference tables that don't
exist), **7 University of Greenwich links 404** (`link_status='dead-404'`), and
**two UNZA programmes print one undivided course list** with no years at all —
which is why `stepsFor` in the onboarding flow skips the year question when a
programme's `years` is empty.

### Where a Student's Answers Live — and why there are three copies

Onboarding collects a university, a programme, a year and a course list. Each
copy of that answers a different question, and none of them is redundant:

| Copy | What it is for | Where |
|---|---|---|
| **localStorage** | Instant, offline, works signed-out | `booklesss:identity:v1`, `lib/identity` |
| **`students.identity` (jsonb)** | Travels with the person, so a second device resumes | read by `AccountSignal` under RLS (`auth.uid() = id`) |
| **`students` / `student_courses` columns** | The only copy that can be **asked a question** | written by `POST /api/profile` |

**This was three stores and is now two, since Clerk is gone (2026-08-05).** The
account's copy used to be Clerk's `unsafeMetadata.identity`; it is a jsonb column
on the student's own row now, which is strictly better — it is written only by
`/api/profile` behind the service role, where `unsafeMetadata` could be written
by any signed-in browser.

A blob you read one row at a time still cannot answer "what are CBU students
being taught?", which is why the queryable columns exist alongside it. With seven
of ten universities publishing no curriculum, that question is how the curriculum
gets built at all.

**The merge is unchanged and the reasoning below still holds verbatim** — it was
deliberately not rewritten in the same session as the transport port, so that the
next wrong dashboard stays attributable. `parseAccountIdentity` still treats what
comes back as stranger input.

**THE MERGE NEEDS A CLOCK, AND `Identity.updatedAt` IS IT.** Two copies can
disagree, and the rule "the account wins where it has an answer" is wrong in the
ten minutes that matter most. The account's copy is a **snapshot of the device
taken at sign-up** — the gate writes `accountIdentity()` up when the account is
created, which on a fresh visit is the
placeholder the device rolled for itself. The student then answers ten
questions, every answer newer than that snapshot, and a merge without a clock
hands the snapshot straight back down. That shipped, and cost six sign-ups their
name, face, programme, year and whole ticked curriculum (2026-08-05).

So: where **both** copies hold an answer the **later** one wins; where only the
account has one it still wins, which is the second-device case and the reason
any of this exists. `updatedAt` is stamped by `saveIdentity` and **never by
`persist`** — stamping on adopt would make every adopted record look freshly
answered and the two copies would out-date each other forever. Name and face
gate additionally on `nameChosen`, the way courses gate on `coursesChosen`: the
field is never empty, so it cannot say on its own whether anybody was asked.

`matchesAccount` and `accountBehind` are **one comparator** (`sameAnswers`)
asked from two directions. They were two hand-written field lists and had
already drifted — neither compared `target.weekdays`, so a student moving study
days from Monday to Tuesday never had it travel. A field added to
`AccountIdentity` and not added to `sameAnswers` silently stops travelling.

### The auth surface is the app's own form, on Supabase — ONE box for both jobs

**Clerk is gone.** `AuthGate` replaced `ClerkGate` on 2026-08-05 and the app
authenticates against **Supabase** now. `requireAccount()` still works exactly
as it did — a plain function on a module store, consumed by exactly one
component that puts a form on screen — because that indirection was never about
Clerk (see the note in `lib/onboarding.ts`).

**There is no sign-in / sign-up distinction any more** (owner, 2026-08-07: "i
dont want to have the user select sign in if they already have an account…
if they are new they go through onboarding and if not they jyst get in and not
error them saying the accont exists"). `AuthForm` is one email + password box
with a single **Continue** button, and `/sign-in` and `/sign-up` render the same
thing — the route only chooses the heading. It tries `signInWithPassword`, and
**only** on "Invalid login credentials" falls back to `signUp`; if that comes
back "already registered" the account existed and the password was wrong, which
is the one sentence the sequence exists to be able to say.

**Sign-in first, not sign-up first, and the order is load-bearing.** Sign-up
first is a call shorter for a new student but puts every RETURNING one through a
sign-up attempt on their own address — and the moment "Confirm email" is
switched back on in the Supabase dashboard, that mails them a confirmation link
on every login. Probing with a sign-in sends nothing and creates nothing.

**The Clerk history below is kept as history**, because it is why a custom form
is allowed at all: what killed the first two attempts was Clerk's stateful
`SignUp` resource, not the idea. Supabase auth is two async functions returning
`{ data, error }` — no attempt object, nothing to reset — which is what makes a
two-call fallback safe to write. If Clerk ever returns, this is still true:

**A custom form was written and thrown away twice ON CLERK** — 2026-08-03 ("use
clerk stuff just remove the logo") and again on 2026-08-05, where it was built,
failed twice on the owner's own phone during a live sign-up, and was reverted
inside three hours ("not worked still, go back to the modal from clerk"). The
second attempt is preserved at **21bed00** with everything learned:

- Clerk 7's **Signals API** is not what tutorials show. `useSignUp()` returns
  `{signUp, errors, fetchStatus}`; the call is `signUp.password(...)` not
  `create()`; errors are **returned, not thrown** (a try/catch around them
  catches nothing and every failure looks like success); the session is
  activated by `finalize()`, not `setActive()`. Verify against
  `node_modules/@clerk/shared/dist/types/signUpFuture.d.mts`, not from memory.
- **`SignUp` is stateful and lives on the Clerk CLIENT.** A half-built attempt
  survives a failed submit, a reload and a new tab. Once one exists,
  `password()` updates it rather than creating a sign-up, and `email_address`
  stops being an accepted parameter — which surfaces as *"email_address is not a
  valid parameter for this request"* naming the wrong field and pointing at the
  wrong dashboard page. `reset()` clears it and is free (no API call).
- **Email verification must be read off `unverifiedFields`**, never assumed from
  a dashboard setting the code cannot see.

If it is ever attempted a third time, it needs a better reason than how it
looks — and the modal is what ships in the meantime.

**The browser never writes Supabase.** `lib/supabase-admin.ts` is `server-only`
(importing it from a client component is a build error) and every write goes
through `/api/profile`, which takes the user id **from the Supabase session
cookie, never from the body** — the only thing stopping one signed-in student
overwriting another's timetable. `students` and `student_courses` are
service-role for writes; `students.identity` is additionally readable by its
owner under RLS (`auth.uid() = id`), which is how a second device resumes.

**The sync fails soft, always.** No Clerk, no Supabase, a bad row, a dropped
connection — all answer 200 and the flow carries on against the device's copy.
Losing one student's answers is recoverable; losing the student is not.

### Onboarding When We Don't Have Their Curriculum (which is most of the time)

Every student now gets the same five questions — university, programme, year,
courses, weekly goal. It used to branch: a university whose curriculum we had
scraped got programme → year → courses, and **everyone else was sent straight to
a list of the four courses we have BUILT and told it was their timetable**. Since
most students are in the second group, the branch that skipped the questions was
the branch that ran.

Only what *answers* a question changes:

- **Programme** — a list to tap where `programme-index.json` has one, a line to
  type where it doesn't. The **"Mine isn't listed"** row is there even when the
  list is: 19 ZCAS programmes and 98 UNZA ones publish no curriculum, so they
  are absent from the index entirely. Stored as `programme: OTHER_PROGRAMME` +
  `programmeName`, the same pair as `school` / `schoolName`.
- **Year** — read off the programme where we know it, 1–6 where we don't.
- **Courses** — ticked off the timetable, or **typed** (`TypedCoursePicker`),
  with an "I'll add these later" answer so a sign-up is never blocked on typing
  eight course names.

**What a student types becomes the curriculum for the next one.**
`student_courses` records each title with a normalised form
(`lib/curriculum-text`, shared by browser and server so both dedupe the same
way), and `GET /api/curriculum?university=&programme=&year=` offers back what
earlier students on that programme listed — "4 students on your programme". The
first student types eight courses into an empty box; the fifth confirms a list
better than anything the university publishes. `?q=` is a typeahead over the
602 course titles the pipeline already knows, so a typed course lands on the
**same** slug as a scraped one rather than beside it.

Nothing promotes itself. `tools/reported_curriculum.sql` is the by-hand review:
which campuses are actually signing up, which courses two or more students
agree on, and which of those the pipeline already carries.

## Project Tracking (Linear)

This project's Linear workspace is **Booklesss** (team: `Booklesss`, team id `3e290b53-b6cc-4f93-8ad4-03c0fc04a4c1`), reached via the **`linear-server`** MCP connection (tools prefixed `mcp__linear-server__*`).

**Do not use `mcp__claude_ai_Linear__*`** (the "claude.ai Linear" connector) for any Booklesss work — that connector is authorized to a different, unrelated Linear workspace (Khadzika, an industrial/mining tools business). If both tool sets are ever present in the same session, `linear-server` is the one scoped to this project.

This matters for the `wrap-session` skill (global, shared across projects): when it checks "is Linear configured for this project," the answer for Booklesss is specifically `linear-server`, not any other Linear connector that happens to be connected.

**Where `linear-server` comes from, per session type:**
- **Local (owner's Windows machine):** configured in `~/.claude.json` with a stored OAuth token, under BOTH project-key casings `C:/…/Booklesss` and `c:/…/Booklesss` (see PROJECT_MEMORY session 12 — sessions resolving the lowercase path land on a separate config entry).
- **Cloud/remote sessions:** comes from this repo's `.mcp.json` (`https://mcp.linear.app/mcp`). It needs a one-time OAuth authorization per user — until then the session lists it as "requires authentication" and the tools don't load. When authorizing, pick the **Booklesss** workspace in Linear's consent screen, not Khadzika.
- The sandbox in cloud sessions **cannot** reach `mcp.linear.app`/`api.linear.app` directly (egress proxy blocks them), so raw curl/JSON-RPC fallbacks only work on the local machine. If tools are absent and unauthorized, say so — don't fall back to `mcp__Linear__*` (Khadzika).

## Key Reference Files

| File | Purpose |
|------|---------|
| `README.md` | Owner's map: business state, money model, action queue |
| `Operations/workspace.md` | Slack workspace config, channel names, invite links |
| `Schools/[School]/[Course]/_course.md` | Step status tracker for each course |
| `Schools/[School]/[Course]/[lesson]/lesson.md` | Per-lesson step status and source notes |
| `Operations/daily-checklist.md` | Operational cadence and content status tracker |
| `Operations/leads.md` | WhatsApp lead tracking |
| `Operations/revenue-log.md` | Student conversions and revenue |
| `Operations/groups.md` | WhatsApp group marketing stats |
| `Operations/pricing-strategy.md` | Pricing tiers, unit economics, cost structure |

## Writing Style Rules (Enforced in All Content)

Banned words: "tapestry", "nuance", "multifaceted", "robust", "delve", "foster", "Furthermore", "It's worth noting", "landscape", "journey", "empower", "leverage" (as verb), "game-changer", "seamless", "holistic", "synergy". All examples use ZMW (Zambian kwacha) and local companies.
