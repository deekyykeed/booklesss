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
 */

export default {
  slug: "debtors-and-factoring",
  label: "Getting the cash in",
  title: "Getting the cash in",
  kicker: "Working capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "debtor-management",
      heading: "Debtor management and cash discounts",
      blocks: [
        {
          type: "p",
          text: "Terms of \"2/10 net 30\" look like a small courtesy from a supplier. **Turning the discount down is borrowing from them at over 37% a year,** and almost nobody who does it knows that is what they did.",
        },
        {
          type: "p",
          text: "Credit runs in both directions, and this section is about the side where you set the terms. Extending credit to a customer ties up cash, so the target is the level of credit and the discount terms that make the most profit, **not the fewest days outstanding.** A business with no bad debts is usually a business turning away good customers.",
        },
        { type: "h2", text: "Knowing who deserves credit" },
        {
          type: "p",
          text: "Before the terms, the decision. The Zambian sources are bank references, trade references from a customer's existing suppliers, published [accounts](https://corporatefinanceinstitute.com/resources/accounting/accounts-receivable/), the [[Credit Reference Bureau|The national register of borrowing and repayment behaviour that lenders report into. It is the only place you can see what a customer owes people who are not you.]]'s cross-bank borrowing data, and for anyone you already trade with, your own [[sales ledger|The record of who owes you what and since when. For an existing customer it is better evidence than any reference, because it is about how they treat you specifically.]].",
        },
        { type: "h2", text: "Pricing early payment" },
        {
          type: "p",
          text: "Discount terms put a price on being paid early. \"2/10 net 30\" means take 2% off by paying within 10 days, or pay in full by day 30. **For the buyer that is a borrowing decision and it has a formula.**",
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
          text: "Always price the annual cost of forgoing a discount against your cost of short-term borrowing. If borrowing is cheaper, take the discount. **37.23% against 8% is not a close call.**",
        },
      ],
      check: {
        question:
          "A supplier offers 2/10 net 30, and your overdraft costs 8% per annum. What should you do?",
        options: [
          "Borrow at 8% and pay by day 10, because forgoing the discount costs 37.23% per annum",
          "Pay on day 30, because free credit from the supplier always beats borrowing",
          "Pay on day 10 without the discount, to strengthen the relationship",
          "Negotiate 3/15 net 45 before deciding anything",
        ],
        answer: 0,
        explain:
          "The 20 extra days of credit cost 2% of the invoice, which annualises to [2/98] × [365/20] = 37.23%, nearly five times the overdraft rate. Supplier credit only looks free until somebody prices it.",
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
