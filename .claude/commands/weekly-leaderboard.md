# /weekly-leaderboard

Format and schedule the weekly Booklesss leaderboard post for Slack.

## How to trigger this skill
Type: `/weekly-leaderboard` then paste the week's points data in this format:

```
Week: [N]
Course: [course name or "All Courses"]
Data:
Student Name | Slack Handle | This Week Pts | Total Pts
[name] | @[handle] | [pts] | [total]
[name] | @[handle] | [pts] | [total]
...
Top mover: [name] (+[pts] gained this week)
Perfect score: [name] (Module [N]) OR "None this week"
```

---

## What this skill does

1. Sorts students by total points (descending)
2. Formats the standard leaderboard message
3. Identifies the top mover (biggest week-on-week gain) if provided
4. Sends via `slack_schedule_message` to `#leaderboard` for Sunday 7pm CAT (Central Africa Time, UTC+2)

---

## Leaderboard message format

```
*Week [N] Leaderboard — [Course Name]* 🏆
Week ending [date]

🥇 @handle — [total] pts
🥈 @handle — [total] pts
🥉 @handle — [total] pts
4. @handle — [total] pts
5. @handle — [total] pts
[continue for all students]

---
*Top mover this week:* @handle (+[pts] pts) 🚀
*Perfect quiz score:* @handle (Module [N]) ⭐
[If no perfect score: omit this line]

---
Next quiz drops Wednesday. Keep going. 🔥
_React ✅ to this week's module post if you haven't already — 5 pts waiting for you._
```

---

## Scheduling

Schedule for **Sunday at 19:00 CAT (UTC+2)** = 17:00 UTC.

Use `slack_schedule_message` with:
- Channel: `#leaderboard`
- Schedule: next Sunday at 19:00 CAT

---

## After scheduling

Remind the user:
1. Update the Canvas leaderboard doc in `#leaderboard` channel with the new totals
2. If any student hit a streak milestone (7-day or 30-day), post a separate message in `#streaks` tagging them
3. DM any student who dropped in ranking with an encouraging note (optional but high impact)
