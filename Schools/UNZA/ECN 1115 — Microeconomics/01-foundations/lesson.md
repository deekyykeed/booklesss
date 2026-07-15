# Lesson 1 — Foundations (`#mic-foundations`)

The course's front door: what economics is about and how economists think,
before any diagrams. One mental frame — "thinking like an economist."

## Steps

| Step | Title | Access | Source | Status |
|------|-------|--------|--------|--------|
| 1.1 | What Economics Studies | public | none needed — universal intro | ✅ written (web step) · publish `mic-1-1` |
| 1.2 | Markets: Supply, Demand & How a Price Is Set | members | ECN 1115 lecture (see `_pipeline/`, local-only) | — planned |

## Notes

- **1.1 is a web step, not a PDF.** Authored through the step generator:
  `sources/content_mic_1_1.py` → `generate_step.py --emit-json` → publish the
  `mic-1-1` row into `public.steps`. It carries no dedicated source file —
  Foundations is universal intro material (scarcity, opportunity cost,
  marginal thinking, what markets do, positive vs normative), so it was safe
  to write without the gitignored UNZA lecture files.
- **1.1 is `access: public`** — the free front door and lead magnet, open to
  any signed-in student with no plan. Later steps default to `members`.
- **1.2 onward need the real ECN 1115 lecture material** from
  `Schools/UNZA/_pipeline/ECN 1115/` (gitignored, on the owner's machine) —
  see `../COURSE-PREP.md` for the source inventory to run and the provisional
  lesson plan to confirm against the syllabus.
- All examples use ZMW and Zambian settings (student budgets, load-shedding,
  the tomato market, ZESCO) per the house writing rules.
