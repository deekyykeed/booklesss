/* Corporate Finance — reader course manifest.
 *
 * The authored source of truth for this course on the reader
 * (booklesss.vercel.app). Each step is its own file inside the lesson folder it
 * belongs to, so a lesson folder still holds everything needed to understand or
 * rebuild it — the same rule the PDF build scripts follow.
 *
 * Publish flow:
 *   node --env-file=platform/.env.local platform/scripts/seed-course.mjs \
 *        "Schools/ZCAS/Corporate Finance/reader/course.mjs"
 *   cd platform && npm run gen:course     # mirrors Supabase back into the app
 *
 * `slug` values must be unique across EVERY course in the reader — the nav
 * index keys lessons by slug alone, so a collision with the economics course
 * would make one of them unreachable. seed-course.mjs checks this and refuses
 * to write if it finds one. That applies to the grouping nodes below too.
 *
 * 2026-08-03 — the lessons grew a grouping level (rule S-9, debt D-6), the same
 * pass Treasury Management had the same day. Investment appraisal and Cost of
 * capital were seven and six equal rows; both are three now.
 *
 * ⚠️ THIS CHANGED EVERY GROUPED STEP'S URL. A lesson's path is built from its
 * full ancestor trail (`courseIndex()` in `platform/src/lib/course.ts`), so a
 * folder inserts a segment:
 *
 *   /corporate-finance/risk-management/yield-curve
 *   /corporate-finance/risk-management/rates-and-bonds/yield-curve
 *
 * 21 of the 25 steps moved. No step `slug` changed (S-8), only the path it sits
 * at, and nothing in the repo referenced the old paths. See DEBT.md D-6.
 */

/* Rule S-11: every course opens with a step about the COURSE rather than
 * about its first topic. It is a sibling of the lessons, not a member of one,
 * so it sits directly under the root node and is the first thing tapped.
 * Written 2026-08-07, paying debt D-15. */
import startHere from "../01-investment/reader/start-here.mjs";
import freeCashFlows from "../01-investment/reader/free-cash-flows.mjs";
import npvAndPayback from "../01-investment/reader/npv-and-payback.mjs";
import irrAndMirr from "../01-investment/reader/irr-and-mirr.mjs";
import inflationAndTax from "../01-investment/reader/inflation-and-tax.mjs";
import apv from "../01-investment/reader/apv.mjs";
import capitalRationing from "../01-investment/reader/capital-rationing.mjs";
import internationalProjects from "../01-investment/reader/international-projects.mjs";

import costOfEquity from "../02-cost-of-capital/reader/cost-of-equity.mjs";
import costOfDebt from "../02-cost-of-capital/reader/cost-of-debt.mjs";
import creditSpreads from "../02-cost-of-capital/reader/credit-spreads.mjs";
import wacc from "../02-cost-of-capital/reader/wacc.mjs";
import gearing from "../02-cost-of-capital/reader/gearing.mjs";
import capitalStructureTheories from "../02-cost-of-capital/reader/capital-structure-theories.mjs";

import bondValuation from "../03-ma-valuation/reader/bond-valuation.mjs";
import companyValuation from "../03-ma-valuation/reader/company-valuation.mjs";
import mergersAndAcquisitions from "../03-ma-valuation/reader/mergers-and-acquisitions.mjs";
import marketEfficiency from "../03-ma-valuation/reader/market-efficiency.mjs";

import interestRateRisk from "../04-risk/reader/interest-rate-risk.mjs";
import yieldCurve from "../04-risk/reader/yield-curve.mjs";
import bondDuration from "../04-risk/reader/bond-duration.mjs";
import hedgingInterestRateRisk from "../04-risk/reader/hedging-interest-rate-risk.mjs";
import currencyRisk from "../04-risk/reader/currency-risk.mjs";
import currencyHedging from "../04-risk/reader/currency-hedging.mjs";

import dividendTheories from "../05-dividends/reader/dividend-theories.mjs";
import dividendPolicyInPractice from "../05-dividends/reader/dividend-policy-in-practice.mjs";

export default {
  slug: "corporate-finance",
  title: "Corporate Finance",
  // One line under the title on the home page's course card.
  subtitle: "Investment appraisal, cost of capital, valuation and risk.",
  // Sits after economics in the sidebar.
  position: 1,

  /* One root node per course, so the reader's combined tree shows "Corporate
   * Finance" as a single collapsible section and URLs read
   * /corporate-finance/<lesson>/<step>. */
  tree: [
    {
      slug: "corporate-finance",
      label: "Corporate Finance",
      defaultOpen: true,
      children: [
        startHere,
        {
          slug: "investment-appraisal",
          label: "Investment appraisal",
          children: [
            /* What you discount, before any method touches it. */
            freeCashFlows,
            {
              slug: "the-methods",
              label: "The methods",
              children: [npvAndPayback, irrAndMirr, apv],
            },
            {
              slug: "harder-cases",
              label: "Harder cases",
              children: [inflationAndTax, capitalRationing, internationalProjects],
            },
          ],
        },
        {
          slug: "cost-of-capital",
          label: "Cost of capital",
          children: [
            {
              slug: "equity-and-debt",
              label: "Equity and debt",
              children: [costOfEquity, costOfDebt, creditSpreads],
            },
            /* The one that combines them, so it sits between the two groups. */
            wacc,
            {
              slug: "capital-structure",
              label: "Capital structure",
              children: [gearing, capitalStructureTheories],
            },
          ],
        },
        {
          slug: "valuation-and-ma",
          label: "Valuation and M&A",
          children: [
            {
              slug: "valuation",
              label: "Valuation",
              children: [bondValuation, companyValuation],
            },
            /* Neither of these pairs with the other: one is a transaction, the
             * other is whether the price was ever right. Both stay flat. */
            mergersAndAcquisitions,
            marketEfficiency,
          ],
        },
        {
          slug: "risk-management",
          label: "Risk management",
          children: [
            /* `rates-and-bonds` / `currency-exposure` rather than the obvious
             * `interest-rates` / `currency`: Treasury Management's Risk lesson
             * took those two on 2026-08-03 and slugs are unique across every
             * course in the reader. */
            {
              slug: "rates-and-bonds",
              label: "Interest rates and bonds",
              children: [interestRateRisk, yieldCurve, bondDuration, hedgingInterestRateRisk],
            },
            {
              slug: "currency-exposure",
              label: "Currency",
              children: [currencyRisk, currencyHedging],
            },
          ],
        },
        /* Two steps. A folder over both would be a second name for the lesson
         * (S-9: a group of one is a step wearing a hat). Stays flat. */
        {
          slug: "dividend-policy",
          label: "Dividend policy",
          children: [dividendTheories, dividendPolicyInPractice],
        },
      ],
    },
  ],
};
