# 2026-07-26 Sunday

9:16, all light. Post each folder's images in order (`01 → 06`).

> **Morning + afternoon are build-in-public progress posts** — real features,
> shot from the live app. Morning was redone as one (it was stale evergreen with
> the old "comment" CTA). **Evening is still the older evergreen set** — redo it
> as a progress post or drop it.

| Slot | Time (local) | Folder | Type |
|------|------|-------|------|
| ☀️ Morning | ~08:00 | `morning/` | **progress post** |
| 🌤️ Afternoon | ~13:00 | `afternoon/` | **progress post** |
| 🌙 Evening | ~19:00 | `evening/` | evergreen (stale) |

---

### 🌤️ Afternoon — `afternoon/` · AI tutor (build-in-public)
**Post title:** An AI tutor, in your notes
**Caption:**
> Building in public 🛠️ — we're wiring an AI tutor right into the reader. Ask
> about the exact step you're on, or flip on voice mode and just talk to it.
> Still cooking, but here's a first look.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #designengineering #studytok #nextjs

---

### ☀️ Morning — `morning/` · the AI layer (build-in-public), 6 images
**Post title:** You'll never break another night again
**Caption:**
> You'll never break another night again 🌙 Building the AI layer into Booklesss
> in the open: it doesn't answer yet, but this part is done — a panel for the
> step you're on, a box to ask in right where you got stuck, and a voice mode
> that lights up as you talk. Answers next.
> Search **booklesss** (three s's) on Google — we're the first result. 👇
> #buildinpublic #edtech #ai #designengineering #studytok

Every frame is the current build: the top bar, the STEP panel, the composer at
rest, voice mode lit. The app's own "AI tutor — coming soon" hint is left
visible, and no slide claims an answer comes back. One staged detail: the voice
glow tracks live mic loudness and headless has no mic, so `7-ai-crops.mjs`
switches voice mode on for real and then writes a mid-sentence loudness value.

### 🌙 Evening — `evening/` · evergreen (stale — old "comment" CTA)
**Post title:** We sweat the details
**Caption:**
> We rebuilt the textbook as software and sweated every detail — one instant app
> for every subject, fast, quiet, and a little obsessive.
> Search **booklesss** (three s's) on Google. 👇
> #buildinpublic #designengineering #edtech #nextjs #indiehackers

---

*Regenerate: the afternoon progress post = `node _scripts/prog-post.mjs` (after
`cap-feature.mjs` with the dev server up). The carousels =
`node _scripts/5-day-carousels.mjs`, and pass `SLOT=morning` to rebuild one slot
without clearing the others — a blanket run refills every slot folder from
SLOTS, which would wipe the afternoon post. The AI-layer crops behind the
morning set = `node _scripts/7-ai-crops.mjs`. All default to today's date and
are self-contained. No posting connector here — upload manually or via a
scheduler.*
