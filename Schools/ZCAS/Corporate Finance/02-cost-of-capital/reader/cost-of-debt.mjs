/* CF · Lesson 2 Cost of capital · Step 2 — The cost of debt and preference shares
 *
 * Source: 02_Cost_of_Capital_and_Capital_Structure/Cost of Capital — Session 1
 * (2025), slides 2, 7, 22–32. The YTM worked example is the lecture's TC Co
 * activity at its original figures.
 *
 * NB the lecture rounds the interpolation to 9.68%; 1.73 ÷ 2.51 × 1% is 0.69%,
 * so the YTM is 9.69%. That figure is used here.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "cost-of-debt",
  label: "Cost of debt",
  title: "The cost of debt and preference shares",
  kicker: "Cost of capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "why-cheaper",
      heading: "Why debt costs less",
      blocks: [
        {
          type: "p",
          text: "Debt is the cheapest source of long-term finance a company has, for two reasons that stack on top of each other.",
        },
        {
          type: "ul",
          items: [
            "Lenders take less risk than shareholders. They are paid before any dividend, they usually hold security, and they rank ahead in a liquidation — so they require less.",
            "Interest is deducted before tax. Every kwacha of interest reduces taxable profit, so the government pays part of the bill.",
          ],
        },
        {
          type: "p",
          text: "The second point is the one that changes the arithmetic. A company borrowing at 10% with tax at 30% does not really bear 10%. The interest reduces its tax bill by 3%, so the cost to the company is 7%.",
        },
        {
          type: "formula",
          text: "After-tax cost of debt  =  pre-tax cost  ×  (1 − t)",
          where: [
            "pre-tax cost = the interest rate or yield the lender receives",
            "t = the corporate tax rate",
          ],
        },
        {
          type: "p",
          text: "Two different numbers are now in play and they answer different questions. The pre-tax cost is what the investor earns; the after-tax cost is what the company bears. WACC is built from what the company bears, so the after-tax figure is the one that goes into it.",
        },
        {
          type: "p",
          text: "The relief only exists if there is taxable profit to relieve. A company making losses is paying the full 10% and getting nothing back, which is one reason lossmaking firms find debt so much heavier than the textbook suggests.",
        },
      ],
      check: {
        question:
          "Zanaco lends a manufacturer at 14%. The company’s tax rate is 30%. What is the cost of that loan to the company?",
        options: [
          "9.8%",
          "14%, because that is the interest the bank actually charges",
          "18.2%",
          "4.2%",
        ],
        answer: 0,
        explain:
          "14% × (1 − 0.30) = 9.8%. The bank still receives 14% — the company simply pays 30% less tax as a result, and it is what the company bears that belongs in its cost of capital.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "loans-and-preference",
      heading: "Bank loans and preference shares",
      blocks: [
        {
          type: "p",
          text: "A bank loan is the simplest case. It is not traded, so there is no market price to work from and no yield to calculate — the cost is the interest rate written into the agreement, adjusted for tax.",
        },
        {
          type: "formula",
          text: "Cost of a bank loan  =  interest rate  ×  (1 − t)",
          where: [
            "interest rate = the rate stated in the loan agreement",
            "t = the corporate tax rate",
          ],
        },
        {
          type: "p",
          text: "Preference shares look like debt and are treated like equity. They pay a fixed dividend, they rank ahead of ordinary shares, and where they are irredeemable that dividend is a perpetuity — so the cost is the yield the market is getting on them.",
        },
        {
          type: "formula",
          text: "rp  =  D ÷ P₀  × 100",
          where: [
            "D = the fixed annual preference dividend, being the coupon rate × the nominal value",
            "P₀ = the current market price of the preference share, ex-div",
          ],
        },
        {
          type: "p",
          text: "8% preference shares of ZMW100 nominal, quoted at ZMW85, cost 8 ÷ 85 = 9.41%. The dividend is fixed at ZMW8 by the nominal value, not by the price — the price is what an investor pays today to receive it.",
        },
        {
          type: "callout",
          kind: "warning",
          text: "A preference dividend is a distribution of profit, not a charge against it, so there is no tax relief. Never multiply the cost of preference shares by (1 − t).",
        },
        {
          type: "p",
          text: "That single difference is why preference shares can cost more than a bank loan carrying a higher headline rate. A 15% loan taxed at 30% costs 10.5%; 9.41% preference shares cost 9.41%; but 12% preference shares would cost 12% against a 15% loan’s 10.5%, and the loan would be cheaper despite looking more expensive on the face of it.",
        },
      ],
      check: {
        question:
          "A company has 9% ZMW100 irredeemable preference shares quoted at ZMW72. Tax is 30%. What is their cost?",
        options: ["12.50%", "8.75%", "9.00%", "6.30%"],
        answer: 0,
        explain:
          "9% × ZMW100 = ZMW9 of dividend, and 9 ÷ 72 = 12.50%. No tax adjustment is made: preference dividends are paid out of taxed profit, so unlike interest they save the company nothing.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "irredeemable-bonds",
      heading: "Irredeemable bonds",
      blocks: [
        {
          type: "p",
          text: "An irredeemable bond has a fixed coupon and no maturity date. The interest runs forever, so it is a perpetuity, and its cost is the coupon divided by the market price. Interest is deductible, so this one does carry the tax adjustment.",
        },
        {
          type: "formula",
          text: "rd  =  C(1 − t) ÷ P₀  × 100",
          where: [
            "C = the annual coupon payment, being the coupon rate × the nominal value",
            "t = the corporate tax rate",
            "P₀ = the market price of the bond, ex-interest",
          ],
        },
        {
          type: "p",
          text: "The nominal value sets the coupon; the market price sets the yield. A ZMW1,000 bond with a 9% coupon pays ZMW90 a year for as long as it exists, whatever the bond changes hands for. If it trades at ZMW1,125 the buyer is getting 90 ÷ 1,125 = 8%, and if it trades at ZMW900 the buyer is getting 10%.",
        },
        {
          type: "p",
          text: "So a bond’s price and its yield always move in opposite directions. That relationship holds for every fixed-income instrument and it is worth carrying forward — it is the whole reason interest rate risk exists.",
        },
        {
          type: "p",
          text: "With tax at 25%, that ZMW1,000 9% bond trading at ZMW1,125 costs the company 90 × 0.75 ÷ 1,125 = 6%, against the 8% its holder receives.",
        },
      ],
      check: {
        question:
          "Market interest rates fall. What happens to the price of an irredeemable bond already in issue?",
        options: [
          "It rises, because the fixed coupon is now worth more than what newly issued bonds pay",
          "It falls, because the return on the bond is now less attractive",
          "It is unchanged, because the coupon is fixed by the nominal value",
          "It rises only if the issuer’s credit rating improves at the same time",
        ],
        answer: 0,
        explain:
          "The coupon cannot change, so the only thing that can move is the price. A bond paying ZMW90 a year in a market that now demands 6% is worth 90 ÷ 0.06 = ZMW1,500, up from ZMW1,125 when the market wanted 8%. Investors bid up existing bonds until their yield matches what new ones offer.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "redeemable-bonds",
      heading: "Redeemable bonds and yield to maturity",
      blocks: [
        {
          type: "p",
          text: "A redeemable bond pays a coupon and then repays its nominal value on a fixed date. Two kinds of cash flow, one of them years away, so there is no dividing one number by another. Its cost is the yield to maturity — the discount rate at which the present value of everything the bond pays equals what it costs today.",
        },
        {
          type: "p",
          text: "That is an IRR, and it is found the same way: two rates, one either side, then interpolate.",
        },
        {
          type: "formula",
          text: "YTM  =  A  +  [ a ÷ (a − b) ]  ×  (B − A)",
          where: [
            "A = the lower discount rate, giving a positive NPV",
            "a = the NPV at rate A",
            "B = the higher discount rate, giving a negative NPV",
            "b = the NPV at rate B, a negative figure",
          ],
        },
        {
          type: "p",
          text: "TC Co has 9% ZMW100 bonds redeemable at par in three years, trading at ZMW98.25. Lay out the cash flows from the investor’s side: pay ZMW98.25 now, receive ZMW9 a year, and ZMW109 in the final year when the coupon and the redemption arrive together.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Cash flow ZMW", align: "right" },
            { label: "Factor at 9%", align: "right" },
            { label: "PV ZMW", align: "right" },
            { label: "Factor at 10%", align: "right" },
            { label: "PV ZMW", align: "right" },
          ],
          rows: [
            ["0", "(98.25)", "1.000", "(98.25)", "1.000", "(98.25)"],
            ["1", "9.00", "0.917", "8.25", "0.909", "8.18"],
            ["2", "9.00", "0.842", "7.58", "0.826", "7.43"],
            ["3", "109.00", "0.772", "84.15", "0.751", "81.86"],
          ],
          total: ["NPV", "", "", "1.73", "", "(0.78)"],
        },
        {
          type: "formula",
          text: "YTM  =  9%  +  [ 1.73 ÷ 2.51 ]  ×  1%  =  9.69%",
        },
        {
          type: "p",
          text: "The yield is above the 9% coupon, and it has to be: the bond costs ZMW98.25 and repays ZMW100, so the holder collects a ZMW1.75 gain on top of the interest. A bond trading above par works the other way — the holder takes a loss at redemption and the yield falls below the coupon.",
        },
        {
          type: "p",
          text: "9.69% is what the investor earns. To get what the company bears, run the same calculation using the coupon net of tax. Some questions ask for one, some for the other, and the difference is several percentage points — read which is wanted before laying out the table.",
        },
      ],
      check: {
        question:
          "A redeemable bond has a 7% coupon and is trading above its nominal value. Without calculating, what do you know about its yield to maturity?",
        options: [
          "It is below 7%, because the holder will lose the premium when the bond is redeemed at par",
          "It is above 7%, because the holder paid more and requires more",
          "It is exactly 7%, because the coupon is fixed",
          "It cannot be inferred without knowing the years to maturity",
        ],
        answer: 0,
        explain:
          "Paying more than par means taking a capital loss at redemption, and that loss is netted against the coupon over the bond’s life. Coupon above yield, price above par; coupon below yield, price below par — the two always point the same way.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "picking-the-method",
      heading: "Picking the right method",
      blocks: [
        {
          type: "p",
          text: "Each instrument has one method, and it follows from the shape of the cash flows rather than from anything you need to memorise. A perpetuity divides; a finite stream with a repayment at the end needs an IRR; an untraded loan has no price to divide by, so it uses its stated rate.",
        },
        {
          type: "table",
          columns: [{ label: "Source" }, { label: "Method" }, { label: "Tax relief?" }],
          rows: [
            ["Bank loan", "The interest rate in the agreement", "Yes"],
            ["Irredeemable bond", "Interest yield — coupon ÷ market price", "Yes"],
            ["Redeemable bond", "Yield to maturity, by interpolation", "Yes"],
            ["Convertible bond", "Yield to maturity, using the conversion value at the end", "Yes"],
            ["Preference shares", "Dividend ÷ market price", "No"],
            ["Debt with a known beta", "CAPM", "Yes"],
          ],
        },
        {
          type: "h2",
          text: "When debt has a beta",
        },
        {
          type: "p",
          text: "Where a question supplies a debt beta, the cost of debt is found by CAPM in exactly the way the cost of equity is. Corporate debt is not risk-free — the borrower can default — and a beta puts a number on how much of that risk moves with the market.",
        },
        {
          type: "formula",
          text: "rd  =  rf  +  βd × (rm − rf)",
          where: [
            "βd = the debt beta",
            "rf = the risk-free rate",
            "rm − rf = the market risk premium",
          ],
        },
        {
          type: "p",
          text: "With a risk-free rate of 4.6%, a market risk premium of 6% and a debt beta of 0.75, the pre-tax cost of debt is 4.6% + 0.75 × 6% = 9.10%, and at 30% tax the company bears 6.37%.",
        },
        {
          type: "p",
          text: "Debt betas are small — well below any equity beta for the same company, because lenders are exposed to far less of the business’s fortunes than owners are. A debt beta of zero is the special case where the debt is treated as risk-free, and then the cost of debt is simply the risk-free rate.",
        },
      ],
      check: {
        question:
          "A company is funded by a bank loan, irredeemable bonds and preference shares. Which of its costs is calculated without any market price?",
        options: [
          "The bank loan — it is not traded, so its cost is the rate in the agreement, net of tax",
          "The preference shares, because their dividend is fixed by the nominal value",
          "The irredeemable bonds, because they have no redemption date",
          "None — every source of finance needs a market price",
        ],
        answer: 0,
        explain:
          "A yield only exists where something trades: it is the return an investor gets on what they paid. Nobody buys and sells a bank loan, so there is no price and no yield — just the contractual rate, adjusted for the tax it saves.",
      },
    },
  ],
};
