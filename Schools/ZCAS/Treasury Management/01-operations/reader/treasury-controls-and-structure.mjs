/* TM · Lesson 1 Operations · Step 1.3: Keeping treasury honest, and where it sits
 *
 * Source: 06_Introduction to Treasury Management PPTX; Treasury controls.pdf;
 *         build_lesson_1_1_tm.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-01 split (rule S-8). This was one six-section step. Six sections is
 * a climb, and a reader who abandons two thirds of the way through has learned
 * less than one who finishes three shorter steps. Split on the conceptual
 * seams: what treasury is, how the work divides, how it is governed. Coverage
 * is identical; nothing was cut. The first part keeps the original
 * `intro-to-treasury` slug because that URL is already linked to.
 */

export default {
  slug: "treasury-controls-and-structure",
  label: "Controls and structure",
  title: "Keeping treasury honest, and where it sits",
  kicker: "Treasury operations",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "controls",
      heading: "Treasury controls",
      blocks: [
        {
          type: "p",
          text: "Leeson dealt his own trades and then settled them himself. That one fact is the first control on this list, and **its absence is why an £827 million hole stayed invisible for three years.** Treasury moves the largest sums in the business, so [six controls](https://corporatefinanceinstitute.com/resources/accounting/internal-controls/) are non-negotiable. They are cheap on day one and expensive to retrofit after you have hired the person they constrain.",
        },
        {
          type: "table",
          columns: [{ label: "Control" }, { label: "What it requires" }],
          rows: [
            [
              "Segregation of duties",
              "Front office (dealing) separate from back office (confirmation and settlement). No one initiates and confirms their own transactions",
            ],
            [
              "Delegation of authority",
              "High-risk decisions need senior sign-off; routine ones should not",
            ],
            [
              "Limits",
              "Caps on transaction size, type or instrument. Nothing carrying excessive risk of capital loss",
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
          text: "**The six interlock.** Segregation means no single person can complete a fraud alone. [Limits and approvals](https://corporatefinanceinstitute.com/resources/career-map/sell-side/risk-management/financial-controls/) bound what any one decision is allowed to lose. [Audits](https://www.accountingcoach.com/accounts-payable/explanation) catch what slips past both. Automation shrinks the space where human error and temptation operate at all. Naming a control is worth little on its own. **The useful skill is saying which failure each one prevents.** That is how you work out which ones you can survive without while you are still small.",
        },
      ],
      check: {
        question:
          "A dealer executes a trade and then confirms and settles it personally. Which control is being violated?",
        options: [
          "Segregation of duties, since dealing and settlement must sit with different people",
          "Limits, since the trade must have been too large",
          "Internal audit, since auditors should settle trades",
          "Automation, since all settlement should be manual",
        ],
        answer: 0,
        explain:
          "Front office deals; back office confirms and settles. One person doing both can conceal errors or fraud indefinitely, which is exactly how Leeson hid his losses. Size limits and audits are separate controls; this failure is the segregation one.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "centralisation",
      heading: "Centralised, decentralised and hybrid",
      blocks: [
        {
          type: "p",
          text: "The last [structural choice](https://corporatefinanceinstitute.com/resources/accounting/corporate-structure/) is geographic. You face it the first time your business crosses a border. A Zambian [mining group with operations in four countries](https://corporatefinanceinstitute.com/resources/economics/multinational-corporation/) has to decide where treasury actually sits: **one desk in Lusaka, four desks in four capitals, or something between the two.**",
        },
        {
          type: "p",
          text: "The Lusaka desk can see every kwacha and every dollar the group holds at once, negotiate one set of terms across all its banks, and [[net|Offsetting what one part of the group owes against what another is owed, so only the difference is hedged or paid. Two subsidiaries on opposite sides of the same currency cancel each other out for free.]] exposures between subsidiaries before hedging anything. What it cannot see is that a payment out of one of those countries clears on a different cycle, or that a local regulator wants a filing nobody at head office has heard of. **That trade-off, control against local knowledge, is the whole argument.**",
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
              "Regional centres: centralised within regions, decentralised across them",
              "Central control with local knowledge",
              "More complex to set up and manage",
            ],
          ],
        },
        {
          type: "p",
          text: "**The hybrid model keeps winning, and technology is the reason.** A treasury management system lets a subsidiary enter its own data into a platform head office watches in real time. Central oversight, without taking the local team's hands off the wheel. What such a system costs to run is a question this course comes back to.",
        },
      ],
      check: {
        question:
          "A mining group with operations in five countries wants head-office control of cash and risk but keeps losing value to local banking rules its HQ team doesn't know. Which structure fits?",
        options: [
          "Hybrid, since regional centres give central control while capturing local banking knowledge",
          "Fully centralised, since control matters more than local knowledge",
          "Fully decentralised, since each mine should run its own treasury",
          "No treasury at all, outsourcing everything to one bank",
        ],
        answer: 0,
        explain:
          "The group's problem is exactly the trade-off the structures divide on: centralisation for control, decentralisation for local knowledge. The hybrid model exists for cases that need both, at the cost of being more complex to run.",
      },
    },
  ],
};
