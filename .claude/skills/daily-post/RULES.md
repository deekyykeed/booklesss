# daily-post — accumulated rules

Everything here was learned by getting it wrong once. Each rule carries its
reason, because a rule without one gets argued about again next week.

Add to this file whenever the owner reacts to a rendered slide. Delete a rule
that turns out to have been a one-off.

---

## The two rules that are enforced in code

Both of these were broken by hand often enough that they stopped being notes
and became checks. A capture or a render that breaks one **throws** rather than
writing a file. Do not work around either by widening a constant.

### 1. Never a course, never a school

Booklesss is not one syllabus and not one university. No post may name a
course, a course code, a school, or a subject-specific term — no ZCAS, no UNZA,
no BAC4301, no "Corporate Finance", no "Economics", no kwacha worked example.
Naming one tells every student who isn't on it that the product isn't for them.

The live app is seeded with real courses, so `neutralize.mjs` relabels the UI to
a neutral two-subject curriculum (Mathematics / Computer Science) before every
shot, and `BANNED` lists what must never survive. `scan()` then checks **the
exact crop about to be photographed** and throws on a hit.

- If a shot trips the scan, extend `MAP` or move the crop. Never delete the word
  from `BANNED`.
- Some pages cannot be neutralised honestly — a worked example is a table of
  numbers with a course's own formulas in it, and relabelling that would be
  lying about the product. Those pages are simply not photographed.
- **The captions follow the same rule.** No course hashtags. `#zcas` was in
  earlier captions; it is not to come back.

### 2. The social safe area

The frame is 1080x1920 but the reader never sees all of it — the app draws its
own furniture over it:

| Edge | Covered | Why |
|---|---|---|
| top | 0 – **300** | account header, story progress bars |
| right | **848** – 1080 | like / comment / share / avatar rail |
| bottom | **1400** – 1920 | caption, handle, audio strip |

So every word lives inside **x 96–848, y 300–1400**. `prog-post.mjs` measures
every `.safe` block after layout — after the real font has loaded and the text
has wrapped — and throws with the offending line if anything crosses.

- The right rail is the one that kept catching us: the old 150px margin let
  sub-headings run to x=930, straight under the share button. The text was
  there, it just could not be read.
- When the check fires, **shorten the line, drop the size, or move it up.**
  Widening the safe area is not a fix, it is the bug.
- A margin in a stylesheet only says where a box *starts*. The check is what
  catches the third line that wrapped into the caption zone.

**A shot slide has a second boundary.** The safe area only knows the frame's
edges; on a `feature()` slide the text must also clear the point where the top
fade stops being solid and the screenshot starts showing through — `0.8 ×
fadeTop`. Cross it and the copy lands on top of the app's own words, both
perfectly inside the safe area and unreadable. This is checked too, and it has
caught overlaps of 4px that were invisible until you looked for them.

When it fires, either shorten the sub by a line or raise `fadeTop`. Raising it
hides a little more of the shot; that is usually the cheaper trade, unless the
copy grew a line it did not need.

---

## Cadence

**Five slots a day, every day** (from 2026-07-30): morning 07:00, midday 11:00,
afternoon 15:00, evening 19:00, night 21:30 — Google Calendar holds the five
daily reminders, `PLAN.md` holds what goes in them. Folders are numbered
(`1-morning/` … `5-night/`) so they sort in posting order.

One day of commits rarely contains five separate features. Five slots means
**five angles on what shipped**, each with one sentence it has to prove and its
own distinct shots — not one feature announced five times, and never a padded
slot. If a day only supports four honest posts, ship four and say so in
`PLAN.md`.

## Copy

- **Never a course or a school** — see the enforced rule above. ⚠️ The 27 Jul
  carousels were written before it and break it ("Real ZCAS material", BAC4301);
  they need re-cutting before they go out.
- **CTA is "Search booklesss — three s's — first result on Google", plus "Or DM
  me 'link'".** Never "comment" — you cannot put a link in a comment, and DMs
  convert better. (`feedback_marketing_cta_dm`, `feedback_marketing_cta_search`)
- **Spell out the three s's.** "Booklesss" is misheard and mistyped otherwise.
  No `.com`.
- **Copy is about the product, not the syllabus.** The slides sell the reader —
  what it is like to study in it. The course content is the evidence, not the
  pitch.
- **Headlines are two lines, set with an explicit `<br>`.** Auto-wrapping at
  106px puts the break in the wrong place.
- **The last text slide before the CTA is the "In the works" beat** — what is
  coming next, so the post reads as a log entry rather than an ad.
- **Banned words** apply here as everywhere in Booklesss: no "seamless",
  "journey", "empower", "leverage", "game-changer", "robust", "delve".

## Capture

- **Shoot the app's MOBILE layout** — 402×874, `deviceScaleFactor: 3`,
  `isMobile: true`. The posts are 9:16 for mobile feeds and the desktop layout
  does not sit right in a tall frame. (`feedback_marketing_capture_mobile`)
- **Every clip is exactly 9:16** (402×715, or 300×533 for the nav drawer).
  Scaled to the poster's 1120px width, a 9:16 source fills the 1920px frame; a
  shorter one leaves a hard edge where the image stops.
- **Remove the Next dev badge before every screenshot.** It sits over the
  bottom-left corner. Strip any element whose tag or id contains "next".
- **Scroll by element, not by pixel offset.** `bring(selector, topPx)` puts a
  known element a known distance below the viewport top; raw `scrollTo(0, 260)`
  breaks the moment the content above it changes length.
- **Clip the drawer, not the screen, when shooting a drawer.** The left nav
  occupies x:0–300 and the right step-context drawer x:62–402; clipping to the
  drawer alone drops the sliver of reader text competing behind it.
- **Sideways-scrolling tables need `scrollLeft = scrollWidth`** before the shot,
  or the column carrying the answer is off-frame.
- **Modal/dialog shots start higher** (`y: 56`) than in-page shots (`y: 156`) —
  a dialog hangs from the top of the screen, so an in-page crop cuts its head off.
- **Seed progress before shooting the dashboard.** It reads
  `localStorage["booklesss:progress:v3"]` (`{done, days, touched, quiz}`), and a
  virgin browser photographs as an empty app. Build the seed from the real
  `course-data.json` so the rings are the app's own arithmetic, and keep it
  plausible — a few steps cleared, a live streak, never a finished course.
- **Cluster the rest days in the seed.** The chart plots real minutes per day, so
  a zero honestly drops the line to the floor — but days off *alternating* with
  study days draw a comb, and a comb photographs as decoration rather than as
  somebody's week. Two days off together draw one trough, which is both what a
  weekend actually looks like and a line you can read.
- **Leave ~160px of page above the subject.** `bring(sel, 320)` not
  `bring(sel, 200)`. The poster dissolves the top of every shot so the headline
  can sit over it, so a subject shot near the top of its crop arrives half-faded
  and no `top` value can rescue it. Fix it in the capture, not the render.
- **Macro crops are taken in page coordinates against a full-page screenshot**,
  never against the viewport. The dashboard is barely taller than a phone screen,
  so an element near its foot can never be scrolled to the top of the viewport —
  a viewport crop of it silently clamps and photographs whatever is above.
  That is how three different "macros" came out as the same picture.
- **Scroll and measure are two steps.** The page scrolls smoothly, so a rect read
  in the same tick as the scroll is the rect from *before* it.
- **Align a macro to the element's left edge, not its centre**, when the element
  is wider than the crop. The app's text is left-aligned, so centring shaves the
  first letter off every line — "athematics", "esume" — which reads as a mistake
  rather than as a close-up. Let it bleed off the right, where a line ends.
- **Re-run `prep()` immediately before every screenshot**, inside `shot()`.
  React re-renders undo the relabel; a relabel done once after navigation is
  already stale by the time the third crop is taken.
- **`networkidle` is the wrong navigation wait against a dev server** — HMR holds
  a socket open and a recompile mid-navigation never settles, killing the run on
  a page that is fine. Wait for the DOM, then for a known element.

## Framing (the `top` / `fadeTop` / `fadeBot` arithmetic)

The frame is 1080×1920. A 9:16 shot placed at `width: 1120px` renders **1991px
tall**, and `top` is where its top edge sits.

The default fades leave a narrow window:

| | Default | Meaning |
|---|---|---|
| `fadeTop` | 1000 | solid background to **800**, transparent by **1000** |
| `fadeBot` | 560 | transparent at **1360**, solid from **~1750** |

So by default only **~800–1750** shows the shot at all, and **1000–1360** is
fully clear. The headline sits at 360 and the sub at 640, which is why the shot
must not carry anything important above ~830.

- **Compute `top`, don't guess it.** Decide which source pixel should land in the
  clear window and solve for `top`:

  ```text
  scale  = 1120 / (source width in px)
  frame_y = top + source_y * scale        ->   top = 1000 - subject_y * scale
  ```

  Then render and look — two or three passes is normal.
- **Keep `top` ≤ 0.8 × `fadeTop`,** or the shot's own top edge shows as a hard
  line across the frame. The fade is solid only for its first 80%; an image edge
  landing in the gradient below that is visible.
- **`shotLeft: 0` on any macro-based slide.** The shot is 1120px in a 1080px
  frame and defaults to `left: -40`, bleeding equally either side — right for a
  whole-screen shot, fatal for a tight crop, where it takes the first letter of
  every line with it. That is what turned "first-year" into "irst-year" on an
  otherwise finished slide.
- **Widen the window for tall content.** A seven-row table or a four-option quiz
  is ~800–1200px tall in frame and the default fades eat its ending. Drop
  `fadeBot` to 330–460 for those slides. The punchline — the total, the last
  option — has to be crisp.
- **Keep the default for compact focal UI** (a composer, a card, a formula box).
  The soft dissolve is the house look; only spend it where the content needs it.
- **Instagram covers roughly the bottom 420px with the caption.** Anything below
  ~1500 is at risk, which is the real reason the bottom fade exists.

## House style

- **Un-boxed, full-bleed.** Macro crops of the real UI bleeding off the frame.
  Never a screenshot sitting in a rounded card or a device mockup — that was
  built and rejected ("too small, boxed, images repeated").
- **All light.** No dark-background posts until the app ships a real dark mode;
  a light screenshot on a dark canvas does not sit right.
- **No swipe arrows, no page counters.**
- **One distinct shot per slide.** Repeating a crop across slides reads as
  padding.
- **Text and logo stay in the social safe area** — the numbers, and the check
  that enforces them, are at the top of this file.
- **Never draw a UI element. Take the original from the app.** If a screen looks
  thin in a post, the fix is *data*, not decoration: seed the app with plausible
  progress and shoot it again. Do not invent a card, a chart, a badge or a stat
  to make a slide look fuller, and never retouch what the app appears to do.
  Framing, cropping and fading are the only liberties. Every pixel of product in
  a post has to be the product, or the post is a mockup pretending not to be.
- **Seeded data is demo data and stays plausible.** Someone a few weeks in:
  a live streak, a couple of steps going stale, a weak answer somewhere — never
  a finished course, never a perfect week. The numbers on screen must be the
  app's own arithmetic on real checkpoint ids, so a screenshot can be trusted.

## Operational gotchas

- **A "server already running" error is not proof of a healthy server.** Next
  refuses a second `dev` in the same directory regardless of port. Check the
  claimed PID and port are actually serving (`curl` a route) before working
  around it — a crashed render worker ("Jest worker encountered N child process
  exceptions") keeps the port but hangs every request. Kill it and start clean.
- **Windows EPERM on `.next`** when OneDrive or a running server holds a handle:
  kill node, `rm -rf .next`, rebuild.
- **Derive the date from `new Date()`,** never hardcode `DAY`. A hardcoded date
  filed a whole day's posts under a phantom weekday folder.
- **There is no posting connector.** The posts are a manual upload — always say
  so when handing the day over.
- **The rendered PNGs are gitignored** (`Demand/social/posts/**/*.png` and
  `_source/feature-capture/*.png`). They ran the push into HTTP 408s at ~60MB, and
  they are regenerable from the scripts anyway. Commit the recipe — capture
  script, post config, and each day's `PLAN.md` — never the images.
