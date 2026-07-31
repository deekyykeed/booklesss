/* SM · Lesson 1 Foundations · Step 2 — Vision, mission and objectives
 *
 * Source: 2. Mission and Vision.pdf; build_sm_1_2_mission-and-vision.py (v2 PDF).
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "mission-and-vision",
  label: "Vision, mission and objectives",
  title: "Vision, mission and objectives",
  kicker: "Foundations",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "four-components",
      heading: "The four components of direction",
      blocks: [
        {
          type: "p",
          text: "Before an organisation can execute a strategy it has to establish direction, and direction has four components. Each answers a different question, and none substitutes for the others — which is why the exam so often hands you a statement and asks which component it is.",
        },
        {
          type: "table",
          columns: [
            { label: "Component" },
            { label: "The question it answers" },
            { label: "Time focus" },
          ],
          rows: [
            ["Strategic vision", "Where are we going, and why?", "Long-term future"],
            ["Mission statement", "What do we do right now, and for whom?", "Present day"],
            ["Core values", "What principles govern how we behave?", "Ongoing"],
            ["Objectives", "What specific results must we achieve?", "Short and long term"],
          ],
        },
        {
          type: "p",
          text: "The four also depend on each other in a particular order. The vision names the destination; the mission anchors what the organisation is today; values constrain how it may travel; and objectives turn the journey's progress into numbers that can be checked. A company with objectives but no vision is measuring progress towards nowhere in particular — and a company with a vision but no objectives has no way of knowing whether it is moving.",
        },
      ],
      check: {
        question:
          "\"We provide affordable banking to Zambian households and small businesses through branches, agents and mobile channels.\" Which component of direction is that?",
        options: [
          "A mission statement — it describes what the organisation does today, and for whom",
          "A vision — it describes where the bank is going",
          "An objective — it states a result the bank must achieve",
          "A core value — it states a principle of behaviour",
        ],
        answer: 0,
        explain:
          "The statement is in the present tense and answers \"what do we do, for whom, and how\" — the mission's question. A vision would name a future destination; an objective would carry a measurable target.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "vision",
      heading: "Strategic vision",
      blocks: [
        {
          type: "p",
          text: "A strategic vision describes management's aspirations for the company's future and the course charted to achieve them. It answers where are we going — not what the company does today.",
        },
        {
          type: "p",
          text: "A good vision is specific enough to guide resource-allocation decisions, forward-looking rather than a description of current operations, feasible, and short enough to be memorable. The failures are nearly always failures of specificity: generic superlatives — \"be the best\", \"lead the industry\" — tell no one where to go, because they could belong to any company in any industry.",
        },
        {
          type: "p",
          text: "That gives you a usable test. Put the statement in front of a manager choosing between two investments and ask whether it helps them choose. \"To be Zambia's leading bank\" doesn't — leading by what, for whom? \"To make banking accessible to every Zambian household within a decade\" does: it argues for the agent network over the trading floor.",
        },
        {
          type: "callout",
          text: "The exam test for a vision: does it describe a future destination specifically enough to guide decisions? If it could belong to any company in any industry, it has failed as a vision.",
        },
      ],
      check: {
        question:
          "\"To be the most trusted and accessible bank in Zambia.\" As a vision statement, what is its main weakness?",
        options: [
          "It is too generic to guide decisions — most banks could claim it, and it doesn't say what will be done or for whom",
          "It is too specific — a vision should leave the future open",
          "It is written in the future tense, which belongs to a mission",
          "It mentions Zambia, which limits the company's ambitions",
        ],
        answer: 0,
        explain:
          "Trusted and accessible are the right ingredients, but without saying accessible to whom, or through what, the statement can't arbitrate a real resource decision — which is the test a vision must pass.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "mission",
      heading: "Mission — and how it differs from vision",
      blocks: [
        {
          type: "p",
          text: "The mission is grounded in the present: what do we do, for whom, and how? A well-crafted mission identifies the products or services offered, the needs satisfied, the customer groups served, and what sets the organisation apart from rivals.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Vision" }, { label: "Mission" }],
          rows: [
            ["Time", "Future state — where we are going", "Present state — why we exist today"],
            ["Core question", "Where are we headed?", "What do we do, for whom, and how?"],
            [
              "Test",
              "Forward-looking and specific enough to guide decisions?",
              "Describes current purpose, scope, and what sets the organisation apart?",
            ],
          ],
        },
        {
          type: "p",
          text: "Confusing the two is the most common error this topic produces, and the tenses give the game away. A mission written in the future tense is probably a vision; a vision describing current operations is probably a mission. Pin each statement to its question before you analyse it.",
        },
        {
          type: "p",
          text: "Zanaco makes a good drafting exercise. It was established to extend banking to Zambians excluded from the commercial banks, and has since grown retail, corporate and mobile arms. A defensible present-day mission has to carry all of that: something like \"to provide accessible banking to Zambian households, businesses and institutions through the country's widest branch, agent and digital network.\" Products, customers, how, and the distinguishing reach — all in the present tense.",
        },
      ],
      check: {
        question:
          "A company's \"mission\" reads: \"We will become the region's largest logistics provider by 2035.\" What has gone wrong?",
        options: [
          "It is a vision mislabelled as a mission — future tense, future destination, nothing about what the company does today",
          "Nothing — a mission should state the company's ambitions",
          "It is an objective mislabelled as a mission, because it contains a date",
          "It is a core value, since size is a principle of behaviour",
        ],
        answer: 0,
        explain:
          "\"Will become… by 2035\" is a future destination — the vision's territory. A mission answers what the company does now, for whom, and how. The date makes it look objective-like, but it lacks a measurable target tied to current operations; the deeper error is the tense.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "values-and-objectives",
      heading: "Core values and the two kinds of objective",
      blocks: [
        {
          type: "p",
          text: "Core values are the beliefs and behavioural norms employees are expected to display in pursuing the vision and mission. When leadership genuinely models them, they become the reference point for decisions in situations where no rule exists. Two failure modes matter: values that conflict with the strategy create internal contradiction, and values that leadership does not live destroy credibility faster than having none at all.",
        },
        {
          type: "p",
          text: "Objectives convert vision and mission into measurable targets — without them the vision has no way to track whether the organisation is moving towards it. They come in two kinds, and the distinction carries most of the marks.",
        },
        {
          type: "table",
          columns: [{ label: "Type" }, { label: "Targets" }, { label: "Example" }],
          rows: [
            [
              "Financial",
              "Revenue, profit, margins, return on investment, cash flow",
              "ZESCO: ZMW 2.4 billion revenue, 18% operating margin by year-end",
            ],
            [
              "Strategic",
              "Market position, customer relationships, capability — the non-financial drivers of future performance",
              "ZESCO: 85% rural electrification coverage within five years",
            ],
          ],
        },
        {
          type: "p",
          text: "Financial results are lagging indicators — they reflect decisions made months or years ago. Strategic objectives are leading indicators: winning on market standing and customer satisfaction today predicts financial performance tomorrow. Optimising only for the financial targets at the expense of the strategic ones is how a company posts strong short-term results while eroding its long-term position — a mine that hits cost-per-tonne targets while missing community-investment and rehabilitation objectives is running down assets its future depends on, and the financials will not show it until the damage is done.",
        },
      ],
      check: {
        question:
          "First Quantum meets every financial target — volume, revenue, cost per tonne — but repeatedly misses strategic objectives on community investment and environmental rehabilitation. Management says the financials prove execution is strong. What is actually happening?",
        options: [
          "The lagging indicators look healthy while the leading ones warn of trouble — the company is eroding the position its future financials depend on",
          "Nothing is wrong — financial objectives are the ones that ultimately matter",
          "The strategic objectives were set too high and should be revised down to match performance",
          "The company is stuck in the middle between cost leadership and differentiation",
        ],
        answer: 0,
        explain:
          "Financial results reflect past decisions; strategic objectives predict future ones. Missing community and environmental targets builds licence-to-operate risk that today's revenue line cannot see — which is exactly why both kinds of objective are set.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "setting-objectives",
      heading: "Setting objectives well",
      blocks: [
        {
          type: "p",
          text: "A well-stated objective meets four requirements. It is specific — precise enough that everyone agrees what success looks like. Measurable — a number or an observable milestone, not a direction. Challenging — ambitious enough to push performance without collapsing into fantasy. And time-bound — a deadline, not an open-ended aspiration. \"Improve customer service\" fails all four; \"resolve 90% of complaints within 48 hours by December\" passes them.",
        },
        {
          type: "p",
          text: "Two refinements build on that base. Stretch objectives set the bar high enough to force creative thinking about how to achieve the result, not just whether to aim for it. And a company with strategic intent commits its full resources relentlessly to one ambitious long-term goal — the goal functions as an obsession that focuses the whole organisation.",
        },
        {
          type: "p",
          text: "The remaining danger is hitting financial targets while quietly eroding the foundations that sustain them. The balanced scorecard exists to prevent exactly that, by forcing targets across four perspectives at once.",
        },
        {
          type: "table",
          columns: [{ label: "Perspective" }, { label: "What it measures" }],
          rows: [
            ["Financial", "Revenue, profit, return on investment"],
            ["Customer", "Market share, retention, satisfaction"],
            ["Internal processes", "Efficiency, quality, speed of delivery"],
            ["Learning and growth", "Employee capability, technology, culture"],
          ],
        },
        {
          type: "p",
          text: "Asked why financial objectives alone are insufficient, the answer is the lagging-indicator point from the previous section: the other three perspectives show whether the organisation is building or eroding its capacity to perform financially in the future. The scorecard returns in the implementation step, where it becomes the monitoring backbone for a whole strategy.",
        },
      ],
      check: {
        question:
          "Which of these is a well-stated objective?",
        options: [
          "Grow the agent network from 400 to 1,000 active agents by the end of next year",
          "Become more customer-focused across all our branches",
          "Significantly increase revenue",
          "Pursue excellence in everything we do",
        ],
        answer: 0,
        explain:
          "It is specific, measurable (400 to 1,000 active agents), challenging, and time-bound. The others are directions or slogans — nothing in them says what success looks like or when it must arrive.",
      },
    },
  ],
};
