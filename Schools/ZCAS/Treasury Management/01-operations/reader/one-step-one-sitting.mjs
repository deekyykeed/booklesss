/* TM · Getting Started · One Step, One Sitting
 *
 * Split out of start-here.mjs on 2026-08-09 under the one-checkpoint rule
 * (S-1 revised: one step = one concept = one checkpoint). The section
 * content is carried over verbatim; sources and history are in the
 * header of start-here.mjs.
 * House style: .claude/skills/step-skill/RULES.md
 */

export default {
  slug: "one-step-one-sitting",
  label: "One Step, One Sitting",
  title: "One Step, One Sitting",
  kicker: "Getting Started",

  sections: [
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
          text: "**57 steps sit after this one, and each is a single idea with a single question at the end,** and they run in the order the money does. Getting cash in and keeping it moving. Protecting it from [rates and currencies](https://corporatefinanceinstitute.com/resources/foreign-exchange/foreign-exchange-risk/). What it costs to borrow, and what to do with a surplus. Then the systems that actually move it between banks. A step is roughly five minutes, which makes an evening a real run of them.",
        },
        { type: "h2", text: "Three things worth knowing before you start" },
        {
          type: "ul",
          items: [
            "Every step ends with one question. Get it wrong and it tells you why the right answer is right, which is the point of it. Nothing is marked and nobody sees it.",
            "There is a note button at the end of each step. If something is confusing, too long or looks wrong, say so there. That is the fastest way to get a step rewritten, and it has already changed several.",
            "Your place is kept as you go, so you can stop mid-step and come back to the same spot on any device.",
          ],
        },
        {
          type: "p",
          text: "One habit is worth more than any of that. **When a step works an example, a kwacha figure through a method, work it yourself on paper before reading the answer.** Following a [[worked example|An example the step solves in front of you, every line visible. Its opposite is the unworked one: same method, fresh numbers, and you produce the answer.]] feels like understanding and is not: the exam hands you a blank page, and the only preparation for a blank page is a blank page.",
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
