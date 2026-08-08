/* TM · Step 0 — Start here: The Case for Treasury Management
 *
 * Sources: the course's own module handbook and scheme of work; the past papers
 * in `past-papers/` for what the paper actually rewards. No lecture slide backs
 * a step like this one, which is the point of it: the material tells a student
 * what is examinable and never tells them why to care.
 *
 * Discipline (C-11): QUANTITATIVE. This step produces nothing itself, so C-9 is
 * n/a here and binds every other step in the course.
 *
 * Written 2026-08-07 against rule S-11 (every course opens with a step about
 * the course), paying debt D-15. The five things it owes: the stake, where the
 * subject sits, where it lands, one line of welcome, and how to read the thing.
 *
 * ⚠️ It is NOT a contents page (S-6). The shape of the course is one sentence
 * in §3; the sidebar lists the steps and stays right when they move.
 *
 * The Zambian default is used rather than a company missing payroll because
 * `intro-to-treasury`, the very next step, opens on exactly that and a reader
 * meeting the same hook twice in two screens learns that the course repeats
 * itself (W-13, C-8).
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Start here: what this course is for'.
 * The old name was sentence case and did not name the topic the way the paper does. The slug is
 * untouched, so no URL moved.
 */

export default {
  slug: "start-here-treasury",
  label: "The Case for Treasury Management",
  title: "The Case for Treasury Management",
  kicker: "Treasury Management",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "the-day-it-falls-due",
      heading: "Start here",
      blocks: [
        {
          type: "p",
          text: "In November 2020 Zambia missed a [[coupon|The interest a bond pays its holders, on fixed dates, whatever else is happening. Missing one is a default even when the borrower still owns plenty: the date is the obligation, not the wealth.]] payment of about **USD 42.5 million** and became the first African country to [default](https://corporatefinanceinstitute.com/resources/economics/sovereign-risk/) in the pandemic era. The country was not empty. It had copper in the ground, tax still coming in and assets on every balance sheet you could name. What it did not have was that much money, in that currency, on that day.",
        },
        {
          type: "p",
          text: "That gap is the entire subject. **Being owed money, owning things and making a profit are three different questions from having cash when a payment falls due,** and the fourth one is the only one anybody can be sued over. That fourth question has a name, [[liquidity|Whether a business can meet what falls due, on the day it falls due. It is separate from wealth: an asset you cannot sell this week is not liquidity, however much it is worth.]], and it is the one this course is about. A company can post its best year on record in March and be unable to pay staff on the 28th, for reasons that are all visible months ahead if somebody is looking.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Profit is an opinion formed at year end. Cash is a fact on a Tuesday. This course is about the Tuesday.",
        },
        {
          type: "p",
          text: "Treasury is the part of a business that watches the Tuesday: what is coming in, what has to go out, and what it costs to cover the difference. When the kwacha moves or the central bank changes rates, treasury is what absorbs it. The cycle it watches runs from buying stock to being paid for it, and is called the [working capital cycle](https://corporatefinanceinstitute.com/resources/accounting/working-capital-cycle/).",
        },
      ],
      check: {
        question:
          "A company's audited accounts show a healthy profit for the year, and three weeks later it cannot pay its suppliers. What has gone wrong?",
        options: [
          "Nothing in the accounts is necessarily wrong: profit is measured over a year and includes money not yet received, while paying a supplier needs cash on a specific day",
          "The profit figure must have been falsified, because a profitable company always has cash",
          "The suppliers were paid early, which is the only way this happens",
          "Profit and cash are the same number reported in two places, so one of them is a clerical error",
        ],
        answer: 0,
        explain:
          "Profit counts a sale when it is made, not when it is paid for, and it is spread across a whole year. Cash is a balance on a particular morning. A business can be growing, profitable and completely unable to meet a payment, which is why treasury is a separate job from accounting.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "what-it-buys-you",
      heading: "What you can do with it",
      blocks: [
        {
          type: "p",
          text: "This course assumes you can read a balance sheet and knows you have met an income statement. It does not assume anything else. What it adds is the money already in motion: the [cash sitting in accounts](https://corporatefinanceinstitute.com/resources/accounting/cash-management/), the invoices waiting to be paid, the borrowing that funds the gap and the currency risk sitting under all of it.",
        },
        {
          type: "p",
          text: "That is a different question from the one investment appraisal asks. Deciding whether to build the plant is one job. **Making sure the company can still pay for cement in month four is this one,** and a business that gets the first right and the second wrong does not finish the plant.",
        },
        { type: "h2", text: "The decisions this hands you" },
        {
          type: "ul",
          items: [
            "How much cash to keep, when idle cash earns nothing and an empty account costs everything.",
            "Whether to take a supplier's early-payment discount or keep the money and take the credit.",
            "What to do when your revenue is in kwacha and a supplier invoices you in US dollars, with three months before you pay. That gap is an [[exposure|A position whose value in your own currency is not yet fixed, so it moves with the market until the day it settles.]].",
            "How to fund a shortfall you can see coming, and what a lender will demand in return.",
            "Where to put a surplus so it is still there, in full, on the day you need it back.",
          ],
        },
        {
          type: "p",
          text: "Those are the treasurer's decisions in a bank or a mining group, and they are also the first five money decisions anybody running their own business ever makes. **The scale changes and the questions do not.** A finance officer at ZESCO and a founder with one truck are answering the same list with different numbers of zeros.",
        },
        {
          type: "callout",
          kind: "exam",
          text: "The paper is written the same way. Most marks in the past papers go to a calculation and then to a short recommendation about what the business should actually do. A number with no decision attached to it leaves marks on the table.",
        },
      ],
      check: {
        question:
          "A Zambian company earns its revenue in kwacha and has agreed to pay a supplier USD 200,000 in three months. Which of these is a treasury question?",
        options: [
          "What the payment will cost in kwacha if the exchange rate moves before the date, and whether to fix that cost now",
          "Whether the goods being bought are of acceptable quality",
          "How the purchase should be depreciated over its useful life",
          "Which department's budget the cost is charged to",
        ],
        answer: 0,
        explain:
          "The other three are real questions and none of them is treasury's. Treasury owns the exposure: the amount is fixed in dollars, the company earns kwacha, and the cost in kwacha is unknown until the day it is paid. Deciding whether to leave that open or fix it now is the job.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "how-to-use-this",
      heading: "How to use this",
      blocks: [
        {
          type: "p",
          text: "You have started, which is the part most people put off until the week before the exam. From here it is short steps rather than long ones: **each one is a single sitting, and finishing three of them in an evening beats abandoning one halfway.**",
        },
        {
          type: "p",
          text: "**Twenty-one steps sit after this one, across 57 sections,** and they run in the order the money does. Getting cash in and keeping it moving. Protecting it from [rates and currencies](https://corporatefinanceinstitute.com/resources/foreign-exchange/foreign-exchange-risk/). What it costs to borrow, and what to do with a surplus. Then the systems that actually move it between banks. A section is roughly five minutes, which makes an evening about a lesson.",
        },
        { type: "h2", text: "Three things worth knowing before you start" },
        {
          type: "ul",
          items: [
            "Every section ends with a question. Get it wrong and it tells you why the right answer is right, which is the point of it. Nothing is marked and nobody sees it.",
            "There is a flag at the end of each section. If something is confusing, too long or looks wrong, say so there. That is the fastest way to get a section rewritten, and it has already changed several.",
            "Your place is kept as you go, so you can stop mid-step and come back to the same spot on any device.",
          ],
        },
        {
          type: "p",
          text: "One habit is worth more than any of that. **When a step works an example, work it yourself on paper before reading the answer.** Following a worked example feels like understanding and is not: the exam hands you a blank page, and the only preparation for a blank page is a blank page.",
        },
      ],
      check: {
        question:
          "Treasury is usually described as executing rather than setting policy. What does that mean in practice?",
        options: [
          "The board decides how much risk the company will carry, and treasury operates within that: it manages the exposures and the cash, but does not decide the company's appetite for risk on its own",
          "Treasury has no decisions to make, and simply processes payments the board has approved",
          "Treasury sets the company's strategy and the board carries it out",
          "It means treasury only exists in companies large enough to have a board",
        ],
        answer: 0,
        explain:
          "The split matters because it is where treasury failures come from. A treasurer choosing their own risk limits is the setup behind most of the famous blow-ups in the syllabus. Policy comes from above, execution and the daily judgement calls sit with treasury, and the line between them is examinable.",
      },
    },
  ],
};
