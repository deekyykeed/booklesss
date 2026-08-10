/* TM · The Price of Debt · Credit Ratings
 *
 * Split out of the-price-of-debt.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of the-price-of-debt.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "credit-ratings",
  label: "Credit Ratings",
  title: "Credit Ratings",
  kicker: "The Price of Debt",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "credit-ratings",
      heading: "Credit ratings",
      blocks: [
        {
          type: "p",
          text: "One [[notch|A single step on a rating scale, such as BBB down to BB+. Ratings move a notch at a time, which is why a company defends the notch above a threshold so hard: the next one down changes who is allowed to lend to it.]] down, from BBB to BB, and it is not the interest rate that hurts most. **It is that a large part of your lender pool is no longer permitted to own your paper at all.**",
        },
        {
          type: "p",
          text: "[Rating agencies](https://corporatefinanceinstitute.com/resources/fixed-income/credit-rating/), meaning Moody's, Standard & Poor's and Fitch, grade how likely a borrower is to default, and that grade prices its debt. The line that matters runs between investment grade and speculative.",
        },
        {
          type: "table",
          columns: [{ label: "S&P / Fitch" }, { label: "Moody's" }, { label: "Meaning" }],
          rows: [
            ["AAA", "Aaa", "Highest credit quality"],
            ["AA", "Aa", "Very high quality"],
            ["A", "A", "Upper medium grade"],
            ["BBB", "Baa", "Medium grade, and the investment-grade floor"],
            ["BB", "Ba", "Speculative"],
            ["B", "B", "High default risk"],
            ["CCC", "Caa", "In or near default"],
          ],
        },
        {
          type: "p",
          text: "BBB and above is what most institutions are allowed to hold, so slipping below it shrinks the number of people who can lend to you rather than merely raising what they charge.",
        },
        {
          type: "p",
          text: "The same grading drives the gaps between borrowers. A AAA name and a BBB name face different [credit spreads](https://corporatefinanceinstitute.com/resources/commercial-lending/credit-risk/), and the gap is not the same size in the fixed market as in the floating one. **That difference between two differences is real money,** and it is what [an interest rate swap](step:interest-rate-swaps) exists to release.",
        },
        { type: "h2", text: "The ceiling you do not control" },
        {
          type: "p",
          text: "The sovereign rating sits above every corporate one in the country. Zambia's government rating sets how the world reads every Zambian borrower, so a downgrade tightens credit and raises rates for the state and for companies alike, as the restructuring years showed in full. **Your cost of debt is built on a floor you do not set,** which is the strongest argument there is for locking funding while conditions are good rather than when you need it.",
        },
      ],
      check: {
        question:
          "A company slips from BBB to BB. Beyond a higher interest rate, what changes in its access to debt?",
        options: [
          "It falls out of investment grade, so institutional investors restricted to BBB and above can no longer hold its paper, which shrinks its lender pool",
          "Nothing else, because the rating only affects the rate",
          "Its existing bonds are cancelled",
          "It can no longer borrow from banks, only issue bonds",
        ],
        answer: 0,
        explain:
          "The BBB to BB line is regulatory and mandate-driven rather than reputational: pension funds and insurers are commonly barred from speculative-grade paper. Crossing it does not merely reprice the debt, it removes buyers, which is why issuers defend the boundary so hard.",
      },
    },
  ],
};
