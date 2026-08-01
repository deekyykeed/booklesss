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
| D-1 | Engagement pass — every step written before the hook rules | 2026-08-01 | open · 1/42 |

---

## Items

### D-1 · engagement pass: hook, concrete anchors, case-telling, table framing · opened 2026-08-01
**Source:** study session 2026-08-01 (TM 1.1) · owner · study — "the very first
step is boring… spice it up, keep it engaging with a proper hook."
**Rules:** W-3 (revised), W-6, W-7, C-5, C-6, S-7
**Why it can't wait for a rewrite:** every step in all three courses was written
to the old W-3, which asked for the definition first and got a textbook opening
every time. This is not a defect in one step; it is the house voice as it stood.
**Applies to:** all three courses — **1 of 42 steps checked** (TM 1.1 rewritten;
`cash-management`, `npv-and-payback`, `intro-to-strategy` had their openings read
but nothing else, and are NOT ticked).

Pay it with the **engagement pass** in `SKILL.md` — six checks, run against the
step in front of you, in the same edit that touches it for any other reason.
Do not batch-rewrite steps nobody is reading yet; this is debt paid on contact.

**Treasury Management**
- [x] treasury-management/operations/intro-to-treasury — 2026-08-01 (rewritten)
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
