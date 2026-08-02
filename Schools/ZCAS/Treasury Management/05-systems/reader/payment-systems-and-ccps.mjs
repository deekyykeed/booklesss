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
 */

export default {
  slug: "payment-systems-and-ccps",
  label: "Payment systems",
  title: "The systems that carry a payment",
  kicker: "Systems and clearing",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "swift",
      heading: "SWIFT, the messaging layer",
      blocks: [
        {
          type: "p",
          text: "\"The supplier has been paid, the MT103 went out this morning.\" That sentence is wrong, and it is wrong in the way that gets a delivery released against money that never arrives.",
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

    /* ---------------------------------------------------------------- */
    {
      id: "cls-and-dvp",
      heading: "Settling both legs at once",
      blocks: [
        {
          type: "p",
          text: "Pay away your euros at 10:00 and wait for the dollars at 16:00, and you have spent six hours trusting a stranger with the whole amount. In June 1974 a German bank called Herstatt was shut in exactly that gap, having taken in the marks and never delivered the dollars, and its counterparties lost the lot.",
        },
        {
          type: "p",
          text: "CLS Bank exists to remove the six hours. Both banks pre-fund accounts at CLS in their own currencies, and CLS then settles both legs in the same instant, debiting one side's euros as it credits its dollars. **Neither party can ever have paid without being paid.** That principle is payment versus payment, and nearly all major currency flows settle on it now.",
        },
        {
          type: "p",
          text: "Securities have the same problem, where stock can move before cash or cash before stock, and the same cure. **Delivery versus payment** puts a depository between buyer and seller and moves the securities and the money at the same moment, so if either side cannot complete, neither transfer happens.",
        },
        { type: "h2", text: "The idea underneath both" },
        {
          type: "p",
          text: "Both are the [central counterparty](https://corporatefinanceinstitute.com/resources/derivatives/clearing-house/) at work. For every trade the counterparty becomes the buyer to the seller and the seller to the buyer, by [[novation|Legally replacing one contract with two: your trade with the other side is torn up and rewritten as your trade with the clearing house, and theirs with it. It is what lets you stop caring who was on the other end.]], so each side faces one regulated, well-capitalised institution instead of each other. It is protected by daily marking to market, margin collection and a [[default fund|A pot the clearing members pay into, used to absorb the losses if one of them fails and its own margin is not enough. It is why a clearing house can survive a member going under.]]. CLS does this for currencies, houses like LCH for derivatives, and national depositories for securities.",
        },
      ],
      check: {
        question:
          "How exactly does CLS eliminate the risk of paying one currency and never receiving the other?",
        options: [
          "Both pre-funded legs settle simultaneously, which is payment versus payment, so no one can pay out without receiving in the same instant",
          "CLS insures each party against the other's failure",
          "CLS settles everything in dollars, removing the second currency",
          "CLS forces both banks to settle during New York hours only",
        ],
        answer: 0,
        explain:
          "It was a timing gap, and CLS closes the gap rather than insuring it. Settling both legs atomically means the failure case, paid one side and lost the other, cannot occur. Engineering a risk out of the structure is stronger than compensating for it after the fact.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "zambia-systems",
      heading: "Zambia's payment systems, and the operational rules",
      blocks: [
        {
          type: "p",
          text: "Three systems move essentially all the money in this country, and choosing the wrong one costs you either a fee you did not need or a day you did not have. They map straight onto the gross and net designs.",
        },
        {
          type: "table",
          columns: [{ label: "System" }, { label: "Type" }, { label: "Use" }],
          rows: [
            [
              "ZIPSS",
              "Real-time gross settlement",
              "High-value, urgent payments: VAT, securities, large transfers. Pre-funded, immediate finality, no amount limits",
            ],
            [
              "EFT",
              "Deferred net settlement",
              "Routine payments: salaries, utilities, taxes, loan disbursements. Batched daily, credited same day",
            ],
            [
              "CIC",
              "Cheque image clearing",
              "Cheques cleared as scanned images, so T+1 instead of the old T+3",
            ],
          ],
        },
        {
          type: "p",
          text: "So the rule for your own payment run is short. **ZIPSS for urgent and high-value, EFT for the routine payroll-and-suppliers batch,** and cheques only where you have no choice, because even at T+1 they are the slowest and riskiest thing you can hand someone. The Bank of Zambia oversees all three as systemically important.",
        },
        { type: "h2", text: "The two details that catch people out" },
        {
          type: "p",
          text: "**Every system has a cut-off time, and after it your same-day payment is a next-day payment.** It is often around noon. A payment promised for this afternoon and submitted at 14:30 is a broken promise, however real-time the system behind it is, which is why knowing your banks' cut-offs is not an administrative detail.",
        },
        {
          type: "p",
          text: "The second is the daylight overdraft. Your account may run negative during the day against payments going out, provided collections bring it back by close of business. It carries a fee, because the bank is carrying the risk for those hours, and it is the facility that lets a treasury pay out before its receipts land.",
        },
      ],
      check: {
        question:
          "At 14:30 a treasurer submits a large VAT payment due today, and the bank's ZIPSS cut-off was 13:00. What happens?",
        options: [
          "The payment settles tomorrow, because after the cut-off same-day settlement is gone regardless of the system's speed",
          "It settles today anyway, since ZIPSS is real-time",
          "It reroutes automatically through EFT and arrives today",
          "It fails permanently and must be re-keyed next week",
        ],
        answer: 0,
        explain:
          "Real-time settlement operates inside the day's window, and the cut-off is that window's edge. Missing it does not break the payment, it delays finality to the next day and breaks the promise attached to it. That is why the cut-offs belong in your payment calendar rather than in someone's head.",
      },
    },
  ],
};
