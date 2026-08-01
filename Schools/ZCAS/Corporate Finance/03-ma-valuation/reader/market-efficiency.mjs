/* CF · Lesson 3 Valuation and M&A · Step 4 — Market efficiency
 *
 * Source: 03_Mergers_and_Acquisitions/Lectures/Efficient Market Hypothesis
 * (EMH) (2023), 5 slides. The final section draws the implications back to the
 * valuation and acquisition work earlier in this lesson, which is where the
 * hypothesis actually bites in an exam answer.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "market-efficiency",
  label: "Market efficiency",
  title: "The efficient market hypothesis",
  kicker: "Valuation and M&A",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-it-means",
      heading: "What an efficient market is",
      blocks: [
        {
          type: "p",
          text: "A market is efficient when security prices fully reflect the information available, so that a share’s price equals its intrinsic value at all times. Prices sit in equilibrium: the return investors require is the return they expect to get, no more and no less.",
        },
        {
          type: "p",
          text: "The consequence, stated in the language of the rest of this course, is that every tradable security has an NPV of zero. Buying a share means paying exactly the present value of what it will return, discounted at the rate appropriate to its risk. There is no bargain, because a bargain is a positive NPV and somebody would already have taken it.",
        },
        {
          type: "p",
          text: "So no investor can consistently beat the market and earn returns above what the risk they are carrying justifies. Not that nobody makes money — everybody expects to make the required return — but that nobody makes more than it, reliably, from analysis.",
        },
        {
          type: "p",
          text: "Note the two words the claim depends on. Consistently rules out luck: with enough investors, some will beat the market for years by chance. And given the risk rules out the easy objection, since a fund that returned 30% while holding shares twice as volatile as the market has not beaten anything.",
        },
        {
          type: "p",
          text: "Efficiency comes in three strengths, and they are cumulative: each one includes everything the weaker form contains and adds to it.",
        },
      ],
      check: {
        question:
          "In an efficient market, what is the NPV of buying a share at its market price?",
        options: [
          "Zero — the price equals the present value of the returns the share will produce, discounted at the rate its risk requires",
          "Positive, since investors would not buy a share expecting nothing",
          "Negative, once dealing costs are taken into account",
          "It cannot be calculated, because a share has no fixed life",
        ],
        answer: 0,
        explain:
          "A positive NPV would mean the share was underpriced, and in an efficient market it would already have been bought until the price rose and the NPV disappeared. Investors still expect a return — they expect exactly the return the risk justifies, which is what an NPV of zero describes.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "weak-form",
      heading: "Weak form efficiency",
      blocks: [
        {
          type: "p",
          text: "Weak form efficiency means current prices already incorporate all past price and trading-volume data. Everything that could be learned from what the share has done is in what it costs.",
        },
        {
          type: "p",
          text: "It follows that price movements are random — the random walk. Not that prices move for no reason, but that they move on new information, and new information is by definition unpredictable. There are no recurring, exploitable patterns in a price chart, because a pattern that repeated would be traded away by the people who spotted it.",
        },
        {
          type: "p",
          text: "The direct casualty is technical analysis — chartism, the practice of forecasting prices from the shapes past prices have made. In a weak form efficient market it has no merit at all: a chartist cannot consistently outperform, because the chart contains only information every other participant already has.",
        },
        {
          type: "callout",
          text: "Yesterday’s prices are free to everybody, so they cannot be a source of advantage to anybody.",
        },
        {
          type: "p",
          text: "This is the easiest form to test and the one most consistently supported by evidence across the world’s markets, including thinly traded ones.",
        },
      ],
      check: {
        question:
          "An analyst claims that a LuSE-listed share rises every January and that buying each December is profitable. If the market is weak form efficient, what is wrong with the claim?",
        options: [
          "A pattern in past prices that reliably produced profits would be traded away, so it cannot persist",
          "Past prices are not public information, so the pattern could not be observed",
          "Seasonal patterns are a matter of fundamental rather than technical analysis",
          "Nothing — weak form efficiency concerns published accounts, not price history",
        ],
        answer: 0,
        explain:
          "Everyone can see the same history. Investors would buy in November to get ahead of the December buyers, then October to get ahead of them, until the price rise moved forward far enough to disappear. A pattern that can be seen and acted on is a pattern that destroys itself.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "semi-strong-form",
      heading: "Semi-strong form efficiency",
      blocks: [
        {
          type: "p",
          text: "Semi-strong form efficiency means prices reflect all publicly available information — past prices, and also published accounts, announcements, analysts’ reports, economic statistics and news. Prices adjust quickly as each new item becomes public.",
        },
        {
          type: "p",
          text: "The casualty this time is fundamental analysis. An analyst working through a set of published accounts is working with information the market already has, so no combination of ratios and forecasts drawn from public sources will reliably identify a mispriced share. Reading the newspaper is unlikely to improve an investment strategy.",
        },
        {
          type: "p",
          text: "Three consequences follow that matter more to a finance director than to an investor.",
        },
        {
          type: "ul",
          items: [
            "There are no incorrectly priced securities on the basis of public information, so no share is a bargain and none is a trap.",
            "The share price reaction happens at and around the announcement — not before it, and not gradually over the following weeks.",
            "There is no best time for a company to issue securities in order to get a good price, because the price is always fair. Waiting for the market to appreciate the company is waiting for something that has already happened.",
          ],
        },
        {
          type: "p",
          text: "Most developed stock markets are generally accepted to be semi-strong form efficient, or close to it. That acceptance is what makes the standard advice possible: report clearly, announce promptly, and do not attempt to manage the share price through the timing or the presentation of information.",
        },
      ],
      check: {
        question:
          "A company’s results are published on Tuesday and its share price jumps 8% within minutes. Is that consistent with semi-strong form efficiency?",
        options: [
          "Yes — an efficient market absorbs new public information immediately, so the whole reaction happens at the announcement",
          "No — in an efficient market the price would not move at all on published information",
          "No — an 8% move shows the price was wrong before the announcement",
          "Yes, but only if the price had been drifting upwards for the previous few weeks",
        ],
        answer: 0,
        explain:
          "Speed is the evidence for efficiency, not against it. The results were new information, so the price should move — and it should move fully and at once. What would contradict the hypothesis is a slow drift over the following days, which would mean the information was taking time to be reflected and could be traded on in the meantime.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "strong-form",
      heading: "Strong form efficiency",
      blocks: [
        {
          type: "p",
          text: "Strong form efficiency means prices reflect all relevant information, whether public or private. Prices respond quickly to new information of either kind, and even insiders cannot consistently earn abnormal returns.",
        },
        {
          type: "p",
          text: "This is the extreme version and there is little evidence for it. Directors who know a takeover approach is coming, or that a contract has been lost, hold information the price cannot possibly reflect until it is released — which is precisely why insider dealing is profitable.",
        },
        {
          type: "p",
          text: "And why it is a criminal offence in Zambia and in essentially every other jurisdiction with a stock market. Insider trading is the use of confidential information for personal gain, and the law exists because the market is not strong form efficient. If it were, there would be nothing to prohibit.",
        },
        {
          type: "table",
          columns: [{ label: "Form" }, { label: "Prices reflect" }, { label: "Which makes useless" }],
          rows: [
            ["Weak", "Past prices and trading volumes", "Technical analysis — chartism"],
            ["Semi-strong", "All of the above, plus all public information", "Fundamental analysis of published data"],
            ["Strong", "All of the above, plus private information", "Insider dealing"],
          ],
        },
        {
          type: "p",
          text: "Reading down the table, each form takes away one more way of making money and requires one more thing to be true. The realistic position for most markets is the middle row: past prices are certainly in the price, public information mostly is, and private information is not.",
        },
      ],
      check: {
        question:
          "Insider dealing is illegal in almost every country with a stock market. What does that fact suggest about strong form efficiency?",
        options: [
          "That markets are not strong form efficient — if they were, private information would already be in the price and there would be nothing to gain",
          "That regulators have made markets strong form efficient by prohibiting it",
          "That strong form efficiency holds, which is why the profits have to be protected by law",
          "Nothing — the two questions are unrelated",
        ],
        answer: 0,
        explain:
          "A law exists to prevent something possible. The persistence and profitability of insider dealing is direct evidence that prices do not already reflect private information, which is exactly what strong form efficiency would require.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "implications",
      heading: "What it means for the company, not the investor",
      blocks: [
        {
          type: "p",
          text: "The hypothesis is usually taught as a claim about investors, and examined as a claim about managers. If the market is efficient, several things a finance director might be tempted to do are pointless.",
        },
        {
          type: "table",
          columns: [{ label: "The temptation" }, { label: "Why an efficient market defeats it" }],
          rows: [
            [
              "Time a share issue for when the price is high",
              "The price is always fair, so there is no favourable moment to wait for",
            ],
            [
              "Improve the share price by choosing flattering accounting policies",
              "The market sees through presentational changes that do not alter cash flows",
            ],
            [
              "Hold back bad news",
              "It will be reflected in full when it emerges, and the delay costs credibility",
            ],
            [
              "Treat a falling share price as the market misunderstanding the strategy",
              "It is more likely the market’s honest assessment of the strategy",
            ],
          ],
        },
        {
          type: "p",
          text: "There is also a direct tension with the valuation work in this lesson. Buying an undervalued target is a standard financial motive for an acquisition — and it is only available if the market has got the target’s price wrong. A bidder using that argument in a semi-strong form efficient market is claiming that its own analysis of public information beats everyone else’s, which is the claim the hypothesis says cannot be sustained.",
        },
        {
          type: "p",
          text: "It also explains why market capitalisation is a floor rather than a valuation. In an efficient market the price is right about the company as it stands — the bidder is not buying a mispriced business but the chance to run it differently, and the premium is the price of that chance.",
        },
        {
          type: "p",
          text: "Efficiency is a matter of degree, and the degree depends on the market. A large exchange with thousands of participants and continuous analyst coverage is close to semi-strong efficient. A small exchange where a listed company’s shares may not trade for days, where analyst coverage is thin and free float is small, is not — its prices reflect the information of the few people who happen to be trading. The hypothesis is a useful benchmark everywhere; how far a particular market meets it is a question worth answering rather than assuming.",
        },
      ],
      check: {
        question:
          "A finance director wants to delay a rights issue for six months, expecting the market to “come round” to the company’s strategy. What does semi-strong form efficiency say?",
        options: [
          "The current price already reflects everything public about the strategy, so there is no better moment to wait for",
          "The delay is sensible, because share prices rise over time",
          "The delay is sensible only if the strategy has not yet been announced",
          "The market will come round, but the price will already have adjusted before the issue",
        ],
        answer: 0,
        explain:
          "If the strategy is public, its merits are in the price today. Waiting only makes sense if the director has information the market does not — and acting on that would be a different problem entirely. Note the second option's assumption: prices rise on new information, which is unpredictable, not with the passage of time.",
      },
    },
  ],
};
