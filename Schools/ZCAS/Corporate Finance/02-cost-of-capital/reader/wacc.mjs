/* CF · Lesson 2 Cost of capital · Step 4 — The weighted average cost of capital
 *
 * Source: 02_Cost_of_Capital_and_Capital_Structure/Cost of Capital — Session 1
 * (2025), slides 3–6 and 33–36. Activities 1, 2 and 6 are the lecture's own at
 * their original figures; MP Co carries over from the credit spreads step,
 * where its post-tax cost of debt was worked out.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "wacc",
  label: "WACC",
  title: "The weighted average cost of capital",
  kicker: "Cost of capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "the-idea",
      heading: "One rate for money from several places",
      blocks: [
        {
          type: "p",
          text: "A company funded by shareholders at 16% and lenders at 6% does not face a cost of capital of 16% or of 6%. It faces the average of the two, weighted by how much of its funding comes from each — the weighted average cost of capital.",
        },
        {
          type: "formula",
          text: "WACC  =  re × [ Ve ÷ (Ve + Vd) ]  +  rd(1 − t) × [ Vd ÷ (Ve + Vd) ]",
          where: [
            "re = the cost of equity",
            "rd = the pre-tax cost of debt",
            "t = the corporate tax rate",
            "Ve = the value of the equity",
            "Vd = the value of the debt",
          ],
        },
        {
          type: "p",
          text: "The two proportions add to 1, which is the check to run before going any further. Where a company has preference shares as well the formula simply grows another term — cost times proportion, once per source, and the whole thing still sums to one.",
        },
        {
          type: "p",
          text: "EK Co is 20% debt financed. Its cost of equity is 15%, its pre-tax cost of debt 10%, and tax is 35%.",
        },
        {
          type: "formula",
          text: "WACC  =  (15% × 0.80)  +  (10% × 0.65 × 0.20)  =  12.0% + 1.3%  =  13.3%",
        },
        {
          type: "p",
          text: "One warning that costs marks every year. Where the question gives the cost of debt after tax, use it as it stands — TC Co, funded by ZMW60m of equity and ZMW20m of debt, with a cost of equity of 12% and an after-tax cost of debt of 8%, has a WACC of 12% × 0.75 + 8% × 0.25 = 11.0%. A tax rate mentioned in the same paragraph is there to be ignored. Applying it a second time would relieve the same interest twice.",
        },
        {
          type: "callout",
          text: "Only long-term finance goes into WACC. An overdraft and next month’s payables are not sources of capital.",
        },
      ],
      check: {
        question:
          "A company is funded by ZMW90 million of equity costing 18% and ZMW30 million of debt whose after-tax cost is 7%. Tax is 30%. What is its WACC?",
        options: ["15.25%", "14.73%", "12.50%", "13.60%"],
        answer: 0,
        explain:
          "18% × 0.75 + 7% × 0.25 = 13.5% + 1.75% = 15.25%. The 7% is already after tax, so the 30% is not applied again — doing so gives 14.73% and understates the cost of capital.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "market-values",
      heading: "Weighting by market value",
      blocks: [
        {
          type: "p",
          text: "The weights are market values, not the figures in the statement of financial position. Book value records what was raised when the shares were issued, sometimes decades ago; market value records what the finance is worth now, which is what an investor would have to commit today to buy into the company.",
        },
        {
          type: "p",
          text: "The gap is not small. A company with ZMW50 million of ordinary share capital at nominal value may have equity worth ZMW250 million in the market. Weighting by book value would put the equity at a fifth of its real share of the funding — and since equity is always the dearest source, that quietly drags the WACC down and makes every project look better than it is.",
        },
        {
          type: "table",
          columns: [{ label: "Source" }, { label: "Market value is" }],
          rows: [
            ["Ordinary shares", "Number of shares × the ex-div market price"],
            ["Preference shares", "(Nominal value ÷ 100) × the quoted price per ZMW100"],
            ["Traded bonds", "(Nominal value ÷ 100) × the quoted price per ZMW100"],
            ["Bank loans", "The amount outstanding — there is no market price"],
          ],
        },
        {
          type: "p",
          text: "Watch the units on the quoted prices. Ordinary shares are quoted per share, so ZMW1.20 against 100 million shares gives ZMW120 million. Bonds and preference shares are quoted per ZMW100 of nominal value, so ZMW40 million of bonds quoted at ZMW85 is worth (40m ÷ 100) × 85 = ZMW34 million, not ZMW85 million and not ZMW3.4 billion.",
        },
        {
          type: "p",
          text: "Debt trading at par needs no calculation. Its market value is its nominal value, which is exactly what trading at par means — and it is the usual position for a bank loan and for a bond issued recently at a rate the market still agrees with.",
        },
      ],
      check: {
        question:
          "A company has ZMW60 million of ordinary shares of ZMW0.60 each, trading at ZMW1.20. What is the market value of its equity?",
        options: ["ZMW120 million", "ZMW60 million", "ZMW72 million", "ZMW36 million"],
        answer: 0,
        explain:
          "ZMW60m ÷ ZMW0.60 = 100 million shares, and 100m × ZMW1.20 = ZMW120 million. The ZMW60 million is the nominal value of the share capital, and the number of shares has to be recovered from it before the market price can be applied.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "worked-example",
      heading: "Working a full WACC",
      blocks: [
        {
          type: "p",
          text: "MBS is funded by 80 million ZMW1 ordinary shares, 8% preference share capital of ZMW30 million, and ZMW40 million of debt trading at par. The preference shares are irredeemable and quoted at ZMW85 per ZMW100 nominal. The latest ordinary dividend was 20 ngwee, growing at a constant 6%, and the shares stand at 212 ngwee. The debt beta is 0.75, the risk-free rate 4.6% and the market risk premium 6%. Tax is 30%.",
        },
        {
          type: "p",
          text: "Work out each cost first, using whichever model that source calls for.",
        },
        {
          type: "table",
          columns: [{ label: "Source" }, { label: "Method" }, { label: "Working" }, { label: "Cost", align: "right" }],
          rows: [
            ["Ordinary shares", "Dividend growth model", "(20 × 1.06) ÷ 212 + 0.06", "16.00%"],
            ["Preference shares", "Dividend ÷ price", "(8% × ZMW100) ÷ 85", "9.41%"],
            ["Debt", "CAPM, then tax", "4.6% + 0.75 × 6% = 9.10%", "9.10%"],
          ],
          note: "Only the debt is adjusted for tax, and that happens in the table below. Preference dividends carry no relief.",
        },
        {
          type: "p",
          text: "Then the market values. The ordinary shares are quoted per share; the preference shares per ZMW100 of nominal value; the debt is at par.",
        },
        {
          type: "table",
          columns: [{ label: "Source" }, { label: "Working" }, { label: "Market value ZMW’m", align: "right" }],
          rows: [
            ["Ordinary shares", "80m shares × ZMW2.12", "169.60"],
            ["Preference shares", "(ZMW30m ÷ 100) × ZMW85", "25.50"],
            ["Debt", "At par", "40.00"],
          ],
          total: ["Total capital", "", "235.10"],
        },
        {
          type: "p",
          text: "Now weight each cost by its share of the ZMW235.10 million.",
        },
        {
          type: "table",
          columns: [
            { label: "Source" },
            { label: "Value ZMW’m", align: "right" },
            { label: "Proportion", align: "right" },
            { label: "Cost", align: "right" },
            { label: "Contribution", align: "right" },
          ],
          rows: [
            ["Ordinary shares", "169.60", "0.7214", "16.00%", "11.54%"],
            ["Preference shares", "25.50", "0.1085", "9.41%", "1.02%"],
            ["Debt", "40.00", "0.1701", "9.10% × 0.70 = 6.37%", "1.08%"],
          ],
          total: ["WACC", "235.10", "1.0000", "", "13.64%"],
        },
        {
          type: "p",
          text: "13.64%, and the shape of the answer is worth reading. Equity is 72% of the funding and 85% of the cost. The debt is the cheapest money in the business by a wide margin — 6.37% against 16% — and MBS is using very little of it. Whether it should use more is the question the next two steps deal with.",
        },
      ],
      check: {
        question:
          "In the working above, why is the debt cost shown as 9.10% × 0.70 while the preference share cost stays at 9.41%?",
        options: [
          "Interest is deducted before tax and so attracts relief; preference dividends are paid out of taxed profit and do not",
          "Because the debt is trading at par and the preference shares are not",
          "Because the debt cost came from CAPM and CAPM is always stated before tax",
          "Because preference shares rank ahead of ordinary shares in a liquidation",
        ],
        answer: 0,
        explain:
          "The tax adjustment tracks deductibility, nothing else. Interest reduces the company’s taxable profit, so the government bears 30% of it. A preference dividend is a distribution, so the company bears all of it — which is why 9.41% costs more than a 9.10% loan.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "wacc-from-a-rating",
      heading: "Building a WACC from a credit rating",
      blocks: [
        {
          type: "p",
          text: "The same calculation runs from a rating rather than from a bond price. MP Co is BBB-rated with five-year bonds and 25% gearing. Equivalent government bonds yield 3.7%, the market returns 10.65%, its equity beta is 1.05 and tax is 28%.",
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Credit spread — BBB, 5 years", "105 basis points", "1.05%"],
            ["Yield on the bonds", "3.7% + 1.05%", "4.75%"],
            ["Post-tax cost of debt", "4.75% × (1 − 0.28)", "3.42%"],
            ["Cost of equity", "3.7% + 1.05 × (10.65% − 3.7%)", "11.00%"],
          ],
        },
        {
          type: "p",
          text: "Then blend at the gearing given — 25% debt, so 75% equity.",
        },
        {
          type: "table",
          columns: [
            { label: "Source" },
            { label: "Cost", align: "right" },
            { label: "Proportion", align: "right" },
            { label: "Contribution", align: "right" },
          ],
          rows: [
            ["Equity", "11.00%", "0.75", "8.25%"],
            ["Debt", "3.42%", "0.25", "0.86%"],
          ],
          total: ["WACC", "", "1.00", "9.11%"],
        },
        {
          type: "p",
          text: "The risk-free rate appears twice in that working — once as the base of the bond yield and once as the base of CAPM — and it should. Both investors start from what government paper pays and add a premium for the risk they are taking. The lenders’ premium is 1.05%; the shareholders’ is 7.30%, seven times as much, and that difference is the whole of why debt is cheap.",
        },
      ],
      check: {
        question:
          "MP Co’s cost of equity is 11.00% and its post-tax cost of debt is 3.42%. If it moved from 25% to 40% gearing and both costs somehow stayed the same, what would happen to its WACC?",
        options: [
          "It would fall to about 8.0%, because more of the funding would come from the cheaper source",
          "It would rise, because the company would be riskier",
          "It would stay at 9.11%, because the individual costs have not changed",
          "It would fall to about 3.4%, the cost of the debt",
        ],
        answer: 0,
        explain:
          "11.00% × 0.60 + 3.42% × 0.40 = 6.60% + 1.37% = 7.97%. That is the arithmetic — but the words 'somehow stayed the same' are carrying it. In reality both costs would rise as the borrowing grew, and whether the WACC really falls is the argument the capital structure theories are about.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "when-wacc-works",
      heading: "When WACC is the right rate",
      blocks: [
        {
          type: "p",
          text: "WACC is the discount rate for a project only when that project looks like the company that is doing it. Three conditions have to hold, and each one has a project that breaks it.",
        },
        {
          type: "ul",
          items: [
            "The project carries the same business risk as the existing business. A maize miller opening a mobile money service is not funding more milling, and its WACC prices milling risk.",
            "The project does not change the capital structure. Where it does, the weights the WACC was built from no longer describe the company.",
            "The project is small enough relative to the company that neither of the above shifts much.",
          ],
        },
        {
          type: "p",
          text: "Break the first and the fix is a project-specific discount rate, built by taking a beta from companies already in that industry. Break the second and the fix is APV, which values the project and its financing separately rather than blending them into one rate.",
        },
        {
          type: "p",
          text: "There is also a difference between the average cost of the finance already raised and the cost of the next kwacha. WACC measures the average. Where a company is close to the limit of what its lenders will advance, the marginal cost of new debt is well above the average — and it is the marginal cost that the next project actually incurs.",
        },
        {
          type: "p",
          text: "Used inside those limits, WACC is the single most-used number in corporate finance: the hurdle rate for capital expenditure, the discount rate in a valuation, and the benchmark a division’s returns are judged against. Used outside them, it systematically approves risky projects and rejects safe ones, because it charges every project the same rate regardless of the risk it brings.",
        },
      ],
      check: {
        question:
          "A Zambian retailer with a WACC of 14% is appraising a move into copper exploration. Why is 14% the wrong discount rate?",
        options: [
          "Exploration carries far higher business risk than retailing, so it requires a higher return than the retailer’s own WACC reflects",
          "Because the project is in mining, and mining projects are always appraised by APV",
          "Because a WACC calculated from a retailer’s share price cannot be applied to any new project",
          "Because exploration projects have no cash flows in the early years",
        ],
        answer: 0,
        explain:
          "The 14% was built from the risk the market sees in a retailer. Charging an exploration project only what a retail project has to earn will approve it on a hurdle far too low. The fix is a rate built from the risk of the activity being entered — typically from the betas of companies already doing it.",
      },
    },
  ],
};
