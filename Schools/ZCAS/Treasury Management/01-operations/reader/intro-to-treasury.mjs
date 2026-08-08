/* TM · Lesson 1 Operations · Step 1.1: What treasury is and what it does
 *
 * Source: 06_Introduction to Treasury Management PPTX; Treasury controls.pdf;
 *         build_lesson_1_1_tm.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-01 split (rule S-8). This was one six-section step. Six sections is
 * a climb, and a reader who abandons two thirds of the way through has learned
 * less than one who finishes three shorter steps. Split on the conceptual
 * seams: what treasury is, how the work divides, how it is governed. Coverage
 * is identical; nothing was cut. The first part keeps the original
 * `intro-to-treasury` slug because that URL is already linked to.
 *
 * This step is also the reference implementation for the writing rules: W-8
 * bold, W-9/W-10 ownership voice, W-11 no em dashes, W-12 sentence length,
 * E-8 [[term|definition]] popups, C-7 inline source links.
 */

export default {
  slug: "intro-to-treasury",
  label: "What treasury is",
  title: "What treasury is and what it does",
  kicker: "Treasury operations",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-treasury-is",
      heading: "What treasury is",
      blocks: [
        {
          type: "p",
          text: "Your company can have a [profitable year](https://corporatefinanceinstitute.com/resources/accounting/cash-flow-vs-net-income/) and still fail to pay the staff at the end of it. The [[income statement|The report of what your business earned and spent over a period: revenue minus costs, ending in profit. It counts sales when they are made, not when the cash arrives, which is exactly why it can show a profit while your account is empty.]] says the year went well. [The bank balance on the 28th](https://www.accountingcoach.com/cash-flow-statement/explanation) says there is not enough to run payroll. **Profit is worked out over twelve months and rests on judgement; cash is a fact on a Friday afternoon.** The Friday decides whether anyone gets paid.",
        },
        {
          type: "p",
          text: "[Treasury](https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/treasury-management/) is the function that lives on the cash side of that gap. Its job is to **put your money in the right account, in the right currency, on the day it is needed**. [Cash that is not needed yet](https://www.accountingcoach.com/working-capital/explanation) earns something instead of sitting idle. Every risk that comes with holding and moving it is [treasury's to find and reduce](https://careernavigator.accaglobal.com/gb/en/job-profiles/proficient/treasury-professional.selector.Leader.html): a kwacha that moves against you, a rate that resets, a bank that changes its terms.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Profit is an opinion formed over a year. Cash is a fact on a Friday. Treasury owns the Friday.",
        },
        {
          type: "p",
          text: "**Treasury executes; it does not set strategy.** If your board decides to fund a new plant with 40% debt, treasury gets no vote. It raises the debt, negotiates the terms, then lives with the rate risk for ten years. That line matters, because treasury works inside the three decisions that make up corporate finance.",
        },
        {
          type: "ul",
          items: [
            "The investment decision. Where the money goes: long-term projects, working capital, investments inside or outside the business.",
            "The financing decision. Where the money comes from: the mix of debt and equity, the cost of those funds, and the [[hedging|Taking a second position that moves the opposite way to a risk you already carry, so the two cancel out. You give up some upside to remove the downside. It is insurance, not a bet.]] that mix forces on you.",
            "Dividend policy. What happens to the profit: how much is paid out to shareholders and how much is kept to fund growth.",
          ],
        },
        {
          type: "p",
          text: "Treasury sits underneath all three. It funds the working capital the first creates, manages the risks the second leaves open, and holds the cash the third has promised to pay out.",
        },
      ],
      check: {
        question:
          "The board decides the company will move to a 40% debt, 60% equity structure. What is treasury's role in that decision?",
        options: [
          "Execute it: arrange the borrowings and manage the resulting cost and risk; the decision itself belongs to senior management",
          "Make it, because capital structure is treasury's core decision",
          "Veto it if the cost of debt is too high",
          "None, because capital structure is an accounting matter",
        ],
        answer: 0,
        explain:
          "Treasury carries out decisions made by senior management. The financing decision is set above the function; treasury's job is to raise the funds on the best terms, manage the refinancing and rate risk it creates, and keep access to credit open.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "eleven-functions",
      heading: "The eleven functions of treasury",
      blocks: [
        {
          type: "p",
          text: "Before lunch, your treasurer might release a dollar payment to a supplier, [roll a deposit that matured this morning](https://corporatefinanceinstitute.com/resources/accounting/cash-management/), and take a call from the bank about an overdraft rate. Then approve a credit limit and send you the group cash forecast. **Five different jobs, one desk.** When you hire for that desk, [this is what you are buying](https://treasury-management.com/articles/functions-of-a-corporate-treasury).",
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
