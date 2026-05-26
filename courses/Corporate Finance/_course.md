# BAC4301 Corporate Finance — Course Status

**Last updated:** 2026-05-26

---

## Overview

| Field | Value |
|-------|-------|
| Course code | BAC4301 |
| Platform | Booklesss (Slack) |
| Slack section | Corporate Finance |
| Updates channel | `#cf-updates` — create channel first |
| Lessons | 5 |
| Total steps planned | 10 |
| PDFs at v2 standard | 1 (Step 1.1) |
| Steps posted to Slack | 0 |

> **Action required (content):** Steps 1.2–5.1 were cleared in the folder
> restructure. Their build scripts still exist (renamed to the new numbering) but
> point to the old nested folders, old fonts, and old layout — and still carry
> their old internal step labels/cross-refs. Each must be rebuilt to the **v2
> standard** (see below), which regenerates all of that, and output to the new
> flat folder before posting.
>
> **Action required (Slack):** Corporate Finance channels not yet created. Create
> them in Slack, then update `operations/workspace.md` with the channel links.

---

## Numbering scheme (lesson.step)

Steps are numbered **`lesson.step`**: the digit before the dot is the lesson, the
digit after resets within each lesson. So `2.1` is *Lesson 2, Step 1* — not "the
second step of the course." A new lesson always restarts at `.1`. This is the
same scheme Treasury Management already uses.

| Lesson | Topic | Folder | Steps |
|--------|-------|--------|-------|
| 1 | Investment Appraisal | `01-investment/` | 1.1, 1.2, 1.3 |
| 2 | Cost of Capital & Structure | `02-cost-of-capital/` | 2.1, 2.2 |
| 3 | Valuation & M&A | `03-ma-valuation/` | 3.1, 3.2 |
| 4 | Interest Rate & Currency Risk | `04-risk/` | 4.1, 4.2 |
| 5 | Dividend Policy | `05-dividends/` | 5.1 |

---

## Folder Structure (flat)

Each topic folder holds its step PDFs **directly** — no per-step subfolders.

```
courses/Corporate Finance/
  01-investment/        ← Steps 1.1, 1.2, 1.3
  02-cost-of-capital/   ← Steps 2.1, 2.2
  03-ma-valuation/      ← Steps 3.1, 3.2
  04-risk/              ← Steps 4.1, 4.2
  05-dividends/         ← Step 5.1
  _source/              ← raw lecture material (unchanged)
  _course.md
```

---

## v2 Standard (defined 2026-05-23, Step 1.1)

The Booklesss CF lesson standard, set on the Step 1.1 rebuild:

- **Type:** Aptos for body, **Parastoo** (serif) for the cover title and section headings — matching the website hero. Vendored in `_dev/fonts/` so the build is self-contained.
- **Founder framing:** written as though the student owns the company — Booklesss as a consultant to their ambitions, not a notes service.
- **Skeleton up front:** the full 10-step course map appears on page 2 ("START HERE"), so students hold the whole picture from day one and build depth, not chunks. The closer points only to the *next* step.
- **FACT sentence:** every concept ends with a single gold-box sentence stated as fact, closing the loop so nothing leaks from memory.
- **Calc layout:** financial waterfalls use `calc_table()` (right-aligned amounts, jade subtotal rules); pure equations use `formula_box()`.
- **Palette — website match:** cream `#FFFEF2` paper (cover + every page) · near-black `#121212` cover title · `#3D3D3D` headings · jade `#2FB99A` / deep jade `#0E5E52` interior accents · warm grey `#6E6A5E` cover meta · pale-jade panels `#E9F0EA` / `#E7F3ED`. Subtle film grain (`_dev/brand/grain.png`) on every page.
- **Cover:** cream paper + grain, **black logo** top-left, centred **◇◆◇ triple-diamond** motif (vector `TripleDiamond`), **Parastoo** title (#121212, 42pt ≈ 56px, line-height 1.1), centred eyebrow + subtitle. Light/editorial — no dark slab to open on. Backgrounds drawn via `onPage`.
- **Brand assets:** logos + grain in `_dev/brand/`; raw drop zone at top-level `Booklesss Bucket/`.

---

## Step Status

| Step | Title | Source | PDF (v2) | Posted | Channel |
|------|-------|--------|----------|--------|---------|
| 1.1 | Investment Fundamentals (FCF, NPV) | `01_Investment_Appraisal/Lectures` Parts 1&2 | ✅ | — | `#cf-investment` |
| 1.2 | Advanced Investment Appraisal (APV, MIRR) | `01_Investment_Appraisal/Lectures` APV + Capital Rationing | ⟳ rebuild | — | `#cf-investment` |
| 1.3 | International Project Appraisal | `01_Investment_Appraisal/Lectures` International NPV | ⟳ rebuild | — | `#cf-investment` |
| 2.1 | Cost of Capital Foundations (WACC, CAPM) | `02_Cost_of_Capital` Session 1 + Session 2 | ⟳ rebuild | — | `#cf-cost-of-capital` |
| 2.2 | Capital Structure Decisions | `02_Cost_of_Capital` Capital Structure + Session 2 | ⟳ rebuild | — | `#cf-cost-of-capital` |
| 3.1 | Company Valuation | `03_Mergers_and_Acquisitions` Target Valuation + Bonds | ⟳ rebuild | — | `#cf-ma-valuation` |
| 3.2 | Mergers & Acquisitions | `03_Mergers_and_Acquisitions` M&A + EMH | ⟳ rebuild | — | `#cf-ma-valuation` |
| 4.1 | Interest Rate Risk Management | `04_Interest_Rate_and_Currency_Risk` IR Risk | ⟳ rebuild | — | `#cf-risk` |
| 4.2 | Currency Risk Management | `04_Interest_Rate_and_Currency_Risk` Currency + Hedging | ⟳ rebuild | — | `#cf-risk` |
| 5.1 | Dividend Policy | `05_Dividend_Policy` | ⟳ rebuild | — | `#cf-dividends` |

**Legend:** ✅ built to v2 standard · ⟳ script exists (renamed to new number), needs rebuild to v2 + flat path

---

## Source Material

All source files are in `_source/`:

| Folder | Files | Covers |
|--------|-------|--------|
| `01_Investment_Appraisal/Lectures/` | 5 PDFs (FCF Parts 1&2, APV, Capital Rationing, International NPV) | Steps 1.1–1.3 |
| `01_Investment_Appraisal/Practice_Questions/` | 2 PDFs | Practice for Lesson 1 (1.1–1.3) |
| `02_Cost_of_Capital_and_Capital_Structure/` | 3 PDFs | Steps 2.1–2.2 |
| `03_Mergers_and_Acquisitions/Lectures/` | 4 PDFs | Steps 3.1–3.2 |
| `03_Mergers_and_Acquisitions/Practice_Questions/` | 2 PDFs | Practice for Lesson 3 (3.1–3.2) |
| `04_Interest_Rate_and_Currency_Risk_Management/` | 3 PDFs | Steps 4.1–4.2 |
| `05_Dividend_Policy/` | 1 PDF | Step 5.1 |

---

## PDF File Locations (flat)

| Step | PDF Path |
|------|----------|
| 1.1 | `01-investment/Step 1.1 - Investment Fundamentals.pdf` |
| 1.2 | `01-investment/Step 1.2 - Advanced Investment Appraisal.pdf` |
| 1.3 | `01-investment/Step 1.3 - International Project Appraisal.pdf` |
| 2.1 | `02-cost-of-capital/Step 2.1 - Cost of Capital Foundations.pdf` |
| 2.2 | `02-cost-of-capital/Step 2.2 - Capital Structure Decisions.pdf` |
| 3.1 | `03-ma-valuation/Step 3.1 - Company Valuation.pdf` |
| 3.2 | `03-ma-valuation/Step 3.2 - Mergers & Acquisitions.pdf` |
| 4.1 | `04-risk/Step 4.1 - Interest Rate Risk Management.pdf` |
| 4.2 | `04-risk/Step 4.2 - Currency Risk Management.pdf` |
| 5.1 | `05-dividends/Step 5.1 - Dividend Policy.pdf` |

---

## Build Scripts

| Step | Script | v2? |
|------|--------|-----|
| 1.1 | `_dev/scripts/build_cf_1_1_investment-fundamentals.py` | ✅ |
| 1.2 | `_dev/scripts/build_cf_1_2_advanced-investment.py` | ⟳ |
| 1.3 | `_dev/scripts/build_cf_1_3_international-projects.py` | ⟳ |
| 2.1 | `_dev/scripts/build_cf_2_1_cost-of-capital.py` | ⟳ |
| 2.2 | `_dev/scripts/build_cf_2_2_capital-structure.py` | ⟳ |
| 3.1 | `_dev/scripts/build_cf_3_1_company-valuation.py` | ⟳ |
| 3.2 | `_dev/scripts/build_cf_3_2_mergers-acquisitions.py` | ⟳ |
| 4.1 | `_dev/scripts/build_cf_4_1_interest-rate-risk.py` | ⟳ |
| 4.2 | `_dev/scripts/build_cf_4_2_currency-risk.py` | ⟳ |
| 5.1 | `_dev/scripts/build_cf_5_1_dividend-policy.py` | ⟳ |

---

## Slack Channel Map

| Channel | Steps |
|---------|-------|
| `#cf-investment` | 1.1, 1.2, 1.3 |
| `#cf-cost-of-capital` | 2.1, 2.2 |
| `#cf-ma-valuation` | 3.1, 3.2 |
| `#cf-risk` | 4.1, 4.2 |
| `#cf-dividends` | 5.1 |
