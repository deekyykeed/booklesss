-- What students have told us they are taught, and what is worth acting on.
--
-- Seven of the ten universities in the sign-up picker publish no curriculum
-- anywhere, and so do 19 ZCAS programmes, 98 UNZA ones and 106 of Mulungushi's
-- 107. For all of those, the students ARE the source: onboarding asks them to
-- type their programme and their courses, and /api/profile writes what they say
-- into students / student_courses.
--
-- Run these by hand. Nothing promotes itself: a course reported once is one
-- person's typing, and turning it into a row in the build queue is a judgement
-- about whether it is real.

-- 1. THE CAMPUSES ASKING TO BE BUILT FOR. Which universities and programmes
--    students are actually signing up from — including the ones they typed
--    because we do not carry their campus at all. This is the answer to "where
--    next", measured rather than guessed.
select coalesce(s.university_id, 'typed: ' || lower(s.university_other)) as university,
       coalesce(s.programme_slug, s.programme_other)                     as programme,
       count(*)                                                          as students,
       count(*) filter (where s.programme_slug is null)                  as typed_it_in,
       max(s.updated_at)                                                 as last_seen
  from students s
 group by 1, 2
 order by students desc, university;

-- 2. THE COURSES THEY AGREE ON. Two or more students on the same programme
--    naming the same course is the threshold worth looking at — one is a
--    person's typing, two is a curriculum.
select university_id, programme, year, title, students
  from reported_curriculum
 where students >= 2
 order by students desc, university_id, programme, year, title;

-- 3. WHICH OF THOSE WE ALREADY KNOW. A reported title that matches a course
--    the pipeline carries needs no new row — it needs its reach to count the
--    student who asked for it. A title with no match is a course nobody has
--    scraped, from a university that publishes nothing, which is exactly the
--    material this whole arrangement exists to collect.
select r.university_id, r.programme, r.title, r.students,
       ps.slug as pipeline_slug,
       ps.status
  from reported_curriculum r
  left join pipeline_subjects ps
         on ps.slug = regexp_replace(btrim(r.norm), '\s+', '-', 'g')
 where r.students >= 2
 order by (ps.slug is not null), r.students desc;
