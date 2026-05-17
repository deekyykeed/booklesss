# Booklesss — Project Memory

**Last updated:** 2026-05-17

---

## Next Session

- [ ] Fix page meta titles — /about-us still says "Prodo | About", homepage says "Prodo"
- [ ] Edit /career page — fully unedited Prodo template
- [ ] Edit /legals page — fully unedited Prodo template  
- [ ] Check "Trusted by the world's most efficient students" on homepage logos section
- [ ] Publish all Framer changes to booklesss.framer.ai
- [ ] Add photo/image to Deeky Mvula team card (currently using Prodo stock photo)
- [ ] Create CF Slack channels, then post CF content
- [ ] Drop WhatsApp message in CF group once channels are live

---

## Session Log

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
