/* TM · Lesson 2 Working capital · Step 1a — Working capital, and how much of it to run
 *
 * Source: 07_Working Capital_Liquidity Management PPTX 1;
 *         build_tm_2_1_working-capital.py (PDF). Worked figures kept at the
 *         lecture's originals (Zanaco Distributors CCC).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one five-section step. The seam is
 * between what working capital is and how much of it to run (the definition,
 * the two policy decisions, the cycle that sizes it) and getting the cash back
 * in (debtors, discounts, factoring). Coverage is identical; nothing was cut.
 * This part keeps the `working-capital-and-liquidity` slug because that URL
 * exists; the other half is `debtors-and-factoring`.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 * Engagement (D-1): the step opened "Working capital is current assets minus
 * current liabilities", which is the definition with nothing to hang it on. It
 * now opens on the company that reports a record year and cannot pay March's
 * suppliers, and the definition follows.
 *
 * D-5 (E-9) was considered and declined here. The two policy tables are
 * three-row definitional sets, which is inside E-9's cap, but the axis is risk
 * appetite and `card-glyphs.tsx` currently carries only the three time-horizon
 * marks. Three unrelated pictures would be worse than the tables, so they stay
 * tables until the glyph set covers this axis.
 *
 * 2026-08-02 W-9: §2 closed "When the exam asks you to evaluate a policy…".
 * The sentence now hands the judgement to whoever is choosing the policy.
 */

export default {
  slug: "working-capital-and-liquidity",
  label: "Working capital",
  title: "Working capital, and how much of it to run",
  kicker: "Working capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-working-capital-is",
      heading: "What working capital is",
      blocks: [
        {
          type: "p",
          text: "A company can report a record year in February and fail to pay its suppliers in March. **Profit is an opinion about a period. Working capital is what is actually in the account this week.**",
        },
        {
          type: "p",
          text: "Technically it is [current assets minus current liabilities](https://www.accountingcoach.com/blog/what-is-working-capital). In practice it is the pool of cash and near-cash the business has to keep itself running day to day, and the whole job is sizing that pool.",
        },
        {
          type: "p",
          text: "More assets than [current liabilities](https://www.accountingcoach.com/blog/what-is-a-current-liability) and you have a surplus, usually sitting in deposits or short-term investments. Fewer and you have a deficit, usually running on an overdraft. **Too little and you cannot pay your suppliers; too much and the money is idle when it could be in something productive.**",
        },
        {
          type: "callout",
          text: "Even a profitable business fails without adequate working capital. **Cash is king, not profit.** A company can look excellent on paper and still collapse because it cannot meet what falls due next week.",
        },
      ],
      check: {
        question:
          "A company reports strong profits but cannot pay this month's suppliers. How is that possible?",
        options: [
          "Profit is an accounting result, and its cash may be tied up in stock and unpaid customer invoices, leaving nothing liquid",
          "It is not possible, because profitable companies always have cash",
          "The profits must be fraudulent",
          "Suppliers must be demanding early payment illegally",
        ],
        answer: 0,
        explain:
          "Profit records revenue when it is earned, not when it is collected. A profitable company whose cash sits in inventory and receivables has a working capital problem, and working capital rather than profit is what pays this month's bills.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "working-capital-policy",
      heading: "Working capital policy",
      blocks: [
        {
          type: "p",
          text: "Fund a permanent part of your asset base with debt you have to renew every ninety days and you have chosen the cheapest money available and the most exposed. **That is a policy, whether or not anybody wrote it down.**",
        },
        {
          type: "p",
          text: "There are two decisions and they are separate. The investment decision asks how much [[safety stock|The extra inventory or cash buffer held above the minimum the business needs to operate. It buys you protection against a bad week, and it costs you whatever that money would have earned.]] and cash buffer to hold above the operating minimum.",
        },
        {
          type: "table",
          columns: [
            { label: "Policy" },
            { label: "What it means" },
            { label: "Return" },
            { label: "Risk" },
          ],
          rows: [
            [
              "Aggressive",
              "Minimal safety stock, lean inventory, tight cash buffers",
              "Higher, since less capital is idle",
              "Higher, since it cannot absorb demand spikes",
            ],
            [
              "Conservative",
              "Large safety stocks and generous cash buffers",
              "Lower, since more capital is tied up",
              "Lower, since it is rarely caught short",
            ],
            ["Moderate", "Balanced between the two extremes", "Middle ground", "Middle ground"],
          ],
        },
        {
          type: "p",
          text: "The financing decision is separate, and asks what mix of short and long-term debt pays for that asset base. Get this one wrong and you carry [[rollover risk|The risk that when short-term borrowing falls due you cannot renew it, or can only renew it at a much worse rate. It is the price of cheap short money, and it lands at the worst possible moment by definition.]] on assets that are never going away.",
        },
        {
          type: "table",
          columns: [
            { label: "Policy" },
            { label: "How it works" },
            { label: "Return" },
            { label: "Risk" },
          ],
          rows: [
            [
              "Aggressive",
              "Part of the permanent asset base funded by short-term debt",
              "Highest, since short-term debt costs less",
              "Highest, since it must be rolled over",
            ],
            ["Conservative", "Permanent assets funded by long-term debt only", "Lowest", "Lowest"],
            ["Maturity matching", "Match funding maturity to asset life", "Middle", "Middle"],
          ],
        },
        {
          type: "p",
          text: "**The symmetry is the thing to carry out of here: in both decisions, aggressive means higher return and higher risk together, and conservative means less of both.** So there is no good or bad policy to pick, only a position on that trade-off. The honest way to state yours is to say both halves out loud before committing.",
        },
      ],
      check: {
        question:
          "A company funds part of its permanent asset base with short-term debt that it rolls over every 90 days. What has it chosen?",
        options: [
          "An aggressive financing policy: cheaper funding, carrying rollover and rate risk every quarter",
          "A conservative financing policy, since short-term debt is the safe option",
          "Maturity matching, since 90 days matches any asset",
          "An aggressive investment policy, since this is about how much to hold",
        ],
        answer: 0,
        explain:
          "Permanent assets funded short-term is the definition of aggressive financing. The yield curve makes it cheaper, and every rollover is a chance for rates to rise or credit to dry up. It is the financing decision rather than the investment one, because the asset levels have not changed.",
      },
    },

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
          text: "Work the lecture's example. Zanaco Distributors Ltd holds inventory of ZMW 2,600,000, receivables of ZMW 1,700,000 and payables of ZMW 1,600,000, on annual revenue of ZMW 15,000,000 and cost of goods sold of ZMW 9,200,000.",
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
      ],
      check: {
        question:
          "A year later Zanaco Distributors' CCC has jumped from 81 to 120 days. Which single change explains it?",
        options: [
          "Days receivables rose sharply, meaning customers are taking much longer to pay",
          "Days payables rose sharply, meaning the company pays suppliers later",
          "Revenue rose while everything else stayed constant",
          "The company negotiated a discount for early supplier payment",
        ],
        answer: 0,
        explain:
          "The cycle lengthens when inventory or receivable days rise, or payable days fall. Slower collection adds directly to it, paying suppliers later would shorten it, and higher revenue with constant receivables reduces receivable days. Diagnosis starts with the component that actually moved.",
      },
    },
  ],
};
