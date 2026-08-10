/* TM · Lesson 2 Working capital · Step 3b — Forecasting the cash, and putting it to work
 *
 * Source: 08_Cash Forecasting PPTXs + 07 PPTX 3;
 *         build_tm_2_3_cash-management.py (PDF). Forecasting figures kept at
 *         the lecture's originals (five days of collections; α = 0.40).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `cash-management`, which was one six-section
 * step and the longest in the course. That part decides how much cash to hold;
 * this part runs it. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. Every opening was re-read cold. No section
 * here refers to Baumol or Miller-Orr in its first sentence, because a reader
 * arriving from the sidebar or a shared link has not met either.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). §2's check handed the reader
 * an already-annualised 4.05% and asked which instrument to pick, so the one
 * piece of arithmetic in the section was never theirs to do. It now hands over
 * a 73-day bill at 98 (365 ÷ 73 = 5 exactly, so the annualisation is clean)
 * and the decision rides on the number instead of being given with it. The
 * 10.00% distractor is the discount-rate-for-yield slip, which is worth naming
 * because it is always close enough to the right answer to look right.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Forecasting the cash, and putting it to work'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared, and ended on a bare particle. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "Cash Flow Forecasting". The other
 * section(s) moved to surpluses-and-overdrafts.mjs, cash-concentration.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "cash-forecasting-and-surpluses",
  label: "Cash Flow Forecasting",
  title: "Cash Flow Forecasting",
  kicker: "Forecasting and Surpluses",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "forecasting",
      heading: "Cash flow forecasting",
      blocks: [
        {
          type: "p",
          text: "A gap between what you forecast and what actually landed is not only a planning miss. **It is how mistimed payments, slipping collections and fraud first show themselves,** and a treasury that never forecasts has no way of noticing any of the three.",
        },
        {
          type: "p",
          text: "[Forecasting](https://treasurytoday.com/cash-management/cash-flow-forecasting/) turns cash management from reaction into planning: estimate the inflows and outflows, build a [[pro-forma|A projected version of a financial statement, built from what you expect rather than what has happened. A pro-forma cash position is next month's bank balance, worked out in advance.]] cash position for the period. Then decide in advance how to cover the shortfalls and where to place the surpluses.",
        },
        {
          type: "p",
          text: "The workhorse is the receipts and disbursements method: schedule the expected collections, schedule the payments (purchases, payroll, taxes, interest, dividends, capital spending), and net them against the minimum balance you have decided to keep. Distribution forecasts refine the single large events using the pattern of how a big collection has actually arrived in the past, and [statistical methods](https://treasury-management.com/articles/cash-flow-forecasting/) project the routine flows.",
        },
        {
          type: "formula",
          text: "Moving average: F(t+1) = mean of the last n actuals    ·    Exponential smoothing: F(t+1) = αA(t) + (1 − α)F(t)",
          where: [
            "A(t) = actual value in period t; F(t) = the forecast made for period t",
            "α = smoothing constant between 0 and 1, where a higher α weights recent data more",
          ],
        },
        {
          type: "p",
          text: "Take the lecture's numbers. Five days of collections of ZMW 110,000, 120,000, 115,000, 122,000 and 126,000 give a moving-average forecast of ZMW 118,600 for day six. Day six actually brings ZMW 124,000, an error of ZMW 5,400.",
        },
        {
          type: "p",
          text: "Smooth it with α = 0.40 and day seven forecasts as 0.40 × 124,000 + 0.60 × 118,600 = ZMW 120,760. **The forecast leans towards the newest evidence without surrendering to it,** and α is the dial that decides how far it leans. Where a flow tracks something else entirely, such as sales volume or units produced, a regression of the form Y = a + bX forecasts it from that relationship instead.",
        },
      ],
      check: {
        question:
          "A treasurer's forecast keeps lagging a steady upward trend in daily collections. Within exponential smoothing, what is the adjustment?",
        options: [
          "Raise α, because weighting recent actuals more makes the forecast respond faster to the trend",
          "Lower α, because older data is more reliable",
          "Switch to a longer moving average, which reacts faster",
          "Abandon forecasting, since collections are trending",
        ],
        answer: 0,
        explain:
          "α controls how fast the forecast chases the data. At α = 0.9 the forecast is mostly last period's actual, and at α = 0.1 it barely moves. A forecast lagging a genuine trend needs more weight on the new evidence, and a longer moving average does the opposite: it smooths harder and lags more.",
      },
    },
  ],
};
