/* CF · Lesson 4 Risk management · Step 1 — Interest rate risk, spot and forward rates
 *
 * Source: 04_Interest_Rate_and_Currency_Risk_Management/Interest Rate Risk and
 * Hedging Methods (2025), slides 2–13 and 16–18. Activities 1 and 2 are the
 * lecture's own at their original figures.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "interest-rate-risk",
  label: "Interest rate risk",
  title: "Interest rate risk, spot and forward rates",
  kicker: "Risk management",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "exposure",
      heading: "What a change in rates costs",
      blocks: [
        {
          type: "p",
          text: "Interest rate risk is the risk that the rate on money a company has borrowed, or has invested, moves against it. It is not a remote possibility — a business carrying floating-rate debt is exposed every time the Bank of Zambia moves its policy rate.",
        },
        {
          type: "formula",
          text: "Interest rate exposure  =  amount borrowed or invested  ×  change in the interest rate",
          where: [
            "amount = the principal exposed to the rate change",
            "change in rate = the movement in the rate, expressed as a decimal or a percentage",
          ],
        },
        {
          type: "p",
          text: "The exposure is the gain or loss the movement produces. A company with ZMW40 million of floating-rate borrowing facing a two-point rise in rates is ZMW800,000 a year worse off, and that lands entirely on profit before tax.",
        },
        {
          type: "p",
          text: "Which is why a small movement in rates makes a large difference to reported profit. Put that ZMW800,000 against a company earning ZMW3 million before interest and the rate rise has taken a quarter of it. The interest cover working in Lesson 2 showed the same mechanism from the other side: fixed interest amplifies whatever happens, and a rise in rates is a rise in the amount being amplified.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Exposure is measured on the amount, not on the profit. A rate change of one point on a large balance is a large number.",
        },
      ],
      check: {
        question:
          "A company has ZMW25 million of floating-rate debt and expects to earn ZMW4 million before interest this year. Rates rise by 1.5 points. What is the effect?",
        options: [
          "Interest rises by ZMW375,000, taking just over 9% of profit before interest",
          "Interest rises by ZMW375,000, which is 1.5% of the profit before interest",
          "Interest rises by ZMW60,000, being 1.5% of the profit",
          "There is no effect until the existing loan is refinanced",
        ],
        answer: 0,
        explain:
          "ZMW25m × 1.5% = ZMW375,000, and that is 9.4% of ZMW4 million. The exposure is calculated on the borrowing, not on the profit — and floating-rate debt reprices without waiting for anything to be refinanced, which is what makes it floating.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "spot-and-forward",
      heading: "Spot rates and forward rates",
      blocks: [
        {
          type: "p",
          text: "A spot interest rate is the rate today on money lent from today until a single point in the future. A forward interest rate is the rate today on money that will be lent starting at some future date, for a specific period after that.",
        },
        {
          type: "ul",
          items: [
            "A two-year spot rate is what you earn by lending now and being repaid in two years.",
            "A one-year forward rate beginning in year 1 is what you would earn by lending for the twelve months between year 1 and year 2 — agreed now, but not starting yet.",
          ],
        },
        {
          type: "p",
          text: "The notation is compact once you know it reads left to right as a period. The leading subscript is when the lending starts, the trailing one is when it ends.",
        },
        {
          type: "table",
          columns: [{ label: "Written" }, { label: "Means" }],
          rows: [
            ["₀S₁", "The one-year spot rate — from now until year 1"],
            ["₀S₃", "The three-year spot rate — from now until year 3"],
            ["₁f₂", "A one-year rate, starting in year 1 and running to year 2"],
            ["₁f₃", "A two-year rate, starting in year 1 and running to year 3"],
            ["₂f₅", "A three-year rate, starting in year 2 and running to year 5"],
          ],
        },
        {
          type: "p",
          text: "Spot rates are not one number. There is a different one for every maturity, and each cash flow ought properly to be discounted at the spot rate for the period in which it arrives rather than at a single average rate for the whole security.",
        },
      ],
      check: {
        question:
          "What does ₂f₅ describe?",
        options: [
          "A three-year rate, agreed now, on money lent from year 2 to year 5",
          "A five-year rate, agreed in year 2",
          "A two-year rate, starting in year 5",
          "The average of the two-year and five-year spot rates",
        ],
        answer: 0,
        explain:
          "The subscripts are the start and the end of the lending period, so the term is the difference between them — three years. The rate is agreed today; only the lending is in the future, which is precisely what makes it a forward rate rather than a forecast.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "deriving-spot-rates",
      heading: "Getting spot rates out of bond prices",
      blocks: [
        {
          type: "p",
          text: "Spot rates are not published as a list. They are extracted from the prices of government zero coupon bonds, because a zero coupon bond has exactly one cash flow — which makes its yield the pure spot rate for that maturity, with nothing else mixed in.",
        },
        {
          type: "formula",
          text: "₀Sₙ  =  ⁿ√( face value ÷ price )  −  1",
          where: [
            "face value = the amount repaid at maturity, taken as ZMW100",
            "price = the current market price of the zero coupon bond",
            "n = the years to maturity",
          ],
        },
        {
          type: "p",
          text: "One-year, two-year, three-year and four-year government zero coupon bonds are priced at ZMW86.96, ZMW77.64, ZMW71.89 and ZMW65.35.",
        },
        {
          type: "table",
          columns: [
            { label: "Maturity" },
            { label: "Price ZMW", align: "right" },
            { label: "Working" },
            { label: "Spot rate", align: "right" },
          ],
          rows: [
            ["1 year", "86.96", "(100 ÷ 86.96) − 1", "15.0%"],
            ["2 years", "77.64", "√(100 ÷ 77.64) − 1", "13.5%"],
            ["3 years", "71.89", "³√(100 ÷ 71.89) − 1", "11.6%"],
            ["4 years", "65.35", "⁴√(100 ÷ 65.35) − 1", "11.2%"],
          ],
          note: "The root is the number of years. A one-year bond needs none; a four-year bond needs a fourth root.",
        },
        {
          type: "p",
          text: "Read the column. Rates are highest at one year and fall as maturity lengthens — the market expects short-term rates to come down. That downward shape is a signal in itself, and the next step is about what it means.",
        },
        {
          type: "p",
          text: "The common mistake is dividing rather than taking the root. 100 ÷ 65.35 = 1.53, and treating that as 53% over four years and dividing by four gives 13.3% instead of 11.2% — the difference is compounding, which simple division ignores.",
        },
      ],
      check: {
        question:
          "A three-year government zero coupon bond with a face value of ZMW100 is priced at ZMW79.38. What is the three-year spot rate?",
        options: ["8.0%", "26.0%", "8.7%", "12.6%"],
        answer: 0,
        explain:
          "³√(100 ÷ 79.38) − 1 = 8.0%. The 26.0% answer is the total return over the whole three years, and 8.7% is that total divided by three — which overstates the annual rate, because simple division credits none of the compounding.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "linking",
      heading: "Linking spot rates to forward rates",
      blocks: [
        {
          type: "p",
          text: "Spot rates and forward rates are locked together by one idea: lending for two years must earn the same as lending for one year and then relending for the second. If it did not, an investor could borrow one way and lend the other and make money for nothing, and the rates would move until the gap closed.",
        },
        {
          type: "formula",
          text: "(1 + ₀S₂)²  =  (1 + ₀S₁)  ×  (1 + ₁f₂)",
          where: [
            "₀S₂ = the two-year spot rate",
            "₀S₁ = the one-year spot rate",
            "₁f₂ = the one-year forward rate beginning in year 1",
          ],
        },
        {
          type: "p",
          text: "Rearrange for whichever rate is missing. With a two-year spot rate of 6.25% and a one-year spot rate of 5%:",
        },
        {
          type: "formula",
          text: "₁f₂  =  (1.0625)² ÷ (1.05)  −  1  =  7.51%",
        },
        {
          type: "p",
          text: "The same construction extends to any two maturities, and there is usually more than one route to the same answer.",
        },
        {
          type: "table",
          columns: [{ label: "Relationship" }, { label: "Reads as" }],
          rows: [
            ["(1 + ₀S₃)³ = (1 + ₀S₂)² × (1 + ₂f₃)", "Three years = two years, then one more"],
            ["(1 + ₀S₃)³ = (1 + ₀S₁) × (1 + ₁f₃)²", "Three years = one year, then two more"],
            ["(1 + ₀S₃)³ = (1 + ₀S₁) × (1 + ₁f₂) × (1 + ₂f₃)", "Three years = three consecutive single years"],
          ],
        },
        {
          type: "p",
          text: "Take the spot rates from the last section and find the two-year forward rate starting in two years — the rate for years 3 and 4 taken together. Four years must equal two years followed by that rate for two more.",
        },
        {
          type: "formula",
          text: "₂f₄  =  √[ (1.112)⁴ ÷ (1.135)² ]  −  1  =  9.0%",
        },
        {
          type: "p",
          text: "And the one-year forward rate beginning in year 3 — four years being three years plus one more:",
        },
        {
          type: "formula",
          text: "₃f₄  =  (1.112)⁴ ÷ (1.116)³  −  1  =  10.0%",
        },
        {
          type: "p",
          text: "Two rules keep this straight. Raise each bracket to the number of years that rate covers, and take a root at the end equal to the length of the forward period you are solving for — a two-year forward needs a square root, a one-year forward needs none.",
        },
      ],
      check: {
        question:
          "The one-year spot rate is 8% and the two-year spot rate is 10%. What is the one-year forward rate beginning in year 1?",
        options: ["12.04%", "9.00%", "2.00%", "10.00%"],
        answer: 0,
        explain:
          "(1.10)² ÷ 1.08 − 1 = 1.21 ÷ 1.08 − 1 = 12.04%. With the two-year rate above the one-year rate, the second year has to carry more than the average to pull the two-year rate up to 10% — so the forward rate must exceed 10%, which rules out the 9% and 10% answers at a glance.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "pricing-with-spot-rates",
      heading: "Pricing a bond off the spot curve",
      blocks: [
        {
          type: "p",
          text: "Once you have a spot rate for each maturity, each of a bond’s cash flows can be discounted at the rate that belongs to its own year rather than at one rate applied to all of them. That is the more accurate valuation, and it is what the market actually does.",
        },
        {
          type: "p",
          text: "MBS has 10% ZMW1,000 four-year bonds redeemable at nominal value, with interest paid annually. The spot rates are 4% for one year, 4.5% for two, 5% for three and 6% for four.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Spot rate", align: "right" },
            { label: "Cash flow ZMW", align: "right" },
            { label: "Factor", align: "right" },
            { label: "PV ZMW", align: "right" },
          ],
          rows: [
            ["1", "4.0%", "100", "0.962", "96.20"],
            ["2", "4.5%", "100", "0.916", "91.60"],
            ["3", "5.0%", "100", "0.864", "86.40"],
            ["4", "6.0%", "1,100", "0.792", "871.20"],
          ],
          total: ["Market price", "", "", "", "1,145.40"],
        },
        {
          type: "p",
          text: "Each factor is 1 ÷ (1 + that year’s spot rate) raised to that year’s number — 1 ÷ 1.045² for year 2, not 1 ÷ 1.045 and not 1 ÷ 1.04². The rate changes by row and so does the exponent.",
        },
        {
          type: "p",
          text: "The bond trades well above its ZMW1,000 nominal value because its 10% coupon is far above the 4% to 6% the market is paying. That is the same relationship the valuation lesson established, now stated one year at a time.",
        },
        {
          type: "p",
          text: "Notice how lopsided the present values are. The year 4 line is ZMW871 of a ZMW1,145 price — 76% of the bond’s value sits in its final cash flow. Which is why a change in the four-year rate moves this bond’s price far more than a change in the one-year rate does, and why measuring that sensitivity needs a weighted measure rather than just the maturity.",
        },
      ],
      check: {
        question:
          "Why is the year 2 cash flow discounted at 1 ÷ (1.045)² rather than 1 ÷ (1.045)?",
        options: [
          "The 4.5% is the annual rate for money lent over the full two years, so it compounds across both of them",
          "Because the coupon is paid twice in the first two years",
          "Because the spot rate rises between year 1 and year 2",
          "Because the exponent must always match the number of cash flows remaining",
        ],
        answer: 0,
        explain:
          "A spot rate is an annual rate covering the whole period to that maturity, so bringing a year 2 cash flow back to today means undoing two years of compounding at 4.5%. The exponent is the year the cash flow arrives in — nothing else.",
      },
    },
  ],
};
