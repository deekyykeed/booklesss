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
