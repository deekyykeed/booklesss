# Booklesss — Marketing Budget & Implementation Plan

**Written:** 2026-07-05
**Exchange rate used:** K25 / $1 (same as `pricing-strategy.md` — adjust if the kwacha moves)
**Goal:** first paying students. Everything else (tutors, investors) unlocks from that.

---

## The one rule of this plan

**No ad money moves until the funnel is honest.** The README red flags are not
cosmetic — an ad click that lands on a website advertising an expired offer, a
form with no free-trial option, and an invite link to a dead Slack workspace is
money set on fire. Phase 0 costs K0 and comes first.

---

## What things actually cost (checked 2026-07-05)

| Item | Cost | Verdict |
|---|---|---|
| WhatsApp Business **app** (green storefront profile, catalog, quick replies) | **K0** | Do now. This is all the "verification" you need at this stage. |
| Meta Verified for WhatsApp (blue badge) | **$14.99+/mo (~K375/mo)**, first-12-months rate | Skip until revenue. A badge doesn't convert a student; a good PDF does. |
| WhatsApp Business API / Cloud API | Free tier exists, per-message fees after | Not needed until you're messaging hundreds of leads. |
| Facebook page + Instagram business account + TikTok account | **K0** | Do now. |
| **Meta ads** (Facebook + Instagram + Messenger from one campaign) | Minimum **$1/day**; Africa average CPC ≈ **$0.24 (~K6/click)** | This is where the paid budget goes. Cheapest paid reach available to you. |
| **TikTok Ads Manager** | Minimum **$20/day per ad group, $50/day per campaign** (~K13,500+/mo) | **Out of budget. Do not open Ads Manager.** |
| TikTok **Promote** (in-app boost) | From **~$3/day (~K75/day)** | Only for boosting a video that already performs organically. |
| Slack Pro (your seat — required for the guest model) | **$8.75/mo (~K219/mo)** | Non-negotiable fixed cost. Without it the K250 tier can't exist. |
| bit.ly (tracking links), CapCut (video editing) | K0 | Free tiers are enough. |

Two cautions:
- TikTok Ads Manager self-serve may not even accept Zambian billing — but the
  minimums rule it out anyway, so it doesn't matter.
- Meta Verified auto-renews at the standard (higher) rate after 12 months.
  Another reason to wait.

---

## Budget tiers — pick one and commit for 90 days

Fixed base for every tier: **Slack Pro K219/mo + data/airtime ~K300/mo ≈ K520/mo.**

### Tier A — Lean (~K1,750/mo)

| Line | ZMW/mo |
|---|---|
| Fixed base (Slack + data) | 520 |
| Meta ads — $1.60/day ≈ K40/day × 30 | 1,200 |
| TikTok / Meta Verified | 0 — organic only |
| **Total** | **~1,720** |

At ~K6/click: ~200 clicks/mo. Paid for by **4 Notes students** (4 × K250 = K1,000
covers the ad spend; base is covered at 7).

### Tier B — Standard (~K3,000/mo) ← recommended if the budget allows

| Line | ZMW/mo |
|---|---|
| Fixed base | 520 |
| Meta ads — $3.20/day ≈ K80/day × 30 | 2,400 |
| TikTok Promote reserve (boost 1 winning video) | 0–225 (K75/day × 3 days, only if earned) |
| **Total** | **~2,900–3,150** |

~400 clicks/mo. Break-even at ~12 Notes students or ~6 Community students.

### Tier C — Aggressive (~K5,500/mo) — only after Tier B shows conversions

| Line | ZMW/mo |
|---|---|
| Fixed base | 520 |
| Meta ads — K130/day | 3,900 |
| TikTok Promote — K75/day × 10 days on proven videos | 750 |
| Meta Verified for WhatsApp (badge, if lead volume justifies it) | 375 |
| **Total** | **~5,545** |

**Do not start at Tier C.** Start A or B, and move up only when the numbers in
`leads.md` and `revenue-log.md` say the funnel converts.

### Honest conversion math (Tier B example)

400 clicks → ~15% start a WhatsApp chat (60 leads) → ~50% join the free trial
(30 trials) → ~20% convert at day 30 (**6 paying students ≈ K1,500–3,000/mo
recurring**). Month 1 is roughly break-even; the win is that students recur and
ad spend doesn't. If after 6 weeks the click→chat rate is under 8%, the creative
or the landing step is broken — fix that before adding budget.

---

## Implementation phases

### Phase 0 — Fix the funnel (Week 1, cost: K0 + Slack K219)

The README action queue, in order. Nothing below starts until these are done:

- [ ] **One Slack workspace on Pro** — consolidate, recreate TM/SM channels if
      moving, kill the other two, update `workspace.md` and the invite link.
- [ ] **Framer**: remove "Free until 10 June", fix K800 → K500 everywhere, fix
      "Prodo" meta titles, edit `/legals`.
- [ ] **Tally**: add the free-trial option, delete the dead annual page, clear
      test submissions.
- [ ] **Strip the old invite link** from the ~19 shipped build scripts; rebuild
      any PDF before it circulates.
- [ ] **Decide the offer that replaces the founding rate** (the ads need one
      line of urgency — e.g. "first 20 students at K250 lock that rate for the
      year"). Write it into `pricing-strategy.md`.

### Phase 1 — Set up the machine (Week 2, cost: K0)

- [ ] **WhatsApp Business app**: business name, ZCAS/UNZA-relevant description,
      catalog with the 4 courses as items (K250/K500 prices), quick replies for
      "how do I join", "what courses", "how do I pay", greeting + away messages.
      This is the "verify my WhatsApp" step — the free profile, not the paid badge.
- [ ] **Facebook page + Instagram business account**, linked in Meta Business
      Suite, WhatsApp button on both. Same handle everywhere (booklesss).
- [ ] **TikTok business account.**
- [ ] **Meta Business Suite → link WhatsApp** so ads can use the
      *click-to-WhatsApp* objective (ad tap opens a chat with you — no landing
      page needed, which sidesteps the weakest part of the funnel).
- [ ] Set up **bit.ly links** per channel (`booklesss-fb`, `booklesss-ig`,
      `booklesss-tt`, plus per-group links per `groups.md`).

### Phase 2 — Organic content engine (Weeks 2–4, cost: K0)

The 20 finished PDFs are the content mine. One PDF = a week of posts:

| Format | Made from | Platforms | Cadence |
|---|---|---|---|
| Carousel: 3 best pages of a step PDF as images + "full version free in the community" | existing PDFs | IG + FB | 3×/week |
| 20–40s video: one exam concept explained to camera (scripts already in `Demand/`) | `Demand/` video scripts | TikTok + IG Reels + FB | 3×/week |
| WhatsApp Status: today's tip + link | same material | WhatsApp | daily |
| Group drops with lead-magnet PDF | `groups.md` playbook | WhatsApp groups | per `groups.md`, logged |

Rules: positioning per `positioning.md` — a workspace that makes it easier to be
a student; no outcome promises; ZMW and Zambian companies in examples; banned
words list applies to captions too. Film 4–6 videos in one sitting, schedule the
week in Meta Business Suite (free).

**Gate to Phase 3:** at least one organic trial signup, proving the path
content → WhatsApp → Slack trial works end to end.

### Phase 3 — Turn on Meta ads (Month 2)

- **Objective:** click-to-WhatsApp messages (not traffic, not awareness).
- **Targeting:** Lusaka (+ Kitwe if UNZA matters this semester), 18–28,
  interests: university education, accounting, finance, ZCAS/UNZA if available.
- **Placements:** Advantage+ (Meta spreads across FB, IG, Reels, Stories — this
  is the "meta ads to all platforms" you wanted, from one campaign).
- **Creative:** your 2 best-performing organic videos + 1 carousel. Ads reuse
  proven organic content, never untested creative.
- **Budget:** the tier's daily amount, one campaign, two ad sets (SM vs TM
  audiences). Let it run 7 days before judging anything.
- **Log every lead** in `leads.md` with source = ad set name. No log, no scaling.

### Phase 4 — TikTok paid, the cheap way (Month 2–3)

- Ads Manager stays closed. When an organic TikTok clearly outperforms
  (3–5× your median views), put **K75/day × 3 days of Promote** behind it,
  goal = profile visits / messages. That's the whole TikTok paid strategy
  until revenue supports more.

### Phase 5 — Convert the proof into people (Month 3+)

You already wrote the playbook — `Operations/Roles for Growth - Booklesss.pdf`
(campus reps, community host, course authors; all variable-cost, milestone-gated)
and `Revenue Model - Booklesss.pdf`. The milestones that make those
conversations real:

| Milestone | What it unlocks |
|---|---|
| **10 paying students** | Proof the product sells. Recruit 1–2 campus reps on commission (e.g. 20% of month one per referred student) — reps cost nothing until they deliver. |
| **25 paying students (~K7,000+/mo)** | Approach tutors/course authors with a revenue share per the roles PDF. You're offering income, not asking favours. |
| **50+ paying, 3 months of `revenue-log.md` data** | An investor conversation with real unit economics: CAC from ad spend ÷ conversions, 80%+ margin on the Notes tier, a repeatable per-course playbook, 13 pipeline courses ready to launch. |

Nobody invests in zero rows in a revenue log. Everybody listens to a spreadsheet
showing K6 clicks turning into K250 subscriptions.

---

## 90-day money summary (Tier B)

| | Month 1 | Month 2 | Month 3 |
|---|---|---|---|
| Slack + data | K520 | K520 | K520 |
| Meta ads | K0 (organic only) | K2,400 | K2,400 |
| TikTok Promote | K0 | K0–225 | K225 |
| **Spend** | **~K520** | **~K2,900** | **~K3,150** |
| Realistic students (cumulative) | 0–3 (organic) | 4–8 | 10–15 |
| Recurring revenue | K0–750 | K1,000–2,500 | K2,500–4,500 |

**Total 90-day outlay: ~K6,600.** Realistic position at day 90: 10–15 paying
students, ad spend covered by recurring revenue, and the data to recruit reps
and start tutor conversations.

---

## What NOT to spend on (for the record)

- TikTok Ads Manager — minimums are ~4× the entire Tier B budget.
- Meta Verified badge — K375/mo buys ~60 ad clicks instead.
- WhatsApp API/chatbot tools — the free app handles your first 100 leads.
- Boosting posts casually from the app ("Boost Post" button) — always build
  click-to-WhatsApp campaigns in Ads Manager/Business Suite instead; boosted
  posts optimise for likes, not leads.
- Any new content production spend — 20 PDFs and the `Demand/` scripts are
  months of material already paid for in time.

---

## Weekly tracking (adds to `daily-checklist.md` cadence)

Every Sunday, 15 minutes:
1. Meta Ads Manager → cost per messaging conversation started → note in `monthly-tracker.md`
2. `leads.md` → new leads this week, by source
3. `revenue-log.md` → conversions, cancellations
4. Kill the worst ad creative, duplicate the best with one change
5. Check Slack guest ratio in `workspace.md` before inviting new trials
