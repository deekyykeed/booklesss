/* TM · Working Capital · The Cash Conversion Cycle
 *
 * Split out of working-capital-and-liquidity.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of working-capital-and-liquidity.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "cash-conversion-cycle",
  label: "The Cash Conversion Cycle",
  title: "The Cash Conversion Cycle",
  kicker: "Working Capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "cash-conversion-cycle",
      heading: "The cash conversion cycle",
      blocks: [
        {
          type: "p",
          text: "Eighty-one days pass between the company below paying for its goods and collecting the cash on them. **Every one of those days is financed by somebody, and that somebody is you.**",
        },
        {
          type: "p",
          text: "The operating cycle is the time between paying cash for inputs and receiving cash from sales. The [cash conversion cycle](https://corporatefinanceinstitute.com/resources/accounting/cash-conversion-cycle/) measures it exactly, and the longer it runs the more working capital the business has to fund.",
        },
        {
          type: "formula",
          text: "CCC = Days Inventory + Days Receivables − Days Payables",
          where: [
            "Days Inventory = (Inventory ÷ Cost of goods sold) × 365",
            "Days Receivables = (Accounts receivable ÷ Revenue) × 365",
            "Days Payables = (Accounts payable ÷ Cost of goods sold) × 365",
          ],
        },
        {
          type: "p",
          text: "Work the lecture's example. Zanaco Distributors Ltd holds inventory of ZMW 2,600,000, [[receivables|Money customers owe you for sales already made: invoices issued and not yet paid. Revenue you have earned and cannot yet spend.]] of ZMW 1,700,000 and payables of ZMW 1,600,000, on annual revenue of ZMW 15,000,000 and cost of goods sold of ZMW 9,200,000.",
        },
        {
          type: "table",
          columns: [{ label: "Component" }, { label: "Working" }, { label: "Days", align: "right" }],
          rows: [
            ["Days inventory", "(2,600,000 ÷ 9,200,000) × 365", "103.15"],
            ["Days receivables", "(1,700,000 ÷ 15,000,000) × 365", "41.37"],
            ["Days payables", "(1,600,000 ÷ 9,200,000) × 365", "(63.48)"],
          ],
          total: ["Cash conversion cycle", "103.15 + 41.37 − 63.48", "81.04"],
          note: "Cash turnover = 365 ÷ 81.04 = 4.5 times per year.",
        },
        {
          type: "p",
          text: "So the cash turns over four and a half times a year. **Every route to a shorter cycle attacks one of those three components,** and naming which one turns a vague instruction to \"improve cash flow\" into a decision somebody can actually take.",
        },
        {
          type: "ul",
          items: [
            "Collect faster, with tighter terms or a discount for early payment.",
            "Turn [inventory](https://corporatefinanceinstitute.com/resources/accounting/days-inventory-outstanding-dio/) quicker, or order in smaller and more frequent lots.",
            "Take longer to pay, up to the point where it starts costing you the supplier.",
          ],
        },
        {
          type: "callout",
          kind: "example",
          text: "Measure one before you read on. A Kitwe hardware distributor reports revenue of ZMW 18,250,000, cost of goods sold of ZMW 10,950,000, inventory of ZMW 1,800,000, receivables of ZMW 2,250,000 and payables of ZMW 1,050,000. Work the three components, then the cycle. Each ratio has its own denominator. Two of the three are measured against cost of goods sold, and only receivables goes over revenue. A receivable is billed at the selling price; stock and supplier invoices are not.",
        },
      ],
      check: {
        question:
          "What is that distributor's cash conversion cycle: revenue ZMW 18,250,000, cost of goods sold ZMW 10,950,000, inventory ZMW 1,800,000, receivables ZMW 2,250,000, payables ZMW 1,050,000?",
        options: [
          "70 days",
          "105 days",
          "60 days",
          "140 days",
        ],
        answer: 0,
        explain:
          "Days inventory = (1,800,000 ÷ 10,950,000) × 365 = 60. Days receivables = (2,250,000 ÷ 18,250,000) × 365 = 45. Days payables = (1,050,000 ÷ 10,950,000) × 365 = 35. CCC = 60 + 45 − 35 = **70 days**, so cash turns over 365 ÷ 70 = 5.2 times a year, against Zanaco Distributors' 4.5. 105 days is the operating cycle: it stops before subtracting payables, which is the same as pretending suppliers are paid on delivery. 60 days runs all three ratios over revenue, which understates both stock and supplier days. 140 days adds payables instead of subtracting them. Notice what that claims: the cycle gets longer the later you pay, which is backwards, so the sign is checkable without redoing the arithmetic.",
      },
    },
  ],
};
