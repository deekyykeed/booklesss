<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## No dashboard — deliberate

The dashboard app (`app/(app)/`, components/, lesson reader, community panel)
was deliberately deleted in July 2026. Do not rebuild it. The platform is:
Clerk auth (`/sign-in`, `/sign-up`), `/pricing`, the DB-driven step pages
(`/steps/[slug]`) + `/steps` index, and the data routes (`/api/step-feedback`,
`/api/outcome-ticks`, `/api/profile`). Students arrive via step links posted
in Slack.

## Content plane: steps live in Supabase (2026-07-15)

Step content is rows in `public.steps` (body HTML + metadata + tap-define
glossary/brand + per-step `extra_js`), NOT static files. Authoring stays in
the repo: `content_*.py` → `generate_step.py --emit-json` → publish the
payload (gitignored `_dev/tmp/steps-json/`) into the table — from cloud
sessions via the **Supabase MCP** (the egress proxy blocks the project's
REST host; see the ERR_CONNECTION notes below for the same wall).

`app/steps/[slug]/page.tsx` renders a row inside the shared shell. The shell
was ported out of `_dev/step-generator/template.html` by `port_shell.py`
(re-run it if the template changes): `step.css` (design system + embedded
fonts; the body rule is scoped to `.step-shell`), `public/step-client.js`
(tap-define, tickable outcomes, rate/complete — reads `window.__STEP__`),
and `shell-parts.json` (icon sprite, tip, voice orb).

Old links survive: `/steps/<slug>.html` 308-redirects to `/steps/<slug>`
(`next.config.ts` — redirects run before `/public`).

**Access** (`lib/access.ts`, single policy point): `public` rows → anyone;
`internal` (ops docs like revenue-model) → Clerk `publicMetadata.role='owner'`
only; `members` → Clerk Billing plan (`has({plan:'community'|'notes'})`) OR a
manual `course_access` grant — the **mobile-money rail**: student pays via
WhatsApp/MoMo, owner inserts the grant row, same door opens. Locked students
get a teaser + `/pricing` (Clerk `<PricingTable/>`). Steps RLS is the
backstop: published-only, anon sees `public` rows only.

## Auth: Clerk for identity, Supabase for data (2026-07-15)

**Clerk owns identity and the auth UI.** `/sign-in` and `/sign-up` render
Clerk's `<SignIn/>`/`<SignUp/>` components (branded via `<ClerkProvider>`
`appearance` in `app/layout.tsx`). There are no hand-rolled auth pages — Clerk
handles sign-in, sign-up, email verification, and password reset. (This
replaced the short-lived Supabase-auth login on 2026-07-15.)

**Supabase is data-only.** No Supabase Auth. Clerk is registered as a Supabase
**third-party auth provider**, so the Clerk session token is accepted by
Supabase and RLS keys every row to the Clerk user id via `auth.jwt()->>'sub'`
(user-id columns are `text` Clerk ids like `user_2…`, not uuids). API routes
read `auth().userId` from Clerk and query Supabase through a client that
forwards the Clerk token (`lib/supabase/server.ts`).

**Steps are gated.** `proxy.ts` (Clerk `clerkMiddleware`) requires a Clerk
session for `/steps` and every `/steps/*` page (including the static HTML) and
redirects signed-out visitors to `/sign-in` (Clerk appends the return URL).
Root `/` → `/steps`. The gate is **fail-soft**: with no Clerk keys
(`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`) it degrades to just
the root redirect and `<ClerkProvider>` is skipped, so an unconfigured deploy
still builds and serves steps rather than 500ing.

**Env vars** (Vercel, Production + Preview): `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`,
`CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`,
`NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, plus `NEXT_PUBLIC_SUPABASE_URL` /
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. Optional `CLERK_SUPABASE_JWT_TEMPLATE` if the
Clerk↔Supabase link uses a named JWT template instead of the native
integration. Dashboard wiring: enable the Clerk↔Supabase integration in Clerk,
and add Clerk as a third-party auth provider in Supabase → Authentication.

## Deployment (Vercel)

Project `booklesss` on the owner's personal team (Hobby plan), root directory
`platform`, production domain `booklesss.vercel.app`. `main` → production;
every PR gets a preview deploy. Rollback = one click on any prior deployment
in the Vercel dashboard.

**"This site can't be reached" / 403 on the production URL is almost always
Deployment Protection — not a code bug or a bad network.** Settings →
Deployment Protection → Vercel Authentication has a **"Standard Protection"**
mode whose fine print reads *"Protect all except production Custom Domains."*
We have **no custom domain** — `booklesss.vercel.app` is a Vercel *system*
domain, not a custom one — so Standard Protection gates production too, and
students (anyone not logged into the owner's Vercel team) get blocked. The
tell: a `?_vercel_share=…` link opens the page fine while the plain URL fails.

Fix while on Hobby with no custom domain: turn the **"Require Log In" toggle
OFF** and Save. Preview URLs become public too, but they're unguessable hashes
and the content is study notes — nothing to protect. Re-enable Standard
Protection only after a real custom domain is added (e.g. `booklesss.co.zm`);
then it does the intended thing — previews gated, production public.

### ERR_CONNECTION_ABORTED on a phone — diagnose before touching anything

Seen 2026-07-13: the owner's phone showed "This site can't be reached /
ERR_CONNECTION_ABORTED" on `booklesss.vercel.app` while the site was healthy
and public. Chrome's wording ("may have moved permanently") is misleading —
that error means the TCP/TLS connection was cut mid-request **on the client's
side of the wire**, not that the server refused or the page is gone.
Deployment Protection produces an HTTP **403 with a Vercel login page** (a
page that loads); a connection *abort* is a different animal — carrier or
device. The owner's screenshots showed the tells: roaming indicator ("R") and
battery saver territory. It cleared on its own when network conditions changed.

Diagnosis order that works from a cloud session:

1. **Verify the server first, via the Vercel MCP** — `list_deployments`
   (project `prj_toM064SqDde7cyNuqzsLMfCpYvxd`, team
   `deekymvula-gmailcoms-projects`): latest `target: "production"` deployment
   `state: "READY"` = the site is built and serving. Protection state is in
   Settings → Deployment Protection (screenshots from the owner beat guessing).
2. **Do NOT trust curl/WebFetch 403s from the cloud sandbox.** The session's
   egress proxy blocks `*.vercel.app` outright — `curl` shows
   `CONNECT tunnel failed, response 403`, and WebFetch reports plain "403
   Forbidden". Those are the *sandbox's* proxy, not Vercel, and prove nothing
   about public reachability. `curl -sS "$HTTPS_PROXY/__agentproxy/status"`
   lists what the proxy recently rejected. The Vercel API/MCP is reachable —
   it is the only trustworthy window on deploy health from inside a session.
3. **If the server is READY + public, the problem is the client's network.**
   Have them switch Wi-Fi ↔ mobile data (roaming carriers abort HTTPS),
   disable battery saver, try incognito or another device.
4. **The permanent fix is a custom domain.** Recurring aborts on
   `*.vercel.app` from Zambian mobile carriers match a widely reported
   pattern: some ISPs block or interfere with Vercel's shared
   `.vercel.app` hostname and its `76.76.21.0/24` IP range, and the
   community-documented cure is serving the site from a custom domain,
   ideally on Cloudflare DNS (CNAME `cname.vercel-dns.com`), so traffic
   never touches the blocked name/range. See Vercel community reports of
   ISP-blocked ranges and the Cloudflare-DNS workaround. Buying
   `booklesss.co.zm` (or a .com) kills this class of failure for every
   student — and once it exists, Standard Protection can go back on (see
   above). Device-level stopgap for one person: Android Private DNS →
   `one.one.one.one`.
5. **Persistent cases:** Vercel support's official diagnostic —
   `github.com/vercel-support/vercel-connect-debug`. Run it on the affected
   machine, not in a session (see #2). Windows PowerShell:
   `Invoke-RestMethod -Uri https://raw.githubusercontent.com/vercel-support/vercel-connect-debug/main/vercel-debug.ps1 | Invoke-Expression | tee vercel-debug.txt`
   (Mac/Linux: same URL pattern with `vercel-debug.sh | bash`). Takes up to
   15 min, writes `vercel-debug.txt` for a support case — or paste it into a
   session for interpretation.

`next.config.ts` sends security headers on every route (incl. the static step
pages): a CSP locked to `'self'` + the Google/DuckDuckGo favicon services,
`nosniff`, `SAMEORIGIN`, strict referrer policy, and a Permissions-Policy that
reserves `microphone=(self)` for the future voice tutor. The **CSP is
production-only** (`VERCEL_ENV === "production"`) so the Vercel preview toolbar
keeps working on previews — expect no CSP header on preview deploys; that's
intentional. Voice tutor will need script-src + connect-src (incl. `wss:`)
additions for unpkg.com / elevenlabs.io.

`/api/step-feedback` fail-softs when the Supabase env vars are absent (GET →
`{authenticated:false}`, POST → 503). Without that guard `createClient()`
throws and every step page 500s, since the static pages fetch it on load.
