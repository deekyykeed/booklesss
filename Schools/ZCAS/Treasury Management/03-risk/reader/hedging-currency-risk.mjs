/* TM · Lesson 3 Risk · Step 2b — Hedging currency risk
 *
 * Source: 10_Foreign Exchange Risk Management PPTX;
 *         build_tm_3_2_fx-risk.py (PDF). Worked figures kept at the lecture's
 *         originals (USD 500,000 forward hedge at 13.00; XYZ Ltd futures hedge
 *         at 42 contracts).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `foreign-exchange-risk`, which was one
 * six-section step. That part is the risk and the price of a currency; this
 * part is what you do about it. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. Every opening was re-read cold, and the
 * forward-hedge section had to be rebuilt: it opened "Sell USD 500,000 forward
 * at 13.00…", which leans on a rate derived in the other half. The exposure and
 * the bank's offer are now stated in the sentence itself, so the section stands
 * on its own for a reader who arrived from the sidebar or a shared link.
 *
 * The original §5 opening also read "…like the FRA in the previous step", a
 * pointer across a step boundary. It is gone, and the comparison between
 * binding and optional cover is made inside this step.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). §2 worked the XYZ futures
 * hedge to the kwacha and then asked WHY the tail was left unhedged, so the
 * contract arithmetic was demonstrated and never required. It now hands over a
 * second hedge; the check turns on the two decisions that actually carry it,
 * which way you deal and which way you round. The loss option is not a
 * nonsense number: it is what an exporter gets for buying futures instead of
 * selling them, and it is the same magnitude, so only the reasoning separates
 * them. The standardisation insight the old check tested is kept in the explain.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Hedging currency risk'.
 * The old name was sentence case and did not name the topic the way the paper does. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "Operational Hedges". The other
 * section(s) moved to currency-forwards-and-futures.mjs, currency-options.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "hedging-currency-risk",
  label: "Operational Hedges",
  title: "Operational Hedges",
  kicker: "Hedging the Exposure",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "operational-hedges",
      heading: "Hedging without instruments",
      blocks: [
        {
          type: "p",
          text: "The cheapest protection you will ever run costs nothing, needs no bank and never expires: **buy your inputs in the currency your customers pay you in.** Five operational moves shrink a currency exposure before you pay anyone to cover it, in rising order of sophistication.",
        },
        {
          type: "ul",
          items: [
            "Insist on kwacha payment. The simplest move, and it shifts all the risk to the other side. A dominant firm can enforce it. A smaller one loses the deal to a rival who will take dollars.",
            "Currency surcharges. Invoice in kwacha with a clause adding a surcharge if the rate moves beyond an agreed band, so the risk is shared rather than held.",
            "Leading and lagging. Collect receivables early in currencies you expect to weaken and delay [[payables|Money you owe suppliers for goods already received: their invoices, sitting unpaid. The mirror of receivables, and the cheapest funding you have while it sits.]] in them. Useful, and be honest about what it is: a position on the currency, wearing operational clothes.",
            "Natural hedging. Match currency inflows with outflows, so a firm earning dollars from exports sources its inputs in dollars and the two move together. The cheapest durable [hedge](https://corporatefinanceinstitute.com/resources/derivatives/hedging/) there is.",
            "Netting. Two companies owing each other dollars [settle only the difference](https://corporatefinanceinstitute.com/resources/economics/netting/). Groups run [multilateral netting](https://treasurytoday.com/cash-management/netting/) through one centre, collapsing intercompany flows and the conversion cost on every one of them.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          text: "Operational hedges cost little and never expire. **The instruments that follow are for the exposure that survives them,** not a substitute for doing this first.",
        },
      ],
      check: {
        question:
          "A Zambian exporter earns most of its revenue in dollars and currently buys all inputs locally in kwacha. Which operational hedge attacks its exposure most directly?",
        options: [
          "Natural hedging, so sourcing inputs in dollars makes the currency's moves hit costs and revenues together",
          "Leading and lagging, to collect the dollars faster",
          "Netting, to offset the dollars against other subsidiaries",
          "A currency surcharge on its kwacha suppliers",
        ],
        answer: 0,
        explain:
          "The firm's whole exposure is a one-way dollar inflow. Creating a matching dollar outflow makes it cancel structurally, every month, with no premium and no rollover. Leading and lagging only re-times the risk, and there are no offsetting intercompany flows here to net.",
      },
    },
  ],
};
