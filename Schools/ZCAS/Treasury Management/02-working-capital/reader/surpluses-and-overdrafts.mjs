/* TM · Forecasting and Surpluses · Surpluses and Overdrafts
 *
 * Split out of cash-forecasting-and-surpluses.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of cash-forecasting-and-surpluses.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "surpluses-and-overdrafts",
  label: "Surpluses and Overdrafts",
  title: "Surpluses and Overdrafts",
  kicker: "Forecasting and Surpluses",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "surpluses-and-overdrafts",
      heading: "Investing surpluses, borrowing shortfalls",
      blocks: [
        {
          type: "p",
          text: "Four questions decide where a surplus goes, and the first one settles most of it: **how long can you genuinely not touch this money?** Then how much of it is there, what will it earn, and what does getting it back early cost.",
        },
        {
          type: "p",
          text: "Surpluses come from seasonality, from projects landing unevenly, from a recovery nobody expected. What they have in common is that they are temporary, which is why the [money market](https://corporatefinanceinstitute.com/resources/economics/money-market/) rather than anything longer is where they belong.",
        },
        {
          type: "table",
          columns: [{ label: "Instrument" }, { label: "What it is" }, { label: "Key feature" }],
          rows: [
            [
              "Treasury bills",
              "Government short-term debt, issued at a discount to par",
              "Low risk, good liquidity, fixed maturity",
            ],
            [
              "Call deposits",
              "Interest-paying accounts with a notice period",
              "Liquidity plus interest, with access on notice",
            ],
            [
              "Term deposits",
              "Fixed amount for a fixed period, 30 to 120 days, tiered rates",
              "Better rates for longer commitment, and no early access",
            ],
            [
              "Certificates of deposit",
              "Fixed-rate bank instruments",
              "Tradeable on the discount market, so reasonable liquidity",
            ],
            [
              "Money market accounts",
              "Variable-rate money market investment",
              "Flexible, market-linked, instant access",
            ],
          ],
        },
        {
          type: "formula",
          text: "T-bill yield = (100 − price) ÷ price × 100    ·    annualised = yield × 365 ÷ days to maturity",
          where: [
            "Example: a 91-day bill bought at 99 yields (100 − 99) ÷ 99 = 1.01%, annualised 1.01% × 365 ÷ 91 = 4.05%",
          ],
        },
        { type: "h2", text: "The other direction" },
        {
          type: "p",
          text: "When the forecast shows a shortfall instead, the default tool is the [bank overdraft](https://corporatefinanceinstitute.com/resources/commercial-lending/revolving-credit-facility/): a short-term advance on the current account up to an agreed limit, charged on the balance you actually draw each day. It is flexible, lightly documented, and you pay only for what you use. It is also [[repayable on demand|The bank can ask for all of it back at any time, without having to give a reason. It is what makes an overdraft the wrong place for anything you cannot repay quickly.]], secured, and priced off base rates.",
        },
        {
          type: "p",
          text: "**The forecast is what keeps that overdraft cheap.** A shortfall you saw three weeks out is funded on terms you negotiated; the same shortfall discovered on the morning is funded on whatever terms are available.",
        },
        {
          type: "callout",
          kind: "example",
          text: "Price the alternative before you read on. Your forecast frees ZMW 4 million for exactly 73 days. The bank's call deposit pays 6% a year, and a 73-day treasury bill is on offer at 98. Annualise the bill, then say which one you take. Two traps sit in one line of arithmetic. The yield is measured against what you pay, not against the 100 you get back. And a 73-day return is not an annual one until you scale it.",
        },
      ],
      check: {
        question:
          "What does that 73-day treasury bill, bought at 98, yield on an annualised basis?",
        options: [
          "About 10.20%",
          "About 10.00%",
          "About 2.04%",
          "About 0.41%",
        ],
        answer: 0,
        explain:
          "(100 − 98) ÷ 98 = 2.0408% over 73 days, and 365 ÷ 73 = 5, so the annualised yield is 2.0408% × 5 = **10.20%**. Take the bill: it pays better than the 6% call deposit, and because the cash is free for exactly the bill's life its illiquidity never binds, so the extra return costs nothing. 10.00% divides by 100 rather than by the 98 actually paid: that is the discount rate, not the yield, and it is the slip that survives because it is always close enough to look right. 2.04% is the 73-day return left unannualised, which would have you turn down 10.2% for 6%. 0.41% multiplies by 73 ÷ 365 instead of 365 ÷ 73.",
      },
    },
  ],
};
