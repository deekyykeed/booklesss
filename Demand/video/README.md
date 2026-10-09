# Booklesss — Video (Remotion)

Demo videos and motion social posts, written as React and rendered to MP4.
This sits beside `Demand/social/` (the still-carousel pipeline) — stills there,
motion here.

## Run it

```bash
cd "Demand/video"
npm install            # first time
npm run sync:shots     # copy the app captures into public/ (see below)
npm run build:icons    # regenerate src/icons.tsx from public/icons/*.svg
npm run studio         # live preview; edit copy in the props panel
```

The first render downloads a headless Chrome (~150 MB, once). `out/` is
gitignored.

## Compositions

| id | size | length | what it is |
| --- | --- | --- | --- |
| `InAction` | 1080×1920 | 55.0s | **the main one** — the app actually running: typing, scrolling, voice |
| `ProductDemo` | 1080×1920 | 60.0s | earlier cut: a camera moving over still captures |
| `SidebarDemo` | 1080×1920 | 9.2s | sidebar motion study; loops seamlessly |
| `DemoVertical` | 1080×1920 | 11.5s | generic title → footage → CTA template |
| `DemoWide` | 1920×1080 | 11.5s | the same, 16:9 |
| `DemoSheet` | — | still | **QA board**: 15 moments of `InAction` as one image |
| `ContactSheet` | — | still | **QA board**: every capture in `public/app` at once |
| `Explainer-<slug>` | 1080×1920 | from the voice | **explainers** — you ↔ animation, timed to the VO (see below) |
| `ExplainerSheet` | — | still | **QA board** for an explainer; `seams: true` for the transitions |

```bash
npm run render:action      # InAction     -> out/booklesss-in-action.mp4
npm run render:demo        # ProductDemo  -> out/product-demo.mp4
npm run render:vertical    # DemoVertical -> out/demo-vertical.mp4
npm run render:wide        # DemoWide     -> out/demo-wide.mp4
npx remotion render SidebarDemo out/sidebar-demo.mp4
```

## Checking a render

Don't render a pile of separate stills. Render one QA board:

```bash
npx remotion still DemoSheet out/_qa.png
```

That's fifteen moments of the real composition in a single image. It works
by wrapping the same component in `<Sequence from={-n}>` — a negative offset
means each tile sees frame `n` at sheet frame 0. No intermediate video, nothing
to clean up. `ContactSheet` does the same for the source captures.

## Explainers — you on camera, cutting to animation, timed to your voice

The "launch film" look (paper vs ink, small typed lowercase, pixel objects,
pen marks, heat-map people, grain) applied to a teaching video. **You and the
animation always take the full screen — never split-screen.** The voice is the
clock: every animated element lands on a specific spoken word.

```text
src/explainers/<slug>/script.json   what is said, beat by beat, and what fills the screen
src/explainers/<slug>/words.json    when each word is said  (generated — see below)
src/explainer/                      the engine: align, scenes, presenter, transitions, look
```

A beat in `script.json`:

```json
{ "show": "anim", "in": "whip", "scene": "calc",
  "say": "...is a hundred over one point one. Ninety kwacha, ninety one.",
  "steps": [ { "text": "K100", "on": "hundred" }, { "text": "÷ 1.10", "on": "over" },
             { "text": "K90.91", "on": "ninety", "result": true } ] }
```

`show` is `you` or `anim`. `in` is the transition into the beat. `on` is the
word an element lands on. Scenes: `formula`, `calc`, `bars`, `cards`, `spell`.

| transition | between | what it does |
| --- | --- | --- |
| `thermal` | you → anim | you heat up into a heat map, a glow swallows the frame |
| `punch` | anim → you | hard cut, small push-in, the heat cools off you |
| `whip` · `slam` · `ink` · `cut` | anim → anim | whip pan · black bar · ink drop · hard cut |

### Make one

```bash
npm run gen:audio                              # music bed + sfx, once (regenerable, gitignored bed)
npm run voice:placeholder -- present-value     # TTS stand-in voice + words.json
npm run qa:explainer                           # 24-frame QA board -> out/_explainer-qa.png
npm run render:explainer                       # render + master to -14 LUFS -> out/explainer-present-value.mp4
```

Seam check — three frames round every transition:
`npx remotion still ExplainerSheet out/_seams.png --props='{"slug":"present-value","seams":true}'`

### Editing your raw footage

```bash
npm run footage -- transcribe <slug> "path/to/raw.mp4"   # verbatim words, ums kept
npm run footage -- propose <slug>                        # proposed cut -> out/<slug>/edit.md
#   read edit.md; adjust out/<slug>/edl.json by hand (retakes are a judgement call)
npm run footage -- cut <slug> "path/to/raw.mp4"          # 9:16 30fps cut + its audio + words.json
npm run footage -- faces <slug>                          # face box per frame, for the subtitles
#   write src/explainers/<slug>/script.json from the cut transcript; list it in src/explainers/index.ts
npx remotion render Explainer-<slug> out/<slug>.raw.mp4 --props='{"slug":"<slug>","footage":"recordings/<slug>.mp4"}'
npm run mux -- <slug>                                    # -> out/<slug>.mp4 with YOUR sound
```

- **Your sound is never processed** (owner, 2026-10-09). No music, no sfx, no
  ducking, no loudness pass on a footage render: `mux` swaps the take's own cut
  track back in. The only thing done to it is cutting, with a 4 ms fade at
  each join so the joins don't click.
- **Silences, ums, stutters and retakes** are found by `propose`: a retake is
  an utterance whose opening you say again soon after — the later one is kept.
  Whisper is prompted with disfluent text so it keeps the ums it would
  otherwise tidy away.
- **Subtitles are set around your face**, not across it (`src/explainer/TypeTrack.tsx`).
  `faces` is detection only — nothing is cut out of the picture; no background
  removal (owner, 2026-10-09).
- Model weights (`models/`, the YuNet face detector) are gitignored and
  re-downloaded by `footage.py` if missing. Whisper models live in the
  Hugging Face cache (small.en, medium.en pre-fetched).

### Pixel assets

`npm run export:pixels` writes every object in `src/explainer/pixel-art.ts` to
`public/assets/pixel/` as `<name>.svg` + `<name>@16x.png`, plus `_sheet.png`.
Fifteen so far: coin, note, calculator, hourglass, bank, chart, bond, book,
gradcap, phone, clock, wallet, bulb, receipt, piggy.

### Gotchas, paid for

- **Windows TTS word positions are wrong across punctuation** — it overstates
  every comma and full-stop pause and the error compounds down a beat. The
  placeholder script speaks phrase by phrase and times each from its real audio
  length for that reason. Do not "simplify" it back to one `Speak()` per beat.
- **An answer spoken last in a beat is on screen only until the next beat's
  first word.** Leave the beat room after its payoff, or move the payoff earlier.
- **Two renders at once** halve the speed and write the same file. Check
  `Get-Process remotion` before starting one.
- The first launch of headless Chrome sometimes times out at 25s; a re-run works.
- Remotion's mix comes out quiet (~-20 LUFS). `scripts/master.mjs` is the
  two-pass loudnorm to -14 LUFS / -1.5 dBTP; `render:explainer` runs it.

All art, music and sound here is generated in this folder — pixel objects in
`src/explainer/pixels.tsx`, music and sfx by `scripts/gen-audio.py`. Nothing to
license or credit.

## Safe areas

Every social platform draws its own furniture over the video: the account
header across the top, the like / comment / share rail down the right, the
caption and progress bar along the bottom. `src/safe.ts` holds those margins.

- `STAGE` — the usable box. Left-aligned type lives here.
- `CENTERED_X` / `CENTERED_W` — a box genuinely centred in the **frame** that
  still clears the right rail. Interactive UI (the composer, the nav panel)
  goes here, so it reads as middle-of-screen rather than pushed left.
- `ACTION` — `STAGE` minus the caption block at the top.

`Statement` and `Caption` take a `safe` prop that switches them from
full-frame padding to the stage box. Anything new should use it.

## What actually moves

The point of `InAction` is that the interactive parts are **rebuilt live**, not
filmed:

| piece | file | what it does |
| --- | --- | --- |
| course nav | `compositions/SidebarDemo.tsx` | selector rides between steps, folders open and shut. `chrome={false}` renders just the panel for embedding |
| reading | `components/Screen.tsx` → `ScrollShot` | flick-scroll with real deceleration; each stop is where the page rests |
| typing | `components/LiveComposer.tsx` | types a question a character at a time, blinking caret, send button lights, turn rises as a bubble |
| voice | same, `mode: "voice"` | `speechEnvelope()` — a speech-shaped loudness signal — drives the glow blobs and the level meter |

`speechEnvelope` is **synthesised**, not recorded: a render has no microphone.
It's phrases of syllable bursts with breaths between them, so it moves the way
the real mic-driven glow does. It is not claiming to be real audio.

The composer is built to the real construction in `globals.css` — white slab,
soft drop shadow plus a hairline ring drawn as a shadow, nested radii, glow
blobs behind with `opacity = von * (0.06 + voice * 0.88)`.

## Icons

Streamline **Freehand Duotone — Free**, in `public/icons/*.svg`.
`npm run build:icons` inlines them into `src/icons.tsx` as components taking
`line` and `duo` colours, because an `<img>` can't be recoloured and these are
two-layer icons. Drop a new SVG in and re-run.

## The app captures

Every app frame in `ProductDemo` is a **real screenshot of the reader**, not a
redraw. They are shot from the app's MOBILE layout by
`Demand/social/_scripts/cap-feature.mjs` (dev server up) and committed once, in
`Demand/social/_source/feature-capture/`.

`npm run sync:shots` copies them into `public/app/` so Remotion's `staticFile()`
can reach them. **`public/app/` is gitignored** — the PNGs live in one place in
the repo, not two. After a fresh clone, or after re-shooting the app, run it.

`src/shots.ts` is the table of what each capture shows, with its intrinsic size.
The camera (`src/components/Screen.tsx`) cover-fits every shot — scales it so it
always fills the frame — then applies the move on top. `focus: {x, y}` biases
the crop (`y: 1` keeps the composer in frame on a tall screen).

Watch out: a 1206-wide capture in a 1080 frame is already cropped ~240px a side
by the cover fit, so scaling much past 1.1 starts eating UI at the edges. Buy
closeness with the `y` offset instead of with scale.

## Editing a cut

Each composition is one list of beats with a `D` object at the top holding the
frame budget. `TransitionSeries` overlaps every transition, so the length is
`sum(durations) - T * (number of transitions)`:

- [`InAction.tsx`](src/compositions/InAction.tsx) — 1706 − 8×7 = **1650** = 55.0s
- [`ProductDemo.tsx`](src/compositions/ProductDemo.tsx) — 1900 − 10×10 = **1800** = 60.0s

Change a duration and the total moves with it; the exported `*_DURATION` is
computed, so nothing goes out of sync.

## Look

Matched to the reader app, not the PDFs: `#f8f9fc` background, `#171717` ink,
Familjen Grotesk display + Inter body — the fonts are loaded from vendored
`.woff2` in `public/fonts/`, so a render never waits on a font CDN.

Screens are **full-bleed** — no phone mockups, no cards, no boxes. The
screenshot fills the frame, zoomed into the part that matters, with a soft fade
(`Scrim`) only where the headline sits. Same treatment as the social progress
posts.

Background blobs (`src/components/Blobs.tsx`) are the app's own `.bg-waves`
backdrop ported to frame-driven motion. Two palettes: `ambient` (the app's real,
faint hues — the default, and what the demo uses) and `voice` (the vivid glow
colours from voice mode). Each blob's loop period equals the clip length, so any
composition using them loops without a seam.

## Copy rules

Same as everywhere else in Booklesss: no hard sell, no banned words
(`leverage`, `seamless`, `journey`, `empower`, …), ZMW and Zambian companies in
any example. The student-facing CTA is **"search Booklesss on Google, three
S's"** — not a link, not "comment below".

**The AI tutor is in preview** — there is no chat backend and the voice orb is
still a placeholder. Copy says "we're building this", never "it answers". Same
honest framing `prog-post.mjs` uses.

## Licence

Remotion is free for individuals and for companies of **3 or fewer** people.
At 4+ it needs a paid company licence — see
[remotion.dev/license](https://remotion.dev/license).
