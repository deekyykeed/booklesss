-- Recompute reach and build priority across EVERY university at once.
-- Run after tools/load_pipeline.py has loaded a campus.
--
-- Reach (`programme_count`) is the number of DISTINCT PROGRAMMES a course is
-- taught on, counted across all universities: that is the whole point of the
-- queue — building one course can serve twenty programmes, and after the
-- second campus it can serve them on two campuses. `priority` is the queue
-- position that falls out of it.

with stats as (
  select ps.subject_id,
         count(distinct ps.programme_id)                  as programme_count,
         count(*)                                         as module_rows,
         min(case pr.level when 'diploma' then 0 when 'bachelors' then 1
                           when 'masters' then 2 when 'doctorate' then 3 else 9 end) as level_rank,
         mode() within group (order by ps.year)           as typical_year
    from pipeline_programme_subjects ps
    join pipeline_programmes pr on pr.id = ps.programme_id
   group by ps.subject_id
)
update pipeline_subjects s
   set programme_count = st.programme_count,
       module_rows     = st.module_rows,
       typical_year    = st.typical_year,
       lowest_level    = case st.level_rank when 0 then 'diploma' when 1 then 'bachelors'
                                            when 2 then 'masters' when 3 then 'doctorate' end,
       updated_at      = now()
  from stats st
 where st.subject_id = s.id;

-- A subject nothing points at any more (its programme dropped it on re-scrape)
-- keeps its row but stops claiming reach.
update pipeline_subjects s
   set programme_count = 0, module_rows = 0, updated_at = now()
 where not exists (select 1 from pipeline_programme_subjects ps where ps.subject_id = s.id)
   and (s.programme_count <> 0 or s.module_rows <> 0);

-- Priority is over teachable courses only — a dissertation is on a timetable
-- but is not something anyone reads notes for. Ties break the same way the
-- scrapers rank them: reach, then how early in a degree it is met, then title.
with ranked as (
  select id, row_number() over (
           order by programme_count desc,
                    case lowest_level when 'diploma' then 0 when 'bachelors' then 1
                                      when 'masters' then 2 when 'doctorate' then 3 else 9 end,
                    coalesce(typical_year, 9), title) as rn
    from pipeline_subjects
   where kind = 'course'
)
update pipeline_subjects s set priority = r.rn from ranked r where r.id = s.id;

update pipeline_subjects set priority = null where kind <> 'course';
