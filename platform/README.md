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
| `/` | Dashboard — greeting, study stats, and the student's courses |
| `/economics` | That course's overview — progress, next step, unit by unit |
| `/[...slug]` | One prerendered route per lesson, e.g. `/microeconomics/supply-demand/law-of-demand` |
| `/sign-in`, `/sign-up` | Clerk auth (only when Clerk is configured — see below) |
| `/page`, `/old-home` | Parked scratch pages from the earlier dashboard build |

## The dashboard (`/`) and the course overview (`/economics`)

Two levels. **The dashboard** is above the courses: a time-of-day greeting, how
the studying is going (streak, days studied, checkpoints, steps), then the
course list. **The course overview** is inside one course. A "Dashboard" row
sits at the top of the course navigator, so it's always one click from any step
— the same word in both rails, on purpose.

The dashboard swaps the course navigator for `HomeSidebar`. Exams, Upcoming and
Settings are drawn there and marked **Soon** — they aren't wired to anything,
and showing the shape is more useful than links that 404.

`lib/courses.ts` is the course registry. **One course exists**: `gen-course.mjs`
pulls a single slug out of Supabase and `course-data.json` is that course's
tree, so its top-level nodes are units, not sibling courses. Adding a second is
a data change first — the generator has to emit a course per slug and the JSON
gains a level. The dashboard reads the registry, so it won't need touching then.

**Not built, for want of data:** a coaching or AI summary of how the week went.
There's no tutor backend, and no study goal is captured at sign-up, so a
"you're behind target" line would be invented. It states facts instead —
streak, whether you've studied today — until there's a target to measure
against.

### Streak data

`lib/progress.tsx` records the local dates on which a checkpoint was cleared
(`days`), which is what makes the streak a fact rather than a guess. The store
moved to a `v2` key for it; anyone holding `v1` progress is migrated on read,
with `days` starting empty — their real dates are unknown, so the streak begins
the next time they study rather than being backfilled with invented ones.

## The course overview

Overall completion, the one step to open next, the course unit by unit, and a
short queue. It shares the reader's chrome — same header,
same course nav — but has no right rail, since "on this page" and the step
composer are both about a step and there isn't one here. That's what
`MobileNavProvider hasRightPanel={false}` and `.content-frame.no-rightbar` do:
hide the rail's toggle, stop a left-swipe uncovering an empty drawer, and give
the content back the gutter.

Everything on it derives from the same checkpoint store the reader writes to —
no second source of truth, and no new state. "Next" prefers a step you've
already started over an untouched one, so you finish what you opened.

There is deliberately no "recently studied": the store records *which*
checkpoints are done, not *when*, so any recency claim would be invented.
Adding timestamps is a change to `lib/progress.tsx`, not to the dashboard.

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

## Search

⌘K searches the **whole course, including section body text** — not just lesson
titles. `src/lib/search.ts` builds an in-memory index from the same bundled
course data the reader renders, so there's no request and no backend: searching
"price maker" scores 30 lessons and 69 sections on each keystroke, which is
cheaper than any indexing cleverness would be.

Two kinds of hit. A **lesson** hit matches its title or kicker and opens the
lesson; a **section** hit matches its heading or body and links to `#id`, so you
land on the paragraph that matched rather than the top of the page. Section hits
show an excerpt centred on the match, with the terms marked. Every term must
appear (AND), so "opportunity cost" doesn't drag in every mention of "cost".

**`section.check` is deliberately not indexed.** Those are the comprehension
questions — indexing the options or the explanation would let a reader search up
an answer without reading the step, which is the one thing the checks exist to
prevent. If you add searchable fields, keep them out.

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
