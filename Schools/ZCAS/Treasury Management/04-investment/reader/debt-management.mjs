/* TM · Lesson 4 Investment · Step 1 — Debt management
 *
 * Source: 11_Debt Management PPTX; build_tm_4_1_debt-management.py (PDF).
 *
 * Correction (per E-7): the PDF's bond worked example priced a 12% coupon at a
 * 14% yield ABOVE par (K1,001,100) via a wrong final discount factor —
 * (1,120,000 ÷ 1.14⁵) is 581,690, not 651,451. The correct price is ≈ ZMW
 * 931,340, a discount, which is also what the theory requires when yield >
 * coupon. The workings below use the corrected figures.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "debt-management",
  label: "Debt management",
  title: "Debt management",
  kicker: "Debt and investment",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "the-function",
      heading: "The debt management function",
      blocks: [
        {
          type: "p",
          text: "Debt, alongside equity, is where the cash for working capital, expansion and equipment comes from — and it is never free. Its cost varies with the source, the term and the borrower's credit quality, and managing that cost is a defined treasury function with three jobs:",
        },
        {
          type: "ul",
          items: [
            "Minimise the cost of borrowing across all sources and maturities.",
            "Manage the risks debt creates — refinancing risk, interest rate risk, currency risk.",
            "Maintain continued access to credit at reasonable rates.",
          ],
        },
        {
          type: "p",
          text: "The trade-off running through all three is cost against risk. The cheaper source often carries the greater danger: short-term money is cheaper but must be refinanced repeatedly, and the moment you most need to roll it over is exactly the moment lenders are least willing. Every decision in this step is a position on that trade-off.",
        },
      ],
      check: {
        question:
          "A treasurer refinances all the company's debt into the cheapest available facility: 90-day paper rolled over continuously. What has been optimised, and what ignored?",
        options: [
          "Cost was minimised while refinancing risk was ignored — every 90 days the company bets that lenders will still be there",
          "Both cost and risk were optimised — cheapest is safest",
          "Risk was minimised at the expense of cost",
          "Access to credit was maximised, which covers all three jobs",
        ],
        answer: 0,
        explain:
          "Short paper is cheap precisely because the lender commits for almost no time — which transfers the commitment problem to the borrower. Debt management is all three jobs at once; a structure that wins on cost while maximising rollover exposure has failed the other two.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "sources",
      heading: "The sources of debt",
      blocks: [
        {
          type: "p",
          text: "Which source fits depends on the amount, the duration, the company's credit standing and the state of the market. Five to know:",
        },
        {
          type: "table",
          columns: [{ label: "Source" }, { label: "What it is" }, { label: "Character" }],
          rows: [
            [
              "Bank loans",
              "Secured or unsecured lending, fixed or variable rate; overdrafts and short loans to 5-year facilities",
              "The workhorse — most corporate debt; secured loans price lower",
            ],
            [
              "Bonds / debentures",
              "Long-term securities sold to investors: principal at maturity, coupon at intervals; 3–20 years",
              "Prices move inversely to interest rates; secondary market gives investors an exit",
            ],
            [
              "Commercial paper",
              "Unsecured short-term notes (1–270 days, usually 30–90) issued at a discount",
              "Cheapest short money — but blue-chip issuers only, and constant rollover",
            ],
            [
              "Leasing",
              "Use of equipment for rent — operating (short, flexible) or finance (effectively purchase on credit)",
              "No upfront capital; obsolescence and residual-value risk sit with the lessor",
            ],
            [
              "Hire purchase",
              "Instalment buying — the financier owns the asset until the final payment transfers it",
              "Equipment finance for firms below bond or CP scale",
            ],
          ],
        },
        {
          type: "p",
          text: "The Zambian market weights this list heavily toward the top: bank loans dominate corporate borrowing, the government issues bonds regularly in kwacha and dollars, but shallow capital markets keep corporate bonds uncommon and commercial paper rare. Leasing and hire purchase carry equipment finance. Reading a Zambian case, assume bank debt unless told otherwise.",
        },
      ],
      check: {
        question:
          "A large, highly rated company needs ZMW 40 million for 60 days at the lowest possible cost. Which source fits?",
        options: [
          "Commercial paper — short-term, discount-priced, cheaper than bank loans for blue-chip issuers",
          "A 10-year bond — the secondary market makes it effectively short-term",
          "Hire purchase — instalments spread the cost",
          "A finance lease on its factory",
        ],
        answer: 0,
        explain:
          "This is CP's exact niche: very short, unsecured borrowing by companies whose name alone carries the credit, priced below bank facilities. The bond mismatches the term entirely, and lease/HP are equipment products, not general funding.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "matching",
      heading: "Short against long — the matching principle",
      blocks: [
        {
          type: "p",
          text: "The matching principle says the maturity of the funds should match the maturity of the use: short-term assets financed short, long-term assets financed long. The reasons sit in the two columns of advantages and risks.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Short-term debt" }, { label: "Long-term debt" }],
          rows: [
            [
              "Used for",
              "Working capital, seasonal needs, temporary shortfalls",
              "Capital expenditure, fixed assets",
            ],
            [
              "For it",
              "Cheaper (the yield curve usually slopes up); flexible; matches working capital's rhythm",
              "Certainty — funds locked for the term; no refinancing risk; matches the asset's life",
            ],
            [
              "Against it",
              "Refinancing risk at every maturity; rates may have risen at renewal; overdrafts cancellable at will",
              "Costs more; early repayment penalised; the commitment may outlive the need",
            ],
          ],
        },
        {
          type: "p",
          text: "Violating the principle in either direction has a price. Fund a factory with 90-day paper and the business re-runs its refinancing gamble forty times over the asset's life. Fund seasonal inventory with a 10-year loan and you pay long-term rates on money that sits idle most of the year. The principle is the default; departures from it are the aggressive and conservative financing policies from the working capital lesson, chosen deliberately or not at all.",
        },
      ],
      check: {
        question:
          "A company funds a 15-year processing plant entirely with rolling 6-month bank loans because \"short rates are lower\". What risk has it taken?",
        options: [
          "Thirty consecutive refinancings, each at whatever rate and credit conditions then prevail — a maturity mismatch against the matching principle",
          "None — cheaper funding is always the right choice",
          "Only currency risk, if the loans are in dollars",
          "The plant may wear out before the loans do",
        ],
        answer: 0,
        explain:
          "The asset's life is fixed; the funding's isn't. Each rollover reprices the debt and re-tests the company's access to credit, and one refused renewal mid-life leaves a half-financed plant. The rate saving is real — it is the compensation for carrying exactly this risk.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "covenants",
      heading: "Loan covenants",
      blocks: [
        {
          type: "p",
          text: "A covenant is a restriction the lender writes into the loan to protect its repayment. Affirmative covenants say what the borrower must do: maintain minimum working capital or current ratios, keep interest cover (PBIT over interest expense) above a floor, deliver financial statements, insure the financed assets, pay taxes on time. Restrictive covenants say what it cannot do without consent: issue further debt beyond a set level, dispose of the financed assets, pay dividends that would breach a gearing ratio, exceed a capex ceiling, or change the nature of the business.",
        },
        {
          type: "p",
          text: "Breaching a covenant can trigger default and give the lender the right to demand early repayment — which converts a technical breach into a cash crisis. That is why treasury monitors covenant headroom as carefully as cash itself.",
        },
        {
          type: "callout",
          text: "Covenants are the price of the interest rate: the more tightly the lender's risk is constrained, the cheaper the money. Flexibility is what the borrower sells to buy a lower rate.",
        },
      ],
      check: {
        question:
          "A loan requires interest cover of at least 3.0×. A bad year drops the company's cover to 2.6×, though every payment has been made on time. What is the company's position?",
        options: [
          "In technical default — the lender can call the loan even though no payment was missed",
          "Fine — covenants only bind if a payment is missed",
          "The covenant automatically resets to 2.6×",
          "The lender must lower the interest rate to compensate",
        ],
        answer: 0,
        explain:
          "Covenants are conditions of the loan, not just payment schedules. Falling below the ratio is a breach in itself, giving the lender the right to demand repayment or extract a price for waiving it. Watching the ratio's headroom before it breaks is the treasury discipline the question tests.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "bond-pricing",
      heading: "Pricing a bond",
      blocks: [
        {
          type: "p",
          text: "A bond promises a coupon each year and its face value at maturity, and its market price is simply those cash flows discounted at the market yield for similar bonds. When the market yield is above the coupon, the price sits below par; when below, above par. The price is where an old coupon meets today's rates.",
        },
        {
          type: "formula",
          text: "Price = C ÷ (1+r) + C ÷ (1+r)² + … + (C + FV) ÷ (1+r)ⁿ",
          where: [
            "C = annual coupon payment",
            "r = market yield on similar bonds",
            "FV = face value repaid at maturity",
            "n = years to maturity",
          ],
        },
        {
          type: "p",
          text: "The lecture's example, corrected: a 5-year bond, face value ZMW 1,000,000, coupon 12% (ZMW 120,000 a year), priced when similar bonds yield 14%.",
        },
        {
          type: "table",
          columns: [{ label: "Year" }, { label: "Cash flow, ZMW", align: "right" }, { label: "Discounted at 14%, ZMW", align: "right" }],
          rows: [
            ["1", "120,000", "105,263"],
            ["2", "120,000", "92,336"],
            ["3", "120,000", "80,996"],
            ["4", "120,000", "71,049"],
            ["5", "1,120,000", "581,690"],
          ],
          total: ["Price", "", "931,334"],
        },
        {
          type: "p",
          text: "The bond is worth about ZMW 931,300 — a discount to par, as it must be: nobody pays full price for 12% coupons when the market pays 14%. An issuer selling new debt at par in this market simply sets the coupon at 14%. And duration from the previous lesson applies here directly — the longer the maturity and the lower the coupon, the harder the price falls when yields rise, which is the risk a bondholding treasury is carrying.",
        },
      ],
      check: {
        question:
          "Market yields rise from 12% to 14% after a company issues a 12%-coupon bond at par. What happens to the bond's market price, and why?",
        options: [
          "It falls below par — the fixed 12% coupons must be discounted harder to give a new buyer the 14% the market now pays",
          "It rises above par — higher yields make bonds more valuable",
          "It stays at par — the coupon was fixed at issue",
          "It falls to zero — the bond is now in default",
        ],
        answer: 0,
        explain:
          "The coupons cannot change, so the price must: only by paying less than par can a buyer of 12% coupons earn a 14% return. Price and yield move inversely, always — the single most-tested fact about bonds.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "credit-ratings",
      heading: "Credit ratings",
      blocks: [
        {
          type: "p",
          text: "Rating agencies — Moody's, Standard & Poor's, Fitch — grade the likelihood that a borrower defaults, and that grade prices its debt. The scale's crucial line runs between investment grade and speculative.",
        },
        {
          type: "table",
          columns: [{ label: "S&P / Fitch" }, { label: "Moody's" }, { label: "Meaning" }],
          rows: [
            ["AAA", "Aaa", "Highest credit quality"],
            ["AA", "Aa", "Very high quality"],
            ["A", "A", "Upper medium grade"],
            ["BBB", "Baa", "Medium grade — the investment-grade floor"],
            ["BB", "Ba", "Speculative"],
            ["B", "B", "High default risk"],
            ["CCC", "Caa", "In or near default"],
          ],
        },
        {
          type: "p",
          text: "Investment grade — BBB and above — is what most institutional investors are permitted to hold, so falling below it doesn't just raise a borrower's rate, it shrinks the pool of lenders. The swap example in the risk lesson ran on exactly this machinery: Zambia Sugar's AAA against Lafarge's BBB is what created the rate differentials the swap arbitraged.",
        },
        {
          type: "p",
          text: "The sovereign rating sits above every corporate one. Zambia's government rating sets the ceiling for how the country's borrowers are perceived: a downgrade signals higher risk to international investors, tightens credit and raises rates for the state and companies alike — felt sharply through Zambia's debt restructuring years. For treasury the insight is simple: the company's cost of debt is built on a floor it does not control, which is one more reason to lock funding when conditions are good.",
        },
      ],
      check: {
        question:
          "A company slips from BBB to BB. Beyond a higher interest rate, what changes in its access to debt?",
        options: [
          "It falls out of investment grade — institutional investors restricted to BBB and above can no longer hold its paper, shrinking its lender pool",
          "Nothing else — the rating only affects the rate",
          "Its existing bonds are cancelled",
          "It can no longer borrow from banks, only issue bonds",
        ],
        answer: 0,
        explain:
          "The BBB/BB line is regulatory and mandate-driven, not just reputational: pension funds and insurers are commonly barred from speculative-grade paper. Crossing it doesn't merely reprice the company's debt — it removes buyers, which is why issuers defend the boundary so hard.",
      },
    },
  ],
};
