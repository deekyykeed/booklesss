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
 */

export default {
  slug: "investment-management",
  label: "Investing surplus cash",
  title: "The rules for investing surplus cash",
  kicker: "Debt and investment",

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

    /* ---------------------------------------------------------------- */
    {
      id: "policy",
      heading: "The investment policy statement",
      blocks: [
        {
          type: "p",
          text: "An investment policy is usually described as protecting the company from its treasurer. **It also protects the treasurer, and that is the half people miss.** When an investment made inside the rules goes bad, you can show it was made inside rules the board approved, and that is the difference between a market loss and a career-ending one.",
        },
        {
          type: "p",
          text: "It is a written document, approved by the board or the [[audit committee|The board sub-committee responsible for controls and reporting. Sending the policy there rather than to management is what makes it a rule rather than a preference.]], and it works the way every other [internal control](https://corporatefinanceinstitute.com/resources/accounting/internal-controls/) works: it fixes the rules before any money moves.",
        },
        {
          type: "table",
          columns: [{ label: "Policy item" }, { label: "What it fixes" }],
          rows: [
            ["Approved instruments", "What treasury may buy: T-bills only, or also CDs and corporate bonds"],
            ["Credit rating limits", "The minimum acceptable rating, such as nothing below BBB for corporates"],
            ["Counterparty limits", "Maximum exposure to any single bank, such as no more than ZMW 5 million with one name"],
            ["Maturity limits", "How far out money may be committed, such as nothing beyond a year for the operating reserve"],
            ["Diversification", "How risk is spread across issuers and instruments"],
            ["Reporting", "How performance reaches management and the board"],
            ["Review and approval", "Who owns the policy, and how often it is revisited"],
          ],
        },
        {
          type: "p",
          text: "Read the table as decisions taken calmly in advance. **Every one of them is a decision somebody would otherwise take at speed, with a rate sheet in front of them.** That is the whole mechanism: the policy removes discretion at exactly the moment discretion is worth least.",
        },
      ],
      check: {
        question:
          "An approved instrument, bought inside every policy limit, loses value when its issuer is downgraded. Why does the investment policy still matter here?",
        options: [
          "It separates a market outcome from a control failure, because treasury acted within board-approved rules and the loss triggers a policy review rather than blame",
          "It does not, because a loss proves the policy failed",
          "It guarantees the company against losses inside the limits",
          "It transfers the loss to the approving board members personally",
        ],
        answer: 0,
        explain:
          "No policy eliminates market risk. What it does is define authorised risk in advance, so a loss inside the rules is the risk the board accepted and the response is to adjust the rules. A loss outside them is a control failure. Drawing that line is what the written document is for.",
      },
    },
  ],
};
