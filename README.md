# Booklesss — Owner's Map

**One sentence:** Booklesss sells branded PDF study notes plus a Slack community to Zambian university students (ZCAS, UNZA), at K250/month for one course or K500/month for everything.

This file is the map. Read top to bottom and you know the state of the business, where everything lives, and what to do next. Keep it honest — update it when reality changes.

---

## Where everything lives

| You want to… | Go to |
|---|---|
| See what content exists per course | `Schools/[School]/[Course]/_course.md` |
| Run the day (post, reply, log) | `Operations/daily-checklist.md` |
| Check Slack config, channels, invite links | `Operations/workspace.md` |
| Check prices and unit economics | `Operations/pricing-strategy.md` |
| Log a lead / a payment / a group drop | `Operations/leads.md` · `revenue-log.md` · `groups.md` |
| Find marketing assets (flyer, video scripts) | `Demand/` |
| See what happened in past work sessions | `PROJECT_MEMORY.md` |
| Rebuild any PDF | run the `build_*.py` script next to it (`python3 "path/to/build_x.py"`) |

Project rules for AI sessions live in `.claude/CLAUDE.md`. Three skills drive the pipeline: **lesson-skill** (plan a course), **step-skill** (write a PDF), **design-system** (web only).

---

## Product state (verified 2026-06-11)

| Course | School | Steps built | Posted to Slack | Slack channels |
|---|---|---|---|---|
| Treasury Management BBF4302 | ZCAS | **10 / 10** | 1 (Step 2.3) | LIVE (5 channels) |
| Strategic Management | ZCAS | **7 / 7** | 1 (Step 2.2, under its old number) | LIVE (4 channels) |
| Corporate Finance BAC4301 | ZCAS | 2 / 10 at current standard (8 need rebuild) | 0 | NOT created |
| BBA 1110 Business Administration | UNZA | 1 / 9 | 0 | NOT created |

Pipeline behind these: 13 raw UNZA courses in `Schools/UNZA/_pipeline/` (local machine only — too big for GitHub).

**The asset is real: 20 finished, branded course PDFs exist. Almost none of them have been put in front of a student.** Distribution, not production, is the bottleneck.

---

## Money model (current — `Operations/pricing-strategy.md` is the source of truth)

- **Free trial** — 1 month, one course channel, no card.
- **Notes — K250/month** — single-channel Slack guest. Guest seats cost nothing on a paid Slack plan, so this is ~100% margin.
- **Community — K500/month** — full workspace. Costs one paid Slack seat (≈K219/month on Pro, K339 on Business+).
- **Custom** — negotiated 1-on-1 tier.

Constraint that makes the whole model work: Slack allows ~5 free single-channel guests per paid member. **This requires a paid Slack plan — see red flag #1 below.**

Revenue and members to date: **zero recorded.** `revenue-log.md` and `leads.md` are empty. That is the honest starting line.

---

## Red flags blocking launch (fix before any marketing push)

1. **Slack is split across three workspaces.** Students are invited to `bookless10` (Pro trial **expired 2026-06-10**); SM PDFs were uploaded to `booklesss20`; a third, empty "Booklesss" workspace (created 2026-06-04) is the one currently connected to tools. Pick one, build the channels there, kill the others, and update `Operations/workspace.md` + the invite link everywhere.
2. **The website advertises an expired offer and a wrong price.** Homepage CTAs say "Free until 10 June" (passed); pricing page still shows Community at K800 (real price K500); homepage FAQ likely still says K800; meta titles still say "Prodo"; `/legals` is untouched template text.
3. **The Tally form (tally.so/r/81Jejr) has no free-trial option** even though the website sells one, plus an unreachable "annual K4,680" page priced off the abandoned K390 rate. 90 views → 0 genuine submissions so far.
4. **~19 shipped PDF build scripts embed the old `bookless10` invite link** in their closing text. Strip before circulating any of those PDFs.
5. **The founding-rate deadline (April 18) passed two months ago** and still appears in marketing templates (`Operations/groups.md` Template D). Decide the new offer.

---

## The growth loop (once unblocked)

1. **Distribute** — WhatsApp groups + money flyers (`Demand/`) + status posts → website / form / invite.
2. **Convert** — free month in one channel → day-25 WhatsApp follow-up → K250 or K500.
3. **Retain** — daily posting cadence, replies, weekly quiz + Sunday leaderboard (`Operations/daily-checklist.md`).
4. **Log everything** — `leads.md`, `groups.md`, `revenue-log.md`, `monthly-tracker.md`. Empty logs mean flying blind; the checklist tells you when to write to each.
5. **Expand** — promote the next `_pipeline/` course with lesson-skill once the current four are earning.

Scaling beyond yourself: the role designs (campus reps, community host, course authors — all variable-cost, milestone-gated) are in `Operations/Roles for Growth - Booklesss.pdf` and the revenue split in `Operations/Revenue Model - Booklesss.pdf`.

---

## Action queue (in order)

**This week — make the funnel honest:**
- [ ] Consolidate to one Slack workspace on a paid plan; recreate TM/SM channels if moving; update `workspace.md` and the invite link
- [ ] Framer: remove "Free until 10 June", fix K800 → K500 (pricing page + FAQ), fix "Prodo" meta titles, edit `/legals`
- [ ] Tally: add the free-trial choice, delete the dead annual page/logic, clear the two test submissions
- [ ] Strip the old invite link from the CF/TM build scripts (and rebuild any PDF before posting it)

**Next — ship what's already paid for:**
- [ ] Post TM and SM step-by-step to their live channels (both courses are fully built)
- [ ] Write the 8 remaining BBA steps (step-skill), create the 9 BBA channels
- [ ] Rebuild the 8 remaining CF steps to v2, create the 6 CF channels

**Then — turn on demand:**
- [ ] Film the video scripts in `Demand/` (full + short versions, cue cards ready)
- [ ] Print and drop money flyers; log every group post in `Operations/groups.md` with its bit.ly link
- [ ] Follow the daily checklist without skipping the logging steps
