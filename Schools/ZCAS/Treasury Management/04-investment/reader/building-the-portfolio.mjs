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
 */

export default {
  slug: "building-the-portfolio",
  label: "Credit Risk and the Portfolio",
  title: "Credit Risk and the Portfolio",
  kicker: "Debt and Investment",

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

    /* ---------------------------------------------------------------- */
    {
      id: "credit-and-diversification",
      heading: "Credit risk and diversification",
      blocks: [
        {
          type: "p",
          text: "Placing a surplus is lending. **You are the bank now,** and the question a bank asks about every borrower is the one you now have to ask about every place your money sits.",
        },
        {
          type: "p",
          text: "Everything that is not government paper carries [credit risk](https://corporatefinanceinstitute.com/resources/commercial-lending/credit-risk/), meaning the chance the issuer does not pay. A government bond in a stable country carries almost none, a bank deposit carries that bank's solvency, and a corporate bond carries whatever its rating says it does. Because safety outranks yield, the policy caps this two ways.",
        },
        {
          type: "ul",
          items: [
            "Counterparty limits. No more than a set share of investable cash with any one [[counterparty|Whoever is on the other side of the deal and owes you the money back: the bank holding your deposit, the company whose bond you bought. Their failure is your loss, however sound the instrument looked.]], say 20% with one bank. No corporate paper below a set rating. No single issuer above a fixed amount.",
            "Diversification. [Spread across instruments and issuers](https://corporatefinanceinstitute.com/resources/economics/diversification/). Half in T-bills, 30% in call deposits across three banks, 20% in short-dated corporate bonds is diversified. All of it in one bank's certificate of deposit is a single point of failure wearing a good rate.",
          ],
        },
        {
          type: "p",
          text: "**No borrower deserves the whole book, however sound they look,** and the policy assumes a bank can fail so that you never have to be the person who predicted it correctly.",
        },
      ],
      check: {
        question:
          "A treasurer places the entire ZMW 8 million surplus with one bank because it offered 1% more than any rival. What principle was broken?",
        options: [
          "Counterparty concentration, because the whole surplus now depends on one institution's solvency, for 1% of extra yield",
          "None, because the best rate is the correct choice",
          "Maturity matching, because all deposits must have different terms",
          "The safety hierarchy is unaffected, because banks cannot fail",
        ],
        answer: 0,
        explain:
          "One institution holding everything turns a diversifiable risk into an existential one, which is exactly what counterparty limits exist to prevent. The extra 1% is no compensation if the bank fails, and banks do fail.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "portfolio-construction",
      heading: "Constructing the portfolio",
      blocks: [
        {
          type: "p",
          text: "Two million is needed in three months for tax. One and a half million in six months for a dividend. The rest can stay for the year. **That schedule builds the portfolio, not the rate sheet.**",
        },
        {
          type: "p",
          text: "Three standard shapes organise maturities. [Laddering spreads equal amounts](https://corporatefinanceinstitute.com/resources/fixed-income/bond-ladder/) across 1, 3, 6 and 12 months and rolls each maturing rung out to the far end, so there is always cash arriving. A bullet puts everything on one future date to meet one known need. A barbell splits between very short and long, say 60% in 30-day deposits and 40% in 3-year bonds, taking liquidity and yield at once with a view on rates deciding the split.",
        },
        {
          type: "p",
          text: "The lecture's manufacturer holds ZMW 5 million against exactly the schedule above, keeping ZMW 500,000 back as a standing reserve.",
        },
        {
          type: "table",
          columns: [
            { label: "Tranche" },
            { label: "Need" },
            { label: "Instrument" },
            { label: "Rate", align: "right" },
            { label: "Annual yield, ZMW", align: "right" },
          ],
          rows: [
            ["500,000", "Immediate reserve", "Call deposit", "10%", "50,000"],
            ["2,000,000", "Tax in 3 months", "91-day T-bill", "13%", "260,000"],
            ["1,500,000", "Dividend in 6 months", "182-day T-bill", "14%", "210,000"],
            ["1,000,000", "Free for 12 months", "1-year government bond", "15%", "150,000"],
          ],
          total: ["5,000,000", "", "", "", "670,000"],
          note: "Blended yield 670,000 ÷ 5,000,000 = 13.4%, with every cash need matched by a maturity.",
        },
        {
          type: "p",
          text: "Every tranche matures on the date its money is wanted, so nothing is ever sold early and nothing sits idle. **That table is the whole safety, liquidity and yield hierarchy, written out as four rows.**",
        },
        {
          type: "p",
          text: "Judge it afterwards against a [[benchmark|A reference return built from market rates in the same proportions as your own portfolio. Comparing against one is how you tell a good year for you from a good year for everyone.]] weighted the same way, comparing total return against what that mix of market rates actually delivered. A large gap either way deserves the same question: was that skill, or was it risk the policy never intended you to take?",
        },
        {
          type: "callout",
          kind: "example",
          text: "Price a portfolio of your own. A distributor has ZMW 8 million of surplus and four calls on it. ZMW 1 million must stay instantly available, on call at 9%. ZMW 3 million meets a VAT bill in three months, in a 91-day bill at 12%. ZMW 2 million funds a dividend in six months, in a 182-day bill at 13.5%. The last ZMW 2 million is free for the year, in a 1-year bond at 15%. Work the blended yield on the whole ZMW 8 million. The reserve is part of the portfolio, and so is the fact that the tranches are different sizes.",
        },
      ],
      check: {
        question:
          "What blended yield does that ZMW 8 million portfolio earn: 1m on call at 9%, 3m at 12%, 2m at 13.5%, 2m at 15%?",
        options: [
          "12.75%",
          "12.38%",
          "13.29%",
          "15.00%",
        ],
        answer: 0,
        explain:
          "Take each tranche's own return and add them: 90,000 + 360,000 + 270,000 + 300,000 = ZMW 1,020,000, over ZMW 8,000,000, is **12.75%**. 12.38% is the plain average of the four rates, which quietly gives the ZMW 1 million reserve the same weight as the ZMW 3 million tax tranche. 13.29% drops the call deposit out of the denominator, and it is the most tempting slip. The reserve looks like idle cash rather than an investment, but it is money the portfolio is holding, and reporting a yield without it flatters the whole thing. 15% is the best rate in the table, which is only what the portfolio earns if the schedule is ignored. Then the VAT falls due with nothing matured to pay it.",
      },
    },
  ],
};
