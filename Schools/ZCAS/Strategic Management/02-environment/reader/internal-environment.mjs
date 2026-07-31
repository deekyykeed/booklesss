/* SM · Lesson 2 Environment · Step 2 — The internal environment
 *
 * Source: 4. Corporate Internal Environment.pdf; build_sm_2_2_internal-environment.py (v2 PDF).
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "internal-environment",
  label: "The internal environment",
  title: "The internal environment",
  kicker: "Environment",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "looking-inward",
      heading: "Looking inward after looking out",
      blocks: [
        {
          type: "p",
          text: "The external analysis told you what the world looks like. The internal question is what your organisation actually has to work with — the resources, capabilities, processes and culture it controls, which determine what it can do about everything it cannot control.",
        },
        {
          type: "p",
          text: "Three frameworks do this work together, each answering a narrower question than the last. SWOT surfaces strengths and weaknesses relative to the environment. Porter's value chain shows where in the organisation value is created or lost. VRIO tests whether a specific resource or capability is genuinely a source of competitive advantage — or just something the company happens to have.",
        },
        {
          type: "ul",
          items: [
            "SWOT — what do we have, and what are we missing?",
            "Value chain — where exactly does our advantage or weakness live?",
            "VRIO — is this capability actually an advantage, and will it last?",
          ],
        },
        {
          type: "p",
          text: "Use them in that order in a case answer: breadth first, then location, then the durability test. An answer that jumps straight to VRIO on one capability usually misses the weakness sitting in plain sight elsewhere.",
        },
      ],
      check: {
        question:
          "You've listed a company's capabilities and want to know whether one of them will keep producing above-average returns as rivals respond. Which framework answers that?",
        options: [
          "VRIO — it tests whether a capability's advantage is sustainable",
          "SWOT — sustainability is a strength",
          "PESTEL — durability depends on the macro environment",
          "The value chain — advantage lives in activities",
        ],
        answer: 0,
        explain:
          "SWOT finds and lists; the value chain locates; only VRIO asks the durability question — valuable, rare, inimitable, organised — that separates a lasting advantage from a temporary one.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "swot",
      heading: "SWOT — the internal half",
      blocks: [
        {
          type: "p",
          text: "SWOT covers both directions at once: strengths and weaknesses are internal — things the organisation controls — while opportunities and threats are external, drawn from the PESTEL and Five Forces work you have already done. The internal half is this step's territory.",
        },
        {
          type: "table",
          columns: [
            { label: "Dimension" },
            { label: "What it captures" },
            { label: "Internal or external?" },
          ],
          rows: [
            [
              "Strengths",
              "Resources, capabilities and advantages that give the organisation an edge over rivals",
              "Internal",
            ],
            [
              "Weaknesses",
              "Gaps and limitations where the organisation underperforms what the strategy requires",
              "Internal",
            ],
            [
              "Opportunities",
              "Favourable external conditions the organisation can exploit",
              "External",
            ],
            [
              "Threats",
              "Adverse external conditions that could damage performance or position",
              "External",
            ],
          ],
        },
        {
          type: "p",
          text: "The critical point about strengths and weaknesses is that they are relative, not absolute. A strength only means something if it matters in the current competitive environment. Zambeef's vertically integrated cold chain — its own farms, abattoirs, cold storage and retail outlets — is a genuine strength when supply-chain reliability is what wins. But under sustained ZESCO load-shedding, the same integration becomes a vulnerability: every link in the chain depends on electricity the company does not control. A strength in one environment can be a weakness in another.",
        },
        {
          type: "callout",
          text: "A strength must be relevant to the strategy and superior to what rivals have. If every competitor has the same capability, it is not a strength — it is the minimum requirement for competing.",
        },
      ],
      check: {
        question:
          "Zanaco carries a government ownership stake few other Zambian banks have. In a SWOT analysis, how should you treat it?",
        options: [
          "As potentially both — it brings access and public-sector relationships, but also constraints; which side dominates depends on the environment",
          "As a strength, since any distinctive feature is a strength",
          "As a weakness, since state involvement always slows decisions",
          "As an opportunity, because it is external to the bank's management",
        ],
        answer: 0,
        explain:
          "Strengths and weaknesses are relative to the environment. The stake gives Zanaco government business and rural legitimacy; it can also constrain commercial freedom. The classification is an argument about conditions, not a label — which is what the exam wants you to show.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "value-chain",
      heading: "Porter's value chain",
      blocks: [
        {
          type: "p",
          text: "The value chain breaks a company's operations into the sequence of activities that create value for the customer, and asks where in that sequence the company creates more value than the activity costs — and where it does not.",
        },
        {
          type: "table",
          columns: [{ label: "Category" }, { label: "Activity" }, { label: "What it covers" }],
          rows: [
            ["Primary", "Inbound logistics", "Receiving, storing and distributing inputs — raw materials, components, stock"],
            ["Primary", "Operations", "Transforming inputs into the finished product or service"],
            ["Primary", "Outbound logistics", "Storing and distributing the finished product to customers"],
            ["Primary", "Marketing & sales", "Making customers aware of and willing to buy the product"],
            ["Primary", "Service", "After-sale activities that maintain or enhance the product's value"],
            ["Support", "Procurement", "Acquiring the inputs used across all primary activities"],
            ["Support", "Technology development", "Systems, R&D and process improvement supporting the primary activities"],
            ["Support", "Human resources", "Recruiting, training and retaining the people who run every activity"],
            ["Support", "Firm infrastructure", "Finance, planning, legal and general management"],
          ],
        },
        {
          type: "p",
          text: "The framework earns its keep as a diagnostic, not a description. Zambeef's competitive position rests on specific primary activities: inbound logistics (its own farms supplying consistent inputs), operations (its own abattoirs and processing) and outbound logistics (its own cold-chain fleet and retail outlets). A competitor sourcing from external suppliers and selling through third-party retailers has less control at each of those links — and that gap is where Zambeef's advantage lives, link by link, not as a vague \"integration\".",
        },
        {
          type: "p",
          text: "Support activities carry advantage too, and it is harder to see from outside. An HR function that retains skilled cold-chain technicians is expensive to replicate precisely because nobody outside can tell it is there. And technology development — how fast a company digitises operations or adopts new processing equipment — determines how long any primary-activity advantage actually lasts.",
        },
      ],
      check: {
        question:
          "A competitor wants to explain why Zambeef beats it on freshness. Where does the value chain tell it to look?",
        options: [
          "At specific links — Zambeef controls inbound supply, processing and cold-chain distribution that the competitor hands to third parties",
          "At marketing — freshness is a perception created by advertising",
          "At firm infrastructure — better general management explains everything",
          "Nowhere internal — freshness is determined by the macro environment",
        ],
        answer: 0,
        explain:
          "The value chain locates advantage in activities. Freshness is produced by the chain of custody — farms, abattoirs, cold transport, own shelves — each a link the competitor doesn't control. Naming the links is what turns \"they're integrated\" into an analysis.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "vrio",
      heading: "The VRIO framework",
      blocks: [
        {
          type: "p",
          text: "SWOT and the value chain identify what a company has and where it operates. VRIO tests whether a specific resource or capability actually translates into competitive advantage — and if so, whether the advantage will hold. Four questions, asked in order: is it Valuable, is it Rare, is it Inimitable, and is the company Organised to exploit it?",
        },
        {
          type: "table",
          columns: [
            { label: "Valuable" },
            { label: "Rare" },
            { label: "Inimitable" },
            { label: "Organised" },
            { label: "Competitive implication" },
          ],
          rows: [
            ["No", "—", "—", "—", "Competitive disadvantage — the resource destroys rather than creates value"],
            ["Yes", "No", "—", "—", "Competitive parity — everyone has it; the industry standard, not an edge"],
            ["Yes", "Yes", "No", "—", "Temporary advantage — rivals can copy it, so the lead erodes"],
            ["Yes", "Yes", "Yes", "No", "Unrealised advantage — the capability exists but the company is not structured to exploit it"],
            ["Yes", "Yes", "Yes", "Yes", "Sustained competitive advantage — the source of above-average returns over time"],
          ],
        },
        {
          type: "p",
          text: "The tests are sequential and each failure has its own meaning. Failing V means the resource costs more than it earns. Failing R means the resource merely keeps you in the game — a bank with ATMs across Lusaka has something valuable, but so does every other bank: parity, not advantage. Failing I means the clock is running on your lead. Failing O is the strangest and most common in practice: the advantage exists on paper while the organisation's structure, systems or incentives stop it being used.",
        },
      ],
      check: {
        question:
          "A bank's branch network passes the Value test but every major rival has comparable coverage. What does VRIO conclude?",
        options: [
          "Competitive parity — the network keeps the bank in the game but gives no edge",
          "Sustained advantage — a branch network is expensive, so it must be inimitable",
          "Competitive disadvantage — branches cost money",
          "Unrealised advantage — the bank should reorganise around its branches",
        ],
        answer: 0,
        explain:
          "Valuable but not rare stops the analysis at parity: the capability is the price of admission, not a source of above-average returns. Treating every resource a company owns as a strength is exactly the error VRIO exists to catch.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "vrio-applied",
      heading: "VRIO applied — two Zambian tests",
      blocks: [
        {
          type: "p",
          text: "First Quantum's mineral rights and processing infrastructure at Kansanshi pass all four tests. Valuable — copper production generates significant returns. Rare — the rights to that ore body are not available to anyone else. Inimitable — the capital cost and geological knowledge needed to replicate the position are enormous. Organised — the company is built around exploiting it, with dedicated operational systems and technical expertise. Result: a sustained competitive position that smaller miners in the same geography cannot match.",
        },
        {
          type: "p",
          text: "MTN Zambia's mobile money platform reads differently. Valuable and rare — few organisations have 4 million registered users and an agent network to serve them. But it is becoming imitable: Airtel Money has built comparable scale, and the regulatory environment is opening mobile money to new entrants. Unless MTN deepens the inimitability — through data advantages, ecosystem lock-in, or product breadth no rival has matched — the advantage is temporary. VRIO forces the question past \"do we have it?\" to \"how long will it hold?\"",
        },
        {
          type: "p",
          text: "Run both examples and the three frameworks click together: SWOT would list both capabilities as strengths; the value chain locates each in specific activities; VRIO grades them — one sustained, one temporary. That grading is what the internal analysis is for, because strategy built on a temporary advantage needs a plan for what happens when it expires.",
        },
        {
          type: "p",
          text: "Whether these internal capabilities are enough to pursue a specific direction — growth, diversification, a competitive position — is the question the strategy lesson takes up from here.",
        },
      ],
      check: {
        question:
          "Airtel Money reaches comparable scale to MTN's platform, and regulation opens the category to further entrants. In VRIO terms, what has happened to MTN's capability?",
        options: [
          "It slid from rare towards imitable — the advantage is now temporary unless MTN rebuilds inimitability",
          "It failed the Value test — the platform no longer generates returns",
          "It failed the Organised test — MTN's structure changed",
          "Nothing — VRIO verdicts are permanent once earned",
        ],
        answer: 0,
        explain:
          "The platform is still valuable and still scarce, but rivals have shown it can be copied — the I test now fails, which caps the advantage at temporary. VRIO verdicts move as the environment moves; that is why the framework is a monitoring tool, not a one-off certificate.",
      },
    },
  ],
};
