-- section_reactions — how each section landed, per reader.
--
-- APPLIED TO THE BOOKLESSS SUPABASE PROJECT ON 2026-08-08 (migration name
-- `section_reactions`). This file is the record of what was applied, kept
-- because the repo has no migrations folder and the alternative is a table whose
-- definition and reasoning exist only in a dashboard. Re-running it is safe.
--
-- WHY IT EXISTS: to count. The reader draws three faces per section and the
-- owner asked for a tally beside each ("counting how many people thought what
-- about the step"). Nothing could answer that before, because a reaction never
-- left the device — it lives in localStorage under `booklesss:progress:v6`. That
-- also means there is NO HISTORY TO BACKFILL: counting starts from the first
-- reader after this shipped, including for the two accounts that already existed.
--
-- The second reason is worth more than the tally: aggregated, this says WHICH
-- SECTIONS LOSE PEOPLE. A per-device store can never answer that, and it is the
-- thing that tells the owner where a step needs rewriting.
--
-- READ IT WITH: tools/reported_curriculum.sql's habit — by hand, when you want
-- to know something. A starting query is at the foot of this file.

create table if not exists public.section_reactions (
  user_id    uuid not null references auth.users (id) on delete cascade,
  lesson_id  text not null,
  section_id text not null,
  -- The same three values lib/progress-shared has always had. Checked here so a
  -- fourth cannot arrive by accident and quietly break the 1 / 0.5 / 0 weighting
  -- the dashboard scores with.
  grasp      text not null check (grasp in ('got', 'almost', 'not')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One row per reader per section, so changing your mind is an UPDATE and never
  -- a second vote.
  primary key (user_id, lesson_id, section_id)
);

comment on table public.section_reactions is
  'How each section landed, per reader. Written by /api/reaction with the service role; read back only as counts. RLS on with no policies is intentional.';

-- lesson_id / section_id are TEXT and deliberately NOT foreign keys to
-- `lessons`. Section ids exist only inside a lesson's JSONB, so there is nothing
-- to reference; and `seed:course` rewrites a course's nav wholesale on every
-- publish, so a cascade would delete real answers every time a step was
-- re-seeded. An orphaned row is a much smaller problem than a deleted one.
--
-- The read path is "every section of one lesson at once", because a step draws
-- one row of faces per section and must not make a request per section.
create index if not exists section_reactions_lesson_idx
  on public.section_reactions (lesson_id, section_id);

-- RLS ON WITH NO POLICIES, like `students`, `student_courses` and the pipeline
-- tables: the service role is the only thing that can touch it. Writes go
-- through /api/reaction, which takes the user id from the VERIFIED session
-- (`getUser()`, not a cookie's claims) and never from the request body — the
-- only thing stopping one signed-in reader overwriting another's answers. Reads
-- return counts only, so nothing about who said what reaches a browser.
--
-- Supabase's "RLS enabled, no policy" advisor INFO on this table is the intent,
-- not a gap. DO NOT ADD A PUBLIC READ POLICY.
alter table public.section_reactions enable row level security;


-- ── Which sections lose people ─────────────────────────────────────────────
-- The question the tally cannot answer and this table exists for. Run it by
-- hand; nothing in the app reads it.
--
--   select lesson_id,
--          section_id,
--          count(*)                                    as answers,
--          count(*) filter (where grasp = 'not')       as lost,
--          count(*) filter (where grasp = 'almost')    as partly,
--          count(*) filter (where grasp = 'got')       as landed,
--          round(avg(case grasp when 'got' then 1 when 'almost' then 0.5 else 0 end), 2) as score
--     from public.section_reactions
--    group by lesson_id, section_id
--   having count(*) >= 3
--    order by score asc;
--
-- Ordered worst first, so the top of the result is the next thing to rewrite.
-- `having count(*) >= 3` because one person's bad morning is not a signal.
