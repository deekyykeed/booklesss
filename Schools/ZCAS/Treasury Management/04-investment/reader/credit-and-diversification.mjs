/* TM · Building the Portfolio · Credit Risk and Diversification
 *
 * Split out of building-the-portfolio.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of building-the-portfolio.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "credit-and-diversification",
  label: "Credit Risk and Diversification",
  title: "Credit Risk and Diversification",
  kicker: "Building the Portfolio",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "credit-and-diversification",
      heading: "Credit risk and diversification",
      blocks: [
        {
          type: "p",
          text: "Placing a surplus is lending. **You are the bank now,** and the question a bank asks about every borrower is the one you now have to ask about every place your money sits.",
        },
        {
          type: "p",
          text: "Everything that is not government paper carries [credit risk](https://corporatefinanceinstitute.com/resources/commercial-lending/credit-risk/), meaning the chance the issuer does not pay. A government bond in a stable country carries almost none, a bank deposit carries that bank's solvency, and a corporate bond carries whatever its rating says it does. Because safety outranks yield, the policy caps this two ways.",
        },
        {
          type: "ul",
          items: [
            "Counterparty limits. No more than a set share of investable cash with any one [[counterparty|Whoever is on the other side of the deal and owes you the money back: the bank holding your deposit, the company whose bond you bought. Their failure is your loss, however sound the instrument looked.]], say 20% with one bank. No corporate paper below a set rating. No single issuer above a fixed amount.",
            "Diversification. [Spread across instruments and issuers](https://corporatefinanceinstitute.com/resources/economics/diversification/). Half in Zambian T-bills, 30% in call deposits across three banks, 20% in short-dated corporate bonds is diversified. All of it in one bank's certificate of deposit is a single point of failure wearing a good rate.",
          ],
        },
        {
          type: "p",
          text: "**No borrower deserves the whole book, however sound they look,** and the policy assumes a bank can fail so that you never have to be the person who predicted it correctly.",
        },
      ],
      check: {
        question:
          "A treasurer places the entire ZMW 8 million surplus with one bank because it offered 1% more than any rival. What principle was broken?",
        options: [
          "Counterparty concentration, because the whole surplus now depends on one institution's solvency, for 1% of extra yield",
          "None, because the best rate is the correct choice",
          "Maturity matching, because all deposits must have different terms",
          "The safety hierarchy is unaffected, because banks cannot fail",
        ],
        answer: 0,
        explain:
          "One institution holding everything turns a diversifiable risk into an existential one, which is exactly what counterparty limits exist to prevent. The extra 1% is no compensation if the bank fails, and banks do fail.",
      },
    },
  ],
};
