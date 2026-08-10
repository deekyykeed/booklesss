/* TM · Working Capital · Working Capital Policy
 *
 * Split out of working-capital-and-liquidity.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of working-capital-and-liquidity.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "working-capital-policy",
  label: "Working Capital Policy",
  title: "Working Capital Policy",
  kicker: "Working Capital",

  sections: [
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
  ],
};
