---
name: booklesss-write
description: >
  The single writing skill for all Booklesss content. Use whenever the user wants
  to write, create, or generate lesson notes for any course or topic.
  Triggers on: "write the notes for Step X", "do Lesson 2", "next step",
  "let's do working capital", "write step 3", or any request to turn raw
  PPT/PDF/PPTX source content into student-friendly lesson PDFs.
  This skill handles the full content pipeline: reading source material →
  writing content directly into a ReportLab Python script → running it to
  produce the PDF. No markdown files. No intermediate formats. PDFs only.
  The humanizer is built in — never run a separate humanizer pass.
  Always produce complete, runnable scripts. Never truncate.
---

# booklesss-write

One skill. Full content pipeline — source material in, PDF out.

---

## Before you start — required inputs

Before writing any lesson, confirm these two things if not already provided:

1. **Which lesson/step is this?** (e.g. Step 1.1 — Introduction to Treasury Management)
2. **What is the Slack channel link for this lesson?**
   Check `operations/workspace.md` for all saved channel links.
   This is embedded as a button in the PDF — it is not optional.

If the channel link is missing, ask:
> "What's the Slack channel link for this lesson? It goes into the PDF as a discussion button."

---

## Terminology

| Term | Meaning |
|------|---------|
| **Course** | Full subject, e.g. BBF4302 Treasury Management |
| **Lesson** | A topic group mapped to one Slack channel (e.g. lesson-07-interest-rate-risk) |
| **Step** | One PDF document. One Slack post. e.g. Step 1.1, Step 2.3 |
| **Section** | One content block within a step PDF, separated by a heading + hairline |

---

## Workflow — PDF direct (no markdown)

```
1. Read source files from courses/[Course]/_source/
2. Plan the step content (sections, examples, tables, callouts)
3. Invoke booklesss-pdf skill — write the Python script directly
4. Run: python3 _dev/scripts/build_[course]_[step].py
5. Confirm PDF output path to user
```

No .md files. No intermediate formats. The script IS the content.

---

## Output location

```
courses/[Course]/content/[lesson-folder]/[step-slug]_v1.pdf
```

Examples:
- `courses/Treasury Management/content/lesson-01-treasury-foundations/1_1_introduction-to-tm_v1.pdf`
- `courses/Treasury Management/content/lesson-07-interest-rate-risk/7_1_interest-rate-risk_v1.pdf`

Scripts live in:
```
_dev/scripts/build_[course-code]_[step]_[slug].py
```

---

## Content structure — what goes in every step

Every lesson step PDF contains these sections, in order:

1. **Cover** — course code, step number, title, Booklesss branding
2. **Core concept sections** (4-7 sections) — one per major concept, with eyebrow tag + heading + body + callouts/tables as needed
3. **Discussion question × 2** — genuine thought questions embedded mid-content (see Community CTA rules below)
4. **Worked example** (if calculations exist) — ZMW, Zambian companies
5. **Key Terms table** — two columns, all terms from the step
6. **Learning Outcomes** — 5-6 numbered outcomes
7. **Community closer** — soft 2-line paragraph at the end (see Community CTA rules below)

---

## Community CTA rules — no pushy buttons

The PDF is read by strangers (WhatsApp) and existing members. The CTA must work for both without feeling like a pitch.

### Two discussion questions (mid-content)
Embed two genuine thought questions within the content — one mid-way, one near the end. These are real questions worth thinking about, not CTAs dressed as questions. They should:
- Arise naturally from the material just covered
- Have no obvious single answer — require actual thinking
- Not say "bring this to the channel" or "discuss below" — just ask the question

Style: italic, light green left-bar box. Tone: a classmate asking something they genuinely want to think through.

### Community closer (end of document — replaces channel button)
Two short paragraphs after Learning Outcomes. No button. No all-caps. No pricing.

**Paragraph 1:** Name the channel and describe what happens there in one sentence. Example:
> "This is one step in the [Course] series running in the Booklesss study group. The channel for this topic is #[channel-name] — that's where students going through [course code] are working through this material together."

**Paragraph 2:** One line. Works for strangers and existing members.
> "If you're already there, you know where to find it. If not, [join the group here.](INVITE_URL)"

**Link rules:**
- Always use the **invite link** (`INVITE_URL`) — not the channel archive link. The invite works for both strangers (join flow) and existing members (redirects to workspace).
- Invite link: `https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg`
- Hide the URL behind anchor text — never show the raw URL. Use "join the group here" or "the study group" as the visible text.
- Channel archive links (e.g. `https://bookless10.slack.com/archives/C0AN3UPFG2G`) go in the script as comments only — for reference, not for display.

---

## Writing rules

- Write in plain English. No textbook voice. No chatbot voice.
- Short sentences. Vary length. Some punchy one-liners, some longer explanations.
- No labels in running text: never write "Title:", "Body:", "Key point:" inline.
- ZMW examples use Zambian companies: Zanaco, Zambeef, ZESCO, First Quantum, Mutengo.
- Formulas always get a worked example with step-by-step calculations.
- Every section has an eyebrow tag (see booklesss-pdf skill for spec).
- Invoke booklesss-pdf skill for all PDF generation — that skill owns the design.

---

## Humanizer — baked in (apply while writing, not after)

### Banned words
`tapestry` `nuance` `multifaceted` `robust` `delve` `foster` `showcase`
`underscore` `highlight` (verb) `pivotal` `crucial` `vital` `groundbreaking`
`vibrant` `rich` (figurative) `nestled` `testament` `interplay`
`landscape` (abstract) `additionally` `furthermore` `moreover`
`it's worth noting` `it is important to note` `in order to`
`due to the fact that` `at this point in time`

### Banned patterns
- Em dash overuse — one per document maximum
- Rule of three — don't force three points unless there are naturally three
- Negative parallelism — no "It's not just X, it's Y"
- Vague attribution — no "experts say", "research shows"
- Sycophantic openers — no "Great question!", "Certainly!"
- Generic conclusions — no "the future looks bright"
- Inline bold headers — no `**Speed:** The speed is fast.` style
- Copula avoidance — write "is" not "serves as", "stands as"
- Emoji in body copy — banned

### Tone
Direct, confident, peer-to-peer. Like a classmate who studied harder than you sharing what they know. Not a textbook. Not a press release.

**Before:**
> Working capital management is a crucial aspect of treasury management that highlights the importance of maintaining adequate liquidity levels to ensure operational continuity.

**After:**
> Working capital is the cash a business has available to run day-to-day. Too little and suppliers don't get paid. Too much and money is sitting idle when it could be earning.

---

## WhatsApp caption — always output after generating the PDF

Every time a PDF is generated, output a ready-to-copy WhatsApp caption immediately after confirming the PDF path. This is the one-liner Deeky pastes as the message text when sending the PDF.

**Format:** One sentence. 15 words max. No emoji. No exclamation marks. No "join", "subscribe", or pricing.

**Formula:** `[Subject] [topic] — [what's inside in plain terms]. Free.`

**Examples:**
- `Working capital notes — cash conversion cycle, debtor management, and factoring. Free.`
- `Strategic Management notes — PESTEL, Porter's Five Forces, and how to apply them. Free.`
- `Interest rate risk notes — hedging methods, FRAs, and swaps with worked examples. Free.`

**Rules:**
- No course codes — nobody outside the lecturer's office knows what BBF4302 means
- Use the subject name, not the code: "Treasury Management" or just the topic itself
- Worked examples and Zambian companies are in the content — don't call them out in the caption. Let readers discover them.
- "Free." at the end is intentional — it removes hesitation without selling anything
- Output it as a plain code block so Deeky can copy-paste without formatting

---

## Completeness rule

Scripts must be complete and runnable. No truncation, no placeholders, no `# add content here`.
If the step is very long and context is running low, stop at a clean section boundary and report:
```
[PAUSED — sections 1-4 complete. Script written to _dev/scripts/build_[x].py.
Send "continue" to add sections 5 onwards.]
```
