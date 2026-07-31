/* BAC4301 Corporate Finance — reader course manifest.
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
 * to write if it finds one.
 */

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
  subtitle: "Investment appraisal, cost of capital, valuation and risk — BAC4301 at ZCAS.",
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
        {
          slug: "investment-appraisal",
          label: "Investment appraisal",
          children: [
            freeCashFlows,
            npvAndPayback,
            irrAndMirr,
            inflationAndTax,
            apv,
            capitalRationing,
            internationalProjects,
          ],
        },
        {
          slug: "cost-of-capital",
          label: "Cost of capital",
          children: [
            costOfEquity,
            costOfDebt,
            creditSpreads,
            wacc,
            gearing,
            capitalStructureTheories,
          ],
        },
        {
          slug: "valuation-and-ma",
          label: "Valuation and M&A",
          children: [bondValuation, companyValuation, mergersAndAcquisitions, marketEfficiency],
        },
        {
          slug: "risk-management",
          label: "Risk management",
          children: [
            interestRateRisk,
            yieldCurve,
            bondDuration,
            hedgingInterestRateRisk,
            currencyRisk,
            currencyHedging,
          ],
        },
        {
          slug: "dividend-policy",
          label: "Dividend policy",
          children: [dividendTheories, dividendPolicyInPractice],
        },
      ],
    },
  ],
};
