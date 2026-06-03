# Booklesss — Pricing Strategy

**Last updated:** 2026-05-17

---

## Pricing Tiers

| Tier | Price | Slack seat type | What they get |
|------|-------|-----------------|---------------|
| **Free Trial** | K0 (1 month) | Single-channel guest | One course channel, free trial of Booklesss — no card required |
| **Notes** | K250/month | Single-channel guest | One course channel — lesson PDFs, discussion, past papers |
| **Community** | K500/month | Full paid member | All course channels, full Slack workspace, quizzes, everything |
| **Custom** | Negotiated | Full paid member | Personalized 1-on-1 tutoring, dedicated support, custom study plan |

**The funnel:** Free trial (1 month, one channel) → stay at K250 (one course, ongoing) → upgrade to K800 (full access) → Custom for students who need more.

Everyone starts with the free trial. No card, no commitment.

---

## Why this structure works

**K250 students cost you nothing on Slack.** Single-channel guests are free on Slack Pro — up to **5 guests per paid member**. So K250/month is 100% margin.

**K500 students are the only Slack cost.** Each full member is a paid Slack seat (K339/mo on Business+). Margin at K500: 32%.

**The guest ratio scales with paying members.** If you have 5 K500 students, you can host up to 25 K250 students at zero extra Slack cost.

---

## Cost Structure

| Cost | Amount | Notes |
|------|--------|-------|
| Slack Pro monthly | $8.75/user/mo | = K219/user at ZMW 25/$1 |
| Slack Pro annual | $7.25/user/mo | = K181/user — switch once 3+ paying full members |
| Single-channel guests | **K0** | Free on Pro, up to 5 per paid member |
| Gamma free tier | K0 | 400 AI credits/month |
| Google Sheets | K0 | Points tracking |
| Domain / Framer site | K0 | booklesss.framer.ai |

---

## Unit Economics

### K250/month (Notes tier — single-channel guest)

| Students | Revenue | Slack Cost | Net Profit | Margin |
|----------|---------|------------|------------|--------|
| 5 | K1,250 | K0 | K1,250 | 100% |
| 10 | K2,500 | K0 | K2,500 | 100% |
| 25 | K6,250 | K0 | K6,250 | 100% |

*Constrained by guest ratio: need 1 paid K500 member per 5 K250 guests.*

### K500/month (Community tier — full member)

| Students | Revenue | Slack Cost (Business+) | Net Profit | Margin |
|----------|---------|------------------------|------------|--------|
| 1 | K500 | K339 | K161 | 32% |
| 5 | K2,500 | K1,695 | K805 | 32% |
| 10 | K5,000 | K3,390 | K1,610 | 32% |
| 20 | K10,000 | K6,780 | K3,220 | 32% |

### Mixed cohort example (5 full + 25 notes)

| | Revenue | Slack Cost | Net Profit |
|---|---------|------------|------------|
| 5 × K500 | K2,500 | K1,695 | — |
| 25 × K250 | K6,250 | K0 | — |
| **Total** | **K8,750** | **K1,695** | **K7,055 (81%)** |

---

## Free Trial

**Every student starts here.** One month free, one course channel, no card required. After 30 days they choose: K250 (stay single-channel), K500 (go full), or leave.

Single-channel guests during free trial count against the guest ratio but cost nothing. Don't give free trial students full workspace access — one channel is enough to see the value.

**Funnel:** Free trial → WhatsApp follow-up at day 25 → convert to K250 or K500.

---

## Slack Guest Ratio

- **5 single-channel guests per paid active member** (Slack Pro rule)
- You (admin) count as 1 paid member — so baseline capacity is 5 free/K250 guests from day one
- Each K500 student you add unlocks 5 more guest slots
- Track this in `operations/workspace.md` — don't exceed the ratio or Slack will block new guests

---

## Staged Slack Plan

| Stage | Slack plan | When |
|-------|-----------|------|
| Now → first K500 conversion | Pro monthly ($8.75/user) | Keep cash flexible, minimal upfront |
| 3+ confirmed K500 students | Pro annual ($7.25/user) | Lock in 17% discount |
| 30+ students | Re-evaluate Business+ | Only if workflow runs or AI features become real bottlenecks |

---

## Revenue Targets

| Milestone | What it takes | Monthly Revenue |
|-----------|---------------|-----------------|
| Cover Slack (your seat) | 1 K500 student | K500 |
| K1,000 net/month | ~2 K500 + 3 K250 | K1,750 |
| K3,000 net/month | ~8 K500 + 8 K250 | K6,000 |
| K5,000 net/month | ~12 K500 + 12 K250 | K9,000 |

---

## What to track monthly

See `finance/monthly-tracker.md`
