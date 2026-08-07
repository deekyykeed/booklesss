/* Booklesss is not a school and it is not a course. Posts must never suggest
 * otherwise — no ZCAS, no UNZA, no BAC4301, no "Corporate Finance", no
 * "Economics". (Owner's rule, 2026-07-29.)
 *
 * The live app happens to be seeded with four real courses, so a raw
 * screenshot of it would say exactly the thing we are not allowed to say.
 * Before every capture we relabel the UI to a neutral curriculum: four
 * ordinary UNIVERSITY courses, at the weight our students are actually
 * studying at. **Placeholder labels, real UI** — nothing is drawn, moved or
 * restyled, only the words are swapped.
 *
 * Shared by every capture script, and applied immediately before every
 * screenshot (React re-renders undo it, so it cannot be done once up front).
 * `transform` is serialised into the page by Playwright, so it may only use its
 * own argument — no module-scope closure.
 */

/* The two courses, as the posts show them. The slugs stay whatever the app
 * uses; only what a reader can see changes. */
export const COURSE_TITLES = {
  Economics: "Organisational Behaviour",
  "Corporate Finance": "Business Law",
  "Strategic Management": "Operations Management",
  "Treasury Management": "Marketing Management",
};

/* ---------------------------------------------------------------------- *
 * THE NEUTRAL CURRICULUM IS FOUR UNIVERSITY COURSES (owner's call,
 * 2026-08-04): "make it different courses and serious courses, not something
 * silly like Mathematics of all things - these are university level
 * students".
 *
 * It used to be Mathematics / Physics / Computer Science / Data & Statistics,
 * and every one of those reads as a school subject. A dashboard photographed
 * with "Mathematics 64%" on it tells a university student the product is for
 * somebody doing secondary-school maths - which is the same mis-signal the
 * whole relabelling exercise exists to prevent, pointing the other way from
 * the one the banned list catches.
 *
 * The four below are ordinary first-year university courses, none of which we
 * teach, so they name no syllabus of ours and no school. The trees under them
 * are real course structures rather than filler: a student reading a slide has
 * to believe the app is for them.
 *
 * If a course is ever added to the app, give it a neutral course of the same
 * WEIGHT - a serious one - and map its WHOLE tree, not just its title. A
 * half-mapped course is how a card headed Operations Management ends up
 * offering a step about quadratic functions.
 * ---------------------------------------------------------------------- */
export const MAP = {
  /* ---- course identity (the part that carried the school's name) ---- */
  Economics: "Organisational Behaviour",
  "Corporate Finance": "Business Law",
  "Strategic Management": "Operations Management",
  "Treasury Management": "Marketing Management",
  "Micro, macro and behavioural \u2014 the whole introductory course.":
    "Motivation, teams, culture and change \u2014 the whole introductory course.",
  "Investment appraisal, cost of capital, valuation and risk \u2014 BAC4301 at ZCAS.":
    "Contract, agency, company formation and the duties that come with them.",
  "Investment appraisal, cost of capital, valuation and risk.":
    "Contract, agency, company formation and the duties that come with them.",
  "How organisations set direction, choose where to compete, and make it happen.":
    "Capacity, quality, inventory and the flow of work through a business.",
  "Cash, working capital, risk and the systems that move money.":
    "Segments, positioning, pricing and the channels that reach a customer.",

  /* ---- course 1 -> Organisational Behaviour ---- */
  "Getting started": "Getting started",
  "What is Economics": "Welcome to Booklesss",
  "How to use this course": "How Booklesss works",
  "Key terms & glossary": "Key terms",

  Microeconomics: "The individual",
  "Supply & demand": "Motivation",
  "The law of demand": "What drives effort",
  "The law of supply": "Needs and incentives",
  "Market equilibrium": "Expectancy and reward",
  Elasticity: "Personality and perception",
  "Price elasticity of demand": "Traits at work",
  "Income elasticity of demand": "Attitudes and values",
  "Income elasticity": "Attitudes and values",
  "Cross-price elasticity of demand": "How we judge others",
  "Cross-price elasticity": "How we judge others",
  "Consumer choice": "Learning and behaviour",
  "Utility & marginal utility": "Reinforcement at work",
  "Indifference curves": "Habits and routines",
  "Budget constraints": "Feedback and correction",
  "Firms & production": "Groups and teams",
  "Costs of production": "How groups form",
  "Revenue & profit": "Roles and norms",
  "Economies of scale": "What makes a team work",
  "Market structures": "Power and politics",
  "Perfect competition": "Where power comes from",
  Monopoly: "Influence at work",
  "Oligopoly & game theory": "Conflict and negotiation",

  Macroeconomics: "The organisation",
  "Measuring the economy": "Structure and design",
  "Gross Domestic Product": "Hierarchy and span",
  "Inflation & the CPI": "Centralised or not",
  Unemployment: "The informal organisation",
  Policy: "Culture",
  "Fiscal policy": "How a culture forms",
  "Monetary policy": "Changing one",
  "International trade": "Leadership",
  "Comparative advantage": "Traits and styles",
  "Exchange rates": "Leading by situation",

  "Behavioral economics": "Change",
  "Cognitive biases": "Why people resist it",
  "Nudges & choice architecture": "Managing a change",
  "The prisoner's dilemma": "Making it stick",
  "The prisoner\u2019s dilemma": "Making it stick",

  Resources: "Resources",
  "Formula sheet": "Reference sheet",
  "Practice problems": "Practice questions",

  /* ---- course 2 -> Business Law ---- */
  "Investment appraisal": "Foundations",
  "Free cash flows": "What makes a contract",
  "NPV & discounted payback": "Offer and acceptance",
  "IRR & MIRR": "Terms & breach",
  /* The dashboard's Resume chip prints the step's own title, which spells the
   * ampersand out - so the map's "&" key never matches it and the banned-word
   * scan trips on "irr" inside a course card. Both spellings, both mapped. */
  "IRR and MIRR": "Terms and breach",

  /* ---- course 3 -> Operations Management ---- */
  /* Its first step, which the dashboard prints on its Start chip for anybody
   * who has not opened that course. No banned word in it, so the scan lets it
   * through - and a card headed Operations Management offering a step about
   * strategy is the same lie the scan exists to prevent, told past it. */
  "Introduction to strategy": "What operations covers",

  /* ---- course 4 -> Marketing Management (added 2026-08-01) ----
   * This is the course the reader shots are taken on, because it is the one
   * carrying the blocks the posts are usually about. Both the nav LABEL and
   * the step TITLE are mapped where they differ - the drawer shows one and the
   * page shows the other. Longer keys are applied first (see `transform`), so
   * "Risk management" is safe to sit beside "Risk". */
  "Treasury operations": "Foundations",
  "Introduction to treasury": "What marketing is for",
  "Introduction to treasury management": "What marketing is for",
  "Working capital": "The customer",
  "Working capital & liquidity": "Segmentation",
  "Working capital and liquidity management": "Segmentation",
  "Inventory, EOQ & creditors": "Targeting",
  "Inventory management, EOQ and creditor management": "Targeting",
  "Cash management & forecasting": "Positioning",
  "Cash management and cash flow forecasting": "Positioning",
  "Interest rate risk management": "Pricing",
  "Interest rate risk": "Pricing",
  "Foreign exchange risk management": "Promotion",
  "Foreign exchange risk": "Promotion",
  "Debt and investment": "The offer",
  "Debt management": "Product and service",
  "Investment management": "Brand",
  "Systems and clearing": "Channels",
  "Clearing & settlement": "Route to market",
  "Clearing and settlement systems": "Route to market",
  "Treasury systems": "Distribution",
  "Treasury management systems": "Distribution",
  "Risk management": "Measuring it",
  Risk: "Research",

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

  /* ---- the `cards` block on its second axis (added 2026-08-03) ----
   * One object at three fill levels, for a set whose distinction is HOW MUCH
   * BUFFER YOU HOLD. Same treatment as the three-kind set above: the mark, the
   * tone, the rule and — the point of this one — the proportion of the glyph
   * the card's own hue fills are all the real component; only the words are
   * placeholders. The two leads that are already subject-free ("Somewhere in
   * between", "Keep the tank full") are left alone.
   *
   * The titles have to go: aggressive / moderate / conservative is the
   * vocabulary of one syllabus, and a post may not carry it even when no word
   * in it is on the banned list. */
  Aggressive: "Tight",
  Moderate: "Steady",
  Conservative: "Roomy",
  "Run it lean": "Cut it fine",
  "Minimal safety stock, lean inventory, tight cash buffers. The return is higher because less capital sits idle, and the risk is higher because a bad week has nothing to absorb it.":
    "One pass the night before, and nothing held back for a second look. You cover the ground in the least time, and one bad evening takes the whole plan with it.",
  "Balanced between the two extremes, and middle ground on both counts. It is where most companies actually sit, usually without having chosen it.":
    "A few sessions across the week, with a little room either side. It is where most people actually end up, usually without having chosen it.",
  "Large safety stocks and generous cash buffers. The return is lower because more capital is tied up, and the risk is lower because you are rarely caught short.":
    "Start early, leave slack, and go back over anything that did not stick. It costs more evenings, and almost nothing can go wrong that you cannot absorb.",

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
  "forward contracts": "a market segment",
  "An agreement to buy or sell a set amount of currency on a set future date at a price fixed today. It removes the uncertainty: you know in January what March's dollars will cost you.":
    "A group of buyers who want the same thing for the same reason. Find the group first and every decision after it \u2014 the product, the price, the channel \u2014 has something to answer to.",
  "front office": "positioning",
  "The dealers, the people who actually strike trades. The back office confirms, settles and records them. Keeping the two apart is the single most important treasury control.":
    "The place your offer holds in a buyer\u2019s head, next to everything else they could pick. You do not choose it; you earn it, and a competitor can move it.",

  /* ---- the PIPELINE tab's cards (added 2026-08-07) ----
   * A pipeline card prints a course off the student's own timetable \u2014 a real
   * title, scraped from a real university's real programme. That is the one
   * thing rule 7 exists to stop, and no banned word appears in any of them, so
   * the scan cannot catch it: "Taxation" is off-syllabus, not forbidden. Same
   * trap as a half-mapped course, arriving through a different door.
   *
   * These three are the year-2 courses the capture's seeded student ticked.
   * They map to the same neutral first-year register as everything above:
   * ordinary university courses, none of which we teach, none of which is one
   * of the four the placeholder curriculum already uses.
   *
   * ADD A ROW HERE BEFORE SHOOTING THE PIPELINE TAB WITH A DIFFERENT SEED.
   * The tab renders whatever `identity.curriculum` holds, so changing the seed
   * changes the words on the cards, and an unmapped one ships silently. */
  "Financial Accounting": "Human Resource Management",
  "Management Accounting": "Business Communication",
  Taxation: "Research Methods",
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
