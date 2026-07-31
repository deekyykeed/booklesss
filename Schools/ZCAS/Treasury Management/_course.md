# BBF4302 Treasury Management — Course Status

**Last updated:** 2026-07-31

---

## ⚠️ Surface changed (2026-07-31) — TM is now on the reader

Treasury Management is now authored for the **course reader**
(`booklesss.vercel.app`), the same pivot Corporate Finance and Strategic
Management made. The PDF/Slack material below is kept for provenance — do not
post PDFs without checking with the owner.

**Where reader content lives**

| | |
|---|---|
| Authored source | `reader/course.mjs` (manifest) + `<lesson>/reader/<step>.mjs` |
| Published to | Supabase `qxbcvmzjomfwxvbqzqds` — `courses → nav_nodes → lessons` |
| Read by the app | `platform/src/lib/course-data.json` (generated, committed) |
| Publish | `node --env-file=.env.local platform/scripts/seed-course.mjs <course.mjs>` then `npm run gen:course` |
| House style | `.claude/skills/step-feedback/RULES.md` — read before writing a step |
| URL | `/treasury-management/<lesson>/<step>` |

**Reader step status — the course is complete: 10 steps, 57 sections, every
section with a comprehension check.**

| Lesson | Step | Slug | Written |
|--------|------|------|---------|
| 1 Treasury operations | Introduction to treasury | `intro-to-treasury` | ✅ 2026-07-31 |
| 2 Working capital | Working capital & liquidity | `working-capital-and-liquidity` | ✅ 2026-07-31 |
| | Inventory, EOQ & creditors | `inventory-and-creditors` | ✅ 2026-07-31 |
| | Cash management & forecasting | `cash-management` | ✅ 2026-07-31 |
| 3 Risk | Interest rate risk | `interest-rate-risk-management` | ✅ 2026-07-31 |
| | Foreign exchange risk | `foreign-exchange-risk` | ✅ 2026-07-31 |
| 4 Debt and investment | Debt management | `debt-management` | ✅ 2026-07-31 |
| | Investment management | `investment-management` | ✅ 2026-07-31 |
| 5 Systems and clearing | Clearing & settlement | `clearing-and-settlement` | ✅ 2026-07-31 |
| | Treasury systems | `treasury-management-systems` | ✅ 2026-07-31 |

Reader lesson slugs (middle URL segment): `treasury-operations`,
`working-capital`, `treasury-risk`, `debt-and-investment`,
`systems-and-clearing`. The risk-step slugs deliberately avoid Corporate
Finance's `interest-rate-risk` / `currency-risk` (reader slugs are global).

Corrections made while porting (recorded in the step file headers): the 4.1
bond example now prices the 12% coupon at a 14% yield correctly (≈ ZMW 931,334,
a discount — the PDF had K1,001,100 via a wrong final discount factor); the 2.3
Miller-Orr workings state the daily rate cleanly as 0.025%; the 3.1 cap-vs-FRA
comparison was recomputed on consistent 6-month figures.

---

## Overview

| Field | Value |
|-------|-------|
| Course code | BBF4302 |
| Platform | Booklesss (Slack) |
| Slack section | Treasury Management |
| Updates channel | `#tm-updates` → https://bookless10.slack.com/archives/C0AN40BMZFW |
| Lessons | 5 |
| Total steps planned | 10 |
| PDFs generated | 10 |
| Steps posted to Slack | 1 |

---

## Numbering scheme (lesson.step)

Steps are numbered **`lesson.step`**: the digit before the dot is the lesson, the
digit after resets within each lesson. So `2.1` is *Lesson 2, Step 1*. A new
lesson always restarts at `.1`.

| Lesson | Topic | Channel | Steps |
|--------|-------|---------|-------|
| 1 | Foundations | `#tm-operations` | 1.1 |
| 2 | Working Capital & Liquidity | `#tm-working-capital` | 2.1, 2.2, 2.3 |
| 3 | Risk | `#tm-risk` | 3.1, 3.2 |
| 4 | Investment | `#tm-investment` | 4.1, 4.2 |
| 5 | Systems & Clearing | `#tm-operations` | 5.1, 5.2 |

> **Why `#tm-operations` appears twice:** it bookends the course — the Foundations
> intro (1.1) and the closing Systems & Clearing lesson (5.1, 5.2). The Systems
> step is written as the course capstone ("brings together everything across ten
> steps"), so it stays last in the learning sequence even though it shares the
> operations channel with the intro.

---

## Step Status

| Step | Title | Source | PDF | Posted | Channel |
|------|-------|--------|-----|--------|---------|
| 1.1 | Introduction to Treasury Management | `sources/06_Introduction` PPTX | ✅ | — | `#tm-operations` |
| 2.1 | Working Capital & Liquidity Management | `sources/07` PPTX 1 | ✅ | — | `#tm-working-capital` |
| 2.2 | Inventory Management, EOQ & Creditor Mgmt | `sources/07` PPTX 2 | ✅ | — | `#tm-working-capital` |
| 2.3 | Cash Management & Cash Flow Forecasting | `sources/07` PPTX 3 + `sources/08` | ✅ | ✅ 2026-03-24 | `#tm-working-capital` |
| 3.1 | Interest Rate Risk Management | `sources/09` PPTX | ✅ | — | `#tm-risk` |
| 3.2 | Foreign Exchange Risk Management | `sources/10` PPTX | ✅ | — | `#tm-risk` |
| 4.1 | Debt Management | `sources/11` PPTX | ✅ | — | `#tm-investment` |
| 4.2 | Investment Management | `sources/12` PPTX | ✅ | — | `#tm-investment` |
| 5.1 | Clearing & Settlement Systems | `sources/13` PPTX | ✅ | — | `#tm-operations` |
| 5.2 | Treasury Management Systems | `sources/14` PPTX | ✅ | — | `#tm-operations` |

**All steps written. Next: begin posting from Step 1.1 → #tm-operations**

---

## Source Material

Raw material lives inside each lesson's `sources/` folder (original ZCAS module numbering kept for provenance):

| Folder | Content | Covers |
|--------|---------|--------|
| `01-operations/sources/06_Introduction to Treasury Management/` | 1 PPTX, 1 PDF | Step 1.1 |
| `02-working-capital/sources/07_Working Capital_Liquidity Management/` | 3 PPTXs | Steps 2.1–2.3 |
| `02-working-capital/sources/08_Cash Forecasting/` | 3 PPTXs | Step 2.3 supplement |
| `03-risk/sources/09_Interest Rate Risk Management/` | 1 PPTX + 2 PDFs | Step 3.1 |
| `03-risk/sources/10_Foreign Exchange Risk Management/` | 1 PPTX | Step 3.2 |
| `04-investment/sources/11_Debt Management/` | 1 PPTX | Step 4.1 |
| `04-investment/sources/12_Investment Management/` | 1 PPTX | Step 4.2 |
| `05-systems/sources/13_Clearing and Settlement Systems/` | 1 PPTX | Step 5.1 |
| `05-systems/sources/14_Treasury Management Systems/` | 1 PPTX | Step 5.2 |
| `[lesson]/sources/05_Books/` | 2 textbooks (copied into every lesson) | All steps — reference |
| `past-papers/` | 12 past exam papers | Exam prep |
| `assignments/` | Feb 2026 assignment brief + ZML answer docx + generator | Current semester |

---

## PDF File Locations

| Step | PDF Path |
|------|----------|
| 1.1 | `01-operations/steps/Step 1.1 - Introduction to Treasury Management.pdf` |
| 2.1 | `02-working-capital/steps/Step 2.1 - Working Capital & Liquidity Management.pdf` |
| 2.2 | `02-working-capital/steps/Step 2.2 - Inventory Management, EOQ & Creditor Management.pdf` |
| 2.3 | `02-working-capital/steps/Step 2.3 - Cash Management & Cash Flow Forecasting.pdf` |
| 3.1 | `03-risk/steps/Step 3.1 - Interest Rate Risk Management.pdf` |
| 3.2 | `03-risk/steps/Step 3.2 - Foreign Exchange Risk Management.pdf` |
| 4.1 | `04-investment/steps/Step 4.1 - Debt Management.pdf` |
| 4.2 | `04-investment/steps/Step 4.2 - Investment Management.pdf` |
| 5.1 | `05-systems/steps/Step 5.1 - Clearing & Settlement Systems.pdf` |
| 5.2 | `05-systems/steps/Step 5.2 - Treasury Management Systems.pdf` |

---

## Build Scripts

Each script lives in its lesson's `sources/` folder and outputs to the sibling `steps/`.

| Step | Script |
|------|--------|
| 1.1 | `01-operations/sources/build_lesson_1_1_tm.py` |
| 2.1 | `02-working-capital/sources/build_tm_2_1_working-capital.py` |
| 2.2 | `02-working-capital/sources/build_tm_2_2_inventory-management.py` |
| 2.3 | `02-working-capital/sources/build_tm_2_3_cash-management.py` |
| 3.1 | `03-risk/sources/build_tm_3_1_interest-rate-risk.py` |
| 3.2 | `03-risk/sources/build_tm_3_2_fx-risk.py` |
| 4.1 | `04-investment/sources/build_tm_4_1_debt-management.py` |
| 4.2 | `04-investment/sources/build_tm_4_2_investment-management.py` |
| 5.1 | `05-systems/sources/build_tm_5_1_clearing-settlement.py` |
| 5.2 | `05-systems/sources/build_tm_5_2_treasury-systems.py` |

> Step 1.1 uses the legacy script name `build_lesson_1_1_tm.py`. Scripts use Linux
> fonts (DejaVu/Liberation) and build on the Linux box. Steps 5.1/5.2 had their
> internal step labels renumbered (4.3→5.1, 4.4→5.2) on 2026-05-26; the on-disk
> PDFs were already named 5.1/5.2.

---

## Slack Channel Map

| Channel | Steps |
|---------|-------|
| `#tm-operations` | 1.1, 5.1, 5.2 |
| `#tm-working-capital` | 2.1, 2.2, 2.3 |
| `#tm-risk` | 3.1, 3.2 |
| `#tm-investment` | 4.1, 4.2 |
