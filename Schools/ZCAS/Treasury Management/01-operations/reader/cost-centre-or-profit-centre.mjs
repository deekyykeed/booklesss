/* TM · The Three Levels of Treasury · Cost Centre or Profit Centre
 *
 * Split out of treasury-levels-and-mandate.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of treasury-levels-and-mandate.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "cost-centre-or-profit-centre",
  label: "Cost Centre or Profit Centre",
  title: "Cost Centre or Profit Centre",
  kicker: "The Three Levels of Treasury",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "cost-vs-profit-centre",
      heading: "Cost centre or profit centre",
      blocks: [
        {
          type: "p",
          text: "On [26 February 1995 Barings Bank collapsed](https://www.fia.org/marketvoice/articles/25-years-ago-barings-offers-hard-lesson-risk-controls). It was 233 years old. Days later it was sold to ING for one pound. One trader in Singapore, [Nick Leeson](https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/rogue-trader/), had built losses of around **£827 million** on futures positions and buried them in an [[error account|A holding account for trades that fail to settle cleanly, meant to be cleared and reconciled daily by someone other than the dealer. Left unchecked it becomes a place to park losses.]] numbered 88888 that nobody else reconciled, for roughly three years. **He dealt the trades and he settled them:** he was the [[front office|The dealers, the people who actually strike trades. The back office confirms, settles and records them. Keeping the two apart is the single most important treasury control.]] and the back office at the same time.",
        },
        {
          type: "p",
          text: "Leeson was not employed to make money by taking positions. He was there to [[arbitrage|Buying and selling the same thing in two markets at once to pocket a small price difference, with almost no risk because both legs are locked in together. It stops being arbitrage the moment one leg is left open.]] small price differences at almost no risk. Why he got so much further than that is this section's subject. It turns on a decision most owners make without noticing: what you decide treasury is actually for.",
        },
        { type: "h2", text: "Treasury as a cost centre" },
        {
          type: "p",
          text: "Most companies, and nearly every Zambian corporate, run treasury as a cost centre, a [support function that is not expected to generate profit](https://corporatefinanceinstitute.com/resources/accounting/cost-structure/), only to control what it spends. That is the safe framing, and it has one real weakness. Management starts asking what treasury costs rather than what it saves. The function gets starved of budget, staff and systems until something it was watching goes wrong. If you set the budget, that failure is yours, not the treasurer's.",
        },
        { type: "h2", text: "Treasury as a profit centre" },
        {
          type: "p",
          text: "Companies deep in global finance, currency or commodities sometimes run treasury as a profit centre, earning income by trading, hedging, and charging internal business units market rates for its services. The advantages are real. Units paying a real price learn what treasury costs the group, and the treasurer has a reason to run the desk efficiently. So are the dangers: the pull towards speculation, arguments over internal charges, higher administration costs.",
        },
        {
          type: "callout",
          kind: "warning",
          text: "A profit centre is not forbidden, and plenty of firms run one well. What Barings shows is that **the moment profit becomes the measure, treasury's controls stop being paperwork.** They become the only thing standing between your company and a trader with a losing position to hide.",
        },
      ],
      check: {
        question:
          "A company moves treasury to a profit centre and its dealers begin taking positions beyond what hedging requires. What does the Barings case say about this situation?",
        options: [
          "It is the classic warning: profit incentives without independent controls invite speculation that can destroy the firm",
          "It is healthy, because a profit centre should maximise trading income",
          "It is impossible, because profit centres cannot take positions",
          "It only matters for banks, not corporates",
        ],
        answer: 0,
        explain:
          "Barings fell because one person could deal, settle and conceal without oversight while chasing trading profit. The lesson is not that profit centres are forbidden. It is that treasury's controls stop being optional the moment profit incentives appear.",
      },
    },
  ],
};
