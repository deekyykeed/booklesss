/* CF · Lesson 2 Cost of capital · Step 1 — The cost of equity
 *
 * Source: 02_Cost_of_Capital_and_Capital_Structure/Cost of Capital — Session 1
 * (2025), slides 2, 8–26. Activities 3, 4 and 5 are the lecture's own, at their
 * original figures.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "cost-of-equity",
  label: "The cost of equity",
  title: "The cost of equity",
  kicker: "Cost of capital",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-it-is",
      heading: "A cost that nobody invoices",
      blocks: [
        {
          type: "p",
          text: "The cost of a source of finance is the return the people who provided it demand for leaving their money in the business. Not what the company chooses to pay — what the investors require in order to stay.",
        },
        {
          type: "p",
          text: "For debt this is visible: the lender writes it into the facility letter and the interest leaves the bank account every quarter. For equity nothing leaves. No invoice arrives, no default clause triggers if the shareholders get nothing this year. It is easy to conclude that equity is free, and companies that reason that way destroy value for years without noticing.",
        },
        {
          type: "p",
          text: "Shareholders have a required return all the same, and they enforce it by selling. A LuSE-listed company earning 8% when its shareholders demand 15% will watch its share price fall until whoever holds the shares is getting 15% on what they paid. The cost was always there; the market simply collects it through the price rather than through a payment.",
        },
        {
          type: "callout",
          text: "The cost of equity is what shareholders require, not what the company pays out. It is charged whether or not a dividend is declared.",
        },
      ],
      check: {
        question:
          "A company pays no dividend and has no debt. What is its cost of capital?",
        options: [
          "Its cost of equity — the return its shareholders require, which exists whether or not a dividend is paid",
          "Zero, because no cash is leaving the business to any provider of finance",
          "The risk-free rate, since the company has no borrowings to service",
          "It cannot be determined until the company starts paying dividends",
        ],
        answer: 0,
        explain:
          "Shareholders are giving up the return they could get elsewhere at the same risk, and that opportunity cost is real whether it reaches them as a dividend or as a rising share price. A company that invests below it is making its owners poorer while its income statement looks fine.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "capm",
      heading: "The capital asset pricing model",
      blocks: [
        {
          type: "p",
          text: "CAPM builds the cost of equity out of two pieces: what a completely safe investment pays, and a premium for the risk this particular share carries on top of that.",
        },
        {
          type: "formula",
          text: "re  =  rf  +  β × (rm − rf)",
          where: [
            "re = the cost of equity, the return shareholders require",
            "rf = the risk-free rate, taken as the yield on government securities",
            "rm = the expected return on the market as a whole",
            "β = the share’s beta coefficient",
            "rm − rf = the market risk premium",
          ],
        },
        {
          type: "p",
          text: "With a risk-free rate of 4%, a market return of 10% and a beta of 1.20, the cost of equity is 4% + 1.20 × 6% = 11.2%. The 6% is what the market as a whole pays over government paper; the beta of 1.20 says this share carries 1.2 times that risk, so it earns 1.2 times that premium.",
        },
        {
          type: "p",
          text: "Read the pieces off the question carefully, because they are given in different forms and one of them is a trap.",
        },
        {
          type: "table",
          columns: [{ label: "The question says" }, { label: "What to do" }],
          rows: [
            ["Market return is 13%, risk-free rate is 6%", "The premium is the difference: 7%"],
            ["Market risk premium is 9%, risk-free rate is 6.35%", "The premium is already given — do not subtract"],
            ["Yield on treasury bills is 7%", "That is your risk-free rate"],
          ],
          note: "A market risk premium of 9% with a beta of 0.85 gives 6.35% + 0.85 × 9% = 14.00%. Subtracting the risk-free rate again would give 2.24% of premium and an answer near 8%.",
        },
        {
          type: "p",
          text: "Beta itself measures how much a share moves when the market moves. A beta of 1 moves with the market. Above 1 amplifies it — a copper miner on the LuSE, whose fortunes swing with a world commodity price, sits well above 1. Below 1 dampens it, which is where a water utility or a maize miller selling a staple tends to sit.",
        },
        {
          type: "p",
          text: "What beta does not measure is risk specific to the one company — a fire at the plant, a lost court case, a chief executive who resigns. CAPM ignores that deliberately, on the reasoning that an investor holding thirty shares has already diversified it away and will not pay to have it removed twice.",
        },
      ],
      check: {
        question:
          "The risk-free rate is 6.35% and the market risk premium is 9%. A company’s equity beta is 0.85. What is its cost of equity?",
        options: ["14.00%", "8.60%", "13.60%", "6.35%"],
        answer: 0,
        explain:
          "6.35% + 0.85 × 9% = 14.00%. The premium is given directly, so nothing is subtracted from it. Treating the 9% as a market return and working 6.35% + 0.85 × (9% − 6.35%) gives 8.60% — the most common way to lose this mark.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "beta",
      heading: "Where beta comes from",
      blocks: [
        {
          type: "p",
          text: "Beta is calculated from how a share’s returns have moved against the market’s: how volatile the share is, relative to the market, and how closely the two move together.",
        },
        {
          type: "formula",
          text: "βx  =  ρ  ×  σx ÷ σm",
          where: [
            "ρ = the correlation coefficient between the share’s returns and the market’s",
            "σx = the standard deviation of the share’s returns",
            "σm = the standard deviation of the market’s returns",
          ],
        },
        {
          type: "p",
          text: "The two parts are doing different jobs. The ratio of standard deviations asks how much more the share swings than the market. The correlation asks how much of that swinging is the market’s doing rather than the company’s own — and it scales the answer down accordingly, because only the shared part is risk an investor cannot diversify away.",
        },
        {
          type: "p",
          text: "FJ plc is listed on the LuSE. Over ten years the correlation between FJ and the LuSE index has been 0.90. FJ’s returns have a standard deviation of 62.80%, against 53.41% for the LuSE.",
        },
        {
          type: "formula",
          text: "βFJ  =  0.90 × 62.80 ÷ 53.41  =  1.058",
        },
        {
          type: "p",
          text: "FJ is about 18% more volatile than the market, but 10% of its movement is its own rather than the market’s — so its beta lands at 1.058 rather than 1.176. With treasury bills yielding 6% and the LuSE averaging 13%, its cost of equity is 6% + 1.058 × 7% = 13.41%.",
        },
        {
          type: "p",
          text: "A share that swung twice as hard as the market but had a correlation of only 0.3 with it would have a beta of 0.6 — less risky, in CAPM’s eyes, than the market itself. The volatility is real; it just is not the kind an investor has to be paid to bear.",
        },
      ],
      check: {
        question:
          "A share has a standard deviation of returns of 40% against the market’s 25%, and a correlation with the market of 0.50. What is its beta?",
        options: ["0.80", "1.60", "0.31", "1.25"],
        answer: 0,
        explain:
          "0.50 × 40 ÷ 25 = 0.80. The share is 1.6 times as volatile as the market, but only half of its movement is explained by the market, so its beta comes out below 1. The 1.60 answer forgets the correlation entirely.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "dividend-valuation-model",
      heading: "The dividend valuation model",
      blocks: [
        {
          type: "p",
          text: "The dividend valuation model comes at the same number from the opposite direction. Rather than building the required return from risk, it reads it out of the price shareholders are already paying: the cost of equity is the rate that makes the present value of all future dividends equal today’s share price.",
        },
        {
          type: "p",
          text: "Where the dividend is expected to stay flat, that stream is a perpetuity and the rate falls out in one line.",
        },
        {
          type: "formula",
          text: "re  =  D ÷ P₀  × 100",
          where: [
            "D = the constant annual dividend per share",
            "P₀ = the current share price, ex-div",
          ],
        },
        {
          type: "p",
          text: "Where it is expected to grow at a steady rate, the growth comes off the denominator.",
        },
        {
          type: "formula",
          text: "re  =  d₀(1 + g) ÷ P₀  +  g",
          where: [
            "d₀ = the dividend just paid",
            "g = the constant annual growth rate, as a decimal",
            "P₀ = the current share price, ex-div",
            "d₀(1 + g) = next year’s dividend, also written d₁",
          ],
        },
        {
          type: "p",
          text: "Ex-div means the price with the imminent dividend excluded — a buyer at that price will not receive it. If a question quotes a cum-div price, the dividend about to be paid has to come off first, because the model is valuing future dividends and that one is no longer among them.",
        },
        {
          type: "h2",
          text: "Estimating the growth rate",
        },
        {
          type: "p",
          text: "Growth is rarely given. It is usually estimated from the dividends the company has actually paid, as the compound rate that connects the earliest to the latest.",
        },
        {
          type: "formula",
          text: "g  =  ⁿ√( latest dividend ÷ earliest dividend )  −  1",
          where: [
            "n = the number of intervals of growth, which is one less than the number of dividends",
          ],
        },
        {
          type: "p",
          text: "Count the intervals, not the dividends. Dividends of 12n, 15n, 18n and 19n span four years but only three intervals, so g = ³√(19 ÷ 12) − 1 = 16.55%.",
        },
        {
          type: "h2",
          text: "Working one through",
        },
        {
          type: "p",
          text: "A business has just paid a dividend of 4.20 ngwee per share. Five years ago it paid 2.00 ngwee. The shares trade at 97.50 ngwee.",
        },
        {
          type: "table",
          columns: [{ label: "Step" }, { label: "Working" }, { label: "Result", align: "right" }],
          rows: [
            ["Growth rate", "⁵√(4.20 ÷ 2.00) − 1", "16.0%"],
            ["Next year’s dividend", "4.20 × 1.16", "4.87n"],
            ["Dividend yield", "4.87 ÷ 97.50", "5.0%"],
          ],
          total: ["Cost of equity", "5.0% + 16.0%", "21.0%"],
        },
        {
          type: "p",
          text: "Twenty-one percent, and only a quarter of it is the dividend. The rest is growth — the shareholders are paying 97.50 ngwee for a 4.87 ngwee dividend because they expect it to keep compounding at 16%. That is what makes the model fragile: shift g by two points and the answer moves by two points, on an estimate drawn from five old numbers.",
        },
      ],
      check: {
        question:
          "A company has just paid a dividend of 20 ngwee per share, growing at a constant 6% a year. The shares trade at 212 ngwee ex-div. What is the cost of equity?",
        options: ["16.0%", "15.4%", "9.4%", "6.0%"],
        answer: 0,
        explain:
          "20 × 1.06 ÷ 212 = 10%, plus the 6% growth = 16%. The dividend in the numerator must be next year’s, not the one just paid — using 20 ÷ 212 + 6% gives 15.4% and understates the return shareholders are getting.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "choosing",
      heading: "Choosing between the two models",
      blocks: [
        {
          type: "p",
          text: "Both models estimate the same thing and will rarely agree. Which one you use is decided by what the question gives you and by what the company looks like.",
        },
        {
          type: "table",
          columns: [{ label: "" }, { label: "CAPM" }, { label: "Dividend valuation model" }],
          rows: [
            ["Builds the answer from", "Risk, measured against the market", "The price investors already pay"],
            ["Needs", "A beta, a risk-free rate, a market return", "A share price, a dividend, a growth rate"],
            ["Works when", "The company is listed and a beta exists", "Dividends are paid and grow steadily"],
            ["Breaks when", "The company is unlisted, or its beta is unstable", "No dividend is paid, or growth is erratic"],
          ],
        },
        {
          type: "ul",
          items: [
            "A company that pays no dividend has no DVM answer at all. Plenty of growing firms retain everything, and the model has nothing to work with.",
            "Growth estimated from history assumes the past repeats. Two good harvests can produce a growth rate that no one in management believes.",
            "CAPM’s beta is measured from past returns too, and a thinly traded LuSE share may go days without a price to measure.",
            "CAPM assumes investors are diversified. A family that owns most of one Zambian company is not, and genuinely faces risks CAPM tells them to ignore.",
          ],
        },
        {
          type: "p",
          text: "In an exam, use whichever the data supports, and where both are possible say which you have chosen and why. Where they disagree materially that is a finding worth a sentence, not an error to reconcile — it usually means the market’s view of the company’s risk and its view of the company’s growth are not consistent with each other.",
        },
        {
          type: "p",
          text: "Whichever model produced it, this figure is one input. The other providers of finance have their own required returns, and the weighted average of all of them is the rate a project is actually appraised at.",
        },
      ],
      check: {
        question:
          "A fast-growing Zambian technology company is listed on the LuSE but has never paid a dividend. How should its cost of equity be estimated?",
        options: [
          "By CAPM, since the dividend valuation model has no dividend to work from",
          "By the dividend valuation model, using the dividend the company is expected to pay eventually",
          "By taking the cost of debt and adding a premium for equity risk",
          "It cannot be estimated until the company begins paying dividends",
        ],
        answer: 0,
        explain:
          "CAPM never asks about dividends — it prices risk, and a listed share has a beta whether or not it distributes anything. The DVM needs a dividend stream to discount, and a hypothetical future one with no history behind it would make the growth rate pure invention.",
      },
    },
  ],
};
