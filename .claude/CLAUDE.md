# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**Booklesss** is an edtech product for Zambian university finance/business courses. **The course reader at `booklesss.vercel.app` is the product** (`platform/`, Next.js 16 + Supabase): a student reads steps there, ticks checkpoints and says how each section landed. Steps are authored as `.mjs` beside the lesson they belong to and published with `npm run seed:course` → `npm run gen:course`.

The original pipeline — source material (PPTX/PDF) → Python ReportLab script → PDF → posted to Slack — still exists and still builds. It is now **provenance and marketing**: lead magnets, business documents, and the PDFs the reader steps were mined from. Slack-as-the-paid-product was dropped (Linear BOO-7, MSA §3.4); do not rebuild paid Slack channels.

**On the reader:** economics, Corporate Finance (26 steps), Strategic Management (8), Treasury Management (**60** — one concept, one checkpoint, one step, since the 2026-08-09 split; the other courses owe the same conversion, `step-skill/DEBT.md` D-18). Also on disk: BBA 1110 (UNZA), PDFs only. **Course codes and school names never appear anywhere a student sees** — see the memory index.
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

  **The exam is never the reason, and the product is never the subject.**
  **C-12** bans the exam vocabulary (the paper, past papers, syllabus, marks,
  revision) from anything a reader sees — past papers still *set* what a step
  covers, the reader is just never told so. **S-13** bans Booklesss mechanics:
  no step counts, no "each step ends with a question", no note button, no
  sidebar. Both are owner rules from 2026-08-09 and both are scored.

  **A step is one small containable concept with ONE checkpoint** (**S-1**,
  rewritten 2026-08-09 on the owner's call: *"only one checkpoint per step …
  the read to that completion of the step is not so far away"*). One section,
  one check, roughly five minutes. A second checkpoint means a second step, and
  the run of them gets a folder — the sidebar tree now nests four or five deep
  (**S-9**), where it used to stop at two. `rank.mjs` scores **out of 8** and
  scores **one step at a time** — pointed at a folder it returns a worklist,
  not a course grade, because a course number can be turned green without
  anyone having read a page. An unconverted course fails S-1 on every step by
  design.

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
- **`design-system`** — **anything drawn on a screen: the Next.js app included**,
  not just Framer and landing pages. Its colour section is a summary of
  `platform/src/app/globals.css` and now says so; it also carries the
  engineering traps that present as design bugs (`backdrop-filter` creating a
  containing block for `position: fixed`, a border on an inner layer vanishing
  at the corners, a backtick ending a CSS-in-JS template). **Read it before
  building a component.** This line used to say "Web/UI only (Framer, landing
  pages)", which is why a new dashboard surface got built in August without it
  and came out wearing colours the app does not have. Not for step work.

### Platform Icons (Next.js)

Most icons in `platform/` come from **Hugeicons Free** (MIT) via **Hugeicons' own `@hugeicons/core-free-icons`** package — the official free tier, 14,716 exports, not a third-party mirror (Iconify's copy of the set carries ~5,065). No MCP, no network. It replaced **MynaUI** on 2026-08-29 (owner's call) and the swap was cheap for one reason: both are stroke sets on a **24 grid at 1.5**, so nothing had to be re-measured. MynaUI had been the system since 2026-07-30; `src/components/icons/myna.tsx` and `mingcute.tsx` are gone with it, in git rather than parked.

**To use an icon:** `<HugeIcon name="search" />` from `platform/src/components/icons/huge.tsx`. Optional props: `size`, `strokeWidth`, `className`, `style`. Browse the set at [icones.js.org/collection/hugeicons](https://icones.js.org/collection/hugeicons).

**Why generate instead of `@hugeicons/react`:** their component is the official path and would work — the set tree-shakes. It was not taken because every call site would then import an icon *symbol* (`import { Search01Icon } from …`) instead of naming one (`name="search"`), and because generating keeps the runtime at zero: the bodies are strings in the module, no library ships to the browser.

⚠️ **THE NAMES ARE THE APP'S VOCABULARY, NOT THE SET'S.** Call sites say `name="chevron-down"`, not `name="arrow-down-01"`; the map from one to the other lives in `scripts/gen-huge-icons.mjs` and nowhere else. That indirection is what made the MynaUI → Hugeicons swap a column of edits in the generator instead of a rename across two dozen components — keep it that way, and do not let a set's own naming leak into a component.

**The `.cui` surface's own entries moved on 2026-08-29 evening:** `pdf`
(`pdf-01`) is a resource pack — on the source-row chip *and* on the modal row
it opens, because one meaning gets one mark — `headphones` is a session in the
quick-action list, the same "listen rather than read" the course page's Listen
pill means, and `feedback` (`chat-feedback-01`) is the pane header's button.
`folder-library`, `chat-messages`, `code` and `incognito` went out in the same
change, each with the control that was the only thing drawing it. **The
feedback entry is `-01` on purpose**: the set's plain `chat-feedback` is a
bubble with three DOTS, which is the universal "someone is typing" — a chat
mark, in the one corner of a chat app's shell where a student looks for help.
`-01` writes two lines inside the bubble, which is a posted message.

⚠️ **THERE ARE NO FILLED TWINS.** MynaUI's `-solid` variants marked a selected row (line at rest, solid when active); Hugeicons Free is stroke-only. Exactly one place used one — the course card's completion mark — and it reads lighter now. **Any surface that needs a selected state must get its second signal from somewhere other than a fill** (a background, a rule, a colour), which is what the sidebars already do.

⚠️ **STROKE WIDTHS ARE NORMALISED TO 1.5 BY THE GENERATOR.** Most of Hugeicons is drawn at 1.5, but a handful carry 1.45, 2, 2.5 or 3 — mixed in one row that reads as a wobble rather than a choice, and it makes the `strokeWidth` prop behave differently icon to icon.

**A glyph the set does not have** goes in `CUSTOM` in the generator, drawn on the same 24 grid at the same 1.5 so it sits in a row with the rest. There is currently **one**: the drawer's hamburger (owner's sketch, 2026-08-29 — wider spacing than `menu-01` and a short third bar; Hugeicons has eleven menu variants and none is that). Keep that map as close to empty as possible: every entry is a drawing nobody else maintains, which is the debt the hand-drawn sprite this set replaced had run up.

**That module is generated.** Adding an icon = add the name to `ICONS` in `platform/scripts/gen-icons.mjs`, run `npm run gen:icons`, done. Only the paths actually drawn are inlined, which is why it works in client components — importing the 2,650-icon set into one would ship the lot to the browser. Never hand-edit the generated file; unknown names fail the generator loudly rather than rendering nothing.

**Five exceptions, all deliberate:**
- The composer's attachment chips use **Streamline Ultimate Colors (Free)** file-type badges (`reader/file-icons.tsx`) and the course cards use **Streamline Plump** gradient marks (`home/plump-glyphs.tsx`, `home/course-glyphs.tsx`). Both are multicolour on purpose — the colour is what carries the meaning — so they keep their own fills rather than following `currentColor`. CC BY 4.0, attribution still owed.
- The reader's **three checkpoint answers** are **Lordicon doodles, animated** (owner's pick, 2026-08-09: *"let's go back to the lordicons i had a few iterations before"*) — grey at rest via `filter: grayscale(1)`, their own colours when chosen, and the tapped one plays. Self-hosted Lotties in `public/reader/icons/`, drawn by `<LordIcon>`; the full path and its traps are in **WORKSPACE.md → "Animated icons"**, and the licence there is **unsettled and now shipping**. Two things that cost a rebuild: **`colorize` erases a filled drawing** (it flattens *every* colour, so a grey rest state paints the eyes the same grey as the head — use a CSS filter), and **replay must key on a per-icon counter, not on "am I chosen"**, or the mark you just turned off replays too.

  **Tabler is the `fallback` under them, and that is load-bearing** — a Lottie is a fetch, and this reader is read on Zambian mobile data. `LordIcon` draws the fallback until its JSON lands and leaves it there forever if the fetch fails, so a bad connection gets a static Tabler mark rather than a hole.

- The **note button and its five verdicts** are **Lordicon doodles too**, as of 2026-08-09 evening (owner: *"am i not able to find free lordicons for the flag icons — just need animations that make sense"*): the `messages-feedback` bubble at rest, the verdict's own doodle once flagged, grey-by-grayscale/coloured-when-chosen exactly like the answers. All six are free (`premium: false` — the fetch script refuses paid rows). **Its fallback is a Solar broken/bold-duotone pair** (`NOTES` in `lib/step-notes.ts` carries `lord`+`lordState` for the doodle and `mark`+`markOn`+`hue` for the offline path), so even with no network the control keeps the grammar: grey at rest, its own colour chosen. The five hues are the dashboard stat tiles' validated TONE set plus the auth form's error red — reused, not invented, because they were validated together for this drawing style on a light surface.

  **Tabler survives as the three answers' static fallback only** (`icon` in Checkpoint's `ANSWERS`): `<TablerIcon name="mood-happy" muted />` draws the outline, unmuted the `-filled` twin, and `gen-tabler-icons.mjs` throws if a twin is missing. MIT, the one family here owing no attribution.

  ⚠️ **The Lordicon doodles REQUIRE `'unsafe-eval'` in the CSP, and removing it blanks them silently.** lottie-web compiles a Lottie's expressions with `new Function`; blocked, every player builds an `<svg>` with zero layers — every fetch a 200, no visible violation, a `destroy is not a function` crash on unmount. This shipped broken for a few hours on 2026-08-09 when the security headers landed after the icons. The proof method matters as much as the fact: **a DOM probe cannot see into the player's shadow root**, so an A/B that counts SVGs with `querySelectorAll` reads zero on both sides and validates nothing — pierce via `element.shadowRoot` and count paths (1 = the empty clip rect; a drawn doodle is 12–14). Full story in `next.config.ts`.

  **The three mechanisms, ranked, because this row has now tried all of them:** `ultimate.tsx` **derived** a rest state by regex from one multicolour body (worst — the family had no line-only twin); `freehand.tsx` **paired two packages** that shared 982 of 1,000 names (better — real drawings, but a name in one and not the other had to throw); Tabler is **one package with one naming convention** and no colour of its own (best). **Prefer a single set with an outline/filled convention** over a two-package pair, and both over a derived state.

  **`ultimate.tsx` and `freehand.tsx` were both DELETED, each in the change that replaced it** — the checkpoint row was the only thing importing them, and this codebase's rule is that a reverted option lives in git rather than parked in the tree. The hand-inlined Ultimate copy in `reader/file-icons.tsx` and the hand-inlined Freehand copy in `reader/card-glyphs.tsx` are untouched and independent; `@iconify-json/streamline-freehand-color` stays in `package.json` for the latter alone (the `-line` package went with the generator).

  **The note button is not a flag any more, and the free-set lesson repeated a third time.** Freehand Free had no plain flag (its only one wears `</>`); Lordicon's free doodle set has none either — and no bulb and no question mark. The substitutions are honester than the originals: the button is a **feedback bubble** (it always asked "how did that read?", never reported abuse), "Clear" is a **check**, "Hard to follow" is a **puzzle-pair**. When a free set lacks the obvious picture, look for the picture of the *meaning* before reaching for a paid tier.

  **Every mark in the row carries a word, and the word answers back** (owner, 2026-08-09, in two steps: *"only one word for each"*, then *"save should go saved after"*). Satoshi 11px under each mark (`.grasp-caption`). The three answers read **Save · Lost · Like** — not Hate/Love (owner: *"cant have 'love'"*) — and flip to the receipt once chosen: **Saved / Liked** (`labelOn`; "Lost" has no imperative so it stays). The note button wears **"Note"** at rest and the verdict's one-word receipt after (**Clear / Hard / Long / Example / Wrong** — `word` in `NOTES`; the menu keeps the full sentences). Its old sr-only label went with the change: the `aria-label` carries the full sentence, and a hidden duplicate beside a visible caption is two strings waiting to drift.

  **Order is Save · apart · Lost · Like** (owner: *"save, distance, then the others"*): Save is a decision, not a verdict, and sitting it mid-scale made it read as a midpoint. The extra 14px is a margin on the Save button (`mr-3.5` in Checkpoint) ON TOP of the cluster's 22px gap, so tuning one never collapses the other; the positive answer keeps the outermost-right seat (2026-08-02 rule). **The 22px gap survives only because captions are one word** — at "Save for later" widths the buttons stopped being squares and the number stopped meaning glyph spacing. **Doodles draw at 26 to LOOK 20** (they carry air inside their 192 grid); static fallbacks draw at the row's true 20 — both `LordIcon`s use the 26/20 split, move them together.
- The **profile pictures** are **Streamline Kameleon Colors (Free)** (owner's pick, 2026-08-01) — all **200** of them since 2026-08-04. Each is a finished badge, a full-bleed coloured disc with its subject on it, so nothing is recoloured and nothing needs a shell drawn round it. **They are FILES, not inlined**: `npm run gen:avatars` writes `platform/public/avatars/<id>.svg` plus a 7.7KB `avatar-index.json` of ids and labels, and `identity/avatars.tsx` renders an `<img>`. 340KB on disk, ~0KB in the JS bundle. The `-duo` twins in the package are excluded — same subjects, two tones, 200 near-duplicate rows in a picker.

  **This replaced a standing "never do this" and the reasoning is worth keeping.** The rule used to be *do not extend `AVATARS` to the full set — twelve is already 27.8KB in a client component, ~100 would ship ~250KB to every reader.* That was correct **about inlining**, which is what the module did. The answer was never a smaller set, it was to stop shipping artwork as code — the school crests hit the identical wall the same day and took the identical fix (200KB of base64 → 1.6KB of ids). **The same trap is still live in `home/card-glyphs.tsx` and `home/plump-glyphs.tsx`**; if either needs to grow, move it to `public/` rather than trimming it.

  Old ids are **aliased, not renamed** (`LEGACY` in the generator): the first twelve were hand-named and don't all match their icon — `smiley` is `love-smiley`, `dice` is `dices` — so a stored id would otherwise resolve to nothing and a student would silently lose their face. The generator throws if an alias ever points at an icon the set has dropped.
- The **home screen** is **Streamline Plump** (owner's pick, 2026-08-27: *"use
  plump icons from streamline free icons"*) — the four dock marks and the
  sessions list's play glyph. `<PlumpIcon name="home-1" />` from
  `platform/src/components/icons/plump.tsx`, generated like the rest (`ICONS` in
  `scripts/gen-plump-icons.mjs` → `npm run gen:plump`). **Its two layers are CSS
  variables, not `currentColor`**: every Plump Color icon is drawn in exactly two
  flat values (`#8fbffa` light, `#2859c5` dark), and flattening them to one
  colour erases the drawing — so the generator rewrites them to `--plump-light`
  and `--plump-dark` and the caller passes a **pair**. That is what gives the
  dock a real off/on grammar out of ONE set, which is the lesson `ultimate.tsx`
  and `freehand.tsx` both paid for. The generator throws on a name whose body
  carries neither colour. Plump was already here twice by hand — the course
  cards' gradient marks (`home/plump-glyphs.tsx`) and the ask microphone
  (`home/ask-mic.tsx`); both are independent and untouched.
- The reader sidebar's **lesson caret** was **Mingcute** from 2026-07-31 until the Hugeicons swap on 2026-08-29, and that whole set existed for that one mark. Mingcute's "Down Small Line" is 5.7 units across inside the 24 grid where a normal chevron is 12, which is why it was drawn at 22px — the box had to grow for a small glyph to stay legible. It is the app's own `chevron-down` at 20px now and needs no compensation, but it is a **more prominent caret than the one it replaces**; that smallness was a deliberate pick once and is worth a look.
- **Solar** (by 480 Design) is on **two** surfaces plus one fallback: `/workspace` in Solar **Linear**, the dashboard's four **stat cards** in Solar **Duotone** (owner's pick, 2026-08-01), and — as of 2026-08-09 — the note control's **offline fallback** in Solar **Broken**/**Bold Duotone** (a stroke drawing with a deliberate gap at rest, the duotone in the verdict's own inline hue when chosen; it draws only while the Lordicon Lottie hasn't loaded). That last one passes its hue inline and sits on a white surface, which the standing lesson below forbids for a *primary* mark — allowed here because fallback duty is exactly the "carrying its own hue" case, and it exists to be replaced by artwork that does the same. It was on a third — the reader's **callout kinds**, 2026-08-02 to 2026-08-07 — and **that is now MynaUI in ink** (owner: *"the icon should be a black mynaui icon"*), with the mark moved to the left of the sentence rather than sitting on a line of its own. **The standing lesson below was reached a second time and from the other direction:** a callout is a white box, so it never gave its mark a hue, and a filled Duotone glyph was importing one. The four names were still in `gen-icons.mjs` from when kinds first shipped, so nothing had to be regenerated to come back. `<SolarIcon name="chart-2-bold-duotone" />` from `platform/src/components/icons/solar.tsx`, generated like the rest (`ICONS` in `scripts/gen-solar-icons.mjs` → `npm run gen:solar`). A `-bold-duotone` name draws two `currentColor` fills, the back one at `opacity .5`, so the mark shades itself out of whatever hue its tile sets — no second colour to pass. **The standing lesson, now confirmed twice: Duotone belongs on a tile that gives it its own hue, not on a white surface and not in a row of outline chrome.** On 2026-08-02 the reader briefly had three Duotone marks in the checkpoint row (a thumbs pair on the answers, a bubble on the note button) and the owner moved all three back to MynaUI the same day, because Duotone is *filled* and sat heavy beside the hairlines around it. The callout was argued at the time to be the other case — a mark alone on a container carrying its own hue, like the stat tiles. **Five days of reading it said otherwise**: the stat tile is a coloured tile and a callout is a white box, so the callout was not giving the mark a hue, the mark was bringing one in. The dashboard tiles are the only place left where the argument actually holds. Adding a third surface is a decision, not a convenience.

Everything else monochrome is Hugeicons.

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
| `--font-title` / `font-title` | **Familjen Grotesk** 600 | **A step's `<h1>` and nothing else** |

**The step title has its own token even though it resolves to Familjen, same as `--font-display`.** On 2026-08-08 it went to Bricolage Grotesque (owner: *"i want to move away from familjen font titles i want to use bricolage grotesk"*) and came back the same afternoon (*"bring the title back to familjen"*). Both changes were one line, which is the whole argument for naming a token after the job rather than the typeface. **Do not collapse it back into `--font-display`**: that token is every heading and all the app chrome, and a step title is the one element somebody keeps deliberately choosing a face for.

**The weight did NOT come back.** It was 500 before that day and is **600** now — the reaction that started it was that titles *"aren't bold or confident"*, and only the typeface half of the answer was withdrawn. The wording half is rule **S-12** in `step-skill/RULES.md`.

**What Bricolage got wrong, since something else will be tried eventually:** not the weight. A display face with that much personality in its letterforms, set at 30px directly above a column of Aptos, announces itself instead of the title. A face picked for `/` is picked against a photograph and a hero; a face for a step title is picked against the reading it must not compete with. Bricolage is front-door-only again, and no route but `/` fetches it.

**The OG preview card is Familjen too**, and now trivially consistent — `lib/og.tsx` renders through Satori, which reads only ttf/otf/woff, so any future title face needs vendoring and instancing the way `platform/assets/FamiljenGrotesk-Medium.ttf` was. Worth remembering as a cost before the next swap: the reader is one CSS line, the preview card is not.

### The Reader's Vertical Ladder

Owner, 2026-08-08: *"a paragraph a section a title and all must be spaced and sized accordingly so different pieces stay separated."* It had two rungs and needed four. **Four different seams all measured 20px** — paragraph to paragraph, above a sub-heading, below a sub-heading, and the last block to the checkpoint — so a new sub-idea, the next sentence and the end of the whole section were spaced identically. Space is the only thing telling a reader which pieces belong together, and at one value it says nothing.

**Type scale** (the sizes, top down): **30 / 24 / 21 / 18** — step title (Bricolage 600), section heading (Familjen 500), sub-heading (Aptos 600), reading (Aptos, 30px leading). The sub-heading **was 19px against 18px body**, which is not a size step; it was bold text. The section heading and the sub-heading are now separated by *both* face and size, so they cannot be mistaken for each other.

**Space scale**, smallest first. Each rung means something different and no two are within 8px:

| px | seam |
|---|---|
| 12 | after a sub-heading |
| 24 | paragraph to paragraph, and after a section heading |
| 32 | last block to the checkpoint row |
| 40 | before a sub-heading; step title to first block |
| 56 | checkpoint to the section rule (then 36 more to the heading) |

**A heading always gets more space above it than below**, and that rule does most of the work. Equal space orphans a heading between two things; more above attaches it downwards to what it introduces. The sub-heading's 40/12 is `mt-4 -mb-3` played against the block container's 24px gap.

It lives in three places: the ladder comment and the two `h2` renderers in `reader/LessonView.tsx`, and `.checkpoint-row` in `globals.css`. Measure changes off the live DOM rather than off the classes — the checkpoint row is a sibling of the block container, so a naive `section > div > *` selector reads its buttons as blocks and reports negative gaps.

**The `content` / `container` split is the owner's rule (2026-08-02)** and it is by *job*, not by element: a sentence someone reads is Aptos, and chrome that frames or annotates a sentence is Satoshi. The whole reading face was briefly swapped to Satoshi and that was too far. Satoshi is Fontshare / Indian Type Foundry (ITF Free Font Licence) and is on no device by default, which is why it is vendored rather than linked.

**Callouts and cards are containers, all the way through** — owner's call, same day, settling the question that was left open when the split first landed. Only their labels were Satoshi and their bodies stayed Aptos, on the reasoning that a callout *holds* a sentence rather than framing one. The owner's reaction on seeing it live: *"in the containers with key point and that you've moved the font back to Aptos, keep it as Satoshi Medium."* **A box lifted off the page to be remembered is not the reading**, and setting it in the reading face made it read as one more paragraph that happened to have a border. Card titles keep `font-semibold`, everything else in a container is `font-container font-medium`.

**Container surfaces set `font-medium` (500)** — owner's call, same day. Satoshi ships a real 500 here, so it is not a synthesised weight, and at chip and popup size the regular sat too light beside the Aptos it annotates. Pair it as `font-container font-medium`. The one exception is a table's column heading, which stays `font-semibold` because it is a heading, not body.

**Three more faces exist for the landing page and for nothing else** (2026-08-06), because the owner's Framer design for `/` uses them: **Burbank Big Condensed** as `font-mark` (the ◯B disc and the "Booklesss" lockup), **Rubik** as `font-hero-meta` ("Trusted by Students"), **Bricolage Grotesque** as `font-hero-cta` ("Get started now"). The tokens are named for the *job*, not the typeface, so changing a face is one line in `globals.css`. Burbank was already vendored in `src/fonts/` — it drew the logo until the mark became an icon — and the other two come through `next/font/google` at one static weight each, self-hosted at build like Inter and Familjen Grotesk.

**They are free on every other route.** `next/font` emits a `@font-face` per family and a browser fetches a face only when something rendered actually asks for it; `/` is the only page that does. **Do not reach for these inside the app** — the four faces above are the system, and the front door is a deliberate exception, not a widened palette.

Everything else monochrome is Hugeicons.

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

### Sessions — the voice call that replaced sitting and reading

**A SESSION is a guided call, and it is the second door into every piece of the
course** (owner, 2026-08-21: the reading was long, the sittings were longer, and
*"when I'm reading I'm only reading important things that I need to read"* is a
description of pinned points, not of a step page). A voice agent walks the
student through a run of steps; the lines worth keeping **pin to the screen and
stay there**; the student types their own notes beside them. There is **no
transcript**, deliberately — a transcript is the reading, in pieces.

**A session is ONE LESSON GROUP** — a folder in the sidebar, covering the steps
directly inside it. Owner's pick, and it is the granularity that makes the
arithmetic work: Treasury's 60 steps sit in 21 groups, ≈3 steps a call, ≈12
minutes. A step alone (~5 min) spends more time connecting than teaching; a
whole unit (~35 min) is the lecture this replaces. **48 sessions across the four
courses**, verified to cover every step exactly once with no duplicates.

**NOTHING WAS RE-AUTHORED TO GET THIS.** A session is derived from the tree the
course already has, so all four courses had sessions the day it shipped and a
new course gets them by being written normally. The two halves:

| File | Job | Safe on the client? |
|---|---|---|
| `lib/session-nav.ts` | lists sessions — titles, paths, counts, minutes | **yes**, reads `course-nav.json` |
| `lib/session.ts` | the BRIEF — beats, pins, system prompt | **no**, server-only guard like `lesson-content.ts` |

**The pin has a FALLBACK LADDER and that is the load-bearing part.** Only a
minority of sections carry an authored callout — Treasury has 16 across 60
sections, economics **one** across 69 — so a pin sourced only from callouts
would leave most beats with a silent screen, which is the whole feature. Order:
**callout → formula → the section's first sentence**, which always exists. The
agent may also pin its own line mid-call; the ladder is the floor, not the
ceiling. `exam` callouts fold into `key` (E-10 withdrew the kind, and C-12
forbids the agent the vocabulary anyway).

**ONE AGENT SERVES ALL 48 SESSIONS.** The brief goes up as a per-call **client
override** (`overrides.agent.prompt.prompt` + `firstMessage`), so adding a
session is authoring content and never touching the ElevenLabs dashboard, and a
rewritten step changes what the agent teaches on the next call. **Known
trade-off, accepted:** an override travels through the browser, so a determined
student could edit it. The agent holds no tools that touch data and no secrets —
worst case is a student wasting their own call — and the alternative is 48
dashboard objects that go stale silently.

⚠️ **`platform_settings.client_overrides` MUST be enabled on the agent or every
session silently gets the placeholder prompt.** It looks like the agent "not
knowing the material", not like a settings problem. `setup-elevenlabs.mjs` sets
it; check it first if that ever happens.

**Setup, once** (`.env*` is gitignored, so this is the discoverable copy):

```bash
cd platform && ELEVENLABS_API_KEY=sk_... npm run setup:voice
```

It creates the `show_point` client tool and the agent, is safe to re-run
(reuses by name), and prints the id. Then set **`ELEVENLABS_API_KEY`** and
**`NEXT_PUBLIC_ELEVENLABS_AGENT_ID`** in `platform/.env.local` *and* in Vercel
(Production + Preview). Optional: `ELEVENLABS_VOICE_ID`, `ELEVENLABS_LLM`
(defaults `gpt-4o-mini` — cheap matters at ~12 min of continuous turns; raise it
if the agent starts skipping beats or forgetting to pin, because **tool-calling
reliability degrades before conversation quality does and pinning IS the
feature**).

⚠️ **The API key is server-only.** `/api/agent/token` exchanges it for a
short-lived token; `NEXT_PUBLIC_` is inlined into the bundle at build, so a
`NEXT_PUBLIC_ELEVENLABS_API_KEY` would publish the account's billing to every
visitor. **The agent id is public and safe** — it names which agent, and the
agent requires authorization.

**With nothing configured the app still builds and every session page still
renders**; "Start session" answers *"Voice sessions aren't switched on yet"* and
offers the reading. `/api/agent/token` answers **200 with `ok:false` and a
reason** — a failed mint is a product state, not an exception.

**Listen and Read sit side by side** (owner's call): every group on a course
page carries a Listen pill beside its steps. The call surface is **dark with the
brand green orb**, where the rest of the app is cream — the one liberty taken
with the design system, so a student can tell which door they walked through
before reading a word. The orb is **CSS, not an asset and not three.js**
(`components/study/Orb.tsx`): this is read on Zambian mobile data.

### The dashboard IS the reference UI (2026-08-28/29)

**`/dashboard` is `claudeuiclone.html`** — the owner's recreation of the
claude.ai desktop shell, kept with its state captures in
**`_dev/reference-ui/`** (moved off the repo root 2026-08-29), transcribed into
`components/home/claude-ui/ClaudeUI.tsx` and scoped under `.cui` in
`globals.css`. Owner's call, twice, after a first attempt adapted it instead:
*"replacement and not redesign… so that it is 100% the ui. that's where I want
to start from."*

**It is deliberately NOT wired to Booklesss.** The rows still read Projects,
Artifacts, Scheduled, Customize; the model button still says Sonnet 5; the
greeting is still the reference's. Those are a starting point to be replaced
deliberately, not guessed at. Nothing on the page reads a student's data, which
is why the auth gates came off it — **they go back the moment it renders
anything real.**

**The home screen has a middle now** (owner, 2026-08-29). The greeting moved
from the centre of the pane to the **top left**, under the hamburger, where it
reads as the page's title — **no starburst, Familjen Grotesk at 500,
`clamp(26px, 7.2vw, 30px)`**, since the owner removed the reference's orange
mark and asked for the line to be sized for its new job. Two traps that cost a
pass and are invisible in the code: the reference's weight **330 cannot be
drawn by Familjen** (its variable axis starts at 400, so it clamped up in
silence), and the old `3.7vw` middle term was **dead on every phone** — 14px at
390, under the floor, so the vw branch never ran — the same shape as the 520px
query that once hid the Resources label on every real device. ⚠️ **`--clay` now
draws nothing on this surface**: the starburst and the sidebar's unread dot
were its only two consumers and both went the same day, so the palette is
monochrome on screen and the token is kept for a future accent rather than a
current one. Under the greeting sit **quick actions** — a short list of
rows, one per unfinished session or project, so a student mid-something does
not have to type their way back in. They are **rows, not cards**: the composer
is still the call to action, and a grid of tiles under a greeting takes that
job by sheer area.

**Above the composer is a SOURCE ROW** — a circular `+` and a chip carrying the
selected resource pack's own name behind a PDF mark, off the owner's shot of
the Claude Code phone app, where a repository chip sits above the box. The
Resources control **moved** there out of the composer bar; it was not
duplicated, and its dress changed with its address (a `--track` groove has no
edge on `--page-bg`, so out here it is `--surface-3` plus a hairline, the same
lifted-panel grammar the composer uses). The chat/code segmented pair beside
the wordmark is **gone** — it switched between two modes this product does not
have.

⚠️ **`lib/quick-actions.ts` IS PLACEHOLDER DATA THAT DESCRIBES WORK NOBODY
DID**, and that is a step past `lib/resource-packs.ts`'s invented pack names:
"3 of 4 steps · yesterday" is an assertion about the person reading it. Both
files are seams — the UI reads one function and nothing else — and both are
safe only while this surface is ungated and unrouted.

**The pane header's button is FEEDBACK** (owner, 2026-08-29), where the
reference drew an incognito hat. ⚠️ **The board behind it is not built, and
building it is what puts the auth gates back on this route** — a board reads
students' posts and their votes, which is the first real data anything on
`/dashboard` would touch, and an upvote that does not know who is voting counts
the same person forever.

**⚠️ IT READS NONE OF THE APP'S TOKENS, AND NOTHING READS ITS — with ONE named
exception.** `.cui` ships its own palette (`--page-bg`, `--sidebar-bg`,
`--clay`, three greys of text) and never touches `--color-canvas` /
`--color-ink` / `--color-accent`. The exception is **`--font-brand`**, declared
in the `.cui` token block and resolving to `--font-display`: the wordmark is
set in **Familjen Grotesk** (owner, 2026-08-29), because the surface is a
transcription of somebody else's app but the *name* on it is ours, and Familjen
is what our name is set in everywhere else it appears. It has a token so the
crossing stays countable — a second one gets a line there too, never an inline
`var()`. The scoping
is the whole safety argument: the reference carries a global reset
(`*{margin:0;padding:0}`), sizes the document and defines a full `:root`
palette, so unscoped it would restyle every page in the app. `*` became
`.cui *`, `html`/`body` became `.cui`, `:root` became `.cui`. **`.cui` is also
the seam** — when this stops being a scratch surface, swapping the token block
at the top of that CSS carries the whole thing.

**The full spec is in `design-system/SKILL.md` → "The `.cui` system"** — tokens,
geometry (288px sidebar, 32px row, 40rem column), type scale, and the four
component patterns everything on the page is made of (ghost button, row,
segmented control, raised panel with its three frame states). **Read it before
adding a page or control to this tree**, or the next surface will not match.

**What it replaced:** the 2026-08-27 home screen — one session list and a big
voice button — is `components/home/archive/SessionsHome.tsx` + `HomeDock.tsx`,
parked with the rest. That also closed BOO-44 by deletion: its complaint was
that those cards resolved to the dark `/study` call screen. **The routing
question is unchanged and still open**, since nothing now links there at all.

**Known consequences, both real:**
- **`/dashboard/courses` and `/dashboard/saved` have no navigation.** They share
  the (now bare) dashboard layout and lost the dock with it. Still reachable by
  URL. The fix, when wanted, is a route group with its own layout — *not* a top
  bar back over the dashboard.
- **`font-src` allows `assets-proxy.anthropic.com`**, or the greeting falls back
  to Georgia and it stops being a copy of the thing. Those are Anthropic's
  licensed faces on Anthropic's CDN — fine for a reference surface, and **the
  first thing to settle before a student sees it.**

**`/dashboard` also left `DesktopGate`'s block list.** That gate exists because
a phone layout stretched to 1440px "will not look good and it will look very
scrappy"; this is the first surface built the other way round — a desktop
layout that collapses to a drawer below 768px. Reading a step is still
phone-only.

**⚠️ NOTHING ON THIS SURFACE IS `position: fixed`, and that is load-bearing.**
The sidebar is a flex column that becomes `position: absolute` against `.app`
on a phone; the composer sits in the flow of its pane. The old dashboard's
`#content-surface` was the scroller *and* a `backdrop-filter` element, which
made it a containing block for fixed descendants — so every piece of fixed
chrome had to live outside `<main>` or it rode the scroll. That whole bug class
is retired here. Keep it retired.

**Two behaviours added to the reference rather than transcribed from it:**

- **The drawer is pulled, not toggled** (2026-08-29). Below 768px it follows
  the finger: edge-start (32px) to open, anywhere to close, axis decided once
  after 8px, settling on distance (40%) or a flick (0.4 px/ms). Three things
  that each break it silently — the position is written **straight to the DOM**,
  never through React state (a `setState` per `touchmove` is a re-render per
  frame); the listeners are **native with `passive: false`**, because React
  attaches touch handlers passively at the root and a `preventDefault` in an
  `onTouchMove` prop is ignored with no warning; and on release the end position
  is **named explicitly before the inline transform is cleared**, or it snaps to
  the old class value and animates from there. `touch-action: pan-y pinch-zoom`
  is what hands horizontal movement to us at all.
- **Overlays blur rather than darken** (owner, 2026-08-29):
  `rgba(11,11,11,.12)` with `backdrop-filter: blur(10px)`. Dimming alone has to
  go quite dark before a light UI reads as *behind* something, and dark over
  cream turns muddy first. ⚠️ The scrim must have no positioned descendants and
  the drawer is its **sibling** at a higher z-index (40 over 30) — a
  backdrop-filter element is a containing block for fixed children. It is also
  a full-screen blur on a phone, affordable only because it lives for the
  seconds an overlay is open. **Never on persistent chrome.**

**The icons are the app's set, not the reference's sprite** (2026-08-29). The file
shipped 19 paths eyeballed onto a 20 grid with no set behind them. The swap was
free because the grids agree: `on-screen stroke = stroke-width × size ÷
viewBox`, and the set's native 1.5 on a 24 viewBox is `1.5 × 20/24 = 1.25` —
exactly what the sprite had. `.i` / `.i-16` / `.i-12` still own the weight
(1.5 / 1.56 / 1.92, going **up** as the icon shrinks, to hold apparent weight
constant). ⚠️ **The width is set on the children (`.i > *`), never the `<svg>`**
— the set puts `stroke-width` on each path, and a declaration on an element
beats a value inherited from its parent, so setting it on `.i` does nothing and
the set's 1.5 wins in silence. The "Stop Claude" pill was removed in the same
change.

### The Ask Box — ARCHIVED 2026-08-27, and still the reference for the traps

**Superseded by the home screen above; `home/AskDock.tsx` is in `home/archive/`.**
Kept in full because every ⚠️ below was paid for and every one of them still
applies to `HomeDock` — the transports, the token route, the two ElevenLabs
hosts in the CSP, the `Permissions-Policy` microphone trap and the StrictMode
double-mount guard are all in `ask-engine.tsx`, which is shared and unchanged.


**A rounded box docks at the bottom of `/dashboard`** (owner, 2026-08-22). Tap
the text and it opens into a full-screen panel with the keyboard already up; tap
the microphone and the same box becomes a call. A session is a *scripted* walk
through one lesson group; this is the unscripted one — a student taps it because
something is on their mind.

**ONE ELEMENT, TWO STATES.** `home/AskDock.tsx` is a single fixed shell that
animates its four insets and its radius from a ~112px card to the viewport.
**Nothing is remounted on the way, and that is load-bearing rather than
pretty**: the composer inside the card is the composer at the bottom of the
open panel, so a tap focuses a real `<textarea>` inside the student's own
gesture and iOS opens the keyboard. Mount the input as part of the opening
instead and the focus call lands outside the gesture, which Safari answers by
doing nothing.

⚠️ **IT MUST BE RENDERED IN `dashboard/layout.tsx`, OUTSIDE `<main>` — never in
the page.** `#content-surface` carries `backdrop-filter: blur(16px)`, which
makes it a **containing block for `position: fixed` descendants** exactly as a
`transform` would, and it is also the scroller. A "fixed" element rendered
inside it is fixed to a box that scrolls, so it rides the page: *"when I scroll
up or down it moves with the screen instead of being fixed"* (owner,
2026-08-22). Nothing about the element was wrong; it was in the wrong parent.
Anything else fixed on this page belongs beside it.

**THE PALETTE IS THE APP'S, AND THE FIRST VERSION'S WAS NOT.** It shipped
wearing the session call's dark-green surface, its brand-green mic and the
orb — *"that green, or whatever colour you keep adding, does not match the
actual UI that I already have"*. It is white on `--color-line` now, ink text,
one `--color-btn` circle, `--color-active` for the mute beside it during a
call, and the orb is replaced by a five-bar **level meter in `--color-ink`**
(same job — something is happening and it follows the voice — in a colour this
surface already uses). Nothing new enters the palette to draw it.

**TWO ROWS, ONE LIVE BUTTON**, off the owner's own reference: the question gets
a line at 17px, the controls sit under it. The black circle is never disabled —
its glyph says what it does (microphone with nothing typed, arrow once there
is, handset during a call). It briefly had a permanent second circle with the
primary greyed out until you typed, which made the first thing on the home
screen two dead-looking circles and no invitation.

⚠️ **The scroll lock must hold BOTH scrollers.** Which one actually scrolls
depends on width: `#content-surface` on desktop, the document itself on a
phone. Measured, not assumed — a probe that scrolled only `#content-surface`
moved nothing at 390px wide and would have passed a panel you could still
scroll the page behind.

The easing is **`cubic-bezier(0.32, 0.72, 0, 1)`, deliberately not the app's
usual `(0.16, 1, 0.3, 1)`** — that curve is right for a 200px sweep across an
ActionBar and reads as a jump cut over 800px of screen. Measured, not guessed: a
per-frame probe had the house curve 71% of the way home 119ms into a 560ms
transition.

⚠️ **The edge treatment lives on the shell, with the radius.** It was an
`inset 0 0 0 1px` shadow on a background layer that had no radius of its own,
clipped by the shell's `overflow: hidden` — a square ring inside a round clip,
so the border **vanished at all four corners** (*"there's a difference in
radius between the white container and the border"*). A real `border` on the
element that owns the `border-radius` cannot disagree with itself.

⚠️ **No backticks inside that component's `<style>` template.** It is a JS
template literal, so a backtick in a CSS *comment* ends the string, and the
parse error surfaces pages later at the opening `<style>` tag rather than at
the comment that caused it.

| File | Job | Cost on first paint |
|---|---|---|
| `home/archive/AskDock.tsx` | the box, the morph, the composer — **archived** | plain React |
| `home/ask-engine.tsx` | the ElevenLabs conversation | **dynamic import** |
| `home/ask-types.ts` | the contract between them | types only |
| `lib/ask.ts` | the prompt, **client-safe** unlike `lib/session.ts` | reads the nav, not the prose |

**NOTHING CONNECTS UNTIL THERE IS SOMETHING TO SAY.** Opening the panel costs no
network — the engine mounts on the first sent message or the first tap of the
mic. Two reasons, the second being the real one: the SDK carries a WebRTC stack
that has no business in the dashboard bundle, and a conversation opened because
somebody glanced at the box is a conversation the account is billed for.
`ask-types.ts` exists so `AskDock` can never import the engine as a value.

**TWO TRANSPORTS, ONE AGENT, AND THEY ARE NOT INTERCHANGEABLE.** A call is
WebRTC on a conversation token; a typed conversation is a **signed WebSocket**
with `textOnly` — which is what stops the account paying to synthesise speech
nobody will hear, and it is billed **per message (~$0.003) rather than per minute
(~$0.08)**. `/api/agent/token` mints whichever the caller asks for
(`?mode=text`); the SDK will not convert one into the other, so switching means
remounting the engine, which is exactly what the mic button does. Typing into a
*live call* is different and allowed — `sendUserMessage` sends it as a user turn
and the agent answers out loud.

A typed answer **streams** (`onAgentChatResponsePart`) and is replaced by the
finished text when `agent_response` lands. A call keeps **no transcript** — only
the pinned points — for the reason `study/PointStack.tsx` gives: a transcript is
the reading this replaces, in pieces.

⚠️ **THREE TRAPS, ALL PAID FOR ON 2026-08-22, none visible from reading the code:**

- **`Permissions-Policy: microphone=()` denies the microphone to THIS origin
  too.** An empty allowlist is not "no opinion", it is "nobody, including self",
  so `getUserMedia` rejects with `NotAllowedError` *after* the student has said
  yes in the browser's own prompt. Voice sessions could not open a microphone in
  production from the day the headers shipped; the app said "Booklesss needs your
  microphone", which is the one message that makes it look like the student's
  fault. It is `microphone=(self)` now.
- **`connect-src` must name BOTH ElevenLabs hosts**: `api.elevenlabs.io` for the
  typed socket and **`livekit.rtc.elevenlabs.io`** for a call's signalling and
  media. That second host appears nowhere in this repo — our server mints the
  token and the SDK is handed the URL — so it cannot be found by reading the
  code. It was found by listening for `securitypolicyviolation` during a real
  call, which is the method to reuse if a regional host ever appears. Named
  hosts, not `*.elevenlabs.io`: this directive is the exfiltration guard.
- **A React StrictMode double-mount can cancel the only run.** A `useEffect`
  that starts a connection behind a `started` ref must **clear that ref in its
  cleanup**. Otherwise the first run marks itself started and is cancelled by its
  own teardown, and the second returns early because the ref says a run already
  happened — no socket, no request, no error, and it looks exactly like an agent
  that will not answer.

**And the setup script was writing its permissions into a field the API does not
read.** `platform_settings.client_overrides` returns 200 and stores nothing; the
field read back is **`platform_settings.overrides.conversation_config_override`**,
and `first_message` is a **sibling** of `prompt`, not a key inside it — nested
wrongly, the whole `prompt` subtree is discarded, so a PATCH meant to add one
permission silently removes the one that was working. `setup-elevenlabs.mjs` now
reads the agent back and prints what actually stuck. **A 200 from that endpoint
says the request parsed, not that the setting exists.**

### Where a Student's Answers Live — and why there are three copies

> **Read this section together with "Where a Student's Studying Lives" below.**
> This one is about who a student **is**; that one is about what they **did**.
> They are separate systems with deliberately different merge rules, and the
> reason is at the top of `lib/study-state.ts`: last-writer-wins is right for an
> answer and wrong for a record of work.

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

### Where a Student's Studying Lives — and why its merge is ADDITIVE

**Until 2026-08-10 only who a student IS travelled with the account.** What they
DID — progress, saves, note verdicts, typed comments — lived in localStorage
alone. Clearing a browser wiped a term's work, a new phone started from zero,
and a student who signed in on a second device got their name and courses back
beside a dashboard saying they had never studied. The competence-signal north
star hangs off completion data, and completion data in localStorage is not an
asset. Four tables now hold it:

| Store | Device key | Table |
|---|---|---|
| Saves | `booklesss:saved:v1`, `lib/saved` | `saved_sections` |
| Note verdicts | `booklesss:step-notes:v1`, `lib/step-notes` | `section_notes` |
| Typed comments | `booklesss:step-comments:v1`, `lib/step-comments` | `section_comments` |
| Progress (done, days, touched, grasp, last) | `booklesss:progress:v6`, `lib/progress` | `student_progress.state` (jsonb) |

One route both ways — **`/api/state`**, GET pulls the lot and POST pushes it —
because the moment that matters is sign-in, when all four have to reconcile at
once, and four routes make that four round trips before the dashboard is right.
On Zambian mobile data a dashboard that fills in four stages looks broken. The
schema and its reasoning are in **`tools/study_state.sql`**; the merge rules and
their proofs are in **`lib/study-state.ts`**, the client in `lib/state-sync.ts`,
started by `ProgressScope` (which already owned "which bucket", so it now owns
"and whose account that bucket is").

**THE MERGE IS ADDITIVE, AND THAT IS THE WHOLE DESIGN.** `students.identity`
merges last-writer-wins on a clock, which is right for an ANSWER — a student has
one name and the newer one replaces the older. It is wrong for a RECORD OF WORK:
two devices do not hold competing claims about which checkpoints were cleared,
they hold **different halves of one history**. Read three steps on a laptop and
four on a phone, and last-writer-wins leaves you with whichever synced second.
So: union the sets, take the max per counter, use a clock only where two copies
genuinely disagree about one value (comments, and "where was I").

**`max` and not `sum`, which is the tempting one.** The merge has to be
IDEMPOTENT — summing re-adds what the last sync already sent, so five re-syncs
become five times the reading. The accepted cost is the honest direction: real
same-day study on two devices counts once, at whichever did more. Under-counting
a day is a streak that is true; over-counting flatters, and `STUDY_DAY_MIN_SECS`
already settled that this app would rather a streak be earned.

⚠️ **NOTHING IS PUSHED UNTIL THE PULL HAS LANDED AND MERGED.** POST is
authoritative — it makes the server's rows equal the body's, which is what lets
an un-save actually delete. So a push from a device that has not yet read the
server would replace a student's whole history with whatever that browser had,
which on a fresh phone is nothing. **This is the 2026-08-05 bug in the other
direction** (six sign-ups lost their answers when identity pushed before the
account read completed); `ready` in `state-sync` is the same guard
`AccountSignal`'s `accountRead` is, and it is why the store subscriptions are
attached only *after* the first merge succeeds.

**Known cost, accepted: un-saving does not propagate across devices.** Saves
merge as a plain union, so a section un-saved on one device is handed back by
the other. Fixing it needs tombstones kept forever; a save that comes back is a
mild annoyance, a save that vanishes is what the control exists to prevent. The
shape to add, if it ever matters, is `removed_at` on `saved_sections` — not a
cleverer merge.

**Two views make it answer questions**, both `security_invoker`:
`section_signal` (which sections lose people — verdicts, saves and flags per
section) and `study_days` (the progress blob shredded into one row per student
per day, which is what makes storing it as jsonb safe). **Their audience is
whoever rewrites the step, never the reader** — putting these numbers on a step
page re-opens the 2026-08-09 decision that reading is a private question.

### The auth surface is the app's own form, on Supabase — ONE box for both jobs

**Clerk is gone** (`AuthGate` replaced `ClerkGate` on 2026-08-05) **and so is
the sheet** (owner, 2026-08-09, launch eve): a gated tap no longer opens a
popup over the page. `requireAccount()` survives as the one call every gate
makes — a plain function on a module store — but its consumer is now
`AuthRedirect`, which soft-navigates to the real `/sign-in` / `/sign-up` page
with `?next=<where they were>` and `?why=<which gate>`. A returning student
signs in and lands back where the gate interrupted them; a NEW account goes
through the real `/onboarding` (with the same `next` threaded through, so
`finish()` returns them to the step) instead of having the questions deferred
to the dashboard. Both params are stranger input and go through `safeNext` /
a whitelist on both ends (`lib/next-path`). Known cost, accepted: an unsaved
comment draft no longer survives the trip the way it survived the sheet.

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
