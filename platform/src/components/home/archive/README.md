# The old dashboard, parked

Everything in this folder drew `/dashboard` up to 2026-08-27, when the owner
sent a sketch of a different home screen — a wordmark, one list ("Your
sessions"), and a big circular button at the bottom that starts a voice call —
and asked for the current page to be archived rather than deleted.

**Nothing here is routed.** `app/dashboard/page.tsx` renders `SessionsHome`
now. These files still compile and still typecheck, which is the whole reason
they are on disk in this shape rather than only in git: putting one back is an
import, not an archaeology exercise. It is the same parking `HomeSidebar.tsx`
got on 2026-08-05.

| File | What it was |
|---|---|
| `HomeView.tsx` | The whole page: greeting, four stat tiles with sparklines, the courses section, the offline tools, the legal footer. |
| `HomeViewWithUser.tsx` | Supplied the signed-in first name to that greeting. |
| `OfflineTools.tsx` | Install-as-an-app and download-for-offline, under the courses. |
| `AskDock.tsx` | The 52px black microphone in the bottom-right corner that morphed into a full-screen ask panel. |

## What replaced each part

- **The stat tiles and the greeting** are gone from the home screen and have no
  new home yet — the owner's call ("drop it for now"). `TONE` in `HomeView.tsx`
  is still the source of the four validated hues that `lib/step-notes.ts`
  refers to, so do not delete this file without moving that comment.
- **The courses grid** moved to `/dashboard/courses`, which renders the same
  `CoursesSection` this file used to. That component was NOT archived — it is
  live, one directory up, with the same props.
- **The offline tools** are archived with the page; `lib/install.ts` still
  carries the duplicate implementation its own note describes.
- **`AskDock` is superseded by `HomeDock`.** The new bottom bar owns the
  conversation, and the difference is deliberate: the owner asked that going
  into a chat change as little on screen as possible ("just that necessary
  minimal changes happen like the button having audio waves or bars"), so the
  call happens in place and the button grows a level meter, where this one
  animated a black disc into the whole viewport.

## What the new dock does NOT carry over

`AskDock` had a **typed** conversation as well as a call — a signed WebSocket
with `textOnly`, billed per message (~$0.003) rather than per minute (~$0.08).
The sketch has no text box and no panel to put one in, so `HomeDock` is voice
only. The engine behind it (`../ask-engine.tsx`) still supports both transports
and is unchanged; adding typing back is a composer, not a protocol.
