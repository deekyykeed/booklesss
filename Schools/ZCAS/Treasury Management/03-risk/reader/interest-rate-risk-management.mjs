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
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Interest rate risk, and how to measure it'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared, and ended on a bare particle. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 2 sections and now holds one: "The Nature of Interest Rate Risk". The other
 * section(s) moved to measuring-rate-exposure.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "interest-rate-risk-management",
  label: "The Nature of Interest Rate Risk",
  title: "The Nature of Interest Rate Risk",
  kicker: "Interest Rates",

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
  ],
};
