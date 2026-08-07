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
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 3 | **one course card, three lives** — reading it, queued, finished |
| 🌆 Evening | ~19:00 | `4-evening/` | 4 | brand plates — **the disc, now that it is the app icon** |
| 🌙 Night | ~21:30 | `5-night/` | 4 | brand plates — **the wordmark**, and the two marks together |

> ⚠️ **Shot from the clean worktree `C:/bkls-shot`, pinned to `82115ae`** —
> which is the second pin of the day. The first was `5ac4d46`, and `82115ae`
> landed 40 minutes later fixing exactly the subject that was already shot: the
> faces were vanishing on tap and playing an `in-reveal` animation meant for an
> icon that is arriving. Both reader carousels were re-shot at the new pin.
> **The afternoon set is a third pin, `b1447d9`** — the pipeline card's truncated
> line was fixed before it was photographed, so that shot is of the fix.
> **Check `git log --oneline -1 -- platform/src/components/reader/` before
> posting** — this control has moved four times today alone.
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

## 🌤️ Afternoon — `3-afternoon/` · One card, three lives

**Post title:** A course on your timetable has three lives in here

**Slides:** reading it → waiting to be written → finished

What the tabs actually did today: gave the same `.course-card` shell three jobs.
The pipeline card is not a different component in disguise — same radius, same
border, same shadow, with every colour that would carry meaning dropped to a
muted token and the resume button's shape carrying a fact instead of an action.
Greyed rather than faded, deliberately: a blanket `opacity` would take the
border and the shadow with it and the card would read as broken rather than as
not-yet. What moves across the three is the resume button's fill, which IS the
progress bar — part filled, absent, full.

**Caption:**
> Your timetable has courses we haven't written yet. They're on your dashboard
> anyway 🛠️
> Same card, three states. One you're in the middle of. One nobody has written —
> greyed, no button, because there's nowhere for it to go, and instead of a
> made-up launch date it tells you how many others on your programme also listed
> it. That number is what decides the build order. One you've finished.
> I shot this to post it and found the queued card was cutting its own sentence
> in half on every phone. Fixed before this went out.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

> ⚠️ **THE FINISHED CARD DIFFERS FROM THE FIRST ONE BY THE FILL AND NOTHING
> ELSE.** It still says "Resume", still points at the first step, still shows a
> performance score rather than a completion, and its streak reads 0d. So slide
> 3 reads as "a course you haven't touched lately" about as easily as "a course
> you finished". That is a gap in the card, not in the crop, and rule 4 means no
> caption can close it. Worth settling before this set runs again.

---

## 🌆 Evening — `4-evening/` · The disc, as the icon

**Post title:** The mark had to survive being 16 pixels wide

**Slides:** every size it ships at → cut out of the ground → how it is built → big enough to be a surface

**Four ideas, not four grounds** — the 5 Aug lesson, applied before rendering
rather than after. Say what each is for: it survives every size it is asked
for / it works cut out of a ground as well as printed on one / here is how it is
made / it is big enough to stop being a signature. Three light, one dark, which
is the mix rule 5 asks for rather than four black plates.

The reason there is a plate slot at all today is `c5982ed`: the ◯B disc stopped
being a thing on the front door and became the actual favicon, apple-icon and
PWA manifest icon. Slide 1 is that commit as a picture — the real 512 : 180 : 64
: 32 : 16 ratios, scaled by one constant to fit the safe box, so the
relationship is the shipped one even though the absolute sizes cannot be.

**Caption:**
> The logo became the app icon today, which means it now has to work at 16
> pixels 🛠️
> That's the size of the little square in a browser tab. A drawing dies there. A
> letter and a bar under it doesn't — it just gets smaller, and you can still
> tell what it is. Same mark cut out of black, taken apart, and blown up until
> it's a surface instead of a signature.
> Install the app to your home screen and this is what lands there.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #branding #logodesign #productdesign #zambia

---

## 🌙 Night — `5-night/` · The wordmark

**Post title:** Two marks, one system

**Slides:** the two marks together → tracked out to a rule → cut in half → on its side

**THE SIXTEEN PLATES ALREADY BUILT ARE WHY THIS SET LOOKS LIKE THIS.** Three
obvious wordmark ideas were written today and thrown away before rendering,
because the reserve had them: the word repeated as a field is `15-field`, the
word cut out of a solid ground is `16-knockout`, and the word plain on the
gradient is `01-mark-light`. A five-letter wordmark runs out of easy angles
faster than it looks — **read the list before writing a new plate.**

Slide 1 is the one worth having: the disc beside "Bklsss", matched on cap
height. They have never appeared together. `24-lockup` and `27-lockup-row` pair
the disc with **Booklesss**, the full name in Burbank; this is the disc with the
**logo**, which is the thing every poster in this account is signed with.

**Caption:**
> Two marks, and until tonight they'd never been in the same picture 🛠️
> The disc is the app icon — it's what lands on your home screen. The word is
> what signs everything else. Same weight, same black, matched on the height of
> the capital, so they read as one system rather than two things a brand
> happens to own.
> Then the word tracked out until it's a rule, cut in half by the frame, and
> stood on its side.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #branding #logodesign #typography #zambia

---

## Notes on what did NOT go out

**1. Brand plates — the reserve is spent, twice over.** All sixteen from 3 Aug
went out on 4 and 5 Aug; all eight from 6 Aug went out on 6 Aug. A plate slot
today means building new plates, and there is a real reason to (`c5982ed` made
the disc the actual favicon, apple-icon and PWA icon). But yesterday's evening
AND night were both plates — disc, then the name — so a third and fourth disc
set running is the "two ideas, four slides" the owner sent back on 5 Aug.

**2. The tab row itself.** `370×35` css, which is 10.6:1. Rule 1's ceiling is
about 5:1, and the ActionBar write-up from 5 Aug is the same shape. Shot as
`try-tabs.png` so the measurement is on the record, not going out.

**3. Seven plates were written today and thrown away before rendering.** Four
because they repeated the reserve (`15-field`, `16-knockout`, `01-mark-light`,
`12-macro-sss` under new names), and three more that were four-grounds-not-four-
ideas. What went out is what survived that. The one plate that was killed on the
picture rather than on the idea is `38-bk-stamp` — the wordmark at its true 31px
corner size, alone in the frame. A neat thought and a nearly empty poster, which
is rule 8's "fill the box, don't float in it" from the other direction.

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
