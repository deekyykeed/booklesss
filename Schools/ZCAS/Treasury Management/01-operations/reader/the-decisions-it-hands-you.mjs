/* TM · Getting Started · The Decisions It Hands You
 *
 * Split out of start-here.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of start-here.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "the-decisions-it-hands-you",
  label: "The Decisions It Hands You",
  title: "The Decisions It Hands You",
  kicker: "Getting Started",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-it-buys-you",
      heading: "What you can do with it",
      blocks: [
        {
          type: "p",
          text: "This course assumes you can read a balance sheet and knows you have met an income statement. It does not assume anything else. What it adds is the money already in motion: the [cash sitting in accounts](https://corporatefinanceinstitute.com/resources/accounting/cash-management/), the invoices waiting to be paid, the borrowing that funds the gap and the currency risk sitting under all of it.",
        },
        {
          type: "p",
          text: "That is a different question from the one investment appraisal asks. Deciding whether to build the plant is one job. **Making sure the company can still pay for cement in month four is this one,** and a business that gets the first right and the second wrong does not finish the plant.",
        },
        { type: "h2", text: "The decisions this hands you" },
        {
          type: "ul",
          items: [
            "How much cash to keep, when idle cash earns nothing and an empty account costs everything.",
            "Whether to take a supplier's early-payment discount or keep the money and take the credit.",
            "What to do when your revenue is in kwacha and a supplier invoices you in US dollars, with three months before you pay. That gap is an [[exposure|A position whose value in your own currency is not yet fixed, so it moves with the market until the day it settles.]].",
            "How to fund a shortfall you can see coming, and what a lender will demand in return.",
            "Where to put a surplus so it is still there, in full, on the day you need it back.",
          ],
        },
        {
          type: "p",
          text: "Those are the treasurer's decisions in a bank or a mining group, and they are also the first five money decisions anybody running their own business ever makes. **The scale changes and the questions do not.** A finance officer at ZESCO and a founder with one truck are answering the same list with different numbers of zeros.",
        },
        {
          type: "callout",
          kind: "exam",
          text: "The paper is written the same way. Most marks in the past papers go to a calculation and then to a short recommendation about what the business should actually do. A number with no decision attached to it leaves marks on the table.",
        },
      ],
      check: {
        question:
          "A Zambian company earns its revenue in kwacha and has agreed to pay a supplier USD 200,000 in three months. Which of these is a treasury question?",
        options: [
          "What the payment will cost in kwacha if the exchange rate moves before the date, and whether to fix that cost now",
          "Whether the goods being bought are of acceptable quality",
          "How the purchase should be depreciated over its useful life",
          "Which department's budget the cost is charged to",
        ],
        answer: 0,
        explain:
          "The other three are real questions and none of them is treasury's. Treasury owns the exposure: the amount is fixed in dollars, the company earns kwacha, and the cost in kwacha is unknown until the day it is paid. Deciding whether to leave that open or fix it now is the job.",
      },
    },
  ],
};
