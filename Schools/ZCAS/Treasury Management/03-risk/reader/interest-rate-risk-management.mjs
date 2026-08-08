/* TM · Lesson 3 Risk · Step 1a — Interest rate risk, and how to measure it
 *
 * Source: 09_Interest Rate Risk Management PPTX + MPC statements;
 *         build_tm_3_1_interest-rate-risk.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one six-section step. The seam is
 * between knowing the exposure (what it is, and the three ways to size it) and
 * covering it (FRAs, swaps, futures, options). Coverage is identical; nothing
 * was cut. This part keeps the `interest-rate-risk-management` slug because
 * that URL exists; the instruments are `interest-rate-hedging-instruments`.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 *
 * Engagement (D-1): both sections opened on a definition. §1 now opens on the
 * MPC raising the rate without asking you, and §2 on one basis point being
 * ZMW 50, which is the figure that makes the measurement worth doing.
 * §1's four risk types were a bare `ul` between two paragraphs (S-7); they now
 * carry the time-against-terms split that makes them recoverable.
 *
 * LIBOR is kept because the lecture's swap example is built on it (C-4), with a
 * tappable note that it was phased out in 2023 and that the arithmetic is the
 * same against SOFR or SONIA.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). §2 gave two formulas and
 * worked neither on the section's own case; its check asked only for the sign
 * of the effect. It now hands over a gap to compute and to price in kwacha.
 * The distractors are the two ways the netting gets lost (charging the whole
 * liability book, adding the two sides) plus the sign error the old check
 * tested, which is kept as an option rather than as the question.
 */

export default {
  slug: "interest-rate-risk-management",
  label: "Interest rate risk",
  title: "Interest rate risk, and how to measure it",
  kicker: "Risk",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-it-is",
      heading: "What interest rate risk is",
      blocks: [
        {
          type: "p",
          text: "The Monetary Policy Committee meets a few times a year and nobody consults you. Lift the policy rate two points in February and **every kwacha you have borrowed on a floating rate costs more in March.** The only decision you get is the one you took before the meeting.",
        },
        {
          type: "p",
          text: "[Interest rate risk](https://corporatefinanceinstitute.com/resources/economics/interest-rate-risk/) is the loss in profit and in value that comes from rates moving in a way you did not plan for. It cuts both ways: floating-rate debt gets dearer when rates rise, and fixed-rate bonds you hold lose market value at exactly the same moment.",
        },
        { type: "h2", text: "The four kinds, and how to keep them straight" },
        {
          type: "p",
          text: "**Two of these are about time and two are about terms.** Repricing and yield curve risk turn on when things reset, and on how the curve moves across time. Basis and options risk turn on what you are pegged to, and on who holds the right to change their mind.",
        },
        {
          type: "ul",
          items: [
            "Repricing risk. Assets and liabilities reset on different dates, so a 5-year loan funding a 3-year investment leaves a gap after year three.",
            "Yield curve risk. The shape of the [term structure](https://corporatefinanceinstitute.com/resources/fixed-income/interest-rate-risk/) changes, and it hits you differently depending on whether you borrow long or short.",
            "Basis risk. The reference rates on the two sides move differently: a loan on [[LIBOR|The London benchmark most older loan and swap examples are built on, including this course's. It was phased out in 2023 in favour of rates like SOFR and SONIA, and the arithmetic is identical whichever benchmark a loan is pegged to.]] plus 2% funding an asset priced off prime.",
            "Options risk. Somebody holds an embedded right and will use it: borrowers refinance when rates fall, and lenders cannot claim the same benefit when rates rise.",
          ],
        },
        {
          type: "p",
          text: "In Zambia the whole chain runs through the [[MPC|The Bank of Zambia's Monetary Policy Committee. It meets quarterly and sets the policy rate, which is the number every other lending rate in the country is quoted against.]]. Corporate borrowing tracks the policy rate with a spread, with prime lending typically 3–5% above it, so a rise reaches floating-rate borrowers and every new fixed-rate loan quickly. **Watching the MPC statement is not analysis, it is your early warning,** and what follows it is a decision: hedge, or carry it.",
        },
      ],
      check: {
        question:
          "A firm's loan is priced off LIBOR while the deposit income funding it is priced off the local prime rate. Which type of interest rate risk is that?",
        options: [
          "Basis risk, because the two sides reference rates that can move differently",
          "Repricing risk, because the loan and deposit mature on different dates",
          "Yield curve risk, because the term structure has changed shape",
          "Options risk, because the loan must contain an embedded option",
        ],
        answer: 0,
        explain:
          "Both sides may float and even reprice on the same day, and the firm is still exposed if LIBOR and prime diverge. That divergence between reference rates is basis risk, which is distinct from mismatched dates and from a change in the curve's shape.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "measuring",
      heading: "Measuring the exposure",
      blocks: [
        {
          type: "p",
          text: "One [[basis point|A hundredth of one percent. Rates are quoted in them because \"the rate went up 50 basis points\" cannot be misread, while \"the rate went up half a percent\" can mean two different things.]] on a ZMW 1 million loan over six months is ZMW 50. That sounds like nothing, right up until you ask how many basis points the MPC has moved in a bad year.",
        },
        {
          type: "p",
          text: "**You cannot decide whether to hedge until the exposure is a number,** and three tools turn it into one. The first is gap analysis, which groups assets and liabilities by the date they reprice.",
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
          text: "A positive gap means more assets than liabilities reprice, so rising rates lift your net interest income. A negative gap means the reverse. **The sign of the gap tells you which direction to hedge in,** which is the question people usually get wrong before they get the size wrong.",
        },
        { type: "h2", text: "Duration, and turning it into money" },
        {
          type: "formula",
          text: "Price change (%) ≈ −Duration × yield change (%)",
          where: [
            "Duration = the weighted-average time, in years, to receive a bond's cash flows",
            "A 5-year-duration bond loses roughly 5% of value if yields rise 1%, meaning 100 basis points",
          ],
        },
        {
          type: "p",
          text: "[Duration](https://corporatefinanceinstitute.com/resources/fixed-income/duration/) is the sensitivity measure for anything fixed-income you hold, and basis point value turns it into cash: the effect of a 0.01% move. On ZMW 1 million over six months that is 1,000,000 × 0.0001 × 0.5 = ZMW 50 a year. Small per point, which is the whole reason exposures are quoted this way. Multiply by the number of points you actually fear and it stops being a percentage and becomes a decision.",
        },
        {
          type: "callout",
          kind: "example",
          text: "Turn one into a number yourself. In a bank's one-year bucket, **ZMW 260 million** of assets reprice and **ZMW 380 million** of liabilities do. The MPC then raises rates by **1.5%**. Work the gap, then what it costs over the year. The point of netting them first is that both sides move: **the assets earn the new rate too, and the gap is the part of the book where that does not cancel out.**",
        },
      ],
      check: {
        question:
          "Assets of ZMW 260 million and liabilities of ZMW 380 million reprice within the year, and rates rise 1.5%. What happens to net interest income?",
        options: [
          "It falls by about ZMW 1.8 million",
          "It rises by about ZMW 1.8 million",
          "It falls by about ZMW 5.7 million",
          "It falls by about ZMW 9.6 million",
        ],
        answer: 0,
        explain:
          "Gap = 260 − 380 = −ZMW 120 million, and −120,000,000 × 1.5% = **a fall of ZMW 1.8 million**. A rise of 1.8 million has the size right and the sign backwards: a negative gap means the cost side reprices first, so rising rates hurt. A fall of 5.7 million charges the whole ZMW 380 million with the increase and forgets that the 260 million of assets is earning the new rate as well: netting them is the entire idea of a gap. A fall of 9.6 million adds the two sides instead of subtracting them, which would make a perfectly matched book the most exposed one rather than the least.",
      },
    },
  ],
};
