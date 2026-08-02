# 2026-08-02 Sunday

9:16, all light. Post each folder's images in order (`01 → 04/05`).

**Two things changed today, both the owner's call.**

1. **One component per slide, not one page.** Yesterday every slide was an
   area of the app — a panel with its prose, a screen with its heading. Today
   each slide is a single control, card set or tile, cropped to its own edges
   and enlarged: 2.8× for a row that spans the reading column, 9× for a 28px
   mark. It suits what actually shipped — nothing changed shape at page level
   yesterday evening, four things changed at component level.
2. **The call to action is a DM. The Google slide is retired.** Search asked
   for two steps before anyone reached anything, the second of them on a
   results page we don't control. A DM is one step and it lands in a thread
   where the link can actually be sent. Every carousel now closes on
   `dmCTA()` — "DM me 'link'", a composer, and "No search, no sign-up."

Still no copy on the shots themselves. The caption carries the story.

| Slot | Time (local) | Folder | Slides | What it shows |
|------|------|-------|-------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 4 | the two marks that end a section, in three states |
| ☀️ Midday | ~11:00 | `2-midday/` | 4 | the button that asks how the writing read |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 5 | four numbers, one tile at a time |
| 🌆 Evening | ~19:00 | `4-evening/` | 5 | three kinds as three cards, and the marks on them |
| 🌙 Night | — | — | — | **deliberately empty — see below** |

**Four slots, not five.** The fifth honest angle today would have been the
shadow scale — two tokens replacing a wide blurred layer that read as a grey
band on a phone. It is real work and it is why the cards and chips sit on the
page properly now, but "we made the shadows smaller" is a craft note, not
something a student can see. Padding a slot with it would have cost more than
the empty slot does.

**Every shot is the real app, relabelled to a neutral curriculum.** No course
name, school name or course code appears in any slide or caption; the capture
script scans the exact crop and refuses to write a PNG with a banned word in
it. The card set is the one place the relabelling reaches body copy rather than
labels — its three cards are the subject of the evening slide, so they have to
be legible *and* neutral, and they now carry placeholder copy about how to work
through a lesson. The component, its marks, its tones and its rules are the
real thing; only the words are stand-ins.

The seeded reader is someone about a month in — a 3-day streak, 2h40 this week,
70% performance, two courses on the go. The answers in the morning carousel
were clicked in the browser, so the states shown are the app's own.

---

### 🌅 Morning — `1-morning/` · What a section asks you to decide
**Post title:** Two marks, one decision

**Slides:** the row, untouched → marked to come back to → marked done → DM

**Caption:**
> Every section ends with two marks and no words 🛠️
> A bookmark: come back to this. A tick: done, move on. Press one and it
> fills in and takes its colour; the other fades back but stays there, because
> you're allowed to change your mind.
> It used to ask you to grade yourself — Not yet, Almost, Got it. Grading
> yourself doesn't give you anything to do about the grade. A decision does.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #studytok #studygram #zambia

---

### ☀️ Midday — `2-midday/` · The other question
**Post title:** Not "did you get it" — "was it any good"

**Slides:** the button → the menu → answered → DM

**Caption:**
> The mark at the far end of the row asks about me, not you 🛠️
> Hard to follow. Too long. Needs an example. Something looks wrong. Clear.
> One tap, and it goes straight into the file that decides what gets rewritten
> next.
> It got its dots today so it stops looking like a decoration, and its menu
> got moved: it was opening 66px off the left edge of a phone with three of its
> five options cut in half. Nobody reported that. I only saw it by reading the
> app on an actual phone.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

---

### 🌤️ Afternoon — `3-afternoon/` · Four numbers
**Post title:** One tile at a time

**Slides:** performance → coverage → streak → time this week → DM

**Caption:**
> Open it and four tiles tell you where you are 🛠️
> How you're scoring, how much of your courses you've covered, how many days
> in a row, and how long you've actually read this week. Each one carries a
> fortnight of its own history behind the number, so you can see the shape and
> not just today.
> They got their marks back today, each one shaded out of its own tile's
> colour. Small thing. The page had been reading flat without them.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #uidesign #studytok #zambia

---

### 🌆 Evening — `4-evening/` · Three kinds want three cards
**Post title:** The table had nothing to line up

**Slides:** the three cards → each of their three marks → DM

**Caption:**
> This was a three-column table until last night 🛠️
> On a phone it was the worst thing on the page — the last column wrapped one
> word per line and still clipped, so a two-word phrase came out as one word
> and a half. A table is for things that line up. Three kinds of something
> don't line up, they just sit next to each other.
> So each one got its own card, its own hand-drawn mark, and one closing line
> saying when you'd use it. Same content. Nothing cut.
> DM me "link" and I'll send you the whole thing. 👇
> #buildinpublic #edtech #uidesign #studygram #zambia

---

*Regenerate: start the dev server (`cd platform && npx next dev -p 3100`), then*
`node _scripts/cap-0802.mjs` *for the shots, then*
`POST=b-marks|b-note|b-tiles|b-cards node _scripts/prog-post.mjs`.
*All default to today's date. No posting connector — upload manually.*

> **Note for the next run.** Yesterday's midday caption describes the
> checkpoint as three answers — "Not yet, Almost, Got it". It became two
> ("Later", "Got it") at 20:23 on 1 Aug, *after* those shots were taken. If
> Saturday's carousel has not gone out yet, that caption needs correcting
> before it does.
