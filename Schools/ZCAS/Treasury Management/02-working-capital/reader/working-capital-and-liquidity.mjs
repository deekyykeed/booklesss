/* TM · Lesson 2 Working capital · Step 1 — Working capital and liquidity
 *
 * Source: 07_Working Capital_Liquidity Management PPTX 1;
 *         build_tm_2_1_working-capital.py (PDF). Worked figures kept at the
 *         lecture's originals (Zanaco Distributors CCC; 2/10 net 30; Mutengo).
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "working-capital-and-liquidity",
  label: "Working capital & liquidity",
  title: "Working capital and liquidity management",
  kicker: "Working capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-working-capital-is",
      heading: "What working capital is",
      blocks: [
        {
          type: "p",
          text: "Working capital is current assets minus current liabilities. That is the technical definition; in practice it is the pool of cash and near-cash a business has available to keep running day to day.",
        },
        {
          type: "p",
          text: "If current assets exceed current liabilities the company has a surplus, usually sitting in bank deposits or short-term investments. If liabilities exceed assets there is a deficit, and the company is typically running on an overdraft or short-term loan. Treasury's job is to manage the pool as efficiently as possible: too little working capital and the business cannot pay its suppliers; too much and money sits idle earning nothing when it could be in productive assets.",
        },
        {
          type: "callout",
          text: "Even a profitable business can fail without adequate working capital. Cash is king — not profit. A company can be profitable on paper and still collapse if it cannot meet its near-term obligations.",
        },
      ],
      check: {
        question:
          "A company reports strong profits but cannot pay this month's suppliers. How is that possible?",
        options: [
          "Profit is an accounting result — its cash may be tied up in stock and unpaid customer invoices, leaving nothing liquid",
          "It isn't possible — profitable companies always have cash",
          "The profits must be fraudulent",
          "Suppliers must be demanding early payment illegally",
        ],
        answer: 0,
        explain:
          "Profit records revenue when earned, not when collected. A profitable company whose cash sits in inventory and receivables has a working capital problem, and working capital — not profit — is what pays this month's bills.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "working-capital-policy",
      heading: "Working capital policy",
      blocks: [
        {
          type: "p",
          text: "Every company makes two decisions that together define its working capital policy: how much to hold, and how to fund it.",
        },
        {
          type: "p",
          text: "The investment decision asks how much safety stock and cash buffer to hold above the operating minimum.",
        },
        {
          type: "table",
          columns: [
            { label: "Policy" },
            { label: "What it means" },
            { label: "Return" },
            { label: "Risk" },
          ],
          rows: [
            [
              "Aggressive",
              "Minimal safety stock; lean inventory, tight cash buffers",
              "Higher — less idle capital",
              "Higher — can't absorb demand spikes",
            ],
            [
              "Conservative",
              "Large safety stocks; generous cash buffers",
              "Lower — more capital tied up",
              "Lower — rarely caught short",
            ],
            ["Moderate", "Balanced between the two extremes", "Middle ground", "Middle ground"],
          ],
        },
        {
          type: "p",
          text: "The financing decision asks what mix of short and long-term debt funds the asset base.",
        },
        {
          type: "table",
          columns: [
            { label: "Policy" },
            { label: "How it works" },
            { label: "Return" },
            { label: "Risk" },
          ],
          rows: [
            [
              "Aggressive",
              "Part of the permanent asset base funded by short-term debt",
              "Highest — short-term debt costs less",
              "Highest — must be rolled over",
            ],
            ["Conservative", "Permanent assets funded by long-term debt only", "Lowest", "Lowest"],
            ["Maturity matching", "Match funding maturity to asset life", "Middle", "Middle"],
          ],
        },
        {
          type: "p",
          text: "The symmetry is the point: in both decisions, aggressive means higher return and higher risk together, conservative means lower of both. When the exam asks you to evaluate a policy, state both sides — a policy is never simply good or bad, it is a chosen position on that trade-off.",
        },
      ],
      check: {
        question:
          "A company funds part of its permanent asset base with short-term debt that it rolls over every 90 days. What has it chosen?",
        options: [
          "An aggressive financing policy — cheaper funding, carrying rollover and rate risk every quarter",
          "A conservative financing policy — short-term debt is the safe option",
          "Maturity matching — 90 days matches any asset",
          "An aggressive investment policy — this is about how much to hold",
        ],
        answer: 0,
        explain:
          "Permanent assets funded short-term is the definition of aggressive financing: the yield curve makes it cheaper, but every rollover is a chance for rates to rise or credit to dry up. It is the financing decision, not the investment one — the asset levels haven't changed.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "cash-conversion-cycle",
      heading: "The cash conversion cycle",
      blocks: [
        {
          type: "p",
          text: "The operating cycle is the time between paying cash for inputs and receiving cash from sales. The cash conversion cycle (CCC) measures it precisely — and the longer it runs, the more working capital the business must fund. A company with a 90-day CCC finances 90 days of operations before its cash comes back.",
        },
        {
          type: "formula",
          text: "CCC = Days Inventory + Days Receivables − Days Payables",
          where: [
            "Days Inventory = (Inventory ÷ Cost of goods sold) × 365",
            "Days Receivables = (Accounts receivable ÷ Revenue) × 365",
            "Days Payables = (Accounts payable ÷ Cost of goods sold) × 365",
          ],
        },
        {
          type: "p",
          text: "Work it on the lecture's example. Zanaco Distributors Ltd holds inventory of ZMW 2,600,000, receivables of ZMW 1,700,000 and payables of ZMW 1,600,000, on annual revenue of ZMW 15,000,000 and cost of goods sold of ZMW 9,200,000.",
        },
        {
          type: "table",
          columns: [{ label: "Component" }, { label: "Working" }, { label: "Days", align: "right" }],
          rows: [
            ["Days inventory", "(2,600,000 ÷ 9,200,000) × 365", "103.15"],
            ["Days receivables", "(1,700,000 ÷ 15,000,000) × 365", "41.37"],
            ["Days payables", "(1,600,000 ÷ 9,200,000) × 365", "(63.48)"],
          ],
          total: ["Cash conversion cycle", "103.15 + 41.37 − 63.48", "81.04"],
          note: "Cash turnover = 365 ÷ 81.04 = 4.5 times per year.",
        },
        {
          type: "p",
          text: "Just over 81 days pass between paying for goods and collecting the cash, so the cash turns over 4.5 times a year. Every route to a shorter cycle attacks one component: collect debts faster through tighter credit terms or discounts, turn inventory quicker, order raw materials in smaller and more frequent lots, or negotiate longer supplier credit without damaging the relationship.",
        },
      ],
      check: {
        question:
          "A year later Zanaco Distributors' CCC has jumped from 81 to 120 days. Which single change explains it?",
        options: [
          "Days receivables rose sharply — customers are taking much longer to pay",
          "Days payables rose sharply — the company pays suppliers later",
          "Revenue rose while everything else stayed constant",
          "The company negotiated a discount for early supplier payment",
        ],
        answer: 0,
        explain:
          "The CCC lengthens when inventory or receivable days rise, or payable days fall. Slower collection adds directly to the cycle; paying suppliers later would shorten it, and higher revenue with constant receivables reduces receivable days. Diagnosis starts with the component that moved.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "debtor-management",
      heading: "Debtor management and cash discounts",
      blocks: [
        {
          type: "p",
          text: "Extending credit to customers ties up cash, and the goal is the level of credit and discount terms that maximises profit — not simply the fewest days outstanding. That starts with knowing who deserves credit. The Zambian sources: bank references, trade references from existing suppliers, published accounts, the Credit Reference Bureau's cross-bank borrowing data, and for existing customers your own sales ledger's payment history.",
        },
        {
          type: "p",
          text: "Discount terms put a price on early payment. Terms of \"2/10 net 30\" mean: take a 2% discount by paying within 10 days, or pay in full by day 30. Whether to take the discount is a borrowing decision, and it has a formula.",
        },
        {
          type: "formula",
          text: "Cost of not taking the discount = [D ÷ (100 − D)] × [365 ÷ (N − T)]",
          where: [
            "D = discount percentage",
            "N = net period (days until full payment is due)",
            "T = discount period (days within which the discount applies)",
          ],
        },
        {
          type: "p",
          text: "On 2/10 net 30 with a short-term borrowing rate of 8%: the cost of forgoing the discount is [2 ÷ 98] × [365 ÷ 20] = 0.0204 × 18.25 = 37.23% per annum. Paying on day 30 instead of day 10 is borrowing from the supplier at 37.23% — so the buyer should borrow from the bank at 8% and take the discount.",
        },
        {
          type: "callout",
          text: "Always compare the annual cost of forgoing a discount against the cost of short-term borrowing. If borrowing is cheaper, take the discount. 37.23% against 8% is not a close call.",
        },
      ],
      check: {
        question:
          "A supplier offers 2/10 net 30, and your overdraft costs 8% per annum. What should you do?",
        options: [
          "Borrow at 8% and pay by day 10 — forgoing the discount costs 37.23% per annum",
          "Pay on day 30 — free credit from the supplier always beats borrowing",
          "Pay on day 10 without the discount, to strengthen the relationship",
          "Negotiate 3/15 net 45 before deciding anything",
        ],
        answer: 0,
        explain:
          "The 20 extra days of credit cost 2% of the invoice, which annualises to [2/98] × [365/20] = 37.23% — nearly five times the overdraft rate. The supplier credit only looks free until it is priced.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "factoring",
      heading: "Factoring and invoice discounting",
      blocks: [
        {
          type: "p",
          text: "Rather than managing receivables in-house, a company can outsource them. A factoring company takes on the sales ledger: it advances a percentage of invoice value immediately — typically 80–85% — and pays the remainder, less its fees, when the customer settles. Full-service factors also assess customer credit and chase overdue accounts. Non-recourse factoring means the factor absorbs the credit risk; with recourse factoring the risk stays with you.",
        },
        {
          type: "p",
          text: "The lecture's example prices it. Mutengo Plc invoices ZMW 300,000 a month on an average 2.5-month credit period. The factor charges a 2.5% service fee, advances 85% of invoices at 13% per annum, and saves Mutengo ZMW 95,000 a year in administration. The alternative is an overdraft at 12.5% on the same funding.",
        },
        {
          type: "table",
          columns: [{ label: "Item" }, { label: "ZMW", align: "right" }],
          rows: [
            ["Annual sales (300,000 × 12)", "3,600,000"],
            ["Service fee — 2.5% × 3,600,000", "90,000"],
            ["Interest — (2.5 ÷ 12) × 3,600,000 × 85% × 13%", "82,875"],
            ["Total factoring cost", "172,875"],
            ["Less: administration savings", "(95,000)"],
          ],
          subtotals: [3],
          total: ["Net cost of factoring", "77,875"],
          note: "The overdraft alternative — 12.5% on the ZMW 637,500 advanced — would cost ZMW 79,688, so factoring saves roughly ZMW 1,800 a year and removes the sales ledger workload entirely.",
        },
        {
          type: "p",
          text: "Invoice discounting provides the same finance without handing over the ledger: customers never know a third party is involved, it costs less than factoring, and the customer relationship stays entirely in your hands. The choice between them is really a choice about what you are buying — finance alone, or finance plus an outsourced credit function.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Factoring" }, { label: "Invoice discounting" }],
          rows: [
            ["Sales ledger", "Factor manages it", "Company manages it"],
            ["Customer awareness", "Customers know", "Customers don't know"],
            ["Cost", "Higher", "Lower"],
            ["Best for", "Full outsourcing", "Finance only"],
            ["Credit risk (non-recourse)", "Factor absorbs", "Company retains"],
          ],
        },
      ],
      check: {
        question:
          "A company wants cash against its invoices but insists its customers must never deal with, or know about, a third party. Which product fits?",
        options: [
          "Invoice discounting — finance against the ledger while the company keeps managing it, invisibly to customers",
          "Non-recourse factoring — the factor absorbs risk invisibly",
          "Recourse factoring — recourse means customers are not told",
          "An overdraft secured on inventory",
        ],
        answer: 0,
        explain:
          "Customer visibility is the dividing line: a factor takes over the ledger and deals with customers directly, while invoice discounting leaves collection with the company so customers see nothing. Recourse describes who bears bad-debt risk, not who customers deal with.",
      },
    },
  ],
};
