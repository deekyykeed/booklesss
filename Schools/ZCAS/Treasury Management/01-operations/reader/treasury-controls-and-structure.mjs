/* TM · Lesson 1 Operations · Step 1.3: Treasury Controls and Governance
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
 *
 * 2026-08-02 opening rewritten (rule W-13), owner: "I don't get that story
 * you've started with." Both sections opened on something the reader could not
 * hold cold. §1 began "Leeson dealt his own trades and then settled them
 * himself" — a name introduced in the PREVIOUS step, and very nearly that
 * step's own bolded punchline repeated without its facts. §2 began "The last
 * structural choice is geographic", where "the last" counted a list this step
 * never made. Both were correct while this was one six-section step; the S-8
 * split left the references pointing at text that is no longer above them.
 * §1 now opens on one person in a Lusaka office paying the suppliers and
 * reconciling the same payments, and reaches Barings second, with the figures
 * carried so it stands on its own. Coverage unchanged: same six controls, same
 * three structures, same checks.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Keeping treasury honest, and where it sits'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 2 sections and now holds one: "Treasury Controls". The other
 * section(s) moved to centralised-or-decentralised.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "treasury-controls-and-structure",
  label: "Treasury Controls",
  title: "Treasury Controls",
  kicker: "Controls and Governance",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "controls",
      heading: "Treasury controls",
      blocks: [
        {
          type: "p",
          text: "A small company in Lusaka has one person who pays the suppliers, and the same person does the [[reconciliation|Checking your own record of what moved against the bank's record of what moved, so anything sitting in one and not the other gets found. It only works as a control when the person doing it is not the person who made the payments.]] at month end. Nothing has gone wrong yet. Nobody else ever looks, so the only thing keeping the money in that account is one employee's honesty.",
        },
        {
          type: "p",
          text: "Barings Bank ran the same loop at a different scale. Nick Leeson struck the trades in Singapore and then confirmed and settled them himself, so there was nobody the hidden losses could be caught by. **£827 million, three years, and a 233-year-old bank sold for one pound.** The hole in it was the hole in the Lusaka office: nobody independent standing between doing the deal and recording it.",
        },
        {
          type: "p",
          text: "Treasury moves the largest sums in the business, so [six controls](https://corporatefinanceinstitute.com/resources/accounting/internal-controls/) are not negotiable. They cost almost nothing to put in on day one, and a great deal to retrofit once you have already hired the person they constrain.",
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
          text: "**The six interlock.** Segregation means no single person can complete a fraud alone. [Limits and approvals](https://corporatefinanceinstitute.com/resources/career-map/sell-side/risk-management/financial-controls/) bound what any one decision is allowed to lose. [Audits](https://www.accountingcoach.com/accounts-payable/explanation) catch what slips past both. [[Straight-through processing|Routing a payment or trade from instruction to settlement with no manual re-keying at any stage. Fewer hands means fewer errors, and fewer chances for someone to alter something on the way through.]] shrinks the space where human error and temptation operate at all. Naming a control is worth little on its own. **The useful skill is saying which failure each one prevents.** That is how you work out which ones you can survive without while you are still small.",
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
  ],
};
