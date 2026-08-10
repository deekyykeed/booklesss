/* TM · Forecasting and Surpluses · Cash Concentration
 *
 * Split out of cash-forecasting-and-surpluses.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of cash-forecasting-and-surpluses.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "cash-concentration",
  label: "Cash Concentration",
  title: "Cash Concentration",
  kicker: "Forecasting and Surpluses",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "cash-concentration",
      heading: "Cash concentration",
      blocks: [
        {
          type: "p",
          text: "Eleven accounts across four provinces, Lusaka to Kitwe, each holding a bit, and not one of them holding enough to place at a rate worth having. **Scattered money is money you cannot use,** and it is also why nobody in the group can say what the real cash position is.",
        },
        {
          type: "p",
          text: "[Pooling](https://treasurytoday.com/cash-management/cash-pooling/) fixes it, and there are two families of technique. The difference between them is simply whether the cash physically moves.",
        },
        { type: "h2", text: "Physical sweeping" },
        {
          type: "p",
          text: "A zero balance account arrangement sweeps every subsidiary account to nothing at the close of each day, into one concentration account, and funds them back when a subsidiary goes overdrawn. Constant balancing leaves a set minimum in each account and sweeps only what is above it. Trigger balances sweep only once an account crosses a threshold, which means fewer transfers and more cash sitting where it started in between.",
        },
        { type: "h2", text: "Notional pooling" },
        {
          type: "p",
          text: "[Notional pooling](https://treasury-management.com/articles/cash-pooling/) moves nothing at all. The bank simply calculates interest across the combined credit and debit balances while each subsidiary keeps daily control of its own money. No [[intercompany loan|A loan from one company in a group to another, which is what a physical sweep creates whether anyone intends it or not. It has to be documented, priced and often taxed, which is administration a notional pool never generates.]] arises, no transfer fees are paid, and a global pool can even offset balances in different currencies without an FX transaction. **The catch is regulatory: notional pooling is not permitted everywhere, including in parts of Africa,** so it is a question for your bank before it is a question for your treasury.",
        },
        {
          type: "table",
          columns: [{ label: "Feature" }, { label: "Physical sweeping (ZBA)" }, { label: "Notional pooling" }],
          rows: [
            ["Funds physically moved", "Yes", "No"],
            ["Intercompany loans", "May arise", "Not required"],
            ["Transfer fees", "Per sweep", "None"],
            ["Subsidiary control of cash", "Lost at day end", "Retained"],
            ["Regulatory availability", "Generally available", "Restricted in some countries"],
          ],
        },
      ],
      check: {
        question:
          "A group wants pooled interest across its subsidiaries' accounts, but each subsidiary must keep day-to-day control of its own cash. Which technique fits?",
        options: [
          "Notional pooling, because interest is computed on the combined balances without moving the funds",
          "Zero balance accounts, with every account swept to zero daily",
          "Trigger balances, sweeping above a threshold",
          "Constant balancing, sweeping above a fixed minimum",
        ],
        answer: 0,
        explain:
          "All three sweeping variants physically remove cash from subsidiary control at some point in the day. Notional pooling is the only technique that delivers pool-level interest while every account keeps its money, which is exactly the arrangement some regulators restrict.",
      },
    },
  ],
};
