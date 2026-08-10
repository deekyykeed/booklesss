/* TM · Currency · Quotations and Cross Rates
 *
 * Split out of foreign-exchange-risk.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of foreign-exchange-risk.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "quotations-and-cross-rates",
  label: "Quotations and Cross Rates",
  title: "Quotations and Cross Rates",
  kicker: "Currency",

  sections: [
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
          text: "Banks always quote two [rates](https://corporatefinanceinstitute.com/resources/economics/exchange-rate/): the bid, at which they buy the currency from you, and the ask or offer, at which they sell it to you. On that quote the bank buys your dollars at 12.48 and sells you dollars at 12.52, and the 0.04 between them is its margin. **You always deal at whichever rate is worse for you.** That is the entire meaning of a spread.",
        },
        {
          type: "p",
          text: "Before any of the arithmetic, fix the direction. A quote of USD/ZMW 12.50 says one dollar costs 12.50 kwacha, so the dollar is the [[base currency|The currency being priced, always written first in the pair. USD/ZMW quotes the price of one US dollar, so the dollar is the base and the kwacha is what it is being priced in.]], and every rate can be stated the other way round as its reciprocal. **In this course USD/ZMW means kwacha per one dollar,** and reading it backwards is the cheapest mistake available.",
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
        {
          type: "callout",
          kind: "example",
          text: "Put both halves together on one invoice. A Lusaka importer owes GBP 250,000. Its bank quotes GBP/USD 1.24 – 1.28 and USD/ZMW 12.40 – 12.60. Work out what the payment costs in kwacha. Do it in two steps rather than one: decide which side of each quote you are on before you multiply anything, and remember there are two spreads here, not one.",
        },
      ],
      check: {
        question:
          "What does that GBP 250,000 payment cost, on quotes of GBP/USD 1.24 – 1.28 and USD/ZMW 12.40 – 12.60?",
        options: [
          "ZMW 4,032,000",
          "ZMW 3,906,000",
          "ZMW 3,937,500",
          "ZMW 3,844,000",
        ],
        answer: 0,
        explain:
          "The importer is buying, so it is on the bank's ask on both legs: it buys pounds at 1.28 dollars each and buys those dollars at 12.60 kwacha each. GBP/ZMW = 1.28 × 12.60 = 16.128, and 250,000 × 16.128 = **ZMW 4,032,000**. ZMW 3,906,000 takes the favourable side of the pound leg and the unfavourable side of the dollar leg. That is the real trap: being on the worse side once feels like enough, and the bank is on the good side of both. ZMW 3,937,500 deals at the midpoints, a rate nobody is offering. ZMW 3,844,000 uses both bids, which is the rate the importer would get if it were selling pounds rather than buying them. The ZMW 188,000 between the right answer and that one is what the two spreads actually cost.",
      },
    },
  ],
};
