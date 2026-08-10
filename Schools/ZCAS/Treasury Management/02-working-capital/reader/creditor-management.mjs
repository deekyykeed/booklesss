/* TM · Inventory and Suppliers · Creditor Management
 *
 * Split out of ordering-and-paying-suppliers.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of ordering-and-paying-suppliers.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "creditor-management",
  label: "Creditor Management",
  title: "Creditor Management",
  kicker: "Inventory and Suppliers",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "creditor-management",
      heading: "Creditor management",
      blocks: [
        {
          type: "p",
          text: "Every extra day you take to pay a supplier is a day of funding you did not have to arrange, did not have to secure and are not paying interest on. **That holds right up until the day it doesn't.**",
        },
        {
          type: "p",
          text: "Trade credit is normally treated as free finance, so the standard policy is to pay [as late as you can](https://corporatefinanceinstitute.com/resources/accounting/accounts-payable/) while meeting your obligations and keeping the relationship intact. Each extra day of payables shortens the [cash conversion cycle](https://corporatefinanceinstitute.com/resources/accounting/cash-conversion-cycle/) and cuts the working capital the business has to fund.",
        },
        {
          type: "formula",
          text: "Days Payables = (Payables ÷ Cost of goods sold) × 365",
          where: ["Measures the average number of days taken to pay suppliers"],
        },
        {
          type: "p",
          text: "The mechanics mirror debtor management exactly, run backwards. What the formula cannot show you is the ceiling. **Stretch a cash-strapped Ndola supplier far enough and they fail, and you have just removed something your production depends on to gain a few days of funding.**",
        },
        {
          type: "callout",
          kind: "warning",
          text: "Stretch payables to shorten the cycle. **The limit is the supplier's survival, not the point at which they stop chasing you,** and the second thing you are spending is their [[goodwill|What a supplier is willing to do for you that the contract does not require: the rush order, the last unit, the quiet extension. It is unpriced right up to the day you need it and it is gone.]].",
        },
      ],
      check: {
        question:
          "A company stretches supplier payments from 45 to 120 days. Its cash conversion cycle improves sharply, and then its key raw-material supplier collapses. What did the policy miss?",
        options: [
          "Supply chain risk, because payables are finance borrowed from suppliers and over-stretching can break the lender you depend on",
          "Nothing, because a shorter cycle is always worth any cost",
          "The arithmetic, because longer payables actually lengthen the cycle",
          "The suppliers should have factored their invoices",
        ],
        answer: 0,
        explain:
          "Longer payables do shorten the cycle, so the arithmetic worked. What failed is the constraint the metric does not carry: trade credit is finance drawn from companies that can run out of cash themselves. Creditor policy is set against supplier health and relationships, not against the cycle alone.",
      },
    },
  ],
};
