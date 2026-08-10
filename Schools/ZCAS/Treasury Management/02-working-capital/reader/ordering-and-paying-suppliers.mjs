/* TM · Lesson 2 Working capital · Step 2b — How much to order, and when to pay
 *
 * Source: 07_Working Capital PPTX 2 (Inventory Management and Creditor
 *         Management); build_tm_2_2_inventory-management.py (PDF). EOQ worked
 *         example kept at the lecture's figures (XYZ Ltd, 500 units).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `inventory-and-creditors`, which was one
 * five-section step. That part is holding the stock; this part is the two
 * decisions you make with the supplier, how much to order and how long to take
 * paying. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-9: §4 closed "The exam asks for any of the three numbers, so
 * know the follow-on divisions as well as the square root." Exam framing was
 * the default voice here rather than the point; it now says why the three
 * numbers matter to whoever is placing the orders.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). §1 worked an EOQ and then
 * asked a reasoning question about order size, so a reader could pass it
 * without being able to compute one. It now hands over a second EOQ, stated in
 * MONTHLY demand against an annual holding cost, because mismatched periods is
 * the slip the formula invites and the lecture's own figures also carry it.
 * 231 units is that slip, 566 drops the 2, and 60 is the order frequency
 * mistaken for the order size. Figures resolve to exactly 800 units.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'How much to order, and when to pay'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared, and opened on a question word. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 2 sections and now holds one: "The Economic Order Quantity". The other
 * section(s) moved to creditor-management.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "ordering-and-paying-suppliers",
  label: "The Economic Order Quantity",
  title: "The Economic Order Quantity",
  kicker: "Inventory and Suppliers",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "eoq",
      heading: "The economic order quantity",
      blocks: [
        {
          type: "p",
          text: "Five hundred units at a time, twenty-four times a year. That is the answer for the company below, and **the reason it is 500 rather than 2,000 is worth more to you than the number is.**",
        },
        {
          type: "p",
          text: "[Economic order quantity](https://corporatefinanceinstitute.com/resources/accounting/economic-order-quantity/) is the size of order that makes total inventory cost as small as it goes. Two costs pull against each other: bigger orders mean fewer of them, so ordering cost falls, while more stock sits in the warehouse, so holding cost rises. **EOQ is simply where the two lines cross.**",
        },
        {
          type: "formula",
          text: "EOQ = √(2ac ÷ h)",
          where: [
            "a = annual demand in units",
            "c = cost of placing one order, fixed regardless of quantity",
            "h = holding cost per unit per annum",
          ],
        },
        {
          type: "p",
          text: "The lecture's XYZ Ltd needs 1,000 units of material X a month, each order costs ZMW 30 to place, and holding costs ZMW 2.88 per unit a year. Annual demand is 12,000 units, so EOQ = √(2 × 12,000 × 30 ÷ 2.88) = √250,000 = 500 units.",
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
          text: "The three rows are one answer in three shapes, and each is used by a different person. The quantity goes on the purchase order and the frequency goes in the buyer's diary. The 15 days is the one that checks the plan: it tells you whether the supplier's [[lead time|The gap between placing an order and the goods arriving. An order size the arithmetic loves is worthless if the supplier cannot deliver inside the interval it implies.]] actually fits.",
        },
        {
          type: "p",
          text: "A supplier who needs twenty days' notice has made this order size impossible whatever the arithmetic says. Finding that out through a [[stock-out|Running out of an input and having to stop production, or turning away a sale you could have made. It is the cost no inventory model carries, because it lands in operations and in the customer relationship instead.]] is the expensive way to learn it, and **the model will never warn you, because the cost of running out is the one cost it does not contain.**",
        },
        {
          type: "callout",
          kind: "example",
          text: "Size one yourself. A Ndola bottler uses 4,000 units a month of a packaging line input, each order costs ZMW 40 to place, and holding a unit for a year costs ZMW 6. Work the order quantity, then the orders a year, then the days between them. The first move is the one the formula does not prompt you to make: a and h have to be measured over the same period.",
        },
      ],
      check: {
        question:
          "What is that bottler's economic order quantity: 4,000 units a month, ZMW 40 per order, ZMW 6 to hold a unit for a year?",
        options: [
          "800 units",
          "566 units",
          "231 units",
          "60 units",
        ],
        answer: 0,
        explain:
          "Annual demand is 4,000 × 12 = 48,000 units, so EOQ = √(2 × 48,000 × 40 ÷ 6) = √640,000 = **800 units**, or 60 orders a year, one about every 6 days. Which is also the check on it: 6 days is inside most suppliers' lead times, so this answer survives contact with the real supplier where the lecture's 15-day one nearly did not. 566 units drops the 2 from the numerator. 231 units puts the monthly 4,000 against an annual holding cost, which is the slip the formula invites because it never says over what period a is measured. 60 is the number of orders, not the size of one.",
      },
    },
  ],
};
