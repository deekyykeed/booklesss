/* TM · Lesson 2 Working capital · Step 1b — Getting the cash in
 *
 * Source: 07_Working Capital_Liquidity Management PPTX 1;
 *         build_tm_2_1_working-capital.py (PDF). Worked figures kept at the
 *         lecture's originals (2/10 net 30; Mutengo Plc factoring).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `working-capital-and-liquidity`, which was
 * one five-section step. That part sizes the working capital; this part is the
 * receivables half of it. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. The discount section's 37.23% figure was the
 * buried lead of the original step, sitting four paragraphs into §4. It opens
 * this step now, because a number that surprising is what makes a reader
 * believe the arithmetic is worth following.
 *
 * 2026-08-03 — the opening was rewritten, twice wrong. Owner reading it live:
 * "there is no hook, it looks like you jump straight into explaining the step
 * … i dont even know what 2/10 means in this context."
 *
 *   1. It opened on **notation nobody had been given** — `Terms of "2/10 net 30"
 *      look like a small courtesy` — and the notation was not explained until
 *      four blocks later. That is W-13's first ban, and W-5.
 *   2. Worse, it opened **facing the wrong way**. This step is about money owed
 *      TO you, and the first sentence was about a discount YOU take from YOUR
 *      supplier. The reader had to turn the whole thing round before the third
 *      paragraph told them which side they were on.
 *
 * It now opens on one customer, one invoice and one number, names the notation
 * in the sentence that first uses it, and keeps the 37% as the payoff rather
 * than the premise. NOTE FOR SCANNERS: `2/10 net 30` contains a digit, so the
 * old opening passed the C-5 anchor check while being unreadable. A measurement
 * is not a reading.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). The check re-asked the
 * section's own worked case at the SAME figures (2/10 net 30 against 8%), with
 * the 37.23% printed in the paragraph above it and again in the winning
 * option. Numeric options were hiding a recall question. It now hands over
 * 1.5/15 net 60 against a 20% overdraft, which is deliberately a case where
 * the answer REVERSES: 12.35% is cheaper than the overdraft, so the discount
 * is declined. A second case at the same figures teaches a verdict; a second
 * case that comes out the other way teaches the method.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Getting the cash in'.
 * The old name was sentence case and ended on a bare particle. The slug is
 * untouched, so no URL moved.
 */

export default {
  slug: "debtors-and-factoring",
  label: "Debtors and Factoring",
  title: "Debtors and Factoring",
  kicker: "Working Capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "debtor-management",
      heading: "Debtor management and cash discounts",
      blocks: [
        {
          type: "p",
          text: "A customer owes you ZMW 120,000 and will pay on day 30. You can have the money on day 10 instead, if you take ZMW 2,400 off the bill. Twenty days earlier, for two per cent.",
        },
        {
          type: "p",
          text: "Written down, that offer is \"2/10 net 30\": two per cent off if the invoice is settled inside ten days, the full amount by day thirty. It reads like a small courtesy. **Priced as what it actually is, a loan, those twenty days are worth over 37% a year.**",
        },
        {
          type: "p",
          text: "Selling on credit means waiting to be paid, and waiting costs money. This section is about the side of that where you set the terms: how much credit to give, to whom, and what to offer for early payment. The aim is the terms that make the most profit, **not the fewest days outstanding.** A business with no bad debts is usually a business turning away good customers.",
        },
        { type: "h2", text: "Knowing who deserves credit" },
        {
          type: "p",
          text: "Before the terms, the decision. The Zambian sources are bank references, trade references from a customer's existing suppliers, published [accounts](https://corporatefinanceinstitute.com/resources/accounting/accounts-receivable/), the [[Credit Reference Bureau|The national register of borrowing and repayment behaviour that lenders report into. It is the only place you can see what a customer owes people who are not you.]]'s cross-bank borrowing data, and for anyone you already trade with, your own [[sales ledger|The record of who owes you what and since when. For an existing customer it is better evidence than any reference, because it is about how they treat you specifically.]].",
        },
        { type: "h2", text: "Pricing early payment" },
        {
          type: "p",
          text: "You have seen that offer from the side that makes it. The customer receiving it sees something else: a choice between paying early at a discount or keeping the cash twenty days longer. That is a borrowing decision, and it has a formula that prices the same twenty days from either side of the invoice.",
        },
        {
          type: "formula",
          text: "Cost of not taking the discount = [D ÷ (100 − D)] × [365 ÷ (N − T)]",
          where: [
            "D = discount percentage",
            "N = net period, the days until full payment is due",
            "T = discount period, the days within which the discount applies",
          ],
        },
        {
          type: "p",
          text: "On 2/10 net 30 with short-term borrowing at 8%: the cost of forgoing the discount is [2 ÷ 98] × [365 ÷ 20] = 0.0204 × 18.25 = 37.23% a year. Paying on day 30 instead of day 10 is borrowing from your supplier at 37.23%, so the answer is to borrow from the bank at 8% and take the discount.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Always price the annual cost of forgoing a discount against your cost of short-term borrowing. If borrowing is cheaper, take the discount. **37.23% against 8% is not a close call.**",
        },
        {
          type: "callout",
          kind: "example",
          text: "Price a different offer before you read on, because they do not all come out the same way. A supplier offers 1.5/15 net 60 and your overdraft costs 20% a year. Work the annual cost of letting the discount go, then say what you would do. The formula punishes two habits: the discount comes off what you actually pay, not off 100, and the days you are buying are the ones *between* the two dates.",
        },
      ],
      check: {
        question:
          "What does forgoing a 1.5/15 net 60 discount cost, on an annual basis?",
        options: [
          "About 12.35%",
          "About 12.17%",
          "About 9.26%",
          "About 1.52%",
        ],
        answer: 0,
        explain:
          "[1.5 ÷ 98.5] × [365 ÷ 45] = 0.015228 × 8.111 = **12.35%** a year. And notice where that leaves you: 12.35% is CHEAPER than the 20% overdraft, so here you keep the 45 days and let the discount go. That is the opposite of the 2/10 net 30 answer above. The formula decides it, not the reflex. About 12.17% divides by 100 instead of by the 98.5 you would actually pay, which flatters every discount slightly. About 9.26% uses the 60-day net period instead of the 45 days of credit being bought. About 1.52% never annualises, and would have you turn down free money.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "factoring",
      heading: "Factoring and invoice discounting",
      blocks: [
        {
          type: "p",
          text: "You can sell your invoices, or you can borrow against them without the customers ever knowing. **The difference between those two is not the money.** It is who deals with the customers afterwards.",
        },
        {
          type: "p",
          text: "A [factor](https://corporatefinanceinstitute.com/resources/commercial-lending/accounts-receivable-factoring/) takes over the sales ledger: it advances a percentage of invoice value straight away, typically 80 to 85%, and pays the rest less its fees once the customer settles. A full-service factor also assesses the customers' credit and chases the overdue ones. Under [[non-recourse|The factor takes the loss if the customer never pays. Under recourse factoring that loss comes back to you, which is why recourse is cheaper and why the word is worth finding in the contract.]] factoring the factor carries the bad-debt risk; with recourse, you still do.",
        },
        {
          type: "p",
          text: "The lecture prices it. Mutengo Plc invoices ZMW 300,000 a month on an average 2.5-month credit period. The factor charges a 2.5% service fee, advances 85% of invoices at 13% a year, and saves Mutengo ZMW 95,000 a year in administration. The alternative is an overdraft at 12.5% on the same funding.",
        },
        {
          type: "table",
          columns: [{ label: "Item" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Annual sales (300,000 × 12)", "3,600,000"],
            ["Service fee, 2.5% × 3,600,000", "90,000"],
            ["Interest, (2.5 ÷ 12) × 3,600,000 × 85% × 13%", "82,875"],
            ["Total factoring cost", "172,875"],
            ["Less: administration savings", "(95,000)"],
          ],
          subtotals: [3],
          total: ["Net cost of factoring", "77,875"],
          note: "The overdraft alternative, 12.5% on the ZMW 637,500 advanced, would cost ZMW 79,688. So factoring saves roughly ZMW 1,800 a year and removes the sales ledger workload entirely.",
        },
        {
          type: "p",
          text: "**Read that ZMW 1,800 carefully, because it is almost nothing.** On the money alone the two options are a coin toss, and what actually decides it is the administration Mutengo stops doing. Invoice discounting gives the same finance without handing over the ledger: your customers never know a third party is involved, it costs less, and the relationship stays entirely yours.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Factoring" }, { label: "Invoice discounting" }],
          rows: [
            ["Sales ledger", "Factor manages it", "Company manages it"],
            ["Customer awareness", "Customers know", "Customers do not know"],
            ["Cost", "Higher", "Lower"],
            ["Best for", "Full outsourcing", "Finance only"],
            ["Credit risk (non-recourse)", "Factor absorbs", "Company retains"],
          ],
        },
        {
          type: "p",
          text: "So the choice is really about what you are buying: **finance on its own, or finance plus somebody else running the credit function.** If the ledger is already well run and the customers are relationships worth keeping, factoring is the higher price for a service you have.",
        },
      ],
      check: {
        question:
          "A company wants cash against its invoices but insists its customers must never deal with, or know about, a third party. Which product fits?",
        options: [
          "Invoice discounting: finance against the ledger while the company keeps managing it, invisibly to customers",
          "Non-recourse factoring, because the factor absorbs risk invisibly",
          "Recourse factoring, because recourse means customers are not told",
          "An overdraft secured on inventory",
        ],
        answer: 0,
        explain:
          "Customer visibility is the dividing line. A factor takes over the ledger and deals with customers directly, while invoice discounting leaves collection with the company so customers see nothing. Recourse describes who bears the bad-debt risk, not who the customers deal with.",
      },
    },
  ],
};
