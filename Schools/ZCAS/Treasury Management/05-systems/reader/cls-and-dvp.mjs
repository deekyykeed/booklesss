/* TM · Payment Systems · CLS and Delivery Versus Payment
 *
 * Split out of payment-systems-and-ccps.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of payment-systems-and-ccps.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "cls-and-dvp",
  label: "CLS and Delivery Versus Payment",
  title: "CLS and Delivery Versus Payment",
  kicker: "Payment Systems",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "cls-and-dvp",
      heading: "Settling both legs at once",
      blocks: [
        {
          type: "p",
          text: "Pay away your euros at 10:00 and wait for the dollars at 16:00, and you have spent six hours trusting a stranger with the whole amount. In June 1974 a German bank called Herstatt was shut in exactly that gap, having taken in the marks and never delivered the dollars, and its counterparties lost the lot.",
        },
        {
          type: "p",
          text: "CLS Bank exists to remove the six hours. Both banks pre-fund accounts at CLS in their own currencies, and CLS then settles both legs in the same instant, debiting one side's euros as it credits its dollars. **Neither party can ever have paid without being paid.** That principle is payment versus payment, and nearly all major currency flows settle on it now.",
        },
        {
          type: "p",
          text: "Securities have the same problem, on the Lusaka Securities Exchange as anywhere else: stock can move before cash or cash before stock. The cure is the same. **Delivery versus payment** puts a depository between buyer and seller and moves the securities and the money at the same moment, so if either side cannot complete, neither transfer happens.",
        },
        { type: "h2", text: "The idea underneath both" },
        {
          type: "p",
          text: "Both are the [central counterparty](https://corporatefinanceinstitute.com/resources/derivatives/clearing-house/) at work. For every trade the counterparty becomes the buyer to the seller and the seller to the buyer, by [[novation|Legally replacing one contract with two: your trade with the other side is torn up and rewritten as your trade with the clearing house, and theirs with it. It is what lets you stop caring who was on the other end.]], so each side faces one regulated, well-capitalised institution instead of each other. It is protected by daily [[marking to market|Revaluing an open position at today's price every day, and settling the difference in cash. It stops a loss quietly building over months, because it is collected the day it happens.]], margin collection and a [[default fund|A pot the clearing members pay into, used to absorb the losses if one of them fails and its own margin is not enough. It is why a clearing house can survive a member going under.]]. CLS does this for currencies, houses like LCH for derivatives, and national depositories for securities.",
        },
      ],
      check: {
        question:
          "How exactly does CLS eliminate the risk of paying one currency and never receiving the other?",
        options: [
          "Both pre-funded legs settle simultaneously, which is payment versus payment, so no one can pay out without receiving in the same instant",
          "CLS insures each party against the other's failure",
          "CLS settles everything in dollars, removing the second currency",
          "CLS forces both banks to settle during New York hours only",
        ],
        answer: 0,
        explain:
          "It was a timing gap, and CLS closes the gap rather than insuring it. Settling both legs atomically means the failure case, paid one side and lost the other, cannot occur. Engineering a risk out of the structure is stronger than compensating for it after the fact.",
      },
    },
  ],
};
