/* TM · Lesson 5 Systems · Step 2b — Choosing a treasury system, and living with it
 *
 * Source: 14_Treasury Management Systems PPTX;
 *         build_tm_5_2_treasury-systems.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `treasury-management-systems`, which was one
 * six-section step. The seam: that part is what the system is, this part is
 * what it takes to have one. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. Every opening was re-read cold. "TMS" is
 * spelled out on first use here, because a reader arriving from the sidebar or
 * a shared link has not read the abbreviation being introduced one step back.
 *
 * 2026-08-02 quality pass (D-1, D-2, D-3). The "five quantifiable returns"
 * sentence ran to 91 words and is now a table; two sections were three long `p`
 * blocks in a row (W-7).
 *
 * 2026-08-02 correction: the closing paragraph said the system is "where all
 * ten steps meet" and enumerated lessons two, three and four. The course has
 * twelve steps since the S-8 split of 2026-08-01 and more since this one, and
 * listing them broke S-6 anyway. The close now names what meets, not which
 * steps.
 */

export default {
  slug: "choosing-and-running-a-tms",
  label: "Choosing and running one",
  title: "Choosing a treasury system, and living with it",
  kicker: "Systems and clearing",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "cash-positioning",
      heading: "Cash positioning and connectivity",
      blocks: [
        {
          type: "p",
          text: "Fifty accounts, twenty countries, ten currencies, and one question the board actually asks: how much cash have we got. The screen that answers it is the most-used thing in any treasury management system.",
        },
        {
          type: "p",
          text: "It shows total cash by currency and by bank, and how much of that is unallocated. It then forecasts the position 10, 30 and 90 days out, from known obligations and expected collections.",
        },
        {
          type: "p",
          text: "**Unallocated is the number that earns you money.** It is the only part that can be committed for a term without risking a shortfall, and it is the number a spreadsheet built across eleven portals is least likely to get right.",
        },
        { type: "h2", text: "Where the numbers come from" },
        {
          type: "ul",
          items: [
            "[SWIFT](https://corporatefinanceinstitute.com/resources/economics/swift/), for payment instructions and confirmations. The standard for high-value and cross-border flows.",
            "[[host-to-host|A direct file link between your systems and one bank's, agreed with that bank and set up once. It carries routine daily traffic faster and more cheaply than a network built for high-value messages.]] links, for the routine daily traffic that does not need a network.",
            "Open banking APIs, for balances and payment initiation where the bank offers them.",
            "Market data feeds such as Bloomberg or Reuters, for the rates that mark positions and drive the risk numbers.",
          ],
        },
        {
          type: "p",
          text: "This screen is where the rest of treasury becomes operational. A [cash forecast](https://treasurytoday.com/cash-management/cash-flow-forecasting/) that keeps your overdraft small is only as good as the balances feeding it, and a control limit you cannot compare a live balance against is a number in a document.",
        },
      ],
      check: {
        question:
          "A group treasurer needs to know, by 09:00 daily, how much cash is unallocated and investable across 30 accounts. What does a treasury system change about that task?",
        options: [
          "It automates the collection, so live feeds consolidate every balance into one position, replacing hours of portal-by-portal compilation that was stale before it was finished",
          "Nothing, because someone must still log into each bank",
          "It removes the need to know the position at all",
          "It guarantees the invested cash earns above benchmark",
        ],
        answer: 0,
        explain:
          "The value is the timeliness and accuracy of the same information. A position assembled by hand across 30 portals is a morning's work and out of date on arrival, so surplus sits uninvested as buffer. Automated consolidation turns that buffer into investable cash, which is most of the measurable return.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "build-vs-buy",
      heading: "Choosing and implementing one",
      blocks: [
        {
          type: "p",
          text: "You can have a system that fits your company exactly. It costs millions, takes years, needs a standing IT team, and starts ageing the day the market changes. Almost everyone buys instead, from Kyriba, FIS, ION Treasury, SAP's own treasury module, or Temenos on the banking side.",
        },
        {
          type: "p",
          text: "The selection criteria are just the questions to put to a vendor, and the useful ones are boring:",
        },
        {
          type: "ul",
          items: [
            "Does the scope cover what you actually do: cash, FX, derivatives, debt, investments, settlement.",
            "Does it scale as banks and entities are added, or is each one a project.",
            "How does it integrate with the accounting system, the banks and the data feeds.",
            "Can workflows be configured without custom code, so a change does not need the vendor.",
            "What is the [[total cost of ownership|Licence plus implementation plus the people who run it, over the years you will actually keep it. A vendor quotes the licence, and the other two are usually the larger number.]], not the licence.",
            "Will the vendor still exist in year ten.",
          ],
        },
        { type: "h2", text: "Where these projects actually fail" },
        {
          type: "ul",
          items: [
            "**Data migration.** History comes out of spreadsheets, and errors planted now surface for years.",
            "**Integration.** Every bank connection is its own small project, and this is the work that reliably overruns.",
            "**User adoption.** A team that lived in Excel resists, and a half-used system produces half-quality data.",
            "**Complexity.** Most firms use a fraction of the features in year one, and the switched-off parts become a problem when treasury's scope grows.",
          ],
        },
        {
          type: "callout",
          text: "Budget **30% for software and 70% for implementation**, meaning migration, integration, testing and training, and 18 to 24 months for a full rollout in a complex group.",
        },
      ],
      check: {
        question:
          "A company budgets ZMW 3 million for treasury system licences and ZMW 500,000 \"for setup\". What does the standard rule of thumb say about this plan?",
        options: [
          "It is inverted, because implementation typically costs about twice the software, so migration, integration and training are drastically underfunded",
          "It is correct, because software is always the dominant cost",
          "It is too generous, because setup should be free from the vendor",
          "It only matters if the company builds rather than buys",
        ],
        answer: 0,
        explain:
          "The 30/70 rule exists because the hard work is not the licence. It is moving the data, wiring every bank, and getting a spreadsheet-native team to live in the system. A project funded 86/14 stalls exactly there, in integration and adoption.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "policy-and-roi",
      heading: "Policy enforcement, and what the system is worth",
      blocks: [
        {
          type: "p",
          text: "A counterparty cap written in a policy document has never once stopped a deal. The same cap typed into the booking screen stops every one of them.",
        },
        {
          type: "p",
          text: "Limits go in at two strengths. A **hard limit** blocks a breaching deal outright: the screen refuses to book it. A **soft limit** lets the deal through, logs it, alerts the treasurer and demands approval before the next step. Which strength each rule gets is a real decision, because a policy made entirely of hard limits will eventually block something the business genuinely needed.",
        },
        { type: "h2", text: "What it is worth" },
        {
          type: "p",
          text: "Five returns are quantifiable enough to put in a business case, and the last one is the one nobody gets credit for.",
        },
        {
          type: "table",
          columns: [{ label: "Return" }, { label: "Where the money comes from" }],
          rows: [
            [
              "Errors eliminated",
              "One failed or doubled payment can cost more than the licence",
            ],
            [
              "Cash visibility",
              "A precautionary buffer of 20% shrinks toward 5% once the position is trusted",
            ],
            [
              "Investment returns",
              "Surplus seen today is invested today, at term rates instead of call rates",
            ],
            [
              "Borrowing costs",
              "A shortfall forecast in advance is funded at better rates than an emergency one",
            ],
            [
              "Risk prevented",
              "The blow-up a limit stopped never appears in any ledger, which is exactly the point",
            ],
          ],
        },
        {
          type: "p",
          text: "**The system is where the whole discipline stops being separate subjects.** Your forecast, the hedges, the debt book and the settlement flows all run on one record, inside the same controls, and the reason to care is not tidiness. It is that a treasury holding one version of the truth can be run by a small team, and a treasury holding six cannot be run safely at all.",
        },
      ],
      check: {
        question:
          "A dealer attempts a deal that would take a counterparty's exposure past its policy cap, and the system refuses to book it. Which enforcement mechanism is that?",
        options: [
          "A hard limit, because the system blocks the transaction outright rather than allowing it with warnings",
          "A soft limit, because a refusal is a kind of warning",
          "Reconciliation, because the back office caught the deal",
          "A daylight overdraft, because the counterparty's account went negative",
        ],
        answer: 0,
        explain:
          "Hard limits block, and soft limits permit but escalate. Refusing the booking is the hard form: policy as machinery instead of documentation, which is the strongest control a treasury can run because it does not depend on anyone noticing the breach.",
      },
    },
  ],
};
