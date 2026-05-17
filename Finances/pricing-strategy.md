# Booklesss — Pricing Strategy

**Last updated:** 2026-05-17

---

## Pricing Tiers

| Tier | Price | Slack seat type | What they get |
|------|-------|-----------------|---------------|
| **Free Trial** | K0 (1 month) | Single-channel guest | One course channel, free trial of Booklesss — no card required |
| **Notes** | K250/month | Single-channel guest | One course channel — lesson PDFs, discussion, past papers |
| **Community** | K800/month | Full paid member | All course channels, full Slack workspace, quizzes, everything |
| **Custom** | Negotiated | Full paid member | Personalized 1-on-1 tutoring, dedicated support, custom study plan |

**The funnel:** Free trial (1 month, one channel) → stay at K250 (one course, ongoing) → upgrade to K800 (full access) → Custom for students who need more.

Everyone starts with the free trial. No card, no commitment.

---

## Why this structure works

**K250 students cost you nothing on Slack.** Single-channel guests are free on Slack Pro — up to **5 guests per paid member**. So K250/month is 100% margin.

**K800 students are the only Slack cost.** Each full member is a paid Slack seat (~K219/mo on Pro monthly, K181/mo on Pro annual). Margin at K800: 73% monthly, 77% annual.

**The guest ratio scales with paying members.** If you have 5 K800 students, you can host up to 25 K250 students at zero extra Slack cost.

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

### K800/month (Community tier — full member)

| Students | Revenue | Slack Cost (Pro monthly) | Net Profit | Margin |
|----------|---------|--------------------------|------------|--------|
| 1 | K800 | K219 | K581 | 73% |
| 5 | K4,000 | K1,095 | K2,905 | 73% |
| 10 | K8,000 | K2,190 | K5,810 | 73% |
| 20 | K16,000 | K4,380 | K11,620 | 73% |

### Mixed cohort example (5 full + 25 notes)

| | Revenue | Slack Cost | Net Profit |
|---|---------|------------|------------|
| 5 × K800 | K4,000 | K1,095 | — |
| 25 × K250 | K6,250 | K0 | — |
| **Total** | **K10,250** | **K1,095** | **K9,155 (89%)** |

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
| Cover Slack (your seat) | 1 K800 student | K800 |
| K1,000 net/month | ~3 K800 + 5 K250 | K3,650 |
| K3,000 net/month | ~6 K800 + 20 K250 | K9,800 |
| K5,000 net/month | ~10 K800 + 30 K250 | K15,500 |

---

## What to track monthly

See `finance/monthly-tracker.md`
