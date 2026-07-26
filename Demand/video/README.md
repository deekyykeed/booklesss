# Booklesss — Video (Remotion)

Demo videos and motion social posts, written as React and rendered to MP4.
Same brand as the PDFs and the reader: cream `#FFFDE8`, black `#121212`,
Familjen Grotesk display + Inter body, grain over every flat fill.

This sits beside `Demand/social/` (the still-carousel pipeline) — stills there,
motion here.

## Run it

```bash
cd "Demand/video"
npm run studio          # opens the Remotion Studio in a browser — live preview
```

In the Studio, pick a composition on the left and edit the text in the **props
panel on the right**. Nothing there needs code.

## Render

```bash
npm run render:vertical    # 1080×1920 → out/demo-vertical.mp4
npm run render:wide        # 1920×1080 → out/demo-wide.mp4
```

Or render one frame as a PNG to check a layout:

```bash
npx remotion still DemoVertical out/check.png --frame=180
```

The first render downloads a headless Chrome (~150 MB, once). `out/` is
gitignored.

## Compositions

| id | size | for |
|----|------|-----|
| `DemoVertical` | 1080×1920 | Instagram/TikTok/WhatsApp status |
| `DemoWide` | 1920×1080 | website hero, YouTube, pitch decks |

Both are the same three beats: **title card → the screen recording → CTA card**,
cross-faded. Frame budget lives in `src/schema.ts` (`INTRO` / `SCREEN` /
`OUTRO` / `TRANSITION`, 30fps) — change the numbers there and the composition
length follows.

## Putting your own footage in

1. Record the app. Either:
   - **Windows:** `Win+Alt+R` (Game Bar) or OBS, or
   - **scripted:** `node "Demand/social/_scripts/3-video.mjs"` — drives the real
     app in Playwright with a synthetic cursor, so hover/click states are
     genuine. Capture from the **mobile layout** for anything 9:16.
2. Drop the file into `public/recordings/`.
3. Set `screenSrc` to `recordings/<file>.mp4` in the Studio props panel (or in
   `defaultDemoProps` in `src/schema.ts` to make it the default).

Stills work too — any `.png`/`.jpg` in `public/recordings/` renders in the frame
with a slow drift, so a screenshot still reads as motion. Leave `screenSrc`
blank and you get a labelled placeholder instead of a crash.

## Layout

```
src/
├── index.ts                  registerRoot
├── Root.tsx                  the <Composition> list — add new ones here
├── schema.ts                 editable props (zod) + defaults + frame budget
├── brand.ts                  palette + font loading (vendored woff2, no network)
├── components/
│   ├── Paper.tsx             cream + grain background
│   ├── Wordmark.tsx          inline SVG mark + wordmark
│   ├── TitleCard.tsx         intro/outro card, words rise in sequence
│   ├── DeviceFrame.tsx       phone body / browser chrome + the <Screen> source
│   └── Caption.tsx           the line over the recording
└── compositions/
    ├── DemoVertical.tsx
    └── DemoWide.tsx
public/
├── fonts/                    familjen-grotesk.woff2, inter.woff2 (vendored)
├── brand/                    mark, logo, grain
└── recordings/               your footage (gitignored)
```

Fonts are loaded from `public/fonts/` — the same files the social capture
scripts embed — so a render never waits on a font CDN.

## Copy rules

Same as everywhere else in Booklesss: no hard sell, no banned words
(`leverage`, `seamless`, `journey`, `empower`, …), ZMW and Zambian companies in
any example. The student-facing CTA is **"search Booklesss on Google, three
S's"** — not a link, not "comment below".

## Licence

Remotion is free for individuals and for companies of **3 or fewer** people.
At 4+ it needs a paid company licence — see
[remotion.dev/license](https://remotion.dev/license). Worth re-checking before
the team grows.
