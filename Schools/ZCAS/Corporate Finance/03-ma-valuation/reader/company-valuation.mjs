/* CF · Lesson 3 Valuation and M&A · Step 2 — Valuing a company
 *
 * Source: 03_Mergers_and_Acquisitions/Lectures/Target Company Valuation (2023),
 * 20 slides. Activities 1, 2 and 3 are the lecture's own at their original
 * figures, with the currency label written ZMW in line with the house style.
 *
 * The lecture rounds HP Co's growth rate to 9.5% and carries that through to a
 * share price of 751n; those are the figures used here.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "company-valuation",
  label: "Valuing a company",
  title: "Valuing a company",
  kicker: "Valuation and M&A",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "two-approaches",
      heading: "What a company is worth depends on who is asking",
      blocks: [
        {
          type: "p",
          text: "Valuing a target is the stage of a takeover where the price gets decided, and there is no single right answer. Several methods are available, they produce different numbers, and which number is relevant depends on what the buyer intends to do with the business.",
        },
        {
          type: "p",
          text: "The methods fall into two families.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Asset-based" }, { label: "Income-based" }],
          rows: [
            ["Values", "What the company owns", "What the company will earn"],
            ["Suits a buyer who", "Intends to break the business up or sell parts of it", "Intends to keep it running"],
            ["Methods", "Book value, net realisable value, replacement cost", "P/E ratio, dividend growth model, discounted free cash flow"],
            ["Usually gives", "The lower figure", "The higher figure"],
          ],
        },
        {
          type: "p",
          text: "The gap between the two families is where the argument lives. A profitable company is worth far more as a going concern than the sum of its assets, because the assets by themselves do not include the customers, the staff, the licences or the brand. A lossmaking one can be worth more broken up than kept alive.",
        },
        {
          type: "p",
          text: "This is why valuation is described as more art than science. The arithmetic in each method is straightforward; choosing the method, and defending the assumptions inside it, is the work.",
        },
      ],
      check: {
        question:
          "A bidder intends to buy a struggling manufacturer, close it, and sell its factory and equipment. Which valuation basis is most relevant?",
        options: [
          "Net realisable value — what the assets would fetch if sold, less the costs of selling them and the liabilities to be settled",
          "The P/E ratio basis, applied to the company’s earnings",
          "The dividend growth model, using its most recent dividend",
          "Replacement cost, being what it would cost to buy the assets new",
        ],
        answer: 0,
        explain:
          "The buyer’s intention decides the basis. Income methods value a stream of future earnings that this buyer has no intention of collecting. Net realisable value measures exactly what the plan will produce — the proceeds of a sale, after the costs of getting there.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "market-capitalisation",
      heading: "Market capitalisation",
      blocks: [
        {
          type: "p",
          text: "For a listed company the market has already put a value on the equity every trading day. Market capitalisation is the number of issued ordinary shares multiplied by their market price.",
        },
        {
          type: "formula",
          text: "Market capitalisation  =  number of issued shares  ×  market price per share",
        },
        {
          type: "p",
          text: "A company with 5 million ZMW0.50 ordinary shares quoted at ZMW2.85 has a market capitalisation of 5m × ZMW2.85 = ZMW14.25 million. The ZMW0.50 nominal value plays no part — it is the traded price that matters.",
        },
        {
          type: "p",
          text: "What that figure gives a bidder is a floor, not a price. It is roughly the minimum the target’s shareholders will accept, because they can already sell at it in the market. To persuade them to hand over control, a substantial premium has to be added on top.",
        },
        {
          type: "p",
          text: "Two limitations are worth stating in any answer that uses it.",
        },
        {
          type: "ul",
          items: [
            "It reflects marginal trading only. On any given day a small fraction of the shares change hands, and that price is what values the whole company — which is fine for a share and questionable for control of a business.",
            "It reflects the company as it is, not as the bidder intends it to be. Nothing in the share price knows about the synergies or the cost savings the buyer is planning, so it cannot say what the target is worth to this particular bidder.",
          ],
        },
        {
          type: "p",
          text: "Whether it is a fair value at all depends on how efficient the market is — and on the LuSE, where some counters trade rarely, a quoted price can be several weeks out of date. So look at how the share price has moved over a period rather than reading one day’s figure.",
        },
      ],
      check: {
        question:
          "Why is market capitalisation described as a minimum rather than a valuation of the target?",
        options: [
          "Shareholders can already sell at that price, so a premium is needed to persuade them to give up control",
          "Because market prices are always below the true value of a company",
          "Because it excludes the company’s debt",
          "Because it uses the nominal value of the shares rather than their market price",
        ],
        answer: 0,
        explain:
          "Nobody sells for what they could get anyway. The market price is the alternative available to every target shareholder, so it sets the floor of the negotiation — and the premium above it is what the bidder is paying for control and for whatever it thinks it can do with the business.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "asset-based",
      heading: "Asset-based valuations",
      blocks: [
        {
          type: "p",
          text: "An asset-based valuation adds up what the company owns and deducts what it owes. The three versions differ only in how the assets are measured.",
        },
        {
          type: "table",
          columns: [{ label: "Basis" }, { label: "Assets measured at" }, { label: "Useful when" }],
          rows: [
            ["Book value", "Historical cost, as in the statement of financial position", "A quick, factual, easily obtained starting point is needed"],
            ["Net realisable value", "What they would fetch on the open market, less selling costs", "The buyer intends to break the business up"],
            ["Replacement cost", "What it would cost to buy equivalent assets today", "The buyer is asking whether to buy or to build"],
          ],
        },
        {
          type: "formula",
          text: "Net asset value  =  total assets  −  total liabilities",
        },
        {
          type: "p",
          text: "Book value is the one that is always available, and the one that is nearly always wrong. Its figures are factual, which is its whole appeal, but historical cost is not current value: a Lusaka warehouse bought in 2009 sits in the accounts at a fraction of what it is worth, while the inventory and receivables figures may be worth considerably less than stated.",
        },
        {
          type: "p",
          text: "The larger problem is what the accounts leave out entirely. Internally generated goodwill, brands, customer relationships and the skill of the workforce are not recognised as assets — and in a profitable company they are usually most of what the buyer is actually paying for.",
        },
        {
          type: "callout",
          text: "Net asset value sets a lower limit on what a going concern is worth. A bid at or below it would be better spent buying the assets separately.",
        },
        {
          type: "p",
          text: "Replacement cost and realisable value are more relevant than book value and much harder to obtain. A bidder can download the target’s published accounts; working out what its assets would really fetch, or really cost to replace, needs information only the target has.",
        },
      ],
      check: {
        question:
          "A profitable software company has net assets of ZMW8 million in its accounts and is being valued for sale at ZMW60 million. What best explains the difference?",
        options: [
          "Most of what the buyer is paying for — the customer base, the brand and the workforce — is not recognised as an asset in the accounts",
          "The company’s assets must have been undervalued at historical cost",
          "The buyer is overpaying, since the accounts state what the company owns",
          "The difference is the company’s liabilities, which have been deducted twice",
        ],
        answer: 0,
        explain:
          "Accounting rules do not let a company recognise internally generated goodwill, brands or human capital, so a business whose value is mostly those things will show almost nothing on its balance sheet. That is a limitation of the measure, not evidence of an error or of overpayment.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "pe-basis",
      heading: "The price/earnings basis",
      blocks: [
        {
          type: "p",
          text: "The P/E basis values a company by multiplying its earnings by the multiple the market applies to companies like it. It is the quickest income-based method and the most widely used in practice.",
        },
        {
          type: "formula",
          text: "Share price  =  P/E ratio  ×  earnings per share",
          where: [
            "P/E ratio = the multiple of earnings the market pays for a company of this type",
            "earnings per share = distributable earnings ÷ the number of shares",
          ],
        },
        {
          type: "p",
          text: "The whole valuation turns on which P/E ratio is used, and there are three candidates. The bidder’s own, the target’s own, or an average for the sector. They can differ by a factor of five, and the choice has to be argued for rather than assumed.",
        },
        {
          type: "table",
          columns: [{ label: "P/E used" }, { label: "What it assumes" }],
          rows: [
            ["The target’s own", "The business continues as it is, under the same management"],
            ["The sector average", "The target will perform like a typical company in its industry"],
            ["The bidder’s own", "The bidder’s higher rating will extend to the target’s earnings after acquisition"],
          ],
        },
        {
          type: "p",
          text: "PC plans to acquire 75% of the shares in Computer Co, whose share capital is ZMW2 million made up of 40 ngwee shares. Computer Co has just paid a dividend of 6 ngwee per share on a payout ratio of 40%, and the sector average P/E is 8 times.",
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Earnings per share", "6n ÷ 0.40", "15n"],
            ["Share price", "15n × 8", "120n"],
            ["Number of shares", "ZMW2m ÷ ZMW0.40", "5,000,000"],
            ["Shares to be bought", "5m × 75%", "3,750,000"],
          ],
          total: ["Amount payable", "3,750,000 × ZMW1.20", "ZMW4,500,000"],
        },
        {
          type: "p",
          text: "Two things in that working catch people out. The dividend has to be turned back into earnings by dividing by the payout ratio, since P/E values earnings and not dividends. And the number of shares comes from dividing the share capital by the nominal value of 40 ngwee, not by the market price.",
        },
      ],
      check: {
        question:
          "A company pays a dividend of 9 ngwee per share on a payout ratio of 60%. The sector P/E is 12 times. What is the share price on a P/E basis?",
        options: ["180n", "108n", "64.8n", "300n"],
        answer: 0,
        explain:
          "Earnings per share is 9n ÷ 0.60 = 15n, and 15n × 12 = 180n. Multiplying the dividend by the P/E instead gives 108n — the P/E is a multiple of earnings, and a company paying out only 60% earns considerably more than it distributes.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "dividend-growth",
      heading: "The dividend growth model, and comparing the answers",
      blocks: [
        {
          type: "p",
          text: "The dividend growth model values a share as the present value of every dividend it will ever pay. It is the cost of equity calculation from Lesson 2, rearranged: there you knew the price and solved for the return, here you know the return and solve for the price.",
        },
        {
          type: "formula",
          text: "P₀  =  d₀(1 + g) ÷ (re − g)",
          where: [
            "d₀ = the dividend just paid",
            "g = the constant annual growth rate",
            "re = the cost of equity, usually found by CAPM",
          ],
        },
        {
          type: "p",
          text: "PH Co is considering a bid for HP Co. HP has 5 million ordinary shares, earnings per share of 40 ngwee and a payout ratio of 60%. It paid 23.0 ngwee a year ago and 20.0 ngwee the year before that. Its equity beta is 1.40, treasury bills yield 4.6%, the market returns 10.6% and the sector P/E is 10 times.",
        },
        {
          type: "p",
          text: "Take the P/E basis first, since it needs nothing but the earnings.",
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Share price", "40n × 10", "400n"],
          ],
          total: ["Value of HP", "5m × ZMW4.00", "ZMW20.00m"],
        },
        {
          type: "p",
          text: "Then the dividend growth model, which needs three inputs built first: the cost of equity, the current dividend and the growth rate.",
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Cost of equity", "4.6% + 1.40 × (10.6% − 4.6%)", "13.0%"],
            ["Current dividend", "60% × 40n", "24n"],
            ["Growth rate", "√(24 ÷ 20) − 1", "9.5%"],
            ["Share price", "24 × 1.095 ÷ (0.130 − 0.095)", "751n"],
          ],
          total: ["Value of HP", "5m × ZMW7.51", "ZMW37.55m"],
        },
        {
          type: "p",
          text: "ZMW20 million on one basis and ZMW37.55 million on the other, from the same company on the same day. Nothing has been done wrong — the two methods are answering the question differently, and knowing why is worth more than either figure.",
        },
        {
          type: "ul",
          items: [
            "The P/E basis says HP is an ordinary company in its sector and should be rated like one. It takes a single year’s earnings and a market multiple, and asks nothing about the future.",
            "The dividend growth model says HP will grow its dividend at 9.5% forever against a required return of 13%. That gap of 3.5 points is doing almost all of the work.",
          ],
        },
        {
          type: "p",
          text: "That is the fragility to watch. With re − g on the denominator, the answer explodes as growth approaches the required return: at 11% growth instead of 9.5% the same shares are worth ZMW13.32 and the company ZMW66.6 million. A growth rate estimated from two old dividends cannot carry that much weight.",
        },
        {
          type: "p",
          text: "So the practical answer is a range rather than a number. Net asset value sets the floor, market capitalisation sets what the shareholders will not go below, and the income methods mark out the ceiling — with the final price settled by negotiation somewhere inside it.",
        },
      ],
      check: {
        question:
          "Why does the dividend growth model give ZMW37.55 million for HP Co when the P/E basis gives ZMW20 million?",
        options: [
          "The growth model prices in perpetual dividend growth of 9.5% against a required return of 13%, and that narrow gap dominates the answer",
          "One of the two calculations must contain an error, since a company has only one value",
          "The P/E basis has ignored the company’s dividends",
          "The growth model includes the company’s assets while the P/E basis does not",
        ],
        answer: 0,
        explain:
          "Dividing by (13% − 9.5%) means dividing by 0.035, which multiplies the next dividend by nearly 29. The P/E basis applies a multiple of 10 to earnings and makes no forecast at all. Both are correctly worked; they simply embed very different views of HP’s future.",
      },
    },
  ],
};
