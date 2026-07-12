# Booklesss — Workspace Config

Live configuration for the Booklesss Slack workspace and all public-facing links.
Update this file whenever any link or setting changes.

> **⚠️ SUPERSEDED (2026-07-12, BOO-7 decision): do NOT rebuild the paid channel
> structure on Slack.** The paid product is migrating OFF Slack onto the own
> Next.js/Supabase platform — selling monthly access to Slack channels (and the
> 5-guests-per-seat "Notes" tier) violates the Salesforce/Slack MSA §3.4
> resale + usage-limit clauses. Slack's future role (free community layer vs.
> WhatsApp) is parked. The "recreate the 9 TM/SM channels on booklesss20 and
> repoint every link" plan below is on hold — the channel map is kept only as a
> record of what exists today, not a build instruction. See Linear BOO-7 / BOO-38.
>
> _Prior decision (now on hold): booklesss20.slack.com was to be the single home
> (the paid-plan workspace); bookless10 (Pro trial expired 2026-06-10, invite link
> DEAD) and the near-empty "Booklesss" tooling workspace are retired regardless._

---

## Slack Workspace

| Field | Value |
|-------|-------|
| Workspace name | Booklesss 2.0 |
| Workspace URL | booklesss20.slack.com |
| Plan | Paid |
| Invite link | **TODO — generate from booklesss20 (Invite people → copy invite link) and paste here before any marketing goes out** |

> **Note on invite links:** the link contains the workspace slug. Don't change
> the workspace URL/slug — it invalidates every shared invite link.

---

## Web platform (steps)

| Field | Value |
|-------|-------|
| Marketing site | booklesss.framer.ai |
| Step pages | booklesss.vercel.app/steps/… (public unlisted links — Slack membership is the gate; the login layer is dormant until a live Supabase project is wired) |
| Step index | booklesss.vercel.app/steps |

Posting pattern per step: hook line + 2–3 takeaways + **web step link** + PDF
attached as the offline copy.

---

## Use the invite link in

- All lead magnet PDFs (CTA page)
- WhatsApp post templates (`Operations/groups.md`)
- The Framer site CTA
- Any social or email mention

---

## Treasury Management — Channels (RECREATE on booklesss20)

Section name in Slack: **Treasury Management**

| Channel | Link | Content |
|---------|------|---------|
| `#tm-updates` | TODO | Announcements, new lesson drops |
| `#tm-operations` | TODO | Lesson 1 (Foundations) + Lesson 5 (Systems & Clearing) — steps 1.1, 5.1, 5.2 |
| `#tm-working-capital` | TODO | Lesson 2 (Working Capital, Liquidity, Inventory, Cash) — steps 2.1–2.3 |
| `#tm-risk` | TODO | Lesson 3 (Interest Rate Risk, FX Risk) — steps 3.1–3.2 |
| `#tm-investment` | TODO | Lesson 4 (Debt & Investment Management) — steps 4.1–4.2 |

## Strategic Management — Channels (RECREATE on booklesss20)

Section name in Slack: **Strategic Management**

| Channel | Link | Content |
|---------|------|---------|
| `#sm-updates` | TODO | Announcements, new lesson drops |
| `#sm-foundations` | TODO | Lessons 1–2 (Intro to Strategy, Mission & Vision) |
| `#sm-environment` | TODO | Lessons 3–4 (External & Internal Environment) |
| `#sm-strategy` | TODO | Lessons 5–6 (Implementation & Competitive Strategy) |

## Corporate Finance — Channels (PENDING CREATION)

Section name in Slack: **Corporate Finance**

| Channel | Link | Content |
|---------|------|---------|
| `#cf-updates` | — | Announcements, new lesson drops |
| `#cf-investment` | — | Steps 1.1–1.3 (FCF, APV, International NPV) |
| `#cf-cost-of-capital` | — | Steps 2.1–2.2 (WACC, CAPM, Capital Structure) |
| `#cf-ma-valuation` | — | Steps 3.1–3.2 (Valuation, M&A, EMH) |
| `#cf-risk` | — | Steps 4.1–4.2 (Interest Rate Risk, Currency Risk) |
| `#cf-dividends` | — | Step 5.1 (Dividend Policy) |

---

## Slack File Links — PDFs uploaded to workspace

Historical record of uploads. **Do NOT embed these links inside PDFs** — the
`STEP_LINKS` / `step_ref()` pattern was abandoned (Slack regenerates file IDs on
every upload; see PROJECT_MEMORY dead end, 2026-06-04).

File link format: `https://booklesss20.slack.com/files/{USER_ID}/{FILE_ID}/{filename}.pdf`

### Strategic Management

| Step | Title | Slack File Link |
|------|-------|----------------|
| 1.1 | Introduction to Corporate Strategy | https://booklesss20.slack.com/files/U0B2W0BJGUT/F0B818T8M4N/step_1.1_-_introduction_to_corporate_strategy.pdf |
| 1.2 | Vision, Mission & Objectives | https://booklesss20.slack.com/files/U0B2W0BJGUT/F0B81C99WSJ/step_1.2_-_vision__mission___objectives.pdf |
| 2.1 | The External Environment | — |
| 2.2 | The Internal Environment | — |
| 3.1 | Strategy Implementation | — |
| 3.2 | Competitive Strategy | — |

### Treasury Management

| Step | Title | Slack File Link |
|------|-------|----------------|
| (add as uploaded) | | |

### Corporate Finance

| Step | Title | Slack File Link |
|------|-------|----------------|
| (add as uploaded) | | |

---

## Global Channels

| Channel | Purpose |
|---------|---------|
| `#all-booklesss` | General community chat |
| `#social` | Off-topic, student life |

---

## Retired workspaces (do not post, do not share links)

| Workspace | Status |
|-----------|--------|
| bookless10.slack.com | Pro trial expired 2026-06-10. Held the original TM/SM channels. Old invite link `https://join.slack.com/t/bookless10/…` is retired — purge it from every doc/script/site. |
| "Booklesss" (Claude-connected) | Near-empty; keep only for tooling until migrated. |
