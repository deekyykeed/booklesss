/* TM · Lesson 2 Working capital · Step 1a — Working capital, and how much of it to run
 *
 * Source: 07_Working Capital_Liquidity Management PPTX 1;
 *         build_tm_2_1_working-capital.py (PDF). Worked figures kept at the
 *         lecture's originals (Zanaco Distributors CCC).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one five-section step. The seam is
 * between what working capital is and how much of it to run (the definition,
 * the two policy decisions, the cycle that sizes it) and getting the cash back
 * in (debtors, discounts, factoring). Coverage is identical; nothing was cut.
 * This part keeps the `working-capital-and-liquidity` slug because that URL
 * exists; the other half is `debtors-and-factoring`.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 * Engagement (D-1): the step opened "Working capital is current assets minus
 * current liabilities", which is the definition with nothing to hang it on. It
 * now opens on the company that reports a record year and cannot pay March's
 * suppliers, and the definition follows.
 *
 * D-5 (E-9) was considered and declined here. The two policy tables are
 * three-row definitional sets, which is inside E-9's cap, but the axis is risk
 * appetite and `card-glyphs.tsx` currently carries only the three time-horizon
 * marks. Three unrelated pictures would be worse than the tables, so they stay
 * tables until the glyph set covers this axis.
 *
 * 2026-08-02 W-9: §2 closed "When the exam asks you to evaluate a policy…".
 * The sentence now hands the judgement to whoever is choosing the policy.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). §3 worked the Zanaco
 * Distributors cycle and then asked which component moved in a hypothetical
 * later year, which needs no arithmetic. It now hands over a full cycle whose
 * three components land on whole days (60, 45, 35), so the reader's error, if
 * any, is in the method rather than in rounding. The distractors are the three
 * real ones: the operating cycle reported as the cash cycle, every ratio run
 * over revenue, and payables added rather than subtracted.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Working capital, and how much of it to run'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "The Nature of Working Capital". The other
 * section(s) moved to working-capital-policy.mjs, cash-conversion-cycle.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "working-capital-and-liquidity",
  label: "The Nature of Working Capital",
  title: "The Nature of Working Capital",
  kicker: "Working Capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-working-capital-is",
      heading: "What working capital is",
      blocks: [
        {
          type: "p",
          text: "A Lusaka distributor can report a record year in February and fail to pay its suppliers in March. **Profit is an opinion about a period. Working capital is what is actually in the account this week.**",
        },
        {
          type: "p",
          text: "Technically it is [current assets minus current liabilities](https://www.accountingcoach.com/blog/what-is-working-capital). In practice it is the pool of cash and near-cash the business has to keep itself running day to day, and the whole job is sizing that pool.",
        },
        {
          type: "p",
          text: "More assets than [current liabilities](https://www.accountingcoach.com/blog/what-is-a-current-liability) and you have a surplus, usually sitting in deposits or short-term investments. Fewer and you have a deficit, usually running on an [[overdraft|Borrowing through your current account by letting it go below zero, up to an agreed limit. The most flexible debt there is, one of the most expensive, and the bank can withdraw it on demand.]]. **Too little and you cannot pay your suppliers; too much and the money is idle when it could be in something productive.**",
        },
        {
          type: "callout",
          kind: "key",
          text: "Even a profitable business fails without adequate working capital. **Cash is king, not profit.** A company can look excellent on paper and still collapse because it cannot meet what falls due next week.",
        },
      ],
      check: {
        question:
          "A company reports strong profits but cannot pay this month's suppliers. How is that possible?",
        options: [
          "Profit is an accounting result, and its cash may be tied up in stock and unpaid customer invoices, leaving nothing liquid",
          "It is not possible, because profitable companies always have cash",
          "The profits must be fraudulent",
          "Suppliers must be demanding early payment illegally",
        ],
        answer: 0,
        explain:
          "Profit records revenue when it is earned, not when it is collected. A profitable company whose cash sits in inventory and receivables has a working capital problem, and working capital rather than profit is what pays this month's bills.",
      },
    },
  ],
};
