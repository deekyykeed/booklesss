# 2026-08-02 Sunday

9:16, all light. Post each folder's images in order (`01 → 04/05`).

**One component per carousel, and nothing else in the frame.**

Each post is a single control or card in three or four **scenarios** — the same
thing, in the states a reader puts it through — rather than a tour of different
parts of the app. Every slide is that component **on its own**: captured as an
element with a transparent background, floated on the brand gradient, and
turned slightly in perspective so it sits in space rather than lying flat.

Nothing around it. No page, no neighbour, no crop rectangle. (The first pass
today cropped tight boxes around components, which still photographed whatever
was next to them — a rectangle around a stat tile is a picture of a grid.)

**The call to action is a DM.** The Google search slide is retired: search asked
for two steps before anyone reached anything, the second on a results page we
don't control. Every carousel closes on "DM me 'link'".

| Slot | Time (local) | Folder | Slides | The component |
|------|------|-------|-------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 4 | the two answers at the end of a section |
| ☀️ Midday | ~11:00 | `2-midday/` | 4 | the button that asks how the writing read |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 5 | one stat tile, four numbers |
| 🌆 Evening | ~19:00 | `4-evening/` | 4 | one card, three kinds |
| 🌙 Night | ~21:30 | `5-night/` | 4 | tap a word, get it defined |

**Every component is the real app, relabelled to a neutral curriculum.** No
course name, school name or code appears anywhere; the capture scans the
component before writing the PNG. Isolation makes that easier — a button's own
box has no prose in it. The two exceptions are the card and the definition
popup, whose text *is* their slide, so both carry placeholder copy: the card
set is about how to work through a lesson, the definitions are first-year
algebra. The component, its marks, its tones and its rules are the real thing;
only the words are stand-ins.

The seeded reader is someone about a month in — a 3-day streak, 2h40 this week,
70% performance, two courses on the go. The answered states were produced by
clicking in the browser, so what the marks show is the app's own.

> ⚠️ **Shot from a clean worktree at `be15946`, not from the working tree.** A
> parallel session was mid-refactor in the same folder — and it changed the
> checkpoint marks *while these were being made*. What is shot here is what is
> on `main`.

---

### 🌅 Morning — `1-morning/` · The two answers
**Post title:** One tap, and the section is decided

**Slides:** both marks, untouched → thumb up, chosen → thumb down, chosen → DM

**Caption:**
> Every section ends with two marks and no words 🛠️
> Press one. It fills in and takes its colour, the other fades back but stays
> there, and pressing the one you already picked takes it back.
> This control has been redrawn three times in a day. It started as three
> self-ratings — Not yet, Almost, Got it — and grading yourself gives you
> nothing to do about the grade. Then two decisions with words. Then two marks
> without them. It's a thumbs pair now, because that's the one thing nobody has
> to learn.
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

### 🌙 Night — `5-night/` · Tap the word
**Post title:** The definition costs one tap, and only if you need it

**Slides:** the word, ruled → what it opens → another one → DM

**Caption:**
> A word you don't know shouldn't stop the sentence 🛠️
> Anything with a rule under it can be tapped, and the meaning comes up beside
> it. Tap away and it's gone.
> The reason it isn't just brackets in the text: a definition in brackets is
> read by everyone, including the person who already knew the word, and it
> breaks the sentence for them every single time. A tap is only paid for by the
> reader who needs it.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

---

*Regenerate: the app must be served from a clean checkout if another session is
working the tree —* `git worktree add --detach C:/bkls-shot <commit>`, *dev on
3101, then:*
`BASE_URL=http://localhost:3101 node _scripts/cap-0802.mjs`
*then* `POST=c-marks|c-note|c-tiles|c-cards|c-term node _scripts/prog-post.mjs`.
*All default to today's date. No posting connector — upload manually.*

> **Note for the next run.** Yesterday's midday caption describes the checkpoint
> as three answers — "Not yet, Almost, Got it". That stopped being true at 20:23
> on 1 Aug and has since changed twice more. If Saturday's carousel has not gone
> out, the caption needs correcting first.
