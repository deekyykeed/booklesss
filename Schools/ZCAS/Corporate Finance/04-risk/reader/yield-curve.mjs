/* CF · Lesson 4 Risk management · Step 2 — The term structure of interest rates
 *
 * Source: 04_Interest_Rate_and_Currency_Risk_Management/Interest Rate Risk and
 * Hedging Methods (2025), slides 20–25. The sample term structure is the
 * lecture's own set of rates.
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "yield-curve",
  label: "The yield curve",
  title: "The term structure of interest rates",
  kicker: "Risk management",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "term-structure",
      heading: "One market, many rates",
      blocks: [
        {
          type: "p",
          text: "The term structure of interest rates is the relationship between the interest rate and the length of time money is lent for. Plot the spot rates against their maturities and the line through them is the yield curve.",
        },
        {
          type: "table",
          columns: [
            { label: "Term to maturity" },
            { label: "1 yr", align: "right" },
            { label: "2 yr", align: "right" },
            { label: "3 yr", align: "right" },
            { label: "4 yr", align: "right" },
            { label: "5 yr", align: "right" },
          ],
          rows: [["Spot rate", "8.00%", "9.00%", "9.50%", "9.75%", "9.88%"]],
          note: "Rising steeply at first and then flattening — the ordinary shape, and the one most sets of rates take.",
        },
        {
          type: "p",
          text: "There is no such thing as “the interest rate”. There is a rate for every maturity, they are different, and the pattern of the differences carries information the individual rates do not.",
        },
        {
          type: "p",
          text: "The curve matters to a company in three practical ways: it sets the cost of borrowing at each term, it is what implied forward rates are calculated from, and its shape is the market’s collective forecast of where short-term rates are going.",
        },
        {
          type: "p",
          text: "Three theories explain why the curve takes the shape it does. They are not rivals so much as three effects operating at once, and a full answer names all three.",
        },
      ],
      check: {
        question:
          "What does the yield curve plot?",
        options: [
          "The interest rate available at each term to maturity, at one point in time",
          "How one interest rate has moved over the past few years",
          "The relationship between interest rates and credit ratings",
          "The forecast of interest rates published by the central bank",
        ],
        answer: 0,
        explain:
          "It is a snapshot across maturities, not a history of one rate. Every point on the curve is a rate available today — the horizontal axis is how long the money is lent for, not the passage of time.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "expectations",
      heading: "Expectations theory",
      blocks: [
        {
          type: "p",
          text: "Expectations theory says the expected return over a given holding period is the same whatever the maturity of the security used. Lending for five years, or for one year five times over, should come to the same thing.",
        },
        {
          type: "p",
          text: "If it did not, arbitrage would close the gap. Investors would abandon the maturity offering less and crowd into the one offering more, and the prices of the two would move until the advantage disappeared. That is the same no-free-lunch argument the forward rate formulas in the last step rest on.",
        },
        {
          type: "p",
          text: "So the shape of the curve is entirely a statement about expected future short-term rates.",
        },
        {
          type: "ul",
          items: [
            "An upward-sloping curve means the market expects short-term rates to rise. Longer maturities pay more because they include the higher rates expected later.",
            "A downward-sloping curve means the market expects rates to fall — the four maturities in the last step, running 15%, 13.5%, 11.6%, 11.2%, say exactly that.",
            "A flat curve means rates are expected to stay where they are.",
          ],
        },
        {
          type: "p",
          text: "Under this theory the implied forward rate is the market’s unbiased forecast of the future spot rate: ₁f₂ of 7.51% is what the market genuinely expects the one-year rate to be in a year’s time.",
        },
      ],
      check: {
        question:
          "Under expectations theory, what does an upward-sloping yield curve mean?",
        options: [
          "The market expects short-term interest rates to rise in future",
          "Investors demand extra return for tying money up for longer",
          "There is more demand for long-term lending than for short-term",
          "Long-term borrowers are riskier than short-term borrowers",
        ],
        answer: 0,
        explain:
          "This theory allows nothing into the shape except expectations of future rates. The premium-for-waiting explanation is liquidity preference and the supply-and-demand explanation is market segmentation — both are genuine effects, but they are what the other two theories add.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "liquidity-preference",
      heading: "Liquidity preference",
      blocks: [
        {
          type: "p",
          text: "Liquidity preference says investors require a premium for holding longer-maturity investments, over and above whatever they expect rates to do. Money committed for ten years cannot be used for anything else, and the longer the commitment, the more has to be paid to obtain it.",
        },
        {
          type: "p",
          text: "The premium grows with maturity, so it pushes the curve upwards and steepens it. That gives the theory its main claim: the yield curve should normally slope upwards, and it does, most of the time, in most markets — which pure expectations theory cannot explain, since rates are not always expected to rise.",
        },
        {
          type: "p",
          text: "It also carries a warning about forward rates. If part of a long rate is a liquidity premium rather than an expectation, then an implied forward rate is a biased predictor of the future spot rate — biased upwards, by the size of the premium.",
        },
        {
          type: "callout",
          text: "An implied forward rate of 12% does not mean the market expects 12%. It means the market expects 12% less whatever premium it is charging for the wait.",
        },
        {
          type: "p",
          text: "The practical consequence for a treasurer is that long-term borrowing normally costs more than short-term borrowing even when nobody expects rates to rise. Rolling over short-term debt looks cheaper — and is, until the day it cannot be rolled over, which is what the premium is compensating the lender for.",
        },
      ],
      check: {
        question:
          "Under liquidity preference, why is an implied forward rate a biased predictor of the future spot rate?",
        options: [
          "It contains a premium for the longer commitment as well as the market’s expectation, so it sits above the expected rate",
          "It is calculated from past rates rather than from current ones",
          "Forward rates are quoted by banks and include their profit margin",
          "It assumes rates will rise, which is not always the case",
        ],
        answer: 0,
        explain:
          "The long rate the forward rate is derived from has been lifted by the liquidity premium, so the forward rate inherits it. Strip the premium out and what remains is the expectation — but the premium cannot be observed separately, which is exactly why the prediction is biased rather than merely wrong.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "market-segmentation",
      heading: "Market segmentation",
      blocks: [
        {
          type: "p",
          text: "Market segmentation, also called the preferred habitat theory, says participants have a maturity range they prefer to operate in and do not move out of it readily. Rates at each maturity are therefore set by the supply and demand within that segment rather than by any relationship across the whole curve.",
        },
        {
          type: "p",
          text: "The habitats are real and they come from the nature of the institutions.",
        },
        {
          type: "ul",
          items: [
            "A pension fund with obligations decades away is a natural lender at the long end, and has little interest in one-year paper.",
            "A commercial bank funding itself from deposits repayable on demand cannot lend for thirty years, whatever the rate.",
            "A company financing a season’s working capital wants three months and has no use for a ten-year facility.",
          ],
        },
        {
          type: "p",
          text: "Behaviour shifts with the rate cycle too. When rates are rising, borrowers try to lock in long maturities while investors want to stay short and reinvest at the better rates coming — so demand at the long end rises and supply falls, and long rates rise further. When rates are falling the pressures reverse.",
        },
        {
          type: "p",
          text: "This is the theory that explains kinks. A curve that is smooth except for a bulge at seven years is hard to reconcile with expectations or with a premium that grows steadily — but easy to explain as an imbalance in one segment, which is often exactly what a heavy government issuance programme at one maturity produces.",
        },
      ],
      check: {
        question:
          "A yield curve is smooth except for a pronounced bulge around the five-year point. Which theory explains that best?",
        options: [
          "Market segmentation — supply and demand in the five-year segment are out of balance",
          "Expectations theory — the market expects a sharp rise in rates in exactly five years",
          "Liquidity preference — the premium happens to peak at five years",
          "None of them — a kink means the rates have been calculated incorrectly",
        ],
        answer: 0,
        explain:
          "Expectations would have to produce an oddly specific forecast, and a liquidity premium that grows with maturity cannot bulge and then fall back. A localised imbalance — a wave of five-year issuance, or an institution with a five-year appetite — accounts for it without straining anything.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "reading-the-shape",
      heading: "Reading the shape",
      blocks: [
        {
          type: "p",
          text: "Three shapes, and each one is telling a treasurer something about what to do next.",
        },
        {
          type: "table",
          columns: [{ label: "Shape" }, { label: "What it suggests" }, { label: "What it implies for borrowing" }],
          rows: [
            [
              "Upward sloping — the normal curve",
              "Rates expected to rise, plus a liquidity premium",
              "Short-term borrowing is cheaper today, but rolling it over may cost more later",
            ],
            [
              "Downward sloping — inverted",
              "Rates expected to fall, often after a period of tight policy",
              "Long-term borrowing locks in a rate the market thinks is temporary; short-term borrowing may reprice downwards",
            ],
            [
              "Flat",
              "No strong expectation either way",
              "Little to choose on rate; choose the maturity that matches the asset being funded",
            ],
          ],
        },
        {
          type: "p",
          text: "The downward-sloping case is the interesting one, because it means long money is available more cheaply than short money — an unusual position, and one that is usually short-lived. The spot rates in the last step, falling from 15% to 11.2%, describe exactly that.",
        },
        {
          type: "p",
          text: "A caution to carry into any recommendation. The curve is what the market expects, and the market can be wrong — an inverted curve is a forecast, not a promise. Borrowing short on the strength of an expected fall in rates is a position, and a company that takes it should know it is taking one.",
        },
        {
          type: "p",
          text: "The safer principle is matching the maturity of the borrowing to the life of what it is funding. Fund a five-year asset with five-year money and the curve becomes a fact about the cost rather than a bet on the direction — and where a company would rather not take the rate it is offered, there are instruments designed to change it.",
        },
      ],
      check: {
        question:
          "The yield curve is inverted. A company needs to borrow for four years. What does the shape suggest?",
        options: [
          "Long-term money is currently cheaper than short-term money, but the market expects rates to fall — so fixing for four years locks in a rate that may soon look high",
          "It should borrow short-term and roll the loan over, since short-term rates are lower",
          "It should not borrow at all until the curve returns to its normal shape",
          "The shape has no bearing on a four-year borrowing decision",
        ],
        answer: 0,
        explain:
          "An inverted curve means the four-year rate sits below the one-year rate — cheaper today than short-term money. But the reason it is lower is that the market expects rates to fall, so a company that fixes for four years may find itself above the market within a year. Both facts are true at once, and the decision depends on how much certainty the company wants.",
      },
    },
  ],
};
