/* TM · Lesson 4 Investment · Step 2 — Investment management
 *
 * Source: 12_Investment Management PPTX; build_tm_4_2_investment-management.py
 *         (PDF). Portfolio worked example kept at the lecture's figures
 *         (ZMW 5m across four tranches, blended 13.4%).
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "investment-management",
  label: "Investment management",
  title: "Investment management",
  kicker: "Debt and investment",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "objectives",
      heading: "Safety, liquidity, yield — in that order",
      blocks: [
        {
          type: "p",
          text: "Surplus cash sits in bank accounts earning nothing until treasury puts it to work, and the rules for putting it to work form a strict hierarchy of three objectives.",
        },
        {
          type: "p",
          text: "Safety first: don't lose the principal. A loss of capital is a failure of treasury's core function, which rules out default risk, credit risk and unnecessary market risk — and accepts that the safest homes, government paper and bank deposits, pay the least. Liquidity second: cash may be needed tomorrow for payroll or in three months for capex, so maturities must ladder to the need, even at the cost of yield. Yield last — the residual objective. You earn what the market gives on whatever surplus remains after the first two are satisfied.",
        },
        {
          type: "callout",
          text: "The hierarchy is strict: never sacrifice safety for yield, never sacrifice liquidity for yield. Treasurers who inverted it have found their high-yield instruments defaulted or frozen exactly when the cash was needed.",
        },
      ],
      check: {
        question:
          "A treasurer moves the payroll reserve into a high-yield 2-year corporate note because \"the return was too good to pass up\". Which objectives were violated?",
        options: [
          "Both safety and liquidity — credit risk on the principal, and a two-year lock on cash needed monthly",
          "None — a higher return serves the company",
          "Only safety — corporate notes are perfectly liquid",
          "Only liquidity — high yield implies high safety",
        ],
        answer: 0,
        explain:
          "Yield was promoted from last to first, over both seniors: the note can default (safety) and cannot be liquidated at par on payday (liquidity). The hierarchy exists precisely because yield is the only objective the market actively tempts you to overweight.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "policy",
      heading: "The investment policy statement",
      blocks: [
        {
          type: "p",
          text: "The hierarchy is enforced through a written investment policy, approved by the board or audit committee, that sets the rules before any money moves.",
        },
        {
          type: "table",
          columns: [{ label: "Policy item" }, { label: "What it fixes" }],
          rows: [
            ["Approved instruments", "What treasury may buy — T-bills only, or also CDs and corporate bonds"],
            ["Credit rating limits", "The minimum acceptable rating — e.g. nothing below BBB for corporates"],
            ["Counterparty limits", "Maximum exposure to any single bank or institution"],
            ["Maturity limits", "How far out money may be committed — e.g. nothing beyond one year for the operating reserve"],
            ["Diversification", "How risk is spread across issuers and instruments"],
            ["Reporting", "How performance is reported to management and board"],
            ["Review and approval", "Who owns the policy and how often it is revisited"],
          ],
        },
        {
          type: "p",
          text: "The policy protects in both directions. It protects the company by removing discretion — no individual can chase yield beyond the guardrails. And it protects treasury: when an investment inside the rules goes bad, the function can show it invested within the approved guidelines, which is the difference between a market loss and a career-ending one.",
        },
      ],
      check: {
        question:
          "An approved instrument, bought inside every policy limit, loses value when its issuer is downgraded. Why does the investment policy still matter here?",
        options: [
          "It separates a market outcome from a control failure — treasury acted within board-approved rules, and the loss triggers policy review, not blame",
          "It doesn't — a loss proves the policy failed",
          "It guarantees the company against losses inside the limits",
          "It transfers the loss to the approving board members personally",
        ],
        answer: 0,
        explain:
          "No policy eliminates market risk; what it does is define authorised risk in advance. A loss inside the rules is the risk the board accepted, reviewed by adjusting the rules. A loss outside them is a control failure. The distinction is what the written document exists to draw.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "instruments",
      heading: "The instruments",
      blocks: [
        {
          type: "p",
          text: "Short-term instruments — under a year — are the liquid, low-risk core of a treasury portfolio. In Zambia the anchor is the BoZ Treasury bill, issued for 91, 182 or 364 days at a discount to par: the safest and most liquid kwacha investment, usually the lowest-yielding — though in the 2023–24 inflation fight, T-bill yields in the mid-20s were an exceptional inversion of that rule. Around it sit call deposits (interest with near-instant access, at a price in rate), term deposits of 30–120 days (better rates for locked money, penalties for early exit), and money market funds (pooled, professionally managed, withdrawable at net asset value — still young in Zambia but growing).",
        },
        {
          type: "p",
          text: "Medium-term instruments — one to five years — mean bonds: government and corporate paper paying regular coupons. The extra yield buys interest rate risk, because bond prices move inversely to rates. The risk only bites if you must sell before maturity — a bond held to maturity delivers its purchase yield regardless of where prices wandered meanwhile — which is why the liquidity objective decides how much medium-term paper a portfolio can carry.",
        },
        {
          type: "formula",
          text: "YTM — the discount rate at which a bond's price equals its future cash flows",
          where: [
            "Bought at par: YTM = coupon rate (an 8% coupon at ZMW 1,000,000 face yields 8%)",
            "Bought at a discount (say 950,000): YTM > 8% — the lower price raises the return",
            "Bought at a premium (say 1,050,000): YTM < 8%",
          ],
        },
        {
          type: "p",
          text: "Yield to maturity, not price, is how bonds are quoted and compared — it folds the coupon, the price paid and the time to maturity into one rate that lines up against the T-bill and deposit rates on the same screen.",
        },
      ],
      check: {
        question:
          "Treasury holds a 3-year bond it intends to keep to maturity. Rates rise and the bond's market price drops 6%. What has the portfolio actually lost?",
        options: [
          "Nothing in cash terms — held to maturity, the bond still delivers its purchase yield; the fall only matters if it must be sold early",
          "6% of the principal, permanently",
          "The coupons, which stop when prices fall",
          "Its investment-grade status",
        ],
        answer: 0,
        explain:
          "Price risk on a bond is realised only by selling. The cash flows — coupons plus face value — are unchanged, so a hold-to-maturity investor earns exactly the YTM they bought. The real constraint is liquidity: the plan to hold must survive the company's need for cash, which is why maturity limits exist.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "credit-and-diversification",
      heading: "Credit risk and diversification",
      blocks: [
        {
          type: "p",
          text: "Every instrument that is not government paper carries credit risk — the risk the issuer defaults. Government bonds in a stable country carry a negligible amount; a bank deposit carries the bank's solvency; a corporate bond carries whatever its rating says. Since the safety objective outranks everything, the policy caps this risk two ways.",
        },
        {
          type: "ul",
          items: [
            "Counterparty limits — no more than a set share of investable cash with any single bank (say 20%), no corporate paper below a set rating, no single issuer above a fixed amount.",
            "Diversification — spread across instruments and issuers: 50% T-bills, 30% call deposits across three banks, 20% short-dated corporate bonds is diversified; 100% in one bank's CD is a single point of failure.",
          ],
        },
        {
          type: "p",
          text: "The reasoning is the same as a lender's, in reverse: treasury investing surpluses is extending credit to banks and issuers, and no borrower — however sound — deserves the whole book.",
        },
      ],
      check: {
        question:
          "A treasurer places the entire ZMW 8 million surplus with one bank because it offered 1% more than any rival. What principle was broken?",
        options: [
          "Counterparty concentration — the whole surplus now depends on one institution's solvency, for 1% of extra yield",
          "None — the best rate is the correct choice",
          "Maturity matching — all deposits must have different terms",
          "The safety hierarchy is unaffected because banks cannot fail",
        ],
        answer: 0,
        explain:
          "One institution holding everything converts a diversifiable risk into an existential one — precisely what counterparty limits exist to prevent, and the extra 1% is no compensation if the bank fails. Banks can and do fail; the policy assumes it so the treasurer doesn't have to predict it.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "portfolio-construction",
      heading: "Constructing the portfolio",
      blocks: [
        {
          type: "p",
          text: "Three standard shapes organise a portfolio's maturities. Laddering spreads equal amounts across 1, 3, 6 and 12 months and rolls each maturing rung to the far end — constant liquidity while harvesting the yield curve's upward slope. A bullet puts everything on one future date to meet a known cash need. A barbell splits between very short and long — say 60% in 30-day deposits, 40% in 3-year bonds — for liquidity and yield at once, with a view on rates deciding the balance.",
        },
        {
          type: "p",
          text: "The lecture's worked example builds a matched portfolio. A manufacturer holds ZMW 5 million: ZMW 2 million is needed in 3 months for tax, ZMW 1.5 million in 6 months for a dividend, ZMW 1.5 million is free for the year — of which 500,000 is kept as a standing liquidity reserve.",
        },
        {
          type: "table",
          columns: [
            { label: "Tranche" },
            { label: "Need" },
            { label: "Instrument" },
            { label: "Rate", align: "right" },
            { label: "Annual yield, ZMW", align: "right" },
          ],
          rows: [
            ["500,000", "Immediate reserve", "Call deposit", "10%", "50,000"],
            ["2,000,000", "Tax in 3 months", "91-day T-bill", "13%", "260,000"],
            ["1,500,000", "Dividend in 6 months", "182-day T-bill", "14%", "210,000"],
            ["1,000,000", "Free for 12 months", "1-year government bond", "15%", "150,000"],
          ],
          total: ["5,000,000", "", "", "", "670,000"],
          note: "Blended yield 670,000 ÷ 5,000,000 = 13.4%, with every cash need matched by a maturity.",
        },
        {
          type: "p",
          text: "Each tranche's maturity is its need date, so nothing is ever sold early and nothing sits idle — the safety-liquidity-yield hierarchy expressed as a table. Performance is then judged against a benchmark weighted the same way as the portfolio: total return (coupons plus any mark-to-market movement) compared to what the matching mix of market rates delivered. Large deviations from benchmark signal one of two things, and both deserve investigation — skill, or risk the policy didn't intend.",
        },
      ],
      check: {
        question:
          "In the worked portfolio, why does the ZMW 2 million tax tranche go into a 91-day T-bill rather than the 15% 1-year bond?",
        options: [
          "The cash is needed in 3 months — the bill matures exactly then, while the bond would have to be sold early at whatever price prevails",
          "T-bills always outyield bonds",
          "Tax payments may only legally be funded from T-bills",
          "The bond's coupon is taxed and the bill's is not",
        ],
        answer: 0,
        explain:
          "Liquidity outranks yield: the 15% is only real if the money can stay the full year, and the tax bill falls due in 91 days. Matching maturity to need means the higher rate was never available for this tranche — the bill's 13% is the best yield the constraint allows.",
      },
    },
  ],
};
