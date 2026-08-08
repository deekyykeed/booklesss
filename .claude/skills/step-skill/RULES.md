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

- **W-16** **Write it clear and direct, for an average reader.** *(added
  2026-08-03)* W-15 says the weakest reader must get through; this is the
  sentence-level version of it, and it is the one that gets broken while every
  measurable rule passes.
  - **Never open on notation, jargon or an abbreviation the reader has not been
    given.** `Terms of "2/10 net 30" look like a small courtesy` opened a step
    while `2/10 net 30` was not explained until four blocks later. The owner:
    *"i dont even know what 2/10 means in this context."* If a term must appear
    early, **say what it means in the same sentence** (**W-5**) or show the
    thing first and name it after (**W-13**).
  - **Give the reader the situation before the technique.** A step that starts
    explaining is a step that assumed context the reader does not have. One
    customer, one invoice, one number, and then the method.
  - **Face the right way.** Check that the opening is about the same thing the
    step is about. *Getting the cash in* is money owed **to** you, and it opened
    on a discount **you** take from **your supplier** — the opposite direction,
    so the reader had to turn the whole thing round before paragraph three told
    them which side they were on. Read the title, then read the first sentence,
    and make sure they are facing the same way.
  - **Prefer the plain word every time the technical one is not the point.**
    "waiting to be paid" over "receivables ageing", unless ageing is the thing
    being taught.
  - Test: hand the first screen to someone who has not done the course. If they
    have to ask what a symbol, abbreviation or number means, it is a rewrite.

- **W-17** **Cut it down. Then check you did not cut the reader out.** *(added
  2026-08-07)* Every paragraph gets one question asked of it before it ships:
  *is there a shorter way to say this that a reader still follows?* Attention is
  the scarce thing here, not space. A student opening a step at 11pm gives it a
  few minutes, and they do not stop reading at the paragraph that wandered —
  they stop reading at the step. A paragraph that spends ninety words doing
  sixty words of work is charged to the whole thing.
  W-2 bans padding and W-12 bans the sentence that runs past its point. This is
  the pass neither catches: prose where every sentence is legal, nothing is
  padding, and the passage is still longer than the idea in it.
  - **Ask it of the paragraph, not the sentence.** The common shape is three
    tight sentences making one point three ways. Each survives W-12 on its own.
    Keep the best one.
  - **What goes is the run-up, never the substance.** The sentence that sets up
    the sentence that makes the point. The clause restating the clause before
    it. The qualifier defending against an objection nobody raised. The
    "essentially", "in practice", "it is important to note that".
  - **The floor is W-15, and it is a real floor.** Compression that removes the
    step someone needed is not concision, it is a gap with fewer words in it. A
    reader at the edge of their English is carried by the concrete anchor, the
    second way of putting it, the *which means* clause. **Those words are the
    work.** Cut around them, not through them.
  - **Vagueness is not concision, it is the other failure.** "This affects
    liquidity" is shorter than a worked figure and teaches nothing. If a cut
    makes a sentence more general, it was the wrong cut: the fastest sentence
    is usually the most specific one, because a number does in four words what
    a description does in twenty.
  - Test: rewrite the paragraph at half length. If the half teaches the same
    thing, ship the half. If something is now missing, you have just found what
    the paragraph was actually for — keep that, cut the rest.

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
- **E-8** ⚠️ **THE TAP-TO-DEFINE POPUP IS SWITCHED OFF** *(owner, 2026-08-07:
  "disable text popups from the app entirely for now")*. A `[[term|definition]]`
  still parses, still validates and still renders its **word** — but as ordinary
  prose, with no underline and no popup, so **the definition reaches nobody.**
  Until it comes back:
  - **Anything the reader cannot proceed without is defined in the prose**, in
    the sentence that first uses it (**W-5**). That was always the rule for
    terms the step is teaching; while the popup is off it covers every term
    that is load-bearing, not just those.
  - **Keep authoring `[[term|definition]]` for the rest.** The mark costs
    nothing on screen, the definitions are the expensive part to write, and
    turning the popup back on is one branch in `reader/LessonView.tsx`. Deleting
    them would throw away work to gain nothing.
  - **Do not compensate by parenthesising every term.** A definition in
    brackets is read by everyone, including the reader who already knew the
    word, which is the exact cost the popup existed to avoid. Define what the
    reader is stuck without; leave the rest marked and wait.

  The rule as it stands when the popup is on: a word that is **key or outside a
  first-year's vocabulary** gets a tap-to-define popup: `[[term|definition]]`.
  This is for the jargon the source
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

- **E-10** **A callout has a kind, and the kind carries meaning the sentence
  does not.** *(added 2026-08-07)* The reader draws four, each with its own
  Solar Duotone mark and its own hue, and the mark is the box's only label:

  | `kind` | Reads as | For |
  |---|---|---|
  | `key` *(default)* | Key point | The one sentence that must survive when the section is forgotten (**E-3**) |
  | `warning` | Watch out | The trap. The slip that loses the mark, the assumption that breaks, the thing that looks right |
  | `example` | Example | A case set out to be worked, including the one handed to the reader unworked (**C-9**) |
  | `exam` | In the exam | What the paper actually does with this: how it is asked, what it awards, the method it demands by name |

  **Measured 2026-08-07: none of the 60 callouts in the 53 authored steps sets
  a kind.** Every box in the product says "Key point", including the ones that
  are a trap and the ones that are an exam instruction. The kinds have been
  drawable the whole time; nothing was ever wrong on screen, so nothing said so.
  - **Set the kind on every callout you write.** `key` is a choice as much as
    the others are, not a default to fall into.
  - **E-3's one-per-section limit is about `key`, not about the box.** One
    sentence per section is the one worth carrying. A `warning` naming the slip
    or an `example` posing a task is a different job, and a section can hold
    one of those beside its `key` without the pair cancelling out. Three boxes
    in a section is still too many.
  - **The kind must be true.** An `exam` box that says something generally
    useful rather than something the paper does is worse than no box, because
    the reader files it as exam technique and it is not.

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

- **S-11** **Every course opens with a step about the course.** *(added
  2026-08-07)* Step one is not the first topic. It is the reason the other
  forty are worth the hours they will cost. The owner's words: *"for someone to
  actually start spending incredible amounts of time doing this course and
  solving all the problems, there needs to be a good reason for why we're doing
  this course and how it's going to elevate the person for doing it."*

  A reader arriving at a course they were assigned has already been told what it
  is called and nothing else. **The most expensive thing a course can do is
  start teaching.** This step is where the context goes, and it carries five
  things:

  | | What it does | Watch for |
  |---|---|---|
  | **The stake** | Why this subject exists at all — the thing that goes wrong in the world when nobody can do it | **W-6** and **W-14** bind here like anywhere. Not "Treasury management is an important discipline" |
  | **Where it sits** | What it connects to, in subject terms — what it assumes, what it feeds, which other things they are studying it beside | **Never by course code or school name.** Say "the accounting you already do" |
  | **Where it lands** | What someone who has this does at work, and what someone without it cannot. Named roles, real decisions, real money | This is the "how it elevates them" half, and it must be specific enough to be checkable |
  | **The welcome** | One line congratulating them for starting | **One line.** See below |
  | **How to read it** | What the reader gives them, named where it is about to be used | **Not a product tour.** See below |

  - **Congratulate them once, in a sentence, and mean it.** Starting is the
    hardest part and most people never do, so it is worth saying. A banner, a
    paragraph of encouragement, or an exclamation mark is worse than silence:
    it reads as marketing, and the reader came to study. Earn it by being
    specific about what they have started, not about how great they are.
  - **Name the features where they are about to be used, not as a list.** "Each
    section ends with a question — get it wrong and it tells you why" belongs in
    this step because they meet the first one two screens later. A tour of the
    interface is furniture (**C-7**'s whole lesson), and a reader skips it.
  - **This is NOT a course skeleton, and S-6 still stands.** Do not list the
    lessons or the steps: the sidebar does that, it goes stale, and it is the
    exact thing the owner banned. The difference is that a skeleton says *what
    is in the course* and this step says *what the course is for*. If you find
    yourself writing "we will cover", stop.
  - **Give the shape in one sentence, not a contents page.** "This course is
    about getting money in, keeping it safe, and paying for it" is orientation.
    Five bullets naming five lessons is a skeleton.
  - **It is a real step**, with sections and checks like any other (**S-1**,
    **S-4**) — but the checks are about the subject's shape and stakes, not
    about the app. A check on where treasury sits between the business and the
    banks is fair; a check on where the sidebar is, is not.
  - **Two to three sections**, and it is the shortest step in the course.
    Whatever else it does, it must not become the first climb (**S-8**).
  - **It keeps the first slot and the first slug**, above the first lesson
    folder, and its label is the course's own name or something close to it.

- **S-12** **A title is Title Case, and it makes a claim.** *(added 2026-08-08)*
  **S-10** settles which of a step's two names is which; this settles how either
  of them is written. The owner, reading the course: *"a title is supposed to be
  capitalised properly and seriously"*, and of the set as a whole — *"they lack
  a certain assertiveness and feel like they aren't bold or confident."*

  A title is the only part of a step every reader sees, in four places at once:
  the sidebar row, the `<h1>`, the browser tab and the WhatsApp card. It is a
  **name**, not a sentence about the step, and a name that hedges reads as
  material that hedges.

  **Capitalisation.** Title Case, one convention, no exceptions to argue about:
  capitalise the first and last word and every other word **except** articles
  (*a, an, the*), coordinating conjunctions (*and, but, or, nor, for, so, yet*)
  and prepositions of four letters or fewer (*of, in, to, for, on, at, by,
  with*). *"The Three Levels of Treasury"*, *"Debt Sources and Maturity"*. An
  abbreviation keeps its own case (*NPV*, *WACC*, *EOQ*), and **C-4** decides
  whether it belongs in a title at all.

  **Three shapes that are banned, because they were the whole disease.**
  Measured on Treasury Management, 2026-08-08 — 21 of its 22 titles broke at
  least one:
  - **The hedged tail.** *"Working capital, and how much of it to run"*,
    *"What debt costs, and what it demands"*. **Thirteen of twenty-two** carried
    a `, and how/what/where…` clause. One title doing this is a subtitle; the
    whole course doing it is a tic, and by the fourth row the reader has stopped
    reading past the comma. Name the thing and stop.
  - **The casual verb phrase.** *"Getting the cash in"*, *"Putting it to
    work"*, *"Living with it"*. It sounds like a chat about the topic rather
    than the topic. **A gerund is not itself the problem** — *"Hedging Foreign
    Exchange Risk"* is a serious title — the problem is a verb phrase that
    names no technique.
  - **The question in disguise.** *"What treasury is and what it does"*,
    *"How much to order, and when to pay"*. A title that opens on *what* or
    *how* is describing the step to itself.

  **What to write instead: the noun phrase a syllabus would use.** *"The
  Treasury Function"*, *"Optimal Cash Balances"*, *"Payment Systems and Central
  Counterparties"*. It should be the phrase a student would type into a search
  box the night before the exam, which is also the phrase the paper uses
  (**C-4**).
  - **Serious is not dull, and dull is not the fix.** A title earns its
    confidence by being **specific**, never by being loud. *"The Price of
    Debt"* is assertive; *"Debt: The Silent Killer"* is a headline, and a
    student paying for a course can tell.
  - **It must face the same way as the step** — the second half of **W-16**.
    Read the title, then the first sentence, and check they are about the same
    thing from the same side.
  - **Lesson and grouping labels follow the same rule**, and so does a step's
    `kicker`: they are names in the same column, and a Title Case step under a
    sentence-case folder looks like a mistake in the product rather than a
    choice.
  - **Section `heading`s do NOT.** They stay sentence case. A heading is a
    signpost inside a piece of reading, not a name the step travels under, and
    Title Case on every `h2` turns a page into a contents list.
  - Measurable: `node .claude/skills/step-skill/tools/title-scan.mjs Schools`
    flags case defects, hedged tails, question openers and dangling particles,
    and exits on the count. Baseline 2026-08-08 is **194 defects in 56 of 56
    authored steps** — nothing in the product passed (debt **D-17**).
  - **The scan cannot see the half that matters.** Whether a title is assertive
    is not a regex question, and "Treasury Things and Other Matters" passes
    every check in it. Read the sidebar column top to bottom as a stranger, the
    way **W-16** asks for first screens: does each row tell you what you would
    get, and would you tap it?

## C — Content

- **C-1** *(inherited)* Every example uses ZMW and Zambian companies — Zanaco,
  Zambeef, ZESCO, First Quantum, Airtel Zambia, LuSE-listed names.
- **C-2** *(revised 2026-08-07)* **The source of truth is the material the
  course already comes with.** The owner's words: *"the source of truth for any
  school is the material it already comes with. Slides, transcripts and other
  things."* The syllabus is set by whoever teaches the course, never by this
  skill and never by what a model happens to know about the subject. Cover what
  **this course's** own material covers, at the depth it demands: an idea the
  lecturer spent four slides on cannot become one sentence.

  **Read the lesson folder before writing, all of it.** What is in there varies
  by course, and each kind answers a different question:

  | Source | The question only it answers |
  |---|---|
  | **Slides / lecture decks** | What is on the syllabus, in what order, and in whose notation (**C-4**) |
  | **Lecture transcript** | What the lecturer actually *dwelt on*. A slide gives every bullet equal weight; ten minutes of talking over one of them does not |
  | **Past papers** | What is genuinely examined, how it is asked, and how often. This outranks a topic's slide count |
  | **A marking key**, where one exists | What earns the mark. The most direct evidence in the folder of the depth required, and the rarest |
  | **Assignment briefs** | What the reader is being asked to produce *this* semester |
  | **Module handbook / scheme of work** | The official coverage claim, and what the course says it is for |
  | **Set textbook** | Where to go deeper, and the worked examples the lecture compressed |

  - **Weight them by what they are evidence of.** Where the slides and a past
    paper disagree about how much a topic matters, **the paper wins** — it is
    what the reader is sitting. Where the slides and a textbook disagree about
    method or notation, **the slides win** (**C-4**), because the marker is
    holding the slides.
  - **A transcript is a source, not a transcript.** Where a course's lectures
    were recorded, `python3 tools/transcribe.py` puts a `_transcript.md` beside
    the video and that file is read the same way the deck is. It is often the
    only place an examiner's emphasis is written down.
  - **Say what a step was built from**, in the file's header comment, naming
    the actual files. That is what lets the next person check a figure against
    the slide it came from, and it is how **E-7**'s corrections stay auditable.
  - **A gap in the material is a finding, not a licence.** If the folder has no
    source for something the step needs, say so to the owner rather than
    filling it from general knowledge. General knowledge is not wrong; it is
    just not what the paper is set from.
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
  - **One chip per PAGE, labelled with that page's own title** *(revised
    2026-08-07; it was one chip per site, labelled with the site's name)*. The
    owner: *"the text should be the title of the page on the source, not the
    name of the company or website."* A chip reading "Corporate Finance
    Institute" answers a question about **who**; the reader is asking **what is
    behind this paragraph**, and "Net Present Value" tells them whether it is
    worth the tap.
    - The title is fetched at build by `npm run gen:favicons`, cleaned of the
      site name publishers bolt onto a `<title>` for search engines, and cut to
      48 characters on a word boundary. A page that cannot be read falls back to
      the site name, so a chip is never empty.
    - **Two pages from the same site in one block now show as two chips**, and
      both are reachable, where the old rule collapsed them into one and lost
      the second. The strip still dedupes the same URL cited twice.
    - **This makes C-7's "two or three sites per section" tighter, not looser.**
      Four chips under a paragraph was already the shape that read as furniture,
      and four *titles* is longer than four site names. Keep the budget.
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

- **C-8** **Steps refer to each other, run on from each other, and now link to
  each other.** *(added 2026-08-02, revised 2026-08-07)* A course is one
  argument told over forty steps, not forty handouts that happen to share a
  folder. The owner's words: *"a course needs to feel like a network of
  steps."* A step should be visibly downstream of what came before it and
  visibly pointed at what comes next, so a reader finishing one has a reason to
  open the next rather than a decision to make.
  - **Pick the thread up.** Where a step uses something an earlier step
    established, say so in passing: *the same operating cycle from the last
    step, now with the creditor side on it*. One clause. It tells the reader
    their earlier work is being spent, not repeated.
  - **Hand the thread on.** End on the question the next step answers, inside
    the prose, at the point it becomes obvious. Never a labelled "Next:" row —
    the reader already has a real link at the foot of the step, and a labelled
    pointer goes stale the moment the order changes.
  - **A reference must survive being read alone.** This is the hard constraint
    and it beats everything else here. A reader arrives mid-course from a shared
    link, a resumed position or the sidebar, so anything load-bearing has to be
    re-stated in enough words to stand up here. "As we saw with Barings" is not
    a reference, it is an assumption. Give the fact again in a clause and then
    build on it. **A link does not lift this.** A reader who has to leave the
    step to follow the sentence has been sent away mid-idea, and most of them
    will not come back.
  - **Never in the opening sentence.** A callback across a step boundary is
    banned there outright — see **W-13**'s fourth bullet, which exists because
    exactly this was tried and the owner could not follow it.

  ### The link itself *(new 2026-08-07)*

  **A step reference is now a real link:** `[the words](step:its-slug)`,
  rendered as the only visible link in the reading. **This reverses "plain
  text, always", which stood until today** and which `.claude/CLAUDE.md` still
  stated as a general rule. That rule was right about *Slack*: Slack minted a
  new unpredictable file id on every upload, so an embedded file link went
  stale the same day. None of that is true of the reader. A step's slug is
  authored in its own `.mjs`, it is the string the sidebar and the URL are both
  built from, and **the reader resolves the slug to a path at render** — so
  moving a step into a different lesson re-points every link to it instead of
  breaking them. The failure the old rule protected against cannot happen here.
  - **Link the words, never a bare pointer.** `[what a covenant costs
    you](step:the-price-of-debt)`, not "see the step on debt". The phrase the
    reader is already reading becomes the door.
  - **`seed:course` refuses a slug no step in the course answers to**, refuses
    a lesson or group slug (a folder has no page), and refuses a step linking
    to itself. A typo blocks the write rather than shipping a dead link into
    somebody's exam week. Links are **within one course**: seeding runs one
    course at a time and cannot check another's slugs, so a cross-course link
    is refused rather than shipped unverified.
  - **Two or three per step, at most.** This is the same discipline **C-7**
    puts on sources and for the same reason. A paragraph with a link every
    other line stops being reading and becomes a menu, and the reader who
    follows all of them never finishes anything. **A step with no links is
    fine**; a step that cannot be read without following one is broken.
  - **Link backwards freely, forwards rarely.** A backward link is an offer to
    a reader who knows they missed something. A forward link invites them to
    leave before they have finished, and the sidebar and the foot of the step
    already carry what comes next. Where a forward reference earns its place,
    it goes at the **end** of the step, which is where the reader is leaving
    anyway.
  - **Never inside `**bold**` or `[[term|…]]`** — the marks do not nest, so the
    words render and the link silently vanishes. Pick a different phrase.
  - This is a **flow** rule, not a summary rule. It does not license a "recap of
    the last step" block, which is **S-6** all over again: the reader either
    read it or can go back to it — and now, can tap to.

- **C-9** **Show one worked. Hand the next one over unworked.** *(added
  2026-08-07)* **C-3** says that where the lecture works a number, the step
  works one too. That is the demonstration, and on its own it teaches
  recognition rather than method: a reader can follow every line of a worked
  example and still not be able to start a blank one. The owner's words:
  *"important pieces are worked and unworked examples in cases of mathematical
  courses."*

  Where a step teaches something the reader will have to **produce** — a
  calculation, a valuation, a classification, a test applied to facts — it
  carries both:
  - **The worked one.** Every line visible (**C-3**), at the course material's
    own figures (**E-7**), so the step and the slide can be held side by side.
  - **The unworked one.** Same method, different figures, and it **stops**. It
    is a `callout` with `kind: "example"` (**E-10**) posing the task, and the
    section's `check` is what marks it: the options are the answers the common
    slips actually produce (**S-5**), so a reader who works it finds their
    number in the list and a reader who does not is guessing between four.
    **That gap is the rule doing its job.**
  - **Change the figures, not the difficulty.** The second one is the same
    method on a different case, never a harder variant. You are asking whether
    they can start, not examining them.
  - **Put the answer where they will look after trying, not before.** The
    check's `explain` carries the working, not just the verdict. A reader who
    got it wrong needs the line they missed.
  - **Take it from the past papers where there are any** (**C-2**). A question
    the paper has actually asked beats one invented for the step, and the
    folder usually has a dozen.
  - **Not every step is like this.** A step teaching what a thing *is* has
    nothing to hand over, and inventing a drill for it is worse than leaving
    it. The trigger is whether the exam will ask the reader to produce
    something — which is a question about the **discipline** (**C-11**), not
    about this rule.

- **C-10** **Pick the example the reader has already felt.** *(added
  2026-08-07)* **C-1** fixes the currency and the companies; **C-5** requires an
  anchor in every section. Neither asks the question that decides whether an
  example lands: **has this reader ever been in this situation?** ZMW and a
  Zambian name make an example local. They do not make it recognisable to a
  nineteen-year-old who has never run a treasury, sat on a board or issued a
  bond. The owner's words: *"is there a better way to reword or rewrite an
  example so it's more relatable?"* — and that question gets asked of every
  example before it ships.
  - **Enter through the mechanism they know, then scale to the syllabus.** The
    reader has waited to be paid back by a friend, watched a price move between
    two shops, put money into a chilimba, seen someone pay kaloba rates because
    they needed cash today. Those are the same mechanisms as receivables,
    arbitrage, pooled funds and the cost of short-term debt. Start where they
    have stood, name the corporate version, then work at the corporate scale.
  - **This does not license writing down to them.** **W-9** still holds: they
    are a future founder and the material is theirs to run. Relatable is about
    the **way in**, not the ceiling. A step that stays at bus fares has failed
    **C-2** as surely as one that opens on translation exposure.
  - **The strongest version is a situation with a feeling in it.** "You have
    paid every instalment on time, in full, for four years. You are in default."
    A reader who has never seen a covenant knows exactly what it is to do
    everything right and be told it is wrong. That sentence does more work than
    the definition after it, and it cost nine words.
  - **Test it by naming the reader.** Not "would a student find this
    relatable", which always answers yes. *Which* student, doing what, when
    have they been near this? If the honest answer is "nobody reading this
    has", the example is a fact about the world rather than a way into it, and
    it needs one in front of it.
  - **A borrowed example ages.** Where the course material's own example is
    remote (a 1990s London bank, a US retailer), keep its figures for **E-7**
    and put a reachable case beside it. Do not replace it: the slide is what
    the marker is holding.

- **C-11** **Name the discipline before writing, and load its profile.**
  *(added 2026-08-07)* This skill is the house style for **every** Booklesss
  course, and 598 of the 602 in the pipeline have not been built yet. Most of
  the rules above are about writing and hold everywhere. A few are shaped by
  the fact that every course written so far has been finance, and applying
  those to a law or a history course would produce something confidently wrong.
  - **Decide, in one line, what kind of course this is** before the first
    section: what the exam asks the reader to *produce*. A calculation? An
    argument applied to facts? A classification defended? A design? That answer
    is what **C-9** turns on, what **C-5**'s "concrete anchor" means, and which
    of the **E** blocks the step will live in.
  - **Read `reference/disciplines.md`** for the profile, and follow it. It says
    which rules bind unchanged, which are read differently, and which do not
    apply at all.
  - **Say the profile out loud in the file's header comment**, beside the
    sources (**C-2**). It is the assumption every other decision in the step
    rests on, and the next person editing it should not have to infer it.
  - **A course that fits no profile is a finding.** Write the step against the
    universal rules, say plainly which conventions you invented, and add the
    profile once a second course of that kind proves it. **Do not invent a
    taxonomy ahead of the material** — every profile in that file came from a
    course that was actually built.

---

*Rules marked* (inherited) *are seeds from `.claude/CLAUDE.md`. Everything else
came from a logged reaction — see `LOG.md` for the words that produced it.*
