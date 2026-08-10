/* TM · Hedging the Exposure · Currency Options
 *
 * Split out of hedging-currency-risk.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of hedging-currency-risk.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "currency-options",
  label: "Currency Options",
  title: "Currency Options",
  kicker: "Hedging the Exposure",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "currency-options",
      heading: "Currency options, and choosing between the tools",
      blocks: [
        {
          type: "p",
          text: "For a fee paid up front, you can buy a rate and then decline to use it. That is the one thing a binding contract cannot do, and the fee is the whole price of it.",
        },
        {
          type: "p",
          text: "A [currency option](https://corporatefinanceinstitute.com/resources/derivatives/currency-option/) gives its buyer the right, and not the obligation, to exchange at a [[strike rate|The rate written into the option, the one you may use if you want to. Set it close to today's rate and the protection is tight and the premium high; set it further away and you are buying cheaper cover against a bigger move.]] on or before a future date. A [call](https://corporatefinanceinstitute.com/resources/derivatives/call-option/) is the right to buy the foreign currency and a [put](https://corporatefinanceinstitute.com/resources/derivatives/put-option/) is the right to sell it. **You exercise when the market went against you and walk away when it went your way.**",
        },
        {
          type: "p",
          text: "Match it to your side of the trade. Owing USD 1 million, you buy the right to obtain dollars at a fixed kwacha rate: covered if the kwacha weakens, free to buy cheaper dollars if it strengthens. Expecting dollars, you buy the right to convert them at a fixed rate, with the same one-sided logic.",
        },
        {
          type: "table",
          columns: [
            { label: "Feature" },
            { label: "Forward" },
            { label: "Futures" },
            { label: "Options" },
          ],
          rows: [
            ["Binding?", "Yes, both parties", "Yes, both parties", "No, buyer may walk away"],
            ["Customisation", "Full: any amount, any date", "Standardised sizes and dates", "Standardised sizes and dates"],
            ["Upfront cost", "None", "Margin only", "Premium"],
            ["Liquidity", "Low, no secondary market", "High, exchange traded", "Medium"],
            ["Counterparty risk", "Bilateral, higher", "Exchange guaranteed, low", "Exchange guaranteed, low"],
            ["Best use", "Exact amount and date known", "Frequent adjustment, liquid hedging", "Want protection plus upside"],
          ],
        },
        {
          type: "p",
          text: "The kwacha's own record settles the argument about whether any of this is worth your time. On a [[free float|An exchange rate the market sets rather than the central bank fixing it. Zambia has floated the kwacha since 2015, so nothing in the system promises you a rate next quarter.]] since 2015 it has run from around K8 per dollar past K25 and back towards the low teens. Copper prices, inflation and capital flows moved it, with the Bank of Zambia stepping in only occasionally. **If you hold dollar receivables or dollar debt, the question was never whether to manage this.** It is only which tool fits, operational first and financial second.",
        },
      ],
      check: {
        question:
          "An exporter wants protection against the kwacha strengthening before a USD receipt arrives, but its finance director insists on keeping the gain if the kwacha weakens instead. Which instrument fits?",
        options: [
          "A currency option, where the premium buys protection on one side and keeps the upside on the other",
          "A forward contract, since it locks the best of both outcomes",
          "Currency futures, since daily marking to market preserves the upside",
          "Nothing, because protection and upside cannot coexist",
        ],
        answer: 0,
        explain:
          "Forwards and futures are binding, so they remove the downside and the upside together. Only an option separates the two, and the premium is precisely the price of that separation. The director's requirement is the textbook case for paying it.",
      },
    },
  ],
};
