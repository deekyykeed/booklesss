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

*(no debt items yet — opened as the first study session and the first student
reactions land)*

---

## Items

*(none)*
