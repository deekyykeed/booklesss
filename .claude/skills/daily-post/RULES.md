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

## No copy on a plate (owner's call, 2026-08-03)

*"i dont add text like this anymore — dont add any text."* Said of a `cover()`
slide carrying an eyebrow, a three-line headline and a sub.

This is **not** the same as the image-only rule below, which is about slides
being app crops. It is about the copy itself: a plate that exists to show a
thing does not get a caption written on it.

- **No headline, no eyebrow, no sub, no corner wordmark, no CTA slide.**
- **The CTA moves to the caption**, which is where words still belong and where
  a link can actually be acted on. Every no-copy set still ends its caption with
  *DM me "link"*.
- `logo-variants.mjs` is the reference implementation — its own renderer rather
  than a `prog-post.mjs` config, because every slide type that file owns carries
  either copy or the corner stamp.
- **The safe box still binds anything meant to be read.** It stops binding when
  the subject is enlarged past the frame: a letterform at 2400px is texture, not
  a word, and has nothing to keep clear of a share button. Declare that
  explicitly (`safe: false`) rather than deleting the check.

## Image-only days (owner's call, 2026-08-01)

A day can be shot with **no copy on any slide** — every image an area of the
app, enlarged, with nothing written over it. The owner asked for this on 1 Aug
and it is now a supported mode, not a one-off.

- **`plain({img})` in `prog-post.mjs`** is the slide type: the crop fills the
  frame (1080 wide, so a 9:16 source is exactly 1920 tall), no fades, **no
  wordmark and no grain**. Both of those are things drawn over the app, and
  grain on a screenshot reads as a dirty screen rather than as texture.
- **The CTA still closes every carousel.** It is the only text in the day;
  "no copy" means no headlines, not no call to action. (Which CTA: see Copy.)
- **The caption carries the whole story** — it is read while the reader is
  already looking at the screen, so it can be plainer and longer than a
  headline. Write it in `PLAN.md` as usual.
- **Framing has nowhere to hide.** On a copy slide the top of the shot
  dissolves under the headline; here the crop *is* the slide, top edge
  included. A shot that arrives cut off gets re-captured — there is no `top` to
  nudge and nothing to hide a bad edge behind.
- **Crop in page space for anything near the foot of a page.** A viewport crop
  of the step closer put it at the top of the frame with half a screen of empty
  page under it. `area()` against a full-page screenshot fixes it.

## Component days (owner's call, 2026-08-02)

**One component per CAROUSEL, in three or four scenarios — and nothing else in
the frame.** Not one component per slide, and not a tight crop: *"just literally
remove everything else other than just that one component… then make it look
good off the background. Maybe skew it a little so it looks like I'm looking at
it in 3D space."*

So the whole post is a single control in the states a reader puts it through —
the answer marks untouched, then each answer chosen — captured as an element
with a transparent background and set squarely on the gradient. `isolate()` in
`cap-0802.mjs` and `object()` in `prog-post.mjs`.

- **STRAIGHT. No skew, no perspective.** Tried on 2 Aug and rejected on sight:
  *"the skewing thing doesn't work, it is very ugly."* The reason is worth
  keeping — this is flat vector UI with hairline borders and 1px rules, and
  rotating it runs every one of those lines through a resampler, so the card
  stops looking like a card and starts looking like a photograph of a screen at
  an angle. Depth comes from the shadow and the space around it.
- **Pick components with something in them.** The other half of the same note:
  *"you need to focus on more interesting bits."* Three near-identical white
  cards of body text is the dullest thing the app owns. The course card is the
  opposite — a hand-drawn folder mark, a streak, a fortnight of that course's
  own reading drawn in its own hue behind the text, a score, and a Resume button
  whose fill IS the progress bar. Before building a carousel round a component,
  ask what is actually in the frame besides text.
- **Prefer states that differ in kind, not in wording.** A course never opened
  reads 0%, no streak, no curve and says *Start* — that is a different picture.
  Two definitions of two different words are the same picture twice.

It supersedes the 1 Aug "crop areas, not controls" rule for days about what
*changed*; the area mode is still right for days about what the app *is*.

**A crop rectangle is not an isolation.** This was tried first and rejected: a
9:16 box around a 131px stat tile still photographs the tile below it, so the
slide is about a grid. Sizing the box off the component, thresholding the
alignment, tuning the lift — all of it was work spent making a rectangle behave,
and the answer was to stop cropping.

- **An element screenshot is a clip of the page, not a render of the element.**
  Everything painted underneath comes with it, and clearing the *ancestors'*
  backgrounds is not enough because the thing painting is usually a sibling — a
  page wash, a content surface. Hide everything and unhide the component:
  `body *{visibility:hidden}` + `[data-iso],[data-iso] *{visibility:visible}`,
  plus `html,body{background:transparent}` and `omitBackground`. `visibility`,
  not `display`, so nothing reflows and the element keeps its real geometry.
- **Pad the clip, and scroll into view before measuring.** A component's own
  parts can sit outside its border box — the definition card's arrow is at
  `top:-9px` and came out as a grey nub clipped along the card's edge. Take a
  padded `page.screenshot({clip})` instead of `locator.screenshot()`; with
  everything else hidden the padding can only pull in the component's own
  overhang. But a page clip is measured against the VIEWPORT, so scroll first
  or anything below the fold fails with *"clipped area is outside the resulting
  image"* — `locator.screenshot()` had been doing that scroll for you.
- **Select a component by what it HAS, not by the utility classes around it.**
  `#task-levels .flex.flex-col.gap-3 > div` was the card set until the source
  strip moved under the paragraph and brought a second `flex flex-col gap-3`
  with it — after which the same selector returned a 42px row of chips. Anchor
  on something structural: `div.rounded-3xl.shadow-lift:has(svg)` picks the
  cards and not the callout wearing their classes. (The banned-word scan caught
  this one; it will not always be there to.)
- **Index into a set only when nothing else identifies the member.** Picking the
  answered marks as `[data-active]` nth 0 and 1 looks right and is not: the
  first two sections are answered *by the seed*, so those indices are the seeded
  rows, and the shots came out as the wrong answer under the right filename — a
  sad face filed as "thumb up". Ordering there depends on how much progress the
  seed happens to carry. `[aria-label="Got it"]` does not.
- **`drop-shadow`, never `box-shadow`.** box-shadow draws the shadow of the
  PNG's *rectangle* — a hard oblong behind two floating glyphs. drop-shadow
  traces the alpha.
- **A component with no surface takes a much tighter shadow.** On a bare glyph
  the wide layer spreads grey through the gaps in the shape and reads as a
  smudge rather than lift — the same blur-width lesson the app's own shadow
  scale learned on 1 Aug. `.obj.flat` exists for exactly this.
- **Isolate the SQUARE thing, not the wide one.** The answer pair is 78×34 and
  most of that width is the gap between the two marks, so enlarged to fit the
  frame the glyphs stay small and the slide is two icons adrift. One 34×34 mark
  fills the same frame with four times the presence. Shoot the pair once for
  context, then each mark alone.
- **The stage insets to the SAFE BOX, not the frame.** The right rail eats 232px
  and the left margin 96, so the readable centre is x=472; centring on the
  frame's 540 pushes every component towards the share buttons and the widest
  ones straight under them.
- **The component is measured after its transform.** `object()` slides carry no
  text, so the `.safe` check passes trivially and the component itself is what
  can spill. `getBoundingClientRect` on the transformed image is what catches
  it — a rotateX makes a card taller than the `w` in its config.
- **Vary `w` and `tilt` down a carousel.** Four states of one control at one
  size and one angle read as one image reposted four times.
- **Set `w` per component, not globally.** A 34px button and a 370px card both
  rendered at 700px claim to be the same size, and one of them is a 20×
  enlargement.
- **Fill the safe box. Go closer than feels right** (owner, 2 Aug: *"next time
  zoom in more while still keeping within the safe zone"*). The 2 Aug set sat
  around 620px inside a 752×1100 box and reads timid — a component floating in
  the middle of a lot of gradient. Start at the safe width and come down only
  until the check passes: the box is the limit, not a target to stay clear of.
  `isolate()` shoots at `deviceScaleFactor: 8`, so there are pixels for it.
- **Isolate the LIST, not the scroller it sits in.** The sidebar's `nav` is a
  fixed-height overflow container, so isolating it returned the same 283×766 box
  for all three states of the tree — three slides of identical extent, each with
  a screen of empty space under it. The inner list (`nav > div.relative.flex`)
  is the component, and it came back 178 / 310 / 374 tall. **A component whose
  height is the story has to be measured, not assumed:** print the css size the
  isolate reports and check the three numbers differ.
- **Shadow: cut the layer, never dim it.** Third time this lesson has been
  learned on this project (the app's shadow scale on 1 Aug, then twice here).
  The owner's word both times was *harsh*, and both times the culprit was blur
  WIDTH — a 52px layer spreads grey over enough of the gradient to read as a
  bruise round the component however faint the alpha is set. Halve the blur
  before touching the opacity.

## Copy

- **Never a course or a school** — see the enforced rule above. ⚠️ The 27 Jul
  carousels were written before it and break it ("Real ZCAS material", BAC4301);
  they need re-cutting before they go out.
- **The CTA is a DM, and only a DM** (owner's call, 2026-08-02). `dmCTA()` in
  `prog-post.mjs`: "DM me 'link'", a composer, "No search, no sign-up." The
  caption ends the same way — *DM me "link" and I'll send you the whole thing.*
  Search asked for two steps before anyone reached anything, and the second was
  a results page we neither control nor can see our ranking on; a DM is one
  step, lands in a thread where the link can actually be sent, and produces a
  person to talk to rather than a session. (`feedback_marketing_cta_dm`)
  - **`searchCTA()` stays in the file, unused by new posts.** Every carousel
    already rendered ends on it, and deleting it would silently change what was
    posted the moment an old day is re-rendered. Do not edit it either.
  - Never "comment" — you cannot put a link in a comment.
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
- **Retry the relabel once after a navigation.** Arriving at a route the dev
  server has not compiled yet means the first paint can be replaced a beat
  later, and a transform running across that swap dies with *"execution context
  was destroyed"* — the page working, not failing.
- **Scroll to the top before any full-page screenshot.** Chrome renders
  `position: sticky` elements wherever the page happens to be scrolled to, so
  the reader's floating header lands as a band across the middle of any crop
  taken further down — it sat straight through an open menu, over two of its
  five options. Parking at y=0 puts it back where it belongs and where no crop
  goes. Scroll *before* measuring: the document coordinates are the same either
  way, but the banned-word scan compares against `window.scrollY` and would
  otherwise be using two different origins.
- **`nth` needs a selector that means what you think.** `.grasp-btn` is every
  control in a checkpoint row — the note button *and* both answers — so
  `nth: 1` was the second button of the first row, not the note button of the
  second. `.grasp-btn[aria-expanded]` picks the note buttons only.
- **Relabel by POSITION when one string has to become two different words.** The
  string map is a text-node swap, so it cannot tell a folder from a step that
  happens to carry the same label — and after the nav grew folders, one lesson
  had exactly that. Both rows came out reading the same neutral name, which
  flattens the tree in the one photograph that is about the tree having levels.
  Walk `a.step, button.step` in order and write an array of labels onto them
  instead (`NAV_MATHS` / `NAV_CS` in `cap-0803.mjs`). The order is stable
  because every row stays mounted whether its folder is open or shut. Run it
  AFTER the string map, and keep the map — it still covers the rest of the page.
- **Paragraphs are not the only text in a step.** A relabel that rewrites
  `section p` leaves the callouts and the list items untouched, and both carry
  prose. Three separate passes are needed (`p`, `div.squircle`'s longest leaf,
  `li span:last-child`) and the scan will keep failing until all three are
  written — it took three runs to find that out, one word at a time.
- **The scan tests every element whose box TOUCHES the crop, so write past the
  fold.** A bullet clipped by one line at the bottom edge is still in the
  photograph. Relabelling only what you can see leaves the next block live;
  supply about twice as many replacement lines as the crop shows.
- **Print the offending SENTENCE, not just the banned word.** Most hits are a
  substring inside a longer word — "irrelevance" carries `irr` — so a bare
  "banned words: irr, npv" sends you hunting down a page by eye. The debug
  branch in `cap-0803.mjs`'s `shot()` prints the ancestor chain and the text,
  and it found in one run what two runs of guessing had not.
- **`:has-text()` is Playwright's, not CSS.** It works in a locator and throws
  inside `page.evaluate`, where `querySelectorAll` needs valid CSS — which is
  where `isolate()` resolves its selector. Anchor on a class or an attribute.
- **Grant `clipboard-write` on the context** to photograph a copy-to-clipboard
  control's confirmed state. Headless Chromium has no `navigator.share`, so the
  share button takes its copy path, and without the permission the write is
  silently refused and the button never changes. The shot comes back looking
  correct — it is just the unpressed state under the pressed state's filename.
- **Show an SVG in an `<img>`, don't visit it as a document.** Chromium lays a
  standalone SVG out against the whole page box, so an element screenshot of it
  is the icon marooned in two screens of white. `setContent` with an
  `<img src="…/icon.svg" style="width:960px">` gives the file's own aspect and
  nothing else. It is still the app's asset, served by the app.
- **Relabelling is case-sensitive, and a callout usually restates its block in
  lower case.** The card set's own callout kept the original vocabulary at the
  foot of the crop while the cards above it used the new one. Map both cases,
  or crop the restatement out and check that you have.

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

## The logo

**The logo is the word. No mark** (owner's call, 2026-08-03).

The stamp in the corner of every slide used to be the folded-square glyph plus
"Bklsss". The glyph rendered at 32px in a 1080-wide frame — too small to read as
a shape, so it arrived as a dark speck ahead of the word and the eye went
straight past it. A mark that has to be enlarged before it is legible is not
doing a mark's job, and at post scale there is nowhere to enlarge it to.

`wordmark` in `prog-post.mjs` is now `<span>Bklsss</span>` and nothing else.
`LOGO()` is kept in the file for anything that wants the glyph alone; no post
does.

- **31px, weight 700** — not the old 27, and not bigger either. Both were tried
  on 3 Aug against the course-card carousel:
  - At **36/600** the word crowds the headline. A `feature()` slide puts its h1
    at y=360 and the wordmark at y=316, so at 36px they nearly touch and the
    logo reads as a kicker on the headline rather than as a stamp on the slide.
  - At the old **27** the word alone sits there as a caption. The glyph used to
    give the lockup its height; take it away and 27px has nothing holding it up.
  - **31/700 is the split**: small enough to stay clear of the h1, heavy enough
    that the weight — not the size — is what separates it from everything else
    on the slide. A logotype differs from a heading by texture, not by scale.
- **The same wordmark is on the link-preview cards** (`platform/src/lib/og.tsx`,
  same day), so a WhatsApp preview and a carousel slide are recognisably the
  same object. Change one and look at the other.
- **The question of two identities is closed** (owner, 2026-08-03, same day,
  later): *"no more of this diamond square shape, whatever it is. Take it off."*
  The serif "Booklesss" and the diamond are gone from disk and out of all 33 PDF
  build scripts; the grain went with them. `Brand/` now holds only the wordmark
  and the icon. There is one identity. Nothing needs asking before using it.

### A post about the logo itself

Rare, but it has its own shape — `brand` in `prog-post.mjs` is the reference.

- **Use the shipped files, not a screenshot containing them.** The subject is a
  brand asset, so the slide is that asset: copy the PNGs out of `Brand/` into
  `_source/feature-capture/` and place them with `object()`. No dev server and
  no capture script is involved. This is the one carousel that legitimately has
  nothing to photograph.
- **It can go bigger than a component day.** Everything in `Brand/` is drawn
  from the font's outlines, so 700–720px on a 1080 frame is still vector-sharp.
  A UI component is a raster and cannot.
- **Suppress the corner wordmark on any slide whose subject IS the wordmark** —
  `object({ …, wordmark: false })`. The mark at 31px in the corner over the same
  mark at 700px in the middle is one word twice, which reads as a mistake rather
  than a lockup. The icon slide keeps the stamp: a tile is a different object,
  and the corner mark gives it scale.
- **Never show a retired asset you can only show badly.** The old lockup existed
  only at 239×62, so a slide big enough to read it would be a blurry
  enlargement — which lands as poor craft, not as the argument being made. The
  caption carries the before; the slides carry the after.

## House style

- **Un-boxed, full-bleed.** Macro crops of the real UI bleeding off the frame.
  Never a screenshot sitting in a rounded card or a device mockup — that was
  built and rejected ("too small, boxed, images repeated").
- **All light.** No dark-background posts until the app ships a real dark mode;
  a light screenshot on a dark canvas does not sit right.
- **No swipe arrows, no page counters.**
- **One distinct shot per slide.** Repeating a crop across slides reads as
  padding.
- **The wordmark cannot be the subject of a slide it is also stamped on.** Every
  slide carries "Bklsss" at 31px in the top-left corner, so a slide whose
  component IS the header lockup — the same word, black, on a light ground —
  comes back looking like the stamp printed twice at two sizes rather than like
  a logo shown large. The tab icon works because it brings its own black tile
  and cannot be mistaken for the stamp. If a post is about the logo, show the
  surfaces that differ in kind, not the one that matches the corner.
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
  kill node, `rm -rf .next`, rebuild. A corrupted `.next/dev` shows up as every
  route 500ing with `Cannot find module '../chunks/ssr/[turbopack]_runtime.js'`.
- **A stale `.next` 404s every route, including `/`.** Different symptom from
  the 500 above and easy to misread as a broken app or a bad checkout: a dev
  server killed mid-flight, or a worktree repinned to a different commit without
  clearing its cache, leaves a route manifest that matches neither. `rm -rf
  .next` and restart. **Repinning a worktree always needs it** — the cache was
  built from other source.
- **`TaskStop` on a backgrounded `next dev` kills the wrapper, not the server.**
  The port stays held and the next start dies with `EADDRINUSE`. Find the owner
  (`Get-NetTCPConnection -LocalPort 3100 -State Listen`) and stop that PID.
- **Check `git status` before blaming the app — and before trusting a shot.**
  Two sessions share this working tree, so the reader can be mid-refactor and no
  amount of restarting fixes it. The sharper risk is the quiet one: on 2 Aug the
  parallel session was rewriting *the very control this day's morning carousel
  was about*, and shooting the working tree would have published their
  unfinished work. Then it landed a different version of that control while the
  shots were being taken, so the finished carousel showed a component that no
  longer existed. **Shoot from a worktree pinned to a named commit, re-check
  `git log` before rendering, and write the commit into `PLAN.md`** so the post
  can be dated against the app. When that happens, capture from a clean checkout
  instead of touching their work:
  `git worktree add --detach C:/bkls-shot <commit>`, `npm ci` inside it, dev on
  a second port, `BASE_URL=http://localhost:3101 node _scripts/cap-*.mjs`.
  Two things that cost time there: the worktree path must be **short** (a long
  one hits Windows' filename limit mid-checkout), and `node_modules` must be a
  **real install** — Turbopack rejects a junction pointing outside the project
  root ("Symlink [project]/node_modules is invalid").
- **Never put deleted code back into the shared working tree to photograph it.**
  A feature that shipped and was pulled the same day is a good build-in-public
  story, and `git show <commit>:<path> > <path>` looks like a cheap way to shoot
  it. It is not: on 3 Aug the other machine committed over the restored files
  and deleted them **mid-capture**, and worse, it could as easily have committed
  them — pushing a reverted feature back into production. Repin the shooting
  worktree to the commit instead. **Repinning is cheap once the worktree exists**
  (`git checkout --detach <sha>` + `rm -rf platform/.next` + restart the dev
  server; `node_modules` survives if `package.json` has not moved between the
  two commits — check with `git diff --stat A B -- platform/package.json`).
- **Guard a section on the SERVED app, not on `PLATFORM`.** `paths.mjs` resolves
  `PLATFORM` to the shared tree, so an `fs.existsSync` guard for a file that only
  exists at the pinned commit is always false while the shot is being taken from
  a worktree. It skips the section and says so, which reads like a decision.
- **The app's content comes from Supabase via `npm run gen:course`,** so a
  worktree pinned to an old commit still needs a regen to hold today's steps —
  and will pick up whatever the other session last seeded.
- **Derive the date from `new Date()`,** never hardcode `DAY`. A hardcoded date
  filed a whole day's posts under a phantom weekday folder.
- **There is no posting connector.** The posts are a manual upload — always say
  so when handing the day over.
- **The rendered PNGs are gitignored** (`Demand/social/posts/**/*.png` and
  `_source/feature-capture/*.png`). They ran the push into HTTP 408s at ~60MB, and
  they are regenerable from the scripts anyway. Commit the recipe — capture
  script, post config, and each day's `PLAN.md` — never the images.
