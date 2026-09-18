---
name: flute
description: >
  Turns real React UI (the platform/ Next.js app) into a cinematic 3D video —
  camera moves, depth of field, MP4 export — from the actual running
  components, not a mockup. Use when the owner asks for a "cinematic" shot of
  the app, a video version of a feature (as opposed to daily-post's static 9:16
  carousels), a scene/fly-through of a screen, or mentions "Flute" by name.
  NOT INSTALLED YET — this file is reference-only until the owner explicitly
  asks to install it. Not for static image carousels (daily-post) or PDFs
  (step-skill).
---

# Flute

**Flute** (`@webprodigies/flute`, MIT, Web Prodigies) renders real React
components as a cinematic 3D scene — camera travel, depth of field, a
first-party "studio" for playback — and can export the result as an MP4. It
runs entirely locally: no account, no AI subscription, no MCP server. Repo:
`github.com/webprodigies-org/flute`.

**Not installed in this repo yet.** This skill exists so a future request
("make a cinematic shot of the reader", "export a Flute video of the
dashboard") doesn't start from zero — it does NOT mean the package, the `/flute`
route, or `FLUTE.md` exist on disk. Check before assuming any of this is live:

```bash
ls platform/FLUTE.md platform/src/flute 2>/dev/null
grep '"@webprodigies/flute"' platform/package.json
```

If none of that exists, installing is real project surgery — a new
dependency, a generated dev-only route, a `git switch -c flute-scenes` branch
per its own README — and belongs behind an explicit ask from the owner, the
same as any other new-dependency decision. Don't install it as a side effect
of an unrelated task.

## Requirements

- Node 22.12+ (this machine has v26.1.0 — fine).
- React DOM 18.2+ or 19 (platform/ qualifies — check `package.json` if it
  hasn't been looked at recently).
- For MP4 export only: FFmpeg on the system, and Chromium via
  `npx playwright install chromium`.

## Install (first time only, in `platform/`)

```bash
cd platform
git switch -c flute-scenes      # its own README asks for a dedicated branch
npm install @webprodigies/flute
npx flute init                  # Next.js: adds a dev-only /flute route + FLUTE.md
npm run dev
```

`npx flute init --adapter react` instead, for a framework-agnostic host (not
needed here — platform/ is Next.js).

## Using it once installed

The tool's own README gives this as the exact agent prompt, and it is a
correct one to reuse verbatim once the package is present:

> Read FLUTE.md and run `npx flute guide --json`. Inspect this app's real
> [page] and create a cinematic Flute scene from its existing components.
> Choose intentional close perspective, camera travel and depth of field.
> Preserve the app's design and providers. Verify it in the browser, save a
> snapshot, and give me the scene URL.

A scene is a pair of files under `src/flute/scenes/`:
- `<name>.scene.json` — camera, depth, motion spec
- `<name>.tsx` — a component wrapping the real host UI in `Surface` elements,
  keeping every provider and style intact (this is what makes it "the real
  app," not a redrawn copy)

CLI, once installed:

| Command | Does |
|---|---|
| `npx flute guide --json` | authoring reference for scene JSON — read this before writing a scene, don't guess the schema |
| `npx flute scenes` | list scenes in the project |
| `npx flute open --scene <name> --url <url>` | open the studio on one scene |
| `npx flute snapshot --scene <name> --url <url>` | cache a rendered still |
| `npx flute export --url '<url>?flute-preview=1&flute-scene=<name>' --output <file>.mp4 --fps 30\|60\|120` | render the MP4 |

Export samples the live scene deterministically and excludes the studio's own
controls from the frame. Depth of field is a DOM blur approximation, not
ray-traced — don't oversell it as photoreal in anything written about it.

## Where this fits in Booklesss

`daily-post` already captures the reader's mobile layout for static 9:16
carousels. Flute is the same instinct — show the real, running product,
never a mockup — for a **video** instead of a still. If the owner asks for a
cinematic/video version of a build-in-public post, this is the tool; the
static pipeline in `daily-post/RULES.md` (course/school-name ban, safe-area
check) still applies to anything Flute's shots are captioned or posted with —
those rules aren't enforced by Flute itself.
