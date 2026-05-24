# Booklesss — Project Memory

**Last updated:** 2026-05-24

---

## Next Session

- [ ] Extract a shared brand module (`booklesss_brand.py`) and roll the v2 website-brand standard across CF Steps 2.1–10.1 (rebuild each: cream + grain + ◇◆◇ + Parastoo serif, flat path). Their scripts still use the old espresso/gold + Linux fonts.
- [ ] Decide whether the cream / Parastoo / ◇◆◇ brand also replaces the SM and TM covers, or stays CF-only
- [ ] When the Framer / Design Bridge plugin is online, pull exact Booklesss tokens (colours, text styles, fonts) and reconcile — confirm whether jade is a real brand accent or go monochrome like the site
- [ ] Optional: add the black ◇ mark to the body-page footer
- [ ] Export a higher-res Booklesss diamond mark (current `booklesss-mark-black.png` is only 34×34px) for crisper motif/logo at large sizes
- [ ] (If pursuing imagery) build `_dev/scripts/brand_image.py` using Nano Banana `gemini-2.5-flash-image` for image edit/regen — needs `GEMINI_API_KEY`
- [ ] Create CF Slack channels (`#cf-updates`, `#cf-investment`, `#cf-cost-of-capital`, `#cf-ma-valuation`, `#cf-risk`, `#cf-dividends`) → update `operations/workspace.md` with channel IDs
- [ ] Drop WhatsApp message in CF group once channels are live
- [ ] Fix page meta titles manually in Framer page settings (SEO tab): /blogs still "Prodo | Blogs", /about-us "Prodo | About", homepage "Prodo"
- [ ] Add photo to Deeky Mvula team card (currently using Prodo stock photo)
- [ ] Check "Trusted by the world's most efficient students" logos section on homepage
- [ ] Edit /legals page — still fully unedited Prodo template
- [ ] Update "Lesson PDFs" checkbox in Tally form features (block `53d9440e`) if Canvas becomes confirmed delivery format
- [ ] Monitor Tally form (tally.so/r/81Jejr) for submissions daily — WhatsApp DM within 24h

---

## Session Log

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

