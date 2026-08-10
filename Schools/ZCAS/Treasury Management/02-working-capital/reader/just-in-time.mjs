/* TM · Inventory and Suppliers · Just-in-Time Purchasing
 *
 * Split out of inventory-and-creditors.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of inventory-and-creditors.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "just-in-time",
  label: "Just-in-Time Purchasing",
  title: "Just-in-Time Purchasing",
  kicker: "Inventory and Suppliers",

  sections: [
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
