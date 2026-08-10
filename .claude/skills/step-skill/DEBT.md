# Revision debt

`RULES.md` fixes the *next* step. This file fixes the ones **already written**.

Every time a rule is promoted or an error is found, the steps that were written
before it are silently wrong — and nobody remembers which. This is the ledger of
that. It is the file that makes feedback compound instead of evaporate.

**The contract:** before rewriting, editing, or regenerating ANY step, grep this
file for that step's slug. Every open box against it gets applied in that edit.
A step is never touched without paying down its debt at the same time.

Ids are stable (`D-1`, `D-2`, …). Closed items stay, struck through in the
index, so "was this ever applied?" is answerable.

---

## How an item gets opened

Open a `D-` item whenever something invalidates published content:

| Trigger | Opens a debt item? |
|---------|-------------------|
| A factual/arithmetic **error** found in a step | **Always** — and it's urgent, a student is reading it |
| A **gap** (the exam needs it, the step doesn't carry it) | **Always** |
| A new rule promoted to `RULES.md` | **If** steps already written break it |
| A rule revised in place | **If** steps were written to the old version |
| Pure taste on one step, no rule promoted | No — that's a `LOG.md` one-off |

Scope it honestly. "Applies to: all TM steps" when you have not checked all ten
steps is worse than "applies to: TM 2.3, 4.1 — rest unchecked", because the
unchecked ones get ticked off by someone assuming the list was audited.

## How an item gets closed

- Tick a step's box **only after opening that step's file and looking.** If the
  rule already held there, tick it and write `(already held)` — that is a real
  outcome, not a skip.
- An item closes when every box is ticked. Move its heading to `~~struck~~` in
  the index below and stamp the date.
- Never delete an item. Never tick a box you did not verify.

## Entry format

```markdown
### D-n · one line: what changed · opened YYYY-MM-DD
**Source:** study session 2026-07-31 (TM 2.3) · owner · study
**Rule:** E-8 — (or: `one-off correction`, no rule)
**Why it can't wait for a rewrite:** the number on screen is wrong.
**Applies to:** treasury-management — 3 of 10 steps checked

- [ ] treasury-management/cash-management/miller-orr
- [x] treasury-management/cash-management/baumol — 2026-08-02 (already held)
- [ ] …unchecked: the other 7 TM steps
```

---

## Index

| Item | What | Opened | State |
|------|------|--------|-------|
| D-1 | Engagement pass — every step written before the hook rules | 2026-08-01 | open · 21/53 (**all of TM**) |
| D-2 | Emphasis, ownership voice, tap-to-define — every step written before W-8/W-9/E-8 | 2026-08-01 | open · 21/53 (**all of TM**) |
| D-3 | Possessive budget, sentence length, step splitting, source links — W-10/W-12/S-8/C-7 | 2026-08-01 | open · 21/53 (**all of TM**, S-8 included) |
| D-4 | Cold opens — W-13, section openings a beginner cannot hold | 2026-08-01 | open · 21/53 read cold; the other 32 machine-clean only |
| D-5 | Definitional tables that should be `cards` — E-9 | 2026-08-01 | open · **4/37 converted, unblocked 2026-08-03** · TM done bar one deliberate keep |
| D-6 | Flat nav trees that should carry a folder — S-9 | 2026-08-02 | open · **2/4 courses grouped** (TM + CF done 2026-08-03) |
| D-7 | Steps that neither pick up nor hand on the thread — C-8 | 2026-08-02 | open · 0/53 checked |
| D-8 | Prose written past the weakest reader — W-15 | 2026-08-02 | open · 0/53 checked |
| D-9 | Steps whose sidebar label is a different name from their page title — S-10 | 2026-08-03 | **closed 2026-08-03** · 0 of 53 authored steps; economics' 2 are not reachable from a `.mjs` |
| D-10 | Em dashes in step prose — W-11 | 2026-08-03 | open · **790 in 32 of 53** (CF 449, SM 341, **TM 0**) |
| D-11 | First screens nobody has read cold — W-16 | 2026-08-03 | open · **1 of 83 read** · no scan can see it |
| ~~D-12~~ | Callouts that never say which kind they are — E-10 | 2026-08-07 | **closed 2026-08-08** · 67 of 67 in 53 steps |
| D-13 | Steps that work every example and hand over none — C-9 | 2026-08-07 | open · **22 of 53** · **all of TM** (2026-08-08) |
| D-14 | Definitions orphaned by the popup being switched off — E-8 | 2026-08-07 | open · 1 of 53 checked · **a reader gets nothing today** |
| D-15 | Four courses, no course-intro step — S-11 | 2026-08-07 | open · **3 of 4 written same day** · economics is the 4th and has no `.mjs` |
| D-16 | Prose nobody has asked the shorter-version question of — W-17 | 2026-08-07 | open · 0 of 53 |
| D-17 | Titles in sentence case, hedging where they should name — S-12 | 2026-08-08 | open · **22 of 53** · **all of TM** (2026-08-08) |
| D-18 | Steps carrying more than one checkpoint — S-1 (revised) | 2026-08-09 | open · **TM converted the same day** (22 steps → 60); 3 courses owe it |

> **Counts moved from 44 to 53 on 2026-08-02.** The nine remaining Treasury
> Management steps were split into eighteen (S-8), so the course is 21 steps and
> the three courses are 53. Corporate Finance (25) and Strategic Management (7)
> are untouched and are the whole of what is left owing.

---

## Items

### D-1 · engagement pass: hook, concrete anchors, case-telling, table framing · opened 2026-08-01
**Source:** study session 2026-08-01 (TM 1.1) · owner · study — "the very first
step is boring… spice it up, keep it engaging with a proper hook."
**Rules:** W-3 (revised), W-6, W-7, C-5, C-6, S-7
**Why it can't wait for a rewrite:** every step in all three courses was written
to the old W-3, which asked for the definition first and got a textbook opening
every time. This is not a defect in one step; it is the house voice as it stood.
**Applies to:** all three courses — **21 of 53 steps checked.** All of Treasury
Management is paid (2026-08-02). Corporate Finance and Strategic Management are
untouched: `npv-and-payback` and `intro-to-strategy` had their openings read on
2026-08-01 but nothing else, and are NOT ticked.

Pay it with the **engagement pass** in `SKILL.md` — seven checks, run against the
step in front of you, in the same edit that touches it for any other reason.

**Treasury Management — all 21 steps, closed 2026-08-02.** The owner asked for
the whole course in one pass, which is the exception to "paid on contact", not a
change to it: an owner asking for a course is contact.
- [x] treasury-operations/intro-to-treasury — 2026-08-01 (rewritten)
- [x] treasury-operations/treasury-levels-and-mandate — 2026-08-01
- [x] treasury-operations/treasury-controls-and-structure — 2026-08-01
- [x] working-capital/working-capital-and-liquidity — 2026-08-02
- [x] working-capital/debtors-and-factoring — 2026-08-02 (new, split)
- [x] working-capital/inventory-and-creditors — 2026-08-02
- [x] working-capital/ordering-and-paying-suppliers — 2026-08-02 (new, split)
- [x] working-capital/cash-management — 2026-08-02
- [x] working-capital/cash-forecasting-and-surpluses — 2026-08-02 (new, split)
- [x] treasury-risk/interest-rate-risk-management — 2026-08-02
- [x] treasury-risk/interest-rate-hedging-instruments — 2026-08-02 (new, split)
- [x] treasury-risk/foreign-exchange-risk — 2026-08-02
- [x] treasury-risk/hedging-currency-risk — 2026-08-02 (new, split)
- [x] debt-and-investment/debt-management — 2026-08-02
- [x] debt-and-investment/the-price-of-debt — 2026-08-02 (new, split)
- [x] debt-and-investment/investment-management — 2026-08-02
- [x] debt-and-investment/building-the-portfolio — 2026-08-02 (new, split)
- [x] systems-and-clearing/clearing-and-settlement — 2026-08-02
- [x] systems-and-clearing/payment-systems-and-ccps — 2026-08-02 (new, split)
- [x] systems-and-clearing/treasury-management-systems — 2026-08-02
- [x] systems-and-clearing/choosing-and-running-a-tms — 2026-08-02 (new, split)

**Corporate Finance**
- [ ] corporate-finance/investment/npv-and-payback
- [ ] corporate-finance/investment/irr-and-mirr
- [ ] corporate-finance/investment/free-cash-flows
- [ ] corporate-finance/investment/inflation-and-tax
- [ ] corporate-finance/investment/capital-rationing
- [ ] corporate-finance/investment/apv
- [ ] corporate-finance/investment/international-projects
- [ ] corporate-finance/cost-of-capital/cost-of-equity
- [ ] corporate-finance/cost-of-capital/cost-of-debt
- [ ] corporate-finance/cost-of-capital/wacc
- [ ] corporate-finance/cost-of-capital/gearing
- [ ] corporate-finance/cost-of-capital/capital-structure-theories
- [ ] corporate-finance/cost-of-capital/credit-spreads
- [ ] corporate-finance/ma-valuation/company-valuation
- [ ] corporate-finance/ma-valuation/bond-valuation
- [ ] corporate-finance/ma-valuation/market-efficiency
- [ ] corporate-finance/ma-valuation/mergers-and-acquisitions
- [ ] corporate-finance/risk/interest-rate-risk
- [ ] corporate-finance/risk/hedging-interest-rate-risk
- [ ] corporate-finance/risk/yield-curve
- [ ] corporate-finance/risk/bond-duration
- [ ] corporate-finance/risk/currency-risk
- [ ] corporate-finance/risk/currency-hedging
- [ ] corporate-finance/dividends/dividend-theories
- [ ] corporate-finance/dividends/dividend-policy-in-practice

**Strategic Management**
- [ ] strategic-management/foundations/intro-to-strategy
- [ ] strategic-management/foundations/mission-and-vision
- [ ] strategic-management/environment/external-environment
- [ ] strategic-management/environment/internal-environment
- [ ] strategic-management/strategy/competitive-strategy
- [ ] strategic-management/strategy/corporate-strategy
- [ ] strategic-management/strategy/strategy-implementation

### D-2 · emphasis, ownership voice, tap-to-define · opened 2026-08-01
**Source:** owner review 2026-08-01 (TM 1.1) — "having words in bold is
important to emphasize certain points that need to stick"; "im speaking to them
more as a future founder, deliberately giving them ownership"; "for certain
words that are either key or not in the common vocabulary i want to have a
popup when tapped to define it."
**Rules:** W-8 (bold emphasis), W-9 (write to a future founder, not an exam
candidate), E-8 (`[[term|definition]]` popups)
**Why it can't wait for a rewrite:** all three marks are new. Every step written
before today has no bold at all, no tappable terms, and addresses an exam
candidate rather than someone who will run this — so the reader gets a wall of
even-weight prose with the jargon unexplained. Nothing is *wrong* on screen,
which is exactly why it would never surface on its own.
**Applies to:** all three courses — **21 of 53 steps checked.** All of Treasury
Management is paid (2026-08-02); nothing in Corporate Finance or Strategic
Management has been opened.

Pay it with the **rank** procedure in `SKILL.md` — score the step against
RULES, then fix what scored red, in the same edit that touches it for any other
reason. **D-1 and D-2 are paid together:** both are debts against the same
steps and both are paid on contact, so a step opened for one gets the other.

**Treasury Management — all 21 steps, closed 2026-08-02.** Measured before and
after: the nine unpaid steps carried 0 bold, 0 tappable terms and 0 source links
between them. The eighteen steps they became carry **159 bold, 49 terms and 70
links across 51 sections.** Exam framing ("the exam asks you to…") is gone from
every step that carried it.
- [x] treasury-operations/intro-to-treasury — 2026-08-01
- [x] treasury-operations/treasury-levels-and-mandate — 2026-08-01
- [x] treasury-operations/treasury-controls-and-structure — 2026-08-01
- [x] working-capital/working-capital-and-liquidity — 2026-08-02
- [x] working-capital/debtors-and-factoring — 2026-08-02
- [x] working-capital/inventory-and-creditors — 2026-08-02
- [x] working-capital/ordering-and-paying-suppliers — 2026-08-02
- [x] working-capital/cash-management — 2026-08-02
- [x] working-capital/cash-forecasting-and-surpluses — 2026-08-02
- [x] treasury-risk/interest-rate-risk-management — 2026-08-02
- [x] treasury-risk/interest-rate-hedging-instruments — 2026-08-02
- [x] treasury-risk/foreign-exchange-risk — 2026-08-02
- [x] treasury-risk/hedging-currency-risk — 2026-08-02
- [x] debt-and-investment/debt-management — 2026-08-02
- [x] debt-and-investment/the-price-of-debt — 2026-08-02
- [x] debt-and-investment/investment-management — 2026-08-02
- [x] debt-and-investment/building-the-portfolio — 2026-08-02
- [x] systems-and-clearing/clearing-and-settlement — 2026-08-02
- [x] systems-and-clearing/payment-systems-and-ccps — 2026-08-02
- [x] systems-and-clearing/treasury-management-systems — 2026-08-02
- [x] systems-and-clearing/choosing-and-running-a-tms — 2026-08-02

**Corporate Finance**
- [ ] corporate-finance/investment/npv-and-payback
- [ ] corporate-finance/investment/irr-and-mirr
- [ ] corporate-finance/investment/free-cash-flows
- [ ] corporate-finance/investment/inflation-and-tax
- [ ] corporate-finance/investment/capital-rationing
- [ ] corporate-finance/investment/apv
- [ ] corporate-finance/investment/international-projects
- [ ] corporate-finance/cost-of-capital/cost-of-equity
- [ ] corporate-finance/cost-of-capital/cost-of-debt
- [ ] corporate-finance/cost-of-capital/wacc
- [ ] corporate-finance/cost-of-capital/gearing
- [ ] corporate-finance/cost-of-capital/capital-structure-theories
- [ ] corporate-finance/cost-of-capital/credit-spreads
- [ ] corporate-finance/ma-valuation/company-valuation
- [ ] corporate-finance/ma-valuation/bond-valuation
- [ ] corporate-finance/ma-valuation/market-efficiency
- [ ] corporate-finance/ma-valuation/mergers-and-acquisitions
- [ ] corporate-finance/risk/interest-rate-risk
- [ ] corporate-finance/risk/hedging-interest-rate-risk
- [ ] corporate-finance/risk/yield-curve
- [ ] corporate-finance/risk/bond-duration
- [ ] corporate-finance/risk/currency-risk
- [ ] corporate-finance/risk/currency-hedging
- [ ] corporate-finance/dividends/dividend-theories
- [ ] corporate-finance/dividends/dividend-policy-in-practice
**Strategic Management**
- [ ] strategic-management/foundations/intro-to-strategy
- [ ] strategic-management/foundations/mission-and-vision
- [ ] strategic-management/environment/external-environment
- [ ] strategic-management/environment/internal-environment
- [ ] strategic-management/strategy/competitive-strategy
- [ ] strategic-management/strategy/corporate-strategy
- [ ] strategic-management/strategy/strategy-implementation

### D-5 · definitional tables that should be cards · opened 2026-08-01
**Source:** owner review 2026-08-01 (TM `treasury-levels-and-mandate`) — "for a
table like this id like to have this split into 3 different containers with
freehand duotone icons… its more memorable than a boring table."
**Rule:** E-9 (new), S-7 (revised)
**Why it can't wait for a rewrite:** it is not only a memorability problem. A
definitional table has nothing to line up, so on a 390px phone its last column
wraps one word per line and then clips: this step shipped with "bank
communications" reading as "communicatior". Every table below has the same
shape, so every one of them is a legibility bug on a phone as well as a dull
block on a laptop.

**Applies to: scanned in full before opening.** All **156 tables across the 44
steps** were classified by `tools/table-scan.mjs`:

- **89 are workings** — figures that must line up. E-1 and E-6 govern them and
  E-9 explicitly does not. Leave them alone.
- **60 are definitional** — no figure in any cell.
- **37 of those are genuine card candidates**: definitional AND 2 to 4 rows,
  which is E-9's cap. **1 converted** (this step). The other 23 definitional
  tables are too long for cards and want a `ul` or to stay as they are; they
  are not part of this item.
- **7 are mostly-prose** (a stray year or percentage). Each needs a human call
  and none is counted above.

Do not batch-convert. Each conversion needs its three or four marks chosen on
a **shared axis** (E-9), and picking those is the whole job — a row of
unrelated pictures is worse than the table it replaced. Paid on contact, like
D-1 and D-2.

```bash
node .claude/skills/step-skill/tools/table-scan.mjs Schools   # CARDS? rows are the candidates
```

- [x] treasury-management/treasury-operations/treasury-levels-and-mandate §task-levels — 2026-08-01 (chess / calendar / checklist, on the time-horizon axis)
- [x] treasury-management/working-capital/working-capital-and-liquidity
      §working-capital-policy, **the investment table** — 2026-08-03
      (batteryEmpty / batteryLow / batteryFull, on the reserve-level axis).
      Reordered lean → full rather than keeping the table's order, because the
      spectrum is what the section closes on, and return and risk moved into
      each card's own text: the table kept them in separate columns, which is
      what let a reader miss that they move together.
- [x] treasury-management/treasury-operations/treasury-controls-and-structure
      §centralisation — 2026-08-03 (oneCentre / manyCentres / centresInRegions,
      on the how-the-control-is-wired axis). Four columns of prose became three
      cards; the advantage and disadvantage columns are one sentence each now,
      which is how the section argues them anyway.
- [x] treasury-management/debt-and-investment/debt/debt-management §matching —
      2026-08-03 (calendar / chess, the existing time-horizon axis, no new
      glyphs). This one was a **comparison matrix**, not a list of kinds: the
      two things being compared were the *columns* and the rows were the
      questions asked of each. As two cards each is read whole instead of
      across. Worth noticing when scanning — `table-scan` cannot tell a matrix
      from a set, so check which way the table actually runs before converting.
- [ ] the same section's **financing table** stays a table. Its axis is funding
      maturity, not reserve level, and putting a second card row directly under
      the first would replace two tables with a wall. The contrast is doing work.
      **This is the only CARDS? candidate left in Treasury Management**, and it
      is a decision rather than an omission.
- [ ] the other 33 candidates — all in Corporate Finance and Strategic
      Management. Listed by the scan above, not enumerated here because the scan
      is the authoritative list and a copy of it would rot.

~~⚠️ **Blocked, and this is the real constraint** *(2026-08-02)*.~~
**UNBLOCKED 2026-08-03, and it was never really blocked.** The note below stood
for two days and said the fix needed the Streamline MCP, "which was unauthorized
in the 2026-08-02 session". Nobody checked it again. The owner, when it was
raised as a blocker a third time: *"the streamline connector has been up all
this time."* A recorded blocker is a claim with a date on it, not a standing
fact — **re-test it before repeating it**, especially when repeating it is what
stops the work.

The original constraint was real: `card-glyphs.tsx` carried three marks on one
axis (chess / calendar / checklist = time horizon), so only sets about time
could convert. There are now **six**, and the second axis is **reserve level** —
`batteryEmpty`, `batteryLow`, `batteryFull`, one object at three fill levels.
These are a better fit for E-9 than the first three: the accent layer on a
Freehand battery is the charge itself, so the card's own hue fills the mark in
proportion, and the empty one draws no tone at all. The distinction is in the
picture rather than beside it.

**A third axis followed the same day: how the control is wired** — `oneCentre`,
`manyCentres`, `centresInRegions`, three node-and-link diagrams from one family.
Named for the arrangement rather than the picture, because the next set that
wants this axis will not be about treasury structure.

**On the size, now measured rather than feared.** `card-glyphs.tsx` went 35KB →
48KB → **79.7KB raw, 27.3KB gzipped**, at nine glyphs. Its header warned that
the set ships "to every reader whether their step draws it or not" and to move
it behind `next/dynamic` past a handful. Half right, and worth stating
precisely: the paths land in the **reader** chunk, not a global one (the home
page does not reference it), so the cost is on step pages only, and it is
**+11KB gzipped for the six glyphs added today**. That was judged worth paying
against the thing it fixes, which is a real legibility bug on a 390px phone and
not decoration. It is not free, though, and the ratio gets worse with every
axis: **the tenth glyph should do the `next/dynamic` split first** — one file
per glyph, lazily keyed on the name, so a step drawing three cards fetches
three marks instead of nine.

`seed-course.mjs` used to hold a **retyped copy** of the glyph names with a
"keep in step with CARD_GLYPHS" comment. Adding three glyphs and not the copy
made the guard reject marks the reader draws perfectly well — the same silent
drift the guard exists to stop, pointed the other way. It now reads the names
out of `card-glyphs.tsx`. Nothing to keep in step any more.

### D-4 · cold opens: a section opening a beginner cannot hold · opened 2026-08-01
**Source:** owner review 2026-08-01 (TM `treasury-levels-and-mandate`) — "this
sentence [doesn't] start well… can you make sure steps a friendly for beginners
and not confusing."
**Rule:** W-13
**Why it can't wait for a rewrite:** the first sentence of a section is where a
beginner decides whether to keep reading, and a sentence that uses a word or a
count they cannot yet hold spends that moment. It is also invisible to every
other check: the step is accurate, covered and correctly structured, and only
fails when read cold.

**Applies to: all three courses — this is the rare item that was scanned
in full before it was opened.** All **218 section openings across all 44 steps**
were checked mechanically for the two patterns W-13 can be tested for by
machine: device-narration (`Take…`, `Consider…`, `Let's…`, `Imagine…`) and
unresolvable counts or pointers (`all three levels`, `as we saw`, `earlier`).

- **One real defect, now fixed** — this step.
- Two flagged and cleared by reading them: `internal-environment` §4 ("all four
  tests") points **back** at the VRIO section immediately above it, which W-13
  permits; `yield-curve` §2 tripped the scan on the idiom "over and above".
- **The third ban is NOT scanned.** "No word the reader has not met" needs
  judgement about what a first-year knows, and no machine check was run for it.
  So every step below is unchecked for undefined jargon in its openings, and
  that half gets done on contact, the same way D-1 and D-2 are paid.
- **⚠️ The fourth ban is not scannable either, and the scan gave false comfort.**
  *(2026-08-02)* W-13 gained "no name the step has not itself introduced" after
  the owner hit it on `treasury-controls-and-structure`: it opened "Leeson dealt
  his own trades…", a man introduced one step earlier. **The scan passed that
  sentence** — it is not device-narration and "Leeson" is not a count or a
  pointer, so no pattern matched. A clean run of the tool therefore means only
  that two of the four bans hold, and the baseline of "2 of 218, both false
  positives" should not be read as "openings are fine".
  A proper noun is greppable, but knowing whether *this step* introduced it
  needs a human. **Highest-risk population: any step produced by an S-8 split**,
  because splitting is what strands a reference above the seam. Three steps
  exist from splits so far, and two of the two defects found were in them.

Re-run the scan after writing any new step:

```bash
node .claude/skills/step-skill/tools/cold-open-scan.mjs Schools
```

It prints every flag with its sentence and exits on the count. The baseline is
**2 of 218, both false positives** and both named in the script's header — which
is the whole value of it: at two, a third hit is worth reading.

- [x] treasury-management/treasury-operations/treasury-levels-and-mandate — 2026-08-01 (rewritten)
- [x] treasury-management/treasury-operations/treasury-controls-and-structure — 2026-08-02 (both section openings rewritten; the fourth ban came from it)
- [x] treasury-management/treasury-operations/intro-to-treasury — 2026-08-02 (both openings read cold, clean: "Your company can have a profitable year and still fail to pay the staff", "Before lunch, your treasurer might…")
- [x] **the other 18 Treasury Management steps** — 2026-08-02. All 51 section
      openings read cold, by hand, against all four bans. The split made this
      urgent rather than optional and it caught three real cross-boundary
      references that the scan cannot see: `hedging-currency-risk` opened on a
      forward rate derived in the other half, its §5 pointed at "the FRA in the
      previous step", and `the-price-of-debt` explained a rate gap by naming a
      swap example told in a different lesson. All three are rewritten to stand
      alone. This is the fourth ban's population exactly as predicted: **every
      one was created by a split.**
- [ ] the other 32 steps (25 CF, 7 SM) — machine-clean on device-narration and
      unresolvable references; **not** checked for undefined jargon, and **not**
      checked for names introduced in a different step

### D-3 · possessive budget, sentence length, step splitting, source links · opened 2026-08-01
**Source:** owner review 2026-08-01 (TM 1.1) — "we're using *your* too many
times"; "reduce the length in these other sentences, the user wouldn't want to
be reading forever"; "take advantage of nesting steps, it helps the step from
being way too long to read".
**Rules:** W-10 (revised, now a budget), W-12 (sentence length), S-8 (split long
steps), C-7 (revised, inline links rather than a box)
**Why it can't wait for a rewrite:** every other step is still one long climb
with no outbound links at all. W-10 and W-12 are cheap and mechanical, and both
have a countable test.

⚠️ **This item used to say S-8 was "worth doing deliberately per lesson rather
than opportunistically", because splitting changes URLs and the course tree.
That sentence was wrong and it is withdrawn** *(2026-08-02, owner)*. It hardened
into a reason never to split at all: nine TM steps sat at five and six sections
for a day because the follow-on work looked expensive. The owner's ruling is in
`LOG.md` and the rule is now S-8's first bullet — **never defer a split.** The
URL churn is part of the fix.

**Applies to:** all three courses — **21 of 53 steps checked.** All of Treasury
Management is paid including its S-8 splits (2026-08-02); nothing in Corporate
Finance or Strategic Management has been opened.

Measure before rewriting, because the eye is a bad judge of all three:
`your` per total words (over 1-in-90 is a tic), the longest sentence (over 35
words splits), and the section count (five means look for the seam, six means
there is one).

**Treasury Management — all 21 steps, closed 2026-08-02.** The nine remaining
steps were five- and six-section climbs; they are eighteen steps of two to four
sections now, every original slug kept on the first part of its pair so no
existing URL broke. Longest sentence in the course is now 35 words, and `your`
runs no denser than 1 in 100 anywhere.
- [x] treasury-operations/intro-to-treasury — 2026-08-01
- [x] treasury-operations/treasury-levels-and-mandate — 2026-08-01
- [x] treasury-operations/treasury-controls-and-structure — 2026-08-01
- [x] working-capital/working-capital-and-liquidity — 2026-08-02 (split → debtors-and-factoring)
- [x] working-capital/debtors-and-factoring — 2026-08-02
- [x] working-capital/inventory-and-creditors — 2026-08-02 (split → ordering-and-paying-suppliers)
- [x] working-capital/ordering-and-paying-suppliers — 2026-08-02
- [x] working-capital/cash-management — 2026-08-02 (split → cash-forecasting-and-surpluses)
- [x] working-capital/cash-forecasting-and-surpluses — 2026-08-02
- [x] treasury-risk/interest-rate-risk-management — 2026-08-02 (split → interest-rate-hedging-instruments)
- [x] treasury-risk/interest-rate-hedging-instruments — 2026-08-02
- [x] treasury-risk/foreign-exchange-risk — 2026-08-02 (split → hedging-currency-risk)
- [x] treasury-risk/hedging-currency-risk — 2026-08-02
- [x] debt-and-investment/debt-management — 2026-08-02 (split → the-price-of-debt)
- [x] debt-and-investment/the-price-of-debt — 2026-08-02
- [x] debt-and-investment/investment-management — 2026-08-02 (split → building-the-portfolio)
- [x] debt-and-investment/building-the-portfolio — 2026-08-02
- [x] systems-and-clearing/clearing-and-settlement — 2026-08-02 (split → payment-systems-and-ccps)
- [x] systems-and-clearing/payment-systems-and-ccps — 2026-08-02
- [x] systems-and-clearing/treasury-management-systems — 2026-08-02 (split → choosing-and-running-a-tms)
- [x] systems-and-clearing/choosing-and-running-a-tms — 2026-08-02

**Corporate Finance**
- [ ] corporate-finance/investment/npv-and-payback
- [ ] corporate-finance/investment/irr-and-mirr
- [ ] corporate-finance/investment/free-cash-flows
- [ ] corporate-finance/investment/inflation-and-tax
- [ ] corporate-finance/investment/capital-rationing
- [ ] corporate-finance/investment/apv
- [ ] corporate-finance/investment/international-projects
- [ ] corporate-finance/cost-of-capital/cost-of-equity
- [ ] corporate-finance/cost-of-capital/cost-of-debt
- [ ] corporate-finance/cost-of-capital/wacc
- [ ] corporate-finance/cost-of-capital/gearing
- [ ] corporate-finance/cost-of-capital/capital-structure-theories
- [ ] corporate-finance/cost-of-capital/credit-spreads
- [ ] corporate-finance/ma-valuation/company-valuation
- [ ] corporate-finance/ma-valuation/bond-valuation
- [ ] corporate-finance/ma-valuation/market-efficiency
- [ ] corporate-finance/ma-valuation/mergers-and-acquisitions
- [ ] corporate-finance/risk/interest-rate-risk
- [ ] corporate-finance/risk/hedging-interest-rate-risk
- [ ] corporate-finance/risk/yield-curve
- [ ] corporate-finance/risk/bond-duration
- [ ] corporate-finance/risk/currency-risk
- [ ] corporate-finance/risk/currency-hedging
- [ ] corporate-finance/dividends/dividend-theories
- [ ] corporate-finance/dividends/dividend-policy-in-practice
**Strategic Management**
- [ ] strategic-management/foundations/intro-to-strategy
- [ ] strategic-management/foundations/mission-and-vision
- [ ] strategic-management/environment/external-environment
- [ ] strategic-management/environment/internal-environment
- [ ] strategic-management/strategy/competitive-strategy
- [ ] strategic-management/strategy/corporate-strategy
- [ ] strategic-management/strategy/strategy-implementation

---

### D-6 · flat nav trees that should carry a folder · opened 2026-08-02
**Source:** 2026-08-02 · owner — "it shouldnt waste an opportunity to put a
folder within a line of steps, nesting the steps up to 3 or 4 layers in."
**Rules:** S-9
**Why it can't wait for a rewrite:** the sidebar tree has always nested
recursively and the courses barely use it. Measured on the day the rule was
written: of the eight top-level groups in `course-nav.json`, **one reaches depth
3, four sit at depth 2, and three are depth 1** — a flat list of steps with no
grouping at all. This is not a writing defect in any one step, it is the shape of
every course, and it got worse the moment S-8 started splitting long steps: TM
went from 12 steps to 21 without gaining a single folder, so the climb moved off
the page and into the sidebar.

**Cost of leaving it:** a reader opening TM sees a long column of equal rows and
cannot tell which three belong together. The grouping exists in the material and
only in the material.

**How to pay it:** per course, not per step — this is one editing pass over
`reader/course.mjs`, then `seed:course` → `gen:course`. Look for runs of
consecutive siblings sharing a subject and put a named folder over each. Do it in
the same pass as any S-8 split.

- [x] treasury-management (21 steps, 5 lessons — the worst case, and the one
      S-8 just made worse) → **done 2026-08-03.** Four of the five lessons now
      group their siblings: Working capital gains "Inventory and suppliers" and
      "Cash" (six equal rows become four), Risk gains "Interest rates" and
      "Currency", Debt and investment gains "Debt" and "Investing", Systems and
      clearing gains "Payments and clearing" and "Treasury systems". Treasury
      operations stays flat — three steps, three separate frames, no pair.
      Course → lesson → group → step is depth 4, S-9's stated ceiling.
- [x] corporate-finance (25 steps) → **done 2026-08-03.** Investment appraisal
      was seven equal rows and Cost of capital six; both are three now.
      Investment appraisal gains "The methods" (NPV/payback, IRR/MIRR, APV) and
      "Harder cases" (inflation and tax, rationing, international), with free
      cash flows staying flat above them because it is the input the methods
      run on. Cost of capital gains "Equity and debt" and "Capital structure"
      with WACC flat between them, which is where it belongs: it is the one
      that combines the two. Valuation and M&A gains "Valuation" only, and Risk
      management gains "Interest rates and bonds" and "Currency". Dividend
      policy is two steps and stays flat.
- [ ] strategic-management (7 steps — may genuinely be flat at this size)
- [ ] economics

**⚠️ A grouping node changes the URL of every step beneath it.** `courseIndex()`
in `platform/src/lib/course.ts` builds a lesson's path from its full ancestor
trail, so a folder inserts a segment and the old path 404s:

```text
/treasury-management/working-capital/cash-management
/treasury-management/working-capital/managing-cash/cash-management
```

18 of TM's 21 steps moved on 2026-08-03. Nothing in the repo referenced the old
paths (checked) and no TM step link had been shared into a group, so the cost
was zero on the day. It will not always be.

**This is a thing to record, not a thing to ask about** — see "Improve the step.
Deal with the consequences." in `SKILL.md`. The remaining three courses get the
same pass; do it, and say what moved.

---

### D-7 · steps that neither pick up nor hand on the thread · opened 2026-08-02
**Source:** 2026-08-02 · owner — "the steps should be able reference each other
and flow into one another."
**Rules:** C-8
**Why it can't wait for a rewrite:** every step in all three courses was written
as a standalone unit, because that is what the brief was at the time and what
W-13 pushes each opening towards. The result reads as a folder of handouts: a
reader finishing one has no reason to open the next beyond the link being there.

**The trap, and why this cannot be batched by find-and-replace:** C-8 and W-13
pull against each other and both have to hold. A step must run on from the last
one **and** stand up as the first one somebody opens. The fix is a clause in the
body that re-states the fact it is leaning on, never a callback in the opening
sentence and never a recap block (S-6). Getting that wrong is what produced the
TM 1.3 opening the owner could not follow.

**How to pay it:** on contact, per step. When touching a step for any reason,
check two seams — does it pick up what the previous step left, and does it end
pointed at the next question. Cheapest while a lesson's steps are open together.

**Scope:** 53 steps, none checked. No scan can find this; it is a judgement at
each seam.

---

### D-8 · prose written past the weakest reader · opened 2026-08-02
**Source:** 2026-08-02 · owner — "the language and way of writing needs to be
readable and understandable enough that we accomodate people at different
levels."
**Rules:** W-15 (and W-12, which is the measurable half of it)
**Why it can't wait for a rewrite:** the steps are written to one implied
reader — a first-year with fluent English who is meeting the material for the
first time. The real readership is wider on both sides: repeat students who have
seen it, and readers working in a second or third language. W-12 already caps
sentence length and that pass has been run; W-15 is the part length does not
catch, which is a short sentence carrying two ideas or an unnecessarily
expensive word around a technical one.

**How to pay it:** on contact, and specifically as a **read-aloud** pass. Any
sentence you would have to stop and explain gets rewritten. Do not simplify the
technical vocabulary — that is the thing being taught; simplify everything
carrying it.

**Partly measurable:** W-12's sentence-length count is a proxy and already
reported. The rest is judgement.

**Scope:** 53 steps, none checked.

---

### D-11 · first screens nobody has read cold · opened 2026-08-03
**Source:** 2026-08-03 · owner, reading the live reader — "there is no hook, it
looks like you jump staright into explaining the step without making sure the
reader has context … i dont even know what 2/10 means in this context."
**Rules:** W-16 (new), W-13, W-5
**Why it can't wait for a rewrite:** the step it was found in had **just scored
5/5 with every scanner clean**. `debtors-and-factoring` opened on
`Terms of "2/10 net 30" look like a small courtesy`: notation never given, in a
step whose own title faces the other way (*Getting the cash in* is money owed TO
you; the sentence was about a discount YOU take from YOUR supplier).

**This is a hole in the method, not in one step.** `2/10` contains a digit, so
the unreadable opening satisfied C-5's concrete-anchor test. Every measurable
rule is a proxy, and a proxy passes in ways a reader does not. The course was
reported as repaired on the strength of measurements after roughly eight of its
21 steps had actually been read.

**How to pay it:** open each step and **read its first screen cold, as a
stranger**, before anything else. Three questions, in order:
1. Is there anything here I have not been given — a symbol, an abbreviation, a
   number, a name (**W-13**, **W-16**)?
2. Does the opening face the same way as the title?
3. Would I keep reading (**W-6**, **W-14**)?

No scan can do this. `tools/rank.mjs` tells you which step to open first; it
never tells you a step is good.

- [x] treasury-management/working-capital/debtors-and-factoring — 2026-08-03, rewritten
- [ ] **the other 20 Treasury Management steps** — 21 of 21 score 5/5 and none
      of the first screens has been read cold since. TM is the course to start
      on precisely because its numbers are clean: whatever is wrong there is
      invisible to every tool in this folder.
- [ ] corporate-finance — 25 steps
- [ ] strategic-management — 7 steps
- [ ] economics — 30 steps

---

### D-10 · em dashes in step prose · opened 2026-08-03
**Source:** measured 2026-08-03, not reported by anyone. `seed-course.mjs` has
warned on em dashes since the check was written and has never blocked, so the
warnings scrolled past on every publish and nobody counted them.
**Rule:** W-11
**Why it can't wait for a rewrite:** W-11 is the bluntest rule in the file —
*"not one, anywhere in a step"* — and it is the one this skill says is the
loudest tell that a machine wrote the line. It is also the only rule with no
judgement in it at all, so a step either passes or does not.

**Measured 2026-08-03, first run of `em-dash-scan.mjs`: 790 in 32 of 53 steps.**

| Course | Em dashes |
|---|---|
| Corporate Finance | 449 |
| Strategic Management | 341 |
| **Treasury Management** | **0** |

**TM's zero is the finding.** It is not luck and it is not that TM was written
differently: all 21 TM steps were rewritten after W-11 existed, during D-1
through D-4, and the em dashes went out with everything else. The other two
courses have never had a pass since the rule was written. So this is not 53
steps of debt, it is **the exact set of steps that predate the rule**, and it
says what the rewrites were actually worth.

**How to pay it: not with a find-and-replace.** W-11 lists the three cases and
says rewrite the sentence rather than swapping the character, because an em dash
is usually a sentence that has not decided what it is. Substituting a comma
leaves the undecided sentence in place and removes the evidence.
- the clause explains or names what came before → **colon**
- an aside that could be cut → **comma pair**, or cut it
- a second thought that stands alone → **full stop**, new sentence

```bash
node .claude/skills/step-skill/tools/em-dash-scan.mjs Schools
```

- [x] treasury-management — 0 of 21, clean before this item existed
- [ ] corporate-finance — **449** across 25 steps
- [ ] strategic-management — **341** across 7 steps. The worst five steps in the
      project are all SM: internal-environment (61), corporate-strategy (56),
      strategy-implementation (56), competitive-strategy (50), intro-to-strategy
      (47). At 7 steps and ~49 each this is the densest, and the cheapest course
      to clear.

---

### D-9 · sidebar label and page title are two different names · opened 2026-08-03
**Source:** 2026-08-03 · owner — "one thing i notice as im reading is the titles
of the steps are different from what i actually find on the page."
**Rules:** S-10
**Why it can't wait for a rewrite:** a reader taps **"The yield curve"** and
lands on a page headed **"The term structure of interest rates"**. Nothing on
the page confirms they opened what they chose. The same string is also the
browser tab, the command-search result, the native share sheet's title and the
**WhatsApp preview card** — `share-target.ts` uses `labelFor()`, the `<h1>` uses
`lesson.title` — so a link dropped in a study group advertises one name and
opens another. That is the first impression of every shared step.

**Measured 2026-08-03, first run of `label-scan.mjs`: 26 defects of 53 authored
steps** — 5 RENAMED (no word in common), 12 REWORDED (same words, reordered),
3 PUNCT, 5 JOIN (a needless trim of a title that already fits), plus one `&`
inside an otherwise fine trim. Economics is not scannable — its 30 steps have no
`.mjs` source and live only in `course-data.json` — and 2 of them differ.

**Where it came from, and why the fix belongs with S-8:** 4 of the 5 RENAMED and
9 of the 12 REWORDED are Treasury Management, and all of those date from the
2026-08-02 splits. A split writes two new titles at the seam, each saying what
its half is *about* — "Getting the cash in", "How much to order, and when to
pay" — and the labels were left carrying the old topic names, "Debtors &
factoring" and "EOQ & creditors". Nothing checked, because until now nothing
compared the two fields. The fifth rename, CF's `yield-curve`, predates the
splits and is the proof this can happen without one.

**How to pay it:** cheap and mechanical, per step, and it is two adjacent lines
in the step's own `.mjs`. Run the scan, and for each hit either copy the title
into the label or trim the label to the title's own words in order. Re-run;
exit code is the remaining count. Then `seed:course` → `gen:course`.

```bash
node .claude/skills/step-skill/tools/label-scan.mjs Schools
```

**Watch the URL.** `slug` is not touched by any of this — renaming a label or a
title must never renumber a slug, or the shared links break (**S-8**).

- [x] treasury-management — **15 defects of 21 steps** (4 RENAMED, 9 REWORDED,
      1 JOIN, 1 `&`) → **0, fixed 2026-08-03.** Every label is now a trim of its
      own title, or identical to it where the title fits a row. The four
      outright renames were the S-8 seams: "Controls and structure" → "Keeping
      treasury honest", "Levels and mandate" → "How treasury work divides",
      "Debtors & factoring" → "Getting the cash in", "EOQ & creditors" → "How to
      order, and when to pay". No `slug` was touched. `label-scan` on the course
      exits 0; 16 allowed trims remain and were eyeballed.
- [x] corporate-finance — **11 of 25** (1 RENAMED, 3 REWORDED, 3 PUNCT, 4 JOIN)
      → **0, fixed 2026-08-03.** Eight of the eleven had a title that already
      fits a sidebar row, so the two strings simply collapsed into one. The
      RENAMED one is `yield-curve`, the case in the owner's original complaint:
      tapping "The yield curve" landed on "The term structure of interest
      rates". The label is now "The term structure" — a trim of the title
      rather than a retitle, because S-10 says shorten the label and leave the
      better of the two names alone. The slug is still `yield-curve`.
- [x] strategic-management — **0 of 7**, clean. Its one hit,
      `intro-to-strategy`, is an allowed trim
- [ ] economics — 2 of 30, and not reachable from a `.mjs`; fix in
      `course-data.json` or leave until the course is authored properly

### D-12 · callouts that never say which kind they are · opened 2026-08-07
**Source:** 2026-08-07 · measured while adding **E-10** · owner
**Rule:** E-10 (new)
**Why it can't wait for a rewrite:** the reader has drawn four kinds since
2026-08-02 and **not one of the 60 callouts across the 53 authored steps sets
one**, so every box in the product says "Key point" — including the ones that
are a trap the exam sets and the ones that are a worked case. The reader was
never wrong on screen, which is exactly why nobody counted it.
**Applies to:** all 53 steps. This is the rare item with an exact number rather
than an estimate: `grep -c 'type: "callout"'` is 60 and `grep -c 'kind:'` is 0.

- [x] treasury-management/debt-and-investment/the-price-of-debt — 2026-08-07
      (2 callouts: the covenant one is `key`, the new unworked bond is
      `example`)
- [x] **the other 59 callouts, in 45 steps — 2026-08-08.** Every one read in the
      context of the section holding it, and the kind chosen against E-10's four
      definitions rather than assigned in bulk. `grep -c 'type: "callout"'` is 67
      and every one now sets a kind. Twelve `example` boxes were written the same
      day by D-13 and are counted there, not here.

**What the distribution says, which is the actual finding.** The 59 came out
**41 `key`, 16 `warning`, 2 `exam`** — and 70% `key` is close enough to the
sweep this item warned against that it has to be defended rather than reported.
It is not a sweep: **18 boxes (31%) were saying the wrong thing on screen** and
now do not, and the reason so many are genuinely `key` is that `key` was the
only kind that existed when they were written. E-3 asks each section for the one
sentence worth carrying, so that is the box most sections got.

The 18 are where the reader was actively misled. Sixteen are traps wearing a
"Key point" label: *never* multiply preference shares by (1 − t)
(`cost-of-debt`), an overdraft is not a source of capital in WACC (`wacc`), a
rising EPS is not value created (`mergers-and-acquisitions`), an implied forward
rate is not an expectation (`yield-curve`), PESTEL is not a checklist
(`external-environment`), a capability every rival has is not a strength
(`internal-environment`), a strategy can be perfectly executed and wrong
(`strategy-implementation`). Two are exam instructions that were not marked as
such: work both hedges and say which you would take (`currency-hedging`), and
the specificity test a vision has to pass (`mission-and-vision`).

**Judgement calls worth recording, because they are the ones that will be
revisited.** Where a box's first sentence states a rule it is `key`; where it
names a mistake it is `warning`. That resolved most of them, and it was
overridden twice in each direction: `competitive-strategy` §5 ("The goal is not
to answer every attack but…") reads as a negation and names no slip, so it is
`key`; `internal-environment` §2 opens with a positive test and exists to stop a
generic SWOT strength, so it is `warning`. **`external-environment` §2 was very
nearly `exam`** and is `warning` instead, on E-10's own clause: it says how to
think about PESTEL rather than what the paper does with it, and SM's
`start-here` already carries the real exam line. An `exam` box that is merely
good advice is worse than no box.

**No prose was touched.** This pass added exactly one line per callout, which is
what makes 59 judgements reviewable against the list in one diff. The other
debts those 45 steps carry (D-1 through D-4, D-10, D-16 for CF and SM) are
**not** ticked and were not paid: a `kind:` line is not the rewrite the
paid-on-contact contract is about, and pretending otherwise would tick 45 boxes
nobody checked.

### D-13 · steps that work every example and hand over none · opened 2026-08-07
**Source:** 2026-08-07 · owner — "important pieces are worked and unworked
examples in cases of mathematical courses."
**Rule:** C-9 (new)
**Why it can't wait for a rewrite:** a reader who has only ever watched
examples being solved can follow every line and still not start a blank one,
and the exam gives them a blank one. `the-price-of-debt` worked a bond
valuation to the kwacha and then asked a multiple-choice question about which
direction prices move — so the step's own check could be passed by someone who
could not price a bond.
**Applies to:** every step in a **quantitative** course (`reference/disciplines.md`)
— Corporate Finance, Treasury Management, the economics steps. Strategic
Management is discursive and C-9 reads differently there; check it against the
profile before scoring it.

- [x] treasury-management/debt-and-investment/the-price-of-debt — 2026-08-07
      (a second bond at different figures, marked by a numeric check whose
      three wrong options are the three real slips)
- [x] **all 21 remaining Treasury Management steps — 2026-08-08.** Every step
      opened and read. **Ten needed a handover and got twelve**, one per section
      that works a number: Baumol and Miller-Orr (`cash-management`), EOQ
      (`ordering-and-paying-suppliers`), the cash conversion cycle
      (`working-capital-and-liquidity`), the annualised T-bill yield
      (`cash-forecasting-and-surpluses`), the discount decision
      (`debtors-and-factoring`), a two-leg cross rate with both spreads
      (`foreign-exchange-risk`), a futures hedge and its rounding
      (`hedging-currency-risk`), an FRA settlement and a swap's surplus
      (`interest-rate-hedging-instruments`), an interest-rate gap priced in
      kwacha (`interest-rate-risk-management`), and a blended portfolio yield
      (`building-the-portfolio`). Each is a `callout` with `kind: "example"`
      posing the task, and each section's `check` was rewritten so its four
      options are numbers and its three wrong ones are the slips that actually
      produce them. Every `explain` now carries the working, not the verdict.
- [ ] 25 Corporate Finance steps — **unchecked**
- [ ] 30 economics steps — **unchecked**, and not reachable from a `.mjs`

**⚠️ THE SCAN THAT WAS MEANT TO FIND THESE MISSED TWO OF THE WORST, AND THAT IS
THE FINDING TO CARRY.** Sections were triaged by asking whether the check's
options contained figures, on the assumption that a numeric check means the
reader has to produce something. It does not. `debtors-and-factoring` §1 scored
4 numeric options out of 4 and was the purest instance of the defect in the
course: it re-asked the section's own worked case at the SAME figures (2/10 net
30 against an 8% overdraft), with 37.23% printed in the paragraph above the
question and again inside the winning option. `interest-rate-hedging-instruments`
§1 was the same shape, its answer being a row of the table two inches higher.
**A numeric option is not a produced number.** The question to ask of a check is
whether its answer is visible on the same screen, and no scan can see that.

**Two things this pass changed about how C-9 gets applied, both worth keeping.**
Where the second case comes out with the *same verdict* as the worked one it
teaches a conclusion, so `debtors-and-factoring` hands over 1.5/15 net 60
against a 20% overdraft, where the answer **reverses** and the discount is
declined. And the insight the old check tested is never simply deleted: the
Baumol √ intuition, the futures tail, the FRA's both-ways bind and the gap's sign
all moved into the new `explain` or survive as one of its options, so nothing the
step used to teach was traded for the handover.

**Not claimed as done:** `interest-rate-hedging-instruments` §3 (futures) and §4
(collars) work tables and keep conceptual checks. Both are producible and
neither got a handover, because two example boxes in one step is already the
ceiling E-3 will bear and these are the two least likely to be examined as a
calculation. Eleven TM steps needed nothing: they teach what a thing is or how to
classify one, and their checks already hand a fresh case over for the framework
to be applied to, which is what C-9 asks of a non-quantitative section.

### D-14 · definitions orphaned by the popup being switched off · opened 2026-08-07
**Source:** 2026-08-07 · owner — "disable text popups from the app entirely for
now."
**Rule:** E-8 (revised)
**Why it can't wait for a rewrite:** **a reader gets nothing today.** Every
`[[term|definition]]` still renders its word and no longer renders its
definition, so wherever a step leaned on the popup to carry a word the reader
needed, the sentence around it is now unsupported. This is not a style item: it
is content that was on screen last week and is not on screen now.

The fix is never "delete the marks" — the definitions are the expensive part and
the popup is one branch away from returning. It is: find the ones that are
**load-bearing**, define those in the prose under **W-5**, and leave the rest
marked.

**Applies to:** every step carrying a `[[term|…]]`, which is most of them.

- [x] treasury-management/debt-and-investment/the-price-of-debt — 2026-08-07
      (`PBIT` and `par` moved into the prose, both load-bearing; `notch` and
      `covenant headroom` are explained by their own sentences and keep the
      mark alone)
- [ ] the other 52 steps

### D-15 · four courses, no course-intro step · opened 2026-08-07
**Source:** 2026-08-07 · owner — "the first step should always be an intro to
the course as a whole … for someone to actually start spending incredible
amounts of time doing this course, there needs to be a good reason for why
we're doing this course and how it's going to elevate the person for doing it."
**Rule:** S-11 (new)
**Why it can't wait for a rewrite:** it is the cheapest unbuilt thing in the
product. Every course currently opens by teaching, so a reader who was assigned
the course and does not yet know why it matters meets a definition first. This
is one new step per course and it is the one every single reader sees.

**Applies to:** all four live courses. None has one — `intro-to-treasury` and
`intro-to-strategy` are introductions to the SUBJECT, which is a different job
and does not satisfy S-11.

- [x] treasury-management — 2026-08-07 · `start-here-treasury`, 3 sections, 5/5
- [x] corporate-finance — 2026-08-07 · `start-here-corporate-finance`, 3 sections, 5/5
- [x] strategic-management — 2026-08-07 · `start-here-strategic-management`, 3 sections, 5/5
- [ ] economics — not reachable from a `.mjs`; needs authoring properly first

**What writing three of these in one pass taught, beyond the three steps.**

All three scored **2/5 on the first run** and every one of the three failures
was the same failure: an intro step has a section (**how to use this**) that is
about the course rather than about the subject, so it starts with no concrete
anchor (**C-5**), no jargon worth defining (**E-8**) and nothing an outside site
teaches (**C-7**). The fix was not to argue with the scanner. It was to notice
that a section with no anchor and no source is a section carrying no subject —
and **S-11 never said that section should be subject-free.** Each now names the
real size of the course, links the topic it gestures at, and defines a word the
reader has not met. That is better writing, not a higher score.

Worth carrying to the fourth: **write the shape sentence with a link in it and
the counts as figures from the start**, rather than writing chrome and then
retrofitting anchors.

`C-7`'s "no filler links" and the scanner's "every section needs a source" pull
against each other here and did NOT need a rule change — every link added is on
a phrase whose idea genuinely is taught better elsewhere. If a future intro
cannot find one honestly, that is the moment to revisit C-7, not before.

### D-16 · prose nobody has asked the shorter-version question of · opened 2026-08-07
**Source:** 2026-08-07 · owner — "is there a more concise way of setting up this
sentence or paragraph that doesn't lose the user … people have limited
attention spans."
**Rule:** W-17 (new)
**Why it can't wait for a rewrite:** it can, and it is the one item here that
should NOT be swept. Nothing is wrong on screen, no reader is missing anything,
and a course-wide compression pass is forty steps rewritten by whoever is
currently annoyed. It is here so that any step opened for another reason gets
the question asked of it in the same edit.
**Applies to:** all 53 steps, at a rate of whichever ones get touched.

- [ ] 0 of 53 · **paid on contact only** — see the note above before batching
      this one

### D-17 · titles in sentence case, hedging where they should name · opened 2026-08-08
**Source:** 2026-08-08 · owner, reading Treasury Management — "the titles im
coming across are poor… they lack a certain assertiveness and feel like they
aren't bold or confident. a title is supposed to be capitalised properly and
seriously."
**Rule:** S-12 (new)
**Why it can't wait for a rewrite:** a title is the one string every reader of a
step sees, and it is on screen in four places at once — the sidebar row, the
`<h1>`, the browser tab and the WhatsApp card someone gets in a study group. It
is also the only part of the product a student reads **before** deciding whether
to read anything. Nothing here is wrong on a page, which is why five days of
reading the course never surfaced it: each title is defensible alone, and it is
the **column** that fails.

**Measured 2026-08-08, first run of `title-scan.mjs`: 194 defects across 166
names, in 56 of 56 authored steps and 37 course/group rows. Nothing in the
product passed.**

| Verdict | Count | What it is |
|---|---|---|
| CASE | 166 | sentence case where a name wants Title Case |
| TAIL | 14 | the hedged `, and how/what/where…` clause |
| OPENER | 10 | opens on *What* or *How* — a question in disguise |
| DANGLE | 4 | ends on a bare particle: "Getting the cash in" |

**The count is 56, not 53.** The three `start-here` steps written on 2026-08-07
(D-15) are steps like any other, and every item above this one still says 53.
Corrected here rather than rewritten upward through the file, because those
counts are records of what was measured on their own dates.

**TAIL is the finding, and it is a voice rather than a set of titles.**
Thirteen of Treasury Management's twenty-two carried it: "Working capital, and
how much of it to run", "What debt costs, and what it demands", "Clearing,
settlement, and the risk in between". One title with a second clause is a
subtitle. Twenty-two of them is a habit, and the habit is hedging — the first
half names the topic and the second half apologises for not having said enough.
By the fourth sidebar row a reader has stopped reading past the comma.

**How to pay it:** cheap and mechanical per step, and it is the same two
adjacent lines **S-10**'s fix touches, plus the `kicker` beneath them and the
grouping rows in `reader/course.mjs`. **Run `label-scan` immediately after**:
S-10 wants the label to be the title's own words in the title's order, so
retitling a step is exactly the move that breaks it.

```bash
node .claude/skills/step-skill/tools/title-scan.mjs Schools
node .claude/skills/step-skill/tools/label-scan.mjs Schools   # S-10, always after
```

**Watch the URL.** `slug` is not touched by any of this. A retitle must never
renumber a slug (**S-8**), and none did.

- [x] treasury-management — **97 defects of 22 steps + 16 rows → 0, fixed
      2026-08-08.** All 22 titles rewritten, not just recapitalised: 13 hedged
      tails, 3 question openers and 2 dangling particles are gone, and every
      title is now the noun phrase a syllabus would use. Twenty of the 22 titles
      came in at or under `label-scan`'s 32-character row budget, so **label and
      title are now the same string on 20 of 22** — the two that trim are
      `payment-systems-and-ccps` (43) and `choosing-and-running-a-tms` (39).
      All five lesson rows, all eight grouping rows and all 22 kickers are Title
      Case. No `slug` was touched. `label-scan` on the course exits 0.
- [ ] corporate-finance — **80 defects across 26 steps + 15 rows**
- [ ] strategic-management — **17 defects across 8 steps + 6 rows.** The
      cheapest of the three, the same way D-10 was
- [ ] economics — 30 steps, not reachable from a `.mjs` and not scanned; fix in
      `course-data.json` or leave until the course is authored properly

**What the TM pass taught, worth carrying to the other three.** The rewrite is
not a capitalisation job with some editing attached — it is the other way round.
Recapitalising "What treasury is and what it does" gives "What Treasury Is and
What It Does", which passes CASE and is a worse title than before, because Title
Case makes a weak title look like it was chosen. **Write the name first, then
capitalise it.**

Second: the titles got shorter, and that is what closed **S-10** as a side
effect rather than as extra work. A hedged tail is what pushed a title past a
sidebar row in the first place, so removing it collapsed 20 of 22 label/title
pairs into one string. The two debts have the same root and should be paid in
one pass on each remaining course.

### D-18 · steps carrying more than one checkpoint · opened 2026-08-09
**Source:** 2026-08-09 · owner — "to really embrace having bite sized info that
is easy to understand … id like each step in the case of treasury management to
practically split the checkpoint, meaning only one checkpoint per step. that
increases the number of steps for the course but its worth it as the read to
that completion of the step is not so far away … from now on a step is a small
containable concept a user needs to understand."
**Rule:** S-1 (revised), and with it S-2, S-3, S-8, S-9, S-11, E-8's budget
**Why it can't wait for a rewrite:** it is the grain of the product, not a
property of any one step. A three-section step asks a reader for three
checkpoints' worth of attention before it lets them finish anything, and
finishing is what brings them back. It also fixes something the owner named
separately: **a comment thread hanging off a three-section step serves three
concepts at once**, so nobody can tell what is being discussed. One checkpoint
per step makes every note and every comment belong to exactly one idea.
**Applies to:** all four courses. Measurable —
`node .claude/skills/step-skill/tools/rank.mjs <course>` fails any step whose
section count is not 1, and `S-1 steps not 1 section` in the course totals is
the count owing.

- [x] **treasury-management — 22 steps of 60 sections → 60 steps of one,
      2026-08-09.** Every section became a step, verbatim, with its own title,
      label, kicker and slug. Each old multi-section step's name survives as
      the folder over its parts, so the tree now runs to five levels in Working
      capital and Risk (course → lesson → group → family → step). All 22
      original slugs are kept on the first part of their split (S-8), so every
      `step:` link and every previously seeded id still resolves — the one
      exception is `credit-ratings`, which linked to
      `interest-rate-hedging-instruments` for the SWAP, and that concept now
      lives at `interest-rate-swaps`; the link was retargeted in the same edit.
      60 of 60 at 6/6, every scan clean, verified against the served HTML.
- [ ] corporate-finance — 26 steps, unconverted
- [ ] strategic-management — 8 steps, unconverted
- [ ] economics — 30 steps, not reachable from a `.mjs`

**What the conversion actually cost, recorded because the next course pays the
same bill.** Every TM step URL moved except the three in Getting Started: a
path is built from its full ancestor trail, so the new folders insert a
segment and the old paths 404 (checked: `…/debt/the-price-of-debt` now 404s,
and `…/debt/price-of-debt/the-price-of-debt` is the page). **Checkpoint
progress is keyed by step**, so a signed-in reader's ticks on a section that
moved out to its own step reset to unticked. Both were done rather than asked
about, under "Improve the step. Deal with the consequences." in `SKILL.md`.

**Three things the split did NOT do, and each was a decision.** No prose was
rewritten to fit the new grain beyond the seams — the sections were already
written to stand alone, which is why this was a structural edit rather than 60
rewrites. **The seams were the real work**: twelve sentences pointed at "the
next section", "this section" or "the last section of this step", all of which
became false the moment the section was the step, and W-13's fourth ban (no
name the step has not itself introduced) had to be re-read cold at 38 new
openings. And **E-8's budget was rescaled rather than enforced** — three to
eight tappable terms was written for a two-to-four-section step, so on the new
grain it is one to three; enforcing the old number would have meant stuffing 60
steps with definitions nobody asked for.
