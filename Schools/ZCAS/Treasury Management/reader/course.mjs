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
 * `slug` values must be unique across EVERY course in the reader — grouping
 * nodes included. seed-course.mjs checks and refuses on collision.
 *
 * 2026-08-09 — THE ONE-CHECKPOINT SPLIT (S-1 revised; owner: "only one
 * checkpoint per step … a step is a small containable concept a user needs to
 * understand"). Every section became its own step: 22 steps of 60 sections are
 * now 60 steps of one section each. Each old multi-section step's name survives
 * as the folder over its parts (or its parts sit flat where the group above
 * already named them), so the sidebar tree now runs four levels deep in places:
 * course → lesson → group → folder → step. Rule S-9's ceiling moved from
 * three-or-four to four-or-five levels the same day.
 *
 * ⚠️ THIS MOVED EVERY STEP'S URL except the three getting-started ones, the
 * same way the 2026-08-03 grouping did: a path is built from every ancestor
 * node, so the new folders insert a segment and old paths 404. Every original
 * step SLUG survives on the first part of its split (S-8), so every
 * `step:` link and every re-seeded id still resolves. Checkpoint progress is
 * keyed by step, so a signed-in reader's ticks on a moved section reset; the
 * owner's standing rule ("a step being improved is the main priority … no
 * questions asked") covers both costs, and they are recorded here.
 *
 * Older history worth keeping: 2026-08-01 the six-section Treasury operations
 * step became three (S-8); 2026-08-02 nine five/six-section steps became
 * eighteen; 2026-08-03 the lessons grew a grouping level (S-9, D-6), moving 18
 * of 21 URLs; 2026-08-08 every title was rewritten under S-12 (D-17), no slug
 * touched. The "Getting Started" folder over the intro is the owner's preferred
 * shape (2026-08-08) and a deliberate exception to S-9's no-folder-for-one-step
 * rule — it holds three steps now, so the exception has expired on its own.
 */

import startHere from "../01-operations/reader/start-here.mjs";
import theDecisionsItHandsYou from "../01-operations/reader/the-decisions-it-hands-you.mjs";
import oneStepOneSitting from "../01-operations/reader/one-step-one-sitting.mjs";

import introToTreasury from "../01-operations/reader/intro-to-treasury.mjs";
import elevenFunctions from "../01-operations/reader/eleven-functions.mjs";
import treasuryLevelsAndMandate from "../01-operations/reader/treasury-levels-and-mandate.mjs";
import costCentreOrProfitCentre from "../01-operations/reader/cost-centre-or-profit-centre.mjs";
import treasuryControlsAndStructure from "../01-operations/reader/treasury-controls-and-structure.mjs";
import centralisedOrDecentralised from "../01-operations/reader/centralised-or-decentralised.mjs";

import workingCapitalAndLiquidity from "../02-working-capital/reader/working-capital-and-liquidity.mjs";
import workingCapitalPolicy from "../02-working-capital/reader/working-capital-policy.mjs";
import cashConversionCycle from "../02-working-capital/reader/cash-conversion-cycle.mjs";
import debtorsAndFactoring from "../02-working-capital/reader/debtors-and-factoring.mjs";
import factoring from "../02-working-capital/reader/factoring.mjs";
import inventoryAndCreditors from "../02-working-capital/reader/inventory-and-creditors.mjs";
import inventoryFinancing from "../02-working-capital/reader/inventory-financing.mjs";
import justInTime from "../02-working-capital/reader/just-in-time.mjs";
import orderingAndPayingSuppliers from "../02-working-capital/reader/ordering-and-paying-suppliers.mjs";
import creditorManagement from "../02-working-capital/reader/creditor-management.mjs";
import cashManagement from "../02-working-capital/reader/cash-management.mjs";
import baumolModel from "../02-working-capital/reader/baumol-model.mjs";
import millerOrrModel from "../02-working-capital/reader/miller-orr-model.mjs";
import cashForecastingAndSurpluses from "../02-working-capital/reader/cash-forecasting-and-surpluses.mjs";
import surplusesAndOverdrafts from "../02-working-capital/reader/surpluses-and-overdrafts.mjs";
import cashConcentration from "../02-working-capital/reader/cash-concentration.mjs";

import interestRateRiskManagement from "../03-risk/reader/interest-rate-risk-management.mjs";
import measuringRateExposure from "../03-risk/reader/measuring-rate-exposure.mjs";
import interestRateHedgingInstruments from "../03-risk/reader/interest-rate-hedging-instruments.mjs";
import interestRateSwaps from "../03-risk/reader/interest-rate-swaps.mjs";
import interestRateFutures from "../03-risk/reader/interest-rate-futures.mjs";
import capsFloorsCollars from "../03-risk/reader/caps-floors-collars.mjs";
import foreignExchangeRisk from "../03-risk/reader/foreign-exchange-risk.mjs";
import quotationsAndCrossRates from "../03-risk/reader/quotations-and-cross-rates.mjs";
import forwardExchangeRates from "../03-risk/reader/forward-exchange-rates.mjs";
import hedgingCurrencyRisk from "../03-risk/reader/hedging-currency-risk.mjs";
import currencyForwardsAndFutures from "../03-risk/reader/currency-forwards-and-futures.mjs";
import currencyOptions from "../03-risk/reader/currency-options.mjs";

import debtManagement from "../04-investment/reader/debt-management.mjs";
import sourcesOfDebt from "../04-investment/reader/sources-of-debt.mjs";
import theMatchingPrinciple from "../04-investment/reader/the-matching-principle.mjs";
import thePriceOfDebt from "../04-investment/reader/the-price-of-debt.mjs";
import pricingABond from "../04-investment/reader/pricing-a-bond.mjs";
import creditRatings from "../04-investment/reader/credit-ratings.mjs";
import investmentManagement from "../04-investment/reader/investment-management.mjs";
import investmentPolicy from "../04-investment/reader/investment-policy.mjs";
import buildingThePortfolio from "../04-investment/reader/building-the-portfolio.mjs";
import creditAndDiversification from "../04-investment/reader/credit-and-diversification.mjs";
import portfolioConstruction from "../04-investment/reader/portfolio-construction.mjs";

import clearingAndSettlement from "../05-systems/reader/clearing-and-settlement.mjs";
import herstatt from "../05-systems/reader/herstatt.mjs";
import grossAndNetSettlement from "../05-systems/reader/gross-and-net-settlement.mjs";
import paymentSystemsAndCcps from "../05-systems/reader/payment-systems-and-ccps.mjs";
import clsAndDvp from "../05-systems/reader/cls-and-dvp.mjs";
import zambiasPaymentSystems from "../05-systems/reader/zambias-payment-systems.mjs";
import treasuryManagementSystems from "../05-systems/reader/treasury-management-systems.mjs";
import tmsCoreFunctions from "../05-systems/reader/tms-core-functions.mjs";
import frontMiddleBackOffice from "../05-systems/reader/front-middle-back-office.mjs";
import choosingAndRunningATms from "../05-systems/reader/choosing-and-running-a-tms.mjs";
import buildOrBuy from "../05-systems/reader/build-or-buy.mjs";
import tmsPolicyAndRoi from "../05-systems/reader/tms-policy-and-roi.mjs";

export default {
  slug: "treasury-management",
  title: "Treasury Management",
  // One line under the title on the home page's course card.
  subtitle: "Cash, working capital, risk and the systems that move money.",
  // Sits after strategic management in the sidebar.
  position: 3,

  /* One root node per course. The shape below is the one-checkpoint shape:
   * where an old step's parts kept its name, the name is a folder; where the
   * group above already said it, the parts sit flat under the group. */
  tree: [
    {
      slug: "treasury-management",
      label: "Treasury Management",
      defaultOpen: true,
      children: [
        {
          slug: "getting-started-treasury",
          label: "Getting Started",
          defaultOpen: true,
          children: [startHere, theDecisionsItHandsYou, oneStepOneSitting],
        },
        /* Three separate frames — what treasury is, how its work divides, how
         * it is governed. Each old step is now the folder over its two parts. */
        {
          slug: "treasury-operations",
          label: "Treasury Operations",
          children: [
            {
              slug: "the-treasury-function",
              label: "The Treasury Function",
              children: [introToTreasury, elevenFunctions],
            },
            {
              slug: "treasury-levels",
              label: "The Three Levels of Treasury",
              children: [treasuryLevelsAndMandate, costCentreOrProfitCentre],
            },
            {
              slug: "treasury-governance",
              label: "Controls and Governance",
              children: [treasuryControlsAndStructure, centralisedOrDecentralised],
            },
          ],
        },
        {
          slug: "working-capital",
          label: "Working Capital",
          children: [
            /* The ground truth of the lesson sits flat; the families below it
             * are folders. Same pattern in Risk and Debt. */
            workingCapitalAndLiquidity,
            workingCapitalPolicy,
            cashConversionCycle,
            {
              slug: "debtors",
              label: "Debtors and Factoring",
              children: [debtorsAndFactoring, factoring],
            },
            {
              slug: "inventory-and-suppliers",
              label: "Inventory and Suppliers",
              children: [
                inventoryAndCreditors,
                inventoryFinancing,
                justInTime,
                orderingAndPayingSuppliers,
                creditorManagement,
              ],
            },
            {
              slug: "managing-cash",
              label: "Cash",
              children: [
                {
                  slug: "optimal-cash",
                  label: "Optimal Cash Balances",
                  children: [cashManagement, baumolModel, millerOrrModel],
                },
                {
                  slug: "forecasting-and-surpluses",
                  label: "Forecasting and Surpluses",
                  children: [cashForecastingAndSurpluses, surplusesAndOverdrafts, cashConcentration],
                },
              ],
            },
          ],
        },
        {
          slug: "treasury-risk",
          label: "Risk",
          children: [
            {
              slug: "interest-rates",
              label: "Interest Rates",
              children: [
                interestRateRiskManagement,
                measuringRateExposure,
                {
                  slug: "rate-hedges",
                  label: "Hedging Instruments",
                  children: [
                    interestRateHedgingInstruments,
                    interestRateSwaps,
                    interestRateFutures,
                    capsFloorsCollars,
                  ],
                },
              ],
            },
            {
              slug: "currency",
              label: "Currency",
              children: [
                foreignExchangeRisk,
                quotationsAndCrossRates,
                forwardExchangeRates,
                {
                  slug: "fx-hedges",
                  label: "Hedging the Exposure",
                  children: [hedgingCurrencyRisk, currencyForwardsAndFutures, currencyOptions],
                },
              ],
            },
          ],
        },
        {
          slug: "debt-and-investment",
          label: "Debt and Investment",
          children: [
            {
              slug: "debt",
              label: "Debt",
              children: [
                debtManagement,
                sourcesOfDebt,
                theMatchingPrinciple,
                {
                  slug: "price-of-debt",
                  label: "The Price of Debt",
                  children: [thePriceOfDebt, pricingABond, creditRatings],
                },
              ],
            },
            {
              slug: "investing",
              label: "Investing",
              children: [
                investmentManagement,
                investmentPolicy,
                {
                  slug: "the-portfolio",
                  label: "Building the Portfolio",
                  children: [buildingThePortfolio, creditAndDiversification, portfolioConstruction],
                },
              ],
            },
          ],
        },
        {
          slug: "systems-and-clearing",
          label: "Systems and Clearing",
          children: [
            {
              slug: "payments-and-clearing",
              label: "Payments and Clearing",
              children: [
                {
                  slug: "clearing",
                  label: "Clearing and Settlement",
                  children: [clearingAndSettlement, herstatt, grossAndNetSettlement],
                },
                {
                  slug: "payment-systems",
                  label: "Payment Systems",
                  children: [paymentSystemsAndCcps, clsAndDvp, zambiasPaymentSystems],
                },
              ],
            },
            {
              slug: "treasury-systems",
              label: "Treasury Systems",
              children: [
                {
                  slug: "inside-a-tms",
                  label: "Inside a TMS",
                  children: [treasuryManagementSystems, tmsCoreFunctions, frontMiddleBackOffice],
                },
                {
                  slug: "selecting-a-tms",
                  label: "Selecting a TMS",
                  children: [choosingAndRunningATms, buildOrBuy, tmsPolicyAndRoi],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
