-- ============================================================
-- Booklesss schema
-- Run in Supabase SQL Editor: dashboard → SQL Editor → New Query
-- ============================================================

create table if not exists courses (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  school      text not null check (school in ('ZCAS', 'UNZA')),
  cover_color text not null,
  accent_color text not null,
  created_at  timestamptz default now()
);

create table if not exists lessons (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses(id) on delete cascade,
  slug        text not null,
  title       text not null,
  order_index integer not null,
  created_at  timestamptz default now(),
  unique (course_id, slug)
);

create table if not exists steps (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references lessons(id) on delete cascade,
  slug        text not null,
  title       text not null,
  order_index integer not null,
  pdf_url     text,
  content     jsonb,
  created_at  timestamptz default now(),
  unique (lesson_id, slug)
);

create table if not exists glossary (
  id          uuid primary key default gen_random_uuid(),
  term        text not null,
  definition  text not null,
  course_id   uuid references courses(id) on delete set null,
  created_at  timestamptz default now()
);

create table if not exists profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  display_name   text,
  university     text check (university in ('ZCAS', 'UNZA')),
  year_of_study  integer,
  created_at     timestamptz default now()
);

create table if not exists enrollments (
  user_id     uuid not null references profiles(id) on delete cascade,
  course_id   uuid not null references courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  primary key (user_id, course_id)
);

create table if not exists bookmarks (
  user_id   uuid not null references profiles(id) on delete cascade,
  step_id   uuid not null references steps(id) on delete cascade,
  saved_at  timestamptz default now(),
  primary key (user_id, step_id)
);

-- ── Seed courses ────────────────────────────────────────────
insert into courses (slug, name, school, cover_color, accent_color) values
  ('strategic-management', 'Strategic Management', 'ZCAS', '#0F1F35', '#DC2626'),
  ('treasury-management',  'Treasury Management',  'ZCAS', '#0B1D3A', '#10B981'),
  ('corporate-finance',    'Corporate Finance',    'ZCAS', '#FFFEF2', '#2FB99A'),
  ('bba-1110',             'BBA 1110',             'UNZA', '#1C2526', '#F59E0B')
on conflict (slug) do nothing;

create table if not exists exams (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid references courses(id) on delete cascade,
  title      text not null,
  year       integer not null,
  session    text not null,
  pdf_url    text,
  created_at timestamptz default now()
);

create table if not exists step_completions (
  user_id      uuid not null references profiles(id) on delete cascade,
  step_id      uuid not null references steps(id) on delete cascade,
  completed_at timestamptz default now(),
  primary key (user_id, step_id)
);

-- ── RLS: enable for all tables ──────────────────────────────
alter table courses          enable row level security;
alter table lessons          enable row level security;
alter table steps            enable row level security;
alter table glossary         enable row level security;
alter table profiles         enable row level security;
alter table enrollments      enable row level security;
alter table bookmarks        enable row level security;
alter table exams            enable row level security;
alter table step_completions enable row level security;

-- Public read access for course content
create policy "public read courses"  on courses  for select using (true);
create policy "public read lessons"  on lessons  for select using (true);
create policy "public read steps"    on steps    for select using (true);
create policy "public read glossary" on glossary for select using (true);

-- Profiles: own row only
create policy "profiles: own row" on profiles
  for all using (auth.uid() = id);

-- Enrollments: own rows only
create policy "enrollments: own rows" on enrollments
  for all using (auth.uid() = user_id);

-- Bookmarks: own rows only
create policy "bookmarks: own rows" on bookmarks
  for all using (auth.uid() = user_id);

-- Exams: public read
create policy "public read exams" on exams for select using (true);

-- Step completions: own rows only
create policy "step_completions: own rows" on step_completions
  for all using (auth.uid() = user_id);
