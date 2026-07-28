---
name: step-feedback
description: >
  Captures and applies the owner's feedback on generated course-reader steps —
  both the writing (voice, length, how an idea is explained) and the page
  elements (which block type carries which job, how a formula/table/callout
  should look). Two directions, both mandatory. READ IT BEFORE writing or
  editing any reader step, so the accumulated rules are applied rather than
  rediscovered. INVOKE IT AFTER the owner reacts to a step — "this reads too
  X", "that table should be Y", "don't do Z again", "I like this", "make it
  shorter" — to log the reaction and, when it generalises, promote it to a
  rule. Triggers: "feedback on this step", "log that", "remember that for the
  next step", "that's a rule", "why did you write it like that", or any
  reaction to generated step content. Applies to reader steps in platform/
  (Supabase courses → nav_nodes → lessons), not to PDFs — PDFs are step-skill.
---

# step-feedback

The owner reviews every generated step and always has something to say. Without
a loop, that feedback is spent once and the next step repeats the same mistake.
This skill is the loop.

```
write a step ──► owner reacts ──► LOG it ──► does it generalise?
     ▲                                            │
     │                                       yes ─┴─► promote to RULES.md
     └───────────── read RULES.md first ◄──────────────────┘
```

Three files:

| File | What it is | When it's touched |
|------|-----------|-------------------|
| `RULES.md` | The **active** rules. The house style for reader steps. | Read before writing. Appended/edited when feedback generalises. |
| `LOG.md` | Every reaction, dated, tied to the step it was about. | Appended after every review. Never edited or pruned. |
| `SKILL.md` | This file — the loop itself. | Rarely. |

---

## Direction 1 — BEFORE writing a step

**Read `RULES.md` in full.** It is short by design; read all of it, not a grep.
Then write the step so that every rule holds. Do not re-derive style decisions
that a rule already settles, and do not "improve" on a rule because the current
step feels like an exception — if it genuinely is one, say so to the owner
rather than quietly departing.

If a rule and the step's source material conflict (e.g. a lecture uses a term
the rules ban), follow the rule and note the substitution.

---

## Direction 2 — AFTER the owner reacts

Every reaction gets logged, even a one-word one. Do this in the same turn the
owner gives it — not batched at wrap.

### 1. Classify

Every piece of feedback is about one of four things. Tag it:

| Tag | Covers |
|-----|--------|
| `writing` | Voice, tone, sentence length, how an idea is explained, what to cut |
| `element` | Which block type does which job; how a formula, table, callout, list should look and when to reach for it |
| `structure` | Section count and order, what earns its own section, checkpoint/check questions, step splitting |
| `content` | What must be covered, what depth, which examples, exam-relevance |

Feedback often carries two tags. Log it under both.

### 2. Log it

Append to `LOG.md`, newest at the top of the entries:

```markdown
### 2026-07-27 · corporate-finance/investment-appraisal/free-cash-flows
- `writing` — "too much throat-clearing before the definition." Cut the opening
  paragraph; lead with what FCF is.
- `element` — the FCF waterfall should be a `table`, not a `ul`. Amounts must
  right-align and the total needs a rule above it.
→ promoted: **W-4**, **E-2**
```

Rules of logging:
- Quote or closely paraphrase the owner's actual words. Their phrasing carries
  the intent; a tidied-up summary loses it.
- Always name the step it was about, by its reader path.
- End with `→ promoted:` and the rule ids, or `→ one-off` if it doesn't
  generalise.

### 3. Decide whether it generalises

Promote to `RULES.md` when the feedback would apply to a step the owner
hasn't seen yet. Keep it in `LOG.md` only when it is genuinely local to this
step's subject matter.

Ask: *"if I write the next step and ignore this, will the owner say it
again?"* If yes, it's a rule.

Signals it's a rule:
- The owner says "always", "never", "from now on", "again".
- It's the **second** time the same note has come up — check `LOG.md` before
  deciding. Two occurrences of a one-off make a rule; say so when promoting it.
- It's about the medium (a block type, section length) rather than the topic.

### 4. Promote it

Add to the right section of `RULES.md` with the next free id in that section's
series (`W-` writing, `E-` element, `S-` structure, `C-` content). One rule per
line, imperative, testable. A rule you can't check a draft against is a wish,
not a rule.

Good: **E-2** — Financial waterfalls use `table` with right-aligned amounts and
a rule above the total. Never a `ul`.

Bad: ~~**E-2** — Tables should look good and be easy to read.~~

When new feedback contradicts an existing rule, **edit that rule in place** and
add `(revised YYYY-MM-DD)`. Do not leave both standing. When a rule is
withdrawn entirely, strike it through rather than deleting — a rule that was
tried and dropped is worth knowing about.

### 5. Confirm to the owner

One line, no ceremony: which rules were added or changed, and what will be
different next step. If nothing was promoted, say that too — silently logging
feedback the owner expected to become a rule is the failure mode this skill
exists to prevent.

---

## What does NOT go in here

- Facts about the course content (those go in the course's `_course.md`).
- Bugs in the reader app (those are code, not style).
- Anything already in `.claude/CLAUDE.md` — that file outranks this one, and
  duplicating it means two places to update. `RULES.md` may *sharpen* a
  CLAUDE.md rule for reader steps specifically; it must never contradict it.
