# Linear backlog — staged for filing

Drafted 2026-07-12 from a remote session that couldn't reach Booklesss Linear
(`linear-server` needs a one-time OAuth on a connected machine; the cloud
sandbox can't reach `mcp.linear.app`). File these into the **Booklesss** team
(id `3e290b53-b6cc-4f93-8ad4-03c0fc04a4c1`) once connected — via
`mcp__linear-server__*`, not the Khadzika connector.

Each block below is one issue: **title**, priority, then description +
acceptance criteria. Grouped into three projects. Copy top-to-bottom.

---

## Project A — User tracking & personalized quizzes

The goal: know which steps a student finished, so quizzes can adapt to what
they've read — starting with no backend, growing into one only when it earns
its place. Order matters; each issue builds on the last.

### A1. Client-side step-completion tracking (localStorage)  · Priority: High
Add a real "mark complete" state to the step template, persisted in
`localStorage` under one shared key (e.g. `bk_completed = ["tm-2-1", …]`).
Everything on `booklesss.vercel.app` shares that store, so any other page can
read it. No backend, works offline, private to the device.
**Done when:** the step template's wrap-up card toggles a persisted complete
state; reopening the page reflects it; the key is documented in
`_dev/step-generator/README.md`. Regenerate all steps.

### A2. Demo quiz page that adapts to completions  · Priority: High
A static page (e.g. `/quiz/tm-2.html`) that reads `bk_completed` and only
serves questions from steps the student finished — weighting harder items,
skipping unread material. Proves "personalized quizzes" with zero backend.
**Done when:** a working quiz page pulls its question set from completed steps;
with nothing completed it shows a friendly "finish a step first" state.

### A3. One-time identity capture  · Priority: Medium
On first step visit, ask once for name + WhatsApp (or email), cache in
`localStorage`, attach to any future event. Voluntary — same trust bargain as
the Slack paywall. Needed before any operator-visible tracking (A4) means
anything.
**Done when:** a dismissible one-time prompt stores `bk_student`; it never
re-asks once answered; skippable without breaking the page.

### A4. Operator-visible completion beacon (Google Sheet)  · Priority: Medium
Fire-and-forget `fetch()` on "mark complete" → a Google Apps Script web app
that appends `{student, step, timestamp}` to a Sheet. ~15 lines server-side,
free, no database. Must fail soft (same pattern as `/api/step-feedback`): if
the beacon is down, the localStorage write still succeeds.
**Done when:** completions land as rows in a Sheet the owner can sort; a dead
beacon never blocks or errors the page. (Tally is a fallback since it's already
connected, but a Sheet is cleaner for machine events.)

### A5. (Later) Revive Supabase for real accounts  · Priority: Low
Only when personalization needs cross-device sync, spaced repetition, or true
accounts. The dormant schema (`profiles`, `step_feedback`, `course_access`)
and `/api/step-feedback` are already built for this — this is a revival, not a
rebuild. Blocked on "Recreate Supabase project" (C1).
**Done when:** decision recorded on whether the product has outgrown
localStorage + Sheet; if yes, env vars set and the feedback route un-dormanted.

---

## Project B — Launch readiness (remaining Vercel checklist)

Code-side hardening shipped (PRs #34–#35: CSP + security headers, fail-soft
feedback API, Deployment Protection documented and turned off so students can
reach production). What's left is dashboard clicks — no code.

### B1. Enable Speed Insights  · Priority: Medium
Turn on Speed Insights in the Vercel project (free tier on Hobby). Real Core
Web Vitals from Zambian mobile networks — exactly where field data beats lab
numbers.
**Done when:** Speed Insights shows data for `booklesss.vercel.app`.

### B2. Confirm Fluid compute is on  · Priority: Low
Settings → Functions. Recent projects default to it; just verify. Reduces cold
starts on the one API route.
**Done when:** Fluid compute confirmed enabled (or consciously left off).

### B3. Bot-blocking WAF rule  · Priority: Low
Flip on the WAF managed rule to block unwanted/AI bots. Sensible for unlisted
study material.
**Done when:** the managed bot rule is active in the project's Firewall tab.

### B4. (Reference) Deployment Protection — RESOLVED
Standard Protection was gating production because the site runs on a
`vercel.app` system domain (Standard only exempts *custom* domains). Fixed by
turning **Require Log In** off. Re-enable only after a real custom domain
exists. Full write-up in `platform/AGENTS.md`. Close as done / keep for record.

---

## Project C — Owner-side blockers (unblock marketing + voice)

These gate the signup push and aren't code — they're accounts and content.

### C1. Recreate Supabase project  · Priority: Medium
The old project (`rdzlubpcsxbcqwhnvycx`) was deleted. Create a fresh one, run
`platform/supabase/schema.sql`, run migration
`20260712_slim_platform.sql`, turn OFF "Confirm email" (free-tier SMTP rate
limits strand signups), set the `NEXT_PUBLIC_SUPABASE_*` env vars in Vercel.
Blocks A5.
**Done when:** feedback route reports authenticated for a test login; env vars
live in Vercel.

### C2. Generate booklesss20 invite link + replace placeholders  · Priority: High
`booklesss20` is the decided Slack home. Generate its invite link and replace
every `{{BOOKLESSS20_INVITE_LINK}}` placeholder (groups.md templates,
workspace.md, any flyer).
**Done when:** no placeholder tokens remain; one canonical invite link is in
`Operations/workspace.md`.

### C3. Create Slack channels for active courses  · Priority: High
Create the channels for courses ready to post (folder slug = channel slug).
Corporate Finance channels do NOT exist yet — do not post CF until they do.
Update `Operations/workspace.md` with the channel map.
**Done when:** channels exist for each active lesson; workspace.md matches.

### C4. ElevenLabs agent-id for the voice tutor  · Priority: Low
Create the agent at elevenlabs.io (persona in system prompt, reference
`{{step_title}}`), set `voice_agent_id` in a step's content file, regenerate.
Free tier is enough for a demo. Swaps the placeholder orb for the real widget.
**Done when:** one step ships with a working voice widget behind the orb.

### C5. (Optional) Provide real Satoshi woff2  · Priority: Low
Satoshi isn't on npm and CDNs are blocked, so the template substitutes Onest.
Drop a Satoshi woff2 in `_dev/fonts/` and it's a one-line swap.
**Done when:** either real Satoshi is embedded, or this is closed as "Onest is
fine."
