/* TM · Inside a TMS · Front, Middle and Back Office
 *
 * Split out of treasury-management-systems.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of treasury-management-systems.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "front-middle-back-office",
  label: "Front, Middle and Back Office",
  title: "Front, Middle and Back Office",
  kicker: "Inside a TMS",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "offices",
      heading: "Front, middle and back office",
      blocks: [
        {
          type: "p",
          text: "One person strikes a kwacha-dollar trade, decides whether it broke a limit, and confirms it with the bank. That is not three jobs done efficiently. It is one job with no witnesses.",
        },
        {
          type: "p",
          text: "A treasury system is built in three parts because a treasury department is, and the split is a [control](https://corporatefinanceinstitute.com/resources/accounting/internal-controls/) rather than an org chart.",
        },
        {
          type: "ul",
          items: [
            "Front office, the dealers' screens: pricing tools, comparative quotes, deal booking. Where positions are taken.",
            "Middle office, the risk and control layer: monitors positions, calculates risk, checks limits, enforces policy. Large deals can require its approval before they settle.",
            "Back office, operations: processes confirmations, reconciles trades to bank statements, manages settlement instructions, chases [[fails|A trade that did not settle when it should have, because cash or securities failed to arrive. Every fail is either an error or the first sign of a counterparty in trouble, so someone has to look at each one.]].",
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
