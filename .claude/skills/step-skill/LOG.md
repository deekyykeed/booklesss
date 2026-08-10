# Feedback log

Every reaction anyone has had to a reader step — the owner reviewing, the owner
studying for a real exam, or a student — newest first. Append-only: entries are
never edited or pruned, because "we've been here before" is the strongest signal
that something should become a rule.

Format:

```markdown
### YYYY-MM-DD · course/lesson/step · source
- `tag` — what they said, in their words. What changes as a result.
→ promoted: **X-n** · debt: **D-n**   (or → one-off · debt: none)
```

Sources: `owner` (reviewing) · `study` (owner studying it for the exam) ·
`student · <name>`

Tags: `writing` · `element` · `structure` · `content` · `error`

Quote actual words. A student's phrasing is never rewritten into the owner's.

---

### 2026-08-09 · treasury-management (whole course) + the skill · owner
- `structure` — "to really embrace having bite sized info that is easy to
  understand … id like each step in the case of treasury management to
  practically split the checkpoint, meaning only one checkpoint per step. that
  increases the number of steps for the course but its worth it as the read to
  that completion of the step is not so far away … **from now on a step is a
  small containable concept a user needs to understand.**" The grain of the
  product changes: a step is one concept, one section, one checkpoint. **S-1**
  is rewritten around it and **S-2**, **S-3**, **S-8** and **S-11** follow it
  down. TM converted the same day, 22 steps of 60 sections into 60 steps.
- `structure` — "this doesn encourage further nesting of steps which is fine.
  right now the deepest nest is 2 deep but we are capable of even 4 or 5 so
  lets get this done now." **S-9**'s ceiling moves from three-or-four levels to
  four-or-five. The one-checkpoint grain is what spends the depth: an old
  multi-section step becomes the named folder over its parts. Where the group
  above already names the family, the parts hang flat instead — adding a folder
  that repeats its parent costs a row and says nothing.
- `structure` — "splitting like this also allows me to **add a comment section
  that actually serves one section** rather than a whole bunch." Recorded here
  because it is the reason the rule is not merely about length: a note or a
  comment thread on a three-section step is a thread about three things at
  once, and nobody can tell which. This is the argument to reach for if the
  one-checkpoint grain is ever questioned on cost.
- `structure` — "add it to the **scoring criteria** so i can get other courses
  like this later." `rank.mjs` scores out of **6** now, S-1 first, and any step
  that is not exactly one section fails it. An unconverted course therefore
  fails every step by design, which is D-18 showing rather than noise.
- `element` — **E-8's budget was rescaled, not enforced**, and this is the
  judgement worth logging. Three to eight tappable terms was written for a
  two-to-four-section step; on the new grain it is one to three. Holding the
  old number would have meant inventing 300 definitions to satisfy a scanner.
  A budget written against the old grain has to be re-derived when the grain
  changes, not obeyed.
→ promoted: **S-1** (revised), **S-2** (revised), **S-3** (revised),
  **S-8** (revised), **S-9** (revised), **S-11** (revised), **E-8** (budget) ·
  debt: **D-18** (TM paid same day; CF, SM and economics owe it)

### 2026-08-08 · treasury-management (all steps) · owner
- `structure` — "the titles im coming across are poor… they lack a certain
  assertiveness and feel like they aren't bold or confident. a title is supposed
  to be capitalised properly and seriously." Two complaints in one, and both are
  measurable. **Case:** every title in the product is sentence case, so the name
  a step travels under reads as a sentence fragment rather than a name.
  **Register:** the set had one tic and it was everywhere. **Thirteen of
  Treasury Management's twenty-two titles ended in a `, and how/what/where…`
  clause** — "Working capital, and how much of it to run", "What debt costs, and
  what it demands" — and most of the rest were casual verb phrases ("Getting the
  cash in") or questions in disguise ("What treasury is and what it does"). One
  of those is a subtitle; twenty-two of them is a voice, and it is a hedging
  one. The fix is Title Case plus the noun phrase a syllabus would use, which is
  also what a student types into a search box the night before the exam (**C-4**).
  Section `heading`s deliberately stay sentence case: a heading is a signpost
  inside the reading, not a name.
  → promoted: **S-12** · debt: **D-17** (51 of 53 steps; TM's 22 paid the same
  day)

- `element` — "i want to move away from familjen font titles i want to use
  bricolage grotesk", and then, on seeing it live the same afternoon, **"bring
  the title back to familjen."** Applies to the step `<h1>`, not to
  `font-display` everywhere: the app chrome, the pickers and the settings rows
  were not what the owner was reading. It is a named token now,
  `--font-title` — which is what made both the change and the reversal one
  line, and is the reason the token stays even though it resolves to Familjen
  again.
  **What the round trip taught, and it is not about weight.** The weight went
  500 → 600 with the face and **stayed** at 600 after the face came back, so
  what was rejected was Bricolage specifically. A display face with that much
  personality in its letterforms, at 30px directly above a column of Aptos,
  announces itself rather than the title. A face chosen for the landing page is
  chosen against a photograph and a hero; a title face is chosen against the
  reading it must not compete with. Bricolage is front-door-only again.
  → promoted: none (app typography, not a step rule — recorded in
  `.claude/CLAUDE.md`) · debt: none

### 2026-08-07 · all courses · owner
- `content` — "the source of truth for any school is the material it already
  comes with. Slides, transcripts and other things." **C-2** named only "this
  course's lecture" and said to read the lesson folder; it did not say what is
  in one or how the kinds weigh against each other. Now it does, and the two
  that were missing entirely are the ones with the most evidence in them: a
  **transcript** says what the lecturer *dwelt on*, which a deck cannot (every
  bullet has equal weight on a slide), and a **marking key** says what earns
  the mark. Treasury Management's folders carry twelve past papers and a
  marking key and no rule had ever mentioned either.
  → promoted: **C-2** (revised) · debt: none — published steps were built from
  the material; this changes how the *next* one reads it

- `content` — "important pieces are worked and unworked examples in cases of
  mathematical courses." Found live in `the-price-of-debt`: it prices a bond to
  the kwacha, line by line, and then asks a multiple-choice question about
  which direction prices move. **A reader could pass that step's own check
  without being able to price a bond.** Every quantitative step in the product
  is shaped this way — the examples are all worked *for* the reader and none is
  handed *to* them. The fix needs no new block: an `example` callout poses it
  and the section's `check` marks it, with the wrong options set to the answers
  the real slips produce.
  → promoted: **C-9** · debt: **D-13**

- `writing` — "is there a more concise way of setting up this sentence or
  paragraph that doesn't lose the user?" and "people have limited attention
  spans, so it's important to make sure we are not boring or taking too long or
  being too vague." The second half is the rule. **W-2** bans padding and
  **W-12** bans the sentence that runs on; neither catches prose where every
  sentence is legal and the passage is still longer than the idea in it. The
  clause that matters is *"that doesn't lose the user"* — this is not licence
  to compress, and cutting the concrete anchor a weak reader was holding is a
  gap with fewer words in it, not concision. **"Too vague" is the other failure
  and it is written into the rule**, because the cheapest way to make a
  paragraph shorter is to make it more general, which is the wrong direction.
  → promoted: **W-17** · debt: **D-16** (paid on contact only — a course-wide
  compression pass is forty steps rewritten by whoever is currently annoyed)

- `content` — "is there a better way to reword or rewrite an example so it's
  more relatable?" **C-1** fixes the currency and the companies and **C-5**
  demands an anchor, and neither asks whether the reader has ever been near the
  situation. ZMW on a company nobody has worked for is *local*, not
  *relatable*. The rule's test is deliberately hard to answer yes to by
  reflex: name the student and say when they have stood near this.
  → promoted: **C-10** · debt: **D-13** (scoped with C-9, same steps)

- `structure` — "this skill is going to be universal, so it should be able to
  act differently in different scenarios like a law course or a math course,
  but we will be improving as we go." Every course built so far is finance, and
  the finance assumptions are baked into rules that do not announce themselves
  as assumptions — **E-1**, **E-4**, **E-5**, **E-6** are meaningless in a law
  course and **C-5**'s "concrete anchor" means a decided case rather than a
  figure. Answered with one question (*what does the paper ask the reader to
  produce?*) and four profiles in `reference/disciplines.md`. **Two of the four
  have no course behind them and say so at the top**, because "we will be
  improving as we go" is an instruction not to invent a taxonomy ahead of the
  material.
  → promoted: **C-11** + `reference/disciplines.md` · debt: none

- `structure` — "steps need to be able to reference each other … maybe say
  what's coming or what was there before and link to it … a course needs to
  feel like a network of steps." **This reverses "plain text, always"**, which
  had stood since the beginning and which `.claude/CLAUDE.md` still stated as a
  general rule. That rule was right about **Slack**, where a new file id was
  minted on every upload so an embedded link went stale the same day. It is
  wrong about the reader: a slug is authored in the step's own `.mjs`, and the
  renderer resolves it to a path at render, so moving a step re-points every
  link to it. Built the same day as `[words](step:slug)`, with `seed:course`
  refusing an unknown slug, a folder slug and a self-link — all three proved by
  breaking them on purpose.
  → promoted: **C-8** (revised) · debt: folded into **D-7**

- `structure` — "the first step should always be an intro to the course as a
  whole … people want to be given something that has a context and reason for
  it. So for someone to actually start spending incredible amounts of time
  doing this course and solving all the problems, there needs to be a good
  reason for why we're doing this course and how it's going to elevate the
  person for doing it. And always congratulate them for starting. And you need
  to tell them about the features of the course."
  **All four live courses open by teaching.** `intro-to-treasury` and
  `intro-to-strategy` introduce the *subject*, which is a different job. The
  hard part of writing this rule was keeping it clear of **S-6** (no course
  skeleton in a step, the owner's own earlier rule): the line is that a
  skeleton says *what is in the course* and this step says *what the course is
  for*. Also bounded the two things that go wrong by default — the
  congratulation is **one line** (a paragraph of encouragement reads as
  marketing to someone who came to study) and the features are named **where
  they are about to be used**, never as a tour.
  → promoted: **S-11** · debt: **D-15**

- `element` — "disable text popups from the app entirely for now." Done in the
  renderer, not in the content: `[[term|definition]]` still parses, validates
  and renders its word, so no step changes and it is one branch to restore.
  **But the definitions now reach nobody**, which is a live content problem
  rather than a style one — anything load-bearing has to move into the prose
  under **W-5** while it is off.
  → promoted: **E-8** (revised) · debt: **D-14**

- `element` — measured while writing **E-10**: the reader has drawn four
  callout kinds since 2026-08-02 and **not one of the 60 callouts in the 53
  steps sets one.** Every box in the product says "Key point", including the
  ones that are a trap and the ones that are a worked case. Nothing was ever
  wrong on screen, which is exactly why it went uncounted for five days. The
  `example` kind is also what **C-9**'s unworked example needed a home in, so
  two of today's rules turned out to be the same gap.
  → promoted: **E-10** · debt: **D-12**

### 2026-08-03 · treasury-management/working-capital/debtors-and-factoring · owner
- `writing` — "there is another mostake in the forst sentence / there is no hook,
  it looks like you jump staright into explaining the step without making sure
  the reader has context / eg i see Terms of 2/10 met 30 look like a small… / i
  dont even know what 2/10 means in this context." Two faults in one sentence.
  **The notation was never given** — `2/10 net 30` was explained four blocks
  later — and **the opening faced the wrong way**: the step is *Getting the cash
  in*, money owed TO you, and it opened on a discount YOU take from YOUR
  supplier, so the reader had to reverse the whole frame before paragraph three
  told them which side they were on. Rewritten to one customer, one invoice, one
  number, with the notation named in the sentence that first uses it and the 37%
  kept as the payoff rather than the premise.
  **This step had just scored 5/5 and passed every scanner.** `2/10` contains a
  digit, so the unreadable opening satisfied C-5's concrete-anchor check. That is
  the finding, not the sentence.
  → promoted: **W-16** (clear and direct for an average reader) · debt: **D-11**

- `structure` — "one of the things to add to the step skill is this ranking as
  well / if steps fall below they need to be rewritten and made better", and
  "all this stuff needs to go through the step skill next time as its the
  ultimate determinant of the whole business." Ranking becomes a gate rather
  than a report: below 5/5 is a rewrite in the same pass, and the skill is the
  thing every piece of course content passes through.
  → promoted: SKILL.md — "This skill is the gate" + "The gate: 5/5, or it gets
  rewritten" · tool: `tools/rank.mjs` · debt: **D-11**

- `writing` — "so youve read through the course nd fixed it?" Asked after I
  reported the course repaired. **The honest answer was no.** I measured it and
  fixed what the measurements flagged, having read parts of about eight of the
  21 steps. The question found the gap before the next reader did, and the
  `2/10` sentence above is what was sitting in it.
  → one-off, but it is the reason **D-11** is scoped to reading rather than
  scanning

### 2026-08-03 · all courses · owner
- `structure` — "the streamline connector has been up all this time / can you be
  more autonomouse and stop looping me into things you could have solved without
  me". **Second time in one session**, which by this file's own rule makes it a
  rule rather than a one-off. The first was about asking permission for
  downstream churn; this is about asking at all when the answer was available.
  D-5 had carried *"blocked, needs the Streamline MCP, which was unauthorized in
  the 2026-08-02 session"* for two days. The connector was live the whole time.
  Nobody re-tested it, I read the note, believed it, and offered the owner a
  choice about work I could simply have done. **A recorded blocker is a claim
  with a date on it, not a standing fact.** Checking took one tool call and the
  glyph set went from three marks to six.
  → promoted: SKILL.md — "Improve the step. Deal with the consequences." gains
  the re-test rule and the ban on offering a menu · debt: **D-5 unblocked** (one
  table converted the same day)

### 2026-08-03 · treasury-management · owner
- `structure` — "the step skill should never have to orry about any live breaks
  or whatever / a step being improved is the main priority in any case / and so
  it must be fixed or impproved no questions asked." Said in reply to my stopping
  mid-pass to ask permission: paying **D-6** on TM meant inserting a grouping
  node, and a lesson's URL is built from every ancestor, so 18 of 21 step paths
  moved. I put that to the owner as a three-way choice. Wrong move. The fix was
  already known, already cheap and already owed; the URL churn is what the fix
  costs, not a reason to stop and ask whether to do it. Asking spends the
  owner's attention on a decision the ledger had made, and a step left unimproved
  while it waits for an answer is the reader paying for my caution.
  This is **S-8's "never defer a split" generalised to the whole skill** — that
  bullet already said the churn from a split is the cost of the fix. It was
  written as if splitting were the only fix with a downstream bill.
  → promoted: **SKILL.md · "Improve the step. Deal with the consequences."**,
  and S-8's bullet now points at it · debt: none (no step is wrong because of it;
  it changes how the next pass behaves)

### 2026-08-03 · all courses · owner
- `structure` — "one thing i notice as im reading is the titles of the steps are
  different from what i actually find on the page." A step exports `label` and
  `title` on adjacent lines and they had drifted into two different names for the
  same step: tap "The yield curve", land on "The term structure of interest
  rates". The label is also the browser tab, the search result and the WhatsApp
  preview card, so the mismatch is the first thing a referred reader meets.
  Measured at **26 defects of 53** — TM 15 of 21, CF 11 of 25, SM clean. Four of
  the five outright renames are TM and all four were made by the S-8 splits: a
  split writes two new titles at the seam and nobody went back for the labels.
  → promoted: **S-10** · debt: **D-9** · tool: `tools/label-scan.mjs`

### 2026-08-02 · all courses · owner
- `structure` — "it shouldnt waste an opportunity to put a folder within a line
  of steps, nesting the steps up to 3 or 4 layers in." The sidebar tree already
  nests recursively and almost nothing uses it: one group in one course reaches
  depth 3, everything else is course → lesson → step. A run of siblings that
  share a subject gets a named folder over it.
  → promoted: **S-9** · debt: **D-6**
- `content` — "the steps should be able reference each other and flow into one
  another." A course is one argument told over forty steps, not forty handouts
  in a shared folder. Pick the thread up in a clause, hand it on in the prose,
  and re-state anything load-bearing so a step still stands up when it is the
  first one someone opens.
  → promoted: **C-8** · debt: **D-7**
- `writing` — "the first sentence of a section or step is important." W-13
  already banned what an opening must not do; this is the obligation it must
  meet. Most-read sentence in the step, written last and hardest.
  → promoted: **W-14** · debt: none (W-13's scan covers the ban list; the
  obligation is a judgement call, paid on contact)
- `writing` — "the language and way of writing needs to be readable and
  understandable enough that we accomodate people at different levels." Repeat
  students, first-years meeting it cold, and readers in their second or third
  language all paid the same and all have to reach the end. Plain words around
  the exact ones; depth in the detail, never in the difficulty of the prose.
  → promoted: **W-15** · debt: **D-8**

---

### 2026-08-02 · treasury-management (all steps) · owner
- `structure` — on being told the nine remaining TM steps would get the quality
  pass now and the **S-8** splits later, because splitting changes URLs, the
  course manifest and the debt lists: **"It's not a problem to split. If a step
  is too long, that's a very big problem, and we need to split it. And splitting
  it is the only solution. So meaning, if you have to split it, you can split it
  and then deal with the links changing and everything."** Also: **"you can add
  it in the skill"**, so this is a rule and not a one-off ruling on this course.
  My deferral was wrong in both directions: it treated the follow-on work as the
  expensive thing when the expensive thing is a reader abandoning a six-section
  step, and `DEBT.md` D-3's own note that S-8 is "worth doing deliberately per
  lesson" had hardened into a reason never to do it at all. Splitting now happens
  in the edit that finds the length, and the URL churn is done in the same edit.
→ promoted: **S-8** (new first bullet, "Never defer a split") · debt: **D-3**
  (the S-8 half now closes as the nine TM steps are split, rather than being
  carried)

### 2026-08-02 · all steps · owner
- `element` — of the source strip: **"the row of sources, put it under the
  section that talks about them, so no more at the end with a divider and
  all."** It collected at the foot of the section, between the last block and
  the checkpoint, where it read as part of the checkpoint-and-divider furniture
  rather than as a note on any particular claim. One strip per **citing block**
  now, directly beneath it. A section with links in two paragraphs shows two.
  Side effect worth having: dedupe is now per block, so two pages from the same
  site in different paragraphs are both reachable, which the section-wide strip
  could not do.
- `element` — of the tables: **"the tables are not being given enough room, the
  content is way too squished."** Correct, and it was the bleed change that
  exposed it. The table was `w-full`, so the auto layout was told to fit the
  reading column and squeezed every prose cell toward its minimum: "Stronger
  controls, economies of scale…" came out two words a line over seven lines.
  Now `w-max min-w-full`, with text cells capped at 17rem and numeric cells
  `whitespace-nowrap`. Measured at 390px: the four-column structures table went
  from ~150px columns and 7 lines to 272px columns and 4; the eight-column
  spreads table is unchanged at ~70px per numeric column.
→ promoted: **C-7** (revised: strip sits under the block, dedupe is per block) ·
  debt: none — the strip is rendered by the app, so every step already has it

### 2026-08-02 · treasury-management/treasury-operations/treasury-controls-and-structure · owner
- `writing` — **"I don't get that story that you've started with about lisond
  dealt and whatever. Can you change that up? Just make the step more relatable
  and easy to follow."**
  The step opened "Leeson dealt his own trades and then settled them himself."
  Barings is told properly one step earlier, in `treasury-levels-and-mandate`,
  where that same sentence is also the bolded punchline. So step 1.3 opened by
  repeating the previous step's payoff to a reader who, arriving at this step,
  has met neither the man nor the bank. §2 had the same shape: "The last
  structural choice is geographic" counts a list this step never makes.
  Both were correct while this was one six-section step. **The S-8 split on
  2026-08-01 is what broke them** — it moved the references above the seam and
  left them pointing at text that is no longer there.
  §1 now opens on one person in a Lusaka office who pays the suppliers and
  reconciles those same payments, and reaches Barings in the second paragraph
  with its figures carried so it stands alone. §2 opens on the mining group.
  Coverage unchanged: same six controls, same three structures, same checks.
→ promoted: **W-13** (fourth ban: no name the step has not itself introduced),
  **S-8** (re-read every part's openings, cold, after splitting) ·
  debt: **D-4** (widened — the scan cannot see this)

### 2026-08-01 · treasury-management/treasury-operations/treasury-levels-and-mandate · owner
- `element` — of the Level / Focus / Examples table: **"for a table like this
  id like to have this split into 3 different containers with freehand duotone
  icons"**, because **"its more memorable than a boring table"**.
  Right on both counts, and it was worse than boring: a table earns its place
  when figures line up, and nothing in this one lines up. On a 390px phone the
  Examples column wrapped one word per line and still clipped, so "bank
  communications" rendered as "communicatior" and "interest rate risk" as
  "interest rate risl". The owner asked for memorable and the change also
  fixed a legibility bug neither of us had named.
  New `cards` block: one card per kind, each with a Freehand Duotone mark, a
  title, a lead and its prose. Marks chosen on the axis the section teaches —
  chess for the long game, a calendar for months, a clipboard and clock for
  daily work, which is the time horizon the whole section is about. Three
  unrelated pictures would have been decoration.
  New **E-9**; **S-7** revised to hand the shape question to it.
- Scoped by scanning rather than guessing: **156 tables across the 44 steps —
  89 are workings and stay tables, 60 are definitional, and 37 of those are
  short enough (2 to 4 rows) to become cards.** Tool committed as
  `tools/table-scan.mjs`, since "which tables are the bad kind" is not a
  question worth answering by hand twice.
→ promoted: **E-9**, **S-7** (revised) · debt: **D-5**

---

### 2026-08-01 · treasury-management/treasury-operations/treasury-levels-and-mandate · owner
- `writing` — of the step's opening sentence, "Take one exposure and watch it
  pass through all three levels": **"this sentence [doesn't] start well"**, and
  **"can you make sure steps a friendly for beginners and not confusing"**.
  Three separate faults in one sentence, which is why it read badly rather than
  merely oddly: it uses **exposure** as a countable noun to a reader who has
  never met the word; it says **"all three levels"** before a single level has
  been named, so the count cannot be resolved; and it is a **stage direction**
  ("Take one X and watch it…") announcing the demonstration instead of starting
  it. The demonstration itself is the right move and is the one the engagement
  pass prescribes ("one case through the whole ladder") — the defect was
  narrating it. Fixed by deleting the announcement: the miller now arrives in
  the first sentence, the risk is shown before it is named, and *exposure* is
  defined in the sentence that introduces it.
  New **W-13**, plus a seventh check in the engagement pass ("the cold open").
- Scoped before opening the debt rather than after: all **218 section openings
  across the 44 published steps** were scanned for device-narration and
  unresolvable references. **One real defect** — this one. `vrio-applied`
  ("all four tests") refers back to the VRIO section immediately before it,
  which W-13 explicitly permits, and `yield-curve` tripped the scan on the
  idiom "over and above". So the rule is new but the house was already mostly
  keeping it.
→ promoted: **W-13** · debt: **D-4**

---

### 2026-08-01 · treasury-management/treasury-operations/intro-to-treasury · owner
- `writing` — "we're using *your* too many times, you need to reduce that."
  W-10 had been applied to every noun rather than where it lands. Measured
  before rewriting: **29 in 1,657 words, one per 57**. Now roughly one per 200.
  W-10 revised with a budget rather than left as an instruction to use it.
- `writing` — "reduce the [length] in these other sentences… the user wouldn't
  want to be reading forever, just drive the point home." Six sentences were 35
  words or more; longest was 46. Now no sentence over 34 and the average is 14.
  New **W-12**.
- `structure` — "take advantage of nesting steps… it helps the step from being
  way too long to read… we can complete many steps in a short period rather
  than staying on one step for a long time." The real insight is that
  **finishing is the thing that keeps a reader going**, so the step, not the
  section, is the unit to keep short. TM 1.1's six sections became three steps
  of two, split on conceptual seams (what treasury is / how the work divides /
  how it is governed). Coverage identical, nothing cut. New **S-8**.
- `element` — the source links should carry "a favicon of the website where you
  got the info from… I'd like to see this spread around the step, meaning a lot
  of information is gotten from the websites." Built as a build-time favicon
  inliner rather than a favicon service: the app ships `default-src 'self'`, so
  a remote icon URL is blocked, and a service would hand every reader's page
  views to a third party.
→ promoted: **W-10** (revised), **W-12**, **S-8** · debt: **D-3**

Also fixed, all app chrome rather than step rules: the term underline was a
`border-b` on a button, so it sat at the foot of the button box a whole line
below the word; the popup flipped above on an unmeasured height of zero, which
is why it sometimes landed on top of the word it defines; it now carries an
arrow that tracks the word rather than the card; and the header avatar got a
real 1px border back, because `PlanRing` was drawing it as an SVG stroke that
read thinner than the border on the search button beside it.

---

### 2026-08-01 · treasury-management/operations/intro-to-treasury · owner
- `writing` — "instead of saying something like 'Day to day that means keeping
  suppliers paid' we say 'Day to day that means keeping **your** suppliers
  paid'." W-9 had been applied at the level of the sentence's framing but not
  the noun; the possessive is the word doing the work. Swept the step: "its
  staff" → "your staff", "the bank balance" → "your bank balance", "the
  business" → "your business" in the definitions too. Third-party worked
  examples (the miller, the mining group, Barings) deliberately keep "the" —
  making those possessive is nonsense and would cost the word its meaning.
- `writing` — bold may cover a **whole sentence** where the whole sentence is
  the point ("Treasury executes; it does not set strategy."). W-8 as first
  written banned that outright, which was too strict; revised in place. What
  stays banned is a full sentence bolded by default.
- `content` — "including links to the sources where info is coming from is key…
  the sources in file are just books and all from the school, those just guide
  what the student is going to learn. But the real teachers are the trusted
  websites such as investopedia, CFI, Accountancy and others." New `sources`
  block type (`reader/Sources.tsx`), two links per section at the end of the
  section, each with a note on what it's good for. Six links on TM 1.1, all
  returning 200.
→ promoted: **W-10**, **W-8** (revised), **C-7** · debt: **D-2** (extended)

Note against C-7: **Investopedia could not be verified from this session** —
it 403s curl and blocks Claude's fetcher outright. Three intended Investopedia
links were swapped for CFI pages that could actually be checked rather than
shipped on the assumption the URL pattern was right. Written into C-7.

---

### 2026-08-01 · treasury-management/operations/intro-to-treasury · owner
- `writing` — "having words in bold is important to emphasize certain points
  that need to stick." Applied to TM 1.1 as the reference step, one to three
  bolded phrases per section, and made a rule so every later step is written
  the same way and can be ranked against it.
- `writing` — "id like to write to the student as they are the ones going to
  experience this in future… im speaking to them more as a future founder,
  deliberately giving them ownership." The step was still addressing an exam
  candidate — "the exam asks you to sort tasks between them" — which is the
  narrower of the two readers. Rewritten to land on the reader's own decision:
  what stays on your desk, what you can survive without while small, what you
  are buying when you hire. W-4 already asked for second person; this says who
  the second person **is**.
- `element` — "for certain words that are either key or not in the common
  vocabulary i want to have a popup when tapped to define it." Built as the
  `[[term|definition]]` inline mark (renderer: `lib/emphasis.ts` +
  `reader/Term.tsx`); eight terms marked in TM 1.1 — income statement, hedging,
  working capital, rating agencies, forward contracts, error account, front
  office, arbitrage, net.
→ promoted: **W-8**, **W-9**, **E-8** · debt: **D-2**

---

### 2026-08-01 · treasury-management/operations/intro-to-treasury · study
- `writing` — "the very first step is boring… spice it up, keep it engaging
  with a proper hook." Read correctly and felt nothing. The step opened on
  "Treasury is the financial centre of an organisation" — a category
  definition, nothing at stake on the first screen. Now opens on a profitable
  company that cannot make payroll on the 28th.
- `content` — no company, no figure, no date anywhere in the step. Six sections
  of pure definition. C-1 (ZMW/Zambian examples) was being dodged by having no
  examples at all rather than broken outright.
- `structure` — the best material in the step, Barings, was a single callout
  buried in section 4. Told as the story it is now: the date, the £827m, the
  error account, the one pound.
- `structure` — four definitional tables in six sections, each in the same
  `p → table → p` sandwich. Grey by the third one.
- `writing` — three levels (strategic/tactical/operational) were three table
  rows and no reason to care. Now one running exposure — a miller buying wheat
  in USD — carried through all three.
→ promoted: **W-3** (revised), **W-6**, **W-7**, **C-5**, **C-6**, **S-7**
· debt: **D-1**

---

*(first entry above — the seeded rules are now being replaced by the owner's
actual reactions)*
