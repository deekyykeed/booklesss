/* SM · Lesson 3 Strategy · Step 1 — Corporate strategy
 *
 * Source: 5. Strategic Management Module.pdf Units 2–3, 8;
 *         build_sm_3_1_corporate-strategy.py (v2 PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "corporate-strategy",
  label: "Corporate strategy",
  title: "Corporate strategy",
  kicker: "Strategy",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "where-strategy-happens",
      heading: "Where strategy-making happens",
      blocks: [
        {
          type: "p",
          text: "With the analysis done — the environment mapped, the organisation's capabilities graded — the work shifts from analysis to choice. Strategic choices happen at three distinct levels, each with its own decision-makers, its own question, and its own time horizon.",
        },
        {
          type: "table",
          columns: [
            { label: "Level" },
            { label: "Who decides" },
            { label: "Core question" },
            { label: "Horizon" },
          ],
          rows: [
            [
              "Corporate",
              "Board / group CEO",
              "Which businesses should we be in? How do we allocate capital across them?",
              "5–10 years",
            ],
            [
              "Business",
              "Divisional MD / BU head",
              "How do we compete and win within our chosen market?",
              "2–5 years",
            ],
            [
              "Functional",
              "Functional heads (CFO, CMO, COO…)",
              "How does each function support the business strategy?",
              "1–2 years",
            ],
          ],
        },
        {
          type: "p",
          text: "Confusing the levels is one of the most common strategy mistakes in practice — corporate leadership meddling in operational decisions, or business units making portfolio choices that belong with the board. This step sits at the top of the hierarchy: corporate-level strategy, the most consequential and the hardest to reverse. Entering a new industry or acquiring a business takes years to undo if it turns out to be wrong, which is why the analytical work had to come first.",
        },
      ],
      check: {
        question:
          "A divisional MD proposes acquiring a company in an industry the group has never operated in. Why does that decision not belong at their level?",
        options: [
          "Which businesses the group is in is a portfolio question — corporate level, decided by the board",
          "It does belong at their level — divisions decide their own acquisitions",
          "Acquisitions are functional decisions, so the CFO decides alone",
          "Because acquisitions take less than two years to complete",
        ],
        answer: 0,
        explain:
          "Entering a new industry changes the composition of the portfolio and commits group capital for years — the corporate question. The division's remit is how to win in the market it already has.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "four-directions",
      heading: "The four corporate directions",
      blocks: [
        {
          type: "p",
          text: "At the corporate level the fundamental question is what direction the organisation should move in, and there are four broad answers. Every corporate-level decision fits one of them.",
        },
        {
          type: "table",
          columns: [{ label: "Direction" }, { label: "What it means" }, { label: "When to choose it" }],
          rows: [
            [
              "Growth",
              "Expand — into new products, markets or businesses; increase revenue and competitive scope",
              "When the environment offers real opportunity and the firm has the capability and capital to capture it",
            ],
            [
              "Stability",
              "Maintain the current position; protect what works without significant new investment",
              "When the market is mature, the firm performs well, and disruption carries more risk than growth",
            ],
            [
              "Retrenchment",
              "Pull back — cut costs, exit underperformers, refocus on core strengths",
              "When performance is declining, resources are stretched, or parts of the portfolio destroy value",
            ],
            [
              "Combination",
              "Apply different directions to different business units simultaneously",
              "When the portfolio is diverse — some units merit growth, others stability or exit",
            ],
          ],
        },
        {
          type: "p",
          text: "Most large Zambian organisations are combination strategists without labelling it. Zambeef invests aggressively in cold-chain capacity (growth) while running its retail outlets as mature steady earners (stability). First Quantum expands into new minerals and geographies while exiting mines that no longer cover their cost of capital (retrenchment). In a case answer, resist the urge to stamp one direction on a whole company — read the portfolio unit by unit.",
        },
      ],
      check: {
        question:
          "A group closes two loss-making subsidiaries, holds its profitable mature unit steady, and doubles investment in its fastest-growing one. Which corporate direction is that?",
        options: [
          "Combination — retrenchment, stability and growth applied to different units at once",
          "Retrenchment — closures define the direction for the whole group",
          "Growth — the doubled investment outweighs everything else",
          "Stability — on balance the group is the same size as before",
        ],
        answer: 0,
        explain:
          "Direction is chosen per unit, and this group is running three directions simultaneously — the definition of a combination strategy. Averaging them into one label loses exactly the information the corporate level exists to manage.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "growth-paths",
      heading: "How organisations grow — four paths",
      blocks: [
        {
          type: "p",
          text: "Choosing growth still leaves the question of how. The four main growth paths carry very different risk profiles and capability requirements, roughly in rising order of distance from what the firm already knows.",
        },
        {
          type: "p",
          text: "Concentrated growth (intensification) focuses resources on profitable growth within the existing product and existing market. The logic is blunt: if the current market is not fully captured, why look elsewhere? Zambia's mobile money market ran on concentrated growth for years — MTN, Airtel and Zamtel fighting for the same customer base — until saturation pushed them toward new segments.",
        },
        {
          type: "p",
          text: "Market development takes an existing product into a new market — Zambian Breweries pushing distribution into rural areas or neighbouring countries. Product development launches new products for existing customers — a bank adding insurance and pensions for its account holders. Both are lower-risk than full diversification because the firm builds on something it already knows well: either the product or the customer.",
        },
        {
          type: "ul",
          items: [
            "Vertical integration, backward: expand toward suppliers — Zambeef owning its feedlots, abattoirs and processing plants, controlling every stage from animal to packaged product.",
            "Vertical integration, forward: expand toward customers — a manufacturer opening its own retail outlets. Margin capture and direct customer relationships, at the risk that retail needs very different capabilities than manufacturing.",
            "Horizontal integration: acquire or merge with a competitor at the same stage of the value chain — Stanbic's acquisition of CFC Bank: same industry, same customers, merged for scale. The recurring risk is that integration costs and culture clashes destroy the value the deal was meant to create.",
          ],
        },
        {
          type: "callout",
          kind: "key",
          text: "The growth paths are ordered by distance from what the firm already knows. Each step away — new market, new product, new stage of the chain, new industry — adds risk that must be paid for by a bigger prize.",
        },
      ],
      check: {
        question:
          "A flour miller acquires the wheat farms that supply it. Which growth path is that?",
        options: [
          "Backward vertical integration — expanding along the supply chain toward its inputs",
          "Horizontal integration — the farms and the mill are both agribusinesses",
          "Market development — the miller now sells into the farming market",
          "Concentrated growth — the miller is deepening its existing business",
        ],
        answer: 0,
        explain:
          "The farms sit upstream of the mill — the supplier stage — so buying them integrates backward, taking control of input cost and quality. Horizontal would be buying another miller; nothing here changes what the miller sells or to whom.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "diversification",
      heading: "Diversification — and its three tests",
      blocks: [
        {
          type: "p",
          text: "Diversification means entering a business genuinely new to the firm — different products, different markets, different competitive dynamics. It is the highest-risk growth path, and decades of research are humbling: most diversification moves destroy shareholder value. Done well, it can spread income across businesses and create value where real synergies exist — but \"real\" is the operative word.",
        },
        {
          type: "p",
          text: "Related (concentric) diversification enters businesses that share technology, customers, channels or brand with the core. The test is whether specific synergies exist — named cost savings or revenue gains that would not exist if the businesses were separate, not just the word synergy in a board paper. A Zambian bank entering asset management, insurance or stockbroking is the classic case: same customers, complementary products, shared compliance infrastructure.",
        },
        {
          type: "p",
          text: "Unrelated (conglomerate) diversification enters businesses with no strategic connection to the core. The only rationale is financial — the acquirer believes it can manage the target better than its current owners, or that cash flows from different industries reduce overall risk. It is notoriously hard to execute: running a mining company and a supermarket chain requires entirely different capabilities, and most large conglomerates eventually break up because the parts are worth more separately.",
        },
        {
          type: "table",
          columns: [{ label: "Test" }, { label: "The question" }],
          rows: [
            ["1. Industry attractiveness", "Is the target industry genuinely attractive, or are you buying into a declining sector?"],
            ["2. Cost of entry", "Will you pay so much to get in that future profits can never justify the price?"],
            ["3. Better-off", "Will the combined entity be better off than the businesses operating independently?"],
          ],
        },
        {
          type: "p",
          text: "Every proposed diversification must pass all three. Zambeef's portfolio — beef, chicken, fish, retail, cold-chain logistics — reads as related diversification with genuine synergies: the cold chain and the shops serve every protein line at once. The parts of a portfolio that fail the better-off test are the ones a retrenchment review eventually finds.",
        },
      ],
      check: {
        question:
          "An acquirer finds a genuinely attractive industry, but the bidding war means it pays a price the target's future profits can never recover. Which test fails?",
        options: [
          "Cost of entry — attractive industry, but the price of admission consumed the value",
          "Industry attractiveness — a high price proves the industry was unattractive",
          "Better-off — synergies never materialised",
          "None — passing one test is sufficient",
        ],
        answer: 0,
        explain:
          "The three tests are independent, and this is the second one doing its job: an attractive industry can still be a bad deal if entry costs more than the position is worth. All three must pass, which is why most diversification destroys value.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "bcg-matrix",
      heading: "The BCG matrix — allocating capital across the portfolio",
      blocks: [
        {
          type: "p",
          text: "An organisation running multiple businesses needs a way to decide where to invest, where to harvest, and where to exit. The BCG growth-share matrix maps every business unit on two dimensions — market growth rate and relative market share — producing four quadrants with distinct strategic logic.",
        },
        {
          type: "table",
          columns: [
            { label: "Quadrant" },
            { label: "Growth" },
            { label: "Share" },
            { label: "Strategic logic" },
            { label: "Cash flow" },
          ],
          rows: [
            [
              "Stars",
              "High",
              "High",
              "Invest heavily to hold position; today's stars become tomorrow's cash cows as the market matures",
              "Roughly neutral — earns cash and consumes it",
            ],
            [
              "Cash cows",
              "Low",
              "High",
              "Milk the profits; don't over-invest; the cash funds the stars and question marks",
              "Strongly positive — the portfolio's engine",
            ],
            [
              "Question marks",
              "High",
              "Low",
              "Decide quickly: invest to become a star, or exit before the market matures around you",
              "Negative — growth demands investment, low share limits return",
            ],
            [
              "Dogs",
              "Low",
              "Low",
              "Exit or reposition; they consume attention and rarely cover their cost of capital",
              "Neutral to negative",
            ],
          ],
        },
        {
          type: "p",
          text: "Apply it to Zambian Breweries. Mosi Lager — dominant share of a mature mass market — is the classic cash cow, the earnings engine. Eagle and Rhino, the affordable sorghum beers, sit between cow and star depending on how fast that segment grows. The premium imported brands it distributes — low share of an emerging segment — are question marks: invest seriously in premium positioning, or leave the segment to independents. The matrix's real output is that sentence — a capital-allocation argument per unit.",
        },
        {
          type: "p",
          text: "Use it with its limits in view. The matrix assumes market share drives profitability (through experience-curve effects) and that high-growth markets are always worth entering — neither is universally true. Treat BCG as the starting framework for the portfolio conversation, and let the three diversification tests keep the final say on any entry or exit.",
        },
      ],
      check: {
        question:
          "A unit holds high share of a market whose growth has slowed to a crawl. The board proposes heavy new investment in it. What does the BCG logic say?",
        options: [
          "It is a cash cow — harvest its cash to fund stars and question marks, and don't over-invest in a market that has stopped growing",
          "It is a star — high share always justifies heavy investment",
          "It is a dog — low growth means immediate exit",
          "It is a question mark — invest to find out",
        ],
        answer: 0,
        explain:
          "High share plus low growth is the cash-cow quadrant: the position is already won and the market won't reward expansion capital. The cow's job is to fund the units whose markets are still being decided — over-investing in it starves them.",
      },
    },
  ],
};
