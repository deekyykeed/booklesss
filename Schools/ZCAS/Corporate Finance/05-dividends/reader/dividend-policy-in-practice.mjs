/* CF · Lesson 5 Dividend policy · Step 2 — Dividend policy in practice
 *
 * Source: 05_Dividend_Policy/Dividend Policy (2025), slides 12–25. Dividend
 * capacity ties back to the free cash flow to equity working in Lesson 1,
 * which is what the lecture means by the practical measure of capacity.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "dividend-policy-in-practice",
  label: "Dividend policy in practice",
  title: "Dividend policy in practice",
  kicker: "Dividend policy",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "practical-influences",
      heading: "What actually constrains the payout",
      blocks: [
        {
          type: "p",
          text: "Whatever a theory recommends, a real dividend decision is made inside a set of constraints. Some are legal, some are financial, and some are about the particular shareholders a company happens to have.",
        },
        {
          type: "table",
          columns: [{ label: "Influence" }, { label: "How it bites" }],
          rows: [
            [
              "Legal position",
              "Dividends can only be paid out of accumulated distributable profits, whatever the cash position. No profits, no dividend",
            ],
            [
              "Profitability and its stability",
              "Stable profits support a higher payout ratio safely. Volatile profits make a high ratio a commitment the company may not be able to keep",
            ],
            [
              "Liquidity",
              "Profit is not cash. There must be enough cash to pay the dividend and still fund working capital",
            ],
            [
              "Growth",
              "Rapidly growing companies pay very low dividends, because the earnings are needed to finance the expansion",
            ],
            [
              "Inflation",
              "Paying dividends out of historic-cost profits erodes operating capacity — too little is retained to replace assets at their new prices",
            ],
            [
              "Control",
              "Retained earnings do not change who owns the company, which matters a great deal in a family-owned business",
            ],
            [
              "Other sources of finance",
              "A company with limited access to external funds must rely on retentions, so its dividends tend to be small",
            ],
          ],
        },
        {
          type: "p",
          text: "The legal and the liquidity constraints are worth separating carefully, because they fail in opposite directions. A company can be legally entitled to pay a dividend it cannot afford in cash — profitable on paper, with the money tied up in stock and receivables. And a company can be sitting on cash it is not permitted to distribute, because accumulated losses have wiped out its distributable reserves.",
        },
        {
          type: "p",
          text: "Inflation deserves attention in a Zambian context. A company earning ZMW20 million and distributing most of it may be quietly shrinking, because the machine it depreciated at 2019 prices will cost far more than that to replace. The profit was real; the capacity to keep trading was overstated.",
        },
      ],
      check: {
        question:
          "A company reports a healthy profit but has almost no cash, with the money tied up in inventory and receivables. What does that mean for its dividend?",
        options: [
          "It may be legally able to pay one but unable to afford it — profit is not cash",
          "It cannot pay a dividend, because dividends are paid out of cash and it has none by law",
          "It must pay a dividend, since the profit belongs to shareholders",
          "It should borrow to pay the dividend, which is what working capital finance is for",
        ],
        answer: 0,
        explain:
          "The legal test is distributable profits and the practical test is cash, and they can point in opposite directions. Paying a dividend the company cannot fund from its own resources means borrowing for it — which is possible, and is a decision to fund a distribution with debt rather than a routine step.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "dividend-capacity",
      heading: "Dividend capacity",
      blocks: [
        {
          type: "p",
          text: "Dividend capacity is the company’s ability to pay a dividend at all, and it has two definitions that answer two different questions.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Measured by" }, { label: "Answers" }],
          rows: [
            ["Legal capacity", "Accumulated distributable profits", "May we pay a dividend?"],
            ["Practical capacity", "Free cash flow to equity, after reinvestment", "Can we afford to?"],
          ],
        },
        {
          type: "p",
          text: "The practical measure is the one from Lesson 1. Free cash flow to equity is what the business generated after paying its operating costs, its tax, the investment it needs to keep trading, and everything owed to its lenders. What is left is the shareholders’ cash, and it is the honest ceiling on a dividend.",
        },
        {
          type: "formula",
          text: "Cash dividend cover  =  FCFE ÷ dividends paid",
          where: [
            "FCFE = free cash flow to equity for the year",
            "dividends paid = the cash actually distributed to shareholders",
          ],
        },
        {
          type: "p",
          text: "A cover of 2 means the company generated twice the cash it handed out. Below 1 means it distributed more than it earned in cash, and funded the difference from reserves or borrowing.",
        },
        {
          type: "p",
          text: "That measure is more revealing than dividend cover on earnings, because earnings never had the capital expenditure taken out of them. A company can show earnings cover of 2.5 and cash cover of 0.8 in the same year — comfortable on the income statement, distributing money it did not generate.",
        },
        {
          type: "p",
          text: "Doing that once is a decision. Doing it repeatedly is a company running down its balance sheet to maintain a payout it can no longer support, which is one of the reliable early signs of trouble.",
        },
        {
          type: "callout",
          text: "Distributable profits say what a company may pay. Free cash flow to equity says what it can pay. Only the second one is money.",
        },
      ],
      check: {
        question:
          "A company reports dividend cover of 2.4 times on earnings but its cash dividend cover is 0.7. What is happening?",
        options: [
          "It is distributing more cash than the business generated, having spent heavily on capital investment and working capital",
          "It has made an error, since the two covers should give the same answer",
          "Its earnings are overstated and should be restated",
          "It is retaining too much and should raise the dividend",
        ],
        answer: 0,
        explain:
          "Earnings are struck before capital expenditure and before the cash tied up in working capital, so a company investing heavily can look well covered on earnings while cash runs the other way. The dividend is being funded from reserves or borrowing, and that cannot continue indefinitely.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "the-policies",
      heading: "Four policies a company can adopt",
      blocks: [
        {
          type: "p",
          text: "Four recognisable dividend policies, each suiting a different kind of company and each with a cost.",
        },
        {
          type: "h2",
          text: "Stable dividend",
        },
        {
          type: "p",
          text: "A constant, or constantly growing, dividend each year. It gives investors a predictable cash flow, limits management’s scope to divert funds into unprofitable activities, and works well for a mature business with settled cash flows. The risk is that a bad year forces a cut, with all the signalling damage that carries.",
        },
        {
          type: "h2",
          text: "Constant payout ratio",
        },
        {
          type: "p",
          text: "A fixed proportion of earnings paid out every year. It keeps a visible link between what the company earns, what it reinvests and what it distributes. But the cash flow to the investor becomes unpredictable, and it conveys nothing about what management expects — the dividend simply follows the earnings wherever they go.",
        },
        {
          type: "h2",
          text: "Residual",
        },
        {
          type: "p",
          text: "A dividend only where no further positive-NPV projects remain. Popular with growing companies and with firms that have no easy access to other funds. The cost is the same as the constant payout ratio’s and worse: the cash flow is unpredictable, and the signals change every year.",
        },
        {
          type: "h2",
          text: "Zero dividend",
        },
        {
          type: "p",
          text: "All surplus earnings reinvested. Common during a growth phase, and it should be reflected in a rising share price rather than in a payment. The policy has a natural end: when the growth opportunities run out, cash begins to accumulate and a new distribution policy is needed. Sitting on the cash instead is how a company becomes a takeover target.",
        },
        {
          type: "table",
          columns: [{ label: "Policy" }, { label: "Suits" }, { label: "Costs" }],
          rows: [
            ["Stable", "Mature businesses with settled cash flows", "A cut becomes unavoidable in a bad year"],
            ["Constant payout ratio", "Companies wanting the dividend tied to performance", "Unpredictable for the investor; signals nothing"],
            ["Residual", "Growth firms, and those without other finance", "The most erratic of the four"],
            ["Zero", "Early-stage companies with more projects than cash", "Needs replacing once growth slows"],
          ],
        },
      ],
      check: {
        question:
          "A mature Zambian company with steady cash flows and shareholders who rely on the income should adopt which policy?",
        options: [
          "A stable dividend, giving those shareholders a predictable cash flow",
          "A residual policy, so that investment always comes first",
          "A zero dividend policy, so earnings can be reinvested",
          "A constant payout ratio, so the dividend tracks performance",
        ],
        answer: 0,
        explain:
          "Stable cash flows can support a stable dividend, and the clientele the company has attracted is exactly the one that wants it. A residual or constant-payout policy would make the income swing for reasons those shareholders neither control nor care about, and a zero policy would drive them out altogether.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "alternatives",
      heading: "Alternatives to a cash dividend",
      blocks: [
        {
          type: "p",
          text: "Cash is not the only way to return value, and the alternatives solve different problems.",
        },
        {
          type: "h2",
          text: "Share repurchase",
        },
        {
          type: "p",
          text: "The company uses cash to buy back its own shares. It suits a company with surplus cash and no projects to spend it on — and unlike a raised dividend it makes no promise about next year, so it does not create an expectation the company may not be able to meet.",
        },
        {
          type: "p",
          text: "Fewer shares in issue also means earnings are divided among fewer of them, so earnings per share rises. That is arithmetic rather than performance, in the same way the boot-strapping effect was.",
        },
        {
          type: "h2",
          text: "Scrip dividend",
        },
        {
          type: "p",
          text: "Shareholders are offered new shares instead of cash, out of the current year’s earnings. Those who want income can still take the cash; those who do not take shares, and the company keeps their portion. It preserves cash without the signal a cut would send.",
        },
        {
          type: "h2",
          text: "Scrip or bonus issue",
        },
        {
          type: "p",
          text: "Extra shares issued free to existing shareholders, in proportion to what they already hold, out of reserves. No wealth changes hands at all: every shareholder owns the same fraction of the same company, now divided into more pieces, so the share price falls proportionately.",
        },
        {
          type: "p",
          text: "The distinction between the last two matters. A scrip dividend is a real choice between cash and shares and does preserve cash. A bonus issue distributes nothing — it is a presentational act that lowers the share price into a more marketable range, and calling it an alternative to a dividend in an exam answer needs that qualification attached.",
        },
      ],
      check: {
        question:
          "A company makes a one-for-four bonus issue. What happens to a shareholder holding 4,000 shares worth ZMW5 each?",
        options: [
          "They hold 5,000 shares worth about ZMW4 each — ZMW20,000 before and after",
          "They hold 5,000 shares worth ZMW5 each, so their wealth rises to ZMW25,000",
          "They receive ZMW5,000 in cash, being the value of the extra shares",
          "They hold 4,000 shares worth ZMW6.25 each",
        ],
        answer: 0,
        explain:
          "A bonus issue distributes no assets and creates no value — it divides the same company into more shares, so the price adjusts to keep every holding worth what it was. The shareholder has more paper and exactly the same wealth.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "advising",
      heading: "Advising a company on its dividend",
      blocks: [
        {
          type: "p",
          text: "A question asking what dividend a company should pay is not asking which theory is correct. It is asking for a recommendation that survives being read by the board, and the way to build one is in a fixed order.",
        },
        {
          type: "ul",
          items: [
            "Start with the investment programme. Every positive-NPV project should be funded, because that is where value comes from.",
            "Establish the capacity. Are there distributable profits, and is there free cash flow to equity to back the payment?",
            "Look at the shareholders. Who are they, what have they been led to expect, and what do they hold the shares for?",
            "Consider the signal. What will the market read into this figure, particularly if it is lower than last year’s?",
            "Then set a level the company is confident it can sustain, and say what would have to change before it moved.",
          ],
        },
        {
          type: "p",
          text: "The order matters. A recommendation that sets the dividend first and then finds the investment programme underfunded has the whole thing backwards — and a recommendation that funds everything and lets the dividend fall to nil has ignored what the market will make of it.",
        },
        {
          type: "p",
          text: "Two situations recur and are worth having answers ready for. A company that must cut should cut once, deeply enough that it will not have to cut again, and explain why — a series of small cuts is read as a company losing control. And a company enjoying an exceptionally good year should pay a special dividend rather than raise the ordinary one, so the increase is not mistaken for a new permanent level.",
        },
        {
          type: "p",
          text: "Underneath all of it sits the point irrelevance theory was making. A dividend policy cannot rescue a company that invests badly, and it cannot add much to one that invests well. What it can do is avoid destroying value through poor signalling and unnecessary surprises — which is a modest objective, and the right one.",
        },
      ],
      check: {
        question:
          "A company has had one exceptional year, with profits well above its normal level, and does not expect it to repeat. What should it do?",
        options: [
          "Pay a special dividend, so the extra distribution is not mistaken for a new permanent level",
          "Raise the ordinary dividend, since the profits support it this year",
          "Retain all of the surplus, to avoid sending any signal at all",
          "Make a bonus issue, which distributes the surplus without using cash",
        ],
        answer: 0,
        explain:
          "Raising the ordinary dividend sets an expectation the company has already said it cannot meet, so next year brings a cut and the signalling damage that goes with it. A special dividend is understood to be one-off — it distributes the money and leaves the ordinary dividend, and the expectation it carries, exactly where it was.",
      },
    },
  ],
};
