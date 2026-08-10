/* TM · Lesson 4 Debt and investment · Step 2a — The rules for investing surplus cash
 *
 * Source: 12_Investment Management PPTX; build_tm_4_2_investment-management.py
 *         (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one five-section step. The seam is
 * between the rules (the objectives and the written policy that enforces them)
 * and the portfolio (the instruments, the credit limits, and building the
 * thing). Coverage is identical; nothing was cut. This part keeps the
 * `investment-management` slug because that URL exists; the other half is
 * `building-the-portfolio`.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 * Engagement (D-1): §2's buried lead was its last sentence, that the policy
 * protects the treasurer as much as the company. It now opens the section.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'The rules for investing surplus cash'.
 * The old name was sentence case and did not name the topic the way the paper does. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 2 sections and now holds one: "Safety, Liquidity, Yield". The other
 * section(s) moved to investment-policy.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "investment-management",
  label: "Safety, Liquidity, Yield",
  title: "Safety, Liquidity, Yield",
  kicker: "Investing",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "objectives",
      heading: "Safety, liquidity, yield, in that order",
      blocks: [
        {
          type: "p",
          text: "A Lusaka distributor moves ZMW 4.2 million of payroll reserve into a two-year corporate note paying four points over the bank. For twenty-three months it is the cleverest thing anyone in that finance office has done. **The money is already yours,** which is what makes investing a surplus unlike every other decision in finance: you are not trying to win, you are trying not to lose something you already have.",
        },
        {
          type: "p",
          text: "So the three objectives are ranked, and the ranking is not a suggestion.",
        },
        {
          type: "ul",
          items: [
            "Safety first. Do not lose the [[principal|The original amount you put in, as opposed to the interest it earns. Losing interest is a bad year; losing principal is a failure of the function.]]. That rules out default risk, [credit risk](https://corporatefinanceinstitute.com/resources/commercial-lending/credit-risk/) and [[market risk|The risk that an instrument loses value because rates or prices moved, even though nobody defaulted. You can be paid to carry it, and on a payroll reserve you are not.]] you were not paid to take, and it accepts that the safest homes, Bank of Zambia paper and bank deposits, pay the least.",
            "Liquidity second. The cash may be needed tomorrow for payroll or in three months for equipment, so the [maturities have to ladder to the need](https://corporatefinanceinstitute.com/resources/accounting/liquidity/) even when that costs yield.",
            "Yield last. It is the residual. You earn whatever the market gives on what is left once the first two are satisfied.",
          ],
        },
        {
          type: "callout",
          kind: "warning",
          text: "Never sacrifice safety for yield, and never sacrifice liquidity for yield. **Treasurers who inverted the order found their high-yield instruments defaulted or frozen at exactly the moment the cash was needed,** which is the only moment that was ever going to test it.",
        },
      ],
      check: {
        question:
          "A treasurer moves the payroll reserve into a high-yield 2-year corporate note because \"the return was too good to pass up\". Which objectives were violated?",
        options: [
          "Both safety and liquidity: credit risk on the principal, and a two-year lock on cash needed monthly",
          "None, because a higher return serves the company",
          "Only safety, because corporate notes are perfectly liquid",
          "Only liquidity, because high yield implies high safety",
        ],
        answer: 0,
        explain:
          "Yield was promoted from last to first, over both of its seniors. The note can default, which is safety, and it cannot be liquidated at par on payday, which is liquidity. The hierarchy exists precisely because yield is the only objective the market actively tempts you to overweight.",
      },
    },
  ],
};
