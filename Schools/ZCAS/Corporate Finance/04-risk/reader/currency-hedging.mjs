/* CF · Lesson 4 Risk management · Step 6 — Hedging currency risk
 *
 * Source: 04_Interest_Rate_and_Currency_Risk_Management/Currency Risk and
 * Exchange Rate Risk (2025), slides 17–38, and Forward and Money Market
 * Hedging (2023). MBA Co and HT Co are the lectures' own activities at their
 * original figures — HT Co is a UK company in the source and is kept that way
 * so the step and the slide can be read side by side. The payable worked
 * example is written in kwacha, since the lectures only work a receivable.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "currency-hedging",
  label: "Hedging currency risk",
  title: "Hedging currency risk",
  kicker: "Risk management",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "forward-contracts",
      heading: "Forward contracts",
      blocks: [
        {
          type: "p",
          text: "A forward contract fixes today the exchange rate at which a future currency transaction will take place. It is over the counter, so the parties specify the amount, the currency and the maturity date to suit themselves — which means the hedge can cover the exposure exactly.",
        },
        {
          type: "p",
          text: "MBA Co is a Zambian company expecting to receive €500,000 in six months. Rates are quoted against the dollar rather than directly, so the conversion goes through it.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "€ per $1", align: "right" }, { label: "ZMW per $1", align: "right" }],
          rows: [
            ["Spot", "2.000", "21.502"],
            ["Six months forward", "1.990", "21.145"],
            ["One year forward", "1.981", "20.853"],
          ],
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Euros receivable", "", "€500,000"],
            ["Dollar equivalent", "€500,000 ÷ 1.990", "$251,256"],
          ],
          total: ["Kwacha received", "$251,256 × 21.145", "ZMW5,312,814"],
        },
        {
          type: "p",
          text: "Both legs use the six-month forward rate, because the whole transaction settles in six months. Mixing a spot rate into one leg and a forward into the other is the usual error in a cross-rate question.",
        },
        {
          type: "table",
          columns: [{ label: "Forward contracts" }, { label: "" }],
          rows: [
            ["Eliminate the downside", "The future rate is fixed, so the kwacha amount is known today"],
            ["Flexible in amount", "Tailored to the exposure, so a perfect hedge is possible"],
            ["Legally binding", "Not tradable, and it cannot be walked away from"],
            ["Carry default risk", "The counterparty could fail — check its financial soundness"],
            ["Give up the upside", "A favourable rate movement benefits the company not at all"],
          ],
        },
        {
          type: "p",
          text: "The last two lines are the price of certainty. A forward contract does not get the best rate; it gets a known rate, which is a different objective and usually the right one for a company whose business is not currency trading.",
        },
      ],
      check: {
        question:
          "MBA Co fixes ZMW5,312,814 with a forward contract. Six months later the kwacha has weakened sharply and the €500,000 would have converted to ZMW6.1 million at spot. What is MBA’s position?",
        options: [
          "It receives ZMW5,312,814 as agreed — the contract is binding and the gain goes to the counterparty",
          "It receives ZMW6.1 million, since the forward rate is a minimum",
          "It can cancel the contract and convert at spot, paying a small fee",
          "It receives ZMW5,312,814 plus the difference, because a forward protects against adverse movements only",
        ],
        answer: 0,
        explain:
          "A forward binds both sides. MBA gave up the upside when it removed the downside, and that is exactly the trade a forward makes. Keeping the upside requires an option, which costs a premium.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "money-market-hedging",
      heading: "Money market hedging",
      blocks: [
        {
          type: "p",
          text: "A money market hedge removes exchange rate uncertainty by making the exchange today, at the spot rate, instead of in the future. It uses borrowing and depositing to move the cash to the right currency now, and then holds it until the transaction settles.",
        },
        {
          type: "p",
          text: "The principle is the same in both directions: create a position in the foreign currency that offsets the one the trade has created. Which way round depends on whether the company owes or is owed.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Foreign currency payable" }, { label: "Foreign currency receivable" }],
          rows: [
            ["Create", "An asset — deposit foreign currency now", "A liability — borrow foreign currency now"],
            ["So that", "The deposit matures to exactly the amount owed", "The receipt exactly repays the loan"],
            ["Home currency is", "Borrowed to fund the deposit", "Deposited until the loan falls due"],
          ],
        },
        {
          type: "p",
          text: "For a payable, four steps. Deposit the present value of the amount owed, converting at spot, funded by borrowing at home.",
        },
        {
          type: "formula",
          text: "Amount to deposit  =  foreign currency payable ÷ (1 + foreign interest rate)",
          where: [
            "foreign interest rate = the deposit rate in the foreign currency, for the period of the exposure",
          ],
        },
        {
          type: "p",
          text: "A Zambian importer owes $200,000 in six months. Spot is ZMW16.50 – ZMW16.60 per dollar, the US deposit rate is 4% a year and the company borrows kwacha at 18% a year.",
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Deposit now, in dollars", "$200,000 ÷ 1.02", "$196,078"],
            ["Buy those dollars at spot", "$196,078 × 16.60", "ZMW3,254,895"],
            ["Borrow that in kwacha for six months", "18% a year = 9% for six months", ""],
          ],
          total: ["Kwacha cost in six months", "ZMW3,254,895 × 1.09", "ZMW3,547,836"],
        },
        {
          type: "p",
          text: "The dollar deposit grows to exactly $200,000 and pays the supplier. The company knows today that the transaction will cost it ZMW3,547,836, whatever the rate does.",
        },
        {
          type: "p",
          text: "For a receivable the whole thing runs backwards: borrow the present value of what is owed to you, convert it at spot, deposit the home currency, and let the customer’s payment clear the foreign loan.",
        },
        {
          type: "formula",
          text: "Amount to borrow  =  foreign currency receivable ÷ (1 + foreign interest rate)",
          where: [
            "foreign interest rate = the borrowing rate in the foreign currency, for the period of the exposure",
          ],
        },
        {
          type: "p",
          text: "Two details that decide whether the answer is right. Annual rates are pro-rated to the period — six months at 18% is 9%, treated as simple interest. And which side of the quoted spread applies depends on which way the currency is being traded: a company buying dollars pays the bank’s selling rate, a company selling dollars gets its buying rate. The bank is on the better side of both.",
        },
      ],
      check: {
        question:
          "A Zambian company expects to receive $500,000 in three months. Under a money market hedge, what does it do first?",
        options: [
          "Borrow the present value of $500,000 in dollars, then convert it to kwacha at spot",
          "Deposit the present value of $500,000 in dollars",
          "Borrow ZMW at the Zambian rate and deposit it for three months",
          "Wait three months and convert the receipt at whatever the spot rate is",
        ],
        answer: 0,
        explain:
          "A receivable is an asset in a foreign currency, so the hedge creates a matching liability in that currency — a dollar loan. Converting it at today’s spot rate is what fixes the exchange rate; the customer’s payment then repays the loan and the currency never has to be converted at an unknown rate.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "comparing",
      heading: "Comparing the hedges",
      blocks: [
        {
          type: "p",
          text: "Both hedges remove the uncertainty, and they rarely produce the same number. The only way to know which is better is to work both out.",
        },
        {
          type: "p",
          text: "HT Co, a UK company, is negotiating a sale worth $1.4 million on six months’ credit. Spot is $1.8960 – $1.8970 = £1 and the six-month forward is $1.8840 – $1.8860 = £1. UK borrowing is 4% a year and deposits earn 3%; in the US the figures are 8% and 6%.",
        },
        {
          type: "table",
          columns: [{ label: "Money market hedge" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Borrow in dollars now", "$1,400,000 ÷ 1.04", "$1,346,154"],
            ["Convert at spot", "$1,346,154 ÷ 1.8970", "£709,622"],
            ["Deposit the sterling", "£709,622 × 1.015", ""],
          ],
          total: ["Received in six months", "", "£720,267"],
          note: "US borrowing at 8% a year is 4% over six months; UK deposits at 3% a year are 1.5%.",
        },
        {
          type: "table",
          columns: [{ label: "Forward contract" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [["Convert at the six-month forward rate", "$1,400,000 ÷ 1.8860", ""]],
          total: ["Received in six months", "", "£742,312"],
        },
        {
          type: "p",
          text: "The forward contract is worth £22,045 more, and it is one line of arithmetic against three. Both fix the receipt today, so HT should take the forward.",
        },
        {
          type: "p",
          text: "Now the third option, which is to do nothing. If the rate moves to $1.8870 – $1.8900 = £1 by settlement, the unhedged receipt is $1,400,000 ÷ 1.8900 = £740,741.",
        },
        {
          type: "table",
          columns: [{ label: "Strategy" }, { label: "Sterling received", align: "right" }, { label: "Certain?" }],
          rows: [
            ["Forward contract", "£742,312", "Yes — known today"],
            ["No hedge, rate moves to 1.8900", "£740,741", "No — this is one outcome of many"],
            ["Money market hedge", "£720,267", "Yes — known today"],
          ],
        },
        {
          type: "p",
          text: "The forward still wins, which will not always be true — but notice that it beats the assumed unhedged outcome as well. Where a hedge is both certain and better than the expected outcome of not hedging, the decision needs no argument about risk appetite at all.",
        },
        {
          type: "p",
          text: "Why is the money market hedge so much worse here? Because HT borrows dollars at 8% and deposits sterling at 3%, losing five points on the round trip. The money market hedge tends to win when the interest rates work the other way, and where interest rate parity holds exactly the two hedges give the same answer — the gap between them is the gap between market rates and parity.",
        },
        {
          type: "callout",
          kind: "exam",
          text: "Work both hedges and compare. Then say which you would take and why, rather than presenting two numbers and stopping.",
        },
      ],
      check: {
        question:
          "HT Co’s forward contract gives £742,312 and its money market hedge gives £720,267. What explains the difference?",
        options: [
          "HT borrows dollars at 8% and deposits sterling at 3%, so the money market route loses on the interest differential",
          "The forward rate is more favourable than the spot rate, so any forward hedge will win",
          "The money market hedge takes six months longer to complete",
          "The money market hedge has not accounted for the sterling deposit interest",
        ],
        answer: 0,
        explain:
          "A money market hedge is a borrow-and-deposit round trip, so the two rates involved decide whether it is competitive. Paying 8% to borrow while earning 3% to deposit costs HT five points, and that is very nearly the whole of the £22,045 gap.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "futures",
      heading: "Currency futures",
      blocks: [
        {
          type: "p",
          text: "A currency future is an exchange-traded contract fixing the rate at which a currency will be traded on a future date. It does the same job as a forward, standardised — fixed contract sizes, fixed currencies, fixed settlement dates.",
        },
        {
          type: "p",
          text: "Because they are exchange traded, futures require an initial margin when the position is opened and are marked to market daily: gains and losses are settled every day rather than accumulating to maturity.",
        },
        {
          type: "p",
          text: "Most positions are never delivered. A contract is closed out by entering an equal and opposite one, and delivery of the actual currency is the rare case. That ability to close out cheaply at any time is what makes futures attractive, and it is also what makes them demand active management.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Merits" }, { label: "Demerits" }],
          rows: [
            ["Cost", "Lower dealing costs than other hedging methods", "Margin has to be funded, and topped up daily"],
            ["Pricing", "Transparent, because the contracts are tradable", ""],
            ["Fit", "", "Cannot be tailored — standard sizes and dates leave part of the exposure uncovered"],
            ["Coverage", "", "Limited to the currencies the exchange lists"],
          ],
        },
        {
          type: "p",
          text: "That last row matters in this market. Futures exist in the major currency pairs; a Zambian company hedging a kwacha exposure will not find a liquid futures contract for it, and is realistically choosing between a forward and a money market hedge arranged with its bank.",
        },
        {
          type: "p",
          text: "The overall effect of a futures hedge is the same as a forward’s: a gain on the futures position offsets a loss on the underlying transaction, and a loss on the futures offsets a gain on the transaction. The company ends up near the rate it locked in, less whatever the standardisation left uncovered.",
        },
      ],
      check: {
        question:
          "A company needs to hedge $470,000 for 100 days. Currency futures come in $125,000 contracts settling at the end of each quarter. What is the difficulty?",
        options: [
          "Neither the amount nor the date matches, so part of the exposure is left uncovered — basis risk",
          "Futures cannot be used to hedge amounts above $250,000",
          "The company would have to take delivery of the currency at settlement",
          "Futures only protect against a currency weakening, not strengthening",
        ],
        answer: 0,
        explain:
          "Three contracts cover $375,000 and four cover $500,000 — neither is $470,000 — and the settlement date will not be day 100. Standardisation is what gives futures their liquidity and low cost, and the residue it leaves is the price of that.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "options",
      heading: "Currency options",
      blocks: [
        {
          type: "p",
          text: "An option gives its holder the right, but not the obligation, to buy or sell a currency at a predetermined price on or before a future date. That asymmetry is the whole of what distinguishes it from everything else in this step.",
        },
        {
          type: "ul",
          items: [
            "A call option is an option to buy the underlying currency.",
            "A put option is an option to sell it.",
          ],
        },
        {
          type: "p",
          text: "The holder exercises when the contract price is better than the market — the option is in the money — and lets it lapse when the market is better, which is out of the money. At the money is the case where the two are equal.",
        },
        {
          type: "p",
          text: "The price of an option is the premium, paid up front to the writer who is selling the flexibility. The flexibility belongs entirely to the holder: the writer has an obligation and no choice, which is what they are being paid for.",
        },
        {
          type: "table",
          columns: [{ label: "Distinction" }, { label: "" }],
          rows: [
            ["European option", "Can only be exercised at expiry"],
            ["American option", "Can be exercised at any time up to expiry"],
            ["Covered call", "A call written by someone who owns the underlying asset"],
            ["Naked call", "A call written by someone who does not — unlimited exposure if the price moves against them"],
          ],
        },
        {
          type: "p",
          text: "Options are the expensive way to hedge, and they buy something the other methods cannot. A company that both needs protection against an adverse movement and wants the benefit of a favourable one has no alternative — a forward gives certainty and gives up the upside, and a money market hedge does the same.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Merits" }, { label: "Demerits" }],
          rows: [
            ["Outcome", "Downside covered, upside kept", "The premium is lost whichever way the rate moves"],
            ["Availability", "Over-the-counter options can be tailored and arranged for longer periods", "Traded options are not available in every currency"],
            ["Pricing", "Traded options give price transparency, regulation and liquidity", "The premium rises with expected volatility — dearest exactly when most wanted"],
          ],
        },
        {
          type: "p",
          text: "That last point is worth carrying into any recommendation. Option premiums are driven by expected volatility, so a currency that is swinging violently — the situation in which a treasurer most wants an option — is the situation in which the option costs most. The choice between a forward and an option is finally a question of whether the upside being preserved is worth what is being paid for it.",
        },
      ],
      check: {
        question:
          "A Zambian importer buys a call option to purchase dollars at ZMW17.50, paying a premium. At settlement the spot rate is ZMW16.80. What does it do?",
        options: [
          "Let the option lapse and buy dollars at ZMW16.80 — the premium is lost either way",
          "Exercise the option at ZMW17.50, since that is the rate it contracted for",
          "Exercise the option and claim back the ZMW0.70 difference",
          "Sell the option back to the writer to recover the premium",
        ],
        answer: 0,
        explain:
          "The option is out of the money — buying at ZMW16.80 in the market beats exercising at ZMW17.50 — so the right not to exercise is used. The premium was spent when the option was bought and is not recoverable, which is what the protection cost.",
      },
    },
  ],
};
