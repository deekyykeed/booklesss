/* TM · Inventory and Suppliers · Inventory Financing
 *
 * Split out of inventory-and-creditors.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of inventory-and-creditors.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "inventory-financing",
  label: "Inventory Financing",
  title: "Inventory Financing",
  kicker: "Inventory and Suppliers",

  sections: [
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
            "Collateralised loans. The inventory is the collateral and the bank lends a set percentage of its value, typically 50 to 80%.",
            "Asset-based loans. The lender advances against what the stock is worth rather than what the company is worth, and takes physical possession of it if you default.",
            "Floor planning. For high-value durables like the vehicles on a Lusaka dealership floor, the lender finances each item by serial number and each loan is repaid when that item sells.",
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
  ],
};
