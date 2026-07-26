/* The live app only has an economics course loaded, so real screenshots would
 * expose it. Booklesss is meant to hold EVERY course — so before capturing we
 * relabel the nav + breadcrumb to a neutral multi-subject curriculum and swap
 * the reader for generic, subject-free copy. Placeholder labels, real UI.
 *
 * Shared by every capture script. `transform` is serialised into the page by
 * Playwright, so it may only use its own argument — no module-scope closure. */

export const MAP = {
  "What is Economics": "Welcome to Booklesss",
  "How to use this course": "How Booklesss works",
  "Key terms & glossary": "Key terms",
  "Microeconomics": "Computer Science",
  "Macroeconomics": "Mathematics",
  "Behavioral economics": "History",
  "Resources": "Design",
  "Supply & demand": "Foundations",
  "Consumer choice": "Core skills",
  "Firms & production": "Projects",
  "Market structures": "Going further",
  "The law of demand": "Your first lesson",
  "The law of supply": "Variables",
  "Market equilibrium": "Functions",
  "Elasticity": "Loops",
  "Price elasticity of demand": "For loops",
  "Income elasticity of demand": "While loops",
  "Cross-price elasticity of demand": "Nested loops",
  "Income elasticity": "While loops",
  "Cross-price elasticity": "Nested loops",
  "Utility & marginal utility": "Objects",
  "Indifference curves": "Arrays",
  "Budget constraints": "Recursion",
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

// runs in the page (Playwright passes a single arg). `deep` also rewrites keys
// that sit INSIDE a longer string — the search palette's hints read
// "Microeconomics / Supply & demand", so exact-match relabelling misses them.
export function transform({ map, reader, deep }) {
  // 1. reader content -> neutral
  const fc = document.querySelector(".font-content");
  if (fc) {
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
      keys.forEach((k) => { if (v.includes(k)) v = v.split(k).join(map[k]); });
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
