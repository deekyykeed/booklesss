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
