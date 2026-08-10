/* TM · Optimal Cash Balances · The Baumol Model
 *
 * Split out of cash-management.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of cash-management.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "baumol-model",
  label: "The Baumol Model",
  title: "The Baumol Model",
  kicker: "Optimal Cash Balances",

  sections: [
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
          text: "Its assumptions are its boundaries, so check them before you use it. [[Disbursements|Money going out: the payments a business makes, as opposed to the receipts coming in. Baumol assumes they arrive at a steady rate, which is the assumption most likely to be untrue in a real month.]] have to be known and spread evenly, the [opportunity cost](https://corporatefinanceinstitute.com/resources/accounting/liquidity/) constant, and the transaction fee the same whatever amount you move. **A business with a lumpy, unpredictable month has already broken the first one.**",
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
        {
          type: "callout",
          kind: "example",
          text: "Now do one. A Lusaka wholesaler pays out ZMW 640,000 a year in a steady stream, each transfer out of the deposit account costs ZMW 25, and money left on deposit earns 8%. Find the optimum transfer, then test it the way the paragraph above does: work out the year's fees and the year's forgone interest separately, and see whether they meet.",
        },
      ],
      check: {
        question:
          "What is that wholesaler's optimum transfer: ZMW 640,000 disbursed a year, ZMW 25 per transfer, 8% on deposit?",
        options: [
          "ZMW 20,000",
          "ZMW 14,142",
          "ZMW 10,000",
          "ZMW 2,000",
        ],
        answer: 0,
        explain:
          "C = √(2 × 25 × 640,000 ÷ 0.08) = √400,000,000 = ZMW 20,000. Check it: 640,000 ÷ 20,000 = 32 transfers at ZMW 25 = ZMW 800 of fees, against an average balance of 10,000 × 8% = ZMW 800 of interest forgone. They meet exactly, which is the signature. ZMW 14,142 drops the 2 from the numerator; ZMW 10,000 is the average balance, which is half the transfer rather than the transfer; ZMW 2,000 divides by 8 instead of 0.08. Note also what the formula's shape tells you: F sits inside the root, so if the bank doubled its fee to ZMW 50 the optimum would rise by about 41%, not double.",
      },
    },
  ],
};
