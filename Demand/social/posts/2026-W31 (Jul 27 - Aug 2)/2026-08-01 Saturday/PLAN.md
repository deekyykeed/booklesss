# 2026-08-01 Saturday

9:16, all light. Post each folder's images in order (`01 → 05`).

**No copy on any slide today** (owner's call). Every image is the app itself —
an area of the interface, enlarged to fill the frame, nothing written over it,
no wordmark. The story lives in the caption instead, where somebody reads it
while already looking at the screen. Each carousel still closes on the Google
search slide, which is the only text in the day.

Five slots, five parts of the app, and no crop used twice: the reading page,
the question that ends a section, the home page, the course around the step,
and the form that asks who is reading.

| Slot | Time (local) | Folder | Slides | What it shows |
|------|------|-------|-------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 5 | the page you actually read on |
| ☀️ Midday | ~11:00 | `2-midday/` | 4 | the question at the end of a section |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 5 | where you stand, in four numbers |
| 🌆 Evening | ~19:00 | `4-evening/` | 4 | the course, and the way around it |
| 🌙 Night | ~21:30 | `5-night/` | 4 | the first thing the app asks anybody |

**Every shot is the real app, relabelled to a neutral curriculum.** No course
name, no school name, no course code appears in any slide or any caption — the
capture script scans the exact crop and refuses to write a PNG with a banned
word in it. That check matters more today than on a copy day: with nothing
written over the screenshot, the screenshot is the whole post.

The seeded reader is someone about a month in — 26 sections answered, a 3-day
streak, 2h40 read this week, two courses on the go. The step the reader shots
are taken on was finished by clicking the answers in the browser, so the "2
you'd want another pass at" in the closer is the app's own arithmetic.

The university step of the sign-up form is deliberately **not** photographed:
every option on it is a real school, and naming one is the thing these posts
never do.

---

### 🌅 Morning — `1-morning/` · The page you read on
**Post title:** This is the whole thing

**Slides:** the top of a step → key ideas → in practice → summary → search CTA

**Caption:**
> No pitch today 🛠️ — just the app.
> This is what a step looks like on a phone: the big idea first, then the
> details, in short sections you can finish standing up. No PDF, no 900-page
> textbook, nothing to download.
> Swipe through and tell me what you'd change.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #studytok #studygram #zambia

---

### ☀️ Midday — `2-midday/` · Did that land?
**Post title:** Every section ends the same way

**Slides:** the question, unanswered → the same question, answered → step
complete → search CTA

**Caption:**
> Every section ends with one question: did that land? 🛠️
> Three answers, one tap — Not yet, Almost, Got it. Press the one that's true;
> press it again to take it back.
> Finish the step and it counts them up, including the ones you said you'd
> want another pass at. A tick only ever proved you scrolled past something.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #studytok #zambia

---

### 🌤️ Afternoon — `3-afternoon/` · Where you stand
**Post title:** Four numbers, no guessing

**Slides:** the greeting → the four tiles → the tiles, close in → your courses
→ search CTA

**Caption:**
> Open it and it tells you where you are 🛠️
> Days in a row, time read this week, how much of your courses you've covered,
> and a score that's two-thirds effort — so turning up moves it and finishing
> never costs you.
> Each one carries its own fortnight of history behind the number.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #studytok #studygram #zambia

---

### 🌆 Evening — `4-evening/` · The whole course, in order
**Post title:** Everything, in reading order

**Slides:** the course page → its steps → the drawer → search CTA

**Caption:**
> Every course has a page that says what it is, what's in it, and where you
> stopped 🛠️
> Under that, every step in reading order with a ring showing how far through
> each one you got. And the drawer gets you anywhere in the subject from any
> page, in one tap.
> Nothing is locked. Nothing is timed.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #uidesign #studytok #zambia

---

### 🌙 Night — `5-night/` · Who's reading?
**Post title:** No email, no password

**Slides:** pick a face → your name → what you're taking → search CTA

**Caption:**
> The app asks four things, and an email address isn't one of them 🛠️
> Pick a face, tell it what to call you, say what you're taking — and your
> dashboard shows those courses and nothing else. It stays on your device.
> Shipped this week. Nobody should have to make an account to read a page.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

---

*Regenerate: start the dev server (`cd platform && npx next dev -p 3100`), then*
`node _scripts/cap-0801.mjs` *for the shots, then*
`POST=a-read|a-answer|a-home|a-course|a-who node _scripts/prog-post.mjs`.
*All default to today's date. No posting connector — upload manually.*

> **Note for the next run.** These shots were taken from a clean worktree of
> the repo (`git worktree add C:/bkls-shot <commit>`, `npm ci`, dev on 3101),
> because a parallel session was mid-refactor in the working tree and the app
> would not render. If the app is broken when you come to capture, check
> `git status` before debugging it.
