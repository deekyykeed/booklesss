/* TM · Clearing and Settlement · Settlement Risk and Herstatt
 *
 * Split out of clearing-and-settlement.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of clearing-and-settlement.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "herstatt",
  label: "Settlement Risk and Herstatt",
  title: "Settlement Risk and Herstatt",
  kicker: "Clearing and Settlement",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "herstatt",
      heading: "Settlement risk and Herstatt",
      blocks: [
        {
          type: "p",
          text: "On 26 June 1974 the German authorities withdrew the banking licence of Bankhaus Herstatt and shut it at the end of the Frankfurt business day. Banks around the world had already paid Herstatt their deutsche marks that morning. **New York was still open, the dollars owed back were never delivered, and the counterparties lost the entire principal.** Fifty years later the risk still carries the bank's name.",
        },
        { type: "h2", text: "What the failure actually was" },
        {
          type: "p",
          text: "[Settlement risk](https://www.bis.org/cpmi/publ/d00b.htm) is the risk that you deliver your side of a deal and never receive the other. It is sharpest in foreign exchange, because **an FX deal settles in two countries at two different times.** Trade euros for dollars and the euro leg settles in Frankfurt during European hours while the dollar leg waits for New York, six hours behind. Sell kwacha for dollars and the kwacha leg settles in Lusaka the same way, hours before New York opens.",
        },
        {
          type: "p",
          text: "Note what kind of loss that is. This is not a rate moving against you by a few percent. It is [[principal risk|Losing the whole amount rather than a change in its value. A currency move costs you part of a trade; a settlement failure costs you all of the leg you already paid away.]], the full amount you paid away, and it is why the payment systems a few steps ahead were built rather than merely improved.",
        },
      ],
      check: {
        question:
          "Why is settlement risk worse in FX than in a domestic payment?",
        options: [
          "The two legs settle in different countries at different times, so one party can pay hours before the other and fail in between",
          "FX amounts are always larger than domestic ones",
          "Exchange rates can move during settlement",
          "Foreign banks are inherently less trustworthy",
        ],
        answer: 0,
        explain:
          "The time-zone gap is the mechanism. Each currency settles in its home system during its own hours, so the legs cannot naturally happen together. Herstatt's counterparties lost principal in exactly that window, which is a timing exposure rather than a size or rate one.",
      },
    },
  ],
};
