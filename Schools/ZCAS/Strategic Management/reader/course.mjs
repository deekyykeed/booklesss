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

/* Rule S-11: every course opens with a step about the COURSE rather than
 * about its first topic. It is a sibling of the lessons, not a member of one,
 * so it sits directly under the root node and is the first thing tapped.
 * Written 2026-08-07, paying debt D-15. */
import startHere from "../01-foundations/reader/start-here.mjs";
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
        /* 2026-08-08: wrapped in a folder, a deliberate exception to S-9's "do
         * not create a folder for one step" (owner). A top-level LEAF has no
         * enclosing rail for the sidebar's active bar to sit in, and the bar was
         * drawing at -2.5px, clipped by the drawer edge. `defaultOpen` keeps the
         * step visible without a tap. The slug carries a course suffix because
         * grouping slugs are unique across every course. Full reasoning is in
         * Treasury Management's course.mjs.
         * ⚠️ Moves the path to /strategic-management/getting-started-strategic-management/start-here-strategic-management */
        {
          slug: "getting-started-strategic-management",
          label: "Getting started",
          defaultOpen: true,
          children: [startHere],
        },
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
