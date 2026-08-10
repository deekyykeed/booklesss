/* TM · Investing · The Investment Policy Statement
 *
 * Split out of investment-management.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of investment-management.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "investment-policy",
  label: "The Investment Policy Statement",
  title: "The Investment Policy Statement",
  kicker: "Investing",

  sections: [
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
