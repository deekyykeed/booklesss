# Reference — course planning

*Part of `step-skill`. Read this when deciding what a course's lessons and steps
are; writing them is `SKILL.md`.*

The **PLAN** phase:

```
[ PLAN ]        →  [ WRITE ]        →  [ IMPROVE ]
 this file         SKILL.md            SKILL.md + RULES/DEBT/LOG
```

This decides **what the lessons and steps are**. It does not write step content.
Move on once the structure is agreed.

---

## The one doctrine: lesson = channel = one mental frame

A Booklesss course is **Course → Lessons → Steps**.

> **2026-08-09 — the step's grain changed (S-1 revised).** A reader step is now
> **one small containable concept with exactly one checkpoint**: one section,
> one check, a roughly five-minute read. What used to be planned as one
> three-section step is now a named folder holding three steps, so plan slugs
> and folders at that grain: expect **40–70 steps per course** rather than
> 12–25, group every run of sibling steps under a folder (**S-9** now allows
> four or five levels of nesting), and read the old step-count instincts below
> as *folder* counts. Treasury Management converted the same day — 22 steps of
> 60 sections became 60 steps. The lesson doctrine is untouched: a lesson is
> still one mental frame; there are simply more, smaller steps inside it.

- A **step** is one PDF (one thing a student reads, one Slack post).
- A **lesson** is a grouping of **conceptually similar steps** — steps that share
  **one mental frame** — and it maps to **exactly one Slack channel**.
- A **course** is the whole subject.

**Why the lesson boundary matters — it is noise control.** Each lesson has its own
channel so students deep in one topic are never disturbed by, and never disturb,
students in a different headspace. A student working through Finance has nothing to
say to one buried in Marketing — different frames, different channels.

This single rule drives every decision below. (See also memory:
`project_lesson-channel-structure`.)

### Hard rules that fall out of it
1. **The number of lessons is not fixed.** It follows the topic boundaries. More if
   the material needs more, fewer if it needs fewer. Never pick a round number
   (4, 9, …) as a target.
2. **Distinct professional domains are each their own lesson.** Marketing, Finance,
   Production, HR are different frames — never lump them into one "operations"
   bucket just to cut the channel count. Cutting channels for tidiness is the wrong
   reason and breaks noise isolation.
3. **Only merge topics that genuinely share a frame.** Foundational setup topics
   (e.g. "what a business is" + "how it's structured") can sit in one Foundations
   lesson. Two analytical halves of the same activity (e.g. external + internal
   environment analysis) can share a lesson.
4. **A lesson is a grouping of conceptually similar steps.** How many steps it holds
   is whatever the content needs — cover the frame without padding, but don't force
   the count to one either. The step count is not a target and not what defines the
   lesson; the conceptual grouping (→ one channel) is. Number steps `lesson.step`
   (1.1, 1.2 = lesson 1; 2.1 = lesson 2).

### Precedent
- **Strategic Management** — 3 lessons, each one frame, multiple steps:
  Foundations (1.1 intro, 1.2 mission/vision) → `#sm-foundations`;
  Environment (2.1 external, 2.2 internal) → `#sm-environment`;
  Strategy (3.1 corporate, 3.2 competitive, 3.3 implementation) → `#sm-strategy`.

---

## Workflow

### 1. Locate the source
Active courses keep source under each lesson's `sources/`. A course being promoted
lives in `Schools/[School]/_pipeline/[Course]/`. Find every lecture, note set,
past-paper, and textbook for the course.

### 2. Inventory topics and assess depth
List the natural topics of the course (from the syllabus / scheme of work / lecture
set). For each, gauge how much real, topic-specific source exists — scan filenames
and sizes, not just counts. Shared general-notes copied into every folder don't
count toward a topic's depth; the topic-specific lecture(s) do.

```bash
python3 - <<'PY'
import os
base = r"Schools/<School>/<Course>"
for root, dirs, files in os.walk(base):
    src = [f for f in files if f.lower().endswith(('.pdf','.pptx','.docx','.ppt'))]
    if src:
        print(os.path.relpath(root, base))
        for f in sorted(src):
            print(f"   {os.path.getsize(os.path.join(root,f))//1024:>6} KB  {f}")
PY
```

### 3. Group topics into lessons — by mental frame
Apply the doctrine. For each candidate grouping ask: *would a student discussing
topic A be in the same headspace as one discussing topic B?* Same frame → same
lesson/channel. Different frame → separate lessons. Keep the count honest to the
material.

### 4. Set the steps per lesson — content-driven
A lesson holds the steps that are conceptually similar — the ones that cover its
frame. Don't pad it with extra steps, and don't force it down to one; the count
follows the material and isn't the point. The lesson is defined by the grouping of
similar-concept steps, not by how many there are.

### 4b. Put the course-intro step at the top — every course, no exceptions
**S-11**, added 2026-08-07. Before lesson 1 sits one step that is about the
course rather than about its first topic: why the subject exists, what it
connects to, what someone who has it can do that someone without it cannot, one
line congratulating the reader for starting, and how to read the thing.

It sits **above the first lesson folder**, not inside it, and it is planned here
rather than discovered later because a course scaffolded without it gets one
bolted on afterwards, out of the argument the rest of the course makes.

Two traps, both in **S-11** in full:
- It is **not** a contents page. **S-6** still bans a course skeleton in a step,
  and this is the step most likely to grow one. The shape of the course goes in
  one sentence; the sidebar lists the steps.
- It is the **shortest** step in the course, two or three sections. A reader who
  has to climb the introduction has learned something about the course, and it
  is not what was intended.

### 5. Confirm with the user before writing files
Present the proposed lessons, their steps, and the channel each maps to, as a table.
Name the judgment calls explicitly (which topics you merged and why; which lessons
you split into extra steps). Do not scaffold until the structure is agreed — this is
the cheap moment to change it.

### 6. Emit the structure

> **Reader-era note (2026-08-08, from planning the four UNZA courses):** the
> channel map and the outline PDF below are Slack-era artifacts. A course
> promoted today is authored for the reader; plan the step slugs instead
> (checked against the published ids in `platform/src/lib/course-data.json` —
> step slugs are global across courses), record "Slack: none planned" in
> `_course.md`, and treat the outline PDF as an optional lead-magnet job.
> **Never create Slack channels** — paid Slack was dropped (BOO-7) and the
> workspace question is unresolved (`Operations/workspace.md`).

Once agreed, produce all of:
- **`_course.md`** at the course root — the canonical tracker (see template below).
- **Folder scaffold** — one folder per lesson, each with `steps/`, `sources/`, and
  `lesson.md`. Name folders `NN-<channel-slug>` in lesson order — the folder slug
  equals the lesson's Slack channel name (after the course prefix), so folders and
  channels match at a glance (e.g. `03-management` ↔ `#bba-management`).
- **Slack channel map** — one `#[course]-[lesson]` channel per lesson, plus a
  `#[course]-updates` announcements channel. Flag that channels must be created in
  Slack before any step is posted.
- **Course outline PDF** — see below.

### 7. Hand off
The plan is done. Each step is now written by **step-skill** (source → ReportLab
script in that lesson's `sources/` → PDF in `steps/`).

---

## `_course.md` template

The tracker every course root carries. Keep these sections:

```markdown
# [CODE]: [Full Title] — Course Status
**Last updated:** [date]

## Overview
| Field | Value |
( course code, full title, school, Slack section, updates channel,
  lessons, total steps planned, PDFs generated, steps posted )

> **Visual identity:** [cover bg] · [accent] · [display font] · [body font]

## Numbering scheme (lesson.step)
| Lesson | Topic (frame) | Folder | Channel | Steps |

## Step Status
| Step | Title | Source | PDF | Posted | Channel |

## Source Material
| Folder / File | Covers |

## Slack Channel Map
| Channel | Lesson | Steps |
> Action required: create all channels before posting.
```

---

## Course outline PDF

A one-piece overview of the whole course. **It renders through step-skill** (same
foundation: fonts, palette, page geometry, helpers) using the course's own visual
identity — a course-specific document looks like its course, not the cream house
brand. Reference implementation:
`Schools/UNZA/BBA 1110 — Business Administration/sources/build_bba_course-outline.py`.

Structure:
1. **Cover** — TripleDiamond, `COURSE OUTLINE` eyebrow, Parastoo title, one-line
   subtitle, course meta. Course identity (e.g. BBA = charcoal cover + amber accent).
2. **About This Course** — 2 short paragraphs: what it is, the through-line, that it
   runs as N lessons of self-contained steps.
3. **How It's Organised** — short table mapping each lesson → its Slack channel.
4. **The Lessons** — ONE continuous table, lessons as tinted sub-header rows, with
   `#` / Lesson(step) / "What it covers" columns and `repeatRows=1` so the header
   repeats across page breaks. (Avoid one-block-per-page KeepTogether — it leaves big
   gaps and reads as padded.)
5. **What You Should Be Able to Do** — 5–6 course-level outcomes.

Build by running the script via Bash, then QA-render with PyMuPDF
(`fitz`, `Matrix(1.6,1.6)`) to check no orphaned headings and tight spacing.

Filename: `Course Outline - [Course].pdf` at the course root.

---

## Boundaries
- This skill plans; it does not write step content (step-skill) or web/UI
  (design-system).
- It does not post to Slack. It produces the channel **map**; creating channels and
  posting is a manual operational step.
- Follow the house writing style in any prose it emits (banned-words list, ZMW +
  Zambian examples) — same rules as step-skill.
