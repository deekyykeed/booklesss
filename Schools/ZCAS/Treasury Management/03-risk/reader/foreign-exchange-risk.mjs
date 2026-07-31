/* TM · Lesson 3 Risk · Step 2 — Foreign exchange risk management
 *
 * Source: 10_Foreign Exchange Risk Management PPTX;
 *         build_tm_3_2_fx-risk.py (PDF). Worked examples kept at the lecture's
 *         figures (USD/ZMW 12.50 forward calculation; USD 500,000 forward
 *         hedge; XYZ Ltd futures hedge at 42 contracts).
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "foreign-exchange-risk",
  label: "Foreign exchange risk",
  title: "Foreign exchange risk management",
  kicker: "Risk",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "three-exposures",
      heading: "The three FX exposures",
      blocks: [
        {
          type: "p",
          text: "Foreign exchange risk arises whenever a company deals in more than one currency — cross-border sales and purchases, foreign borrowings, foreign subsidiaries. It comes in three forms, and classifying which one a scenario describes is the first mark in most exam questions.",
        },
        {
          type: "p",
          text: "Transaction exposure comes from committed foreign-currency cash flows. An export sale to a US customer with payment due in 90 days is the standard case: if the dollar weakens against the kwacha before payment, each dollar converts to fewer kwacha. It is the most immediate and the most quantifiable exposure — an amount, a currency, a date.",
        },
        {
          type: "p",
          text: "Translation exposure comes from consolidating a foreign subsidiary's accounts into the parent's currency. Restating its assets, liabilities and earnings at a new exchange rate changes reported equity and profit without a single cash flow moving — an accounting effect, but one that can still breach loan covenants written on reported numbers.",
        },
        {
          type: "p",
          text: "Economic exposure is the long-run effect of exchange rates on competitive position and future cash flows. A stronger kwacha makes Zambian exporters less price-competitive abroad, shrinking sales that were never yet contracted. It is the hardest exposure to quantify and hedge, and the most strategically important.",
        },
      ],
      check: {
        question:
          "A Zambian group's Tanzanian subsidiary made a normal profit, but consolidation at this year's weaker shilling rate cuts the group's reported equity. No cash moved. Which exposure is that?",
        options: [
          "Translation exposure — an accounting restatement effect of consolidation, not a cash flow",
          "Transaction exposure — the subsidiary's profit is a committed cash flow",
          "Economic exposure — the group's competitiveness has changed",
          "None — if no cash moved there is no exposure",
        ],
        answer: 0,
        explain:
          "The loss exists only in the consolidated statements — the defining mark of translation exposure. It still matters (covenants and investors read those statements), but it is managed differently from transaction exposure, where actual kwacha proceeds are at stake.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "quotations",
      heading: "Quotations, spreads and cross rates",
      blocks: [
        {
          type: "p",
          text: "A quote of USD/ZMW 12.50 says one dollar costs 12.50 kwacha. Every rate can be stated either way round — kwacha per dollar, or its reciprocal, dollars per kwacha — and misreading the direction is the cheapest way to lose marks, so fix the convention before touching the arithmetic: in this course, USD/ZMW means kwacha per one dollar.",
        },
        {
          type: "p",
          text: "Banks quote two rates: the bid, at which they buy the currency from you, and the ask (offer), at which they sell it to you. A quote of USD/ZMW 12.48–12.52 means the bank buys your dollars at 12.48 and sells you dollars at 12.52, and the 0.04 spread per dollar is its margin. You always deal at the rate worse for you — that is what the spread means.",
        },
        {
          type: "formula",
          text: "Cross rate (GBP/ZMW) = (GBP/USD) × (USD/ZMW)",
          where: [
            "A cross rate links two currencies through a common third — usually the dollar",
            "If GBP/USD = 1.27 and USD/ZMW = 12.50, then GBP/ZMW = 1.27 × 12.50 = 15.875",
          ],
        },
        {
          type: "p",
          text: "Cross rates matter in Zambia because kwacha pairs beyond the dollar are thin: a company invoicing in rand or pounds prices through the dollar legs whether it notices or not.",
        },
      ],
      check: {
        question:
          "The bank quotes USD/ZMW 12.48–12.52. An exporter converts USD 100,000 of receipts. How many kwacha result?",
        options: [
          "ZMW 1,248,000 — the exporter sells dollars to the bank at the bid, 12.48",
          "ZMW 1,252,000 — the exporter gets the ask, 12.52",
          "ZMW 1,250,000 — deals happen at the midpoint",
          "ZMW 1,244,000 — the bank deducts the spread twice",
        ],
        answer: 0,
        explain:
          "The bank buys the exporter's dollars at its bid. The customer is always on the worse side of the spread — sellers of dollars get the low rate, buyers pay the high one — which is exactly how the bank earns the 0.04.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "forward-rates",
      heading: "Forward rates",
      blocks: [
        {
          type: "p",
          text: "The spot rate is for delivery now (settlement in a day or two); a forward rate is agreed today for delivery at a future date. Forwards are not a forecast — they are arithmetic, derived from the spot rate and the interest differential between the two currencies.",
        },
        {
          type: "formula",
          text: "Forward = Spot × (1 + i_home) ÷ (1 + i_foreign)",
          where: [
            "i_home = the home-currency interest rate for the period",
            "i_foreign = the foreign-currency interest rate for the period",
            "Higher home rates put the home currency at a forward discount; lower at a premium",
          ],
        },
        {
          type: "p",
          text: "The lecture's example: spot USD/ZMW 12.50, dollar rates 4% a year, kwacha rates 12% a year, six-month forward. Forward = 12.50 × (1 + 0.06) ÷ (1 + 0.02) = 12.50 × 1.0392 = 13.00 kwacha per dollar.",
        },
        {
          type: "p",
          text: "The kwacha stands at a forward discount — 13.00 forward against 12.50 spot — because its interest rates are higher. The logic is arbitrage, not prediction: holding kwacha pays 12% while holding dollars pays 4%, so the forward price must compensate the dollar holder for the yield given up, or everyone would ride one side of the trade. High-interest currencies always trade at forward discounts.",
        },
      ],
      check: {
        question:
          "Kwacha interest rates are far above dollar rates. What does that imply about the USD/ZMW forward rate?",
        options: [
          "The kwacha trades at a forward discount — more kwacha per dollar forward than spot, offsetting its yield advantage",
          "The kwacha trades at a forward premium — high rates mean a strong forward",
          "Forward and spot must be equal when rates differ",
          "It implies nothing — forwards reflect the bank's currency forecast",
        ],
        answer: 0,
        explain:
          "Interest rate parity sets the forward mechanically: the currency paying more interest must be cheaper forward, or the carry trade would be riskless. The forward is a no-arbitrage price, not the bank's view of where the kwacha is heading.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "operational-hedges",
      heading: "Hedging without instruments",
      blocks: [
        {
          type: "p",
          text: "Before paying for financial hedges, treasury should shrink the exposure at its source. Five operational strategies do that, in rising order of sophistication.",
        },
        {
          type: "ul",
          items: [
            "Insist on kwacha payment — the simplest move, shifting all FX risk to the counterparty. Dominant firms can enforce it; smaller ones may lose the deal to rivals who will take dollars.",
            "Currency surcharges — invoice in kwacha with a clause adding a surcharge if the rate moves beyond a set band, sharing the risk instead of holding it.",
            "Leading and lagging — collect receivables early in currencies you expect to weaken; delay payables in them. Useful, but it is a position on the currency — speculation wearing operational clothes.",
            "Natural hedging — match currency inflows with outflows: a firm earning dollars from exports sources its inputs in dollars, so gains and losses offset without any contract. The cheapest durable hedge there is.",
            "Netting — bilaterally, two companies owing each other dollars settle only the net amount; multinationals run multilateral netting through a clearing centre, collapsing gross intercompany flows and the conversion costs on all of them.",
          ],
        },
        {
          type: "callout",
          text: "Operational hedges cost little and never expire. The financial instruments in the next sections are for the exposure that survives them.",
        },
      ],
      check: {
        question:
          "A Zambian exporter earns most of its revenue in dollars and currently buys all inputs locally in kwacha. Which operational hedge attacks its exposure most directly?",
        options: [
          "Natural hedging — source inputs in dollars so the currency's moves hit costs and revenues together",
          "Leading and lagging — collect the dollars faster",
          "Netting — offset the dollars against other subsidiaries",
          "A currency surcharge on its kwacha suppliers",
        ],
        answer: 0,
        explain:
          "The firm's whole exposure is a one-way dollar inflow. Creating a matching dollar outflow makes the exposure cancel structurally, every month, with no premium and no rollover. Leading and lagging just re-times the risk, and there are no offsetting intercompany flows here to net.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "forwards-and-futures",
      heading: "Hedging with forwards and futures",
      blocks: [
        {
          type: "p",
          text: "A forward contract commits both parties to exchange a fixed amount of currency at a set rate on a set date — binding both ways, like the FRA in the previous step, and for the same reason cheap: no premium, because you keep no choice.",
        },
        {
          type: "p",
          text: "The lecture's hedge: an exporter is due USD 500,000 in three months. Spot is 12.50, the three-month forward 13.00, and the fear is kwacha appreciation. The exporter sells USD 500,000 forward at 13.00.",
        },
        {
          type: "table",
          columns: [{ label: "Spot in 3 months" }, { label: "Unhedged, ZMW", align: "right" }, { label: "Hedged at 13.00, ZMW", align: "right" }],
          rows: [
            ["12.00 (kwacha appreciates)", "6,000,000", "6,500,000"],
            ["14.00 (kwacha depreciates)", "7,000,000", "6,500,000"],
          ],
          note: "The forward pays the same ZMW 6,500,000 in both worlds — a gain of 500,000 in the first, a forgone gain of 500,000 in the second.",
        },
        {
          type: "p",
          text: "Currency futures are the exchange-traded version: standardised contract sizes, margin posted, marked to market daily, closeable at any time. The lecture's XYZ Ltd expects USD 2,650,000 in three months, with September futures at 9.92 against a 10.11 spot. At USD 62,500 a contract it sells 42 contracts (rounding 42.4 down — futures' fixed sizes mean small unhedged tails are normal). If spot falls to 8.25, the receivable converts to only ZMW 21,862,500, but the futures gain (9.92 − 8.25) × 42 × 62,500 = ZMW 4,383,750 — total ZMW 26,246,250, close to the locked-in rate.",
        },
      ],
      check: {
        question:
          "XYZ needed to hedge USD 2,650,000 but sold exactly 42 contracts of USD 62,500. Why not hedge the full amount?",
        options: [
          "Futures come in fixed sizes — 42 contracts cover 2,625,000, and the 25,000 tail stays unhedged as the price of standardisation",
          "Exchange rules cap any hedge at 42 contracts",
          "The remaining 25,000 was hedged automatically by the margin",
          "XYZ expected the kwacha to depreciate on the remainder",
        ],
        answer: 0,
        explain:
          "2,650,000 ÷ 62,500 = 42.4, and you cannot sell four-tenths of a contract. The small residual exposure is the standing trade-off against forwards, which are custom-sized to the exact amount and date but lock you in with no liquid exit.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "currency-options",
      heading: "Currency options — and choosing between the tools",
      blocks: [
        {
          type: "p",
          text: "A currency option gives the buyer the right, not the obligation, to exchange at a strike rate on or before a future date — a call is the right to buy the foreign currency, a put the right to sell it. The buyer pays a premium up front and then keeps the choice: exercise if the market moved against them, walk away and keep the favourable market rate if it moved for them.",
        },
        {
          type: "p",
          text: "Matching the option to the exposure: an importer due to pay USD 1 million buys the right to obtain dollars at a fixed kwacha rate — protection if the kwacha weakens, freedom to buy cheaper dollars in the market if it strengthens. An exporter due to receive dollars buys the right to convert them at a fixed rate, with the same one-sided logic. The premium is what the one-sidedness costs.",
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
            ["Binding?", "Yes — both parties", "Yes — both parties", "No — buyer may walk away"],
            ["Customisation", "Full — any amount, any date", "Standardised sizes and dates", "Standardised sizes and dates"],
            ["Upfront cost", "None", "Margin only", "Premium"],
            ["Liquidity", "Low — no secondary market", "High — exchange traded", "Medium"],
            ["Counterparty risk", "Bilateral — higher", "Exchange guaranteed — low", "Exchange guaranteed — low"],
            ["Best use", "Exact amount and date known", "Frequent adjustment, liquid hedging", "Want protection plus upside"],
          ],
        },
        {
          type: "p",
          text: "The kwacha's own record is the closing argument for taking all of this seriously. A free float since 2015 has swung from around K8 per dollar past K25 and back towards the low teens, driven by copper prices, inflation and capital flows, with the Bank of Zambia intervening only occasionally. For a Zambian firm with dollar receivables or debt, the question is never whether to think about FX risk — only which of these tools, operational first and financial second, fits the exposure.",
        },
      ],
      check: {
        question:
          "An exporter wants protection against the kwacha strengthening before a USD receipt arrives, but its finance director insists on keeping the gain if the kwacha weakens instead. Which instrument fits?",
        options: [
          "A currency option — the premium buys protection on one side and keeps the upside on the other",
          "A forward contract — it locks the best of both outcomes",
          "Currency futures — daily marking to market preserves the upside",
          "Nothing — protection and upside cannot coexist",
        ],
        answer: 0,
        explain:
          "Forwards and futures are binding: they remove the downside and the upside together. Only an option separates the two, and the premium is precisely the price of that separation. The director's requirement is the textbook case for paying it.",
      },
    },
  ],
};
