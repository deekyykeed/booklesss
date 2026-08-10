/* TM · Payment Systems · Zambia's Payment Systems
 *
 * Split out of payment-systems-and-ccps.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of payment-systems-and-ccps.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "zambias-payment-systems",
  label: "Zambia's Payment Systems",
  title: "Zambia's Payment Systems",
  kicker: "Payment Systems",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "zambia-systems",
      heading: "Zambia's payment systems, and the operational rules",
      blocks: [
        {
          type: "p",
          text: "[Three systems move essentially all the money in this country](https://www.boz.zm/national-payment-systems.htm), and choosing the wrong one costs you either a fee you did not need or a day you did not have. They map straight onto the gross and net designs.",
        },
        {
          type: "table",
          columns: [{ label: "System" }, { label: "Type" }, { label: "Use" }],
          rows: [
            [
              "ZIPSS",
              "Real-time gross settlement",
              "High-value, urgent payments: VAT, securities, large transfers. Pre-funded, immediate finality, no amount limits",
            ],
            [
              "EFT",
              "Deferred net settlement",
              "Routine payments: salaries, utilities, taxes, loan disbursements. Batched daily, credited same day",
            ],
            [
              "CIC",
              "Cheque image clearing",
              "Cheques cleared as scanned images, so T+1 instead of the old T+3",
            ],
          ],
        },
        {
          type: "p",
          text: "So the rule for your own payment run is short. **ZIPSS for urgent and high-value, EFT for the routine payroll-and-suppliers batch,** and cheques only where you have no choice, because even at [[T+1|Settlement one business day after the transaction: hand the cheque over on Tuesday and the money is yours on Wednesday, if it clears.]] they are the slowest and riskiest thing you can hand someone. The Bank of Zambia oversees all three as systemically important.",
        },
        { type: "h2", text: "The two details that catch people out" },
        {
          type: "p",
          text: "**Every system has a cut-off time, and after it your same-day payment is a next-day payment.** It is often around noon. A payment promised for this afternoon and submitted at 14:30 is a broken promise, however real-time the system behind it is, which is why knowing your banks' cut-offs is not an administrative detail.",
        },
        {
          type: "p",
          text: "The second is the daylight overdraft. Your account may run negative during the day against payments going out, provided collections bring it back by close of business. It carries a fee, because the bank is carrying the risk for those hours, and it is the facility that lets a treasury pay out before its receipts land.",
        },
      ],
      check: {
        question:
          "At 14:30 a treasurer submits a large VAT payment due today, and the bank's ZIPSS cut-off was 13:00. What happens?",
        options: [
          "The payment settles tomorrow, because after the cut-off same-day settlement is gone regardless of the system's speed",
          "It settles today anyway, since ZIPSS is real-time",
          "It reroutes automatically through EFT and arrives today",
          "It fails permanently and must be re-keyed next week",
        ],
        answer: 0,
        explain:
          "Real-time settlement operates inside the day's window, and the cut-off is that window's edge. Missing it does not break the payment, it delays finality to the next day and breaks the promise attached to it. That is why the cut-offs belong in your payment calendar rather than in someone's head.",
      },
    },
  ],
};
