# BBF4302 Treasury Management — Course Status

**Last updated:** 2026-08-09

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
| House style | `.claude/skills/step-skill/RULES.md` — read before writing a step |
| URL | `/treasury-management/<lesson>/<group>/<step>` — up to five levels deep since 2026-08-09 |

**Reader step status — the course is complete: 60 steps, one section and one
checkpoint each.** A course-intro step (`start-here-treasury`, rule S-11) was
added above lesson 1 on 2026-08-07 and is three steps now.

> **2026-08-09 — THE ONE-CHECKPOINT SPLIT.** The owner: *"only one checkpoint
> per step … from now on a step is a small containable concept a user needs to
> understand."* Every section became its own step: **22 steps of 60 sections are
> now 60 steps of one each**, which is the same 60 sections and the same words.
> Rule **S-1** was rewritten around it, `rank.mjs` scores out of 6 with S-1
> first, and the other three courses owe **D-18**.
>
> Each old multi-section step's name survives as the **folder** over its parts,
> so the tree runs to five levels in Working capital and Risk (course → lesson →
> group → family → step) under the widened **S-9**. All 22 original slugs stayed
> on the first part of their split, so `step:` links still resolve — one
> exception, `credit-ratings`' link to the swaps concept, retargeted in the same
> edit.
>
> **Cost, paid rather than asked about:** every step URL moved except the three
> in Getting Started, so old deep links 404; and checkpoint progress is keyed by
> step, so ticks on a section that moved out reset.

> **2026-08-09, later — THE EXAM AND THE PRODUCT BOTH LEFT THE PAGE.** The
> owner: *"remove references to the exam … we are trying to help the student
> understand beyond just academic purposes"*, and *"not to explain to the
> student how there are 57 steps and how every step ends with a question …
> Booklesss mechanics are only supposed to stay with me."* Rules **C-12** and
> **S-13**, both scored by `rank.mjs`, which is **out of 8** now and scores
> **one step at a time** rather than handing back a course grade.
>
> Eleven steps carried it. One was mechanics end to end and was replaced:
> `one-step-one-sitting` became **`policy-and-execution`**, which teaches the
> board/treasury split its own check was already testing. The `exam` callout in
> `the-decisions-it-hands-you` became a `key` box making the same point without
> the paper. The syllabus is unchanged — past papers still set coverage
> (**C-2**), the reader is just never told so.
>
> **60 of 60 at 8/8**, every scan at zero, and all 60 pages swept as **served
> text with the tags stripped** for the banned vocabulary: zero. The probe was
> checked against Corporate Finance and Strategic Management first, where it
> finds it on 15 of 34 pages — a zero from a probe that has not been shown to
> see a positive is worth nothing.

> **2026-08-02 — the whole course was split and re-passed.** Every step is now
> two to four sections (rule **S-8**): a reader who finishes three short steps
> has learned more than one who abandons a long one two thirds through.
> **Coverage is identical and nothing was cut.** Every original slug is kept on
> the first part of its pair, so no URL that existed has broken.
>
> The same pass paid **D-1, D-2, D-3 and D-4** across all 21 steps: 382 em
> dashes went to zero (**W-11**), and the nine unpaid steps' 0 bold / 0 tappable
> terms / 0 source links became 159 bold, 49 terms and 70 verified outbound
> links. **D-5 (tables → `cards`) is the one thing still owed** and it is
> blocked on the glyph set, not on the steps.

> **2026-08-03 — D-5 was not blocked, and the course is now clean on every
> scanner.** The glyph set went from three marks on one axis to nine on three
> (time horizon, reserve level, how the control is wired), so three of TM's four
> card candidates converted: the working-capital policy table, the centralisation
> table, and the short-against-long comparison. The fourth, the financing table
> in `working-capital-and-liquidity`, **stays a table on purpose** — different
> axis, and a second card row under the first would replace two tables with a
> wall.
>
> Also this day: **D-9** (label vs title) 15 defects → 0, **D-6** (nav folders)
> four of five lessons now group their steps, and **D-10** opened for em dashes,
> where TM scores **0 against CF's 449 and SM's 341**.
>
> **Ranked against `RULES.md` on 2026-08-03: 35 of 42 (83%)**, then repaired the
> same day to **40 of 42 (95%)**. The first run found 2 fails and 5 weaks. Five
> of those seven were closed in one pass:
>
> | Rule | Was | Now |
> |---|---|---|
> | **W-8** bold 1–3 a section | Fail, 10 of 21 steps | **21 of 21** |
> | **E-8** 3–8 tappable terms | Weak, 13 of 21 | **21 of 21** (67 terms) |
> | **C-1** ZMW and Zambian firms | Weak, 19 of 21 | **21 of 21** |
> | **C-5** an anchor in every section | Weak, 6 bare | **0 of 57 bare** |
> | **C-7** a source under every claim | Weak, 7 bare | **0 bare**, 1.8 a section |
>
> **W-8 was one mistake made 55 times**: bolding the label of a list item —
> "Repricing risk.", "Safety first.", "Front office", "Treasury bills" — which is
> both a term being defined and a heading in disguise, the two things the rule
> names. Unbolding them left the sentences that actually carry the point.
>
> **What is left is the two rules no scanner can judge**: **C-8** (steps neither
> pick up nor hand on the thread, debt D-7, never run on any course) and **W-15**
> (the read-aloud pass, debt D-8, never run). Both need someone reading, not
> measuring.

| Lesson | Step | Slug | Written |
|--------|------|------|---------|
| 1 Treasury operations | What treasury is and what it does | `intro-to-treasury` | ✅ 2026-08-01 |
| | How treasury work divides, and what it is for | `treasury-levels-and-mandate` | ✅ 2026-08-01 |
| | Keeping treasury honest, and where it sits | `treasury-controls-and-structure` | ✅ 2026-08-01 |
| 2 Working capital | Working capital, and how much of it to run | `working-capital-and-liquidity` | ✅ 2026-08-02 |
| | Getting the cash in | `debtors-and-factoring` | ✅ 2026-08-02 |
| | Inventory, and how it is financed | `inventory-and-creditors` | ✅ 2026-08-02 |
| | How much to order, and when to pay | `ordering-and-paying-suppliers` | ✅ 2026-08-02 |
| | Deciding how much cash to hold | `cash-management` | ✅ 2026-08-02 |
| | Forecasting the cash, and putting it to work | `cash-forecasting-and-surpluses` | ✅ 2026-08-02 |
| 3 Risk | Interest rate risk, and how to measure it | `interest-rate-risk-management` | ✅ 2026-08-02 |
| | Covering interest rate risk | `interest-rate-hedging-instruments` | ✅ 2026-08-02 |
| | Currency risk, and how rates are quoted | `foreign-exchange-risk` | ✅ 2026-08-02 |
| | Hedging currency risk | `hedging-currency-risk` | ✅ 2026-08-02 |
| 4 Debt and investment | Where debt comes from, and how long it should run | `debt-management` | ✅ 2026-08-02 |
| | What debt costs, and what it demands | `the-price-of-debt` | ✅ 2026-08-02 |
| | The rules for investing surplus cash | `investment-management` | ✅ 2026-08-02 |
| | Instruments, credit risk and the portfolio | `building-the-portfolio` | ✅ 2026-08-02 |
| 5 Systems and clearing | Clearing, settlement, and the risk in between | `clearing-and-settlement` | ✅ 2026-08-02 |
| | The systems that carry a payment | `payment-systems-and-ccps` | ✅ 2026-08-02 |
| | What a treasury system is, and how it is built | `treasury-management-systems` | ✅ 2026-08-02 |
| | Choosing a treasury system, and living with it | `choosing-and-running-a-tms` | ✅ 2026-08-02 |

Reader lesson slugs (middle URL segment): `treasury-operations`,
`working-capital`, `treasury-risk`, `debt-and-investment`,
`systems-and-clearing`. Step slugs are global across every course, so the risk
steps deliberately avoid Corporate Finance's `interest-rate-risk`,
`hedging-interest-rate-risk` and `currency-risk`.

> ⚠️ **`inventory-and-creditors` now covers inventory only.** Creditors moved to
> `ordering-and-paying-suppliers` in the split, and the slug stayed put because
> S-8 keeps the existing URL on the first part. A working link beats a tidy one;
> the step's title and sidebar label both say "Inventory".

Corrections recorded in the step file headers: the 4.1 bond example prices the
12% coupon at a 14% yield correctly (ZMW 931,334, a discount; the PDF had
K1,001,100 via a wrong final discount factor); the 2.3 Miller-Orr workings state
the daily rate cleanly as 0.025% and now evaluate the cube root instead of
printing a garbled line; the 3.1 cap-vs-FRA comparison was recomputed on
consistent 6-month figures; and the 5.2 close no longer claims the course is ten
steps or lists its lessons.

**One source was cut rather than shipped broken:** the Bank of Zambia's national
payment systems page (`boz.zm`, live and verified) is linked from nothing,
because `gen-favicons.mjs` caps a mark at 12 KB and the bank publishes only a
15.4 KB multi-size `.ico`. No favicon means no chip, and a source with no chip is
one the reader cannot reach. Restore it if that generator learns to downscale.

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
