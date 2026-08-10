/* TM · Currency · Forward Rates
 *
 * Split out of foreign-exchange-risk.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of foreign-exchange-risk.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "forward-exchange-rates",
  label: "Forward Rates",
  title: "Forward Rates",
  kicker: "Currency",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "forward-rates",
      heading: "Forward rates",
      blocks: [
        {
          type: "p",
          text: "Today's rate, the spot, is 12.50. The rate the bank will fix now for a deal in six months, the forward, is 13.00. That is not the bank's guess about where the kwacha will be by then. **It is arithmetic, and you can check it yourself.**",
        },
        {
          type: "p",
          text: "The [spot rate](https://corporatefinanceinstitute.com/resources/economics/spot-price/) is for delivery now, meaning settlement in a day or two. A forward rate is agreed today for delivery on a future date, and it comes out of the spot rate and the gap between the two currencies' interest rates.",
        },
        {
          type: "formula",
          text: "Forward = Spot × (1 + i_home) ÷ (1 + i_foreign)",
          where: [
            "i_home = the home-currency interest rate for the period",
            "i_foreign = the foreign-currency interest rate for the period",
            "Higher home rates put the home currency at a forward discount, lower rates at a premium",
          ],
        },
        {
          type: "p",
          text: "Take the lecture's figures: spot USD/ZMW 12.50, dollar rates 4% a year, kwacha rates 12% a year, over six months. Forward = 12.50 × (1 + 0.06) ÷ (1 + 0.02) = 12.50 × 1.0392 = 13.00 kwacha per dollar.",
        },
        {
          type: "p",
          text: "So the kwacha stands at a forward discount, 13.00 forward against 12.50 spot, because its interest rates are the higher ones. The reason is [[interest rate parity|The rule that a forward rate must exactly offset the interest difference between two currencies. If it did not, you could borrow the low-paying one, hold the high-paying one and lock the profit today, so the market prices it away.]], not prediction. Holding kwacha pays 12% while holding dollars pays 4%, so the forward has to hand that difference back, or everyone would take one side of the trade at no risk.",
        },
        {
          type: "callout",
          kind: "warning",
          text: "**A high-interest currency always trades at a forward discount.** If a forward quote ever looks like good news about your currency, check the interest rates before you celebrate.",
        },
      ],
      check: {
        question:
          "Kwacha interest rates are far above dollar rates. What does that imply about the USD/ZMW forward rate?",
        options: [
          "The kwacha trades at a forward discount, so more kwacha per dollar forward than spot, offsetting its yield advantage",
          "The kwacha trades at a forward premium, because high rates mean a strong forward",
          "Forward and spot must be equal when rates differ",
          "It implies nothing, because forwards reflect the bank's currency forecast",
        ],
        answer: 0,
        explain:
          "Interest rate parity sets the forward mechanically: the currency paying more interest must be cheaper forward, or the carry trade would be riskless. The forward is a no-arbitrage price, not the bank's view of where the kwacha is heading.",
      },
    },
  ],
};
