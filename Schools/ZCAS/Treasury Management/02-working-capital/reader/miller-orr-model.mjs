/* TM · Optimal Cash Balances · The Miller-Orr Model
 *
 * Split out of cash-management.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of cash-management.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "miller-orr-model",
  label: "The Miller-Orr Model",
  title: "The Miller-Orr Model",
  kicker: "Optimal Cash Balances",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "miller-orr",
      heading: "The Miller-Orr model",
      blocks: [
        {
          type: "p",
          text: "Every model that hands you an optimal cash balance starts by asking what next month's flows are. **You do not know what your cash flows will be.** The Baumol model works only for the business that can answer; the [Miller-Orr model](https://corporatefinanceinstitute.com/resources/financial-modeling/miller-orr-model/) is for everyone else.",
        },
        {
          type: "p",
          text: "Miller and Orr built for that. Their model is [[stochastic|Built on the assumption that the thing being modelled moves randomly rather than predictably. It does not try to say what tomorrow's balance will be, only how far it is likely to wander.]], so it gives you [three control levels rather than one right balance](https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/miller-orr-model/).",
        },
        {
          type: "ul",
          items: [
            "A lower limit, where you sell [[marketable securities|Short-term investments such as treasury bills that can be turned back into cash quickly and at a known price. They are where a treasury parks money it may need at short notice.]] to raise cash.",
            "An upper limit, where you buy securities to shed it.",
            "A return point, which is where you come back to after either move.",
          ],
        },
        {
          type: "formula",
          text: "Spread Z = 3 × ∛( 3F𝜎² ÷ 4i )",
          where: [
            "F = transaction cost of buying or selling securities",
            "𝜎² = variance of daily cash flows",
            "i = daily interest rate",
            "Upper limit = lower limit + Z;  return point = lower limit + Z ÷ 3",
          ],
        },
        {
          type: "p",
          text: "The lecture's figures: a lower limit of ZMW 1,000 set by management, a daily interest rate of 0.025%, and ZMW 20 per securities transaction. Daily cash flows have a standard deviation of ZMW 500, so a variance of 250,000.",
        },
        {
          type: "table",
          columns: [{ label: "Control level" }, { label: "Working" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Lower limit", "set by management", "1,000"],
            ["Inside the root", "3 × 20 × 250,000 ÷ (4 × 0.00025)", "15,000,000,000"],
            ["Spread Z", "3 × ∛15,000,000,000 = 3 × 2,466", "7,400"],
            ["Upper limit", "1,000 + 7,400", "8,400"],
            ["Return point", "1,000 + 7,400 ÷ 3", "3,467"],
          ],
        },
        {
          type: "p",
          text: "Read the three numbers as instructions. Fall to ZMW 1,000 and sell securities until the balance is back to ZMW 3,467. Rise to ZMW 8,400 and buy securities down to the same 3,467. **Between the limits, do nothing,** and that is the real insight: every correction costs ZMW 20, so constant tidying is itself one of the costs the model is minimising.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Baumol assumes certainty and Miller-Orr does not. **Real cash flows wander, so Miller-Orr is the one to reach for whenever the flows in front of you are volatile.**",
        },
        {
          type: "callout",
          kind: "example",
          text: "Set the levels for a different treasury before you read on. Management fixes the lower limit at ZMW 2,000, each securities transaction costs ZMW 30, daily cash flows have a standard deviation of ZMW 600, and the daily interest rate is 0.03%. Work the spread, then the upper limit, then the return point. Watch two things: the formula wants the variance, not the standard deviation, and every level is measured up from the lower limit rather than from zero.",
        },
      ],
      check: {
        question:
          "In that treasury, the balance climbs to the upper limit. What is the return point it should be brought back to?",
        options: [
          "ZMW 5,000",
          "ZMW 3,000",
          "ZMW 6,500",
          "ZMW 2,356",
        ],
        answer: 0,
        explain:
          "Inside the root: 3 × 30 × 360,000 ÷ (4 × 0.0003) = 27,000,000,000, whose cube root is 3,000, so the spread Z = 3 × 3,000 = ZMW 9,000. Upper limit = 2,000 + 9,000 = ZMW 11,000, and the return point = 2,000 + 9,000 ÷ 3 = **ZMW 5,000**, so touching 11,000 means buying ZMW 6,000 of securities. ZMW 3,000 is Z ÷ 3 with the lower limit never added back. ZMW 6,500 puts the return point halfway up the spread instead of a third of the way. That third is the whole asymmetry of the model: running out of cash costs more than parking it. ZMW 2,356 used the ZMW 600 standard deviation where the formula asks for the 360,000 variance.",
      },
    },
  ],
};
