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
  user_id     uuid not null references profiles(id) on delete cascade,
  step_id     uuid not null references steps(id) on delete cascade,
  saved_at    timestamptz default now(),
  primary key (user_id, step_id)
);

create table if not exists step_completions (
  user_id      uuid not null references profiles(id) on delete cascade,
  step_id      uuid not null references steps(id) on delete cascade,
  completed_at timestamptz default now(),
  primary key (user_id, step_id)
);

create table if not exists exams (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid references courses(id) on delete cascade,
  title       text not null,
  year        integer not null,
  session     text not null,
  pdf_url     text,
  created_at  timestamptz default now()
);

-- Community: per-lesson discussion and link-sharing between course-mates.
-- Link-sharing, not binary upload — no Supabase Storage integration exists.
create table if not exists lesson_messages (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references lessons(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz default now()
);

create table if not exists lesson_files (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references lessons(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  title       text not null,
  url         text not null,
  created_at  timestamptz default now()
);

-- ── Seed courses ────────────────────────────────────────────
insert into courses (slug, name, school, cover_color, accent_color) values
  ('strategic-management', 'Strategic Management', 'ZCAS', '#0F1F35', '#DC2626'),
  ('treasury-management',  'Treasury Management',  'ZCAS', '#0B1D3A', '#10B981'),
  ('corporate-finance',    'Corporate Finance',    'ZCAS', '#FFFEF2', '#2FB99A'),
  ('bba-1110',             'BBA 1110',             'UNZA', '#1C2526', '#F59E0B')
on conflict (slug) do nothing;

-- ── RLS: enable for all tables ──────────────────────────────
alter table courses           enable row level security;
alter table lessons           enable row level security;
alter table steps             enable row level security;
alter table glossary          enable row level security;
alter table profiles          enable row level security;
alter table enrollments       enable row level security;
alter table bookmarks         enable row level security;
alter table step_completions  enable row level security;
alter table exams             enable row level security;
alter table lesson_messages   enable row level security;
alter table lesson_files      enable row level security;

-- Public read access for course content
create policy "public read courses"  on courses  for select using (true);
create policy "public read lessons"  on lessons  for select using (true);
create policy "public read steps"    on steps    for select using (true);
create policy "public read glossary" on glossary for select using (true);
create policy "public read exams"    on exams    for select using (true);

-- Profiles: own row always; course-mates can read display_name/university
-- (powers the real Members/roster tab — no other columns are exposed by
-- the app's queries, and this is an additional SELECT policy, not a
-- replacement for the "own row" ALL policy below).
create policy "profiles: own row" on profiles
  for all using (auth.uid() = id);

create policy "profiles: course-mates readable" on profiles
  for select using (
    exists (
      select 1 from enrollments e1
      join enrollments e2 on e1.course_id = e2.course_id
      where e1.user_id = auth.uid() and e2.user_id = profiles.id
    )
  );

-- Enrollments: own rows only
create policy "enrollments: own rows" on enrollments
  for all using (auth.uid() = user_id);

-- Bookmarks: own rows only
create policy "bookmarks: own rows" on bookmarks
  for all using (auth.uid() = user_id);

-- Step completions: own rows only
create policy "step_completions: own rows" on step_completions
  for all using (auth.uid() = user_id);

-- Lesson messages / files: readable and postable by anyone enrolled in
-- the lesson's course (course-mates only, not the general public).
create policy "lesson_messages: course members read" on lesson_messages
  for select using (
    exists (
      select 1 from lessons l
      join enrollments e on e.course_id = l.course_id
      where l.id = lesson_messages.lesson_id and e.user_id = auth.uid()
    )
  );
create policy "lesson_messages: course members post" on lesson_messages
  for insert with check (
    user_id = auth.uid() and exists (
      select 1 from lessons l
      join enrollments e on e.course_id = l.course_id
      where l.id = lesson_messages.lesson_id and e.user_id = auth.uid()
    )
  );

create policy "lesson_files: course members read" on lesson_files
  for select using (
    exists (
      select 1 from lessons l
      join enrollments e on e.course_id = l.course_id
      where l.id = lesson_files.lesson_id and e.user_id = auth.uid()
    )
  );
create policy "lesson_files: course members post" on lesson_files
  for insert with check (
    user_id = auth.uid() and exists (
      select 1 from lessons l
      join enrollments e on e.course_id = l.course_id
      where l.id = lesson_files.lesson_id and e.user_id = auth.uid()
    )
  );

-- ── Community activity heatmap ───────────────────────────────
-- Returns aggregate per-day activity counts for a course (bookmarks +
-- completions combined) without exposing which student did what — avoids
-- needing a broader course-mates read policy on bookmarks/step_completions.
create or replace function course_activity_heatmap(p_course_id uuid, p_days int default 35)
returns table (day date, activity_count bigint)
language sql
security definer
set search_path = public
as $$
  with days as (
    select generate_series(current_date - (p_days - 1), current_date, interval '1 day')::date as day
  ),
  activity as (
    select date(b.saved_at) as day
    from bookmarks b
    join steps s on s.id = b.step_id
    join lessons l on l.id = s.lesson_id
    where l.course_id = p_course_id
    union all
    select date(sc.completed_at) as day
    from step_completions sc
    join steps s on s.id = sc.step_id
    join lessons l on l.id = s.lesson_id
    where l.course_id = p_course_id
  )
  select d.day, count(a.day) as activity_count
  from days d
  left join activity a on a.day = d.day
  group by d.day
  order by d.day;
$$;

grant execute on function course_activity_heatmap(uuid, int) to authenticated;

-- ── Course roster ─────────────────────────────────────────────
-- Returns course-mates' profile info for the Members/roster tab. The caller
-- must themselves be enrolled in the course (checked inside the function) —
-- enrollments RLS only exposes a user's own rows, so a plain join can't see
-- other students' enrollments; this function bridges that safely.
create or replace function course_roster(p_course_id uuid)
returns table (id uuid, display_name text, university text)
language sql
security definer
set search_path = public
as $$
  select p.id, p.display_name, p.university
  from enrollments e
  join profiles p on p.id = e.user_id
  where e.course_id = p_course_id
    and exists (
      select 1 from enrollments e2 where e2.course_id = p_course_id and e2.user_id = auth.uid()
    );
$$;

grant execute on function course_roster(uuid) to authenticated;
