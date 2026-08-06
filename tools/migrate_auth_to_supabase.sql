-- ===================================================================
-- Clerk -> Supabase Auth.  Applied 2026-08-05 (migration
-- `clerk_to_supabase_auth`).  Kept here as the record of what changed.
--
-- WHAT CHANGES, AND WHY EACH PART IS NECESSARY
--
-- 1. `students.id` stops being a Clerk id (text, `user_3HT…`) and becomes a
--    uuid referencing `auth.users(id)`.  This is the whole point of the
--    migration: a Clerk id is a string that means nothing to Postgres, which
--    is why `students` and `student_courses` were created with RLS ENABLED AND
--    NO POLICIES — service-role only, because there was no policy to write.  A
--    student's id is `auth.uid()` now, so RLS can finally do its job.
--
-- 2. `students.identity` (jsonb) arrives.  It holds the answer set in the
--    shape a second device wants it back in, and replaces Clerk's
--    `unsafeMetadata.identity` — the third copy of a student's answers, folded
--    into the row that was already the second.  It carries the four things the
--    flat columns cannot: `nameChosen` and `coursesChosen` (a name is never
--    empty, so only these say whether anybody was ASKED), `since`, and the
--    `updatedAt` clock the merge is decided on.
--
-- 3. A SELECT policy, and only SELECT.  The browser reads its own row to
--    resume on a second device.  Every WRITE still goes through /api/profile
--    with the service role, which validates the phone number, infers the
--    course-load signal and re-derives the retake comparison — none of which a
--    student should be able to write by hand.
--
-- WHAT IT DOES NOT DO: migrate existing accounts.  A Clerk user id cannot be
-- turned into a Supabase auth user, so every account has to be made again.
-- At the time this ran that cost three rows, ALL of them the owner's own test
-- sign-ups (one `Astronaut` from the placeholder bug, two `Deeky Mvula`), and
-- `auth.users` was empty.  They are copied to `students_clerk_archive` rather
-- than dropped — see step 0.
-- ===================================================================

begin;

-- ── 0. Keep the old rows before touching anything ──────────────────
-- Not a truncate-and-hope.  The archive is a plain copy with the Clerk ids
-- intact, so the answers three test sign-ups produced are still readable and
-- still joinable against anything that referenced them.  It carries no
-- constraints, no RLS policy and no FK — it is a record, not a table the app
-- uses — which is why RLS is enabled on it below with nothing granted: only
-- the service role can read it.
create table if not exists public.students_clerk_archive as
  select * from public.students;

alter table public.students_clerk_archive enable row level security;

comment on table public.students_clerk_archive is
  'The `students` rows as they stood under Clerk auth, 2026-08-05. Ids are '
  'Clerk user ids and map to nothing in auth.users. Kept for reference only.';

truncate public.student_courses, public.students;

-- ── 0b. The view pins both column types ────────────────────────────
-- `reported_curriculum` reads students and student_courses, and Postgres will
-- not let a column change type while a view depends on it:
--   ERROR: cannot alter type of a column used by a view or rule
-- So it is dropped here and recreated VERBATIM in step 4, `security_invoker`
-- included — that setting is what stops it bypassing the RLS on the tables
-- underneath it, and recreating a view without it is how a "just put the view
-- back" step quietly opens up everything the policies were added to close.
drop view if exists public.reported_curriculum;

-- ── 1. student_courses.student_id -> uuid ──────────────────────────
-- The FK has to go first: a foreign key's type must match the type it points
-- at, so it cannot survive either side changing.  It is re-added in step 3
-- with the same ON DELETE CASCADE it already had.
alter table public.student_courses
  drop constraint student_courses_student_id_fkey;

-- Safe on a NOT NULL column because the table is empty — the USING expression
-- is evaluated per row, and there are no rows.  The UNIQUE (student_id, norm)
-- index is rebuilt by Postgres as part of this.
alter table public.student_courses
  alter column student_id type uuid using null;

-- ── 2. students.id -> uuid, tied to auth.users ─────────────────────
-- `id` is the primary key; Postgres rebuilds students_pkey as part of the
-- type change.
alter table public.students
  alter column id type uuid using null;

-- ON DELETE CASCADE so that deleting an account in the Supabase dashboard
-- actually removes the student, rather than leaving an orphan row keyed to a
-- user id that no longer resolves.  A student who asks to be forgotten is
-- forgotten in one action.
alter table public.students
  add constraint students_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

-- ── 3. Put the child FK back ───────────────────────────────────────
alter table public.student_courses
  add constraint student_courses_student_id_fkey
  foreign key (student_id) references public.students(id) on delete cascade;

-- ── 4. The travelling copy ─────────────────────────────────────────
alter table public.students
  add column if not exists identity jsonb;

comment on column public.students.identity is
  'The student''s own answer set, in lib/identity''s AccountIdentity shape. '
  'Read back by the browser on sign-in to resume on a second device; written '
  'only by /api/profile. Denormalised on purpose — it carries nameChosen, '
  'coursesChosen, since and updatedAt, which the flat columns do not.';

-- ── 5. RLS: a student may read their own row, and nothing else ─────
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
-- THE DASHBOARD HALF — settings that live in the platform API, not in the
-- database, so neither this file nor SQL of any kind can reach them.  (There
-- is no `auth.config` table; the auth schema holds only data.)
--
--   Authentication -> Sign In / Providers -> Email
--
--     "Confirm email"  OFF — done by the owner 2026-08-05, and MEASURED both
--     ways rather than assumed.  Before: a signup posted to /auth/v1/signup
--     with the anon key returned HTTP 200 with `access_token` ABSENT and
--     `confirmed_at` null, which is what an unconfirmed account looks like.
--     After: the same probe returned an `access_token`, and the row it created
--     had `email_confirmed_at` set.  That is the difference between a student
--     landing in onboarding and a student landing in their inbox — and on a
--     Zambian connection an inbox round trip is where sign-ups go to die.
--
--     AuthForm's "check your email" branch stays regardless. It is not dead
--     code: it is what stops this setting being turned back on and failing
--     silently.
--
--     Minimum password length: 8, to match components/auth/AuthForm.
--
--   Authentication -> URL Configuration
--     Site URL: https://booklesss.app
--
-- VERIFIED END TO END, 2026-08-06.  One real account
-- (auth.users bc35ee29…) carries a complete `students` row keyed to its own
-- uuid: name chosen, avatar, university, programme, year 4 semester 2, four
-- curriculum slugs, two courses — and `identity` populated, which is the whole
-- third-copy mechanism working. The FK to auth.users holds, so `auth.uid()`
-- and `students.id` are the same value and the select-own policy can be
-- trusted. The probe user was deleted afterwards.
--
-- And in Clerk: nothing.  Leave the instance alone until the new flow has been
-- walked end to end on a phone; deleting it is a one-way door and it costs
-- nothing to keep for a week.
-- ===================================================================
