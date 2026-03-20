---
name: booklesss-write
description: >
  The single writing skill for all Booklesss content. Use whenever the user wants
  to write, create, or generate lesson notes, study steps, or a web deck for any
  course or topic. Triggers on: "write the notes for Step X", "do Lesson 2",
  "next step", "let's do working capital", "write step 3", or any request to
  turn raw PPT/PDF content into student-friendly notes.
  This skill handles the full content pipeline: reading source material →
  rewriting in plain English → structuring as a markdown deck → humanizing all
  copy → saving the file → generating the HTML deck via md_to_deck.py.
  The humanizer is built in — never run a separate humanizer pass for notes content.
  Always output complete files. Never truncate, never use placeholders.
---

# booklesss-write

One skill. Full content pipeline — notes, humanizing, deck generation.

---

## Terminology

| Term | Meaning |
|------|---------|
| **Course** | Full subject, e.g. BBF4302 Treasury Management |
| **Lesson** | Group of related steps, maps to one Slack channel |
| **Step** | One HTML deck. One `.md` file, one web presentation, one Slack post |
| **Card** | One slide within a step. Each `##` heading = one card |

---

## File naming and save location

`[lesson]_[step]_[slug].md` inside the lesson's `notes/` folder.

```
courses/[Course Folder]/lesson-0[N]-[name]/notes/[lesson]_[step]_[slug].md
```

Examples:
- `lesson-01-foundations/notes/1_1_introduction-to-tm.md`
- `lesson-02-liquidity/notes/2_1_working-capital-liquidity.md`
- `lesson-03-risk/notes/3_1_interest-rate-risk.md`

---

## After saving — always generate the HTML deck

Run immediately after saving the `.md` file:

```bash
python3 _dev/scripts/md_to_deck.py "[path to .md file]"
```

This produces `web/[course]/[slug].html` — the shareable link to post in Slack.
Report the output URL to the user.

---

## Markdown format reference

| Syntax | Renders as |
|--------|-----------|
| `## Title` | New card — always include space after `##` |
| `### Sub-heading` | H3 within a card — for named sections |
| `- item` | Bullet list |
| `1. item` | Numbered list |
| `**bold**` | Bold — for emphasis on words/phrases only |
| `*italic*` | Italic |
| `\| table \|` | Table |
| `***` | **Card split** — on its own line between every card |
| `> text` | Blockquote |
| `[label](url)` | Clickable link. CTA labels (Join, Click, Get started) render as buttons |

**Callout boxes** — use these slash-style markers, they render in the HTML deck:
| Marker | Renders as |
|--------|-----------|
| `/warning text` | Orange warning box |
| `/info text` | Blue info box |
| `/success text` | Green success box |
| `/note text` | Amber note box |
| `/caution text` | Orange caution box |

---

## Output format

Every notes file begins with this header block:

```
# Deck — [Lesson].[Step]: [Title]
**Deck URL:** [leave blank — paste after publishing]
**Course:** [Course code] [Course name]
**Last updated:** [today's date]
---
```

Then the deck content:

```markdown
## [Concept name only — no "Lesson X" prefix]
[Course code] [Course name]

[One sentence: what this step is about and why it matters]

***

## [Card 2 — first concept]

[Plain English explanation. No labels, no "Title:", "Body:". Just text.]

### [Sub-section if needed]
[Content...]

/info [Key fact or definition that students must know]

***

## [Worked Example card — if calculations exist]

### [Company name] — Example

| Item | Value | Calculation | Result |
|------|-------|------------|--------|
| ... | ... | ... | ... |

/success [Key conclusion or exam answer]

***

[8–10 cards total]

## Key Terms

| Term | Definition |
|------|-----------|
| [Term] | [Definition] |

***

## What You Should Now Be Able To Do

1. [Outcome 1]
2. [Outcome 2]
3. [Outcome 3]
4. [Outcome 4]
5. [Outcome 5]

**Next: [Lesson].[Step+1] — [Title]**
```

---

## Writing rules

- **Title card:** Concept name only. No "Lesson X —" prefix. `## Working Capital & Liquidity Management` not `## Lesson 2 — Working Capital`.
- **No labels.** Never write `**Title:**`, `**Body:**`, `**Key point:**`. Just write the content.
- **Spaces after `##`.** Always `## Title` never `##Title`.
- **`***` between every card.** On its own line, after every card's content.
- **`###` for named sections.** If a card has distinct named sections (e.g. Centralised / Decentralised), those are `###` not bold text.
- **Examples use ZMW and Zambian companies:** Zanaco, Zambeef, ZESCO, First Quantum, Mutengo.
- **Formulas always have a worked example card.** Show each calculation step.
- **8–10 cards per step.** Split if dense, combine if thin.
- **Last card is always learning outcomes.** 5–6 numbered outcomes.
- **Next step reference:** `**Next: 2.2 — Inventory, EOQ & Creditor Management**`

---

## Humanizer — baked in (apply while writing, not after)

Do not write AI-sounding content in the first place. Apply these rules as you write.

### Banned words and phrases
Do not use these anywhere in notes or lead magnet copy:

`tapestry` `nuance` `multifaceted` `robust` `delve` `foster` `showcase` `underscore` `highlight` (as verb) `pivotal` `crucial` `vital` `groundbreaking` `vibrant` `rich` (figurative) `nestled` `testament` `interplay` `landscape` (abstract) `additionally` `furthermore` `moreover` `it's worth noting` `it is important to note` `in order to` `due to the fact that` `at this point in time`

### Banned patterns
- **Em dash overuse** — one per document maximum. Use commas or periods instead.
- **Rule of three** — do not force three examples/points unless there are naturally three.
- **Negative parallelism** — no "It's not just about X, it's about Y."
- **Promotional language** — no "groundbreaking", "game-changing", "revolutionary" in copy.
- **Vague attribution** — no "experts say", "research shows", "industry observers note". Name the source or cut it.
- **Sycophantic openers** — no "Great question!", "Certainly!", "Of course!".
- **Generic conclusions** — no "the future looks bright", "exciting times ahead".
- **Inline-header lists** — no `**Speed:** The speed is fast.` style bullets. Write prose or use clean bullets without bold headers.
- **Copula avoidance** — write "is" not "serves as", "stands as", "functions as".
- **Emoji in body copy** — banned entirely.

### Tone target
Direct, confident, student-to-student. Like a classmate who studied harder than you sharing what they know. Not a textbook. Not a chatbot. Not a press release.

**Before:**
> Working capital management is a crucial aspect of treasury management that highlights the importance of maintaining adequate liquidity levels to ensure operational continuity.

**After:**
> Working capital is the cash a business has available to run day-to-day. Too little and suppliers don't get paid. Too much and money is sitting idle when it could be earning.

### Final anti-AI check (do before saving)
Before saving any file, ask: *"What would make this obviously AI-generated?"*
If any patterns remain, fix them. Common culprits: even paragraph lengths, no opinions or reactions, every sentence makes a complete point, no variation in sentence length.

---

## Output completeness rule

Every file must be complete. No truncation, no `[continue pattern]`, no `[add more content here]`.
If a step is long and the file might hit context limits, write up to a clean card boundary and report:
```
[PAUSED — X of Y cards complete. Send "continue" to resume from: [next card title]]
```
On "continue" — pick up exactly where you stopped. No recap.
