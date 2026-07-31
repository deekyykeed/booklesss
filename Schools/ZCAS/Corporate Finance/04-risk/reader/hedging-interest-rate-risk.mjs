/* CF · Lesson 4 Risk management · Step 4 — Hedging interest rate risk
 *
 * Source: 04_Interest_Rate_and_Currency_Risk_Management/Interest Rate Risk and
 * Hedging Methods (2025), slides 26–34. Activity 4 (MBS and the 3 v 6 FRA) is
 * the lecture's own at its original figures; the falling-rate case is the same
 * activity worked in the other direction.
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "hedging-interest-rate-risk",
  label: "Hedging interest rate risk",
  title: "Hedging interest rate risk",
  kicker: "Risk management",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "internal-hedging",
      heading: "What a company can do without buying anything",
      blocks: [
        {
          type: "p",
          text: "Before reaching for an instrument, a company can reduce its exposure by arranging its own borrowing and lending more carefully. Internal hedging costs nothing in fees and removes a good deal of the risk.",
        },
        {
          type: "h2",
          text: "Matching",
        },
        {
          type: "p",
          text: "Matching means arranging for assets and liabilities to carry the same interest basis, so that a movement in rates affects both sides equally and cancels out. A bank paying depositors a floating rate and lending to borrowers at a floating rate has matched: rates rise, it pays more and receives more, and the margin survives.",
        },
        {
          type: "p",
          text: "The exposure comes from mismatching. Lending long at a fixed rate while funding short at a floating one is precisely the position that destroys banks when rates rise.",
        },
        {
          type: "h2",
          text: "Smoothing",
        },
        {
          type: "p",
          text: "Smoothing means keeping a balance between fixed-rate and floating-rate borrowing rather than committing everything to either. A company entirely on floating rates is fully exposed to a rise; a company entirely on fixed rates pays too much when rates fall and cannot benefit from the drop.",
        },
        {
          type: "p",
          text: "Neither technique removes the risk. They reduce it, cheaply, and they are what a treasury policy should establish before any hedging instrument is considered.",
        },
        {
          type: "callout",
          text: "Matching removes the exposure by cancelling it. Smoothing accepts the exposure but limits how much of it any one movement can reach.",
        },
      ],
      check: {
        question:
          "A Zambian bank takes deposits repayable on demand at a floating rate and lends the money out on ten-year fixed-rate mortgages. What is its exposure?",
        options: [
          "Rates rising — it would pay more to depositors while its mortgage income stays fixed",
          "Rates falling — it would earn less on the mortgages while still paying depositors",
          "None — deposits and loans are both interest-bearing, so the position is matched",
          "Only credit risk, since both sides carry interest",
        ],
        answer: 0,
        explain:
          "The two sides have different interest bases, which is what a mismatch means. The cost of funding floats up with the market while the mortgage income is locked at yesterday’s rate, and the margin is squeezed from one side only.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "forward-rate-agreements",
      heading: "Forward rate agreements",
      blocks: [
        {
          type: "p",
          text: "A forward rate agreement fixes today the interest rate on borrowing or depositing that will happen in the future. It is an over-the-counter contract, so the amount, the start date and the length are tailored to what the company actually needs.",
        },
        {
          type: "p",
          text: "No money is lent under an FRA. The contract is on a notional amount, and all that changes hands at settlement is the difference between the agreed rate and the actual rate — which offsets whatever the company gains or loses on its real borrowing.",
        },
        {
          type: "p",
          text: "Two pieces of notation. Rates are quoted on a bid/offer basis, so a quote of 6.50 – 6.40 lets a company fix borrowing at 6.5% and a deposit at 6.4%; the bank takes the difference. And a “3 v 6” FRA starts in three months and runs for the three months from month 3 to month 6.",
        },
        {
          type: "p",
          text: "MBS wants to borrow ZMW8 million for three months, starting in three months’ time. The base rate is 3.5% and MBS borrows at about 1% above it. It has been offered a 3 v 6 FRA at 3.75%. Suppose the base rate is 4% when the loan is taken out, so MBS borrows at 5%.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Working" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Receipt under the FRA", "8m × (5% − 3.75%) × 3/12", "25,000"],
            ["Interest paid on the loan", "8m × 5% × 3/12", "(100,000)"],
          ],
          total: ["Net cost of the borrowing", "", "(75,000)"],
        },
        {
          type: "p",
          text: "Rates rose, so the bank pays MBS. The effective rate is 75,000 ÷ 8,000,000 × 12/3 = 3.75% — exactly the rate agreed.",
        },
        {
          type: "p",
          text: "Now run it the other way. If the base rate had fallen to 2% and MBS borrowed at 3%:",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Working" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Payment under the FRA", "8m × (3.75% − 3%) × 3/12", "(15,000)"],
            ["Interest paid on the loan", "8m × 3% × 3/12", "(60,000)"],
          ],
          total: ["Net cost of the borrowing", "", "(75,000)"],
        },
        {
          type: "p",
          text: "The same ZMW75,000 and the same effective 3.75%. That is what a hedge does — and it is also what it costs. MBS gave up the benefit of the fall along with the risk of the rise, because an FRA is an obligation on both parties, not a choice.",
        },
      ],
      check: {
        question:
          "A company fixes a borrowing rate of 6% with an FRA. Rates then fall and it can borrow at 4.5%. What happens?",
        options: [
          "It pays the bank the 1.5% difference, so its effective cost stays at 6%",
          "It borrows at 4.5% and lets the FRA lapse, since rates moved in its favour",
          "It receives 1.5% from the bank, because the FRA protects it against rate movements",
          "Nothing happens until the loan is repaid",
        ],
        answer: 0,
        explain:
          "An FRA binds both sides. Fixing at 6% means 6% whichever way rates go, so a fall costs the company the difference. Being able to walk away from an unfavourable outcome is what an option gives, and an FRA is not one.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "interest-rate-guarantees",
      heading: "Interest rate guarantees",
      blocks: [
        {
          type: "p",
          text: "An interest rate guarantee fixes a future borrowing or deposit rate in the same way an FRA does, with one difference that changes everything: it gives the holder the right but not the obligation to use it.",
        },
        {
          type: "p",
          text: "So the company is protected when rates move against it and free to abandon the contract when they move in its favour. Take a guarantee at 6% and borrow at 4.5% when the day comes: the contract is simply not exercised, and the company borrows at 4.5%.",
        },
        {
          type: "p",
          text: "That is not free. A premium is paid up front to the writer of the guarantee, who is accepting all of the downside and none of the upside. An IRG is an option on an interest rate, and the premium is its price.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Forward rate agreement" }, { label: "Interest rate guarantee" }],
          rows: [
            ["Obligation", "Both parties are bound", "The holder chooses whether to exercise"],
            ["Cost", "No premium", "A premium, paid up front, whether or not it is used"],
            ["If rates move against you", "Protected", "Protected"],
            ["If rates move in your favour", "You give up the benefit", "You keep the benefit, less the premium"],
          ],
        },
        {
          type: "p",
          text: "The choice between them is the choice between certainty and flexibility. An FRA gives a known rate at no cost. An IRG gives a worst case with the upside preserved, at a cost that is incurred whatever happens — which makes it worth having when a company genuinely cannot bear the downside, or when rates are volatile enough that the upside is worth paying for.",
        },
      ],
      check: {
        question:
          "A company pays a premium for an interest rate guarantee fixing its borrowing at 8%. Rates fall and it can borrow at 6%. What is its position?",
        options: [
          "It borrows at 6% and lets the guarantee lapse, but it does not get the premium back",
          "It borrows at 8%, because that is the rate the guarantee fixed",
          "It borrows at 6% and the premium is refunded, since the guarantee was not used",
          "It receives the 2% difference from the writer of the guarantee",
        ],
        answer: 0,
        explain:
          "The right not to exercise is exactly what the premium bought, so the company takes the better market rate. The premium is gone either way — that is the price of having had the protection available, and it is what makes an IRG dearer than an FRA when rates move favourably.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "interest-rate-futures",
      heading: "Interest rate futures",
      blocks: [
        {
          type: "p",
          text: "An interest rate future does the same job as an FRA — fixing a future rate — but it is an exchange-traded contract rather than a private one. The terms are standardised: fixed contract sizes, fixed settlement dates, a defined underlying instrument.",
        },
        {
          type: "p",
          text: "The hedge works by taking a position that gains when the company’s real borrowing cost rises. Rates go up, the futures position produces a gain, and the gain offsets the extra interest on the debt. Rates go down and the futures position loses, offsetting the saving — the same two-sided outcome an FRA produces.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Futures" }, { label: "Forward rate agreement" }],
          rows: [
            ["Traded", "On an exchange", "Over the counter, bank to company"],
            ["Terms", "Standardised amounts and dates", "Tailored to the company’s need"],
            ["Counterparty risk", "Minimal — the exchange stands behind it", "The bank could default"],
            ["Quality of hedge", "Imperfect, because amounts and dates rarely match exactly", "Can be exact"],
            ["Cost", "Lower dealing costs, but margin must be posted", "Built into the rate quoted"],
          ],
        },
        {
          type: "p",
          text: "The standardisation is both the advantage and the limitation. It gives liquidity, transparent pricing and a counterparty that will not fail — and it means a company needing to hedge ZMW8 million for 97 days has to settle for the nearest whole number of contracts and the nearest settlement date. The part of the exposure that does not fit is left uncovered, which is called basis risk.",
        },
        {
          type: "p",
          text: "Futures also demand cash before anything has gone wrong. An initial margin is deposited when the position is opened, and it is topped up daily as the position is marked to market — so a hedge that will eventually pay off can consume cash in the meantime, which a treasury has to be ready for.",
        },
      ],
      check: {
        question:
          "Why is a futures hedge usually imperfect where an FRA can be exact?",
        options: [
          "Futures contracts come in standard sizes and settlement dates, so they rarely match the exposure precisely",
          "Futures are only available in foreign currencies",
          "Futures can be closed out early, which cancels the hedge",
          "Futures do not protect against a rise in interest rates",
        ],
        answer: 0,
        explain:
          "Standardisation is what makes futures liquid and cheap, and it is also what leaves a residue. An exposure of ZMW8 million over 97 days has to be covered by whole contracts of a fixed size expiring on a fixed date, and the mismatch left over is basis risk. An FRA is written to the exposure.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "interest-rate-swaps",
      heading: "Interest rate swaps",
      blocks: [
        {
          type: "p",
          text: "An interest rate swap is an exchange between two parties of interest obligations in the same currency, on an agreed notional principal, for an agreed period. One pays fixed and receives floating; the other does the reverse.",
        },
        {
          type: "p",
          text: "The principal is notional. It is never exchanged — it exists only to calculate the interest amounts, and in practice only the net difference changes hands on each payment date.",
        },
        {
          type: "p",
          text: "What a swap changes is the character of debt the company already has. A company with a floating-rate loan that wants certainty can swap into fixed without renegotiating the loan or paying it off; a company locked into fixed-rate borrowing that expects rates to fall can swap into floating.",
        },
        {
          type: "p",
          text: "That flexibility is the point. Renegotiating a facility with the bank is slow, may carry early repayment penalties, and may not be possible at all. A swap sits alongside the existing debt and converts it.",
        },
        {
          type: "p",
          text: "Swaps run for years, where FRAs and futures cover months — which makes them the instrument for a company’s underlying funding profile rather than for one exposure. It also means a much longer exposure to the counterparty, so a swap is normally arranged with a bank rather than directly with another company.",
        },
        {
          type: "p",
          text: "Set the four instruments against each other and the pattern is clear enough to state in a sentence: an FRA fixes one short exposure exactly, futures fix it approximately but cheaply and safely, a guarantee fixes the worst case while keeping the upside for a premium, and a swap changes the shape of the debt itself for years at a time.",
        },
      ],
      check: {
        question:
          "A company has ZMW50 million of floating-rate debt and wants the certainty of a fixed rate for the next five years without repaying the loan. What fits?",
        options: [
          "An interest rate swap, receiving floating and paying fixed",
          "A 3 v 6 forward rate agreement",
          "An interest rate guarantee at the current floating rate",
          "Interest rate futures rolled over each quarter",
        ],
        answer: 0,
        explain:
          "The swap’s floating receipts offset the interest on the loan, leaving the company paying fixed — for five years, on debt it keeps. An FRA covers three months, futures would have to be rolled twenty times with basis risk each time, and a guarantee sets a ceiling rather than a fixed rate.",
      },
    },
  ],
};
