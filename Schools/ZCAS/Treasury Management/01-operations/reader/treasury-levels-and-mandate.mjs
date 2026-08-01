/* TM · Lesson 1 Operations · Step 1.2: How treasury work divides, and what it is for
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
 */

export default {
  slug: "treasury-levels-and-mandate",
  label: "Levels and mandate",
  title: "How treasury work divides, and what it is for",
  kicker: "Treasury operations",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "task-levels",
      heading: "Strategic, tactical and operational",
      blocks: [
        {
          type: "p",
          text: "Take one exposure and watch it pass through all three levels. A Zambian miller buys wheat in US dollars and sells flour in kwacha, so every consignment carries [currency risk](https://corporatefinanceinstitute.com/resources/derivatives/hedging/).",
        },
        {
          type: "p",
          text: "The board decides the company will cover at least 70% of its dollar purchases and will never trade currency for profit. That is policy, it holds for years, and it is **strategic**. The treasurer then looks at the next two quarters of wheat orders and covers the March and June exposures with [[forward contracts|An agreement to buy or sell a set amount of currency on a set future date at a price fixed today. It removes the uncertainty: you know in January what March's dollars will cost you.]], a decision about specific exposures over months, which is **tactical**. On the morning a [forward](https://corporatefinanceinstitute.com/resources/derivatives/forward-contract/) matures, someone instructs the bank, checks the funds landed and files the confirmation. That is **operational**.",
        },
        {
          type: "p",
          text: "Same risk, three different jobs, three different people. **You sort tasks by time horizon, not by how important they sound.** That is the call you make the first time you decide what stays on your desk.",
        },
        {
          type: "table",
          columns: [{ label: "Level" }, { label: "Focus" }, { label: "Examples" }],
          rows: [
            [
              "Strategic",
              "Long-term policy",
              "Capital structure, dividend policy, capital raising, investment returns",
            ],
            [
              "Tactical",
              "Medium-term decisions",
              "Cash investment management, hedging currency or interest rate risk",
            ],
            [
              "Operational",
              "Daily execution",
              "Transmitting cash, placing surplus funds, bank communications",
            ],
          ],
        },
        {
          type: "callout",
          text: "Classify by time horizon: **strategic = long-term policy, tactical = medium-term decisions, operational = daily execution.**",
        },
      ],
      check: {
        question:
          "Deciding to hedge next year's USD exposure with forward contracts is which level of treasury task?",
        options: [
          "Tactical, a medium-term decision about managing a specific exposure",
          "Strategic, since anything involving currency is long-term policy",
          "Operational, since hedging is daily execution",
          "None, since hedging is a board matter rather than a treasury task",
        ],
        answer: 0,
        explain:
          "The time horizon decides it. Setting the company's overall risk appetite is strategic; sending today's payment instructions is operational; choosing to hedge a defined exposure over the coming months sits between them, which is tactical.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "cost-vs-profit-centre",
      heading: "Cost centre or profit centre",
      blocks: [
        {
          type: "p",
          text: "On 26 February 1995 Barings Bank collapsed. It was 233 years old. Days later it was sold to ING for **one pound**. One trader in Singapore, [Nick Leeson](https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/rogue-trader/), had built losses of around **£827 million** on futures positions and buried them in an [[error account|A holding account for trades that fail to settle cleanly, meant to be cleared and reconciled daily by someone other than the dealer. Left unchecked it becomes a place to park losses.]] numbered 88888 that nobody else reconciled, for roughly three years. **He dealt the trades and he settled them:** he was the [[front office|The dealers, the people who actually strike trades. The back office confirms, settles and records them. Keeping the two apart is the single most important treasury control.]] and the back office at the same time.",
        },
        {
          type: "p",
          text: "Leeson was not employed to make money by taking positions. He was there to [[arbitrage|Buying and selling the same thing in two markets at once to pocket a small price difference, with almost no risk because both legs are locked in together. It stops being arbitrage the moment one leg is left open.]] small price differences at almost no risk. Why he got so much further than that is this section's subject. It turns on a decision most owners make without noticing: **what you decide treasury is actually for.**",
        },
        { type: "h2", text: "Treasury as a cost centre" },
        {
          type: "p",
          text: "Most companies run treasury as a **cost centre**, a [support function that is not expected to generate profit](https://corporatefinanceinstitute.com/resources/accounting/cost-structure/), only to control what it spends. That is the safe framing, and it has one real weakness. **Management starts asking what treasury costs rather than what it saves.** The function gets starved of budget, staff and systems until something it was watching goes wrong. If you set the budget, that failure is yours, not the treasurer's.",
        },
        { type: "h2", text: "Treasury as a profit centre" },
        {
          type: "p",
          text: "Companies deep in global finance, currency or commodities sometimes run treasury as a **profit centre**, earning income by trading, hedging, and charging internal business units market rates for its services. The advantages are real. Units paying a real price learn what treasury costs the group, and the treasurer has a reason to run the desk efficiently. So are the dangers: **the pull towards speculation**, arguments over internal charges, higher administration costs.",
        },
        {
          type: "callout",
          text: "A profit centre is not forbidden, and plenty of firms run one well. What Barings shows is that **the moment profit becomes the measure, the controls in the next section stop being paperwork.** They become the only thing standing between your company and a trader with a losing position to hide.",
        },
      ],
      check: {
        question:
          "A company moves treasury to a profit centre and its dealers begin taking positions beyond what hedging requires. What does the Barings case say about this situation?",
        options: [
          "It is the classic warning: profit incentives without independent controls invite speculation that can destroy the firm",
          "It is healthy, because a profit centre should maximise trading income",
          "It is impossible, because profit centres cannot take positions",
          "It only matters for banks, not corporates",
        ],
        answer: 0,
        explain:
          "Barings fell because one person could deal, settle and conceal without oversight while chasing trading profit. The lesson is not that profit centres are forbidden. It is that the controls in the next section stop being optional the moment profit incentives appear.",
      },
    },

  ],
};
