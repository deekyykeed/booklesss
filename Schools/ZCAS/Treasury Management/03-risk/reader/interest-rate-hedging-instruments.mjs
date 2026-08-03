/* TM · Lesson 3 Risk · Step 1b — Covering interest rate risk
 *
 * Source: 09_Interest Rate Risk Management PPTX;
 *         build_tm_3_1_interest-rate-risk.py (PDF). Zambia Sugar / Lafarge swap
 *         kept at the lecture's figures. The PDF's cap-vs-FRA table used
 *         inconsistent interest totals; the comparison here recomputes cleanly
 *         on the same 6-month, ZMW 1m loan (FRA 7.5%; cap 7.5% strike,
 *         ZMW 1,500 premium).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `interest-rate-risk-management`, which was
 * one six-section step. That part is knowing the exposure; this part is
 * covering it. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. Every opening was re-read cold. The FRA
 * section now sets its own scene rather than continuing one, the swap section
 * opens on the surprise in the lecture's own numbers rather than on a
 * definition, and no opening refers to a section in the other half.
 *
 * The comparison at the end deliberately keeps the corrected cap-vs-FRA
 * figures: the source PDF's version compared a 6-month FRA against a cap on
 * inconsistent interest totals, so the two columns were not the same loan.
 */

export default {
  slug: "interest-rate-hedging-instruments",
  label: "Covering interest rate risk",
  title: "Covering interest rate risk",
  kicker: "Risk",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "fras",
      heading: "Forward rate agreements",
      blocks: [
        {
          type: "p",
          text: "It is March. Your ZMW 1 million loan resets in six months, six-month money costs 7% today, and you think it is going up. A dealer offers to fix September's rate at 7.5%, agreed now, with **nothing to pay up front.**",
        },
        {
          type: "p",
          text: "That is a forward rate agreement. It is an [[over-the-counter|Agreed directly between you and a bank rather than traded on an exchange, so the amount and the dates are cut to fit your loan exactly. The price of that fit is that you are relying on that one bank to be good for it.]] contract fixing an interest rate today for a period starting later. **No principal ever moves.** Only the difference between the agreed rate and the market rate is settled in cash.",
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
          text: "Both rows end at 7.5%, and that is the entire product. **An FRA removes the uncertainty in both directions,** so you buy protection against the rise and [hand over the benefit of the fall](https://treasurytoday.com/risk-management/question-answered-hedging-strategies/) in the same signature. Whether handing that over is acceptable is the question the last section of this step answers.",
        },
      ],
      check: {
        question:
          "A company buys an FRA at 7.5% and market rates then fall to 6%. What is its effective borrowing cost?",
        options: [
          "7.5%, because it pays 6% on the loan plus a 1.5% settlement to the FRA counterparty",
          "6%, because the FRA only pays out when rates rise",
          "4.5%, because the fall and the FRA benefit stack",
          "9%, because the FRA doubles the cost when rates fall",
        ],
        answer: 0,
        explain:
          "An FRA is binding both ways. The company enjoys the cheaper market loan but must compensate the counterparty for the difference below the agreed rate, netting back to exactly 7.5%. Locked means locked: the certainty is what was bought, and the forgone upside is what it cost.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "swaps",
      heading: "Interest rate swaps",
      blocks: [
        {
          type: "p",
          text: "Zambia Sugar can borrow more cheaply than Lafarge in both markets, fixed and floating. Lafarge still ends up better off by dealing with them, and so does Zambia Sugar. **That is not charity, and it is not a trick.**",
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
          text: "Look at the last row. **Lafarge pays 1% more in the fixed market but only 0.2% more in the floating one,** and that 0.8% difference is the whole opportunity. Zambia Sugar wants floating and Lafarge wants fixed, which is exactly the wrong way round from where each is relatively strong.",
        },
        {
          type: "p",
          text: "So each borrows where it is relatively strongest, Zambia Sugar at 10% fixed and Lafarge at LIBOR + 0.5% floating, and then they [swap](https://corporatefinanceinstitute.com/resources/derivatives/interest-rate-swap/) the payments. Zambia Sugar pays LIBOR to Lafarge, and Lafarge pays 10.1% to Zambia Sugar.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Net cost after the swap" }, { label: "Own market rate" }, { label: "Saving", align: "right" }],
          rows: [
            ["Zambia Sugar", "10% − 10.1% + LIBOR = LIBOR − 0.1%", "LIBOR + 0.3%", "0.4%"],
            ["Lafarge", "LIBOR + 0.5% − LIBOR + 10.1% = 10.6%", "11%", "0.4%"],
          ],
          note: "The 0.8% shared gain is the difference between the two penalties, 1.0% less 0.2%, split half each.",
        },
        {
          type: "p",
          text: "A swap runs for years, typically two to ten, on a [[notional|The principal a swap's interest is calculated on, which is never actually exchanged. A ZMW 50 million swap moves only the interest difference, so the number on the contract is far larger than anything at risk.]] that never moves. **It is the tool for changing what your debt is,** rather than for covering one reset: a floating borrower becomes effectively fixed without refinancing a single loan.",
        },
        {
          type: "callout",
          text: "**A swap creates value when two parties' borrowing penalties differ between markets.** Each borrows where it is relatively cheapest, then swaps into the exposure it actually wanted.",
        },
      ],
      check: {
        question:
          "In the Zambia Sugar and Lafarge swap, where does the 0.8% of total savings come from?",
        options: [
          "From comparative advantage, because Lafarge's penalty is 1% in fixed but only 0.2% in floating, and the swap lets each firm borrow in its relatively cheaper market",
          "From Zambia Sugar's AAA rating subsidising Lafarge",
          "From the banks waiving fees on swap transactions",
          "It is an accounting illusion, because no real saving exists",
        ],
        answer: 0,
        explain:
          "The absolute advantage all belongs to Zambia Sugar, but the sizes differ: 1.0% in fixed against 0.2% in floating. That 0.8% spread is real surplus, released when each firm borrows where its disadvantage is smallest, and it is split 0.4% each here.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "futures",
      heading: "Interest rate futures",
      blocks: [
        {
          type: "p",
          text: "A futures price of 95 means an interest rate of 5%. Prices are quoted as 100 minus the rate, so **when rates go up, the price goes down,** and getting that backwards means hedging in precisely the wrong direction.",
        },
        {
          type: "p",
          text: "[Interest rate futures](https://corporatefinanceinstitute.com/resources/derivatives/futures-contract/) do an FRA's job on an exchange: standardised contracts locking a rate for a future date, liquid enough to close out whenever you want, in return for margin and fixed contract sizes. Follow the quoting convention and the direction chooses itself. **A borrower sells,** because a rate rise drops the price and buying it back cheap pays for the dearer loan. A lender buys, for the mirror reason.",
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
            ["Net effect", "The futures gain offsets the higher loan cost, so the rate is locked at 5%"],
          ],
        },
        {
          type: "p",
          text: "It is not free even when it works perfectly. Margin has to be posted and the position is marked to market daily, so cash moves in and out of your account all the way to September. **You get an FRA's certainty and pay for it in liquidity rather than in a premium.**",
        },
      ],
      check: {
        question:
          "Why does a borrower hedging against rising rates sell interest rate futures rather than buy them?",
        options: [
          "Prices are quoted as 100 minus the rate, so rising rates push prices down, and a short position profits exactly when borrowing gets dearer",
          "Selling avoids the margin requirement that buyers pay",
          "Borrowers may only sell under exchange rules",
          "Buying futures locks in the old, lower rate automatically",
        ],
        answer: 0,
        explain:
          "The 100-minus-rate convention makes the price move opposite to rates. The borrower's pain, rates up, is the short seller's gain, price down, so selling creates the offset. Both sides post margin, and direction has nothing to do with it.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "options",
      heading: "Caps, floors and collars",
      blocks: [
        {
          type: "p",
          text: "Pay ZMW 1,500 today and you keep the right to change your mind in September. Everything in this section is about whether that is worth ZMW 1,500 to you.",
        },
        {
          type: "p",
          text: "An interest rate option gives its buyer [a right rather than an obligation](https://corporatefinanceinstitute.com/resources/derivatives/call-option/), which is the one thing the instruments above cannot offer, and the premium is the price of it. **A cap sets the most you will ever pay:** rise above the [[strike|The rate written into the option. A cap struck close to today's rate protects almost immediately and costs more; struck further away it is cheaper cover against a bigger move.]] and the seller reimburses the difference, stay below it and you walk away having lost only the premium. A floor is the lender's mirror image, a minimum rate received.",
        },
        {
          type: "p",
          text: "A collar buys a cap and sells a floor at the same time, so the premium you receive on the floor pays for most of the cap. **You are selling away the rate falls below the floor to fund the protection above the cap.**",
        },
        { type: "h2", text: "The choice, on one loan" },
        {
          type: "p",
          text: "ZMW 1 million resetting for six months. You can have an FRA at 7.5%, or a cap struck at 7.5% for a ZMW 1,500 premium.",
        },
        {
          type: "table",
          columns: [{ label: "Scenario" }, { label: "FRA, total cost", align: "right" }, { label: "Cap, total cost", align: "right" }],
          rows: [
            ["Rates rise to 8%", "37,500", "39,000"],
            ["Rates fall to 6%", "37,500", "31,500"],
          ],
          note: "Six months' interest on ZMW 1m. FRA: locked at 7.5% either way. Cap: at 8%, pay 40,000 less 2,500 reimbursed plus the 1,500 premium; at 6%, pay 30,000 plus the premium.",
        },
        {
          type: "p",
          text: "The FRA wins if rates rise, because certainty cost nothing extra. The cap wins if they fall, because it never asked you to give the fall away. **That is the whole decision: pay a premium for the upside, or keep the premium and lock the rate.** When rates could genuinely go either way, the ZMW 1,500 is buying something real.",
        },
      ],
      check: {
        question:
          "When is a collar preferable to a plain cap for a borrower?",
        options: [
          "When the borrower wants cheaper protection and will accept giving up the benefit of rates falling below the floor",
          "When the borrower expects rates to collapse and wants full benefit from the fall",
          "Never, because a collar is always strictly worse than a cap",
          "When the borrower wants no premium and no obligations of any kind",
        ],
        answer: 0,
        explain:
          "Selling the floor funds the cap, so the collar's net premium is small or nil, and the sold floor is a real obligation: below that rate the borrower pays the difference away. It suits someone who wants the ceiling and can live with a floor under their savings. Anyone expecting a collapse should keep the plain cap.",
      },
    },
  ],
};
