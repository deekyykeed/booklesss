/* Strategic Management — reader course manifest.
 *
 * The authored source of truth for this course on the reader
 * (booklesss.vercel.app). Each step is its own file inside the lesson folder it
 * belongs to, so a lesson folder still holds everything needed to understand or
 * rebuild it — the same rule the PDF build scripts follow.
 *
 * Publish flow:
 *   node --env-file=platform/.env.local platform/scripts/seed-course.mjs \
 *        "Schools/ZCAS/Strategic Management/reader/course.mjs"
 *   cd platform && npm run gen:course     # mirrors Supabase back into the app
 *
 * `slug` values must be unique across EVERY course in the reader — the nav
 * index keys lessons by slug alone. seed-course.mjs checks this and refuses to
 * write if it finds a collision.
 */

import introToStrategy from "../01-foundations/reader/intro-to-strategy.mjs";
import missionAndVision from "../01-foundations/reader/mission-and-vision.mjs";

import externalEnvironment from "../02-environment/reader/external-environment.mjs";
import internalEnvironment from "../02-environment/reader/internal-environment.mjs";

import corporateStrategy from "../03-strategy/reader/corporate-strategy.mjs";
import competitiveStrategy from "../03-strategy/reader/competitive-strategy.mjs";
import strategyImplementation from "../03-strategy/reader/strategy-implementation.mjs";

export default {
  slug: "strategic-management",
  title: "Strategic Management",
  // One line under the title on the home page's course card.
  subtitle: "How organisations set direction, choose where to compete, and make it happen.",
  // Sits after corporate finance in the sidebar.
  position: 2,

  /* One root node per course, so the reader's combined tree shows "Strategic
   * Management" as a single collapsible section and URLs read
   * /strategic-management/<lesson>/<step>. */
  tree: [
    {
      slug: "strategic-management",
      label: "Strategic Management",
      defaultOpen: true,
      children: [
        {
          slug: "foundations",
          label: "Foundations",
          children: [introToStrategy, missionAndVision],
        },
        {
          slug: "environment",
          label: "Environment",
          children: [externalEnvironment, internalEnvironment],
        },
        {
          slug: "strategy",
          label: "Strategy",
          children: [corporateStrategy, competitiveStrategy, strategyImplementation],
        },
      ],
    },
  ],
};
