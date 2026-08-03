/* CF · Lesson 1 Investment appraisal · Step 7 — International project appraisal
 *
 * Source: 01_Investment_Appraisal/Lectures/NPV for International Projects
 * (2023), 5 slides, plus the lecture's Practice — International Project
 * Appraisal (BC Co in the US), which is worked here at its original figures
 * by both of the two approaches the lecture sets out.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "international-projects",
  label: "International project appraisal",
  title: "International project appraisal",
  kicker: "Investment appraisal",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "two-approaches",
      heading: "Two routes to the same answer",
      blocks: [
        {
          type: "p",
          text: "A project abroad earns in a currency the company does not report in, so somewhere in the appraisal the money has to cross. There are two places you can put that crossing, and both are correct.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Convert the cash flows" }, { label: "Convert the NPV" }],
          rows: [
            ["Step 1", "Forecast the foreign cash flows, inflation included", "Forecast the foreign cash flows, inflation included"],
            ["Step 2", "Forecast the exchange rate for each year", "Discount them at the foreign cost of capital"],
            ["Step 3", "Convert each year’s cash flow into kwacha", "Convert the foreign NPV into kwacha at the spot rate"],
            ["Step 4", "Discount the kwacha flows at the domestic cost of capital", "—"],
          ],
        },
        {
          type: "p",
          text: "The first converts early and discounts late; the second discounts early and converts once, at today’s rate. They agree because the same relationship between inflation and exchange rates is doing the work in both — in the first it moves the exchange rate year by year, in the second it sits inside the foreign discount rate.",
        },
        {
          type: "p",
          text: "Which one to use is usually decided for you. A question giving inflation rates in both countries wants the first; a question giving a foreign cost of equity and a spot rate wants the second. Where a question asks for both, expect a small difference from rounding, and say so rather than forcing the two to match.",
        },
      ],
      check: {
        question:
          "Under the second approach, at which exchange rate is the conversion made?",
        options: [
          "The spot rate today, applied once to the foreign-currency NPV",
          "The forecast rate for the final year of the project",
          "The average of the forecast rates over the project’s life",
          "A separate forecast rate for each year’s present value",
        ],
        answer: 0,
        explain:
          "The discounting has already brought every foreign cash flow back to today, so what is being converted is a figure in today’s foreign currency — and today’s figure converts at today’s rate. Converting at a future rate would apply the exchange-rate movement twice, since the foreign discount rate already carries it.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "forecasting-rates",
      heading: "Forecasting the exchange rate",
      blocks: [
        {
          type: "p",
          text: "The exchange rate in five years’ time is forecast from the difference between the two countries’ inflation rates, or from the difference between their interest rates. The two ideas have names — purchasing power parity for inflation, interest rate parity for interest — and identical arithmetic.",
        },
        {
          type: "formula",
          text: "Forward rate  =  spot rate  ×  (1 + quoted currency rate)ⁿ ÷ (1 + base currency rate)ⁿ",
          where: [
            "spot rate = today’s rate, expressed as units of the quoted currency per one unit of the base currency",
            "quoted currency rate = the inflation (or interest) rate of the quoted — that is, the variable — currency",
            "base currency rate = the inflation (or interest) rate of the base currency",
            "n = the number of years ahead",
          ],
        },
        {
          type: "p",
          text: "The one thing to be careful about is which currency is which. In a rate quoted as ZMW16.25 = US$1, the dollar is the base — the currency there is one of — and the kwacha is the quoted currency, the one whose quantity varies.",
        },
        {
          type: "p",
          text: "So with Zambian inflation at 15% and US inflation at 6.5%, the kwacha rate is the numerator: 16.25 × 1.15 ÷ 1.065 = ZMW17.547 in a year. The kwacha buys less, which is what higher inflation at home means. Put the rates the wrong way round and the forecast has the kwacha strengthening against the dollar while Zambian prices rise faster than American ones — an answer the working itself tells you is wrong.",
        },
        {
          type: "callout",
          text: "The currency with the higher inflation is the one that weakens. Check your forecast against that before using it.",
        },
      ],
      check: {
        question:
          "The spot rate is ZMW26.70 = US$1. Zambian inflation is 15% a year and US inflation is 4%. What is the forecast rate in one year?",
        options: [
          "ZMW29.52 = US$1",
          "ZMW24.15 = US$1",
          "ZMW23.90 = US$1",
          "ZMW30.71 = US$1",
        ],
        answer: 0,
        explain:
          "26.70 × 1.15 ÷ 1.04 = 29.52. The kwacha is the quoted currency and it has the higher inflation, so it takes more of them to buy a dollar. Any answer below 26.70 has the higher-inflation currency getting stronger.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "foreign-cost-of-capital",
      heading: "The foreign cost of capital",
      blocks: [
        {
          type: "p",
          text: "To discount dollar cash flows you need a dollar rate, and the same parity relationship converts the domestic one into it. A rate is a price for money over time, so it moves between currencies the same way an exchange rate does.",
        },
        {
          type: "formula",
          text: "(1 + foreign WACC) ÷ (1 + domestic WACC)  =  (1 + foreign rate) ÷ (1 + domestic rate)",
          where: [
            "foreign WACC = the discount rate to apply to the foreign-currency cash flows",
            "domestic WACC = the company’s own cost of capital, in kwacha",
            "foreign rate / domestic rate = the two countries’ interest rates, or their inflation rates",
          ],
        },
        {
          type: "p",
          text: "A Zambian company requiring 18% on kwacha cash flows, appraising a dollar project where US inflation is 6.5% against 15% at home, needs 1.18 × 1.065 ÷ 1.15 − 1 = 9.3% on the dollar flows.",
        },
        {
          type: "p",
          text: "Half of the 18% is not a required return at all — it is compensation for the kwacha losing value. Dollar cash flows do not need that compensation, so the dollar rate is far lower. Discounting dollars at 18% would reject good projects on the strength of an inflation rate that has nothing to do with them.",
        },
      ],
      check: {
        question:
          "Why is the dollar discount rate so much lower than the 18% the company requires on kwacha cash flows?",
        options: [
          "Because most of the 18% is compensation for kwacha inflation, which dollar cash flows do not suffer",
          "Because US projects are less risky than Zambian ones",
          "Because the dollar cash flows have already been converted at the spot rate",
          "Because a foreign cost of capital is always below the domestic one",
        ],
        answer: 0,
        explain:
          "A required return has to cover the erosion of the currency it is measured in. Zambian inflation at 15% against 6.5% in the US accounts for nearly the whole gap between 18% and 9.3%. It is not about the project being safer — the same business risk is present in both versions of the calculation.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "worked-example",
      heading: "Working it by converting the cash flows",
      blocks: [
        {
          type: "p",
          text: "BC, a Zambian company, is considering a five-year project in the US. It needs capital expenditure of $1,250,000 with no scrap value, plus working capital of $500,000 recovered at the end. Pre-tax net cash inflows are $800,000 a year. US tax is 40%, with straight-line depreciation allowable, paid at the end of the year following the profits. A double taxation agreement means no Zambian tax is due. The spot rate is ZMW16.25 = $1, inflation is 15% in Zambia and 6.5% in the US, and BC requires 18% post-tax on projects of this risk.",
        },
        {
          type: "p",
          text: "Build the dollar cash flows first. Depreciation is $1,250,000 ÷ 5 = $250,000 a year, so taxable profit is $800,000 − $250,000 = $550,000 and the tax is $220,000, paid a year later.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Operating $’000", align: "right" },
            { label: "Capital $’000", align: "right" },
            { label: "Working capital $’000", align: "right" },
            { label: "Tax $’000", align: "right" },
            { label: "Net $’000", align: "right" },
          ],
          rows: [
            ["0", "", "(1,250)", "(500)", "", "(1,750)"],
            ["1", "800", "", "", "", "800"],
            ["2", "800", "", "", "(220)", "580"],
            ["3", "800", "", "", "(220)", "580"],
            ["4", "800", "", "", "(220)", "580"],
            ["5", "800", "", "500", "(220)", "1,080"],
            ["6", "", "", "", "(220)", "(220)"],
          ],
          note: "Depreciation never appears as a cash flow — it only sets the tax. The working capital comes back in full and is not taxed, because it was never income.",
        },
        {
          type: "p",
          text: "Now forecast the rate for each year at 1.15 ÷ 1.065, convert, and discount the kwacha at 18%.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Dollar flow $’000", align: "right" },
            { label: "Rate ZMW/$", align: "right" },
            { label: "Kwacha flow ZMW’000", align: "right" },
            { label: "Factor at 18%", align: "right" },
            { label: "PV ZMW’000", align: "right" },
          ],
          rows: [
            ["0", "(1,750)", "16.250", "(28,438)", "1.000", "(28,438)"],
            ["1", "800", "17.547", "14,038", "0.847", "11,890"],
            ["2", "580", "18.947", "10,989", "0.718", "7,890"],
            ["3", "580", "20.460", "11,867", "0.609", "7,227"],
            ["4", "580", "22.093", "12,814", "0.516", "6,612"],
            ["5", "1,080", "23.856", "25,764", "0.437", "11,259"],
            ["6", "(220)", "25.760", "(5,667)", "0.370", "(2,097)"],
          ],
          total: ["NPV", "", "", "", "", "14,343"],
        },
        {
          type: "p",
          text: "An NPV of about ZMW14.3 million, so the project is worth doing. Watch what the exchange rate column is doing to the answer: by year 6 a dollar is worth ZMW25.76 rather than ZMW16.25, so every dollar the project earns late is worth more kwacha than the same dollar earned today. The weakening kwacha is working in BC’s favour here, because the project is a dollar earner.",
        },
      ],
      check: {
        question:
          "In the working above, the tax is $220,000 rather than 40% of the $800,000 inflow. Why?",
        options: [
          "Depreciation of $250,000 a year is deductible, so tax is charged on $550,000",
          "Only part of the inflow arises in the US, so only part of it is taxed there",
          "The 40% rate is applied after deducting the working capital",
          "The double taxation agreement reduces the effective rate below 40%",
        ],
        answer: 0,
        explain:
          "$800,000 − $250,000 = $550,000 of taxable profit, and 40% of that is $220,000. Depreciation is not a cash flow, so it never appears in the cash flow table itself — but it reduces the taxable profit, and the tax it saves very much is cash.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "second-approach",
      heading: "Working it by converting the NPV",
      blocks: [
        {
          type: "p",
          text: "The same project, the other way round. Discount the dollar cash flows at the dollar cost of capital of 9.3%, then convert the answer once at today’s spot rate of ZMW16.25.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Dollar flow $’000", align: "right" },
            { label: "Factor at 9.3%", align: "right" },
            { label: "PV $’000", align: "right" },
          ],
          rows: [
            ["0", "(1,750.0)", "1.000", "(1,750.0)"],
            ["1", "800.0", "0.915", "732.0"],
            ["2", "580.0", "0.837", "485.5"],
            ["3", "580.0", "0.766", "444.3"],
            ["4", "580.0", "0.701", "406.6"],
            ["5", "1,080.0", "0.641", "692.3"],
            ["6", "(220.0)", "0.587", "(129.1)"],
          ],
          total: ["NPV in dollars", "", "", "881.5"],
        },
        {
          type: "p",
          text: "$881,500 × 16.25 = ZMW14,324,000, against ZMW14,343,000 the long way round. The gap is about a tenth of a percent and it is entirely rounding — three-decimal discount factors and a discount rate stated as 9.3% rather than 9.2783%. Two approaches landing within ZMW20,000 of each other on a ZMW28 million project is confirmation that both were done right.",
        },
        {
          type: "p",
          text: "This route is much shorter, and it is the one to reach for when a question gives you a foreign cost of capital directly. It hides something, though. There is no exchange rate column, so nothing on the page shows what the currency is doing to the project — and on a long project in a fast-depreciating currency, that column is often the most interesting thing in the answer.",
        },
        {
          type: "h2",
          text: "Which way the currency helps",
        },
        {
          type: "ul",
          items: [
            "A weakening kwacha raises the kwacha value of foreign-currency inflows, so the NPV of a project earning abroad rises.",
            "A strengthening kwacha does the reverse: the same dollars convert into fewer kwacha and the NPV falls.",
          ],
        },
        {
          type: "p",
          text: "That cuts both ways, and it is not a forecast anyone should rely on. BC’s ZMW14.3 million rests on the kwacha losing roughly 8% a year against the dollar for six years. If it holds steady instead, the late years convert at nothing like ZMW25.76 and a large part of the NPV disappears — which is why a foreign project is normally appraised alongside the question of how much of that exposure the company intends to hedge away.",
        },
      ],
      check: {
        question:
          "BC’s two approaches give ZMW14,343,000 and ZMW14,324,000. What is the right thing to say about the ZMW19,000 difference?",
        options: [
          "It is rounding in the discount factors and the 9.3% rate; the two methods are equivalent",
          "The first approach is more accurate, because it uses a separate exchange rate for each year",
          "One of the two calculations contains an error, since the methods must agree exactly",
          "The difference is the value of the exchange rate risk the second method ignores",
        ],
        answer: 0,
        explain:
          "The methods are algebraically the same calculation, so any gap has to come from rounding — here, three-decimal factors and a rate quoted to one decimal place. Carried to full precision both give ZMW14,345,000. A difference of this size is worth a sentence in your answer, not a hunt for a mistake.",
      },
    },
  ],
};
