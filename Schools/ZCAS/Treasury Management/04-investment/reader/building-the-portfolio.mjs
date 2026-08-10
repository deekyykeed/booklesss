/* TM · Lesson 4 Debt and investment · Step 2b — Instruments, credit risk and the portfolio
 *
 * Source: 12_Investment Management PPTX; build_tm_4_2_investment-management.py
 *         (PDF). Portfolio worked example kept at the lecture's figures
 *         (ZMW 5m across four tranches, blended 13.4%).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8) from `investment-management`, which was one
 * five-section step. That part is the rules; this part is the portfolio built
 * under them. Coverage is identical; nothing was cut.
 *
 * 2026-08-02 W-13 after the split. Openings re-read cold: the safety, liquidity
 * and yield hierarchy is named in full here on first use rather than referred
 * back to, because a reader arriving from the sidebar has not read the other
 * half.
 *
 * The §3 instruments paragraph was one 50-word sentence carrying four separate
 * instruments (W-12). It is a list now.
 *
 * 2026-08-08, paying D-13 (C-9) and D-12 (E-10). §3 worked a four-tranche
 * portfolio to a 13.4% blended yield and then asked why one tranche sat where
 * it did, which the table's own 'Need' column answers. It now hands over a
 * portfolio to build and blend. 13.29% is the distractor worth having: it drops
 * the call-deposit reserve out of the denominator, which is tempting because a
 * reserve reads as idle cash rather than as part of the portfolio, and it
 * flatters the reported yield every time.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Instruments, credit risk and the portfolio'.
 * The old name was sentence case and did not name the topic the way the paper does. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "The Money Market Instruments". The other
 * section(s) moved to credit-and-diversification.mjs, portfolio-construction.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "building-the-portfolio",
  label: "The Money Market Instruments",
  title: "The Money Market Instruments",
  kicker: "Building the Portfolio",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "instruments",
      heading: "The instruments",
      blocks: [
        {
          type: "p",
          text: "Through the inflation fight of 2023 and 2024, Zambian [treasury bills](https://corporatefinanceinstitute.com/resources/fixed-income/treasury-bills-t-bills/) yielded in the mid-20s. **For a while the safest kwacha instrument in the country was also the best paying one.** That is not how any of this is supposed to work, and it is worth remembering before you assume a rate sheet will behave.",
        },
        {
          type: "p",
          text: "Normally the ranking holds: safety costs yield. Under a year, the liquid low-risk core of a treasury portfolio looks like this.",
        },
        {
          type: "ul",
          items: [
            "Treasury bills, issued by the Bank of Zambia for 91, 182 or 364 days at a discount to face value. The safest and most liquid kwacha investment there is.",
            "Call deposits, paying interest with near-instant access. You pay for that access in the rate.",
            "Term deposits of 30 to 120 days. Better rates for locked money, and penalties for getting it back early.",
            "Money market funds, [pooled and professionally managed](https://corporatefinanceinstitute.com/resources/economics/money-market/), withdrawable at [[net asset value|What one unit of the fund is worth today: everything the fund holds, valued at market, divided by the units in issue. You get the day's number, not a rate agreed in advance.]]. Still young in Zambia and growing.",
          ],
        },
        { type: "h2", text: "Going out further" },
        {
          type: "p",
          text: "One to five years means bonds, government or corporate, paying regular coupons. The extra yield is buying interest rate risk, because bond prices move opposite to rates. **That risk only bites if you have to sell before maturity:** a bond held to the end delivers the yield you bought it at, wherever its price wandered in between.",
        },
        {
          type: "formula",
          text: "YTM: the discount rate at which a bond's price equals its future cash flows",
          where: [
            "Bought at par: YTM = coupon rate, so an 8% coupon on ZMW 1,000,000 face yields 8%",
            "Bought at a discount, say 950,000: YTM is above 8%, because the lower price raises the return",
            "Bought at a premium, say 1,050,000: YTM is below 8%",
          ],
        },
        {
          type: "p",
          text: "Bonds are quoted and compared on [yield to maturity](https://corporatefinanceinstitute.com/resources/fixed-income/yield-to-maturity-ytm/) rather than price. **It folds the coupon, the price you paid and the time left into one number.** That is the only form in which a bond can be set beside a bill rate and a deposit rate on the same screen.",
        },
      ],
      check: {
        question:
          "Treasury holds a 3-year bond it intends to keep to maturity. Rates rise and the bond's market price drops 6%. What has the portfolio actually lost?",
        options: [
          "Nothing in cash terms, because held to maturity the bond still delivers its purchase yield, and the fall only matters if it must be sold early",
          "6% of the principal, permanently",
          "The coupons, which stop when prices fall",
          "Its investment-grade status",
        ],
        answer: 0,
        explain:
          "Price risk on a bond is only realised by selling. The cash flows, meaning the coupons plus the face value, are unchanged, so a hold-to-maturity investor earns exactly the yield they bought. The real constraint is liquidity: the plan to hold has to survive the company's need for cash, which is why maturity limits exist.",
      },
    },
  ],
};
