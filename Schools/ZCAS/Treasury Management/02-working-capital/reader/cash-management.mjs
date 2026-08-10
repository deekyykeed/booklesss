/* TM · Lesson 2 Working capital · Step 3a — Deciding how much cash to hold
 *
 * Source: 07 PPTX 3 (Cash Management); build_tm_2_3_cash-management.py (PDF).
 *         Baumol and Miller-Orr worked examples kept at the lecture's figures.
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one six-section step and the longest in
 * the course at 1,472 words. The seam is between deciding how much cash to hold
 * (the trade-off, and the two models that price it) and running the cash day to
 * day (forecasting it, placing the surplus, pooling it). Coverage is identical;
 * nothing was cut. This part keeps the `cash-management` slug; the other half
 * is `cash-forecasting-and-surpluses`.
 *
 * 2026-08-02 correction (E-7). The Miller-Orr working read
 * "Z = 3 × ∛(…) = 3 × ∛15,000,000,000 ÷ … ≈ ZMW 7,400" — a garbled line with a
 * stray divisor and no cube root evaluated. The cube root of 15,000,000,000 is
 * 2,466, so Z = 3 × 2,466 = 7,398, which rounds to the lecture's 7,400. The
 * final answers were right; the middle of the working was unreadable.
 * (The source PDF's own intermediate steps mix decimal forms of the daily rate;
 * the workings here use i = 0.025% a day, which reproduces the lecture's
 * spread 7,400, upper limit 8,400 and return point 3,467.)
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 * Engagement (D-1): all three sections opened on a definition. They now open on
 * the ZMW 80,000 a year an idle balance costs, on the two fees Baumol is
 * caught between, and on the assumption Miller-Orr exists to drop.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). Both models were worked and
 * neither was handed over. §2 asked which way the optimum moves when the fee
 * doubles, which is answerable from the shape of the formula without ever
 * having used it; §3 asked what the model instructs at a limit the table above
 * had already printed. Each now hands over a second case and the check marks
 * it. The Baumol figures (A 640,000, F 25, O 8%) are chosen so the two annual
 * costs come out EQUAL at ZMW 800, which lets the reader verify the answer
 * against the near-equality the section names as the model's signature. The
 * Miller-Orr figures resolve to a whole cube root, so nothing is lost to
 * rounding while the reader is learning where the levels sit. Distractors are
 * the real slips: dropping the 2, reporting the average balance, dividing by 8
 * rather than 0.08; and for Miller-Orr, never adding the lower limit back,
 * halving the spread instead of thirding it, using 𝜎 where the formula wants 𝜎².
 * The directional insight the old §2 check tested is kept, in the explain.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Deciding how much cash to hold'.
 * The old name was sentence case and did not name the topic the way the paper does. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "The Cost of Idle Cash". The other
 * section(s) moved to baumol-model.mjs, miller-orr-model.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "cash-management",
  label: "The Cost of Idle Cash",
  title: "The Cost of Idle Cash",
  kicker: "Optimal Cash Balances",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "why-cash-management",
      heading: "Why cash management matters",
      blocks: [
        {
          type: "p",
          text: "Two million kwacha sitting in a non-interest current account for a year, while a 91-day [[treasury bill|A short-dated IOU from the government, sold at a discount and repaid at face value. The 91-day kwacha bill's rate is the benchmark for what parked money should be earning.]] pays around 4%, costs you about **ZMW 80,000**. Nobody ever signs off on that decision, which is exactly why it keeps being made.",
        },
        {
          type: "p",
          text: "Holding cash has an [opportunity cost](https://corporatefinanceinstitute.com/resources/accounting/opportunity-cost/): the money earns nothing while it could be earning somewhere else. [Cash management](https://corporatefinanceinstitute.com/resources/accounting/cash-management/) is the job of balancing that against the safety the cash buys you, and the rule is exact. **Hold cash only until the value of the next kwacha of liquidity equals the interest it gives up.** Past that point you are not being careful, you are leaving capital idle.",
        },
        {
          type: "p",
          text: "Day to day it is two jobs at once: having enough available to meet what is due, and earning something on the part that is not needed yet. Banks pay more the longer you tie money up, and charge more on an overdraft than on a term loan, because flexibility is the thing you are buying. Moving money between accounts is worth doing only when the interest gained beats the cost of the transfer, which is the calculation the two models ahead formalise.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Hold cash only until the marginal value of liquidity equals the interest lost. **The two models that follow are the machinery for finding that point.**",
        },
      ],
      check: {
        question:
          "A firm keeps ZMW 3 million in a non-interest current account \"to be safe\", though its worst month ever needed ZMW 1 million. What is the cost of that policy?",
        options: [
          "The interest forgone on roughly ZMW 2 million of permanently idle cash, which is liquidity held far beyond its marginal value",
          "Nothing, because cash in the bank is never a cost",
          "The bank's account maintenance fee only",
          "The risk that the bank fails",
        ],
        answer: 0,
        explain:
          "Safety is worth holding cash for, up to the point where the extra liquidity stops being used. The ZMW 2 million above any observed need buys no additional safety and forgoes interest every day, which is precisely the opportunity cost cash management exists to cut.",
      },
    },
  ],
};
