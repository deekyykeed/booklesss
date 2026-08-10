/* TM · Treasury Controls and Governance · Centralised or Decentralised
 *
 * Split out of treasury-controls-and-structure.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of treasury-controls-and-structure.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "centralised-or-decentralised",
  label: "Centralised or Decentralised",
  title: "Centralised or Decentralised",
  kicker: "Controls and Governance",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "centralisation",
      heading: "Centralised, decentralised and hybrid",
      blocks: [
        {
          type: "p",
          text: "A [Zambian mining group with pits in four countries](https://corporatefinanceinstitute.com/resources/economics/multinational-corporation/) has to decide [where the money is actually managed from](https://treasurytoday.com/banking/organising-a-centralised-treasury/): **one desk in Lusaka, four desks in four capitals, or something between the two.** You face this the first time the business crosses a border.",
        },
        {
          type: "p",
          text: "The Lusaka desk can see every kwacha and every dollar the group holds at once, negotiate one set of terms across all its banks, and [[net|Offsetting what one part of the group owes against what another is owed, so only the difference is hedged or paid. Two subsidiaries on opposite sides of the same currency cancel each other out for free.]] exposures between subsidiaries before hedging anything. What it cannot see is that a payment out of one of those countries clears on a different cycle, or that a local regulator wants a filing nobody at head office has heard of. **That trade-off, control against local knowledge, is the whole argument.**",
        },
        /* Was a 3x4 table (E-9, D-5). Four columns of prose and nothing to line
         * up, so on a 390px phone the last two wrapped a word per line. The
         * marks are three node-and-link diagrams on one axis, where the
         * decisions sit: one centre, many centres, centres inside regions. The
         * advantage and disadvantage columns are now one sentence each inside
         * the card, which is also how the section argues them. */
        {
          type: "cards",
          cards: [
            {
              icon: "oneCentre",
              title: "Centralised",
              lead: "All of it run from head office",
              text: "Stronger controls, economies of scale, lower costs, and tax advantages for a group operating in several countries. What it gives up is local knowledge: the field offices lose their autonomy, and what they know never reaches the desk deciding.",
            },
            {
              icon: "manyCentres",
              title: "Decentralised",
              lead: "Each subsidiary runs its own",
              text: "Local staff know the local banking, the regulator, the language and the customs, and they act on that without asking. What it costs is the same work done several times over in several places.",
            },
            {
              icon: "centresInRegions",
              title: "Hybrid",
              lead: "Regional centres",
              text: "Centralised inside a region and decentralised across them, so the control and the local knowledge sit in the same structure. What it costs is complexity: it is the hardest of the three to set up and to run.",
            },
          ],
        },
        {
          type: "p",
          text: "**The hybrid model keeps winning, and technology is the reason.** [A treasury management system](https://www.jpmorgan.com/insights/treasury/treasury-management/treasury-improved-control) lets a subsidiary enter its own data into a platform head office watches in real time. Central oversight, without taking the local team's hands off the wheel. What such a system costs to run is a question this course comes back to.",
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
