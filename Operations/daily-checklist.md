# Booklesss — Daily Operations Checklist

Keep this open. Work top-to-bottom. Every item you skip today is a conversion you miss tomorrow.

> Prices, channels, and links referenced here must match `Operations/pricing-strategy.md` and `Operations/workspace.md` — if this file ever disagrees with those two, those two win.

---

## Every Day (15–30 min)

### Morning — Post a step
- [ ] Pick the next unposted step from any course (check course `_course.md` files in `Schools/`)
- [ ] Post the PDF directly to the WhatsApp group (full step, no teasing)
- [ ] In the same message: mention the Slack community as a place to discuss + ask questions
- [ ] Mention relevant Slack features naturally: channels by topic, searchable threads, no noise
- [ ] If you get DMs from the post → log in `Operations/leads.md`

### Morning — Slack
- [ ] Check all active channels for unanswered questions
- [ ] Reply to every question (even "good question — check Step X for the full answer")
- [ ] Acknowledge any new members who joined overnight

### Evening — Growth
- [ ] Did anyone DM you on WhatsApp today? → Log in `Operations/leads.md`
- [ ] Did any lead magnet reader join Slack? → Update `Operations/groups.md` → Joins column
- [ ] Did any guest upgrade to full member? → Update student count, note in `Operations/revenue-log.md`
- [ ] Check Tally inbox (tally.so/r/81Jejr) for new form submissions → send personalised WhatsApp DM within 24h → if they haven't joined Slack within 48h, nudge with invite link again

---

## Every Wednesday

- [ ] Drop the weekly quiz in the course's updates channel and tag the members
- [ ] Post reminder in any WhatsApp groups where you've been active this week

---

## Every Sunday

- [ ] Tally all points from the week (quiz scores + ✅ reactions + discussion contributions)
- [ ] Update the Google Sheet — master points tab
- [ ] Format and post the leaderboard at 7pm
- [ ] Post top 3 in any active WhatsApp groups as social proof ("Week N results — [name] took the top spot 🏆")

---

## Every Monday (Weekly Review — 30 min)

### Content pipeline
- [ ] Which steps are written and ready? Which are missing? (each course's `_course.md`)
- [ ] Write the next step if needed → **step-skill** in a Claude Code session
- [ ] New course to structure? → **lesson-skill**
- [ ] Any step ready to post to Slack? → post it, then mark it in `_course.md`

### Marketing
- [ ] Review `Operations/groups.md` — click rates, conversion rates per group
- [ ] Identify 3 new groups to post to this week
- [ ] Is the lead magnet still accurate? (pricing, offer, Slack link) → update if needed
- [ ] WhatsApp post template still converting? If CTR <5% → test a new hook

### Numbers
- [ ] How many full members on Slack right now?
- [ ] How many guests upgraded to full member this week?
- [ ] Revenue this month vs last month → `Operations/monthly-tracker.md`
- [ ] Slack cost this month (billing page) — still in margin?

---

## Content Status Tracker

Snapshot only — each course's `_course.md` is the source of truth. Last synced: **2026-06-11**.

### Treasury Management — BBF4302 (channels LIVE)

Full detail: `Schools/ZCAS/Treasury Management/_course.md`

| Step | Title | PDF | Slack Posted |
|------|-------|:---:|:---:|
| 1.1 | Introduction to Treasury Management | ✅ | — |
| 2.1 | Working Capital & Liquidity Management | ✅ | — |
| 2.2 | Inventory Management, EOQ & Creditor Mgmt | ✅ | — |
| 2.3 | Cash Management & Cash Flow Forecasting | ✅ | ✅ 2026-03-24 |
| 3.1 | Interest Rate Risk Management | ✅ | — |
| 3.2 | Foreign Exchange Risk Management | ✅ | — |
| 4.1 | Debt Management | ✅ | — |
| 4.2 | Investment Management | ✅ | — |
| 5.1 | Clearing & Settlement Systems | ✅ | — |
| 5.2 | Treasury Management Systems | ✅ | — |

**Next to post:** Step 1.1 → `#tm-operations` (start of the posting sequence)

### Strategic Management (channels LIVE)

Full detail: `Schools/ZCAS/Strategic Management/_course.md`

| Step | Title | PDF | Slack Posted |
|------|-------|:---:|:---:|
| 1.1 | Introduction to Corporate Strategy | ✅ | — |
| 1.2 | Vision, Mission & Objectives | ✅ | — |
| 2.1 | The External Environment | ✅ | — |
| 2.2 | The Internal Environment | ✅ | ✅ 2026-03-24 (as old "4.1") |
| 3.1 | Corporate Strategy | ✅ | — |
| 3.2 | Competitive Strategy | ✅ | — |
| 3.3 | Strategy Implementation | ✅ | — |

**Next to post:** Step 1.1 → `#sm-foundations`

### Corporate Finance — BAC4301 (channels NOT created — do not post)

Full detail: `Schools/ZCAS/Corporate Finance/_course.md`

Steps 1.1 and 1.2 are at v2 standard. Steps 1.3–5.1 need a v2 rebuild before posting. Create the 6 CF channels first, then update `Operations/workspace.md`.

### BBA 1110 — Business Administration (channels NOT created — do not post)

Full detail: `Schools/UNZA/BBA 1110 — Business Administration/_course.md`

Step 1.1 built. Steps 1.2–8.1 (8 steps) still to write with step-skill. Create the 9 BBA channels first, then update `Operations/workspace.md`.

---

## Marketing Status

| Channel | Asset | Last Drop | Clicks | Joins | Notes |
|---------|-------|-----------|--------|-------|-------|
| WhatsApp Groups | — | — | — | — | See `Operations/groups.md` |
| Personal status | — | — | — | — | — |
| Money flyer (print) | `Demand/Booklesss_Money_Flyer.pdf` | — | — | — | QR → booklesss.framer.ai |
| Video (to film) | Scripts + cue cards in `Demand/` | — | — | — | Full + short versions ready |

---

## Key Numbers to Know

Source of truth: `Operations/pricing-strategy.md`.

| Metric | Value |
|--------|-------|
| Notes tier (single-channel guest) | **K250/month** — guest seats are free on a paid Slack plan |
| Community tier (full member) | **K500/month** |
| Slack seat cost | ≈K219/user/mo (Pro monthly) · K339 (Business+) |
| Guest ratio | ~5 single-channel guests per paid member |
| Free trial | 1 month, one course channel, no card |
| Campaign budget | K10,000 |
| Flyer cost | K10/flyer |
| Referral commission | K50/signup (from campaign budget) |

---

## Tools

| Task | How |
|------|-----|
| Plan/structure a course | **lesson-skill** (Claude Code) |
| Write a step / any branded PDF | **step-skill** (Claude Code) |
| Web/landing page work | **design-system** (Claude Code) |
| Rebuild an existing PDF | `python3` the `build_*.py` next to it |
