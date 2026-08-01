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
- **W-8** *(revised 2026-08-01)* Bold the thing worth carrying out of the
  section, with `**…**`. **One to three per section**, never two in the same
  sentence. It marks what a reader skimming the step the night before an exam
  must land on: the rule, the distinction, the figure that decides the case —
  not a term being defined (**W-5** already handles those) and not a heading in
  disguise. A section with nothing worth bolding is a section with nothing to
  carry; that is the finding, not a licence to skip.
  **A whole sentence can be bolded when the whole sentence is the point** —
  "Treasury executes; it does not set strategy." Bolding a fragment of it would
  break the idea in half. What is banned is bolding a full sentence *by
  default*, or a long one that is merely relevant: if half of it could go and
  the point would survive, bold the half.
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
- **W-10** *(revised 2026-08-01)* Carry W-9 down to the **possessive**, but
  **sparingly**. Where a sentence turns on the reader owning the thing, it is
  *your*: "keeping **your** suppliers paid", not "keeping suppliers paid". Used
  once or twice in a section it hands over the material. Used in every sentence
  it becomes a tic, and the reader stops hearing it. **Budget: about one per
  paragraph, and never twice in a sentence.** The first mention in a passage
  earns it; after that "the" is fine, because ownership has already been
  established and the reader has not forgotten.
  **The exception is a worked example about somebody else**: a Zambian miller,
  a mining group, Barings. Those stay "the". Turning them possessive makes
  nonsense of the example and costs the word its meaning everywhere else.
  Test: count `your` against total words. Above roughly one per 90 words it is
  a tic, not a voice.
- **W-11** **No em dashes.** Not one, anywhere in a step: not in prose, not in
  a definition, not in a table cell, not in a check option. `.claude/CLAUDE.md`
  allows one per document; reader steps allow none. An em dash is almost always
  a sentence that hasn't decided what it is, and it is the single loudest tell
  that a machine wrote the line. Replace it with the punctuation that says what
  you actually meant:
  - the clause explains or names what came before → **colon**
  - it's an aside that could be cut → **comma pair**, or cut it
  - it's a second thought that stands alone → **full stop**, new sentence
  Rewrite the sentence rather than swapping the character in. "Its job is to
  protect your assets — while idle cash earns" becomes "…protect your assets,
  while idle cash earns". Test: `grep -c "—"` returns 0 before the step ships.
- **W-12** **Land the point and stop.** A sentence that runs past about 30 words
  has usually done two jobs, and the second one is where the reader's attention
  goes. Split it. Three clauses stacked behind a colon is a list pretending to
  be prose; make it a `ul`, or cut to the ones that matter.
  This is not an instruction to write short and choppy. Vary the length (**W-7**)
  and keep the serious, plain voice; what has to go is the sentence that keeps
  qualifying itself after the point has landed. Test: no sentence over 35 words,
  and the average well under 25.

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

Three inline marks exist inside `p`, `ul` and `callout` text, and no others:
`**bold**` (**W-8**), `[[term|definition]]` (**E-8**) and `[label](url)`
(**C-7**). There is no italic and **no nesting**, so a link cannot sit inside
bold and a term cannot sit inside a link. Anything else is typed literally on
screen. Note that table cells are **not** run through this: a cell is plain
text, so a mark written into one shows its own syntax.

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
- **S-8** **Split a long step into parts rather than making the reader climb
  it.** A step is the unit a reader finishes in one sitting, and finishing is
  what keeps them going: three steps done in an evening beats one step
  abandoned two thirds through. The nav tree nests, so a topic too big for one
  step becomes several under the same lesson node, each with its own slug, its
  own checkpoints and its own end.
  - **Target 2 to 4 sections per step.** At five, look hard for the seam. At
    six or more there is definitely one.
  - Split on a **conceptual seam**, not at the halfway word count. Each part
    must be a thing a reader can hold on its own and name afterwards: *what
    treasury is* / *how the work divides* / *how it is governed*. A part that
    only makes sense with the previous one open is not a part, it is a page
    break.
  - Keep the original slug on the **first** part. It is the one that is linked
    to, and a URL that already exists should keep meaning what it meant.
  - Order the parts so each one's ending sets up the next (**W-3** still
    applies: every part opens on something at stake, not on a recap).

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
- **C-7** *(revised 2026-08-01)* Link out to where the idea is **taught
  properly**, as an **inline link on the words the claim comes from**:
  `[the phrase](https://…)`. The lecture decks and textbooks a step is built
  from set what gets covered. They are the syllabus, not the teacher, and a
  reader can neither open them nor be sent to them. The teachers are the trusted
  public sites: **Investopedia**, **Corporate Finance Institute**, **ACCA**,
  **AccountingCoach** and their equivalents.
  - **No "read further" box.** A block of links at the foot of a section is
    furniture: it arrives after the reader has finished the idea, and it turns
    the source into a chore. Mark the words the claim came from instead, where
    the reader is already looking. (The `sources` block type existed for one
    afternoon and was removed.)
  - **Two per section, roughly**, and never two in the same sentence.
  - Link the **phrase the source backs**, not a bare word and not a whole
    bolded sentence. "so [six controls](…) are non-negotiable" reads as a
    citation; "click [here](…)" reads as an advert.
  - Deep-link the **specific page**, never a site home page or a search result.
  - Link the idea the section just taught, not a tangent. If a section has no
    good outside page, it gets no link. A filler link costs more trust than the
    empty space.
  - A link cannot sit inside `**bold**` or `[[term|…]]`; the marks don't nest.
    Pick a different phrase in the same sentence.
  - **Open the link before writing it in.** A dead or paywalled URL in a study
    step is worse than no link: the reader is at 11pm with an exam coming.
    `curl -o /dev/null -w '%{http_code}'` is enough for most sites. **Some
    block automated requests** — Investopedia returns 403 to curl and refuses
    Claude's fetcher entirely, so a 403 is not proof of a dead page and not
    proof of a live one. Either open it in a browser yourself or use a source
    that can be checked; do not ship an unverified URL on the grounds that the
    pattern looks right.
  - Never link a competitor's paid course, and never a school's material.

---

*Rules marked* (inherited) *are seeds from `.claude/CLAUDE.md`. Everything else
came from a logged reaction — see `LOG.md` for the words that produced it.*
