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
 */

export default {
  slug: "cash-management",
  label: "Deciding how much cash to hold",
  title: "Deciding how much cash to hold",
  kicker: "Working capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "why-cash-management",
      heading: "Why cash management matters",
      blocks: [
        {
          type: "p",
          text: "Two million kwacha sitting in a non-interest current account for a year, while a 91-day treasury bill pays around 4%, costs you about **ZMW 80,000**. Nobody ever signs off on that decision, which is exactly why it keeps being made.",
        },
        {
          type: "p",
          text: "Holding cash has an [opportunity cost](https://corporatefinanceinstitute.com/resources/accounting/opportunity-cost/): the money earns nothing while it could be earning somewhere else. [Cash management](https://corporatefinanceinstitute.com/resources/accounting/cash-management/) is the job of balancing that against the safety the cash buys you, and the rule is exact. **Hold cash only until the value of the next kwacha of liquidity equals the interest it gives up.** Past that point you are not being careful, you are leaving capital idle.",
        },
        {
          type: "p",
          text: "Day to day it is two jobs at once: having enough available to meet what is due, and earning something on the part that is not needed yet. Banks pay more the longer you tie money up, and charge more on an overdraft than on a term loan, because flexibility is the thing you are buying. **Moving money between accounts is worth doing only when the interest gained beats the cost of the transfer,** which is the calculation the rest of this step formalises.",
        },
        {
          type: "callout",
          text: "Hold cash only until the marginal value of liquidity equals the interest lost. **Everything in this step is machinery for finding that point.**",
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

    /* ---------------------------------------------------------------- */
    {
      id: "baumol",
      heading: "The Baumol model",
      blocks: [
        {
          type: "p",
          text: "Every trip to the deposit account costs ZMW 20 in fees. Every kwacha left in the current account costs 10% a year in interest you did not earn. **Withdraw too often and the fees eat you, withdraw too rarely and the idle cash does.**",
        },
        {
          type: "p",
          text: "Baumol's model answers that, provided you know what your cash needs will be. It treats cash the way a warehouse treats stock, balancing a fixed cost per trip against the cost of holding what you fetched.",
        },
        {
          type: "p",
          text: "Its assumptions are its boundaries, so check them before you use it. Disbursements have to be known and spread evenly, the [opportunity cost](https://corporatefinanceinstitute.com/resources/accounting/liquidity/) constant, and the transaction fee the same whatever amount you move. **A business with a lumpy, unpredictable month has already broken the first one.**",
        },
        {
          type: "formula",
          text: "C = √(2AF ÷ O)",
          where: [
            "C = optimum cash balance to transfer each time",
            "A = annual cash disbursements",
            "F = fixed cost per transaction",
            "O = opportunity cost, meaning the interest rate",
          ],
        },
        {
          type: "p",
          text: "The lecture's ABC Ltd disburses ZMW 300,000 a year, the bank pays 10% on money left on deposit, and each withdrawal costs ZMW 20. C = √(2 × 20 × 300,000 ÷ 0.10) = √120,000,000 ≈ ZMW 11,000.",
        },
        {
          type: "table",
          columns: [{ label: "Result" }, { label: "Working" }, { label: "Value", align: "right" }],
          rows: [
            ["Optimum transfer", "√(2 × 20 × 300,000 ÷ 0.10)", "11,000"],
            ["Transactions per year", "300,000 ÷ 11,000", "27"],
            ["Average balance held", "11,000 ÷ 2", "5,500"],
            ["Annual transaction cost", "27 × 20", "540"],
            ["Annual opportunity cost", "5,500 × 10%", "550"],
          ],
          total: ["Total annual cost", "540 + 550", "1,090"],
          note: "Amounts in ZMW.",
        },
        {
          type: "p",
          text: "**At the optimum the two costs almost meet:** ZMW 540 of fees against ZMW 550 of interest given up. That near-equality is the signature of the model working, and it is worth remembering as a check on your own arithmetic. Any larger balance is holding too much idle cash, and any smaller one is paying for too many withdrawals.",
        },
      ],
      check: {
        question:
          "In the Baumol model, the bank doubles its per-withdrawal fee. What happens to the optimum cash balance?",
        options: [
          "It rises, because with transfers costlier the firm makes fewer, larger withdrawals and holds more cash between them",
          "It falls, because expensive transfers mean holding less cash",
          "Nothing, because the optimum depends only on the interest rate",
          "It exactly doubles",
        ],
        answer: 0,
        explain:
          "F sits inside the square root, so doubling it raises C by about 41% rather than doubling it. Directionally, dearer transactions push the balance up for the same reason a dearer order cost raises an optimum order size: you economise on whatever got expensive.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "miller-orr",
      heading: "The Miller-Orr model",
      blocks: [
        {
          type: "p",
          text: "Baumol needs to know what your cash flows will be. **You do not know what your cash flows will be.**",
        },
        {
          type: "p",
          text: "Miller and Orr built for that. Their model is [[stochastic|Built on the assumption that the thing being modelled moves randomly rather than predictably. It does not try to say what tomorrow's balance will be, only how far it is likely to wander.]], so it gives you three control levels rather than one right balance.",
        },
        {
          type: "ul",
          items: [
            "A **lower limit**, where you sell [[marketable securities|Short-term investments such as treasury bills that can be turned back into cash quickly and at a known price. They are where a treasury parks money it may need at short notice.]] to raise cash.",
            "An **upper limit**, where you buy securities to shed it.",
            "A **return point**, which is where you come back to after either move.",
          ],
        },
        {
          type: "formula",
          text: "Spread Z = 3 × ∛( 3F𝜎² ÷ 4i )",
          where: [
            "F = transaction cost of buying or selling securities",
            "𝜎² = variance of daily cash flows",
            "i = daily interest rate",
            "Upper limit = lower limit + Z;  return point = lower limit + Z ÷ 3",
          ],
        },
        {
          type: "p",
          text: "The lecture's figures: a lower limit of ZMW 1,000 set by management, a daily interest rate of 0.025%, and ZMW 20 per securities transaction. Daily cash flows have a standard deviation of ZMW 500, so a variance of 250,000.",
        },
        {
          type: "table",
          columns: [{ label: "Control level" }, { label: "Working" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Lower limit", "set by management", "1,000"],
            ["Inside the root", "3 × 20 × 250,000 ÷ (4 × 0.00025)", "15,000,000,000"],
            ["Spread Z", "3 × ∛15,000,000,000 = 3 × 2,466", "7,400"],
            ["Upper limit", "1,000 + 7,400", "8,400"],
            ["Return point", "1,000 + 7,400 ÷ 3", "3,467"],
          ],
        },
        {
          type: "p",
          text: "Read the three numbers as instructions. Fall to ZMW 1,000 and sell securities until the balance is back to ZMW 3,467. Rise to ZMW 8,400 and buy securities down to the same 3,467. **Between the limits, do nothing,** and that is the real insight: every correction costs ZMW 20, so constant tidying is itself one of the costs the model is minimising.",
        },
        {
          type: "callout",
          text: "Baumol assumes certainty and Miller-Orr does not. **Real cash flows wander, so Miller-Orr is the one to reach for whenever the flows in front of you are volatile.**",
        },
      ],
      check: {
        question:
          "Under the lecture's Miller-Orr figures, the balance drifts up to ZMW 8,400. What does the model instruct?",
        options: [
          "Buy ZMW 4,933 of securities, returning the balance to the ZMW 3,467 return point",
          "Sell securities to raise the balance to the upper limit",
          "Do nothing until the balance reaches the lower limit",
          "Buy securities down to the ZMW 1,000 lower limit",
        ],
        answer: 0,
        explain:
          "Touching the upper limit triggers a purchase equal to the gap down to the return point, so 8,400 less 3,467 is 4,933. Going all the way down to the lower limit would only maximise the chance of an immediate opposite transaction. The return point sits a third of the way up because running out of cash is costlier than parking it.",
      },
    },
  ],
};
