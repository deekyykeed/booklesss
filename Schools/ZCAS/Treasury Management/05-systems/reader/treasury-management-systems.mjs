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
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'What a treasury system is, and how it is built'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared, and opened on a question word. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "The System of Record". The other
 * section(s) moved to tms-core-functions.mjs, front-middle-back-office.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "treasury-management-systems",
  label: "The System of Record",
  title: "The System of Record",
  kicker: "Inside a TMS",

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
  ],
};
