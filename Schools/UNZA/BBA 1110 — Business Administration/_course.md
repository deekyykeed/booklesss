# BBA 1110: Principles of Business Administration — Course Status

**Last updated:** 2026-06-09

---

## Overview

| Field | Value |
|-------|-------|
| Course code | BBA 1110 |
| Full title | Principles of Business Administration |
| School | UNZA |
| Platform | Booklesss (Slack) |
| Slack section | Business Administration |
| Updates channel | `#bba-updates` — create channel first |
| Lessons | 8 |
| Total steps planned | 9 |
| PDFs generated | 1 |
| Steps posted to Slack | 0 |

> **Visual identity:** Dark slate-charcoal cover `#1C2526` · amber gold accent `#F59E0B` · near-white body `#FAFAF8` · Parastoo-Bold headings · Aptos body.

> **Structure rule:** lesson = one mental frame = one Slack channel (noise isolation).
> Steps are minimised — a lesson is one step unless a single tight PDF would overflow.
> Only Foundations runs to two steps (two genuinely distinct topics).

---

## Lessons & Steps (lesson.step)

| Lesson | Frame | Folder | Channel | Steps |
|--------|-------|--------|---------|-------|
| 1 | Foundations | `01-foundations/` | `#bba-foundations` | 1.1, 1.2 |
| 2 | The Business Environment | `02-environment/` | `#bba-environment` | 2.1 |
| 3 | Management Functions | `03-management/` | `#bba-management` | 3.1 |
| 4 | Production & Operations | `04-production/` | `#bba-production` | 4.1 |
| 5 | Marketing | `05-marketing/` | `#bba-marketing` | 5.1 |
| 6 | Finance | `06-finance/` | `#bba-finance` | 6.1 |
| 7 | Human Resources | `07-human-resources/` | `#bba-human-resources` | 7.1 |
| 8 | Change Management | `08-change/` | `#bba-change` | 8.1 |

> Folder names match their channel slug (`NN-<channel>`) for easy matching.

---

## Step Status

| Step | Title | Source | PDF | Posted |
|------|-------|--------|-----|--------|
| 1.1 | Introduction to Business Administration | `Lesson 1 — Introduction.../ABE-IntroTo Business.pdf` | ✅ 2026-06-07 | — |
| 1.2 | Design & Structure of Organisations | general notes (no dedicated lecture) | — | — |
| 2.1 | The Impact of the Environment | `Lesson 3 — The Impact of the Environment/BBA-Lecture 3.pdf` | — | — |
| 3.1 | Management Functions & Processes | `Lesson 4 — Management Functions and Processes/` (10 files — richest) | — | — |
| 4.1 | Production | `Lesson 5 — Production/BBA-Lecture 5-2.pdf` | — | — |
| 5.1 | Marketing | `Lesson 6 — Marketing/Marketing.pdf`, `BBA-Lecture 6.pdf` | — | — |
| 6.1 | Finance | general notes (no dedicated lecture) | — | — |
| 7.1 | Human Resources | `Lesson 8 — Human Resources/` (2 files) | — | — |
| 8.1 | Change & the Management of Change | general notes (no dedicated lecture) | — | — |

> **Source gaps:** Steps 1.2, 6.1, and 8.1 have no dedicated lecture — draw from the
> general notes (`BBA 1110 NOTES.pdf`, `BBA 1110 BATCH NOTES.pdf`) carried in each
> lesson's `sources/`.
>
> **Note:** source sub-folders still carry their original UNZA lecture numbering
> ("Lesson 3", "Lesson 4", …). That is raw-source provenance, not the Booklesss
> lesson number — the mapping above is authoritative.

---

## Slack Channel Map

| Channel | Lesson | Steps |
|---------|--------|-------|
| `#bba-updates` | — | Announcements |
| `#bba-foundations` | 1 · Foundations | 1.1, 1.2 |
| `#bba-environment` | 2 · The Business Environment | 2.1 |
| `#bba-management` | 3 · Management Functions | 3.1 |
| `#bba-production` | 4 · Production & Operations | 4.1 |
| `#bba-marketing` | 5 · Marketing | 5.1 |
| `#bba-finance` | 6 · Finance | 6.1 |
| `#bba-human-resources` | 7 · Human Resources | 7.1 |
| `#bba-change` | 8 · Change Management | 8.1 |

> **Action required:** create all channels in Slack before posting any BBA content.

---

## Build Scripts

Each step's build script lives in its lesson's `sources/` folder
(`build_bba_[step]_[slug].py`). Course outline:
`sources/build_bba_course-outline.py` → `Course Outline - Business Administration.pdf` (course root).
Course-wide material also in `sources/`: `general-notes/` (master copies of the shared
notes) and `official-outlines/` (the two raw UNZA outline PDFs).

| Step | Script | Status |
|------|--------|--------|
| 1.1 | `01-foundations/sources/build_bba_1_1_intro-to-business.py` | ✅ built |
| 1.2 – 8.1 | (to be written by step-skill) | — |
