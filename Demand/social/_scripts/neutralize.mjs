/* Booklesss is not a school and it is not a course. Posts must never suggest
 * otherwise — no ZCAS, no UNZA, no BAC4301, no "Corporate Finance", no
 * "Economics". (Owner's rule, 2026-07-29.)
 *
 * The live app happens to be seeded with two real courses, so a raw screenshot
 * of it would say exactly the thing we are not allowed to say. Before every
 * capture we relabel the UI to a neutral curriculum: two ordinary subjects any
 * student anywhere would recognise. **Placeholder labels, real UI** — nothing
 * is drawn, moved or restyled, only the words are swapped.
 *
 * Shared by every capture script, and applied immediately before every
 * screenshot (React re-renders undo it, so it cannot be done once up front).
 * `transform` is serialised into the page by Playwright, so it may only use its
 * own argument — no module-scope closure.
 */

/* The two courses, as the posts show them. The slugs stay whatever the app
 * uses; only what a reader can see changes. */
export const COURSE_TITLES = {
  Economics: "Mathematics",
  "Corporate Finance": "Computer Science",
};

export const MAP = {
  /* ---- course identity (the part that carried the school's name) ---- */
  Economics: "Mathematics",
  "Corporate Finance": "Computer Science",
  "Micro, macro and behavioural — the whole introductory course.":
    "Algebra, functions, statistics and calculus — the whole first-year course.",
  "Investment appraisal, cost of capital, valuation and risk — BAC4301 at ZCAS.":
    "Programming, data and how software actually works — from the ground up.",

  /* ---- course 1 → Mathematics ---- */
  "Getting started": "Getting started",
  "What is Economics": "Welcome to Booklesss",
  "How to use this course": "How Booklesss works",
  "Key terms & glossary": "Key terms",

  Microeconomics: "Algebra",
  "Supply & demand": "Foundations",
  "The law of demand": "Working with equations",
  "The law of supply": "Rearranging formulas",
  "Market equilibrium": "Simultaneous equations",
  Elasticity: "Functions",
  "Price elasticity of demand": "Linear functions",
  "Income elasticity of demand": "Quadratic functions",
  "Income elasticity": "Quadratic functions",
  "Cross-price elasticity of demand": "Exponential functions",
  "Cross-price elasticity": "Exponential functions",
  "Consumer choice": "Graphs",
  "Utility & marginal utility": "Reading a graph",
  "Indifference curves": "Curves & gradients",
  "Budget constraints": "Area under a curve",
  "Firms & production": "Sequences",
  "Costs of production": "Arithmetic sequences",
  "Revenue & profit": "Geometric sequences",
  "Economies of scale": "Series & sums",
  "Market structures": "Probability",
  "Perfect competition": "Counting outcomes",
  Monopoly: "Conditional probability",
  "Oligopoly & game theory": "Distributions",

  Macroeconomics: "Statistics",
  "Measuring the economy": "Describing data",
  "Gross Domestic Product": "Mean, median, mode",
  "Inflation & the CPI": "Spread & deviation",
  Unemployment: "Outliers",
  Policy: "Sampling",
  "Fiscal policy": "Random samples",
  "Monetary policy": "Bias in sampling",
  "International trade": "Correlation",
  "Comparative advantage": "Scatter plots",
  "Exchange rates": "Lines of best fit",

  "Behavioral economics": "Calculus",
  "Cognitive biases": "Rates of change",
  "Nudges & choice architecture": "Differentiation",
  "The prisoner's dilemma": "Integration",
  "The prisoner’s dilemma": "Integration",

  Resources: "Resources",
  "Formula sheet": "Formula sheet",
  "Practice problems": "Practice problems",

  /* ---- course 2 → Computer Science ---- */
  "Investment appraisal": "Foundations",
  "Free cash flows": "Your first program",
  "NPV & discounted payback": "Variables & data",
  "IRR & MIRR": "Loops & conditions",
};

export const READER = {
  kicker: "Foundations",
  title: "Your first lesson",
  lead: "Booklesss turns any subject into something you can actually read — short, plain-language lessons that get to the point and build on each other.",
  callout: "Rule of thumb: if an idea can be explained simply, Booklesss explains it simply.",
  ideas: [
    "Every lesson opens with the big idea, then fills in the details.",
    "You move at your own pace — nothing is locked, nothing is timed.",
    "Examples come from real life, not abstract theory.",
  ],
  practice:
    "Say you're picking up something new this week. Instead of a 900-page textbook, you get a clear path: start here, learn the core idea, try it, and move on when it clicks.",
  summary:
    "Booklesss is built to make the next thing you learn feel easy to start — and hard to put down.",
};

/* Anything that must never survive into a rendered post. Checked after the
 * relabel, so a label the map missed fails the capture instead of shipping.
 * Lower-cased before matching. */
export const BANNED = [
  "zcas",
  "unza",
  "bac4301",
  "bbf4302",
  "bba 1110",
  "corporate finance",
  "economics",
  "microeconom",
  "macroeconom",
  "elasticity",
  "npv",
  "irr",
  "cash flow",
  "supply & demand",
  "kwacha",
  "zmw",
];

// runs in the page (Playwright passes a single arg). `deep` also rewrites keys
// that sit INSIDE a longer string — the search palette's hints read
// "Microeconomics / Supply & demand", so exact-match relabelling misses them.
export function transform({ map, reader, deep }) {
  // 1. reader content -> neutral
  const fc = document.querySelector(".font-content");
  if (fc && reader) {
    const kicker = fc.querySelector("p");
    if (kicker) kicker.textContent = reader.kicker;
    const h1 = fc.querySelector("h1");
    if (h1) h1.textContent = reader.title;
    const lead = fc.querySelector("#overview p");
    if (lead) lead.textContent = reader.lead;
    const callout = fc.querySelector("#overview .squircle");
    if (callout) callout.textContent = reader.callout;
    const lis = fc.querySelectorAll("#key-ideas li");
    lis.forEach((li, i) => {
      const span = li.querySelector("span:last-child");
      if (span && reader.ideas[i]) span.textContent = reader.ideas[i];
    });
    const pr = fc.querySelector("#in-practice p");
    if (pr) pr.textContent = reader.practice;
    const su = fc.querySelector("#summary p");
    if (su) su.textContent = reader.summary;
  }
  // 2. relabel every remaining text node that matches a map key (nav, breadcrumb, …)
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  if (deep) {
    // longest key first, so "Price elasticity of demand" wins over "Elasticity"
    const keys = Object.keys(map).sort((a, b) => b.length - a.length);
    nodes.forEach((n) => {
      let v = n.nodeValue;
      keys.forEach((k) => {
        if (v.includes(k)) v = v.split(k).join(map[k]);
      });
      if (v !== n.nodeValue) n.nodeValue = v;
    });
    return;
  }
  nodes
    .filter((n) => map[n.nodeValue.trim()])
    .forEach((n) => {
      const key = n.nodeValue.trim();
      n.nodeValue = n.nodeValue.replace(key, map[key]);
    });
}

/* Runs in the page immediately before a screenshot: returns the banned words
 * that would actually appear IN THE CROP. Scoped to the clip rather than the
 * whole document on purpose — the rule is that nothing banned reaches a post,
 * and a word two screens below the crop never does. A capture script throws on
 * a non-empty result instead of writing the PNG, so the check cannot be
 * forgotten the way a note in a README can.
 *
 * `clip` is the same {x, y, width, height} passed to page.screenshot(), in CSS
 * pixels. Set `pageSpace` when the clip belongs to a full-page screenshot,
 * whose coordinates are the document's rather than the viewport's — otherwise
 * the check would compare two different origins and pass everything. */
export function scan({ banned, clip, pageSpace }) {
  const seen = new Set();
  const ox = pageSpace ? window.scrollX : 0;
  const oy = pageSpace ? window.scrollY : 0;
  const L = clip.x, T = clip.y, R = clip.x + clip.width, B = clip.y + clip.height;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const el = node.parentElement;
    if (!el) continue;
    // screen-reader-only text and hidden nodes are not in the photograph
    if (el.closest(".sr-only,[aria-hidden='true']")) continue;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) === 0) continue;
    const b0 = el.getBoundingClientRect();
    if (b0.width === 0 || b0.height === 0) continue;
    const r = { left: b0.left + ox, right: b0.right + ox, top: b0.top + oy, bottom: b0.bottom + oy };
    if (r.right <= L || r.left >= R || r.bottom <= T || r.top >= B) continue; // outside the crop
    const v = node.nodeValue.toLowerCase();
    banned.forEach((b) => {
      if (v.includes(b)) seen.add(b);
    });
  }
  return [...seen];
}
