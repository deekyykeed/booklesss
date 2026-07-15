-- ============================================================
-- Booklesss schema — steps-only platform (canonical, minimal)
-- Bootstraps a fresh Supabase project in one run.
--
-- Content does NOT live in the database: steps are static HTML
-- files in platform/public/steps/, generated from content files
-- in the repo. Supabase holds auth + per-student state only.
-- ============================================================

-- ── Profiles (signup metadata) ─────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  university   text check (university in ('ZCAS', 'UNZA')),
  year_of_study int,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "update own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- ── Step feedback: rating + completion per student per step ─
create table if not exists public.step_feedback (
  user_id    uuid not null references auth.users (id) on delete cascade,
  step_slug  text not null check (step_slug ~ '^[a-z0-9-]{1,64}$'),
  rating     smallint check (rating between 1 and 5),
  completed  boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, step_slug)
);

alter table public.step_feedback enable row level security;

create policy "read own feedback"
  on public.step_feedback for select using (auth.uid() = user_id);
create policy "insert own feedback"
  on public.step_feedback for insert with check (auth.uid() = user_id);
create policy "update own feedback"
  on public.step_feedback for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Outcome ticks: which "you should now be able to" items a
--    student has checked off, per step (array of outcome indices) ─
create table if not exists public.outcome_ticks (
  user_id    uuid not null references auth.users (id) on delete cascade,
  step_slug  text not null check (step_slug ~ '^[a-z0-9-]{1,64}$'),
  ticked     int[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, step_slug)
);

alter table public.outcome_ticks enable row level security;

create policy "read own ticks"
  on public.outcome_ticks for select using (auth.uid() = user_id);
create policy "insert own ticks"
  on public.outcome_ticks for insert with check (auth.uid() = user_id);
create policy "update own ticks"
  on public.outcome_ticks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Quiz attempts (dormant — no quiz UI yet, scaffolded for the
--    next phase where tick data drives personalised quizzes) ──
create table if not exists public.quiz_attempts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  step_slug  text not null check (step_slug ~ '^[a-z0-9-]{1,64}$'),
  score      smallint check (score between 0 and 100),
  total      smallint,
  correct    smallint,
  answers    jsonb,
  created_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

create policy "read own attempts"
  on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "insert own attempts"
  on public.quiz_attempts for insert with check (auth.uid() = user_id);

create index if not exists quiz_attempts_user_idx
  on public.quiz_attempts (user_id, step_slug);

-- ── Progress roll-up (security_invoker: caller sees only own rows) ─
create or replace view public.student_progress
  with (security_invoker = on) as
select
  f.user_id, f.step_slug, f.completed, f.rating,
  coalesce(array_length(t.ticked, 1), 0) as outcomes_ticked,
  greatest(f.updated_at, coalesce(t.updated_at, f.updated_at)) as last_activity
from public.step_feedback f
left join public.outcome_ticks t
  on t.user_id = f.user_id and t.step_slug = f.step_slug;

-- ── Course access (dormant — not enforced at launch) ────────
create table if not exists public.course_access (
  user_id     uuid not null references auth.users (id) on delete cascade,
  course_code text not null check (course_code ~ '^[a-z]{2,4}$'), -- 'tm','sm','cf','bba'
  granted_at  timestamptz not null default now(),
  primary key (user_id, course_code)
);

alter table public.course_access enable row level security;

create policy "read own access"
  on public.course_access for select using (auth.uid() = user_id);
-- Writes via service role / SQL editor only: no insert policy.
