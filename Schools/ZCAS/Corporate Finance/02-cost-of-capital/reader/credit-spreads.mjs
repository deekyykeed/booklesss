/* CF · Lesson 2 Cost of capital · Step 3 — Credit spreads and the cost of debt
 *
 * Source: 02_Cost_of_Capital_and_Capital_Structure/Credit Risk and Cost of
 * Capital — Session 2, 12 slides. Activities 1, 2 and 3 are the lecture's own
 * at their original figures; the spread table is the one printed both in the
 * lecture and on the sample question paper.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "credit-spreads",
  label: "Credit spreads",
  title: "Credit spreads and the cost of debt",
  kicker: "Cost of capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "credit-risk",
      heading: "What a lender charges for the chance of not being repaid",
      blocks: [
        {
          type: "p",
          text: "Credit risk is the risk that a borrower does not pay. Investors will lend into that risk, but only at a higher return than they would accept from a borrower who cannot default — and the difference between the two is the credit spread.",
        },
        {
          type: "formula",
          text: "Yield on a corporate bond  =  risk-free rate  +  credit spread",
          where: [
            "risk-free rate = the yield on a government bond of the same maturity",
            "credit spread = the premium demanded for that issuer’s credit risk",
          ],
        },
        {
          type: "p",
          text: "The risk-free rate is the base because a government borrowing in its own currency is taken as certain to repay. Its yield is pure compensation for waiting — for lending money now and consuming later. Anything a company pays above that is compensation for the possibility of not being repaid at all.",
        },
        {
          type: "p",
          text: "So the spread moves inversely with credit quality. A strong issuer pays a small premium; a weak one pays a large premium; and the same company pays different premiums at different maturities, because ten years is more time for things to go wrong than one.",
        },
        {
          type: "callout",
          kind: "key",
          text: "The government bond yield is what waiting costs. The spread is what doubt costs.",
        },
      ],
      check: {
        question:
          "Two companies issue five-year bonds on the same day. One is rated AA and pays 4.05%; the other is rated BB and pays 5.75%. The five-year government bond yields 3.70%. What does the difference tell you?",
        options: [
          "The BB issuer’s credit risk is priced at 205 basis points against 35 for the AA issuer",
          "The BB issuer is borrowing for longer, which is why its yield is higher",
          "The AA issuer is a better investment, because it will return more in total",
          "The gap is caused by the two bonds having different coupon rates",
        ],
        answer: 0,
        explain:
          "Both start from the same 3.70% risk-free base and the same maturity, so everything above it is the credit spread: 0.35% and 2.05%. The market is charging the weaker issuer nearly six times as much for the same money over the same period.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "reading-the-table",
      heading: "Reading the spread table",
      blocks: [
        {
          type: "p",
          text: "Spreads are published by credit rating and maturity, quoted in basis points. One basis point is 0.01%, so 100 basis points is 1%.",
        },
        {
          type: "table",
          columns: [
            { label: "Rating" },
            { label: "1 yr", align: "right" },
            { label: "2 yr", align: "right" },
            { label: "3 yr", align: "right" },
            { label: "5 yr", align: "right" },
            { label: "7 yr", align: "right" },
            { label: "10 yr", align: "right" },
            { label: "30 yr", align: "right" },
          ],
          rows: [
            ["AAA", "5", "10", "15", "20", "25", "33", "60"],
            ["AA", "15", "25", "30", "35", "44", "52", "71"],
            ["A", "35", "44", "55", "60", "65", "73", "90"],
            ["BBB", "60", "75", "100", "105", "112", "122", "143"],
            ["BB", "140", "180", "210", "205", "210", "250", "300"],
            ["B", "215", "220", "260", "300", "315", "350", "450"],
            ["CCC", "1,125", "1,225", "1,250", "1,200", "1,200", "1,275", "1,400"],
          ],
          note: "Corporate spreads for industrials, in basis points. This is the table printed on the exam paper — you are not expected to remember it, only to read it correctly.",
        },
        {
          type: "p",
          text: "FS Co is rated AA and has ten-year bonds in issue. The ten-year government bond currently returns 4.2%. Find AA against 10 years — 52 basis points, which is 0.52% — and add it.",
        },
        {
          type: "formula",
          text: "Expected yield  =  4.2%  +  0.52%  =  4.72%",
        },
        {
          type: "p",
          text: "Two things to be careful about. Read down to the right rating and across to the right maturity, since the table rewards a misread with a plausible-looking wrong answer. And convert the basis points before adding: 52 is 0.52%, not 52%, and not 5.2%.",
        },
        {
          type: "p",
          text: "Look at the size of the steps as you go down the ratings. Between AAA and BBB at ten years the spread roughly quadruples, from 33 to 122 basis points. Between BBB and CCC it multiplies by ten. Credit risk is not priced in a straight line — it accelerates sharply as quality falls, which is why a downgrade of one notch matters far more at the bottom of the table than at the top.",
        },
      ],
      check: {
        question:
          "A BBB-rated company has three-year bonds in issue. The three-year government bond yields 5.4%. What yield would you expect on the company’s bonds?",
        options: ["6.40%", "5.41%", "105.40%", "6.45%"],
        answer: 0,
        explain:
          "BBB at three years is 100 basis points, which is 1.00%, so 5.4% + 1.0% = 6.40%. Reading 100 basis points as 0.01% gives 5.41%; the 6.45% answer comes from taking the five-year column by mistake.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "interpolating",
      heading: "When the maturity is not in the table",
      blocks: [
        {
          type: "p",
          text: "The table jumps from 10 years to 30, so a 15-year bond has no column. Take the two nearest maturities and work out where between them the bond sits.",
        },
        {
          type: "formula",
          text: "Spread  =  lower spread  +  [ (higher spread − lower spread) ÷ (higher years − lower years) ]  ×  extra years",
          where: [
            "lower spread = the spread at the shorter maturity either side of the one you need",
            "higher spread = the spread at the longer maturity either side",
            "extra years = how far the bond’s maturity is beyond the shorter one",
          ],
        },
        {
          type: "p",
          text: "Folks Co is B-rated with 15-year bonds in issue, and the 15-year government bond yields 5%. B-rated spreads are 350 basis points at ten years and 450 at thirty.",
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Spread over the gap", "450 − 350", "100 bp"],
            ["Per year across the gap", "100 ÷ (30 − 10)", "5 bp"],
            ["Years past the ten-year point", "15 − 10", "5"],
            ["Spread at 15 years", "350 + 5 × 5", "375 bp"],
          ],
          total: ["Expected yield", "5% + 3.75%", "8.75%"],
        },
        {
          type: "p",
          text: "The middle two steps are where marks go. Divide by the width of the gap — twenty years, not fifteen and not twenty-nine — and then multiply by how far into that gap the bond falls.",
        },
        {
          type: "p",
          text: "It is a straight-line estimate of something that is not a straight line, and the table itself shows it: B-rated spreads widen fast in the early years and then flatten. Over a twenty-year gap, straight-line interpolation is an approximation and worth calling one in an answer.",
        },
      ],
      check: {
        question:
          "An A-rated company has 20-year bonds. A-rated spreads are 73 basis points at ten years and 90 at thirty. What spread applies?",
        options: ["81.5 basis points", "163 basis points", "84.4 basis points", "78.7 basis points"],
        answer: 0,
        explain:
          "(90 − 73) ÷ 20 = 0.85 bp per year, and 20 years is ten years past the ten-year point, so 73 + 8.5 = 81.5 bp. Twenty years sits exactly halfway between the two columns, so the answer had to be the midpoint of 73 and 90.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "cost-of-debt-capital",
      heading: "From yield to cost of debt",
      blocks: [
        {
          type: "p",
          text: "The yield is what the bondholder receives. The company’s cost is that yield after tax relief, which folds the two ideas together into one line.",
        },
        {
          type: "formula",
          text: "Cost of debt capital  =  (1 − t)  ×  (risk-free rate + credit spread)",
          where: [
            "t = the corporate tax rate",
            "risk-free rate = the government bond yield at the same maturity",
            "credit spread = read from the table for the issuer’s rating and maturity",
          ],
        },
        {
          type: "p",
          text: "Four things determine it, and a question will hand you all four: the company’s credit rating, the maturity of the debt, the risk-free rate at that maturity, and the tax rate.",
        },
        {
          type: "p",
          text: "MP Co is BBB-rated with five-year bonds in issue. Equivalent government bonds yield 3.7% and tax is 28%.",
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Credit spread — BBB, 5 years", "105 basis points", "1.05%"],
            ["Expected yield on the bonds", "3.7% + 1.05%", "4.75%"],
          ],
          total: ["Post-tax cost of debt", "4.75% × (1 − 0.28)", "3.42%"],
        },
        {
          type: "p",
          text: "3.42% is the figure that goes into MP Co’s weighted average cost of capital. Notice how little of it is credit risk: of the 4.75% the bondholders receive, 3.7 points are simply the price of time and only 1.05 is the premium for lending to MP Co rather than to the government. Tax then removes more than either.",
        },
      ],
      check: {
        question:
          "A B-rated company has seven-year bonds. Seven-year government bonds yield 6%, and tax is 30%. What is the company’s post-tax cost of this debt?",
        options: ["6.41%", "9.15%", "4.20%", "6.65%"],
        answer: 0,
        explain:
          "B at seven years is 315 basis points, so the yield is 6% + 3.15% = 9.15%, and (1 − 0.30) × 9.15% = 6.41%. The 9.15% answer is what the bondholders get, before the tax relief the company receives; 6.65% comes from reading the ten-year column instead of the seven-year one.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "what-moves-a-spread",
      heading: "What moves a spread, and what that costs",
      blocks: [
        {
          type: "p",
          text: "A rating is an opinion on the probability of default, and it is revised. When it moves, the spread moves with it, and the company’s cost of capital moves whether or not any of its existing debt is repriced.",
        },
        {
          type: "ul",
          items: [
            "Gearing rising — more debt against the same earnings leaves less cover for the interest, and the next lender charges for it.",
            "Earnings becoming more volatile — a customer lost, a commodity price turning, a single contract carrying too much of the revenue.",
            "The sector or the country deteriorating — an issuer rarely escapes a downgrade of the sovereign it operates in.",
            "The market’s appetite changing — spreads widen across every rating in a crisis, with nothing having changed at the individual company.",
          ],
        },
        {
          type: "p",
          text: "Follow the arithmetic through a downgrade of a ten-year issue from BBB to BB. The spread goes from 122 to 250 basis points, so the yield rises by 1.28% and the post-tax cost of debt at 30% by about 0.90%. On ZMW200 million of borrowing that is ZMW2.56 million of extra interest a year before tax.",
        },
        {
          type: "p",
          text: "The larger cost is not the interest. A higher cost of debt raises the weighted average cost of capital, and the WACC is the rate every project is appraised at — so projects that were marginally worth doing at the old rate now have negative NPVs. A downgrade does not just make borrowing dearer; it shrinks the set of investments the company is able to justify.",
        },
        {
          type: "p",
          text: "Which is why gearing is not only a financing question. Taking on debt lowers the cost of capital while the rating holds, and raises it once the rating gives way — and finding where that turn happens is what the rest of this lesson is about.",
        },
      ],
      check: {
        question:
          "A company is downgraded from BBB to BB. Beyond the extra interest, what is the more serious consequence?",
        options: [
          "Its WACC rises, so projects that previously had positive NPVs may no longer be worth doing",
          "It must immediately repay its existing bonds at the new higher yield",
          "Its cost of equity falls, because the shares become cheaper",
          "It has to restate the value of its debt in the accounts",
        ],
        answer: 0,
        explain:
          "The cost of capital is the hurdle every investment is measured against, so raising it withdraws projects from the company’s reach. Existing fixed-rate bonds keep paying their old coupon — the downgrade shows up in their market price and in the cost of the next borrowing, not in a demand for repayment.",
      },
    },
  ],
};
