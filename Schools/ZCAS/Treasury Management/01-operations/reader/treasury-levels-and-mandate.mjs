/* TM · Lesson 1 Operations · Step 1.2: The Three Levels of Treasury
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
 * 2026-08-01 opening rewritten (rule W-13). It read "Take one exposure and
 * watch it pass through all three levels" — a stage direction announcing the
 * teaching device, built on a word the reader had not met (`exposure`) and a
 * count they could not yet resolve (`all three levels`, before any level is
 * named). The device itself is right and is kept; only the narration of it is
 * gone. The miller now arrives first, the risk is shown before it is named,
 * and `exposure` is defined in the sentence that introduces it.
 *
 * 2026-08-01 the three levels became a `cards` block (rule E-9). They were a
 * three-column table, which on a phone was the worst thing on the page: the
 * Examples column wrapped one word per line and still clipped, so "bank
 * communications" read as "communicatior". Nothing in the table lined up,
 * which is the only reason to use one. Each level is now its own card with a
 * Freehand Duotone mark on the time axis the section teaches: chess for the
 * long game, a calendar for months, a clipboard and clock for daily work.
 * Content is the lecture's, plus one closing line per card naming its horizon.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'How treasury work divides, and what it is for'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared, and opened on a question word. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 2 sections and now holds one: "Strategic, Tactical, Operational". The other
 * section(s) moved to cost-centre-or-profit-centre.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "treasury-levels-and-mandate",
  label: "Strategic, Tactical, Operational",
  title: "Strategic, Tactical, Operational",
  kicker: "The Three Levels of Treasury",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "task-levels",
      heading: "Strategic, tactical and operational",
      blocks: [
        {
          type: "p",
          text: "A Zambian miller orders wheat in January, in US dollars, and pays for it in March. If the kwacha weakens over those two months the same shipment costs more, and the flour was already priced in kwacha. That gap is [currency risk](https://corporatefinanceinstitute.com/resources/derivatives/hedging/), and the money at risk on a single shipment is an exposure. Three different people will each do something about this one exposure, and no two of them are doing the same job.",
        },
        {
          type: "p",
          text: "The board decides the company will cover at least 70% of its dollar purchases and will never trade currency for profit. That is [policy](https://treasury-management.com/articles/how-to-write-a-robust-treasury-policy-and-limit-unwanted-outcomes), it holds for years, and it is strategic. The treasurer then looks at the next two quarters of wheat orders and covers the March and June exposures with [[forward contracts|An agreement to buy or sell a set amount of currency on a set future date at a price fixed today. It removes the uncertainty: you know in January what March's dollars will cost you.]], a [decision about specific exposures over months](https://treasurytoday.com/risk-management/question-answered-hedging-strategies/), which is tactical. On the morning a [forward](https://corporatefinanceinstitute.com/resources/derivatives/forward-contract/) matures, someone instructs the bank, checks the funds landed and files the confirmation. That is operational.",
        },
        {
          type: "p",
          text: "Same risk, three different jobs, three different people. **You sort tasks by time horizon, not by how important they sound.** That is the call you make the first time you decide what stays on your desk.",
        },
        {
          type: "cards",
          cards: [
            {
              icon: "chess",
              title: "Strategic",
              lead: "Long-term policy",
              text: "Capital structure, dividend policy, capital raising, investment returns. Set once and held for years.",
            },
            {
              icon: "calendar",
              title: "Tactical",
              lead: "Medium-term decisions",
              text: "Cash investment management, hedging currency or interest rate risk. Decided over the coming months, inside the policy above.",
            },
            {
              icon: "checklist",
              title: "Operational",
              lead: "Daily execution",
              text: "Transmitting cash, placing surplus funds, bank communications. Done today, and done again tomorrow.",
            },
          ],
        },
        {
          type: "callout",
          kind: "key",
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
  ],
};
