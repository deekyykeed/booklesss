# daily-post — the rules

Everything here was learned by getting it wrong once, usually in front of the
owner. **Part 1 is not advice.** Read it before every day's build; a post that
breaks one of those rules gets deleted, however well it is made.

Add to this file whenever the owner reacts to a rendered slide. Delete a rule
that turns out to have been a one-off.

---

# PART 1 — THE HARD RULES

## 1. One component. One.

**A carousel is ONE control, shown large, in three or four states.** Not a
screen, not a section, not a group, not a list of the same component repeated.

The test is a sentence: *what is the one thing in this frame?* If the honest
answer is plural — "four course cards", "a list of rows", "the heading and the
cards under it" — it is not a component post, and shrinking it to fit the frame
makes it worse, not legal.

> 2026-08-04: a slide showed the dashboard's course section with all four
> courses in it, scaled down to 420px so it fitted. Owner: *"why show all four
> courses on the same page? I'm only showing one component."* The fix was the
> slide next to it — **one** card, at full width, at three stages of progress.

- **Enlarging one thing beats fitting several.** A component that fills the safe
  box reads as a product. The same component at a third of that size, three
  times over, reads as a screenshot of a page.
- **AND IT HAS TO ACTUALLY FILL IT.** `w` is the width of the COMPONENT, not of
  the PNG it arrived in, and the render enforces that — `fitObject()` reads each
  file's alpha bounding box, scales so the opaque part is `w` wide, and centres
  *that box* in the stage. It prints what it drew:
  `slide 1: component 752x315 (asked 752)`. **The two numbers must agree**; a
  smaller drawn width means the height bound took over, and anything else is a
  bug. Start at 752 — the safe box's full width — and come down only for
  something that would be absurd there.
  > 2026-08-04, on the day's last post: *"you're not zooming in enough so the
  > actual element you're showing is clear."* Every config that day already said
  > `w: 752`. `isolate()` bakes 16 css px of transparent padding into each file
  > so a shadow is not clipped, so sizing the IMG to 752 drew **633px of
  > component** and gave 16% of the frame's clear width to empty gradient,
  > invisibly. A wide component still cannot fill the frame vertically — a 2.4:1
  > card at 752 is 315 tall in an 1100 stage — and the answer to a slide that
  > feels empty is a taller subject, never a wider box.
- **A section is not a component.** `section#courses` contains cards. The card
  is the component.
- **Repeat the component, not the frame.** Three slides of the same control in
  different states is the shape. Three slides of different controls is a tour.
- **A WIDE, SHORT control is not a subject, however good it is.** The ActionBar
  — the app's one button shape, in four genuinely different jobs — is 336×34
  css, so at the full width of the safe box it draws **80px in an 1100px
  stage**. Rendered, it is a sliver on an empty gradient (2026-08-05, `s-bar`,
  kept in `prog-post.mjs` unposted). The rule of thumb: anything past about
  **5:1** cannot carry a slide. The course card at 2.4:1 is the flattest thing
  that has worked.
- **Nor is one whose ASPECT changes between states.** The same ActionBar sits
  full width in a course card and half width in the offline card's two-column
  grid, so two of its four states blow up to twice the type size of the others
  and the set stops reading as one component.
- **A TALL subject is the answer to an empty frame, and it needs its own `w`.**
  The nav tree is 283×540 css, so the HEIGHT bound takes over and `w` stops
  being the control — 750 and 480 draw the same picture until the height comes
  down. At the full bound (`stage − 60`) the component starts at y=330 and runs
  into the corner wordmark at 316. Set `w` so the drawn height is ~880, not
  1040.

## 1a. States of one component must be SCALED as one

`fitObject` sizes a component by its ALPHA box, which is right until the thing
that changes between states is **how much ink there is**.

> 2026-08-05: the contents list at three reading positions. The first state has
> nothing answered, so no green ticks, so its opaque content stopped 200px short
> of the states that did — and it rendered **966px tall beside its own siblings
> at 332**. The same component, claiming to be three times the size, because
> less of it was drawn in.

Pass `group: "<name>"` to `object()` on every slide in such a set.
`prog-post.mjs` measures the union of the whole set's alpha boxes **before** the
render loop (slides render one page at a time, so a slide cannot see its
siblings) and gives them one scale and one centre. The set then registers: same
place, same size, and only the state moves.

- **Group when the ink changes; do not group when the component GROWS.** The
  comment box gets taller down its carousel and that is the argument — grouping
  it would register all three against the tallest and strand the empty one in
  the top third of the frame. All three run the panel's full width, so they
  already scale identically.

## 2. The component has to make sense on its own

Isolating a control removes everything that gave it context. If the thing left
in the frame cannot be understood without the page around it, **it is the wrong
subject** — do not post it and do not try to rescue it with a caption.

> 2026-08-04: the tap-to-define card, isolated. Owner: *"doesn't make any
> sense — what is it pointing at? it's not even interesting, why would you add
> it."* A definition card floating on a gradient is a paragraph in a box: the
> word it defines, the sentence it interrupted and the tap that opened it are
> all outside the crop, and those were the entire idea.

Before capturing, ask: *shown this alone, would a stranger know what it is and
why it matters?* A course card passes — a title, a score, a streak, a curve, a
button that says Resume. A tooltip fails.

## 3. Three to four slides. No CTA slide.

**The call to action is the caption. There is no CTA image** (owner's call,
2026-08-04: *"from now on I'm removing the call to action last image, so now I
can just have 3 images minimum without it"*).

- **Three slides minimum, four is the usual, five is the ceiling.**
- **A WHOLE-SCREEN DESIGN POST CAN BE ONE SLIDE**, and the minimum does not
  override the owner asking for one.
  > 2026-08-06, on the new front door, built as three moments of its entrance:
  > *"just one page at the end of the animation."* A carousel of one screen at
  > three points in its own animation is three pictures of the same screen —
  > the difference between them is a button arriving, which is a thing to say
  > in the caption, not three slides to swipe. The finished page is the design.
  >
  > This is the reverse of the states rule, not an exception to it: a
  > COMPONENT carousel earns its slides because the component is doing
  > different things. A whole screen at rest is doing one thing.
- `dmCTA()` and `searchCTA()` stay in `prog-post.mjs` **unused by new posts** —
  every carousel already published ends on one, and deleting them would
  silently change what was posted the moment an old day is re-rendered. Do not
  call them in a new config and do not edit them.
- Every caption still ends *DM me "link" and I'll send you the whole thing.*

## 4. No copy on any slide

No headline, no eyebrow, no sub, no labels. The corner wordmark stays; that is
a stamp, not copy. The caption carries the whole story — it is read while the
reader is already looking at the thing.

A slide that needs a headline to be understood is failing rule 2. Fix the
subject, not the slide.

## 5. Five slots, every day

Morning 07:00, midday 11:00, afternoon 15:00, evening 19:00, night 21:30 —
folders `1-morning/` … `5-night/`, numbered so they sort in posting order.

**Five slots get filled** (owner, 2026-08-04: *"its 5 posts"*). They do not all
have to come off today's commits. When the day's ship supports fewer, fill the
rest from something dateless:

- **the logo plates** — sixteen in `2026-08-03 Monday/6-logo/`, built for this.
  Copy four into the slot as `01`–`04`. No CTA slide, no copy, caption only.
  **All sixteen are now spent** (eight on 4 Aug, eight on 5 Aug), so the next
  thin day builds a fresh set with `SLOT=<slot> node _scripts/logo-variants.mjs`
  before it can lean on them. Mix light and dark plates within a slot rather
  than posting four black ones — the house rule is all light, and a set that is
  half black reads as a brand system rather than as a dark post.

  **A PLATE SLOT NEEDS FOUR DIFFERENT TREATMENTS, NOT ONE TREATMENT ON FOUR
  GROUNDS.** This is rule 1's "states must differ in kind", pointed at the
  brand instead of at a control, and it is what separates the two plate slots
  of 5 Aug.

  > Midday went out as `08-icon`, `09-icon-round`, `02-mark-dark`,
  > `16-knockout`. Owner: *"the mid day ones were bad — not a good rep."* It is
  > two pairs of near-duplicates: the same tile square then round, then the same
  > word reversed out of black twice. Four slides, two ideas, and neither of
  > them says anything the other doesn't.
  >
  > Evening went out as `13-bleed`, `04-mark-purple`, `06-name-dark`,
  > `12-macro-sss`. Owner: *"evening was good — better illustration and creative
  > showcase of logo on different ways."* Four different ideas: the word running
  > off the frame, the word on the brand hue, the full name reversed, and one
  > letterform blown past the edge.

  So when picking four, say out loud what each one is FOR. If two of them need
  the same sentence, one of them is padding — swap it, or build a new plate.
- **a product component that has not been posted yet.**
- **a product component already posted, on a DIFFERENT AXIS.** Legitimate and
  with precedent: the `cards` block went out on 2 Aug at three *kinds* and on
  3 Aug at three *fill levels*, and the nav tree went out on 3 Aug at three
  *depths* and on 5 Aug at three degrees of *clearing*. The test is whether the
  new set answers a different question about the component. Re-shooting the same
  axis is padding.

Say in `PLAN.md` which it is and why. An honest fifth post beats an honest
explanation of why there isn't one.

**Two plate slots in a day is the ceiling.** A third was built on 4 Aug and the
owner sent it straight back — *"all of them were very good except that last one,
can you redo it focusing on something else."* Two reads as a brand thread
running through the day; three reads as the reserve carrying it. The fix was a
product component nobody had shot yet, which is almost always available: the app
has more controls than a thin day has plates.

## 6. The sign-up flow is not a post

**Onboarding, sign-up, account creation and the questions attached to them are
never the subject of a carousel** (owner, 2026-08-04: *"I'm not posting
onboarding things online"*).

A student follows a study app for the studying. The door they came through is
not content. This holds **however good the components are** — the 4 Aug
onboarding rebuild made four honest component carousels and all four were
deleted. The rule is about the subject, not the craft.

A day whose only commits are a sign-up rebuild is **a day with no ship to
post**. Take the five slots off the product or the plates (rule 5).

The surfaces next door are fine on their own terms: the dashboard is a product
post, a course card is a course card. Just don't tell the onboarding story
over them.

## 7. Never a course, never a school — and the placeholder is a UNIVERSITY course

Booklesss is not one syllabus and not one university. No post may name a
course, a course code, a school, or a subject-specific term. Naming one tells
every student who isn't on it that the product isn't for them.

`neutralize.mjs` relabels the UI before every shot and `scan()` checks **the
exact crop about to be photographed**, throwing on a hit. Captions follow the
same rule — no course hashtags.

**The neutral curriculum is four university courses**: Organisational
Behaviour, Business Law, Operations Management, Marketing Management, each with
a real course tree under it. It used to be Mathematics / Physics / Computer
Science / Data & Statistics, and the owner's verdict on seeing a dashboard read
"Mathematics 64%" was *"make it different courses and serious courses, not
something silly like Mathematics of all things — these are university level
students"*. A school subject on a slide is the same mis-signal the banned list
exists to prevent, pointing the other way.

- If a shot trips the scan, extend `MAP` or move the crop. **Never delete a word
  from `BANNED`.**
- **Map a course's WHOLE tree, not its title.** A half-mapped course is how a
  card headed Operations Management ends up offering a step about quadratic
  functions — and no banned word is in it, so nothing throws.
- **Anything that lists the app's own index is unpostable until the whole
  index is mapped.** The search palette is the case: it is GLOBAL, not
  per-course, so a query returns real step titles from every course. `MAP`
  covers lesson names and the step titles the reader shots need, not all ~200
  of them — and the scan cannot help, because an unmapped title is
  *off-syllabus*, not *forbidden*, so nothing throws. Shot as it stands, search
  returns a screen of hedging and forward rates under an app headed Marketing
  Management. Same trap as a half-mapped course, one level up.
- **A logo cannot be relabelled at all.** The onboarding school picker is
  university names beside their real crests; `transform` swaps text nodes and
  cannot touch an `<img>`. That screen is permanently unphotographable — as are
  worked examples, which are a course's own numbers and formulas.

## 8. The social safe area

The frame is 1080×1920 and the feed covers three edges of it:

| Edge | Covered | Why |
|---|---|---|
| top | 0 – **300** | account header, story progress bars |
| right | **848** – 1080 | like / comment / share / avatar rail |
| bottom | **1400** – 1920 | caption, handle, audio strip |

So the readable box is **x 96–848, y 300–1400** — 752 × 1100. `prog-post.mjs`
measures every `.safe` block and every `object()` after layout and throws if
anything crosses.

- **Widening the safe area is not a fix, it is the bug.** Shorten the line, or
  shrink the component.
- **752 is the maximum width any component can take**, and it is also the
  target: fill the box, don't float in it.
- The right rail is the one that catches people — it eats 232px, so the
  readable centre is x=472, not 540.

## 9. Never draw. Never retouch.

Every pixel of product in a post is the product. Framing, cropping and fading
are the only liberties.

If a screen looks thin, the fix is **data**, not decoration: seed plausible
progress and shoot again. Never invent a card, a chart, a badge or a number.

Seeded data stays plausible — someone a few weeks in, a live streak, a couple
of steps going stale, never a finished course and never a perfect week. The
numbers on screen must be the app's own arithmetic on real ids, so a screenshot
can be trusted.

## 10. A HALF-BUILT FEATURE IS NOT A SUBJECT

**Rendering is not shipping.** A control can be on screen, respond to a tap and
save what you type, and still be a third of the feature it is going to be. Do
not post one.

> 2026-08-05: the comment box went out at three states — empty, written in,
> carrying the notes already written in that step. Owner: *"afternoon was not
> good — showing an incomplete feature."* And it is: `platform/COMMENTS-PLAN.md`
> opens *"A plan to approve, not code that exists. Nothing here is built. The
> thing shipped is a private notebox on one device; this is what turns it into
> people talking."* The whole point of section comments is other students
> answering you, and none of that exists.

This is a harder line than the honesty rule in the skill's README, which says
copy about an unfinished thing should say "building this". That is right for a
`cover()` slide about work in progress. It is not a licence to shoot the
half-built control as though it were finished — a carousel has no copy on it at
all (rule 4), so the slides cannot carry the caveat, and the caption arrives
after the reader has already decided what they are looking at.

**The test before capturing: if a student used this today, would they get the
thing the post implies they get?** For the notebox the answer is no — they get
a private box nobody will ever answer.

Two consequences worth keeping:

- **`grep` the repo for a plan file before picking a subject.** A `*-PLAN.md`
  next to the component is the app telling you it is not done.
- **The two posts that landed on 5 Aug are the pattern.** The contents rail
  (*"great illustration of the feature"*) and the tree's step rings
  (*"amazing"*) are both a **finished** control whose STATE is drawn on its
  face, shown at three degrees of that state. Nothing about either is waiting on
  a backend.

---

# PART 2 — MAKING A CAROUSEL

## Choosing the component

**Pick components with something in them** (owner, 2026-08-02: *"you need to
focus on more interesting bits"*). Three near-identical white cards of body
text is the dullest thing the app owns. The course card is the opposite — a
folder mark, a streak, a fortnight of that course's own reading drawn in its
own hue behind the text, a score, and a Resume button whose fill IS the
progress bar. Ask what is in the frame besides text.

**States must differ in KIND, not in wording.** A course never opened reads 0%,
no streak, no curve, and says *Start* — that is a different picture. Two
definitions of two different words are the same picture twice.

**A component whose height is the story has to be measured, not assumed.**
Print the css size `isolate()` reports and check the numbers actually differ.

## Placing it

`object({ img, w, flat })` in `prog-post.mjs`.

- **`w` per component, not globally.** A 34px button and a 370px card both
  rendered at 700px claim to be the same size, and one is a 20× enlargement.
- **Fill the safe box. Go closer than feels right.** Start at 752 and come down
  only until the check passes. `isolate()` shoots at `deviceScaleFactor: 8`, so
  the pixels are there.
- **Same component, same `w` across its states** when the data is what differs —
  changing the size misreports the component. Vary `w` only when the states are
  genuinely different objects.
- **STRAIGHT. No skew, no perspective.** Tried 2 Aug, rejected on sight: *"the
  skewing thing doesn't work, it is very ugly."* Flat vector UI with hairline
  borders goes through a resampler and stops looking like a card. Depth comes
  from the shadow and the space around it.
- **`flat` for a component with no surface of its own** — a bare glyph, an
  underlined word. On those the wide shadow spreads grey through the gaps and
  reads as a smudge.
- **`drop-shadow`, never `box-shadow`.** box-shadow draws the shadow of the
  PNG's rectangle — a hard oblong behind a floating glyph.
- **Shadow: cut the blur WIDTH, never dim it.** Learned three times on this
  project; the owner's word was *harsh* both times and the culprit was always a
  52px layer, not the alpha.

## Isolating it

- **An element screenshot is a clip of the page, not a render of the element.**
  Hide everything and unhide the component: `body *{visibility:hidden}` +
  `[data-iso],[data-iso] *{visibility:visible}`, plus
  `html,body{background:transparent}` and `omitBackground`. `visibility`, not
  `display`, so nothing reflows.
- **Pad the clip, and scroll into view before measuring.** A component's own
  parts can sit outside its border box.
- **A component taller than the VIEWPORT comes back silently clamped.** A page
  clip is measured against the viewport, and `scrollIntoViewIfNeeded` cannot
  fit a 959px element in an 874px window — it wrote a card sliced through its
  title and looked deliberate. Only the WIDTH decides the mobile layout, so
  make the window as tall as the subject needs (`h: 1500`).
- **A component's own wrapper may not exist.** For parts that are loose
  children of a `flex-1` scroller, `union: true` in `cap-0804.mjs`'s
  `isolate()` measures the box round the children instead of the element.
- **Isolate the LIST, not the scroller it sits in** — a fixed-height overflow
  container returns the same box for every state.
- **Select by what a component HAS, not by the utility classes around it.**
  `:has()` is valid CSS and resolves inside `page.evaluate`; `:has-text()` is
  Playwright's and throws there.
- **Selecting by TEXT finds the sidebar.** `/my courses/i` across leaf nodes
  matched the home rail's nav link, and the scroll aimed at the wrong element.
- **Index into a set only when nothing else identifies the member.** Picking
  answered marks by `nth` gave the seeded rows, and a sad face shipped under a
  filename saying thumb up.

## Capture

- **Shoot the app's MOBILE layout** — 402 wide, `deviceScaleFactor: 8` for
  components, `isMobile: true`.
- **Remove the Next dev badge before every screenshot.**
- **Re-run `prep()` immediately before every screenshot.** React re-renders undo
  a relabel; one done after navigation is stale by the third crop.
- **Retry the relabel once after a navigation.** A route the dev server has not
  compiled yet repaints a beat later and kills a running transform with
  *"execution context was destroyed"*.
- **`networkidle` is the wrong navigation wait against a dev server** — HMR
  holds a socket open. Wait for the DOM, then a known element.
- **Scroll to the top before any full-page screenshot** — `position: sticky`
  renders wherever the page is scrolled to.
- **Seed progress before shooting the dashboard.** It reads
  `localStorage["booklesss:progress:v6"]`; a virgin browser photographs as an
  empty app. Cluster the rest days in pairs — alternating days off draw a comb.
- **Some components only exist in a PRODUCTION build.** The offline card
  (`.dash-offline`) renders only when a service worker is active, and
  `RegisterSW` deliberately *unregisters* the worker on anything but production
  — so on `next dev` the component returns null and the selector times out with
  nothing to explain it. `npm run build && npx next start -p 3101` in the shot
  worktree. Anything touching offline, caching or install is in this class.
- **Assert the state at the shutter, not just before it.** A state that ends by
  itself — a save counting up, a toast, a spinner — can finish between the wait
  and the screenshot, and the file lands under a name describing something no
  longer on screen. Pass the state's own words as a regex (`expect:` in
  `cap-0804-night.mjs`) and let the capture throw. Same failure as picking an
  answered checkpoint by index: it looks deliberate and it is wrong.
- **CDP network throttling does not reach a service worker.**
  `Network.emulateNetworkConditions` applies to the page's network target; the
  worker has its own, so a save being throttled to 400kb/s still finished in
  milliseconds. `context.route()` with a `setTimeout` before `route.continue()`
  does catch the worker's fetches — and a slow connection is the honest setting
  for a feature that exists because of one.
- **Shoot gated pages from a worktree with the AUTH keys commented out.** A
  headless browser is always signed out, so `/dashboard` holds behind its
  onboarding gate. The flag is `authEnabled` in `lib/auth.ts` and it reads
  **`NEXT_PUBLIC_SUPABASE_URL && NEXT_PUBLIC_SUPABASE_ANON_KEY`** — it replaced
  `clerkEnabled` and its single publishable key on 2026-08-05, so a worktree set
  up before then comments out the wrong pair and the gate comes back on.
  `C:/bkls-shot` is set up correctly — leave it.
- **Re-pin the shot worktree, and `npm install` when you do.** It holds its own
  `node_modules`, so a pin that crosses a dependency change (Clerk out,
  `@supabase/ssr` in) fails to build with an error about the app rather than
  about the install.
- **The step a reader shot is taken on is a decision, not a default.** Only
  ONE course has its whole tree in `MAP`, and inside it only some steps have the
  generic section set — Overview, Key ideas, In practice, Summary. Anything that
  lists a step's SECTIONS has to be shot on one of those: the step yesterday's
  shots used has its own headings ("Treasury as a cost centre"), which is
  invisible in a 370×34 crop of one row and fatal in a contents list.
  `/microeconomics/supply-demand/law-of-demand` is the known-good one.
- **The left drawer has a button; the right one is a swipe.** `button[aria-label="Open navigation"]`
  opens the course tree. The step-context drawer lost its button on 1 Aug, so it
  takes a real gesture — CDP `Input.dispatchTouchEvent`, >=12px to declare the
  drag horizontal and 55px of travel to open. **Try several heights**: MobileNav
  refuses to track a drag starting inside anything scrolling sideways or wearing
  `[data-no-swipe]`, so one fixed y opens the drawer at the top of a step and
  silently does nothing half way down it.
- **Relabelling is case-sensitive**, misses callouts and list items unless each
  is walked separately, and must be written **past the fold** — the scan tests
  every element whose box touches the crop.
- **Map both spellings of an ampersand.** The dashboard's Resume chip prints
  "and" where the nav prints "&".
- **A clean scan is not a clean crop.** A step title with no banned word in it
  can still be a lie under the wrong course heading. Read the crop.
- **Print the offending SENTENCE, not just the banned word** — most hits are a
  substring inside a longer word.

## Captions

- **The caption is the post's words.** Longer and plainer than a headline,
  because it is read with the picture already in front of the reader.
- **Ends with the CTA, always:** *DM me "link" and I'll send you the whole
  thing.* Never "comment" — you cannot put a link in a comment.
- **About the product, not the syllabus.** The slides sell what it is like to
  study in it; the course content is evidence, not the pitch.
- **Banned words** apply as everywhere in Booklesss: no "seamless", "journey",
  "empower", "leverage", "game-changer", "robust", "delve".
- No course hashtags.

## House style

- **Un-boxed, full-bleed.** Never a screenshot sitting in a rounded card or a
  device mockup.
- **All light.** No dark-background posts until the app ships a real dark mode.
- **No swipe arrows, no page counters.**
- **One distinct shot per slide.** Repeating a crop reads as padding.
- **The logo is the word.** `wordmark` is `<span>Bklsss</span>` at 31px/700 —
  not 27 (too quiet without the retired glyph holding it up), not 36 (crowds
  the frame). Suppress it only on a slide whose subject IS the wordmark.

---

# PART 3 — THE RARE COPY SLIDE

A `feature()` or `cover()` slide is an **exception** and has to be earned by a
claim no single component can carry. The 3 Aug midday post is the only
precedent: its claim was that two *different* screens now say the same word,
and no isolated control can show two screens agreeing.

*"The screen looked empty without a headline"* is not that — it means the wrong
subject was picked. Before writing a `title:`, name the claim and say why one
component cannot make it.

If one is genuinely earned:

- A 9:16 shot at `width: 1120px` renders **1991px tall**; `top` is where its
  top edge sits. `scale = 1120 / 402 = 2.786`, and
  `top = 1180 − subject_y × scale` puts `subject_y` (in the capture's own css
  space) in the middle of the clear window.
- Defaults: `fadeTop: 1000` (solid to 800), `fadeBot: 560` (transparent at
  1360). Only **1000–1360** is fully clear.
- **All copy must finish ABOVE `0.8 × fadeTop`** — that is where the background
  stops being solid. An h1 at 360 and a two-line sub at 640 clear the default
  800 with 50px to spare; a three-line sub fails by about 4px.
- **`top` ≤ `0.8 × fadeTop`**, or the shot's own top edge draws a line.
- **`shotLeft: 0` on any macro crop** — the default −40 shaves the first letter
  off every line.
- **A `feature()` slide cannot frame the FOOT of a screen.** The image's bottom
  edge strands around y≈1430 and no `fadeBot` reaches it without swallowing the
  subject. Shoot the thing as an `object()`.
- **A whole `h-dvh` screen is not a slide at all.** Heading pinned top, action
  pinned bottom: at 1080 wide they land under the story bars and the caption,
  and everything between is empty page. Isolate the controls.
- **Widen the window for tall content** — drop `fadeBot` to 330–460 so the
  punchline stays crisp.

---

# PART 4 — OPERATIONAL

- **Rendering a post DELETES that slot first, and the PNGs are gitignored.**
  `prog-post.mjs` does `fs.rmSync(OUT, {recursive: true})` before writing, so a
  mis-aimed `POST=` is unrecoverable. **Read the day's `PLAN.md` before choosing
  a slot.** This is also why a rendered config is never deleted — it is the only
  backup a post has.
- **Check `git status` before blaming the app — and before trusting a shot.**
  Two sessions share this tree. **Shoot from a worktree pinned to a named
  commit** and write the commit into `PLAN.md`:
  `git -C C:/bkls-shot checkout --detach <sha>`, `rm -rf platform/.next`, dev on
  :3101, `BASE_URL=http://localhost:3101 node _scripts/cap-*.mjs`.
- **Never put deleted code back into the shared tree to photograph it.** The
  other machine can commit it — pushing a reverted feature into production.
- **Never delete another session's build artifacts.** `.next` is shared.
- **A "server already running" error is not proof of a healthy server** — check
  the port is actually serving before working around it.
- **Windows `EPERM` on `.next` is a cloud-sync lock, not a concurrent build.**
  Retrying fails identically every time; check no node process is running, then
  clear the directory. A *stale* `.next` 404s every route — same fix.
- **`TaskStop` on a backgrounded `next dev` kills the wrapper, not the server.**
  `Get-NetTCPConnection -LocalPort 3101 -State Listen`, then stop that PID.
  The inverse also bites: the Bash tool's `run_in_background` printed *"Ready in
  2.2s"* and then **exited 127 with nothing left on the port** (2026-08-06).
  Start the server with `(npx next dev -p 3101 > log 2>&1 &)` in the same shell
  as the capture, or detach it from PowerShell — and either way poll the port
  before shooting rather than trusting the banner.
- **STOP THE SERVER BEFORE CLEARING `.next`.** Deleting it under a running dev
  server leaves that server answering **500 on every route** (`ENOENT …
  routes-manifest.json`), and the failure surfaces as the capture timing out
  waiting for a selector — which reads as a page problem rather than a build
  one. Re-pinning the shot worktree is: stop, checkout, clear, start.
- **Derive the date from `new Date()`,** never hardcode `DAY` — but **pass
  `DAY=` explicitly on any re-render after midnight.** A slot rebuilt the next
  morning without it writes a fresh day folder and leaves the real slot holding
  the stale image, silently. (2026-08-06, re-rendering the front door.)
- **THE SUBJECT MAY STILL BE MOVING. Shoot it LAST, and re-check before
  posting.** A feature that shipped this morning is not finished being designed;
  on 2026-08-06 the front door changed five times over the day the post about it
  was built, twice reversing itself, and every earlier frame was a picture of a
  design that had already been replaced. Three habits, all cheap:
  - **Give every capture script an `ONLY=` switch** (`cap-0806.mjs`) so one
    subject can be re-shot without re-running the others. This is what makes a
    third and fourth pass affordable.
  - **Write the shot's commit sha into `PLAN.md`, and keep the whole sequence**
    when it moves more than once — a bare "shot at HEAD" cannot be checked
    later.
  - **`git log --oneline -1 -- platform/src/app/<the page>` before posting.** If
    a commit lands after the sha in `PLAN.md`, the frame is stale.
- **A screenshot of a fabricated number is honest; a caption repeating it is
  not.** The front door's "Join 67+ members" starts at a constant and ticks up
  on a timer — `MemberCount.tsx` says so in its own header, and it is the
  owner's call. Rule 9 is satisfied because the slide is an unretouched picture
  of what the page shows. The caption is a different thing: it is the account
  speaking, so it may not restate an invented figure as a fact. Check any number
  visible in a crop against the code that produces it before writing copy about
  it.
- **The rendered PNGs are gitignored.** Commit the recipe — capture script, post
  config, `PLAN.md` — never the images.
- **There is no posting connector.** Always say the upload is manual.
