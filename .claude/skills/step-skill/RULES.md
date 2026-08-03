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
- **W-13** **A section's first sentence must land on a beginner.** The reader
  arriving at it knows only what the step has already taught them, and at the
  step's very first sentence that is nothing at all. Three specific bans:
  - **No word they have not met.** "Take one exposure and…" asks a first-year to
    already own *exposure*. Show the thing, then name it: the miller's wheat
    payment first, the word *exposure* after it.
  - **No count or pointer they cannot resolve.** "…pass through all three
    levels" before a single level has been named; "as we saw above" in an opening.
    Referring **back** to a section the reader has already read is fine, and
    normal. Referring **forward**, or to something never explained, is not.
  - **No narrating the teaching device.** "Take one X and watch it…", "Let's walk
    through…", "Consider the following…". These announce a demonstration instead
    of starting it, and the seam of the technique shows. The device is usually
    right; saying it out loud is what costs. Delete the announcement and begin at
    the case.
  - **No name the step has not itself introduced.** *(added 2026-08-02)* A
    person, company or case told in a **different** step is a stranger here.
    "Leeson dealt his own trades and then settled them himself" opened TM 1.3,
    and Barings is told properly in TM 1.2, one step earlier; the owner's
    reaction was "I don't get that story you've started with". Referring back
    **within** a step is fine and normal. Referring back **across a step
    boundary** is not, because the step is the unit a reader arrives at: from
    the sidebar, from a resumed position, from a shared link. Either tell the
    case again with enough facts to stand alone, or open on something else and
    reach it second.

  Test: read each section's first sentence **alone and cold**. If it contains a
  term, a number or a reference the reader could not already hold, rewrite it.
  This is the rule that keeps the course beginner-friendly at the exact moment a
  beginner decides whether to keep reading.

- **W-14** **The first sentence is the one that decides.** *(added 2026-08-02)*
  W-13 is the list of things a first sentence must not do; this is the thing it
  must do. It is the most-read sentence in the step and the only one every
  reader is guaranteed to reach, so it gets written last and hardest, after the
  section it opens exists and you know what the section actually turned out to
  be about.
  - **Spend the effort in proportion to the readership.** A step's opening
    sentence is read by everyone who opens the step; the fourth paragraph of
    section five is read by a fraction of them. Write in that order.
  - **It must be worth reading on its own.** A concrete situation, a figure that
    should not be true, a decision someone got wrong. Not a topic announcement:
    "Working capital is an important area of treasury management" tells a reader
    what the page is filed under, which the heading already did.
  - **Every section opening carries the same weight, not just the step's.** A
    reader who has scrolled through four sections is deciding whether to stay at
    each seam. That is why this is a rule about sections and steps both.
  - **Write it, then read it cold against W-13.** These two rules run together:
    W-14 makes the sentence worth reading, W-13 makes it readable. A sentence
    that passes one and fails the other is not finished.

- **W-15** **Write so the weakest reader gets through and the strongest is not
  bored.** *(added 2026-08-02)* The course is read by people at genuinely
  different levels — a repeat student who has seen the material, a first-year
  meeting it cold, someone studying in their second or third language. All of
  them paid the same and all of them have to get to the end. That is a
  constraint on the writing, not a reason to write two versions.
  - **Plain words for the ordinary parts, exact words for the technical parts.**
    The technical vocabulary is the thing being taught and must not be watered
    down; everything carrying it should be the simplest available. "The firm
    cannot pay its bills as they fall due" around *liquidity*, not "the entity
    experiences an inability to discharge obligations".
  - **One idea per sentence.** A sentence doing two jobs is where a reader at
    the edge of their English drops out, and it is invisible to whoever wrote
    it. This is what W-12's length limit is actually protecting.
  - **The hard bit gets a concrete anchor, not a second abstract restatement.**
    A reader who missed a definition is not helped by the same definition in
    other words. They are helped by a number, a company and a consequence
    (C-5).
  - **Depth goes in the detail, not in the difficulty of the prose.** A stronger
    reader is held by the worked example, the real case and the exam framing,
    all of which a weaker reader can still follow. Complicated sentences hold
    nobody.
  - Test: read the step imagining a first-year with adequate but not fluent
    English. Any sentence you would have to explain out loud is a rewrite.

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
| `cards` | A short set of *kinds* — levels, types, structures — one card each, with a mark. |
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
  sign. This is the accounting convention every lecture and exam script this
  skill has met uses.
- **E-5** Money is `ZMW` with thousands separators. State the unit in the
  column header (`ZMW'000`) rather than repeating it in every cell.
- **E-6** Carried subtotals in a working go in `subtotals` (row indices), and
  the figure the working was building towards goes in `total`. Both get a rule
  above them and are set in ink — the way a working is ruled off on paper. Never
  fake a subtotal by bolding text inside a cell.
- **E-7** Steps run on **the course's own lecture material** — whatever was
  handed to this course — using its worked examples wherever it has one, at
  their original figures, so a student can hold the step and the slide side by
  side. Where a slide contains an arithmetic error, use the correct figure and
  record the correction in the file's header comment.
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
- **E-9** **A short set of *kinds* is `cards`, not a `table`.** A table exists so
  figures line up. A list of levels, types, structures or roles has nothing to
  line up, so a table gives it none of the benefit and all of the cost: on a
  390px phone the last column wraps one word per line and then clips. The three
  treasury levels shipped exactly that way, with "bank communications" reading
  on screen as "communicatior".
  Each card carries a **Freehand Duotone mark**, a **title** (the thing named),
  a **lead** (its one defining property) and **text** (what it looks like in
  practice). One tone per card, cycled.
  - **Two to four items.** At five it is a `ul`, or it stays a table. Five cards
    is a scroll, and the set stops being holdable in one look.
  - **The marks must share an axis.** Pick them so the row teaches the
    distinction the section teaches: chess, calendar, clipboard-and-clock is
    long game / months / today, which is the *time horizon* that section is
    about. Three unrelated pictures are decoration, and decoration is worse
    than the table was.
  - Names come from `reader/card-glyphs.tsx`, and **`seed:course` refuses an
    unknown one** rather than rendering a blank space. Adding a glyph means
    fetching it from the Streamline MCP into that module — keep the set small,
    since it is imported by a client component and ships to every reader.
  - **A working stays a table.** If any cell holds a figure, E-1 and E-6 govern
    it and this rule does not apply. Run
    `node .claude/skills/step-skill/tools/table-scan.mjs Schools` to see which
    tables are which without opening 44 files.

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
- **S-7** *(revised 2026-08-01)* A definitional set — a list of functions,
  levels, structures, types — never carries a section alone. It gets a reason
  the list has that shape before it, and a handle for using it after: the split
  to recover it from, a worked classification, or the exam-technique line. A
  block dropped between two paragraphs of prose is the slide retyped.
  This rule is about the *framing*; **E-9** decides the *shape* — two to four
  kinds are `cards`, more than four stay a table or become a `ul`. A set can
  satisfy one and break the other, so check both.
- **S-8** **Split a long step into parts rather than making the reader climb
  it.** A step is the unit a reader finishes in one sitting, and finishing is
  what keeps them going: three steps done in an evening beats one step
  abandoned two thirds through. The nav tree nests, so a topic too big for one
  step becomes several under the same lesson node, each with its own slug, its
  own checkpoints and its own end.
  - **Never defer a split.** *(added 2026-08-02)* A step that is too long is a
    defect, and the only fix for it is the split, so it happens in the edit that
    finds it. Splitting changes URLs, the course manifest and the debt lists,
    and **that churn is the cost of the fix, not a reason to schedule it for
    later.** The owner's words: *"if a step is too long, that's a very big
    problem, and splitting it is the only solution. If you have to split it, you
    can split it and then deal with the links changing and everything."*
    A step left long because the follow-on work was inconvenient is the reader
    paying for the author's convenience.
    **This is not special to splitting** *(generalised 2026-08-03)* — every fix
    worth making can send a downstream bill, and none of them is a reason to
    stop or to ask. See "Improve the step. Deal with the consequences." at the
    top of `SKILL.md`.
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
  - **Re-read every part's openings after splitting, cold.** *(added
    2026-08-02)* A split silently orphans backward references across each new
    seam: a name, a count or a callback that was fine three sections down is a
    stranger at the top of its own step. Both of TM 1.3's section openings broke
    this way, and both had been correct before the split. The split is the
    moment to fix them, not a later reading. This is the fourth bullet of
    **W-13**, and splitting is the main thing that creates it.

- **S-9** **Group a run of steps into a folder rather than leaving a flat
  list.** *(added 2026-08-02)* The reader's sidebar tree is recursive —
  `children` nests as deep as it is given — and most courses only use two
  levels, so a lesson with nine steps under it renders as nine equal rows with
  nothing telling the reader which three belong together. **Nest to three or
  four levels wherever the material has that shape.** A course reaching only
  depth 2 everywhere is usually an un-taken opportunity, not a flat subject.
  - **Never waste a natural grouping.** If three consecutive steps share a
    subject — the three working-capital components, the two hedging instruments
    — that is a folder. The reader gets a name for the group, a collapsed row
    instead of three, and somewhere to stop.
  - **Three or four levels, not more.** Course → lesson → group → step is the
    working ceiling. Past that the indentation eats the label on a 390px phone
    and a reader cannot tell which level they are on.
  - **A folder needs a real name, not a number.** "Working capital" groups
    something; "Part 2" groups nothing and costs a row.
  - **Do not create a folder for one step.** A group of one is a step wearing a
    hat, and it adds a tap without adding a distinction.
  - This runs with **S-8**: splitting a long step is what creates the run of
    siblings that then wants a folder over it. Do both in the same pass — a
    split that leaves five flat rows where there was one has moved the climb
    from the page to the sidebar.

- **S-10** **A step has one name. `label` is `title`, shortened — never a
  second name for it.** *(added 2026-08-03)* Every step exports both, on
  adjacent lines, and they are not two fields for two purposes:

  | | what the reader sees |
  |---|---|
  | `label` | what they **tap** — the sidebar row, command search, the browser tab, the native share sheet, and the WhatsApp preview card |
  | `title` | what they **land on** — the `<h1>` at the top of the page |

  So the label is the name the step travels under and the title is the name it
  answers to. When they disagree the reader taps *"The yield curve"* and
  arrives at *"The term structure of interest rates"*, with no way to tell they
  got the right step — and if they were sent the link, the card in the group
  chat said one thing and the page says another. The owner, reading the reader:
  *"the titles of the steps are different from what I actually find on the
  page."*
  - **Default to making them identical.** If the title fits a sidebar row —
    about 32 characters, past which a phone truncates it — there is no reason
    for two strings. Write the title, copy it into the label, move on.
  - **Where the title is too long for a row, the label is the title cut down,
    not rewritten.** Every word of the label appears in the title, in the
    title's order. *"Inventory, and how it is financed"* → **"Inventory"** ✓.
    *"Theories of dividend policy"* → **"Dividend theories"** ✗ — same words
    reordered is still a different string to read.
  - **The only allowed substitution is an abbreviation the title spells out**,
    and only where it is the one the exam uses (**C-4**): "WACC" over "The
    weighted average cost of capital", "GDP", "NPV". A student who knows the
    abbreviation recognises the title instantly; that is the test.
  - **No `&` in a label.** No title uses one, so it is a second spelling for no
    gain. The reader's word is "and".
  - **When they differ, shorten the label — do not lengthen the title.** The
    title is the sentence at the top of the page doing the work of naming the
    idea; the label is the handle. Rewriting a good title to match a lazy label
    fixes the mismatch by damaging the better of the two.
  - **Splitting is what breaks this.** *(measured 2026-08-03)* Four of the five
    outright renames in the baseline, and nine of the twelve reorderings, are in
    Treasury Management, and every one of them dates from the S-8 splits: a
    split invents two new titles at the seam, both written to say what that half
    is *about*, and the labels were left carrying the old topic name — "Debtors
    & factoring" over a page headed "Getting the cash in". **When you split a
    step under S-8, name both halves in both fields in the same edit.**
  - Measurable: `node .claude/skills/step-skill/tools/label-scan.mjs Schools`
    classifies every step and exits on the defect count. Baseline 2026-08-03 is
    **26 of 53** (debt **D-9**).

## C — Content

- **C-1** *(inherited)* Every example uses ZMW and Zambian companies — Zanaco,
  Zambeef, ZESCO, First Quantum, Airtel Zambia, LuSE-listed names.
- **C-2** Cover what **this course's** lecture covers, at the depth that lecture
  and its practice questions demand. The step is exam preparation for the paper
  the reader is actually sitting; an idea the lecturer spent four slides on
  cannot become one sentence. The syllabus is set by whoever teaches the course,
  not by this skill — read the material in the lesson folder and follow it.
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
  - **The link renders as nothing in the prose.** No underline, no colour, no
    weight, no mark at the end of the sentence. The sites turn up instead in a
    **source strip directly under the block that cites them** *(moved there
    2026-08-02)*: one round chip per site, its favicon and its name, on a
    single line that scrolls sideways if there are more than fit. Four
    arrangements were tried before this one — a "read further" box (furniture,
    arriving after the reader had finished), an underlined phrase (competing
    with bold and with tappable terms), a favicon at the end of each sentence
    (still punctuation inside the reading line), and one strip at the **foot of
    the section** (owner: down beside the checkpoint and the divider it read as
    page furniture, and by the end of a long section you had lost which claim
    it belonged to). The strip leaves the sentence alone and still says, at a
    glance, what *that paragraph* rests on.
    **No "SOURCES" heading over it** *(removed 2026-08-02, same reading)*. The
    word was there because a bare row of logos at a section's foot could have
    been a partner list; sitting under the paragraph, the position already says
    it. A label on a component whose whole point is not being furniture was the
    furniture.
  - **The brackets are a record, not decoration.** Since nothing shows in the
    prose, put them on the phrase the source actually backs: that is what the
    next person editing the `.mjs` will check the link against.
  - **One chip per site, per block** *(was per section, 2026-08-02)* — the strip
    dedupes within the block it sits under, so two Investopedia pages in the
    same paragraph show as one chip and only the first is reachable. Two pages
    in **different** paragraphs now each get their own strip and both are
    reachable, which the old section-wide strip could not do.
  - **Two or three sites per section**, spread across its blocks rather than
    stacked on one. More reads as a bibliography, and four chips under a single
    paragraph is the shape that made the old strip look like furniture.
  - **Vary the sites.** A step sourced entirely from one place looks like it was
    written from one place. Investopedia, Corporate Finance Institute, ACCA and
    AccountingCoach each explain a different kind of thing best.
  - A new site needs its mark: add a link, run **`npm run gen:favicons`**, and
    add its display name to `NAMES` in that script if the domain doesn't
    shorten to something a reader would say out loud.
  - ⚠️ **Investopedia cannot be link-checked from a Claude session.** It returns
    403 to curl, to Node fetch and to the web tools alike, so its URLs can be
    neither verified nor read here. Its favicon is bundled and ready. Either
    the owner confirms a URL by opening it, or the step uses a site that can be
    checked. Do not ship an Investopedia URL on the grounds that the pattern
    looks right — four of twelve CFI URLs guessed that way were dead.
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

- **C-8** **Steps refer to each other and run on from each other.** *(added
  2026-08-02)* A course is one argument told over forty steps, not forty
  handouts that happen to share a folder. A step should be visibly downstream of
  what came before it and visibly pointed at what comes next, so a reader
  finishing one has a reason to open the next rather than a decision to make.
  - **Pick the thread up.** Where a step uses something an earlier step
    established, say so in passing: *the same operating cycle from the last
    step, now with the creditor side on it*. One clause. It tells the reader
    their earlier work is being spent, not repeated.
  - **Hand the thread on.** End on the question the next step answers, inside
    the prose, at the point it becomes obvious. Never a labelled "Next:" row —
    the reader already has a real link at the foot of the step, and a pointer
    written into the content goes stale the moment the order changes.
  - **A reference must survive being read alone.** This is the hard constraint
    and it beats the other three. A reader arrives mid-course from a shared
    link, a resumed position or the sidebar, so anything load-bearing has to be
    re-stated in enough words to stand up here. "As we saw with Barings" is not
    a reference, it is an assumption. Give the fact again in a clause and then
    build on it.
  - **Never in the opening sentence.** A callback across a step boundary is
    banned there outright — see **W-13**'s fourth bullet, which exists because
    exactly this was tried and the owner could not follow it.
  - **Plain text, always.** A step reference is words, never a link to another
    step's file — see `.claude/CLAUDE.md`. The reader's own navigation is what
    moves someone between steps.
  - This is a **flow** rule, not a summary rule. It does not license a "recap of
    the last step" block, which is **S-6** all over again: the reader either
    read it or can go back to it.

---

*Rules marked* (inherited) *are seeds from `.claude/CLAUDE.md`. Everything else
came from a logged reaction — see `LOG.md` for the words that produced it.*
