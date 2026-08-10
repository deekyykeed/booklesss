/* TM · Debtors and Factoring · Factoring and Invoice Discounting
 *
 * Split out of debtors-and-factoring.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of debtors-and-factoring.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "factoring",
  label: "Factoring",
  title: "Factoring and Invoice Discounting",
  kicker: "Debtors and Factoring",

  sections: [
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
