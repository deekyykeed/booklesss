/* TM · The Price of Debt · Pricing a Bond
 *
 * Split out of the-price-of-debt.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of the-price-of-debt.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "pricing-a-bond",
  label: "Pricing a Bond",
  title: "Pricing a Bond",
  kicker: "The Price of Debt",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "bond-pricing",
      heading: "Pricing a bond",
      blocks: [
        {
          type: "p",
          text: "Nobody pays a million kwacha for 12% coupons, the bond's fixed yearly interest, when the market is paying 14%. **The only question is how much less they pay,** and the arithmetic answers it exactly.",
        },
        {
          type: "p",
          text: "A bond promises a [coupon](https://corporatefinanceinstitute.com/resources/fixed-income/coupon-rate/) each year and its face value at maturity, so its [price](https://corporatefinanceinstitute.com/resources/fixed-income/bond-pricing/) is those cash flows discounted at whatever similar bonds currently yield. The face value is also called [[par|Trading below par is a discount and above it a premium, and which one it is tells you instantly whether rates have risen or fallen since the bond was issued.]]. It is the number the price gets compared against: a market yield above the coupon puts the price below par, and a yield below the coupon puts it above.",
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
          text: "About ZMW 931,300, a discount to par, exactly as it has to be. An issuer [selling new debt](step:debt-management) at par into this market simply sets the coupon at 14% instead. **And the longer the maturity and the lower the coupon, the harder the price falls when yields rise,** which is the risk you are carrying the moment your treasury holds bonds rather than issues them.",
        },
        {
          type: "callout",
          kind: "example",
          text: "Price one yourself before you read on. A 4-year bond, face value ZMW 500,000, coupon 10% so ZMW 50,000 a year, and similar bonds today yield 13%. Discount each year the way the table above does, and remember that year 4 carries the last coupon and the ZMW 500,000 together.",
        },
      ],
      check: {
        question:
          "What is that bond worth today: ZMW 500,000 face value, 10% coupon, 4 years to run, similar bonds yielding 13%?",
        options: [
          "About ZMW 455,400",
          "ZMW 500,000, its face value",
          "About ZMW 148,700",
          "About ZMW 506,700",
        ],
        answer: 0,
        explain:
          "The four coupons discount to 148,724 and the 500,000 repayment discounts to 306,659, so the price is 455,383. It sits below par because the market wants 13% and the bond only pays 10%, which is the inverse move of price and yield in one figure. ZMW 500,000 is what you get by discounting at the coupon rate instead of the market yield, and that slip is dangerous because it always returns par exactly and so looks right. 148,700 leaves out the repayment. 506,700 discounts the repayment but adds the coupons at face.",
      },
    },
  ],
};
