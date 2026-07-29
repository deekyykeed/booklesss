# daily-post — accumulated rules

Everything here was learned by getting it wrong once. Each rule carries its
reason, because a rule without one gets argued about again next week.

Add to this file whenever the owner reacts to a rendered slide. Delete a rule
that turns out to have been a one-off.

---

## Copy

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
  `localStorage["booklesss:progress:v2"]` (`{done: {lessonId: [sectionId]}, days:
  [...]}`), and a virgin browser photographs as an empty app. Build the seed from
  the real `course-data.json` so the rings are the app's own arithmetic, and keep
  it plausible — a few steps cleared, a live streak, never a finished course.

## Framing (the `top` / `fadeTop` / `fadeBot` arithmetic)

The frame is 1080×1920. A 9:16 shot placed at `width: 1120px` renders **1991px
tall**, and `top` is where its top edge sits.

The default fades leave a narrow window:

| | Default | Meaning |
|---|---|---|
| `fadeTop` | 1000 | solid background to **800**, transparent by **1000** |
| `fadeBot` | 560 | transparent at **1360**, solid from **~1750** |

So by default only **~800–1750** shows the shot at all, and **1000–1360** is
fully clear. The headline sits at 360 and the sub at 660, which is why the shot
must not carry anything important above ~830.

- **Compute `top`, don't guess it.** Decide which source pixel should land in the
  clear window and solve for `top`. Then render and look — two or three passes is
  normal.
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
- **Text and logo stay in the social safe area**: top ~300px, bottom ~340px,
  right ~150px clear.

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
