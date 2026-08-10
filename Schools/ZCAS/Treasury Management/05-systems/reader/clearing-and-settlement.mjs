/* TM · Lesson 5 Systems · Step 1a — Clearing, settlement, and the risk in between
 *
 * Source: 13_Clearing and Settlement Systems PPTX;
 *         build_tm_5_1_clearing-settlement.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one six-section step. The seam is
 * between the risk (what clearing and settlement are, why the gap between them
 * is dangerous, and the two designs for closing a day's payments) and the
 * plumbing that carries it (SWIFT, central counterparties, Zambia's systems).
 * Coverage is identical; nothing was cut. This part keeps the
 * `clearing-and-settlement` slug; the second half is `payment-systems-and-ccps`.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 *
 * Engagement (D-1): Herstatt was the buried lead. It was the second paragraph
 * of §2, behind a definition of settlement risk, and it is the one thing in the
 * step a reader will still have in an exam hall. It now opens that section with
 * its date and what actually happened (C-6), and the definition follows it.
 * §3's netting arithmetic was the last sentence of the section and is now the
 * first, because the 180-against-20 figure is what makes the trade-off land.
 *
 * Emphasis (D-2): 0 bold, 0 tappable terms and 0 source links across the
 * original six sections became 12, 7 and 9. 52 em dashes became 0 (W-11).
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Clearing, settlement, and the risk in between'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "Clearing Against Settlement". The other
 * section(s) moved to herstatt.mjs, gross-and-net-settlement.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "clearing-and-settlement",
  label: "Clearing Against Settlement",
  title: "Clearing Against Settlement",
  kicker: "Clearing and Settlement",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "clearing-vs-settlement",
      heading: "Clearing against settlement",
      blocks: [
        {
          type: "p",
          text: "Your customer's bank in Ndola confirms the payment went out at 09:40. Your account shows nothing. Both of those are true at the same time, and until one more thing happens, **you have not been paid.**",
        },
        {
          type: "p",
          text: "[Clearing](https://corporatefinanceinstitute.com/resources/economics/clearing-house/) is every step in transferring money except the last one: validating the payment details, matching sender and receiver accounts, preparing the settlement instructions. Settlement is that last step, when funds actually move, accounts are debited and credited, and the transaction reaches [[finality|The point after which a payment cannot be reversed, even if the payer goes under an hour later. Before it, what you hold is a claim on somebody; after it, you hold money.]].",
        },
        {
          type: "p",
          text: "People use the two words interchangeably. **You cannot, because the difference is where the risk lives.** Until settlement completes, either side can fail and leave the other holding nothing, and every system in this lesson exists to shrink that window or close it.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Risk exists during clearing and ends at settlement. **A payment that has cleared but not settled is a promise, not money.**",
        },
      ],
      check: {
        question:
          "A customer's payment instruction has been validated, matched and queued, but the accounts are not yet debited and credited. Has the company been paid?",
        options: [
          "No, because the payment has cleared but not settled, and until settlement it is a promise that fails if the payer's bank does",
          "Yes, because validation makes the payment final",
          "Yes, provided the instruction was sent by SWIFT",
          "It depends on the payment's size",
        ],
        answer: 0,
        explain:
          "Clearing is preparation and settlement is the transfer. The exposure between the two is precisely the settlement risk the rest of this lesson's systems are built to manage, which is why treasury books nothing as received until it settles.",
      },
    },
  ],
};
