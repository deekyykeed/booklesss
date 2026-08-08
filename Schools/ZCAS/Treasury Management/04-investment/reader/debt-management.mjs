/* TM · Lesson 4 Debt and investment · Step 1a — Where debt comes from, and how long it should run
 *
 * Source: 11_Debt Management PPTX; build_tm_4_1_debt-management.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-02 split (rule S-8). This was one six-section step. The seam is
 * between where the money comes from (the function, the five sources, and how
 * long each should run) and what it costs you (covenants, bond pricing,
 * ratings). Coverage is identical; nothing was cut. This part keeps the
 * `debt-management` slug because that URL exists; the other half is
 * `the-price-of-debt`.
 *
 * 2026-08-02 quality pass, paying D-1, D-2, D-3 and D-4's jargon half.
 * Engagement (D-1): all three sections opened on a definition. They now open on
 * why cheap money is cheap, on what a Zambian case is actually telling you when
 * it does not name the lender, and on the fifteen-years-against-ninety-days
 * mismatch.
 *
 * 2026-08-02 S-6/W-13: §3 closed by naming "the aggressive and conservative
 * financing policies from the working capital lesson". A reader who has not
 * read that lesson cannot use the sentence, so the two policies are described
 * where they are mentioned instead of pointed at.
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Where debt comes from, and how long it should run'.
 * The old name was sentence case and carried the hedged `, and how/what…` tail that 13 of this course's
 * 22 titles shared. The slug is
 * untouched, so no URL moved.
 */

export default {
  slug: "debt-management",
  label: "Debt Sources and Maturity",
  title: "Debt Sources and Maturity",
  kicker: "Debt and Investment",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "the-function",
      heading: "The debt management function",
      blocks: [
        {
          type: "p",
          text: "Short money is cheaper. A ninety-day facility at 26% against a five-year loan at 32% is six points a year you keep. **It is cheaper because the lender only has to be there for ninety days,** and the day you most need them to still be there is precisely the day they least want to be.",
        },
        {
          type: "p",
          text: "Debt, alongside equity, is where the cash for [working capital](https://corporatefinanceinstitute.com/resources/accounting/working-capital-cycle/), expansion and equipment comes from, and its cost moves with the source, the term and how good your credit looks. Managing that cost is a treasury function with three jobs, and you cannot do one of them properly while ignoring the others:",
        },
        {
          type: "ul",
          items: [
            "Minimise the cost of borrowing across every source and maturity.",
            "Manage the risks the debt itself creates: refinancing risk, interest rate risk, currency risk.",
            "Keep access to credit open, at rates you can live with.",
          ],
        },
        {
          type: "p",
          text: "**The trade-off running through all three is cost against risk,** and the cheaper source usually carries the bigger danger. Every decision in this lesson is a position you are taking on that, whether you take it deliberately or by default.",
        },
      ],
      check: {
        question:
          "A treasurer refinances all the company's debt into the cheapest available facility: 90-day paper rolled over continuously. What has been optimised, and what ignored?",
        options: [
          "Cost was minimised while refinancing risk was ignored, because every 90 days the company bets that lenders will still be there",
          "Both cost and risk were optimised, because cheapest is safest",
          "Risk was minimised at the expense of cost",
          "Access to credit was maximised, which covers all three jobs",
        ],
        answer: 0,
        explain:
          "Short paper is cheap precisely because the lender commits for almost no time, which transfers the commitment problem to the borrower. Debt management is all three jobs at once, and a structure that wins on cost while maximising rollover exposure has failed the other two.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "sources",
      heading: "The sources of debt",
      blocks: [
        {
          type: "p",
          text: "If a Zambian case tells you a company borrowed and does not say how, **it borrowed from a bank.** Bank debt dominates corporate borrowing here, the government issues bonds regularly in kwacha and dollars, and shallow capital markets keep corporate bonds uncommon and commercial paper rare.",
        },
        {
          type: "p",
          text: "That is the local weighting. The full list is five, and which one fits depends on the amount, the duration, your credit standing and the state of the market.",
        },
        {
          type: "table",
          columns: [{ label: "Source" }, { label: "What it is" }, { label: "Character" }],
          rows: [
            [
              "Bank loans",
              "Secured or unsecured lending, fixed or variable rate, from overdrafts and short loans to 5-year facilities",
              "The workhorse, and most corporate debt. Secured loans price lower",
            ],
            [
              "Bonds and debentures",
              "Long-term securities sold to investors: principal at maturity, coupon at intervals, 3 to 20 years",
              "Prices move inversely to interest rates, and a secondary market gives investors an exit",
            ],
            [
              "Commercial paper",
              "Unsecured short-term notes, 1 to 270 days and usually 30 to 90, issued at a discount",
              "The cheapest short money, but for blue-chip issuers only, and it rolls over constantly",
            ],
            [
              "Leasing",
              "Use of equipment for rent: operating leases are short and flexible, finance leases are purchase on credit",
              "No upfront capital, and obsolescence and residual-value risk sit with the lessor",
            ],
            [
              "Hire purchase",
              "Instalment buying, where the financier owns the asset until the final payment transfers it",
              "Equipment finance for firms below bond or commercial paper scale",
            ],
          ],
        },
        {
          type: "p",
          text: "Two of these price off what happens if you fail. A [[secured|Backed by a specific asset the lender can take and sell if you do not repay. It is why secured borrowing is cheaper, and why the asset you pledged is no longer really available to you.]] loan is cheaper than an unsecured one, and [commercial paper](https://corporatefinanceinstitute.com/resources/fixed-income/commercial-paper/) is cheapest of all because it is issued only by names the market already trusts. **You do not choose the cheap sources. You qualify for them.**",
        },
        {
          type: "p",
          text: "Two of the words in that table are worth pinning down. A [[debenture|A bond backed by the borrower's general creditworthiness rather than by a named asset. The word gets used loosely for corporate bonds generally, and the distinction that matters is whether anything specific secures it.]] is not the same thing as a secured bond, and the [[residual value|What an asset is expected to be worth at the end of a lease. Under an operating lease the lessor is the one guessing at it, which is exactly what you are paying them to do.]] on a lease is the number that decides whether leasing was cheaper than buying.",
        },
      ],
      check: {
        question:
          "A large, highly rated company needs ZMW 40 million for 60 days at the lowest possible cost. Which source fits?",
        options: [
          "Commercial paper, because it is short-term, discount-priced and cheaper than bank loans for blue-chip issuers",
          "A 10-year bond, because the secondary market makes it effectively short-term",
          "Hire purchase, because instalments spread the cost",
          "A finance lease on its factory",
        ],
        answer: 0,
        explain:
          "This is commercial paper's exact niche: very short unsecured borrowing by companies whose name alone carries the credit, priced below bank facilities. The bond mismatches the term entirely, and leasing and hire purchase are equipment products rather than general funding.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "matching",
      heading: "Short against long, and the matching principle",
      blocks: [
        {
          type: "p",
          text: "A factory lasts fifteen years. A ninety-day loan lasts ninety days. **Every gap between those two numbers is a bet, and you place it again at every rollover.**",
        },
        {
          type: "p",
          text: "The matching principle is one line: borrow for as long as you need the thing you are buying. Short-term assets financed short, long-term assets financed long. Each side has a case for it and a price attached.",
        },
        /* Was a 3x3 comparison matrix (E-9, D-5). The two kinds being compared
         * were the columns, not the rows, so as cards each one is read whole
         * instead of across: what it is for, what it buys, what it costs. The
         * marks are the time-horizon axis the section is actually about, a
         * calendar against the long game. */
        {
          type: "cards",
          cards: [
            {
              icon: "calendar",
              title: "Short-term debt",
              lead: "Working capital, seasonal needs, temporary shortfalls",
              text: "Cheaper, because the yield curve usually slopes up, and flexible enough to follow working capital's rhythm. What you carry is refinancing risk at every maturity, a rate that may have risen by renewal, and an overdraft the bank can cancel at will.",
            },
            {
              icon: "chess",
              title: "Long-term debt",
              lead: "Capital expenditure and fixed assets",
              text: "Funds locked for the term, so there is no refinancing risk and the borrowing lasts as long as the asset does. What you pay for that is a higher rate, a penalty for repaying early, and a commitment that may outlive the need.",
            },
          ],
        },
        {
          type: "p",
          text: "Breaking the principle costs you in both directions. Fund a plant with 90-day paper and you re-run the refinancing gamble forty times over the asset's life. Fund seasonal inventory with a 10-year loan and you pay long-term rates on money that sits idle for most of the year, when a [revolving facility](https://corporatefinanceinstitute.com/resources/commercial-lending/revolving-credit-facility/) would have cost you only what you drew.",
        },
        {
          type: "callout",
          kind: "key",
          text: "**Matching is the default, and departing from it is a policy rather than an accident.** Funding permanent assets with short-term debt is the aggressive position, cheaper and exposed at every renewal. Funding everything long is the conservative one, safer and dearer. Pick knowingly.",
        },
      ],
      check: {
        question:
          "A company funds a 15-year processing plant entirely with rolling 6-month bank loans because \"short rates are lower\". What risk has it taken?",
        options: [
          "Thirty consecutive refinancings, each at whatever rate and credit conditions then prevail, which is a maturity mismatch against the matching principle",
          "None, because cheaper funding is always the right choice",
          "Only currency risk, if the loans are in dollars",
          "The plant may wear out before the loans do",
        ],
        answer: 0,
        explain:
          "The asset's life is fixed and the funding's is not. Each rollover reprices the debt and re-tests the company's access to credit, and one refused renewal mid-life leaves a half-financed plant. The rate saving is real: it is the compensation for carrying exactly this risk.",
      },
    },
  ],
};
