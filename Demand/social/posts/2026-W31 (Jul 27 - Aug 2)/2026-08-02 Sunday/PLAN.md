# 2026-08-02 Sunday

9:16, all light. Post each folder's images in order (`01 → 04/05`).

**One component per carousel, isolated, straight on.**

Each post is a single control or card in three or four **scenarios** — the same
thing in the states a reader puts it through — rather than a tour of different
parts of the app. Every slide is that component **on its own**: captured as an
element with a transparent background, set on the brand gradient, and given a
shadow that traces its own outline.

Nothing around it. No page, no neighbour, no crop rectangle.

**No skew.** These were turned in perspective first and it was wrong: the app is
flat vector UI with hairline borders and 1px rules, and rotating that puts every
one of those lines through a resampler — the card stops looking like a card and
starts looking like a photograph of a screen at an angle. Depth comes from the
shadow and the space around it. Everything sits square.

**The call to action is a DM.** The Google search slide is retired: search asked
for two steps before anyone reached anything, the second on a results page we
don't control. Every carousel closes on "DM me 'link'".

| Slot | Time (local) | Folder | Slides | The component |
|------|------|-------|-------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 4 | the two answers at the end of a section |
| ☀️ Midday | ~11:00 | `2-midday/` | 4 | the button that asks how the writing read |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 5 | one stat tile, four numbers |
| 🌆 Evening | ~19:00 | `4-evening/` | 4 | one card, three kinds |
| 🌙 Night | ~21:30 | `5-night/` | 4 | one course card, three courses |

**Every component is the real app, relabelled to a neutral curriculum.** No
course name, school name or code appears anywhere; the capture scans the
component before writing the PNG, and it earned its keep today — it refused a
card shot whose selector had drifted onto the wrong element and caught the leak
before it could be written. Two components carry placeholder copy because their
text *is* their slide: the three kinds read as plan / practise / review, and the
course cards as ordinary first-year subjects. Marks, tones, rules, sparklines
and progress fills are all the real thing.

The seeded reader is about a month in: a 3-day streak, 2h40 this week, 70%
performance, two courses under way and a third signed up to and never opened.
The answered states were produced by clicking in the browser.

> ⚠️ **Shot from a clean worktree at `9f6b997`, not from the working tree.** A
> parallel session worked the same folder all day. The checkpoint answers were
> redrawn **four times** while these were being made — three self-ratings, then
> a bookmark and a tick, then thumbs, then faces — so anything shot earlier is
> already wrong. What is here is `9f6b997`. **Check `git log` before posting**;
> if that control has moved again, the morning carousel needs re-shooting.

---

### 🌅 Morning — `1-morning/` · The two answers
**Post title:** One tap, and the section is decided

**Slides:** both marks, untouched → the green face, chosen → the amber one → DM

**Caption:**
> Every section ends with two faces and no words 🛠️
> Press one. It fills in and takes its colour, the other fades back but stays
> there, and pressing the one you already chose takes it back.
> This control has been redrawn four times in a day. It started as three
> self-ratings — Not yet, Almost, Got it — and grading yourself gives you
> nothing to do about the grade. Then two decisions with words on them. Then two
> marks without. It's a pair of faces now, because that's the one thing nobody
> has to learn.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #uidesign #studytok #zambia

---

### ☀️ Midday — `2-midday/` · The other question
**Post title:** Not "did you get it" — "was that any good"

**Slides:** the button → the menu it opens → answered → DM

**Caption:**
> The mark at the other end of the row asks about me, not you 🛠️
> Clear. Hard to follow. Too long. Needs an example. Something looks wrong.
> One tap, and it goes into the file that decides what gets rewritten next.
> It got its dots today so it stops reading as decoration, and its menu got
> moved: it was opening 66px off the left edge of a phone, three of its five
> options cut in half. Nobody reported that. I saw it by reading the app on an
> actual phone.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

---

### 🌤️ Afternoon — `3-afternoon/` · One tile, four numbers
**Post title:** The same card, asked four things

**Slides:** performance → coverage → streak → time this week → DM

**Caption:**
> Four tiles tell you where you are, and they're all the same tile 🛠️
> How you're scoring, how much you've covered, how many days in a row, how long
> you actually read this week. Each carries a fortnight of its own history
> behind the number, so you see the shape and not just today.
> They got their marks back today, each shaded out of its own tile's colour.
> Small thing. The page had been reading flat without them.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #uidesign #dataviz #zambia

---

### 🌆 Evening — `4-evening/` · One card, three kinds
**Post title:** The table had nothing to line up

**Slides:** plan → practise → review → DM

**Caption:**
> This was a three-column table until last night 🛠️
> On a phone it was the worst thing on the page — the last column wrapped one
> word per line and still clipped, so a two-word phrase came out as one and a
> half. A table is for things that line up. Three kinds of something don't line
> up, they just sit next to each other.
> So each one got its own card, its own hand-drawn mark, and a closing line
> saying when you'd use it. Same content. Nothing cut.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #uidesign #studygram #zambia

---

### 🌙 Night — `5-night/` · One course card, three courses
**Post title:** The button is the progress bar

**Slides:** months in → just begun → never opened → DM

**Caption:**
> The busiest thing I've built, and it's one card 🛠️
> A streak. Your score. A fortnight of your own reading drawn behind the text in
> that course's colour. And one button, which does two jobs: it says the exact
> step you'd go back to, and its fill is how far through you are. No separate
> progress bar, because the thing you press and the thing that measures you may
> as well be the same object.
> Third slide is a course signed up to and never opened. 0%, no streak, and it
> says Start instead of Resume. That's most people, most of the time, and the
> card shouldn't pretend otherwise.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #uidesign #studygram #zambia

---

*Regenerate: serve the app from a clean checkout when another session is working
the tree —* `git worktree add --detach C:/bkls-shot <commit>`, `rm -rf
platform/.next`, *dev on 3101, then:*
`BASE_URL=http://localhost:3101 node _scripts/cap-0802.mjs`
*then* `POST=c-marks|c-note|c-tiles|c-cards|c-course node _scripts/prog-post.mjs`.
*All default to today's date. No posting connector — upload manually.*

> **Held back.** The tap-to-define popup is shot and configured (`POST=c-term`)
> but not used today — three near-identical white cards of body text is the
> dullest thing the app owns. It wants a slot where the *word* can be shown in
> its sentence.

> **Note for the next run.** Yesterday's midday caption describes the checkpoint
> as three answers — "Not yet, Almost, Got it". That stopped being true at 20:23
> on 1 Aug and has changed three times since. If Saturday's carousel has not
> gone out, fix the caption first.
