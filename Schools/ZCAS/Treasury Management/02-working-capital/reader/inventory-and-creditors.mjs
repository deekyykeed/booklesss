/* TM · Lesson 2 Working capital · Step 2a — Inventory, and how it is financed
 *
 * Source: 07_Working Capital PPTX 2 (Inventory Management);
 *         build_tm_2_2_inventory-management.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one five-section step. The seam is
 * between holding stock (what it is, how it is financed, and the strategy that
 * refuses to hold it) and dealing with the supplier (how much to order, and
 * when to pay). Coverage is identical; nothing was cut.
 *
 * The slug stays `inventory-and-creditors` per S-8, because that URL already
 * exists and should keep opening something. Creditors now live in the second
 * part, `ordering-and-paying-suppliers`, so the slug reads a little wider than
 * the step does. That is the deliberate trade: a working link beats a tidy one.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 * Engagement (D-1): §2's closing line was its best sentence, that the weaker
 * the borrower the more the financing leans on the stock itself. It now opens
 * the section and the five methods are read against it.
 */

export default {
  slug: "inventory-and-creditors",
  label: "Inventory",
  title: "Inventory, and how it is financed",
  kicker: "Working capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-inventory-is",
      heading: "What inventory is",
      blocks: [
        {
          type: "p",
          text: "**Inventory is cash you have turned into a shape you cannot spend.** That is why it is a treasury problem and not only an operations one: every unit in the warehouse is capital that has to be funded for as long as it sits there.",
        },
        {
          type: "p",
          text: "[Stock](https://corporatefinanceinstitute.com/resources/accounting/inventory/) covers [raw materials, work in progress, finished goods and supplies](https://www.accountingcoach.com/blog/what-is-inventory), and your aim is the level where what holding it buys you, less what holding it costs, is at its greatest. Hold more finished goods and you fill orders without waiting for production, at the price of storage, capital and [[obsolescence|The risk that stock loses its value because the product moved on, not because anything happened to the goods. It is the cost people forget, and it is the one that arrives all at once.]]. Hold too little and you lose the sales you could not supply.",
        },
        {
          type: "table",
          columns: [{ label: "Type" }, { label: "What it is" }],
          rows: [
            [
              "Raw materials",
              "Basic inputs to production, separating the timing of supplier deliveries from production scheduling",
            ],
            ["Work in progress", "Items actively in the manufacturing process"],
            [
              "Finished goods",
              "Completed items ready for sale, letting you fill orders without waiting for production",
            ],
            [
              "Scrap and obsolete items",
              "Stock overtaken by product changes. Some can be reused, such as steel and aluminium, or sold to recyclers",
            ],
            [
              "Stores and supplies",
              "Indirect purchases supporting production: lubricants, maintenance materials, consumables",
            ],
          ],
        },
        {
          type: "p",
          text: "Operations decides what stock the business needs. **Your stake is the capital tied up in it and what that capital costs,** which is why the number matters to you even though nothing in the warehouse is yours to move.",
        },
      ],
      check: {
        question:
          "Why does treasury care about inventory levels at all, when stock is an operations matter?",
        options: [
          "Because inventory is cash in another form, so every unit held is capital that must be financed and could be earning elsewhere",
          "It does not, because inventory belongs entirely to the operations team",
          "Because treasury physically counts the stock each month",
          "Because inventory is a current liability on the balance sheet",
        ],
        answer: 0,
        explain:
          "Inventory sits inside working capital and consumes funding the whole time it is held. Operations decides what stock the business needs, and treasury's stake is the capital tied up in it and the cost of financing that capital. It is a current asset, not a liability.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "inventory-financing",
      heading: "Financing the inventory",
      blocks: [
        {
          type: "p",
          text: "**The weaker your credit looks, the more the financing leans on the stock itself.** That one line orders the whole list below, which runs from a supplier trusting you on nothing at all to a lender holding the keys to your warehouse.",
        },
        {
          type: "p",
          text: "Trade credit is the cheapest and the most automatic: the supplier lets you have the goods and gives you [30 to 60 days to pay](https://corporatefinanceinstitute.com/resources/accounting/accounts-payable/). It is [[spontaneous finance|Funding that appears and disappears with the trading itself, with nobody applying for it. Buy more stock and you owe more; sell it and the debt runs off. It is the only borrowing that sizes itself.]], so it rises and falls with your stock without anyone signing anything.",
        },
        {
          type: "p",
          text: "Supply chain financing goes further. The seller arranges finance against purchase orders from a large buyer, gets a lower rate because that buyer's name effectively stands behind the order, and the buyer keeps the debt off its own balance sheet. After that, the lender starts wanting security.",
        },
        {
          type: "ul",
          items: [
            "**Collateralised loans.** The inventory is the collateral and the bank lends a set percentage of its value, typically 50 to 80%.",
            "**Asset-based loans.** The lender advances against what the stock is worth rather than what the company is worth, and takes physical possession of it if you default.",
            "**Floor planning.** For high-value durables like vehicles and heavy equipment, the lender finances each item by serial number and each loan is repaid when that item sells.",
          ],
        },
      ],
      check: {
        question:
          "A vehicle dealer's bank finances each car on the lot individually, by serial number, with each loan repaid as that car sells. Which method is that?",
        options: [
          "Floor planning, meaning item-level loans against high-value durables",
          "Trade credit, since the manufacturer is owed for the cars",
          "Supply chain financing, since the dealer's buyers guarantee the orders",
          "A collateralised loan, meaning a percentage advanced against total stock value",
        ],
        answer: 0,
        explain:
          "Serial-number-level lending repaid sale by sale is the definition of floor planning, built for exactly this kind of stock: few units, high value, individually identifiable. A collateralised loan would advance one percentage against the whole inventory pool instead.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "jit",
      heading: "Just-in-time purchasing",
      blocks: [
        {
          type: "p",
          text: "Two days of raw material cover is either excellent working capital management or the reason the line stops on Thursday. **Which one it turns out to be has almost nothing to do with you and everything to do with your suppliers.**",
        },
        {
          type: "p",
          text: "[Just-in-time](https://corporatefinanceinstitute.com/resources/management/just-in-time-jit/) takes delivery of materials as they are needed rather than weeks ahead. In purchasing that means frequent small deliveries from fewer suppliers, held together by long-term contracts that make the schedule predictable, with quality checking pushed back to the supplier who inspects before shipping. In production it means the same discipline inside the factory: build to order, and hold nothing idle between processes.",
        },
        {
          type: "ul",
          items: [
            "Lower stock means lower storage and capital cost.",
            "Savings in space and in handling.",
            "Better quality, because removing the buffer exposes defects early instead of burying them.",
            "**Weaknesses become visible.** Bottlenecks, unreliable suppliers and paperwork gaps can no longer hide behind a pile of stock.",
            "Flexibility to supply small batches as demand shifts.",
          ],
        },
        {
          type: "p",
          text: "What JIT actually does is trade holding cost for dependence on delivery. For a Zambian manufacturer that is the whole question, because the two barriers are exactly there: transport that makes frequent small deliveries unreliable, and a thin supplier base with few alternatives when one fails. **A JIT programme in this country starts with the suppliers, not with the stock.** That means supplier development and [[dual sourcing|Qualifying a second supplier for the same input before you need them. It costs more per unit and it is the only thing that makes a thin supplier base survivable.]] first, or you will find out the hard way that the buffer was doing real work.",
        },
      ],
      check: {
        question:
          "A Lusaka manufacturer adopts JIT and cuts raw material stock to two days' cover. A supplier's truck breaks down on the Great North Road. What does the episode reveal about JIT?",
        options: [
          "JIT trades holding cost for dependence on supply reliability, so without dependable delivery the buffer it removed was doing real work",
          "JIT failed because stock levels were still too high",
          "Nothing, because production stoppages are unrelated to inventory policy",
          "JIT works only for finished goods, never raw materials",
        ],
        answer: 0,
        explain:
          "Buffer stock is insurance against exactly this. JIT removes the insurance and spends the premium elsewhere, which works only where deliveries rarely fail. That is why implementing JIT in a weak-infrastructure environment starts with the supply chain rather than the warehouse.",
      },
    },
  ],
};
