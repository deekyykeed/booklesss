/* CF · Lesson 1 Investment appraisal · Step 6 — Capital rationing
 *
 * Source: 01_Investment_Appraisal/Lectures/Capital Rationing (2023), 8 slides.
 * The multi-period example is the lecture's own Bazza Inc problem at its
 * original figures. The single-period sections build the profitability index
 * the lecture assumes, and which Step 2 pointed forward to.
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "capital-rationing",
  label: "Capital rationing",
  title: "Capital rationing",
  kicker: "Investment appraisal",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-it-is",
      heading: "When there is not enough money for everything",
      blocks: [
        {
          type: "p",
          text: "Capital rationing exists when a company has more positive-NPV projects than it has money to fund. The appraisal question changes shape: it is no longer whether each project is worth doing, but which combination of them squeezes the most value out of a fixed amount of capital.",
        },
        {
          type: "p",
          text: "Everything up to this point has said accept every project with a positive NPV. That rule quietly assumed the company could raise whatever the projects needed. Most cannot, and a Zambian firm working with a bank facility capped at ZMW5 million for the year is in exactly this position — three good projects and enough money for two of them.",
        },
        {
          type: "p",
          text: "So the decision becomes a ranking problem, and the trap is ranking on the wrong thing. The largest NPV is not automatically the best use of a constrained kwacha, because a project that adds ZMW22,000 while consuming the whole budget can be beaten by two smaller ones that add ZMW27,000 between them.",
        },
        {
          type: "callout",
          text: "Unconstrained, you maximise NPV project by project. Constrained, you maximise NPV per kwacha of the scarce resource.",
        },
      ],
      check: {
        question:
          "Why does the ordinary rule — accept every project with a positive NPV — stop working under capital rationing?",
        options: [
          "Because the company cannot fund every positive-NPV project, so the projects compete against each other for the same money",
          "Because rationing makes some projects’ NPVs turn negative",
          "Because NPV cannot be calculated when the capital available is limited",
          "Because the cost of capital rises when a company is short of funds",
        ],
        answer: 0,
        explain:
          "Nothing happens to the individual NPVs — they are all still positive and all still worth doing. What changes is that taking one project now means not taking another, so the question becomes which combination fits the budget and adds the most value in total.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "soft-and-hard",
      heading: "Soft and hard rationing",
      blocks: [
        {
          type: "p",
          text: "The shortage comes from one of two places, and where it comes from decides whether anyone can do anything about it.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Soft capital rationing" }, { label: "Hard capital rationing" }],
          rows: [
            ["Where the limit comes from", "Inside the company", "Outside the company"],
            [
              "Typical cause",
              "A board-imposed capital budget, unwillingness to dilute control by issuing shares, a policy of funding growth from retained earnings",
              "Lenders unwilling to advance more, a share issue that would not be subscribed, a credit market that has closed",
            ],
            ["Can it be lifted?", "Yes — it is a management choice", "No — not at any price the company will pay"],
          ],
        },
        {
          type: "p",
          text: "Soft rationing is self-imposed, and often for reasons that are perfectly sensible: a family-owned business that will not issue shares to outsiders is choosing control over capital. It is still a choice, and it can be revisited if a project is good enough.",
        },
        {
          type: "p",
          text: "Hard rationing is imposed by the market. A small Zambian company that has already borrowed against everything it owns, in a year when the banks have tightened, faces a limit it cannot argue with.",
        },
        {
          type: "p",
          text: "The arithmetic that follows is the same in both cases. The distinction matters for what you write around it — under soft rationing the honest recommendation may be that the constraint itself should be reconsidered.",
        },
      ],
      check: {
        question:
          "A company’s board has set a ZMW10 million ceiling on capital spending for the year, to avoid issuing new shares and diluting the founding family’s stake. What kind of rationing is this?",
        options: [
          "Soft rationing, because the limit is set inside the company and could be changed",
          "Hard rationing, because the company genuinely cannot raise more than ZMW10 million",
          "Neither — a self-imposed budget is not capital rationing",
          "Hard rationing, because dilution is a real cost to the existing shareholders",
        ],
        answer: 0,
        explain:
          "The money exists; the board has decided not to raise it. That is soft rationing, whatever the reason behind the decision. Dilution being a genuine concern does not make the constraint external — hard rationing means the market will not supply the funds at all.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "profitability-index",
      heading: "Ranking by profitability index",
      blocks: [
        {
          type: "p",
          text: "The profitability index measures how much present value each kwacha of outlay buys. Rank the projects by it, work down the list until the money runs out, and you have the combination with the highest total NPV — provided the projects are divisible.",
        },
        {
          type: "formula",
          text: "Profitability index  =  PV of future cash flows  ÷  initial outlay",
          where: [
            "PV of future cash flows = the present value of everything the project returns, excluding the outlay",
            "initial outlay = the capital the project consumes in the rationed period",
          ],
        },
        {
          type: "p",
          text: "An index above 1.00 says the same thing a positive NPV says. What it adds is comparability: a project scoring 1.30 returns ZMW1.30 of value for every kwacha it ties up, against ZMW1.22 from one scoring 1.22, whatever their sizes. The same ranking comes from dividing NPV by the outlay directly, which is the form most students find quicker.",
        },
        {
          type: "p",
          text: "Take four projects and ZMW200,000 to spend. Each can be part-funded, and a project taken at 40% returns 40% of its NPV.",
        },
        {
          type: "table",
          columns: [
            { label: "Project" },
            { label: "Outlay ZMW", align: "right" },
            { label: "NPV ZMW", align: "right" },
            { label: "NPV per ZMW of outlay", align: "right" },
            { label: "Rank", align: "right" },
          ],
          rows: [
            ["A", "80,000", "20,000", "0.250", "2"],
            ["B", "60,000", "18,000", "0.300", "1"],
            ["C", "100,000", "22,000", "0.220", "4"],
            ["D", "40,000", "9,000", "0.225", "3"],
          ],
        },
        {
          type: "p",
          text: "Now spend the budget in rank order.",
        },
        {
          type: "table",
          columns: [
            { label: "Taken" },
            { label: "Outlay ZMW", align: "right" },
            { label: "Budget left ZMW", align: "right" },
            { label: "NPV earned ZMW", align: "right" },
          ],
          rows: [
            ["B in full", "60,000", "140,000", "18,000"],
            ["A in full", "80,000", "60,000", "20,000"],
            ["D in full", "40,000", "20,000", "9,000"],
            ["C — 20% of it", "20,000", "nil", "4,400"],
          ],
          total: ["Total NPV", "200,000", "", "51,400"],
        },
        {
          type: "p",
          text: "Rank instead by NPV alone and you would take C first, then A, then a third of B — for ZMW48,000. The same budget, ZMW3,400 less value, because the biggest project was not the most efficient one.",
        },
      ],
      check: {
        question:
          "Under single-period rationing with divisible projects, why is a project with an NPV of ZMW22,000 ranked below one with an NPV of ZMW18,000?",
        options: [
          "Because the ZMW18,000 project produces more NPV per kwacha of the limited capital it uses",
          "Because smaller projects are less risky when funds are short",
          "Because the ZMW22,000 project cannot be funded in full",
          "Because NPV is unreliable when capital is rationed",
        ],
        answer: 0,
        explain:
          "The scarce thing is capital, so the ranking has to be per kwacha of capital. ZMW18,000 on an outlay of ZMW60,000 is 0.300 per kwacha; ZMW22,000 on ZMW100,000 is only 0.220. Both NPVs stay exactly as calculated — the ranking is about what each one costs to obtain.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "indivisible",
      heading: "When projects cannot be split",
      blocks: [
        {
          type: "p",
          text: "Most real projects are indivisible. You cannot build 20% of a depot or install a fifth of a mill and collect a fifth of the returns. Once fractions are off the table the profitability index stops being reliable, and you have to test the combinations that fit.",
        },
        {
          type: "p",
          text: "Take the same four projects and the same ZMW200,000, but now each is all or nothing.",
        },
        {
          type: "table",
          columns: [
            { label: "Combination" },
            { label: "Outlay ZMW", align: "right" },
            { label: "Total NPV ZMW", align: "right" },
            { label: "Fits?" },
          ],
          rows: [
            ["B + C + D", "200,000", "49,000", "Yes — exactly"],
            ["A + B + D", "180,000", "47,000", "Yes, ZMW20,000 idle"],
            ["A + C", "180,000", "42,000", "Yes, ZMW20,000 idle"],
            ["B + C", "160,000", "40,000", "Yes, ZMW40,000 idle"],
            ["A + B + C", "240,000", "—", "No — over budget"],
          ],
        },
        {
          type: "p",
          text: "B + C + D wins with ZMW49,000. The index ranking would have chosen B, then A, then D, leaving ZMW20,000 that could not buy anything and ZMW2,000 of value on the table. It went wrong because it took A — efficient per kwacha, but the wrong size to fit alongside the others.",
        },
        {
          type: "p",
          text: "So with indivisible projects the index is a starting point, not the answer. Use it to see roughly where the value is, then list the feasible combinations and total them. Note also that using the whole budget is not the objective in itself — leftover cash is only a problem when it could have bought more NPV.",
        },
        {
          type: "callout",
          text: "Divisible projects: rank by the index and work down. Indivisible projects: total up every combination that fits.",
        },
      ],
      check: {
        question:
          "Why can the profitability index ranking give the wrong answer for indivisible projects?",
        options: [
          "Because a highly ranked project may be the wrong size to combine with the others, leaving capital idle",
          "Because indivisible projects have different NPVs from divisible ones",
          "Because the index cannot be calculated when a project cannot be part-funded",
          "Because indivisible projects must always be ranked by absolute NPV instead",
        ],
        answer: 0,
        explain:
          "The index assumes the leftover capital can always be put to work in the next project down the list. When nothing can be part-funded, that assumption breaks: money that fits no remaining project earns nothing at all, and a slightly less efficient combination that uses the whole budget can beat it.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "multi-period",
      heading: "Rationing across several years",
      blocks: [
        {
          type: "p",
          text: "When capital is limited in more than one period, listing combinations stops being practical. Each project draws on several budgets at once, and a combination that fits in year 1 can breach year 2. This is what linear programming is for.",
        },
        {
          type: "p",
          text: "The board of Bazza Inc has approved ZMW16,000 of investment in year 1, ZMW14,000 in year 2 and ZMW17,000 in year 3. Four projects are available.",
        },
        {
          type: "table",
          columns: [
            { label: "Project" },
            { label: "Year 1 ZMW", align: "right" },
            { label: "Year 2 ZMW", align: "right" },
            { label: "Year 3 ZMW", align: "right" },
            { label: "NPV ZMW", align: "right" },
          ],
          rows: [
            ["1", "7,000", "10,000", "4,000", "8,000"],
            ["2", "9,000", "—", "12,000", "11,000"],
            ["3", "—", "6,000", "8,000", "6,000"],
            ["4", "5,000", "6,000", "7,000", "4,000"],
          ],
          note: "Available: ZMW16,000 in year 1, ZMW14,000 in year 2, ZMW17,000 in year 3.",
        },
        {
          type: "p",
          text: "Write the problem down as an objective and a set of constraints. Let Y₁ to Y₄ stand for the four projects, each taking the value 1 if the project is undertaken and 0 if it is not. The objective is the total NPV, and it is to be made as large as possible.",
        },
        {
          type: "formula",
          text: "Maximise  8,000Y₁ + 11,000Y₂ + 6,000Y₃ + 4,000Y₄",
          where: [
            "Y₁…Y₄ = 1 if that project is undertaken, 0 if it is not",
            "the coefficients = each project’s NPV in ZMW",
          ],
        },
        {
          type: "p",
          text: "Then one constraint per rationed year, each saying that what the chosen projects consume in that year cannot exceed what the board has approved.",
        },
        {
          type: "table",
          columns: [{ label: "Constraint" }, { label: "Written as" }],
          rows: [
            ["Year 1", "7,000Y₁ + 9,000Y₂ + 0Y₃ + 5,000Y₄  ≤  16,000"],
            ["Year 2", "10,000Y₁ + 0Y₂ + 6,000Y₃ + 6,000Y₄  ≤  14,000"],
            ["Year 3", "4,000Y₁ + 12,000Y₂ + 8,000Y₃ + 7,000Y₄  ≤  17,000"],
          ],
        },
        {
          type: "p",
          text: "Solved, the answer is Y₁ = 1, Y₂ = 1, Y₃ = 0, Y₄ = 0: take projects 1 and 2 in full, leave 3 and 4. Total NPV ZMW19,000. Check it against the constraints — year 1 uses the full ZMW16,000, year 2 uses ZMW10,000 of the ZMW14,000, year 3 uses ZMW16,000 of the ZMW17,000.",
        },
        {
          type: "p",
          text: "Projects 3 and 4 together also fit comfortably, and would be a perfectly valid answer to the question “what can we afford?”. They are worth ZMW10,000. That is the difference between feasible and optimal, and it is the reason the objective function is written down at all.",
        },
        {
          type: "p",
          text: "It is worth seeing why the two rejected projects cannot simply be squeezed into the money left over. Project 4 needs ZMW5,000 in year 1, and year 1 is fully spent. Project 3 needs nothing in year 1, but wants ZMW6,000 in year 2 against ZMW4,000 spare and ZMW8,000 in year 3 against ZMW1,000. A different year blocks each of them, which is why all three constraints have to be written down rather than just the tightest-looking one.",
        },
      ],
      check: {
        question:
          "With projects 1 and 2 taken, Bazza has ZMW4,000 unused in year 2 and ZMW1,000 in year 3. Why can project 3, which needs no year 1 money at all, not be added?",
        options: [
          "It needs ZMW6,000 in year 2 and ZMW8,000 in year 3, and neither year has that much left",
          "Because year 1 is fully spent, and every project must draw on year 1",
          "Because its NPV of ZMW6,000 is lower than the NPV of the projects already chosen",
          "Because a linear programme can only ever select two projects",
        ],
        answer: 0,
        explain:
          "Leftover capital only helps if it is in the years the project actually needs it. Project 3’s demands fall in years 2 and 3, and both are short — ZMW2,000 short in year 2 and ZMW7,000 short in year 3. Capital rationing is a constraint on each period separately, not on a single pot.",
      },
    },
  ],
};
