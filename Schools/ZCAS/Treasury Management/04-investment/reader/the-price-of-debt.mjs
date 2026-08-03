/* TM · Lesson 4 Debt and investment · Step 1b — What debt costs, and what it demands
 *
 * Source: 11_Debt Management PPTX; build_tm_4_1_debt-management.py (PDF).
 *
 * Correction (per E-7): the PDF's bond worked example priced a 12% coupon at a
 * 14% yield ABOVE par (K1,001,100) via a wrong final discount factor.
 * (1,120,000 ÷ 1.14⁵) is 581,690, not 651,451. The correct price is
 * ZMW 931,334 on the rounded rows below, a discount, which is also what the
 * theory requires when the yield is above the coupon.
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `debt-management`, which was one six-section
 * step. That part is where the money comes from; this part is what it costs and
 * what it ties you to. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. Two cross-lesson pointers were removed
 * rather than repaired: §5 ended "duration from the previous lesson applies
 * here directly", and §6 explained the AAA-against-BBB rate gap by naming a
 * swap example told in another lesson. Both now say the thing itself, because a
 * reader arriving here has read neither.
 */

export default {
  slug: "the-price-of-debt",
  label: "What debt costs",
  title: "What debt costs, and what it demands",
  kicker: "Debt and investment",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "covenants",
      heading: "Loan covenants",
      blocks: [
        {
          type: "p",
          text: "You have paid every instalment on time, in full, for four years. **You are in default.**",
        },
        {
          type: "p",
          text: "A [covenant](https://corporatefinanceinstitute.com/resources/commercial-lending/debt-covenants/) is a condition the lender writes into the loan to protect its repayment, and breaking one is a breach whether or not a payment was missed. They come in two kinds.",
        },
        {
          type: "ul",
          items: [
            "**Affirmative covenants** say what you must do: hold minimum working capital or current ratios, keep interest cover ([[PBIT|Profit before interest and tax. Lenders use it because it measures what the business earns before the debt is served, which is the number that tells them whether the debt can be served.]] over interest expense) above a floor, deliver statements on time, insure the financed assets, pay your taxes.",
            "**Restrictive covenants** say what you cannot do without consent: take on further debt beyond a set level, sell the financed assets, pay a dividend that breaks a gearing ratio, or change what the business does.",
          ],
        },
        {
          type: "p",
          text: "A breach can trigger default and give the lender the right to demand the money back immediately, **which turns a ratio slipping by four tenths into a cash crisis in a week.** That is why treasury watches [[covenant headroom|How far a ratio is from the level that would breach the loan. It is a number you can forecast months ahead, which is the whole point of tracking it: a breach seen early is a conversation, and a breach discovered late is a demand for repayment.]] as closely as it watches cash.",
        },
        {
          type: "callout",
          text: "**Covenants are the price of the interest rate.** The more tightly the lender's risk is boxed in, the cheaper the money. Flexibility is what you are selling to buy a lower rate, so know what you sold.",
        },
      ],
      check: {
        question:
          "A loan requires interest cover of at least 3.0 times. A bad year drops the company's cover to 2.6, though every payment has been made on time. What is the company's position?",
        options: [
          "In technical default, so the lender can call the loan even though no payment was missed",
          "Fine, because covenants only bind if a payment is missed",
          "The covenant automatically resets to 2.6",
          "The lender must lower the interest rate to compensate",
        ],
        answer: 0,
        explain:
          "Covenants are conditions of the loan, not just a payment schedule. Falling below the ratio is a breach in itself, which gives the lender the right to demand repayment or to charge for waiving it. Watching the headroom before it breaks is the discipline this tests.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "bond-pricing",
      heading: "Pricing a bond",
      blocks: [
        {
          type: "p",
          text: "Nobody pays a million kwacha for 12% coupons when the market is paying 14%. **The only question is how much less they pay,** and the arithmetic answers it exactly.",
        },
        {
          type: "p",
          text: "A bond promises a [coupon](https://corporatefinanceinstitute.com/resources/fixed-income/coupon-rate/) each year and its face value at maturity, so its [price](https://corporatefinanceinstitute.com/resources/fixed-income/bond-pricing/) is those cash flows discounted at whatever similar bonds currently yield. Market yield above the coupon puts the price below [[par|The face value printed on the bond, the amount repaid at maturity. Trading below par is a discount and above it a premium, and which one it is tells you instantly whether rates have risen or fallen since it was issued.]], and below the coupon puts it above.",
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
          text: "The lecture's example, corrected: a 5-year bond, face value ZMW 1,000,000, coupon 12% so ZMW 120,000 a year, priced when similar bonds [yield](https://corporatefinanceinstitute.com/resources/fixed-income/yield-to-maturity-ytm/) 14%.",
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
          text: "About ZMW 931,300, a discount to par, exactly as it has to be. An issuer selling new debt at par into this market simply sets the coupon at 14% instead. **And the longer the maturity and the lower the coupon, the harder the price falls when yields rise,** which is the risk you are carrying the moment your treasury holds bonds rather than issues them.",
        },
      ],
      check: {
        question:
          "Market yields rise from 12% to 14% after a company issues a 12% coupon bond at par. What happens to the bond's market price, and why?",
        options: [
          "It falls below par, because the fixed 12% coupons must be discounted harder to give a new buyer the 14% the market now pays",
          "It rises above par, because higher yields make bonds more valuable",
          "It stays at par, because the coupon was fixed at issue",
          "It falls to zero, because the bond is now in default",
        ],
        answer: 0,
        explain:
          "The coupons cannot change, so the price must. Only by paying less than par can a buyer of 12% coupons earn a 14% return. Price and yield always move inversely, which is the single most-tested fact about bonds.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "credit-ratings",
      heading: "Credit ratings",
      blocks: [
        {
          type: "p",
          text: "One [[notch|A single step on a rating scale, such as BBB down to BB+. Ratings move a notch at a time, which is why a company defends the notch above a threshold so hard: the next one down changes who is allowed to lend to it.]] down, from BBB to BB, and it is not the interest rate that hurts most. **It is that a large part of your lender pool is no longer permitted to own your paper at all.**",
        },
        {
          type: "p",
          text: "[Rating agencies](https://corporatefinanceinstitute.com/resources/fixed-income/credit-rating/), meaning Moody's, Standard & Poor's and Fitch, grade how likely a borrower is to default, and that grade prices its debt. The line that matters runs between investment grade and speculative.",
        },
        {
          type: "table",
          columns: [{ label: "S&P / Fitch" }, { label: "Moody's" }, { label: "Meaning" }],
          rows: [
            ["AAA", "Aaa", "Highest credit quality"],
            ["AA", "Aa", "Very high quality"],
            ["A", "A", "Upper medium grade"],
            ["BBB", "Baa", "Medium grade, and the investment-grade floor"],
            ["BB", "Ba", "Speculative"],
            ["B", "B", "High default risk"],
            ["CCC", "Caa", "In or near default"],
          ],
        },
        {
          type: "p",
          text: "BBB and above is what most institutions are allowed to hold, so slipping below it shrinks the number of people who can lend to you rather than merely raising what they charge.",
        },
        {
          type: "p",
          text: "The same grading drives the gaps between borrowers. A AAA name and a BBB name face different [credit spreads](https://corporatefinanceinstitute.com/resources/commercial-lending/credit-risk/), and the gap is not the same size in the fixed market as in the floating one. **That difference between two differences is real money,** and it is what an interest rate swap exists to release.",
        },
        { type: "h2", text: "The ceiling you do not control" },
        {
          type: "p",
          text: "The sovereign rating sits above every corporate one in the country. Zambia's government rating sets how the world reads every Zambian borrower, so a downgrade tightens credit and raises rates for the state and for companies alike, as the restructuring years showed in full. **Your cost of debt is built on a floor you do not set,** which is the strongest argument there is for locking funding while conditions are good rather than when you need it.",
        },
      ],
      check: {
        question:
          "A company slips from BBB to BB. Beyond a higher interest rate, what changes in its access to debt?",
        options: [
          "It falls out of investment grade, so institutional investors restricted to BBB and above can no longer hold its paper, which shrinks its lender pool",
          "Nothing else, because the rating only affects the rate",
          "Its existing bonds are cancelled",
          "It can no longer borrow from banks, only issue bonds",
        ],
        answer: 0,
        explain:
          "The BBB to BB line is regulatory and mandate-driven rather than reputational: pension funds and insurers are commonly barred from speculative-grade paper. Crossing it does not merely reprice the debt, it removes buyers, which is why issuers defend the boundary so hard.",
      },
    },
  ],
};
