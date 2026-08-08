# ECN 1215: Introduction to Macroeconomic Theory — Course Status

**Last updated:** 2026-08-08

---

## Status: PLANNED — no steps written yet

Planned and scaffolded 2026-08-08 from the course's own outline
(`sources/ECN 1215 Course Outline.pdf`). This course is authored for the
**course reader** from day one; the `steps/` folders exist for any PDF
provenance that accumulates but nothing is planned for them.

The outline's own instruction, kept verbatim because it is also ours:
*"Examples and applications must be drawn from Zambia."*

## Programme — and this course is UNZA's, nobody else's

**Bachelor of Arts (Economics), Year 1.** This is not an inference: the
module's own title page reads *"THE UNIVERSITY OF ZAMBIA / INSTITUTE OF
DISTANCE EDUCATION / BACHELOR OF ARTS (Economics) / MODULE / INTRODUCTION TO
MACROECONOMIC THEORY (ECN 1215)"*. Taught in the School of Humanities and
Social Sciences; the same first-year course is also taken by students heading
into Development Studies, Demography and the rest of the BA family.

⚠️ **Do not assume this course travels** (owner, 2026-08-08). Other Zambian
universities teach something called Macroeconomics, and the pipeline's
`pipeline_subjects` dedupes by title across campuses — that dedupe is a
**backlog-ranking device, not a claim that the courses are the same**. A
different school means a different syllabus, different notation and a
different paper. This build is written against UNZA's outline, UNZA's modules
and UNZA's past papers, and it is correct for UNZA students only. Serving it
to another campus needs that campus's own material and its own build.

**Where reader content lives**

| | |
|---|---|
| Authored source | `reader/course.mjs` (manifest) + `<lesson>/reader/<step>.mjs` |
| Publish | `node --env-file=.env.local platform/scripts/seed-course.mjs <course.mjs>` then `npm run gen:course` |
| House style | `.claude/skills/step-skill/RULES.md` + `DEBT.md` — read both before writing any step |
| Proposed course slug | `macroeconomics` ⚠️ the economics demo course carries a *group* id `macroeconomics`; verify at seed time that the namespaces don't clash, and resolve in favour of this course if they do |
| Student-facing name | **Macroeconomics** (never the code, never UNZA) |

## Discipline (C-11)

Mixed, **named per lesson** in each `lesson.md`. National Income is
quantitative (accounting identities, deflator arithmetic, the multiplier);
Foundations and Unemployment are discursive; Government, Money, Inflation and
External are mixed, with the marks mostly in explanation plus one calculation.
The tutorial sheets and past tests (`sources/tutorials/`, `past-papers/`)
decide where **C-9** binds: wherever a sheet asks for a computation, the step
carries a worked and an unworked example.

## Numbering scheme (lesson.step)

| Lesson | Topic (frame) | Folder | Steps |
|--------|---------------|--------|-------|
| — | Course intro (**S-11**, above lesson 1) | course root | `start-here-macro` |
| 1 | Foundations | `01-foundations` | 1.1, 1.2 |
| 2 | National Income | `02-national-income` | 2.1–2.4 |
| 3 | Unemployment | `03-unemployment` | 3.1, 3.2 |
| 4 | The Government Sector | `04-government` | 4.1–4.3 |
| 5 | The Monetary Sector | `05-money` | 5.1–5.3 |
| 6 | Inflation | `06-inflation` | 6.1, 6.2 |
| 7 | The External Sector | `07-external-sector` | 7.1–7.3 |

The seven lessons are the outline's own seven content headings, unmerged:
each is a genuinely different frame (measuring output, the labour market, the
state, money, prices, the outside world). Unemployment and Inflation were
deliberately **not** merged into an "instability" lesson; the outline keeps
them apart and they are different headspaces.

## Step plan

Step slugs are global across every course. All of these were checked against
the 342 ids in `course-data.json` on 2026-08-08; `exchange-rates`,
`unemployment`, `inflation`, `trade`, `fiscal` and `monetary` are already
taken by the economics demo course, which is why the slugs below are longer.

| Step | Title | Slug | Written |
|------|-------|------|---------|
| 0 | Start Here: Macroeconomics | `start-here-macro` | — |
| 1.1 | The Study of Macroeconomics | `the-study-of-macroeconomics` | — |
| 1.2 | Positive and Normative Economics | `positive-and-normative` | — |
| 2.1 | The Circular Flow of Income | `the-circular-flow` | — |
| 2.2 | National Income Accounting | `national-income-accounting` | — |
| 2.3 | Real and Nominal Income | `real-and-nominal` | — |
| 2.4 | The Keynesian Income and Expenditure Model | `the-keynesian-model` | — |
| 3.1 | Unemployment and Its Types | `unemployment-and-its-types` | — |
| 3.2 | Causes, Costs and Cures of Unemployment | `unemployment-causes-and-cures` | — |
| 4.1 | Public Finance | `public-finance` | — |
| 4.2 | The National Budget and Public Debt | `budget-and-public-debt` | — |
| 4.3 | Fiscal Policy | `fiscal-policy` | — |
| 5.1 | Money and Its Functions | `money-and-its-functions` | — |
| 5.2 | Banks and the Central Bank | `banks-and-the-central-bank` | — |
| 5.3 | Monetary Policy | `monetary-policy` | — |
| 6.1 | Inflation and Its Causes | `inflation-and-its-causes` | — |
| 6.2 | The Effects and Cures of Inflation | `effects-and-cures-of-inflation` | — |
| 7.1 | International Trade | `international-trade` | — |
| 7.2 | The Balance of Payments | `balance-of-payments` | — |
| 7.3 | Exchange Rates | `foreign-exchange-rates` | — |

Proposed reader lesson slugs (middle URL segment): `macro-foundations`,
`national-income`, `macro-unemployment`, `government-sector`,
`money-and-banking`, `macro-inflation`, `external-sector`. The prefixed ones
dodge ids the economics demo course already uses.

## Source Material

| Where | What | Covers |
|-------|------|--------|
| `01-foundations/sources/` | Lectures 1–2, positive/normative note, two intro decks | 1.1, 1.2 |
| `02-national-income/sources/` | GDP notes ×3, national income aggregates chapter | 2.1–2.4 |
| `04-government/sources/` | Lecture 7 (government), Lecture 8 (fiscal), public finance PPT | 4.1–4.3 |
| `05-money/sources/` | Money market deck (filed as "Lecture 2") | 5.1–5.3 |
| `06-inflation/sources/` | Lecture 10 (inflation rate) | 6.1, 6.2 |
| `sources/` | Course outline, two full modules, lecture-notes compilation | whole course; the only source for lessons 3 and 7 |
| `sources/transcripts/` | ECO 155 Principles of Macroeconomics, 39 lectures transcribed, plus Khan Academy GDP series | lecturer-emphasis evidence for every lesson (C-2) |
| `sources/tutorials/` | 19 tutorial sheets, several with solutions | where C-9's unworked examples come from |
| `past-papers/` | Exam questions, practice exam, test 2 with answers, question bank | what is actually examined |

Textbooks (Begg — the required text, Mankiw ×4, Ahuja 388MB, Dornbusch/Fischer,
Case/Fair/Oster) and the bulk HSS exam scans stay in
`Schools/UNZA/_pipeline/ECN 1215 — Macroeconomics/` — local only, gitignored,
several over GitHub's 100MB limit. The lesson folders carry everything
topic-specific.

## Slack

None planned. Slack-as-the-paid-product was dropped (Linear BOO-7); the reader
is the product. If free-community channels are ever wanted for this course the
map is one channel per lesson (`#macro-foundations` … `#macro-external-sector`),
but nothing gets created before the workspace question at the top of
`Operations/workspace.md` is resolved with the owner.
