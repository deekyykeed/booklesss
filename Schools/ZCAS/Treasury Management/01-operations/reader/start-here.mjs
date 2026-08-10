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
 * `intro-to-treasury`, three steps later, opens on exactly that and a reader
 * meeting the same hook twice learns that the course repeats itself
 * (W-13, C-8).
 *
 * 2026-08-08 — RETITLED under rule S-12 (debt D-17). Was 'Start here: what this course is for'.
 * The old name was sentence case and did not name the topic the way the paper does. The slug is
 * untouched, so no URL moved.
 *
 * 2026-08-09 — ONE-CHECKPOINT SPLIT (S-1 revised: one step = one concept = one
 * checkpoint; owner: "only one checkpoint per step"). This file held
 * 3 sections and now holds one: "The Case for Treasury Management". The other
 * section(s) moved to the-decisions-it-hands-you.mjs, one-step-one-sitting.mjs beside this file.
 * The slug is unchanged, so the URL that was linked to still opens here.
 */

export default {
  slug: "start-here-treasury",
  label: "The Case for Treasury Management",
  title: "The Case for Treasury Management",
  kicker: "Getting Started",

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
  ],
};
