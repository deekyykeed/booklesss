/* TM · Lesson 3 Risk · Step 1 — Interest rate risk management
 *
 * Source: 09_Interest Rate Risk Management PPTX + MPC statements;
 *         build_tm_3_1_interest-rate-risk.py (PDF). Zambia Sugar / Lafarge swap
 *         kept at the lecture's figures. The PDF's cap-vs-FRA table used
 *         inconsistent interest totals; the comparison here recomputes cleanly
 *         on the same 6-month, ZMW 1m loan (FRA 7.5%; cap 7.5% strike,
 *         ZMW 1,500 premium).
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "interest-rate-risk-management",
  label: "Interest rate risk",
  title: "Interest rate risk management",
  kicker: "Risk",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-it-is",
      heading: "What interest rate risk is",
      blocks: [
        {
          type: "p",
          text: "Interest rate risk is the potential loss in a firm's profitability and market value from unexpected changes in interest rates. Borrow at a floating rate pegged to the Bank of Zambia policy rate and a rise in that rate increases your borrowing cost directly; hold fixed-rate bonds and a rise in rates cuts their market value. Every company with floating debt or fixed-income investments carries the exposure.",
        },
        {
          type: "ul",
          items: [
            "Repricing risk — assets and liabilities reprice on different dates: a 5-year loan funding a 3-year investment leaves a gap after year three.",
            "Basis risk — the reference rates on assets and liabilities move differently: a loan on LIBOR + 2% funding an asset priced off prime.",
            "Yield curve risk — changes in the shape of the term structure hit firms differently depending on whether they borrow long or short.",
            "Options risk — embedded call or put features create asymmetry: borrowers refinance when rates fall, lenders can't capture the upside when they rise.",
          ],
        },
        {
          type: "p",
          text: "In Zambia the exposure runs through the Monetary Policy Committee. Corporate borrowing tracks the policy rate with a spread — prime lending typically sits 3–5% above it — so an MPC rise cascades quickly to floating-rate borrowers and new fixed-rate loans. Treasury's job is to watch MPC statements and forward guidance, then decide: hedge, or carry the risk.",
        },
      ],
      check: {
        question:
          "A firm's loan is priced off LIBOR while the deposit income funding it is priced off the local prime rate. Which type of interest rate risk is that?",
        options: [
          "Basis risk — the two sides reference rates that can move differently",
          "Repricing risk — the loan and deposit mature on different dates",
          "Yield curve risk — the term structure has changed shape",
          "Options risk — the loan must contain an embedded option",
        ],
        answer: 0,
        explain:
          "Both sides may float and even reprice on the same day, yet the firm is still exposed if LIBOR and prime diverge. That divergence between reference rates is basis risk — distinct from mismatched dates (repricing) or curve-shape changes.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "measuring",
      heading: "Measuring the exposure",
      blocks: [
        {
          type: "p",
          text: "Treasury cannot manage what it cannot measure, and three tools quantify rate sensitivity. Gap analysis groups assets and liabilities by their repricing dates: the gap in any time bucket is rate-sensitive assets minus rate-sensitive liabilities.",
        },
        {
          type: "formula",
          text: "Gap = RSA − RSL",
          where: [
            "RSA = rate-sensitive assets repricing in the period",
            "RSL = rate-sensitive liabilities repricing in the period",
          ],
        },
        {
          type: "p",
          text: "A positive gap means more assets than liabilities reprice — rising rates lift net interest income. A negative gap means the opposite — rising rates cut it. The sign of the gap is what tells treasury whether to hedge and in which direction.",
        },
        {
          type: "formula",
          text: "Price change (%) ≈ −Duration × yield change (%)",
          where: [
            "Duration = the weighted-average time, in years, to receive a bond's cash flows",
            "A 5-year-duration bond loses roughly 5% of value if yields rise 1% (100 basis points)",
          ],
        },
        {
          type: "p",
          text: "Duration is the sensitivity measure for fixed-income holdings; basis point value (BPV) translates it into money — the impact of a 0.01% rate move. On ZMW 1 million notional over six months, one basis point is 1,000,000 × 0.0001 × 0.5 = ZMW 50 a year. Small per point, which is exactly why exposures are quoted this way: multiply by the basis points you fear and the number becomes a decision.",
        },
      ],
      check: {
        question:
          "A bank's one-year bucket shows a negative gap: more liabilities than assets reprice this year. Rates then rise 2%. What happens?",
        options: [
          "Net interest income falls — the repricing liabilities get more expensive faster than the assets earn more",
          "Net interest income rises — rising rates always help banks",
          "Nothing — gaps only matter when rates fall",
          "The gap turns positive automatically",
        ],
        answer: 0,
        explain:
          "A negative gap means the cost side reprices first. When rates rise, the bank pays the new rates on more liabilities than it earns them on assets, squeezing net interest income — which is why a negative-gap bank fearing rate rises hedges, or shortens its asset book.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "fras",
      heading: "Forward rate agreements",
      blocks: [
        {
          type: "p",
          text: "A forward rate agreement (FRA) is an over-the-counter contract that locks in today an interest rate for a loan or deposit starting at a future date. No principal moves — only the difference between the agreed rate and the market rate is settled in cash.",
        },
        {
          type: "p",
          text: "The lecture's setting: it is March, a company's ZMW 1 million loan resets in six months, and the treasurer fears a rise. Six-month money costs 7% today; a dealer quotes 7.5% for six-month money starting in six months. The company buys the FRA at 7.5%.",
        },
        {
          type: "table",
          columns: [{ label: "Outcome" }, { label: "Loan cost" }, { label: "FRA settlement" }, { label: "Net rate", align: "right" }],
          rows: [
            [
              "Rates rise to 8%",
              "Pays 8% to the market",
              "Receives (8.0% − 7.5%) × 1m × ½ = ZMW 2,500",
              "7.5%",
            ],
            [
              "Rates fall to 6%",
              "Pays 6% to the market",
              "Pays (7.5% − 6.0%) × 1m × ½ = ZMW 7,500",
              "7.5%",
            ],
          ],
        },
        {
          type: "p",
          text: "Both rows end at 7.5% — that is the whole product. The FRA removes the uncertainty in both directions: protection against the rise, and surrender of the benefit of the fall. Whether that surrender matters is what separates FRAs from the options later in this step.",
        },
      ],
      check: {
        question:
          "A company buys an FRA at 7.5% and market rates then fall to 6%. What is its effective borrowing cost?",
        options: [
          "7.5% — it pays 6% on the loan plus a 1.5% settlement to the FRA counterparty",
          "6% — the FRA only pays out when rates rise",
          "4.5% — the fall and the FRA benefit stack",
          "9% — the FRA doubles the cost when rates fall",
        ],
        answer: 0,
        explain:
          "An FRA is binding both ways. The company enjoys the cheaper market loan but must compensate the counterparty for the difference below the agreed rate, netting back to exactly 7.5%. Locked means locked — that certainty is what was bought, and forgone upside is what it cost.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "swaps",
      heading: "Interest rate swaps",
      blocks: [
        {
          type: "p",
          text: "An interest rate swap exchanges periodic interest payments on a notional principal: one party pays fixed, the other floating, and the notional itself never moves. Swaps run longer than FRAs — typically 2 to 10 years — and let a firm transform its debt structure without refinancing: a floating borrower can become effectively fixed, or the reverse.",
        },
        {
          type: "p",
          text: "The deeper reason swaps exist is comparative advantage, and the lecture's example shows it. Zambia Sugar, rated AAA, can borrow at 10% fixed or LIBOR + 0.3% floating. Lafarge, rated BBB, faces 11% fixed or LIBOR + 0.5% floating. Zambia Sugar wants floating; Lafarge wants fixed. Note the asymmetry: Lafarge pays 1% more in the fixed market but only 0.2% more in the floating market.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Fixed" }, { label: "Floating" }],
          rows: [
            ["Zambia Sugar (AAA)", "10%", "LIBOR + 0.3%"],
            ["Lafarge (BBB)", "11%", "LIBOR + 0.5%"],
            ["Lafarge's penalty", "1.0%", "0.2%"],
          ],
        },
        {
          type: "p",
          text: "So each borrows where it is relatively strongest — Zambia Sugar at 10% fixed, Lafarge at LIBOR + 0.5% floating — and they swap: Zambia Sugar pays LIBOR to Lafarge; Lafarge pays 10.1% to Zambia Sugar. Zambia Sugar's net cost is 10% − 10.1% + LIBOR = LIBOR − 0.1%, beating its own floating rate by 0.4%. Lafarge's net cost is LIBOR + 0.5% − LIBOR + 10.1% = 10.6% fixed, beating its own fixed rate by 0.4%. The 0.8% shared gain is the difference between the two penalties (1.0% − 0.2%).",
        },
        {
          type: "callout",
          text: "A swap creates value when the two parties' borrowing penalties differ between markets. Each borrows where it is relatively cheapest, then swaps into the exposure it actually wants.",
        },
      ],
      check: {
        question:
          "In the Zambia Sugar / Lafarge swap, where does the 0.8% of total savings come from?",
        options: [
          "From comparative advantage — Lafarge's penalty is 1% in fixed but only 0.2% in floating, and the swap lets each firm borrow in its relatively cheaper market",
          "From Zambia Sugar's AAA rating subsidising Lafarge",
          "From the banks waiving fees on swap transactions",
          "It is an accounting illusion — no real saving exists",
        ],
        answer: 0,
        explain:
          "The absolute advantage all belongs to Zambia Sugar, but the sizes differ: 1.0% in fixed against 0.2% in floating. That 0.8% spread is real economic surplus released when each borrows where its disadvantage is smallest — the same comparative-advantage logic as trade theory, split here 0.4% each.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "futures",
      heading: "Interest rate futures",
      blocks: [
        {
          type: "p",
          text: "Interest rate futures do an FRA's job on an exchange: standardised contracts that lock a borrowing or lending rate for a future date, liquid enough to close out at any time, at the price of margin requirements and fixed contract sizes.",
        },
        {
          type: "p",
          text: "The quoting convention carries the logic: prices are 100 minus the implied interest rate, so a contract at 97 implies 3%, and a rise in rates makes the price fall. A borrower hedges by selling futures — if rates rise, the price drops and buying back cheap yields a profit that offsets the dearer loan. A lender buys, for the mirror-image reason.",
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
            ["Net effect", "The futures gain offsets the higher loan cost — rate locked at 5%"],
          ],
        },
        {
          type: "p",
          text: "The hedge is not free even when it works: margin must be posted, and the position is marked to market daily, so cash moves through the account all the way to September. The rate certainty is the same as an FRA's; the difference is standardisation and liquidity against the FRA's exact fit.",
        },
      ],
      check: {
        question:
          "Why does a borrower hedging against rising rates SELL interest rate futures rather than buy them?",
        options: [
          "Prices are quoted as 100 minus the rate, so rising rates push prices down — a short position profits exactly when borrowing gets dearer",
          "Selling avoids the margin requirement that buyers pay",
          "Borrowers may only sell under exchange rules",
          "Buying futures locks in the old, lower rate automatically",
        ],
        answer: 0,
        explain:
          "The 100-minus-rate convention makes the price move opposite to rates. The borrower's pain — rates up — is the short seller's gain — price down — so selling creates the offset. Both sides post margin; direction has nothing to do with it.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "options",
      heading: "Caps, floors and collars",
      blocks: [
        {
          type: "p",
          text: "Interest rate options give the buyer the right, not the obligation, to a rate — the asymmetry the binding instruments lack, paid for with an upfront premium. A cap lets a borrower pay at most the strike rate: if rates rise above it the seller reimburses the difference; if they stay below, the borrower walks away and loses only the premium. A floor is the lender's mirror — a minimum rate received. A collar buys a cap and sells a floor at once, using the floor premium received to cut the net cost of protection, at the price of giving away rate falls below the floor.",
        },
        {
          type: "p",
          text: "Compare the choice on one loan: ZMW 1 million resetting for six months, FRA available at 7.5%, or a cap at a 7.5% strike costing a ZMW 1,500 premium.",
        },
        {
          type: "table",
          columns: [{ label: "Scenario" }, { label: "FRA — total cost", align: "right" }, { label: "Cap — total cost", align: "right" }],
          rows: [
            ["Rates rise to 8%", "37,500", "39,000"],
            ["Rates fall to 6%", "37,500", "31,500"],
          ],
          note: "Six months' interest on ZMW 1m. FRA: locked at 7.5% either way. Cap: at 8%, pay 40,000 less 2,500 reimbursed plus 1,500 premium; at 6%, pay 30,000 plus the premium.",
        },
        {
          type: "p",
          text: "The FRA is cheaper if rates rise — certainty costs nothing extra. The cap wins if rates fall, because it never obliged you to give the fall up. That is the whole decision: pay a premium for the upside, or lock the rate and keep the premium. In an environment where rates could genuinely go either way, the optionality earns its ZMW 1,500.",
        },
      ],
      check: {
        question:
          "When is a collar preferable to a plain cap for a borrower?",
        options: [
          "When the borrower wants cheaper protection and will accept giving up the benefit of rates falling below the floor",
          "When the borrower expects rates to collapse and wants full benefit from the fall",
          "Never — a collar is always strictly worse than a cap",
          "When the borrower wants no premium and no obligations of any kind",
        ],
        answer: 0,
        explain:
          "Selling the floor funds the cap, so the collar's net premium is small or nil — but the sold floor is a real obligation: below that rate the borrower pays the difference away. It suits a borrower who wants the ceiling and can live with a floor under their potential savings; one expecting a collapse should keep the plain cap.",
      },
    },
  ],
};
