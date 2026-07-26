# ECN 1115: Microeconomics — Course Prep (PROPOSED)

**Status:** proposal — not yet scaffolded. Confirm the structure below, then run
`lesson-skill` to emit `_course.md`, the lesson folders, the channel map, and the
course outline PDF.

**Last updated:** 2026-07-15 (prepared in a cloud session — see the source-material
note below before doing anything else)

---

## ⚠ Source material is on the owner's machine, not in this clone

The raw source for this course lives in `Schools/UNZA/_pipeline/`, which is
**gitignored** (files over GitHub's limit — local machine + OneDrive only). A cloud
clone has none of it. What CLAUDE.md says exists locally:

| Location (local only) | What it is |
|---|---|
| `Schools/UNZA/_pipeline/ECN 1115/` | UNZA course folder — lectures, notes, syllabus |
| `Schools/UNZA/_pipeline/_video-archive/` | MIT 14.01SC microeconomics lecture videos (+ ECO 155 macro) |

**Before the structure is final, run this on the local machine** and paste the
output into a session (it is the depth inventory lesson-skill needs):

```bash
python3 - <<'PY'
import os
base = r"Schools/UNZA/_pipeline/ECN 1115"
for root, dirs, files in os.walk(base):
    src = [f for f in files if f.lower().endswith(('.pdf','.pptx','.docx','.ppt','.md'))]
    if src:
        print(os.path.relpath(root, base))
        for f in sorted(src):
            print(f"   {os.path.getsize(os.path.join(root,f))//1024:>6} KB  {f}")
PY
```

Also worth doing locally while prepping:

```bash
python3 tools/transcribe_bulk.py "Schools/UNZA/_pipeline/_video-archive/"
```

(`transcribe_bulk.py` skips videos that already have a `_transcript.md`, so this is
safe to re-run — it only fills gaps.)

---

## Decisions to confirm

1. **Course code for the platform.** The `steps.course_code` column allows 2–4
   lowercase letters. `ecn` would collide the day ECN 1215 (macro) is promoted, so
   the proposal is **`mic`** for this course (slugs `mic-1-1`, `mic-1-2`, …) and
   `mac` reserved for macro later.
2. **Folder name.** `Schools/UNZA/ECN 1115 — Microeconomics/` (matches the
   `BBA 1110 — Business Administration` pattern). Confirm the official UNZA title
   from the syllabus — if it is "Introduction to Microeconomics", use that.
3. **Visual identity.** House default: cream `#FFFDE8` cover · black type
   `#121212` · warm rule `#E0DACB` · Parastoo-Bold display · Aptos body · no
   accent colour. Say the word if micro should get an accent the way SM has
   cardinal red.

---

## Proposed lesson architecture (provisional)

Built from the MIT 14.01SC unit structure (the video source in the archive). It
must be reconciled with the actual UNZA ECN 1115 syllabus and the depth inventory
before scaffolding — lessons only exist where the source has real depth.

Doctrine: **lesson = one mental frame = one Slack channel.**

| Lesson | Frame | Folder | Channel | Steps (provisional) |
|--------|-------|--------|---------|---------------------|
| 1 | Foundations — thinking like an economist: scarcity, choice, opportunity cost, what markets do | `01-foundations/` | `#mic-foundations` | 1.1 What economics studies · 1.2 Markets and the supply-and-demand idea |
| 2 | The Market Model — equilibrium, shifts, elasticity, interventions | `02-market-model/` | `#mic-market-model` | 2.1 Equilibrium and shifts · 2.2 Elasticity · 2.3 Price controls and taxes in practice |
| 3 | Consumer Choice — preferences, budget constraint, where demand comes from | `03-consumer-choice/` | `#mic-consumer-choice` | 3.1 Preferences and utility · 3.2 Budget constraint and choice (income vs substitution) |
| 4 | The Producer — production, costs, competitive supply | `04-producer/` | `#mic-producer` | 4.1 Production and costs · 4.2 Profit maximisation and competition |
| 5 | Welfare & Government — surplus, efficiency, taxes and subsidies | `05-welfare/` | `#mic-welfare` | 5.1 Who gains from trade: surplus and efficiency |
| 6 | Market Power — monopoly, price discrimination, oligopoly, basic game theory | `06-market-power/` | `#mic-market-power` | 6.1 Monopoly · 6.2 Oligopoly and strategic behaviour |
| 7 | Factor Markets & Extensions — labour, capital, trade *(only if the syllabus covers it)* | `07-factor-markets/` | `#mic-factor-markets` | 7.1 (pending syllabus) |

Plus `#mic-updates` as the announcements channel. **All channels must be created in
Slack before any step is posted** — and the workspace question
(`Operations/workspace.md`) is still unresolved, so confirm the target workspace
first.

### Judgment calls baked into the table

- Elasticity gets its own step (2.2), not its own lesson — a student working
  elasticity problems is still inside the market-model frame.
- Welfare (lesson 5) is separated from the market model (lesson 2) because
  "how the model moves" and "who gains and loses" are different headspaces —
  lesson 2 teaches mechanics, lesson 5 judges outcomes.
- Consumer theory and producer theory stay separate lessons. They are formally
  symmetric but students never confuse the frames; merging them would put demand
  derivation and cost curves in one channel.
- Lesson 7 is a placeholder. MIT 14.01SC covers factor markets, trade, and
  uncertainty late in the course; whether UNZA's ECN 1115 does is a syllabus
  question. Delete it without guilt if the syllabus stops at market power.

## Zambian example bank (for step-skill later)

All worked examples in ZMW with local companies, per house rules:

- **Scarcity / opportunity cost** — load-shedding hours as the economy's scarcity
  constraint; a student's K200 monthly data-vs-transport budget.
- **Supply & demand shifts** — mealie meal prices after a poor rain season;
  fertiliser input costs shifting maize supply.
- **Price controls** — ERB's administered fuel pump price; FRA maize floor price
  as a binding price floor (surplus maize the FRA must buy and store).
- **Elasticity** — airtime and data bundles (MTN vs Airtel price moves); bread vs
  DStv subscriptions for necessity-vs-luxury elasticity.
- **Taxes** — excise on airtime; VAT on standard-rated goods.
- **Monopoly / market power** — ZESCO as the single electricity seller; tariff
  reviews as regulated-monopoly pricing.
- **Oligopoly** — the mobile-network trio (MTN, Airtel, Zamtel); fuel retail
  (Puma, TotalEnergies, Engen) matching pump prices.
- **Factor markets** — mining wage negotiations (First Quantum, Mopani) for
  labour demand.

## Hand-off sequence

1. Owner syncs/confirms `_pipeline/ECN 1115/` source + runs the inventory above.
2. Confirm or amend the lesson table (this file), the `mic` course code, and the
   official course title.
3. `lesson-skill` emits `_course.md`, folder scaffold, channel map, outline PDF.
4. `step-skill` writes steps one at a time, starting 1.1.
5. Platform side is already able to take it: publish rows with
   `course_code='mic'` via the generator's `--emit-json` — no schema change
   needed.
