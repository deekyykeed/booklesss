/* TM · Lesson 1 Operations · Step 1: Introduction to treasury management
 *
 * Source: 06_Introduction to Treasury Management PPTX; Treasury controls.pdf;
 *         build_lesson_1_1_tm.py (PDF).
 *
 * House style: .claude/skills/step-skill/RULES.md
 *
 * 2026-08-01 engagement rewrite (owner, study session: "boring"). Syllabus
 * coverage is unchanged: same six sections, same eleven functions, same three
 * levels, same six controls, same three structures. What changed is the way in.
 * The step now opens on the profitable-company-misses-payroll problem instead
 * of a definition; Barings is told as the story it is, with its date and its
 * figures, rather than a one-line callout; the three levels are worked through
 * one running exposure (a miller buying wheat in USD); and centralisation is
 * argued on a Zambian mining group rather than in the abstract. See RULES.md
 * W-3 (revised), W-6, W-7, C-5, C-6, S-7.
 *
 * 2026-08-01 emphasis, ownership and sources pass. This step is the reference
 * implementation for six rules:
 *   W-8  bold what should stick, 1 to 3 per section, whole sentence only when
 *        the whole sentence is the point
 *   W-9  write to someone who will run this, not someone revising it
 *   W-10 carry that down to the possessive: your suppliers, your payroll.
 *        Third-party examples (the miller, the mining group) stay "the".
 *   W-11 no em dashes anywhere in the step
 *   E-8  [[term|definition]] tap-to-define for jargon the source assumes
 *   C-7  inline `[phrase](url)` links on the words a claim comes from, out to
 *        where the idea is taught properly. The school material sets the
 *        syllabus; these are the teachers. Twelve links, every one checked for
 *        a 200 before it went in, which caught four I had guessed wrong.
 *        These began as a "read further" box at the foot of each section and
 *        were moved inline the same day: a box arrives after the reader has
 *        finished the idea, so the source becomes a chore rather than part of
 *        the sentence.
 * Wording changed, coverage did not: "the exam asks you to sort tasks" became
 * the decision the reader will make on a Tuesday, and the closing lines of the
 * functions and controls sections hand over the judgement, not the mark scheme.
 */

export default {
  slug: "intro-to-treasury",
  label: "Introduction to treasury",
  title: "Introduction to treasury management",
  kicker: "Treasury operations",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "what-treasury-is",
      heading: "What treasury is",
      blocks: [
        {
          type: "p",
          text: "Your company can have a [profitable year](https://corporatefinanceinstitute.com/resources/accounting/cash-flow-vs-net-income/) and still fail to pay your staff at the end of it. Your [[income statement|The report of what your business earned and spent over a period: revenue minus costs, ending in profit. It counts sales when they are made, not when the cash arrives, which is exactly why it can show a profit while your account is empty.]] says the year went well. Your bank balance on the 28th says there is not enough in the account to run payroll. **Profit is worked out over twelve months and rests on judgement; cash is a fact on a Friday afternoon.** It is the Friday that decides whether your people get paid.",
        },
        {
          type: "p",
          text: "[Treasury](https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/treasury-management/) is the function that lives on the cash side of that gap. Its job is to **protect your financial assets, manage your liabilities, and put your money in the right account, in the right currency, on the day it is needed**, while the cash you don't need yet earns something instead of sitting idle. Every risk that comes with holding and moving that money is treasury's to find and reduce: a kwacha that moves against you, a rate that resets, a bank that changes its terms.",
        },
        {
          type: "callout",
          text: "Profit is an opinion formed over a year. Cash is a fact on a Friday. Treasury owns the Friday.",
        },
        {
          type: "p",
          text: "**Treasury executes; it does not set strategy.** If your board decides to fund a new plant with 40% debt, treasury gets no vote. It goes out and raises the debt, negotiates the terms, and then lives with the rate risk for the next ten years. Keeping that line clear matters, because the function works inside the three decisions that make up corporate finance.",
        },
        {
          type: "ul",
          items: [
            "**The investment decision.** Where your money goes: long-term projects, working capital, investments inside or outside your business.",
            "**The financing decision.** Where the money comes from: the mix of debt and equity, the cost of those funds, and the [[hedging|Taking a second position that moves the opposite way to a risk you already carry, so the two cancel out. You give up some upside to remove the downside. It is insurance, not a bet.]] that mix forces on you.",
            "**Dividend policy.** What happens to the profit: how much is paid out to shareholders and how much is kept to fund growth.",
          ],
        },
        {
          type: "p",
          text: "Treasury sits underneath all three. It funds the working capital your investment decision creates, manages the risks your financing decision leaves open, and holds the cash your dividend policy has promised to pay out.",
        },
      ],
      check: {
        question:
          "The board decides the company will move to a 40% debt, 60% equity structure. What is treasury's role in that decision?",
        options: [
          "Execute it: arrange the borrowings and manage the resulting cost and risk; the decision itself belongs to senior management",
          "Make it, because capital structure is treasury's core decision",
          "Veto it if the cost of debt is too high",
          "None, because capital structure is an accounting matter",
        ],
        answer: 0,
        explain:
          "Treasury carries out decisions made by senior management. The financing decision is set above the function; treasury's job is to raise the funds on the best terms, manage the refinancing and rate risk it creates, and keep access to credit open.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "eleven-functions",
      heading: "The eleven functions of treasury",
      blocks: [
        {
          type: "p",
          text: "Before lunch, your treasurer might release a dollar payment to one of your suppliers, roll a deposit that matured this morning, take a call from your bank about an overdraft rate, approve a credit limit for a new customer, and send you the group cash forecast. **Five different jobs, one desk.** When you are the one hiring for that desk, or sitting at it, this is the list of what you are actually buying: eleven functions, each with a name worth knowing.",
        },
        {
          type: "table",
          columns: [{ label: "#" }, { label: "Function" }, { label: "What it means" }],
          rows: [
            ["1", "Cash forecasting", "Pulls short and long-term forecasts from all subsidiaries"],
            ["2", "Working capital management", "Monitors working capital levels and trends"],
            ["3", "Cash management", "Keeps sufficient cash available for operations at all times"],
            ["4", "Investment management", "Invests surplus cash appropriately"],
            ["5", "Risk management", "Manages interest rate and FX exposure"],
            ["6", "Management advice", "Advises leadership on market conditions"],
            ["7", "Credit rating relations", "Liaises with agencies when issuing marketable debt"],
            ["8", "Bank relationships", "Manages banking fees, terms, and ongoing communications"],
            ["9", "Fund raising", "Maintains investor relationships for capital raising"],
            ["10", "Credit granting", "Grants credit to customers on behalf of the business"],
            ["11", "Other activities", "M&A support, company insurance, and similar matters"],
          ],
        },
        {
          type: "p",
          text: "The list is not eleven flat items. **The first five are the operating core, and they run in order:** [forecast the cash](https://corporatefinanceinstitute.com/resources/financial-modeling/forecasting-cash-flow/), manage the [[working capital|The money tied up in running your business day to day: stock on your shelf and invoices your customers haven't paid yet, less the invoices you haven't paid your suppliers. It is cash you own but cannot spend.]] that consumes it, [keep enough on hand to trade](https://corporatefinanceinstitute.com/resources/accounting/cash-management/), invest what is left, and manage the risks sitting on top of all of it. **The last six point outward:** to management, the [[rating agencies|Firms like Moody's, S&P and Fitch that score how likely a borrower is to repay. The score sets the interest rate every future borrowing carries, so a downgrade costs real money.]], the banks, the investors, the customers you grant credit to, and a catch-all for M&A support and insurance. In a small company you will do most of these yourself before you can afford anyone to do them for you.",
        },
        {
          type: "callout",
          text: "Recover the list from the five/six split: **five functions that move the money, six that manage the people and institutions who let it move.** Eleven flat items will not survive pressure; the split will.",
        },
      ],
      check: {
        question:
          "A supplier of marketable debt asks who at the company handles its relationship with Moody's and S&P. Which treasury function is that?",
        options: [
          "Credit rating relations, which liaises with agencies when the company issues marketable debt",
          "Bank relationships, since rating agencies are a kind of bank",
          "Fund raising, since ratings are only about raising equity",
          "Management advice, since ratings are advice to leadership",
        ],
        answer: 0,
        explain:
          "Rating agencies get their own function on the list because their assessment prices the company's debt. Bank relationships covers fees and terms with lenders; the agency relationship is about the rating that every future issue will carry.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "task-levels",
      heading: "Strategic, tactical and operational",
      blocks: [
        {
          type: "p",
          text: "Take one exposure and watch it pass through all three levels. A Zambian miller buys wheat in US dollars and sells flour in kwacha, so every consignment carries [currency risk](https://corporatefinanceinstitute.com/resources/derivatives/hedging/).",
        },
        {
          type: "p",
          text: "The board decides the company will cover at least 70% of its dollar purchases and will never trade currency for profit. That is policy, it holds for years, and it is **strategic**. The treasurer then looks at the next two quarters of wheat orders and covers the March and June exposures with [[forward contracts|An agreement to buy or sell a set amount of currency on a set future date at a price fixed today. It removes the uncertainty: you know in January what March's dollars will cost you.]], a decision about specific exposures over months, which is **tactical**. On the morning a [forward](https://corporatefinanceinstitute.com/resources/derivatives/forward-contract/) matures, someone instructs the bank, checks the funds landed and files the confirmation. That is **operational**.",
        },
        {
          type: "p",
          text: "Same risk, three different jobs, three different people. **You sort tasks by time horizon, not by how important they sound.** That is the call you will be making the first time you decide what to keep on your own desk and what to hand to someone else.",
        },
        {
          type: "table",
          columns: [{ label: "Level" }, { label: "Focus" }, { label: "Examples" }],
          rows: [
            [
              "Strategic",
              "Long-term policy",
              "Capital structure, dividend policy, capital raising, investment returns",
            ],
            [
              "Tactical",
              "Medium-term decisions",
              "Cash investment management, hedging currency or interest rate risk",
            ],
            [
              "Operational",
              "Daily execution",
              "Transmitting cash, placing surplus funds, bank communications",
            ],
          ],
        },
        {
          type: "callout",
          text: "Classify by time horizon: **strategic = long-term policy, tactical = medium-term decisions, operational = daily execution.**",
        },
      ],
      check: {
        question:
          "Deciding to hedge next year's USD exposure with forward contracts is which level of treasury task?",
        options: [
          "Tactical, a medium-term decision about managing a specific exposure",
          "Strategic, since anything involving currency is long-term policy",
          "Operational, since hedging is daily execution",
          "None, since hedging is a board matter rather than a treasury task",
        ],
        answer: 0,
        explain:
          "The time horizon decides it. Setting the company's overall risk appetite is strategic; sending today's payment instructions is operational; choosing to hedge a defined exposure over the coming months sits between them, which is tactical.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "cost-vs-profit-centre",
      heading: "Cost centre or profit centre",
      blocks: [
        {
          type: "p",
          text: "On 26 February 1995 Barings Bank collapsed. It was 233 years old. Days later it was sold to ING for **one pound**. One trader in Singapore, [Nick Leeson](https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/rogue-trader/), had built losses of around **£827 million** on futures positions and buried them in an [[error account|A holding account for trades that fail to settle cleanly, meant to be cleared and reconciled daily by someone other than the dealer. Left unchecked it becomes a place to park losses.]] numbered 88888 that nobody else reconciled, for roughly three years. **He dealt the trades and he settled them:** he was the [[front office|The dealers, the people who actually strike trades. The back office confirms, settles and records them. Keeping the two apart is the single most important treasury control.]] and the back office at the same time.",
        },
        {
          type: "p",
          text: "Leeson was not employed to make money by taking positions. He was there to [[arbitrage|Buying and selling the same thing in two markets at once to pocket a small price difference, with almost no risk because both legs are locked in together. It stops being arbitrage the moment one leg is left open.]] small price differences at almost no risk. Why he was able to go so much further than that is the subject of this section, and it is a decision you make about your own business, usually without noticing: **what you decide your treasury function is actually for.**",
        },
        { type: "h2", text: "Treasury as a cost centre" },
        {
          type: "p",
          text: "Most companies run treasury as a **cost centre**, a [support function that is not expected to generate profit](https://corporatefinanceinstitute.com/resources/accounting/cost-structure/), only to control what it spends. That is the safe framing and it has one real weakness: **management starts asking what treasury costs rather than what it saves**, and the function gets starved of budget, staff and systems until something it was supposed to be watching goes wrong. If you are the one setting the budget, that is your weakness to avoid, not the treasurer's.",
        },
        { type: "h2", text: "Treasury as a profit centre" },
        {
          type: "p",
          text: "Companies deep in global finance, currency or commodities sometimes run treasury as a **profit centre**, earning income by trading, hedging, and charging internal business units market rates for its services. The advantages are real: units paying a real price find out what treasury actually costs the group, and the treasurer has a reason to run the desk efficiently. So are the dangers, and the first of them is **the pull towards speculation**, followed by arguments over internal charges and higher administration costs.",
        },
        {
          type: "callout",
          text: "A profit centre is not forbidden, and plenty of firms run one well. What Barings shows is that **the moment profit becomes the measure, the controls in the next section stop being paperwork.** They become the only thing standing between your company and a trader with a losing position to hide.",
        },
      ],
      check: {
        question:
          "A company moves treasury to a profit centre and its dealers begin taking positions beyond what hedging requires. What does the Barings case say about this situation?",
        options: [
          "It is the classic warning: profit incentives without independent controls invite speculation that can destroy the firm",
          "It is healthy, because a profit centre should maximise trading income",
          "It is impossible, because profit centres cannot take positions",
          "It only matters for banks, not corporates",
        ],
        answer: 0,
        explain:
          "Barings fell because one person could deal, settle and conceal without oversight while chasing trading profit. The lesson is not that profit centres are forbidden. It is that the controls in the next section stop being optional the moment profit incentives appear.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "controls",
      heading: "Treasury controls",
      blocks: [
        {
          type: "p",
          text: "Leeson dealt his own trades and then settled them himself. That one fact is the first control on this list, and **its absence is why an £827 million hole stayed invisible for three years.** Treasury moves the largest sums in your company, so [six controls](https://corporatefinanceinstitute.com/resources/accounting/internal-controls/) are non-negotiable. They are cheap to put in on day one and expensive to retrofit after you have hired the person they constrain.",
        },
        {
          type: "table",
          columns: [{ label: "Control" }, { label: "What it requires" }],
          rows: [
            [
              "Segregation of duties",
              "Front office (dealing) separate from back office (confirmation and settlement). No one initiates and confirms their own transactions",
            ],
            [
              "Delegation of authority",
              "High-risk decisions need senior sign-off; routine ones should not",
            ],
            [
              "Limits",
              "Caps on transaction size, type or instrument. Nothing carrying excessive risk of capital loss",
            ],
            [
              "Approvals",
              "Trades approved by a senior manager; a separate person reconciles and accounts for every transaction",
            ],
            [
              "Internal audits",
              "Scheduled audits match actual transactions against policy, catching drift early",
            ],
            [
              "Automation / STP",
              "Straight-through processing removes manual steps from routine transactions, cutting errors and fraud opportunities",
            ],
          ],
        },
        {
          type: "p",
          text: "**The six interlock.** Segregation means no single person can complete a fraud alone. [Limits and approvals](https://corporatefinanceinstitute.com/resources/career-map/sell-side/risk-management/financial-controls/) bound what any one decision is allowed to lose. Audits catch what slips past both. Automation shrinks the space where human error and temptation operate at all. Naming a control is worth very little on its own. **The useful skill is saying which failure each one prevents**, because that is how you work out which ones you can survive without while you are still small.",
        },
      ],
      check: {
        question:
          "A dealer executes a trade and then confirms and settles it personally. Which control is being violated?",
        options: [
          "Segregation of duties, since dealing and settlement must sit with different people",
          "Limits, since the trade must have been too large",
          "Internal audit, since auditors should settle trades",
          "Automation, since all settlement should be manual",
        ],
        answer: 0,
        explain:
          "Front office deals; back office confirms and settles. One person doing both can conceal errors or fraud indefinitely, which is exactly how Leeson hid his losses. Size limits and audits are separate controls; this failure is the segregation one.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "centralisation",
      heading: "Centralised, decentralised and hybrid",
      blocks: [
        {
          type: "p",
          text: "The last [structural choice](https://corporatefinanceinstitute.com/resources/accounting/corporate-structure/) is geographic, and it is the one you will face the first time your business crosses a border. A Zambian [mining group with operations in four countries](https://corporatefinanceinstitute.com/resources/economics/multinational-corporation/) has to decide where treasury actually sits: **one desk in Lusaka, four desks in four capitals, or something between the two.**",
        },
        {
          type: "p",
          text: "The Lusaka desk can see every kwacha and every dollar the group holds at once, negotiate one set of terms across all its banks, and [[net|Offsetting what one part of the group owes against what another is owed, so only the difference is hedged or paid. Two subsidiaries on opposite sides of the same currency cancel each other out for free.]] exposures between subsidiaries before hedging anything. What it cannot see from Lusaka is that a payment out of one of those countries clears on a different cycle, or that a local regulator wants a filing nobody at head office has heard of. **That trade-off, control against local knowledge, is the whole argument.**",
        },
        {
          type: "table",
          columns: [
            { label: "Structure" },
            { label: "How it works" },
            { label: "Advantage" },
            { label: "Disadvantage" },
          ],
          rows: [
            [
              "Centralised",
              "All operations run from HQ",
              "Stronger controls, economies of scale, lower costs, tax advantages for multinationals",
              "Field offices lose autonomy; local knowledge not captured",
            ],
            [
              "Decentralised",
              "Subsidiaries run their own treasury under group guidelines",
              "Local staff know local banking, regulation, language and customs",
              "Duplication of effort and resources across units",
            ],
            [
              "Hybrid",
              "Regional centres: centralised within regions, decentralised across them",
              "Central control with local knowledge",
              "More complex to set up and manage",
            ],
          ],
        },
        {
          type: "p",
          text: "**The hybrid model keeps winning, and technology is the reason.** A treasury management system lets a subsidiary enter its own data into a platform head office watches in real time, giving central oversight without taking the local team's hands off the wheel. What such a system does, and what it costs you to run, is a question this course comes back to.",
        },
      ],
      check: {
        question:
          "A mining group with operations in five countries wants head-office control of cash and risk but keeps losing value to local banking rules its HQ team doesn't know. Which structure fits?",
        options: [
          "Hybrid, since regional centres give central control while capturing local banking knowledge",
          "Fully centralised, since control matters more than local knowledge",
          "Fully decentralised, since each mine should run its own treasury",
          "No treasury at all, outsourcing everything to one bank",
        ],
        answer: 0,
        explain:
          "The group's problem is exactly the trade-off the structures divide on: centralisation for control, decentralisation for local knowledge. The hybrid model exists for cases that need both, at the cost of being more complex to run.",
      },
    },
  ],
};
