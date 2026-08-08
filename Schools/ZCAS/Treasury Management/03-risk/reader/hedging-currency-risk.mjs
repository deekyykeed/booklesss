/* TM · Lesson 3 Risk · Step 2b — Hedging currency risk
 *
 * Source: 10_Foreign Exchange Risk Management PPTX;
 *         build_tm_3_2_fx-risk.py (PDF). Worked figures kept at the lecture's
 *         originals (USD 500,000 forward hedge at 13.00; XYZ Ltd futures hedge
 *         at 42 contracts).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `foreign-exchange-risk`, which was one
 * six-section step. That part is the risk and the price of a currency; this
 * part is what you do about it. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. Every opening was re-read cold, and the
 * forward-hedge section had to be rebuilt: it opened "Sell USD 500,000 forward
 * at 13.00…", which leans on a rate derived in the other half. The exposure and
 * the bank's offer are now stated in the sentence itself, so the section stands
 * on its own for a reader who arrived from the sidebar or a shared link.
 *
 * The original §5 opening also read "…like the FRA in the previous step", a
 * pointer across a step boundary. It is gone, and the comparison between
 * binding and optional cover is made inside this step.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). §2 worked the XYZ futures
 * hedge to the kwacha and then asked WHY the tail was left unhedged, so the
 * contract arithmetic was demonstrated and never required. It now hands over a
 * second hedge; the check turns on the two decisions that actually carry it,
 * which way you deal and which way you round. The loss option is not a
 * nonsense number: it is what an exporter gets for buying futures instead of
 * selling them, and it is the same magnitude, so only the reasoning separates
 * them. The standardisation insight the old check tested is kept in the explain.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Hedging currency risk'.
 * The old name was sentence case and did not name the topic the way the paper does. The slug is
 * untouched, so no URL moved.
 */

export default {
  slug: "hedging-currency-risk",
  label: "Hedging Foreign Exchange Risk",
  title: "Hedging Foreign Exchange Risk",
  kicker: "Risk",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "operational-hedges",
      heading: "Hedging without instruments",
      blocks: [
        {
          type: "p",
          text: "The cheapest protection you will ever run costs nothing, needs no bank and never expires: **buy your inputs in the currency your customers pay you in.** Five operational moves shrink a currency exposure before you pay anyone to cover it, in rising order of sophistication.",
        },
        {
          type: "ul",
          items: [
            "Insist on kwacha payment. The simplest move, and it shifts all the risk to the other side. A dominant firm can enforce it. A smaller one loses the deal to a rival who will take dollars.",
            "Currency surcharges. Invoice in kwacha with a clause adding a surcharge if the rate moves beyond an agreed band, so the risk is shared rather than held.",
            "Leading and lagging. Collect receivables early in currencies you expect to weaken and delay payables in them. Useful, and be honest about what it is: a position on the currency, wearing operational clothes.",
            "Natural hedging. Match currency inflows with outflows, so a firm earning dollars from exports sources its inputs in dollars and the two move together. The cheapest durable [hedge](https://corporatefinanceinstitute.com/resources/derivatives/hedging/) there is.",
            "Netting. Two companies owing each other dollars [settle only the difference](https://corporatefinanceinstitute.com/resources/economics/netting/). Groups run [multilateral netting](https://treasurytoday.com/cash-management/netting/) through one centre, collapsing intercompany flows and the conversion cost on every one of them.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          text: "Operational hedges cost little and never expire. **The instruments in the next sections are for the exposure that survives them,** not a substitute for doing this first.",
        },
      ],
      check: {
        question:
          "A Zambian exporter earns most of its revenue in dollars and currently buys all inputs locally in kwacha. Which operational hedge attacks its exposure most directly?",
        options: [
          "Natural hedging, so sourcing inputs in dollars makes the currency's moves hit costs and revenues together",
          "Leading and lagging, to collect the dollars faster",
          "Netting, to offset the dollars against other subsidiaries",
          "A currency surcharge on its kwacha suppliers",
        ],
        answer: 0,
        explain:
          "The firm's whole exposure is a one-way dollar inflow. Creating a matching dollar outflow makes it cancel structurally, every month, with no premium and no rollover. Leading and lagging only re-times the risk, and there are no offsetting intercompany flows here to net.",
      },
    },

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
