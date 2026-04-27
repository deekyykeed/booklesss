# Plan — CF Free-Trial Tally Onboarding Form

## Status: COMPLETE (built 2026-04-27)
Form live at: **https://tally.so/r/81Jejr**

Still outstanding:
- [ ] Create CF Slack channels and update `operations/workspace.md` with IDs
- [ ] Drop WhatsApp message in CF group
- [ ] Monitor first submissions — adjust if pages 3/4 losing people

---

## Context

The Corporate Finance Slack channel just opened to student messaging — first time CF students can actually talk inside the workspace. All 10 BAC4301 PDFs are written and ready to drop. You want to seize this moment to pull as many CF students in as possible by offering a **free 1-month trial**, captured through a **Tally form** (you have a connection there) which also doubles as the landing page since you've removed the website middleman.

The form needs to do three jobs at once:
1. **Sell** — be a mini landing page
2. **Capture** — name, WhatsApp, study habits, struggles, learning style, optional study material
3. **Convert** — hand over the Slack invite at the end

---

## Pricing math (K400 question — revised with live Slack rates)

**Where you stand right now:** Your Slack Pro trial expires **May 19, 2026** (per Slack's banner). The free 1-month CF offer should fit *inside* this trial window so Slack costs only kick in for students who convert to paid after May 19.

**Current Slack pricing** (pulled from Slack's pricing pages, April 2026):

| Plan | Monthly billing | Annual billing (paid upfront) | Notes |
|---|---|---|---|
| Pro | ~$8.75/user/mo | $7.25/user/mo | Single-channel guests are free on this plan |
| **Business+** | **$15/user/mo** | **$12.50/user/mo** | Adds SSO, compliance, 99.99% SLA |

Slack's existing assumption in `Finances/pricing-strategy.md:23` was Business+ monthly billing at $15 = K375. That number is correct, but it's the *most expensive* combination — annual billing is 17% cheaper.

**Cost per paid student in ZMW** (FX matters — file uses ZMW 25/$1; current rate is similar but volatile):

| Plan & billing | $/user/mo | At ZMW 25/$1 | At ZMW 28/$1 |
|---|---|---|---|
| Business+ monthly | $15 | K375 | K420 |
| **Business+ annual** | **$12.50** | **K313** | **K350** |
| Pro monthly | $8.75 | K219 | K245 |
| Pro annual | $7.25 | K181 | K203 |

**Margin at K400/student/month**:

| Plan & billing | Slack cost | K400 margin | K500 margin |
|---|---|---|---|
| Business+ monthly @25 | K375 | **K25 (6%)** | K125 (25%) |
| Business+ monthly @28 | K420 | **−K20 (loss)** | K80 (16%) |
| **Business+ annual @25** | **K313** | **K87 (22%)** | K187 (37%) |
| **Business+ annual @28** | **K350** | **K50 (13%)** | K150 (30%) |
| Pro annual @25 | K181 | K219 (55%) | K319 (64%) |

### Recommendation

1. **For pricing the CF cohort: K500/month, not K400.**
   - K400 only works if you commit to **Business+ annual billing** AND the kwacha holds. That's two bets at once.
   - K500 gives you a comfortable 30%+ margin at Business+ annual, even if the kwacha slips to 28.
   - Frame it as the **CF Launch Rate — K500/month, locked for life**. Same mechanic as the original founding rate, legitimately reopened because CF channels weren't available before April 18.

2. **Switch to Business+ *annual* billing, not monthly, the moment you have ~3 paying students.**
   - Saves 17% per student forever — ~K62/student/month at current FX
   - Annual upfront = $12.50 × 12 × N students. For 5 students that's $750 upfront. Manageable.
   - Until you have 3+ paying, stay on monthly to keep cash flexibility.

3. **Pro vs Business+ — what you actually give up by staying on Pro**

   **Pro already includes everything Booklesss needs:**
   - Unlimited message history (no 90-day cutoff on student discussions)
   - Free single-channel guests (this is the whole free-trial mechanic)
   - Unlimited apps & integrations
   - Workflow Builder (for automations like welcome flows, quiz drops)
   - Huddles (group audio/video/screen share — for live revision sessions)
   - Slack Connect with up to 250 orgs
   - Custom retention policies
   - Priority support

   **Business+ adds these — none of which are load-bearing for you:**

   | Business+ extra | Useful for Booklesss? |
   |---|---|
   | SAML SSO | No. Useful when a uni/employer federates identity. Students sign in with email. |
   | 99.99% uptime SLA | No. It's a refund guarantee, not better reliability. |
   | Compliance / corporate exports (incl. private channels & DMs) | No. Legal/HR feature. |
   | 24/7 priority support, 4-hour response | Marginal. Pro has priority support, just not 24/7. |
   | Advanced AI (search, recaps, translations, file summaries) | **Maybe.** Could be nice for daily recaps to students. Replaceable with external tools. |
   | Extra premium workflow runs/month | **Maybe.** Matters if you build heavy automations (leaderboards, quiz bots). |
   | Advanced identity management / provisioning | No. |
   | Expanded Slack Connect external access | No. |

   **Verdict:** the only Business+ extras with any real fit are *more workflow runs* and *advanced AI* — both nice-to-haves, neither load-bearing for the next 10–30 students. Everything else is enterprise/compliance plumbing that costs you ~K194/student/month for nothing.

   **If you went Pro annual instead of Business+ monthly, you'd save ~K194/student/month** — at 10 paying students that's K1,940/month, or K23,280/year. Big enough to fund quiz prizes, marketing, or just take as profit.

   **Recommended path:**
   - **Now → May 19 (Pro trial)**: free. Run the CF launch entirely inside this window.
   - **May 19 onward**: move to **Pro** ($7.25/user/mo annual or $8.75/user/mo monthly). Pick monthly until you have 3+ confirmed paying students, then switch to annual.
   - Re-evaluate Business+ only when (a) you've got 30+ students *and* (b) a specific Business+ feature becomes a real bottleneck.
   - Frame the new tier publicly as **CF Launch Rate K500/month, locked for life** — only for students who join during the launch window (cap at, say, the first 30 CF signups).
   - **Quiz prizes** — fund a small prize pot from each cohort's revenue (e.g. K200/month → top 3 students on the weekly quiz leaderboard win airtime/data bundles). Mention "weekly quizzes with cash/airtime prizes" on the Tally welcome page as a hook.

   **Pro annual — actual upfront cost** (your "what does 1 member cost" question)

   Pro annual is **$7.25/user/month, billed once for the full year** = **$87/user/year**. Slack counts the workspace owner (you) as a paid seat too.

   | Scenario | Paid seats | $ upfront/year | ZMW @ 25/$1 | ZMW @ 28/$1 |
   |---|---|---|---|---|
   | Just you (admin only, no paying students yet) | 1 | $87 | K2,175 | K2,436 |
   | You + 1 paying CF student | 2 | $174 | K4,350 | K4,872 |
   | You + 5 paying students | 6 | $522 | K13,050 | K14,616 |
   | You + 10 paying students | 11 | $957 | K23,925 | K26,796 |

   Free-trial students sit as **single-channel guests = $0** — they don't count toward paid seats. Cost only kicks in when they convert.

   **Cash-flow reality check:** if only 1 student converts after May 19, you're K2,175 in the hole on annual upfront vs receiving K500/mo from them = K6,000/year. Net: still K3,825 profit. But if zero convert, you've prepaid K2,175 just to keep your own admin seat on Pro.

   **Safer staged plan:**
   1. May 19 → first paid conversion: stay on Pro **monthly** ($8.75/user) — only K219 cost for your admin seat, no annual lock-in
   2. Once you have 3+ paying students confirmed: switch to Pro annual to lock in the 17% discount
   3. This way you never prepay for seats you might not fill

---

## Form structure (Tally, ~10 fields, 5 pages)

Field count is moderate — light enough to submit, deep enough to inform content + segmentation. Pages instead of one long scroll keeps it feeling quick.

### Page 1 — Welcome / hero (the "landing page")
Headline: **Get one free month inside Booklesss — Corporate Finance edition**
Sub: All 10 BAC4301 modules. Past papers. A study community. No card needed. One month, free, in your Slack.
Bullets:
- 10 lesson PDFs (Investment Appraisal → Dividend Policy)
- Discussion with other CF students inside Slack
- Past papers + notes shared by the community
- One-step join: this form → Slack invite

CTA button: **Start →**

### Page 2 — You
1. **Full name** *(short text, required)*
2. **WhatsApp number** *(phone field, required, default country: Zambia +260)*
3. **University & year of study** *(short text, required, e.g. "ZCAS, Year 3")*

### Page 3 — How you study
4. **How often do you study CF?** *(single select)* — Daily / 3–4× a week / 1–2× a week / Mostly before exams
5. **How do you learn best?** *(multi-select)* — Reading notes solo / Group discussion / Watching lectures / Doing past papers / Teaching others / Mind maps & summaries
6. **What's the hardest part of CF for you so far?** *(long text)* — placeholder: "WACC? M&A valuation? Honestly anything — the more specific the better."
7. **What's hard about studying *in general*, beyond CF?** *(long text, optional)* — placeholder: "Time? Distractions? Notes are bad? No one to discuss with?"

### Page 4 — How the community fits in
8. **Which features would help you most?** *(multi-select)* — Lesson PDFs / Past paper bank / Group discussion / Quick Q&A with peers / Weekly quizzes / Exam prep sprints / Study accountability
9. **How do you think a study community could help you specifically?** *(long text)* — placeholder: "Be honest — are you here for notes, motivation, exam tips, or just to see what it is?"

### Page 5 — Bonus (optional)
10. **Got study material we could use to make the course better?** *(file upload, optional, multi-file)* — Past papers, lecturer slides, your own notes, textbook chapters — anything CF-related. We'll credit you if we use it.

### After-submit: redirect straight to Slack
Tally has a free **Redirect on completion** feature that sends submitters to any URL the moment they hit submit (no thank-you page shown — that's the trade-off). We use that here so they go straight from form to Slack with zero friction.

- **Redirect URL**: `https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg`
- The Slack invite page itself handles the "download Slack / open in browser" decision — that's literally what Slack's invite landing does. So one redirect covers both new-Slack-user and existing-Slack-user cases.
- We can replace this URL later with a deep link to `#cf-investment` directly once that channel ID is confirmed.

Because the redirect skips the thank-you page, we lose the chance to show "your first lesson is waiting" copy *on the form*. Compensate by:
- Adding a one-liner on the **last form page** (above submit): "On submit you'll go straight to Slack. Your first CF lesson is waiting in `#cf-investment`. We'll WhatsApp you within 24h."
- Sending the same line as a WhatsApp DM right after submission (manual for now).

### Visual identity
Use **default Tally styling** (classic black on white). No custom branding — keep it clean and fast.

---

## Post-form flow

**Source of truth for submissions: Tally's own submissions dashboard.** No need to also maintain `operations/leads.md` row-by-row — Tally already gives you a sortable, filterable, exportable inbox. Skip the duplicate.

What you actually do per submission:
1. **Read the submission in Tally** — note their stated struggle and learning style for the DM.
2. **Send WhatsApp DM within 24h** — short personal welcome, referencing what they said. Example: *"Hey [name], saw your signup. You said WACC is your weak point — Step 4 covers exactly that, drops Thursday in #cf-cost-of-capital. Drop a 👋 in the channel when you're in."*
3. **Slack** — they'll have already joined via the redirect. If they haven't joined within 48h, nudge via WhatsApp with the invite link again.
4. **Material handling** — if they uploaded files, download from Tally and save into `courses/Corporate Finance/community-material/[student-name]/`. Review for course improvements.
5. **Convert tracking** — only when a student pays does it need to land in `operations/leads.md` / `operations/revenue-log.md`. Pre-payment, Tally is enough.

Out of scope for this plan: webhook auto-sync from Tally to `leads.md`. Revisit if volume crosses 30+/week.

### Tally free-plan limits (what's the catch?)

For your use case, **the free plan is genuinely sufficient**. Limits and what hits you:

| Capability | Free plan | When this becomes a problem |
|---|---|---|
| Forms | Unlimited | Never |
| Submissions | Unlimited | Never |
| Fields per form | Unlimited | Never |
| Conditional logic | Yes | Never |
| Redirect on completion | Yes (free) | Never — that's what we use |
| File uploads | Up to **10MB per file** | Past papers can be 5–15MB scans. Most fine; occasional big PDF won't upload. |
| Tally branding visible on form | Yes | Cosmetic. Doesn't hurt conversion meaningfully. |
| Custom domain | Pro only ($29/mo) | Not relevant — the form lives at a `tally.so/r/...` URL |
| Custom CSS | Pro only | Not needed — using default styling anyway |
| Partial / resumable submissions | Pro only | Form is short, low risk |
| Email verification | Business only ($89/mo) | Not needed |

**Only real catch**: the **10MB per file** limit on uploads. If a student tries to share a scanned past paper that's 15MB, they'll get blocked. Workaround: ask them to share via WhatsApp instead, or compress the PDF. Worth mentioning in the upload field's helper text: *"Up to 10MB per file. If yours is bigger, send it on WhatsApp."*

---

## Critical reference points

- Slack invite link: `https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg` — from `operations/workspace.md:16`
- CF channels (target landing channel: `#cf-investment` for first lesson) — from `operations/workspace.md:69-83` (currently marked PENDING — must verify before launch)
- Slack cost (live, April 2026): Business+ $15 monthly / **$12.50 annual** ; Pro $8.75 monthly / **$7.25 annual**
- CF brand colours: `#1A1200` espresso, `#C9A020` gold — from `.claude/CLAUDE.md` Course Visual Identity table
