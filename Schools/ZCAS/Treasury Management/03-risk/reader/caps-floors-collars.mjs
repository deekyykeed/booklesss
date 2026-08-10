/* TM · Hedging Instruments · Caps, Floors and Collars
 *
 * Split out of interest-rate-hedging-instruments.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of interest-rate-hedging-instruments.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "caps-floors-collars",
  label: "Caps, Floors and Collars",
  title: "Caps, Floors and Collars",
  kicker: "Hedging Instruments",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "options",
      heading: "Caps, floors and collars",
      blocks: [
        {
          type: "p",
          text: "Pay ZMW 1,500 today and you keep the right to change your mind in September. Everything that follows is about whether that is worth ZMW 1,500 to you.",
        },
        {
          type: "p",
          text: "An interest rate option gives its buyer [a right rather than an obligation](https://corporatefinanceinstitute.com/resources/derivatives/call-option/), which is the one thing the instruments above cannot offer, and the premium is the price of it. **A cap sets the most you will ever pay:** rise above the [[strike|The rate written into the option. A cap struck close to today's rate protects almost immediately and costs more; struck further away it is cheaper cover against a bigger move.]] and the seller reimburses the difference, stay below it and you walk away having lost only the premium. A floor is the lender's mirror image, a minimum rate received.",
        },
        {
          type: "p",
          text: "A collar buys a cap and sells a floor at the same time, so the premium you receive on the floor pays for most of the cap. **You are selling away the rate falls below the floor to fund the protection above the cap.**",
        },
        { type: "h2", text: "The choice, on one loan" },
        {
          type: "p",
          text: "ZMW 1 million resetting for six months. You can have an FRA at 7.5%, or a cap struck at 7.5% for a ZMW 1,500 premium.",
        },
        {
          type: "table",
          columns: [{ label: "Scenario" }, { label: "FRA, total cost", align: "right" }, { label: "Cap, total cost", align: "right" }],
          rows: [
            ["Rates rise to 8%", "37,500", "39,000"],
            ["Rates fall to 6%", "37,500", "31,500"],
          ],
          note: "Six months' interest on ZMW 1m. FRA: locked at 7.5% either way. Cap: at 8%, pay 40,000 less 2,500 reimbursed plus the 1,500 premium; at 6%, pay 30,000 plus the premium.",
        },
        {
          type: "p",
          text: "The FRA wins if rates rise, because certainty cost nothing extra. The cap wins if they fall, because it never asked you to give the fall away. **That is the whole decision: pay a premium for the upside, or keep the premium and lock the rate.** When rates could genuinely go either way, the ZMW 1,500 is buying something real.",
        },
      ],
      check: {
        question:
          "When is a collar preferable to a plain cap for a borrower?",
        options: [
          "When the borrower wants cheaper protection and will accept giving up the benefit of rates falling below the floor",
          "When the borrower expects rates to collapse and wants full benefit from the fall",
          "Never, because a collar is always strictly worse than a cap",
          "When the borrower wants no premium and no obligations of any kind",
        ],
        answer: 0,
        explain:
          "Selling the floor funds the cap, so the collar's net premium is small or nil, and the sold floor is a real obligation: below that rate the borrower pays the difference away. It suits someone who wants the ceiling and can live with a floor under their savings. Anyone expecting a collapse should keep the plain cap.",
      },
    },
  ],
};
