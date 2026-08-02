/* TM · Lesson 3 Risk · Step 2a — Currency risk, and how rates are quoted
 *
 * Source: 10_Foreign Exchange Risk Management PPTX;
 *         build_tm_3_2_fx-risk.py (PDF). Worked figures kept at the lecture's
 *         originals (USD/ZMW 12.50 six-month forward calculation).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one six-section step. The seam is
 * between the risk and the price of a currency (what the exposure is, how a
 * quote reads, where a forward rate comes from) and what you do about it
 * (operational hedges, forwards and futures, options). Coverage is identical;
 * nothing was cut. This part keeps the `foreign-exchange-risk` slug because
 * that URL exists; the second half is `hedging-currency-risk`.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 *
 * Engagement (D-1): every section opened on a definition of the thing it was
 * named after. Each now opens on a figure or a decision: the ZMW 250,000 that
 * goes missing between January and April, the side of the spread that is yours,
 * a forward of 13.00 that is not a forecast.
 *
 * Voice (D-2/W-9): "classifying which one a scenario describes is the first
 * mark in most exam questions" was the step's second sentence. Exam framing is
 * gone; the reader is the person carrying the exposure.
 *
 * Emphasis (D-2): across the original six sections, 0 bold, 0 tappable terms
 * and 0 source links became 14, 6 and 13. 54 em dashes became 0 (W-11).
 */

export default {
  slug: "foreign-exchange-risk",
  label: "Foreign exchange risk",
  title: "Currency risk, and how rates are quoted",
  kicker: "Risk",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "three-exposures",
      heading: "The three FX exposures",
      blocks: [
        {
          type: "p",
          text: "You sign an export order in January for USD 500,000, with the dollar at 12.50 kwacha, and you book it at ZMW 6,250,000. The customer pays in April. If the kwacha has strengthened to 12.00 by then, the same order is worth ZMW 6,000,000. **Nobody did anything wrong and a quarter of a million kwacha is gone.**",
        },
        {
          type: "p",
          text: "[Currency risk](https://corporatefinanceinstitute.com/resources/economics/foreign-exchange-risk/) turns up the moment you deal in more than one currency, whether through cross-border sales and purchases, foreign borrowings or a subsidiary abroad. It arrives in three forms, and telling them apart matters because each one is managed by a different tool.",
        },
        { type: "h2", text: "Transaction exposure" },
        {
          type: "p",
          text: "This is the one above: a committed cash flow in a foreign currency, waiting to be converted. **It is the most immediate exposure and the only one you can write down completely,** because it has an amount, a currency and a date. That is also why it is the one most hedging instruments are built for.",
        },
        { type: "h2", text: "Translation exposure" },
        {
          type: "p",
          text: "[Consolidating a foreign subsidiary](https://corporatefinanceinstitute.com/resources/economics/translation-exposure/) means restating its assets, liabilities and earnings in your currency at a new rate. Reported equity and profit move, and not one kwacha changes hands. It is an accounting effect, which is why people wave it away, and **a loan covenant written on reported numbers does not care that no cash moved.**",
        },
        { type: "h2", text: "Economic exposure" },
        {
          type: "p",
          text: "[The long-run one](https://corporatefinanceinstitute.com/resources/economics/economic-exposure/): a stronger kwacha makes your prices less competitive abroad, so the sales you were going to win next year quietly go to someone else. There is no contract to hedge, because the loss is in business you never booked. It is the hardest to quantify and the one that decides where the company ends up.",
        },
      ],
      check: {
        question:
          "A Zambian group's Tanzanian subsidiary made a normal profit, but consolidation at this year's weaker shilling rate cuts the group's reported equity. No cash moved. Which exposure is that?",
        options: [
          "Translation exposure, an accounting restatement effect of consolidation rather than a cash flow",
          "Transaction exposure, since the subsidiary's profit is a committed cash flow",
          "Economic exposure, since the group's competitiveness has changed",
          "None, because if no cash moved there is no exposure",
        ],
        answer: 0,
        explain:
          "The loss exists only in the consolidated statements, which is the defining mark of translation exposure. It still matters, because covenants and investors read those statements, but it is managed differently from transaction exposure, where actual kwacha proceeds are at stake.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "quotations",
      heading: "Quotations, spreads and cross rates",
      blocks: [
        {
          type: "p",
          text: "The bank quotes you USD/ZMW 12.48 to 12.52 and you have dollars to sell. One of those two numbers is yours, and it is the lower one.",
        },
        {
          type: "p",
          text: "Banks always quote two [rates](https://corporatefinanceinstitute.com/resources/economics/exchange-rate/): the **bid**, at which they buy the currency from you, and the **ask** or offer, at which they sell it to you. On that quote the bank buys your dollars at 12.48 and sells you dollars at 12.52, and the 0.04 between them is its margin. **You always deal at whichever rate is worse for you.** That is the entire meaning of a spread.",
        },
        {
          type: "p",
          text: "Before any of the arithmetic, fix the direction. A quote of USD/ZMW 12.50 says one dollar costs 12.50 kwacha, and every rate can be stated the other way round as its reciprocal. **In this course USD/ZMW means kwacha per one dollar,** and reading it backwards is the cheapest mistake available.",
        },
        {
          type: "formula",
          text: "Cross rate (GBP/ZMW) = (GBP/USD) × (USD/ZMW)",
          where: [
            "A cross rate links two currencies through a common third, usually the dollar",
            "If GBP/USD = 1.27 and USD/ZMW = 12.50, then GBP/ZMW = 1.27 × 12.50 = 15.875",
          ],
        },
        {
          type: "p",
          text: "Cross rates matter here because kwacha pairs beyond the dollar are thin. If you invoice in rand or pounds, your price is being built out of two dollar legs whether you look at them or not, and you are paying a [[spread|The gap between the price at which a bank will buy and the price at which it will sell. It is not a fee on your statement, which is why it is the cost companies most often fail to count.]] on each.",
        },
      ],
      check: {
        question:
          "The bank quotes USD/ZMW 12.48 to 12.52. An exporter converts USD 100,000 of receipts. How many kwacha result?",
        options: [
          "ZMW 1,248,000, because the exporter sells dollars to the bank at the bid of 12.48",
          "ZMW 1,252,000, because the exporter gets the ask of 12.52",
          "ZMW 1,250,000, because deals happen at the midpoint",
          "ZMW 1,244,000, because the bank deducts the spread twice",
        ],
        answer: 0,
        explain:
          "The bank buys the exporter's dollars at its bid. The customer is always on the worse side of the spread, so sellers of dollars get the low rate and buyers pay the high one. That is exactly how the bank earns the 0.04.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "forward-rates",
      heading: "Forward rates",
      blocks: [
        {
          type: "p",
          text: "Spot is 12.50 and the six-month forward is 13.00. That is not the bank's guess about where the kwacha will be in six months. **It is arithmetic, and you can check it yourself.**",
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
