# Reader-step rules

The active house style for course-reader steps. **Read all of it before writing
or editing a step.** Every rule here came from the owner reacting to a real
step, except the seeds marked *(inherited)* — those come from `.claude/CLAUDE.md`
and the memory index and are restated here only because they bite hardest in
reader steps.

Ids are stable. A withdrawn rule is struck through, never deleted.

---

## W — Writing

- **W-1** *(inherited)* Banned words: tapestry, nuance, multifaceted, robust,
  delve, foster, Furthermore, It's worth noting, landscape, journey, empower,
  leverage (as a verb), game-changer, seamless, holistic, synergy.
- **W-2** *(inherited)* Make the point and stop. No padding, no restating the
  section heading as the first sentence, no summary paragraph that repeats what
  the reader just read.
- **W-3** *(revised 2026-08-01)* Lead a section with the thing **in the flesh** —
  a decision someone has to make, a figure, a named company, a dated case — and
  let the definition follow it. "In this section we will look at…" was always
  banned; so now is opening on "X is the function that…", which is a warm-up
  wearing a definition's clothes. A reader will hold a definition once they have
  something to hang it on, and not before.
- **W-4** Second person, present tense. The reader is doing the analysis:
  "you discount each year's cash flow", not "the analyst discounts…".
- **W-5** Define a term the first time it appears, in the same sentence, then
  use it plainly afterwards. No glossary detours mid-explanation.
- **W-6** The step's first two sentences put something at stake — a failure, a
  cost, a decision that could go either way, a number that surprises. The first
  screen decides whether the rest gets read. Test: cover everything below the
  first paragraph; would a student with a free evening keep going?
- **W-7** Vary the rhythm. Three long paragraphs stacked in a row read as grey
  regardless of what they say. Break them — a short sentence on its own, a
  table, a callout, an `h2`. Test: no section is three consecutive `p` blocks of
  50+ words.
- **W-8** Bold the phrase worth carrying out of the section, with `**…**`.
  **One to three per section**, never a whole sentence of a paragraph and never
  two in the same sentence. It marks the thing a reader skimming the step the
  night before an exam must land on: the rule, the distinction, the figure that
  decides the case — not a term being defined (**W-5** already handles those)
  and not a heading in disguise. A section with nothing worth bolding is a
  section with nothing to carry; that is the finding, not a licence to skip.
  Test: read only the bold in a step end to end — it should be a usable summary,
  and it should not be half the words on screen.
- **W-9** Write to the reader as someone who will **run** this, not someone
  revising it. They are a future founder and the material is theirs to use, so
  the sentence lands on their decision: "the first time you decide what to keep
  on your own desk", not "the exam asks you to sort tasks between them". Hand
  over the judgement rather than the mark scheme — say what the choice costs
  them, what they can survive without while small, what they are buying when
  they hire. Exam framing is allowed where it is genuinely the point (a method
  the paper demands by name), but it is never the default voice.

## E — Page elements

The block vocabulary. Each block exists for one job; using the wrong one is a
correctness problem, not a taste problem.

| Block | Its job |
|-------|---------|
| `p` | Prose. The explanation. |
| `h2` | A named idea inside a section. |
| `ul` | Genuinely unordered, parallel items. |
| `callout` | One boxed sentence that must survive when everything else is forgotten. |
| `formula` | A display equation, with its symbols named underneath. |
| `table` | Anything with columns — workings, comparisons, waterfalls. |
| `playground` | Runnable code. Not used in finance courses. |

Two inline marks exist inside `p`, `ul` and `callout` text, and no others.
`**bold**` (**W-8**) and `[[term|definition]]` (**E-8**). There is no italic, no
link and no nesting — anything else is typed literally on screen.

- **E-1** A financial waterfall (FCF build-up, NPV workings, cumulative payback)
  is a `table` with right-aligned amounts — never a `ul` of "Revenue X, Costs
  (X)". The whole point is that the numbers line up.
- **E-2** Every `formula` names its symbols in `where`. A formula whose letters
  aren't defined on the same screen is decoration.
- **E-3** One `callout` per section, at most. It carries the single sentence
  that closes the loop on that section. More than one and none of them land.
- **E-4** Negative amounts render in brackets — `(24,000)` — not with a minus
  sign. This is the convention the ZCAS lectures and every exam script use.
- **E-5** Money is `ZMW` with thousands separators. State the unit in the
  column header (`ZMW'000`) rather than repeating it in every cell.
- **E-6** Carried subtotals in a working go in `subtotals` (row indices), and
  the figure the working was building towards goes in `total`. Both get a rule
  above them and are set in ink — the way a working is ruled off on paper. Never
  fake a subtotal by bolding text inside a cell.
- **E-7** Steps run on the ZCAS lecture's own worked examples wherever the
  lecture has one, at its original figures, so a student can hold the step and
  the slide side by side. Where a slide contains an arithmetic error, use the
  correct figure and record the correction in the file's header comment.
- **E-8** A word that is **key or outside a first-year's vocabulary** gets a
  tap-to-define popup: `[[term|definition]]`. This is for the jargon the source
  material assumes and moves on from — *arbitrage*, *error account*, *front
  office*, *netting*. It is **not** for the terms the step is teaching; those
  are defined in the prose where the reader meets them (**W-5**), and a term
  the step exists to explain must never be demoted to a popup. Definitions are
  one or two sentences, in the house voice, and say why the word matters rather
  than reciting a dictionary — the second sentence is usually the useful one
  ("it stops being arbitrage the moment one leg is left open"). Budget roughly
  **three to eight per step**: dotted underlines every other line make a
  paragraph unreadable, and a step with none has probably not been read by
  anyone who didn't already know the subject.

## S — Structure

- **S-1** *(inherited)* One checkpoint per section — so a section is the unit of
  "I've got this". If a chunk isn't worth a checkpoint, it isn't a section; fold
  it into its neighbour as an `h2`.
- **S-2** A section carries one idea. Two ideas that need two different
  checkpoint questions are two sections.
- **S-3** The first section has no rendered heading (the reader shows the step
  title instead), so it must open the step, not sit as a peer of the others.
- **S-4** Write a `check` for every section. A checkpoint without one falls back
  to self-marked "done", which defeats the point — the reader is meant to
  demonstrate the idea, not assert it.
- **S-5** A check's wrong options must be wrong for a *reason a student would
  actually get wrong* — the common slip, not a nonsense number. `explain` says
  why the right answer is right, in one or two sentences.
- **S-6** *(inherited)* No course skeleton inside a step. Don't list the other
  steps; the sidebar already does that.
- **S-7** A definitional table — a list of functions, levels, structures, types —
  never carries a section alone. It gets a reason the list has that shape before
  it, and a handle for using it after: the split to recover it from, a worked
  classification, or the exam-technique line. A table dropped between two
  paragraphs of prose is the slide retyped.

## C — Content

- **C-1** *(inherited)* Every example uses ZMW and Zambian companies — Zanaco,
  Zambeef, ZESCO, First Quantum, Airtel Zambia, LuSE-listed names.
- **C-2** Cover what the ZCAS lecture covers, at the depth the lecture and its
  practice questions demand. The step is exam preparation; an idea the lecturer
  spent four slides on cannot become one sentence.
- **C-3** Where the lecture works a numeric example, the step works one too —
  with the arithmetic visible, so the reader can follow each line rather than
  trusting the answer.
- **C-4** Keep the lecture's notation and method names (DPP, MIRR, PBIT) so the
  step and the exam paper speak the same language, even where a clearer term
  exists.
- **C-5** Every section carries at least one concrete anchor — a named company,
  a figure, a date, a decision with a wrong answer. A section that is definition
  end to end is a slide. Note that this is how **C-1** gets dodged: a step with
  no examples at all never technically breaks the ZMW/Zambian rule.
- **C-6** Where the syllabus has a famous case — Barings, Enron, the 2008
  collapse — tell it properly: the date, the figures, the person, what they
  actually did. One line of "Barings is the exam case" wastes the only thing in
  the section a student will still have in the exam hall. Two or three sentences
  is enough; it must have facts in it.

---

*Rules marked* (inherited) *are seeds from `.claude/CLAUDE.md`. Everything else
came from a logged reaction — see `LOG.md` for the words that produced it.*
