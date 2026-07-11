-- Slim the Booklesss Supabase project to the steps-only platform.
-- Run once in the Booklesss project's SQL editor, AFTER the slimmed
-- platform deploy is live (the old deploy still queries these tables).

-- 1. Rescue old completions into step_feedback (skip silently if the
--    legacy tables are already gone or slugs don't match).
do $$
begin
  if to_regclass('public.step_completions') is not null
     and to_regclass('public.steps') is not null then
    insert into public.step_feedback (user_id, step_slug, completed)
    select sc.user_id, s.slug, true
    from public.step_completions sc
    join public.steps s on s.id = sc.step_id
    where s.slug ~ '^[a-z0-9-]{1,64}$'
    on conflict (user_id, step_slug) do update set completed = true;
  end if;
end $$;

-- 2. Drop everything the dashboard used. Content now lives as static
--    files in the repo; Supabase keeps only auth + per-student state.
drop function if exists public.course_activity_heatmap(uuid, int);
drop function if exists public.course_roster(uuid);

drop table if exists public.lesson_files cascade;
drop table if exists public.lesson_messages cascade;
drop table if exists public.exams cascade;
drop table if exists public.step_completions cascade;
drop table if exists public.bookmarks cascade;
drop table if exists public.enrollments cascade;
drop table if exists public.glossary cascade;
drop table if exists public.steps cascade;
drop table if exists public.lessons cascade;
drop table if exists public.courses cascade;

-- 3. Dormant per-course access table. NOT enforced at launch — Slack
--    membership is the gate. When paid tiers need enforcement, the
--    middleware adds a prefix check against this table.
create table if not exists public.course_access (
  user_id     uuid not null references auth.users (id) on delete cascade,
  course_code text not null check (course_code ~ '^[a-z]{2,4}$'), -- 'tm','sm','cf','bba'
  granted_at  timestamptz not null default now(),
  primary key (user_id, course_code)
);

alter table public.course_access enable row level security;

create policy "read own access"
  on public.course_access for select
  using (auth.uid() = user_id);

-- Writes happen via the service role / SQL editor only: no insert policy.
