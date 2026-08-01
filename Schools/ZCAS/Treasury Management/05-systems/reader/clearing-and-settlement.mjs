/* TM · Lesson 5 Systems · Step 1 — Clearing and settlement systems
 *
 * Source: 13_Clearing and Settlement Systems PPTX;
 *         build_tm_5_1_clearing-settlement.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "clearing-and-settlement",
  label: "Clearing & settlement",
  title: "Clearing and settlement systems",
  kicker: "Systems and clearing",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "clearing-vs-settlement",
      heading: "Clearing against settlement",
      blocks: [
        {
          type: "p",
          text: "Clearing is every step involved in transferring ownership of funds except the last one: validating payment details, matching sender and receiver accounts, preparing the settlement instructions. Settlement is that last step — the moment funds actually move, accounts are debited and credited, and the transaction becomes final and irrevocable.",
        },
        {
          type: "p",
          text: "People use the words interchangeably; treasury cannot, because the difference is where the risk lives. Until settlement completes, either party can fail and leave the other exposed. Everything in this step — the systems, the acronyms, the infrastructure — exists to shrink or eliminate that window.",
        },
        {
          type: "callout",
          text: "Risk exists during clearing and ends at settlement. A payment that has cleared but not settled is a promise, not money.",
        },
      ],
      check: {
        question:
          "A customer's payment instruction has been validated, matched and queued — but the accounts are not yet debited and credited. Has the company been paid?",
        options: [
          "No — the payment has cleared but not settled; until settlement it is a promise that fails if the payer's bank does",
          "Yes — validation makes the payment final",
          "Yes, provided the instruction was sent by SWIFT",
          "It depends on the payment's size",
        ],
        answer: 0,
        explain:
          "Clearing is preparation; settlement is the transfer. The exposure between the two is precisely the settlement risk the rest of this step's systems are built to manage — which is why treasury books nothing as received until it settles.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "herstatt",
      heading: "Settlement risk and Herstatt",
      blocks: [
        {
          type: "p",
          text: "Settlement risk is sharpest in foreign exchange, because an FX deal settles in two countries at two different times. Trade euros for dollars and the euro leg settles in Frankfurt during European hours while the dollar leg waits for New York, six hours behind. Fail in that gap and one party has paid away its currency and will never receive the other side.",
        },
        {
          type: "p",
          text: "The risk carries the name of the bank that proved it. Herstatt Bank, a German lender, collapsed in 1974 after receiving deutsche marks on its FX deals but before delivering the dollars owed back. Counterparties who had irrevocably paid marks got nothing — a one-bank failure that exposed a structural flaw in global payments and set regulators building the safer settlement infrastructure this lesson describes.",
        },
        {
          type: "p",
          text: "Fifty years on, the term is still the working name for cross-currency settlement exposure — and the reason nearly every major FX trade now settles through the CLS system later in this step.",
        },
      ],
      check: {
        question:
          "Why is settlement risk worse in FX than in a domestic payment?",
        options: [
          "The two legs settle in different countries at different times, so one party can pay hours before the other — and fail in between",
          "FX amounts are always larger than domestic ones",
          "Exchange rates can move during settlement",
          "Foreign banks are inherently less trustworthy",
        ],
        answer: 0,
        explain:
          "The time-zone gap is the mechanism: each currency settles in its home system during its own hours, so the legs cannot naturally happen together. Herstatt's counterparties lost principal in exactly that window — a timing exposure, not a size or rate one.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "gross-vs-net",
      heading: "Gross settlement against net",
      blocks: [
        {
          type: "p",
          text: "There are two basic ways to settle a day's payments between banks, and the trade-off between them is risk against cost.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Gross (RTGS)" }, { label: "Net (DNS)" }],
          rows: [
            [
              "How it works",
              "Each payment settled individually, in full, in real time — final immediately",
              "Payments accumulate through the day and offset; only net differences settle at day's end",
            ],
            [
              "Used for",
              "High-value, time-critical payments — securities trades, large corporate transfers",
              "Routine, lower-value payments — payroll, utilities, interbank retail",
            ],
            ["Cost", "High — every transaction settles and is charged", "Low — most flows cancel out"],
            [
              "Liquidity needed",
              "High — funds must be positioned for each payment",
              "Low — only the net moves",
            ],
            [
              "Risk",
              "Low — nothing sits unsettled",
              "Higher — unsettled positions accumulate until day's end",
            ],
          ],
        },
        {
          type: "p",
          text: "The netting arithmetic is what makes DNS cheap: if Bank A owes Bank B ZMW 100 million and Bank B owes Bank A ZMW 80 million, only ZMW 20 million actually moves. But every payment waiting in that net is exposure until the evening run — so the rule follows the amounts. High values must settle gross, where the overnight exposure would be intolerable; low values can wait for the net, where the cost saving outweighs the risk.",
        },
      ],
      check: {
        question:
          "A company must transfer ZMW 45 million to complete a securities purchase today, with finality. Which settlement route, and why?",
        options: [
          "RTGS — a high-value, time-critical payment needs individual, immediate, final settlement",
          "Deferred net settlement — cheaper is always better",
          "A cheque, since paper is legally final",
          "Split it into 45 payments of ZMW 1 million through DNS",
        ],
        answer: 0,
        explain:
          "Size and urgency are the routing rule. A DNS payment isn't final until the evening run — an unacceptable window on ZMW 45 million — and splitting it just multiplies unsettled exposure. RTGS costs more per transaction precisely because it removes that window.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "swift",
      heading: "SWIFT — the messaging layer",
      blocks: [
        {
          type: "p",
          text: "SWIFT — the Society for Worldwide Interbank Financial Telecommunications — is the secure, standardised messaging network banks use to exchange payment instructions. The point to hold onto: SWIFT moves no money. It carries the messages that tell banks to move money through the settlement systems.",
        },
        {
          type: "table",
          columns: [{ label: "Message" }, { label: "Use" }, { label: "Example" }],
          rows: [
            ["MT103", "Customer credit transfer", "A company instructs its bank to pay a supplier"],
            ["MT202", "Bank-to-bank transfer", "Banks settle with each other — the RTGS workhorse"],
            ["MT300", "FX trade confirmation", "Two banks confirm a currency deal's terms"],
            ["MT320", "Securities settlement instruction", "Settling a bond or share trade"],
          ],
        },
        {
          type: "p",
          text: "Large corporates connect to SWIFT directly through their banks — initiating payments, confirming FX deals, instructing securities settlements from their own treasury systems. Smaller firms instruct their bank, which translates into SWIFT messages. Either way the properties are the same: one worldwide format, encryption and digital signatures against fraud, membership covering most banks including all the major Zambian ones, and a timestamped log of every message — the audit trail that settles disputes.",
        },
      ],
      check: {
        question:
          "A treasurer says a supplier \"has been paid — the MT103 went out this morning\". What has actually happened?",
        options: [
          "An instruction has been transmitted — SWIFT carries messages, and the money itself moves only when the payment settles in the banking system",
          "The funds arrived the moment the message was sent",
          "The payment is final because MT103s are irrevocable cash",
          "Nothing — MT103 is only a trade confirmation",
        ],
        answer: 0,
        explain:
          "SWIFT is the messaging layer, not the settlement layer. The MT103 tells the banks what to do; whether value has moved depends on the settlement system behind it and its cut-offs. Treating an instruction as a payment is exactly the confusion the clearing/settlement distinction exists to prevent.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "cls-and-dvp",
      heading: "CLS, PvP and DvP — engineering the risk away",
      blocks: [
        {
          type: "p",
          text: "CLS Bank was created to close the Herstatt gap. It stands in the middle of every FX trade settled through it: both banks pre-fund accounts at CLS in their currencies, and CLS then settles both legs at the same instant — debiting one side's euros and crediting its dollars simultaneously. Neither party can ever have paid without being paid. The principle is payment versus payment (PvP): the exchange happens atomically or not at all. Nearly all major FX flows settle this way now, and a treasurer trading FX should insist on it.",
        },
        {
          type: "p",
          text: "Securities trades have the same timing problem — securities can move before cash, or cash before securities, a failure the market calls a fail — and the same cure. Delivery versus payment (DvP) puts a central securities depository or central counterparty between buyer and seller and transfers the securities and the cash at the same moment; if either side cannot complete, neither transfer happens.",
        },
        {
          type: "p",
          text: "Both are instances of one idea: the central counterparty (CCP). For every trade the CCP becomes the buyer to the seller and the seller to the buyer, so each party faces only the CCP — regulated, well-capitalised, protected by daily mark-to-market, margin collection and a default fund — instead of each other's credit. CLS does it for FX, clearing houses like LCH for derivatives, national depositories for securities.",
        },
      ],
      check: {
        question:
          "How exactly does CLS eliminate Herstatt risk?",
        options: [
          "Both pre-funded legs settle simultaneously — payment versus payment — so no one can pay out without receiving in the same instant",
          "CLS insures each party against the other's failure",
          "CLS settles everything in dollars, removing the second currency",
          "CLS forces both banks to settle during New York hours only",
        ],
        answer: 0,
        explain:
          "Herstatt risk was a timing gap; CLS closes the gap rather than insuring it. Atomic settlement of both legs means the failure scenario — paid one side, lost the other — cannot occur. That is engineering the risk out of the structure, which is stronger than compensating for it.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "zambia-systems",
      heading: "Zambia's payment systems — and the operational rules",
      blocks: [
        {
          type: "p",
          text: "The Bank of Zambia oversees the country's systemically important payment systems, and the three main ones map exactly onto the gross/net distinction.",
        },
        {
          type: "table",
          columns: [{ label: "System" }, { label: "Type" }, { label: "Use" }],
          rows: [
            [
              "ZIPSS",
              "Real-time gross settlement",
              "High-value, urgent payments — VAT, securities, large transfers; pre-funded, immediate finality, no amount limits",
            ],
            [
              "EFT",
              "Deferred net settlement",
              "Routine payments — salaries, utilities, taxes, loan disbursements; batched daily, credited same day",
            ],
            [
              "CIC",
              "Cheque image clearing",
              "Cheques cleared as scanned images (truncation) — T+1 instead of the old T+3",
            ],
          ],
        },
        {
          type: "p",
          text: "The routing rule for a Zambian treasury follows directly: ZIPSS for urgent, high-value payments; EFT for the routine payroll-and-suppliers run; cheques only where unavoidable, since even at T+1 they are the slowest and riskiest instrument. Settlement conventions like T+1 and T+2 are simply the market's agreed clearing time — trades must be validated, matched and routed, which is why securities settle a day or two after dealing, and why your cash from a sale is not spendable the moment you hit sell. Systems penalise fails — the party that doesn't deliver on time pays interest or fines.",
        },
        {
          type: "p",
          text: "Two operational details complete the picture. Every system has a cut-off time: an instruction submitted after it settles the next day, so a payment promised for this afternoon must be submitted before the bank's cut-off — often noon — or the promise is broken. And banks offer daylight overdrafts: an account may swing negative intraday against payments due, provided collections restore it by close of business — a fee-bearing facility, because the bank carries intraday risk while the account is short.",
        },
      ],
      check: {
        question:
          "At 14:30 a treasurer submits a large VAT payment due today; the bank's ZIPSS cut-off was 13:00. What happens?",
        options: [
          "The payment settles tomorrow — after cut-off, same-day settlement is gone regardless of the system's speed",
          "It settles today anyway, since ZIPSS is real-time",
          "It reroutes automatically through EFT and arrives today",
          "It fails permanently and must be re-keyed next week",
        ],
        answer: 0,
        explain:
          "Real-time settlement operates inside the day's window, and the cut-off is the window's edge. Missing it doesn't break the payment — it delays finality to the next day, breaking the promise attached to it. Knowing each system's cut-offs is a core operational treasury duty for exactly this reason.",
      },
    },
  ],
};
