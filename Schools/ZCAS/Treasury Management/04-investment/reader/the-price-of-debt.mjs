/* TM · Lesson 4 Debt and investment · Step 1b — What debt costs, and what it demands
 *
 * Source: 11_Debt Management PPTX; build_tm_4_1_debt-management.py (PDF).
 *
 * Correction (per E-7): the PDF's bond worked example priced a 12% coupon at a
 * 14% yield ABOVE par (K1,001,100) via a wrong final discount factor.
 * (1,120,000 ÷ 1.14⁵) is 581,690, not 651,451. The correct price is
 * ZMW 931,334 on the rounded rows below, a discount, which is also what the
 * theory requires when the yield is above the coupon.
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `debt-management`, which was one six-section
 * step. That part is where the money comes from; this part is what it costs and
 * what it ties you to. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. Two cross-lesson pointers were removed
 * rather than repaired: §5 ended "duration from the previous lesson applies
 * here directly", and §6 explained the AAA-against-BBB rate gap by naming a
 * swap example told in another lesson. Both now say the thing itself, because a
 * reader arriving here has read neither.
 *
 * Discipline (C-11): QUANTITATIVE. The paper asks for a price, shown.
 *
 * 2026-08-07, the first step written against C-8's link rule, C-9, E-8's
 * popup-off clause and E-10:
 *  · C-9  §2 worked a bond and then asked a recall question about it, so a
 *         reader finished able to follow the method and unable to start one.
 *         It now hands over a second bond at different figures and the check
 *         marks it. The three wrong options are the three real slips:
 *         discounting at the coupon rate (which returns par exactly, and is
 *         why that slip is invisible), dropping the redemption, and leaving
 *         the coupons undiscounted. The price/yield inverse the old check
 *         tested is not lost, it is now something the reader proves rather
 *         than recalls.
 *  · E-10 both callouts name their kind. Every callout in all 53 steps was
 *         drawing "Key point" because none of them set one.
 *  · E-8  PBIT and `par` are defined in the prose now the popup is off. Both
 *         were load-bearing: the sentences around them do not survive not
 *         knowing the word. `notch` and `covenant headroom` are explained by
 *         their own sentences and keep the mark alone.
 *  · C-8  two links out, both backward. No forward links: the sidebar and the
 *         foot of the step already carry what comes next.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'What debt costs, and what it demands'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared, and opened on a question word. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "Loan Covenants". The other
 * section(s) moved to pricing-a-bond.mjs, credit-ratings.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "the-price-of-debt",
  label: "Loan Covenants",
  title: "Loan Covenants",
  kicker: "The Price of Debt",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "covenants",
      heading: "Loan covenants",
      blocks: [
        {
          type: "p",
          text: "You have paid every instalment on time, in full, for four years. **You are in default.**",
        },
        {
          type: "p",
          text: "A [covenant](https://corporatefinanceinstitute.com/resources/commercial-lending/debt-covenants/) is a condition the lender writes into the loan to protect its repayment, and breaking one is a breach whether or not a payment was missed. They come in two kinds.",
        },
        {
          type: "ul",
          items: [
            "Affirmative covenants say what you must do: hold minimum working capital or current ratios, keep interest cover above a floor, deliver statements on time, insure the financed assets, pay your taxes. Cover is profit before interest and tax, [[PBIT|The profit line lenders watch, because it is what the business earns before the debt is served. Everything below it in the accounts is paid out of money the lender has first claim on.]], divided by the interest bill, so cover of 3 times means you earn three kwacha for every one you owe in interest.",
            "Restrictive covenants say what you cannot do without consent: take on further debt beyond a set level, sell the financed assets, pay a dividend that breaks a gearing ratio, or change what the business does.",
          ],
        },
        {
          type: "p",
          text: "A breach can trigger default and give the lender the right to demand the money back immediately, **which turns interest cover slipping from 3.2 times to 2.8 into a cash crisis in a week.** That is why treasury watches [[covenant headroom|How far a ratio is from the level that would breach the loan. It is a number you can forecast months ahead, which is the whole point of tracking it: a breach seen early is a conversation, and a breach discovered late is a demand for repayment.]] as closely as it watches cash.",
        },
        {
          type: "callout",
          kind: "key",
          text: "**Covenants are the price of the interest rate.** The more tightly the lender's risk is boxed in, the cheaper the money. Flexibility is what you are selling to buy a lower rate, so know what you sold.",
        },
      ],
      check: {
        question:
          "A loan requires interest cover of at least 3.0 times. A bad year drops the company's cover to 2.6, though every payment has been made on time. What is the company's position?",
        options: [
          "In technical default, so the lender can call the loan even though no payment was missed",
          "Fine, because covenants only bind if a payment is missed",
          "The covenant automatically resets to 2.6",
          "The lender must lower the interest rate to compensate",
        ],
        answer: 0,
        explain:
          "Covenants are conditions of the loan, not just a payment schedule. Falling below the ratio is a breach in itself, which gives the lender the right to demand repayment or to charge for waiving it. Watching the headroom before it breaks is the discipline this tests.",
      },
    },
  ],
};
