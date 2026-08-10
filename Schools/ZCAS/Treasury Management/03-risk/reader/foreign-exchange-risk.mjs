/* TM · Lesson 3 Risk · Step 2a — Currency risk, and how rates are quoted
 *
 * Source: 10_Foreign Exchange Risk Management PPTX;
 *         build_tm_3_2_fx-risk.py (PDF). Worked figures kept at the lecture's
 *         originals (USD/ZMW 12.50 six-month forward calculation).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one six-section step. The seam is
 * between the risk and the price of a currency (what the exposure is, how a
 * quote reads, where a forward rate comes from) and what you do about it
 * (operational hedges, forwards and futures, options). Coverage is identical;
 * nothing was cut. This part keeps the `foreign-exchange-risk` slug because
 * that URL exists; the second half is `hedging-currency-risk`.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 *
 * Engagement (D-1): every section opened on a definition of the thing it was
 * named after. Each now opens on a figure or a decision: the ZMW 250,000 that
 * goes missing between January and April, the side of the spread that is yours,
 * a forward of 13.00 that is not a forecast.
 *
 * Voice (D-2/W-9): "classifying which one a scenario describes is the first
 * mark in most exam questions" was the step's second sentence. Exam framing is
 * gone; the reader is the person carrying the exposure.
 *
 * Emphasis (D-2): across the original six sections, 0 bold, 0 tappable terms
 * and 0 source links became 14, 6 and 13. 54 em dashes became 0 (W-11).
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). §2's check reused the
 * section's own 12.48/12.52 quote, so the sum was one multiplication off a
 * sentence the reader had just read, and the cross-rate formula, the harder
 * of the two things the section teaches, was never tested at all. The handover
 * is a two-leg cross rate WITH both spreads, which is the exam's own shape.
 * On C-9's 'change the figures, not the difficulty': this is a step up, and it
 * is judged to be within the rule because both mechanisms are worked in the
 * section (the spread rule and the cross rate) and the callout scaffolds the
 * order to do them in. The distractor at ZMW 3,906,000 is the instructive one:
 * it takes the worse side of one leg and the better side of the other, which
 * is what being on the wrong side of the second spread actually feels like.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Currency risk, and how rates are quoted'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "The Three FX Exposures". The other
 * section(s) moved to quotations-and-cross-rates.mjs, forward-exchange-rates.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "foreign-exchange-risk",
  label: "The Three FX Exposures",
  title: "The Three FX Exposures",
  kicker: "Currency",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "three-exposures",
      heading: "The three FX exposures",
      blocks: [
        {
          type: "p",
          text: "You sign an export order in January for USD 500,000, with the dollar at 12.50 kwacha, and you book it at ZMW 6,250,000. The customer pays in April. If the kwacha has strengthened to 12.00 by then, the same order is worth ZMW 6,000,000. **Nobody did anything wrong and a quarter of a million kwacha is gone.**",
        },
        {
          type: "p",
          text: "[Currency risk](https://corporatefinanceinstitute.com/resources/economics/foreign-exchange-risk/) turns up the moment you deal in more than one currency, whether through cross-border sales and purchases, foreign borrowings or a subsidiary abroad. It arrives in three forms, and telling them apart matters because each one is managed by a different tool.",
        },
        { type: "h2", text: "Transaction exposure" },
        {
          type: "p",
          text: "This is the one above: a committed cash flow in a foreign currency, waiting to be converted. **It is the most immediate exposure and the only one you can write down completely,** because it has an amount, a currency and a date. That is also why it is the one most [[hedging|Taking a second position that moves the opposite way to a risk you already carry, so the two cancel out. You give up some upside to remove the downside. Insurance, not a bet.]] instruments are built for.",
        },
        { type: "h2", text: "Translation exposure" },
        {
          type: "p",
          text: "[Consolidating a foreign subsidiary](https://corporatefinanceinstitute.com/resources/economics/translation-exposure/) means restating its assets, liabilities and earnings in your currency at a new rate. Reported equity and profit move, and not one kwacha changes hands. It is an accounting effect, which is why people wave it away, and **a loan covenant written on reported numbers does not care that no cash moved.**",
        },
        { type: "h2", text: "Economic exposure" },
        {
          type: "p",
          text: "[The long-run one](https://corporatefinanceinstitute.com/resources/economics/economic-exposure/): a stronger kwacha makes your prices less competitive abroad, so the sales you were going to win next year quietly go to someone else. There is no contract to hedge, because the loss is in business you never booked. It is the hardest to quantify and the one that decides where the company ends up.",
        },
      ],
      check: {
        question:
          "A Zambian group's Tanzanian subsidiary made a normal profit, but consolidation at this year's weaker shilling rate cuts the group's reported equity. No cash moved. Which exposure is that?",
        options: [
          "Translation exposure, an accounting restatement effect of consolidation rather than a cash flow",
          "Transaction exposure, since the subsidiary's profit is a committed cash flow",
          "Economic exposure, since the group's competitiveness has changed",
          "None, because if no cash moved there is no exposure",
        ],
        answer: 0,
        explain:
          "The loss exists only in the consolidated statements, which is the defining mark of translation exposure. It still matters, because covenants and investors read those statements, but it is managed differently from transaction exposure, where actual kwacha proceeds are at stake.",
      },
    },
  ],
};
