/* TM · Selecting a TMS · Build or Buy
 *
 * Split out of choosing-and-running-a-tms.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of choosing-and-running-a-tms.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "build-or-buy",
  label: "Build or Buy",
  title: "Build or Buy",
  kicker: "Selecting a TMS",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "build-vs-buy",
      heading: "Choosing and implementing one",
      blocks: [
        {
          type: "p",
          text: "You can have a system that fits your company exactly. It costs millions, takes years, needs a standing IT team, and starts ageing the day the market changes. [Almost everyone buys instead](https://corporatefinanceinstitute.com/resources/valuation/enterprise-resource-planning-erp/), from Kyriba, FIS, ION Treasury, SAP's own treasury module, or Temenos on the banking side.",
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
            "How does it integrate with the accounting system, the Zambian banks and the data feeds.",
            "Can workflows be configured without custom code, so a change does not need the vendor.",
            "What is the [[total cost of ownership|Licence plus implementation plus the people who run it, over the years you will actually keep it. A vendor quotes the licence, and the other two are usually the larger number.]], not the licence.",
            "Will the vendor still exist in year ten.",
          ],
        },
        { type: "h2", text: "Where these projects actually fail" },
        {
          type: "ul",
          items: [
            "Data migration. History comes out of spreadsheets, and errors planted now surface for years.",
            "Integration. Every bank connection is its own small project, and this is the work that reliably overruns.",
            "User adoption. A team that lived in Excel resists, and a half-used system produces half-quality data.",
            "Complexity. Most firms use a fraction of the features in year one, and the switched-off parts become a problem when treasury's scope grows.",
          ],
        },
        {
          type: "callout",
          kind: "key",
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
  ],
};
