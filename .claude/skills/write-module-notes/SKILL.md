---
name: write-module-notes
description: >
  Writes a complete Gamma-ready markdown notes file for a Booklesss study step.
  Use this skill whenever the user wants to write, create, or generate lesson notes,
  study notes, lecture notes, or a Gamma deck for any course or topic. Also trigger
  when the user says things like "write the notes for Step X", "do Lesson 2", "next step",
  "let's do working capital", or provides raw PPT/PDF content and wants it turned into
  student-friendly notes. This skill handles the full Booklesss content pipeline: reading
  source material, rewriting it in plain English, structuring it as a Gamma slide deck in
  markdown, and saving it to the correct lesson folder.
---

# write-module-notes

Write a complete Gamma-ready markdown file for a Booklesss step.

## How to trigger this skill
Specify:
- Course code (e.g. BBF4302)
- Lesson number and step number (e.g. Lesson 2, Step 2)
- Step title (e.g. Inventory Management & EOQ)
- Source: either paste raw PPT text directly, OR provide the file path to the PPT/PDF

---

## Terminology

- **Course** — the full subject (e.g. BBF4302 Treasury Management)
- **Lesson** — a grouping of related steps, maps to one Slack channel (e.g. lesson-02-liquidity)
- **Step** — one Gamma deck. One file, one Gamma presentation, one Slack post. Each step has multiple cards inside it.
- **Card** — one slide within a step. Each `##` heading = one card.

---

## File naming and save location

Files are named `[lesson]_[step]_[slug].md` and saved inside the lesson's `notes/` subfolder.

```
C:\Users\deeky\OneDrive\Desktop\Booklesss\[Course Folder]\lesson-0[N]-[lesson-name]\notes\[lesson]_[step]_[slug].md
```

Examples:
- `lesson-01-foundations\notes\1_1_introduction-to-tm.md`
- `lesson-02-liquidity\notes\2_1_working-capital-liquidity.md`
- `lesson-02-liquidity\notes\2_2_inventory-creditor-management.md`
- `lesson-03-risk\notes\3_1_interest-rate-risk.md`

The lesson folder maps directly to a Slack channel. The step file maps to one post in that channel.

After saving, confirm: "Saved to `[path]`. Now create the Gamma deck using this content, then paste the URL into the **Gamma URL** field at the top of the file."

---

## Gamma formatting — complete reference

Every notes file is a paste-ready markdown document. Gamma reads it like this:

| Markdown | What Gamma renders |
|----------|-------------------|
| `## Card Title` | **New card (step)** — always include the space after `##` |
| `### Sub-heading` | H3 heading within a card — use for major sections |
| `#### Sub-sub-heading` | H4 heading within a card |
| `- item` | Bulleted list |
| `1. item` | Numbered list |
| `**bold**` | Bold — for emphasis on words/phrases only, never for section labels |
| `*italic*` | Italic text |
| `\| table \|` | Table (renders natively) |
| `---` | Horizontal divider LINE within a card (not a card split) |
| `***` | **Split card here** — place on its own line between every card |
| `> text` | Blockquote |

**Gamma slash command blocks** — these cannot be pasted as markdown. They must be added manually in Gamma using `/`. Note them in the file using `> VISUAL [/command]:` so the human knows where to add them:

| Slash command | What it creates | Use for |
|--------------|----------------|---------|
| `/columns` | 2, 3, or 4 column layout | Side-by-side comparisons |
| `/table` | Clean table block | Data with more control than markdown |
| `/warning` | Orange warning box | Exam traps, risks, "watch out" moments |
| `/info` | Blue info box | Key definitions, must-know facts |
| `/note` | Grey note box | Supplementary context |
| `/success` | Green success box | Key takeaways, "this is what examiners want" |
| `/question` | Purple question box | Self-check questions |
| `/diagram` | Blank diagram canvas | Custom diagrams drawn in Gamma |
| Smart diagrams | Semi circle, Arch, Leaf, Semi circle road, Alternating boxes | Hierarchies, cycles, comparisons |

**Visual callout format in notes files:**
```
> VISUAL [/columns — 3 columns]: Column 1: [content]. Column 2: [content]. Column 3: [content].
> VISUAL [/warning]: Warning text to add here.
> VISUAL [Smart diagram — Semi circle]: Three layers: top = X, middle = Y, bottom = Z.
```
These lines are instructions to the human — they are NOT pasted into Gamma.

---

## Output format

```
# Gamma Slide Deck — [Lesson].[Step]: [Title]
**Gamma URL:** [leave blank — paste after publishing]
**Course:** [Course code] [Course name]
**Last updated:** [today's date]

---
PASTE INTO GAMMA FROM THE NEXT LINE DOWNWARD.
Each ## creates a new card. ### is a sub-heading within a card.
Lines starting with > VISUAL are your instructions — do NOT paste them.
---

## [Concept Title — no "Lesson X" prefix, just the topic]
[Course code] [Course name]

[One sentence: what this step is about and why it matters]

***

## [Card 2 title — first core concept]

[Plain English explanation. Just the text — no "Title:", "Body:" or any other labels.]
[Use ### for major sub-sections. Use **bold** only for emphasis on words/phrases.]

### [Sub-section A]
[Content...]

### [Sub-section B]
[Content...]

> VISUAL [/slash-command]: [Instructions for any visual block to add manually in Gamma]

***

## [Card 3 title]

[Content...]

***

[Continue for all cards — typically 8–10 cards per step]

## Key Terms

| Term | Definition |
|------|-----------|
| [Term] | [Definition] |

***

## What You Should Now Be Able To Do

By the end of this step, you should be able to:

1. [Learning outcome 1]
2. [Learning outcome 2]
3. [Learning outcome 3]
4. [Learning outcome 4]
5. [Learning outcome 5]

**Next: [Lesson].[Step+1] — [Next step title]**
```

---

## Writing rules

- **Title card:** The first card opens with the concept name only — no "Lesson X —" prefix. Example: `## Working Capital & Liquidity Management`, not `## Lesson 2 — Working Capital`.
- **No labels.** Never write `**Title:**`, `**Body:**`, `**Subtitle:**`. Just write the text directly.
- **`##` for every card title.** Always include the space: `## Title Not ##Title`. Add `***` on its own line after each card's content, before the next `##`.
- **`###` for major sub-sections within a card.** If a card has distinct named sections (e.g. Centralised / Decentralised / Hybrid, or Aggressive / Moderate / Conservative), those headings must be `###` not bold text. Bold is only for emphasis on a word or short phrase.
- **Heading hierarchy within cards:**
  - `## Title` — card title
  - `### Sub-heading` — major named sections within a card
  - `#### Sub-sub-heading` — smaller breakdowns if needed
  - `**bold**` — emphasis on a word or phrase only
- **Tone:** Clear, direct, student-friendly. Plain English. No jargon without explanation.
- **Examples:** Use ZMW figures and Zambian companies (Zanaco, Zambeef, ZESCO, First Quantum, Mutengo) in all worked examples.
- **Formulas:** If the step has calculations, include a worked example card showing each step of the calculation.
- **Visual callouts:** Use `> VISUAL [/command]:` format. Only add them when a visual genuinely helps.
- **Last card:** Always "What You Should Now Be Able To Do" with 5–6 numbered outcomes.
- **Length:** 8–10 cards per step. Split into multiple steps if dense, combine if thin.
- **"Next" link:** Reference the next step as `[Lesson].[Step] — [Title]` e.g. `**Next: 2.2 — Inventory, EOQ & Creditor Management**`
