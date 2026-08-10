/* TM · Lesson 1 Operations · Step 1.1: The Treasury Function
 *
 * Source: 06_Introduction to Treasury Management PPTX; Treasury controls.pdf;
 *         build_lesson_1_1_tm.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-01 split (rule S-8). This was one six-section step. Six sections is
 * a climb, and a reader who abandons two thirds of the way through has learned
 * less than one who finishes three shorter steps. Split on the conceptual
 * seams: what treasury is, how the work divides, how it is governed. Coverage
 * is identical; nothing was cut. The first part keeps the original
 * `intro-to-treasury` slug because that URL is already linked to.
 *
 * This step is also the reference implementation for the writing rules: W-8
 * bold, W-9/W-10 ownership voice, W-11 no em dashes, W-12 sentence length,
 * E-8 [[term|definition]] popups, C-7 inline source links.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'What treasury is and what it does'.
 * The old name was sentence case and opened on a question word. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 2 sections and now holds one: "Treasury's Job". The other
 * section(s) moved to eleven-functions.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "intro-to-treasury",
  label: "Treasury's Job",
  title: "Treasury's Job",
  kicker: "The Treasury Function",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-treasury-is",
      heading: "What treasury is",
      blocks: [
        {
          type: "p",
          text: "Your company can have a [profitable year](https://corporatefinanceinstitute.com/resources/accounting/cash-flow-vs-net-income/) and still fail to pay the staff at the end of it. The [[income statement|The report of what your business earned and spent over a period: revenue minus costs, ending in profit. It counts sales when they are made, not when the cash arrives, which is exactly why it can show a profit while your account is empty.]] says the year went well. [The bank balance on the 28th](https://www.accountingcoach.com/cash-flow-statement/explanation) says there is not enough to run payroll. **Profit is worked out over twelve months and rests on judgement; cash is a fact on a Friday afternoon.** The Friday decides whether anyone gets paid.",
        },
        {
          type: "p",
          text: "[Treasury](https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/treasury-management/) is the function that lives on the cash side of that gap. Its job is to **put your money in the right account, in the right currency, on the day it is needed**. [Cash that is not needed yet](https://www.accountingcoach.com/working-capital/explanation) earns something instead of sitting idle. Every risk that comes with holding and moving it is [treasury's to find and reduce](https://careernavigator.accaglobal.com/gb/en/job-profiles/proficient/treasury-professional.selector.Leader.html): a kwacha that moves against you, a rate that resets, a bank that changes its terms.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Profit is an opinion formed over a year. Cash is a fact on a Friday. Treasury owns the Friday.",
        },
        {
          type: "p",
          text: "**Treasury executes; it does not set strategy.** If your board decides to fund a new plant with 40% debt, treasury gets no vote. It raises the debt, negotiates the terms, then lives with the rate risk for ten years. That line matters, because treasury works inside the three decisions that make up corporate finance.",
        },
        {
          type: "ul",
          items: [
            "The investment decision. Where the money goes: long-term projects, working capital, investments inside or outside the business.",
            "The financing decision. Where the money comes from: the mix of debt and equity, the cost of those funds, and the [[hedging|Taking a second position that moves the opposite way to a risk you already carry, so the two cancel out. You give up some upside to remove the downside. It is insurance, not a bet.]] that mix forces on you.",
            "Dividend policy. What happens to the profit: how much is paid out to shareholders and how much is kept to fund growth.",
          ],
        },
        {
          type: "p",
          text: "Treasury sits underneath all three. It funds the working capital the first creates, manages the risks the second leaves open, and holds the cash the third has promised to pay out.",
        },
      ],
      check: {
        question:
          "The board decides the company will move to a 40% debt, 60% equity structure. What is treasury's role in that decision?",
        options: [
          "Execute it: arrange the borrowings and manage the resulting cost and risk; the decision itself belongs to senior management",
          "Make it, because capital structure is treasury's core decision",
          "Veto it if the cost of debt is too high",
          "None, because capital structure is an accounting matter",
        ],
        answer: 0,
        explain:
          "Treasury carries out decisions made by senior management. The financing decision is set above the function; treasury's job is to raise the funds on the best terms, manage the refinancing and rate risk it creates, and keep access to credit open.",
      },
    },
  ],
};
