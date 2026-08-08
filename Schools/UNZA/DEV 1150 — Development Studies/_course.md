# DEV 1150: Introduction to Development Studies — Course Status

**Last updated:** 2026-08-08

---

## Status: PLANNED — no steps written yet

Planned and scaffolded 2026-08-08 from the department's own lecture notes
(`DEV 1150 Notes (2017).pdf`, the DS 101 compilation whose first pages carry
the official course content list) plus four dedicated lecture decks. This
course is authored for the **course reader** from day one.

## Programme — and this course is UNZA's, nobody else's

**Year 1 of the School of Humanities and Social Sciences BA**, taught by the
**Development Studies Department** (the notes' own title page: *"UNIVERSITY OF
ZAMBIA / SCHOOL OF HUMANITIES AND SOCIAL SCIENCE / DEVELOPMENT STUDIES
DEPARTMENT / DS 101: INTRODUCTION TO DEVELOPMENT STUDIES"*).

It sits in **two** places at once, which is worth being precise about: it is
the first course of the **BA in Development Studies** major, and it is a
standard first-year course for **BA Economics** students, who take it
alongside Macroeconomics. Both are real; neither owns it.

⚠️ **Do not assume this course travels** (owner, 2026-08-08). Development
Studies is taught at other campuses under similar names and the pipeline
dedupes by title, but that dedupe ranks the backlog rather than claiming two
courses are the same. This build runs on this department's own notes and its
own paper, and is correct for UNZA students only.

**Where reader content lives**

| | |
|---|---|
| Authored source | `reader/course.mjs` (manifest) + `<lesson>/reader/<step>.mjs` |
| Publish | `node --env-file=.env.local platform/scripts/seed-course.mjs <course.mjs>` then `npm run gen:course` |
| House style | `.claude/skills/step-skill/RULES.md` + `DEBT.md` — read both before writing any step |
| Proposed course slug | `development-studies` (unclaimed as of 2026-08-08) |
| Student-facing name | **Development Studies** (never the code, never UNZA) |

## Discipline (C-11)

**Discursive end to end** — the first course of its kind in the project, so
`reference/disciplines.md`'s Discursive profile gets its first real test here
and should be corrected from what this course teaches us. What the exam asks
the reader to produce: **a position, argued with evidence** (the assessment is
two essays, a test and a final; the 2017-18 IDE paper in `past-papers/` is the
evidence). That means:

- **C-9** reads as position + counter-position: the worked example argues a
  side with its evidence, the unworked one hands the reader the other side.
- A concrete anchor (**C-5**) is a date, a place, a named policy and what it
  did. Zambia is the running case: ZCCM privatisation, the SAP years, FRA
  maize purchases, the Task Force on Corruption, LCMS poverty numbers.
- **S-5** is hardest here: wrong check options must be positions a thinking
  student actually holds, not straw men.
- The theory lesson is where "every side given equally, nothing at stake"
  will try to happen. Each theory step opens on what that school *blames* for
  underdevelopment, which is a claim someone disagrees with (**W-6**).

## Numbering scheme (lesson.step)

The six lessons are the notes' own six units, unmerged; each is one frame.

| Lesson | Topic (frame) | Folder | Steps |
|--------|---------------|--------|-------|
| — | Course intro (**S-11**, above lesson 1) | course root | `start-here-development` |
| 1 | Introducing Development | `01-introducing-development` | 1.1, 1.2 |
| 2 | Development Problems | `02-development-problems` | 2.1, 2.2 |
| 3 | Theories of Development | `03-theories` | 3.1–3.4 |
| 4 | Contemporary Issues | `04-contemporary-issues` | 4.1–4.6 |
| 5 | Culture and Development | `05-culture` | 5.1, 5.2 |
| 6 | New Directions | `06-new-directions` | 6.1–6.3 |

Lesson 4 is six steps under one frame ("how X shapes development", six times);
in the reader it should get an **S-9** folder treatment so the sidebar doesn't
show six flat rows. Lesson 3's four theory steps likewise group naturally.

## Step plan

Slugs checked against the 342 published ids on 2026-08-08; none collide.

| Step | Title | Slug | Written |
|------|-------|------|---------|
| 0 | Start Here: Development Studies | `start-here-development` | — |
| 1.1 | Defining Development | `defining-development` | — |
| 1.2 | Approaches to the Study of Development | `approaches-to-development` | — |
| 2.1 | The Developing World and Its Labels | `the-developing-world` | — |
| 2.2 | Poverty and Poverty Alleviation | `poverty-and-alleviation` | — |
| 3.1 | Modernization Theories | `modernization-theories` | — |
| 3.2 | Marxist Theories of Imperialism | `marxist-theories` | — |
| 3.3 | Dependency Theories | `dependency-theories` | — |
| 3.4 | Alternative Approaches to Development | `alternative-approaches` | — |
| 4.1 | Agriculture and Food Security | `agriculture-and-food-security` | — |
| 4.2 | Population and Development | `population-and-development` | — |
| 4.3 | Environment and Development | `environment-and-development` | — |
| 4.4 | Gender and Development | `gender-and-development` | — |
| 4.5 | Corruption and Development | `corruption-and-development` | — |
| 4.6 | Conflict and Development | `conflict-and-development` | — |
| 5.1 | Culture's Role in Development | `culture-and-development` | — |
| 5.2 | Elite Culture and Cultural Imperialism | `cultural-imperialism` | — |
| 6.1 | The Impasse and the Rise of Neo-Liberalism | `the-rise-of-neoliberalism` | — |
| 6.2 | Globalization and Development | `globalization-and-development` | — |
| 6.3 | Human Rights and the Millennium Development Goals | `human-rights-and-the-mdgs` | — |

Proposed reader lesson slugs: `introducing-development`,
`development-problems`, `development-theories`, `contemporary-issues`,
`culture` (the lesson; the *step* keeps `culture-and-development` — the two
must differ), `new-directions`.

Note on 6.3: the notes teach the **MDGs** and the paper is set from the
notes, so the step teaches the MDGs (**C-4**) and gives the SDGs that
replaced them one orienting sentence.

## Source Material

| Where | What | Covers |
|-------|------|--------|
| `<every lesson>/sources/DEV 1150 Notes (2017).pdf` | the DS 101 lecture-notes compilation, 58pp — copied into each lesson per house convention | the whole course |
| `04-contemporary-issues/sources/` | dedicated decks: corruption, environment, population | 4.5, 4.3, 4.2 |
| `05-culture/sources/` | dedicated deck: culture and development | 5.1, 5.2 |
| `past-papers/` | DEV 1150 IDE final exam 2017–2018 | what is actually examined |

The pipeline folder (`Schools/UNZA/_pipeline/DEV 1150 — Development Studies/`)
is small and everything relevant is copied; the original stays as provenance.
This is the thinnest source base of the four courses planned 2026-08-08 —
one notes compilation, four decks, one past paper. **A gap found while
writing is a finding to raise, not a licence to fill from general knowledge
(C-2).**

## Slack

None planned. The reader is the product; nothing gets created in Slack before
the workspace question in `Operations/workspace.md` is resolved with the owner.
