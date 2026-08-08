/* CF · Lesson 4 Risk management · Step 5 — Currency risk
 *
 * Source: 04_Interest_Rate_and_Currency_Risk_Management/Currency Risk and
 * Exchange Rate Risk (2025), slides 2–16. Activities 1, 2 and 3 are the
 * lecture's own at their original figures.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "currency-risk",
  label: "Currency risk",
  title: "Currency risk",
  kicker: "Risk management",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-it-is",
      heading: "Gains and losses that come from the rate, not the trade",
      blocks: [
        {
          type: "p",
          text: "Currency risk is the gain or loss that comes from a movement in exchange rates. An exchange rate is simply the price of one currency in terms of another, and like any price it moves.",
        },
        {
          type: "p",
          text: "The loss arises because time passes between agreeing a transaction and settling it. A Zambian importer who orders goods priced at $50,000 when the rate is ZMW16.50 has committed to ZMW825,000. If the rate is ZMW18.00 when the invoice falls due, the same $50,000 costs ZMW900,000 — ZMW75,000 worse, on a purchase where nothing about the goods changed.",
        },
        {
          type: "p",
          text: "Two rates are quoted for every currency pair, and the difference between them is the whole of the toolkit.",
        },
        {
          type: "ul",
          items: [
            "The spot rate applies to a transaction settled immediately.",
            "The forward rate is agreed today for delivery and settlement on a specified future date — one month forward, three months forward, and so on.",
          ],
        },
        {
          type: "p",
          text: "A forward rate is how a company locks in the price of a future currency transaction and removes the uncertainty. It is not a forecast the bank is offering; it is a price it will trade at.",
        },
        {
          type: "p",
          text: "Several things influence where rates go: the political environment, the volatility of interest rates, the difference in inflation between the two countries, market expectations, and support for the balance of payments. Two of those — interest and inflation — can be turned into arithmetic, and they are the subject of the next two sections.",
        },
      ],
      check: {
        question:
          "A Zambian exporter invoices a South African customer R800,000, payable in three months. The kwacha weakens against the rand over that period. What is the effect?",
        options: [
          "A gain — the rand receipt converts into more kwacha than it would have at the original rate",
          "A loss — a weaker kwacha means the exporter receives less",
          "No effect, because the invoice is in rand and the amount is fixed",
          "A loss, but only if the customer pays late",
        ],
        answer: 0,
        explain:
          "The rand amount is fixed; what moves is what it converts into. A weaker home currency helps an exporter and hurts an importer, because it takes more kwacha to buy a rand — which is more kwacha received on the way in and more kwacha paid on the way out.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "three-types",
      heading: "Three kinds of currency exposure",
      blocks: [
        {
          type: "p",
          text: "Currency risk shows up in three distinct forms. They are frequently confused, and telling them apart is worth marks in itself, because only one of them is really about cash.",
        },
        {
          type: "table",
          columns: [{ label: "Type" }, { label: "What it is" }, { label: "Example" }],
          rows: [
            [
              "Transaction risk",
              "The gain or loss between the date a transaction is agreed and the date it is settled",
              "An invoice in dollars payable in 90 days",
            ],
            [
              "Translation risk",
              "The gain or loss that arises on consolidating foreign assets and liabilities into the group accounts",
              "A Zambian parent restating its Tanzanian subsidiary’s balance sheet at the year-end rate",
            ],
            [
              "Economic risk",
              "The loss of value or of international competitiveness caused by adverse rate movements over time",
              "A Zambian manufacturer priced out of a regional market by a persistently strong kwacha",
            ],
          ],
        },
        {
          type: "p",
          text: "Transaction risk is the one hedging instruments address, because it is a defined amount on a defined date and can therefore be covered by a contract.",
        },
        {
          type: "p",
          text: "Translation risk is an accounting effect. It changes the reported figures without any cash moving, which is why many companies decide not to hedge it at all — spending real money to protect a book number is hard to justify.",
        },
        {
          type: "p",
          text: "Economic risk is the most serious and the least hedgeable. It is not one transaction but the long-run effect of the rate on the business’s ability to compete, and no forward contract addresses it. The answers are strategic: producing in the market you sell into, diversifying where revenue comes from, changing the cost base.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Transaction risk is about a payment. Economic risk is about whether the business still works at that exchange rate.",
        },
      ],
      check: {
        question:
          "A Zambian group consolidates a Kenyan subsidiary. The shilling weakens over the year, so the subsidiary’s net assets translate into fewer kwacha. What kind of exposure is this?",
        options: [
          "Translation risk — it arises on consolidation and no cash has moved",
          "Transaction risk — the subsidiary’s assets are worth less in kwacha",
          "Economic risk — the group’s competitiveness has been affected",
          "None — a subsidiary’s accounts are kept in its own currency",
        ],
        answer: 0,
        explain:
          "Nothing has been bought, sold or paid. The change appears only because the group accounts have to be expressed in one currency, which is exactly what translation risk is. It would become transaction risk the moment the group actually moved cash out of Kenya.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "interest-rate-parity",
      heading: "Interest rate parity",
      blocks: [
        {
          type: "p",
          text: "Interest rate parity says the difference between two countries’ interest rates is reflected in the difference between their spot and forward exchange rates. The currency with the higher interest rate trades at a forward discount, by enough to remove any advantage from moving money to earn the higher rate.",
        },
        {
          type: "formula",
          text: "Forward rate  =  spot rate  ×  (1 + quoted currency interest)ⁿ ÷ (1 + base currency interest)ⁿ",
          where: [
            "quoted currency interest = the interest rate of the quoted — variable — currency",
            "base currency interest = the interest rate of the base currency",
            "n = the period, in years",
          ],
        },
        {
          type: "p",
          text: "The spot rate for the dollar against the kwacha is ZMW12.177 per $1. Interest rates are 3% a year in New York and 15% in Lusaka. The kwacha is the quoted currency, since the rate is expressed as a number of kwacha to one dollar.",
        },
        {
          type: "table",
          columns: [{ label: "Term" }, { label: "Working" }, { label: "Forward rate ZMW/$", align: "right" }],
          rows: [
            ["6 months", "12.177 × (1.15)⁰·⁵ ÷ (1.03)⁰·⁵", "12.867"],
            ["12 months", "12.177 × 1.15 ÷ 1.03", "13.596"],
          ],
          note: "Six months is a period of 0.5 years, so the exponent is 0.5 — not the rate halved.",
        },
        {
          type: "p",
          text: "The kwacha is worth less forward than spot, and it has to be. An investor could otherwise borrow dollars at 3%, convert to kwacha, earn 15%, and convert back at an unchanged rate for a risk-free 12%. The forward rate moves to exactly the point where that trade earns nothing.",
        },
        {
          type: "p",
          text: "Note the exponent for periods of less than a year. Six months is n = 0.5, so the annual rate is raised to the power of 0.5 rather than being divided by two. The two are close but not equal, and questions are set to catch the difference.",
        },
      ],
      check: {
        question:
          "Interest rates are 12% in Zambia and 4% in the euro area. What does interest rate parity say about the forward kwacha rate against the euro?",
        options: [
          "The kwacha will trade at a forward discount — it will take more kwacha to buy a euro forward than spot",
          "The kwacha will trade at a forward premium, because the higher interest rate makes it more attractive",
          "The forward rate will equal the spot rate, since interest rates do not affect exchange rates",
          "The forward rate cannot be determined without knowing the inflation rates",
        ],
        answer: 0,
        explain:
          "The higher-interest currency always trades forward at a discount, and by precisely the interest differential — otherwise money could be borrowed cheaply in euros, invested at 12% in kwacha, and converted back at a locked-in rate for a certain profit. The forward rate exists to close that gap.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "purchasing-power-parity",
      heading: "Purchasing power parity",
      blocks: [
        {
          type: "p",
          text: "Purchasing power parity makes the same claim about inflation. The difference between two countries’ inflation rates is reflected in the movement of the exchange rate between them, so that a given sum buys roughly the same in either country over time.",
        },
        {
          type: "formula",
          text: "Forward rate  =  spot rate  ×  (1 + quoted currency inflation)ⁿ ÷ (1 + base currency inflation)ⁿ",
          where: [
            "quoted currency inflation = the inflation rate of the quoted — variable — currency",
            "base currency inflation = the inflation rate of the base currency",
            "n = the period, in years",
          ],
        },
        {
          type: "p",
          text: "Identical arithmetic to interest rate parity, with inflation rates substituted for interest rates. Which one a question wants is decided by which rates it gives you.",
        },
        {
          type: "p",
          text: "With UK inflation at 6% and US inflation at 4%, and a spot rate of $1.60 = £1, the pound is the base currency and the dollar the quoted one.",
        },
        {
          type: "formula",
          text: "1-year forward  =  1.60 × 1.04 ÷ 1.06  =  $1.5698 = £1",
        },
        {
          type: "p",
          text: "It now takes fewer dollars to buy a pound, which is the dollar strengthening — as it should, since US prices are rising more slowly than British ones.",
        },
        {
          type: "p",
          text: "Take a case closer to home. Zambian inflation at 15% against 4% in the US, with a spot rate of ZMW26.70 = $1, gives a six-month forward rate of 26.70 × (1.15)⁰·⁵ ÷ (1.04)⁰·⁵ = ZMW28.077. Over six months the kwacha loses about 5% of its value against the dollar, purely on the inflation differential.",
        },
        {
          type: "p",
          text: "Which is the check to run on any answer: the higher-inflation currency weakens. If your forecast has the kwacha strengthening against the dollar while Zambian prices rise three times as fast as American ones, the two rates have gone into the formula the wrong way round.",
        },
      ],
      check: {
        question:
          "The spot rate is ZMW17.50 = $1. Zambian inflation is 13% and US inflation is 3%. What is the one-year forward rate under purchasing power parity?",
        options: [
          "ZMW19.20 = $1",
          "ZMW15.95 = $1",
          "ZMW19.75 = $1",
          "ZMW17.50 = $1",
        ],
        answer: 0,
        explain:
          "17.50 × 1.13 ÷ 1.03 = 19.20. The kwacha is the quoted currency and it has the higher inflation, so more of them are needed to buy a dollar. ZMW15.95 comes from inverting the two inflation rates, and has the kwacha strengthening while Zambian prices rise four times as fast.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "internal-hedging",
      heading: "Hedging without a contract",
      blocks: [
        {
          type: "p",
          text: "Three techniques reduce currency exposure using nothing but the way the company arranges its own trade. They cost nothing in fees and should be considered before any instrument is bought.",
        },
        {
          type: "h2",
          text: "Home currency invoicing",
        },
        {
          type: "p",
          text: "Invoice customers in kwacha, and ask suppliers to invoice in kwacha. The exposure does not disappear — it moves to the other party, who now carries it.",
        },
        {
          type: "p",
          text: "Which is why it depends entirely on bargaining power. A large buyer can insist; a small Zambian exporter selling into a competitive regional market usually cannot, and pushing it will either lose the sale or be paid for in a worse price.",
        },
        {
          type: "h2",
          text: "Matching receipts and payments",
        },
        {
          type: "p",
          text: "A company that both earns and spends in the same foreign currency can hold an account in it and settle one against the other, converting only the net difference. A business receiving $400,000 and paying $350,000 in the same month has a real exposure of $50,000, not $750,000.",
        },
        {
          type: "p",
          text: "This is the most effective of the three, and it is available to any company with two-way flows in a currency — which describes most Zambian importers who also export.",
        },
        {
          type: "h2",
          text: "Leading and lagging",
        },
        {
          type: "p",
          text: "Leading means settling early, lagging means delaying, to take advantage of an expected rate movement. Expecting the kwacha to weaken, an importer would want to pay its dollar suppliers now rather than in three months.",
        },
        {
          type: "p",
          text: "This one is different in kind from the other two, and the difference should be stated in any answer that recommends it. Matching removes exposure. Leading and lagging keeps the exposure and takes a position on which way the rate will go — it is speculation, and it loses money exactly as often as a forecast is wrong.",
        },
      ],
      check: {
        question:
          "A Zambian company receives $600,000 and pays $480,000 in the same month. It holds a dollar account and settles one against the other. What is its exposure?",
        options: [
          "$120,000 — only the net difference has to be converted",
          "$1,080,000 — both flows are exposed to the rate",
          "$600,000 — the receipt is exposed, the payment is not",
          "Nil — holding a dollar account removes currency risk entirely",
        ],
        answer: 0,
        explain:
          "Matching leaves only the net position to convert, so the exposure falls from $1.08 million of gross flows to $120,000. It does not reach nil: the surplus still has to become kwacha at some rate, and that rate is still unknown.",
      },
    },
  ],
};
