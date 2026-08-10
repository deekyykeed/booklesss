/* TM · Lesson 5 Systems · Step 1b — The systems that carry a payment
 *
 * Source: 13_Clearing and Settlement Systems PPTX;
 *         build_tm_5_1_clearing-settlement.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `clearing-and-settlement`, which was one
 * six-section step. That part is the risk; this part is the plumbing built to
 * remove it. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. The CLS section opened "CLS Bank was created
 * to close the Herstatt gap", leaning on a 1974 bank failure told in the other
 * half. A reader arriving from the sidebar or a shared link has never met it.
 * The section now opens on the six hours of trust itself and names Herstatt
 * afterwards, with enough of the facts to stand alone.
 *
 * The heading "SWIFT — the messaging layer" carried an em dash (W-11), as did
 * "CLS, PvP and DvP — engineering the risk away" and "Zambia's payment systems
 * — and the operational rules". All three are rewritten.
 *
 * 2026-08-02 C-7: §3 was written with a Bank of Zambia link
 * (boz.zm/national-payment-systems.htm, live and verified) and it has been
 * removed. `gen-favicons.mjs` caps a mark at 12 KB and the bank publishes only
 * a 15.4 KB multi-size .ico, so no chip renders, and a source with no chip is a
 * source the reader cannot reach. Restore the link if the generator ever learns
 * to downscale an .ico; the URL is good.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'The systems that carry a payment'.
 * The old name was sentence case and did not name the topic the way the paper does. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "SWIFT, the Messaging Layer". The other
 * section(s) moved to cls-and-dvp.mjs, zambias-payment-systems.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "payment-systems-and-ccps",
  label: "SWIFT, the Messaging Layer",
  title: "SWIFT, the Messaging Layer",
  kicker: "Payment Systems",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "swift",
      heading: "SWIFT, the messaging layer",
      blocks: [
        {
          type: "p",
          text: "\"The supplier has been paid, the [[MT103|SWIFT's customer credit transfer message: the instruction one bank sends another to pay. It is an instruction to move money, not the money itself.]] went out this morning.\" That sentence is wrong, and it is wrong in the way that gets a delivery released against money that never arrives.",
        },
        {
          type: "p",
          text: "[SWIFT](https://corporatefinanceinstitute.com/resources/economics/swift/), the Society for Worldwide Interbank Financial Telecommunications, is the secure standardised network banks use to exchange payment instructions. **SWIFT moves no money.** It carries the messages that tell banks to move money through the settlement systems, and a sent message is an instruction rather than a transfer.",
        },
        {
          type: "table",
          columns: [{ label: "Message" }, { label: "Use" }, { label: "Example" }],
          rows: [
            ["MT103", "Customer credit transfer", "A company instructs its bank to pay a supplier"],
            ["MT202", "Bank-to-bank transfer", "Banks settle with each other, the RTGS workhorse"],
            ["MT300", "FX trade confirmation", "Two banks confirm a currency deal's terms"],
            ["MT320", "Securities settlement instruction", "Settling a bond or share trade"],
          ],
        },
        {
          type: "p",
          text: "If you run enough volume you can connect through your banks and instruct payments, confirm FX deals and settle securities straight out of your own treasury system. Below that scale you instruct the bank and it writes the messages.",
        },
        {
          type: "p",
          text: "Either way you get the same four things: one worldwide format, encryption and digital signatures against fraud, membership covering all the major Zambian banks, and a timestamped log of every message. **That log is what settles a dispute about who told whom to do what,** and it is the reason nobody argues about payment instructions the way they argue about emails.",
        },
      ],
      check: {
        question:
          "A treasurer says a supplier \"has been paid, the MT103 went out this morning\". What has actually happened?",
        options: [
          "An instruction has been transmitted, because SWIFT carries messages and the money itself moves only when the payment settles in the banking system",
          "The funds arrived the moment the message was sent",
          "The payment is final because MT103s are irrevocable cash",
          "Nothing, because MT103 is only a trade confirmation",
        ],
        answer: 0,
        explain:
          "SWIFT is the messaging layer, not the settlement layer. The MT103 tells the banks what to do, and whether value has moved depends on the settlement system behind it and its cut-offs. Treating an instruction as a payment is exactly the confusion the clearing and settlement distinction exists to prevent.",
      },
    },
  ],
};
