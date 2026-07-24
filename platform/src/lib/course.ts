/* The Booklesss economics course — a real, multi-level curriculum used to
 * drive the collapsible docs navigator and the lesson reader. */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "playground"; code: string };

export type Section = { id: string; heading: string; blocks: Block[] };
export type Lesson = { title: string; kicker?: string; sections: Section[] };

export type NavNode = {
  id: string;
  label: string;
  children?: NavNode[];
  lesson?: Lesson;
  defaultOpen?: boolean;
};

type LessonOpts = { callout?: string; practice?: string; practiceHeading?: string; takeaway?: string; playground?: string };

// Compact helper: turns the fields below into an "Overview / Key ideas / …"
// section list that both the reader and the on-this-page TOC consume.
function lesson(title: string, kicker: string, lead: string, keyIdeas: string[], opts?: LessonOpts): Lesson {
  const sections: Section[] = [
    { id: "overview", heading: "Overview", blocks: [{ type: "p", text: lead }, ...(opts?.callout ? [{ type: "callout" as const, text: opts.callout }] : [])] },
    { id: "key-ideas", heading: "Key ideas", blocks: [{ type: "ul", items: keyIdeas }] },
  ];
  if (opts?.practice)
    sections.push({ id: "in-practice", heading: opts.practiceHeading ?? "In practice", blocks: [{ type: "p", text: opts.practice }] });
  if (opts?.takeaway)
    sections.push({ id: "summary", heading: "Summary", blocks: [{ type: "p", text: opts.takeaway }] });
  if (opts?.playground)
    sections.push({
      id: "try-it",
      heading: "Try it yourself",
      blocks: [
        { type: "p", text: "Economics is about making choices precise — and so is code. Edit the snippet below and press Run to see the output. Try changing the numbers." },
        { type: "playground", code: opts.playground },
      ],
    });
  return { title, kicker, sections };
}

export const COURSE: NavNode[] = [
  {
    id: "getting-started",
    label: "Getting started",
    defaultOpen: true,
    children: [
      {
        id: "what-is-economics",
        label: "What is Economics",
        lesson: lesson(
          "What is Economics",
          "Getting started",
          "Economics is the study of how people, firms, and governments make choices when resources are scarce — and how those choices add up across an entire society. Because you can never have everything, every decision means giving something else up.",
          [
            "Scarcity forces trade-offs: every choice carries an opportunity cost — the value of the next best thing you gave up.",
            "Microeconomics zooms in on single markets, firms, and households; macroeconomics zooms out to the whole economy.",
            "Incentives drive behaviour — change the costs and benefits, and you change what people do.",
            "Models are deliberate simplifications: they trade some realism for the clarity to reason about cause and effect.",
          ],
          {
            callout: "Rule of thumb: whenever you make a decision, ask “compared to what?” That question is the whole subject in miniature.",
            practice:
              "Imagine you have a free Saturday. You could work a shift for $80, study for an exam, or relax. Economics doesn't tell you which is “right” — it tells you to weigh each option against what you give up. If you choose to relax, the opportunity cost is the $80 you didn't earn plus the exam marks you didn't gain. Naming that cost is what turns a vague feeling into a clear decision.",
            practiceHeading: "In practice",
            takeaway:
              "Economics is a way of thinking, not a pile of facts. Once you start spotting scarcity, trade-offs, and incentives in everyday life, the rest of the course is just adding precision to instincts you already have.",
            playground: `// Economics in code — revenue = price × quantity
const price = 4;       // $ per coffee
const quantity = 100;  // cups sold today

const revenue = price * quantity;
console.log("Revenue: $" + revenue);

// Opportunity cost: the value of the best thing you gave up
const wageFromShift = 80;   // if you had worked instead
const valueOfResting = 60;  // how much the rest is worth to you
console.log("Opportunity cost of resting: $" + (wageFromShift - valueOfResting));`,
          },
        ),
      },
      {
        id: "how-to-use",
        label: "How to use this course",
        lesson: lesson(
          "How to use this course",
          "Getting started",
          "Work top-to-bottom or jump straight to a topic in the sidebar. Folders expand to reveal sub-topics, and each lesson is short enough to finish in one sitting.",
          [
            "Open a folder to reveal its lessons; the arrow shows whether a section is expanded.",
            "The lesson you are reading is highlighted in the sidebar so you never lose your place.",
            "Every lesson ends with a “Key ideas” recap — skim these to revise quickly before a test.",
          ],
        ),
      },
      {
        id: "glossary",
        label: "Key terms & glossary",
        lesson: lesson(
          "Key terms & glossary",
          "Getting started",
          "A quick reference for the vocabulary that shows up again and again. Come back here whenever a term stops making sense.",
          [
            "Opportunity cost — the value of the best alternative you gave up.",
            "Marginal — the effect of one more unit (one more hour, one more slice).",
            "Equilibrium — a state with no pressure to change; supply meets demand.",
            "Ceteris paribus — “all else equal”, the assumption that lets us isolate one cause.",
          ],
        ),
      },
    ],
  },
  {
    id: "microeconomics",
    label: "Microeconomics",
    children: [
      {
        id: "supply-demand",
        label: "Supply & demand",
        children: [
          {
            id: "law-of-demand",
            label: "The law of demand",
            lesson: lesson(
              "The law of demand",
              "Supply & demand",
              "All else equal, as the price of a good rises the quantity people want to buy falls — and as price falls, quantity demanded rises. That inverse relationship is why demand curves slope downward.",
              [
                "A price change moves you along the demand curve; a change in tastes, income, or the price of related goods shifts the whole curve.",
                "The substitution effect: when something gets pricier, buyers switch to alternatives.",
                "The income effect: a higher price makes buyers effectively poorer, so they buy less.",
              ],
              {
                practice:
                  "A coffee shop raises a latte from $4 to $5. The next morning, a handful of regulars switch to filter coffee or skip the second cup — quantity demanded falls. Nothing about the customers changed; only the price did, so we slide up the same demand curve rather than shifting it. If instead a viral post made lattes trendy, the whole curve would shift right and more would sell at every price.",
                practiceHeading: "In practice",
                takeaway:
                  "Always separate a movement along the curve (caused by the good's own price) from a shift of the curve (caused by anything else). Mixing them up is the single most common mistake in intro microeconomics.",
              },
            ),
          },
          {
            id: "law-of-supply",
            label: "The law of supply",
            lesson: lesson(
              "The law of supply",
              "Supply & demand",
              "As the price of a good rises, producers are willing and able to supply more of it, because higher prices cover higher marginal costs and promise more profit. Supply curves therefore slope upward.",
              [
                "Higher price → larger quantity supplied (a movement along the curve).",
                "Costs, technology, and the number of sellers shift the entire supply curve.",
                "In the short run, firms expand output by working existing capacity harder.",
              ],
            ),
          },
          {
            id: "equilibrium",
            label: "Market equilibrium",
            lesson: lesson(
              "Market equilibrium",
              "Supply & demand",
              "Equilibrium is the price at which the quantity buyers want exactly equals the quantity sellers offer. There is no shortage and no surplus, so there is no pressure for the price to move.",
              [
                "Above equilibrium: a surplus builds up and pushes the price down.",
                "Below equilibrium: a shortage forms and pulls the price up.",
                "Shifts in supply or demand create a new equilibrium price and quantity.",
              ],
            ),
          },
          {
            id: "elasticity",
            label: "Elasticity",
            children: [
              {
                id: "ped",
                label: "Price elasticity of demand",
                lesson: lesson(
                  "Price elasticity of demand",
                  "Elasticity",
                  "Price elasticity of demand measures how sensitive quantity demanded is to a change in price: the percentage change in quantity divided by the percentage change in price.",
                  [
                    "Elastic (>1): quantity reacts a lot — think holidays or a specific brand of coffee.",
                    "Inelastic (<1): quantity barely moves — think petrol or insulin.",
                    "Total revenue rises when you cut the price of an elastic good, and falls for an inelastic one.",
                  ],
                ),
              },
              {
                id: "yed",
                label: "Income elasticity",
                lesson: lesson(
                  "Income elasticity of demand",
                  "Elasticity",
                  "Income elasticity measures how demand responds when incomes change — the percentage change in quantity demanded divided by the percentage change in income.",
                  [
                    "Normal goods have positive income elasticity: richer buyers want more.",
                    "Luxury goods have elasticity above 1 — demand grows faster than income.",
                    "Inferior goods have negative elasticity: demand falls as income rises.",
                  ],
                ),
              },
              {
                id: "xed",
                label: "Cross-price elasticity",
                lesson: lesson(
                  "Cross-price elasticity",
                  "Elasticity",
                  "Cross-price elasticity measures how the demand for one good responds to a price change in another good — revealing whether two goods are substitutes or complements.",
                  [
                    "Positive value → substitutes (tea and coffee).",
                    "Negative value → complements (printers and ink).",
                    "Near zero → the two goods are basically unrelated.",
                  ],
                ),
              },
            ],
          },
        ],
      },
      {
        id: "consumer-choice",
        label: "Consumer choice",
        children: [
          {
            id: "utility",
            label: "Utility & marginal utility",
            lesson: lesson(
              "Utility & marginal utility",
              "Consumer choice",
              "Utility is a way to describe the satisfaction a person gets from consuming goods. Marginal utility is the extra satisfaction from one more unit — and it usually shrinks the more you already have.",
              [
                "Diminishing marginal utility: the second slice of pizza delights you less than the first.",
                "Consumers maximise utility by equalising marginal utility per dollar across goods.",
                "It explains why demand curves slope down — extra units are worth less, so you'll only buy them at a lower price.",
              ],
            ),
          },
          {
            id: "indifference",
            label: "Indifference curves",
            lesson: lesson(
              "Indifference curves",
              "Consumer choice",
              "An indifference curve joins all the combinations of two goods that leave a consumer equally satisfied. Together with a budget line, it shows the best bundle a consumer can afford.",
              [
                "Curves further from the origin represent higher satisfaction.",
                "Their slope — the marginal rate of substitution — is how much of one good you'll swap for the other.",
                "The optimal choice sits where the budget line just touches the highest reachable curve.",
              ],
            ),
          },
          {
            id: "budget",
            label: "Budget constraints",
            lesson: lesson(
              "Budget constraints",
              "Consumer choice",
              "A budget constraint shows every combination of goods a consumer can buy with a given income and set of prices. It draws the boundary between what's affordable and what isn't.",
              [
                "The slope reflects the relative price of the two goods.",
                "More income shifts the line outward; a price change pivots it.",
                "Consumers choose the affordable bundle that reaches their highest indifference curve.",
              ],
            ),
          },
        ],
      },
      {
        id: "firms",
        label: "Firms & production",
        children: [
          {
            id: "costs",
            label: "Costs of production",
            lesson: lesson(
              "Costs of production",
              "Firms & production",
              "Firms pay fixed costs that don't change with output and variable costs that do. Understanding how average and marginal costs behave is the key to deciding how much to produce.",
              [
                "Marginal cost is the cost of producing one more unit.",
                "Average total cost is typically U-shaped as output grows.",
                "A firm expands output while the extra revenue exceeds the extra (marginal) cost.",
              ],
            ),
          },
          {
            id: "revenue-profit",
            label: "Revenue & profit",
            lesson: lesson(
              "Revenue & profit",
              "Firms & production",
              "Revenue is price times quantity; profit is revenue minus total cost. Firms maximise profit by producing where marginal revenue equals marginal cost.",
              [
                "Economic profit counts opportunity cost, not just accounting cost.",
                "MR = MC is the profit-maximising rule in every market structure.",
                "If price falls below average variable cost, a firm shuts down in the short run.",
              ],
            ),
          },
          {
            id: "economies-scale",
            label: "Economies of scale",
            lesson: lesson(
              "Economies of scale",
              "Firms & production",
              "Economies of scale exist when producing more lowers the average cost per unit — through bulk buying, specialised labour, or spreading fixed costs over more output.",
              [
                "Internal economies come from the firm's own growth; external ones come from the whole industry.",
                "Beyond a point, diseconomies of scale set in as coordination gets harder.",
                "They help explain why some industries are dominated by a few large firms.",
              ],
            ),
          },
        ],
      },
      {
        id: "market-structures",
        label: "Market structures",
        children: [
          {
            id: "perfect-competition",
            label: "Perfect competition",
            lesson: lesson(
              "Perfect competition",
              "Market structures",
              "A perfectly competitive market has many small firms selling identical products, with free entry and full information. No single firm can influence the price — they are all price takers.",
              [
                "Firms produce where price equals marginal cost.",
                "In the long run, free entry drives economic profit to zero.",
                "It's a benchmark for efficiency, rarely seen exactly in the real world.",
              ],
            ),
          },
          {
            id: "monopoly",
            label: "Monopoly",
            lesson: lesson(
              "Monopoly",
              "Market structures",
              "A monopoly is the single seller of a product with no close substitutes, protected by barriers to entry. It sets price above marginal cost, producing less than a competitive market would.",
              [
                "Monopolists are price makers, not price takers.",
                "They earn long-run profit because entry is blocked.",
                "The trade-off: higher prices and lower output, but sometimes more R&D.",
              ],
            ),
          },
          {
            id: "oligopoly",
            label: "Oligopoly & game theory",
            lesson: lesson(
              "Oligopoly & game theory",
              "Market structures",
              "An oligopoly is a market dominated by a few interdependent firms. Because each one's best move depends on the others', economists analyse them with game theory.",
              [
                "Firms may collude to raise prices — or compete fiercely and trigger price wars.",
                "The kinked demand curve helps explain sticky oligopoly prices.",
                "See The prisoner's dilemma for why cooperation is hard to sustain.",
              ],
            ),
          },
        ],
      },
    ],
  },
  {
    id: "macroeconomics",
    label: "Macroeconomics",
    children: [
      {
        id: "measuring",
        label: "Measuring the economy",
        children: [
          {
            id: "gdp",
            label: "Gross Domestic Product",
            lesson: lesson(
              "Gross Domestic Product (GDP)",
              "Measuring the economy",
              "GDP is the total market value of all final goods and services produced within a country in a given period. It's the headline measure of the size of an economy.",
              [
                "Real GDP strips out inflation so you can compare years fairly.",
                "It can be measured three ways: output, income, and expenditure — all should agree.",
                "GDP ignores unpaid work, inequality, and environmental costs, so it's an incomplete measure of wellbeing.",
              ],
              {
                practice:
                  "When the news says an economy “grew 2.5% last quarter”, that figure is the change in real GDP. Economists watch it to date recessions (two straight quarters of falling real GDP is a common rule of thumb) and to compare living standards across countries by dividing GDP by population — GDP per capita.",
                practiceHeading: "In practice",
                takeaway:
                  "GDP is the best single number we have for the size of an economy, but treat it as a thermometer, not a report card: it measures output, not happiness, fairness, or sustainability.",
              },
            ),
          },
          {
            id: "inflation",
            label: "Inflation & the CPI",
            lesson: lesson(
              "Inflation & the CPI",
              "Measuring the economy",
              "Inflation is a sustained rise in the general price level, which erodes the purchasing power of money. It's usually tracked with the Consumer Price Index, a basket of typical household goods.",
              [
                "Demand-pull inflation comes from too much spending; cost-push from rising input costs.",
                "Moderate, stable inflation (around 2%) is generally seen as healthy.",
                "Deflation — falling prices — can be as damaging as high inflation.",
              ],
            ),
          },
          {
            id: "unemployment",
            label: "Unemployment",
            lesson: lesson(
              "Unemployment",
              "Measuring the economy",
              "The unemployment rate is the share of the labour force that is willing and able to work but cannot find a job. It comes in several types with very different causes.",
              [
                "Frictional: people between jobs. Structural: skills don't match available jobs.",
                "Cyclical unemployment rises during recessions.",
                "There's often a short-run trade-off between unemployment and inflation (the Phillips curve).",
              ],
            ),
          },
        ],
      },
      {
        id: "policy",
        label: "Policy",
        children: [
          {
            id: "fiscal",
            label: "Fiscal policy",
            lesson: lesson(
              "Fiscal policy",
              "Policy",
              "Fiscal policy is the government's use of spending and taxation to influence the economy. Spending more or taxing less stimulates demand; the reverse cools an overheating economy.",
              [
                "Expansionary policy fights recessions but can widen the deficit.",
                "The multiplier: one dollar of government spending can raise total output by more than a dollar.",
                "Automatic stabilisers (like unemployment benefits) act without new legislation.",
              ],
            ),
          },
          {
            id: "monetary",
            label: "Monetary policy",
            lesson: lesson(
              "Monetary policy",
              "Policy",
              "Monetary policy is how a central bank manages interest rates and the money supply to keep inflation and employment on target. It's the main day-to-day tool for steering the economy.",
              [
                "Lower rates encourage borrowing and spending; higher rates restrain them.",
                "Central banks are usually independent of the government.",
                "Quantitative easing injects money directly when rates are already near zero.",
              ],
            ),
          },
        ],
      },
      {
        id: "trade",
        label: "International trade",
        children: [
          {
            id: "comparative-advantage",
            label: "Comparative advantage",
            lesson: lesson(
              "Comparative advantage",
              "International trade",
              "A country has a comparative advantage in whatever it can produce at the lowest opportunity cost. Even a country that's worse at everything gains by specialising and trading.",
              [
                "It's about relative cost, not absolute skill.",
                "Specialisation plus trade lets both partners consume beyond their own limits.",
                "It's the core argument for why free trade can make everyone better off.",
              ],
            ),
          },
          {
            id: "exchange-rates",
            label: "Exchange rates",
            lesson: lesson(
              "Exchange rates",
              "International trade",
              "An exchange rate is the price of one currency in terms of another. It shapes the cost of imports and exports and can be set by markets or managed by governments.",
              [
                "A weaker currency makes exports cheaper and imports dearer.",
                "Floating rates move with supply and demand; fixed rates are pegged.",
                "Interest rates, trade balances, and expectations all push rates around.",
              ],
            ),
          },
        ],
      },
    ],
  },
  {
    id: "behavioral",
    label: "Behavioral economics",
    children: [
      {
        id: "biases",
        label: "Cognitive biases",
        lesson: lesson(
          "Cognitive biases",
          "Behavioral economics",
          "Behavioral economics studies the systematic ways real people depart from the “perfectly rational” actor of standard theory. Cognitive biases are the predictable mental shortcuts behind those departures.",
          [
            "Loss aversion: losses hurt about twice as much as equivalent gains feel good.",
            "Anchoring: the first number you see quietly shapes your later judgements.",
            "Present bias: we over-value rewards now and under-save for later.",
          ],
        ),
      },
      {
        id: "nudges",
        label: "Nudges & choice architecture",
        lesson: lesson(
          "Nudges & choice architecture",
          "Behavioral economics",
          "A nudge changes the way choices are presented — without banning options or changing incentives — to steer people toward better decisions. The design of those options is called choice architecture.",
          [
            "Defaults are powerful: automatic pension enrolment dramatically raises saving.",
            "Good nudges are transparent and easy to opt out of.",
            "Small framing changes can produce large behavioural effects.",
          ],
        ),
      },
      {
        id: "prisoners-dilemma",
        label: "The prisoner's dilemma",
        lesson: lesson(
          "The prisoner's dilemma",
          "Behavioral economics",
          "The prisoner's dilemma is the classic game showing why two rational players might fail to cooperate even when cooperation would leave them both better off. It underpins much of game theory.",
          [
            "Each player's dominant strategy is to defect — so both do, and both lose.",
            "It explains arms races, price wars, and why cartels break down.",
            "Repeating the game can sustain cooperation through reputation and retaliation.",
          ],
          {
            practice:
              "Two rival petrol stations on the same corner both “know” they'd earn more if they kept prices high. But each is tempted to undercut the other by a cent to steal customers — so both cut, and both end up with thin margins. That's the prisoner's dilemma playing out on the street: individually rational moves lead to a collectively worse outcome.",
            practiceHeading: "In practice",
            takeaway:
              "Whenever you see cooperation that “should” happen but doesn't — climate agreements, doping in sport, ad spending wars — look for a prisoner's dilemma underneath. The fix is almost always to change the payoffs or repeat the game.",
          },
        ),
      },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    children: [
      {
        id: "formula-sheet",
        label: "Formula sheet",
        lesson: lesson(
          "Formula sheet",
          "Resources",
          "The formulas you'll reach for most often, gathered in one place.",
          [
            "Price elasticity of demand = %Δ quantity ÷ %Δ price",
            "GDP (expenditure) = C + I + G + (X − M)",
            "Profit = Total revenue − Total cost",
            "Real value = Nominal value ÷ (Price index ÷ 100)",
          ],
        ),
      },
      {
        id: "practice",
        label: "Practice problems",
        lesson: lesson(
          "Practice problems",
          "Resources",
          "Short exercises to test whether the ideas have really stuck. Try each one before checking the reasoning.",
          [
            "If a coffee shop raises prices 10% and sales fall 5%, is demand elastic or inelastic?",
            "A country can make either 4 cars or 8 tonnes of wheat. What is the opportunity cost of one car?",
            "Explain how a central bank might respond to inflation rising above target.",
          ],
        ),
      },
    ],
  },
];

/* ---- routing / lookup index (built once) ---------------------------- */
export const DEFAULT_LESSON = "what-is-economics";

type CourseIndex = {
  lessons: Map<string, Lesson>;
  labels: Map<string, string>;
  parents: Map<string, string | null>;
  depths: Map<string, number>;
  pathToId: Map<string, string>;
  idToPath: Map<string, string>;
  defaultOpen: Set<string>;
};

let cached: CourseIndex | null = null;

export function courseIndex(): CourseIndex {
  if (cached) return cached;
  const lessons = new Map<string, Lesson>();
  const labels = new Map<string, string>();
  const parents = new Map<string, string | null>();
  const depths = new Map<string, number>();
  const pathToId = new Map<string, string>();
  const idToPath = new Map<string, string>();
  const defaultOpen = new Set<string>();

  const walk = (list: NavNode[], parent: string | null, depth: number, trail: string[]) => {
    for (const n of list) {
      labels.set(n.id, n.label);
      parents.set(n.id, parent);
      depths.set(n.id, depth);
      const seg = [...trail, n.id];
      if (n.defaultOpen) defaultOpen.add(n.id);
      if (n.lesson) {
        lessons.set(n.id, n.lesson);
        const p = seg.join("/");
        pathToId.set(p, n.id);
        idToPath.set(n.id, p);
      }
      if (n.children) walk(n.children, n.id, depth + 1, seg);
    }
  };
  walk(COURSE, null, 0, []);
  cached = { lessons, labels, parents, depths, pathToId, idToPath, defaultOpen };
  return cached;
}

/** Human labels from the top of the tree down to (and including) a lesson. */
export function breadcrumbFor(id: string): string[] {
  const { labels } = courseIndex();
  const chain = [...ancestorsOf(id)].reverse().map((a) => labels.get(a) ?? a);
  chain.push(labels.get(id) ?? id);
  return chain;
}

export function ancestorsOf(id: string): string[] {
  const { parents } = courseIndex();
  const out: string[] = [];
  let cur = parents.get(id) ?? null;
  while (cur) { out.push(cur); cur = parents.get(cur) ?? null; }
  return out;
}

export function depthOf(id: string): number {
  return courseIndex().depths.get(id) ?? 0;
}

/** URL path (with leading slash) for a lesson id, e.g. "/microeconomics/supply-demand/law-of-demand". */
export function pathForId(id: string): string {
  return "/" + (courseIndex().idToPath.get(id) ?? "");
}

/** Lesson id for a catch-all slug array, or null if it isn't a real lesson. */
export function lessonIdForSlug(slug: string[]): string | null {
  return courseIndex().pathToId.get(slug.join("/")) ?? null;
}

/** Every lesson slug (for generateStaticParams). */
export function allLessonSlugs(): string[][] {
  return [...courseIndex().idToPath.values()].map((p) => p.split("/"));
}
