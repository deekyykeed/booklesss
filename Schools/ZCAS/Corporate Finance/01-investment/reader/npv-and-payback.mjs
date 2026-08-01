/* CF · Lesson 1 Investment appraisal · Step 2 — NPV and discounted payback
 *
 * Source: 01_Investment_Appraisal/Lectures/Investment Appraisal Part 2 —
 * Sessions Using Free Cash Flows (2024), slides 1–6. Activity 1 is the
 * lecture's own worked example, kept at its original figures.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "npv-and-payback",
  label: "NPV & discounted payback",
  title: "NPV and discounted payback",
  kicker: "Investment appraisal",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "time-value",
      heading: "Why a future kwacha is worth less",
      blocks: [
        {
          type: "p",
          text: "ZMW1,000 in your hand today is worth more than ZMW1,000 promised in a year. You could put today’s money to work, and the promise might not be kept. Before you can add up cash flows that arrive in different years, you have to restate them all in today’s money.",
        },
        {
          type: "p",
          text: "That restatement is discounting, and the rate you discount at is the company’s cost of capital — what its investors demand for leaving their money in the business. Multiply a future cash flow by its discount factor and you have its present value.",
        },
        {
          type: "formula",
          text: "Discount factor  =  1 ÷ (1 + r)ⁿ",
          where: [
            "r = the cost of capital, written as a decimal",
            "n = the number of years until the cash flow arrives",
          ],
        },
        {
          type: "p",
          text: "At a cost of capital of 10%, a kwacha due in one year is worth 1 ÷ 1.10 = 0.909 today, and one due in two years is worth 1 ÷ 1.10² = 0.826. The factor falls every year, which is the arithmetic saying what everyone already knows: the further away the money, the less you should pay for it now.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Factor at 10%", align: "right" },
            { label: "What ZMW1,000 is worth today", align: "right" },
          ],
          rows: [
            ["1", "0.909", "909"],
            ["2", "0.826", "826"],
            ["3", "0.751", "751"],
            ["4", "0.683", "683"],
            ["5", "0.621", "621"],
          ],
          note: "Cash at year 0 is already in today’s money, so its factor is 1.000.",
        },
      ],
      check: {
        question:
          "A project will pay ZMW500,000 in three years. The cost of capital is 10%. What is that worth today?",
        options: [
          "ZMW375,500",
          "ZMW500,000, because the money is certain",
          "ZMW665,500",
          "ZMW350,000",
        ],
        answer: 0,
        explain:
          "500,000 × 0.751 = 375,500. Multiplying by the factor moves money backwards to today; dividing by it would move today’s money forward to year 3, which is the ZMW665,500 answer.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "npv",
      heading: "Net present value",
      blocks: [
        {
          type: "p",
          text: "Net present value is the sum of the present values of every cash flow a project causes, including the money you spend at the start. It answers one question: does this project make the owners of the business richer, and by how much in today’s money?",
        },
        {
          type: "formula",
          text: "NPV  =  Σ  CFₙ ÷ (1 + r)ⁿ  −  I₀",
          where: [
            "CFₙ = the net cash flow the project generates in year n",
            "r = the cost of capital used to discount",
            "n = the year in which the cash flow arrives",
            "I₀ = the amount invested at the start, in year 0",
          ],
        },
        {
          type: "ul",
          items: [
            "A positive NPV means the project earns more than the cost of the money funding it. Accept it.",
            "A negative NPV means it earns less. The business would be better off leaving the money where it is.",
            "An NPV of zero means it earns exactly the required return — no better, no worse than the alternative.",
          ],
        },
        {
          type: "p",
          text: "The number itself is meaningful, not just its sign. An NPV of ZMW1,967 says the project is worth ZMW1,967 more than it costs, in today’s money, after paying every provider of capital what they demanded.",
        },
        {
          type: "callout",
          text: "NPV is the amount by which a project increases the value of the business, measured today.",
        },
      ],
      check: {
        question:
          "Two mutually exclusive projects are appraised at the same cost of capital. Project A has an NPV of ZMW400,000; Project B has an NPV of ZMW250,000 on half the initial outlay. Which should the company take?",
        options: [
          "Project A, because it adds more value to the business",
          "Project B, because it earns more per kwacha invested",
          "Both, since both have positive NPVs",
          "Neither can be chosen without knowing the payback periods",
        ],
        answer: 0,
        explain:
          "When you must pick one, take the larger NPV — the objective is to add the most value, not the highest return per kwacha. Return per kwacha only becomes the deciding test when capital is rationed, which is a later step. And they cannot both be taken; they are mutually exclusive.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "npv-worked",
      heading: "Working an NPV",
      blocks: [
        {
          type: "p",
          text: "A project needs ZMW24,000 up front and will generate cash over five years. The cost of capital is 10%. Lay the years out in a column, discount each one, and add up.",
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
            ["0", "(24,000)", "1.000", "(24,000)"],
            ["1", "7,800", "0.909", "7,090"],
            ["2", "6,000", "0.826", "4,956"],
            ["3", "4,200", "0.751", "3,154"],
            ["4", "7,400", "0.683", "5,054"],
            ["5", "9,200", "0.621", "5,713"],
          ],
          total: ["NPV", "", "", "1,967"],
        },
        {
          type: "p",
          text: "The NPV is positive, so the project is worth doing: it returns the ZMW24,000, pays the 10% the providers of capital require on it, and leaves ZMW1,967 of value over.",
        },
        {
          type: "p",
          text: "Notice how the answer is built. The initial outlay sits at year 0 at a factor of 1.000, because it is spent today and needs no discounting. Every other line is a forecast cash flow multiplied by its factor. There is no arithmetic in an NPV harder than that — the difficulty in an exam is always in deciding which cash flows belong in the table at all.",
        },
      ],
      check: {
        question:
          "In the working above, why does the year 0 outflow carry a discount factor of 1.000?",
        options: [
          "Because it is already in today’s money, so there is nothing to discount",
          "Because outflows are never discounted, only inflows are",
          "Because the discount factor for the first year is always 1.000",
          "Because the project has not started earning, so the cost of capital does not yet apply",
        ],
        answer: 0,
        explain:
          "Year 0 is today. Discounting exists to bring future money back to the present, and this money is already there. Outflows in later years are discounted exactly like inflows.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "discounted-payback",
      heading: "Discounted payback period",
      blocks: [
        {
          type: "p",
          text: "The discounted payback period is how long the project takes to earn its money back in present-value terms — the point at which the discounted inflows have caught up with the initial cost. A project passes if it pays back within the company’s target, where the company has set one.",
        },
        {
          type: "p",
          text: "You find it by carrying the present values forward in a running total and watching for the year the balance turns positive.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Present value ZMW", align: "right" },
            { label: "Cumulative PV ZMW", align: "right" },
          ],
          rows: [
            ["0", "(24,000)", "(24,000)"],
            ["1", "7,090", "(16,910)"],
            ["2", "4,956", "(11,954)"],
            ["3", "3,154", "(8,800)"],
            ["4", "5,054", "(3,746)"],
            ["5", "5,713", "1,967"],
          ],
          note: "The balance is still ZMW3,746 short at the end of year 4, and in surplus by the end of year 5 — so payback happens during year 5.",
        },
        {
          type: "p",
          text: "To pin down where in that year, assume the year-5 cash arrives evenly and take the fraction you still needed.",
        },
        {
          type: "formula",
          text: "DPP  =  A  +  (B ÷ C)",
          where: [
            "A = the last full year in which the cumulative balance is still negative",
            "B = the amount still outstanding at the end of year A, as a positive figure",
            "C = the present value of the cash flow arriving in the following year",
          ],
        },
        {
          type: "p",
          text: "Here that is 4 + (3,746 ÷ 5,713) = 4.66 years. Against a target of 4 years, the project fails — while its NPV said accept. The two tests disagree because they measure different things, and only one of them is about value.",
        },
      ],
      check: {
        question:
          "The project above has a discounted payback of 4.66 years against a 4-year target, and an NPV of ZMW1,967. What does that tell you?",
        options: [
          "It creates value, but ties the money up for longer than the company is willing to wait",
          "The NPV must be wrong, because a project cannot create value if it fails its payback target",
          "It should be rejected, because payback is the more reliable of the two tests",
          "The two tests always agree, so one of the calculations contains an error",
        ],
        answer: 0,
        explain:
          "The tests answer different questions. NPV asks whether the project is worth more than it costs; discounted payback asks how long the company is exposed before it gets its money back. A project can easily create value slowly.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "choosing",
      heading: "What each test is good for",
      blocks: [
        {
          type: "p",
          text: "Discounted payback is a real improvement on ordinary payback, because it counts the cost of the money while the project is waiting to break even. It still has the flaw that ordinary payback has: it stops counting the moment the money is back.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Net present value" }, { label: "Discounted payback" }],
          rows: [
            ["What it measures", "Value added, in today’s money", "Time until the outlay is recovered"],
            ["Cash after the payback point", "Counted in full", "Ignored entirely"],
            ["Answers", "Should we do this?", "How long are we exposed?"],
            ["Decision rule", "Accept if positive", "Accept if within the target"],
          ],
        },
        {
          type: "p",
          text: "Two projects can pay back on exactly the same day, and one of them can go on earning for another decade while the other stops dead. Payback cannot see the difference; NPV can. That is why NPV is the primary test and payback is a secondary one — a check on risk and liquidity rather than on whether the project is worth doing.",
        },
        {
          type: "p",
          text: "For a Zambian business the liquidity question is not a technicality. A firm carrying kwacha debt through a period of high interest rates may genuinely need its money back inside three years, whatever the NPV says about year eight.",
        },
        {
          type: "callout",
          text: "NPV decides whether a project is worth doing. Payback decides whether the company can afford to wait.",
        },
      ],
      check: {
        question:
          "What is the main weakness of discounted payback as an appraisal method?",
        options: [
          "It ignores every cash flow that arrives after the payback point",
          "It ignores the time value of money",
          "It cannot be used when a project has cash flows in more than one year",
          "It requires an estimate of the cost of capital, which NPV does not",
        ],
        answer: 0,
        explain:
          "Once the outlay is recovered the method stops counting, so a long, highly profitable tail is worth nothing to it. Ignoring the time value of money is the weakness of ordinary payback — discounting is precisely what this version fixes.",
      },
    },
  ],
};
