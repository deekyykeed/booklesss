/* CF · Lesson 5 Dividend policy · Step 1 — Theories of dividend policy
 *
 * Source: 05_Dividend_Policy/Dividend Policy (2025), slides 2–11.
 *
 * House style: .claude/skills/step-feedback/RULES.md
 */

export default {
  slug: "dividend-theories",
  label: "Dividend theories",
  title: "Theories of dividend policy",
  kicker: "Dividend policy",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "the-decision",
      heading: "Paying a dividend is a financing decision",
      blocks: [
        {
          type: "p",
          text: "Retained earnings are the largest source of finance most companies use. They carry no issue costs, they need nobody’s approval, they are available immediately, and they dilute nobody’s control.",
        },
        {
          type: "p",
          text: "So every kwacha paid out as a dividend is a kwacha of that finance given up. The dividend decision and the financing decision are the same decision seen from two ends: a company that raises its payout has to fund the shortfall from somewhere dearer or invest less.",
        },
        {
          type: "p",
          text: "Which raises the question this step is about. If the money can be paid out or retained, and shareholders own it either way, does the choice change what the company is worth?",
        },
        {
          type: "ul",
          items: [
            "Relevance theory says yes — the dividend affects the share price, so the policy matters.",
            "Irrelevance theory says no — shareholders are indifferent, and only the investment decision creates value.",
            "Residual theory says the total matters but the timing does not — pay out whatever is left after the good projects are funded.",
          ],
        },
        {
          type: "callout",
          text: "A dividend is not a reward the company hands out. It is capital leaving the business, and the question is always what it would have earned had it stayed.",
        },
      ],
      check: {
        question:
          "Why is the decision to pay a dividend also a financing decision?",
        options: [
          "Cash paid out is cash not retained, so a higher payout means funding investment from a more expensive source or investing less",
          "Because dividends have to be approved by the company’s lenders",
          "Because dividends are deducted before arriving at taxable profit",
          "Because paying a dividend requires the company to issue new shares",
        ],
        answer: 0,
        explain:
          "Retained earnings are the cheapest and easiest finance available, and a dividend consumes them. The company then faces a choice between raising costlier finance and cutting its investment programme — which is why the payout cannot be settled without reference to what the business needs.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "relevance",
      heading: "Relevance theory",
      blocks: [
        {
          type: "p",
          text: "Relevance theory — the traditional view — holds that investors depend on dividends as income, so the amount paid influences the share price. It is the assumption the dividend valuation model is built on.",
        },
        {
          type: "formula",
          text: "P₀  =  d₀(1 + g) ÷ (re − g)",
          where: [
            "d₀ = the dividend just paid",
            "g = the expected constant growth rate of the dividend",
            "re = the cost of equity",
          ],
        },
        {
          type: "p",
          text: "Read the formula and the claim is immediate: the share price is a function of the dividend, so raising the dividend raises the price. The theory is really a set of arguments about why market imperfections make that true, and the arguments are strongest in the direction of a cut.",
        },
        {
          type: "h2",
          text: "Dividend signalling",
        },
        {
          type: "p",
          text: "Investors do not have perfect information about a company’s prospects, so they read the dividend as a statement about them. A cut conveys bad news whatever the board says in the announcement — the market reasons that a company confident about next year would have maintained the payment.",
        },
        {
          type: "h2",
          text: "Investor liquidity",
        },
        {
          type: "p",
          text: "The standard reply to a cut is that shareholders can sell a few shares to manufacture their own dividend. That is not costless: there are dealing charges, the shares may be illiquid — very much the case on a small exchange — and the shareholder is left with a smaller holding.",
        },
        {
          type: "h2",
          text: "Tax and the clientele effect",
        },
        {
          type: "p",
          text: "Shareholders are taxed differently on dividend income and on capital gains, so a change in policy can upset their tax planning. More than that, a company that has paid a steady, generous dividend for years has attracted shareholders who wanted exactly that — a clientele. Changing the policy does not persuade them; it makes them sell, and the buyers who replace them will pay a price that suits a different preference.",
        },
        {
          type: "p",
          text: "The practical conclusion companies draw from all of this is not to maximise the dividend but to stabilise it: adopt a policy, hold to it, and tell shareholders in advance about any change.",
        },
      ],
      check: {
        question:
          "A profitable company cuts its dividend to fund a genuinely attractive expansion, and its share price falls. How does relevance theory explain that?",
        options: [
          "The cut signals bad news to shareholders who cannot verify the company’s prospects, and it disappoints the income-seeking clientele the old policy attracted",
          "The expansion must have a negative NPV, or the price would have risen",
          "The share price fall is temporary and always reverses within a year",
          "Retained earnings are a more expensive source of finance than a dividend",
        ],
        answer: 0,
        explain:
          "Investors cannot see inside the company, so they read the payment itself as information — and a company that cuts is one the market suspects had no choice. Add the shareholders who bought the share for its income and are now selling, and the price falls even though the underlying decision was sound.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "irrelevance",
      heading: "Irrelevance theory",
      blocks: [
        {
          type: "p",
          text: "Modigliani and Miller argued that in a perfect capital market — no taxation, no transaction costs, no market imperfections — dividend policy is irrelevant. Shareholders care about the increase in their wealth and are indifferent to whether it arrives as a dividend or as capital growth.",
        },
        {
          type: "p",
          text: "This is the same argument they made about capital structure, applied to the other side of the balance sheet, and it turns on the same move: whatever the company can do, the investor can do for themselves.",
        },
        {
          type: "ul",
          items: [
            "An investor who wants cash from a company that pays no dividend sells part of their holding — a home-made dividend.",
            "An investor who wants retention from a company that pays one buys more shares with the dividend received.",
          ],
        },
        {
          type: "p",
          text: "In a perfect market both are free and instant, so nobody will pay a premium for a company to do it on their behalf. A company can pay any level of dividend it likes and meet any shortfall with a new equity issue, provided it is investing in all available positive-NPV projects.",
        },
        {
          type: "p",
          text: "That proviso is where the theory’s real content sits. Value is created by investing in viable projects, not by the pattern of distributions — so a company that wants to be worth more should improve its investment decisions rather than adjust its payout.",
        },
        {
          type: "p",
          text: "The criticism is almost entirely of the assumptions. Transaction costs make home-made dividends expensive, especially where shares trade rarely. Tax treats income and gains differently. Information is not symmetric, which is what makes signalling possible at all. And issuing equity to fund a dividend involves issue costs a perfect market does not have.",
        },
      ],
      check: {
        question:
          "Under irrelevance theory, what should a shareholder do if their company pays no dividend but they need cash?",
        options: [
          "Sell part of their holding, manufacturing a home-made dividend at no cost in a perfect market",
          "Vote against the board at the annual general meeting",
          "Nothing — irrelevance theory says shareholders never need cash",
          "Buy more shares, since the retained earnings will raise the price",
        ],
        answer: 0,
        explain:
          "The home-made dividend is what makes the theory work: if an investor can replicate the payout themselves for nothing, the company’s policy cannot be worth anything to them. It is also the assumption that fails hardest in practice — selling shares costs money and is not always possible at a fair price.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "residual",
      heading: "Residual theory",
      blocks: [
        {
          type: "p",
          text: "Residual theory sits between the other two. Dividends are important, it says, but the pattern of them is not: provided the present value of the dividend stream stays the same, the timing of the payments is irrelevant.",
        },
        {
          type: "p",
          text: "From which a clear operating rule follows. Fund every positive-NPV project first, from retained earnings, and pay a dividend only from whatever is left.",
        },
        {
          type: "table",
          columns: [{ label: "Year" }, { label: "Earnings ZMW’m", align: "right" }, { label: "Investment needed ZMW’m", align: "right" }, { label: "Dividend ZMW’m", align: "right" }],
          rows: [
            ["1", "40", "25", "15"],
            ["2", "45", "45", "nil"],
            ["3", "50", "20", "30"],
            ["4", "48", "60", "nil"],
          ],
          note: "The dividend is what is left over, so it swings from ZMW30 million to nothing depending on the investment programme — not on how the company performed.",
        },
        {
          type: "p",
          text: "The logic is impeccable. Paying a dividend while turning down a positive-NPV project means handing shareholders cash that would have been worth more inside the business — and if they need cash, they can sell shares.",
        },
        {
          type: "p",
          text: "The trouble is the table. A dividend that jumps from ZMW30 million to nil tells shareholders nothing they can use, and under relevance theory the nil year would be read as a disaster rather than as a good year for investment. Residual theory shares irrelevance theory’s assumptions — no tax, no market imperfections — and inherits the same weaknesses.",
        },
        {
          type: "p",
          text: "It nevertheless describes real behaviour well in two situations: young companies in a growth phase with more projects than cash, and companies without easy access to other sources of finance. A Zambian unquoted business that cannot readily issue shares or borrow more is, in effect, following a residual policy whether it has chosen one or not.",
        },
      ],
      check: {
        question:
          "Under residual theory, a company earns ZMW50 million and has positive-NPV projects requiring ZMW60 million. What dividend should it pay?",
        options: [
          "Nothing — every kwacha of earnings should fund the projects, and the ZMW10 million shortfall raised elsewhere",
          "ZMW50 million, since the projects can be funded by borrowing",
          "The same dividend as last year, to avoid sending a negative signal",
          "ZMW10 million, being the difference between the earnings and the investment",
        ],
        answer: 0,
        explain:
          "A dividend is the residue after investment, and here there is no residue — the projects would absorb everything and more. Maintaining last year’s payment is what relevance theory would advise, which is precisely where the two theories part company.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "comparing",
      heading: "Which of them to work from",
      blocks: [
        {
          type: "p",
          text: "Three theories, three different instructions to a finance director. Set them out and the disagreement is easy to state.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Does policy affect value?" }, { label: "What it tells you to do" }],
          rows: [
            ["Relevance", "Yes — the dividend drives the share price", "Set a stable policy, hold to it, avoid cuts"],
            ["Irrelevance", "No — only the investment decision matters", "Pay whatever suits; concentrate on the projects"],
            ["Residual", "The total matters, the timing does not", "Fund every good project first, distribute the remainder"],
          ],
        },
        {
          type: "p",
          text: "The gap between them is entirely a gap about assumptions. Irrelevance and residual theory both need a perfect capital market. Relevance theory is the argument that the imperfections are the point — and taxes, dealing costs, and shareholders who know less than managers are all plainly real.",
        },
        {
          type: "p",
          text: "So the practical position most companies take borrows from all three. Accept irrelevance theory’s central claim, that value is created by investing well rather than by distributing cleverly. Accept relevance theory’s warning that the market reads the dividend as information, and that a cut is expensive whatever caused it. And use residual thinking to set the level, while smoothing the path so shareholders are not asked to interpret a figure that jumps around.",
        },
        {
          type: "p",
          text: "That is why real dividend policies look the way they do: a payout the board is confident it can sustain through a bad year, raised only when the improvement looks permanent. It is not what any single theory prescribes, and it is what all three, read together, point at.",
        },
      ],
      check: {
        question:
          "A board says: “We invest in every project that clears our cost of capital, and we set the dividend at a level we can hold through a downturn.” Which theories is that drawing on?",
        options: [
          "Irrelevance theory for the investment rule, and relevance theory for the stability of the payout",
          "Residual theory alone, since investment comes first",
          "Relevance theory alone, since the dividend is being managed",
          "None — the two halves of the statement contradict each other",
        ],
        answer: 0,
        explain:
          "Funding every positive-NPV project is the irrelevance conclusion that value comes from investment. Committing to a payout that survives a bad year is the relevance conclusion that cuts are costly. A pure residual policy would have let the dividend fall to nothing in a heavy investment year, which this board is deliberately avoiding.",
      },
    },
  ],
};
