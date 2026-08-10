/* TM · Hedging the Exposure · Currency Forwards and Futures
 *
 * Split out of hedging-currency-risk.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of hedging-currency-risk.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "currency-forwards-and-futures",
  label: "Currency Forwards and Futures",
  title: "Currency Forwards and Futures",
  kicker: "Hedging the Exposure",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "forwards-and-futures",
      heading: "Hedging with forwards and futures",
      blocks: [
        {
          type: "p",
          text: "A customer owes you USD 500,000 in April. Today a bank offers to buy those dollars off you at 13.00 kwacha each, whatever the rate turns out to be. Take it and you know now what April is worth: ZMW 6,500,000. You know it if the kwacha strengthens, and **you also know it if the kwacha collapses and those dollars would have fetched seven million.**",
        },
        {
          type: "p",
          text: "That is a [forward contract](https://corporatefinanceinstitute.com/resources/derivatives/forward-contract/): both parties commit to exchange a fixed amount at a set rate on a set date. It binds both ways, which is why it costs nothing up front. You are not buying a choice, you are giving one up.",
        },
        {
          type: "table",
          columns: [{ label: "Spot in 3 months" }, { label: "Unhedged, ZMW", align: "right" }, { label: "Hedged at 13.00, ZMW", align: "right" }],
          rows: [
            ["12.00 (kwacha appreciates)", "6,000,000", "6,500,000"],
            ["14.00 (kwacha depreciates)", "7,000,000", "6,500,000"],
          ],
          note: "The forward pays the same ZMW 6,500,000 in both worlds: a gain of 500,000 in the first, and a forgone gain of 500,000 in the second.",
        },
        { type: "h2", text: "The exchange-traded version" },
        {
          type: "p",
          text: "[Currency futures](https://corporatefinanceinstitute.com/resources/derivatives/futures-contract/) do the same job on an exchange, in standardised sizes, with [[margin|Cash you post with the exchange to prove you can cover a loss, topped up daily as the position moves. It is not a cost like a premium, but it is cash you cannot use for anything else while the hedge is on.]] posted and the position [[marked to market|Revalued at today's price every day, with the day's gain or loss settled in cash. It is what lets an exchange guarantee both sides, and it means a hedge that is working still moves cash in and out of your account.]] daily. In exchange for that standardisation you can close the position at any time.",
        },
        {
          type: "p",
          text: "The lecture's XYZ Ltd expects USD 2,650,000 in three months, with September futures at 9.92 against a spot of 10.11. At USD 62,500 a contract it sells 42, rounding 42.4 down.",
        },
        {
          type: "p",
          text: "Now let spot fall to 8.25. The receivable converts to only ZMW 21,862,500, which is the disaster the hedge was for. The futures gain of (9.92 − 8.25) × 42 × 62,500 = ZMW 4,383,750 brings the total back to **ZMW 26,246,250**, close to the rate it locked in June.",
        },
        {
          type: "callout",
          kind: "example",
          text: "Run the same hedge on your own numbers. A Copperbelt exporter expects USD 1,900,000 in three months, September futures are quoted at 11.60, and a contract is USD 62,500. By maturity spot has fallen to 10.40. Work out how many contracts it sells, then what the position delivers. Two decisions carry the whole answer: which way it deals, and which way it rounds.",
        },
      ],
      check: {
        question:
          "That exporter hedges USD 1,900,000 with USD 62,500 futures at 11.60, and spot falls to 10.40. What does the futures position deliver?",
        options: [
          "A gain of ZMW 2,250,000",
          "A gain of ZMW 2,280,000",
          "A gain of ZMW 2,325,000",
          "A loss of ZMW 2,250,000",
        ],
        answer: 0,
        explain:
          "1,900,000 ÷ 62,500 = 30.4 contracts, and you round DOWN to 30: over-hedging turns the spare part of a contract into a bet. So the hedge covers 30 × 62,500 = USD 1,875,000, and the gain is (11.60 − 10.40) × 1,875,000 = **ZMW 2,250,000**. The USD 25,000 tail rides unhedged, which is the price of standardisation and the standing trade-off against a forward. ZMW 2,280,000 applies the 1.20 movement to the full USD 1,900,000, hedging an amount no contract exists for. ZMW 2,325,000 rounds 30.4 up to 31. The loss is what an exporter gets for buying futures instead of selling them. An exporter is exposed to the kwacha strengthening, so its hedge must gain when the dollar buys fewer kwacha. A bought position does the opposite.",
      },
    },
  ],
};
