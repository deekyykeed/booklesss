/* TM · Lesson 2 Working capital · Step 3 — Cash management and forecasting
 *
 * Source: 07 PPTX 3 (Cash Management) + 08_Cash Forecasting PPTXs;
 *         build_tm_2_3_cash-management.py (PDF). Baumol and Miller-Orr worked
 *         examples kept at the lecture's figures. The lecture PDF's Miller-Orr
 *         intermediate steps are garbled (mixed decimal forms of the daily
 *         rate); the workings here use i = 0.025% a day, which reproduces the
 *         lecture's final answers (spread 7,400; upper limit 8,400; return
 *         point 3,467).
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "cash-management",
  label: "Cash management & forecasting",
  title: "Cash management and cash flow forecasting",
  kicker: "Working capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "why-cash-management",
      heading: "Why cash management matters",
      blocks: [
        {
          type: "p",
          text: "Holding cash has an opportunity cost: money in the vault earns nothing while it could be generating returns elsewhere. Cash management balances the liquidity of cash against the profitability forgone by holding it, and the rule is exact — hold cash only until the marginal value of liquidity equals the interest lost. Beyond that point, excess cash is idle capital.",
        },
        {
          type: "p",
          text: "In practice the job is two things at once: optimising the amount of cash available to meet obligations, and maximising the interest earned on surplus funds not needed immediately. The time value of money shapes both. Banks pay more on longer-notice accounts — the longer the money is tied up, the better the rate — and charge more on overdrafts than on term loans, because flexibility is what you are paying for. Treasury switches money between accounts to minimise aggregate cost, netting the interest differentials against the transaction costs of moving the funds.",
        },
        {
          type: "callout",
          text: "Hold cash only until the marginal value of liquidity equals the interest lost. Everything in this step is machinery for finding that point.",
        },
      ],
      check: {
        question:
          "A firm keeps ZMW 3 million in a non-interest current account \"to be safe\", though its worst month ever needed ZMW 1 million. What is the cost of that policy?",
        options: [
          "The interest forgone on roughly ZMW 2 million of permanently idle cash — liquidity held far beyond its marginal value",
          "Nothing — cash in the bank is never a cost",
          "The bank's account maintenance fee only",
          "The risk that the bank fails",
        ],
        answer: 0,
        explain:
          "Safety is worth holding cash for — up to the point where the extra liquidity stops being used. The ZMW 2 million above any observed need buys no additional safety and forgoes interest every day, which is precisely the opportunity cost cash management exists to cut.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "baumol",
      heading: "The Baumol model",
      blocks: [
        {
          type: "p",
          text: "The Baumol model finds the desirable cash balance when cash needs are known with certainty. It treats cash like inventory: withdrawing from the investment account costs a fixed fee per transaction, while holding cash forgoes interest — and the optimum balances the two, exactly as EOQ balances ordering against holding costs.",
        },
        {
          type: "p",
          text: "Its assumptions are the model's boundaries: disbursements are known and occur uniformly through the period, the opportunity cost is constant, and the transaction cost is constant regardless of the amount moved.",
        },
        {
          type: "formula",
          text: "C = √(2AF ÷ O)",
          where: [
            "C = optimum cash balance to transfer each time",
            "A = annual cash disbursements",
            "F = fixed cost per transaction",
            "O = opportunity cost (the interest rate)",
          ],
        },
        {
          type: "p",
          text: "The lecture's example: ABC Ltd disburses ZMW 300,000 a year, the bank pays 10% on money held on deposit, and each withdrawal costs ZMW 20. C = √(2 × 20 × 300,000 ÷ 0.10) = √120,000,000 ≈ ZMW 11,000.",
        },
        {
          type: "table",
          columns: [{ label: "Result" }, { label: "Working" }, { label: "Value", align: "right" }],
          rows: [
            ["Optimum transfer", "√(2 × 20 × 300,000 ÷ 0.10)", "11,000"],
            ["Transactions per year", "300,000 ÷ 11,000", "27"],
            ["Average balance held", "11,000 ÷ 2", "5,500"],
            ["Annual transaction cost", "27 × 20", "540"],
            ["Annual opportunity cost", "5,500 × 10%", "550"],
          ],
          total: ["Total annual cost", "540 + 550", "1,090"],
          note: "Amounts in ZMW.",
        },
        {
          type: "p",
          text: "At the optimum the two costs nearly equalise — ZMW 540 of fees against ZMW 550 of interest forgone — which is the signature of the model working. Any higher balance holds too much idle cash; any lower balance churns too many withdrawals.",
        },
      ],
      check: {
        question:
          "In the Baumol model, the bank doubles its per-withdrawal fee. What happens to the optimum cash balance?",
        options: [
          "It rises — with transfers costlier, the firm makes fewer, larger withdrawals and holds more cash between them",
          "It falls — expensive transfers mean holding less cash",
          "Nothing — the optimum depends only on the interest rate",
          "It exactly doubles",
        ],
        answer: 0,
        explain:
          "F sits inside the square root, so doubling it raises C by √2 (about 41%), not double. Directionally, dearer transactions push the balance up for the same reason a dearer order cost raises EOQ: you economise on the thing that got expensive.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "miller-orr",
      heading: "The Miller-Orr model",
      blocks: [
        {
          type: "p",
          text: "Miller and Orr relax the assumption Baumol cannot live without: certainty. Their model is stochastic, built for the real world where daily cash flows wander unpredictably. Instead of one optimum balance it sets control limits — a lower limit at which you sell marketable securities to raise cash, an upper limit at which you buy securities to shed cash, and a return point the balance is brought back to after either transaction.",
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
          text: "The lecture's example: a lower limit of ZMW 1,000, a daily interest rate of 0.025%, daily cash-flow standard deviation of ZMW 500 (variance 250,000), and ZMW 20 per securities transaction. Z = 3 × ∛(3 × 20 × 250,000 ÷ (4 × 0.00025)) = 3 × ∛15,000,000,000 ÷ … ≈ ZMW 7,400.",
        },
        {
          type: "table",
          columns: [{ label: "Control level" }, { label: "Working" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Lower limit", "set by management", "1,000"],
            ["Spread Z", "3 × ∛(3 × 20 × 250,000 ÷ (4 × 0.00025))", "7,400"],
            ["Upper limit", "1,000 + 7,400", "8,400"],
            ["Return point", "1,000 + 7,400 ÷ 3", "3,467"],
          ],
        },
        {
          type: "p",
          text: "Read as instructions: if cash falls to ZMW 1,000, sell securities to bring the balance back to ZMW 3,467. If it rises to ZMW 8,400, buy securities down to the same return point. Between the limits, do nothing — the model's insight is that constant tinkering is itself a cost.",
        },
        {
          type: "callout",
          text: "Baumol assumes certainty; Miller-Orr handles uncertainty. Since real cash flows are rarely certain, Miller-Orr is almost always the right model to reach for in an exam scenario with volatile flows.",
        },
      ],
      check: {
        question:
          "Under the lecture's Miller-Orr figures, the balance drifts up to ZMW 8,400. What does the model instruct?",
        options: [
          "Buy ZMW 4,933 of securities, returning the balance to the ZMW 3,467 return point",
          "Sell securities to raise the balance to the upper limit",
          "Do nothing until the balance reaches the lower limit",
          "Buy securities down to the ZMW 1,000 lower limit",
        ],
        answer: 0,
        explain:
          "Touching the upper limit triggers a purchase of securities equal to the gap down to the return point — 8,400 − 3,467 = 4,933 — not down to the lower limit, which would just maximise the chance of an immediate opposite transaction. The return point sits a third of the way up because raising cash (hitting the floor) is costlier than parking it.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "forecasting",
      heading: "Cash flow forecasting",
      blocks: [
        {
          type: "p",
          text: "Forecasting is what turns cash management from reaction into planning: estimate future inflows and outflows, generate a pro-forma cash position for the period, then decide in advance how to cover the deficits (borrowing, asset sales) and where to place the surpluses. It serves liquidity management first, but also control — an unexplained gap between forecast and actual is how mistimed payments, collection delays and fraud surface — plus capital budgeting, FX exposure planning and regulatory compliance.",
        },
        {
          type: "p",
          text: "The workhorse is the receipts and disbursements method: schedule expected collections and other inflows, schedule payments — purchases, payroll, taxes, interest, dividends, capex — and net them against the minimum cash balance required. Distribution forecasts refine single large events, using the historical pattern of how (say) a big collection actually arrives over several days. Statistical methods project the routine flows.",
        },
        {
          type: "formula",
          text: "Moving average: F(t+1) = mean of the last n actuals    ·    Exponential smoothing: F(t+1) = αA(t) + (1 − α)F(t)",
          where: [
            "A(t) = actual value in period t; F(t) = the forecast made for period t",
            "α = smoothing constant between 0 and 1 — higher α weights recent data more",
          ],
        },
        {
          type: "p",
          text: "The lecture's numbers: five days of collections of ZMW 110,000, 120,000, 115,000, 122,000 and 126,000 give a moving-average forecast of ZMW 118,600 for day six. Day six actually brings ZMW 124,000 — an error of ZMW 5,400. Exponential smoothing with α = 0.40 then forecasts day seven as 0.40 × 124,000 + 0.60 × 118,600 = ZMW 120,760: the forecast leans towards the newest evidence without surrendering to it. Where a cash flow tracks another variable — sales volume, production units — regression (Y = a + bX) forecasts it from the relationship instead.",
        },
      ],
      check: {
        question:
          "A treasurer's forecast keeps lagging a steady upward trend in daily collections. Within exponential smoothing, what is the adjustment?",
        options: [
          "Raise α — weighting recent actuals more makes the forecast respond faster to the trend",
          "Lower α — older data is more reliable",
          "Switch to a longer moving average, which reacts faster",
          "Abandon forecasting, since collections are trending",
        ],
        answer: 0,
        explain:
          "α controls how fast the forecast chases the data: at α = 0.9 the forecast is mostly last period's actual, at α = 0.1 it barely moves. A lagging forecast under a genuine trend needs more weight on the new evidence. A longer moving average does the opposite — it smooths harder and lags more.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "surpluses-and-overdrafts",
      heading: "Investing surpluses, borrowing shortfalls",
      blocks: [
        {
          type: "p",
          text: "Surpluses arise from seasonality, uneven project timing, unexpected recoveries. Before placing one, ask four questions: how long can the cash be tied up, how much is available, what return can be earned, and what does early withdrawal cost?",
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
              "Liquidity plus interest; access on notice",
            ],
            [
              "Term deposits",
              "Fixed amount for a fixed period (30–120 days), tiered rates",
              "Better rates for longer commitment; no early access",
            ],
            [
              "Certificates of deposit",
              "Fixed-rate bank instruments",
              "Tradeable on the discount market — reasonable liquidity",
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
        {
          type: "p",
          text: "On the borrowing side, the default tool is the bank overdraft: a short-term advance on the current account up to an agreed limit, with interest charged on the daily balance actually drawn. Its strengths are flexibility, light documentation and paying only for what you use; its weaknesses are that it is repayable on demand, secured, and floats with base rates — the healthier the borrower, the better the rate. The forecast is what keeps the overdraft cheap: shortfalls seen in advance can be funded on better terms than shortfalls discovered on the day.",
        },
      ],
      check: {
        question:
          "A surplus of ZMW 2 million is definitely not needed for 90 days. The options are a call deposit at 2% or a 91-day T-bill annualising 4.05%. What should treasury do, and why?",
        options: [
          "Take the T-bill — the cash's availability horizon matches the bill's maturity, so the extra yield costs nothing in liquidity",
          "Take the call deposit — instant access is always worth more than yield",
          "Split it 50/50 to diversify",
          "Leave it in the current account pending a decision",
        ],
        answer: 0,
        explain:
          "The four questions resolve it: the money is free for exactly the bill's life, so the bill's illiquidity never binds and its doubled return is a free gain. Liquidity is only worth paying for when there is a real chance of needing the cash early.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "cash-concentration",
      heading: "Cash concentration",
      blocks: [
        {
          type: "p",
          text: "A multi-site organisation holds many accounts across regions and units, and scattered money is hard to use: centralised payments are awkward to fund, surpluses too small to invest well, the true cash position invisible. Cash concentration pools it. There are two families of technique.",
        },
        {
          type: "p",
          text: "Physical sweeping moves the cash. A zero balance account (ZBA) arrangement sweeps every subsidiary account to zero into the concentration account at each day's end, transferring funds back when a subsidiary goes overdrawn. Constant balancing keeps a pre-set minimum in each account and sweeps only the excess. Trigger balances sweep only when an account passes a threshold — fewer transfers, at the cost of more cash sitting decentralised between sweeps.",
        },
        {
          type: "p",
          text: "Notional pooling moves nothing: the bank calculates interest on the combined credit and debit balances of all the accounts while each subsidiary keeps daily control of its own money. Interest is earned on the net pool, intercompany loans and transfer fees never arise, and global pooling can even offset multicurrency balances without FX transactions. The catch is regulatory — notional pooling is not permitted in some countries, including parts of Africa.",
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
          "Notional pooling — interest is computed on the combined balances without moving the funds",
          "Zero balance accounts — every account swept to zero daily",
          "Trigger balances — sweeps above a threshold",
          "Constant balancing — sweeps above a fixed minimum",
        ],
        answer: 0,
        explain:
          "All three sweeping variants physically remove cash from subsidiary control at some point. Notional pooling is the only technique that delivers pool-level interest while every account keeps its money — which is exactly the trade regulators in some jurisdictions restrict.",
      },
    },
  ],
};
