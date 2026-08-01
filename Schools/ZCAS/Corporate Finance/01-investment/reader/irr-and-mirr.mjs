/* CF · Lesson 1 Investment appraisal · Step 3 — IRR and MIRR
 *
 * Source: 01_Investment_Appraisal/Lectures/Investment Appraisal Part 2 —
 * Sessions Using Free Cash Flows (2024), slides 9–26. Runs on the same
 * ZMW24,000 project as Step 2 so the reader can compare all three answers on
 * one set of numbers, exactly as the lecture does.
 *
 * NB the 2024 slide prints the year-5 factor at 14% as 0.477; the correct
 * factor is 0.519, which is what the slide's own present value of 4,775 was
 * calculated with. 0.519 is used here. The NPV of (554) is unaffected.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "irr-and-mirr",
  label: "IRR & MIRR",
  title: "IRR and MIRR",
  kicker: "Investment appraisal",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "irr",
      heading: "The internal rate of return",
      blocks: [
        {
          type: "p",
          text: "The internal rate of return is the discount rate at which a project’s NPV is exactly zero — the rate at which the project just breaks even in present-value terms. It is a break-even test on the cost of money rather than on sales volume.",
        },
        {
          type: "p",
          text: "Because it is a rate, it comes with a decision rule that reads naturally to anyone running a business: borrow at 10%, earn 13%, take the project.",
        },
        {
          type: "ul",
          items: [
            "For a conventional project — money out first, then a run of inflows — accept it if the IRR is above the cost of capital.",
            "Reject it if the IRR is below the cost of capital, because the project earns less than the money funding it costs.",
          ],
        },
        {
          type: "p",
          text: "That readability is the whole appeal of IRR, and it is why boards ask for it. A percentage can be compared against the bank’s lending rate without any further explanation, where an NPV of ZMW1,967 needs someone to say what it is 1,967 of.",
        },
      ],
      check: {
        question:
          "A conventional project has an IRR of 9%. The company’s cost of capital is 13%. What follows?",
        options: [
          "Reject it — its NPV at 13% must be negative",
          "Accept it — a positive IRR always means a project is worth doing",
          "Reject it, but only if the discounted payback also fails",
          "There is not enough information without knowing the size of the outlay",
        ],
        answer: 0,
        explain:
          "The NPV is zero at 9%, and NPV falls as the discount rate rises — so at 13% it must be below zero. The project earns less than the money funding it costs.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "interpolation",
      heading: "Finding IRR by interpolation",
      blocks: [
        {
          type: "p",
          text: "There is no way to solve for IRR directly by hand on a project with several years of cash flows. Instead you calculate the NPV at two rates — one that leaves it positive and one that pushes it negative — and read off the point in between where the line crosses zero.",
        },
        {
          type: "p",
          text: "Take the same ZMW24,000 project from the last step. At 10% its NPV was ZMW1,967. Run it again at 14%.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Cash flow ZMW", align: "right" },
            { label: "Factor at 10%", align: "right" },
            { label: "PV ZMW", align: "right" },
            { label: "Factor at 14%", align: "right" },
            { label: "PV ZMW", align: "right" },
          ],
          rows: [
            ["0", "(24,000)", "1.000", "(24,000)", "1.000", "(24,000)"],
            ["1", "7,800", "0.909", "7,090", "0.877", "6,841"],
            ["2", "6,000", "0.826", "4,956", "0.769", "4,614"],
            ["3", "4,200", "0.751", "3,154", "0.675", "2,835"],
            ["4", "7,400", "0.683", "5,054", "0.592", "4,381"],
            ["5", "9,200", "0.621", "5,713", "0.519", "4,775"],
          ],
          total: ["NPV", "", "", "1,967", "", "(554)"],
        },
        {
          type: "p",
          text: "The NPV crossed from positive to negative somewhere between the two rates, so that is where the IRR sits.",
        },
        {
          type: "formula",
          text: "IRR  =  A  +  [ a ÷ (a − b) ]  ×  (B − A)",
          where: [
            "A = the lower discount rate, the one giving a positive NPV",
            "a = the NPV at rate A",
            "B = the higher discount rate, the one giving a negative NPV",
            "b = the NPV at rate B, which is a negative figure",
          ],
        },
        {
          type: "p",
          text: "Watch the sign. Because b is negative, subtracting it adds: a − b = 1,967 − (−554) = 2,521. That denominator is the total distance the NPV travelled between the two rates, and the numerator is how much of that distance had been covered by the time it reached zero.",
        },
        {
          type: "formula",
          text: "IRR  =  10%  +  [ 1,967 ÷ 2,521 ]  ×  4%  =  13.12%",
        },
        {
          type: "p",
          text: "Against a 10% cost of capital the project is accepted, which agrees with the positive NPV — as it must, since both are reading the same cash flows.",
        },
        {
          type: "callout",
          text: "Interpolation draws a straight line between two NPVs. The real relationship is a curve, so the answer is close rather than exact — and the further apart the two rates, the rougher it gets.",
        },
      ],
      check: {
        question:
          "A project has an NPV of ZMW32,000 at 5% and an NPV of (ZMW78,000) at 10%. What is its IRR?",
        options: ["6.45%", "8.54%", "7.50%", "5.29%"],
        answer: 0,
        explain:
          "5% + [32,000 ÷ (32,000 + 78,000)] × 5% = 5% + 1.45% = 6.45%. The NPV falls away steeply here, so the crossing point sits much closer to the lower rate than to the midpoint of 7.5%.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "irr-problems",
      heading: "Where IRR misleads",
      blocks: [
        {
          type: "p",
          text: "IRR is the most widely quoted appraisal figure and the least reliable. Three problems, in rising order of seriousness.",
        },
        {
          type: "h2",
          text: "The decision rule is not always clear cut",
        },
        {
          type: "p",
          text: "A project whose cash flows change direction more than once — an outflow, then inflows, then a large closure or restoration cost at the end — can have two IRRs, or more, or none at all. A mine with a rehabilitation obligation in its final year is the textbook case, and it is a common shape in Zambia. Told that a project has IRRs of 6% and 31%, the rule to accept when the IRR beats the cost of capital simply has no answer.",
        },
        {
          type: "h2",
          text: "It is not the return on the project",
        },
        {
          type: "p",
          text: "IRR is routinely read as the return the project earns. It is not. The calculation assumes every cash flow the project throws off is immediately reinvested at the IRR itself for the rest of the project’s life. A project showing an IRR of 30% only earns 30% if the company really can find 30% homes for the cash as it arrives — and a company that could do that reliably would not need the project.",
        },
        {
          type: "h2",
          text: "It does not compare projects",
        },
        {
          type: "p",
          text: "Because two projects can have different lives, different sizes and different reinvestment assumptions buried in their own IRRs, ranking them by IRR can put the wrong one first. A small project with a spectacular percentage can beat a large one that adds far more value, and the percentage gives you no way to see it.",
        },
        {
          type: "callout",
          text: "Where NPV and IRR disagree about which project to take, NPV is right. IRR is reported because it communicates well, not because it decides well.",
        },
      ],
      check: {
        question:
          "A copper project has an outflow in year 0, inflows in years 1 to 8, and a large rehabilitation outflow in year 9. What is the specific difficulty this creates for IRR?",
        options: [
          "The cash flows change direction twice, so the project can have more than one IRR and the accept rule breaks down",
          "The rehabilitation cost cannot be discounted, because it is an outflow rather than an inflow",
          "IRR cannot be calculated for projects lasting more than five years",
          "The IRR will be understated, because the final outflow is discounted most heavily",
        ],
        answer: 0,
        explain:
          "Each change of sign in the cash flows creates the possibility of another rate at which NPV equals zero. With two changes there can be two IRRs, and 'accept if the IRR exceeds the cost of capital' cannot be applied to two different numbers. NPV handles the same cash flows without any difficulty.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "mirr",
      heading: "The modified internal rate of return",
      blocks: [
        {
          type: "p",
          text: "MIRR keeps what is useful about IRR — a single percentage you can hold against the cost of borrowing — while removing the assumption that broke it. Instead of pretending cash is reinvested at the IRR, you state the rate at which the company can genuinely reinvest, and build the answer on that.",
        },
        {
          type: "p",
          text: "The method collapses the project into two numbers: what it costs today, and what it will be worth at the end.",
        },
        {
          type: "ul",
          items: [
            "Take every outflow and discount it back to year 0 at the cost of capital. That is the investment phase, PVCF.",
            "Take every inflow and compound it forward to the final year at the reinvestment rate. That is the return phase, FVCF.",
            "Find the annual rate that grows PVCF into FVCF over the project’s life.",
            "Accept the project if that rate exceeds the cost of capital.",
          ],
        },
        {
          type: "formula",
          text: "MIRR  =  ⁿ√( FVCF ÷ PVCF )  −  1",
          where: [
            "FVCF = the future value of the return phase, compounded to the final year at the reinvestment rate",
            "PVCF = the present value of the investment phase, discounted at the cost of capital",
            "n = the life of the project, in years",
          ],
        },
        {
          type: "p",
          text: "Two different rates appear in one calculation, and that is deliberate rather than sloppy. Money the company spends is funded at its cost of capital; money the company receives is put to work at whatever it can actually earn. Those are genuinely different rates, and IRR’s mistake was assuming they were the same.",
        },
      ],
      check: {
        question:
          "What does MIRR fix that IRR gets wrong?",
        options: [
          "IRR assumes cash flows are reinvested at the IRR itself; MIRR uses a reinvestment rate the company can actually achieve",
          "IRR ignores the time value of money, while MIRR discounts properly",
          "IRR cannot handle an initial outflow, whereas MIRR can",
          "IRR gives an answer in kwacha, while MIRR gives a percentage",
        ],
        answer: 0,
        explain:
          "The reinvestment assumption is the flaw. A project with a 30% IRR only delivers 30% if every kwacha it releases can be put back to work at 30%, which is rarely true. MIRR makes you state the achievable rate instead.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "mirr-worked",
      heading: "Working a MIRR",
      blocks: [
        {
          type: "p",
          text: "Same ZMW24,000 project once more. The cost of capital is 10%, and the company can reinvest cash it receives at 12%. Compound each inflow forward to year 5 — a cash flow arriving in year 1 has four years left to grow, one arriving in year 5 has none.",
        },
        {
          type: "table",
          columns: [
            { label: "Year" },
            { label: "Cash flow ZMW", align: "right" },
            { label: "Compounded at 12% for", align: "right" },
            { label: "Value at year 5 ZMW", align: "right" },
          ],
          rows: [
            ["1", "7,800", "4 years", "12,273"],
            ["2", "6,000", "3 years", "8,430"],
            ["3", "4,200", "2 years", "5,268"],
            ["4", "7,400", "1 year", "8,288"],
            ["5", "9,200", "—", "9,200"],
          ],
          total: ["Future value of the return phase", "", "", "43,459"],
        },
        {
          type: "p",
          text: "The investment phase is simply the ZMW24,000, already at year 0. So the whole project reduces to a single question: what annual rate turns ZMW24,000 today into ZMW43,459 in five years?",
        },
        {
          type: "formula",
          text: "MIRR  =  ⁵√( 43,459 ÷ 24,000 )  −  1  =  12.6%",
        },
        {
          type: "p",
          text: "12.6% is comfortably above the 10% cost of capital, so the project is accepted. Set the three answers side by side and the pattern is worth keeping.",
        },
        {
          type: "table",
          columns: [{ label: "Measure" }, { label: "Result", align: "right" }, { label: "Reads as" }],
          rows: [
            ["NPV at 10%", "ZMW1,967", "Accept — adds value"],
            ["IRR", "13.12%", "Accept — but assumes reinvestment at 13.12%"],
            ["MIRR at 12% reinvestment", "12.60%", "Accept — on an assumption the company can meet"],
            ["Discounted payback", "4.66 years", "Fails a 4-year target"],
          ],
        },
        {
          type: "p",
          text: "MIRR comes in below IRR, and it will whenever the reinvestment rate is below the IRR. That gap is the size of IRR’s flattery. Where a project shows an IRR far above anything the company could realistically earn on spare cash, expect MIRR to be a good deal lower — and to be the number worth trusting.",
        },
        {
          type: "callout",
          text: "MIRR is always the more honest percentage. NPV is still the decision.",
        },
      ],
      check: {
        question:
          "A project’s inflows compound to ZMW80 million by its final year, against an investment phase worth ZMW50 million today. The project runs for four years and the cost of capital is 14%. Should it be accepted?",
        options: [
          "No — the MIRR is about 12.5%, which is below the 14% cost of capital",
          "Yes — the MIRR is about 12.5%, and the project returns ZMW30 million more than it cost",
          "Yes — the MIRR is about 16%, which beats the cost of capital",
          "There is not enough information without knowing the reinvestment rate",
        ],
        answer: 0,
        explain:
          "⁴√(80 ÷ 50) − 1 = 12.5%, below the 14% cost of capital, so reject. The ZMW30 million of growth looks generous until you notice it took four years to earn — which is exactly what turning it into an annual rate is for. The reinvestment rate is not needed separately; it is already inside the ZMW80 million.",
      },
    },
  ],
};
