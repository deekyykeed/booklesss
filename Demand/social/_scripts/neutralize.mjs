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
  Economics: "Data & Statistics",
  "Corporate Finance": "Computer Science",
  "Strategic Management": "Physics",
  "Treasury Management": "Mathematics",
};

export const MAP = {
  /* ---- course identity (the part that carried the school's name) ---- */
  Economics: "Data & Statistics",
  "Corporate Finance": "Computer Science",
  "Strategic Management": "Physics",
  "Treasury Management": "Mathematics",
  "Micro, macro and behavioural — the whole introductory course.":
    "Describing data, sampling and inference — the whole first-year course.",
  "Investment appraisal, cost of capital, valuation and risk — BAC4301 at ZCAS.":
    "Programming, data and how software actually works — from the ground up.",
  "Investment appraisal, cost of capital, valuation and risk.":
    "Programming, data and how software actually works — from the ground up.",
  "How organisations set direction, choose where to compete, and make it happen.":
    "Forces, motion and energy — the ideas the rest of the subject is built on.",
  "Cash, working capital, risk and the systems that move money.":
    "Algebra, functions, sequences and probability — the whole first-year course.",

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

  /* ---- course 4 → Mathematics (added 2026-08-01) ----
   * This is the course the reader shots are now taken on, because it is the
   * one carrying the blocks the day's posts are about. Both the nav LABEL and
   * the step TITLE are mapped where they differ — the drawer shows one and the
   * page shows the other. Longer keys are applied first (see `transform`), so
   * "Risk management" is safe to sit beside "Risk". */
  "Treasury operations": "Foundations",
  "Introduction to treasury": "Working with equations",
  "Introduction to treasury management": "Working with equations",
  "Working capital": "Functions",
  "Working capital & liquidity": "Linear functions",
  "Working capital and liquidity management": "Linear functions",
  "Inventory, EOQ & creditors": "Quadratic functions",
  "Inventory management, EOQ and creditor management": "Quadratic functions",
  "Cash management & forecasting": "Exponential functions",
  "Cash management and cash flow forecasting": "Exponential functions",
  "Interest rate risk management": "Reading a graph",
  "Interest rate risk": "Reading a graph",
  "Foreign exchange risk management": "Gradients & areas",
  "Foreign exchange risk": "Gradients & areas",
  "Debt and investment": "Sequences",
  "Debt management": "Arithmetic sequences",
  "Investment management": "Geometric sequences",
  "Systems and clearing": "Probability",
  "Clearing & settlement": "Counting outcomes",
  "Clearing and settlement systems": "Counting outcomes",
  "Treasury systems": "Distributions",
  "Treasury management systems": "Distributions",
  "Risk management": "Rates of change",
  Risk: "Graphs",

  /* ---- the `cards` block (added 2026-08-02) ----
   * The three-card set is the thing one of today's posts is ABOUT, so unlike
   * every other crop it has to survive at full size with its body text legible.
   * Relabelled the same way as everything else here: the cards, their marks,
   * their tones and the rules under their titles are the real component — only
   * the words are placeholders, and they are placeholders about studying rather
   * than about any subject, so the slide says what the block is for without
   * saying whose course it came from.
   *
   * The heading is mapped as well as the three titles: `deep` applies longer
   * keys first, so "Strategic, tactical and operational" is rewritten before
   * the bare "Strategic" can get at it. */
  "Strategic, tactical and operational": "Three ways to work through a lesson",
  Strategic: "Plan",
  Tactical: "Practise",
  Operational: "Review",
  "Long-term policy": "Before you start",
  "Medium-term decisions": "While you read",
  "Daily execution": "After you finish",
  "Capital structure, dividend policy, capital raising, investment returns. Set once and held for years.":
    "Skim the headings, the summary, and the question at the end of each section. Done once, before you read a word.",
  "Cash investment management, hedging currency or interest rate risk. Decided over the coming months, inside the policy above.":
    "Answer each section's question as you reach it, in your own words before you look. Done as you go, section by section.",
  "Transmitting cash, placing surplus funds, bank communications. Done today, and done again tomorrow.":
    "Come back to anything you marked for later, the same evening if you can. Done today, and done again tomorrow.",
  /* The callout under the cards restates them in lower case, which the map's
   * capitalised keys do not touch — so it sat at the foot of the crop still
   * using the old vocabulary while the cards above it used the new one. */
  "Classify by time horizon: ": "One pass each: ",
  "strategic = long-term policy, tactical = medium-term decisions, operational = daily execution.":
    "plan before you start, practise while you read, review after you finish.",

  /* ---- tap-to-define, for the popup slides (added 2026-08-02) ----
   * The popup is photographed on its own, so its heading and its definition are
   * the entire slide — there is no surrounding page to crop away and nothing
   * else in frame to carry the meaning. Both are relabelled, into the same
   * neutral first-year register the reader placeholder uses.
   *
   * If one of these keys ever stops matching the source .mjs exactly, the
   * capture does not quietly ship the original: "front office" carries the word
   * treasury in its definition, so the banned-word scan throws on the element.
   * That is deliberate — it is the one of the pair with a tripwire in it. */
  "forward contracts": "a variable",
  "An agreement to buy or sell a set amount of currency on a set future date at a price fixed today. It removes the uncertainty: you know in January what March's dollars will cost you.":
    "A letter standing in for a number you do not know yet. Find what it stands for, put the number back, and the whole expression resolves.",
  "front office": "a coefficient",
  "The dealers, the people who actually strike trades. The back office confirms, settles and records them. Keeping the two apart is the single most important treasury control.":
    "The number sitting directly in front of a letter, saying how many of it there are. In 5x the coefficient is 5, and in x on its own it is 1.",
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
  "treasur",
  "strategic manage",
  "working capital",
  "barings",
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
    /* `div.squircle`, not `.squircle`. The section's checkpoint row renders
     * INSIDE #overview and its three answer buttons carry `squircle` too, so a
     * bare `.squircle` matched the "Not yet" button and overwrote it with the
     * callout text — stretching a button into a wide box of one unwrapped line
     * and deleting one of the three answers from the shot. That is retouching
     * the product, which is the one thing a capture may never do. The callout
     * is the only DIV wearing the class. */
    const callout = fc.querySelector("#overview div.squircle");
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
