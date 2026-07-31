/* CF · Lesson 2 Cost of capital · Step 5 — Operating and financial gearing
 *
 * Source: 02_Cost_of_Capital_and_Capital_Structure/Capital Structure and
 * Gearing (2025), slides 2–11. Activity 1 is the lecture's own at its original
 * figures. The book-versus-market comparison uses the figures from the March
 * 2023 practice question solution, which the sample paper repeats.
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "gearing",
  label: "Gearing",
  title: "Operating and financial gearing",
  kicker: "Cost of capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "operating-gearing",
      heading: "Fixed costs amplify a change in sales",
      blocks: [
        {
          type: "p",
          text: "Operating gearing measures how much a company’s operating profit moves when its revenue moves. The thing doing the moving is fixed costs: they stay where they are while revenue changes, so every kwacha of contribution gained or lost lands straight on the profit line.",
        },
        {
          type: "formula",
          text: "Operating gearing  =  fixed costs ÷ total costs        or        % change in EBIT ÷ % change in revenue",
          where: [
            "fixed costs = the costs that do not vary with the level of activity",
            "EBIT = earnings before interest and tax, the operating profit",
          ],
        },
        {
          type: "p",
          text: "The two forms answer slightly different questions. The first describes the cost structure — how much of the cost base is committed. The second measures the effect that structure has, as a multiple.",
        },
        {
          type: "p",
          text: "Take a business with revenue of ZMW150,000 and cost of sales of ZMW100,000, of which 75% is variable. Operating profit is ZMW50,000, and interest of ZMW30,000 leaves ZMW20,000 before tax. Now put revenue up by 10%.",
        },
        {
          type: "table",
          columns: [
            { label: "" },
            { label: "Base ZMW", align: "right" },
            { label: "Sales +10% ZMW", align: "right" },
            { label: "Change", align: "right" },
          ],
          rows: [
            ["Revenue", "150,000", "165,000", "+10%"],
            ["Variable cost of sales", "(75,000)", "(82,500)", "+10%"],
            ["Contribution", "75,000", "82,500", "+10%"],
            ["Fixed costs", "(25,000)", "(25,000)", "nil"],
            ["Operating profit (EBIT)", "50,000", "57,500", "+15%"],
          ],
          subtotals: [2],
          note: "Revenue and every variable line move by 10%. The fixed costs do not move at all, and that is the whole of the effect.",
        },
        {
          type: "p",
          text: "Revenue rose 10% and operating profit rose 15%. The operating gearing is 25,000 ÷ 100,000 = 25%, or 15% ÷ 10% = 1.5 times. Cut revenue by 10% instead and operating profit falls by 15% — the amplification works in both directions, which is why high operating gearing is described as business risk rather than as an advantage.",
        },
        {
          type: "p",
          text: "How much of it a company has is mostly decided by its industry. A copper mine, a cement plant or a hotel carries enormous fixed costs and cannot avoid high operating gearing; a trading business that buys stock as it sells it is nearly all variable and barely notices a downturn in the same way.",
        },
      ],
      check: {
        question:
          "Two companies have the same revenue and the same operating profit. One has fixed costs of 60% of its cost base, the other 15%. Revenue at both falls by 20%. What happens?",
        options: [
          "The operating profit of the first falls by much more, because its costs do not fall with revenue",
          "Both operating profits fall by 20%, since they started from the same figures",
          "The first is protected, because its costs are fixed and cannot rise",
          "The second falls by more, because its variable costs are a larger part of its total",
        ],
        answer: 0,
        explain:
          "Falling revenue takes contribution with it, and only the variable costs fall to cushion the blow. The company carrying 60% fixed costs keeps paying them out of a much smaller contribution, so its profit collapses far faster. Fixed costs are only an advantage while volumes are rising.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "financial-gearing",
      heading: "Measuring financial gearing",
      blocks: [
        {
          type: "p",
          text: "Financial gearing measures how much of the capital structure is debt. A company funded entirely by shareholders is ungeared; one carrying substantial borrowings is geared, and it has taken on financial risk on top of whatever business risk it already had.",
        },
        {
          type: "p",
          text: "There are four ratios in common use and they measure the same thing against different denominators, so their thresholds differ. Read which one a question wants before answering it.",
        },
        {
          type: "table",
          columns: [{ label: "Ratio" }, { label: "Calculation" }, { label: "Highly geared when" }],
          rows: [
            ["Debt to equity", "(Long-term debt + preference capital) ÷ shareholders’ funds", "Above 100%"],
            ["Debt to capital employed", "(Long-term debt + preference capital) ÷ capital employed", "Above 50%"],
            ["Debt ratio", "Total debt ÷ total assets", "Lower is better"],
            ["Equity ratio", "Total equity ÷ total assets", "Higher is better"],
          ],
          note: "Capital employed is debt plus equity, so debt to equity of 100% and debt to capital employed of 50% describe exactly the same company.",
        },
        {
          type: "p",
          text: "Preference share capital sits with the debt in these ratios, not with the equity, despite the name. What the ratio is measuring is prior charge capital — finance that has to be served before the ordinary shareholders see anything — and a fixed preference dividend behaves like interest from that point of view.",
        },
        {
          type: "p",
          text: "A ratio on its own says very little. Compare it against the industry: 40% might be conservative for a utility with predictable revenue and reckless for an exploration company. And compare it against the same company’s own history, because the direction of travel is usually more informative than the level.",
        },
      ],
      check: {
        question:
          "A company has shareholders’ funds of ZMW80 million, long-term bank debt of ZMW30 million and preference share capital of ZMW10 million. What is its debt-to-equity ratio?",
        options: ["50%", "37.5%", "33.3%", "12.5%"],
        answer: 0,
        explain:
          "Preference capital is prior charge capital, so it goes on the debt side: (30 + 10) ÷ 80 = 50%. Leaving it out gives 37.5%, and treating it as equity gives 33.3% — both understate the fixed claims ranking ahead of the ordinary shareholders.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "interest-cover",
      heading: "Interest cover",
      blocks: [
        {
          type: "p",
          text: "Interest cover asks a more direct question than any gearing ratio: how many times over can this year’s operating profit pay this year’s interest? It looks at the flow rather than the balance, which is what a lender worries about.",
        },
        {
          type: "formula",
          text: "Interest cover  =  PBIT ÷ interest",
          where: [
            "PBIT = profit before interest and tax",
            "interest = the interest charge for the year",
          ],
        },
        {
          type: "p",
          text: "Three times is generally treated as adequate and seven times as comfortable. Below two, a single bad year takes the company past the point where it can service its debt out of trading.",
        },
        {
          type: "p",
          text: "Return to the business from the first section, which has ZMW50,000 of operating profit against ZMW30,000 of interest — cover of 1.67 times, already thin. Watch what a 10% move in revenue does to it.",
        },
        {
          type: "table",
          columns: [
            { label: "" },
            { label: "Sales −10%", align: "right" },
            { label: "Base", align: "right" },
            { label: "Sales +10%", align: "right" },
          ],
          rows: [
            ["Operating profit ZMW", "42,500", "50,000", "57,500"],
            ["Interest ZMW", "(30,000)", "(30,000)", "(30,000)"],
            ["Profit before tax ZMW", "12,500", "20,000", "27,500"],
            ["Change in profit before tax", "−37.5%", "—", "+37.5%"],
            ["Interest cover", "1.42×", "1.67×", "1.92×"],
          ],
        },
        {
          type: "p",
          text: "A 10% change in revenue has become a 37.5% change in the profit shareholders own. The two gearings have multiplied together: fixed costs turned 10% into 15%, and then fixed interest turned 15% into 37.5%.",
        },
        {
          type: "callout",
          text: "Operating gearing and financial gearing compound. A company with high fixed costs should think carefully before also carrying high fixed interest.",
        },
      ],
      check: {
        question:
          "In the working above, revenue falls 10%, operating profit falls 15% and profit before tax falls 37.5%. Where does the step from 15% to 37.5% come from?",
        options: [
          "Interest is fixed, so the whole of the ZMW7,500 fall in operating profit lands on the shareholders’ profit",
          "The interest charge rises when profits fall, which magnifies the decline",
          "Tax relief on the interest is lost when profit falls",
          "The variable costs did not fall in proportion to revenue",
        ],
        answer: 0,
        explain:
          "Interest stays at ZMW30,000 whatever happens to trading, so the entire ZMW7,500 reduction in operating profit comes out of the ZMW20,000 that was left for shareholders — and ZMW7,500 out of ZMW20,000 is 37.5%. Fixed interest does to profit before tax exactly what fixed costs did to operating profit.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "book-and-market",
      heading: "Book values and market values give different answers",
      blocks: [
        {
          type: "p",
          text: "Gearing can be measured on book values or on market values, and the two can describe the same company in completely different terms.",
        },
        {
          type: "p",
          text: "Take a company with ZMW50 million of ordinary share capital in ZMW0.40 shares now trading at ZMW2.00, ZMW40 million of ZMW100 preference shares quoted at ZMW72, and a ZMW20 million bank loan.",
        },
        {
          type: "table",
          columns: [
            { label: "" },
            { label: "Book value ZMW’m", align: "right" },
            { label: "Market value ZMW’m", align: "right" },
          ],
          rows: [
            ["Ordinary shares", "50.00", "250.00"],
            ["Preference shares", "40.00", "28.80"],
            ["Bank loan", "20.00", "20.00"],
            ["Capital employed", "110.00", "298.80"],
            ["Prior charge capital", "60.00", "48.80"],
          ],
          subtotals: [3],
          total: ["Gearing — prior charge ÷ capital employed", "55%", "16%"],
          note: "125 million ordinary shares at ZMW2.00, and preference shares at (ZMW40m ÷ 100) × ZMW72.",
        },
        {
          type: "p",
          text: "On book values the company is highly geared at 55%, past the 50% threshold and above an industry average of 40%. On market values it is conservatively financed at 16%. Nothing about the company has changed between the two columns.",
        },
        {
          type: "p",
          text: "The difference is almost entirely the ordinary shares. Their book value records what was subscribed when they were issued; their market value records what the business has become worth since. Successful companies therefore look progressively more geared on book values every year they succeed, which is the wrong signal entirely.",
        },
        {
          type: "p",
          text: "Market values are the better measure and the one WACC uses. Book values keep their place because loan covenants are usually written on them, and because an unquoted company has no market value to use — but where a question offers both, say which you have used and why.",
        },
      ],
      check: {
        question:
          "A profitable listed company’s book gearing has risen every year for five years while its market gearing has fallen. What is the most likely explanation?",
        options: [
          "Retained profits and a rising share price have grown the market value of the equity far faster than its book value",
          "The company has been repaying debt, which lifts book gearing but lowers market gearing",
          "One of the two measures must have been calculated incorrectly",
          "The market value of the debt has been falling while its book value has not",
        ],
        answer: 0,
        explain:
          "Book equity only grows by the profits retained; market equity grows by everything investors now expect the business to earn. Five good years widen that gap, so the same debt looks like a larger share of a book-value capital structure and a smaller share of a market-value one.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "managing-gearing",
      heading: "Managing the level of gearing",
      blocks: [
        {
          type: "p",
          text: "Gearing is a ratio, so it can be moved from either side — reduce the debt or grow the equity — and the choices are not equally quick.",
        },
        {
          type: "ul",
          items: [
            "Repay debt from cash generated, or from selling an asset the business does not need.",
            "Renegotiate the terms — extending the maturity does not reduce the borrowing, but it can rescue the interest cover.",
            "Stop taking on further debt, and fund the next round of investment from retained earnings instead.",
            "Grow profits, which lifts both the share price and the market value of the equity, and lowers market gearing without repaying anything.",
            "Cut costs, which frees cash to repay borrowings and improves the cover at the same time.",
          ],
        },
        {
          type: "p",
          text: "What excessive borrowing actually costs a company is worth being able to state plainly, because it comes up as a short written requirement.",
        },
        {
          type: "table",
          columns: [{ label: "Consequence" }, { label: "How it shows up" }],
          rows: [
            ["Loss of financial flexibility", "No borrowing capacity left when an opportunity or a shock arrives"],
            ["Higher cost of new finance", "Lenders reprice the risk, and a downgrade widens the spread on everything"],
            ["Restrictive covenants", "Limits on further borrowing, on dividends, on disposals — control passes to the bank"],
            ["Volatile earnings for shareholders", "Fixed interest amplifies every movement in operating profit"],
            ["Risk of insolvency", "One bad year is enough where interest cover is already thin"],
          ],
        },
        {
          type: "p",
          text: "None of that argues for having no debt at all. Debt is the cheapest finance a company has, and an ungeared company is leaving that cheapness on the table. The question is where the balance lies — and whether there is a level of gearing that is genuinely optimal is the argument the next step takes up.",
        },
      ],
      check: {
        question:
          "A company wants to reduce its market gearing but has no spare cash to repay debt. What else could do it?",
        options: [
          "Grow profits, which lifts the share price and so the market value of the equity",
          "Revalue its non-current assets upwards in the accounts",
          "Convert its bank loan into preference shares",
          "Extend the maturity of its existing loans",
        ],
        answer: 0,
        explain:
          "Market gearing compares debt with the market value of the equity, and that value rises when the business becomes worth more. Revaluing assets moves book figures only; preference capital is prior charge capital, so converting into it changes nothing; and extending maturities helps the cover ratio without altering how much is owed.",
      },
    },
  ],
};
