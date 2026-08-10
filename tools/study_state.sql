-- study state — what a student DOES, given a server home.
--
-- APPLIED TO THE BOOKLESSS SUPABASE PROJECT ON 2026-08-10 (migrations
-- `student_state_survives_the_device` and `advisor_fixes_and_feedback_views`).
-- This file is the record of what was applied, kept for the same reason
-- tools/section_reactions.sql is: the repo has no migrations folder, and the
-- alternative is a schema whose definition and reasoning exist only in a
-- dashboard. Re-running it is safe.
--
-- ── WHY IT EXISTS ──
--
-- Until this shipped, only who a student IS travelled with the account
-- (`students.identity`). Everything they DID — progress, saves, note verdicts,
-- typed comments — lived in localStorage alone. Four consequences, all bad and
-- all invisible until they bit:
--
--   · clearing a browser wiped a term's studying
--   · a new phone started from zero
--   · signing in on a second device showed a name and courses beside a
--     dashboard that said this student had never studied
--   · the typed comments — the ONLY free text the app collects, students
--     writing to us in their own words — could never be read by anybody
--
-- The competence-signal north star hangs off completion data, and completion
-- data in localStorage is not an asset. This is the fix.
--
-- NO HISTORY TO BACKFILL, same as section_reactions: the server's copy begins
-- with the first sync after this shipped. What is already on a student's device
-- is preserved, though — the client merges local into remote on first sign-in
-- rather than replacing it, so an existing reader's record is uploaded rather
-- than lost. See lib/state-sync.
--
-- ── THE CONTRACT ALL FOUR SHARE ──
--
--   · user_id comes from the VERIFIED session in /api/state, never the body
--     (`getUser()`, not a cookie's claims) — the only thing stopping one
--     signed-in student overwriting another's studying
--   · writes go through the service role; the browser never writes Supabase
--   · RLS select-own, so a second device can read ITS OWN rows back under the
--     anon key — exactly how students.identity is read
--   · on delete cascade: deleting the account deletes the studying with it
--
-- NOTE THE DIFFERENCE FROM section_reactions, which is RLS-on-no-policies.
-- These four have a SELECT policy because, unlike a reaction, this data is read
-- BACK BY THE STUDENT WHO WROTE IT. That is the whole feature. There is still no
-- insert/update/delete policy, and that omission is deliberate — see above.

-- ── Saved sections ────────────────────────────────────────────────────
-- The mirror of lib/saved. A row exists = saved; deleting it = un-saved. No
-- value column, because the row's existence IS the value.
create table if not exists public.saved_sections (
  user_id    uuid not null references auth.users (id) on delete cascade,
  lesson_id  text not null check (char_length(lesson_id) between 1 and 120),
  section_id text not null check (char_length(section_id) between 1 and 120),
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id, section_id)
);

comment on table public.saved_sections is
  'Sections a reader saved for later. Mirror of the device''s booklesss:saved:v1. Written by /api/saved with the service role; read back by its owner under RLS.';

-- ── Note verdicts ─────────────────────────────────────────────────────
-- One verdict per section per reader, the same one-row-you-own shape as
-- section_reactions. The five values are lib/step-notes' NoteId, and the CHECK
-- is the third copy of that list (the others: lib/study-state's NOTE_IDS, which
-- the route validates against, and NOTES in lib/step-notes). A disagreement
-- between them surfaces as a 400, not as a bad row.
create table if not exists public.section_notes (
  user_id    uuid not null references auth.users (id) on delete cascade,
  lesson_id  text not null check (char_length(lesson_id) between 1 and 120),
  section_id text not null check (char_length(section_id) between 1 and 120),
  note       text not null check (note in ('hard', 'long', 'example', 'wrong', 'clear')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id, section_id)
);

comment on table public.section_notes is
  'How the writing landed, in one of five taps. The tally points at a specific rule in step-skill/RULES.md rather than at a mood.';

-- ── Typed comments ────────────────────────────────────────────────────
-- Capped at 4000: the box is a few sentences, and an unbounded text column
-- reachable by any signed-in browser is a storage bill waiting to happen.
create table if not exists public.section_comments (
  user_id    uuid not null references auth.users (id) on delete cascade,
  lesson_id  text not null check (char_length(lesson_id) between 1 and 120),
  section_id text not null check (char_length(section_id) between 1 and 120),
  body       text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id, section_id)
);

comment on table public.section_comments is
  'A reader''s own words about one section. The only free text the app collects, and the only feedback channel that is not a tap.';

-- ── Progress ──────────────────────────────────────────────────────────
-- One row per student holding the whole lib/progress state as jsonb.
--
-- A BLOB, DELIBERATELY, where the three above are relational. Progress is
-- written by StudyClock every few seconds and merged as a whole (union of done,
-- per-day max of counters); shredding it into rows would mean write
-- amplification per tick and a merge across four tables, to gain a
-- queryability the study_days view below already provides.
create table if not exists public.student_progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  client_at  bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.student_progress is
  'The whole progress record (done checkpoints, study days, touched, grasp, last step) as jsonb, one row per student. Merged additively — see lib/study-state.';
comment on column public.student_progress.client_at is
  'The writing device''s own clock (ms). For merge ordering only; never trust it for auditing — use updated_at.';

-- ── RLS ───────────────────────────────────────────────────────────────
-- `(select auth.uid())` rather than a bare call so the planner evaluates it
-- once per query instead of once per row — the auth_rls_initplan lint, which
-- `students` and `student_courses` were both failing before this migration.
alter table public.saved_sections    enable row level security;
alter table public.section_notes     enable row level security;
alter table public.section_comments  enable row level security;
alter table public.student_progress  enable row level security;

create policy saved_sections_select_own on public.saved_sections
  for select to authenticated using ((select auth.uid()) = user_id);
create policy section_notes_select_own on public.section_notes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy section_comments_select_own on public.section_comments
  for select to authenticated using ((select auth.uid()) = user_id);
create policy student_progress_select_own on public.student_progress
  for select to authenticated using ((select auth.uid()) = user_id);

-- The PKs already cover "everything this user saved" (user_id leads). These
-- cover the OTHER direction — the question the tables exist to answer: which
-- sections lose people, which steps get flagged, where the comments are.
create index if not exists saved_sections_lesson_idx   on public.saved_sections   (lesson_id, section_id);
create index if not exists section_notes_lesson_idx    on public.section_notes    (lesson_id, section_id);
create index if not exists section_comments_lesson_idx on public.section_comments (lesson_id, section_id);

-- Same reasoning as section_reactions: lesson_id / section_id are TEXT and
-- deliberately NOT foreign keys to `lessons`. Section ids exist only inside a
-- lesson's JSONB, and `seed:course` rewrites a course's nav wholesale on every
-- publish, so a cascade would delete real answers every time a step was
-- re-seeded. An orphaned row is a much smaller problem than a deleted one.


-- ══ The advisor fixes that came with it ══════════════════════════════
-- Both were WARN-level auth_rls_initplan: a bare auth.uid() in a policy is
-- re-evaluated FOR EVERY ROW.
drop policy if exists students_select_own on public.students;
create policy students_select_own on public.students
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists student_courses_select_own on public.student_courses;
create policy student_courses_select_own on public.student_courses
  for select to authenticated using ((select auth.uid()) = student_id);

-- Unindexed foreign keys, both walked on delete and on join.
-- nav_nodes.parent_id is the sidebar tree's own recursion.
create index if not exists nav_nodes_parent_id_idx      on public.nav_nodes         (parent_id);
create index if not exists pipeline_subjects_course_idx on public.pipeline_subjects (course_id);


-- ══ The views ════════════════════════════════════════════════════════
-- security_invoker so they cannot be used to bypass the RLS on the tables
-- underneath — the rule the pipeline views already follow.

-- ── Which sections lose people ────────────────────────────────────────
-- What section_reactions was kept for, now with the saves and the flags beside
-- it: a section that is saved often and understood rarely is a different
-- problem from one that is simply flagged.
--
-- THE AUDIENCE IS WHOEVER REWRITES THE STEP, NEVER THE READER. Putting these
-- numbers on a step page re-opens a decision made on 2026-08-09 (counts came
-- off the checkpoint row — reading is a private question).
create or replace view public.section_signal
with (security_invoker = true) as
select
  coalesce(r.lesson_id, n.lesson_id, s.lesson_id)    as lesson_id,
  coalesce(r.section_id, n.section_id, s.section_id) as section_id,
  coalesce(r.got, 0)     as got,
  coalesce(r.not_yet, 0) as not_yet,
  coalesce(s.saves, 0)   as saves,
  coalesce(n.flags, 0)   as flags,
  n.top_note,
  case when coalesce(r.got, 0) + coalesce(r.not_yet, 0) = 0 then null
       else round(r.got::numeric / (r.got + r.not_yet), 3)
  end as grasp_rate
from (
  select lesson_id, section_id,
         count(*) filter (where grasp = 'got') as got,
         count(*) filter (where grasp = 'not') as not_yet
  from public.section_reactions group by 1, 2
) r
full join (
  select lesson_id, section_id, count(*) as flags,
         mode() within group (order by note) as top_note
  from public.section_notes group by 1, 2
) n on n.lesson_id = r.lesson_id and n.section_id = r.section_id
full join (
  select lesson_id, section_id, count(*) as saves
  from public.saved_sections group by 1, 2
) s on s.lesson_id = coalesce(r.lesson_id, n.lesson_id)
   and s.section_id = coalesce(r.section_id, n.section_id);

comment on view public.section_signal is
  'Per section: how it landed, how often it was saved, how often it was flagged. The audience is whoever REWRITES the step — never the reader.';

-- ── Study days ────────────────────────────────────────────────────────
-- Shredded out of the progress jsonb. This is what makes the blob decision
-- safe: the data is a document to the app and a table to a query.
create or replace view public.study_days
with (security_invoker = true) as
select
  p.user_id,
  d.key::date                                   as day,
  coalesce((d.value ->> 'checks')::int, 0)      as checks,
  coalesce((d.value ->> 'secs')::int, 0)        as secs,
  coalesce((d.value ->> 'steps')::int, 0)       as steps
from public.student_progress p,
     lateral jsonb_each(coalesce(p.state -> 'days', '{}'::jsonb)) d
where d.key ~ '^\d{4}-\d{2}-\d{2}$';

comment on view public.study_days is
  'One row per student per day of studying, read out of student_progress.state->days. The queryable face of the progress blob.';


-- ── Starting queries, run by hand ─────────────────────────────────────
--
-- The next thing to rewrite, worst first:
--
--   select * from public.section_signal
--    where got + not_yet >= 3
--    order by grasp_rate asc nulls last
--    limit 20;
--
-- What students actually WROTE, newest first — the only free text we get:
--
--   select lesson_id, section_id, body, updated_at
--     from public.section_comments
--    order by updated_at desc
--    limit 50;
--
-- Are people coming back? Study days per week across every student:
--
--   select date_trunc('week', day) as week,
--          count(distinct user_id) as students,
--          sum(checks)             as checkpoints,
--          round(sum(secs) / 3600.0, 1) as hours
--     from public.study_days
--    group by 1 order by 1 desc;
