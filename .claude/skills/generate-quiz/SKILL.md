---
name: generate-quiz
description: >
  Generates a 5-question Booklesss module quiz ready to post in Slack, plus a private
  answer key. Use this skill whenever the user wants to create, write, or generate a
  quiz for a module or topic. Also trigger when the user says things like "make the
  quiz for Module 1", "quiz time", "generate questions for working capital", or asks
  for questions based on module content. The quiz always follows the fixed Booklesss
  format: 2 definition questions, 2 ZMW calculation questions, 1 Zambian business
  scenario application question.
---

# generate-quiz

Generate a 5-question quiz for a Booklesss module, ready to post in Slack.

## How to trigger this skill
Type: `/generate-quiz` then specify:
- Course code and module number (e.g. BBF4302 Module 01)
- Either: the path to the notes markdown file, OR paste the module content directly

---

## What this skill does

1. Reads the module's content
2. Generates exactly 5 questions (required mix below)
3. Produces two outputs: **student-facing quiz** and **answer key**
4. Saves both to the correct `quizzes/` folder
5. Formats the student quiz ready to paste into Slack

---

## Required question mix (always this ratio)

| # | Type | What to ask |
|---|------|-------------|
| Q1 | Definition | "In 1–2 sentences, explain [key concept from module]." |
| Q2 | Definition | "What is the difference between [concept A] and [concept B]?" |
| Q3 | Calculation | Short worked example with ZMW figures provided. Student calculates one answer. |
| Q4 | Calculation | Slightly harder worked example. May have 2 steps. |
| Q5 | Application | Scenario: "Zambia [Company Name] is facing [situation]. What would you recommend and why?" |

---

## Writing rules

- **ZMW figures:** All calculation questions use Zambian Kwacha amounts and Zambian company names (e.g. Zambeef, ZESCO, Zanaco, Shoprite Zambia, First Quantum Minerals).
- **Difficulty:** Q1–Q2 are recall. Q3 is straightforward calculation. Q4 requires applying a formula with a twist. Q5 requires judgment.
- **No trick questions.** Questions test understanding, not gotchas.
- **Answer key:** Provide full working for Q3 and Q4. For Q5, provide a model answer (2–3 sentences).

---

## Output format

### STUDENT-FACING (post this in Slack)

```
📝 *Module [N] Quiz — [Module Title]*
*Course: [Course Code]*

Answer all 5 questions in this thread. Answer key drops in 48 hours.
Completing this quiz = *20 points* toward your leaderboard score. ✅

---

*Q1.* [Definition question]

*Q2.* [Definition question]

*Q3.* [Calculation question]
Given: [all figures the student needs]
Calculate: [what they need to find]

*Q4.* [Calculation question]
Given: [all figures]
Calculate: [answer required]

*Q5 — Application.*
[Scenario description]
Question: [What should they do/recommend?]

---
Reply in this thread with your answers. Tag your student number.
```

### ANSWER KEY (save locally, do NOT post)

```
# Answer Key — Module [N] Quiz

Q1: [Full answer]

Q2: [Full answer]

Q3:
Working:
[Step-by-step calculation]
Answer: [Final answer in ZMW]

Q4:
Working:
[Step-by-step calculation]
Answer: [Final answer]

Q5 Model Answer:
[2–3 sentence recommended answer]
```

---

## Save location

```
C:\Users\deeky\OneDrive\Desktop\Booklesss\[Course Folder]\quizzes\quiz_[NN]_[slug].md
```

Example: `Treasury Management\quizzes\quiz_01_introduction-to-tm.md`

The `quizzes/` folder maps directly to the `#[course]-quiz` Slack channel. Every file in `quizzes/` = one quiz posted in that channel.

The file should contain BOTH the student quiz and the answer key, separated clearly.

After saving, confirm: "Quiz saved. Post the student section to `#[course-code]-quiz`. Keep the answer key section private — post it in the same thread after 48 hours."
