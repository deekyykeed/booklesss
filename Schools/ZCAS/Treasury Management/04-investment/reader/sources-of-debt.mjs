/* TM · Debt · The Sources of Debt
 *
 * Split out of debt-management.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of debt-management.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "sources-of-debt",
  label: "The Sources of Debt",
  title: "The Sources of Debt",
  kicker: "Debt",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "sources",
      heading: "The sources of debt",
      blocks: [
        {
          type: "p",
          text: "If a Zambian case tells you a company borrowed and does not say how, **it borrowed from a bank.** Bank debt dominates corporate borrowing here, the government issues bonds regularly in kwacha and dollars, and shallow capital markets keep corporate bonds uncommon and commercial paper rare.",
        },
        {
          type: "p",
          text: "That is the local weighting. The full list is five, and which one fits depends on the amount, the duration, your credit standing and the state of the market.",
        },
        {
          type: "table",
          columns: [{ label: "Source" }, { label: "What it is" }, { label: "Character" }],
          rows: [
            [
              "Bank loans",
              "Secured or unsecured lending, fixed or variable rate, from overdrafts and short loans to 5-year facilities",
              "The workhorse, and most corporate debt. Secured loans price lower",
            ],
            [
              "Bonds and debentures",
              "Long-term securities sold to investors: principal at maturity, coupon at intervals, 3 to 20 years",
              "Prices move inversely to interest rates, and a secondary market gives investors an exit",
            ],
            [
              "Commercial paper",
              "Unsecured short-term notes, 1 to 270 days and usually 30 to 90, issued at a discount",
              "The cheapest short money, but for blue-chip issuers only, and it rolls over constantly",
            ],
            [
              "Leasing",
              "Use of equipment for rent: operating leases are short and flexible, finance leases are purchase on credit",
              "No upfront capital, and obsolescence and residual-value risk sit with the lessor",
            ],
            [
              "Hire purchase",
              "Instalment buying, where the financier owns the asset until the final payment transfers it",
              "Equipment finance for firms below bond or commercial paper scale",
            ],
          ],
        },
        {
          type: "p",
          text: "Two of these price off what happens if you fail. A [[secured|Backed by a specific asset the lender can take and sell if you do not repay. It is why secured borrowing is cheaper, and why the asset you pledged is no longer really available to you.]] loan is cheaper than an unsecured one, and [commercial paper](https://corporatefinanceinstitute.com/resources/fixed-income/commercial-paper/) is cheapest of all because it is issued only by names the market already trusts. **You do not choose the cheap sources. You qualify for them.**",
        },
        {
          type: "p",
          text: "Two of the words in that table are worth pinning down. A [[debenture|A bond backed by the borrower's general creditworthiness rather than by a named asset. The word gets used loosely for corporate bonds generally, and the distinction that matters is whether anything specific secures it.]] is not the same thing as a secured bond, and the [[residual value|What an asset is expected to be worth at the end of a lease. Under an operating lease the lessor is the one guessing at it, which is exactly what you are paying them to do.]] on a lease is the number that decides whether leasing was cheaper than buying.",
        },
      ],
      check: {
        question:
          "A large, highly rated company needs ZMW 40 million for 60 days at the lowest possible cost. Which source fits?",
        options: [
          "Commercial paper, because it is short-term, discount-priced and cheaper than bank loans for blue-chip issuers",
          "A 10-year bond, because the secondary market makes it effectively short-term",
          "Hire purchase, because instalments spread the cost",
          "A finance lease on its factory",
        ],
        answer: 0,
        explain:
          "This is commercial paper's exact niche: very short unsecured borrowing by companies whose name alone carries the credit, priced below bank facilities. The bond mismatches the term entirely, and leasing and hire purchase are equipment products rather than general funding.",
      },
    },
  ],
};
