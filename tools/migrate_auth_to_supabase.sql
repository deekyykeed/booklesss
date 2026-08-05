-- ===================================================================
-- Clerk -> Supabase Auth.  Run this ONCE, in the Supabase SQL editor.
-- 2026-08-05
--
-- WHAT CHANGES, AND WHY EACH PART IS NECESSARY
--
-- 1. `students.id` stops being a Clerk id (text, `user_2abc…`) and becomes a
--    uuid referencing `auth.users(id)`.  This is the whole point of the
--    migration: a Clerk id is a string that means nothing to Postgres, which
--    is why `students` and `student_courses` have had RLS enabled with NO
--    POLICIES since they were created — there was no way to write one.  A
--    student's own id is now `auth.uid()`, so RLS can finally do its job.
--
-- 2. `students.identity` (jsonb) arrives.  It holds the answer set in the
--    shape a second device wants it back in, and replaces Clerk's
--    `unsafeMetadata.identity` — the third copy of a student's answers, now
--    folded into the row that was already the second.  It carries the four
--    things the flat columns cannot: `nameChosen` and `coursesChosen` (a name
--    is never empty, so only these say whether anybody was ASKED), `since`,
--    and the `updatedAt` clock the merge is decided on.
--
-- 3. A SELECT policy, and only SELECT.  The browser reads its own row to
--    resume on a second device.  Every WRITE still goes through
--    /api/profile with the service role, which is what validates the phone
--    number, infers the course-load signal and re-derives the retake
--    comparison — none of which a student should be able to write by hand.
--
-- WHAT THIS DOES NOT DO: migrate existing accounts.  A Clerk user id cannot
-- be turned into a Supabase auth user, so every account has to be made again.
-- That is deliberate and it is cheap here — the only accounts that exist are
-- the owner's own test sign-ups.  The guard in step 0 refuses to run if that
-- assumption is wrong, rather than dropping somebody's timetable on the floor.
-- ===================================================================

begin;

-- ── 0. Refuse to destroy real data ─────────────────────────────────
-- The six test students were deleted on 2026-08-05, so this table is expected
-- to be empty.  If it is not, STOP and look at what is in it before going on:
-- the id column is about to change type and the old values cannot be mapped.
do $$
declare n bigint;
begin
  select count(*) into n from public.students;
  if n > 0 then
    raise exception
      'students has % row(s). Clerk ids cannot map to auth.users. Export them, '
      'then: TRUNCATE public.student_courses, public.students; and re-run.', n;
  end if;
end $$;

-- ── 1. student_courses.student_id -> uuid ──────────────────────────
-- Dropped and re-added rather than altered: the column is empty (step 0
-- guarantees it), and the FK has to be rebuilt against the new type anyway.
alter table public.student_courses
  drop constraint if exists student_courses_student_id_fkey;

alter table public.student_courses
  alter column student_id type uuid using null;

-- ── 2. students.id -> uuid, tied to auth.users ─────────────────────
alter table public.students
  alter column id type uuid using null;

alter table public.students
  drop constraint if exists students_id_fkey;

-- ON DELETE CASCADE so that deleting an account in the Supabase dashboard
-- actually removes the student, rather than leaving an orphan row keyed to a
-- user id that no longer resolves.  A student who asks to be forgotten is
-- forgotten in one action.
alter table public.students
  add constraint students_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

alter table public.student_courses
  add constraint student_courses_student_id_fkey
  foreign key (student_id) references public.students(id) on delete cascade;

-- ── 3. The travelling copy ─────────────────────────────────────────
alter table public.students
  add column if not exists identity jsonb;

comment on column public.students.identity is
  'The student''s own answer set, in lib/identity''s AccountIdentity shape. '
  'Read back by the browser on sign-in to resume on a second device; written '
  'only by /api/profile. Denormalised on purpose — it carries nameChosen, '
  'coursesChosen, since and updatedAt, which the flat columns do not.';

-- ── 4. RLS: a student may read their own row, and nothing else ─────
-- Both tables keep RLS ON.  What changes is that there is now a policy, where
-- before there were none and only the service role could reach them.
alter table public.students        enable row level security;
alter table public.student_courses enable row level security;

drop policy if exists students_select_own on public.students;
create policy students_select_own
  on public.students for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists student_courses_select_own on public.student_courses;
create policy student_courses_select_own
  on public.student_courses for select
  to authenticated
  using (auth.uid() = student_id);

-- NO insert / update / delete policies, deliberately.  Writes go through
-- /api/profile with the service role (which bypasses RLS), because the row is
-- not just storage — it is validated, normalised and partly INFERRED there.
-- Letting the browser write directly would mean a student could set their own
-- `course_load`, their own `expected_courses` and their own `referred_by`.

commit;

-- ===================================================================
-- AFTERWARDS, IN THE DASHBOARD — three settings this file cannot set:
--
--   Authentication -> Sign In / Providers -> Email
--     "Confirm email"  OFF     (owner's call, 2026-08-05: a student goes
--                               straight from the form into onboarding)
--     Minimum password length: 8, to match components/auth/AuthForm
--
--   Authentication -> URL Configuration
--     Site URL: https://booklesss.app
--
-- And in Clerk: nothing.  Leave the instance alone until the new flow has
-- been walked end to end on a phone; deleting it is a one-way door and it
-- costs nothing to keep for a week.
-- ===================================================================
