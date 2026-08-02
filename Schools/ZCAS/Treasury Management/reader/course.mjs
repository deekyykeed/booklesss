/* Treasury Management — reader course manifest.
 *
 * The authored source of truth for this course on the reader
 * (booklesss.vercel.app). Each step is its own file inside the lesson folder it
 * belongs to, so a lesson folder still holds everything needed to understand or
 * rebuild it — the same rule the PDF build scripts follow.
 *
 * Publish flow:
 *   node --env-file=platform/.env.local platform/scripts/seed-course.mjs \
 *        "Schools/ZCAS/Treasury Management/reader/course.mjs"
 *   cd platform && npm run gen:course     # mirrors Supabase back into the app
 *
 * `slug` values must be unique across EVERY course in the reader — note the
 * risk steps deliberately avoid Corporate Finance's `interest-rate-risk`,
 * `hedging-interest-rate-risk` and `currency-risk` slugs. seed-course.mjs
 * checks and refuses on collision.
 */

/* Treasury operations was one six-section step until 2026-08-01; it is three
 * now (rule S-8). The first keeps the `intro-to-treasury` slug, so the URL that
 * was already linked to still opens the course. */
import introToTreasury from "../01-operations/reader/intro-to-treasury.mjs";
import treasuryLevelsAndMandate from "../01-operations/reader/treasury-levels-and-mandate.mjs";
import treasuryControlsAndStructure from "../01-operations/reader/treasury-controls-and-structure.mjs";

/* 2026-08-02: the remaining nine steps were split the same way (S-8). Each was
 * five or six sections, which is a climb rather than a sitting. Every original
 * slug is kept on the first part of its pair, so no existing URL breaks. */
import workingCapitalAndLiquidity from "../02-working-capital/reader/working-capital-and-liquidity.mjs";
import debtorsAndFactoring from "../02-working-capital/reader/debtors-and-factoring.mjs";
import inventoryAndCreditors from "../02-working-capital/reader/inventory-and-creditors.mjs";
import orderingAndPayingSuppliers from "../02-working-capital/reader/ordering-and-paying-suppliers.mjs";
import cashManagement from "../02-working-capital/reader/cash-management.mjs";
import cashForecastingAndSurpluses from "../02-working-capital/reader/cash-forecasting-and-surpluses.mjs";

import interestRateRiskManagement from "../03-risk/reader/interest-rate-risk-management.mjs";
import interestRateHedgingInstruments from "../03-risk/reader/interest-rate-hedging-instruments.mjs";
import foreignExchangeRisk from "../03-risk/reader/foreign-exchange-risk.mjs";
import hedgingCurrencyRisk from "../03-risk/reader/hedging-currency-risk.mjs";

import debtManagement from "../04-investment/reader/debt-management.mjs";
import thePriceOfDebt from "../04-investment/reader/the-price-of-debt.mjs";
import investmentManagement from "../04-investment/reader/investment-management.mjs";
import buildingThePortfolio from "../04-investment/reader/building-the-portfolio.mjs";

import clearingAndSettlement from "../05-systems/reader/clearing-and-settlement.mjs";
import paymentSystemsAndCcps from "../05-systems/reader/payment-systems-and-ccps.mjs";
import treasuryManagementSystems from "../05-systems/reader/treasury-management-systems.mjs";
import choosingAndRunningATms from "../05-systems/reader/choosing-and-running-a-tms.mjs";

export default {
  slug: "treasury-management",
  title: "Treasury Management",
  // One line under the title on the home page's course card.
  subtitle: "Cash, working capital, risk and the systems that move money.",
  // Sits after strategic management in the sidebar.
  position: 3,

  /* One root node per course, so the reader's combined tree shows "Treasury
   * Management" as a single collapsible section and URLs read
   * /treasury-management/<lesson>/<step>. */
  tree: [
    {
      slug: "treasury-management",
      label: "Treasury Management",
      defaultOpen: true,
      children: [
        {
          slug: "treasury-operations",
          label: "Treasury operations",
          children: [introToTreasury, treasuryLevelsAndMandate, treasuryControlsAndStructure],
        },
        {
          slug: "working-capital",
          label: "Working capital",
          children: [
            workingCapitalAndLiquidity,
            debtorsAndFactoring,
            inventoryAndCreditors,
            orderingAndPayingSuppliers,
            cashManagement,
            cashForecastingAndSurpluses,
          ],
        },
        {
          slug: "treasury-risk",
          label: "Risk",
          children: [
            interestRateRiskManagement,
            interestRateHedgingInstruments,
            foreignExchangeRisk,
            hedgingCurrencyRisk,
          ],
        },
        {
          slug: "debt-and-investment",
          label: "Debt and investment",
          children: [debtManagement, thePriceOfDebt, investmentManagement, buildingThePortfolio],
        },
        {
          slug: "systems-and-clearing",
          label: "Systems and clearing",
          children: [
            clearingAndSettlement,
            paymentSystemsAndCcps,
            treasuryManagementSystems,
            choosingAndRunningATms,
          ],
        },
      ],
    },
  ],
};
