/* TM · Debt · The Matching Principle
 *
 * Split out of debt-management.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of debt-management.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "the-matching-principle",
  label: "The Matching Principle",
  title: "The Matching Principle",
  kicker: "Debt",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "matching",
      heading: "Short against long, and the matching principle",
      blocks: [
        {
          type: "p",
          text: "A factory lasts fifteen years. A ninety-day loan lasts ninety days. **Every gap between those two numbers is a bet, and you place it again at every rollover.**",
        },
        {
          type: "p",
          text: "The matching principle is one line: borrow for as long as you need the thing you are buying. Short-term assets financed short, long-term assets financed long. Each side has a case for it and a price attached.",
        },
        /* Was a 3x3 comparison matrix (E-9, D-5). The two kinds being compared
         * were the columns, not the rows, so as cards each one is read whole
         * instead of across: what it is for, what it buys, what it costs. The
         * marks are the time-horizon axis the section is actually about, a
         * calendar against the long game. */
        {
          type: "cards",
          cards: [
            {
              icon: "calendar",
              title: "Short-term debt",
              lead: "Working capital, seasonal needs, temporary shortfalls",
              text: "Cheaper, because the yield curve usually slopes up, and flexible enough to follow working capital's rhythm. What you carry is refinancing risk at every maturity, a rate that may have risen by renewal, and an overdraft the bank can cancel at will.",
            },
            {
              icon: "chess",
              title: "Long-term debt",
              lead: "Capital expenditure and fixed assets",
              text: "Funds locked for the term, so there is no refinancing risk and the borrowing lasts as long as the asset does. What you pay for that is a higher rate, a penalty for repaying early, and a commitment that may outlive the need.",
            },
          ],
        },
        {
          type: "p",
          text: "Breaking the principle costs you in both directions. Fund a plant with 90-day kwacha [[paper|Short-term borrowing sold as notes rather than taken as a loan. \"Rolling the paper\" means issuing new notes to repay the maturing ones, which works until the day nobody buys.]] and you re-run the refinancing gamble forty times over the asset's life. Fund seasonal inventory with a 10-year loan and you pay long-term rates on money that sits idle for most of the year, when a [revolving facility](https://corporatefinanceinstitute.com/resources/commercial-lending/revolving-credit-facility/) would have cost you only what you drew.",
        },
        {
          type: "callout",
          kind: "key",
          text: "**Matching is the default, and departing from it is a policy rather than an accident.** Funding permanent assets with short-term debt is the aggressive position, cheaper and exposed at every renewal. Funding everything long is the conservative one, safer and dearer. Pick knowingly.",
        },
      ],
      check: {
        question:
          "A company funds a 15-year processing plant entirely with rolling 6-month bank loans because \"short rates are lower\". What risk has it taken?",
        options: [
          "Thirty consecutive refinancings, each at whatever rate and credit conditions then prevail, which is a maturity mismatch against the matching principle",
          "None, because cheaper funding is always the right choice",
          "Only currency risk, if the loans are in dollars",
          "The plant may wear out before the loans do",
        ],
        answer: 0,
        explain:
          "The asset's life is fixed and the funding's is not. Each rollover reprices the debt and re-tests the company's access to credit, and one refused renewal mid-life leaves a half-financed plant. The rate saving is real: it is the compensation for carrying exactly this risk.",
      },
    },
  ],
};
