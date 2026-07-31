/* SM · Lesson 3 Strategy · Step 2 — Competitive strategy
 *
 * Source: 5. Strategic Management Module.pdf Unit 9; 8. Competitive Strategy.pdf;
 *         build_sm_3_2_competitive-strategy.py (v2 PDF).
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "competitive-strategy",
  label: "Competitive strategy",
  title: "Competitive strategy",
  kicker: "Strategy",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "portfolio-to-battlefield",
      heading: "From portfolio to battlefield",
      blocks: [
        {
          type: "p",
          text: "Corporate strategy answered which businesses to be in. Competitive strategy answers the business-level question: how do we compete and win in the business we have chosen? The difference matters — a wrong corporate decision wastes years, while a wrong competitive decision wastes resources and market position that are hard to recover.",
        },
        {
          type: "p",
          text: "Porter's core argument is that sustainable advantage comes from choosing a clear position — and that the worst strategic error is trying to be everything to everyone. He calls that being stuck in the middle: neither cost-competitive nor meaningfully differentiated. Stuck-in-the-middle firms earn below-average returns in every industry he studied, because each customer has a rival that serves them better on the dimension they care about.",
        },
        {
          type: "callout",
          text: "The choice is the strategy. A firm that will not choose between cost and differentiation ends up worse than the cost leader at cost and worse than the differentiators at everything else.",
        },
      ],
      check: {
        question:
          "A Zambian supermarket tries to match Shoprite's prices, stock premium imports, and win on convenient locations, all at once. What does Porter predict?",
        options: [
          "Below-average returns — it will be beaten on cost by Shoprite and on range by specialists, with no defensible position",
          "Above-average returns — serving every need captures every customer",
          "It becomes the cost leader, since matching prices is what counts",
          "It becomes a differentiator, since range and convenience are unique value",
        ],
        answer: 0,
        explain:
          "That is stuck in the middle: without Shoprite's scale it cannot win on price, and splitting investment across price, range and locations means no single position is defensible. Porter's remedy is to pick one position and make it hard to attack.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "generic-strategies",
      heading: "The generic strategies",
      blocks: [
        {
          type: "p",
          text: "Two dimensions define the space of viable positions: the source of advantage (lower cost against unique value) and the competitive scope (broad market against narrow segment). They combine into the generic strategies.",
        },
        {
          type: "table",
          columns: [
            { label: "Strategy" },
            { label: "Advantage" },
            { label: "Scope" },
            { label: "How to win" },
            { label: "Core risk" },
          ],
          rows: [
            [
              "Cost leadership",
              "Lower cost",
              "Broad",
              "Produce and deliver cheaper than anyone; share some savings with customers, keep the rest as margin",
              "Technology change erodes the cost base; rivals copy the efficiencies",
            ],
            [
              "Differentiation",
              "Unique value",
              "Broad",
              "Offer what competitors cannot easily replicate — brand, technology, service — and charge a premium",
              "The premium narrows as rivals imitate; preferences drift away from the differentiator",
            ],
            [
              "Cost focus",
              "Lower cost",
              "Narrow",
              "Be the low-cost provider for one segment, geography or niche",
              "The segment shrinks, or broad cost leaders attack it",
            ],
            [
              "Differentiation focus",
              "Unique value",
              "Narrow",
              "Serve one segment so well that broad competitors cannot match you there",
              "Broad differentiators narrow their aim; the niche drifts mainstream",
            ],
          ],
        },
        {
          type: "p",
          text: "The Zambian market gives clean examples of each side. Shoprite and Pick n Pay run cost leadership in retail — scale buying, efficient logistics, no-frills formats — and a local chain that tries to match their prices without their scale is on a losing path; its correct response is to differentiate or focus. On the other side, Zanaco's business banking differentiates through local relationships, Zambia-specific products and government-contracting access an international bank cannot easily match, and Zambeef differentiates on farm-to-shelf traceability and cold-chain reliability that smaller rivals cannot afford to replicate.",
        },
      ],
      check: {
        question:
          "A small retailer cannot match Shoprite's cost base. Which responses are consistent with Porter's framework?",
        options: [
          "Differentiate or focus — compete on something other than price, or dominate a segment the giants serve poorly",
          "Cut prices below Shoprite's and accept losses until Shoprite retreats",
          "Match Shoprite on price while also stocking premium goods",
          "Exit retail — no position exists against a cost leader",
        ],
        answer: 0,
        explain:
          "A cost war against a bigger cost base is unwinnable, and price-plus-premium is stuck in the middle. The framework leaves two live options: unique value at broad scope, or winning a narrow segment outright — both avoid fighting the leader on its own ground.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "achieving-positions",
      heading: "Achieving and defending each position",
      blocks: [
        {
          type: "p",
          text: "Cost leadership is not price-cutting — it is structural cost advantage built into how the business operates. The recognised sources:",
        },
        {
          type: "ul",
          items: [
            "Scale — higher volume spreads fixed costs over more units, the logic of Zambia's telecom operators.",
            "Experience curve — cumulative production lowers unit costs over time.",
            "Process design — standardised, efficient workflows cut labour and waste.",
            "Supply chain — preferred supplier contracts, bulk purchasing, backward integration.",
            "Technology — automating routine tasks; digital delivery instead of physical.",
          ],
        },
        {
          type: "p",
          text: "Differentiation has its own test: the difference must be perceived as valuable by customers and be hard for competitors to copy. Differences customers don't notice or don't care about are cost without revenue. The durable sources:",
        },
        {
          type: "ul",
          items: [
            "Brand — built over years, impossible to copy quickly (MTN's brand in Zambia).",
            "Proprietary technology or process — capability rivals cannot buy.",
            "Customer relationships — loyalty and switching costs that hold customers in place.",
            "Quality signals — certifications, awards, reputation accumulated over time.",
            "Integration depth — Zambeef's farm-to-retail chain, creating end-to-end control.",
          ],
        },
        {
          type: "p",
          text: "Notice that both lists are structural. A price cut can be matched by Monday; a cost base built on scale and process cannot. A slogan can be copied; a brand and a cold chain cannot. Positions survive on what rivals find expensive to imitate — which is the VRIO logic from the internal-environment step applied to competition.",
        },
      ],
      check: {
        question:
          "A firm \"differentiates\" by adding features its customers, when surveyed, neither notice nor value. What has it achieved?",
        options: [
          "Higher cost with no premium — failed differentiation, drifting toward stuck in the middle",
          "Differentiation — any difference from rivals counts",
          "Cost leadership — features are an investment in scale",
          "A focus strategy — the features define a niche",
        ],
        answer: 0,
        explain:
          "Differentiation only works when customers value the difference enough to pay for it. Unvalued features raise the cost base without raising willingness to pay — the firm carries a differentiator's costs at a cost-competitor's prices.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "offensive-strategies",
      heading: "Offensive strategies — going on the attack",
      blocks: [
        {
          type: "p",
          text: "Once a firm holds a position, the next question is how to strengthen it. Offensive strategies are deliberate moves to improve competitive position, gain share, or neutralise a rival's advantage — and each has a specific objective and a specific counter-risk.",
        },
        {
          type: "table",
          columns: [{ label: "Offensive move" }, { label: "What it involves" }, { label: "When to use it" }],
          rows: [
            [
              "Attack competitor strengths",
              "Match or exceed rivals where they are strongest — out-invest, out-innovate, undercut",
              "When you can sustain the fight and the long-term prize justifies its cost",
            ],
            [
              "Attack competitor weaknesses",
              "Target gaps — underserved segments, slow distribution, weak service",
              "When rivals are overextended or have neglected segments or regions",
            ],
            [
              "End-run (blue ocean)",
              "Bypass existing competition by creating market space where rivals don't yet compete",
              "When existing markets are saturated and a genuinely underserved need exists",
            ],
            [
              "Guerrilla offensives",
              "Small targeted strikes — regional promotions, aggressive local marketing — to disrupt rather than defeat",
              "When the firm lacks scale for a direct assault but can inflict damage cheaply",
            ],
            [
              "Pre-emptive strikes",
              "Lock up resources, talent or partnerships before rivals can",
              "When being first in an emerging segment creates durable lock-in",
            ],
          ],
        },
        {
          type: "p",
          text: "Mobile money is Zambia's standing lesson in pre-emption. The early entrant built a customer base that later entrants struggled to displace, because network effects made the position self-reinforcing — the more users, the more useful the service, the harder the catch-up. Late entrants spent heavily on incentives just to reach parity. First-mover advantage is not automatic, but where network effects exist, the pre-emptive strike is the offensive move that matters most.",
        },
      ],
      check: {
        question:
          "A small beverage firm cannot outspend the market leader nationally, so it runs deep promotions town by town, forcing the leader to respond everywhere at once. Which offensive move is that?",
        options: [
          "Guerrilla offensive — selective, cheap strikes that disrupt a larger rival without a head-on assault",
          "Attacking competitor strengths — promotions attack the leader's brand",
          "Pre-emptive strike — the firm moved first in each town",
          "End-run — the firm has created a new market",
        ],
        answer: 0,
        explain:
          "Small, targeted, affordable strikes that harass a bigger rival are the definition of guerrilla tactics — chosen precisely because the firm lacks the scale for a sustained frontal attack. A pre-emptive strike would lock up something durable before the rival could; this locks up nothing.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "defensive-strategies",
      heading: "Defensive strategies — holding your ground",
      blocks: [
        {
          type: "p",
          text: "Competitive advantage is never permanent: rivals attack, technology shifts, regulation changes, preferences drift. Defensive strategy makes your position harder to attack and responds to threats before they erode your standing. The first family of moves raises barriers:",
        },
        {
          type: "ul",
          items: [
            "Switching costs — loyalty programmes, data lock-in, long contracts that make leaving expensive or inconvenient.",
            "Broadened product range — filling the gaps a rival could use as an entry point.",
            "Exclusive supplier or distribution agreements — denying rivals access to key inputs or channels.",
            "Signalling strength — communicating convincingly that attacks will be met in force, which deters opportunistic entry.",
          ],
        },
        {
          type: "p",
          text: "The second family is response. The correct response depends on the attack: if a rival undercuts your core segment, the question is not \"match the price\" but \"why are customers defecting, and can we fix that without destroying margin?\" A targeted response — matching the price only in the attacked segment, not market-wide — costs less and still sends the signal, without collapsing your whole pricing structure.",
        },
        {
          type: "p",
          text: "Consider a mid-sized Zambian bank facing a digital-only entrant offering zero-fee accounts and instant mobile onboarding, while the bank leads on branch network and business banking relationships. The defensive playbook writes itself from the frameworks: deepen switching costs where it is strong (payroll, business lending relationships), close the onboarding gap so the entrant's advantage stops widening, and defend fees only in the retail segments actually under attack — not across the business book the entrant cannot serve.",
        },
        {
          type: "callout",
          text: "The goal is not to answer every attack but to be structurally unattractive to attack. Rivals who know you will defend hard, and can, look elsewhere.",
        },
      ],
      check: {
        question:
          "A digital entrant undercuts a bank's retail account fees. The bank responds by cutting fees across every product, including business banking the entrant doesn't offer. What went wrong?",
        options: [
          "The response wasn't targeted — it destroyed margin in segments that were never under attack",
          "Nothing — a full price match is the strongest possible signal",
          "The bank should have raised fees to signal confidence",
          "The bank should have ignored the entrant entirely",
        ],
        answer: 0,
        explain:
          "Defensive response should match the attack's footprint. Cutting fees market-wide surrenders margin in the business book — where the bank's advantage was safe — to solve a problem confined to retail. A segment-scoped match sends the same signal at a fraction of the cost.",
      },
    },
  ],
};
