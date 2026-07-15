-- Re-key the data plane from Supabase Auth to Clerk.
--
-- Clerk now owns identity (as a Supabase third-party auth provider), so user
-- ids are Clerk user ids (text, e.g. 'user_2ab…'), not Supabase auth.users
-- uuids. RLS reads the Clerk id from the JWT `sub` claim instead of auth.uid().
--
-- Safe to run destructively here: these tables held no rows (auth was never
-- switched on under the Supabase setup). Drop + recreate keeps it clean.

drop view if exists public.student_progress;
drop table if exists public.profiles cascade;
drop table if exists public.step_feedback cascade;
drop table if exists public.outcome_ticks cascade;
drop table if exists public.quiz_attempts cascade;
drop table if exists public.course_access cascade;

-- Clerk user id helper: the raw `sub` claim (text), not auth.uid() (uuid).
-- Inlined in each policy below rather than a function, to keep it obvious.

-- ── Profiles ───────────────────────────────────────────────
create table public.profiles (
  id            text primary key,               -- Clerk user id
  display_name  text,
  university    text check (university in ('ZCAS', 'UNZA')),
  year_of_study int,
  created_at    timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "read own profile"   on public.profiles for select to authenticated using ((auth.jwt()->>'sub') = id);
create policy "insert own profile" on public.profiles for insert to authenticated with check ((auth.jwt()->>'sub') = id);
create policy "update own profile" on public.profiles for update to authenticated using ((auth.jwt()->>'sub') = id) with check ((auth.jwt()->>'sub') = id);

-- ── Step feedback ──────────────────────────────────────────
create table public.step_feedback (
  user_id    text not null,                     -- Clerk user id
  step_slug  text not null check (step_slug ~ '^[a-z0-9-]{1,64}$'),
  rating     smallint check (rating between 1 and 5),
  completed  boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, step_slug)
);
alter table public.step_feedback enable row level security;
create policy "read own feedback"   on public.step_feedback for select to authenticated using ((auth.jwt()->>'sub') = user_id);
create policy "insert own feedback" on public.step_feedback for insert to authenticated with check ((auth.jwt()->>'sub') = user_id);
create policy "update own feedback" on public.step_feedback for update to authenticated using ((auth.jwt()->>'sub') = user_id) with check ((auth.jwt()->>'sub') = user_id);

-- ── Outcome ticks ──────────────────────────────────────────
create table public.outcome_ticks (
  user_id    text not null,                     -- Clerk user id
  step_slug  text not null check (step_slug ~ '^[a-z0-9-]{1,64}$'),
  ticked     int[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, step_slug)
);
alter table public.outcome_ticks enable row level security;
create policy "read own ticks"   on public.outcome_ticks for select to authenticated using ((auth.jwt()->>'sub') = user_id);
create policy "insert own ticks" on public.outcome_ticks for insert to authenticated with check ((auth.jwt()->>'sub') = user_id);
create policy "update own ticks" on public.outcome_ticks for update to authenticated using ((auth.jwt()->>'sub') = user_id) with check ((auth.jwt()->>'sub') = user_id);

-- ── Quiz attempts (dormant scaffold) ───────────────────────
create table public.quiz_attempts (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null,                     -- Clerk user id
  step_slug  text not null check (step_slug ~ '^[a-z0-9-]{1,64}$'),
  score      smallint check (score between 0 and 100),
  total      smallint,
  correct    smallint,
  answers    jsonb,
  created_at timestamptz not null default now()
);
alter table public.quiz_attempts enable row level security;
create policy "read own attempts"   on public.quiz_attempts for select to authenticated using ((auth.jwt()->>'sub') = user_id);
create policy "insert own attempts" on public.quiz_attempts for insert to authenticated with check ((auth.jwt()->>'sub') = user_id);
create index quiz_attempts_user_idx on public.quiz_attempts (user_id, step_slug);

-- ── Progress roll-up (security_invoker: caller sees only own rows) ─
create view public.student_progress
  with (security_invoker = on) as
select
  f.user_id, f.step_slug, f.completed, f.rating,
  coalesce(array_length(t.ticked, 1), 0) as outcomes_ticked,
  greatest(f.updated_at, coalesce(t.updated_at, f.updated_at)) as last_activity
from public.step_feedback f
left join public.outcome_ticks t
  on t.user_id = f.user_id and t.step_slug = f.step_slug;

-- ── Course access (dormant — not enforced at launch) ───────
create table public.course_access (
  user_id     text not null,                    -- Clerk user id
  course_code text not null check (course_code ~ '^[a-z]{2,4}$'),
  granted_at  timestamptz not null default now(),
  primary key (user_id, course_code)
);
alter table public.course_access enable row level security;
create policy "read own access" on public.course_access for select to authenticated using ((auth.jwt()->>'sub') = user_id);
