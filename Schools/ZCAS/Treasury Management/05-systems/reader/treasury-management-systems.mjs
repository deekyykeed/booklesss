/* TM · Lesson 5 Systems · Step 2a — What a treasury system is, and how it is built
 *
 * Source: 14_Treasury Management Systems PPTX;
 *         build_tm_5_2_treasury-systems.py (PDF). Course capstone — the TMS is
 *         where every earlier step's machinery runs.
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one six-section step. The seam is
 * between what the system IS (what it holds, what it does, how it is built) and
 * what it takes to HAVE one (the position screen, choosing a vendor, what it
 * enforces and what it returns). Coverage is identical; nothing was cut. This
 * part keeps the `treasury-management-systems` slug because that URL exists;
 * the second half is `choosing-and-running-a-tms`.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 *
 * Engagement (D-1): every section opened on a category definition, the worst
 * being the step's own first sentence ("A treasury management system is
 * software that automates…"). Each now opens on something at stake: the
 * treasurer's 08:00 portal crawl and the idle buffer it costs, one deal that
 * has to appear in five places at once, one person with no witnesses.
 * The buried lead was the Barings architecture point, which sat in the middle
 * of §3; it now closes the section, told with its own facts (C-6) rather than
 * pointing at another step.
 *
 * Emphasis and voice (D-2): 0 bold, 0 tappable terms and 0 source links across
 * the original six sections became 13, 6 and 12. Exam framing replaced with
 * founder framing (W-9). 44 em dashes became 0 (W-11).
 */

export default {
  slug: "treasury-management-systems",
  label: "What a treasury system is",
  title: "What a treasury system is, and how it is built",
  kicker: "Systems and clearing",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-a-tms-is",
      heading: "What a TMS is",
      blocks: [
        {
          type: "p",
          text: "At 08:00 the treasurer of a Zambian mining group opens eleven bank portals, one country at a time, and copies the balances into a spreadsheet. By 10:30 the picture is finished, and three of the numbers in it have already moved.",
        },
        {
          type: "p",
          text: "Nobody runs a treasury on a number they do not trust, so the group holds a fifth of its cash as a buffer against the parts of the picture it cannot see. That buffer sits at call rates. **The cost of not knowing where your money is turns up as forgone interest, every single day, and it never appears as a line in anyone's budget.**",
        },
        {
          type: "p",
          text: "A [treasury management system](https://corporatefinanceinstitute.com/resources/accounting/treasury-management/), or TMS, is software that does that morning's work continuously. It pulls balances from your banks, prices from market data providers, and transactions from your accounting system, and holds them in one live picture so you decide on today's facts rather than yesterday's spreadsheet.",
        },
        { type: "h2", text: "Why the accounting system does not cover it" },
        {
          type: "p",
          text: "The obvious objection is that the [company's ERP](https://corporatefinanceinstitute.com/resources/accounting/enterprise-resource-planning-erp/) already records every transaction, so why buy a second system. Because an ERP is built to produce the official books, and the books answer a question about the past.",
        },
        {
          type: "p",
          text: "Treasury asks a different question, and asks it now: how much cash is there across every bank and currency, what is the hedge book worth this morning, how much exposure is sitting with one counterparty. That needs live [[mark-to-market|Revaluing a position at what it would fetch in today's market, rather than what was paid for it. A swap booked in March at a fair value of zero can be worth millions by June, and only a mark tells you which way.]] valuation, [[hedge accounting|The accounting treatment that lets a hedge and the thing it hedges be reported together, so a gain on one does not swing reported profit while the loss on the other sits in a different period.]] and limit checking. **Recording a swap is not the same as marking it against a limit,** and the ERP was never built to do the second.",
        },
      ],
      check: {
        question:
          "A CFO argues the company's ERP makes a TMS redundant, since every transaction is already recorded. What is the counter?",
        options: [
          "The ERP records the accounting ledger after the fact, and treasury needs real-time positions, market values and risk exposure, which the ERP is not built to produce",
          "There is none, because an ERP genuinely replaces a TMS",
          "A TMS is legally required for any company that trades FX",
          "ERPs cannot store financial transactions at all",
        ],
        answer: 0,
        explain:
          "The two systems answer different questions. The ERP answers \"what happened?\" for the official books. The TMS answers \"where is our cash, what are our positions worth, and what risk are we running, right now?\" Recording a swap is not the same as marking it to market against a limit.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "core-functions",
      heading: "The five core functions",
      blocks: [
        {
          type: "p",
          text: "At 09:14 a dealer agrees to sell two million US dollars in March at a rate fixed today. By 09:15 that one action has to be visible in five different places, and in a spreadsheet treasury it gets typed into five of them.",
        },
        {
          type: "p",
          text: "**Enter the deal once, and let the single record feed everything downstream.** That is the whole design, and the five functions below are just that record's life: it is captured, it joins a position, it is measured for risk, it settles, and it is reported.",
        },
        {
          type: "table",
          columns: [{ label: "Function" }, { label: "What it does" }],
          rows: [
            [
              "Deal capture",
              "Every deal, whether a borrowing, an FX sale, a bond purchase or a swap, entered once with full terms: counterparty, amount, rate, maturity, settlement instructions",
            ],
            [
              "Position management",
              "Deals aggregate into positions: total cash by currency and unit, net FX exposure, debt by counterparty and tenor, investments at cost and current value",
            ],
            [
              "Risk analytics",
              "Value at Risk, duration, FX and rate sensitivity, counterparty exposure, computed continuously and compared to policy limits, with alerts on breach",
            ],
            [
              "Settlement and reconciliation",
              "Tracks each deal through clearing to settlement, whether settled, pending or failed, and matches bank confirmations against deal records",
            ],
            [
              "Reporting",
              "Real-time dashboards of cash, portfolio and risk, plus reports for management, board, auditors and regulators",
            ],
          ],
        },
        {
          type: "p",
          text: "Read the table as one deal moving down it rather than as five modules you buy. That is also how you test a vendor's demonstration: book something on the first screen, and ask to see it arrive on the other four without anyone typing.",
        },
      ],
      check: {
        question:
          "In a TMS, a dealer books a swap once and it immediately appears in positions, risk numbers and settlement tracking. What principle is at work?",
        options: [
          "Single entry feeding all downstream processes, the design that removes re-keying and the errors it breeds",
          "Segregation of duties, since one entry means one person controls everything",
          "Netting, since the swap offsets other deals automatically",
          "Straight-through settlement, since booking a deal settles it",
        ],
        answer: 0,
        explain:
          "Deal capture is the root of the system: one authoritative record, consumed by the position, risk, settlement and reporting modules. That is what kills the transposition and version errors of spreadsheet treasury. Booking is not settling, and the settlement module tracks that separately.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "offices",
      heading: "Front, middle and back office",
      blocks: [
        {
          type: "p",
          text: "One person strikes a trade, decides whether it broke a limit, and confirms it with the bank. That is not three jobs done efficiently. It is one job with no witnesses.",
        },
        {
          type: "p",
          text: "A treasury system is built in three parts because a treasury department is, and the split is a [control](https://corporatefinanceinstitute.com/resources/accounting/internal-controls/) rather than an org chart.",
        },
        {
          type: "ul",
          items: [
            "**Front office**, the dealers' screens: pricing tools, comparative quotes, deal booking. Where positions are taken.",
            "**Middle office**, the risk and control layer: monitors positions, calculates risk, checks limits, enforces policy. Large deals can require its approval before they settle.",
            "**Back office**, operations: processes confirmations, reconciles trades to bank statements, manages settlement instructions, chases [[fails|A trade that did not settle when it should have, because cash or securities failed to arrive. Every fail is either an error or the first sign of a counterparty in trouble, so someone has to look at each one.]].",
          ],
        },
        { type: "h2", text: "Why the software enforces it" },
        {
          type: "p",
          text: "[Barings Bank collapsed on 26 February 1995](https://www.fia.org/marketvoice/articles/25-years-ago-barings-offers-hard-lesson-risk-controls) after 233 years, and was sold days later for one pound. A single trader in Singapore had run up losses of around £827 million and hidden them in an account numbered 88888 that nobody else reconciled. He could do it because he dealt the trades and then settled them himself: he was the front office and the back office at once.",
        },
        {
          type: "p",
          text: "Give dealing, risk checking and settlement to three modules with three sets of users and that combination stops being available to anyone. **A control written into a permission is one nobody has to remember to apply.** It is also the cheapest control you will ever buy, because it costs a configuration decision rather than a headcount.",
        },
      ],
      check: {
        question:
          "Why should the user who books deals in the front office module be locked out of the back office's confirmation and settlement functions?",
        options: [
          "It enforces segregation of duties, so no one can both create a deal and confirm its settlement, which is the combination that let the Barings losses stay hidden",
          "Back office screens are too complex for dealers",
          "Licensing costs, since each module is priced per user",
          "It speeds the system up by balancing the load",
        ],
        answer: 0,
        explain:
          "The three-office structure is an old control expressed in software permissions. A dealer who can settle and reconcile their own trades can conceal them, and separated modules with separated users close that path by construction rather than by policy.",
      },
    },
  ],
};
