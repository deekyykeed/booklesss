/* TM · Building the Portfolio · Constructing the Portfolio
 *
 * Split out of building-the-portfolio.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of building-the-portfolio.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "portfolio-construction",
  label: "Constructing the Portfolio",
  title: "Constructing the Portfolio",
  kicker: "Building the Portfolio",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "portfolio-construction",
      heading: "Constructing the portfolio",
      blocks: [
        {
          type: "p",
          text: "Two million is needed in three months for tax. One and a half million in six months for a dividend. The rest can stay for the year. **That schedule builds the portfolio, not the rate sheet.**",
        },
        {
          type: "p",
          text: "Three standard shapes organise maturities. [Laddering spreads equal amounts](https://corporatefinanceinstitute.com/resources/fixed-income/bond-ladder/) across 1, 3, 6 and 12 months and rolls each maturing rung out to the far end, so there is always cash arriving. A bullet puts everything on one future date to meet one known need. A barbell splits between very short and long, say 60% in 30-day deposits and 40% in 3-year bonds, taking liquidity and yield at once with a view on rates deciding the split.",
        },
        {
          type: "p",
          text: "The lecture's manufacturer holds ZMW 5 million against exactly the schedule above, keeping ZMW 500,000 back as a standing reserve.",
        },
        {
          type: "table",
          columns: [
            { label: "Tranche" },
            { label: "Need" },
            { label: "Instrument" },
            { label: "Rate", align: "right" },
            { label: "Annual yield, ZMW", align: "right" },
          ],
          rows: [
            ["500,000", "Immediate reserve", "Call deposit", "10%", "50,000"],
            ["2,000,000", "Tax in 3 months", "91-day T-bill", "13%", "260,000"],
            ["1,500,000", "Dividend in 6 months", "182-day T-bill", "14%", "210,000"],
            ["1,000,000", "Free for 12 months", "1-year government bond", "15%", "150,000"],
          ],
          total: ["5,000,000", "", "", "", "670,000"],
          note: "Blended yield 670,000 ÷ 5,000,000 = 13.4%, with every cash need matched by a maturity.",
        },
        {
          type: "p",
          text: "Every tranche matures on the date its money is wanted, so nothing is ever sold early and nothing sits idle. **That table is the whole safety, liquidity and yield hierarchy, written out as four rows.**",
        },
        {
          type: "p",
          text: "Judge it afterwards against a [[benchmark|A reference return built from market rates in the same proportions as your own portfolio. Comparing against one is how you tell a good year for you from a good year for everyone.]] weighted the same way, comparing total return against what that mix of market rates actually delivered. A large gap either way deserves the same question: was that skill, or was it risk the policy never intended you to take?",
        },
        {
          type: "callout",
          kind: "example",
          text: "Price a portfolio of your own. A distributor has ZMW 8 million of surplus and four calls on it. ZMW 1 million must stay instantly available, on call at 9%. ZMW 3 million meets a VAT bill in three months, in a 91-day bill at 12%. ZMW 2 million funds a dividend in six months, in a 182-day bill at 13.5%. The last ZMW 2 million is free for the year, in a 1-year bond at 15%. Work the blended yield on the whole ZMW 8 million. The reserve is part of the portfolio, and so is the fact that the tranches are different sizes.",
        },
      ],
      check: {
        question:
          "What blended yield does that ZMW 8 million portfolio earn: 1m on call at 9%, 3m at 12%, 2m at 13.5%, 2m at 15%?",
        options: [
          "12.75%",
          "12.38%",
          "13.29%",
          "15.00%",
        ],
        answer: 0,
        explain:
          "Take each tranche's own return and add them: 90,000 + 360,000 + 270,000 + 300,000 = ZMW 1,020,000, over ZMW 8,000,000, is **12.75%**. 12.38% is the plain average of the four rates, which quietly gives the ZMW 1 million reserve the same weight as the ZMW 3 million tax tranche. 13.29% drops the call deposit out of the denominator, and it is the most tempting slip. The reserve looks like idle cash rather than an investment, but it is money the portfolio is holding, and reporting a yield without it flatters the whole thing. 15% is the best rate in the table, which is only what the portfolio earns if the schedule is ignored. Then the VAT falls due with nothing matured to pay it.",
      },
    },
  ],
};
