# Booklesss v1 — Architecture & Build Plan

**Date:** 2026-07-15 · **Goal:** a complete, working v1 by end of today.
**Stack (verified against official docs):** Clerk (identity + billing UI/subscriptions) · Supabase (all data, incl. step content) · Next.js 16 on Vercel (app) · Python/ReportLab (authoring) · Slack (community) · Framer (marketing site).

This executes the standing **BOO-7 decision** (Operations/pricing-strategy.md, 2026-07-12): the paid product moves OFF Slack onto our own gated platform. Tier prices stand: **Notes K360/mo · Community K600/mo · Custom**. Free trial is retired — money-back guarantee instead.

---

## 1. The system — five planes

| Plane | Owner | What lives there |
|---|---|---|
| **Identity** | **Clerk** | Accounts, sessions, sign-in/up UI, email verification, password reset, user metadata (role, university) |
| **Billing** | **Clerk Billing** (Stripe underneath) | Plans (`notes`, `community`), subscriptions, payment UI (`<PricingTable/>`), plan checks (`has({plan})`) |
| **Data** | **Supabase** (data-only, no Supabase Auth) | Step **content** (new `steps` table), per-student state (`step_feedback`, `outcome_ticks`, `quiz_attempts`, `profiles`, `course_access`) |
| **App** | **Next.js 16 on Vercel** | Step renderer (`/steps/[slug]`), gate (`proxy.ts` = `clerkMiddleware`), APIs, pricing page, progress page |
| **Community & reach** | Slack (free community + link delivery), WhatsApp (leads), Framer (marketing) | Unchanged — but paid access = platform, not Slack seats |

Authoring stays in this repo: Python scripts remain the source of truth for content. What changes is the **output target** — instead of emitting full static HTML pages, the generator publishes content to Supabase.

### Storage map — "where is everything?"

| Thing | Where | Why |
|---|---|---|
| Student accounts, sessions | Clerk | Identity plane; already migrated (PR #64) |
| Subscriptions & payment records | Clerk Billing / Stripe | User's call: Clerk handles billing |
| Step content (body HTML, title, outcomes, metadata) | Supabase `steps` table | Queryable, instantly updatable, per-course gateable, feeds quizzes later |
| Ticks / ratings / completions / quiz attempts | Supabase (existing tables, Clerk-keyed) | Already live |
| Manual access grants (mobile-money payers) | Supabase `course_access` | The Zambian payment reality (see §5) |
| Source material, build scripts, ops docs | This git repo | Unchanged |
| PDFs (lead magnets, Slack posts) | Generated locally → WhatsApp/Slack | Unchanged pipeline |
| Fonts, brand images | `platform/public/` (deployed with app) | Static assets, versioned |
| Marketing site | Framer (`booklesss.framer.ai`) | Unchanged |

---

## 2. Step content in Supabase — the design

### Schema (new `steps` table)

```sql
create table public.steps (
  slug         text primary key check (slug ~ '^[a-z0-9-]{1,64}$'),
  course_code  text not null check (course_code ~ '^[a-z]{2,4}$'),  -- tm, sm, cf, bba, ops
  lesson       int,
  step_label   text,                    -- "Step 2.1"
  title        text not null,
  description  text,
  body_html    text not null,           -- generated body (sections, callouts, outcomes list)
  outcomes     jsonb not null default '[]',  -- outcome texts, for quizzes/queries later
  added_value  jsonb not null default '[]',  -- [(label, url)] companion resources
  access       text not null default 'members'
               check (access in ('public','members','internal')),
  status       text not null default 'draft'
               check (status in ('draft','published','archived')),
  version      int not null default 1,
  published_at timestamptz,
  updated_at   timestamptz not null default now()
);
alter table public.steps enable row level security;
-- Published members-content readable by any signed-in user (plan enforcement
-- happens at the route — see §4); public rows readable by anyone.
create policy "read published public"  on public.steps for select
  using (status = 'published' and access = 'public');
create policy "read published members" on public.steps for select to authenticated
  using (status = 'published' and access in ('members','internal'));
-- Writes: service role / MCP only (no client insert policy).
```

Postgres `text` handles the ~100–300 KB bodies without blinking. `internal` rows (e.g. `revenue-model`) additionally require the owner role at the route.

### Rendering — shell moves into Next.js

Today each static file = template shell (CSS + tap-define/outcomes/feedback JS) + body. That splits:

- **`app/steps/[slug]/page.tsx`** (server component): Clerk auth already guaranteed by middleware → access check (§4) → fetch step row from Supabase → render shell with `body_html` injected.
- **`app/steps/steps.css`** — the template's CSS, once.
- **step client script** — the template's vanilla JS (tap-define popover, tickable outcomes, rate/complete, scroll-reveal, icon sprite) loaded as a bundled client script, parameterized by slug via a data attribute instead of `{{STEP_SLUG}}`.

Pages render dynamically per request (they're auth-gated anyway); at our scale a DB read per view is nothing.

### Authoring pipeline (the change is one flag)

```
content_*.py  →  generate_step.py --emit-json  →  {slug, title, body_html, outcomes, …}
                                               →  publish: upsert into steps table
```

- The Python generator keeps producing exactly the same body HTML via `blocks.py`; it just stops wrapping it in the full-page template.
- **Publish from cloud sessions:** via Supabase MCP (`execute_sql` upsert) — the sandbox egress proxy blocks the project's REST URL, the MCP is the reliable path. **Publish from the owner's machine:** small script with the service-role key (later, optional).
- Old URLs keep working: `/steps/tm-2-1.html` → redirect to `/steps/tm-2-1`, so every link already posted in Slack survives. Static files are deleted after cutover verification.

---

## 3. Auth (done — activate it)

Already merged-ready in PR #64, matching Supabase's official Clerk guide:

- Clerk owns sign-in/up (`/sign-in`, `/sign-up`, Clerk components, Booklesss-branded).
- `proxy.ts` (`clerkMiddleware`) gates `/steps` + everything under it.
- Supabase trusts Clerk tokens (third-party auth); RLS keys rows to `auth.jwt()->>'sub'` (Clerk user id, `text`).
- Everything fail-soft: no keys → app builds and serves, auth dormant.

**Activation (owner, ~15 min, dashboards):**
1. Clerk dashboard → create the Booklesss application → copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`.
2. Visit **dashboard.clerk.com/setup/supabase** → one-click configure the instance for Supabase.
3. Supabase dashboard → Authentication → **Third-Party Auth** → add Clerk (paste the Clerk domain).
4. Vercel → env vars (Production + Preview): the two Clerk keys, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (values in PR #63/#64 descriptions and `.env.example`).
5. Redeploy.

---

## 4. Access model

One helper, used by the step page (single place to change policy):

```
canReadStep(auth, step):
  step.access == 'public'    → anyone (lead-magnet steps, no sign-in)
  step.access == 'internal'  → Clerk user with publicMetadata.role == 'owner'
  step.access == 'members'   → has({plan:'community'})
                               OR has({plan:'notes'})        # Clerk Billing
                               OR course_access row for step.course_code   # manual grants
```

- Signed-in but unpaid → step page shows a locked teaser + link to `/pricing`.
- `course_access` is the **manual grant table** — the owner inserts a row when someone pays by mobile money. It is not a stopgap hack; in Zambia it's the primary production payment path until Stripe exists (§5).
- Notes vs Community content difference (if any) is a policy decision — v1 ships with both plans unlocking all steps of their course; Community additionally means full Slack community + quizzes (as in pricing-strategy.md).

---

## 5. Billing — Clerk, with the Zambia reality stated plainly

**Verified facts (official docs):**
- Clerk Billing handles plans, subscriptions and the payment UI; **Stripe is the only payment processor**. Fee: 0.7% + Stripe's fees.
- **Development instances get Clerk's shared test Stripe gateway** — we can build and fully test the entire billing flow **today, with no Stripe account**.
- **Production requires your own Stripe account — and Stripe does not support Zambia.** A production Stripe account needs an entity in a supported country (the standard route: US LLC via Stripe Atlas / doola, ~$200–500 one-off).
- Server-side gating: `const { has } = await auth(); has({ plan: 'community' })`. UI: `<PricingTable/>` (confirmed exported by our installed `@clerk/nextjs@7.5.18`).

**Two payment rails, both first-class:**

| Rail | Who | How | Status |
|---|---|---|---|
| **Clerk subscriptions** (cards) | Diaspora/card-holding students; the future | `<PricingTable/>` → Stripe checkout → `has({plan})` unlocks | Build today on dev gateway; production blocked on Stripe entity decision |
| **Mobile money** (MTN MoMo / Airtel) | Most Zambian students, today | Existing WhatsApp flow → owner confirms payment → `course_access` grant (SQL/MCP; admin page later) | **Production path from day one** |

Plans in Clerk (dev): `notes` and `community`. Stripe prices in USD — display equivalents (K360 ≈ $15, K600 ≈ $25 at K25/$). Local ZMW pricing stays the WhatsApp/mobile-money quoted price.

**Owner decision, not blocking today:** whether/when to form a US entity for live Stripe. Until then card billing stays in test mode and mobile money carries revenue — identical access outcome either way, because `canReadStep` treats both rails equally.

---

## 6. Today's build plan

Work happens on `claude/revenue-model-step-hw48uv` → PRs → merge. Product stays live all day (static steps keep serving until Phase 1's cutover is verified).

### Phase 0 — Activate auth (owner ~15 min dashboards, me ~15 min verify)
1. Merge **PR #64** (Clerk migration — green, fail-soft).
2. Owner: the 5 activation steps in §3.
3. Me: verify live — sign-up works, gate redirects, first `outcome_ticks` row lands in Supabase (checked via MCP).
**Checkpoint: first real account writes real data.**

### Phase 1 — Content into Supabase (me, ~3 h)
1. `steps` table migration + RLS (apply via MCP; mirror in `schema.sql` + migration file).
2. Port the template shell into the app: `app/steps/[slug]/page.tsx`, `steps.css`, client script (tap-define, outcomes, feedback, reveal). CSP check for the interactive bits.
3. `generate_step.py --emit-json` mode (body-only output; existing `--all` behaviour kept until cutover).
4. Publish `tm-2-1`, `tm-2-2` (members) and `revenue-model` (internal) into the table via MCP.
5. `/steps` index reads the DB (course-grouped). Redirects `/steps/*.html → /steps/*`. Delete static HTML after verification.
6. Verify in Chromium: render parity, tap-define works, ticks persist, old URLs redirect, internal step invisible to non-owner.
**Checkpoint: steps served from the database; Slack links unbroken.**

### Phase 2 — Billing (owner ~20 min dashboard, me ~1.5 h)
1. Owner: Clerk dashboard → enable Billing (dev gateway) → create plans `notes` ($15/mo) + `community` ($25/mo) with feature descriptions from pricing-strategy.md.
2. Me: `/pricing` page (`<PricingTable/>`, branded); `canReadStep` helper wired into the step page; locked-step teaser → pricing.
3. Manual-grant rail: document + test a `course_access` grant end-to-end (MCP insert → step unlocks).
4. Verify with Clerk's test card: subscribe → unlock; cancel → lock; grant → unlock without plan.
**Checkpoint: both payment rails open the same doors.**

### Phase 3 — Student surface (me, ~1 h)
1. `/steps` index: per-step progress (ticked counts, completion) from `student_progress`, locked/unlocked states, course grouping.
2. Profile capture on first visit (university/year → `profiles` upsert; skippable).
**Checkpoint: a student sees where they are in the course.**

### Phase 4 — Ship & sweep (me, ~45 min)
1. E2E as a fake student (desktop + 390px mobile): sign up → subscribe (test) → read → tick → complete → progress reflects.
2. Docs sweep: `platform/AGENTS.md` (new content plane), `PROJECT_MEMORY.md` (session log), `README.md` + `Operations/pricing-strategy.md` (BOO-7 executed: platform is the paid product; two payment rails), this file marked DONE.
3. Merge final PR. Production deploy. Confirm on the live URL.
**Definition of done for today:** a stranger with a link can sign up, pay (test card) **or** be granted access after mobile-money payment, read every published step from the database with the full reading experience, and their progress persists to their account.

### Explicitly deferred (tomorrow+)
- Quizzes off the tick data (`quiz_attempts` is scaffolded).
- Admin grants page (grants via MCP/SQL today).
- Custom domain (kills the Zambian-carrier `*.vercel.app` aborts; also re-enables Vercel Standard Protection).
- Stripe production entity decision.
- Migrating remaining course PDFs (SM, BBA 1110) into web steps — the pipeline from Phase 1 makes each one a generate → publish command.

---

## 7. Risks & honest caveats

1. **Stripe/Zambia** is a business blocker, not a technical one — billing ships in test mode; mobile money + grants carry real revenue meanwhile.
2. **Template port** (Phase 1.2) is the biggest single task — 1,200 lines of CSS/JS moving from string-template to app assets. Mitigation: the JS is framework-free by design; it moves nearly verbatim, and Chromium screenshots gate the cutover.
3. **Cloud-session publishing** depends on the Supabase MCP (egress proxy blocks direct REST). Fallback: owner-side publish script with the service key.
4. **Clerk dev vs production instances** have separate keys; production Clerk instance needs a real domain for its own domain settings later — fine on `booklesss.vercel.app` for now.
5. Old revenue-log tier prices (K250/K500) contradict pricing-strategy (K360/K600) — pricing-strategy is newer and explicitly reaffirmed; revenue-log gets corrected in the Phase 4 sweep.

**Sources:** [Clerk Billing overview](https://clerk.com/docs/guides/billing/overview) · [Clerk Billing B2C (Next.js)](https://clerk.com/docs/nextjs/guides/billing/for-b2c) · [Supabase third-party auth: Clerk](https://supabase.com/docs/guides/auth/third-party/clerk) · [Supabase third-party auth overview](https://supabase.com/docs/guides/auth/third-party/overview) · [Stripe global availability](https://stripe.com/global) · installed SDK `@clerk/nextjs@7.5.18` (exports `PricingTable`, `auth().has`).
