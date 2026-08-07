/* CF · Step 0 — Start here: what this course is for
 *
 * Sources: the course's own module handbook and scheme of work; the past papers
 * for what the paper actually rewards. No lecture slide backs a step like this
 * one, which is the point of it: the material says what is examinable and never
 * says why to care.
 *
 * Discipline (C-11): QUANTITATIVE. This step produces nothing itself, so C-9 is
 * n/a here and binds every other step in the course.
 *
 * Written 2026-08-07 against rule S-11, paying debt D-15. Five things owed: the
 * stake, where the subject sits, where it lands, one line of welcome, and how
 * to read it.
 *
 * ⚠️ NOT a contents page (S-6). The shape is one sentence in §3.
 *
 * The stake is a rate gap rather than a named company's failure: the arithmetic
 * of funding something at 22% to earn 18% is checkable by the reader in the
 * sentence they read it in, where a corporate collapse has to be taken on
 * trust. C-6 handles the famous cases where the syllabus wants them.
 */

export default {
  slug: "start-here-corporate-finance",
  label: "Start here",
  title: "Start here: what this course is for",
  kicker: "Corporate Finance",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "the-expensive-yes",
      heading: "Start here",
      blocks: [
        {
          type: "p",
          text: "A project returns 18% a year. The money to build it costs 22%. It runs for six years, it is busy, it employs people, and **it will show a profit in the accounts every single one of those years while making the company poorer.**",
        },
        {
          type: "p",
          text: "Nothing in that is a trick. Profit is measured after paying interest to lenders and before paying anything at all to shareholders, so a project can clear the first hurdle and fail the one that matters. The full price of the money, borrowed and invested together, is the [cost of capital](https://corporatefinanceinstitute.com/resources/valuation/cost-of-capital/). The gap only shows up if somebody puts a cost on every kwacha the business uses, including the money nobody sends an invoice for. Shareholders send no invoice and still expect a return, which is why [[equity|The owners' money in a business. It costs more than borrowing, not less: a lender is paid before an owner and can sue, so an owner carries the risk and prices it accordingly.]] is the expensive half.",
        },
        {
          type: "callout",
          kind: "key",
          text: "Money has a price even when nobody bills you for it. Every method in this course exists to make that price visible before the decision, rather than obvious afterwards.",
        },
        {
          type: "p",
          text: "That is the whole of corporate finance in one line: **which things are worth doing, where the money to do them comes from, and what that money costs.** Get it wrong in one direction and you turn down something that would have paid. Get it wrong in the other and you spend six years busy and behind.",
        },
      ],
      check: {
        question:
          "A project earns a 20% return. The company funds it with a mix of borrowing and shareholders' money that costs 24% overall. It reports an accounting profit every year. Is it worth doing?",
        options: [
          "No. It earns less than the money costs, so every year it runs it destroys value, whatever the accounting profit says",
          "Yes, because a project reporting a profit is by definition adding value",
          "Yes, because 20% is a high return in absolute terms",
          "It cannot be judged without knowing how long the project lasts",
        ],
        answer: 0,
        explain:
          "An accounting profit is struck after interest but before any return to shareholders, so it can be positive while the project earns less than the full cost of the money in it. The comparison that decides the question is return against the cost of capital, and here it is 20% against 24%.",
      },
    },

    /* ---------------------------------------------------------------- */
    {
      id: "what-it-buys-you",
      heading: "What you can do with it",
      blocks: [
        {
          type: "p",
          text: "This course assumes you can read a set of accounts and have met an income statement and a balance sheet. It does not assume anything else. What it adds is a way of putting today's value on money that arrives in five years. That is [[discounting|Working backwards from a future amount to what it is worth today, given what money earns in the meantime. Every method in this course is this one idea wearing a different name.]], and it is the one skill every question in the course turns on.",
        },
        {
          type: "p",
          text: "It sits one step before the day-to-day. Deciding which project to fund is here. **Making sure the company can pay for it in month four is treasury's question, and the two are separate jobs done by separate people** in every company big enough to have both.",
        },
        { type: "h2", text: "The decisions this hands you" },
        {
          type: "ul",
          items: [
            "Whether to [build the thing at all](https://corporatefinanceinstitute.com/resources/valuation/net-present-value-npv/), when the money comes back over years and is worth less the later it arrives.",
            "Which two of five good projects to fund when the budget only stretches to two.",
            "Whether to raise money by borrowing or by selling a share of the business, and what each choice costs.",
            "What a share is actually worth, as opposed to what it is trading at. The gap between those two is what a [[valuation|An estimate of what a business is worth on its own numbers, rather than what the market is currently paying for it. The two disagree often, and the disagreement is the opportunity.]] is for.",
            "How much profit to pay out and how much to keep, and what the decision signals to everyone watching.",
          ],
        },
        {
          type: "p",
          text: "Those are the questions a finance director answers, and they are the same questions a founder answers about their own money with fewer zeros and no committee. A ZMW 40,000 second truck and a ZMW 400 million shaft are the same sum written twice. **The arithmetic that tells a mining group whether to open a shaft is the arithmetic that tells one person whether to buy a second truck.**",
        },
        {
          type: "callout",
          kind: "exam",
          text: "The past papers reward the working, not the verdict. A right answer with no visible calculation earns a fraction of the marks, and a wrong answer with correct method and one arithmetic slip keeps most of them. Show every line.",
        },
      ],
      check: {
        question:
          "A company must choose between two profitable projects and can only fund one. Which comparison decides it?",
        options: [
          "Which one adds more value today, once each project's future cash flows are discounted at the cost of the money funding them",
          "Which one produces the larger total cash over its life, added up without adjustment",
          "Which one recovers its initial outlay in the fewest months",
          "Which one reports the higher accounting profit in its first year",
        ],
        answer: 0,
        explain:
          "The other three are all used in practice and each is misleading on its own: totals ignore when the money arrives, payback ignores everything after it, and first-year profit ignores the rest of the project. Discounting is what makes cash arriving in different years comparable at all.",
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
          text: "**Twenty-five steps sit after this one, across 125 sections,** and they run from the decision outward. First whether a project is worth doing, then where the money comes from and what each source costs, then what the business is worth and [what to do with the profit](https://corporatefinanceinstitute.com/resources/accounting/dividend/) once it arrives. A section is roughly five minutes, which makes an evening about a lesson.",
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
          text: "One habit is worth more than any of that. **When a step works an example, work it yourself on paper before reading the answer.** Following a worked calculation feels like understanding and is not: the exam hands you a blank page, and the only preparation for a blank page is a blank page.",
        },
      ],
      check: {
        question:
          "Why does a kwacha received in five years count for less than a kwacha received today, even with no inflation at all?",
        options: [
          "Because a kwacha today can be put to work for those five years, so waiting has a cost whether or not prices rise",
          "Because money physically wears out over time",
          "Only inflation makes future money worth less, so with no inflation the two are equal",
          "Because five years is long enough that the payer will probably default",
        ],
        answer: 0,
        explain:
          "Inflation and default risk are real and are handled separately. The reason underneath both is opportunity: money in hand can earn a return now, so being made to wait has a price. That price is the discount rate, and it is what every method in this course applies.",
      },
    },
  ],
};
