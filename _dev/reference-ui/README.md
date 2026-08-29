# Reference UI

The source material `/dashboard` is built from. **Reference, not product** —
nothing here is imported, bundled or served. It is what you read and measure
against when changing the app's shell.

Moved here from the repo root on 2026-08-29, at the owner's ask, so the
reference lives somewhere it can be found rather than loose beside `README.md`
and `PROJECT_MEMORY.md`.

| File | What it is |
|---|---|
| `claudeuiclone.html` | The owner's recreation of the claude.ai desktop shell. Self-contained — open it in a browser. |
| `states.png` | Annotated interaction states for the **shell** (2026-08-28). |
| `cardstates.png` | Annotated interaction states for the **project cards** and header buttons (2026-08-29). |
| `proj.png` | The Projects grid, captured from the real app. |

## How it relates to the app

`claudeuiclone.html` is transcribed into
`platform/src/components/home/claude-ui/ClaudeUI.tsx`, with its stylesheet
copied into `platform/src/app/globals.css` **scoped under `.cui`**. The
transcription is deliberate and near-verbatim — the owner asked for a
replacement rather than an adaptation ("100% the ui, that's where I want to
start from"), so the labels still read Projects, Artifacts, Scheduled.

The spec for building new pages to match is
`.claude/skills/design-system/SKILL.md` → "The `.cui` system". **Read that
before adding a page**, not this folder — this folder is the raw material it
was written from.

## ⚠️ The clone and the app have diverged, and that is expected

They are not kept in lockstep and should not be diffed as though they were.
As of 2026-08-29 the app has moved on in three ways the file has not:

- **Icons** — the app draws Hugeicons Free; the file still carries its own
  hand-drawn 19-symbol sprite.
- **Responsive** — the app's drawer is React state with a finger-tracking
  swipe. The file had an off-canvas drawer built into it on 2026-08-28
  (PR #183); **the 2026-08-29 capture does not have it**, because that capture
  is a fresh pull of the real UI rather than an edit of the previous file. The
  media queries and the `dvh` height went with it. Nothing was lost from the
  app.
- **Stop Claude** — removed from the app, still present in the file.

So: when the file gains something (as it just gained the Projects page), treat
it as a **new capture to read from**, not as a diff to apply.

## The annotated states are exact values, use them

`cardstates.png` carries the numbers rather than describing them, which is why
it is worth keeping as an image:

- card at rest — `bg #fcfcfb`, inset 1px ring
- card on hover — `bg → #fff`, **instant, no transition**
- card pressed — the **wrapper** scales to `.98` over 60ms, not the card
- New project button hovered — `#0b0b0b → #2c2c2a`

The pressed state is on the wrapper on purpose: scaling the card itself would
scale its ring with it.
