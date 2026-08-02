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
| D-5 | Definitional tables that should be `cards` — E-9 | 2026-08-01 | open · 1/37 converted · **blocked on glyphs** |
| D-6 | Flat nav trees that should carry a folder — S-9 | 2026-08-02 | open · 0/4 courses grouped |
| D-7 | Steps that neither pick up nor hand on the thread — C-8 | 2026-08-02 | open · 0/53 checked |
| D-8 | Prose written past the weakest reader — W-15 | 2026-08-02 | open · 0/53 checked |

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
- [ ] the other 36 candidates — listed by the scan above, not enumerated here
      because the scan is the authoritative list and a copy of it would rot

⚠️ **Blocked, and this is the real constraint** *(2026-08-02)*. Converting a
table needs three or four marks on a shared axis, and `card-glyphs.tsx` carries
exactly three: chess, calendar, checklist. **They are one axis — time horizon —
so the only sets convertible today are sets about time.** The TM pass hit four
candidates and converted none: the working capital policy tables (aggressive /
conservative / moderate) are a risk-appetite axis, and the factoring comparison
is five rows and over E-9's cap anyway. Declining was correct, since E-9 says a
row of unrelated pictures is worse than the table it replaced.

**Unblocking this needs the Streamline MCP**, which was unauthorized in the
2026-08-02 session, to fetch Freehand Duotone marks for a second and third axis
(risk appetite, and cost-against-control would cover most of the remaining 36).
Until then D-5 progresses one table at a time and only for time-horizon sets.

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

- [ ] treasury-management (21 steps, 5 lessons — the worst case, and the one
      S-8 just made worse)
- [ ] corporate-finance (25 steps)
- [ ] strategic-management (7 steps — may genuinely be flat at this size)
- [ ] economics

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
