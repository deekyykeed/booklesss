/* TM · Interest Rates · Measuring the Exposure
 *
 * Split out of interest-rate-risk-management.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of interest-rate-risk-management.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "measuring-rate-exposure",
  label: "Measuring the Exposure",
  title: "Measuring the Exposure",
  kicker: "Interest Rates",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "measuring",
      heading: "Measuring the exposure",
      blocks: [
        {
          type: "p",
          text: "One [[basis point|A hundredth of one percent. Rates are quoted in them because \"the rate went up 50 basis points\" cannot be misread, while \"the rate went up half a percent\" can mean two different things.]] on a ZMW 1 million loan over six months is ZMW 50. A basis point is a hundredth of one percent, and ZMW 50 sounds like nothing, right up until you ask how many of them the Monetary Policy Committee has moved in a bad year.",
        },
        {
          type: "p",
          text: "**You cannot decide whether to hedge until the exposure is a number,** and three tools turn it into one. The first is gap analysis, which groups assets and liabilities by the date they reprice.",
        },
        {
          type: "formula",
          text: "Gap = RSA − RSL",
          where: [
            "RSA = rate-sensitive assets repricing in the period",
            "RSL = rate-sensitive liabilities repricing in the period",
          ],
        },
        {
          type: "p",
          text: "A positive gap means more assets than liabilities reprice, so rising rates lift your net interest income. A negative gap means the reverse. **The sign of the gap tells you which direction to hedge in,** which is the question people usually get wrong before they get the size wrong.",
        },
        { type: "h2", text: "Duration, and turning it into money" },
        {
          type: "formula",
          text: "Price change (%) ≈ −Duration × yield change (%)",
          where: [
            "Duration = the weighted-average time, in years, to receive a bond's cash flows",
            "A 5-year-duration bond loses roughly 5% of value if yields rise 1%, meaning 100 basis points",
          ],
        },
        {
          type: "p",
          text: "[Duration](https://corporatefinanceinstitute.com/resources/fixed-income/duration/) is the sensitivity measure for anything fixed-income you hold, and basis point value turns it into cash: the effect of a 0.01% move. On ZMW 1 million over six months that is 1,000,000 × 0.0001 × 0.5 = ZMW 50 a year. Small per point, which is the whole reason exposures are quoted this way. Multiply by the number of points you actually fear and it stops being a percentage and becomes a decision.",
        },
        {
          type: "callout",
          kind: "example",
          text: "Turn one into a number yourself. In a bank's one-year bucket, ZMW 260 million of assets reprice and ZMW 380 million of liabilities do. The MPC then raises rates by 1.5%. Work the gap, then what it costs over the year. The point of netting them first is that both sides move: the assets earn the new rate too, and the gap is the part of the book where that does not cancel out.",
        },
      ],
      check: {
        question:
          "Assets of ZMW 260 million and liabilities of ZMW 380 million reprice within the year, and rates rise 1.5%. What happens to net interest income?",
        options: [
          "It falls by about ZMW 1.8 million",
          "It rises by about ZMW 1.8 million",
          "It falls by about ZMW 5.7 million",
          "It falls by about ZMW 9.6 million",
        ],
        answer: 0,
        explain:
          "Gap = 260 − 380 = −ZMW 120 million, and −120,000,000 × 1.5% = **a fall of ZMW 1.8 million**. A rise of 1.8 million has the size right and the sign backwards: a negative gap means the cost side reprices first, so rising rates hurt. A fall of 5.7 million charges the whole ZMW 380 million with the increase and forgets that the 260 million of assets is earning the new rate as well. Netting them is the entire idea of a gap. A fall of 9.6 million adds the two sides instead of subtracting them, which would make a perfectly matched book the most exposed one rather than the least.",
      },
    },
  ],
};
