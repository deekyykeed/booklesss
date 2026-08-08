/* CF · Lesson 1 Investment appraisal · Step 5 — Adjusted present value
 *
 * Source: 01_Investment_Appraisal/Lectures/Adjusted Present Value (APV) (2024),
 * 17 slides. The worked example is the lecture's Noble plc practice question at
 * its original figures, and the grossing-up example is the lecture's own.
 *
 * The lecture prints the base case NPV as 224 and the PVITS as 309; both are
 * the sums of its rounded per-year present values, and those are the figures
 * used here so the step and the slide agree line for line.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "apv",
  label: "Adjusted present value",
  title: "Adjusted present value",
  kicker: "Investment appraisal",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "why-apv",
      heading: "Splitting the project from the way it is funded",
      blocks: [
        {
          type: "p",
          text: "Adjusted present value appraises a project in two separate pieces: what the project is worth if it were funded entirely by shareholders, and what the chosen financing adds or costs on top. Add the two and you have the APV.",
        },
        {
          type: "formula",
          text: "APV  =  base case NPV  +  PV of financing side effects",
          where: [
            "base case NPV = the project valued as though an all-equity company were doing it",
            "PV of financing side effects = the issue costs and tax reliefs the actual funding brings",
          ],
        },
        {
          type: "p",
          text: "An ordinary NPV cannot do this, because it buries the financing inside the discount rate. WACC is a blend of what the shareholders and the lenders demand at the company’s current mix of debt and equity — so the moment a project changes that mix, the WACC you discounted at describes a company that no longer exists.",
        },
        {
          type: "p",
          text: "That is exactly when APV earns its place. A cooperative that has always been equity-funded taking on a large loan for one expansion, or a mining subsidiary financed with far more debt than its parent carries, has changed its financial risk. Discounting at the old WACC would flatter or punish the project for reasons that have nothing to do with the project.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Use APV when the project changes the company’s gearing. Use WACC when it does not.",
        },
      ],
      check: {
        question:
          "When is APV the right method rather than an ordinary NPV at the company’s WACC?",
        options: [
          "When the project’s financing changes the company’s debt-to-equity ratio",
          "When the project is large enough to matter to the company",
          "Whenever a project is partly funded by debt",
          "When the project’s cash flows are difficult to forecast",
        ],
        answer: 0,
        explain:
          "WACC is only valid for a project that leaves the capital structure roughly where it was, because that mix is what the rate was built from. Debt on its own is not the trigger — a company that is already 40% geared borrowing at 40% has changed nothing.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "base-case",
      heading: "The base case NPV",
      blocks: [
        {
          type: "p",
          text: "The base case NPV is the project appraised as though an all-equity company were undertaking it, with every financing effect ignored. No interest, no tax relief on interest, no issue costs — just the project’s own operating cash flows, discounted.",
        },
        {
          type: "p",
          text: "The rate you discount at has to match that fiction. It is the ungeared cost of equity: the return shareholders would demand for the project’s business risk alone, with no financial risk stacked on top.",
        },
        {
          type: "ul",
          items: [
            "The business risk comes from what the project does — the volatility of its sales, the fixed costs it carries, the market it sells into.",
            "The financial risk comes from how it is paid for. Borrowing makes the shareholders’ returns more volatile, and they charge for that.",
          ],
        },
        {
          type: "p",
          text: "Those two risks are what the two betas separate. The equity beta measures both together, as the market sees them in a geared company’s shares. The asset beta — the ungeared beta — strips the borrowing out and measures the business risk on its own, which is the one the base case needs.",
        },
        {
          type: "formula",
          text: "Ungeared cost of equity  =  rf  +  βa × (rm − rf)",
          where: [
            "rf = the risk-free rate, taken as the yield on government securities",
            "βa = the asset (ungeared) beta, reflecting business risk only",
            "rm − rf = the market risk premium",
          ],
        },
        {
          type: "p",
          text: "Where a question simply gives you the ungeared cost of equity, use it as stated. Where it gives you an asset beta instead, CAPM turns it into the rate — and where it gives you both an equity beta and an asset beta, the asset beta is the one the base case wants. The equity beta belongs to the geared company, and the base case is deliberately not that company.",
        },
      ],
      check: {
        question:
          "A project is being appraised by APV. The firm’s equity beta is 1.25 and its asset beta is 0.90. Which should be used to find the discount rate for the base case NPV?",
        options: [
          "The asset beta of 0.90, because the base case assumes no borrowing",
          "The equity beta of 1.25, because shareholders are the ones providing the equity",
          "The average of the two, since the project is partly debt-funded",
          "Neither — the base case is discounted at the cost of debt",
        ],
        answer: 0,
        explain:
          "The base case pretends the company has no debt, so the rate must carry no financial risk. The equity beta of 1.25 is higher precisely because it includes the gearing effect the base case is deliberately setting aside — the financing gets valued separately, in the second half of the calculation.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "financing-side-effects",
      heading: "The financing side effects",
      blocks: [
        {
          type: "p",
          text: "Financing cash flows are the costs and benefits that exist only because of how the project is paid for. There are two of them.",
        },
        {
          type: "ul",
          items: [
            "Issue costs — the fees paid to raise the money. An outflow, and normally at year 0.",
            "Tax relief on the interest — the tax the company does not pay because interest is deductible. An inflow, one per year for as long as the debt is outstanding.",
          ],
        },
        {
          type: "p",
          text: "These are discounted at a low rate, not at the cost of equity, because they are low-risk cash flows. The interest saving depends on a loan schedule and a tax rate, both known in advance. Use the pre-tax cost of debt or the risk-free rate — the question will tell you which.",
        },
        {
          type: "h2",
          text: "Issue costs and the tax treatment",
        },
        {
          type: "p",
          text: "The two kinds of issue cost are not treated alike, and the difference is worth a mark on its own.",
        },
        {
          type: "table",
          columns: [{ label: "Issue costs of" }, { label: "Tax deductible?" }, { label: "So the figure you use is" }],
          rows: [
            ["Debt", "Yes", "The cost net of tax — cost × (1 − t)"],
            ["Equity", "No", "The full cost, gross"],
          ],
        },
        {
          type: "p",
          text: "So gross debt issue costs of ZMW338.60 with tax at 30% enter the calculation at 338.60 × 0.70 = ZMW237.",
        },
        {
          type: "h2",
          text: "Grossing up",
        },
        {
          type: "p",
          text: "Where the finance raised has to cover its own issue costs, the amount you need to raise is larger than the amount you want to spend. If a project needs ZMW2.4 million net and issue costs are 4%, then that ZMW2.4 million is 96% of the sum raised.",
        },
        {
          type: "formula",
          text: "Amount to raise  =  amount needed ÷ (1 − issue cost %)",
          where: [
            "amount needed = the cash the project actually requires",
            "issue cost % = the fee expressed as a percentage of the sum raised",
          ],
        },
        {
          type: "p",
          text: "ZMW2.4m ÷ 0.96 = ZMW2,500,000 must be raised, and the issue cost is 4% × 2,500,000 = ZMW100,000. In one step, that is 2.4m × 4/96 = ZMW100,000. Taking 4% of the ZMW2.4 million instead gives ZMW96,000 and leaves the project ZMW4,000 short — the fee has to be charged on the whole amount raised, including the part that pays the fee.",
        },
      ],
      check: {
        question:
          "A company needs ZMW9.6 million net for a project. Issue costs are 4% of the sum raised. What are the issue costs?",
        options: [
          "ZMW400,000",
          "ZMW384,000",
          "ZMW9,984,000",
          "ZMW416,000",
        ],
        answer: 0,
        explain:
          "9.6m ÷ 0.96 = ZMW10 million must be raised, and 4% of that is ZMW400,000. ZMW384,000 is 4% of the net amount, which quietly leaves the project ZMW16,000 short of what it needs.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "interest-tax-shield",
      heading: "The interest tax shield",
      blocks: [
        {
          type: "p",
          text: "The interest tax shield is the tax the company avoids because interest is deducted before profit is taxed. Borrow ZMW6,000 at 8% and the ZMW480 of interest reduces taxable profit by ZMW480 — which at a 30% tax rate is ZMW144 of tax the company never pays.",
        },
        {
          type: "formula",
          text: "Interest tax shield  =  interest payable  ×  tax rate",
          where: [
            "interest payable = the loan balance at the start of the year × the interest rate",
            "tax rate = the corporate tax rate",
          ],
        },
        {
          type: "p",
          text: "Four steps, in order, and the first is the one people skip: you need the loan balance at the start of each year, because that is what the interest is charged on.",
        },
        {
          type: "ul",
          items: [
            "Lay out the loan year by year, opening balance and repayment, until it is cleared.",
            "Multiply each opening balance by the interest rate to get that year’s interest.",
            "Multiply the interest by the tax rate to get the shield.",
            "Discount each shield at the pre-tax cost of debt and add them up.",
          ],
        },
        {
          type: "p",
          text: "Where the loan is repaid in instalments the shield shrinks every year, because the balance it is calculated on is shrinking. Where the loan runs to the end and is repaid in one go — or is never repaid at all — the interest, and so the shield, stays flat.",
        },
        {
          type: "callout",
          kind: "warning",
          text: "The shield is worth the tax on the interest, never the interest itself. Discounting the whole interest payment overstates the benefit by a factor of about three.",
        },
      ],
      check: {
        question:
          "A company borrows ZMW8 million at 12%, repayable in four equal instalments, with tax at 30%. What is the interest tax shield in year 2?",
        options: [
          "ZMW216,000",
          "ZMW288,000",
          "ZMW720,000",
          "ZMW240,000",
        ],
        answer: 0,
        explain:
          "ZMW2 million was repaid at the end of year 1, so year 2 opens with ZMW6 million. Interest is 12% × 6m = ZMW720,000 and the shield is 30% of that = ZMW216,000. ZMW288,000 is the year 1 shield, calculated on the full ZMW8 million.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "worked-example",
      heading: "Working an APV",
      blocks: [
        {
          type: "p",
          text: "Noble plc has a project costing ZMW10,000 with cash inflows of ZMW1,500, ZMW2,500, ZMW4,500 and ZMW5,000 over four years. The ungeared cost of equity is 10%. Start with the base case, ignoring the funding entirely.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Cash flow ZMW", align: "right" },
            { label: "Factor at 10%", align: "right" },
            { label: "Present value ZMW", align: "right" },
          ],
          rows: [
            ["0", "(10,000)", "1.000", "(10,000)"],
            ["1", "1,500", "0.909", "1,364"],
            ["2", "2,500", "0.826", "2,065"],
            ["3", "4,500", "0.751", "3,380"],
            ["4", "5,000", "0.683", "3,415"],
          ],
          total: ["Base case NPV", "", "", "224"],
        },
        {
          type: "p",
          text: "ZMW224 positive, so the project is worth doing even before any financing benefit — though only just. On these numbers the financing is going to decide how comfortable the decision is.",
        },
        {
          type: "p",
          text: "Now the funding. ZMW6,000 of it is 8% debt, reduced by ZMW1,500 at the end of each year, with tax at 30%. Gross debt issue costs are ZMW338.60. Take the tax shield first, and note the opening balance stepping down as the loan is repaid.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Loan at start ZMW", align: "right" },
            { label: "Repaid ZMW", align: "right" },
            { label: "Interest at 8% ZMW", align: "right" },
            { label: "Shield at 30% ZMW", align: "right" },
            { label: "Factor at 8%", align: "right" },
            { label: "PV ZMW", align: "right" },
          ],
          rows: [
            ["1", "6,000", "1,500", "480", "144", "0.926", "133"],
            ["2", "4,500", "1,500", "360", "108", "0.857", "93"],
            ["3", "3,000", "1,500", "240", "72", "0.794", "57"],
            ["4", "1,500", "1,500", "120", "36", "0.735", "26"],
          ],
          total: ["PV of the interest tax shield", "", "", "", "", "", "309"],
        },
        {
          type: "p",
          text: "The shields are discounted at 8% — the cost of the debt itself — because that is the risk of the cash flow. Then the issue costs: gross ZMW338.60, and debt issue costs are tax deductible, so ZMW338.60 × 0.70 = ZMW237. They are paid at the start, so no discounting is needed.",
        },
        {
          type: "table",
          columns: [{ label: "Adjusted present value" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Base case NPV", "224"],
            ["PV of the interest tax shield", "309"],
            ["Debt issue costs, net of tax", "(237)"],
          ],
          total: ["APV", "296"],
        },
        {
          type: "p",
          text: "The APV is ZMW296 and the project is accepted. Read the three lines rather than just the answer. The project on its own is barely worth doing at ZMW224; the tax shield adds more value than the project’s own final year does; and the issue costs eat most of the shield. On a marginal project, the financing decision is doing as much work as the investment decision — which is the whole reason APV shows them separately.",
        },
      ],
      check: {
        question:
          "Noble’s APV is ZMW296. Suppose the ZMW6,000 loan were repayable in full at the end of year 4 rather than in instalments, everything else unchanged. What happens?",
        options: [
          "The APV rises, because interest is charged on ZMW6,000 for all four years and the shield is larger",
          "The APV is unchanged, because the same ZMW6,000 is borrowed either way",
          "The APV falls, because the company carries the debt for longer and pays more interest",
          "The APV rises, because the issue costs are spread over four years instead of paid at the start",
        ],
        answer: 0,
        explain:
          "The shield is calculated on the opening balance, so a loan that never amortises shields ZMW480 of interest every year rather than a shrinking amount — ZMW144 a year instead of 144, 108, 72, 36. The extra interest itself is not a cost in this working: interest payments never appear as an APV cash flow, only the tax they save does.",
      },
    },
  ],
};
