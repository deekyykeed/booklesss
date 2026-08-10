/* TM · Selecting a TMS · Policy Enforcement and ROI
 *
 * Split out of choosing-and-running-a-tms.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of choosing-and-running-a-tms.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "tms-policy-and-roi",
  label: "Policy Enforcement and ROI",
  title: "Policy Enforcement and ROI",
  kicker: "Selecting a TMS",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "policy-and-roi",
      heading: "Policy enforcement, and what the system is worth",
      blocks: [
        {
          type: "p",
          text: "A ZMW 20 million counterparty cap written in a policy document has never once stopped a deal. The same cap [typed into the booking screen](https://corporatefinanceinstitute.com/resources/accounting/internal-controls/) stops every one of them, at 16:52 on a Friday, without asking anyone's permission.",
        },
        {
          type: "p",
          text: "Limits go in at two strengths. A **hard limit** blocks a breaching deal outright: the screen refuses to book it. A **soft limit** lets the deal through, logs it, alerts the treasurer and demands approval before the next step. Which strength each rule gets is a real decision, because a policy made entirely of hard limits will eventually block something the business genuinely needed.",
        },
        { type: "h2", text: "What it is worth" },
        {
          type: "p",
          text: "Five returns are quantifiable enough to put in a [[business case|The document that argues a system is worth buying, in money rather than in features. It is what a finance director approves, so a benefit you cannot put a number against will not survive the meeting.]], and the last one is the one nobody gets credit for.",
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
