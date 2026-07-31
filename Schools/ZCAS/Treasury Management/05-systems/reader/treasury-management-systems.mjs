/* TM · Lesson 5 Systems · Step 2 — Treasury management systems
 *
 * Source: 14_Treasury Management Systems PPTX;
 *         build_tm_5_2_treasury-systems.py (PDF). Course capstone — the TMS is
 *         where every earlier step's machinery runs.
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "treasury-management-systems",
  label: "Treasury systems",
  title: "Treasury management systems",
  kicker: "Systems and clearing",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-a-tms-is",
      heading: "What a TMS is",
      blocks: [
        {
          type: "p",
          text: "A treasury management system is software that automates the core functions of a treasury department. It pulls together information from banks, market data providers, the company's ERP and internal reporting, and presents it in real time so treasury can decide with current facts rather than yesterday's spreadsheet.",
        },
        {
          type: "p",
          text: "The natural question is why the ERP doesn't cover this — SAP already tracks every transaction. Because ERPs are built for the whole company's accounting ledger, and treasury's needs are different in kind: real-time cash visibility across many banks and currencies, FX trading and hedge accounting, deal capture and mark-to-market of derivatives, settlement and reconciliation of high-value transactions, counterparty exposure monitoring. A TMS is built for the speed, precision and risk visibility those demand.",
        },
      ],
      check: {
        question:
          "A CFO argues the company's ERP makes a TMS redundant, since every transaction is already recorded. What is the counter?",
        options: [
          "The ERP records the accounting ledger after the fact — treasury needs real-time positions, market values and risk exposure, which the ERP is not built to produce",
          "There is none — an ERP genuinely replaces a TMS",
          "A TMS is legally required for any company that trades FX",
          "ERPs cannot store financial transactions at all",
        ],
        answer: 0,
        explain:
          "The systems answer different questions. The ERP answers \"what happened?\" for the official books; the TMS answers \"where is our cash, what are our positions worth, and what risk are we running — right now?\". Recording a swap is not the same as marking it to market against a limit.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "core-functions",
      heading: "The five core functions",
      blocks: [
        {
          type: "p",
          text: "Everything a TMS does flows from one discipline: a deal is entered once, and that single record feeds every downstream process.",
        },
        {
          type: "table",
          columns: [{ label: "Function" }, { label: "What it does" }],
          rows: [
            [
              "Deal capture",
              "Every deal — a borrowing, an FX sale, a bond purchase, a swap — entered once with full terms: counterparty, amount, rate, maturity, settlement instructions",
            ],
            [
              "Position management",
              "Deals aggregate into positions: total cash by currency and unit, net FX exposure, debt by counterparty and tenor, investments at cost and current value",
            ],
            [
              "Risk analytics",
              "Value at Risk, duration, FX and rate sensitivity, counterparty exposure — computed continuously and compared to policy limits, with alerts on breach",
            ],
            [
              "Settlement & reconciliation",
              "Tracks each deal through clearing to settlement — settled, pending or failed — and matches bank confirmations against deal records",
            ],
            [
              "Reporting",
              "Real-time dashboards of cash, portfolio and risk, plus reports for management, board, auditors and regulators",
            ],
          ],
        },
        {
          type: "p",
          text: "The common thread is speed and accuracy: enter once, use everywhere, and the errors that live between spreadsheets have nowhere to breed.",
        },
      ],
      check: {
        question:
          "In a TMS, a dealer books a swap once and it immediately appears in positions, risk numbers and settlement tracking. What principle is at work?",
        options: [
          "Single entry feeding all downstream processes — the design that removes re-keying and the errors it breeds",
          "Segregation of duties — one entry means one person controls everything",
          "Netting — the swap offsets other deals automatically",
          "Straight-through settlement — booking a deal settles it",
        ],
        answer: 0,
        explain:
          "Deal capture is the root of the system: one authoritative record, consumed by position, risk, settlement and reporting modules. That is what kills the transposition and version errors of spreadsheet treasury. (Booking is not settling — the settlement module tracks that separately.)",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "offices",
      heading: "Front, middle and back office",
      blocks: [
        {
          type: "p",
          text: "A TMS is organised into three functional areas that mirror the treasury department itself — and deliberately so, because the separation is the segregation-of-duties control from the very first step of this course, built into software.",
        },
        {
          type: "ul",
          items: [
            "Front office — the dealers' interface: pricing tools, comparative quotes, deal booking. Where positions are taken.",
            "Middle office — the risk and control layer: monitors positions, calculates risk, checks limits, enforces policy; large deals can require its approval before settling.",
            "Back office — operations: processes confirmations, reconciles trades to bank statements, manages settlement instructions, tracks fails.",
          ],
        },
        {
          type: "p",
          text: "The Barings lesson runs straight through this architecture: Leeson was front, middle and back office in one person. A TMS that gives dealing, risk-checking and settlement to three separate modules with separate users makes that concentration structurally impossible — the control is in the system's shape, not in a policy document.",
        },
      ],
      check: {
        question:
          "Why should the user who books deals in the front office module be locked out of the back office's confirmation and settlement functions?",
        options: [
          "It enforces segregation of duties — no one can both create a deal and confirm its settlement, the combination that let Leeson hide losses",
          "Back office screens are too complex for dealers",
          "Licensing costs — each module is priced per user",
          "It speeds the system up by balancing the load",
        ],
        answer: 0,
        explain:
          "The three-office structure is the course's oldest control expressed in software permissions. A dealer who can settle and reconcile their own trades can conceal them; separated modules with separated users close that path by construction.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "cash-positioning",
      heading: "Cash positioning and connectivity",
      blocks: [
        {
          type: "p",
          text: "The most-used screen in any TMS is the consolidated cash position. A multinational might hold fifty accounts across twenty countries in ten currencies; the system collects live balances from every bank and shows one view — total cash by currency, by bank, unallocated cash free for investment, and the forecast position 10, 30 and 90 days out from expected obligations and collections. Without it, a treasurer compiles the same picture by logging into each portal and pasting numbers into a spreadsheet: hours of work, stale on arrival, wrong somewhere.",
        },
        {
          type: "p",
          text: "The data arrives over four kinds of connection: SWIFT for payment instructions and confirmations (the standard for high-value and international flows), host-to-host direct links between bank and company for fast routine traffic, open banking APIs for balances and payment initiation where banks offer them, and market data feeds — Bloomberg, Reuters — for the rates that mark positions to market and drive the risk numbers.",
        },
        {
          type: "p",
          text: "This screen is where the earlier lessons become operational. The Miller-Orr limits need a live balance to compare against; the investment tranching needs to know what is truly unallocated; the forecast that keeps the overdraft cheap is only as good as the data feeding it. Real-time position is the input all of them share.",
        },
      ],
      check: {
        question:
          "A group treasurer needs to know, by 09:00 daily, how much cash is unallocated and investable across 30 accounts. What does the TMS change about that task?",
        options: [
          "It automates the collection — live feeds consolidate every balance into one position, replacing hours of portal-by-portal compilation that was stale before it was finished",
          "Nothing — someone must still log into each bank",
          "It removes the need to know the position at all",
          "It guarantees the invested cash earns above benchmark",
        ],
        answer: 0,
        explain:
          "The value is timeliness and accuracy of the same information: a position assembled by hand across 30 portals is a morning's work and already out of date, so surplus sits uninvested as buffer. Automated consolidation turns the buffer into investable cash — which is most of a TMS's measurable return.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "build-vs-buy",
      heading: "Choosing and implementing a TMS",
      blocks: [
        {
          type: "p",
          text: "Building a custom TMS fits the company perfectly and costs millions, takes years, needs a standing IT team, and ages as the market moves. Most companies buy: Kyriba, FIS, ION Treasury, SAP TRM (the ERP vendor's own treasury module), Temenos on the banking side. The selection criteria are the questions to ask any vendor: does the scope cover your functions — cash, FX, derivatives, debt, investments, settlement; does it scale with new banks and entities; how does it integrate with your ERP, banks and data feeds; can workflows be configured without custom code; will the team actually use it; what is the total cost of ownership; and is the vendor stable enough to still exist in year ten?",
        },
        {
          type: "p",
          text: "Implementation is where TMS projects earn their reputation. Four challenges recur: data migration (moving history out of spreadsheets, where errors planted now surface for years), integration (every bank connection is its own project, and the work reliably overruns), user adoption (teams that lived in Excel resist, and a half-used TMS produces half-quality data), and complexity (most firms use a fraction of the features in year one — disabling the rest quietly creates problems when treasury's scope grows).",
        },
        {
          type: "callout",
          text: "Budget 30% for software and 70% for implementation — migration, integration, testing, training — and 18–24 months for a full rollout in a complex organisation.",
        },
      ],
      check: {
        question:
          "A company budgets ZMW 3 million for TMS licences and ZMW 500,000 \"for setup\". What does the standard rule of thumb say about this plan?",
        options: [
          "It is inverted — implementation typically costs about twice the software, so migration, integration and training are drastically underfunded",
          "It is correct — software is always the dominant cost",
          "It is too generous — setup should be free from the vendor",
          "It only matters if the company builds rather than buys",
        ],
        answer: 0,
        explain:
          "The 30/70 rule exists because the hard work is not the licence — it is moving the data, wiring every bank, and getting a spreadsheet-native team to live in the system. A project funded 86/14 will stall exactly there, in integration and adoption, where TMS projects always stall.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "policy-and-roi",
      heading: "Policy enforcement, and what the system is worth",
      blocks: [
        {
          type: "p",
          text: "A TMS is also the enforcement mechanism for treasury policy. Rules that live in documents — counterparty caps, tenor limits, currency exposure ceilings, VaR limits, approval thresholds — are built into the system as hard limits, which block a breaching deal outright, or soft limits, which allow it but log it, alert the treasurer and demand approval before the next step. A dealer cannot exceed a counterparty cap that the booking screen refuses.",
        },
        {
          type: "p",
          text: "The business case rests on five quantifiable returns: errors eliminated (one failed or doubled payment can cost more than the licence), cash visibility (precautionary buffers of 20% \"just in case\" shrink toward 5% when the position is trusted, releasing millions), investment returns (surplus seen today is invested today, at term rates instead of call rates), borrowing costs (forecast shortfalls are funded in advance at better rates than emergency ones), and risk prevented (the counterparty blow-up or rogue position that limits stopped never appears in any ledger — which is the point).",
        },
        {
          type: "p",
          text: "And this is where the course closes, because the TMS is where all ten steps meet: the cash position and forecasts of lesson two run on its screens, the hedges of lesson three are captured and marked in its deal blotter, the debt book and investment tranches of lesson four live in its position modules, the settlement flows of this lesson pass through its back office — all inside the controls the very first step demanded. Treasury management is one discipline; the system is where it runs as one machine.",
        },
      ],
      check: {
        question:
          "A dealer attempts a deal that would take a counterparty's exposure past its policy cap, and the TMS refuses to book it. Which enforcement mechanism is that?",
        options: [
          "A hard limit — the system blocks the transaction outright rather than allowing it with warnings",
          "A soft limit — refusal is a kind of warning",
          "Reconciliation — the back office caught the deal",
          "A daylight overdraft — the counterparty's account went negative",
        ],
        answer: 0,
        explain:
          "Hard limits block; soft limits permit-but-escalate. Refusing the booking is the hard form — policy as machinery instead of documentation, which is the strongest control a treasury can run because it does not depend on anyone noticing the breach.",
      },
    },
  ],
};
