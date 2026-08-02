# Section comments — the backend scope

**Written 2026-08-02.** A plan to approve, not code that exists. Nothing here is
built. The thing shipped in `71756e2` is a private notebox on one device; this
is what turns it into people talking.

---

## 1. What this is

A student finishes a section, has a thought, and writes it **against that
section**. Other students reading the same section see it, with a face and a
name, and can answer. Section-scoped, not step-scoped: "somewhere in these 2,000
words" is not a location, and the section id is already the key the checkpoint
and the note both use, so all three line up on the same seam.

**What it is not:** the note button (ⓘ). That asks a closed question — how did
this read — and its five answers map onto rules in `step-skill/RULES.md` so a
tally points at a rule. That stays private and stays separate. One is telling
*us* the writing is broken; the other is talking to *each other*. Do not merge
them.

---

## 2. The thing that has to be decided first: who is a commenter

Everything below hangs off this, and it is the only question I cannot answer for
you.

Today `lib/identity.tsx` asks for a name, a face, a school and their courses,
stores it on the device, and **deliberately never asks for an email or a
password** — a reader who has just landed on a lesson is the worst moment to put
a signup wall in front of. Clerk is off (session 27: it was a *development*
instance, ~100-user cap, cookies that broke on Safari and mobile).

Three ways forward:

| | How | Cost | Problem |
|---|---|---|---|
| **A. No auth** | Post with the device identity as-is | Nothing | Anyone can type any name. No way to prove a comment is yours, so no editing or deleting from a second device, and no defence at all against someone dumping abuse on a public URL |
| **B. Clerk, production instance** | Real accounts, email + password | A real custom domain, Clerk prod setup, a second bill | Puts a signup wall in front of reading, which is the exact thing identity.tsx was built to avoid |
| **C. Supabase anonymous auth** ⭐ | `signInAnonymously()` on first visit; the existing name + avatar become a `profiles` row | Free tier covers it | Anonymous users are cheap to create, so it needs rate limiting |

**Recommendation: C.** It is the only one that keeps the no-email-at-the-door
rule *and* gives the database a real `auth.uid()` to enforce ownership with. It
is one stack, already paid for, no Clerk. And the same session can later be
upgraded to a real account with `linkIdentity()` without the student losing
anything — which is also what unblocks **server-side progress**, the biggest
open gap on the backlog. Comments and progress ride the same rail; doing this
once does both.

---

## 3. Schema

```sql
-- Who is reading. One row per auth user, anonymous or not.
create table public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  avatar_id    text not null,
  school       text,
  created_at   timestamptz not null default now()
);

create table public.section_comments (
  id         uuid primary key default gen_random_uuid(),
  lesson_id  text not null,   -- as in course-nav.json
  section_id text not null,   -- the same id the checkpoint keys on
  author_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  parent_id  uuid references public.section_comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  edited_at  timestamptz,
  deleted_at timestamptz,     -- soft: a hard delete orphans the replies under it
  flag_count int not null default 0
);

create index on public.section_comments (lesson_id, section_id, created_at desc);
```

`parent_id` gives **one** level of replies. Deeper threading on a 390px screen
is unreadable, and every reply to a reply is really a new comment on the
section.

## 4. Row-level security

- **Read** — anyone, including a signed-out visitor, where `deleted_at is null`.
  The reader is public today; comments should not be the thing that gates it.
- **Insert** — `auth.uid() = author_id` only. You cannot post as someone else.
- **Update** — author only, `body` and `edited_at` only. Not the author id, not
  the timestamps, not the flag count.
- **Delete** — soft, author or moderator. A trigger sets `deleted_at`; the row
  survives so its replies still hang off something.

**Rate limits, in the database, not the client** (a client-side limit is a
suggestion): a trigger rejecting more than ~5 comments per section per author
and ~20 per hour. Anonymous auth means new identities are free, so this is the
whole spam defence and it has to exist before the first post, not after the
first incident.

## 5. Moderation

- A `comment_flags` table, unique on (comment, flagger).
- `flag_count` maintained by trigger; auto-hide at 3 pending review.
- A `moderators` table keyed on user id — you, to start.
- No moderation queue UI in phase 1. A hidden comment and a SQL editor is
  enough until there is traffic worth building a screen for.

---

## 6. ⚠️ The risk nobody would think of: section ids move

Splitting a step **changes its section ids**. TM 1.1 became three steps on
2026-08-01 and did exactly that. Forty-one of the forty-four steps are still
scheduled for rewrites (D-1/D-2/D-3), and every rewrite that renames or merges a
section silently orphans every comment attached to it.

The comments do not break — they just stop appearing, with no error and nothing
in the UI to say a hundred comments went missing.

**Decide the policy before the first comment is posted**, not after:

- `seed:course` already knows the old and new section lists on every publish. It
  should **refuse to publish, or warn loudly, when a section carrying comments
  disappears** — the same shape as the guard it already has for a bad icon name
  and an em-dash count.
- Give the author an explicit remap when a section splits: old id → new id.
- Never silently drop. A comment is a student's writing; losing it quietly is
  worse than a publish that fails.

---

## 7. What gets built, in order

| Phase | What | Visible to a student |
|---|---|---|
| **0** | Decide §2 and §6 | — |
| **1** | Supabase anon auth + `profiles`; existing device identity mirrors up on first run | Nothing changes |
| **2** | `section_comments` + RLS + a counts query | Nothing changes |
| **3** | Read path: the thread renders under a section, composer disabled | Comments appear (seeded) |
| **4** | Post, edit, soft-delete, rate limits | Commenting works |
| **5** | Flags + moderator hide | — |
| **6** | The inline thread proper: count on the bubble, avatars, one level of replies | The thing you asked for |

Phase 3 before phase 4 on purpose: it puts real rows on a real screen so the
layout can be judged before any of the write path is built.

**Migration:** on first sign-in, push anything under
`booklesss:step-comments:v1` up as that user's comments, then clear the key.
Nothing written on a phone this week is lost.

---

## 8. Two constraints the build must not break

- **The reader is statically prerendered (SSG).** Comments are dynamic, so they
  are fetched client-side after mount. A step must render, and be readable, with
  the comment fetch failing or absent.
- **Offline-first (session 27).** Offline, comments are simply not there. The
  service worker must not cache a comment thread and show a stale one as
  though it were current.

---

## 9. Open questions for the owner

1. **Identity model** — A, B or C above. (I recommend C.)
2. **Who can read comments?** Everyone, or only students on that course? The
   reader is fully public and ungated today.
3. **Names.** Identity collects a freely typed first name. Two students called
   Chanda are indistinguishable, and nothing stops someone typing yours.
   Handles, or a surname initial, or accept the collision?
4. **Replies** — one level as scoped, or flat for now?
5. **Moderator** — you alone at first, or does this need a second pair of hands
   before it opens?
6. **§6 policy** — refuse-to-publish, or explicit remap, or both?
