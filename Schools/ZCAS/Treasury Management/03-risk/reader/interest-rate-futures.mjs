/* TM · Hedging Instruments · Interest Rate Futures
 *
 * Split out of interest-rate-hedging-instruments.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of interest-rate-hedging-instruments.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "interest-rate-futures",
  label: "Interest Rate Futures",
  title: "Interest Rate Futures",
  kicker: "Hedging Instruments",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "futures",
      heading: "Interest rate futures",
      blocks: [
        {
          type: "p",
          text: "A futures price of 95 means an interest rate of 5%. Prices are quoted as 100 minus the rate, so **when rates go up, the price goes down,** and getting that backwards means hedging in precisely the wrong direction.",
        },
        {
          type: "p",
          text: "[Interest rate futures](https://corporatefinanceinstitute.com/resources/derivatives/futures-contract/) do an FRA's job on an exchange: standardised contracts locking a rate for a future date, liquid enough to close out whenever you want, in return for margin and fixed contract sizes. Follow the quoting convention and the direction chooses itself. **A borrower sells,** because a rate rise drops the price and buying it back cheap pays for the dearer loan. A lender buys, for the mirror reason.",
        },
        {
          type: "table",
          columns: [{ label: "June position" }, { label: "September, rates at 6%" }],
          rows: [
            [
              "ZMW 1m loan resets in 3 months; current rate 5%; fears 6%",
              "Pays 1% more on the loan: 1m × 1% × ¼ = ZMW 2,500 extra",
            ],
            [
              "Sells one futures contract at 95 (implying 5%)",
              "Contract now at 94; buys back for a 1% gain = ZMW 2,500",
            ],
            ["Net effect", "The futures gain offsets the higher loan cost, so the rate is locked at 5%"],
          ],
        },
        {
          type: "p",
          text: "It is not free even when it works perfectly. Margin has to be posted and the position is [[marked to market|Revalued at today's price at the end of every day, with the gain or loss settled in cash immediately rather than at expiry. It is why a futures hedge moves cash daily while an FRA waits.]] daily, so cash moves in and out of your account all the way to September. **You get an FRA's certainty and pay for it in liquidity rather than in a premium.**",
        },
      ],
      check: {
        question:
          "Why does a borrower hedging against rising rates sell interest rate futures rather than buy them?",
        options: [
          "Prices are quoted as 100 minus the rate, so rising rates push prices down, and a short position profits exactly when borrowing gets dearer",
          "Selling avoids the margin requirement that buyers pay",
          "Borrowers may only sell under exchange rules",
          "Buying futures locks in the old, lower rate automatically",
        ],
        answer: 0,
        explain:
          "The 100-minus-rate convention makes the price move opposite to rates. The borrower's pain, rates up, is the short seller's gain, price down, so selling creates the offset. Both sides post margin, and direction has nothing to do with it.",
      },
    },
  ],
};
