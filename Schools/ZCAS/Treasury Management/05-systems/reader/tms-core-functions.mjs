/* TM · Inside a TMS · The Five Core Functions
 *
 * Split out of treasury-management-systems.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of treasury-management-systems.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "tms-core-functions",
  label: "The Five Core Functions",
  title: "The Five Core Functions",
  kicker: "Inside a TMS",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "core-functions",
      heading: "The five core functions",
      blocks: [
        {
          type: "p",
          text: "At 09:14 a dealer agrees to sell two million US dollars against the kwacha in March, at a rate fixed today. By 09:15 that one action has to be [visible in five different places](https://corporatefinanceinstitute.com/resources/accounting/treasury-management/), and in a spreadsheet treasury it gets typed into five of them.",
        },
        {
          type: "p",
          text: "**Enter the deal once, and let the single record feed everything downstream.** That is the whole design, and the five functions below are just that record's life: it is captured, it joins a [[position|Everything you currently hold or owe in one instrument or currency, netted to a single figure. The system knows your dollar position; a spreadsheet knows what was typed into it.]], it is measured for risk, it settles, and it is reported.",
        },
        {
          type: "table",
          columns: [{ label: "Function" }, { label: "What it does" }],
          rows: [
            [
              "Deal capture",
              "Every deal, whether a borrowing, an FX sale, a bond purchase or a swap, entered once with full terms: counterparty, amount, rate, maturity, settlement instructions",
            ],
            [
              "Position management",
              "Deals aggregate into positions: total cash by currency and unit, net FX exposure, debt by counterparty and tenor, investments at cost and current value",
            ],
            [
              "Risk analytics",
              "Value at Risk, duration, FX and rate sensitivity, counterparty exposure, computed continuously and compared to policy limits, with alerts on breach",
            ],
            [
              "Settlement and reconciliation",
              "Tracks each deal through clearing to settlement, whether settled, pending or failed, and matches bank confirmations against deal records",
            ],
            [
              "Reporting",
              "Real-time dashboards of cash, portfolio and risk, plus reports for management, board, auditors and regulators",
            ],
          ],
        },
        {
          type: "p",
          text: "Read the table as one deal moving down it rather than as five modules you buy. That is also how you test a vendor's demonstration: book something on the first screen, and ask to see it arrive on the other four without anyone typing.",
        },
      ],
      check: {
        question:
          "In a TMS, a dealer books a swap once and it immediately appears in positions, risk numbers and settlement tracking. What principle is at work?",
        options: [
          "Single entry feeding all downstream processes, the design that removes re-keying and the errors it breeds",
          "Segregation of duties, since one entry means one person controls everything",
          "Netting, since the swap offsets other deals automatically",
          "Straight-through settlement, since booking a deal settles it",
        ],
        answer: 0,
        explain:
          "Deal capture is the root of the system: one authoritative record, consumed by the position, risk, settlement and reporting modules. That is what kills the transposition and version errors of spreadsheet treasury. Booking is not settling, and the settlement module tracks that separately.",
      },
    },
  ],
};
