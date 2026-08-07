# 2026-08-07 Friday

9:16. Post each folder's images in order. **No CTA slide on anything** — the
call to action is the caption.

**A fat ship day: seventeen commits, and the reader got most of them.** Tap-to-
define was switched off, callouts turned their mark sideways, steps can link to
each other, the section-note menu grew a mark per row, the courses list became
three tabs you can drag into order, the ◯B disc became the real app icon, and
the checkpoint's two answers became the owner's own drawings — twice, because
the first cut of the drawings had a bug in it.

The front door also moved five more times (`d3bd426` → `7baa120`). It went out
as yesterday's morning post and is not today's subject twice running. The
onboarding install prompt (`5770675`) is the sign-up flow, which rule 6 puts off
limits however good it is.

| Slot | Time (local) | Folder | Slides | What it is |
|------|------|-------|-------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 3 | **the two answers**, drawn — grey until you answer |
| ☀️ Midday | ~11:00 | `2-midday/` | 3 | **the menu at the other end of that row**, every option with its own mark |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | — | ⚠️ **open — needs a decision, see below** |
| 🌆 Evening | ~19:00 | `4-evening/` | — | ⚠️ **open** |
| 🌙 Night | ~21:30 | `5-night/` | — | ⚠️ **open** |

> ⚠️ **Shot from the clean worktree `C:/bkls-shot`, pinned to `82115ae`** —
> which is the second pin of the day. The first was `5ac4d46`, and `82115ae`
> landed 40 minutes later fixing exactly the subject that was already shot: the
> faces were vanishing on tap and playing an `in-reveal` animation meant for an
> icon that is arriving. Both carousels were re-shot at the new pin. **Check
> `git log --oneline -1 -- platform/src/components/reader/` before posting** —
> this control has moved four times today alone.
>
> `next dev` on :3101 is enough; nothing here needs a service worker.

---

## 🌅 Morning — `1-morning/` · The two answers

**Post title:** The two faces at the end of every section

**Slides:** nobody has answered → "Got it" → "Later"

The control shipped as MynaUI glyphs and went out on 2 Aug. This is not that
post: the marks are drawings now, from the owner's own files, and what they say
is said in **colour**. At rest both are the drawing with its fill stripped out —
a third file, not a CSS filter, because greyscale-and-fade dims the line work as
hard as the fill and the face just disappears. Answer, and that one face is in
its own colour. Colour arriving IS the answer landing.

**Caption:**
> Every section ends with two faces, and they're grey until you touch one 🛠️
> Tap the one that's true — got it, or come back to this later — and that face
> gets its colour. That's the whole interaction. It takes a second, it's the
> only thing the app asks you for, and it's what decides which sections get
> rewritten and what your revision list looks like next week.
> I redrew them three times today. The first pair faded out instead of losing
> their colour, and the second played the animation an icon uses when it
> *arrives*, so tapping made them vanish and rebuild themselves.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

> ⚠️ **THE ARTWORK IS 128×128 AND THAT SETS THE FRAMING.** The set was built
> twice. One button on its own is square, fills the stage properly and is the
> better poster — but 128px blown up to 620 is visibly soft, and a poster of a
> soft asset reads as a cheap asset. The pair (`grasp-*`, what is rendered) is
> 78×34 css, so it needs about a third of that enlargement and stays crisp, at
> the cost of sitting as a band in a tall frame. **Both sets are shot**;
> switching is three filenames in `f-faces` (`grasp-*` ↔ `face-*`, `w: 752` ↔
> `w: 620`). The real fix is the Lottie the app is already heading for
> (`82115ae`) — vector, so the frame can go as close as it likes.

---

## ☀️ Midday — `2-midday/` · The other question

**Post title:** Five ways to say a section didn't work

**Slides:** the five options → "Needs an example" chosen → "Something looks wrong" chosen

**A second axis on a component posted on 2 Aug**, and the axis is the marks.
That post was what the menu *is* — a second question at the end of a section,
about the writing rather than about the reader. Today each row grew its own
mark, line at rest and solid when it is the answer given, replacing a tick that
could only ever say the second of those in the slot where the first belonged.
Two rows are shown chosen rather than one, because with a single slide the mark
reads as a generic tick that moved; with two, the clipboard and the warning
triangle say it belongs to the row.

**Caption:**
> The other end of that row asks about me, not you 🛠️
> Clear. Hard to follow. Too long. Needs an example. Something looks wrong.
> Every one of them now carries its own mark, and the mark fills in when it's
> the thing you picked — so you can see what you said at a glance and change it.
> One tap, and it goes into the file that decides what gets rewritten next.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

---

## ⚠️ Afternoon, evening and night — OPEN, and why

Rule 5 says all five slots get filled and that an honest fifth post beats an
honest explanation of why there isn't one. Three are empty anyway, because the
three things that could have filled them each failed a rule rather than a taste
test, and **manufacturing a fourth is the one thing rule 5 forbids**. The
decision is the owner's; each of these is an hour or less once it is made.

**1. The course card's three lives — blocked by two real defects.**
The tabs are the day's other visible ship and the post writes itself: the same
`.course-card` shell doing three jobs — one you are reading, one nobody has
written yet, one you have finished. Shot, and neither of the two new states can
go out:

- **The pipeline card's one line truncates on every phone.** *"The more students
  taking it, the sooner it gets b…"* — `PipelineCard`'s foot is a `truncate`
  span at 370px and the fallback sentence does not fit at any mobile width. It
  is only the fallback because `/api/curriculum` genuinely returns
  `{"suggested":[],"known":[]}` — no student has listed a course yet, so the
  real number is honestly absent and this line is what every pipeline card in
  production is showing right now.
- **I could not get a completed course to register**, so the Completed tab was
  never photographed. Seeding every section of all 7 lessons of the short course
  left its card at 35%, and the card's percentage does not appear to be
  coverage: a course with **nothing** done also reads 65% (`fill-1-fresh.png`).
  Either the seed shape is wrong or that number is measuring something other
  than progress. **Worth a look independently of the post** — it is the biggest
  number on the card a student sees.

**2. Brand plates — the reserve is spent, twice over.** All sixteen from 3 Aug
went out on 4 and 5 Aug; all eight from 6 Aug went out on 6 Aug. A plate slot
today means building new plates, and there is a real reason to (`c5982ed` made
the disc the actual favicon, apple-icon and PWA icon). But yesterday's evening
AND night were both plates — disc, then the name — so a third and fourth disc
set running is the "two ideas, four slides" the owner sent back on 5 Aug.

**3. The tab row itself.** `370×35` css, which is 10.6:1. Rule 1's ceiling is
about 5:1, and the ActionBar write-up from 5 Aug is the same shape. Shot as
`try-tabs.png` so the measurement is on the record, not going out.

**The cheapest honest fills, in order:** fix the pipeline card's foot line (a
shorter string, or `line-clamp-2` instead of `truncate`) and the three-lives
post is back, worth two slots on its own → or build four genuinely new plates on
a treatment neither of yesterday's slots used.

---

## Findings worth keeping (both already written into RULES.md)

- **`Math.random = () => 0.42` in an init script stops every React tap landing.**
  Copied from `cap-0806.mjs`, where it pins the greeting's line and nothing is
  clicked. With it in place a checkpoint tap silently does nothing — no error,
  no timeout, and a screenshot that is a perfect picture of the wrong state.
  Cost two full runs before the `expect:` assert caught it.
- **Relabel AFTER every interaction, never before.** `transform` rewrites text
  nodes in place and React does not know; the next state change reconciles
  against a tree it no longer owns. Same silent failure. `raw()` in
  `cap-0807.mjs` is the fix — navigate, interact, then relabel at the shutter.
- **Three pipeline course titles are now mapped in `neutralize.mjs`.** A
  pipeline card prints a course off a real programme, and no banned word is in
  any of them, so the scan cannot catch it. Changing the capture's seed without
  adding rows there ships a real university course name.
