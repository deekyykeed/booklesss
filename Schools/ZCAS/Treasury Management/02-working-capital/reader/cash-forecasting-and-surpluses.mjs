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
 */

export default {
  slug: "cash-forecasting-and-surpluses",
  label: "Forecasting the cash",
  title: "Forecasting the cash, and putting it to work",
  kicker: "Working capital",

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
          text: "Price the alternative before you read on. Your forecast frees **ZMW 4 million** for exactly **73 days**. The bank's call deposit pays **6%** a year, and a 73-day treasury bill is on offer at **98**. Annualise the bill, then say which one you take. Two traps sit in one line of arithmetic: **the yield is measured against what you pay, not against the 100 you get back,** and a 73-day return is not an annual one until you scale it.",
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

    /* ---------------------------------------------------------------- */
    {
      id: "cash-concentration",
      heading: "Cash concentration",
      blocks: [
        {
          type: "p",
          text: "Eleven accounts across four regions, each holding a bit, and not one of them holding enough to place at a rate worth having. **Scattered money is money you cannot use,** and it is also why nobody in the group can say what the real cash position is.",
        },
        {
          type: "p",
          text: "[Pooling](https://treasurytoday.com/cash-management/cash-pooling/) fixes it, and there are two families of technique. The difference between them is simply whether the cash physically moves.",
        },
        { type: "h2", text: "Physical sweeping" },
        {
          type: "p",
          text: "A zero balance account arrangement sweeps every subsidiary account to nothing at the close of each day, into one concentration account, and funds them back when a subsidiary goes overdrawn. Constant balancing leaves a set minimum in each account and sweeps only what is above it. Trigger balances sweep only once an account crosses a threshold, which means fewer transfers and more cash sitting where it started in between.",
        },
        { type: "h2", text: "Notional pooling" },
        {
          type: "p",
          text: "[Notional pooling](https://treasury-management.com/articles/cash-pooling/) moves nothing at all. The bank simply calculates interest across the combined credit and debit balances while each subsidiary keeps daily control of its own money. No [[intercompany loan|A loan from one company in a group to another, which is what a physical sweep creates whether anyone intends it or not. It has to be documented, priced and often taxed, which is administration a notional pool never generates.]] arises, no transfer fees are paid, and a global pool can even offset balances in different currencies without an FX transaction. **The catch is regulatory: notional pooling is not permitted everywhere, including in parts of Africa,** so it is a question for your bank before it is a question for your treasury.",
        },
        {
          type: "table",
          columns: [{ label: "Feature" }, { label: "Physical sweeping (ZBA)" }, { label: "Notional pooling" }],
          rows: [
            ["Funds physically moved", "Yes", "No"],
            ["Intercompany loans", "May arise", "Not required"],
            ["Transfer fees", "Per sweep", "None"],
            ["Subsidiary control of cash", "Lost at day end", "Retained"],
            ["Regulatory availability", "Generally available", "Restricted in some countries"],
          ],
        },
      ],
      check: {
        question:
          "A group wants pooled interest across its subsidiaries' accounts, but each subsidiary must keep day-to-day control of its own cash. Which technique fits?",
        options: [
          "Notional pooling, because interest is computed on the combined balances without moving the funds",
          "Zero balance accounts, with every account swept to zero daily",
          "Trigger balances, sweeping above a threshold",
          "Constant balancing, sweeping above a fixed minimum",
        ],
        answer: 0,
        explain:
          "All three sweeping variants physically remove cash from subsidiary control at some point in the day. Notional pooling is the only technique that delivers pool-level interest while every account keeps its money, which is exactly the arrangement some regulators restrict.",
      },
    },
  ],
};
