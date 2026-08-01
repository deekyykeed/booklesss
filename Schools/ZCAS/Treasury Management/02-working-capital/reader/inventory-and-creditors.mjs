/* TM · Lesson 2 Working capital · Step 2 — Inventory, EOQ and creditors
 *
 * Source: 07_Working Capital PPTX 2 (Inventory Management and Creditor Management);
 *         build_tm_2_2_inventory-management.py (PDF). EOQ worked example kept at
 *         the lecture's figures (XYZ Ltd, 500 units).
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "inventory-and-creditors",
  label: "Inventory, EOQ & creditors",
  title: "Inventory management, EOQ and creditor management",
  kicker: "Working capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-inventory-is",
      heading: "What inventory is",
      blocks: [
        {
          type: "p",
          text: "Inventory is stock — raw materials, work in progress, finished goods and supplies — and it ties up large amounts of the firm's resources: cash that could otherwise be earning elsewhere. Treasury's goal is the optimum level, where the benefits of holding stock less the costs of doing so are at their maximum.",
        },
        {
          type: "p",
          text: "The trade-off runs through everything in this step. Hold more finished goods and you gain flexibility — you fill customer orders without waiting for production — but you pay storage, capital and obsolescence costs. Hold too little and you lose sales you could not supply.",
        },
        {
          type: "table",
          columns: [{ label: "Type" }, { label: "What it is" }],
          rows: [
            [
              "Raw materials",
              "Basic inputs to production; separates the timing of supplier deliveries from production scheduling",
            ],
            ["Work in progress", "Items actively in the manufacturing process"],
            [
              "Finished goods",
              "Completed items ready for sale; lets you fill orders without waiting for production",
            ],
            [
              "Scrap and obsolete items",
              "Stock overtaken by product changes; some can be reused (steel, aluminium) or sold to recyclers",
            ],
            [
              "Stores and supplies",
              "Indirect purchases supporting production — lubricants, maintenance materials, consumables",
            ],
          ],
        },
      ],
      check: {
        question:
          "Why does treasury care about inventory levels at all — isn't stock an operations matter?",
        options: [
          "Because inventory is cash in another form — every unit held is capital that must be financed and could be earning elsewhere",
          "It doesn't — inventory belongs entirely to the operations team",
          "Because treasury physically counts the stock each month",
          "Because inventory is a current liability on the balance sheet",
        ],
        answer: 0,
        explain:
          "Inventory sits inside working capital: it consumes funding the whole time it is held. Operations decides what stock the business needs; treasury's stake is the capital tied up in it and the cost of financing that capital. (It is a current asset, not a liability.)",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "inventory-financing",
      heading: "Financing the inventory",
      blocks: [
        {
          type: "p",
          text: "Inventory must be financed, and there are five main methods, running roughly from cheapest and most automatic to most structured.",
        },
        {
          type: "p",
          text: "Trade credit is the least expensive: as you buy goods the supplier allows you time to pay, typically 30–60 days. It is spontaneous finance — it rises and falls with your inventory levels without anyone applying for it. Supply chain financing goes a step further: the seller arranges finance for the buyer against purchase orders from large buyers, the seller gets a lower rate because the large buyer effectively guarantees the order, and the buyer keeps the debt off its balance sheet.",
        },
        {
          type: "ul",
          items: [
            "Collateralised loans — inventory serves as collateral; the bank lends a set percentage of its value, typically 50–80%.",
            "Asset-based loans — the lender advances against inventory value rather than the company's financial strength, taking physical possession (public or field warehouse) on default.",
            "Floor planning — for high-value durables like vehicles and heavy equipment: the lender finances individual items by serial number, and each loan is repaid when its item sells.",
          ],
        },
        {
          type: "p",
          text: "The pattern to remember: the weaker the borrower's own credit, the more the financing leans on the inventory itself — from unsecured trade credit at one end to the lender holding the keys to a warehouse at the other.",
        },
      ],
      check: {
        question:
          "A vehicle dealer's bank finances each car on the lot individually, by serial number, with each loan repaid as that car sells. Which method is that?",
        options: [
          "Floor planning — item-level loans against high-value durables",
          "Trade credit — the manufacturer is owed for the cars",
          "Supply chain financing — the dealer's buyers guarantee the orders",
          "A collateralised loan — a percentage advanced against total stock value",
        ],
        answer: 0,
        explain:
          "Serial-number-level lending repaid sale by sale is the definition of floor planning, built for exactly this stock: few units, high value, individually identifiable. A collateralised loan would advance one percentage against the whole inventory pool instead.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "jit",
      heading: "Just-in-time purchasing",
      blocks: [
        {
          type: "p",
          text: "JIT minimises inventory by receiving materials just in time to use them, not weeks before. Purchasing under JIT aims at a reduction of raw material stock through frequent deliveries of smaller orders from fewer suppliers, held together by long-term contracts that make schedules predictable — with quality assurance shifted to the supplier, who inspects before shipping rather than the buyer after receiving.",
        },
        {
          type: "p",
          text: "JIT production applies the same idea inside the factory: low-cost, high-quality, on-time production to order, achieved by minimising idle stock between processes.",
        },
        {
          type: "ul",
          items: [
            "Lower inventory means lower storage and capital costs.",
            "Savings in storage space and handling.",
            "Better quality and customer satisfaction — eliminating waste exposes defects early.",
            "Weaknesses become visible — bottlenecks, unreliable suppliers and documentation gaps can no longer hide behind buffer stock.",
            "Flexibility to supply small batches as demand varies.",
          ],
        },
        {
          type: "p",
          text: "The catch is that JIT replaces buffer stock with dependence on delivery reliability. For a Zambian manufacturer, the two practical barriers are exactly there: transport infrastructure that makes frequent small deliveries unreliable, and a thin supplier base that leaves few alternatives when one fails. A JIT programme in that environment starts with supplier development and dual sourcing, not with cutting the stock.",
        },
      ],
      check: {
        question:
          "A Lusaka manufacturer adopts JIT and cuts raw material stock to two days' cover. A supplier's truck breaks down on the Great North Road. What does the episode reveal about JIT?",
        options: [
          "JIT trades holding cost for dependence on supply reliability — without dependable delivery, the buffer it removed was doing real work",
          "JIT failed because stock levels were still too high",
          "Nothing — production stoppages are unrelated to inventory policy",
          "JIT works only for finished goods, never raw materials",
        ],
        answer: 0,
        explain:
          "Buffer stock is insurance against exactly this. JIT removes the insurance and spends the premium elsewhere, which works only where deliveries rarely fail. That is why implementing JIT in a weak-infrastructure environment starts with the supply chain, not the warehouse.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "eoq",
      heading: "The economic order quantity",
      blocks: [
        {
          type: "p",
          text: "EOQ is the quantity to order each time that minimises total inventory cost. Total cost is the sum of ordering costs and holding costs, and they pull in opposite directions: bigger orders mean fewer orders (ordering cost falls) but more stock sitting in the warehouse (holding cost rises). EOQ is the point where the two balance.",
        },
        {
          type: "formula",
          text: "EOQ = √(2ac ÷ h)",
          where: [
            "a = annual demand in units",
            "c = cost of placing one order (fixed, regardless of quantity)",
            "h = holding cost per unit per annum",
          ],
        },
        {
          type: "p",
          text: "The lecture's example: XYZ Ltd needs 1,000 units of material X a month, each order costs ZMW 30 to place, and holding costs ZMW 2.88 per unit per year. Annual demand is 12,000 units, so EOQ = √(2 × 12,000 × 30 ÷ 2.88) = √250,000 = 500 units.",
        },
        {
          type: "table",
          columns: [{ label: "Result" }, { label: "Working" }, { label: "Value", align: "right" }],
          rows: [
            ["Order quantity", "√(720,000 ÷ 2.88)", "500 units"],
            ["Orders per year", "12,000 ÷ 500", "24"],
            ["Time between orders", "365 ÷ 24", "≈ 15.2 days"],
          ],
        },
        {
          type: "p",
          text: "XYZ should order 500 units at a time — 24 orders a year, one roughly every 15 days. Order more and holding costs dominate; order less and ordering costs do. The exam asks for any of the three numbers, so know the follow-on divisions as well as the square root.",
        },
      ],
      check: {
        question:
          "XYZ's supplier offers free delivery on orders of 2,000 units, and a manager suggests ordering quarterly to \"save on ordering costs\". What does the EOQ logic say?",
        options: [
          "Larger orders cut ordering costs but raise holding costs — moving from 500 to 2,000 units only pays if the savings beat the extra holding cost",
          "Order the 2,000 — fewer orders always means lower total cost",
          "Keep ordering 500 — EOQ never changes whatever the terms",
          "Order monthly regardless, since demand is monthly",
        ],
        answer: 0,
        explain:
          "EOQ minimises the sum of the two costs, so any departure from it must be justified against both. Free delivery effectively lowers the ordering cost c — which does move the optimum — but quadrupling the order size also quadruples average stock held. Rerun the trade-off; don't assume either cost dominates.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "creditor-management",
      heading: "Creditor management",
      blocks: [
        {
          type: "p",
          text: "Trade credit is normally viewed as a free source of finance, and the standard treasury policy is to pay suppliers as late as possible while honouring your obligations and keeping the relationship sound. Every extra day of payables shortens the cash conversion cycle and cuts the working capital the business must fund.",
        },
        {
          type: "formula",
          text: "Days Payables = (Payables ÷ Cost of goods sold) × 365",
          where: ["Measures the average number of days taken to pay suppliers"],
        },
        {
          type: "p",
          text: "Creditor management mirrors debtor management — the same metrics run in reverse. But \"as late as possible\" has a limit that the formula does not show: delay payment too long and cash-strapped suppliers struggle and can ultimately fail, threatening the supply chain your production depends on. A supplier driven under by your payment terms is not a financing win.",
        },
        {
          type: "callout",
          text: "Stretch payables to shorten the cycle — but the ceiling is the supplier's survival and goodwill, not the point where they stop chasing.",
        },
      ],
      check: {
        question:
          "A company stretches supplier payments from 45 to 120 days. Its CCC improves sharply — then its key raw-material supplier collapses. What did the policy miss?",
        options: [
          "Supply chain risk — payables are finance borrowed from suppliers, and over-stretching can break the lender you depend on",
          "Nothing — a shorter CCC is always worth any cost",
          "The arithmetic — longer payables actually lengthen the CCC",
          "The suppliers should have factored their invoices",
        ],
        answer: 0,
        explain:
          "Longer payables do shorten the CCC — the arithmetic worked. What failed is the constraint the metric doesn't carry: trade credit is finance drawn from companies that can run out of cash themselves. Creditor policy is set against supplier health and relationships, not against the cycle alone.",
      },
    },
  ],
};
