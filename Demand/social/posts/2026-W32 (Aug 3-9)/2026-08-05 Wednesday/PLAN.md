# 2026-08-05 Wednesday

9:16, all light. Post each folder's images in order. **No CTA slide on anything**
— the call to action is the caption.

**A day with no ship to post, for the second day running.** Today's commits are
the auth surface being torn out of Clerk and rebuilt on Supabase, plus the
handle question being removed and a lint pass. That is a sign-up form, and a
sign-up form is not a subject (RULES.md rule 6) however much work went into it.
So the day is three product components and two sets of logo plates.

| Slot | Time (local) | Folder | Slides | What it is | Verdict |
|------|------|-------|-------|------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 3 | the contents rail, at three reading positions | ✅ *"great illustration of the feature"* |
| ☀️ Midday | ~11:00 | `2-midday/` | 4 | logo plates — the icon | ❌ *"bad — not a good rep"* |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 3 | the comment box, at three states | ❌ *"showing an incomplete feature"* |
| 🌆 Evening | ~19:00 | `4-evening/` | 4 | logo plates — the name | ✅ *"better illustration and creative showcase of logo on different ways"* |
| 🌙 Night | ~21:30 | `5-night/` | 3 | the course tree's rings, at three degrees of clearing | ✅ *"amazing"* |

**Three of five landed. Both misses are now rules** (RULES.md 5 and 10):

- **Midday** was two pairs of near-duplicates — the same tile square then round,
  then the same word reversed out of black twice. Four slides, two ideas.
  Evening, from the same reserve, was four different ideas and was praised for
  exactly that. A plate slot needs four TREATMENTS, not one treatment on four
  grounds.
- **The comment box should never have been shot.** `platform/COMMENTS-PLAN.md`
  says so in its first line: *"Nothing here is built. The thing shipped is a
  private notebox on one device."* The feature is students answering each other
  and none of it exists. Rendering is not shipping — that is now rule 10, and
  it should have been caught before the capture, not after the post.

**Two plate slots, which is the ceiling** — and it took real hunting to keep it
there. Both new components come out of the step-context drawer, which on a phone
is a swipe with no button and had never been photographed. See the write-offs at
the foot for the four subjects that were shot or considered and rejected.

> ⚠️ **Shot from the clean worktree pinned to `132673c`** — today's HEAD, not
> yesterday's. Two things had to change in `C:/bkls-shot` to get there and both
> are now permanent: `npm install` (Clerk's packages are gone, `@supabase/ssr`
> is in), and the two `NEXT_PUBLIC_SUPABASE_*` keys commented out of
> `.env.local`. `authEnabled` replaced `clerkEnabled` today and reads that pair,
> so commenting them is what turns the dashboard's onboarding gate into a no-op
> and lets a headless browser photograph a seeded reader.

> ⚠️ **A production server, not `next dev`** — `npx next build && npx next start
> -p 3101`. Only two shots strictly need it (the offline card's buttons, which
> were then written off) but the whole capture was taken on it.

---

## 🌅 Morning — `1-morning/` · The contents rail, at three reading positions

**Post title:** It knows where you are

**Slides:** the top of a step, nothing answered → half way, two cleared → the
end, all four

One component, three states that differ in kind. The bar tracks whichever
section is on screen and the ticks are the app's own record — each one was put
there by pressing the mark at the foot of that section, not seeded.

The three are rendered as a **group** so they register on each other: same
scale, same place, and the only things that move are the bar and the ticks.
That is new machinery and it is in `prog-post.mjs` — without it the first state
rendered three times larger than its own siblings, because with no green ticks
in it there was less ink for the fitter to measure.

**Caption:**
> Every step tells you where you are in it, and how much of it you've already
> answered 📍
> The bar on the left follows whatever section is actually on your screen — no
> tapping, no scrolling back to the top to check. The ticks are the sections
> you've already said something about.
> It matters most on the way back. You read half a step on the bus, close the
> app, and open it again that evening: the list tells you which paragraphs are
> behind you and which one you stopped in the middle of.
> A contents list that only lists is a table of contents. This one is a record
> of what you did.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #studygram #universitylife #zambia

---

## ☀️ Midday — `2-midday/` · Logo plates — the icon

**Slides:** the icon tile → the icon rounded → the word reversed out of black →
the word running off the frame

`08-icon`, `09-icon-round`, `02-mark-dark`, `13-bleed` from
`2026-08-03 Monday/6-logo/`. Two light, two black — deliberately mixed, so the
set reads as a brand system rather than as a dark post.

**Caption:**
> The app icon is the name, and nothing else 🔲
> There's no glyph on it, no monogram, no clever little shape — the whole tile
> is the word, set in the same face the app is set in.
> That's the test a tab icon has to pass: it's 32 pixels wide on a phone, in a
> row of other tabs, and a mark that small stops being a shape and becomes a
> smudge. A word at that size is still a word.
> It's drawn from the font's own outlines rather than saved as a picture, so
> the tile, the header and the card a shared link turns into are all the same
> object at different sizes, sharp on anything.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #branding #logodesign #edtech #zambia

---

## 🌤️ Afternoon — `3-afternoon/` · The comment box, at three states

**Post title:** A note that already knows what it's about

**Slides:** empty, on the section you're reading → written in, on a different
section → carrying everything else you wrote in this step

One component, and it **gets taller down the carousel**, which is the argument
made without a word — the same shape the folders post used. Not grouped, unlike
the morning set: all three run the full width of the panel, so each measures the
same ink and scales identically on its own.

The two notes in the last slide are in the store the panel reads, in the store's
own shape. The panel renders them; nothing is typed into the page.

**Caption:**
> You can write on any section, and it already knows which one 📝
> The box binds itself to whatever section is on your screen and re-labels as
> you scroll — so there's no list to pick from and no wondering what a note is
> going to attach to. Write, save, carry on reading.
> Everything else you've written in that step sits underneath, and tapping one
> jumps you back to the paragraph it was about. Which is the actual use: not
> writing the note, finding it again three weeks later.
> It's on your device, which is the honest version — no account needed, works
> with no connection, and nobody else reads it.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #studytips #studygram #zambia

---

## 🌆 Evening — `4-evening/` · Logo plates — the name

**Slides:** the word bleeding off the frame → the word on the brand purple →
the full name reversed out of black → three esses, past the edge

`13-bleed`, `04-mark-purple`, `06-name-dark`, `12-macro-sss`.

This is the eighth and last of the sixteen plates built on 3 Aug. **The reserve
is now empty** — a thin day after this one needs `SLOT=<slot> node
_scripts/logo-variants.mjs` to build a fresh set, or a product component.

**Caption:**
> Three s's. Booklesss ✍️
> It's a study app for university students. Your courses in one place, in
> reading order, written so you can actually get through them — and the boring
> parts of studying counted for you: where you stopped, what you've covered,
> whether you kept it up this week.
> The name is the joke and the promise. No books to carry, nothing to print,
> nothing to lose the week before an exam.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #branding #edtech #studygram #zambia

---

## 🌙 Night — `5-night/` · The course tree's rings, at three degrees of clearing

**Post title:** The ring fills as you go

**Slides:** nothing opened → one step cleared and the next part way → the whole
folder cleared

**The same component as the 3 Aug morning post, on its second axis** — and that
is a shape this account has used before and which shipped: the `cards` block
went out on 2 Aug at three *kinds* and on 3 Aug at three *fill levels*. The
folders post was about the tree growing a level; this one is about the ring on
every step row.

Grouped, so the three register: same tree, same rows, same place, and the only
thing that moves is the rings. `w: 480` rather than the usual 752 — this is the
first **tall** subject the account has posted, and at the full height bound the
tree starts at y=330 and runs into the corner wordmark at 316.

**Caption:**
> Every step in the list carries a ring, and the ring is what you've actually
> answered 🟢
> Not what you opened. Not how far you scrolled. Each section of a step ends in
> one question — did that land? — and the ring fills as you answer them. Clear
> the whole step and it turns solid.
> So the list you navigate by is also the list that tells you where the gaps
> are. A half-drawn ring three folders back is a step you started on a bad
> evening and never finished, and you can see it from the top of the course.
> Nothing is locked and nothing is timed. It just refuses to pretend you've
> done something you haven't.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #studytips #universitylife #zambia

---

*Regenerate — the working tree is shared with another machine, so serve the app
from the pinned worktree:*
`git -C C:/bkls-shot checkout --detach 132673c`, `cd C:/bkls-shot/platform`,
`npm install`, `rm -rf .next`, `npx next build && npx next start -p 3101`, *then:*
`BASE_URL=http://localhost:3101 node _scripts/cap-0805.mjs`
*then* `POST=s-page|s-note|s-rings node _scripts/prog-post.mjs`.
*Whole-screen reference frames (not posted) come from* `cap-0805-ref.mjs`.
*The plates are copied from Monday's `6-logo/`.*
*No posting connector — upload manually.*

---

### Write-offs — what was shot or considered today and cannot go out

> **The ActionBar, one shape at four jobs.** Shot (`ab-*`), rendered
> (`POST=s-bar`, kept in `prog-post.mjs`) and rejected on looking at it. The bar
> is 336×34 css, so at the full width of the safe box it draws **80px in an
> 1100px stage** — a sliver on an empty gradient, which is exactly the failure
> rule 1 names. The two offline-card bars are worse: they sit in a two-column
> grid, so they arrive half as wide and blow up to twice the type size of the
> other two and the set stops reading as one component. The subject is real and
> the shots are good; it wants a frame built for a wide, short thing, or to be
> shown inside the card it belongs to.
>
> Worth keeping from it: the black variant now says **"Install the app"** rather
> than "Add to home screen" (owner's call today). The old label named the
> browser's menu item and read as bookmarking.

> **The source chips.** Killed before capture. Every chip is a site's real name
> and the sites are `Corporate Finance Institute`, `Treasury Today`,
> `treasury-management.com` — the relabel catches the first (it becomes
> "Business Law Institute") and the scan throws on the rest, correctly. There is
> no step in the mapped course carrying a neutral set. It is also a 24px chip
> row, so it would have hit the ActionBar's problem anyway.

> **`/settings`.** Not ours — it is the replica of somebody else's settings
> dialog that lives on its own route as a design reference, and it has "Emails
> from Claude Code" printed in it. Same class as `/workspace`.

> **The right drawer whole, and the course page.** Both are sections rather than
> components: the drawer holds the step ring, the contents list and the comment
> box, and the course page is a list of thirty rows. Rule 1.

> **The step used for reader shots had to change.** Yesterday's shots were taken
> on a step whose sections are its own headings — "Treasury as a cost centre" —
> which is fine for a 370×34 crop of the checkpoint row and fatal for a contents
> list. Today's are on the one course whose whole tree `MAP` covers, on a step
> whose sections are the generic set: Overview, Key ideas, In practice, Summary.
> That component names no syllabus before the relabel even runs.
