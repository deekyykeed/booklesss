-- ============================================================
-- Booklesss schema — steps-only platform (canonical, minimal)
-- Bootstraps a fresh Supabase project in one run.
--
-- Identity is Clerk (configured as a Supabase third-party auth
-- provider): user ids are Clerk user ids (text, e.g. 'user_2ab…')
-- and RLS reads the Clerk id from the JWT `sub` claim. Supabase
-- holds step CONTENT (public.steps — authored in the repo, published
-- here, rendered at /steps/[slug]) plus per-student state.
-- ============================================================

-- ── Profiles (signup metadata) ─────────────────────────────
create table if not exists public.profiles (
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

-- ── Step feedback: rating + completion per student per step ─
create table if not exists public.step_feedback (
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

-- ── Outcome ticks: ticked outcome indices per student per step ─
create table if not exists public.outcome_ticks (
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

-- ── Quiz attempts (dormant — scaffolded for personalised quizzes) ─
create table if not exists public.quiz_attempts (
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
create index if not exists quiz_attempts_user_idx on public.quiz_attempts (user_id, step_slug);

-- ── Progress roll-up (security_invoker: caller sees only own rows) ─
create or replace view public.student_progress
  with (security_invoker = on) as
select
  coalesce(f.user_id, t.user_id)     as user_id,
  coalesce(f.step_slug, t.step_slug) as step_slug,
  coalesce(f.completed, false)       as completed,
  f.rating,
  coalesce(array_length(t.ticked, 1), 0) as outcomes_ticked,
  greatest(coalesce(f.updated_at, t.updated_at), coalesce(t.updated_at, f.updated_at)) as last_activity
from public.step_feedback f
full join public.outcome_ticks t
  on t.user_id = f.user_id and t.step_slug = f.step_slug;

-- ── Step content: the platform's content plane ─────────────
-- Authored in the repo (Python pipeline), published here, rendered
-- by the Next.js app at /steps/[slug].
create table if not exists public.steps (
  slug         text primary key check (slug ~ '^[a-z0-9-]{1,64}$'),
  course_code  text not null check (course_code ~ '^[a-z]{2,4}$'),
  lesson       int,
  step_label   text,
  title        text not null,
  description  text,
  body_html    text not null,
  outcomes     jsonb not null default '[]',
  added_value  jsonb not null default '[]',
  course_chip  text,
  eyebrow      text,
  minutes      int,
  glossary     jsonb not null default '{}',
  brand        jsonb not null default '{}',
  extra_js     text,
  access       text not null default 'members'
               check (access in ('public','members','internal')),
  status       text not null default 'draft'
               check (status in ('draft','published','archived')),
  version      int not null default 1,
  published_at timestamptz,
  updated_at   timestamptz not null default now()
);
alter table public.steps enable row level security;
create policy "read published public" on public.steps for select
  using (status = 'published' and access = 'public');
create policy "read published members" on public.steps for select to authenticated
  using (status = 'published' and access in ('members','internal'));
create index if not exists steps_course_idx on public.steps (course_code, lesson, step_label);

-- ── Course access (dormant — not enforced at launch) ───────
create table if not exists public.course_access (
  user_id     text not null,                    -- Clerk user id
  course_code text not null check (course_code ~ '^[a-z]{2,4}$'), -- 'tm','sm','cf','bba'
  granted_at  timestamptz not null default now(),
  primary key (user_id, course_code)
);
alter table public.course_access enable row level security;
create policy "read own access" on public.course_access for select to authenticated using ((auth.jwt()->>'sub') = user_id);
-- Writes via service role / SQL editor only: no insert policy.
