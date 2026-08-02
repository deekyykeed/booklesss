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
| D-1 | Engagement pass — every step written before the hook rules | 2026-08-01 | open · 3/44 |
| D-2 | Emphasis, ownership voice, tap-to-define — every step written before W-8/W-9/E-8 | 2026-08-01 | open · 3/44 |
| D-3 | Possessive budget, sentence length, step splitting, source links — W-10/W-12/S-8/C-7 | 2026-08-01 | open · 3/44 |
| D-4 | Cold opens — W-13, section openings a beginner cannot hold | 2026-08-01 | open · 44/44 scanned, 1 fixed, jargon half unchecked |
| D-5 | Definitional tables that should be `cards` — E-9 | 2026-08-01 | open · 1/37 candidates converted |

---

## Items

### D-1 · engagement pass: hook, concrete anchors, case-telling, table framing · opened 2026-08-01
**Source:** study session 2026-08-01 (TM 1.1) · owner · study — "the very first
step is boring… spice it up, keep it engaging with a proper hook."
**Rules:** W-3 (revised), W-6, W-7, C-5, C-6, S-7
**Why it can't wait for a rewrite:** every step in all three courses was written
to the old W-3, which asked for the definition first and got a textbook opening
every time. This is not a defect in one step; it is the house voice as it stood.
**Applies to:** all three courses — **3 of 44 steps checked** (TM 1.1 rewritten, then split into three;
`cash-management`, `npv-and-payback`, `intro-to-strategy` had their openings read
but nothing else, and are NOT ticked).

Pay it with the **engagement pass** in `SKILL.md` — six checks, run against the
step in front of you, in the same edit that touches it for any other reason.
Do not batch-rewrite steps nobody is reading yet; this is debt paid on contact.

**Treasury Management**
- [x] treasury-management/treasury-operations/intro-to-treasury — 2026-08-01 (rewritten)
- [x] treasury-management/treasury-operations/treasury-levels-and-mandate — 2026-08-01 (split from it, carries the rewrite)
- [x] treasury-management/treasury-operations/treasury-controls-and-structure — 2026-08-01 (split from it, carries the rewrite)
- [ ] treasury-management/working-capital/working-capital-and-liquidity
- [ ] treasury-management/working-capital/cash-management
- [ ] treasury-management/working-capital/inventory-and-creditors
- [ ] treasury-management/risk/foreign-exchange-risk
- [ ] treasury-management/risk/interest-rate-risk-management
- [ ] treasury-management/investment/debt-management
- [ ] treasury-management/investment/investment-management
- [ ] treasury-management/systems/clearing-and-settlement
- [ ] treasury-management/systems/treasury-management-systems

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
**Applies to:** all three courses — **3 of 44 steps checked** (the three TM
operations steps are the reference implementation; nothing else has been
opened. 44 not 42 because S-8 split TM 1.1 into three).

Pay it with the **rank** procedure in `SKILL.md` — score the step against
RULES, then fix what scored red, in the same edit that touches it for any other
reason. **D-1 and D-2 are paid together:** both are debts against the same
steps and both are paid on contact, so a step opened for one gets the other.

**Treasury Management**
- [x] treasury-management/treasury-operations/intro-to-treasury — 2026-08-01
- [x] treasury-management/treasury-operations/treasury-levels-and-mandate — 2026-08-01 (new, split from 1.1)
- [x] treasury-management/treasury-operations/treasury-controls-and-structure — 2026-08-01 (new, split from 1.1)
- [ ] treasury-management/working-capital/working-capital-and-liquidity
- [ ] treasury-management/working-capital/cash-management
- [ ] treasury-management/working-capital/inventory-and-creditors
- [ ] treasury-management/risk/foreign-exchange-risk
- [ ] treasury-management/risk/interest-rate-risk-management
- [ ] treasury-management/investment/debt-management
- [ ] treasury-management/investment/investment-management
- [ ] treasury-management/systems/clearing-and-settlement
- [ ] treasury-management/systems/treasury-management-systems
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
- [ ] the other 41 steps — machine-clean on device-narration and unresolvable
      references; **not** checked for undefined jargon, and **not** checked for
      names introduced in a different step

### D-3 · possessive budget, sentence length, step splitting, source links · opened 2026-08-01
**Source:** owner review 2026-08-01 (TM 1.1) — "we're using *your* too many
times"; "reduce the length in these other sentences, the user wouldn't want to
be reading forever"; "take advantage of nesting steps, it helps the step from
being way too long to read".
**Rules:** W-10 (revised, now a budget), W-12 (sentence length), S-8 (split long
steps), C-7 (revised, inline links rather than a box)
**Why it can't wait for a rewrite:** every other step is still one long climb
with no outbound links at all. S-8 is the expensive one: splitting changes URLs
and the course tree, so it is worth doing deliberately per lesson rather than
opportunistically. W-10 and W-12 are cheap and mechanical, and both have a
countable test.
**Applies to:** all three courses — **3 of 44 steps checked** (the three TM
operations steps; nothing else opened).

Measure before rewriting, because the eye is a bad judge of both:
`your` per total words (over 1-in-90 is a tic) and the longest sentence
(over 35 words splits). Section count over four is the S-8 signal.

**Treasury Management**
- [x] treasury-management/treasury-operations/intro-to-treasury — 2026-08-01
- [x] treasury-management/treasury-operations/treasury-levels-and-mandate — 2026-08-01 (new, split from 1.1)
- [x] treasury-management/treasury-operations/treasury-controls-and-structure — 2026-08-01 (new, split from 1.1)
- [ ] treasury-management/working-capital/working-capital-and-liquidity
- [ ] treasury-management/working-capital/cash-management
- [ ] treasury-management/working-capital/inventory-and-creditors
- [ ] treasury-management/risk/foreign-exchange-risk
- [ ] treasury-management/risk/interest-rate-risk-management
- [ ] treasury-management/investment/debt-management
- [ ] treasury-management/investment/investment-management
- [ ] treasury-management/systems/clearing-and-settlement
- [ ] treasury-management/systems/treasury-management-systems
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
