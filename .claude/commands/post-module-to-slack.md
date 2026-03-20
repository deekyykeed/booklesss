# /post-module-to-slack

Post a completed Booklesss module to the correct Slack channel in the standard format.

## How to trigger this skill
Type: `/post-module-to-slack` then provide:
- Course code (e.g. BBF4302)
- Module number (e.g. 01)
- Module title (e.g. Introduction to Treasury Management)
- Gamma URL (the public link)
- 3–4 key concepts covered (bullet points)

---

## What this skill does

1. Formats the standard Booklesss module announcement message
2. Sends it to the correct `#[course-code]-notes` Slack channel
3. Confirms the post and reminds you to update the Canvas index

---

## Standard message format

```
*Module [N] — [Module Title]* is now live. 📚

[One sentence: what this module covers and why it matters for the exam.]

👉 *View the deck:* [Gamma URL]

*What's covered:*
• [Key concept 1]
• [Key concept 2]
• [Key concept 3]
• [Key concept 4]

After reading, head to *#[course-code]-quiz* for the Module [N] quiz — earn *20 points* for completing it. 🏆
```

---

## Channel routing

| Course | Notes channel | Quiz channel |
|--------|--------------|-------------|
| BBF4302 Treasury Management | #bbf4302-notes | #bbf4302-quiz |
| BAC4301 Corporate Finance | #bac4301-notes | #bac4301-quiz |
| Strategic Management | #strategic-mgmt-notes | #strategic-mgmt-quiz |

---

## After posting

Remind the user:
1. Update the Canvas module index in the notes channel — add: Module # | Title | Gamma URL | Quiz Status (Open) | Points (20)
2. Generate the quiz next using `/generate-quiz`
