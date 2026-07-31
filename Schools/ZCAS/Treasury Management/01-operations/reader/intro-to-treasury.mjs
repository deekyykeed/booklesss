/* TM · Lesson 1 Operations · Step 1 — Introduction to treasury management
 *
 * Source: 06_Introduction to Treasury Management PPTX; Treasury controls.pdf;
 *         build_lesson_1_1_tm.py (PDF).
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "intro-to-treasury",
  label: "Introduction to treasury",
  title: "Introduction to treasury management",
  kicker: "Treasury operations",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-treasury-is",
      heading: "What treasury is",
      blocks: [
        {
          type: "p",
          text: "Treasury is the financial centre of an organisation. Its core job is to protect the company's financial assets, manage its liabilities, and make sure cash is available when it is needed. Day to day that means keeping suppliers paid, meeting debt obligations, and making sure surplus cash earns rather than sits idle — and it carries a major role in identifying and reducing financial risk.",
        },
        {
          type: "p",
          text: "Treasury executes; it does not set strategy. Senior management decides the capital structure, the dividend, the risk appetite — the treasury team carries those decisions out. Keeping that division clear matters, because the function operates inside the three broad decision areas of finance.",
        },
        {
          type: "ul",
          items: [
            "The investment decision — how the company deploys its resources: long-term projects, working capital, internal or external investments.",
            "The financing decision — how it raises the money: the mix of debt and equity, the cost of funds, capital structure, hedging.",
            "Dividend policy — what happens to profits: how much is paid out and how much retained to fund growth.",
          ],
        },
        {
          type: "p",
          text: "Everything in the rest of this course is treasury working inside those three decisions — funding the working capital the investment decision creates, managing the risks the financing decision leaves open, and keeping the cash flowing that dividend policy promises out.",
        },
      ],
      check: {
        question:
          "The board decides the company will move to a 40% debt, 60% equity structure. What is treasury's role in that decision?",
        options: [
          "Execute it — arrange the borrowings and manage the resulting cost and risk; the decision itself belongs to senior management",
          "Make it — capital structure is treasury's core decision",
          "Veto it if the cost of debt is too high",
          "None — capital structure is an accounting matter",
        ],
        answer: 0,
        explain:
          "Treasury carries out decisions made by senior management. The financing decision is set above the function; treasury's job is to raise the funds on the best terms, manage the refinancing and rate risk it creates, and keep access to credit open.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "eleven-functions",
      heading: "The eleven functions of treasury",
      blocks: [
        {
          type: "p",
          text: "The treasurer's responsibilities go well beyond holding cash. The syllabus lists eleven, and exam questions ask for them by name.",
        },
        {
          type: "table",
          columns: [{ label: "#" }, { label: "Function" }, { label: "What it means" }],
          rows: [
            ["1", "Cash forecasting", "Pulls short and long-term forecasts from all subsidiaries"],
            ["2", "Working capital management", "Monitors working capital levels and trends"],
            ["3", "Cash management", "Keeps sufficient cash available for operations at all times"],
            ["4", "Investment management", "Invests surplus cash appropriately"],
            ["5", "Risk management", "Manages interest rate and FX exposure"],
            ["6", "Management advice", "Advises leadership on market conditions"],
            ["7", "Credit rating relations", "Liaises with agencies when issuing marketable debt"],
            ["8", "Bank relationships", "Manages banking fees, terms, and ongoing communications"],
            ["9", "Fund raising", "Maintains investor relationships for capital raising"],
            ["10", "Credit granting", "Grants credit to customers on behalf of the business"],
            ["11", "Other activities", "M&A support, company insurance, and similar matters"],
          ],
        },
        {
          type: "p",
          text: "Notice the shape of the list: the first five are the operating core — forecast the cash, manage the working capital that consumes it, keep enough on hand, invest the rest, and manage the risks around all of it. The remaining six are the relationships that make the core possible: with management, agencies, banks, investors and customers. The course follows the same shape — working capital first, then risk, then debt and investment, then the systems that hold it together.",
        },
      ],
      check: {
        question:
          "A supplier of marketable debt asks who at the company handles its relationship with Moody's and S&P. Which treasury function is that?",
        options: [
          "Credit rating relations — liaising with agencies when the company issues marketable debt",
          "Bank relationships — rating agencies are a kind of bank",
          "Fund raising — ratings are only about raising equity",
          "Management advice — ratings are advice to leadership",
        ],
        answer: 0,
        explain:
          "Rating agencies get their own function on the list because their assessment prices the company's debt. Bank relationships covers fees and terms with lenders; the agency relationship is about the rating that every future issue will carry.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "task-levels",
      heading: "Strategic, tactical and operational",
      blocks: [
        {
          type: "p",
          text: "Treasury work happens at three levels, and the exam asks you to classify tasks between them. The clean test is the time horizon.",
        },
        {
          type: "table",
          columns: [{ label: "Level" }, { label: "Focus" }, { label: "Examples" }],
          rows: [
            [
              "Strategic",
              "Long-term policy",
              "Capital structure, dividend policy, capital raising, investment returns",
            ],
            [
              "Tactical",
              "Medium-term decisions",
              "Cash investment management, hedging currency or interest rate risk",
            ],
            [
              "Operational",
              "Daily execution",
              "Transmitting cash, placing surplus funds, bank communications",
            ],
          ],
        },
        {
          type: "callout",
          text: "Classify by time horizon: strategic = long-term policy, tactical = medium-term decisions, operational = daily execution.",
        },
      ],
      check: {
        question:
          "Deciding to hedge next year's USD exposure with forward contracts is which level of treasury task?",
        options: [
          "Tactical — a medium-term decision about managing a specific exposure",
          "Strategic — anything involving currency is long-term policy",
          "Operational — hedging is daily execution",
          "None — hedging is a board matter, not a treasury task",
        ],
        answer: 0,
        explain:
          "The time horizon decides it. Setting the company's overall risk appetite is strategic; sending today's payment instructions is operational; choosing to hedge a defined exposure over the coming months sits between them — tactical.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "cost-vs-profit-centre",
      heading: "Cost centre or profit centre",
      blocks: [
        {
          type: "p",
          text: "How a company classifies its treasury changes how the function is managed and measured. Most treat it as a cost centre: a support function not expected to generate profit, just to manage costs. The risk of that framing is that management fixates on what treasury costs rather than what it contributes — and starves the function of budget and staff.",
        },
        {
          type: "p",
          text: "Companies heavily involved in global finance, FX trading or commodities sometimes run treasury as a profit centre, actively generating income through trading, hedging, or pricing its services to internal business units. That brings real advantages — business units pay market rates, so cost transparency improves, and the treasurer is incentivised to operate efficiently — and real dangers: the temptation to speculate, internal disputes over charges, and higher administration costs.",
        },
        {
          type: "callout",
          text: "Nick Leeson at Barings Bank (1995) is the exam case: treasury-style operations run for profit with no oversight, losses hidden in a secret account, and a 233-year-old bank destroyed. Profit-centre thinking without controls is catastrophic.",
        },
      ],
      check: {
        question:
          "A company moves treasury to a profit centre and its dealers begin taking positions beyond what hedging requires. What does the Barings case say about this situation?",
        options: [
          "It is the classic warning — profit incentives without independent controls invite speculation that can destroy the firm",
          "It is healthy — a profit centre should maximise trading income",
          "It is impossible — profit centres cannot take positions",
          "It only matters for banks, not corporates",
        ],
        answer: 0,
        explain:
          "Barings fell because one person could deal, settle and conceal without oversight while chasing trading profit. The lesson is not that profit centres are forbidden — it is that the controls in the next section stop being optional the moment profit incentives appear.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "controls",
      heading: "Treasury controls",
      blocks: [
        {
          type: "p",
          text: "Treasury handles the company's largest sums, so controls are non-negotiable. Six to know, and the first is the one Barings lacked.",
        },
        {
          type: "table",
          columns: [{ label: "Control" }, { label: "What it requires" }],
          rows: [
            [
              "Segregation of duties",
              "Front office (dealing) separate from back office (confirmation and settlement) — no one initiates and confirms their own transactions",
            ],
            [
              "Delegation of authority",
              "High-risk decisions need senior sign-off; routine ones should not",
            ],
            [
              "Limits",
              "Caps on transaction size, type or instrument — no instruments with excessive risk of capital loss",
            ],
            [
              "Approvals",
              "Trades approved by a senior manager; a separate person reconciles and accounts for every transaction",
            ],
            [
              "Internal audits",
              "Scheduled audits match actual transactions against policy, catching drift early",
            ],
            [
              "Automation / STP",
              "Straight-through processing removes manual steps from routine transactions, cutting errors and fraud opportunities",
            ],
          ],
        },
        {
          type: "p",
          text: "The controls interlock. Segregation means no single person can complete a fraud alone; limits and approvals bound what any one decision can lose; audits catch what slips through; automation shrinks the space where human error and temptation operate. An exam answer that names one control should say what failure it prevents.",
        },
      ],
      check: {
        question:
          "A dealer executes a trade and then confirms and settles it personally. Which control is being violated?",
        options: [
          "Segregation of duties — dealing and settlement must sit with different people",
          "Limits — the trade must have been too large",
          "Internal audit — auditors should settle trades",
          "Automation — all settlement should be manual",
        ],
        answer: 0,
        explain:
          "Front office deals; back office confirms and settles. One person doing both can conceal errors or fraud indefinitely — exactly how Leeson hid his losses. Size limits and audits are separate controls; this failure is the segregation one.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "centralisation",
      heading: "Centralised, decentralised and hybrid",
      blocks: [
        {
          type: "p",
          text: "The last structural choice is geographic: where does treasury sit in a company with many units or countries?",
        },
        {
          type: "table",
          columns: [
            { label: "Structure" },
            { label: "How it works" },
            { label: "Advantage" },
            { label: "Disadvantage" },
          ],
          rows: [
            [
              "Centralised",
              "All operations run from HQ",
              "Stronger controls, economies of scale, lower costs, tax advantages for multinationals",
              "Field offices lose autonomy; local knowledge not captured",
            ],
            [
              "Decentralised",
              "Subsidiaries run their own treasury under group guidelines",
              "Local staff know local banking, regulation, language and customs",
              "Duplication of effort and resources across units",
            ],
            [
              "Hybrid",
              "Regional centres — centralised within regions, decentralised across them",
              "Central control with local knowledge",
              "More complex to set up and manage",
            ],
          ],
        },
        {
          type: "p",
          text: "The hybrid model is increasingly common, and technology is the reason: a modern treasury management system lets local teams input data centrally, giving head office oversight without removing local responsiveness. The systems that make that possible are where this course ends — the final step is the TMS itself.",
        },
      ],
      check: {
        question:
          "A mining group with operations in five countries wants head-office control of cash and risk but keeps losing value to local banking rules its HQ team doesn't know. Which structure fits?",
        options: [
          "Hybrid — regional centres give central control while capturing local banking knowledge",
          "Fully centralised — control matters more than local knowledge",
          "Fully decentralised — each mine should run its own treasury",
          "No treasury at all — outsource everything to one bank",
        ],
        answer: 0,
        explain:
          "The group's problem is exactly the trade-off the structures divide on: centralisation for control, decentralisation for local knowledge. The hybrid model exists for cases that need both, at the cost of being more complex to run.",
      },
    },
  ],
};
