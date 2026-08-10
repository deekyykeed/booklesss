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
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Choosing a treasury system, and living with it'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared, and ended on a bare particle. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "Cash Positioning and Connectivity". The other
 * section(s) moved to build-or-buy.mjs, tms-policy-and-roi.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "choosing-and-running-a-tms",
  label: "Cash Positioning",
  title: "Cash Positioning and Connectivity",
  kicker: "Selecting a TMS",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "cash-positioning",
      heading: "Cash positioning and connectivity",
      blocks: [
        {
          type: "p",
          text: "Fifty accounts, twenty countries, ten currencies, a head office in Lusaka, and one question the board actually asks: how much cash have we got. The screen that answers it is the most-used thing in any treasury management system.",
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
  ],
};
