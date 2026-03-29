"""
Booklesss Lesson PDF — Step 5.1: Strategy Implementation
Course: Strategic Management
Style: Slate-navy cover, white body, gold accent, DejaVuSerif display, LiberationSans body.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, KeepTogether, HRFlowable, PageBreak, NextPageTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os, sys

# ─────────────────────────────────────────────
#  FONTS  (Linux VM — DejaVu + Liberation)
# ─────────────────────────────────────────────
FD = "/usr/share/fonts/truetype/dejavu"
FL = "/usr/share/fonts/truetype/liberation"

pdfmetrics.registerFont(TTFont("Georgia",        FD + "/DejaVuSerif.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold",   FD + "/DejaVuSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Italic", FD + "/DejaVuSerif-Italic.ttf"))
pdfmetrics.registerFontFamily("Georgia", normal="Georgia", bold="Georgia-Bold", italic="Georgia-Italic")

pdfmetrics.registerFont(TTFont("Body",        FL + "/LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Body-Bold",   FL + "/LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Body-Italic", FL + "/LiberationSans-Italic.ttf"))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold", italic="Body-Italic")

# ─────────────────────────────────────────────
#  COLOURS  (Strategic Management palette)
# ─────────────────────────────────────────────
C_DARK      = colors.HexColor("#0F1F35")   # slate-navy cover
C_GRID      = colors.HexColor("#1A3050")   # subtle grid lines on cover
C_GOLD      = colors.HexColor("#C9920A")   # warm gold accent
C_GOLD_DK   = colors.HexColor("#7A5A08")   # dark gold for links / formulas
C_INK       = colors.HexColor("#111827")   # primary text
C_STEEL     = colors.HexColor("#6B7280")   # secondary text
C_MIST      = colors.HexColor("#9CA3AF")   # meta / captions
C_RULE      = colors.HexColor("#E5E7EB")   # light dividers
C_AMBER     = colors.HexColor("#C9920A")   # gold hairlines (SM brand)
C_WHITE     = colors.white

BG_WARN     = colors.HexColor("#FEF3C7")
C_WARN_TXT  = colors.HexColor("#92400E")
BG_INFO     = colors.HexColor("#EFF6FF")
C_INFO_TXT  = colors.HexColor("#1D4ED8")
BG_NOTE     = colors.HexColor("#FFFBEB")
C_NOTE_TXT  = colors.HexColor("#78350F")

# ─────────────────────────────────────────────
#  PAGE GEOMETRY
# ─────────────────────────────────────────────
W, H        = A4
MX          = 2.2 * cm
MY          = 2.0 * cm
HEADER_H    = 28
FOOTER_H    = 28
CONTENT_W   = W - 2 * MX

CHANNEL_NAME = "sm-strategy"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Strategic Management", "content",
           "lesson-05-strategy-implementation")
OUT_PATH = os.path.join(OUT_DIR, "Step 5.1 - Strategy Implementation.pdf")

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def make_styles():
    return {
        "cover_eyebrow": ParagraphStyle("cover_eyebrow",
            fontName="Body-Bold", fontSize=7.5, textColor=C_GOLD,
            leading=11, spaceAfter=10, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Georgia-Bold", fontSize=27, textColor=C_WHITE,
            leading=33, spaceAfter=10, alignment=TA_LEFT),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Body", fontSize=10, textColor=C_MIST,
            leading=15, spaceAfter=0, alignment=TA_LEFT),
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Body-Bold", fontSize=7, textColor=C_GOLD,
            leading=10, spaceAfter=3, spaceBefore=18, alignment=TA_LEFT),
        "h2": ParagraphStyle("h2",
            fontName="Georgia-Bold", fontSize=15, textColor=C_INK,
            leading=19, spaceAfter=8, alignment=TA_LEFT),
        "h3": ParagraphStyle("h3",
            fontName="Body-Bold", fontSize=11, textColor=C_STEEL,
            leading=15, spaceAfter=5, spaceBefore=10, alignment=TA_LEFT),
        "body": ParagraphStyle("body",
            fontName="Body", fontSize=10, textColor=C_INK,
            leading=16.5, spaceAfter=6, alignment=TA_LEFT),
        "bullet": ParagraphStyle("bullet",
            fontName="Body", fontSize=10, textColor=C_INK,
            leading=16.5, spaceAfter=4, leftIndent=14, alignment=TA_LEFT),
        "caption": ParagraphStyle("caption",
            fontName="Body-Italic", fontSize=8, textColor=C_MIST,
            leading=12, spaceAfter=4, alignment=TA_LEFT),
        "warn_text": ParagraphStyle("warn_text",
            fontName="Body", fontSize=9.5, textColor=C_WARN_TXT,
            leading=15, alignment=TA_LEFT),
        "info_text": ParagraphStyle("info_text",
            fontName="Body", fontSize=9.5, textColor=C_INFO_TXT,
            leading=15, alignment=TA_LEFT),
        "note_text": ParagraphStyle("note_text",
            fontName="Body", fontSize=9.5, textColor=C_NOTE_TXT,
            leading=15, alignment=TA_LEFT),
        "th": ParagraphStyle("th",
            fontName="Body-Bold", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "td": ParagraphStyle("td",
            fontName="Body", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "outcome": ParagraphStyle("outcome",
            fontName="Body", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=5, leftIndent=14, alignment=TA_LEFT),
        "next_step": ParagraphStyle("next_step",
            fontName="Body-Bold", fontSize=9.5, textColor=C_STEEL,
            leading=14, spaceBefore=14, alignment=TA_LEFT),
        "community": ParagraphStyle("community",
            fontName="Body", fontSize=9.5, textColor=C_STEEL,
            leading=15, spaceAfter=5, alignment=TA_LEFT),
        "community_link": ParagraphStyle("community_link",
            fontName="Body-Bold", fontSize=9.5, textColor=C_GOLD_DK,
            leading=15, alignment=TA_LEFT),
        "discuss_q": ParagraphStyle("discuss_q",
            fontName="Body-Italic", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, alignment=TA_LEFT),
        "nudge": ParagraphStyle("nudge",
            fontName="Body-Italic", fontSize=8.5, textColor=C_GOLD_DK,
            leading=13, spaceAfter=8, alignment=TA_LEFT),
    }

ST = make_styles()

# ─────────────────────────────────────────────
#  CANVAS CALLBACKS
# ─────────────────────────────────────────────
def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setStrokeColor(C_GRID)
    canvas.setLineWidth(0.5)
    for i in range(1, 6):
        canvas.line(0, H * i / 6, W, H * i / 6)
    for i in range(1, 4):
        canvas.line(W * i / 4, 0, W * i / 4, H)
    canvas.setFillColor(C_GOLD)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.setFont("Georgia-Bold", 120)
    canvas.setFillColor(colors.HexColor("#1A3050"))
    canvas.drawRightString(W - MX, MY + 40, "5.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "5.1 — Strategy Implementation")
    canvas.drawRightString(W - MX, H - MY + 7, "v1 · March 2026")
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFont("Body", 7.5)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(W / 2, MY - 14, "Strategic Management")
    canvas.drawRightString(W - MX, MY - 14, f"Page {page_num}")
    canvas.restoreState()

# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────
def hairline():
    return HRFlowable(width="100%", thickness=0.5, color=C_AMBER, spaceAfter=10, spaceBefore=4)

def section(eyebrow_text, heading_text):
    return [
        Spacer(1, 4),
        Paragraph(eyebrow_text.upper(), ST["eyebrow"]),
        Paragraph(heading_text, ST["h2"]),
        hairline(),
    ]

def body(text):
    return Paragraph(text, ST["body"])

def bullet(text):
    return Paragraph(f"• {text}", ST["bullet"])

def h3(text):
    return Paragraph(text, ST["h3"])

def callout(text, style="info"):
    styles_map = {
        "warn": (BG_WARN, C_WARN_TXT, ST["warn_text"]),
        "info": (BG_INFO, C_INFO_TXT, ST["info_text"]),
        "note": (BG_NOTE, C_NOTE_TXT, ST["note_text"]),
    }
    bg, border_col, st = styles_map.get(style, styles_map["info"])
    p = Paragraph(text, st)
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), bg),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, border_col),
        ('LINEBEFORE',    (0,0), (-1,-1), 2,   border_col),
        ('TOPPADDING',    (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING',   (0,0), (-1,-1), 10),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 8)])

def discussion_question(text):
    """A genuine thought question — not a CTA, just something worth sitting with."""
    q = Paragraph(text, ST["discuss_q"])
    t = Table([[q]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), colors.HexColor("#FFFDF0")),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_GOLD),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])

def community_closer():
    """Soft, peer-to-peer mention of the study group."""
    elements = [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "This is one step in the Strategic Management series running in the Booklesss study group on Slack. "
            "The channel for this topic is <b>#sm-strategy</b> — that's where students working through "
            "Strategic Management are discussing ideas like these, sharing past exam questions, and unpacking "
            "how strategy gets turned into action — the systems, structures, and disciplines that separate plans from reality.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            f'If you\'re already there, you know where to find it. '
            f'If not, <link href="{INVITE_URL}"><u><b>join the group here.</b></u></link>',
            ST["community_link"]),
    ]
    return elements

def table_std(data, col_widths):
    rows = []
    for i, row in enumerate(data):
        styled = []
        for cell in row:
            style = ST["th"] if i == 0 else ST["td"]
            styled.append(Paragraph(str(cell), style))
        rows.append(styled)
    t = Table(rows, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('TOPPADDING',    (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING',   (0,0), (-1,-1), 8),
        ('RIGHTPADDING',  (0,0), (-1,-1), 8),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, C_RULE),
        ('BACKGROUND',    (0,0), (-1, 0), colors.HexColor("#F9FAFB")),
        ('LINEBELOW',     (0,0), (-1, 0), 1,   C_AMBER),
    ]))
    return t

# ─────────────────────────────────────────────
#  DOCUMENT BUILD
# ─────────────────────────────────────────────
def build():
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4, leftMargin=MX, rightMargin=MX,
                          topMargin=MY + HEADER_H, bottomMargin=MY + FOOTER_H)

    cover_frame = Frame(0, 0, W, H,
                        leftPadding=MX + 10, rightPadding=MX,
                        topPadding=MY + 20,
                        bottomPadding=MY + 40)
    body_frame  = Frame(MX, MY + FOOTER_H, CONTENT_W,
                        H - MY*2 - HEADER_H - FOOTER_H,
                        leftPadding=0, rightPadding=0,
                        topPadding=0, bottomPadding=0)

    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_bg),
        PageTemplate(id="Body",  frames=[body_frame],  onPage=body_page),
    ])

    story = []

    # ── COVER ──────────────────────────────────────────────────
    story.append(Paragraph("STRATEGIC MANAGEMENT", ST["cover_eyebrow"]))
    story.append(Paragraph("Strategy\nImplementation", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 5.1 · From strategy to action: Chandler's thesis, the 7-S Framework, Balanced Scorecard, change management, KPIs, and why 70% of strategies fail",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: FOUNDATIONS ────────────────────────────────────────
    story += section("CONTEXT", "Where We Are in the Strategic Process")
    story.append(body(
        "By Step 5.1, you have completed the entire strategic analysis journey. You've identified your vision and mission (Step 2.1), "
        "mapped the external environment (Step 3.1), and assessed your internal capabilities (Step 4.1). "
        "Now comes the hardest part: <b>turning that strategy into action</b>."
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "Research consistently shows that <b>70% of well-formulated strategies fail at the implementation stage</b>. "
        "This is not because the strategy was wrong, but because execution fell apart. Strategy implementation requires "
        "a fundamentally different mindset: not analysis, but action; not plan, but discipline; not what-if, but how-now."
    ))
    story.append(Spacer(1, 10))
    story.append(body(
        "This step covers the structures, systems, and leadership disciplines that separate successful strategy execution from failure. "
        "The themes you'll see: alignment (are all parts of the organisation pulling in the same direction?), "
        "measurement (how do you know if strategy is working?), and change management (how do you move from the current state to the desired state?)."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 2: CHANDLER'S THESIS ────────────────────────────────────────
    story += section("FOUNDATIONS", "Structure Follows Strategy (Chandler's Thesis)")
    story.append(body(
        "In the 1960s, management historian Alfred Chandler studied the history of DuPont, General Motors, Sears, and Standard Oil. "
        "He found a consistent pattern: when companies changed their strategy, they eventually had to restructure to support that new strategy. "
        "The principle: <b>structure must follow strategy, not the other way around.</b>"
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "What this means in practice: If your strategy is to become a regional bank with deep community relationships, "
        "your structure should give local branch managers authority to make lending decisions. "
        "If your strategy is to be a cost leader in commodity industries, your structure should be highly centralised with tight cost controls. "
        "A decentralised structure will sabotage a cost-leadership strategy; a centralised structure will stifle a differentiation strategy."
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "<b>The strategic insight:</b> The first sign that a strategy is in trouble is a mismatch between the strategy and the structure. "
        "Before you blame poor execution, ask: <i>Is the organisation structurally capable of executing this strategy?</i>"
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 3: MCKINSEY 7-S ────────────────────────────────────────
    story += section("FRAMEWORK", "The McKinsey 7-S Framework: Integrated Alignment")
    story.append(body(
        "The McKinsey 7-S Framework (developed in the 1980s) identifies seven elements that must align for strategy to succeed. "
        "All seven must point in the same direction — if even one is misaligned, execution suffers."
    ))
    story.append(Spacer(1, 10))

    seven_s_data = [
        ["S Element", "What it means", "Key question"],
        ["Strategy", "The direction the organisation is pursuing", "Is the strategy clear and understood?"],
        ["Structure", "How authority and decision-making are organised", "Does the structure enable the strategy?"],
        ["Systems", "Processes, budgets, and information flows", "Do systems measure and reward strategic behaviour?"],
        ["Style", "Leadership approach and organisational culture", "Does leadership model the behaviours the strategy requires?"],
        ["Staff", "People — hiring, development, and talent", "Do we have the right people in the right roles?"],
        ["Skills", "Distinctive capabilities and competencies", "What capabilities does the strategy require, and do we have them?"],
        ["Shared Values", "Core purpose and culture — the centre of the model", "Do people believe in what the organisation stands for?"],
    ]
    story.append(table_std(seven_s_data, [1.8*cm, 3.2*cm, CONTENT_W - 5*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "<b>Example from a Zambian company:</b> A Zambian bank decides to pursue a digital-first strategy to reach unbanked customers via mobile. "
        "The strategy is clear (✓ Strategy). But the branch structure remains hierarchical with decisions made in Lusaka (✗ Structure). "
        "Technology hiring is limited by budget constraints (✗ Staff). Performance bonuses still reward in-branch transactions, not mobile adoption (✗ Systems). "
        "Senior leaders continue to work from the head office rather than visiting branches to understand digital adoption challenges (✗ Style). "
        "This strategy will fail — not because it's a bad idea, but because only one of the seven elements is aligned."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 4: BALANCED SCORECARD ────────────────────────────────────────
    story += section("MEASUREMENT", "The Balanced Scorecard: Translating Strategy to Operations")
    story.append(body(
        "Strategy is a hypothesis: <i>If we do X, then Y will happen.</i> The Balanced Scorecard translates this hypothesis "
        "into measurable targets and identifies the key performance indicators that show whether the strategy is actually working."
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "The Balanced Scorecard uses <b>four perspectives</b>, each with its own objectives and KPIs:"
    ))
    story.append(Spacer(1, 6))

    bsc_data = [
        ["Perspective", "Strategic question", "Example KPIs"],
        ["Financial", "Is the strategy delivering financial returns?", "Revenue growth, profit margin, cash flow, ROI"],
        ["Customer", "Are target customers satisfied and loyal?", "Customer satisfaction, retention rate, market share in target segment"],
        ["Internal Process", "Are we executing processes efficiently?", "Process cycle time, quality defect rate, on-time delivery"],
        ["Learning & Growth", "Are we developing capabilities for the future?", "Employee engagement, skill development rate, innovation rate"],
    ]
    story.append(table_std(bsc_data, [2.2*cm, 3.5*cm, CONTENT_W - 5.7*cm]))
    story.append(Spacer(1, 12))

    story.append(body(
        "<b>Worked example — a Zambian telecommunications company pursuing customer intimacy:</b>"
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Financial Perspective"))
    story.append(bullet("Revenue growth in high-value customer segment: 15% YoY"))
    story.append(bullet("Customer lifetime value in intimate segment: increase by 25%"))
    story.append(Spacer(1, 6))
    story.append(h3("Customer Perspective"))
    story.append(bullet("Net Promoter Score among high-value customers: 60+ (vs industry average 35)"))
    story.append(bullet("Churn rate in intimacy segment: reduce to <5% annually"))
    story.append(Spacer(1, 6))
    story.append(h3("Internal Process Perspective"))
    story.append(bullet("Response time to customer issues: <2 hours"))
    story.append(bullet("Percentage of interactions resolved at first contact: >70%"))
    story.append(Spacer(1, 6))
    story.append(h3("Learning & Growth Perspective"))
    story.append(bullet("Staff trained in consultative selling: 100% of customer-facing teams"))
    story.append(bullet("Time per employee on customer relationship training: 40 hours/year"))
    story.append(Spacer(1, 10))

    story.append(body(
        "The power of the Balanced Scorecard is that it <b>shows cause-and-effect</b>: improve Learning & Growth (train your people) "
        "→ improve Internal Processes (serve customers faster) → improve Customer metrics (higher satisfaction) → improve Financial results. "
        "Without it, you don't know what's actually moving the strategy forward."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 5: CHANGE MANAGEMENT ────────────────────────────────────────
    story += section("PEOPLE", "Change Management: Leading Strategic Transformation")
    story.append(body(
        "Strategy is not just about systems and structures — it's fundamentally about people changing their behaviour. "
        "If your organisation has worked one way for years, shifting to a new strategy means breaking old patterns and building new ones. "
        "This is where most implementation efforts fail: people resist change."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Kotter's 8-Step Model for Leading Change"))
    story.append(body("John Kotter's research identifies eight steps that separate successful strategic transformations from failures:"))
    story.append(Spacer(1, 6))

    kotter_data = [
        ["Step", "What it means", "Risk if skipped"],
        ["1. Establish urgency", "Create a clear, compelling case for why change is necessary", "People don't take it seriously; inertia wins"],
        ["2. Build a coalition", "Recruit powerful leaders and champions who believe in the change", "Isolated advocates can't overcome scepticism"],
        ["3. Form a vision", "Articulate a clear picture of what success looks like", "People don't understand the destination"],
        ["4. Communicate the vision", "Repeat, repeat, repeat — use every channel", "Message gets lost in organisational noise"],
        ["5. Empower action", "Remove obstacles; give people permission to act", "Bureaucracy blocks change champions"],
        ["6. Create short-term wins", "Celebrate quick victories that prove the strategy works", "Momentum dies; people lose faith"],
        ["7. Consolidate gains", "Keep the energy going; avoid declaring victory too early", "Old habits creep back in; regression occurs"],
        ["8. Anchor the change", "Make it permanent — build it into culture, systems, hiring", "The change is fragile; it reverts when pressure eases"],
    ]
    story.append(table_std(kotter_data, [1.2*cm, 3.2*cm, 4*cm]))
    story.append(Spacer(1, 10))

    story.append(h3("Lewin's Unfreeze-Change-Refreeze"))
    story.append(body(
        "Kurt Lewin's simpler model divides change into three phases: <b>Unfreeze</b> (dismantle old patterns and create urgency for change), "
        "<b>Change</b> (transition to new ways of working), and <b>Refreeze</b> (lock in the new behaviour so it becomes the new normal). "
        "Many organisations freeze too quickly and refreeze too early, pulling people back into old patterns."
    ))
    story.append(Spacer(1, 10))

    story.append(body(
        "<b>Strategic insight:</b> Budget and time estimates for strategy implementation should include 30-40% effort on change management. "
        "If you're not investing in getting people to change their behaviour, your strategy has no chance."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 6: ORG STRUCTURE ────────────────────────────────────────
    story += section("DESIGN", "Organisational Structures for Different Strategies")
    story.append(body(
        "There is no one perfect structure. Different structures fit different strategies. The key is matching structure to strategy."
    ))
    story.append(Spacer(1, 10))

    struct_data = [
        ["Structure type", "How it works", "Best for strategy", "Risk"],
        ["Functional", "Grouped by function (Finance, Sales, Operations, HR)", "Cost leadership, efficiency", "Silos block cross-functional collaboration"],
        ["Divisional", "Grouped by product, geography, or customer segment", "Diversification, growth", "Duplication of functions raises costs"],
        ["Matrix", "Dual reporting — functional AND divisional", "Innovation, customisation", "Conflict and confusion about authority"],
        ["Network", "Loosely coupled units, much outsourced, partnerships", "Speed, agility, specialisation", "Loss of control; consistency issues"],
    ]
    story.append(table_std(struct_data, [2*cm, 2.8*cm, 2.5*cm, 2.5*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "<b>Example:</b> A Zambian fintech startup pursuing a cost-leadership strategy in digital payments would use a functional structure — "
        "centralised technology development, tightly managed operations, minimal overhead. A pharmaceutical company with many different product lines "
        "would use divisional structure to let each product group set its own strategy. A consulting firm pursuing customised solutions would use matrix."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 7: RESOURCE ALLOCATION ────────────────────────────────────────
    story += section("RESOURCES", "Resource Allocation: Making Strategy Real Through Budget")
    story.append(body(
        "Strategy without resources is just a wish. Where you spend money reveals what you actually believe about your strategy. "
        "If your strategy says 'innovation' but 70% of budget goes to maintaining legacy operations, the organisation knows what really matters."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Zero-Based vs Incremental Budgeting"))
    story.append(body(
        "<b>Incremental budgeting</b> starts with last year's budget and adjusts it up or down. This locks in historical spending patterns "
        "and makes it hard to shift resources to new strategic priorities. <b>Zero-based budgeting</b> requires every expense to be justified from scratch "
        "based on strategic importance. It's harder to do but forces alignment between budget and strategy."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Strategic vs Operational Spending"))
    story.append(body(
        "Separate budgets into <b>operational spending</b> (cost of running the business as-is) and <b>strategic spending</b> (investment in new capabilities, markets, products). "
        "Protect strategic spending from short-term pressures. If every project is judged on immediate ROI, nothing transformational gets funded."
    ))
    story.append(Spacer(1, 10))

    story.append(body(
        "<b>Key principle:</b> Budget allocation should mirror your strategy. If it doesn't, fix the budget or fix the strategy — but don't pretend they're aligned."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 8: KPIs ────────────────────────────────────────────
    story += section("METRICS", "Key Performance Indicators: Measuring What Matters")
    story.append(body(
        "The wrong metrics destroy strategy. If you measure what's easy to count rather than what matters strategically, "
        "organisations optimise for the wrong things."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Common KPI Mistakes"))
    story.append(bullet("Vanity metrics: measuring activity (calls made, meetings held) instead of outcome (deals closed, customer retained)"))
    story.append(bullet("Lagging indicators only: measuring results without leading indicators that predict future performance"))
    story.append(bullet("Too many KPIs: 15 KPIs means nothing is prioritised"))
    story.append(bullet("Misaligned incentives: KPI rewards individual achievement but strategy requires teamwork"))
    story.append(Spacer(1, 10))

    story.append(h3("How to Design Strategy-Aligned KPIs"))
    story.append(bullet("Start with strategy: What must happen for the strategy to succeed?"))
    story.append(bullet("Identify leading indicators: What drives those outcomes? What can we influence?"))
    story.append(bullet("Set baselines and targets: What's the current state, and what's the target?"))
    story.append(bullet("Make them measurable: Vague = good intentions; specific = accountability"))
    story.append(bullet("Link to incentives: Tie rewards to KPI achievement"))
    story.append(Spacer(1, 12))

    # ── SECTION 9: STRATEGIC LEADERSHIP ────────────────────────────────────────
    story += section("LEADERSHIP", "Strategic Leadership: Role of CEO and Board")
    story.append(body(
        "The CEO and board don't implement strategy day-to-day — that's the job of managers and teams. "
        "What they do is <b>create the conditions for strategy to be executed</b>: setting clear direction, removing obstacles, "
        "holding people accountable, and adapting when the environment changes."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("CEO Role in Implementation"))
    story.append(bullet("Communicate constantly: Repeat the strategy until it's internalised"))
    story.append(bullet("Model the behaviour: Demonstrate the culture change you're asking for"))
    story.append(bullet("Make hard calls: Reallocate resources, move people, shut down misaligned initiatives"))
    story.append(bullet("Celebrate wins: Publicly recognise teams that execute on strategy"))
    story.append(bullet("Stay visible: Walk around; listen to what's blocking execution"))
    story.append(Spacer(1, 10))

    story.append(h3("Leadership Style and Strategy Fit"))
    story.append(body(
        "Different strategies require different leadership styles. A cost-leadership strategy needs disciplined, process-oriented leadership. "
        "An innovation strategy needs visionary, risk-tolerant leadership that tolerates experimentation. Mismatches between leadership style and strategy "
        "create friction and undermine execution."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 10: WHY STRATEGIES FAIL ────────────────────────────────────────
    story += section("INSIGHTS", "Why 70% of Strategies Fail: Common Implementation Breakdowns")
    story.append(callout(
        "<b>McKinsey research:</b> Only 3 in 10 strategically important initiatives are executed as planned. The root causes are rarely the strategy itself, but almost always execution.",
        "info"))
    story.append(Spacer(1, 8))

    story.append(h3("Failure Pattern 1: Misalignment"))
    story.append(body(
        "The strategy is clear at the top but gets lost as it cascades down. By the time it reaches team level, people are working on different priorities. "
        "<b>Fix:</b> Translate strategy into cascading goals so every team understands how their work contributes."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Failure Pattern 2: Resource Scarcity"))
    story.append(body(
        "The strategy is ambitious, but resources haven't shifted to support it. Teams are supposed to implement the new strategy <i>while still delivering</i> "
        "the old business. This is impossible. <b>Fix:</b> Free up people and budget from lower-priority work. Protect strategic initiatives."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Failure Pattern 3: Change Resistance"))
    story.append(body(
        "The organisation is asked to change but doesn't understand why or doesn't believe it's necessary. "
        "<b>Fix:</b> Invest in change management. Create urgency. Celebrate early wins. Make it safe to fail and learn."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Failure Pattern 4: Weak Accountability"))
    story.append(body(
        "No one is held responsible for execution. Projects slip, priorities shift, and accountability is diffused. "
        "<b>Fix:</b> Assign clear ownership. Regular check-ins. Escalate blockers. Consequences for non-execution."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Failure Pattern 5: External Factors"))
    story.append(body(
        "The external environment changes (competitor moves, regulation shifts, economic shock). "
        "The strategy is now misaligned with reality. <b>Fix:</b> Build monitoring into the process. Adapt when needed. "
        "Strategy is not a five-year plan; it's a direction that you adjust as conditions change."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 11: LINKS BACK TO PREVIOUS STEPS ────────────────────────────────────────
    story += section("INTEGRATION", "Linking Back to the Entire Strategic Process")
    story.append(body(
        "Step 5.1 does not stand alone. Everything you've learned in Steps 1–4 now affects how you implement strategy:"
    ))
    story.append(Spacer(1, 8))

    story.append(h3("From Step 3.1 (External Environment)"))
    story.append(body(
        "Your external analysis identified market opportunities, competitive threats, and industry dynamics. "
        "These shape what implementation is possible. A stable environment allows planned, sequential change. "
        "A turbulent environment requires agility and rapid iteration. Implement accordingly."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("From Step 4.1 (Internal Capabilities)"))
    story.append(body(
        "Your internal analysis identified what you're good at and what you must fix. Implementation strategy must be realistic about capabilities. "
        "Don't implement a digital transformation if your IT staff can't deliver it. Don't pursue a differentiation strategy if you can't afford the R&D. "
        "Let internal realities constrain and shape what you actually do."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("From Step 2.1 (Mission & Vision)"))
    story.append(body(
        "Your mission and vision set the destination. Implementation is the journey. Every structural decision, resource allocation, and change initiative "
        "should move the organisation closer to that vision."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 12: DISCUSSION ────────────────────────────────────────
    story.append(discussion_question(
        "<b>Q1:</b> Take a Zambian company you know (mining, banking, retail, telecom). "
        "Sketch out what you think their strategy is. Now assess: are their structure, systems, and leadership style aligned with that strategy? "
        "What's misaligned, and what would need to change for them to execute better?"
    ))
    story.append(discussion_question(
        "<b>Q2:</b> You're tasked with implementing a major strategic shift at a Zambian organisation. "
        "Using Kotter's 8 steps, what are the first three things you'd do, and why? How would you overcome typical resistance?"
    ))
    story.append(Paragraph(
        "Share your examples and thoughts in #sm-strategy — real Zambian cases help you understand how theory plays out in your own market context.",
        ST["nudge"]))
    story.append(Spacer(1, 6))

    # ── KEY TERMS ────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Strategy implementation", "The process of turning a strategic plan into action through systems, structures, and disciplined execution"],
        ["Chandler's thesis", "The principle that organisational structure must follow strategy, not precede it"],
        ["McKinsey 7-S Framework", "Framework identifying seven interdependent elements (Strategy, Structure, Systems, Style, Staff, Skills, Shared Values) that must align for execution"],
        ["Balanced Scorecard", "Performance management system translating strategy into four perspectives: Financial, Customer, Internal Process, Learning & Growth"],
        ["Strategy map", "Visual diagram showing cause-and-effect relationships between Balanced Scorecard perspectives"],
        ["KPI (Key Performance Indicator)", "Measurable metric that indicates whether strategy is executing on track"],
        ["Kotter's 8-step model", "Framework for leading strategic change: urgency, coalition, vision, communication, empowerment, wins, consolidation, anchoring"],
        ["Lewin's change model", "Three-phase model: Unfreeze (break old patterns), Change (transition), Refreeze (lock in new behaviour)"],
        ["Organisational structure", "How authority is distributed and how departments are arranged (functional, divisional, matrix, network)"],
        ["Zero-based budgeting", "Budgeting approach requiring all expenses to be justified from scratch based on strategic priority"],
        ["Change management", "Disciplines and practices for moving an organisation from current state to desired future state"],
        ["Strategic alignment", "Degree to which all parts of the organisation (structure, systems, people, culture) support the stated strategy"],
        ["Execution gap", "The distance between what strategy says should happen and what actually happens in practice"],
        ["Leading indicators", "Metrics that predict future outcomes; measurable activities that drive results"],
        ["Lagging indicators", "Metrics that measure results after the fact; outcome measures"],
    ]
    story.append(table_std(terms, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain Chandler's thesis and identify structural misalignments that will undermine strategy execution",
        "Apply the McKinsey 7-S Framework to diagnose what's blocking implementation and what needs to align",
        "Translate a strategic goal into a Balanced Scorecard with objectives and KPIs across four perspectives",
        "Design a strategy map that shows how learning & growth activities drive process improvements that improve customer outcomes that improve financial results",
        "Apply Kotter's 8-step model to plan a major strategic change initiative, identifying risks and mitigation strategies at each step",
        "Assess whether the organisation's structure fits its strategy and recommend restructuring if needed",
        "Design a resource allocation and budgeting approach that protects strategic initiatives while maintaining operational excellence",
        "Identify common implementation failure patterns and design countermeasures to prevent them",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 6.1 — Competitive Strategy (Final Step)",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ─────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
