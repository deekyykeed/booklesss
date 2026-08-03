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
 */

export default {
  slug: "clearing-and-settlement",
  label: "Clearing and settlement",
  title: "Clearing, settlement, and the risk in between",
  kicker: "Systems and clearing",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "clearing-vs-settlement",
      heading: "Clearing against settlement",
      blocks: [
        {
          type: "p",
          text: "Your customer's bank confirms the payment went out at 09:40. Your account shows nothing. Both of those are true at the same time, and until one more thing happens, **you have not been paid.**",
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

    /* ---------------------------------------------------------------- */
    {
      id: "herstatt",
      heading: "Settlement risk and Herstatt",
      blocks: [
        {
          type: "p",
          text: "On 26 June 1974 the German authorities withdrew the banking licence of Bankhaus Herstatt and shut it at the end of the Frankfurt business day. Banks around the world had already paid Herstatt their deutsche marks that morning. **New York was still open, the dollars owed back were never delivered, and the counterparties lost the entire principal.** Fifty years later the risk still carries the bank's name.",
        },
        { type: "h2", text: "What the failure actually was" },
        {
          type: "p",
          text: "[Settlement risk](https://www.bis.org/cpmi/publ/d00b.htm) is the risk that you deliver your side of a deal and never receive the other. It is sharpest in foreign exchange, because **an FX deal settles in two countries at two different times.** Trade euros for dollars and the euro leg settles in Frankfurt during European hours while the dollar leg waits for New York, six hours behind.",
        },
        {
          type: "p",
          text: "Note what kind of loss that is. This is not a rate moving against you by a few percent. It is [[principal risk|Losing the whole amount rather than a change in its value. A currency move costs you part of a trade; a settlement failure costs you all of the leg you already paid away.]], the full amount you paid away, and it is why the systems in the next step were built rather than merely improved.",
        },
      ],
      check: {
        question:
          "Why is settlement risk worse in FX than in a domestic payment?",
        options: [
          "The two legs settle in different countries at different times, so one party can pay hours before the other and fail in between",
          "FX amounts are always larger than domestic ones",
          "Exchange rates can move during settlement",
          "Foreign banks are inherently less trustworthy",
        ],
        answer: 0,
        explain:
          "The time-zone gap is the mechanism. Each currency settles in its home system during its own hours, so the legs cannot naturally happen together. Herstatt's counterparties lost principal in exactly that window, which is a timing exposure rather than a size or rate one.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "gross-vs-net",
      heading: "Gross settlement against net",
      blocks: [
        {
          type: "p",
          text: "Bank A owes Bank B ZMW 100 million today, and Bank B owes Bank A ZMW 80 million. Settle each payment as it arrives and ZMW 180 million has to move. Wait until the evening and [net them](https://corporatefinanceinstitute.com/resources/economics/netting/), and **ZMW 20 million moves instead.**",
        },
        {
          type: "p",
          text: "That saving is the entire case for net settlement, and the cost of it is that every payment sitting in the net is unsettled exposure until the evening run. So there are two designs, and the choice between them is risk against cost.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Gross (RTGS)" }, { label: "Net (DNS)" }],
          rows: [
            [
              "How it works",
              "Each payment settled individually, in full, in real time, and final immediately",
              "Payments accumulate through the day and offset; only net differences settle at day's end",
            ],
            [
              "Used for",
              "High-value, time-critical payments: securities trades, large corporate transfers",
              "Routine, lower-value payments: payroll, utilities, interbank retail",
            ],
            ["Cost", "High, since every transaction settles and is charged", "Low, since most flows cancel out"],
            [
              "Liquidity needed",
              "High, because funds must be positioned for each payment",
              "Low, because only the net moves",
            ],
            [
              "Risk",
              "Low, since nothing sits unsettled",
              "Higher, since unsettled positions accumulate until day's end",
            ],
          ],
        },
        {
          type: "p",
          text: "**The routing rule follows the amount, not the preference.** High values settle gross, because a day of unsettled exposure on them would be intolerable. Low values wait for the net, because there the saved cost and saved [[intraday liquidity|The cash a bank has to have sitting available during the day to make each payment as it goes out. Real-time settlement is expensive partly because it forces every bank to hold more of it.]] are worth more than the risk.",
        },
      ],
      check: {
        question:
          "A company must transfer ZMW 45 million to complete a securities purchase today, with finality. Which settlement route, and why?",
        options: [
          "RTGS, because a high-value, time-critical payment needs individual, immediate, final settlement",
          "Deferred net settlement, because cheaper is always better",
          "A cheque, since paper is legally final",
          "Split it into 45 payments of ZMW 1 million through DNS",
        ],
        answer: 0,
        explain:
          "Size and urgency are the routing rule. A DNS payment is not final until the evening run, which is an unacceptable window on ZMW 45 million, and splitting it only multiplies unsettled exposure. RTGS costs more per transaction precisely because it removes that window.",
      },
    },
  ],
};
