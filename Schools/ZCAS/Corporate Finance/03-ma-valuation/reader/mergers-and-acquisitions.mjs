/* CF · Lesson 3 Valuation and M&A · Step 3 — Mergers and acquisitions
 *
 * Source: 03_Mergers_and_Acquisitions/Lectures/Mergers and Acquisitions (2023),
 * 23 slides. The Super / Shake practice question is the lecture's own; its
 * figures are unchanged and its company labels kept so the step and the slide
 * can be read side by side, with the currency written ZMW per the house style.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "mergers-and-acquisitions",
  label: "Mergers and acquisitions",
  title: "Mergers and acquisitions",
  kicker: "Valuation and M&A",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-they-are",
      heading: "Mergers, acquisitions and the three shapes they take",
      blocks: [
        {
          type: "p",
          text: "A merger is a friendly reorganisation in which two companies combine into a new one — A and B agree to become C, with both sets of shareholders consenting. It usually happens between companies of similar size, which is what makes agreement possible: neither ends up dominated by the other.",
        },
        {
          type: "p",
          text: "An acquisition, or takeover, is one company buying control of another by acquiring its ordinary shares. The acquirer is normally the larger, the target ceases to exist as an independent company, and the target’s board may or may not have been consulted.",
        },
        {
          type: "p",
          text: "Whichever it is, the combination takes one of three shapes, and the shape determines both the case for it and the regulatory attention it attracts.",
        },
        {
          type: "table",
          columns: [{ label: "Form" }, { label: "What combines" }, { label: "Example" }],
          rows: [
            [
              "Horizontal",
              "Two companies in the same industry at the same stage of production",
              "One Zambian miller buying another",
            ],
            [
              "Vertical",
              "Two companies in the same industry at different stages — forwards to secure distribution, backwards to secure supply",
              "A miller buying the grain traders who supply it",
            ],
            [
              "Conglomerate",
              "Two companies in unrelated areas of business",
              "A miller buying an insurance broker",
            ],
          ],
        },
        {
          type: "p",
          text: "Horizontal combinations promise the clearest cost savings and draw the most scrutiny from competition regulators, since removing a competitor is the point. Vertical ones secure a supply chain — worth a great deal in a market where inputs are unreliable. Conglomerate ones are the hardest to justify, because a shareholder who wanted exposure to both industries could simply have bought shares in both.",
        },
      ],
      check: {
        question:
          "A Zambian brewer buys the company that supplies its bottles. What form of takeover is this?",
        options: [
          "Vertical — a move backwards in the production process to secure supply",
          "Horizontal — both companies are in the drinks industry",
          "Conglomerate — bottling and brewing are different businesses",
          "Vertical — a move forwards in the production process to secure distribution",
        ],
        answer: 0,
        explain:
          "The two sit at different stages of the same production chain, which makes it vertical, and the supplier is upstream of the brewer, which makes it backwards. Forwards would be buying the bars and shops that sell the beer.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "why",
      heading: "Why companies do it",
      blocks: [
        {
          type: "p",
          text: "An acquisition is financially justified only if it increases the wealth of the acquiring company’s shareholders. A merger has to increase the wealth of both sets. Everything else is a reason someone gives, and the reasons sort into three groups.",
        },
        {
          type: "h2",
          text: "Economic reasons",
        },
        {
          type: "ul",
          items: [
            "Synergy — the combined output of the two businesses exceeding the sum of what they produced separately. It depends almost entirely on how well the two are integrated afterwards.",
            "Economies of scale, from operating at a larger size.",
            "Removing inefficient management, where a falling share price reflects the people running the company rather than the business itself. Buying the company can be easier than voting the board out.",
            "Entry into new markets — faster and often cheaper than building from nothing, especially across a border.",
            "Growth when the existing business has matured, and market power once the combination is complete.",
          ],
        },
        {
          type: "h2",
          text: "Financial reasons",
        },
        {
          type: "ul",
          items: [
            "Financial synergy — the combined company’s cost of capital falling below what either faced alone.",
            "Buying a target the market has undervalued, which is a claim that the market is wrong about it.",
            "Tax: a target with losses carried forward brings relief the acquirer can use.",
            "Raising the acquirer’s earnings per share. Doing this deliberately by buying low-rated earnings with highly rated shares is called boot-strapping.",
          ],
        },
        {
          type: "h2",
          text: "Managerial reasons",
        },
        {
          type: "p",
          text: "Some acquisitions happen because they suit the managers rather than the shareholders — the agency problem in its most expensive form. A larger company pays its chief executive more, carries more prestige, and is harder for anyone else to take over, which makes the managers’ own jobs safer.",
        },
        {
          type: "p",
          text: "These are worth separating in an answer, because they predict different outcomes. Economic and financial motives can be tested against the numbers. Managerial motives explain a great deal of what actually happens and none of what should.",
        },
        {
          type: "callout",
          kind: "warning",
          text: "Synergy is a forecast, not a fact. It is realised in the integration, and that is where most acquisitions fail.",
        },
      ],
      check: {
        question:
          "Which of these is a managerial rather than an economic or financial motive for an acquisition?",
        options: [
          "The chief executive expects a larger company to pay more and to be harder to take over",
          "The target has tax losses the acquirer can use against its own profits",
          "Combining the two distribution networks will remove duplicated cost",
          "The target’s share price has fallen because it is poorly managed",
        ],
        answer: 0,
        explain:
          "Pay and job security accrue to the manager, not to the shareholders — that is what makes it an agency cost. Tax losses are a financial motive, removing duplicated cost is synergy, and replacing weak management is an economic one, even though it also concerns managers.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "post-acquisition-eps",
      heading: "What happens to earnings per share",
      blocks: [
        {
          type: "p",
          text: "A share-for-share acquisition changes both halves of the earnings per share fraction: the earnings of the two companies combine, and new shares are issued to pay for it. Which effect is larger decides whether EPS rises or falls, and the answer follows from the two P/E ratios.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "Super", align: "right" }, { label: "Shake", align: "right" }],
          rows: [
            ["Number of shares", "200m", "25m"],
            ["Earnings ZMW", "20m", "5m"],
            ["Earnings per share ZMW", "0.10", "0.20"],
            ["P/E ratio", "25", "5"],
            ["Share price ZMW", "2.50", "1.00"],
            ["Market value ZMW", "500m", "25m"],
          ],
        },
        {
          type: "p",
          text: "Super pays ZMW25 million for Shake — exactly its market value, so no premium — by issuing 10 million of its own ZMW2.50 shares.",
        },
        {
          type: "table",
          columns: [{ label: "Post-acquisition" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Total shares", "200m + 10m", "210m"],
            ["Total earnings ZMW", "20m + 5m", "25m"],
          ],
          total: ["Earnings per share", "ZMW25m ÷ 210m", "ZMW0.1190"],
        },
        {
          type: "p",
          text: "Super’s EPS has risen from 10 ngwee to 11.90 ngwee, and nothing whatever has improved. No costs were saved, no revenue was gained, no synergy was assumed. Super simply bought ZMW5 million of earnings for 10 million shares, when its own 200 million shares were only producing ZMW20 million.",
        },
        {
          type: "p",
          text: "That is boot-strapping, and it works because Super’s shares are rated at 25 times earnings while Shake’s are rated at 5. Every share Super issues is expensive currency; every kwacha of Shake’s earnings is cheap. Buy cheap earnings with expensive paper and EPS goes up by arithmetic alone.",
        },
        {
          type: "p",
          text: "Now carry it through to the share price, on the assumption that the market keeps rating Super at 25 times.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "No synergy", align: "right" }, { label: "With ZMW3.35m of synergy", align: "right" }],
          rows: [
            ["Total earnings ZMW", "25.00m", "28.35m"],
            ["Earnings per share ZMW", "0.1190", "0.1350"],
            ["P/E ratio", "25", "25"],
            ["Share price ZMW", "2.98", "3.375"],
            ["Market value ZMW", "625.8m", "708.75m"],
          ],
        },
        {
          type: "p",
          text: "The two companies were worth ZMW525 million between them the day before. The no-synergy column says they are worth ZMW625.8 million the day after, which would mean ZMW100 million of value created by a transaction in which nothing happened. That is the assumption failing, not value appearing: an efficient market will not go on applying a growth company’s multiple of 25 to earnings it knows were bought from a business the market rates at 5.",
        },
        {
          type: "callout",
          kind: "warning",
          text: "A rising EPS after an acquisition is not the same as value created. Ask what the combined company’s P/E should be before believing the share price.",
        },
      ],
      check: {
        question:
          "Super’s EPS rises from 10 ngwee to 11.90 ngwee with no synergy at all. What has actually happened?",
        options: [
          "Super bought earnings rated at a P/E of 5 using shares rated at a P/E of 25, so the earnings acquired outweigh the shares issued",
          "Super has created ZMW5 million of value for its shareholders",
          "Shake’s shareholders have been overpaid, which is why Super’s EPS improved",
          "The rise comes from the cost savings Super expects to make after the acquisition",
        ],
        answer: 0,
        explain:
          "It is an arithmetic effect of the two ratings, not an improvement in the business. Ten million Super shares represent ZMW1 million of Super’s existing earnings but bought ZMW5 million of Shake’s — so the numerator grew proportionately faster than the denominator, and no cost was saved to make it happen.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "financing-the-bid",
      heading: "Paying for it",
      blocks: [
        {
          type: "p",
          text: "How the bid is paid for is a separate decision from whether to make it, and it changes who carries the risk of the acquisition going wrong.",
        },
        {
          type: "table",
          columns: [{ label: "Method" }, { label: "What the target shareholders get" }, { label: "The trade-off" }],
          rows: [
            [
              "Cash offer",
              "Cash for their shares",
              "Certain value, and they leave — but the acquirer needs the funds and its gearing rises",
            ],
            [
              "Share for share",
              "A fixed number of shares in the bidder",
              "No cash needed, but the bidder’s existing shareholders are diluted and the target’s shareholders stay",
            ],
            [
              "Security package",
              "Loan stock, preference shares or convertibles rather than ordinary shares",
              "No dilution of control, but a fixed claim is created against the combined company",
            ],
            ["Mixed bid", "Shares with a cash alternative", "Lets each shareholder choose, which widens acceptance"],
          ],
        },
        {
          type: "p",
          text: "The choice sends a signal too. A bidder paying in its own shares is asking the target’s shareholders to share the risk of the integration — and may be doing so because it thinks its shares are currently expensive. A cash bid says the bidder wants the whole of the upside for itself.",
        },
        {
          type: "h2",
          text: "The strategic process",
        },
        {
          type: "p",
          text: "The whole exercise runs in a fixed order, and the valuation work sits in the middle of it rather than at the start.",
        },
        {
          type: "ul",
          items: [
            "Identify suitable targets.",
            "Obtain as much information as possible about each one.",
            "Value each target, and decide the maximum price worth paying for it.",
            "Choose which target is most appropriate.",
            "Decide how to finance the bid, taking account of what both sets of shareholders will accept.",
          ],
        },
        {
          type: "p",
          text: "The third step is the discipline. Setting a maximum price before negotiations begin is what stops a bidder chasing a target past the point where the acquisition still makes sense — the most reliable way large acquisitions destroy value.",
        },
      ],
      check: {
        question:
          "A bidder chooses to pay in its own shares rather than cash. What is the main consequence for its existing shareholders?",
        options: [
          "Their holdings are diluted, and they now share the risk of the acquisition with the target’s former shareholders",
          "They bear more risk than in a cash offer, because no cash leaves the company",
          "Their earnings per share must fall, because more shares are in issue",
          "The company’s gearing rises, because shares are a form of prior charge capital",
        ],
        answer: 0,
        explain:
          "Issuing shares hands part of the combined company to the target’s shareholders, so the existing owners hold a smaller proportion and no longer own all of the upside. Whether EPS falls depends on the two P/E ratios — as Super showed, it can rise sharply.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "defences",
      heading: "Defending against a hostile bid",
      blocks: [
        {
          type: "p",
          text: "A friendly takeover is negotiated between the two boards. A hostile one is not: the bidder approaches the target’s shareholders directly and the target’s directors resist. Several defences exist, and they work by making the company harder, dearer or slower to buy.",
        },
        {
          type: "table",
          columns: [{ label: "Defence" }, { label: "How it works" }],
          rows: [
            [
              "Poison pill",
              "Existing shareholders are given the right to buy shares at a very low price if a bid succeeds, so the acquirer finds itself buying a company whose share count has ballooned. Makes the takeover far more expensive",
            ],
            [
              "White knight",
              "A friendlier company is invited to counter-bid, offering better terms and undertaking to keep the core business intact",
            ],
            [
              "Golden parachute",
              "Large compensation payments — cash, bonuses, share options — become due to senior management if their positions are eliminated, adding to the cost of the bid",
            ],
            [
              "Crown jewels",
              "The most valuable assets, which are usually why the company became a target, are sold or put into a sale-and-leaseback so the target becomes less attractive",
            ],
            [
              "Litigation or regulatory defence",
              "The bid is challenged in the courts or referred to the competition authorities, buying time and possibly stopping it altogether",
            ],
          ],
        },
        {
          type: "p",
          text: "Read them with the agency problem in mind. Directors resisting a bid may genuinely believe the offer undervalues the company — or may be protecting jobs the takeover would remove, at the expense of shareholders who would rather take the premium. A golden parachute makes that tension unusually explicit.",
        },
        {
          type: "p",
          text: "Some defences damage the company whether or not they succeed. Selling the crown jewels destroys the very thing that made the business valuable, and a poison pill leaves a share register nobody intended. They are last resorts, not routine tactics, and the strongest defence remains a share price that already reflects what the company is worth.",
        },
      ],
      check: {
        question:
          "A target’s board invites a friendlier company to make a counter-offer on better terms. What is this defence called?",
        options: [
          "A white knight",
          "A poison pill",
          "A golden parachute",
          "Selling the crown jewels",
        ],
        answer: 0,
        explain:
          "A white knight is a rescuing counter-bidder — the company is still taken over, but on terms the board prefers and usually with the core business preserved. A poison pill raises the cost to the hostile bidder rather than introducing an alternative one.",
      },
    },
  ],
};
