# Strategic Management — Course Status

**Last updated:** 2026-05-26

---

## Overview

| Field | Value |
|-------|-------|
| Course code | (No code assigned yet) |
| Platform | Booklesss (Slack) |
| Slack section | Strategic Management |
| Updates channel | `#sm-updates` → https://bookless10.slack.com/archives/C0AN0T23YKC |
| Lessons | 3 |
| Total steps planned | 6 |
| PDFs generated | 6 |
| Steps posted to Slack | 1 |

---

## Numbering scheme (lesson.step)

Steps are numbered **`lesson.step`**: the digit before the dot is the lesson, the
digit after resets within each lesson. So `2.1` is *Lesson 2, Step 1*. A new
lesson always restarts at `.1`.

| Lesson | Topic | Folder | Steps |
|--------|-------|--------|-------|
| 1 | Foundations | `01-foundations/` | 1.1, 1.2 |
| 2 | Environment | `02-environment/` | 2.1, 2.2 |
| 3 | Strategy | `03-strategy/` | 3.1, 3.2 |

> Note: the per-step subfolders still carry their old continuous numeric prefixes
> (`01-`…`06-`). These are just folder slugs and don't drive the scheme — the
> authoritative number is the `Step X.Y` in the PDF filename and tracker.

---

## Step Status

| Step | Title | Source | PDF | Posted | Channel |
|------|-------|--------|-----|--------|---------|
| 1.1 | Introduction to Corporate Strategy | `_source/1. Introduction to Corporate Strategy.pdf` | ✅ | — | `#sm-foundations` |
| 1.2 | Vision, Mission & Objectives | `_source/2. Mission and Vision.pdf` | ✅ | — | `#sm-foundations` |
| 2.1 | External Environment (PESTEL, Porter's Five Forces) | `_source/3. External Environment.pdf` | ✅ | — | `#sm-environment` |
| 2.2 | Internal Environment (SWOT, Value Chain, VRIO) | `_source/4. Corporate Internal Environment.pdf` | ✅ | ✅ 2026-03-24 | `#sm-environment` |
| 3.1 | Strategy Implementation | `_source/5. Strategic Management Module.pdf` + `_source/6.` | ✅ | — | `#sm-strategy` |
| 3.2 | Competitive Strategy (Porter's Generic Strategies) | `_source/8. Competitive Strategy.pdf` | ✅ | — | `#sm-strategy` |

> **Note on the posted step:** the step now numbered **2.2** (Internal Environment)
> was posted to Slack on 2026-03-24 under its old number **4.1**. The PDF in the
> channel still shows "Step 4.1". Repost the renamed PDF when convenient so the
> channel matches the new scheme.

**All steps written. Next: begin posting from Step 1.1 → #sm-foundations**

---

## Source Material

All source PDFs are in `_source/` directly (no subfolders):

| File | Covers |
|------|--------|
| `1. Introduction to Corporate Strategy.pdf` | Step 1.1 |
| `2. Mission and Vision.pdf` | Step 1.2 |
| `3. External Environment.pdf` | Step 2.1 |
| `4. Corporate Internal Environment.pdf` | Step 2.2 |
| `5. Strategic Management Module.pdf` | Step 3.1 (main) |
| `6. Strategic Management.pdf` | Step 3.1 (supplement) |
| `7. Strategic Management Book.pdf` | All steps — reference |
| `8. Competitive Strategy.pdf` | Step 3.2 |

---

## PDF File Locations

| Step | PDF Path |
|------|----------|
| 1.1 | `01-foundations/01-intro-to-strategy/Step 1.1 - Introduction to Corporate Strategy.pdf` |
| 1.2 | `01-foundations/02-mission-and-vision/Step 1.2 - Vision, Mission & Objectives.pdf` |
| 2.1 | `02-environment/03-external-environment/Step 2.1 - The External Environment.pdf` |
| 2.2 | `02-environment/04-internal-environment/Step 2.2 - The Internal Environment.pdf` |
| 3.1 | `03-strategy/05-strategy-implementation/Step 3.1 - Strategy Implementation.pdf` |
| 3.2 | `03-strategy/06-competitive-strategy/Step 3.2 - Competitive Strategy.pdf` |

---

## Build Scripts

| Step | Script |
|------|--------|
| 1.1 | `_dev/scripts/build_sm_1_1_intro-to-strategy.py` |
| 1.2 | `_dev/scripts/build_sm_1_2_mission-and-vision.py` |
| 2.1 | `_dev/scripts/build_sm_2_1_external-environment.py` |
| 2.2 | `_dev/scripts/build_sm_2_2_internal-environment.py` |
| 3.1 | `_dev/scripts/build_sm_3_1_strategy-implementation.py` |
| 3.2 | `_dev/scripts/build_sm_3_2_competitive-strategy.py` |

> Scripts use Linux fonts (DejaVu/Liberation) and build on the Linux box. Internal
> step labels and cross-references were renumbered to the new scheme on 2026-05-26;
> rebuild on Linux to regenerate the PDFs (the on-disk PDFs were renamed in place).

---

## Slack Channel Map

| Channel | Steps |
|---------|-------|
| `#sm-foundations` | 1.1, 1.2 |
| `#sm-environment` | 2.1, 2.2 |
| `#sm-strategy` | 3.1, 3.2 |
