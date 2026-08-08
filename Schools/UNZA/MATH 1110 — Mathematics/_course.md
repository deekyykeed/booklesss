# MAT 1110: Foundation Mathematics and Statistics for Social Sciences — Course Status

**Last updated:** 2026-08-08

---

## Status: PLANNED — no steps written yet

Planned and scaffolded 2026-08-08 from the course's own outline
(`sources/MAT_1110_Course_Outline.pdf`) and the lecturer's chapter notes
(Xavier Mbaale, 2023). This course is authored for the **course reader** from
day one.

## Programme — and this course is UNZA's, nobody else's

**Bachelor of Arts (Economics), Year 1** — and the whole BA family beside it.
The course's full name is the evidence: *"Foundation Mathematics and
Statistics **for Social Sciences**"*, a service course taught into the School
of Humanities and Social Sciences first year. It is the required quantitative
course for Economics; a student cannot major in Economics without it.
Prerequisite: 'O' Level Mathematics.

⚠️ **Do not assume this course travels** (owner, 2026-08-08). "Foundation
Mathematics" is a common course title and the pipeline dedupes by title across
campuses, but that dedupe ranks the backlog, it does not claim two courses are
the same. This build is written against this course's own chapter notes,
tutorial sheets and papers, and is correct for UNZA students only.

**Where reader content lives**

| | |
|---|---|
| Authored source | `reader/course.mjs` (manifest) + `<lesson>/reader/<step>.mjs` |
| Publish | `node --env-file=.env.local platform/scripts/seed-course.mjs <course.mjs>` then `npm run gen:course` |
| House style | `.claude/skills/step-skill/RULES.md` + `DEBT.md` — read both before writing any step |
| Proposed course slug | `mathematics` (unclaimed as of 2026-08-08) |
| Student-facing name | **Mathematics** (never the code, never UNZA) |

## Discipline (C-11)

**Quantitative end to end** — the first course in the project that is pure
method with no business content. Every step where a tutorial sheet computes
something carries a worked example and an unworked one (**C-9**), and the
unworked ones come from the tutorial sheets (`sources/tutorials/`, 25 sheets).
**C-1/C-10 read differently here:** a Zambian anchor is a word problem with a
kwacha or a Lusaka context where the material has one, but most steps anchor
on the *worked figure*, not a company. The formula blocks (**E-2**) do the
heavy lifting; symbols named under every one.

⚠️ **Watch the failure mode named in `reference/disciplines.md`:** the step
becomes a solved-problems sheet where nothing is at stake. Every lesson still
opens on why the tool exists (what breaks without it), per **W-6**.

## Lesson order follows the lecturer's chapters, not the printed outline

The outline lists Statistics 9th and Probability 10th. The lecturer's own
chapter notes put **Probability at Chapter 6**, between Trigonometry (5) and
Exponentials (7), with Statistics last (10). The notes are what students walk
through, so the notes' order wins (**C-2**). Noted here so nobody "fixes" the
order back against the outline.

## Numbering scheme (lesson.step)

| Lesson | Topic (frame) | Folder | Steps |
|--------|---------------|--------|-------|
| — | Course intro (**S-11**, above lesson 1) | course root | `start-here-mathematics` |
| 1 | Foundations (sets, numbers) | `01-foundations` | 1.1–1.3 |
| 2 | Functions | `02-functions` | 2.1, 2.2 |
| 3 | Polynomials and Algebra | `03-algebra` | 3.1–3.4 |
| 4 | Trigonometry | `04-trigonometry` | 4.1–4.3 |
| 5 | Probability | `05-probability` | 5.1–5.3 |
| 6 | Exponentials and Logarithms | `06-exponentials` | 6.1, 6.2 |
| 7 | Differentiation | `07-differentiation` | 7.1–7.4 |
| 8 | Integration | `08-integration` | 8.1–8.3 |
| 9 | Descriptive Statistics | `09-statistics` | 9.1–9.3 |

Sets and Numbers share the Foundations lesson (foundational setup topics,
one frame: the language everything else is written in). Every other chapter
is its own frame and its own lesson.

## Step plan

Slugs checked against the 342 published ids on 2026-08-08; none collide.

| Step | Title | Slug | Written |
|------|-------|------|---------|
| 0 | Start Here: Mathematics | `start-here-mathematics` | — |
| 1.1 | Sets and Set Operations | `sets-and-set-operations` | — |
| 1.2 | Venn Diagrams | `venn-diagrams` | — |
| 1.3 | Number Systems | `number-systems` | — |
| 2.1 | Relations and Functions | `relations-and-functions` | — |
| 2.2 | One-to-One and Inverse Functions | `inverse-functions` | — |
| 3.1 | Linear and Quadratic Functions | `linear-and-quadratic-functions` | — |
| 3.2 | The Factor and Remainder Theorems | `factor-and-remainder-theorems` | — |
| 3.3 | Rational Functions and Partial Fractions | `partial-fractions` | — |
| 3.4 | Inequalities | `inequalities` | — |
| 4.1 | Trigonometric Functions and Their Graphs | `trigonometric-functions` | — |
| 4.2 | Trigonometric Identities | `trigonometric-identities` | — |
| 4.3 | Trigonometric Equations | `trigonometric-equations` | — |
| 5.1 | Sample Spaces and Events | `sample-spaces-and-events` | — |
| 5.2 | Conditional Probability and Independence | `conditional-probability` | — |
| 5.3 | Bayes' Theorem and Probability Trees | `bayes-theorem` | — |
| 6.1 | Exponential and Logarithmic Functions | `exponential-and-log-functions` | — |
| 6.2 | Exponential and Logarithmic Equations | `exponential-and-log-equations` | — |
| 7.1 | Limits and Continuity | `limits-and-continuity` | — |
| 7.2 | The Derivative and Differentiation Rules | `differentiation-rules` | — |
| 7.3 | Derivatives of Standard Functions | `standard-derivatives` | — |
| 7.4 | Applications of Differentiation | `applications-of-differentiation` | — |
| 8.1 | The Indefinite Integral | `the-indefinite-integral` | — |
| 8.2 | Integration by Substitution | `integration-by-substitution` | — |
| 8.3 | Integration by Parts and Partial Fractions | `integration-by-parts` | — |
| 9.1 | Frequency Distributions and Histograms | `frequency-distributions` | — |
| 9.2 | Measures of Central Tendency | `central-tendency` | — |
| 9.3 | Measures of Dispersion | `measures-of-dispersion` | — |

Proposed reader lesson slugs: `maths-foundations`, `functions`, `algebra`,
`trigonometry`, `probability`, `exponentials-and-logarithms`,
`differentiation`, `integration`, `descriptive-statistics`.
(`foundations` alone is already a published id.)

## Source Material

| Where | What | Covers |
|-------|------|--------|
| `01-foundations/sources/` | Sets lecture notes (Mbaale 2023), Chapter 2 (Numbers) | 1.1–1.3 |
| `02-functions/sources/` | Chapter 3 (Functions) | 2.1, 2.2 |
| `03-algebra/sources/` | Chapter 4 (Polynomial Functions) | 3.1–3.4 |
| `04-trigonometry/sources/` | Chapter 5 (Trigonometry), trig graphs supplement | 4.1–4.3 |
| `05-probability/sources/` | Chapter 6 (Probability) | 5.1–5.3 |
| `06-exponentials/sources/` | Chapter 7 (Exponential and Logarithmic Functions) | 6.1, 6.2 |
| `07-differentiation/sources/` | Chapter 8 (Differentiation) | 7.1–7.4 |
| `08-integration/sources/` | Chapter 9 (Integral Calculus) | 8.1–8.3 |
| `09-statistics/sources/` | Chapter 10 (Descriptive Statistics) | 9.1–9.3 |
| `sources/` | Course outline | whole course |
| `sources/tutorials/` | 25 tutorial sheets incl. TS5 solutions | C-9's unworked examples |
| `past-papers/` | Quiz 1 2020 solutions, quiz 2 2023 solutions, 2019 paper | what is actually examined |

Textbooks (Larson/Hodgkins — the prescribed text, Kaufmann, Aufmann, Bird,
the 47MB compiled notes, A-level references) stay in
`Schools/UNZA/_pipeline/MATH 1110 — Mathematics/` — local only, gitignored.

## Slack

None planned. Same note as every reader-era course: the reader is the
product; nothing gets created in Slack before the workspace question in
`Operations/workspace.md` is resolved with the owner.
