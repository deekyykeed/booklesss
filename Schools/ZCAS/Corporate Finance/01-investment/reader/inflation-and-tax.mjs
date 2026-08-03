/* CF · Lesson 1 Investment appraisal · Step 4 — Inflation and tax in appraisal
 *
 * Source: 01_Investment_Appraisal/Lectures/Investment Appraisal Part 2 —
 * Sessions Using Free Cash Flows (2024), slides 7–8, taken to the depth the
 * exam works at. The worked example is Project A from the BAC4301 sample
 * question paper (Section A, 18 marks) at its original figures — money-term
 * prices, tax at 30% one year in arrears, 20% reducing-balance allowances.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "inflation-and-tax",
  label: "Inflation and tax in appraisal",
  title: "Inflation and tax in appraisal",
  kicker: "Investment appraisal",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "money-and-real",
      heading: "Money cash flows and real cash flows",
      blocks: [
        {
          type: "p",
          text: "A money cash flow is the number of kwacha that will actually change hands on the day — inflation included. A real cash flow is the same amount expressed in today’s purchasing power, with inflation stripped out. Both are legitimate ways to describe the same project, and each has a discount rate that belongs to it.",
        },
        {
          type: "ul",
          items: [
            "The money method: inflate the cash flows to what they will really be, then discount at the money (nominal) cost of capital.",
            "The real method: leave the cash flows in today’s prices, then discount at the real cost of capital.",
          ],
        },
        {
          type: "p",
          text: "Both give the same NPV. What you must never do is mix them — discounting today’s prices at a money rate deducts inflation twice and will tell you to reject a project that is worth doing.",
        },
        {
          type: "formula",
          text: "(1 + m)  =  (1 + r) × (1 + i)",
          where: [
            "m = the money (nominal) cost of capital",
            "r = the real cost of capital",
            "i = the general rate of inflation",
          ],
        },
        {
          type: "p",
          text: "With a real cost of capital of 10% and general inflation of 5%, the money rate is 1.10 × 1.05 − 1 = 15.5%. Turn it around and the same relationship converts a money rate the treasury actually quotes into the real rate: 1.155 ÷ 1.05 − 1 = 10%.",
        },
        {
          type: "callout",
          text: "Money cash flows go with the money rate; real cash flows go with the real rate. Matching them is the whole discipline here.",
        },
      ],
      check: {
        question:
          "A project’s cash flows are forecast in today’s prices. The company’s money cost of capital is 14% and inflation is running at 8%. What should you do?",
        options: [
          "Discount at the real rate of 5.6%, or inflate the cash flows first and discount at 14%",
          "Discount at 14%, because that is the company’s actual cost of capital",
          "Discount at 6%, the money rate less inflation",
          "Discount at 22%, the money rate plus inflation",
        ],
        answer: 0,
        explain:
          "1.14 ÷ 1.08 − 1 = 5.6%. Either strip inflation out of the rate to match cash flows that already have it stripped out, or put inflation into the cash flows to match the rate. Simply subtracting 8% from 14% is an approximation that drifts as rates rise, and discounting today’s prices at 14% charges the project for inflation it was never given.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "specific-inflation",
      heading: "When prices inflate at different rates",
      blocks: [
        {
          type: "p",
          text: "The real method only works when every cash flow in the project is inflating at the general rate. The moment one of them moves at its own rate — and in Zambia they almost always do — the real method breaks down and you must use money cash flows.",
        },
        {
          type: "p",
          text: "Think about a maize-milling project. The general rate might be 12%, but the maize price follows the harvest, the ZESCO tariff follows the regulator, and wages follow whatever the union settled. Three cash flows, three inflation rates. There is no single real rate that can describe all of them at once.",
        },
        {
          type: "p",
          text: "So you inflate each line at its own rate and build the money cash flow year by year.",
        },
        {
          type: "formula",
          text: "Money cash flow in year n  =  today’s price  ×  (1 + iₓ)ⁿ",
          where: [
            "iₓ = the specific inflation rate for that particular cash flow",
            "n = the year in which the cash flow arises",
          ],
        },
        {
          type: "table",
          columns: [
            { label: "Today’s price" },
            { label: "Inflation", align: "right" },
            { label: "Year 1", align: "right" },
            { label: "Year 2", align: "right" },
            { label: "Year 3", align: "right" },
          ],
          rows: [
            ["Selling price per bag ZMW", "9%", "218.00", "237.62", "258.99"],
            ["Maize cost per bag ZMW", "14%", "142.50", "162.45", "185.19"],
            ["Fixed overhead ZMW’000", "12%", "504.00", "564.48", "632.22"],
          ],
          note: "Selling price today ZMW200, maize ZMW125, overhead ZMW450,000. Each line compounds at its own rate, so the margin per bag narrows from ZMW75.50 in year 1 to ZMW73.80 by year 3 even though the selling price is rising.",
        },
        {
          type: "p",
          text: "Notice what the table shows that a real-terms working would have hidden completely: costs are outrunning prices, and the project is quietly getting worse each year. That is the reason the money method is the one the exam rewards.",
        },
      ],
      check: {
        question:
          "In which situation can you safely use the real method?",
        options: [
          "When every cash flow in the project is inflating at the general rate of inflation",
          "Whenever inflation is expected to stay below 10%",
          "Whenever the project’s cash flows are known with certainty",
          "When the company’s cost of capital has been quoted in money terms",
        ],
        answer: 0,
        explain:
          "The real method compresses all inflation into one adjustment to the discount rate, which only works if there is genuinely one rate to compress. Different rates on different lines change the shape of the cash flows, not just their size, and no single discount rate can reproduce that.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "tax-on-operating-flows",
      heading: "Tax on the operating cash flows",
      blocks: [
        {
          type: "p",
          text: "Tax bites an investment project twice, and the two bites work in opposite directions. The first is a cost: the project generates taxable operating cash flows, and the company pays tax on them. The second is a relief, and it is the subject of the next section.",
        },
        {
          type: "p",
          text: "The cost side is straightforward arithmetic — the operating cash flow multiplied by the tax rate — but the timing is where marks are lost.",
        },
        {
          type: "ul",
          items: [
            "Tax payable in the same year as the profits: the outflow sits on the same line as the cash flow that caused it.",
            "Tax payable one year in arrears: the outflow moves down a year, so a four-year project has cash flows in years 1 to 4 and tax payments in years 2 to 5.",
          ],
        },
        {
          type: "p",
          text: "A question that says tax is paid one year in arrears is handing you a year of free credit, and the working has to show it. A project whose last operating cash flow is in year 4 still has a year 5 column, holding nothing but the tax on year 4 and any allowance still to be claimed.",
        },
        {
          type: "p",
          text: "Only cash matters. Depreciation charged in the accounts is not deducted before applying the tax rate, because it is not a payment — the tax authority gives its own relief for capital spending instead, on its own terms.",
        },
        {
          type: "callout",
          text: "Read the timing sentence twice. Same year or one year in arrears changes every discount factor in the tax line.",
        },
      ],
      check: {
        question:
          "A four-year project generates operating cash flows in years 1 to 4. Tax at 30% is payable one year in arrears. Which years carry a tax cash flow?",
        options: [
          "Years 2, 3, 4 and 5",
          "Years 1, 2, 3 and 4",
          "Years 0, 1, 2 and 3",
          "Years 2, 3 and 4 only, since the project has ended by year 5",
        ],
        answer: 0,
        explain:
          "Each year’s tax is paid twelve months after the profit that caused it, so the last payment — the tax on the year 4 cash flow — falls in year 5. The project ending does not cancel the liability; it just means year 5 has a tax outflow and nothing else.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "capital-allowances",
      heading: "Capital allowances and the tax saved",
      blocks: [
        {
          type: "p",
          text: "Capital allowances — also called tax-allowable depreciation or writing-down allowances — are the deduction the tax authority gives for money spent on assets. They are not a cash flow themselves. What is a cash flow is the tax they save.",
        },
        {
          type: "formula",
          text: "Tax saved  =  capital allowance  ×  tax rate",
          where: [
            "capital allowance = the amount written off against taxable profit that year",
            "tax rate = the corporate tax rate the company pays",
          ],
        },
        {
          type: "p",
          text: "The saving is an inflow, and it arrives on the same timing as the tax it reduces. Where tax is one year in arrears, so is the saving.",
        },
        {
          type: "h2",
          text: "Two ways the allowance is spread",
        },
        {
          type: "ul",
          items: [
            "Straight line — the cost less any scrap value, divided equally across the asset’s life. An asset costing ZMW120 million over four years gives ZMW30 million a year.",
            "Reducing balance — a fixed percentage of whatever is left unrelieved. At 20%, a ZMW530,000 asset gives ZMW106,000 in year 1, then 20% of the remaining ZMW424,000 in year 2, and so on. The allowance shrinks every year.",
          ],
        },
        {
          type: "h2",
          text: "The balancing figure at the end",
        },
        {
          type: "p",
          text: "Reducing balance never reaches zero, so in the year the asset is sold the company claims whatever relief it has not yet had. Take the written-down value carried into that year, subtract what the asset actually fetched, and the difference is a balancing allowance.",
        },
        {
          type: "formula",
          text: "Balancing allowance  =  written-down value  −  disposal proceeds",
          where: [
            "written-down value = the cost less every allowance claimed up to that point",
            "disposal proceeds = the scrap or sale value received in the final year",
          ],
        },
        {
          type: "p",
          text: "Where the asset sells for more than its written-down value the sign flips: the company has over-claimed, and the excess is a balancing charge — extra taxable profit rather than extra relief.",
        },
      ],
      check: {
        question:
          "An asset costing ZMW530,000 has had allowances at 20% reducing balance for three years, leaving a written-down value of ZMW271,360. It is sold in year 4 for ZMW40,000. What is claimed in year 4?",
        options: [
          "A balancing allowance of ZMW231,360",
          "A writing-down allowance of ZMW54,272, being 20% of the written-down value",
          "A balancing charge of ZMW231,360",
          "Nothing — relief stops once the asset is sold",
        ],
        answer: 0,
        explain:
          "271,360 − 40,000 = 231,360 of cost that never attracted relief, and the balancing allowance hands it over in one go. It is a charge only when the asset sells for more than its written-down value, which would mean too much relief had already been given.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "worked-example",
      heading: "Working it end to end",
      blocks: [
        {
          type: "p",
          text: "ETM Co is buying equipment for ZMW530,000 to make a new product. It will last four years and then be sold for ZMW40,000. Tax is 30%, payable one year in arrears, and capital allowances are available at 20% on the reducing balance. The after-tax money cost of capital is 10%. Sales prices and costs below are already in money terms.",
        },
        {
          type: "table",
          columns: [
            { label: "" },
            { label: "Year 1", align: "right" },
            { label: "Year 2", align: "right" },
            { label: "Year 3", align: "right" },
            { label: "Year 4", align: "right" },
          ],
          rows: [
            ["Sales units", "30,000", "25,000", "20,000", "10,000"],
            ["Selling price ZMW/unit", "14", "15", "16", "18"],
            ["Variable cost ZMW/unit", "(4)", "(6)", "(6)", "(10)"],
            ["Contribution ZMW/unit", "10", "9", "10", "8"],
          ],
          total: ["Contribution ZMW", "300,000", "225,000", "200,000", "80,000"],
        },
        {
          type: "p",
          text: "Take the allowances next, because their timing has to be settled before anything can be discounted. Three years of 20% on the reducing balance, then a balancing allowance in year 4 when the equipment is sold.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Written-down value b/f ZMW", align: "right" },
            { label: "Allowance ZMW", align: "right" },
            { label: "Tax saved at 30% ZMW", align: "right" },
            { label: "Received in" },
          ],
          rows: [
            ["1", "530,000", "106,000", "31,800", "Year 2"],
            ["2", "424,000", "84,800", "25,440", "Year 3"],
            ["3", "339,200", "67,840", "20,352", "Year 4"],
            ["4", "271,360", "231,360", "69,408", "Year 5"],
          ],
          note: "The year 4 figure is the balancing allowance: ZMW271,360 written-down value less ZMW40,000 of sale proceeds.",
        },
        {
          type: "p",
          text: "Now assemble the cash flows. Contribution lands in years 1 to 4; the tax on it and the relief from the allowances both land a year later; the scrap comes in with year 4.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Contribution ZMW", align: "right" },
            { label: "Scrap ZMW", align: "right" },
            { label: "Tax at 30% ZMW", align: "right" },
            { label: "Allowance relief ZMW", align: "right" },
            { label: "Net cash flow ZMW", align: "right" },
          ],
          rows: [
            ["0", "", "", "", "", "(530,000)"],
            ["1", "300,000", "", "", "", "300,000"],
            ["2", "225,000", "", "(90,000)", "31,800", "166,800"],
            ["3", "200,000", "", "(67,500)", "25,440", "157,940"],
            ["4", "80,000", "40,000", "(60,000)", "20,352", "80,352"],
            ["5", "", "", "(24,000)", "69,408", "45,408"],
          ],
          note: "The equipment cost sits at year 0. Year 5 exists only because tax is a year behind.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Net cash flow ZMW", align: "right" },
            { label: "Factor at 10%", align: "right" },
            { label: "Present value ZMW", align: "right" },
          ],
          rows: [
            ["0", "(530,000)", "1.000", "(530,000)"],
            ["1", "300,000", "0.909", "272,700"],
            ["2", "166,800", "0.826", "137,777"],
            ["3", "157,940", "0.751", "118,613"],
            ["4", "80,352", "0.683", "54,880"],
            ["5", "45,408", "0.621", "28,198"],
          ],
          total: ["NPV", "", "", "82,168"],
        },
        {
          type: "p",
          text: "The NPV is ZMW82,168, so the equipment should be bought. Worth seeing how much of that answer the tax lines are carrying: the allowances hand back ZMW147,000 of relief across the project, and pushing every tax payment a year later is worth several thousand more on its own. Get the timing wrong and a viable project can read as a rejection.",
        },
      ],
      check: {
        question:
          "Suppose tax in the working above were payable in the same year as the profits rather than one year in arrears. What happens to the NPV?",
        options: [
          "It falls, because both the tax payments and the allowance reliefs move a year earlier and the payments are the larger of the two",
          "It rises, because the allowance reliefs are received a year sooner",
          "It is unchanged, because the same total amount of tax is paid either way",
          "It falls, because the total tax paid over the project increases",
        ],
        answer: 0,
        explain:
          "The same amounts move, so the total is unchanged — but discounting cares when. Both lines shift forward a year; the tax payments (ZMW241,500 in total) outweigh the reliefs (ZMW147,000), so bringing them all forward costs more than it gains and the NPV falls.",
      },
    },
  ],
};
