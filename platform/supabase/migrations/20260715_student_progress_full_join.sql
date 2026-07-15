-- A tick-only student (no rating/completion row yet) must still appear in
-- their progress — full join instead of left join. Applied live via MCP.
create or replace view public.student_progress
  with (security_invoker = on) as
select
  coalesce(f.user_id, t.user_id)     as user_id,
  coalesce(f.step_slug, t.step_slug) as step_slug,
  coalesce(f.completed, false)       as completed,
  f.rating,
  coalesce(array_length(t.ticked, 1), 0) as outcomes_ticked,
  greatest(coalesce(f.updated_at, t.updated_at), coalesce(t.updated_at, f.updated_at)) as last_activity
from public.step_feedback f
full join public.outcome_ticks t
  on t.user_id = f.user_id and t.step_slug = f.step_slug;
