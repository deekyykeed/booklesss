# Booklesss — Master Plan

**Last updated:** 2026-05-17

---

## What Booklesss Is

Slack-based edtech platform delivering branded PDF study materials for Zambian university finance/business courses. The core pipeline: source material → Python ReportLab script → PDF → posted to Slack channels.

**Active courses:** Strategic Management, Treasury Management (BBF4302), Corporate Finance (BAC4301 — all 10 PDFs written, CF Slack channels not yet created)
**Workspace:** bookless10.slack.com
**Website:** booklesss.framer.ai
**Sign-up form:** tally.so/r/81Jejr

---

## Pricing Model

### Three tiers

| Tier | Price | Slack type | Access |
|------|-------|------------|--------|
| **Free Trial** | K0 (1 month) | Single-channel guest | One course channel, no card |
| **Notes** | K250/month | Single-channel guest | One course channel ongoing |
| **Community** | K800/month | Full paid member | All channels, full workspace |
| **Custom** | Negotiated | Full paid member | Personalized 1-on-1 tutoring, custom study plan, dedicated support |

Everyone starts with the free trial. After 30 days: K250 (one course) or K800 (full access) or Custom.

### Why it works

- **K250 students cost K0 on Slack.** Single-channel guests are free on Slack Pro — up to **5 guests per paid member**. Pure margin.
- **K800 is the only Slack cost** (~K219/mo Pro monthly, K181/mo Pro annual). Margin: 73% monthly, 77% annual.
- **Guest ratio math:** 1 K800 student → 5 K250 guest slots. 5 K800 students → 25 guest slots.

### Slack plan stages

| Stage | Plan | Why |
|-------|------|-----|
| Now → first conversion | Pro monthly ($8.75/user) | No annual lock-in until revenue confirmed |
| 3+ paying K500 students | Pro annual ($7.25/user) | Lock in 17% discount |
| 30+ students | Re-evaluate Business+ | Only if specific features become bottlenecks |

---

## Onboarding Flow

**Funnel:** WhatsApp lead magnet → Tally form (tally.so/r/81Jejr) → auto-redirect to Slack invite → first lesson drops same day → WhatsApp follow-up within 24h.

### Tally form structure (5 pages)

**Page 1 — Welcome / sell**
- Headline: "Get one free month inside Booklesss"
- Sub: all lessons, past papers, live community, no card
- CTA: Start →

**Page 2 — You**
- Full name, WhatsApp (+260), university & year

**Page 3 — How you study**
- Study frequency, learning style, hardest CF topic, general study struggles

**Page 4 — Community fit**
- Features they want, how a community helps them

**Page 5 — Bonus (optional)**
- File upload: past papers, slides, notes (max 10MB — tell them to WhatsApp larger files)

**On submit:** redirect to `https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg`
Add one-liner above submit button: "On submit you'll go straight to Slack. Your first lesson is waiting. We'll WhatsApp you within 24h."

### Post-submission steps (per student)

1. Read submission in Tally — note their stated struggle
2. WhatsApp DM within 24h — personal welcome referencing what they said
3. If they haven't joined Slack within 48h — resend invite via WhatsApp
4. Any uploaded files → save to `courses/[Course]/community-material/[student-name]/`
5. Only log to `operations/leads.md` and `operations/revenue-log.md` once they pay

### Free trial → convert follow-up

At day 25 of trial: WhatsApp message. Give them a clear choice — K250 (keep one channel) or K800 (get everything). Keep it short and personal, not a broadcast.

---

## Guest Ratio Tracking

Slack Pro allows **5 single-channel guests per paid active member**. Track in `operations/workspace.md`.

- You (admin) = 1 paid seat → 5 guest slots from day one
- Each K500 student adds 5 more guest slots
- Do not exceed or Slack blocks new guests

---

## Course & Content Status

| Course | PDFs | Slack channels | Status |
|--------|------|----------------|--------|
| Treasury Management (BBF4302) | Written | Live | Active |
| Strategic Management | Written | Live | Active |
| Corporate Finance (BAC4301) | All 10 written | **NOT YET CREATED** | Do not post CF content until channels exist |

---

## Outstanding items

- [ ] Create CF Slack channels, update `operations/workspace.md` with channel IDs
- [ ] Drop WhatsApp message in CF group once channels are live
- [ ] Fix website pricing page (currently shows USD Prodo template copy — needs K250/K500/Custom)
- [ ] Fix homepage: pricing numbers, page meta title, "20+ Content" broken stat, CF listed as live (channels don't exist yet)
- [ ] Fix /contact page intro (still says "Prodo")
- [ ] Decide what to do with /blogs and /changelog (both fully unedited Prodo template)
- [ ] Fix or remove broken footer links (/about-us, /career, /legals — returning 404)
- [ ] Monitor Tally form — check if pages 3/4 are losing people

---

## Key Reference Files

| File | Purpose |
|------|---------|
| `Finances/pricing-strategy.md` | Full pricing math, unit economics, margins |
| `operations/workspace.md` | Slack config, channel names, invite links |
| `operations/daily-checklist.md` | Operational cadence |
| `operations/leads.md` | Student conversions (paid only) |
| `operations/revenue-log.md` | Revenue tracking |
| `operations/groups.md` | WhatsApp group marketing stats |
| `courses/[Course]/_course.md` | Step status per course |

---

## Writing style rules (enforced everywhere)

Banned words: "tapestry", "nuance", "multifaceted", "robust", "delve", "foster", "Furthermore", "It's worth noting", "landscape", "journey", "empower", "leverage" (verb), "game-changer", "seamless", "holistic", "synergy".

All examples use ZMW and Zambian companies (Zanaco, Zambeef, ZESCO, First Quantum).
