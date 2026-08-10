/* TM · Clearing and Settlement · Gross and Net Settlement
 *
 * Split out of clearing-and-settlement.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of clearing-and-settlement.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "gross-and-net-settlement",
  label: "Gross and Net Settlement",
  title: "Gross and Net Settlement",
  kicker: "Clearing and Settlement",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "gross-vs-net",
      heading: "Gross settlement against net",
      blocks: [
        {
          type: "p",
          text: "Bank A owes Bank B ZMW 100 million today, and Bank B owes Bank A ZMW 80 million. Settle each payment as it arrives and ZMW 180 million has to move. Wait until the evening and [net them](https://corporatefinanceinstitute.com/resources/economics/netting/), and **ZMW 20 million moves instead.**",
        },
        {
          type: "p",
          text: "That saving is the entire case for net settlement, and the cost of it is that every payment sitting in the net is unsettled exposure until the evening run. So there are two designs, and the choice between them is risk against cost.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Gross (RTGS)" }, { label: "Net (DNS)" }],
          rows: [
            [
              "How it works",
              "Each payment settled individually, in full, in real time, and final immediately",
              "Payments accumulate through the day and offset; only net differences settle at day's end",
            ],
            [
              "Used for",
              "High-value, time-critical payments: securities trades, large corporate transfers",
              "Routine, lower-value payments: payroll, utilities, interbank retail",
            ],
            ["Cost", "High, since every transaction settles and is charged", "Low, since most flows cancel out"],
            [
              "Liquidity needed",
              "High, because funds must be positioned for each payment",
              "Low, because only the net moves",
            ],
            [
              "Risk",
              "Low, since nothing sits unsettled",
              "Higher, since unsettled positions accumulate until day's end",
            ],
          ],
        },
        {
          type: "p",
          text: "**The routing rule follows the amount, not the preference.** High values settle gross, because a day of unsettled exposure on them would be intolerable. Low values wait for the net, because there the saved cost and saved [[intraday liquidity|The cash a bank has to have sitting available during the day to make each payment as it goes out. Real-time settlement is expensive partly because it forces every bank to hold more of it.]] are worth more than the risk.",
        },
      ],
      check: {
        question:
          "A company must transfer ZMW 45 million to complete a securities purchase today, with finality. Which settlement route, and why?",
        options: [
          "RTGS, because a high-value, time-critical payment needs individual, immediate, final settlement",
          "Deferred net settlement, because cheaper is always better",
          "A cheque, since paper is legally final",
          "Split it into 45 payments of ZMW 1 million through DNS",
        ],
        answer: 0,
        explain:
          "Size and urgency are the routing rule. A DNS payment is not final until the evening run, which is an unacceptable window on ZMW 45 million, and splitting it only multiplies unsettled exposure. RTGS costs more per transaction precisely because it removes that window.",
      },
    },
  ],
};
