/* TM · Lesson 4 Debt and investment · Step 1a — Where debt comes from, and how long it should run
 *
 * Source: 11_Debt Management PPTX; build_tm_4_1_debt-management.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one six-section step. The seam is
 * between where the money comes from (the function, the five sources, and how
 * long each should run) and what it costs you (covenants, bond pricing,
 * ratings). Coverage is identical; nothing was cut. This part keeps the
 * `debt-management` slug because that URL exists; the other half is
 * `the-price-of-debt`.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 * Engagement (D-1): all three sections opened on a definition. They now open on
 * why cheap money is cheap, on what a Zambian case is actually telling you when
 * it does not name the lender, and on the fifteen-years-against-ninety-days
 * mismatch.
 *
 * 2026-08-02 S-6/W-13: §3 closed by naming "the aggressive and conservative
 * financing policies from the working capital lesson". A reader who has not
 * read that lesson cannot use the sentence, so the two policies are described
 * where they are mentioned instead of pointed at.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Where debt comes from, and how long it should run'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "The Debt Management Function". The other
 * section(s) moved to sources-of-debt.mjs, the-matching-principle.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "debt-management",
  label: "The Debt Management Function",
  title: "The Debt Management Function",
  kicker: "Debt",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "the-function",
      heading: "The debt management function",
      blocks: [
        {
          type: "p",
          text: "Short money is cheaper. A ninety-day kwacha facility at 26% against a five-year loan at 32% is six points a year you keep. **It is cheaper because the lender only has to be there for ninety days,** and the day you most need them to still be there is precisely the day they least want to be.",
        },
        {
          type: "p",
          text: "Debt, alongside equity, is where the cash for [working capital](https://corporatefinanceinstitute.com/resources/accounting/working-capital-cycle/), expansion and equipment comes from, and its cost moves with the source, the term and how good your credit looks. Managing that cost is a treasury function with three jobs, and you cannot do one of them properly while ignoring the others:",
        },
        {
          type: "ul",
          items: [
            "Minimise the cost of borrowing across every source and maturity.",
            "Manage the risks the debt itself creates: [[refinancing risk|The risk that when a loan ends you cannot replace it, or can only replace it at a worse rate. Short debt runs it at every renewal; long debt pays extra to avoid it.]], interest rate risk, currency risk.",
            "Keep access to credit open, at rates you can live with.",
          ],
        },
        {
          type: "p",
          text: "**The trade-off running through all three is cost against risk,** and the cheaper source usually carries the bigger danger. Every decision in this lesson is a position you are taking on that, whether you take it deliberately or by default.",
        },
      ],
      check: {
        question:
          "A treasurer refinances all the company's debt into the cheapest available facility: 90-day paper rolled over continuously. What has been optimised, and what ignored?",
        options: [
          "Cost was minimised while refinancing risk was ignored, because every 90 days the company bets that lenders will still be there",
          "Both cost and risk were optimised, because cheapest is safest",
          "Risk was minimised at the expense of cost",
          "Access to credit was maximised, which covers all three jobs",
        ],
        answer: 0,
        explain:
          "Short paper is cheap precisely because the lender commits for almost no time, which transfers the commitment problem to the borrower. Debt management is all three jobs at once, and a structure that wins on cost while maximising rollover exposure has failed the other two.",
      },
    },
  ],
};
