# Booklesss — Project Memory

**Last updated:** 2026-06-08

---

## Next Session

- [ ] Add NLM audio + video links to Steps 3.1, 3.2, 3.3 ADDED VALUE boxes (NLMs not yet created)
- [ ] Re-upload SM 2.1 and 2.2 to Slack — PDFs moved to flat paths this session, old Slack uploads are stale
- [ ] Post Lesson 1 to Slack: Step 1.1 → #sm-foundations, Step 1.2 → #sm-foundations
- [ ] Re-upload SM Step 1.2 to Slack (video overview link added to ADDED VALUE box session 2026-06-05) — get new file link, update workspace.md
- [ ] Remove `STEP_LINKS` / `step_ref()` from SM 1.1 and 1.2 build scripts — approach abandoned (see dead end below). Keep references as plain text.
- [ ] ~~Rebuild SM steps 2.1–3.2 to v2 standard~~ ✅ DONE 2026-06-06
- [ ] Strip the Slack invite link from CF **Step 1.1**'s `community_closer()` — still there, not actioned
- [ ] Roll the v2 standard across remaining CF steps: **1.3, 2.1, 2.2, 3.1, 3.2, 4.1, 4.2, 5.1**
- [ ] Extract a shared brand module (`booklesss_brand.py`) so CF rebuilds aren't ~600 lines of copy-paste each
- [ ] Create CF Slack channels (`#cf-updates`, `#cf-investment`, etc.) → update workspace.md
- [ ] Draft outreach messages to potential collaborators — raised end of previous session, not actioned
- [ ] Update Booklesss website pricing page manually in Framer: Community tier K800 → K500
- [ ] When Framer / Design Bridge plugin is online, pull exact Booklesss tokens and reconcile
- [ ] Export higher-res Booklesss diamond mark (current is only 34×34px)
- [ ] Fix page meta titles in Framer (SEO tab): /blogs, /about-us, homepage still say "Prodo"
- [ ] Add photo to Deeky Mvula team card
- [ ] Edit /legals page — still unedited Prodo template
- [ ] Monitor Tally form (tally.so/r/81Jejr) for submissions daily
- [ ] ⚠️ Path references in older Next Session items are now stale after the restructure: `operations/` → `Operations/`, `Finances/pricing-strategy.md` → `Operations/pricing-strategy.md`, `_dev/scripts/build_*.py` → each lesson's `sources/` folder (or `Operations/` for ops scripts). Re-resolve before acting on any of them.
- [ ] Verify each relocated `build_*.py` still resolves `_ROOT` correctly from its new `Schools/.../sources/` depth (CLAUDE.md says 5 levels up) before next rebuild — folder depth changed in the move.
- [ ] (Optional) GitHub repo URL is now lowercase `github.com/deekyykeed/booklesss.git` — remote still uses the old `Booklesss.git` and works via redirect. Update with `git remote set-url origin` if the redirect ever stops.

---

## Session Log

### Session 2026-06-08
**Done:**
- Committed the full repository restructure (work done outside a session wrap; landed it this wrap):
  - `courses/` (CF, SM, TM) → `Schools/ZCAS/<Course>/`; UNZA content under `Schools/UNZA/` with `_pipeline/` for the 13 raw courses. 472 PDFs + 30 `build_*.py` verified intact under `Schools/`.
  - `_dev/scripts/build_*.py` removed from the flat scripts folder — build scripts now live in each lesson's `sources/`; `transcribe.py` / `transcribe_bulk.py` moved to `_dev/` directly.
  - `Finances/` and `marketing/` folded into `Operations/` (pricing-strategy.md, positioning.md, monthly-tracker.md, dashboard.html, workspace.md, leads.md, revenue-log.md, groups.md, daily-checklist.md, product-notes.md, both ops build scripts + Revenue Model PDF).
  - New top-level `Demand/` and `Brand/`; old `Booklesss Bucket/` drop zone and `booklesss-pdf.plugin` deleted; `_dev/mcp-design-bridge.json` added.
  - `.claude/CLAUDE.md` rewritten to document the new School/Course/lesson anatomy and `_pipeline/` promotion flow.
- **Push unblocked:** the restructure commit tried to upload 1.9 GB of NEW blobs (the UNZA raw material entered the repo for the first time). GitHub kept resetting the connection (`curl 55`). Diagnosed it as 1.6 GB of third-party textbooks + scanned HSS past papers under `Schools/UNZA/_pipeline/` and `…/_textbooks/`, incl. **4 files over GitHub's 100 MB hard limit** (Ahuja 380 MB, HSS 2017-18 Part2 219 MB, IB Diploma textbook 178 MB, HSS Part3 154 MB). Added `Schools/UNZA/_pipeline/` and `_textbooks/` to `.gitignore`, `git rm -r --cached` both, amended the commit. Push dropped 1919 MB → **33.7 MB** and succeeded (`fff5c47..5c0b5e9`). Raw files remain on disk + OneDrive, just untracked.

**What Worked:**
- Verifying content survived the move before staging (`find Schools -name '*.pdf' | wc -l` = 472, `build_*.py` = 30) rather than trusting `git add -A` blind — confirmed no data loss across a large delete+re-add diff.
- Diagnosing the git remote confusion by comparing HEAD against both `origin/main` and `origin/master`: local `main` *tracks* the stale `origin/master` (17 behind), but `origin/main` (the repo default, `origin/HEAD`) is fully synced with HEAD. The "ahead by 17" warning is the tracking ref, not real drift. Push target is `origin/main`.
- To find what's bloating a push: `git rev-list --objects origin/main..HEAD | git cat-file --batch-check='%(objectsize) %(objecttype) %(rest)'` then sort by size. Pinpointed the 1.6 GB instantly.

**Dead Ends (do not retry):**
- Don't trust the "ahead of origin/master by 17 commits" status line as a sync problem — `origin/master` is an abandoned branch; the live branch is `origin/main`. Always verify against `origin/main` (= `origin/HEAD`).
- **Do NOT add `Schools/UNZA/_pipeline/` or any `_textbooks/` folder back to git, and never `git add` raw textbooks / scanned past papers.** They contain files >100 MB that GitHub rejects outright, and the bulk (1.6 GB) resets the push connection. Raising `http.postBuffer` / forcing HTTP/1.1 does NOT help — GitHub won't accept >100 MB files regardless. Keep raw `_pipeline` material local only.

**Next:** Re-resolve stale path references in older Next Session items (see flagged item); verify relocated build scripts' `_ROOT` depth.

---

### Session 2026-06-06
**Done:**
- SM Lesson 3 written from scratch: 3 steps, all v2 (cream/cardinal red/Parastoo/Aptos).
  - Step 3.1 — Corporate Strategy: levels of strategy, growth paths (concentration/integration/diversification), BCG Matrix. Zambeef/FQM examples.
  - Step 3.2 — Competitive Strategy: Porter's Generic Strategies, cost leadership/differentiation mechanics, offensive and defensive competitive moves.
  - Step 3.3 — Strategy Implementation: McKinsey 7-S, Balanced Scorecard, Kotter 8-step, org structures, strategic control types.
- Course restructured: Lesson 3 expanded from 2 → 3 steps. Total SM course: **8 steps** (was 6).
- All PDFs moved to flat folder paths (`02-environment/`, `03-strategy/`) — old per-step subfolders deleted.
- `_course.md` updated to reflect 8 steps, all v2, NLM links pending for 3.1–3.3.

**What Worked:**
- Reading v1 script content before rebuilding — avoided losing good content, carried forward Zambian examples and table structures that were already well-formed.
- Source extraction via pypdf → `_dev/tmp_*.txt` to scope lesson content before writing — confirmed Lesson 3 needed 3 steps, not 2.
- PyMuPDF (`fitz`) for visual QA: `page.get_pixmap(matrix=fitz.Matrix(1.8,1.8))` renders at good quality without poppler. Works on this Windows machine.
- Comparing against the working 2.1 script to diagnose the blank pages bug — seeing `onPage=page_bg` in 2.1 immediately identified the swapped order in the new scripts.

**Bugs caught and fixed:**
1. **BLANK BODY PAGES — onPage/onPageEnd order swapped.** All new scripts had `onPage=body_page, onPageEnd=page_bg`. The `page_bg` function fills the whole page with cream colour. Called as `onPageEnd` it fires AFTER all flowable content has been drawn, painting cream over every character. All body pages appeared blank. Fix: `onPage=page_bg, onPageEnd=body_page` — background draws first, content on top, header/footer drawn last. **This rule existed in the 2026-05-24 dead end but was not applied to the new scripts.** It will happen again if new scripts are ever written from scratch rather than copied from a working v2 template.
2. **Kotter table first column too narrow.** `0.6*cm` was used for the step-name column ("1. Establish urgency" etc.). Fix: `3.2*cm`. Rule: size the first column for its longest data cell, not just the number.

**Dead Ends (do not retry):**
- None new this session.

**Next:** See Next Session list above.

---

### Session 2026-06-05
**Done:**
- Added NotebookLM video overview link to SM Step 1.2 ADDED VALUE box. Both audio and video overview links now present on the cover. Constant `VID_STEP_1_2` added to `build_sm_1_2_mission-and-vision.py`. PDF rebuilt.
- NLM video URL saved to memory file `project_slack_file_links.md`.

**What Worked:**
- None.

**Dead Ends (do not retry):**
- None.

**Next:** Re-upload updated SM 1.2 PDF to Slack → get new file link → update workspace.md.

---

### Session 2026-06-04
**Done:**
- SM Step 1.1 and Step 1.2 fully rewritten to v2 standard using step-skill: cream paper, cardinal red accent, Parastoo/Aptos vendored fonts, flat output path to `01-foundations/`.
- Community closer removed from both steps — replaced with natural content hints pointing to the next step. Pattern locked into step-skill: no labelled CTA, no "students", no "Next:". Content creates pull.
- `booklesss-pdf` skill renamed to `step-skill`. All references updated across CLAUDE.md, booklesss-write, design-system skill.
- `resources_box(items)` helper added to both SM scripts and step-skill — cover ADDED VALUE panel with red border, Booklesss diamond mark bullet, clickable links.
- SM Step 1.1 ADDED VALUE box: Audio overview (NLM) + Video overview (NLM).
- SM Step 1.2 ADDED VALUE box: Audio overview (NLM).
- Footer `booklesss.framer.ai` made clickable on every body page via `canvas.linkURL()` annotation. Pattern documented in step-skill.
- `STEP_LINKS` dict + `step_ref()` helper added to both SM scripts — then abandoned (see dead end). Registry of known Slack file links added to `operations/workspace.md`. Memory file `project_slack_file_links.md` created.
- SM 1.1 and 1.2 Slack file links logged: 1.1 = `F0B818T8M4N`, 1.2 = `F0B81C99WSJ`.
- step-skill course identity table updated: SM now shows cream paper + cardinal red + Parastoo (v2), not old slate-navy system.
- CLAUDE.md updated: new CTA pattern, clickable step refs pattern, ADDED VALUE box pattern.

**What Worked:**
- `canvas.linkURL(url, rect)` for clickable canvas-drawn text — the only way to add links to footer/header text drawn directly on the canvas (not via Paragraph markup).
- `resources_box()` with `<img src="...">` inline in Paragraph for the diamond mark bullet — renders the actual brand mark inside the link text without needing a separate column.
- Removing community_closer entirely and letting the content create pull — user confirmed this is the right approach. One body paragraph at a natural transition point (e.g. after the process table) hints at the next step without labelling it.

**Dead Ends (do not retry):**
- **Slack file cross-reference links in PDFs** — Slack generates a new, unpredictable file ID on every upload. There is no way to pre-construct URLs. Embedding them in PDFs creates a permanent maintenance loop: rebuild → re-upload → new ID → all embedded links stale. Do not pursue this pattern. ADDED VALUE box links work only because NotebookLM URLs are external and permanent.

**Next:** Carried to Next Session list above.

---

### Session 2026-06-03 (2)
**Done:**
- Repriced Booklesss subscription tiers: **Full member K500/month**, **Guest K250/month**.
  - Formula: Full member = Slack Business+ seat (K339) + K161 markup. Guest = K161 markup only (no Slack cost). Both tiers yield the same per-seat profit of ~K161.
- Updated `Finances/pricing-strategy.md`: Community tier K800 → K500, unit economics tables, mixed cohort example, revenue targets.
- Updated `operations/dashboard.html`: `PRICE=250`, `MARKUP_PER=161` (dashboard recalculates automatically).
- Updated `_dev/scripts/build_ops_revenue_model.py` throughout — all 10 sections: pricing table, campaign math, overhead narrative (Phase 4 now active from day 1 since K10,626 markup > K4,442), profitability tables (Table A + B), milestones, reinvestment loop, NPV forecast, weekly payout table.
  - 12-month NPV: K41,081 → **K169,768**. Undiscounted net: K49,340 → **K200,035**.
  - Phase 4 "break-even at 30 guests" milestone removed — markup alone covers it from launch.
- Rebuilt `operations/Revenue Model - Booklesss.pdf`.
- Updated memory file `project_revenue_model.md` with new prices and NPV figures.

**What Worked:**
- The equal-profit-per-seat logic (guest price = markup only) is a clean, elegant framing — made the pricing decision fast and defensible.
- Updating just two JS constants (`PRICE`, `MARKUP_PER`) in the dashboard HTML means all derived calculations in the browser recalculate automatically — no other dashboard edits needed.

**Dead Ends (do not retry):**
- None.

**Next:** Outreach messages not drafted — user raised potential collaborators at end of session but session ended. Pick up next time.

---

### Session 2026-06-03
**Done:**
- Revenue model (`build_ops_revenue_model.py` + `operations/Revenue Model - Booklesss.pdf`) revised through multiple iterations:
  - Revenue split locked at **20% marketing / 60% team / 20% platform (founders)**
  - Manager + Sourcers columns collapsed into single **Team 60%** column across all tables (Table A, weekly payout table, 12-month forecast)
  - **Founders column** added to 12-month forecast = Platform 20% of guest revenue (guests × K37.05) — explicitly personal founder income, extracted from the business
  - **Net column** = Marketing 20% + FM markup − overhead — stays in business, reinvests into campaign
  - Clarified that "Platform = Booklesss = founders" — Platform 20% is the founders' personal take, not a reinvestment line
  - Per-founder income at Month 12: K5,520 total ÷ 3 = K1,840/month each
- Explained each column in the forecast to the user

**What Worked:**
- Replacing the old "Platform" gross column (which confusingly included markup) with a "Founders" column showing only Platform 20% — made the personal-vs-reinvestment split immediately legible
- Noting that Platform 20% = Marketing 20% numerically (both K37.05/guest) avoids the need for a separate Mktg column while keeping Net clean

**Dead Ends (do not retry):**
- Showing "Platform gross" (FM markup + Platform 20%) as a column — user found it confusing because K3,366 appeared in Month 1 with zero guests. Always separate markup (overhead coverage) from the founders' personal guest revenue share.

**Next:** Revenue model still stress-testing — see Next Session list.

---

### Session 2026-05-31 (session 2)
**Done:**
- Designed 6 hiring roles for Booklesss growth and scale, with fully worked incentive structures for each.
- Produced `operations/Roles for Growth - Booklesss.pdf` — a branded internal planning doc (cream + jade, Parastoo, business profile). Build script: `_dev/scripts/build_ops_growth_roles.py`.
- Roles: Campus Representative (referral tail), Community Host (MAU bonus), Course Author (step fee + 8% royalty), Operations & Collections Lead (5% above threshold), Growth Lead (dual payment: trial + conversion), Curriculum Strategist (12% royalty, 12-month vest).
- Key design principle: everyone has economic skin in the game; costs stay variable until K10,000/month revenue; hire milestone-gated, not time-gated.
- Curriculum Strategist is the designated "future-thinking" role — 12-month royalty vest forces them to only greenlight courses with durable demand.

**What Worked:**
- Reusing the business document profile from the booklesss-pdf foundation exactly as specified — no lesson furniture, no community closer, no course accent. Kept the full helper set (formula_box, callout, fact, table_std) which all work just as well for internal docs as for course notes.
- Milestone-gating as the hiring sequence principle — avoids over-hiring before bottlenecks exist.

**Dead Ends (do not retry):**
- None.

**Next:** No new items added. Existing Next Session list stands.

---

### Session 2026-05-31
**Done:**
- Rebuilt CF **Step 1.2 — Advanced Investment Appraisal** to v2 (cream + jade + Parastoo + vendored fonts + flat path). Content scope: APV, issue costs/grossing up, capital rationing (single-period PI + multi-period LP). Numbers grounded in the ZCAS APV + Capital Rationing source PDFs — Mutengo Mills APV worked example lands cleanly on 224 − 237 + 309 = ZMW 296k; Kabwe Holdings LP picks Projects 1+2 for NPV 19,000. Skipped re-teaching MIRR (1.1 already covers it; 1.1's handoff text doesn't promise MIRR for 1.2). Output: `01-investment/Step 1.2 - Advanced Investment Appraisal.pdf` (11 pages).
- Stripped WhatsApp marketing + invite-link CTA from the `booklesss-pdf` skill spec. Removed: the WhatsApp caption section, the "WhatsApp doc" trigger, the lead-magnet WhatsApp framing, and the `https://join.slack.com/...` URL + "join the group here" anchor instruction. Added a foundation rule: *PDFs carry no marketing links or external URLs in the body.* Step 1.2's `community_closer()` ships without a link to match.
- **New rule from user (saved to feedback memory):** lesson PDFs must NOT list the full 10-step course skeleton on every step. Removed the for-loop + intro paragraph from Step 1.1 and Step 1.2 build scripts, updated the lesson profile in `SKILL.md` and the v2 standard in `_course.md` to drop the "Skeleton up front" rule, rebuilt both PDFs (1.1: 13 → 12 pages, 1.2: 11 pages). Memory: `feedback_no-course-skeleton.md`.
- Updated `_course.md`: 1.2 marked ✅ v2; PDFs-at-v2-standard count 1 → 2.
- Drafted a 105-word TikTok voiceover script for the first Booklesss social push (text-only deliverable, not committed). Focus on the "lecturer reads the slide → you copy → you fail" pattern, then the founder pivot. Two alt hooks for A/B testing included in chat.

**What Worked:**
- Grounding the APV worked example in the ZCAS source lecture (Noble plc → Mutengo Mills recast) — the textbook numbers are self-consistent and exam-aligned (base-case NPV 224, PVITS 309 on a declining-balance loan, net-of-tax debt issue cost 237). Saved having to invent figures.
- Reusing 1.1's 10% discount factors (0.909 / 0.826 / 0.751 / 0.683) inside 1.2's base-case NPV table — makes the continuity from 1.1 visually obvious without spelling it out.
- pypdf for quick page-count sanity checks after each build (no PDF render tool on this Windows shell — see Dead Ends).
- Auto-memory `feedback_*` files capture sharp user pushback ("stop listing the whole course again and again") so the rule survives into future sessions even after the SKILL doc evolves.

**Dead Ends (do not retry):**
- `pdftoppm` is NOT installed on this Windows machine — the previous session's PyMuPDF/`fitz` render-to-PNG QA workflow won't run here without installing PyMuPDF. Trying `Read` on a PDF for visual QA fails. Next session: either install PyMuPDF, or just open PDFs in a viewer for visual checks.
- Initial 1.2 description in `_course.md` said "(APV, MIRR)" — misleading because 1.1 already taught MIRR in full. Corrected to "(APV, capital rationing)" to match what 1.2 actually delivers. Don't trust the parenthetical titles in `_course.md` blindly; verify against the actual source folder contents.

**Next:** Carried to Next Session list above.

---

### Session 2026-05-24
**Done:**
- Flattened CF folder structure — removed the 10 nested per-step subfolders; each topic folder (`01-investment`, etc.) now holds step PDFs directly. Deleted old `00_START HERE` docx and all 10 old PDFs.
- Rebuilt CF **Step 1.1** through three brand iterations, landing on a website-matched standard:
  1. Aptos body + Parkinsans titles vendored in `_dev/fonts/`; founder framing + full course skeleton on page 2 ("START HERE"); FACT boxes; `calc_table()` for FCF waterfalls. Fixed cover bug (bg painted over title) and `\n`→`<br/>`.
  2. Recoloured Forest & Jade (dropped gold).
  3. **Final pivot — match booklesss.framer.ai:** cream paper + film grain every page, **black logo** top-left, centred **◇◆◇** motif, **Parastoo** serif title (#121212 / 42pt / 1.1) + serif headings (#3D3D3D / 1.2), jade kept as interior accent. Light/editorial — no dark cover.
  4. **Cover refined:** cover bg `#FFFDE8` (body pages stay `#FFFEF2`) via `_paint_paper(bg)`; grain regenerated coarser (~3px); ◇◆◇ rebuilt as `LogoTriple` — three copies of the **real** `booklesss-mark-black.png` at exact website dims (centre 24px, sides 18px, gap 11px → ×0.75 to pt), side marks at 0.3 opacity.
- Brand assets: moved logos from Partnr Bucket → `_dev/brand/` (black + generated white wordmark + diamond mark); generated `grain.png`; created top-level `Booklesss Bucket/` drop zone.
- Researched Nano Banana (Gemini image API) — confirmed image-input editing (edit/compose/style-transfer); user chose `gemini-2.5-flash-image`.
- Created a demo Slack canvas in `#all-booklesss-20` (note: connected workspace is `booklesss20.slack.com`, paid plan — differs from `bookless10` in workspace.md).

**What Worked:**
- Rendering PDF pages to PNG with PyMuPDF (`fitz`) at 120–130 dpi to visually QA each iteration — caught the blank cover, glyph tofu, and waterfall misalignment that code review wouldn't.
- Right-aligned 2-col `calc_table()` for financial waterfalls — space-padded ASCII collapses in proportional Aptos.
- Glyph audit: Aptos renders ¹²³⁵, √, →, ×, − fine; only ► (U+25BA) tofus.
- Parastoo serif: rastikerdar GitHub release v2.0.1 zip → use the `web/` variants (Latin-inclusive; `-WOL` strips Latin).
- White-from-black logo: white fill + original alpha (PIL) preserves antialiased edges.
- Conversion: 56px (Framer) = 42pt (PDF); px × 0.75 = pt.

**Dead Ends (do not retry):**
- ReportLab full-page background in an `onPageEnd` callback paints OVER the flowables — must use `onPage`.
- `\n` does not line-break inside a ReportLab Paragraph — use `<br/>`.
- Design Bridge / Framer plugin was OFFLINE all session — couldn't pull live tokens; built from the CSS specs the user supplied. (Consistent with prior sessions: plugin disconnects often.)
- Supabase MCP has no storage-bucket access; Google Drive search found no logo — "the bucket" was a desktop folder (`partnr/Partnr Bucket`), not cloud.

**Next:** Carried to Next Session list above.

---

### Session 2026-05-19
**Done:**
- Tally form (tally.so/r/81Jejr) overhauled — generalised from CF-only to all Booklesss courses:
  - Landing page stripped to short intro (removed scarcity hook + "What you get" bullet list)
  - Removed role/community question and all 9 conditional follow-up blocks
  - Added multi-select CHECKBOXES course picker (TM, SM, CF, Other) with "Which Booklesss courses are you joining?"
  - Hardest topic question generalised (no longer CF-specific)
  - File upload reframed as "source content" contribution
  - Submit text updated (removed #cf-investment channel reference)
  - Final: 38 blocks, published
- Homepage buttons: all "free" CTAs updated to "Free until 10 June →"; "See the courses" → "See pricing →"; How it Works Step 3 → "Your notes are waiting."
- Homepage metrics: 70% → "Of students reduced stress before exams."; 1.2k → "1.2k+" with "People already in the workspace."
- Pricing page comparison table fully rebuilt: Starter/Pro/Enterprise → Notes/Community/Custom; System Architecture → Course Access; Intelligence Layer → Support & Extras; all 16 feature rows replaced with real Booklesss features
- Career page: hero text updated + all 4 CMS job listings replaced (Community Manager, Finance Content Writer, Marketing Lead, Subject Matter Expert) — Zambia-based, negotiable pay
- Changelog "evolution of Prodo" → "evolution of Booklesss"; Blogs section description updated
- All Framer changes published to booklesss.framer.ai

**What Worked:**
- design-bridge `cms_addItems` is the correct tool for Careers CMS — Framer MCP `upsertCMSItem` throws type validation errors on careers collection fields
- Phone/tablet breakpoints in Framer inherit desktop node values automatically — no separate phone node updates needed (phone breakpoint is self-closing)
- Saving large Framer `getNodeXml` output to tool-results file, then Python regex parsing it locally — much faster than re-fetching for node ID lookups
- Tally `configure_blocks` with `change_type` op successfully converts MULTIPLE_CHOICE → CHECKBOXES on all option blocks at once
- Running all independent Framer `updateXmlForNode` calls in a single parallel batch (21 nodes at once) — all succeeded

**Dead Ends (do not retry):**
- Framer MCP `upsertCMSItem` for Careers CMS collection — throws `invalid type on $input[1][0].fieldData["0"]`. Use design-bridge `cms_addItems` instead.
- Framer plugin disconnects frequently mid-session — do not retry more than once; ask user to reopen the MCP plugin if second attempt also fails
- `getNodeXml` on homepage page node (augiA20Il) — still times out on first call sometimes; retry once, it usually works second time

**Next:** Carried to Next Session list above.

---

### Session 2026-05-17
**Done:**
- Updated pricing strategy: K250 (Notes, single-channel guest), K800 (Community, full member), Custom (negotiated 1-on-1). Annual discount 20%.
- Created `.claude/plans/booklesss-plan.md` — master plan replacing old cf-free-trial-tally-form.md
- Created `.mcp.json` to add Design Bridge MCP (framer-mcp-relay.orange-lamp-studio.workers.dev)
- Rewrote `Finances/pricing-strategy.md` with full unit economics, Slack guest ratio math, staged plan
- Framer website — pages fixed:
  - **Pricing page**: hidden Prodo comparison table, updated all pricing card selling points, button text → "Start free trial"
  - **Homepage FAQ**: removed CF course reference, updated post-trial pricing to K250/K800
  - **Contact page**: removed "Prodo" intro copy
  - **About-us page**: full rewrite — hero, origin story (template-style, no invented history), BenefitsCards (The Problem / The Approach / The Result), team section heading, blog section, CTA. Team CMS updated: Idris → Deeky Mvula, Founder.
  - **Blogs CMS**: removed 6 Prodo items, added 5 Booklesss study-tip blog posts
  - **Changelog CMS**: removed 3 Prodo items, added 3 real Booklesss entries (v0.1–v0.3, March–May 2026)
  - **Homepage metrics section**: fixed card labels (short, template-matched), updated preceding text to outcome-focused copy

**What Worked:**
- Framer MCP `updateXmlForNode` with param name `xml` (NOT `xmlString`) — this was the critical fix that unblocked all component editing
- Framer MCP handles component instance control props (BenefitsCard `XYQ0cDHSQ`/`oU013RzC0`, MetricsCard `fjqyXb6Xj`/`jsTEpuWvg`, Tagline `gHZrnsDTm`)
- Framer MCP `upsertCMSItem` works as a reliable alternative to Design Bridge `cms_addItems` for updating CMS records
- Design Bridge CMS tools (getCollections, getItems, removeItems, addItems) are reliable for bulk CMS changes

**Dead Ends (do not retry):**
- Design Bridge `nodes_setText` on some nodes throws Cloudflare error 1101 (worker exception) — use Framer MCP `updateXmlForNode` instead
- Design Bridge `cms_addItems` for Team collection throws Cloudflare error 1101 — use Framer MCP `upsertCMSItem` instead
- Framer MCP `updateXmlForNode` with param name `xmlString` — wrong param, throws "Cannot read properties of undefined (reading 'length')" every time. Correct param is `xml`.
- `getNodeXml` on homepage page node (augiA20Il) — times out (page too large). Use the saved file at `.claude/projects/.../tool-results/` or target specific section nodes instead.

**Next:** Carried to Next Session list above.

---

## Tool Reference (Key Learnings)

| Task | Tool | Notes |
|------|------|-------|
| Update component instance props | Framer MCP `updateXmlForNode` | Param is `xml` not `xmlString` |
| Update plain text nodes | Framer MCP `updateXmlForNode` | Also works when Design Bridge fails |
| Bulk CMS changes | Design Bridge `cms_addItems/removeItems` | Reliable for blogs, changelog |
| Update single CMS item | Framer MCP `upsertCMSItem` | Use when Design Bridge throws 1101 |
| Read page structure | Framer MCP `getNodeXml` | Homepage times out — target section nodes |

---

## Staged Notes

_(empty)_

