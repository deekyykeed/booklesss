# DEM 1110: Introduction to Demography — Course Status

**Last updated:** 2026-08-08

---

## Status: PLANNED — no steps written yet

Planned and scaffolded 2026-08-08 from the department's own outline
(`sources/DEM 1110 COURSE OUTLINE MARCH 2020.docx`, 13 topics). This course is
authored for the **course reader** from day one.

**Where reader content lives**

| | |
|---|---|
| Authored source | `reader/course.mjs` (manifest) + `<lesson>/reader/<step>.mjs` |
| Publish | `node --env-file=.env.local platform/scripts/seed-course.mjs <course.mjs>` then `npm run gen:course` |
| House style | `.claude/skills/step-skill/RULES.md` + `DEBT.md` — read both before writing any step |
| Proposed course slug | `demography` (unclaimed as of 2026-08-08) |
| Student-facing name | **Demography** (never the code, never UNZA) |

## Discipline (C-11)

**Split down the middle, named per lesson.** Lessons 1 and 2 are discursive
(what demography is, what it is for). Lesson 3 is **quantitative**: the exam
asks for simple demographic calculations (the outline's own aim: *"to do some
simple demographic calculations"*), so every measure gets a worked example at
Zambian census figures and an unworked one from the past papers (**C-9**) —
and the past-paper stock here is the deepest of any UNZA course on disk
(16 papers, 1995–2019). Lesson 4 is mixed: sources and limitations are
discursive, presentation and analysis are quantitative.

## Numbering scheme (lesson.step)

The outline's 13 topics group into four frames. Topics 1–3 share "locating
the discipline", 4–5 share "what it is for", 6–7 are the measurement core,
8–12 are all about data. Topic 13 (the excursion to ZamStats and the
Ministry of Finance) is a field trip, not a step; its content is absorbed
into 4.1.

| Lesson | Topic (frame) | Folder | Outline topics | Steps |
|--------|---------------|--------|----------------|-------|
| — | Course intro (**S-11**) | course root | — | `start-here-demography` |
| 1 | Foundations | `01-foundations` | 1–3 | 1.1–1.3 |
| 2 | Demography at Work | `02-demography-at-work` | 4–5 | 2.1, 2.2 |
| 3 | Measuring Population | `03-measuring-population` | 6–7 | 3.1–3.4 |
| 4 | Data and Statistics | `04-data-and-statistics` | 8–12 | 4.1–4.5 |

## Step plan

Slugs checked against the 342 published ids on 2026-08-08; none collide.

| Step | Title | Slug | Written |
|------|-------|------|---------|
| 0 | Start Here: Demography | `start-here-demography` | — |
| 1.1 | The Scope of Demography | `the-scope-of-demography` | — |
| 1.2 | The History of Demography | `the-history-of-demography` | — |
| 1.3 | Demography and Other Disciplines | `demography-and-other-disciplines` | — |
| 2.1 | Population Problems and Contemporary Issues | `population-problems` | — |
| 2.2 | Applied Demography | `applied-demography` | — |
| 3.1 | Population Size, Composition and Distribution | `population-size-and-composition` | — |
| 3.2 | Measuring Fertility and Mortality | `fertility-and-mortality` | — |
| 3.3 | Measuring Migration and Morbidity | `migration-and-morbidity` | — |
| 3.4 | Population Change and Society | `population-change-and-society` | — |
| 4.1 | Sources of Demographic Data | `sources-of-demographic-data` | — |
| 4.2 | Social and Economic Statistics | `social-and-economic-statistics` | — |
| 4.3 | Presenting Demographic Data | `presenting-demographic-data` | — |
| 4.4 | Problems and Limitations of Statistics | `limitations-of-statistics` | — |
| 4.5 | Statistics in Planning and Administration | `statistics-in-planning` | — |

Proposed reader lesson slugs: `demography-foundations`, `demography-at-work`,
`measuring-population`, `data-and-statistics`.

Zambia is the running case throughout: the 2022 census (19.6m), ZamStats as
the source students will actually use, CSO history for 1.2, and the
outline's own excursion list (ZamStats, Ministries of Finance and Health) as
the institutions in 4.1.

## Source Material

| Where | What | Covers |
|-------|------|--------|
| `01-foundations/sources/` | Intro deck (PPTX + PDF), meaning/scope note, malthus.pdf, DEMOGRAPHY.pdf | 1.1–1.3 |
| `02-demography-at-work/sources/` | Topic 4 deck (contemporary problems), Topic 5 deck (applied) | 2.1, 2.2 |
| `03-measuring-population/sources/` | DEMOGRAPHY.pdf (shared), Demo 1110.pdf | 3.1–3.4 |
| `04-data-and-statistics/sources/` | Lecturer notes (social/economic/demographic statistics), data presentation deck, Andrew's statistics notes, 2015 draft pointers | 4.1–4.5 |
| `sources/` | Course outlines (2019, 2020), tutorial topics (2020, 2023), tutorial sheet 1 (2021) | whole course |
| `past-papers/` | 16 papers and question sets, 1995–2019, incl. three full final exams with the DEMO extracts from the HSS scans | what is actually examined — the deepest past-paper stock of any UNZA course |

The 16MB compiled notes (`demography batch (1).pdf`) stay in
`Schools/UNZA/_pipeline/DEM 1110 — Demography/` — local only, gitignored.

## Slack

None planned. The reader is the product; nothing gets created in Slack before
the workspace question in `Operations/workspace.md` is resolved with the owner.
