---
name: step-skill
description: >
  The one skill for Booklesss course content — planning a course's lessons,
  writing and rewriting reader steps, and running the feedback loop that improves
  them. READ IT BEFORE writing, editing, or regenerating any step, so the house
  rules are applied and that step's outstanding debt is paid in the same edit.
  Covers three jobs: PLAN (group a course's topics into lessons and steps, scaffold
  the folders, emit _course.md) — triggers "plan the lessons", "structure this
  course", "how many steps does X need", "promote [course] into Booklesss";
  WRITE (author a reader step as .mjs, or any branded PDF — lesson notes, lead
  magnets, invoices, quotes) — triggers "write step X", "write the PDF", "create a
  lead magnet", "make an invoice", "one-pager", "export to PDF"; IMPROVE (log a
  reaction, promote it to a rule, open revision debt, run the engagement pass) —
  triggers "study session", "studying [course]", "feedback on this step", "this
  step is boring", "spice it up", "make it engaging", "a student said", "log that",
  "that's a rule", "this number is wrong", "why did you write it like that".
  Carries RULES.md (house style), DEBT.md (what published steps owe), LOG.md
  (every reaction). Not for social posts (daily-post) or web/UI (design-system).
---

# step-skill

Everything to do with a Booklesss step lives here — deciding it should exist,
writing it, and making it better once someone has read it.

```
[ PLAN ]              [ WRITE ]                  [ IMPROVE ]
 what the lessons  →   the step itself       →    what the reading taught
 and steps are        (.mjs reader / PDF)         (rules + debt)
       ▲                                                 │
       └───────────────── the loop closes ───────────────┘
```

The three used to be three skills. They are one because they share a state: the
rules that govern writing are produced by the improving, and the debt produced by
the improving is paid during the writing. Split apart, that state gets read by
whichever skill happened to be invoked.

## Improve the step. Deal with the consequences.

*(owner, 2026-08-03)* **A step that can be improved gets improved, and nothing
downstream is a reason to stop and ask.** Not a URL that moves, not a manifest
that has to be re-seeded, not a debt list that has to be renumbered, not a link
someone may have saved. The owner's words: *"the step skill should never have to
[w]orry about any live breaks or whatever — a step being improved is the main
priority in any case, and so it must be fixed or improved no questions asked."*

- **The churn is the price of the fix, not a decision about it.** This was
  already **S-8**'s "never defer a split"; it is written here because that
  bullet reads as if splitting were the only fix that sends a bill. It is not.
  Adding a nav folder repathed 18 of 21 TM steps. That is the same kind of bill
  and it gets paid the same way.
- **Do not put it to the owner as a choice.** A three-way question about
  breaking URLs spends their attention on something the ledger had already
  decided, and the step sits unimproved until they answer. If the consequence is
  large, **do it and say what it cost** — in the file's header comment, in
  `DEBT.md`, and in the confirmation. Reporting is not the same as asking.
- **What still gets said out loud, after the fact:** what moved, how many, and
  what would have to change if it were done again later under different
  conditions. That is a record, and the next pass needs it.
- **Never offer a menu for work you could just do.** *(added later the same
  day, after it happened twice)* Presenting two or three options and waiting is
  the same failure wearing a helpful face: the step stays unimproved, and the
  owner has to reconstruct enough context to answer something the ledger had
  already decided. *"can you be more autonomouse and stop looping me into
  things you could have solved without me."*
- **Re-test a recorded blocker before you repeat it.** A `DEBT.md` note saying
  something is blocked is **a claim with a date on it, not a standing fact**.
  D-5 said it needed the Streamline MCP, "unauthorized in the 2026-08-02
  session"; the connector had been up the whole time, and two days of "blocked"
  cost one tool call to disprove. Anything that stops the work earns thirty
  seconds of checking before it is passed on — and when it turns out to be
  stale, **say so in the ledger** so the next reader knows the note was tested
  rather than copied.
- **The one thing this does not license** is skipping the checks that tell you
  the fix *worked* — the scans, the built HTML, the re-run. Shipping without
  asking is not shipping without looking.

## This skill belongs to no course and no school

*(owner, 2026-08-03)* It is the house style for **every** Booklesss course —
the four on the reader today, the thirteen UNZA courses still in `_pipeline/`,
and whatever is promoted next. So:

- **No rule names a school.** Not ZCAS, not UNZA. A rule that says "cover what
  the ZCAS lecture covers" is simply false the day a UNZA course is written
  against it, and it will be read as true. Rules say **"this course's lecture"**
  and **"the material in the lesson folder"** — the source is whatever was
  handed to the course being written.
- **No rule names a course.** Nothing about how a step is written follows from
  it being Treasury Management rather than Microeconomics.
- **Naming a course as *evidence* is different, and it is required.** "TM 1.1's
  rewrite cut it to 35 words", "26 of 53 steps failed the label scan" — that is
  the measurement a rule rests on, and stripping it would leave assertions
  nobody can check. The test: does the course name appear in the **instruction**
  (couples the skill) or in the **proof** (justifies it)?
- **The tools take a path and walk whatever is under it.** They do not know what
  a course is. `label-scan.mjs Schools` scans everything; point it at one
  course's folder and it scans that.
- **`DEBT.md` is the exception, by design.** A ledger of what *published* steps
  owe has to name them. That is a record of specific work, not a rule.

What is *not* course- or school-specific and stays: ZMW and Zambian companies
(**C-1**), because that is the product, not a course.

## The files

| File | What it is | When it's touched |
|------|-----------|-------------------|
| `RULES.md` | The **active** house style for reader steps. | Read in full before writing. Appended/edited when feedback generalises. |
| `DEBT.md` | Rules and corrections owed to steps **already written**. | Grepped before editing any step. Opened when a rule or error invalidates published content. |
| `LOG.md` | Every reaction, dated, sourced, tied to its step. | Appended after every reaction. Never edited or pruned. |
| `reference/planning.md` | Course architecture: lessons, channels, `_course.md`, the outline PDF. | Read when planning or restructuring a course. |
| `reference/pdf.md` | The PDF design system — fonts, palette, geometry, flowables, document profiles. | Read when the output is a PDF. |

Load a `reference/` file only for the job in hand. `RULES.md` and `DEBT.md` are
not optional for any step edit.

---

# PLAN — what the lessons and steps are

Read **`reference/planning.md`**. The doctrine in one line: a **lesson is one
mental frame**, a course is `Course → Lessons → Steps`, and the number of lessons
follows the material rather than a round target.

Output is the architecture, not content: `_course.md`, the folder scaffold, and
the course outline. Confirm the structure with the owner before scaffolding — it
is the cheap moment to change it.

---

# WRITE — the step itself

## Which surface

**Reader steps are the product.** A step is authored as a `.mjs` file in the
course tree and read at `booklesss.vercel.app`. PDFs still exist — lead magnets,
invoices, quotes, and the older lesson PDFs kept as provenance — but a new lesson
step is written for the reader unless the owner asks for a PDF.

| Output | Where | How |
|--------|-------|-----|
| Reader step | `Schools/<School>/<Course>/<lesson>/reader/<step-slug>.mjs` | below |
| Any PDF | `.../sources/build_*.py` → sibling `steps/` | `reference/pdf.md` |

## Before writing OR rewriting — two things, in order, every time

1. **Read `RULES.md` in full.** It is short by design; read all of it, not a
   grep. Write so every rule holds. Don't re-derive a style decision a rule
   already settles, and don't "improve" on a rule because this step feels like an
   exception — if it genuinely is one, say so to the owner rather than quietly
   departing.

2. **Grep `DEBT.md` for this step's slug.** Every open box against it is applied
   in this edit and ticked. Not optional, not a follow-up task — the step is
   open, the fix is known, it gets fixed now. If nothing is owed, say so in one
   clause and move on.

If a rule and the source material conflict (a lecture uses a banned term, say),
follow the rule and note the substitution.

Before calling the edit done, run the two passes below over what you wrote:
**RANK** scores it rule by rule and tells you what is broken; the **engagement
pass** catches the failure ranking can't — a step that breaks no rule and still
isn't worth reading.

## How a step actually ships

The editable source is the `.mjs`, not Supabase and not the generated JSON:

```
edit the .mjs → npm run seed:course → npm run gen:course → next build → commit → push
```

**A fix applied only in Supabase, or only in the JSON, is not applied.**
`seed:course` replaces a course's rows wholesale from the `.mjs`, so the next
re-seed reinstates whatever the file still says. This bit hardest on bulk sweeps:
when course codes and school names were stripped from Supabase and
`course-index.json` (session 26), all three `reader/course.mjs` manifests still
read "BAC4301 at ZCAS", and a routine re-seed would have put it straight back.
Any correction lands in the `.mjs` first and flows out through the loop.

**`seed:course` blocks on what the renderer would silently swallow.** The inline
marks do not nest and the parser walks a string once, so a link written inside
`**bold**` renders the words and drops the source with no error anywhere. That
shipped twice before the check existed. It now refuses to write on a link or
term inside bold, a link inside a term definition, or a mark in a table cell,
and it *warns* on em dashes without blocking, since every older step has them.

**A new block type is invisible to that check until you teach it where its text
lives.** The validator used to walk `b.text` and `b.items` only. `cards` keeps
its prose in `b.cards[].title/lead/text`, so on the day it was added every card
sailed past the very check that exists to catch a link inside bold — clean
because nothing had looked at it. There is now one `blockTexts(b)` that knows
every place prose hides, and both the mark check and the em-dash check read
from it. **Adding a block type means extending that function in the same
edit**, plus a guard for anything the block names by string (a `cards` icon that
does not exist blocks the write and lists the valid names, rather than
rendering a blank space). Prove the guard fires by breaking it on purpose
before you trust it.

**Check the built HTML, not the source, before saying a step is right.** The
source says what you meant; the page says what a reader gets, and the gap
between them is where every silent failure this skill has hit lives. Strip
`<script>` blocks first — Next's RSC payload carries the raw authored text, so a
grep for `**` or `](https` matches it and tells you nothing:

```python
body = re.sub(r"<script[\s\S]*?</script>", "", html)   # then grep `body`
```

Three things that belong to this skill rather than the build:

- **Corrections are recorded in the file's header comment** (rule **E-7**) — what
  was wrong, what it is now, where the error came from. A corrected figure with
  no note reads as a typo to the next person holding the lecture slide.
- **Tick the `DEBT.md` boxes in the same commit as the fix.** A ledger updated
  later is a ledger nobody trusts.
- **Run the scans before `seed:course`.** They cover the rules a regex can
  actually judge, and each exits on its hit count. `seed:course` does not check
  any of this — it checks what the *renderer* would swallow, which is a
  different question.

  ```bash
  node .claude/skills/step-skill/tools/label-scan.mjs Schools      # S-10 · D-9
  node .claude/skills/step-skill/tools/em-dash-scan.mjs Schools    # W-11 · D-10
  node .claude/skills/step-skill/tools/cold-open-scan.mjs Schools  # W-13 · D-4
  node .claude/skills/step-skill/tools/table-scan.mjs Schools      # E-9  · D-5
  ```

  Point any of them at one course's folder to scan just that course.
  `em-dash-scan` is the newest and has no judgement in it at all — the character
  is there or it is not. It exists because `seed-course.mjs` has always *warned*
  on em dashes without blocking, so the warnings scrolled past on every publish
  and nobody counted them. First run: **790 in 32 of 53 steps**, and **Treasury
  Management had none**, because its 21 steps were rewritten after W-11 existed
  and the other two courses never were.

  `label-scan` is the cheapest of the three and the only one with no false
  positives to argue with: it compares each step's `label` against its `title`,
  which are the name the step is **tapped** under and the name it **lands** on.
  Run it after any S-8 split — splitting is what creates the mismatch, because
  it writes two new titles at the seam and leaves the old topic name in the
  labels.

## PDFs

Read **`reference/pdf.md`** — the shared brand foundation (fonts, palette, page
geometry, reusable flowables, the `keepWithNext` page-break rule, table column
widths) plus a profile per document type: lesson notes, lead magnet, business
document. Always generate by running a Python/ReportLab script via Bash, never a
GUI library. PDFs carry no marketing links or external URLs in the body.

---

# IMPROVE — the feedback loop

A step is written once and read many times — by the owner reviewing it, by the
owner studying it for a real exam, and by students. Every one of those readings
knows something the writing didn't. Without a loop that feedback is spent once:
the next step repeats the mistake and the step that caused it stays wrong.

The loop runs in **two time directions**:

```
                          ┌──── forward: fix the NEXT step ────► RULES.md
 owner review  ─┐         │
 study session ─┼─► LOG ──┤
 student        ─┘        │
                          └──── backward: fix steps ALREADY written ──► DEBT.md
                                                    │
   write / rewrite a step ◄── read RULES + pay this step's DEBT ◄──┘
```

Most feedback systems only do the forward half. The backward half is why
`DEBT.md` exists: a rule promoted on step 9 leaves steps 1–8 quietly breaking it,
and nobody remembers which. The ledger remembers.

## Sources of feedback

All three carry equal weight. What differs is what they're good at seeing.

| Source | Tag | What it catches that the others miss |
|--------|-----|--------------------------------------|
| Owner reviewing | `owner` | Voice, house style, whether it looks like Booklesss |
| Owner studying (real exam prep) | `study` | Whether it actually *teaches* — where reading stalls, what the lecture covers that the step doesn't |
| A student | `student` | Where a reader who doesn't already know the answer gets lost |

A `study` or `student` note that says "I didn't understand this" outranks any
style preference. Steps exist to be understood; everything else is downstream.

## After the owner reacts

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

Promote to `RULES.md` when the feedback would apply to a step the owner hasn't
seen yet. Keep it in `LOG.md` only when it is genuinely local to this step's
subject matter.

Ask: *"if I write the next step and ignore this, will the owner say it again?"*
If yes, it's a rule.

Signals it's a rule:
- The owner says "always", "never", "from now on", "again".
- It's the **second** time the same note has come up — check `LOG.md` before
  deciding. Two occurrences of a one-off make a rule; say so when promoting it.
- It's about the medium (a block type, section length) rather than the topic.

### 4. Promote it

Add to the right section of `RULES.md` with the next free id in that section's
series (`W-` writing, `E-` element, `S-` structure, `C-` content). One rule per
line, imperative, testable. A rule you can't check a draft against is a wish, not
a rule.

Good: **E-2** — Financial waterfalls use `table` with right-aligned amounts and a
rule above the total. Never a `ul`.

Bad: ~~**E-2** — Tables should look good and be easy to read.~~

When new feedback contradicts an existing rule, **edit that rule in place** and
add `(revised YYYY-MM-DD)`. Do not leave both standing. When a rule is withdrawn
entirely, strike it through rather than deleting — a rule that was tried and
dropped is worth knowing about.

### 5. Open the debt

**Ask the question that makes feedback compound: which already-written steps does
this break?**

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
promoted, say that too — silently logging feedback the owner expected to become a
rule is the failure mode this loop exists to prevent.

## During a study session

The owner studies these courses for real exams. That reading is the single best
source of feedback the project has: it is the only time someone who needs the
step to work is using it for its actual purpose, with the lecture and the past
papers in reach.

Run the session as studying, not as reviewing. Read to learn, and log the places
learning breaks.

**What to capture** — five kinds, all worth logging:

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

## When a student reacts

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

# RANK — score a step against the rules

`RULES.md` is written so a draft can be **checked** against it, not just
admired. This is how: open the step, walk every rule in order, and give each one
a verdict with evidence. It turns "this step feels weaker than that one" into a
number and a list of defects with ids.

Run it when the owner asks how a step is doing, before shipping a rewrite, and
as the first move on any step being paid down from `DEBT.md`.

**One pass, rule by rule.** For each rule in `RULES.md` (W, E, S, C in order):

| Verdict | Means |
|---------|-------|
| **Pass** | Held throughout, with a line quoted as proof |
| **Weak** | Held in places, broke in others — name the section |
| **Fail** | Broken, or absent where the rule requires presence |
| **n/a** | The rule's trigger never occurs (no formula in the step → E-2 is n/a) |

Rules that are easy to fake a pass on, and how to actually check them:

- **W-6 / W-3** — cover everything below the first paragraph and read only that.
  A pass means you'd keep reading, not that a hook technically exists.
- **W-8** — read only the bold, end to end. It should be a usable summary. If it
  reads as a random sample of the prose, or as half the words, that's a Fail
  even though bold is present.
- **W-9** — count the sentences that address an exam candidate versus an owner.
  "The exam asks you to…" in a step with no other framing is a Fail.
- **C-5** — count concrete anchors per section, don't estimate. A section with
  zero is a Fail on its own, whatever the rest of the step scores.
- **C-2** — check against the lecture, not against the step's own coherence. A
  step can be internally perfect and still have dropped two syllabus topics.
- **E-8** — count the tappable terms and ask whether a first-year would have
  needed each one. Zero in a jargon-heavy step is a Fail.

**Report it as a table**, worst first, then the score:

```markdown
### treasury-management/operations/intro-to-treasury — 21/23 (2 weak, 0 fail)
| Rule | Verdict | Evidence |
|------|---------|----------|
| C-5  | Weak    | §2 "eleven functions" — table + prose, no figure or company |
| W-7  | Weak    | §6 opens with three 50-word `p` blocks in a row |
| W-8  | Pass    | bold-only read: profit/cash, executes-not-sets, five/six split |
```

Score is **passed ÷ applicable** — n/a rules leave the denominator, so a step
with no tables isn't punished for having no table rules.

**What the score is for, and what it is not.** It ranks steps against each
other so the worst gets attention first. It is not a quality gate: a step can
score 22/23 and still be flat, which is what the engagement pass below is for,
and a single **C-2** or **error** failure outranks any score — a step missing
examinable content is broken at 22/23.

**Every Fail and Weak leaves the pass as one of two things**, never a note: a
fix in this same edit, or a `D-` item in `DEBT.md` if it's a rule that breaks
other steps too. A rank that produces neither was an opinion.

---

# The engagement pass

For **Flat**. A step can be accurate, complete, correctly structured and still
not worth reading — and because nothing is *wrong*, a normal review returns
"looks good". This is the fixed procedure for that, and it is deliberately
course-agnostic: it asks nothing about treasury or strategy, so it runs on any
step in any course.

Ten checks, in order. Each has a rule behind it, so a failure is a defect with
an id, not an opinion. Checks 8–10 were added 2026-08-02: 7 and 8 are the two
halves of an opening (readable, then worth reading) and must both pass, 9 is the
one that catches what sentence-length limits miss, and 10 is the only check that
looks outside the step it is run on.

| # | Check | Fails when | Rule |
|---|-------|-----------|------|
| 1 | **The first screen** — cover everything below the opening paragraph. Would a student with a free evening read on? | It opens "X is the …" — a category definition with nothing at stake | **W-6**, **W-3** |
| 2 | **Concrete anchors** — count the named companies, figures, dates and real decisions per section | Any section is definition end to end | **C-5**, **C-1** |
| 3 | **The buried lead** — what is the most interesting thing in this step? Where is it? | It's a callout in section 4, or a subordinate clause | **C-6** |
| 4 | **Table load** — count definitional tables (a list of types/levels/functions, not a working) | Three or more, each in the same `p → table → p` sandwich | **S-7** |
| 5 | **Rhythm** — read the block types down the page: `p p p p` | Any section is three consecutive long `p` blocks | **W-7** |
| 6 | **The abstraction ladder** — does any idea stay abstract from start to finish? | A classification is taught as its categories and never as one case moving through them | **C-3**, **C-5** |
| 7 | **The cold open** — read each section's first sentence alone, with nothing above it | It uses a word, a count or a pointer the reader cannot yet hold ("one exposure", "all three levels"), or narrates the device instead of starting it ("Take one X and watch it…") | **W-13** |
| 8 | **Is that opening worth reading?** — same sentences again, now asking what they earn rather than what they assume | It announces the topic instead of starting on something ("Working capital is an important area of…") — passing 7 and failing this is a legal sentence nobody wants to read | **W-14** |
| 9 | **Read it aloud as a second-language first-year** | Any sentence you would stop and explain out loud; a short sentence still doing two jobs; an expensive ordinary word wrapped round a technical one | **W-15**, **W-12** |
| 10 | **The two seams** — what does this step pick up, and what does it hand on? | It could be dropped into any position in the course without changing a word, or it leans on an earlier step without re-stating the fact it needs | **C-8** |

**The moves that fix them.** These are what the TM 1.1 rewrite actually did, in
the order they were worth doing:

- **Promote the buried lead.** The most alive thing in the step opens the section
  it belongs to. Barings was one line in a callout; told properly — the date, the
  £827m, the account number, the one pound — it now opens the section it was
  hiding in, and section 5 gets to start "Leeson dealt his own trades and then
  settled them himself."
- **Find the stake.** Every finance topic has a way it hurts someone. Treasury's
  is that a profitable company can still miss payroll on the 28th. Open there,
  then define. The definition lands harder because there is now a hole for it.
- **One case through the whole ladder.** A three-row classification table is
  inert. Take one concrete thing — a miller buying wheat in USD — and walk it
  through all three levels, then show the table as the summary of what the reader
  just watched. The table stops being the lesson and becomes the recall handle.
- **Give a list a shape.** Eleven functions is unmemorable; "five that move the
  money, six that manage the people who let it move" is recoverable under exam
  pressure. Find the split before the table, state it after.
- **Break the grey.** An `h2` splitting a two-part section, a callout, one short
  sentence alone. Cheap, and it is half of what "boring" actually meant.
- **Delete the announcement and start at the case.** The fix for a cold open is
  almost always a deletion, not a rewrite: "Take one exposure and watch it pass
  through all three levels. A Zambian miller buys wheat in US dollars…" loses its
  first sentence and starts at the miller. The demonstration was never the
  problem. Saying *"I am about to demonstrate"* was, and it took the reader's
  first sentence with it. Where the deleted sentence was carrying a term the
  reader needed, show the thing first and name it after: the wheat payment, then
  the word *exposure*.

**What the pass must not do.** Coverage is not negotiable — **C-2** outranks all
of this. The rewrite kept every section, every syllabus list and every figure; it
changed the way in, not what is taught. If an engagement fix would cut examinable
content, the fix is wrong. Equally, engaging is not longer: the TM 1.1 rewrite
added roughly a hundred words to a 300-line step, most of them the Barings facts.

**Where the pass runs.** On contact, not in a batch. A step nobody is reading
does not get rewritten for style — but any step opened for any reason gets its
`D-` box paid at the same time. Batch-rewriting the whole course means forty
steps redesigned by whoever is currently annoyed, with no reader having asked for
any of it.

---

# What does NOT belong here

- Facts about a course's content — those go in that course's `_course.md`.
- Bugs in the reader app — those are code, not style.
- **Reactions to the app's chrome rather than to a step** — the sidebar, the
  header, icons, navigation, the course home. The test is whether the reaction
  would change how a step is *written*. "This table should be a formula" is a
  step rule; "the caret is too small" is app design, and belongs in the code and
  the session log. Both arrive in the same breath during a study session, so
  split them as they come rather than filing everything here.
- Social posts — that's `daily-post`. Web and UI design — that's `design-system`.
- Anything already in `.claude/CLAUDE.md` — that file outranks this one, and
  duplicating it means two places to update. `RULES.md` may *sharpen* a CLAUDE.md
  rule for reader steps specifically; it must never contradict it.
