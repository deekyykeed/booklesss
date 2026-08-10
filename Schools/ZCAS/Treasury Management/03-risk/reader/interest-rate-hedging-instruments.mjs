/* TM · Lesson 3 Risk · Step 1b — Covering interest rate risk
 *
 * Source: 09_Interest Rate Risk Management PPTX;
 *         build_tm_3_1_interest-rate-risk.py (PDF). Zambia Sugar / Lafarge swap
 *         kept at the lecture's figures. The PDF's cap-vs-FRA table used
 *         inconsistent interest totals; the comparison here recomputes cleanly
 *         on the same 6-month, ZMW 1m loan (FRA 7.5%; cap 7.5% strike,
 *         ZMW 1,500 premium).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `interest-rate-risk-management`, which was
 * one six-section step. That part is knowing the exposure; this part is
 * covering it. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. Every opening was re-read cold. The FRA
 * section now sets its own scene rather than continuing one, the swap section
 * opens on the surprise in the lecture's own numbers rather than on a
 * definition, and no opening refers to a section in the other half.
 *
 * The comparison at the end deliberately keeps the corrected cap-vs-FRA
 * figures: the source PDF's version compared a 6-month FRA against a cap on
 * inconsistent interest totals, so the two columns were not the same loan.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). Two sections, the same fault.
 * §1's check asked what an FRA nets to when rates fall to 6%, which is a row
 * of the table directly above it. §2's asked where the 0.8% comes from, with
 * the answer in the table's own note. Both now hand over a fresh case: an FRA
 * settled in cash on ZMW 4m for six months (the ZMW 80,000 distractor is the
 * annual-rate-on-a-half-year slip, which is the commonest error in the product
 * because the quote is annual and the contract is not), and a swap whose
 * surplus must be found as a difference between two differences. The 2.4%
 * distractor adds the penalties instead of subtracting them, which implies the
 * gain grows the more alike the two borrowers are; saying that out loud in the
 * explain is cheaper than the arithmetic.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Covering interest rate risk'.
 * The old name was sentence case and did not name the topic the way the paper does. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 4 sections and now holds one: "Forward Rate Agreements". The other
 * section(s) moved to interest-rate-swaps.mjs, interest-rate-futures.mjs, caps-floors-collars.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "interest-rate-hedging-instruments",
  label: "Forward Rate Agreements",
  title: "Forward Rate Agreements",
  kicker: "Hedging Instruments",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "fras",
      heading: "Forward rate agreements",
      blocks: [
        {
          type: "p",
          text: "It is March. Your ZMW 1 million loan resets in six months, six-month money costs 7% today, and you think it is going up. A dealer offers to fix September's rate at 7.5%, agreed now, with **nothing to pay up front.**",
        },
        {
          type: "p",
          text: "That is a forward rate agreement. It is an [[over-the-counter|Agreed directly between you and a bank rather than traded on an exchange, so the amount and the dates are cut to fit your loan exactly. The price of that fit is that you are relying on that one bank to be good for it.]] contract fixing an interest rate today for a period starting later. **No principal ever moves.** Only the difference between the agreed rate and the market rate is settled in cash.",
        },
        {
          type: "table",
          columns: [{ label: "Outcome" }, { label: "Loan cost" }, { label: "FRA settlement" }, { label: "Net rate", align: "right" }],
          rows: [
            [
              "Rates rise to 8%",
              "Pays 8% to the market",
              "Receives (8.0% − 7.5%) × 1m × ½ = ZMW 2,500",
              "7.5%",
            ],
            [
              "Rates fall to 6%",
              "Pays 6% to the market",
              "Pays (7.5% − 6.0%) × 1m × ½ = ZMW 7,500",
              "7.5%",
            ],
          ],
        },
        {
          type: "p",
          text: "Both rows end at 7.5%, and that is the entire product. **An FRA removes the uncertainty in both directions,** so you buy protection against the rise and [hand over the benefit of the fall](https://treasurytoday.com/risk-management/question-answered-hedging-strategies/) in the same signature. Whether handing that over is acceptable is the question caps, floors and collars exist to answer.",
        },
        {
          type: "callout",
          kind: "example",
          text: "Settle one in cash. A ZMW 4 million loan resets in three months for a six-month period, and the treasurer buys an FRA at 9%. By the reset date six-month rates have gone to 11%. Work out which way the money moves and how much of it. Only one number in the question is not needed for the settlement, and finding it is half the exercise: no principal changes hands, and the period is not a year.",
        },
      ],
      check: {
        question:
          "That FRA is fixed at 9% on ZMW 4 million for six months, and rates reach 11%. What is settled?",
        options: [
          "The company receives ZMW 40,000",
          "The company receives ZMW 80,000",
          "The company pays ZMW 40,000",
          "The company receives ZMW 220,000",
        ],
        answer: 0,
        explain:
          "(11% − 9%) × 4,000,000 × ½ = **ZMW 40,000 received**, which offsets the extra 2% the loan now costs and leaves the borrower at 9%, exactly what it bought. ZMW 80,000 forgets that the period is six months, not a year, and it is the commonest slip in the whole product because the rates are quoted annually and the contract is not. Paying ZMW 40,000 is the right size in the wrong direction: a borrower is hurt by rates rising, so its hedge has to pay IN when they rise. ZMW 220,000 settles the whole 11% instead of the 2% difference, which would mean the principal had moved, and in an FRA it never does.",
      },
    },
  ],
};
