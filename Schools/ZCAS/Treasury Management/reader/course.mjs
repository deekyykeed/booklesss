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
 * checks and refuses on collision. That applies to the grouping nodes below
 * too, which is why "Cash" carries the slug `managing-cash`.
 *
 * 2026-08-03 — the lessons grew a grouping level (rule S-9, debt D-6). The S-8
 * splits took this course from 12 steps to 21 without adding a single folder,
 * so Working capital rendered as six equal rows with nothing saying which
 * belonged together. Four of the five lessons now group their siblings by
 * subject; Treasury operations stays flat because its three steps are three
 * separate frames.
 *
 * ⚠️ THIS CHANGED EVERY GROUPED STEP'S URL. A lesson's path is built from every
 * ancestor node (`courseIndex()` in `platform/src/lib/course.ts` walks the full
 * trail), so a folder inserts a segment:
 *
 *   /treasury-management/working-capital/cash-management
 *   /treasury-management/working-capital/managing-cash/cash-management
 *
 * The owner accepted that on 2026-08-03: no step link had been shared into a
 * group yet, and the course-level URL — the one that has been shared — is the
 * root node and is untouched. The step `slug` values themselves did not change
 * (S-8), only the path they sit at. Do not repeat this casually once links are
 * circulating: 18 of the 21 steps moved.
 *
 * 2026-08-08 — EVERY NAME IN THIS COLUMN WAS REWRITTEN under rule S-12 (debt
 * D-17): all 22 step titles, the nine lesson and grouping rows below, and all
 * 22 kickers. The owner, reading the course: "a title is supposed to be
 * capitalised properly and seriously … they lack a certain assertiveness."
 *
 * Two changes, and the second is the one that mattered. Names are Title Case
 * now, so a row reads as a name rather than a sentence fragment. And thirteen
 * of the 22 titles ended in a hedged `, and how/what/where…` clause — "Working
 * capital, and how much of it to run" — which is a habit rather than a title;
 * they are the noun phrase the paper uses instead.
 *
 * NO SLUG WAS TOUCHED, here or in any step, so nothing moved and no URL broke.
 * That is the whole reason this was cheap: a title is a display string, and the
 * 2026-08-03 note above is about the one thing that is not.
 */

/* Treasury operations was one six-section step until 2026-08-01; it is three
 * now (rule S-8). The first keeps the `intro-to-treasury` slug, so the URL that
 * was already linked to still opens the course. */
/* Rule S-11: every course opens with a step about the COURSE rather than
 * about its first topic. Written 2026-08-07, paying debt D-15.
 *
 * 2026-08-08 — IT NOW SITS INSIDE A "Getting started" FOLDER, and that is a
 * deliberate exception to S-9's "do not create a folder for one step" (owner:
 * "intro steps can simply be within a folder so that the bar isn't where it is
 * right now"). It used to be a direct child of the root, which made it the only
 * LEAF at the top level of any course, and the sidebar's active bar is drawn
 * relative to the rail of the folder holding the current row. With no folder
 * there is no rail, and the bar was placed at barLeftFor(-1) = -2.5px: a black
 * sliver clipped by the drawer's own edge, on the first row of the first step
 * every reader opens. The geometry is also fixed independently in Sidebar.tsx,
 * so a top-level leaf no longer draws a stray bar wherever one occurs; this
 * folder is the owner's preferred SHAPE, not the bug fix.
 *
 * `defaultOpen: true` matters and is not decoration. A folder wrapping one step
 * costs a tap, and the tap would land on the very first row of the course; open
 * by default, the step is visible exactly as before and only its indent changes.
 *
 * The folder slug carries a course suffix because grouping-node slugs are unique
 * across EVERY course (see the note above), and the economics course already
 * owns the bare `getting-started`. The label is shared with it on purpose: that
 * course has had a "Getting started" group since it was built, so this is the
 * existing convention rather than a new one.
 *
 * ⚠️ THIS MOVES THE INTRO STEP'S URL, the same way the 2026-08-03 grouping did:
 *   /treasury-management/start-here-treasury
 *   /treasury-management/getting-started-treasury/start-here-treasury
 * The step `slug` is untouched. These three steps were written on 2026-08-07 and
 * nothing in the repo links to their paths, so the cost is zero today. */
import startHere from "../01-operations/reader/start-here.mjs";
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
          slug: "getting-started-treasury",
          label: "Getting Started",
          defaultOpen: true,
          children: [startHere],
        },
        /* Three separate frames — what treasury is, how its work divides, how it
         * is governed. No two of them pair, so this lesson stays flat (S-9: do
         * not create a folder for one step). */
        {
          slug: "treasury-operations",
          label: "Treasury Operations",
          children: [introToTreasury, treasuryLevelsAndMandate, treasuryControlsAndStructure],
        },
        {
          slug: "working-capital",
          label: "Working Capital",
          children: [
            workingCapitalAndLiquidity,
            debtorsAndFactoring,
            {
              slug: "inventory-and-suppliers",
              label: "Inventory and Suppliers",
              children: [inventoryAndCreditors, orderingAndPayingSuppliers],
            },
            {
              slug: "managing-cash",
              label: "Cash",
              children: [cashManagement, cashForecastingAndSurpluses],
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
              children: [interestRateRiskManagement, interestRateHedgingInstruments],
            },
            {
              slug: "currency",
              label: "Currency",
              children: [foreignExchangeRisk, hedgingCurrencyRisk],
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
              children: [debtManagement, thePriceOfDebt],
            },
            {
              slug: "investing",
              label: "Investing",
              children: [investmentManagement, buildingThePortfolio],
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
              children: [clearingAndSettlement, paymentSystemsAndCcps],
            },
            {
              slug: "treasury-systems",
              label: "Treasury Systems",
              children: [treasuryManagementSystems, choosingAndRunningATms],
            },
          ],
        },
      ],
    },
  ],
};
