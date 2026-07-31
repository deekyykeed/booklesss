/* CF · Lesson 3 Valuation and M&A · Step 1 — Valuing a bond
 *
 * Source: 03_Mergers_and_Acquisitions/Lectures/Valuation of Debt Securities —
 * Bonds (2024), slides 2–17. Activities 1, 2 and 3 and practice question 1 are
 * the lecture's own at their original figures; the currency label is written
 * ZMW throughout in line with the house style, and the figures are unchanged.
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "bond-valuation",
  label: "Valuing a bond",
  title: "Valuing a bond",
  kicker: "Valuation and M&A",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "features",
      heading: "What a bond is and what its terms mean",
      blocks: [
        {
          type: "p",
          text: "A bond is a loan that can be traded. A government or a company borrows from the public on terms written into a legal contract — the bond indenture — and the lender can sell that claim to somebody else without the borrower being involved.",
        },
        {
          type: "p",
          text: "Five terms carry the whole of the arithmetic, and questions use them interchangeably with their synonyms.",
        },
        {
          type: "table",
          columns: [{ label: "Term" }, { label: "What it is" }],
          rows: [
            ["Par value — also face or nominal value", "The amount the issuer promises to repay at maturity. Usually ZMW100 or ZMW1,000"],
            ["Coupon rate", "The interest rate attached to the bond, fixed for its life"],
            ["Coupon payment", "The cash interest — coupon rate × par value, not × market price"],
            ["Time to maturity", "How long until the bond is redeemed"],
            ["Redemption value", "What the issuer pays at maturity. At par unless the terms say otherwise"],
          ],
        },
        {
          type: "p",
          text: "The single most useful habit is separating the par value from the market price. A ZMW1,000 bond with a 9% coupon pays ZMW90 a year no matter what it changes hands for — ZMW1,125, ZMW900 or ZMW1,000. The par value sets the payment; the market price sets the yield.",
        },
        {
          type: "p",
          text: "Redemption is not always at par. A bond redeemable at a 5% premium repays ZMW1,050 on a ZMW1,000 nominal value, and that ZMW1,050 is the figure that gets discounted in the final year.",
        },
      ],
      check: {
        question:
          "A 7% ZMW1,000 bond is trading at ZMW940. What is the annual coupon payment?",
        options: ["ZMW70", "ZMW65.80", "ZMW60", "ZMW74.47"],
        answer: 0,
        explain:
          "7% × ZMW1,000 = ZMW70. The coupon is calculated on the par value, which never changes. ZMW65.80 is 7% of the market price — a natural mistake, and one that makes every later line of the valuation wrong.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "pricing-principle",
      heading: "The one rule that prices every bond",
      blocks: [
        {
          type: "p",
          text: "The value of any financial security is the present value of every cash flow it will produce. For a bond that means the coupons and the redemption amount, discounted at the interest rate the market currently demands for that risk and that maturity.",
        },
        {
          type: "formula",
          text: "P₀  =  Σ  C ÷ (1 + r)ⁿ   +   F ÷ (1 + r)ᴺ",
          where: [
            "P₀ = the market price of the bond today",
            "C = the coupon payment each year",
            "F = the redemption value, received at maturity",
            "r = the current market interest rate for a bond of this risk and maturity",
            "N = the number of years to maturity",
          ],
        },
        {
          type: "p",
          text: "Everything that follows is that one formula with pieces removed. A bond with no coupon drops the first term. A bond with no maturity drops the second. A bond with both keeps both.",
        },
        {
          type: "p",
          text: "The discount rate is the market rate, not the coupon rate. The coupon was fixed when the bond was issued and describes the past; the market rate is what a similar bond issued today would have to pay, and it is what an investor could get instead.",
        },
        {
          type: "p",
          text: "So price and market interest rates move in opposite directions, always. When rates rise, existing bonds paying yesterday’s lower coupon become less attractive and their prices fall until their yield matches what is available now. When rates fall, prices rise.",
        },
        {
          type: "callout",
          text: "The coupon is fixed. The market rate moves. The price is what adjusts to reconcile the two.",
        },
      ],
      check: {
        question:
          "The Bank of Zambia policy rate rises sharply and market interest rates follow. What happens to the price of a fixed-coupon corporate bond already in issue?",
        options: [
          "It falls, because the fixed coupon is now worth less than what newly issued bonds pay",
          "It rises, because the bond now offers a better return",
          "It is unchanged, because the coupon and redemption value are both fixed",
          "It falls only if the issuer’s credit rating is downgraded at the same time",
        ],
        answer: 0,
        explain:
          "The bond cannot raise its coupon to compete, so the only thing that can move is what buyers will pay for it. The price falls until the fixed coupon, measured against the lower price, gives the same return the market now demands elsewhere.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "zero-coupon",
      heading: "Zero coupon bonds",
      blocks: [
        {
          type: "p",
          text: "A zero coupon bond pays no interest at all. It has one cash flow — the redemption amount at maturity — so the investor’s entire return comes from buying it for less than it repays.",
        },
        {
          type: "formula",
          text: "P₀  =  F ÷ (1 + r)ⁿ",
          where: [
            "F = the face value repaid at maturity",
            "r = the market interest rate",
            "n = the number of years to maturity",
          ],
        },
        {
          type: "p",
          text: "Z Co has zero coupon ZMW1,000 bonds redeemable at par in three years, and the market rate is 8%.",
        },
        {
          type: "formula",
          text: "P₀  =  1,000 ÷ (1.08)³  =  ZMW793.83",
        },
        {
          type: "p",
          text: "The investor pays ZMW793.83 and receives ZMW1,000 three years later. Nothing arrives in between, which is exactly the shape a Zambian treasury bill has.",
        },
        {
          type: "h2",
          text: "Compounding more than once a year",
        },
        {
          type: "p",
          text: "Where interest is compounded semi-annually, halve the rate and double the periods.",
        },
        {
          type: "formula",
          text: "P₀  =  1,000 ÷ (1.04)⁶  =  ZMW790.31",
        },
        {
          type: "p",
          text: "The price is lower — ZMW790.31 against ZMW793.83 — because compounding twice a year at 4% earns slightly more than once a year at 8%, so less has to be invested today to reach ZMW1,000. Any question that mentions semi-annual, quarterly or monthly compounding is asking for this adjustment, and it applies to the number of periods as well as the rate.",
        },
      ],
      check: {
        question:
          "A ZMW1,000 zero coupon bond matures in four years. The market rate is 10%, compounded semi-annually. Which calculation is right?",
        options: [
          "1,000 ÷ (1.05)⁸",
          "1,000 ÷ (1.10)⁴",
          "1,000 ÷ (1.05)⁴",
          "1,000 ÷ (1.20)⁸",
        ],
        answer: 0,
        explain:
          "Semi-annual compounding means eight periods of 5% each, so both the rate and the exponent change. Halving the rate without doubling the periods, or doubling the periods without halving the rate, breaks the arithmetic in opposite directions.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "irredeemable",
      heading: "Irredeemable bonds",
      blocks: [
        {
          type: "p",
          text: "An irredeemable or perpetual bond never matures. There is no redemption value to discount, only a coupon that runs forever — a perpetuity, which collapses to a division.",
        },
        {
          type: "formula",
          text: "P₀  =  C ÷ r",
          where: [
            "C = the annual coupon payment",
            "r = the market interest rate",
          ],
        },
        {
          type: "p",
          text: "P Co has 9% ZMW1,000 irredeemable bonds in issue and the market rate is 8%. The coupon is 9% × ZMW1,000 = ZMW90.",
        },
        {
          type: "formula",
          text: "P₀  =  90 ÷ 0.08  =  ZMW1,125",
        },
        {
          type: "p",
          text: "The bond trades above par because its 9% coupon beats the 8% the market is paying, and investors bid it up until the yield on what they pay is 8%.",
        },
        {
          type: "h2",
          text: "Valuing net of tax",
        },
        {
          type: "p",
          text: "Where a question asks for the price using interest net of tax, both the numerator and the denominator are adjusted. With tax at 25%, the coupon becomes ZMW90 × 0.75 = ZMW67.50 and the market rate becomes 8% × 0.75 = 6%.",
        },
        {
          type: "formula",
          text: "P₀  =  67.50 ÷ 0.06  =  ZMW1,125",
        },
        {
          type: "p",
          text: "The same answer, and it has to be: taking 25% off the top and the bottom of a fraction leaves it where it was. What that shows is that tax does not change the price of a bond — it changes what the borrowing costs the issuer, which is a different question and belongs in the cost of capital rather than in the valuation.",
        },
      ],
      check: {
        question:
          "An irredeemable bond with a 6% coupon on ZMW1,000 nominal is trading at ZMW750. What market interest rate does that imply?",
        options: ["8%", "6%", "4.5%", "7.5%"],
        answer: 0,
        explain:
          "Rearranging P₀ = C ÷ r gives r = 60 ÷ 750 = 8%. The bond trades below par because its 6% coupon is below what the market now demands, and the discount is what brings the buyer’s return up to 8%.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "redeemable",
      heading: "Redeemable bonds",
      blocks: [
        {
          type: "p",
          text: "A redeemable bond has both kinds of cash flow, so both terms of the formula are in play. The final year carries the coupon and the redemption amount together.",
        },
        {
          type: "p",
          text: "Q Co has 7% ZMW100 bonds redeemable at par in three years. The market rate is 8%, so the coupon is ZMW7 a year and ZMW107 arrives in year 3.",
        },
        {
          type: "formula",
          text: "P₀  =  7 ÷ 1.08  +  7 ÷ 1.08²  +  107 ÷ 1.08³  =  6.48 + 6.00 + 84.94  =  ZMW97.42",
        },
        {
          type: "p",
          text: "Now hold the bond still and move only the market rate.",
        },
        {
          type: "table",
          columns: [
            { label: "Market rate", align: "right" },
            { label: "Price ZMW", align: "right" },
            { label: "Against par" },
          ],
          rows: [
            ["8%", "97.42", "Discount — the coupon is below the market rate"],
            ["7%", "100.00", "At par — the coupon equals the market rate"],
            ["6%", "102.67", "Premium — the coupon beats the market rate"],
          ],
          note: "The same bond, the same coupon, the same redemption. Only the rate an investor could get elsewhere has changed.",
        },
        {
          type: "p",
          text: "The middle line is worth holding on to. A bond prices exactly at par when its coupon rate equals the market rate — which is why a bond issued today at a rate the market agrees with is issued at par, and why it drifts away from par the moment rates move.",
        },
        {
          type: "h2",
          text: "A premium redemption, net of tax",
        },
        {
          type: "p",
          text: "ABC Co has 9% ZMW1,000 bonds redeemable at a 5% premium in three years. Tax is 20% and the market rate net of tax is 10%. Three adjustments, then the same discounting.",
        },
        {
          type: "table",
          columns: [{ label: "Item" }, { label: "Working" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Coupon, net of tax", "9% × 1,000 × (1 − 0.20)", "72.00"],
            ["Redemption value", "1,000 × 1.05", "1,050.00"],
          ],
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Cash flow ZMW", align: "right" },
            { label: "Factor at 10%", align: "right" },
            { label: "PV ZMW", align: "right" },
          ],
          rows: [
            ["1", "72", "0.909", "65.45"],
            ["2", "72", "0.826", "59.47"],
            ["3", "1,122", "0.751", "842.62"],
          ],
          total: ["Market price", "", "", "967.54"],
        },
        {
          type: "p",
          text: "ZMW967.54, which the same calculation using an annuity factor gives as ZMW967.61 — the small gap is the rounding in three-decimal factors. Note that the redemption premium is not adjusted for tax. It is a capital amount, not interest, so the deduction that applies to the coupon does not apply to it.",
        },
      ],
      check: {
        question:
          "A bond’s coupon rate is exactly equal to the current market interest rate. Where will it trade?",
        options: [
          "At par, because it offers precisely the return the market demands",
          "At a premium, because a fixed coupon is worth more than a variable return",
          "At a discount, to compensate the investor for credit risk",
          "It cannot be determined without knowing the years to maturity",
        ],
        answer: 0,
        explain:
          "The price only moves away from par to correct a mismatch between the coupon and what the market wants. With nothing to correct, discounting the coupons and the redemption at the coupon rate returns the par value exactly — whatever the maturity.",
      },
    },
  ],
};
