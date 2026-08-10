/* TM · The Treasury Function · The Eleven Functions of Treasury
 *
 * Split out of intro-to-treasury.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of intro-to-treasury.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "eleven-functions",
  label: "The Eleven Functions of Treasury",
  title: "The Eleven Functions of Treasury",
  kicker: "The Treasury Function",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "eleven-functions",
      heading: "The eleven functions of treasury",
      blocks: [
        {
          type: "p",
          text: "Before lunch, your treasurer might release a dollar payment to a supplier, [roll a deposit that matured this morning](https://corporatefinanceinstitute.com/resources/accounting/cash-management/), and take a call from Zanaco about an overdraft rate. Then approve a credit limit and send you the group cash forecast. **Five different jobs, one desk.** When you hire for that desk, [this is what you are buying](https://treasury-management.com/articles/functions-of-a-corporate-treasury).",
        },
        {
          type: "table",
          columns: [{ label: "#" }, { label: "Function" }, { label: "What it means" }],
          rows: [
            ["1", "Cash forecasting", "Pulls short and long-term forecasts from all subsidiaries"],
            ["2", "Working capital management", "Monitors working capital levels and trends"],
            ["3", "Cash management", "Keeps sufficient cash available for operations at all times"],
            ["4", "Investment management", "Invests surplus cash appropriately"],
            ["5", "Risk management", "Manages interest rate and FX exposure"],
            ["6", "Management advice", "Advises leadership on market conditions"],
            ["7", "Credit rating relations", "Liaises with agencies when issuing marketable debt"],
            ["8", "Bank relationships", "Manages banking fees, terms, and ongoing communications"],
            ["9", "Fund raising", "Maintains investor relationships for capital raising"],
            ["10", "Credit granting", "Grants credit to customers on behalf of the business"],
            ["11", "Other activities", "M&A support, company insurance, and similar matters"],
          ],
        },
        {
          type: "p",
          text: "The list is not eleven flat items. **The first five are the operating core, and they run in order.** [Forecast the cash](https://corporatefinanceinstitute.com/resources/financial-modeling/forecasting-cash-flow/), manage the [[working capital|The money tied up in running a business day to day: stock on the shelf and invoices customers have not paid yet, less the invoices you have not paid your suppliers. It is cash you own but cannot spend.]] that consumes it, keep enough on hand to trade, invest what is left, and manage the risks on top. The last six point outward: to management, the [[rating agencies|Firms like Moody's, S&P and Fitch that score how likely a borrower is to repay. The score sets the interest rate every future borrowing carries, so a downgrade costs real money.]], the banks, the investors, the customers you grant credit to, and a catch-all for M&A support and insurance. In a small company you do most of these yourself, long before you can afford anyone else to.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Recover the list from the five/six split: **five functions that move the money, six that manage the people and institutions who let it move.** Eleven flat items will not survive pressure; the split will.",
        },
      ],
      check: {
        question:
          "A supplier of marketable debt asks who at the company handles its relationship with Moody's and S&P. Which treasury function is that?",
        options: [
          "Credit rating relations, which liaises with agencies when the company issues marketable debt",
          "Bank relationships, since rating agencies are a kind of bank",
          "Fund raising, since ratings are only about raising equity",
          "Management advice, since ratings are advice to leadership",
        ],
        answer: 0,
        explain:
          "Rating agencies get their own function on the list because their assessment prices the company's debt. Bank relationships covers fees and terms with lenders; the agency relationship is about the rating that every future issue will carry.",
      },
    },
  ],
};
