# Where UNZA's courses fall — departments and programmes

**Built 2026-08-08** by reading the title page, header or department line of every
document in each course folder. **Every "documented" row below is a quotation from
the material itself**, not an inference from the subject name. The "inferred" rows
say so.

This file exists because **UNZA publishes no curriculum for any Humanities and
Social Sciences programme** — 98 of its 111 programme pages say "Coming soon", and
the 13 that do publish are all engineering, law, geology and agriculture. So the
pipeline (`pipeline_programmes` → `pipeline_programme_subjects`) has **zero course
rows for BA Economics, BA Demography, BA Development Studies** and the rest. What
follows is the missing curriculum, reconstructed from the paper students were
actually given.

---

## The thing that decides everything: it is a COMMON first year

**No 1000-level course here belongs to one programme.** UNZA's School of
Humanities and Social Sciences runs a shared first year: a student takes about
five courses, then majors from second year. So the honest answer to "which
programme is this course in" is usually **"the BA first year, and it points at
one major"**.

That is why the four courses planned this session cluster the way they do. A
student heading for **BA Economics** takes Macroeconomics and Microeconomics
(core), Foundation Mathematics (required for the degree), and fills the rest
from Demography, Development Studies, Sociology and the others — each of which
is *also* the opening course of its own major.

**For onboarding this means a Year 1 timetable is a pool, not a fixed list.**
A BA Economics student and a BA Demography student can sit in the same four
lecture theatres.

---

## The map

| Course | Department (documented) | School | Points at | Evidence |
|---|---|---|---|---|
| **ECN 1115** Microeconomics | Department of Economics | HSS | BA Economics — core | Course outline 2020, lecture notes |
| **ECN 1215** Macroeconomics | Department of Economics | HSS | **BA Economics — core** | Module title page: *"BACHELOR OF ARTS (Economics)"*, IDE |
| **ECN 2115** Intermediate Micro | Department of Economics | HSS | BA Economics, Year 2 | IDE assignment header ⚠️ see anomalies |
| **MAT 1110** Foundation Maths & Stats | Department of Mathematics and Statistics | Natural Sciences | BA Economics — required; service course to all HSS | Tutorial sheet headers; course title says *"for Social Sciences"* |
| **DEM 1110** Demography | Department of Population Studies | HSS | BA Demography — opening course; also taken by Economics | Course outline, lecture notes |
| **DEV 1150** Development Studies | Department of Development Studies | HSS | BA Development Studies — opening course; also taken by Economics | Notes title page, IDE exam paper |
| **SOC 1110** Sociology | Department of Sociology and Social Work | HSS | BA Sociology / BA Social Work | Exam seating sheet |
| **PSG 1110** Psychology | Department of Psychology | HSS | BA Psychology | *African Psychology PSG 1110_2023* ⚠️ folder is named `PSY` |
| **POL 1015** Political Science | Department of Political and Administrative Studies | HSS | BA Political Science | Module title page: *"BACHELOR OF ARTS"*, IDE |
| **PAM 1025** Public Administration | Department of Political and Administrative Studies | HSS | BA Public Administration / Local Government Administration | Tutorial questions header |
| **GMS 1035** Communication Skills | Department of Government and Management Studies | HSS | **Everyone** — see below | Assignment One 2023 header |
| **IRS 1035** International Relations | *(not stated in the material)* | HSS | BA International Relations | Course code only; department inferred as Political and Administrative Studies |
| **HRM 1015** Human Resource Management | *(not stated in the material)* | HSS | BA Human Resource Management | Course code only ⚠️ folder also holds PSG1110 material |
| **BBA 1110** Business Administration | *(not stated in the material)* | HSS | Bachelor of Business Administration | Course code only; programme name matches the scraped UNZA list |

**GMS 1035 is the highest-reach course on this list and nothing has been built
for it.** "Communication Skills" is a first-year course the whole school takes,
whatever they major in, which makes it worth more than any single major's core
course. It is still sitting in `_pipeline/`.

---

## Anomalies found while building this map — worth fixing at the source

- **`ECN 2115 — Intermediate Microeconomics` holds an `ECN 2331` assignment.**
  The only document with a department header in that folder is *"IDE ECN 2331
  Assignment 1 – June 2021"*, which is a different course code from the folder
  name. Either the folder is misnamed or the file was dropped in the wrong
  place. Resolve before the course is planned.
- **`HRM 1015` contains `PSG1110` (Psychology) material**, and carries no
  document naming its own department. Its source base may be thinner than the
  folder suggests.
- **The `PSY` folder's real course code is `PSG 1110`.** Rename it when the
  course is promoted, so it matches the code students see.
- **Two University of Lusaka files were found inside UNZA Macroeconomics** and
  removed 2026-08-08 — see that course's `_course.md`. **The lesson generalises:
  a pipeline folder can contain another university's material under a plausible
  name.** Check the title page before citing any source.

---

## Searched online 2026-08-09, and what it settled

The question was whether a reliable course list exists anywhere public. It does
not, and the search is worth recording so nobody repeats it.

| Source | Result |
|---|---|
| `unza.zm` programme pages | **"Coming soon"** on the BA Economics page itself, checked directly. The page also has a content bug: its intro text describes Bachelor of Social Work |
| `unza.zm/academics/undergraduate/programmes` | **141 programmes**, no course codes anywhere. Links to per-programme pages, which are the "Coming soon" ones |
| **`dspace.unza.zm`** (UNZA's own repository) | Past papers are real and organised by year, but bundled **per school per year**, not per course. Their DSpace TEXT bitstream, which exists for full-text search, extracts to **121 bytes of nothing** — the uploads are image scans, exactly like the copies on disk. OCR or nothing |
| Studocu / CourseHero | Name genuine UNZA codes: **ECN 2215** Intermediate Macroeconomics, **ECN 2311** Mathematics for Economics 1, **ECN 3115** Consumer Theory and Demand Functions. Student-uploaded, so leads rather than authority |
| A Scribd "ECN & BBA list of courses & prerequisites" | **North South University**, not UNZA. The same trap as the University of Lusaka module found in the Macroeconomics sources: a plausible title, the wrong institution |

**⚠️ Our programme scrape is incomplete: 141 published, 111 in the pipeline.**
About thirty programmes are missing. `tools/scrape_unza_programmes.py` should be
re-run and reloaded before anyone treats the picker's list as the full offering.

### The structural fact that changes how Year 1 is modelled

Found twice, independently: **UNZA does not admit anyone into Economics in first
year.** Students enter the School of Humanities under the non-quota programme,
and those who want Economics must take **microeconomics, macroeconomics and
mathematics for social sciences** in first year as the prerequisites for
admission into Economics in **second** year.

Two things follow:

1. **It confirms the Year 1 list loaded into the pipeline** — ECN 1115, ECN 1215
   and MAT 1110 are exactly those prerequisites, arrived at independently from
   the course material.
2. **"BA Economics, Year 1" is a statement of intent, not of enrolment.** The
   student is in the common first year hoping to qualify. That is the right thing
   for onboarding to record, because it is what they would say about themselves,
   but nobody should read the row as "enrolled in Economics".

## What this unblocks

Onboarding can only offer a Year 1 timetable for a programme the pipeline has
course rows for. Loading the 1000-level courses above against **BA Economics,
BA Demography, BA Development Studies** and the rest would put those programmes
in the picker with a real timetable, and each row can then carry a `live`
pointer as its course gets built (`live_slug` → `gen:programmes`).

Until then a UNZA HSS student taps "Mine isn't listed", types their programme,
and types each course by hand.

**Do not load this map anywhere a student sees it** — it carries course codes,
school and department names, all of which are internal (see the memory index).
It feeds `pipeline_*` tables, which are service-role only, and reaches
onboarding through the narrow `onboarding_curriculum` view that selects no code.
