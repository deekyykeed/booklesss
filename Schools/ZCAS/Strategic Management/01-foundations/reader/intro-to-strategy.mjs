/* SM · Lesson 1 Foundations · Step 1 — Introduction to corporate strategy
 *
 * Source: 1. Introduction to Corporate Strategy.pdf; build_sm_1_1_intro-to-strategy.py (v2 PDF).
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "intro-to-strategy",
  label: "Introduction to strategy",
  title: "Introduction to corporate strategy",
  kicker: "Foundations",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-strategy-is",
      heading: "What strategy is",
      blocks: [
        {
          type: "p",
          text: "Strategy is the direction and scope of an organisation over the long term, achieving advantage through its configuration of resources and competencies — the Johnson, Scholes and Whittington definition, and the one your exam expects. Every word in it is doing work: long term rules out this quarter's firefighting, direction and scope rule out day-to-day running, and advantage means the point is to beat rivals, not merely to operate.",
        },
        {
          type: "p",
          text: "That last distinction — strategy against operations — is the first thing to get firm. Strategy sets where the business is going; operations execute that direction day to day. Deciding that Zambeef will own its supply chain from farm to shop shelf is strategy. Scheduling this week's deliveries from the Mpongwe farms is operations. Both matter, but only one of them is what this course examines.",
        },
        {
          type: "p",
          text: "Everything else in the course hangs off three questions: where are we now, where do we want to go, and how do we get there. Every framework you meet — PESTEL, the Five Forces, SWOT, the BCG matrix, the generic strategies — is a tool for answering one of the three. When a new model appears, place it against its question first and it will make sense faster.",
        },
        {
          type: "callout",
          text: "Strategy answers three questions: Where are we now? Where do we want to go? How do we get there? Every framework in this course maps onto one of them.",
        },
      ],
      check: {
        question:
          "Zambeef's board decides the company will control every stage from animal to packaged product. Its operations team then schedules the week's abattoir throughput. Which is strategy, and why?",
        options: [
          "The board's decision — it sets long-term direction and scope; the scheduling executes that direction day to day",
          "The scheduling — strategy means the detailed plans that actually get work done",
          "Both equally — any decision made inside a company is part of its strategy",
          "Neither — strategy only refers to decisions about competitors",
        ],
        answer: 0,
        explain:
          "Strategy is long-term direction and scope achieving advantage; owning the chain end to end is exactly that. The weekly schedule is operations — it executes the direction but does not set it.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "three-levels",
      heading: "The three levels of strategy",
      blocks: [
        {
          type: "p",
          text: "Strategy operates at three levels, and classifying which level a decision belongs to is a core exam skill — case questions regularly ask you to classify and then justify.",
        },
        {
          type: "table",
          columns: [{ label: "Level" }, { label: "Focus" }, { label: "Example (Zambeef)" }],
          rows: [
            [
              "Corporate",
              "Which industries and markets to compete in; portfolio decisions; capital allocation across units",
              "Expanding cold-chain operations into East Africa alongside the Zambian business",
            ],
            [
              "Business (competitive)",
              "How to compete within a specific market; which customers to serve; how to beat rivals",
              "Retail competes on freshness and convenience rather than undercutting market stalls on price",
            ],
            [
              "Functional / operational",
              "Day-to-day implementation through HR, marketing, finance and operations",
              "Marketing allocates ZMW 80,000 to a loyalty scheme for repeat customers",
            ],
          ],
        },
        {
          type: "p",
          text: "A memorable shorthand: corporate asks \"what businesses should we be in?\", business asks \"how do we compete in this business?\", and functional asks \"how do we execute that day to day?\". When a case describes a decision, classify the level before you analyse the decision — the classification usually is what the question is testing.",
        },
        {
          type: "p",
          text: "The levels also cascade. When ZESCO decides to enter solar generation for rural communities, that corporate choice forces business-level decisions — which customers, what pricing against diesel generators and home solar kits — and functional ones — who builds the installation teams, how billing systems change. A corporate decision that never cascades into the lower levels stays an announcement.",
        },
      ],
      check: {
        question:
          "ZESCO announces it will expand into solar energy generation for rural communities. What level of strategy is that?",
        options: [
          "Corporate — it is a decision about which markets and businesses to be in",
          "Business — it describes how ZESCO will beat its competitors",
          "Functional — generation is an operational activity",
          "None — parastatals do not make strategic decisions",
        ],
        answer: 0,
        explain:
          "Entering a new market (rural solar generation) is a portfolio decision — which businesses to be in — which sits at the corporate level. How to compete within that market, and the day-to-day delivery, are the business and functional decisions that follow from it.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "five-ps",
      heading: "Mintzberg's five Ps of strategy",
      blocks: [
        {
          type: "p",
          text: "Mintzberg's contribution is the observation that strategy is not always the deliberate, written thing the definition suggests. He identified five forms it actually takes in organisations.",
        },
        {
          type: "table",
          columns: [{ label: "P" }, { label: "What it means" }],
          rows: [
            ["Plan", "A conscious, top-down process — analyse, choose, implement. The formal written strategy."],
            ["Ploy", "A tactical manoeuvre aimed at a specific rival. Not the long-run position — just the move."],
            ["Pattern", "Consistent behaviour that emerges over time, planned or not. Strategy as what you repeatedly do."],
            ["Position", "How the firm places itself relative to competitors and the external environment."],
            ["Perspective", "The organisation's ingrained worldview — its shared assumptions about how to compete."],
          ],
        },
        {
          type: "p",
          text: "The pair the exam tests hardest is plan against pattern. A plan is deliberate: it comes from the top and exists before the actions it directs. A pattern is emergent: it shows up in a consistent stream of decisions over time whether or not anyone intended it. The uncomfortable implication — and the reason examiners like it — is that a company can have an emergent pattern that contradicts its written plan. A bank whose plan says \"digital first\" but which approves branch expansion every year has a pattern that tells you its real strategy.",
        },
        {
          type: "callout",
          text: "Plan is deliberate and top-down; pattern is emergent — visible only in consistent decisions over time. When they conflict, the pattern is the strategy the company actually has.",
        },
      ],
      check: {
        question:
          "A retailer's written strategy commits it to premium positioning, yet for four straight years it has responded to every competitor promotion with a deeper discount. In Mintzberg's terms, what has happened?",
        options: [
          "An emergent pattern of price competition has displaced the deliberate plan — the pattern is its real strategy",
          "The company has executed its plan, since discounting attracts premium customers",
          "The discounts are a perspective — the company's worldview about retail",
          "Nothing — strategy only refers to what is written down",
        ],
        answer: 0,
        explain:
          "The written plan says premium, but the consistent stream of decisions says price-fighter. Mintzberg's pattern captures exactly this: strategy as what the organisation repeatedly does, which here contradicts what it says.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "the-process",
      heading: "The strategic management process",
      blocks: [
        {
          type: "p",
          text: "Strategic management runs as a cycle of four stages. \"Describe the process\" is a standard long-answer question, so know each stage by name and in sequence.",
        },
        {
          type: "table",
          columns: [{ label: "Stage" }, { label: "What happens" }],
          rows: [
            [
              "1. Environmental analysis",
              "Scan external threats and opportunities; audit internal resources and capabilities. Tools: PESTEL, Porter's Five Forces, SWOT, VRIO.",
            ],
            [
              "2. Strategy formulation",
              "Set mission and objectives; generate strategic options; choose a direction. Tools: Ansoff, BCG, the generic strategies.",
            ],
            [
              "3. Strategy implementation",
              "Convert the chosen strategy into structures, budgets, processes and people.",
            ],
            [
              "4. Evaluation and control",
              "Monitor performance against targets; feed the findings back into the next planning cycle.",
            ],
          ],
        },
        {
          type: "p",
          text: "The stages are a loop, not a line — what evaluation finds becomes the input to the next round of analysis. And formulation begins with purpose: what is this organisation for, and what is it trying to achieve? Get that wrong and every option you evaluate afterwards is measured against the wrong target, which is why mission, vision and objectives come next in this course.",
        },
      ],
      check: {
        question:
          "A company has completed its PESTEL and Five Forces work and audited its own capabilities. What does the strategic management process say happens next?",
        options: [
          "Strategy formulation — set objectives, generate options, and choose a direction",
          "Evaluation and control — check whether the analysis hit its targets",
          "Implementation — restructure the organisation around the findings",
          "Repeat the environmental analysis until the picture stops changing",
        ],
        answer: 0,
        explain:
          "Analysis is stage one; its output feeds formulation, where options are generated and a direction chosen. Implementation and control only make sense once there is a chosen strategy to implement and monitor.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "competitive-advantage",
      heading: "Competitive advantage and the generic strategies",
      blocks: [
        {
          type: "p",
          text: "A competitive advantage is an attribute that lets a firm outperform its rivals — either through lower cost or through higher perceived value. It is sustainable when rivals cannot easily replicate it. Porter mapped the ways of pursuing one into five specific approaches.",
        },
        {
          type: "table",
          columns: [{ label: "Strategy" }, { label: "How it competes" }, { label: "Scope" }],
          rows: [
            ["Low-cost provider", "Lowest industry cost base; compete on price", "Broad"],
            ["Focused low-cost", "Lowest cost within one specific niche", "Narrow"],
            ["Broad differentiation", "Distinctive product — quality, brand, innovation — at a premium price", "Broad"],
            ["Focused differentiation", "Unique features for a narrow customer group, at a premium", "Narrow"],
            ["Best-cost provider", "Good quality at a competitive price — the middle ground", "Value buyers"],
          ],
        },
        {
          type: "p",
          text: "Notice that scope — broad against narrow — is a separate choice from the source of advantage — cost against differentiation. When you read a case, identify the scope first, then the source. Mixing the two up is the most common error in generic-strategy questions: a firm serving one niche cheaply is a focused low-cost player, not a low-cost provider, and the difference changes every recommendation that follows.",
        },
        {
          type: "p",
          text: "Try it on Zanaco. The bank keeps branches running across rural Zambia, including some that run at a loss, and treats that reach as part of its identity. Broad scope, and an advantage built on accessibility and trust rather than on being the cheapest — a broad differentiation position. That reading also tells you what threatens it: a mobile money operator reaches the same rural customer without a single branch, attacking the very thing the differentiation is built on. Which of Porter's strategies a firm follows is never just a label — it tells you where it is exposed.",
        },
      ],
      check: {
        question:
          "A Lusaka bakery sells only to hotel kitchens, and wins the business by being cheaper than every rival that serves them. Which generic strategy is that?",
        options: [
          "Focused low-cost — a narrow customer group, won on cost",
          "Low-cost provider — it competes on price, so scope is irrelevant",
          "Focused differentiation — serving hotels is a form of uniqueness",
          "Best-cost provider — cheap and good enough is the middle ground",
        ],
        answer: 0,
        explain:
          "Identify scope first: hotel kitchens only, so narrow. Then the source of advantage: price, so cost. Narrow plus cost is focused low-cost. Calling it a low-cost provider ignores the scope dimension, which is exactly the error the question type is designed to catch.",
      },
    },
  ],
};
