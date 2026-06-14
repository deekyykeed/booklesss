import LessonContent, { LessonStep } from '@/components/LessonContent'

const SM_STEP_3_1: LessonStep = {
  stepNumber: '3.1',
  title: 'Competitive Strategy',
  course: 'Strategic Management',
  school: 'ZCAS',
  accentColor: '#DC2626',
  sections: [
    {
      eyebrow: 'The Core Question',
      heading: 'Why Do Some Firms Consistently Outperform Others?',
      body: `Within any industry, firms earning above-average returns share one thing: a clear answer to the question of how they compete. The answer is not luck, size, or timing — it is a deliberate choice about where to create value and how to protect it.

Michael Porter distilled this into three generic strategies: cost leadership, differentiation, and focus. Each is a coherent position, not a list of tactics. Mixing them without intention produces what Porter called being "stuck in the middle" — no sustainable advantage, below-average returns.`,
    },
    {
      eyebrow: 'Generic Strategy 1',
      heading: 'Cost Leadership',
      body: `The cost leader aims to be the lowest-cost producer in its industry while selling at roughly the industry average price. The gap between its cost structure and the competition is where profit lives.

Cost leadership does not mean the cheapest product on the shelf. It means the most efficient operations, the leanest supply chain, and the most disciplined overhead. In Zambia, Zambeef has built cost advantages in beef processing by integrating backward into feed, farming, and retail — each step squeezing a margin that competitors must pay to external suppliers.`,
      callout: {
        label: 'Watch This',
        body: 'Cost leadership breaks if a rival matches your cost structure through technology or outsourcing. The position must be actively defended — not assumed permanent.',
      },
    },
    {
      eyebrow: 'Generic Strategy 2',
      heading: 'Differentiation',
      body: `Differentiation means offering something customers value as uniquely superior — and charging a premium for it. The premium must exceed the cost of producing the difference; otherwise the strategy destroys value.

Zanaco's premium banking products (dedicated relationship managers, priority queuing) target corporates and high-net-worth individuals who will pay for reliability and service quality. The differentiation holds only as long as rivals cannot replicate it at a comparable cost.`,
    },
    {
      eyebrow: 'Generic Strategy 3',
      heading: 'Focus Strategy',
      body: `Focus narrows the competitive scope to a specific buyer group, geographic market, or product segment. Within that niche, the firm applies either cost leadership or differentiation — producing two variants: cost focus and differentiation focus.

ZESCO's renewable energy arm — serving off-grid rural communities with solar mini-grids — is an example of differentiation focus. The mainstream grid product cannot profitably serve dispersed low-density areas; the focused variant does.`,
    },
    {
      eyebrow: 'Industry Analysis',
      heading: "Porter's Five Forces in the Zambian Mining Sector",
      body: `First Quantum Minerals operates Kansanshi and Sentinel — two of Sub-Saharan Africa's largest copper mines. Analysing First Quantum through the Five Forces shows why copper mining in Zambia is structurally difficult despite high commodity prices.

Threat of new entrants: Low in the short term. Capital requirements run into billions of USD; geological surveys, licensing, and infrastructure investment create multi-year barriers. However, Chinese state-backed miners represent a different class of entrant: patient capital with strategic rather than financial objectives.

Supplier power: High. Mining equipment (Caterpillar, Komatsu) and reagents (sulfuric acid for SX-EW processing) are purchased from a concentrated global supply base. First Quantum's scale provides some leverage, but disruptions — as seen during COVID-19 — expose the dependency.

Buyer power: Commodity copper trades on the LME. First Quantum is a price-taker, not a price-setter. Buyers have zero switching costs between producers; the ore specs, not the seller's brand, determine the purchase.

Threat of substitutes: Aluminium substitutes for copper in some electrical applications; fibre-optic cables displace copper wire in data transmission. The energy transition paradoxically increases copper demand (EV motors, grid upgrades) while these substitutes reduce it in legacy applications.

Competitive rivalry: Intense. Global copper output from Chile, Peru, DRC, and Zambia means persistent pressure on margins during price downturns. Firms compete on cost, not product features.`,
      callout: {
        label: 'Application',
        body: "First Quantum's strategic response: become a cost-competitive operator through scale and technology, since differentiation is impossible in a commodity market. Their Sentinel mine uses an automated haul-truck system to reduce labour cost per tonne.",
      },
    },
  ],
  discussionQuestions: [
    'Zanaco recently launched a digital-only account targeting Zambian university students. Using Porter\'s generic strategies, what position is Zanaco attempting to occupy — and what are the risks if MTN Money and Airtel Money respond by cutting fees?',
    'ZESCO faces structural supplier power from Chinese turbine manufacturers and buyer power from industrial clients (mining companies) who could invest in captive generation. Which of the Five Forces is most threatening to ZESCO\'s long-term position, and what strategic response would you recommend?',
  ],
  keyTerms: [
    {
      term: 'Competitive Advantage',
      definition: 'A condition giving a firm superiority over rivals, sustained through cost leadership, differentiation, or focus.',
    },
    {
      term: "Porter's Five Forces",
      definition: 'Framework for industry analysis: new entrants, supplier power, buyer power, substitutes, and rivalry.',
    },
    {
      term: 'Cost Leadership',
      definition: 'Being the lowest-cost producer in an industry, earning returns through the cost-price gap.',
    },
    {
      term: 'Differentiation',
      definition: 'Offering uniquely valued products or services commanding a price premium above the cost of differentiation.',
    },
    {
      term: 'Focus Strategy',
      definition: 'Targeting a narrow market segment with either cost leadership or differentiation applied within that niche.',
    },
    {
      term: 'Switching Costs',
      definition: 'Costs incurred when a customer changes supplier — financial, time, or psychological.',
    },
    {
      term: 'Stuck in the Middle',
      definition: "Porter's term for firms that pursue no clear generic strategy, resulting in no sustainable advantage and below-average returns.",
    },
    {
      term: 'Bargaining Power',
      definition: 'Degree of control a buyer or supplier can exercise over pricing and terms in a transaction.',
    },
  ],
  learningOutcomes: [
    'Distinguish between cost leadership, differentiation, and focus strategies with examples from Zambian firms.',
    "Apply Porter's Five Forces to assess the attractiveness and competitive dynamics of a specific industry.",
    'Identify the conditions under which each generic strategy creates or destroys value.',
    'Explain why being "stuck in the middle" typically produces below-average returns.',
    "Evaluate First Quantum's strategic position in the Zambian copper mining sector.",
  ],
}

export default async function LessonPage(props: PageProps<'/courses/[courseSlug]/[lessonSlug]'>) {
  const { courseSlug, lessonSlug } = await props.params

  // TODO: fetch real step data from Supabase based on courseSlug + lessonSlug
  // For now, return SM Step 3.1 for the demo route
  const step =
    courseSlug === 'strategic-management' && lessonSlug === '03-competitive-strategy'
      ? SM_STEP_3_1
      : null

  if (!step) {
    return (
      <div style={{ padding: 48, color: '#6b7280', fontStyle: 'italic' }}>
        Step not found — {courseSlug} / {lessonSlug}
      </div>
    )
  }

  return <LessonContent step={step} />
}
