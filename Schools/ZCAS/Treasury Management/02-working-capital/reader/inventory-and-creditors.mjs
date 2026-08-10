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
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Inventory, and how it is financed'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "The Cost of Holding Inventory". The other
 * section(s) moved to inventory-financing.mjs, just-in-time.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "inventory-and-creditors",
  label: "The Cost of Holding Inventory",
  title: "The Cost of Holding Inventory",
  kicker: "Inventory and Suppliers",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-inventory-is",
      heading: "What inventory is",
      blocks: [
        {
          type: "p",
          text: "**Inventory is cash you have turned into a shape you cannot spend.** A depot holding ZMW 8 million of stock that shifts every sixty days is ZMW 8 million funded, every day of the year. That is why it is a treasury problem and not only an operations one: every unit in the warehouse is capital that has to be funded for as long as it sits there.",
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
  ],
};
