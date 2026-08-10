/* TM · Hedging Instruments · Interest Rate Swaps
 *
 * Split out of interest-rate-hedging-instruments.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of interest-rate-hedging-instruments.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "interest-rate-swaps",
  label: "Interest Rate Swaps",
  title: "Interest Rate Swaps",
  kicker: "Hedging Instruments",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "swaps",
      heading: "Interest rate swaps",
      blocks: [
        {
          type: "p",
          text: "Zambia Sugar can borrow more cheaply than Lafarge in both markets, fixed and floating. Lafarge still ends up better off by dealing with them, and so does Zambia Sugar. **That is not charity, and it is not a trick.**",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Fixed" }, { label: "Floating" }],
          rows: [
            ["Zambia Sugar (AAA)", "10%", "LIBOR + 0.3%"],
            ["Lafarge (BBB)", "11%", "LIBOR + 0.5%"],
            ["Lafarge's penalty", "1.0%", "0.2%"],
          ],
        },
        {
          type: "p",
          text: "Look at the last row. **Lafarge pays 1% more in the fixed market but only 0.2% more in the floating one,** and that 0.8% difference is the whole opportunity. Zambia Sugar wants floating and Lafarge wants fixed, which is exactly the wrong way round from where each is relatively strong.",
        },
        {
          type: "p",
          text: "So each borrows where it is relatively strongest, Zambia Sugar at 10% fixed and Lafarge at LIBOR + 0.5% floating, and then they [swap](https://corporatefinanceinstitute.com/resources/derivatives/interest-rate-swap/) the payments. Zambia Sugar pays LIBOR to Lafarge, and Lafarge pays 10.1% to Zambia Sugar.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Net cost after the swap" }, { label: "Own market rate" }, { label: "Saving", align: "right" }],
          rows: [
            ["Zambia Sugar", "10% − 10.1% + LIBOR = LIBOR − 0.1%", "LIBOR + 0.3%", "0.4%"],
            ["Lafarge", "LIBOR + 0.5% − LIBOR + 10.1% = 10.6%", "11%", "0.4%"],
          ],
          note: "The 0.8% shared gain is the difference between the two penalties, 1.0% less 0.2%, split half each.",
        },
        {
          type: "p",
          text: "A swap runs for years, typically two to ten, on a [[notional|The principal a swap's interest is calculated on, which is never actually exchanged. A ZMW 50 million swap moves only the interest difference, so the number on the contract is far larger than anything at risk.]] that never moves. It is the tool for changing what your debt is, rather than for covering one reset: a floating borrower becomes effectively fixed without refinancing a single loan.",
        },
        {
          type: "callout",
          kind: "key",
          text: "**A swap creates value when two parties' borrowing penalties differ between markets.** Each borrows where it is relatively cheapest, then swaps into the exposure it actually wanted.",
        },
        {
          type: "callout",
          kind: "example",
          text: "Find the surplus in a different pair. Zambeef can borrow at 9.5% fixed or LIBOR + 0.4% floating; a smaller processor can borrow at 11.3% fixed or LIBOR + 1.0% floating. Zambeef wants floating and the processor wants fixed. Work out each of the processor's two penalties, then how much a swap has to share out. Do not start from which rate looks cheapest: the gain is a difference between two differences, and neither of them is a rate you can read straight off the table.",
        },
      ],
      check: {
        question:
          "In that pair, how much total saving is there to share, and how much does each side get on an even split?",
        options: [
          "1.2% in total, so 0.6% each",
          "0.6% in total, so 0.3% each",
          "1.8% in total, so 0.9% each",
          "2.4% in total, so 1.2% each",
        ],
        answer: 0,
        explain:
          "The processor pays 11.3% − 9.5% = 1.8% more in the fixed market and only 1.0% − 0.4% = 0.6% more in the floating one. The surplus is the difference between those two penalties: 1.8% − 0.6% = **1.2%**, or 0.6% each split evenly. 0.6% is the smaller penalty mistaken for the gain. 1.8% is the larger one: the whole gap in the market each side is about to leave, rather than the gain from trading. 2.4% adds the penalties instead of subtracting them, which would mean the surplus grows the more alike the two firms are. It is exactly the other way round, and where both penalties are equal there is nothing to swap for.",
      },
    },
  ],
};
