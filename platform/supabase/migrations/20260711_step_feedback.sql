-- Per-student rating + completion for course steps.
-- Run once in the Booklesss Supabase project (SQL editor or CLI migration).

create table if not exists public.step_feedback (
  user_id uuid not null references auth.users (id) on delete cascade,
  step_slug text not null check (step_slug ~ '^[a-z0-9-]{1,64}$'),
  rating smallint check (rating between 1 and 5),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, step_slug)
);

alter table public.step_feedback enable row level security;

create policy "read own feedback"
  on public.step_feedback for select
  using (auth.uid() = user_id);

create policy "insert own feedback"
  on public.step_feedback for insert
  with check (auth.uid() = user_id);

create policy "update own feedback"
  on public.step_feedback for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
