# Feedback log

Every reaction anyone has had to a reader step — the owner reviewing, the owner
studying for a real exam, or a student — newest first. Append-only: entries are
never edited or pruned, because "we've been here before" is the strongest signal
that something should become a rule.

Format:

```markdown
### YYYY-MM-DD · course/lesson/step · source
- `tag` — what they said, in their words. What changes as a result.
→ promoted: **X-n** · debt: **D-n**   (or → one-off · debt: none)
```

Sources: `owner` (reviewing) · `study` (owner studying it for the exam) ·
`student · <name>`

Tags: `writing` · `element` · `structure` · `content` · `error`

Quote actual words. A student's phrasing is never rewritten into the owner's.

---

### 2026-08-01 · treasury-management/treasury-operations/treasury-levels-and-mandate · owner
- `writing` — of the step's opening sentence, "Take one exposure and watch it
  pass through all three levels": **"this sentence [doesn't] start well"**, and
  **"can you make sure steps a friendly for beginners and not confusing"**.
  Three separate faults in one sentence, which is why it read badly rather than
  merely oddly: it uses **exposure** as a countable noun to a reader who has
  never met the word; it says **"all three levels"** before a single level has
  been named, so the count cannot be resolved; and it is a **stage direction**
  ("Take one X and watch it…") announcing the demonstration instead of starting
  it. The demonstration itself is the right move and is the one the engagement
  pass prescribes ("one case through the whole ladder") — the defect was
  narrating it. Fixed by deleting the announcement: the miller now arrives in
  the first sentence, the risk is shown before it is named, and *exposure* is
  defined in the sentence that introduces it.
  New **W-13**, plus a seventh check in the engagement pass ("the cold open").
- Scoped before opening the debt rather than after: all **218 section openings
  across the 44 published steps** were scanned for device-narration and
  unresolvable references. **One real defect** — this one. `vrio-applied`
  ("all four tests") refers back to the VRIO section immediately before it,
  which W-13 explicitly permits, and `yield-curve` tripped the scan on the
  idiom "over and above". So the rule is new but the house was already mostly
  keeping it.
→ promoted: **W-13** · debt: **D-4**

---

### 2026-08-01 · treasury-management/treasury-operations/intro-to-treasury · owner
- `writing` — "we're using *your* too many times, you need to reduce that."
  W-10 had been applied to every noun rather than where it lands. Measured
  before rewriting: **29 in 1,657 words, one per 57**. Now roughly one per 200.
  W-10 revised with a budget rather than left as an instruction to use it.
- `writing` — "reduce the [length] in these other sentences… the user wouldn't
  want to be reading forever, just drive the point home." Six sentences were 35
  words or more; longest was 46. Now no sentence over 34 and the average is 14.
  New **W-12**.
- `structure` — "take advantage of nesting steps… it helps the step from being
  way too long to read… we can complete many steps in a short period rather
  than staying on one step for a long time." The real insight is that
  **finishing is the thing that keeps a reader going**, so the step, not the
  section, is the unit to keep short. TM 1.1's six sections became three steps
  of two, split on conceptual seams (what treasury is / how the work divides /
  how it is governed). Coverage identical, nothing cut. New **S-8**.
- `element` — the source links should carry "a favicon of the website where you
  got the info from… I'd like to see this spread around the step, meaning a lot
  of information is gotten from the websites." Built as a build-time favicon
  inliner rather than a favicon service: the app ships `default-src 'self'`, so
  a remote icon URL is blocked, and a service would hand every reader's page
  views to a third party.
→ promoted: **W-10** (revised), **W-12**, **S-8** · debt: **D-3**

Also fixed, all app chrome rather than step rules: the term underline was a
`border-b` on a button, so it sat at the foot of the button box a whole line
below the word; the popup flipped above on an unmeasured height of zero, which
is why it sometimes landed on top of the word it defines; it now carries an
arrow that tracks the word rather than the card; and the header avatar got a
real 1px border back, because `PlanRing` was drawing it as an SVG stroke that
read thinner than the border on the search button beside it.

---

### 2026-08-01 · treasury-management/operations/intro-to-treasury · owner
- `writing` — "instead of saying something like 'Day to day that means keeping
  suppliers paid' we say 'Day to day that means keeping **your** suppliers
  paid'." W-9 had been applied at the level of the sentence's framing but not
  the noun; the possessive is the word doing the work. Swept the step: "its
  staff" → "your staff", "the bank balance" → "your bank balance", "the
  business" → "your business" in the definitions too. Third-party worked
  examples (the miller, the mining group, Barings) deliberately keep "the" —
  making those possessive is nonsense and would cost the word its meaning.
- `writing` — bold may cover a **whole sentence** where the whole sentence is
  the point ("Treasury executes; it does not set strategy."). W-8 as first
  written banned that outright, which was too strict; revised in place. What
  stays banned is a full sentence bolded by default.
- `content` — "including links to the sources where info is coming from is key…
  the sources in file are just books and all from the school, those just guide
  what the student is going to learn. But the real teachers are the trusted
  websites such as investopedia, CFI, Accountancy and others." New `sources`
  block type (`reader/Sources.tsx`), two links per section at the end of the
  section, each with a note on what it's good for. Six links on TM 1.1, all
  returning 200.
→ promoted: **W-10**, **W-8** (revised), **C-7** · debt: **D-2** (extended)

Note against C-7: **Investopedia could not be verified from this session** —
it 403s curl and blocks Claude's fetcher outright. Three intended Investopedia
links were swapped for CFI pages that could actually be checked rather than
shipped on the assumption the URL pattern was right. Written into C-7.

---

### 2026-08-01 · treasury-management/operations/intro-to-treasury · owner
- `writing` — "having words in bold is important to emphasize certain points
  that need to stick." Applied to TM 1.1 as the reference step, one to three
  bolded phrases per section, and made a rule so every later step is written
  the same way and can be ranked against it.
- `writing` — "id like to write to the student as they are the ones going to
  experience this in future… im speaking to them more as a future founder,
  deliberately giving them ownership." The step was still addressing an exam
  candidate — "the exam asks you to sort tasks between them" — which is the
  narrower of the two readers. Rewritten to land on the reader's own decision:
  what stays on your desk, what you can survive without while small, what you
  are buying when you hire. W-4 already asked for second person; this says who
  the second person **is**.
- `element` — "for certain words that are either key or not in the common
  vocabulary i want to have a popup when tapped to define it." Built as the
  `[[term|definition]]` inline mark (renderer: `lib/emphasis.ts` +
  `reader/Term.tsx`); eight terms marked in TM 1.1 — income statement, hedging,
  working capital, rating agencies, forward contracts, error account, front
  office, arbitrage, net.
→ promoted: **W-8**, **W-9**, **E-8** · debt: **D-2**

---

### 2026-08-01 · treasury-management/operations/intro-to-treasury · study
- `writing` — "the very first step is boring… spice it up, keep it engaging
  with a proper hook." Read correctly and felt nothing. The step opened on
  "Treasury is the financial centre of an organisation" — a category
  definition, nothing at stake on the first screen. Now opens on a profitable
  company that cannot make payroll on the 28th.
- `content` — no company, no figure, no date anywhere in the step. Six sections
  of pure definition. C-1 (ZMW/Zambian examples) was being dodged by having no
  examples at all rather than broken outright.
- `structure` — the best material in the step, Barings, was a single callout
  buried in section 4. Told as the story it is now: the date, the £827m, the
  error account, the one pound.
- `structure` — four definitional tables in six sections, each in the same
  `p → table → p` sandwich. Grey by the third one.
- `writing` — three levels (strategic/tactical/operational) were three table
  rows and no reason to care. Now one running exposure — a miller buying wheat
  in USD — carried through all three.
→ promoted: **W-3** (revised), **W-6**, **W-7**, **C-5**, **C-6**, **S-7**
· debt: **D-1**

---

*(first entry above — the seeded rules are now being replaced by the owner's
actual reactions)*
