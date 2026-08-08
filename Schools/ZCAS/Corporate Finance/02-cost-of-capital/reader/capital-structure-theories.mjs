/* CF · Lesson 2 Cost of capital · Step 6 — Capital structure theories
 *
 * Source: 02_Cost_of_Capital_and_Capital_Structure/Capital Structure and
 * Gearing (2025), slides 12–22.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "capital-structure-theories",
  label: "Capital structure theories",
  title: "Capital structure theories",
  kicker: "Cost of capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "the-question",
      heading: "Can the funding mix make a company more valuable?",
      blocks: [
        {
          type: "p",
          text: "Debt is cheaper than equity. Every calculation in this lesson has said so — 6.37% against 16% for MBS, 3.42% against 11.00% for MP Co. The obvious conclusion is that a company should borrow as much as it can, and the whole argument about capital structure is over whether that conclusion is right.",
        },
        {
          type: "p",
          text: "It matters because of what the cost of capital does. A company is worth the present value of its future cash flows, so lowering the rate those cash flows are discounted at raises the value of the business — without changing the business at all.",
        },
        {
          type: "ul",
          items: [
            "If WACC can be reduced by changing the mix of debt and equity, then there is an optimal capital structure, and finding it is part of a finance director’s job.",
            "If WACC cannot be reduced that way, the mix is irrelevant and value comes only from investing in positive-NPV projects.",
          ],
        },
        {
          type: "p",
          text: "Four positions have been argued, and they are best read as one conversation rather than four separate theories. Each answers the objection raised against the one before it.",
        },
        {
          type: "callout",
          kind: "key",
          text: "The whole debate reduces to one question: does the cost of equity rise fast enough to cancel out the cheapness of the debt?",
        },
      ],
      check: {
        question:
          "Why would a lower WACC make a company more valuable, even if nothing about its operations changed?",
        options: [
          "Because the company’s value is the present value of its future cash flows, and a lower discount rate raises that present value",
          "Because a lower WACC means the company pays less interest each year",
          "Because a lower WACC increases the company’s reported profit",
          "Because a lower WACC means the company has borrowed less",
        ],
        answer: 0,
        explain:
          "Value comes from discounting the same expected cash flows, so the rate is one of only two things that can move it. Nothing has to change in the trading for the value to change — which is exactly what makes the claim worth arguing about.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "traditional-view",
      heading: "The traditional view",
      blocks: [
        {
          type: "p",
          text: "The traditional or relevance view says capital structure matters, and that there is a level of gearing at which WACC is at its lowest and the company at its most valuable.",
        },
        {
          type: "p",
          text: "The argument runs in three stages as debt is added.",
        },
        {
          type: "table",
          columns: [{ label: "Gearing" }, { label: "What happens" }, { label: "WACC" }],
          rows: [
            [
              "Low",
              "Cheap debt replaces expensive equity. Shareholders barely notice the small borrowing and hardly raise their required return.",
              "Falls",
            ],
            [
              "Moderate",
              "The cost of equity begins rising as shareholders price in the financial risk, and it starts to offset the cheap debt.",
              "Bottoms out",
            ],
            [
              "High",
              "Both costs rise steeply — shareholders demand much more, and lenders reprice the risk of default too.",
              "Rises",
            ],
          ],
        },
        {
          type: "p",
          text: "So the graph of WACC against gearing is a U. The bottom of it is the optimal capital structure, and because the lowest WACC gives the highest present value, that same point is where the value of the company peaks.",
        },
        {
          type: "p",
          text: "The theory’s weakness is that it never says where the bottom is. It asserts that shareholders under-react to modest borrowing and then over-react to heavy borrowing, and offers no way to identify the turn other than looking at what comparable companies do.",
        },
      ],
      check: {
        question:
          "Under the traditional view, why does WACC eventually start to rise as more debt is taken on?",
        options: [
          "Because the cost of equity — and eventually the cost of debt too — rises faster than the saving from using more cheap debt",
          "Because the tax relief on interest runs out once gearing is high",
          "Because the company can no longer find lenders willing to advance funds",
          "Because debt becomes more expensive than equity at high gearing levels",
        ],
        answer: 0,
        explain:
          "It is a race between two effects. Adding cheap debt pulls the average down; shareholders raising their required return pushes it up. At low gearing the first wins, at high gearing the second does, and the turning point is the optimum. Debt does not become dearer than equity — it just stops being cheap enough to compensate.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "mm-irrelevance",
      heading: "Modigliani and Miller without tax",
      blocks: [
        {
          type: "p",
          text: "Modigliani and Miller answered that in a perfect capital market the capital structure is irrelevant. The benefit of cheap debt is exactly cancelled by the increase in the cost of equity that the borrowing causes, so WACC is constant at every level of gearing and the value of the company never moves.",
        },
        {
          type: "p",
          text: "The mechanism is precise rather than approximate. Borrowing makes the shareholders’ returns more volatile, because interest is a fixed claim that has to be met before anything reaches them — the same amplification the interest cover working showed. Shareholders price that additional risk exactly, and they price it by the amount that removes the gain.",
        },
        {
          type: "p",
          text: "It rests on a set of assumptions that are named as assumptions, not hidden: no taxation, no transaction costs, no costs of financial distress, and investors who can borrow personally on the same terms as companies. That last one carries the argument — if a shareholder wanting the effect of gearing can simply borrow and buy more shares, they will not pay a company a premium for doing it on their behalf.",
        },
        {
          type: "p",
          text: "The conclusion follows directly, and it is the point of the theory rather than a technicality: a company cannot become more valuable by rearranging how it is funded. Value comes from investing in projects with positive NPVs. Financing decides who owns the value, not how much of it there is.",
        },
      ],
      check: {
        question:
          "Under M&M without tax, a company doubles its debt and its cost of equity rises sharply. What happens to its WACC?",
        options: [
          "It is unchanged — the rise in the cost of equity exactly offsets the greater use of cheap debt",
          "It falls, because a larger share of the funding is now the cheaper source",
          "It rises, because the cost of equity has gone up",
          "It cannot be determined without knowing the tax rate",
        ],
        answer: 0,
        explain:
          "That exact offset is the theory. Shareholders raise their required return by precisely the amount needed to neutralise the benefit, so the weighted average never moves. The tax rate is not needed because this version of the argument assumes there is no tax — which is the assumption the next version drops.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "mm-with-tax",
      heading: "Adding tax, and then distress",
      blocks: [
        {
          type: "p",
          text: "Drop the assumption of no taxation and the conclusion reverses. Interest is tax deductible, so a geared company hands less of its cash to the government than an identical ungeared one — and that saving is real value that belongs to the investors.",
        },
        {
          type: "formula",
          text: "Value of a geared company  =  value of the ungeared company  +  present value of the interest tax shield",
          where: [
            "value of the ungeared company = the value of the same business funded entirely by equity",
            "PV of the interest tax shield = the present value of the tax saved on interest, over the life of the debt",
          ],
        },
        {
          type: "p",
          text: "This is the same tax shield the APV step calculated, doing the same work at the level of the whole company rather than one project. WACC now falls continuously as gearing rises, and the theory’s logical conclusion is that a company should be financed almost entirely by debt.",
        },
        {
          type: "p",
          text: "No company is. Something the theory has left out must bite before that point, and it does: the costs of financial distress.",
        },
        {
          type: "ul",
          items: [
            "Direct costs — legal and professional fees, and assets sold at whatever they will fetch rather than what they are worth.",
            "Indirect costs, which are usually the larger. Suppliers withdrawing credit, customers going elsewhere in case the company cannot honour a warranty, good staff leaving before they are pushed.",
            "Management time spent negotiating with lenders instead of running the business.",
          ],
        },
        {
          type: "p",
          text: "Distress costs are negligible at low gearing and grow rapidly at high gearing, because what is really growing is the probability of getting into distress at all. So the compromise view: the tax shield pulls WACC down, distress costs push it up, and the optimum is where the next kwacha of tax relief is just outweighed by the next kwacha of expected distress cost.",
        },
        {
          type: "p",
          text: "That lands in the same place the traditionalists started from — a U-shaped WACC curve with an optimum somewhere in the middle — but by a route that names what is on each side of the trade-off. It is the position most finance directors actually work from.",
        },
      ],
      check: {
        question:
          "M&M with tax implies a company should be financed almost entirely by debt. Why is no company financed that way?",
        options: [
          "Because the theory ignores the costs of financial distress, which rise sharply as gearing gets high",
          "Because tax relief on interest is capped by law in most countries",
          "Because lenders are legally prevented from funding more than a set proportion of a company",
          "Because the tax shield disappears once a company becomes highly geared",
        ],
        answer: 0,
        explain:
          "The model is right about the tax shield and silent about everything that goes wrong when a company cannot meet its interest. Once the probability of distress becomes material, the expected cost of it grows faster than the tax saving, and the trade-off between the two is what sets the practical optimum.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "pecking-order",
      heading: "The pecking order",
      blocks: [
        {
          type: "p",
          text: "The pecking order theory describes what companies do rather than what an optimum would require. Observed behaviour is that firms fund themselves in a fixed order of preference, taking the next source only when the one before it is exhausted.",
        },
        {
          type: "table",
          columns: [{ label: "Order" }, { label: "Source" }, { label: "Why it sits there" }],
          rows: [
            ["1", "Retained earnings", "No issue costs, no approval to seek, no signal sent, no dilution of control"],
            ["2", "Straight debt", "Cheap, quick, and the lender only needs to be convinced the interest is covered"],
            ["3", "Convertible debt", "Debt terms now, equity later — easier to place than shares"],
            ["4", "Preference shares", "Fixed return, but no tax relief"],
            ["5", "New ordinary shares", "The most expensive, the slowest, and it dilutes the existing shareholders"],
          ],
        },
        {
          type: "p",
          text: "The order is not driven by cost of capital at all. It is driven by resistance — the least difficult source first. Retained earnings need nobody’s permission. A share issue needs a prospectus, underwriters, months of work and a discount to get it away.",
        },
        {
          type: "p",
          text: "The deeper explanation is information. Managers know more about the company’s prospects than investors do, so investors read a share issue as a signal that management thinks the shares are currently overvalued — and mark the price down on the announcement. Debt sends no such signal, because a lender is repaid the same amount either way.",
        },
        {
          type: "p",
          text: "This is descriptive, and it does not fit alongside the others as a rival account of the optimum. A company following the pecking order is not aiming at a target gearing level; its gearing is simply the residue of a series of funding decisions taken in order of least resistance. That fits Zambian unquoted and family-owned companies particularly well, where a share issue would mean admitting outsiders to the ownership and is often not on the table at any price.",
        },
      ],
      check: {
        question:
          "The pecking order puts retained earnings first and new ordinary shares last. What mainly drives that ordering?",
        options: [
          "The difficulty, cost and signalling consequences of each source, rather than its cost of capital",
          "The cost of capital of each source, from cheapest to dearest",
          "The tax treatment of each source",
          "The order in which lenders and shareholders rank in a liquidation",
        ],
        answer: 0,
        explain:
          "Retained earnings are not the cheapest source by cost of capital — they are equity, and equity is dear. They come first because they need no permission, no fees and no announcement. The theory is about the path of least resistance, which is why it explains behaviour rather than prescribing an optimum.",
      },
    },
  ],
};
