---
name: step-feedback
description: >
  The feedback loop for course-reader steps. Captures reactions from three
  sources — the owner reviewing a step, the owner STUDYING a step for their own
  exam, and students reading it — then turns them into rules for future steps
  and revision debt against steps already written. READ IT BEFORE writing,
  editing, or regenerating any reader step, so accumulated rules are applied and
  that step's outstanding debt is paid down in the same edit. INVOKE IT DURING a
  study session ("running a study session on Treasury Management", "this bit
  didn't land", "I had to re-read this", "the lecture covers X and the step
  doesn't", "this number is wrong") and AFTER any reaction — the owner's or a
  student's — to log it and, when it generalises, promote it to a rule.
  Triggers: "study session", "studying [course]", "feedback on this step",
  "this step is boring", "spice it up", "it needs a proper hook", "make it
  engaging", "a student said", "log that", "remember that for the next step",
  "that's a rule", "why did you write it like that". Carries the ENGAGEMENT
  PASS — the fixed six-check procedure for a step that is accurate, complete
  and still not worth reading; it is course-agnostic and runs on any step in
  any course. Applies to reader steps in platform/
  (Supabase courses → nav_nodes → lessons), not to PDFs — PDFs are step-skill.
---

# step-feedback

A step is written once and read many times — by the owner reviewing it, by the
owner studying it for a real exam, and by students. Every one of those readings
knows something the writing didn't. Without a loop that feedback is spent once:
the next step repeats the mistake and the step that caused it stays wrong.

This skill is the loop, and it runs in **two time directions**:

```
                          ┌──── forward: fix the NEXT step ────► RULES.md
 owner review  ─┐         │
 study session ─┼─► LOG ──┤
 student        ─┘        │
                          └──── backward: fix steps ALREADY written ──► DEBT.md
                                                    │
   write / rewrite a step ◄── read RULES + pay this step's DEBT ◄──┘
```

Most feedback systems only do the forward half. The backward half is why this
one has `DEBT.md`: a rule promoted on step 9 leaves steps 1–8 quietly breaking
it, and nobody remembers which. The ledger remembers.

Four files:

| File | What it is | When it's touched |
|------|-----------|-------------------|
| `RULES.md` | The **active** rules. The house style for reader steps. | Read before writing. Appended/edited when feedback generalises. |
| `DEBT.md` | Rules and corrections owed to steps **already written**. | Grepped before editing any step. Opened when a rule or error invalidates published content. |
| `LOG.md` | Every reaction, dated, sourced, tied to the step it was about. | Appended after every reaction. Never edited or pruned. |
| `SKILL.md` | This file — the loop itself. | Rarely. |

## Sources of feedback

All three carry equal weight. What differs is what they're good at seeing.

| Source | Tag | What it catches that the others miss |
|--------|-----|--------------------------------------|
| Owner reviewing | `owner` | Voice, house style, whether it looks like Booklesss |
| Owner studying (real exam prep) | `study` | Whether it actually *teaches* — where reading stalls, what the lecture covers that the step doesn't |
| A student | `student` | Where a reader who doesn't already know the answer gets lost |

A `study` or `student` note that says "I didn't understand this" outranks any
style preference. Steps exist to be understood; everything else is downstream.

---

## Direction 1 — BEFORE writing OR rewriting a step

Two things, in order, every time:

1. **Read `RULES.md` in full.** It is short by design; read all of it, not a
   grep. Write the step so every rule holds. Do not re-derive style decisions a
   rule already settles, and do not "improve" on a rule because the current step
   feels like an exception — if it genuinely is one, say so to the owner rather
   than quietly departing.

2. **Grep `DEBT.md` for this step's slug.** Every open box against it is applied
   in this edit and ticked. This is not optional and not a follow-up task — the
   step is open, the fix is known, it gets fixed now. If nothing is owed, say so
   in one clause and move on.

If a rule and the step's source material conflict (e.g. a lecture uses a term
the rules ban), follow the rule and note the substitution.

Before calling the edit done, run the **engagement pass** below over what you
wrote. It is six checks and takes a minute, and it catches the failure the other
two do not: a step that breaks no rule and is still not worth reading.

---

## Direction 2 — AFTER the owner reacts

Every reaction gets logged, even a one-word one. Do this in the same turn the
owner gives it — not batched at wrap.

### 1. Classify

Every piece of feedback is about one of five things. Tag it:

| Tag | Covers |
|-----|--------|
| `writing` | Voice, tone, sentence length, how an idea is explained, what to cut |
| `element` | Which block type does which job; how a formula, table, callout, list should look and when to reach for it |
| `structure` | Section count and order, what earns its own section, checkpoint/check questions, step splitting |
| `content` | What must be covered, what depth, which examples, exam-relevance |
| `error` | A number, definition, method or check answer that is **wrong** |

Feedback often carries two tags. Log it under both.

An `error` is never a matter of taste and never waits: it opens a `DEBT.md` item
the same turn, and if the step is live the fix ships before the session moves on.

### 2. Log it

Append to `LOG.md`, newest at the top of the entries. Every entry carries its
**source** (`owner` · `study` · `student <who>`) — where a note came from is
half its meaning:

```markdown
### 2026-07-27 · corporate-finance/investment-appraisal/free-cash-flows · owner
- `writing` — "too much throat-clearing before the definition." Cut the opening
  paragraph; lead with what FCF is.
- `element` — the FCF waterfall should be a `table`, not a `ul`. Amounts must
  right-align and the total needs a rule above it.
→ promoted: **W-4**, **E-2** · debt: **D-3**
```

Rules of logging:
- Quote or closely paraphrase the **actual words**. Their phrasing carries the
  intent; a tidied-up summary loses it. A student's words especially are never
  rewritten into the owner's framing — "I got lost at the second table" is data,
  "the second table needs work" is a guess about it.
- Always name the step it was about, by its reader path, and the source.
- End with `→ promoted:` and the rule ids, or `→ one-off`; and `debt:` with the
  `D-` ids if steps already written are affected.

### 3. Decide whether it generalises

Promote to `RULES.md` when the feedback would apply to a step the owner
hasn't seen yet. Keep it in `LOG.md` only when it is genuinely local to this
step's subject matter.

Ask: *"if I write the next step and ignore this, will the owner say it
again?"* If yes, it's a rule.

Signals it's a rule:
- The owner says "always", "never", "from now on", "again".
- It's the **second** time the same note has come up — check `LOG.md` before
  deciding. Two occurrences of a one-off make a rule; say so when promoting it.
- It's about the medium (a block type, section length) rather than the topic.

### 4. Promote it

Add to the right section of `RULES.md` with the next free id in that section's
series (`W-` writing, `E-` element, `S-` structure, `C-` content). One rule per
line, imperative, testable. A rule you can't check a draft against is a wish,
not a rule.

Good: **E-2** — Financial waterfalls use `table` with right-aligned amounts and
a rule above the total. Never a `ul`.

Bad: ~~**E-2** — Tables should look good and be easy to read.~~

When new feedback contradicts an existing rule, **edit that rule in place** and
add `(revised YYYY-MM-DD)`. Do not leave both standing. When a rule is
withdrawn entirely, strike it through rather than deleting — a rule that was
tried and dropped is worth knowing about.

### 5. Open the debt

**Ask the question that makes feedback compound: which already-written steps
does this break?**

Every promoted rule and every `error` gets checked against what's already
published. If any step written before today would now be wrong, open a `D-` item
in `DEBT.md` naming those steps (see that file for the format and the honesty
rules on scoping). If nothing published is affected — a rule about a block type
no earlier step used, say — write `debt: none` in the log entry rather than
leaving it silent, so a future reader knows the question was asked.

This is the step that gets skipped. Skipping it is how a course ends up with ten
steps written to five different standards.

### 6. Confirm to the owner

One line, no ceremony: which rules were added or changed, what debt was opened
against which steps, and what will be different next step. If nothing was
promoted, say that too — silently logging feedback the owner expected to become
a rule is the failure mode this skill exists to prevent.

---

## Direction 3 — DURING a study session

The owner studies these courses for real exams. That reading is the single best
source of feedback the project has: it is the only time someone who needs the
step to work is using it for its actual purpose, with the lecture and the past
papers in reach.

Run the session as studying, not as reviewing. Read to learn, and log the places
learning breaks.

**What to capture** — four kinds, all worth logging:

| | What it is | Where it goes |
|---|---|---|
| **Stall** | You re-read a paragraph, or went to the slides/textbook to understand the step | `LOG.md`, tagged `writing` or `structure` — the step failed at its job |
| **Flat** | You understood every word and felt nothing. You skimmed, or read on out of duty | `LOG.md` `writing`/`content` — run the **engagement pass** below |
| **Gap** | The lecture, tutorial or past paper needs something the step doesn't carry | `LOG.md` `content` **+ a `DEBT.md` item** |
| **Error** | A number, definition, method or check answer is wrong | `LOG.md` `error` **+ a `DEBT.md` item, fixed immediately** |
| **Keep** | Something that made it click | `LOG.md`, tagged — so a later rewrite doesn't destroy it |

**Flat is the one that hides.** A stall announces itself — you know when you've
read a paragraph twice. Boredom doesn't: you get to the end of the step, nothing
was wrong, and nothing stuck either, so there is nothing obvious to report. It
gets logged as "fine" and the next nine steps are written the same way. If you
skimmed, that is the finding. Log it before you rationalise it.

**Keep is not optional.** A log of only complaints turns every rewrite into a
gamble: the rewrite fixes the stall and quietly deletes the analogy that was
carrying the section. Name what worked and why.

**Rules of the study session:**

- Log **while studying**, step by step — not reconstructed at the end. What you
  reconstruct afterwards is what you remember, and what you remember is not what
  confused you; the whole point is the friction you'd normally push through.
- Say where it broke, not how to fix it. "I couldn't tell which rate went in the
  denominator" is the finding. The fix is a separate decision, made with the
  rules in hand.
- **A stall is a defect even if the step is technically correct.** Resist
  "actually it does say that, two lines up" — if you missed it while studying, a
  student misses it too.
- Every session ends with the debt written down before anything is rewritten.
  Studying and rewriting in the same pass means the fix gets designed by whoever
  is currently annoyed, and the same insight never reaches the other nine steps.

---

## Direction 4 — WHEN a student reacts

Student feedback arrives from three places: replies in the course's Slack
channel, wrong answers on the reader's section checks, and DMs. All of it counts.

- Log it **verbatim**, with the student's name in the source (`student · Chanda`).
  Their words are the evidence; a cleaned-up version is already an interpretation.
- **Two students hitting the same stall is automatically a rule** — no judgement
  call needed. One student is a data point, two is a pattern, and you will not
  get a third if the second one gives up.
- A student naming a **wrong answer or a wrong number** is treated as true until
  checked, and checked the same session. They are reading it in an exam week.
- Do not defend the step to the student, and do not log the defence. "It's
  explained in section 3" is not feedback about the feedback.
- Where a student's confusion is genuinely about the subject and not the step —
  they'd have been lost in the lecture too — that's still `content`: the step is
  where they came for help.

---

## The engagement pass

For **Flat**. A step can be accurate, complete, correctly structured and still
not worth reading — and because nothing is *wrong*, a normal review returns
"looks good". This is the fixed procedure for that, and it is deliberately
course-agnostic: it asks nothing about treasury or strategy, so it runs on any
step in any course.

Six checks, in order. Each has a rule behind it, so a failure is a defect with
an id, not an opinion.

| # | Check | Fails when | Rule |
|---|-------|-----------|------|
| 1 | **The first screen** — cover everything below the opening paragraph. Would a student with a free evening read on? | It opens "X is the …" — a category definition with nothing at stake | **W-6**, **W-3** |
| 2 | **Concrete anchors** — count the named companies, figures, dates and real decisions per section | Any section is definition end to end | **C-5**, **C-1** |
| 3 | **The buried lead** — what is the most interesting thing in this step? Where is it? | It's a callout in section 4, or a subordinate clause | **C-6** |
| 4 | **Table load** — count definitional tables (a list of types/levels/functions, not a working) | Three or more, each in the same `p → table → p` sandwich | **S-7** |
| 5 | **Rhythm** — read the block types down the page: `p p p p` | Any section is three consecutive long `p` blocks | **W-7** |
| 6 | **The abstraction ladder** — does any idea stay abstract from start to finish? | A classification is taught as its categories and never as one case moving through them | **C-3**, **C-5** |

**The moves that fix them.** These are what the TM 1.1 rewrite actually did, in
the order they were worth doing:

- **Promote the buried lead.** The most alive thing in the step opens the
  section it belongs to. Barings was one line in a callout; told properly — the
  date, the £827m, the account number, the one pound — it now opens the section
  it was hiding in, and section 5 gets to start "Leeson dealt his own trades and
  then settled them himself."
- **Find the stake.** Every finance topic has a way it hurts someone. Treasury's
  is that a profitable company can still miss payroll on the 28th. Open there,
  then define. The definition lands harder because there is now a hole for it.
- **One case through the whole ladder.** A three-row classification table is
  inert. Take one concrete thing — a miller buying wheat in USD — and walk it
  through all three levels, then show the table as the summary of what the
  reader just watched. The table stops being the lesson and becomes the recall
  handle.
- **Give a list a shape.** Eleven functions is unmemorable; "five that move the
  money, six that manage the people who let it move" is recoverable under exam
  pressure. Find the split before the table, state it after.
- **Break the grey.** An `h2` splitting a two-part section, a callout, one short
  sentence alone. Cheap, and it is half of what "boring" actually meant.

**What the pass must not do.** Coverage is not negotiable — **C-2** outranks all
of this. The rewrite kept every section, every syllabus list and every figure;
it changed the way in, not what is taught. If an engagement fix would cut
examinable content, the fix is wrong. Equally, engaging is not longer: the TM 1.1
rewrite added roughly a hundred words to a 300-line step, most of them the
Barings facts.

**Where the pass runs.** On contact, not in a batch. A step nobody is reading
does not get rewritten for style — but any step opened for any reason gets its
`D-` box paid at the same time (Direction 1). Batch-rewriting the whole course
means forty steps redesigned by whoever is currently annoyed, with no reader
having asked for any of it.

---

## How a fix actually ships

The step's editable source is its `.mjs` file in the course tree, not Supabase
and not the generated JSON:

```
Schools/<School>/<Course>/<lesson>/reader/<step-slug>.mjs
```

e.g. `Schools/ZCAS/Treasury Management/02-working-capital/reader/cash-management.mjs`

The loop: edit the `.mjs` → `npm run seed:course` → `npm run gen:course` →
`next build` → commit → push (push to `main` deploys).

**A fix applied only in Supabase, or only in the JSON, is not applied.** The
`.mjs` is the authored source and `seed:course` replaces a course's rows
wholesale from it — so the next re-seed reinstates whatever the file still
says. This bites hardest on the things swept in bulk: when course codes and
school names were stripped from Supabase and `course-index.json` (session 26),
all three `reader/course.mjs` manifests still read "BAC4301 at ZCAS", and a
routine re-seed would have put it straight back. Any content correction lands
in **all three** places, or in the `.mjs` first and then flows out through the
loop above.

Two things that belong to this skill rather than the build:

- **Corrections are recorded in the file's header comment** (rule **E-7**) — what
  was wrong, what it is now, and where the error came from. A corrected figure
  with no note reads as a typo to the next person holding the ZCAS slide.
- **Tick the `DEBT.md` boxes in the same commit as the fix.** A ledger updated
  later is a ledger nobody trusts.

---

## What does NOT go in here

- Facts about the course content (those go in the course's `_course.md`).
- Bugs in the reader app (those are code, not style).
- **Reactions to the app's chrome rather than to a step** — the sidebar, the
  header, icons, navigation, the course home. The test is whether the reaction
  would change how a step is *written*. "This table should be a formula" is a
  step rule; "the caret is too small" is app design, and belongs in the code and
  the session log. Both arrive in the same breath during a study session, so
  split them as they come rather than filing everything here.
- Anything already in `.claude/CLAUDE.md` — that file outranks this one, and
  duplicating it means two places to update. `RULES.md` may *sharpen* a
  CLAUDE.md rule for reader steps specifically; it must never contradict it.
