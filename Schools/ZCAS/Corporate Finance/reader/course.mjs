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

export default {
  slug: "corporate-finance",
  title: "Corporate Finance",
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
            // 4 — Inflation and tax           (Part 2, slides 7–8)
            // 5 — Adjusted present value      (APV 2024)
            // 6 — Capital rationing           (Capital Rationing 2023)
            // 7 — International projects      (NPV for International Projects 2023)
          ],
        },
      ],
    },
  ],
};
