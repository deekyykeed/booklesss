# Booklesss

A speed-optimized rebuild of the Booklesss Framer site — learn without the textbook.
Recreated pixel-faithfully from the Framer source on a hand-tuned, static-first stack.

## Stack

- **Next.js 16** (App Router, React Server Components) — every route prerendered as static HTML
- **Tailwind CSS v4** — design tokens measured from the Framer project
- **`next/font`** — self-hosted **Inter** (UI) + **Familjen Grotesk** (headings), zero CLS
- **Solar Bold + Solar Line** icons (`@iconify-json/solar`) inlined as SVG on the server — no icon font, no client JS, no per-icon network request
- Client JS only where interaction demands it: the ⌘K command palette and the collapsible docs sidebar

## Routes

| Route | Surface |
|-------|---------|
| `/` | Lesson reader, showing the default step (`what-is-economics`) |
| `/[...slug]` | One prerendered route per lesson, e.g. `/microeconomics/supply-demand/law-of-demand` |
| `/sign-in`, `/sign-up` | Clerk auth (only when Clerk is configured — see below) |
| `/page`, `/old-home` | Parked scratch pages from the earlier dashboard build |

## Step progress

Each step's **checkpoints are its sections** — nothing extra to author, so adding
a section adds a checkpoint. Clearing the checkpoint at the end of a section fills
that step's completion ring, and the last one completes the step. The same ring
appears beside the step in the sidebar, in the right panel header, and on the
closing card of the step.

### Comprehension checks

A checkpoint is cleared by **answering a question about the section**, not by
saying you read it. Give a section a `check` and its checkpoint opens that
question instead of ticking:

```jsonc
{
  "id": "key-ideas",
  "heading": "Key ideas",
  "blocks": [ /* … */ ],
  "check": {
    "question": "Opportunity cost is the value of what?",
    "options": ["Everything you didn't choose, added together.",
                "The next best thing you gave up.",
                "The money you actually handed over."],
    "answer": 1,                     // index into options
    "explain": "Only the single best alternative counts — …"
  }
}
```

A **first** wrong answer marks only what you picked and sends you back to the
text; it deliberately does not show which option was right, or "try again" would
just mean clicking the green one. A **second** miss reveals the answer and the
explanation, and you still have to select it to clear the checkpoint. Escape or
Cancel closes without clearing anything, so the tick is always earned.

`check` is optional — a section without one keeps the plain self-marked tick, so
questions can be rolled out gradually. Where a step has any checks, the "Mark all
done" shortcut disappears (it would be a skip button).

**Authoring:** `check` lives inside the `sections` JSONB, which `gen-course.mjs`
copies verbatim, so once a question is in Supabase it flows through on its own.
Until then it exists only in the committed `course-data.json` — and a regenerate
would wipe it. So `gen:course` **carries over any check the incoming data
doesn't have** and logs how many it kept. Supabase always wins where it has one;
this only fills gaps. Deleting a question therefore means deleting it in both
places.

Progress lives in `src/lib/progress.tsx` — a `useSyncExternalStore` store over
localStorage, so it survives reloads and doesn't break server rendering. It is
scoped per signed-in user when Clerk is configured. The stored shape
(`lessonId -> checkpoint ids`) is what a `progress` table row would hold, so
moving it server-side later is a write-through rather than a rewrite.

## Auth (Clerk)

Clerk is wired up but **entirely optional**: with no keys set, there is no
provider, no proxy, no auth UI, and the app behaves exactly as it did before.
Everything hangs off `clerkEnabled` in `src/lib/clerk.ts`. Copy `.env.example`
to `.env.local` and fill in the keys to turn it on.

Two things to keep in mind when touching this:

- **Auth UI must stay a client island.** Clerk's `<Show>` works in server
  components, but there it resolves auth during the server render and opts every
  route out of static generation — the whole site stops being prerendered. That
  is why `src/components/Account.tsx` is `"use client"`.
- Nothing is gated yet. Every lesson is still public; making the course
  members-only is a one-line change in `src/proxy.ts` (see the comment there).

All Clerk surfaces — the sign-in popup, the `/sign-in` and `/sign-up` pages and
the account menu — are styled once in `src/lib/clerk-appearance.ts`, set on
`ClerkProvider` so it cascades. It uses style objects rather than Tailwind class
names, since those live outside JSX and this project has been bitten by the
class scanner dropping arbitrary values. Actions are black (matching the app's
other buttons); green stays reserved for progress and success.

The header's account slot reserves its 32px while Clerk boots (`.account-skeleton`),
so the avatar doesn't pop in and shift the row.

Note the file is `proxy.ts`, not `middleware.ts` — Next 16 renamed the
convention. Clerk's docs still say middleware; only the filename differs.

## Develop

```bash
npm run dev      # http://localhost:3000
npm run build    # production build (all routes static)
npm start        # serve the production build
```

## Structure

```
src/
  app/                 (reader) route group + root layout, sign-in / sign-up
  proxy.ts             Clerk proxy (pass-through when Clerk isn't configured)
  components/
    TopBar.tsx         fixed 48px header (logo, breadcrumb, search, account)
    Account.tsx        Clerk user button / sign-in (client island — see Auth)
    ClerkIsland.tsx    error boundary so an auth failure can't unmount the reader
    CommandSearch.tsx  ⌘K palette (client island)
    reader/
      Sidebar.tsx        course navigator + per-step completion ring
      RightPanel.tsx     "on this page" TOC, step progress, AI composer
      LessonView.tsx     the reading column
      Checkpoint.tsx     end-of-section tick + end-of-step completion card
      CompletionRing.tsx the ring itself, used at three sizes
  lib/
    course.ts          nav tree, routing index, checkpoint helpers
    progress.ts[x]     checkpoint store (localStorage)
    clerk.ts           clerkEnabled flag + auth URLs
    icon.tsx           server-only Solar SVG renderer — <Icon name="magnifer-linear" />
```

Design tokens live in `src/app/globals.css` (`@theme`). Icons: use `-linear` for Solar Line,
`-bold` for Solar Bold.
