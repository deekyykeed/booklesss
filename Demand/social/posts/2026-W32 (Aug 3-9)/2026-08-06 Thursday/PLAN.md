# 2026-08-06 Thursday

9:16. Post each folder's images in order. **No CTA slide on anything** — the
call to action is the caption.

**There is a ship today, for the first time in three days: the front door.**
`55d4918` + `877e851` replaced a scrolling marketing page with one screen — the
owner's Framer design, then a morning of the owner's own calls on top of it
(the mark to the top, the pitch to the bottom, Bricolage on the headline, Rubik
dimmed on the subtitle, a two-layer shadow so white type survives a photograph,
the trusted-by faces cycling, and a 1px ring on the ◯B disc so it can travel).

The day's other two commits — `54eed5c` (onboarding hands the student back to
the page they came from) and `6941f02` (sign-in and sign-up rebuilt as the
onboarding page) — are the sign-up flow, and a sign-up flow is not a subject
(RULES.md rule 6) however much work went into it. The `ActionBar` gained a
genuinely new state in the same commit, ink sweeping across it as it submits,
and it is still 336×34 css: the 5 Aug write-off stands.

| Slot | Time (local) | Folder | Slides | What it is |
|------|------|-------|-------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 3 | **the front door**, at three moments of its own entrance |
| ☀️ Midday | ~11:00 | `2-midday/` | 3 | one stat tile, at three points in one student's history |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 3 | the course page's unit block, at three degrees of clearing |
| 🌆 Evening | ~19:00 | `4-evening/` | 4 | brand plates — the ◯B disc |
| 🌙 Night | ~21:30 | `5-night/` | 4 | brand plates — the name, in the front door's own face |

> ⚠️ **Shot from the clean worktree pinned to `877e851`** — today's HEAD.
> `git -C C:/bkls-shot checkout --detach 877e851`, `.next` cleared, `next dev`
> on :3101. No `npm install` needed: nothing in `package.json` moved since
> `132673c`, which is where the worktree was already pinned. `next dev` is
> enough today — nothing here needs a service worker.

> ⚠️ **Two plate slots, which is the ceiling — but not from the reserve.** All
> sixteen plates built on 3 Aug are spent. These eight are new, and they are
> new because a new brand object shipped this morning: the ◯B disc, with the
> 1px ring the owner asked for. `logo-variants.mjs` now vendors Burbank and
> takes a `PICK=` list so a slot is built as four chosen plates rather than
> sixteen written and then weeded.

---

## 🌅 Morning — `1-morning/` · The front door, arriving

**Post title:** It settles, then it asks

**Slides:** the page with everything but the button → the button on its way up
→ the door as a visitor leaves it

`plain()`, which nothing has used since 1 Aug and which is exactly right here:
the front door is the only screen in the app shaped like the frame. One
`min-h-dvh` screen with nothing under it, shot at 405×720, fills 1080×1920 with
no crop, no fade and no corner wordmark — the page carries the mark itself.

**The states are the page's own timing, frozen rather than raced.**
`document.getAnimations()` returns the live CSS animations and `currentTime` is
settable, so each frame is the real thing stopped at 800ms, 1500ms and settled.
Nothing is drawn and nothing is retouched. A ladder of twelve frames was shot
first (`cap-0806-ref.mjs`) and everything before ~700ms is mid-de-blur — those
read as an out-of-focus screenshot rather than as a designed moment, which is
what looking at the pictures before choosing is for.

The argument is the button. It arrives a full second after everything else,
which is the design's timing and not an accident: the page finishes settling,
*then* offers the tap.

> ⚠️ **THIS IS A DARK POST, AND IT IS THE FIRST.** The house rule is all light
> until the app ships a real dark mode (RULES.md, House style). The front door
> is genuinely black — obeying the rule here would mean not posting the thing
> that shipped. Flagging it rather than quietly breaking it: if the owner would
> rather this never happens, the rule wins and the front door goes out some
> other way.

**Caption:**
> The front door is one screen now 🚪
> It used to be a scrolling page — a headline, a sign-up box, three sections
> explaining the app to someone who hadn't opened it yet. All of that is gone.
> One photograph, the name, one sentence about what this is, and one thing to
> tap.
> Watch the order it arrives in. Everything lands inside a second, and then the
> page waits a full second before it offers you the button. It finishes
> settling before it asks you for anything.
> That second is the whole design.
> DM me "link" and I'll send you the whole thing. 👇

---

## ☀️ Midday — `2-midday/` · One tile, three points in one history

**Post title:** Does the number actually move?

**Slides:** a fortnight in, 45% on an erratic curve → a month in, 63% → six
weeks in, 77% on a settled one

**The tile has been posted twice and this is a different question**, which is
what rule 5 asks before a component goes out again. 2 Aug showed one tile at
four numbers; 4 Aug showed one tile at four measures. Both of those asked *what
does this tile count?* Neither asked the thing a student actually wants to know.

So: the same tile, the same measure, one reader at three points in their own
history. Every figure is the app's arithmetic on a real study log — the score,
the change on last week and the curve are all derived, so the only way to make
the number climb was to give the reader more of a history.

The **curve** is what carries it. The fortnight is jagged, with a visible week
where they stopped; six weeks in it is a slope. The shape of turning up says
more than the figure does.

**Caption:**
> A score you can't move is just a grade 📈
> This is the same tile, the same measure, and the same student — a fortnight
> in, a month in, and six weeks in.
> Look at the line more than the number. Early on it's all spikes: a good
> Tuesday, nothing for four days, a panic on Sunday. By week six it's a slope.
> Nothing about that student got smarter. They just stopped studying in bursts.
> Three quarters of what this measures is showing up. Only a quarter is how
> much of the course is finished — because the first one is the one you can
> change tomorrow.
> DM me "link" and I'll send you the whole thing. 👇

---

## 🌤️ Afternoon — `3-afternoon/` · A course, unit by unit

**Post title:** How much is actually left

**Slides:** a unit you're in the middle of, 9/15 → one you've finished, 3/3 →
one still ahead, 0/7

**Not the drawer tree from 5 Aug.** That is the navigation — where can I go from
here — in a 283px rail, and its argument was the ring on a step row. This is the
syllabus: a unit's name, the **count** beside it, and every step in it at full
width. The count is what the tree never had, and it is the point. A course is
units, and each one says how much of it is behind you without anybody adding
anything up.

**Not grouped, deliberately.** The three are 723, 171 and 355 css tall because
the units are fifteen, three and seven steps long, and the size difference *is*
the information — the same reasoning that kept the comment box ungrouped. All
three are 370 wide, so they already scale identically and the type is the same
size on every slide.

Led with the biggest rather than with the course's own reading order: a carousel
is judged on slide 1, and the three-step unit draws 220px of ink in an 1100px
stage. True to the component, weak as an opening.

**Caption:**
> "How much of this course is left?" should not be a hard question 📋
> Every course is split into units, and every unit carries its own count. Nine
> of fifteen. Three of three. None of seven yet.
> The ring beside each step is that step on its own — filled when you've
> answered everything in it, part-drawn when you stopped halfway, empty when you
> haven't opened it.
> Nothing here is a percentage of a percentage. It's a list of what you did and
> what you didn't, in the order you're meant to read it.
> DM me "link" and I'll send you the whole thing. 👇

---

## 🌆 Evening — `4-evening/` · The disc

**Post title:** A new mark, four ways

**Slides:** as it ships, on light → the cut → the letterform past the frame →
the mark as a surface

**Four different ideas, not one idea on four grounds** — the rule the 5 Aug
midday slot broke and the evening slot got right. Saying what each is for:

1. **`01-disc-light`** — the mark exactly as it ships, on the one ground where
   the new ring does anything. Black on black is invisible on the front door;
   the ring is for every white surface the mark is about to sit on.
2. **`02-disc-cut`** — the same letter twice: drawn, with its underline running
   on past the foot, and then after the circle has taken the ends off it. The
   mark's one real idea, shown instead of described.
3. **`03-disc-macro`** — Burbank's B and its bar, enlarged until they are
   texture. Not `11-macro-b` in another face: that one has no bar, and the bar
   is what makes this mark this mark.
4. **`04-disc-field`** — rows of discs at low contrast, so it reads as paper the
   brand is printed on rather than as a signature.

Every ratio is the app's, read off `page.tsx`: on a 50px disc the B is 40, its
line box is the disc's own height, the underline is 5px thick and offset 10. The
ring scales with the rest, because that is what scaling a logo means.

**Caption:**
> New mark 🖤
> A B on a black disc, with the underline running off the bottom of the circle
> so what's left is a bar with its ends cut by the curve. The second slide is
> that, before and after.
> It shipped this morning on the new front door, where it does something you
> can't see: a one-pixel black ring around the whole thing. Black on black
> against a dark photo — invisible. It's there for every white surface it's
> about to sit on, where without it the disc reads as a hole in the page.
> Details nobody notices are most of the job.
> DM me "link" and I'll send you the whole thing. 👇

---

## 🌙 Night — `5-night/` · The name

**Post title:** The long form, in the front door's face

**Slides:** the lockup → the word too big for the frame → the word as an
aperture → the lockup laid on its side

"Booklesss" is set in **Burbank** on `/` and in Familjen Grotesk everywhere
else, which makes this a different object from plates 05–07 rather than the same
one re-photographed. Four ideas again: the lockup as the door stacks it, the word
wider than the frame, the word cut out so the ground shows through, and the two
parts in a row instead of a stack — the arrangement a header needs and the front
door does not.

Two of the four are on ink and two on light, which is the mix RULES.md asks for
rather than four black plates.

**Caption:**
> Bklsss is the logo. Booklesss is the name 📛
> Three s's, and people still ask. So the long form gets set as carefully as the
> short one — same face the front door uses, same weight, same tight tracking.
> A logo you have to explain isn't finished. One somebody can spell after seeing
> it once is.
> DM me "link" and I'll send you the whole thing. 👇

---

## Written off today

- **The greeting, and the fact under it, at four states.** Shot (`hi-*`),
  rendered, and rejected on looking at it. The subject is real and the four
  states are genuinely different in kind — the line under the greeting has
  exactly four forms in `HomeView`, each derived from what the reader actually
  did: nothing yet, a streak going with today still open, studied today, and
  lapsed. None of them is encouragement; they are four facts the app can prove.
  **It is the wrong shape.** Grouped, the four share a 2898×591 box — 4.9:1,
  just inside rule 1's "past about 5:1 cannot carry a slide" and well over it in
  practice: at the full 748 it draws 153px in an 1100px stage and reads as a
  caption floating in an empty gradient. Kept in `prog-post.mjs` as `t-hello`,
  unposted, like `s-bar`. It wants a frame built for a wide short thing, or the
  greeting shown on the page it opens — a different post.
- **The `ActionBar`'s new busy state.** Ink sweeps across the bar as the form
  submits and the label inverts under the edge, which is a genuinely new and
  genuinely visual thing. It is still 336×34 css, so it is still a sliver in an
  1100px stage (5 Aug, `s-bar`), and the only place the state exists today is
  the sign-up form, which rule 6 rules out twice over.
- **`/workspace`.** Its own metadata says *"the sidebar is built; the board is
  not"* — rule 10, caught by the grep-for-a-plan check before anything was shot.

## New machinery

- **`cap-0806-ref.mjs`** — the entrance ladder. Freezing CSS animations with
  `getAnimations()` + `currentTime` gives an exact, repeatable frame of a page
  mid-motion, which is how the three door slides were chosen off pictures rather
  than off the keyframes.
- **`cap-0806.mjs`'s `isolate()` takes a LIST of selectors.** Two of today's
  subjects are not one element — the greeting is an `<h1>` and the `<p>` under
  it, siblings inside a container that also holds the whole dashboard, so
  neither the element nor `union` over its children gives the right box.
- **`ctxFor({ hour })` sets the page clock** with Playwright's `context.clock`,
  fixed to *today* at the given hour so the seed's own day keys still line up.
  `Math.random` is pinned in the same init script, so the greeting's random pick
  is stable across re-renders.
- **`logo-variants.mjs` takes `PICK=`** and vendors Burbank.
