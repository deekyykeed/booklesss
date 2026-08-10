/* TM · Getting Started · Policy and Execution
 *
 * Sources: the course's own module handbook and scheme of work. Institution:
 * this course's own material (C-2).
 * Discipline (C-11): QUANTITATIVE. This step produces nothing itself, so C-9
 * is n/a here.
 *
 * REPLACES `one-step-one-sitting.mjs`, deleted 2026-08-09 the same day it was
 * created. That step was S-11's "how to read it" row written out in full: a
 * step count, what a question button does, where the note button is, that
 * progress is kept. The owner: "you are now moving away from the actual course
 * to Booklesss mechanics which are only supposed to stay with me." The row is
 * deleted from S-11 and the rule is now **S-13** — a step teaches the subject
 * and never describes the product.
 *
 * What survived is the CHECK, which was always about the subject rather than
 * the app: treasury executes, the board sets policy. The prose is now the
 * thing that check tests, which is S-11's "where it sits" row and a real
 * syllabus topic. Its `explain` lost "the syllabus" and "examinable" under
 * **C-12**.
 *
 * The welcome line survives too, at one sentence (**S-11**), minus "until the
 * week before the exam".
 *
 * Barings is deliberately NOT the hook here even though it is the perfect
 * illustration: it is told properly in `cost-centre-or-profit-centre`, and
 * W-13's fourth ban says a case from another step is a stranger at an opening.
 *
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "policy-and-execution",
  label: "Policy and Execution",
  title: "Policy and Execution",
  kicker: "Getting Started",

  sections: [
    /* ---------------------------------------------------------------- */
    {
      id: "policy-and-execution",
      heading: "Policy and execution",
      blocks: [
        {
          type: "p",
          text: "A treasurer who picks the limit and then trades against it does not have a limit. **The number and the person it restrains cannot be the same person,** and almost every treasury disaster you will read about started with somebody holding both.",
        },
        {
          type: "p",
          text: "So the work splits in two. The board decides how much risk the company is willing to carry, which is its [[risk appetite|How much a business is prepared to lose, decided in advance and in writing, before anybody is in a position where losing is on the table. It is a board decision because it is a decision about the whole company, not about one deal.]]. That means how much of the dollar exposure gets covered, how far ahead, which banks are acceptable, and how much may sit with any one of them. **Treasury then executes inside that,** and everything it does day to day is judgement within someone else's boundary.",
        },
        {
          type: "p",
          text: "A Zambian mining group's board sets a policy of covering 80% of its dollar costs twelve months ahead. That sentence decides nothing about Tuesday. Treasury still has to choose [forwards or options](https://corporatefinanceinstitute.com/resources/derivatives/forward-contract/), which banks to ask, what a fair spread looks like this week, and whether to cover the remaining 20% when the kwacha moves. **The policy is a fence, not a map.**",
        },
        {
          type: "callout",
          kind: "key",
          text: "Policy comes from above. Execution and every daily judgement call sit with treasury. The line between them is the single most useful thing to know about how the function works.",
        },
        {
          type: "p",
          text: "You have started, which is the part most people put off. What follows runs in the order the money does. Getting cash in and keeping it moving. Protecting it from [rates and currencies](https://corporatefinanceinstitute.com/resources/foreign-exchange/foreign-exchange-risk/). What it costs to borrow, and what to do with a surplus. Then the systems that move it between banks.",
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
          "The split matters because it is where treasury failures come from. A treasurer choosing their own risk limits is the setup behind most of the famous blow-ups in this field. Policy comes from above; execution and the daily judgement calls sit with treasury, and a company that blurs the line has removed the only thing standing between it and one person's bad week.",
      },
    },
  ],
};
