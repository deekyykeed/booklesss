# 2026-07-30 Thursday

9:16, all light. Post each folder's images in order (`01 → 06`).

**Cadence changed today: five slots a day, every day.** The calendar holds the
five reminders; this file holds what goes in them.

Today's ship was one thing, not five: **the home page was rebuilt around
measuring the studying.** The chart became a rolling seven-day plot, the four
stat tiles were rebuilt around what actually changes a decision, and the course
card went through about fifteen layouts before landing. So these are five
*angles* on one day's work, not five announcements — each slot has one sentence
it has to prove, and its own shots.

> **Honest note on the cadence.** One day of commits does not usually contain
> five separate features. Slots 1–4 are each carrying a real, distinct, shipped
> change. Slot 5 is deliberately the softest — a live count and the overall
> score, both real but neither new today. If tomorrow ships less than this,
> the right move is four strong posts, not five padded ones.

| Slot | Time (local) | Folder | Slides | What it proves |
|------|------|-------|-------|------|
| 🌅 Morning | ~07:00 | `1-morning/` | 5 | the chart is a rolling seven days, not a calendar week |
| ☀️ Midday | ~11:00 | `2-midday/` | 6 | four tiles, each earning its place |
| 🌤️ Afternoon | ~15:00 | `3-afternoon/` | 6 | one card per subject, redrawn fifteen times |
| 🌆 Evening | ~19:00 | `4-evening/` | 5 | the page you actually read on |
| 🌙 Night | ~21:30 | `5-night/` | 5 | you're not reading alone |

**Every shot is the real app, relabelled to a neutral two-subject curriculum.**
No course name, no school name, no course code appears in any slide or any
caption — Booklesss is not one syllabus and must never look like it. The capture
script enforces this: it scans the exact crop and refuses to write a PNG with a
banned word in it.

---

### 🌅 Morning — `1-morning/` · Your week, as one line
**Post title:** Your week, as one line

**Slides:** cover → seven days, always rolling → each subject gets its own line
→ *how it counts* (no screenshot — the accrual rule is the feature) → search CTA

**Caption:**
> Building in public 🛠️ — the study chart is now a rolling seven days. It ends
> on today and keeps moving, so nothing resets on a Monday and the line never
> restarts at a week boundary. Underneath the total, every subject gets its own
> line. And the clock is deliberately strict: hide the tab or stop moving for a
> minute and it stops counting. It would rather undercount than flatter you.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #studytok #zambia

---

### ☀️ Midday — `2-midday/` · Four numbers, chosen carefully
**Post title:** Four numbers, chosen carefully

**Slides:** cover → the whole week at a glance → compared to last week → it tells
you what is slipping → in the works → search CTA

**Caption:**
> We threw out the old dashboard tiles today 🛠️ — a tile now has to earn its
> place by changing what you do next. What survived: days read this week, how
> many answers you got right first time, what's going stale, and where you're
> weakest. Every one says which way it moved on last week, because a number on
> its own tells you nothing.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #productdesign #studytok #zambia

---

### 🌤️ Afternoon — `3-afternoon/` · One card per subject
**Post title:** One card per subject

**Slides:** cover → everything you're studying → the score sits on the title line
→ the button is the progress bar → *what it took* → search CTA

**Caption:**
> This one card took the whole day 🛠️ — about fifteen layouts, seven of them
> built properly and then binned. Where it landed: the score sits on the title
> line instead of in a badge, and the resume button *is* the progress bar — its
> fill is how far in you are, and it names the exact step you stopped on.
> Most of design is throwing away the version you were proud of yesterday.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #designinpublic #edtech #uidesign #zambia

---

### 🌆 Evening — `4-evening/` · The part you actually read
**Post title:** The part you actually read

**Slides:** cover → plain English, short sections → everything one tap away →
in the works → search CTA

**Caption:**
> All the measuring is in service of one thing 🛠️ — the page in front of you.
> Big idea first, then the details. Short sections, plain English, nothing
> padded to fill a page. And the whole subject sits one tap away, with a ring on
> each step showing what you've actually cleared.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #studytok #studygram #zambia

---

### 🌙 Night — `5-night/` · You're not reading alone
**Post title:** You're not reading alone

**Slides:** cover → a live count on every subject → and one score over all of it
→ in the works → search CTA

**Caption:**
> Every subject shows how many people are in it right now 🛠️ — not a follower
> count, just who's actually reading with you tonight. Over the top of all of
> it, one score: how much you've covered, how often you turn up, and how much
> sticks first time.
> Five posts a day from here on, all of it shot from the real thing. Nothing
> here is a mockup.
> Search **booklesss** (three s's) on Google, or DM me "link". 👇
> #buildinpublic #edtech #studytok #zambia

---

*Regenerate: start the dev server (`cd platform && npx next dev -p 3100`), then
`node _scripts/cap-day.mjs` for the shots, then*
`POST=w-chart|w-tiles|w-card|w-read|w-live node _scripts/prog-post.mjs`.
*All default to today's date. No posting connector — upload manually.*
