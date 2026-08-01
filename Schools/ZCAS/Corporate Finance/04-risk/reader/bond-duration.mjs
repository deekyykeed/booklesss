/* CF · Lesson 4 Risk management · Step 3 — Bond duration
 *
 * Source: 04_Interest_Rate_and_Currency_Risk_Management/Interest Rate Risk and
 * Hedging Methods (2025), slides 14–19, and the same material in Valuation of
 * Debt Securities — Bonds (2024), slides 22–27. Activity 6 / the ERS bond is
 * the lecture's own at its original figures.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "bond-duration",
  label: "Bond duration",
  title: "Bond duration",
  kicker: "Risk management",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-it-is",
      heading: "How long you really wait for a bond",
      blocks: [
        {
          type: "p",
          text: "Duration is the average number of years an investor waits to receive a bond’s value, with each year weighted by how much of the value arrives in it. It measures how sensitive the bond’s price is to a change in interest rates.",
        },
        {
          type: "p",
          text: "Maturity alone cannot do that job. Two bonds can both mature in four years while one pays a large coupon each year and the other pays nothing until the end — the first gets most of its money back early, the second waits. They face very different amounts of interest rate risk, and their maturities are identical.",
        },
        {
          type: "p",
          text: "Duration reads two ways at once, and both are useful.",
        },
        {
          type: "ul",
          items: [
            "As a period of time: how long, on average, before an investor recovers what they put in. It is the payback period of the bond’s cash flows, in present-value terms.",
            "As a sensitivity: the approximate percentage change in the bond’s price for every 1% change in the market interest rate.",
          ],
        },
        {
          type: "p",
          text: "The longer the duration, the further into the future the bond’s value is generated, and the more violently its price reacts when rates move.",
        },
        {
          type: "callout",
          text: "Maturity says when the last cash flow arrives. Duration says when the money, on average, actually arrives.",
        },
      ],
      check: {
        question:
          "Two bonds both mature in five years. One has a 12% coupon, the other pays no coupon at all. Which has the longer duration?",
        options: [
          "The zero coupon bond, because none of its value arrives until the final year",
          "The 12% coupon bond, because it pays out more in total",
          "They are the same, because duration is determined by maturity",
          "It depends on which was issued first",
        ],
        answer: 0,
        explain:
          "The coupon bond returns part of its value every year, pulling the weighted average wait below five years. The zero coupon bond has one cash flow at year 5, so its duration is exactly 5 — the maximum for that maturity, and the reason zeros are the most rate-sensitive bonds there are.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "calculating",
      heading: "Calculating duration",
      blocks: [
        {
          type: "p",
          text: "Duration is the present value of each cash flow multiplied by the year it arrives in, totalled, and divided by the bond’s price.",
        },
        {
          type: "formula",
          text: "Duration  =  Σ (PV of cash flow × t)  ÷  bond price",
          where: [
            "t = the year in which that cash flow arrives",
            "PV of cash flow = that year’s cash flow discounted at the market interest rate",
            "bond price = the sum of all the present values",
          ],
        },
        {
          type: "p",
          text: "ERS has issued 10% ZMW1,000 four-year bonds, redeemable at nominal value, with interest paid annually. The market interest rate is 6%. Four columns: the cash flow, its present value, and then that present value weighted by its year.",
        },
        {
          type: "table",
          columns: [
            { label: "Year (t)" },
            { label: "Cash flow ZMW", align: "right" },
            { label: "Factor at 6%", align: "right" },
            { label: "PV ZMW", align: "right" },
            { label: "PV × t", align: "right" },
          ],
          rows: [
            ["1", "100", "0.943", "94.30", "94.30"],
            ["2", "100", "0.890", "89.00", "178.00"],
            ["3", "100", "0.840", "84.00", "252.00"],
            ["4", "1,100", "0.792", "871.20", "3,484.80"],
          ],
          total: ["Totals", "", "", "1,138.50", "4,009.10"],
        },
        {
          type: "formula",
          text: "Duration  =  4,009.10  ÷  1,138.50  =  3.52 years",
        },
        {
          type: "p",
          text: "Two figures come out of one table. The sum of the present values is the bond’s market price, ZMW1,138.50. The sum of the weighted column, divided by that price, is the duration.",
        },
        {
          type: "p",
          text: "3.52 years against a maturity of 4. The gap is small because the year 4 cash flow — the last coupon plus the ZMW1,000 redemption — is 77% of the whole present value and pulls the average hard towards year 4. On a bond with a bigger coupon relative to its principal the gap would be wider.",
        },
        {
          type: "p",
          text: "Where the question supplies a different spot rate for each year rather than one market rate, discount each line at its own rate and the method is otherwise unchanged. On spot rates of 4%, 4.5%, 5% and 6% the same bond prices at ZMW1,145.40 with a duration of 3.51 years.",
        },
      ],
      check: {
        question:
          "In the working above, what does the ZMW1,138.50 total represent?",
        options: [
          "The market price of the bond — the sum of the present values of all its cash flows",
          "The duration of the bond, before dividing by the number of years",
          "The total interest the bond will pay over its life",
          "The nominal value of the bond, adjusted for the market rate",
        ],
        answer: 0,
        explain:
          "The present value column is a bond valuation, exactly as the valuation step did it. The duration calculation reuses it — the weighted column is divided by that price, so pricing the bond is the first half of measuring its duration.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "price-sensitivity",
      heading: "Turning duration into a price change",
      blocks: [
        {
          type: "p",
          text: "The second reading of duration is the useful one for managing risk: the bond’s price changes by roughly the duration, in percent, for every 1% change in the market interest rate — and in the opposite direction.",
        },
        {
          type: "formula",
          text: "% change in price  ≈  − duration  ×  change in interest rate",
          where: [
            "duration = the figure calculated above, in years",
            "change in interest rate = the movement in the rate, in percentage points",
          ],
        },
        {
          type: "p",
          text: "ERS’s bond has a duration of 3.52. Suppose the market rate falls by 200 basis points — 2%.",
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Change in price", "3.52 × 2%", "+7.04%"],
            ["Price before", "At a 6% market rate", "ZMW1,138.50"],
            ["Estimated price after", "1,138.50 × 1.0704", "ZMW1,218.69"],
          ],
          total: ["Actual price at 4%", "Discounting the cash flows again", "ZMW1,217.79"],
        },
        {
          type: "p",
          text: "The estimate is ZMW0.90 out on a ZMW1,218 bond — close enough to manage a position with, and worth knowing is an estimate. Duration draws a straight line through a relationship that is actually curved, so it is at its most accurate for small movements and drifts as they get larger.",
        },
        {
          type: "p",
          text: "Two hundred basis points is already a fair-sized move. On a 25 basis point change the straight line and the curve are almost indistinguishable; on a 500 basis point change the gap is wide enough that the bond has to be revalued properly rather than estimated.",
        },
        {
          type: "p",
          text: "Note the minus sign in the formula and where it comes from. Rates and prices move in opposite directions, so a rise in rates gives a fall in price. Here rates fell, so the price rose.",
        },
      ],
      check: {
        question:
          "A bond with a duration of 6.2 years is trading at ZMW950. Market interest rates rise by 50 basis points. What happens to the price, approximately?",
        options: [
          "It falls by about 3.1%, to roughly ZMW921",
          "It rises by about 3.1%, to roughly ZMW979",
          "It falls by about 6.2%, to roughly ZMW891",
          "It falls by about 0.5%, to roughly ZMW945",
        ],
        answer: 0,
        explain:
          "6.2 × 0.5% = 3.1%, and rates rising means the price falls: 950 × 0.969 = ZMW921. The 6.2% answer applies the duration to a full one-point move rather than to the half-point that actually occurred.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "what-drives-it",
      heading: "What makes duration long or short",
      blocks: [
        {
          type: "p",
          text: "Three things move duration, and knowing which way each pushes lets you rank bonds by risk without calculating anything.",
        },
        {
          type: "table",
          columns: [{ label: "Factor" }, { label: "Effect on duration" }, { label: "Why" }],
          rows: [
            [
              "Longer maturity",
              "Longer",
              "The final cash flow, which is nearly always the largest, sits further away",
            ],
            [
              "Higher coupon",
              "Shorter",
              "More of the value is returned early, so the weighted average wait falls",
            ],
            [
              "Higher market interest rate",
              "Shorter",
              "Heavier discounting shrinks the distant cash flows most, reducing their weight",
            ],
          ],
        },
        {
          type: "p",
          text: "The special case is the zero coupon bond. It has one cash flow, at maturity, so its duration equals its maturity exactly — a five-year zero has a duration of 5. Nothing arrives early to pull the average down, which makes zeros the most interest-rate-sensitive bonds of any given maturity.",
        },
        {
          type: "p",
          text: "That gives an ordering you can apply on sight. Among bonds maturing on the same date, the one with the lowest coupon has the longest duration and will move most when rates change. Among bonds with the same coupon, the one maturing latest has the longest duration.",
        },
        {
          type: "p",
          text: "It also explains a pattern in the market. Governments issuing thirty-year bonds are issuing the most rate-sensitive instruments in existence, which is why long-dated gilt and treasury prices swing so far on what look like small changes in policy.",
        },
      ],
      check: {
        question:
          "Three bonds all mature in five years, with coupons of 4%, 8% and 12%. Which has the greatest price sensitivity to interest rates?",
        options: [
          "The 4% bond, because the least of its value comes back before maturity",
          "The 12% bond, because it pays out the most in total",
          "All three are equally sensitive, since they share a maturity",
          "It cannot be determined without knowing the market interest rate",
        ],
        answer: 0,
        explain:
          "A low coupon means a larger share of the value sits in the redemption payment at year 5, so the weighted average wait is longest and the duration greatest. Total cash paid is not the point — when it is paid is.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "using-it",
      heading: "Using duration to manage risk",
      blocks: [
        {
          type: "p",
          text: "Duration turns a vague worry about rates into a number that can be managed, and it is used in three ways.",
        },
        {
          type: "h2",
          text: "Measuring a position",
        },
        {
          type: "p",
          text: "A treasurer holding a portfolio of bonds can calculate its duration — the average of the individual durations, weighted by market value — and read off what a rate movement would cost. A portfolio of ZMW500 million with a duration of 6 loses about ZMW30 million if rates rise by one point.",
        },
        {
          type: "h2",
          text: "Immunisation",
        },
        {
          type: "p",
          text: "An institution with obligations to meet at a known future date can match the duration of its assets to the duration of those obligations. Do that and a rate change moves both sides by roughly the same proportion, leaving the position able to meet its liabilities whichever way rates go. A pension fund paying out in twelve years wants assets with a duration near 12, not bonds maturing in twelve years.",
        },
        {
          type: "h2",
          text: "Positioning",
        },
        {
          type: "p",
          text: "A treasurer expecting rates to fall wants long-duration assets, to gain the most from the price rise. Expecting rates to rise, they shorten duration to lose the least. That is a deliberate bet on the direction of rates, and it should be described as one.",
        },
        {
          type: "p",
          text: "The limitations are worth stating alongside the uses. Duration is a linear approximation of a curved relationship, so it degrades on large movements. It assumes the whole yield curve shifts by the same amount, which is rarely what happens — short rates and long rates often move by different amounts or in different directions. And it says nothing at all about credit risk: a bond can hold its duration perfectly and still default.",
        },
        {
          type: "p",
          text: "Measuring exposure is the first half of the job. Doing something about it is the second, and that is where the hedging instruments come in.",
        },
      ],
      check: {
        question:
          "A pension fund must pay ZMW200 million in ten years. Why would it hold bonds with a duration of 10 rather than bonds maturing in ten years?",
        options: [
          "Matching duration means the assets and the obligation react to a rate change by about the same proportion, so the fund can still meet the payment",
          "Bonds with a duration of 10 pay a higher return than bonds maturing in ten years",
          "Ten-year bonds cannot be bought in sufficient quantity",
          "Duration matching removes the credit risk on the bonds",
        ],
        answer: 0,
        explain:
          "The obligation is a future cash flow, so it has a present value and a duration of its own, and it moves when rates move. Matching duration makes both sides move together — that is immunisation. Maturity matching does not, because a ten-year coupon bond returns cash along the way and behaves like a much shorter instrument.",
      },
    },
  ],
};
