/* CF · Lesson 1 Investment appraisal · Step 1 — Free cash flows
 *
 * Source: 01_Investment_Appraisal/Lectures/Investment Appraisal Part 1 —
 * Free Cash Flows (2024), 10 slides. Written for the reader, not lifted from
 * the PDF step. House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "free-cash-flows",
  label: "Free cash flows",
  title: "Free cash flows",
  kicker: "Investment appraisal",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-it-is",
      heading: "What free cash flow is",
      blocks: [
        {
          type: "p",
          text: "Free cash flow is the cash a business has left after it has paid its operating costs and its tax, and made the investment it needs to keep trading and to grow. Nobody inside the business has a further claim on it, which is what makes it free — it can go to the people who funded the business.",
        },
        {
          type: "p",
          text: "That is why it tells you more than profit does. Profit is struck after non-cash charges like depreciation and before the capital spending that keeps the machinery running, so it can move in one direction while the bank balance moves in the other. Cash cannot. A company can report a rising operating profit for three years and still run out of money.",
        },
        {
          type: "p",
          text: "The gap is easy to see in a Zambian milling business. It sells maize meal to wholesalers on 60-day credit, books the revenue and the profit the day the truck leaves, and then has to find cash for the ZESCO bill, the fuel and the next consignment of grain before a single customer has paid. The profit is real. The cash is somewhere else.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Free cash flow is what a business could hand to its investors without damaging its ability to keep trading.",
        },
      ],
      check: {
        question:
          "A company’s operating profit rose from ZMW4 million to ZMW6 million, but its free cash flow fell over the same year. What best explains that?",
        options: [
          "It spent heavily on new plant and on stock, so the cash went into those rather than to investors",
          "Its depreciation charge increased, which reduced the cash available",
          "It paid a larger dividend, which is deducted in arriving at free cash flow",
          "Free cash flow cannot fall in a year when operating profit rises",
        ],
        answer: 0,
        explain:
          "Investment in non-current assets and working capital is deducted after operating profit, so a year of heavy capital spending can swallow a rising profit. Depreciation is added back rather than deducted, and dividends are paid out of free cash flow — they sit after it, not inside it.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "to-the-firm",
      heading: "Building free cash flow to the firm",
      blocks: [
        {
          type: "p",
          text: "You build free cash flow out of the accounts. Start at operating profit before interest and tax, then correct it for everything the accounts recorded on a basis other than cash.",
        },
        {
          type: "table",
          columns: [{ label: "Free cash flow to the firm" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Operating profit before interest and tax (PBIT)", "X"],
            ["Add back depreciation", "X"],
            ["Less tax paid", "(X)"],
            ["Operating cash flow", "X"],
            ["Less replacement investment in non-current assets", "(X)"],
            ["Less incremental investment in non-current assets", "(X)"],
            ["Less incremental investment in working capital", "(X)"],
          ],
          subtotals: [3],
          total: ["Free cash flow to the firm", "X"],
        },
        {
          type: "ul",
          items: [
            "Depreciation is added back because no money moved. It is the accounts spreading the cost of an asset over its life, not a payment made this year.",
            "Tax is deducted at the amount actually paid, because that money genuinely leaves.",
            "Replacement investment keeps the existing assets working. A business that stops replacing them is quietly shrinking, so this spending is not optional.",
            "Incremental investment in non-current assets buys the extra capacity that growth needs.",
            "Incremental working capital is the stock and the receivables that growth ties up before any customer pays.",
          ],
        },
        {
          type: "p",
          text: "Interest is nowhere in that working, and its absence is the point. This is cash to the firm as a whole — to lenders and shareholders together. Deducting interest here would pay one group of investors before you had finished measuring what there is to share.",
        },
      ],
      check: {
        question:
          "Interest paid is not deducted when you calculate free cash flow to the firm. Why not?",
        options: [
          "Free cash flow to the firm is the cash available to lenders and shareholders together, so paying the lenders first would understate it",
          "Interest is a non-cash charge, so it is added back alongside depreciation",
          "Interest has already been taken off in arriving at profit before interest and tax",
          "Interest is relieved against tax, so deducting it as well would be double-counting",
        ],
        answer: 0,
        explain:
          "Free cash flow to the firm measures what the whole business generates for everyone who funded it. Interest is a payment to one of those groups, so it comes off only when you go a step further and work out free cash flow to equity.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "to-equity",
      heading: "From the firm to equity",
      blocks: [
        {
          type: "p",
          text: "Free cash flow to equity is what is left for shareholders once the lenders have been paid everything they are owed this year. You get to it by carrying on from where the last working stopped.",
        },
        {
          type: "table",
          columns: [{ label: "Free cash flow to equity" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Free cash flow to the firm", "X"],
            ["Less debt interest paid", "(X)"],
            ["Less debt repaid", "(X)"],
            ["Add cash raised from new debt issues", "X"],
          ],
          total: ["Free cash flow to equity", "X"],
        },
        {
          type: "p",
          text: "New borrowing is added rather than ignored. It is cash arriving in the business that the shareholders can use this year, even though it will have to be serviced and repaid later. A company that repays ZMW30 million of old loans and draws down ZMW30 million of new ones has moved no cash at all, and the working should say so.",
        },
        {
          type: "p",
          text: "Because it is the shareholders’ cash, free cash flow to equity is the honest way to test whether a dividend is affordable.",
        },
        {
          type: "formula",
          text: "Cash dividend cover  =  FCFE ÷ D",
          where: [
            "FCFE = free cash flow to equity for the year",
            "D = dividends actually paid to shareholders in the year",
          ],
        },
        {
          type: "p",
          text: "A cover of 2 means the company generated twice the cash it handed out. Below 1 means it paid dividends it had not earned in cash, and funded the difference from reserves or from borrowing. The same company measured on earnings can look comfortable, because earnings never had the capital spending taken out of them.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Cash to the firm answers what the business generates. Cash to equity answers what the shareholders can actually be paid.",
        },
      ],
      check: {
        question:
          "Airtel Zambia generates free cash flow to the firm of ZMW90 million. It pays ZMW12 million of debt interest, repays ZMW30 million of loans, and raises ZMW20 million of new debt. What is its free cash flow to equity?",
        options: [
          "ZMW68 million",
          "ZMW48 million",
          "ZMW98 million",
          "ZMW28 million",
        ],
        answer: 0,
        explain:
          "90 − 12 − 30 + 20 = 68. The new borrowing is added, not deducted: it is cash coming in. Stopping at 48 means forgetting it, and 28 means subtracting it by mistake.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "which-measure",
      heading: "Choosing between the two measures",
      blocks: [
        {
          type: "p",
          text: "Free cash flow does three jobs, and which of the two measures you reach for follows from the job in front of you.",
        },
        {
          type: "ul",
          items: [
            "Appraising a project — the free cash flows the project itself generates are what get discounted to find its net present value.",
            "Reading a company’s health — a business whose free cash flow has turned negative while its profit holds up is the classic early warning, which is why the measure is central to work on corporate failure and reconstruction.",
            "Valuing a business — the value of a company is the present value of the free cash flows it will produce, so this is where a share price comes from.",
          ],
        },
        {
          type: "table",
          columns: [
            { label: "The question" },
            { label: "The measure" },
            { label: "Discounted at" },
          ],
          rows: [
            ["Is this project worth doing?", "To the firm", "Cost of capital (WACC)"],
            ["What is the whole business worth?", "To the firm", "Cost of capital (WACC)"],
            ["What are the shares worth?", "To equity", "Cost of equity"],
            ["Can we sustain this dividend?", "To equity", "Not discounted"],
          ],
        },
        {
          type: "p",
          text: "The pairing is not a convention to memorise — it is a matching rule. Cash that belongs to everybody is discounted at a rate that reflects what everybody demands. Cash that belongs to shareholders alone is discounted at what shareholders alone demand. Mixing them values a company at a number nobody could ever collect. Where those two rates come from is the whole of Lesson 2.",
        },
      ],
      check: {
        question:
          "A valuer is working out what Zambeef’s shares are worth. Which combination is right?",
        options: [
          "Free cash flow to equity, discounted at the cost of equity",
          "Free cash flow to the firm, discounted at the cost of equity",
          "Free cash flow to equity, discounted at the weighted average cost of capital",
          "Free cash flow to the firm, discounted at the weighted average cost of capital",
        ],
        answer: 0,
        explain:
          "Shares are a claim on what is left after the lenders are paid, so the cash flow must be the one measured after debt service, and the rate must be the return shareholders require. Option 4 is a perfectly good working — it just values the whole firm, not the equity.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "worked-example",
      heading: "Worked example",
      blocks: [
        {
          type: "p",
          text: "A company reports the following for the year. Calculate its free cash flow to the firm and to equity.",
        },
        {
          type: "table",
          columns: [{ label: "Extracted from the accounts" }, { label: "ZMW’000", align: "right" }],
          rows: [
            ["Operating profit", "300"],
            ["Depreciation", "120"],
            ["Tax paid", "140"],
            ["Increase in working capital", "50"],
            ["Capital expenditure replacing existing assets", "10"],
            ["Capital expenditure on new investments", "15"],
            ["Interest paid", "5"],
            ["Loan repaid", "20"],
          ],
        },
        {
          type: "p",
          text: "Work to the firm first, and leave the interest and the loan repayment out of it — they belong to the second stage.",
        },
        {
          type: "table",
          columns: [{ label: "Free cash flow to the firm" }, { label: "ZMW’000", align: "right" }],
          rows: [
            ["Operating profit (PBIT)", "300"],
            ["Add back depreciation", "120"],
            ["Less tax paid", "(140)"],
            ["Operating cash flow", "280"],
            ["Less replacement of non-current assets", "(10)"],
            ["Less incremental non-current asset investment", "(15)"],
            ["Less increase in working capital", "(50)"],
          ],
          subtotals: [3],
          total: ["Free cash flow to the firm", "205"],
        },
        {
          type: "p",
          text: "Now take the lenders out to reach the shareholders.",
        },
        {
          type: "table",
          columns: [{ label: "Free cash flow to equity" }, { label: "ZMW’000", align: "right" }],
          rows: [
            ["Free cash flow to the firm", "205"],
            ["Less debt interest paid", "(5)"],
            ["Less loan repaid", "(20)"],
          ],
          total: ["Free cash flow to equity", "180"],
          note: "No new debt was raised this year, so there is nothing to add back.",
        },
        {
          type: "p",
          text: "Read what the two figures say. The business generated ZMW205,000 for everyone who funded it. After servicing its debt, ZMW180,000 of that belonged to shareholders — so a dividend of ZMW90,000 would be covered twice over, and a dividend of ZMW200,000 would have to come from somewhere other than this year’s trading.",
        },
      ],
      check: {
        question:
          "Take the same figures, but suppose the increase in working capital had been ZMW90,000 instead of ZMW50,000. What happens to free cash flow to equity?",
        options: [
          "It falls to ZMW140,000",
          "It stays at ZMW180,000, because working capital is not a cash item",
          "It falls to ZMW165,000",
          "It falls to ZMW140,000 only if the company also borrows to fund the extra stock",
        ],
        answer: 0,
        explain:
          "An extra ZMW40,000 tied up in stock and receivables is ZMW40,000 that did not reach anybody, so both measures drop by the full amount: the firm to ZMW165,000 and equity to ZMW140,000. Working capital is very much a cash item — it is cash sitting in the warehouse instead of the bank.",
      },
    },
  ],
};
