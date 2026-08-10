/* TM · Lesson 2 Working capital · Step 1b — Getting the cash in
 *
 * Source: 07_Working Capital_Liquidity Management PPTX 1;
 *         build_tm_2_1_working-capital.py (PDF). Worked figures kept at the
 *         lecture's originals (2/10 net 30; Mutengo Plc factoring).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `working-capital-and-liquidity`, which was
 * one five-section step. That part sizes the working capital; this part is the
 * receivables half of it. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. The discount section's 37.23% figure was the
 * buried lead of the original step, sitting four paragraphs into §4. It opens
 * this step now, because a number that surprising is what makes a reader
 * believe the arithmetic is worth following.
 *
 * 2026-08-03 — the opening was rewritten, twice wrong. Owner reading it live:
 * "there is no hook, it looks like you jump straight into explaining the step
 * … i dont even know what 2/10 means in this context."
 *
 *   1. It opened on **notation nobody had been given** — `Terms of "2/10 net 30"
 *      look like a small courtesy` — and the notation was not explained until
 *      four blocks later. That is W-13's first ban, and W-5.
 *   2. Worse, it opened **facing the wrong way**. This step is about money owed
 *      TO you, and the first sentence was about a discount YOU take from YOUR
 *      supplier. The reader had to turn the whole thing round before the third
 *      paragraph told them which side they were on.
 *
 * It now opens on one customer, one invoice and one number, names the notation
 * in the sentence that first uses it, and keeps the 37% as the payoff rather
 * than the premise. NOTE FOR SCANNERS: `2/10 net 30` contains a digit, so the
 * old opening passed the C-5 anchor check while being unreadable. A measurement
 * is not a reading.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). The check re-asked the
 * section's own worked case at the SAME figures (2/10 net 30 against 8%), with
 * the 37.23% printed in the paragraph above it and again in the winning
 * option. Numeric options were hiding a recall question. It now hands over
 * 1.5/15 net 60 against a 20% overdraft, which is deliberately a case where
 * the answer REVERSES: 12.35% is cheaper than the overdraft, so the discount
 * is declined. A second case at the same figures teaches a verdict; a second
 * case that comes out the other way teaches the method.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Getting the cash in'.
 * The old name was sentence case and ended on a bare particle. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 2 sections and now holds one: "Debtors and Cash Discounts". The other
 * section(s) moved to factoring.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "debtors-and-factoring",
  label: "Debtors and Cash Discounts",
  title: "Debtors and Cash Discounts",
  kicker: "Debtors and Factoring",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "debtor-management",
      heading: "Debtor management and cash discounts",
      blocks: [
        {
          type: "p",
          text: "A customer owes you ZMW 120,000 and will pay on day 30. You can have the money on day 10 instead, if you take ZMW 2,400 off the bill. Twenty days earlier, for two per cent.",
        },
        {
          type: "p",
          text: "Written down, that offer is \"2/10 net 30\": two per cent off if the invoice is settled inside ten days, the full amount by day thirty. It reads like a small courtesy. **Priced as what it actually is, a loan, those twenty days are worth over 37% a year.**",
        },
        {
          type: "p",
          text: "Selling on credit means waiting to be paid, and waiting costs money. This step is about the side of that where you set the terms: how much credit to give, to whom, and what to offer for early payment. The aim is the terms that make the most profit, **not the fewest days outstanding.** A business with no bad debts is usually a business turning away good customers.",
        },
        { type: "h2", text: "Knowing who deserves credit" },
        {
          type: "p",
          text: "Before the terms, the decision. The Zambian sources are bank references, trade references from a customer's existing suppliers, published [accounts](https://corporatefinanceinstitute.com/resources/accounting/accounts-receivable/), the [[Credit Reference Bureau|The national register of borrowing and repayment behaviour that lenders report into. It is the only place you can see what a customer owes people who are not you.]]'s cross-bank borrowing data, and for anyone you already trade with, your own [[sales ledger|The record of who owes you what and since when. For an existing customer it is better evidence than any reference, because it is about how they treat you specifically.]].",
        },
        { type: "h2", text: "Pricing early payment" },
        {
          type: "p",
          text: "You have seen that offer from the side that makes it. The customer receiving it sees something else: a choice between paying early at a discount or keeping the cash twenty days longer. That is a borrowing decision, and it has a formula that prices the same twenty days from either side of the invoice.",
        },
        {
          type: "formula",
          text: "Cost of not taking the discount = [D ÷ (100 − D)] × [365 ÷ (N − T)]",
          where: [
            "D = discount percentage",
            "N = net period, the days until full payment is due",
            "T = discount period, the days within which the discount applies",
          ],
        },
        {
          type: "p",
          text: "On 2/10 net 30 with short-term borrowing at 8%: the cost of forgoing the discount is [2 ÷ 98] × [365 ÷ 20] = 0.0204 × 18.25 = 37.23% a year. Paying on day 30 instead of day 10 is borrowing from your supplier at 37.23%, so the answer is to borrow from the bank at 8% and take the discount.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Always price the annual cost of forgoing a discount against your cost of short-term borrowing. If borrowing is cheaper, take the discount. **37.23% against 8% is not a close call.**",
        },
        {
          type: "callout",
          kind: "example",
          text: "Price a different offer before you read on, because they do not all come out the same way. A supplier offers 1.5/15 net 60 and your overdraft costs 20% a year. Work the annual cost of letting the discount go, then say what you would do. The formula punishes two habits: the discount comes off what you actually pay, not off 100, and the days you are buying are the ones *between* the two dates.",
        },
      ],
      check: {
        question:
          "What does forgoing a 1.5/15 net 60 discount cost, on an annual basis?",
        options: [
          "About 12.35%",
          "About 12.17%",
          "About 9.26%",
          "About 1.52%",
        ],
        answer: 0,
        explain:
          "[1.5 ÷ 98.5] × [365 ÷ 45] = 0.015228 × 8.111 = **12.35%** a year. And notice where that leaves you: 12.35% is CHEAPER than the 20% overdraft, so here you keep the 45 days and let the discount go. That is the opposite of the 2/10 net 30 answer above. The formula decides it, not the reflex. About 12.17% divides by 100 instead of by the 98.5 you would actually pay, which flatters every discount slightly. About 9.26% uses the 60-day net period instead of the 45 days of credit being bought. About 1.52% never annualises, and would have you turn down free money.",
      },
    },
  ],
};
