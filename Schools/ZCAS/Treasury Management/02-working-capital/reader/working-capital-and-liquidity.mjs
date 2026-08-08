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
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). §3 worked the Zanaco
 * Distributors cycle and then asked which component moved in a hypothetical
 * later year, which needs no arithmetic. It now hands over a full cycle whose
 * three components land on whole days (60, 45, 35), so the reader's error, if
 * any, is in the method rather than in rounding. The distractors are the three
 * real ones: the operating cycle reported as the cash cycle, every ratio run
 * over revenue, and payables added rather than subtracted.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Working capital, and how much of it to run'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared. The slug is
 * untouched, so no URL moved.
 */

export default {
  slug: "working-capital-and-liquidity",
  label: "Working Capital and Liquidity",
  title: "Working Capital and Liquidity",
  kicker: "Working Capital",

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
          kind: "key",
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
          text: "A permanent part of your asset base, funded with debt you have to renew every ninety days. That is the cheapest money on the table, and it is also the most fragile. **It is a policy too, whether or not anybody wrote it down.**",
        },
        {
          type: "p",
          text: "There are [two decisions and they are separate](https://corporatefinanceinstitute.com/resources/accounting/working-capital-management/). The investment decision asks how much [[safety stock|The extra inventory or cash buffer held above the minimum the business needs to operate. It buys you protection against a bad week, and it costs you whatever that money would have earned.]] and cash buffer to hold above the operating minimum. A distributor running on ZMW 3 million of stock and a ZMW 500,000 [[cash float|The working balance kept in the account to meet day-to-day payments, as opposed to money put to work. It looks like idle cash on the statement, and it is the thing standing between you and a missed payment.]] is answering it, whether or not anyone said so.",
        },
        /* Was a 3x4 table. Nothing in it lined up, so on a phone the last two
         * columns wrapped a word per line (E-9). As cards the three read as a
         * spectrum instead of a list: the marks are one battery at three fill
         * levels, and the accent layer is the charge, so the card's own hue
         * shows how much buffer the policy keeps. Ordered lean to full rather
         * than in the table's old order, because that is the trade-off the
         * section closes on. Return and risk moved into each card's text; the
         * table kept them apart, which is what let the reader miss that they
         * move together. */
        {
          type: "cards",
          cards: [
            {
              icon: "batteryEmpty",
              title: "Aggressive",
              lead: "Run it lean",
              text: "Minimal safety stock, lean inventory, tight cash buffers. The return is higher because less capital sits idle, and the risk is higher because a bad week has nothing to absorb it.",
            },
            {
              icon: "batteryLow",
              title: "Moderate",
              lead: "Somewhere in between",
              text: "Balanced between the two extremes, and middle ground on both counts. It is where most companies actually sit, usually without having chosen it.",
            },
            {
              icon: "batteryFull",
              title: "Conservative",
              lead: "Keep the tank full",
              text: "Large safety stocks and generous cash buffers. The return is lower because more capital is tied up, and the risk is lower because you are rarely caught short.",
            },
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
