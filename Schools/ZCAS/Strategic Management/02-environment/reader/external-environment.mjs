/* SM · Lesson 2 Environment · Step 1 — The external environment
 *
 * Source: 3. External Environment.pdf; build_sm_2_1_external-environment.py (v2 PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "external-environment",
  label: "The external environment",
  title: "The external environment",
  kicker: "Environment",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "two-layers",
      heading: "Two layers of the outside world",
      blocks: [
        {
          type: "p",
          text: "The environment an organisation competes in has two distinct layers, and analysing only one of them means planning with half the picture. The macro environment is the set of broad forces — politics, economics, society, technology, ecology, law — that affect every industry and that no single company controls. The industry environment is the competitive structure of the specific market you operate in: who the rivals are, where the power sits, what threatens your position.",
        },
        {
          type: "table",
          columns: [{ label: "Layer" }, { label: "What it covers" }, { label: "Primary tool" }],
          rows: [
            [
              "Macro environment",
              "Broad forces affecting all industries — no single company controls them",
              "PESTEL analysis",
            ],
            [
              "Industry environment",
              "The competitive structure of your specific market — rivals, entrants, suppliers, buyers, substitutes",
              "Porter's Five Forces",
            ],
          ],
        },
        {
          type: "p",
          text: "PESTEL answers: what forces are shaping the world we compete in? The Five Forces answer: what is the competitive structure of our specific industry? Neither replaces the other, and this step works through both — first the world, then the battlefield.",
        },
      ],
      check: {
        question:
          "Kwacha depreciation raises the cost of every imported input in Zambia. Which layer of the external environment is that, and why?",
        options: [
          "Macro — it is an economic force affecting every industry, controlled by no company",
          "Industry — it changes the bargaining power of suppliers",
          "Internal — it appears in each company's cost base",
          "Neither — exchange rates are an accounting matter, not a strategic one",
        ],
        answer: 0,
        explain:
          "Exchange rates hit importers in every industry at once and no firm can negotiate with them — the defining features of a macro force, which is why it belongs in a PESTEL scan rather than a Five Forces analysis.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "pestel",
      heading: "PESTEL — mapping the macro environment",
      blocks: [
        {
          type: "p",
          text: "PESTEL maps the macro environment across six categories of external influence. For each, the discipline is knowing what to monitor.",
        },
        {
          type: "table",
          columns: [{ label: "Factor" }, { label: "What to monitor" }],
          rows: [
            [
              "Political",
              "Government stability, tax policy, trade regulations, foreign investment rules, state ownership requirements",
            ],
            [
              "Economic",
              "GDP growth, inflation, interest rates, exchange rates, employment levels, credit availability",
            ],
            [
              "Social",
              "Demographics, urbanisation, education levels, cultural attitudes, shifts in consumer behaviour",
            ],
            [
              "Technological",
              "Digital infrastructure, automation, fintech disruption, mobile penetration, platform ecosystems",
            ],
            [
              "Environmental",
              "Climate risk, ecological regulations, sustainability requirements from investors and lenders",
            ],
            [
              "Legal",
              "Competition law, employment law, consumer protection, sector licensing and regulatory frameworks",
            ],
          ],
        },
        {
          type: "callout",
          text: "PESTEL is a thinking tool, not a checklist. The question is never \"what are the factors?\" but \"which factors are most material to this company in this context, and how do they interact?\"",
        },
      ],
      check: {
        question:
          "Zambia Breweries is planning a major capacity expansion. Of the following, which PESTEL pairing is most material to that specific decision?",
        options: [
          "Economic (kwacha and inflation moving input costs) and Environmental (water use and its regulation, central to brewing)",
          "Legal (employment law) and Social (education levels), because every company employs people",
          "Political (foreign policy) and Technological (social media trends)",
          "All six factors equally — PESTEL requires giving each the same weight",
        ],
        answer: 0,
        explain:
          "Materiality is the whole game. A brewery buys imported inputs and grain in a currency that moves, and it is one of the largest industrial water users in any economy — those two factors bear directly on a capacity decision. Weighting all six equally is exactly the checklist thinking the framework warns against.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "pestel-in-zambia",
      heading: "PESTEL applied — the Zambian record",
      blocks: [
        {
          type: "p",
          text: "Political decisions reset the rules of the game directly. When the Zambian government adjusted mining royalty rates in 2019 — raising them for open-cast mines to 9% at copper prices above USD 7,500 per tonne — First Quantum and the other mining houses had to rebuild their investment cases overnight. No amount of internal efficiency offsets a policy change that moves the cost line by that much.",
        },
        {
          type: "p",
          text: "Economic conditions set the baseline pressure on everything else. Between 2015 and 2023 the kwacha depreciated from roughly K8 per USD to over K25, and any company holding dollar-denominated debt or importing inputs absorbed that as a direct cost increase. With inflation peaking above 22% in 2021, pricing, sourcing and financing had to be revised constantly — not because of anything those companies did, but because of macro conditions none of them could control.",
        },
        {
          type: "p",
          text: "Social and technological factors often move together. Zambia's population is young — over 60% under 25 — and urbanising fast, a profile that drives demand for mobile-first products. Mobile money penetration has outpaced formal banking: MTN Mobile Money and Airtel Money together serve more Zambians by transaction volume than all the commercial banks combined. A company that built its distribution around physical branches in 2015 and failed to track that shift was positioned for the wrong market by 2022.",
        },
        {
          type: "p",
          text: "Notice what the examples share: in each case the force was visible in advance to anyone scanning for it. The royalty change was debated publicly; the depreciation trend ran for years; the demographic data was published. PESTEL's value is not prediction — it is making sure the organisation is actually looking.",
        },
      ],
      check: {
        question:
          "The 2019 royalty change forced mining houses to rebuild their investment cases. What does that illustrate about macro forces?",
        options: [
          "A single political decision can move an industry's economics more than anything the firms themselves control",
          "Mining companies should have lobbied harder, making it an internal weakness",
          "Royalties are an industry force, best analysed as supplier power",
          "Macro forces only matter to foreign-owned companies",
        ],
        answer: 0,
        explain:
          "That is the defining property of the macro layer: the rules changed for every player at once, from outside the industry, and no internal efficiency could offset it. Strategy has to account for such forces precisely because it cannot control them.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "five-forces",
      heading: "Porter's Five Forces",
      blocks: [
        {
          type: "p",
          text: "PESTEL tells you about the world; the Five Forces tell you about the battlefield. The framework maps the competitive structure of an industry — where the power sits, what threatens margins, and whether the industry is structurally attractive or structurally hard to profit in.",
        },
        {
          type: "table",
          columns: [{ label: "Force" }, { label: "What it measures" }],
          rows: [
            ["1. Competitive rivalry", "The intensity of competition among existing players"],
            ["2. Threat of new entrants", "How easily new competitors can enter the industry"],
            ["3. Bargaining power of suppliers", "How much leverage suppliers have over pricing and terms"],
            ["4. Bargaining power of buyers", "How much power customers have to demand lower prices or better terms"],
            [
              "5. Threat of substitutes",
              "How easily customers can switch to a different product that serves the same underlying need",
            ],
          ],
        },
        {
          type: "p",
          text: "The combined strength of the five forces determines how much of the value created in an industry its firms can actually capture as profit. Where the forces are collectively strong — intense rivalry, easy entry, powerful buyers and suppliers, credible substitutes — even well-run companies struggle to earn above-average returns. That is the framework's sharpest lesson: profitability is partly a property of the industry's structure, not only of the firm's execution.",
        },
      ],
      check: {
        question:
          "An industry has intense rivalry, low entry barriers, powerful buyers, and a credible substitute. What does Five Forces analysis conclude?",
        options: [
          "The industry is structurally unattractive — even well-run firms will struggle to earn above-average returns",
          "The industry is attractive, since intense rivalry proves customers value the product",
          "Nothing yet — the framework only applies once supplier power is also known",
          "Firms there should compete harder, since structure is irrelevant to profitability",
        ],
        answer: 0,
        explain:
          "Four of five forces running strong means the value the industry creates is competed away or captured by buyers. Supplier power might soften the verdict slightly, but the collective picture already points one way — and that structural reading is exactly what the framework exists to give you.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "forces-applied",
      heading: "The forces at work in Zambia",
      blocks: [
        {
          type: "p",
          text: "Zambian banking shows how rivalry and entry interact. Rivalry among the established banks — Zanaco, Standard Chartered, Absa, FNB, Stanbic — is intense: they compete for the same urban salaried customers with largely similar products, and switching costs are low. Entry looks protected — the Bank of Zambia requires K104 million in minimum paid-up capital for a commercial banking licence. But Airtel and MTN did not enter as banks. They entered as mobile money operators under a different regulatory category, with their subscriber bases as instant distribution. The framework only reveals that threat if you ask the right question: who can serve the same customer need by a different route?",
        },
        {
          type: "p",
          text: "Supplier power at its most extreme looks like Zambeef and ZESCO. The cold chain that keeps Zambeef's processing and distribution running depends on grid electricity with no alternative supplier to negotiate with. When load-shedding comes, Zambeef runs generators at cost or absorbs spoilage — supplier power as a structural constraint the strategy simply has to carry. Buyer power runs the other way at different scales: an individual buying Zambeef products at Shoprite has almost none, while First Quantum sells concentrate to a handful of international smelters and traders — sophisticated buyers with alternatives, negotiating hard on price and off-take terms.",
        },
        {
          type: "p",
          text: "Substitutes are the most misread force. Mobile money is not a bank competitor; it is a substitute for the core function banking once monopolised — storing and transferring value. Rivalry is between companies in the same industry, Zanaco against Absa. Substitution arrives from a different category serving the same underlying need, and it is often more dangerous precisely because it comes from outside the frame you are watching.",
        },
        {
          type: "p",
          text: "The two frameworks meet in exactly that example. A PESTEL scan that flags rapid mobile adoption and a young, mobile-first population is describing the same shift the Five Forces capture as a rising substitute threat and a new category of entrant. Together they give the full external picture. What they cannot tell you is whether your organisation can respond to what they find — that depends on what is inside, which is where the next step goes.",
        },
      ],
      check: {
        question:
          "Airtel Money reached banking customers using a telecoms licence and an existing subscriber base, bypassing the K104 million capital requirement. Which force did that most directly exploit?",
        options: [
          "The threat of substitutes — serving the same underlying need, storing and moving value, from outside the banking category",
          "Competitive rivalry — Airtel became one more bank competing with the others",
          "Supplier power — Airtel supplies airtime to the banks",
          "Buyer power — Airtel's customers demanded lower fees",
        ],
        answer: 0,
        explain:
          "Airtel never crossed the barrier that protects the banking industry — it went around it, from a different regulatory category, to serve the same need. That is substitution, and it is why banks that defined their competition as \"other commercial banks\" were watching the wrong frame.",
      },
    },
  ],
};
