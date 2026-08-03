# 2026-08-03 Monday

9:16, all light. Post each folder's images in order (`01 → 04/05`).

**The day the list stopped being a list.** Nine steps became eighteen on Sunday
and nothing was added to hold them, so a lesson rendered as six equal rows with
nothing saying which belonged together. Today every course's navigation grew a
level of folders, every step's name was made to match the row you tap to reach
it, the card marks learned a second and third question, and the logo lost its
glyph across the header, the tab icon and the card a shared link unfurls into.

**Mostly one component per carousel**, in the states a reader puts it through —
captured as an element with a transparent background and set squarely on the
brand gradient, the way 2 Aug settled it. **Midday is the exception, and it has
to be:** its claim is that two *different* screens now say the same word, and no
single component can carry that. Those two slides are whole-screen crops with
copy over them.

**The call to action is a DM.** Every carousel closes on "DM me 'link'".

| Slot | Time (local) | Folder | Slides | What it is |
|------|------|-------|-------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 4 | the navigation, at three depths |
| ☀️ Midday | ~11:00 | `2-midday/` | 5 | the row you tap, and the page you land on |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 4 | one card, three fill levels |
| 🌆 Evening | ~19:00 | `4-evening/` | 4 | the share control, and the card it makes |
| 🌙 Night | ~21:30 | `5-night/` | 5 | the logo, as the logo |

**Every shot is the real app, relabelled to a neutral curriculum.** No course
name, school name or code appears anywhere; the capture scans the exact crop
before writing each PNG.

> **The nav is relabelled by POSITION today, not by the shared string map.** The
> new folders introduced a folder and a step inside it *both* labelled the same
> thing, and one string cannot map to two different neutral names — a parent and
> its child reading alike would have flattened the tree in the one photograph
> that is about the tree having levels. `NAV_MATHS` / `NAV_CS` in `cap-0803.mjs`
> are the neutral curriculum in nav order; the row order is stable because every
> row stays mounted whether its folder is open or shut.

The seeded reader is about a month in: a live streak, two courses under way, a
few sections answered weakly, nothing finished.

> ⚠️ **Shot from a clean worktree pinned to `07b5255`, not from the working
> tree.** The other machine on this OneDrive folder committed **six times** while
> these were being made, and at one point deleted a file mid-run. Check
> `git log` before posting; the app has moved on since.

---

### 🌅 Morning — `1-morning/` · The navigation, at three depths
**Post title:** A list of eighteen things is not a list

**Slides:** the course, shut → a lesson, opened → one level further in → DM

**Caption:**
> Splitting the long steps in half doubled how many there were 🛠️
> Which was right — nobody reads a five-part step in one sitting — and it left
> the sidebar showing six equal rows with nothing saying which two belonged
> together.
> So the lessons grew folders today. Same steps, same order, nothing cut. You
> just don't have to hold the whole list in your head to find one thing in it.
> It cost every grouped step its address, because a folder adds a piece to the
> URL. Worth doing now, while no link has gone out yet.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #uidesign #studytok #zambia

---

### ☀️ Midday — `2-midday/` · The row you tap, and the page you land on
**Post title:** You tapped one name and got another

**Slides:** the problem → what you press → where you land → the check that
enforces it → DM

**Caption:**
> Every step in the reader had two names, and nobody had checked they matched 🛠️
> One name is what you tap — the sidebar row, the search result, the browser tab,
> the card that shows up when someone shares the link. The other is the heading
> at the top of the page.
> When they drift you press "The yield curve", land on "The term structure of
> interest rates", and have no way to tell you opened the right thing. The owner
> found it by reading the app, not by any check that ran.
> Sixty-odd steps, two names each, written by hand. A rule nobody can keep by eye
> is a rule that needs a machine, so it got one.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

---

### 🌤️ Afternoon — `3-afternoon/` · One card, three fill levels
**Post title:** The marks could only ask one question

**Slides:** run it tight → somewhere in between → keep the tank full → DM

**Caption:**
> A three-column table on a phone is the worst thing on the page 🛠️
> The last column wraps one word per line and still clips. So sets of three get
> cards instead — but a card needs a mark, and until this morning the set of
> marks drew exactly one question: how far ahead is this?
> Which meant 37 tables that weren't about time had to stay tables.
> Today the marks learned two more questions. This set is about how much slack
> you leave yourself: one object at three charges, filling in the card's own
> colour, and the first one draws no fill at all — which is the point.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #uidesign #studygram #zambia

---

### 🌆 Evening — `4-evening/` · One button, and the card it makes
**Post title:** There is one place sharing can go wrong

**Slides:** the button → pressed → what arrives in the chat → DM

**Caption:**
> One share button in the whole app, and it shares whatever page you're on 🛠️
> The dashboard shares the app, a course page shares that course, a step shares
> that step. On a phone it hands the link to your own share sheet; where there
> isn't one it copies, and says so in place instead of throwing a message at you.
> Third slide is what lands in the group chat. Generated at build, one per course
> and per step, under 600KB because above that WhatsApp drops the picture and
> nobody ever finds out why.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #uidesign #whatsapp #zambia

---

### 🌙 Night — `5-night/` · The logo, as the logo (`POST=brand`)
**Post title:** New logo. Same three s's.

**Slides:** the announcement → the wordmark → the app icon → why it changed → DM

**The only carousel here not shot from the app.** Its subject is a brand asset,
so slides 2 and 3 are the shipped files out of `Brand/` — the wordmark and the
icon, placed on the gradient at 700 and 720px. They can go that big because
both are generated from the font's own outlines and have no resolution to run
out of.

Both logo slides **suppress the corner wordmark** (`wordmark: false`, added to
`object()` today). The mark at 31px in the corner over the same mark at 700px in
the middle is one word twice on one slide, and it reads as a mistake rather than
a lockup — the same call `og.tsx` makes on the home card.

**The retired lockup is deliberately not shown.** It only ever existed at
239×62, so any slide big enough to read it would be a blurry enlargement, and
that lands as poor craft rather than as the point. The caption carries the
before; the slides carry the after.

**Caption:**
> The logo had a glyph this morning. It doesn't now 🛠️
> A folded square, 32 pixels wide in a browser tab. At that size nobody read it
> as a shape — it arrived as a dark speck in front of the name, and the eye went
> straight past it to the word.
> A mark that has to be enlarged before it's legible isn't doing a mark's job,
> and at tab size there's nowhere to enlarge it to. So the word is the whole
> logo now — header, tab, app icon, and the card a shared link turns into.
> It's drawn from the font's own outlines rather than saved as a picture, which
> means it's sharp at any size, on anything, forever. The old one wasn't: it
> lived at 239 pixels wide and turned to mush the moment you needed it bigger.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #branding #logodesign #edtech #zambia

> **Supersedes `d-word`**, which held this slot with the same story told from
> the app's chrome — the favicon tile, shot from a browser. A logo post is
> better made of the logo than of a screenshot containing it. `d-word` stays in
> `prog-post.mjs` unrendered, for the reason `searchCTA()` stays.

---

### 🎨 Brand plates — `6-logo/` · 16 stills, no slot

**Not a carousel and not tied to a time.** Sixteen standalone 9:16 posters that
are nothing but the logo — post them singly whenever there's a gap, or pick four
and run them as a set. `node _scripts/logo-variants.mjs`.

**No text on any of them** (owner, 2026-08-03: *"i dont add text like this
anymore — dont add any text"*). No headline, no eyebrow, no corner stamp, no
CTA slide. **The CTA lives in the caption** — that is the one place words still
belong, and it is where every one of these should carry *DM me "link"*.

| | Plate | |
|---|---|---|
| 01–04 | `mark-light` `mark-dark` `mark-cream` `mark-purple` | the logo on each ground it's allowed |
| 05–06 | `name-light` `name-dark` | the name in full |
| 07 | `both` | the two forms stacked, optically matched |
| 08–09 | `icon` `icon-round` | the app icon, square and rounded |
| 10 | `outline` | the wordmark as its own edge |
| 11–12 | `macro-b` `macro-sss` | letterforms past the frame — texture, not a word |
| 13 | `bleed` | wider than the frame, cropped by it |
| 14 | `vertical` | one letter per line |
| 15 | `field` | the mark repeated, low contrast — brand paper |
| 16 | `knockout` | the word cut out of black, gradient showing through |

The safe box is enforced on everything meant to be *read*; 11, 12, 13 and 15 opt
out, because a letterform enlarged past the frame has nothing to keep clear of a
share button.

---

*Regenerate — the working tree is shared with another machine, so serve the app
from a pinned worktree:*
`git worktree add --detach C:/bkls-shot 07b5255`, `rm -rf platform/.next`,
`npx next dev -p 3101`, *then:*
`BASE_URL=http://localhost:3101 node _scripts/cap-0803.mjs`
*then* `POST=d-tree|d-name|d-cards|d-link|brand node _scripts/prog-post.mjs`.
*`brand` needs no capture and no dev server — its images come from `Brand/`,
copied into `_source/feature-capture/` as `brand-wordmark.png` / `brand-icon.png`.*
*All default to today's date. No posting connector — upload manually.*

> **Held back.** `g-header.png` — the app header's own lockup — is captured and
> unused. It is the word in black on a light ground, which is exactly what the
> poster's corner stamp is, so the slide came back reading as the stamp printed
> twice at two sizes. The tab tile makes the same point and cannot be confused
> with it.

> **Not made.** Study music shipped into the sidebar at 10:39 and came out again
> at 10:55 — the embed only plays 30-second previews unless the listener is
> signed in to Spotify, which is not a thing to ship to students on mobile data.
> It was the most honest build-in-public story of the day and there is no post
> about it: the owner removed the feature, and photographing it would have meant
> either putting the files back into a working tree another machine is committing
> to, or filling a slide with somebody else's player.
