-- Per-student outcome ticks + a dormant quiz-attempts table.
-- Run once in the Booklesss Supabase project (SQL editor or CLI migration).
--
-- outcome_ticks is the real backing store for the tickable "What you should
-- now be able to do" checklist on each step (until now it lived only in the
-- browser's localStorage). Ticks are stored as an array of outcome indices,
-- keyed per student per step — the seed for completion tracking that will
-- feed personalised quizzes and, later, verified competence signals.

-- ── Outcome ticks ──────────────────────────────────────────
create table if not exists public.outcome_ticks (
  user_id    uuid not null references auth.users (id) on delete cascade,
  step_slug  text not null check (step_slug ~ '^[a-z0-9-]{1,64}$'),
  ticked     int[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, step_slug)
);

alter table public.outcome_ticks enable row level security;

create policy "read own ticks"
  on public.outcome_ticks for select
  using (auth.uid() = user_id);

create policy "insert own ticks"
  on public.outcome_ticks for insert
  with check (auth.uid() = user_id);

create policy "update own ticks"
  on public.outcome_ticks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Quiz attempts (dormant — no quiz UI yet) ───────────────
-- Scaffolded now so the next phase (personalised quizzes off the tick data)
-- has somewhere to write. Nothing reads or writes this at launch.
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
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "insert own attempts"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

create index if not exists quiz_attempts_user_idx
  on public.quiz_attempts (user_id, step_slug);

-- ── Progress roll-up (one row per student per step) ────────
-- security_invoker so the view honours each caller's RLS instead of the
-- view owner's — a student sees only their own rows.
create or replace view public.student_progress
  with (security_invoker = on) as
select
  f.user_id,
  f.step_slug,
  f.completed,
  f.rating,
  coalesce(array_length(t.ticked, 1), 0) as outcomes_ticked,
  greatest(f.updated_at, coalesce(t.updated_at, f.updated_at)) as last_activity
from public.step_feedback f
left join public.outcome_ticks t
  on t.user_id = f.user_id and t.step_slug = f.step_slug;
