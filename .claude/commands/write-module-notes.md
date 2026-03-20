# /write-module-notes

Write a complete Gamma-ready markdown file for a Booklesss step.

## How to use
Type: `/write-module-notes` then specify:
- Course code (e.g. BBF4302)
- Lesson number and step number (e.g. Lesson 2, Step 2)
- Step title (e.g. Inventory Management & EOQ)
- Source: paste raw PPT text directly, OR provide file path to the PPT/PDF

---

## Terminology

- **Course** — the full subject (e.g. BBF4302 Treasury Management)
- **Lesson** — a grouping of related steps. Maps to one Slack channel.
- **Step** — one Gamma deck. One file, one Gamma presentation, one Slack post.
- **Card** — one slide within a step. Each `##` heading = one card.

---

## File naming and save location

```
C:\Users\deeky\OneDrive\Desktop\Booklesss\[Course Folder]\lesson-0[N]-[lesson-name]\notes\[lesson]_[step]_[slug].md
```

Examples:
- `lesson-01-foundations\notes\1_1_introduction-to-tm.md`
- `lesson-02-liquidity\notes\2_1_working-capital-liquidity.md`
- `lesson-02-liquidity\notes\2_2_inventory-creditor-management.md`
- `lesson-03-risk\notes\3_1_interest-rate-risk.md`

---

## Gamma formatting — complete reference

| Markdown | What Gamma renders |
|----------|-------------------|
| `## Card Title` | **New card** — always include space after `##` |
| `### Sub-heading` | H3 heading within a card — use for major named sections |
| `#### Sub-sub-heading` | H4 heading within a card |
| `- item` | Bulleted list |
| `1. item` | Numbered list |
| `**bold**` | Bold — words/phrases only, never for section labels |
| `*italic*` | Italic text |
| `\| table \|` | Table |
| `---` | Divider LINE within a card (not a card split) |
| `***` | **Split card here** — own line between every card |
| `> text` | Blockquote |

**Gamma slash commands — add manually in Gamma, note in file as `> VISUAL`:**

| Slash command | What it creates |
|--------------|----------------|
| `/columns` | 2–4 column layout |
| `/warning` | Orange warning box |
| `/info` | Blue info box |
| `/note` | Grey note box |
| `/success` | Green success box |
| `/question` | Purple question box |
| Smart diagrams | Semi circle, Arch, Leaf, Semi circle road, Alternating boxes |

Visual callout format:
```
> VISUAL [/warning]: Text for the warning box.
> VISUAL [/columns — 3 columns]: Column 1: X. Column 2: Y. Column 3: Z.
> VISUAL [Smart diagram — Semi circle road]: Labels for each layer.
```

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

## [Concept Title — no "Lesson X" prefix, just the topic name]
[Course code] [Course name]

[One sentence: what this step is about and why it matters]

***

## [Card 2 title]

[Content. No labels. Just text.]

### [Sub-section A]
[Content...]

### [Sub-section B]
[Content...]

> VISUAL [/command]: [Instructions for the human]

***

## [Card 3 title]

[Content...]

***

## Key Terms

| Term | Definition |
|------|-----------|
| [Term] | [Definition] |

***

## What You Should Now Be Able To Do

By the end of this step, you should be able to:

1. [Outcome 1]
2. [Outcome 2]
3. [Outcome 3]
4. [Outcome 4]
5. [Outcome 5]

**Next: [Lesson].[Step+1] — [Next step title]**
```

---

## Writing rules

- **Title card:** First card = concept name only. No "Lesson X —" prefix. `## Working Capital & Liquidity Management` not `## Lesson 2 — Working Capital`.
- **No labels.** Never write `**Title:**`, `**Body:**`, `**Subtitle:**`. Just the text.
- **Spaces after `##` and `###`.** Always: `## Title` not `##Title`. `### Sub` not `###Sub`.
- **`***` between every card** — on its own line, after each card's content.
- **`###` for named sub-sections within a card** — not bold text. If a card has Centralised / Decentralised / Hybrid, or Aggressive / Moderate / Conservative — those are `###` headings.
- **`**bold**` for word/phrase emphasis only** — never to label a section.
- **Tone:** Plain English. Student-friendly. No jargon without explanation.
- **Examples:** Always ZMW figures and Zambian companies — Zanaco, Zambeef, ZESCO, First Quantum, Mutengo.
- **Worked examples:** Show every step of the calculation labelled clearly.
- **Visual callouts:** Use `> VISUAL [/command]:` only when a visual genuinely adds something.
- **Last card:** Always "What You Should Now Be Able To Do" with 5–6 outcomes.
- **Length:** 8–10 cards per step.
- **"Next" link:** `**Next: [Lesson].[Step] — [Title]**` e.g. `**Next: 2.2 — Inventory, EOQ & Creditor Management**`
