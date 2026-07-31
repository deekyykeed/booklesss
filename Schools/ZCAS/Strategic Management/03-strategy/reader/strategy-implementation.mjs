/* SM · Lesson 3 Strategy · Step 3 — Strategy implementation
 *
 * Source: 5. Strategic Management Module.pdf Unit 10; 6. Strategic Management.pdf;
 *         build_sm_3_3_strategy-implementation.py (v2 PDF).
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "strategy-implementation",
  label: "Strategy implementation",
  title: "Strategy implementation",
  kicker: "Strategy",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "execution-problem",
      heading: "The execution problem",
      blocks: [
        {
          type: "p",
          text: "Fewer than one in three strategically important initiatives is executed as planned — McKinsey's research, and the reason this step exists. The root causes are almost never the strategy itself. They are execution failures: misaligned structures, wrong metrics, change resistance, resources that don't match priorities.",
        },
        {
          type: "p",
          text: "By this point you have the environment mapped, the portfolio decided and a competitive position chosen. None of it matters until it is translated into action — and the translation is where strategies die. The tools in this step exist to prevent each of the named failure modes: the 7-S framework catches misalignment, the balanced scorecard catches wrong metrics, Kotter's model manages resistance, and structure choice puts decisions where the strategy needs them.",
        },
        {
          type: "callout",
          text: "Implementation is not a one-off event. Strategy without control drifts; control without strategy optimises for the wrong outcomes.",
        },
      ],
      check: {
        question:
          "Most strategic initiatives that fail, fail for what kind of reason?",
        options: [
          "Execution — misaligned structures, wrong metrics, change resistance, resources not matching priorities",
          "Analysis — the PESTEL or Five Forces work was factually wrong",
          "Ambition — the strategies were not bold enough",
          "Timing — the strategies were right but launched in the wrong quarter",
        ],
        answer: 0,
        explain:
          "The research finding is that the strategy itself is rarely the problem — the organisation's structures, metrics and people pull against it. That is why implementation gets its own frameworks rather than being treated as an afterthought.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "mckinsey-7s",
      heading: "The McKinsey 7-S framework",
      blocks: [
        {
          type: "p",
          text: "The 7-S framework names seven internal elements that must point in the same direction for strategy to succeed. If even one is misaligned, execution suffers. Its value is precisely that it forces attention to the full system — not just structure and budget, but culture, leadership style and shared values.",
        },
        {
          type: "table",
          columns: [{ label: "Element" }, { label: "What it means" }, { label: "Key question" }],
          rows: [
            ["Strategy", "The direction and choices being pursued", "Is it clear, specific, and understood at every level?"],
            ["Structure", "How authority, accountability and decisions are organised", "Does it enable the strategy or create barriers?"],
            ["Systems", "Processes, budgets, information flows, measurement", "Do they measure and reward the behaviours the strategy requires?"],
            ["Style", "Leadership approach and cultural tone from the top", "Does leadership model the behaviour the strategy asks for?"],
            ["Staff", "People — hiring, development, the talent pipeline", "Are the right people in the roles the strategy depends on?"],
            ["Skills", "Distinctive capabilities and competencies", "What does the strategy require, and where are the gaps?"],
            ["Shared values", "Core purpose and culture — the model's centre", "Do people believe in what the organisation stands for?"],
          ],
        },
        {
          type: "p",
          text: "Watch it diagnose a real failure. A Zambian bank pursues a digital-first strategy to reach unbanked customers by mobile. The strategy is clear — but decisions stay centralised in Lusaka under a hierarchical branch structure (Structure misaligned), technology hiring is squeezed by grade-band pay built for branch roles (Staff misaligned), and bonuses still reward in-branch transactions rather than mobile onboarding (Systems misaligned). The strategy will fail — not because the idea is wrong, but because the elements are pulling against it. The fix is never \"communicate the strategy harder\"; it is realigning the specific elements that contradict it.",
        },
      ],
      check: {
        question:
          "A bank's digital-first strategy is failing while staff bonuses still reward in-branch transactions. In 7-S terms, what is wrong?",
        options: [
          "Systems are misaligned — the measurement and reward machinery pays people to behave against the strategy",
          "Strategy is misaligned — digital-first was the wrong choice",
          "Shared values are misaligned — staff don't believe in banking",
          "Skills are misaligned — staff can't use computers",
        ],
        answer: 0,
        explain:
          "Bonuses are part of Systems — the processes that measure and reward behaviour. People do what they are paid to do, so a reward system pointing at branches will beat a strategy document pointing at mobile every time. The diagnosis names the element, which names the fix.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "balanced-scorecard",
      heading: "The balanced scorecard as strategy's dashboard",
      blocks: [
        {
          type: "p",
          text: "A strategy is a hypothesis: if we do X, then Y will result. The balanced scorecard turns the hypothesis into measurable targets across four perspectives, so you can see whether the strategy is working — and intervene before the financial results deteriorate.",
        },
        {
          type: "table",
          columns: [{ label: "Perspective" }, { label: "Strategic question" }, { label: "What to measure" }],
          rows: [
            [
              "Financial",
              "Is the strategy delivering financial returns?",
              "Revenue growth, margin, cash flow, ROI on initiatives",
            ],
            [
              "Customer",
              "Are target customers satisfied and loyal?",
              "Satisfaction score, retention, share of the target segment",
            ],
            [
              "Internal process",
              "Are we executing the critical processes well?",
              "Cycle time, defect rate, speed of key workflows",
            ],
            [
              "Learning & growth",
              "Are we building the capabilities the strategy needs?",
              "Capability index, training hours, rate of innovation",
            ],
          ],
        },
        {
          type: "p",
          text: "The power is in the cause-and-effect chain running up the table: invest in learning and growth (train people) → internal processes improve (serve faster, fewer errors) → customer outcomes improve (higher satisfaction, lower churn) → financial results improve. Without the chain, a company can hit this year's financial targets by destroying the capabilities that generate next year's.",
        },
        {
          type: "p",
          text: "In practice the four numbers are small and specific. A Zambian telecoms company pursuing retention might track ZMW revenue per subscriber and churn cost avoided (financial), net promoter score and complaint resolution rate (customer), time-to-resolve a service fault (internal process), and the share of frontline staff trained on the new systems (learning and growth). Reviewed monthly, those four tell a more complete strategic story than revenue alone ever could.",
        },
      ],
      check: {
        question:
          "A company hits every financial target while its training hours, process quality and customer satisfaction all decline. What does the scorecard's cause-and-effect chain predict?",
        options: [
          "Future financial decline — the upstream perspectives that generate financial results are being run down",
          "Continued financial success — the financial perspective is the only one that matters",
          "Nothing — the four perspectives are independent of each other",
          "Immediate bankruptcy — any declining measure is fatal",
        ],
        answer: 0,
        explain:
          "The chain runs learning → process → customer → financial. Today's financials reflect yesterday's capabilities; declining capability and satisfaction are tomorrow's revenue problem already visible. Catching that early is the entire reason the scorecard has four perspectives instead of one.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "change-management",
      heading: "Change management — the human side",
      blocks: [
        {
          type: "p",
          text: "Strategy is ultimately people changing their behaviour. If the organisation has worked one way for years, a new strategy means breaking old patterns and building new ones — and this is where most implementation efforts fail, because people resist change they don't understand the necessity of.",
        },
        {
          type: "p",
          text: "Kotter's research distilled the sequence that separates successful transformations from failures into eight steps — and the cost of skipping each is specific.",
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Action required" }, { label: "Cost of skipping" }],
          rows: [
            ["1. Establish urgency", "Make the case for why change is necessary now", "Inertia wins — everyone waits for someone else to move"],
            ["2. Build a coalition", "Recruit powerful sponsors who believe in the change", "Isolated advocates cannot overcome systemic scepticism"],
            ["3. Form a vision", "Paint a clear picture of what success looks like", "People default to the past for lack of a destination"],
            ["4. Communicate constantly", "Repeat the vision through every channel", "The message dilutes — people hear what they want to"],
            ["5. Remove barriers", "Give people permission and resources to act", "Bureaucracy blocks the change before it starts"],
            ["6. Create early wins", "Find and celebrate quick, visible victories", "Momentum dies; sceptics say \"I told you so\""],
            ["7. Build on wins", "Keep the pressure on; don't declare victory early", "Old habits resurface when attention moves on"],
            ["8. Anchor the change", "Embed the behaviour in culture, systems, hiring", "The change reverts under pressure"],
          ],
        },
        {
          type: "p",
          text: "Budget for it. Realistic implementation plans put 30–40% of effort into change management. A new CEO arriving at a large parastatal with a transformation mandate spends the first 90 days on Kotter's steps 1–3 — building the case for urgency, recruiting a coalition of credible senior sponsors, and forming a vision people can picture — because launching restructuring announcements without them is how transformations produce paper change and quiet reversion.",
        },
      ],
      check: {
        question:
          "A transformation launches with a strong urgency case and a clear vision, wins its first victories — then leadership declares success and moves on. A year later the old ways are back. Which step was skipped?",
        options: [
          "Anchoring the change — the new behaviour was never embedded in culture, systems and hiring",
          "Establishing urgency — the case for change was too weak",
          "Creating early wins — there were no visible victories",
          "Building a coalition — no sponsors were recruited",
        ],
        answer: 0,
        explain:
          "Steps 1–6 visibly happened; the failure is at the end of the sequence. Kotter's steps 7 and 8 exist because change is fragile until it is anchored — embedded in how people are measured, promoted and hired. Declare victory before that and the culture snaps back.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "structure",
      heading: "Structure follows strategy",
      blocks: [
        {
          type: "p",
          text: "Chandler's principle — structure should follow strategy — sounds obvious and is violated constantly. Organisations redesign the strategy and then execute it through structures built for a different purpose. The result is friction: decisions made in the wrong place, accountability diffused, coordination failures. Choosing the structure is a strategic decision, not an HR exercise.",
        },
        {
          type: "table",
          columns: [
            { label: "Structure" },
            { label: "How it works" },
            { label: "Best-fit strategy" },
            { label: "Key risk" },
          ],
          rows: [
            [
              "Functional",
              "Grouped by function — finance, sales, operations, HR",
              "Cost leadership, efficiency, stability",
              "Silos and coordination failures across functions",
            ],
            [
              "Divisional",
              "Grouped by product, geography or customer segment",
              "Growth, diversification, multi-market strategies",
              "Duplicated functions raise cost",
            ],
            [
              "Matrix",
              "Dual reporting — functional and divisional lines at once",
              "Innovation, customisation, complex projects",
              "Authority conflicts; confusion about who decides",
            ],
            [
              "Network",
              "Loosely coupled units, heavy outsourcing, partnerships",
              "Agility, specialisation, platform strategies",
              "Loss of control; consistency and quality risk",
            ],
          ],
        },
        {
          type: "p",
          text: "The fit is readable from the strategy. A Zambian fintech pursuing cost leadership in digital payments suits a functional structure — centralised technology, lean operations, minimum overhead. A pharmaceutical company with several product categories suits a divisional structure so each category can run its own market approach. And the first symptom of misalignment is always the same: decisions keep escalating to levels that shouldn't need to make them.",
        },
      ],
      check: {
        question:
          "A single-product firm competing on cost adopts a divisional structure with a full finance and HR team in every region. What is the predictable result?",
        options: [
          "Duplicated overhead that undermines the cost position — the structure fights the strategy",
          "Faster growth — more divisions always mean more revenue",
          "Better control — duplication is a form of redundancy planning",
          "No effect — structure and strategy are independent choices",
        ],
        answer: 0,
        explain:
          "Divisional structure buys market responsiveness at the price of duplicated functions — a price a diversified group can justify and a single-product cost leader cannot. Chandler's principle would prescribe a lean functional structure here; the mismatch shows up directly in the cost base the strategy depends on.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "strategic-control",
      heading: "Strategic control — monitoring and adapting",
      blocks: [
        {
          type: "p",
          text: "Implementation is not a project with a completion date; it is an ongoing loop of monitoring, comparing actuals to targets, diagnosing gaps and adapting. Strategic control differs from operational control in the question it asks: operational control asks \"are we executing efficiently?\" — strategic control asks \"is the strategy itself still valid?\"",
        },
        {
          type: "ul",
          items: [
            "Premise control — monitor the assumptions behind the strategy; if the PESTEL factors that justified it change materially, the strategy may need revision.",
            "Implementation control — track whether milestones are hit and resources deployed as planned.",
            "Strategic surveillance — broad monitoring of the environment for unexpected developments.",
            "Special alert control — pre-defined response protocols for sudden crises: a rival's acquisition, a regulatory change, a supply disruption.",
          ],
        },
        {
          type: "p",
          text: "The four types earn their keep in a live case. First Quantum's strategy for Kansanshi assumed copper at USD 8,500 per tonne; the price falls to USD 6,200. Premise control is the type that catches it — the strategy's core assumption has broken, which triggers a fundamental review: which projects still clear their hurdle rates at the new price, what cost position is needed to ride out the trough, and at what price level the mine plan itself changes. Implementation control would only report that milestones are on schedule — on a strategy whose premise no longer holds. Knowing which control type catches which failure is what the exam tests.",
        },
        {
          type: "callout",
          text: "Operational control asks \"are we doing things right?\". Strategic control asks \"are we still doing the right things?\". A strategy can be perfectly executed and still be wrong.",
        },
      ],
      check: {
        question:
          "A strategy set two years ago assumed copper at USD 8,500 per tonne; the price is now USD 6,200, though every project milestone is on schedule. Which control type should fire, and why?",
        options: [
          "Premise control — the assumption that justified the strategy has broken, whatever the milestones say",
          "Implementation control — milestones are the measure of a strategy's health",
          "Special alert control — any price movement is a sudden crisis",
          "None — control only applies when execution is behind schedule",
        ],
        answer: 0,
        explain:
          "Milestones measure execution; premises measure validity. A strategy built on USD 8,500 copper being executed flawlessly at USD 6,200 is a well-run march in the wrong direction — exactly the failure premise control exists to catch, and why strategic control is distinct from operational control.",
      },
    },
  ],
};
