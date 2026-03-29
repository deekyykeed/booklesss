"""
Booklesss Lesson PDF — Step 4.1: The Internal Environment
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
C_AMBER     = colors.HexColor("#C17E3A")   # amber hairlines (global brand)
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

CHANNEL_NAME = "sm-environment"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Strategic Management", "content",
           "lesson-04-internal-environment")
OUT_PATH = os.path.join(OUT_DIR, "Step 4.1 - The Internal Environment.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "4.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "4.1 — The Internal Environment")
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
            "The channel for this topic is <b>#sm-environment</b> — that's where students working through "
            "Strategic Management are discussing ideas like these, sharing past exam questions, and unpacking "
            "how to read both the external environment and the company's own capabilities and constraints.",
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
    story.append(Paragraph("The Internal\nEnvironment", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 4.1 · Resources & capabilities, VRIO framework, internal processes, organisational structure, culture, and financial health",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: FOUNDATIONS ────────────────────────────────────────
    story += section("FOUNDATIONS", "What Internal Analysis Tells You")
    story.append(body(
        "If the external environment (Step 3.1) tells you what is happening around your company, "
        "the internal environment tells you what your company can actually do about it. "
        "Without knowing your own capabilities and constraints, strategy is just aspiration."
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "The internal environment analysis answers three essential questions:"
    ))
    story.append(bullet("What can the company <b>DO?</b> (its strengths and capabilities)"))
    story.append(bullet("What <b>MUST</b> it fix? (its weaknesses and constraints)"))
    story.append(bullet("What can it <b>LEVERAGE</b> to gain strategic advantage? (its core competencies)"))
    story.append(Spacer(1, 10))

    six_q_data = [
        ["Strategic question", "What it reveals"],
        ["How well is the firm's present strategy working?", "Whether the current approach is delivering results"],
        ["What are the firm's competitively important resources and capabilities?", "Where the company has genuine strengths to build on"],
        ["Is the firm able to take advantage of opportunities and overcome threats?", "How well positioned it is against the external environment"],
        ["Are the firm's prices and costs competitive?", "Whether the company has a cost position that can sustain competition"],
        ["Is the firm competitively stronger or weaker than key rivals?", "Its relative position in the competitive landscape"],
        ["What strategic issues and problems merit front-burner attention?", "Where management needs to focus immediately"],
    ]
    story.append(table_std(six_q_data, [4*cm, CONTENT_W - 4*cm]))
    story.append(Spacer(1, 10))

    # ── SECTION 2: VRIO ────────────────────────────────────────────────
    story += section("VRIO", "Resources & Capabilities: The VRIO Framework")
    story.append(body(
        "A company's resources and capabilities are the raw material of competitive advantage. "
        "Not all resources are equally important — some provide real advantage, others are just necessary to operate. "
        "The VRIO framework helps distinguish which is which."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Resource Types"))
    resource_data = [
        ["Resource type", "Examples"],
        ["Financial resources", "Cash flow, capital structure, liquidity, debt capacity"],
        ["Human resources", "Skills, leadership quality, talent pipeline, organisational knowledge"],
        ["Physical resources", "Plants, equipment, locations, supply chain infrastructure"],
        ["Technological resources", "Systems, data assets, digital maturity, proprietary technology"],
        ["Intangible assets", "Brand, patents, reputation, organisational culture"],
    ]
    story.append(table_std(resource_data, [3*cm, CONTENT_W - 3*cm]))
    story.append(Spacer(1, 12))

    story.append(h3("V — Value"))
    story.append(body(
        "Does the resource allow the company to exploit an opportunity or neutralise a threat? "
        "A resource that doesn't create competitive value is not a source of advantage — it may just be a cost of doing business. "
        "<i>Example: Every bank must have a core banking system. Having one doesn't give you an advantage; not having one puts you at a disadvantage.</i>"
    ))
    story.append(Spacer(1, 8))

    story.append(h3("R — Rarity"))
    story.append(body(
        "Is the resource rare among current and potential competitors? "
        "A valuable resource held by many companies provides competitive parity, not advantage. "
        "A valuable resource held by only a few provides at least temporary competitive advantage. "
        "<i>Example: A strong distribution network covering rural Zambia is rare — most companies cluster around urban areas. "
        "A retailer with genuine rural reach has a rarity advantage.</i>"
    ))
    story.append(Spacer(1, 8))

    story.append(h3("I — Inimitability"))
    story.append(body(
        "Is the resource difficult or costly to copy? "
        "Resources that are easy to imitate provide only short-term advantage. "
        "Inimitable resources protect advantage over time. Resources are harder to imitate when they result from: "
        "(a) <b>unique historical conditions</b> — something built over decades can't be recreated quickly; "
        "(b) <b>causal ambiguity</b> — competitors can't identify exactly what's driving the advantage; "
        "(c) <b>social complexity</b> — built through thousands of employee relationships, not a single decision."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("O — Organised to Exploit"))
    story.append(body(
        "Is the company structured to capture value from the resource? "
        "Even a valuable, rare, inimitable resource creates no advantage if the organisation can't deploy it. "
        "Organisational factors include: management systems, processes, culture, reporting structures, and incentive systems."
    ))
    story.append(Spacer(1, 10))

    vrio_outcomes = [
        ["V", "R", "I", "O", "Competitive implication"],
        ["No", "—", "—", "—", "Competitive disadvantage"],
        ["Yes", "No", "—", "—", "Competitive parity"],
        ["Yes", "Yes", "No", "—", "Temporary competitive advantage"],
        ["Yes", "Yes", "Yes", "No", "Unrealised potential"],
        ["Yes", "Yes", "Yes", "Yes", "<b>Sustained competitive advantage (core competency)</b>"],
    ]
    story.append(table_std(vrio_outcomes, [0.8*cm, 0.8*cm, 0.8*cm, 0.8*cm, CONTENT_W - 3.2*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "When a resource passes all four VRIO tests, it is a <b>core competency</b> — a distinctive capability that competitors "
        "find difficult to match and that the company is organised to leverage. Core competencies are the foundation of durable strategy."
    ))
    story.append(Spacer(1, 12))

    story.append(discussion_question(
        "<b>Q1:</b> Pick a well-known Zambian company. Identify one resource or capability it has. "
        "Run it through VRIO — is it Valuable, Rare, Inimitable, and is the company Organised to exploit it? "
        "What does that tell you about their competitive position?"
    ))
    story.append(discussion_question(
        "<b>Q2:</b> A company has a brilliant IT system that no competitor has. But the strategy team and operations teams "
        "have completely different views on how to use it. Which VRIO criterion does this violate — and what should management do about it?"
    ))
    story.append(Paragraph(
        "Share your VRIO analysis of a Zambian company in #sm-environment — it's a good way to test whether your reasoning holds up.",
        ST["nudge"]))
    story.append(Spacer(1, 6))

    # ── SECTION 3: PROCESSES ────────────────────────────────────────────
    story += section("PROCESSES", "Internal Processes & Operational Efficiency")
    story.append(body(
        "Strategy doesn't execute itself — it runs through the company's internal processes. "
        "Even the best strategy fails if the processes that carry it out are inefficient, unreliable, or misaligned."
    ))
    story.append(Spacer(1, 10))

    process_data = [
        ["Process area", "Key questions"],
        ["Efficiency of workflows", "Are core activities done in the most cost-effective way?"],
        ["Bottlenecks", "Where does work slow down or back up?"],
        ["Customer-facing processes", "How reliable and responsive are the processes customers experience?"],
        ["Supply chain reliability", "How consistent is the supply of inputs?"],
        ["Quality management", "What systems exist to catch errors and maintain standards?"],
        ["Digitalization level", "Are digital tools being used to improve speed, accuracy, or reach?"],
    ]
    story.append(table_std(process_data, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "Two strategic questions worth asking: "
        "<b>Where do processes hinder growth?</b> (bottlenecks that will become more painful as the company scales) — and "
        "<b>Which processes scale well?</b> (efficient processes that will remain efficient as volume grows)"
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 4: STRUCTURE ────────────────────────────────────────────
    story += section("STRUCTURE", "Organisational Structure & Governance")
    story.append(callout(
        "<b>The principle:</b> structure should support strategy — not block it.",
        "note"))
    story.append(body(
        "Organisational structure determines how authority is distributed, how decisions are made, and how different parts "
        "of the company coordinate. A structure that made sense at an earlier stage of the company's growth can become a "
        "constraint as strategy evolves."
    ))
    story.append(Spacer(1, 10))

    struct_data = [
        ["Structural element", "Why it matters strategically"],
        ["Hierarchical layers", "Too many layers slow decision-making and create distance from customers"],
        ["Decision-making speed", "How quickly can the organisation respond to market changes?"],
        ["Governance model", "Who has authority over what, and are accountability lines clear?"],
        ["Accountability clarity", "Can you tell who is responsible when something goes wrong?"],
        ["Coordination between departments", "Do silos exist that prevent information or resources from flowing?"],
        ["Span of control", "Is each manager supervising too many or too few people?"],
    ]
    story.append(table_std(struct_data, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "<b>Strategic insight:</b> Is the structure aligned with growth, innovation, and agility — or does it slow the organisation down?"
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 5: CULTURE ────────────────────────────────────────────
    story += section("CULTURE", "Culture & Leadership")
    story.append(body(
        "Culture is often the most powerful — and most overlooked — factor in internal analysis. "
        "It is also one of the hardest to change. Culture shapes how employees make decisions when no one is watching, "
        "how they respond to uncertainty, and whether strategy is executed with enthusiasm or resistance."
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "Culture is an internal asset when it reinforces the direction the company wants to go. "
        "It is an internal threat when it resists change, rewards the wrong behaviours, or creates friction between teams."
    ))
    story.append(Spacer(1, 10))

    story.append(body(
        "What to analyse: <b>Leadership style</b> (does leadership model the behaviours the strategy requires?), "
        "<b>levels of collaboration</b> (do people share information or hoard it?), "
        "<b>innovation mindset</b> (are new ideas welcomed or shut down?), "
        "<b>employee engagement</b> (do people care about the outcome?), and "
        "<b>resistance to change</b> (how does the organisation respond when direction needs to shift?)."
    ))
    story.append(Spacer(1, 8))

    story.append(body(
        "<b>Strategic insight question:</b> Does the culture support the direction the company wants to go? "
        "If not, the company has a cultural constraint on strategy execution that must be addressed."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 6: FINANCIAL HEALTH ────────────────────────────────────
    story += section("FINANCIAL", "Financial Performance & Strategic Health")
    story.append(body(
        "Internal analysis is not complete without assessing whether the company can afford its strategy. "
        "Financial health determines what strategic options are even on the table."
    ))
    story.append(Spacer(1, 10))

    fin_data = [
        ["Financial dimension", "Strategic question"],
        ["Profitability", "Is the company generating sufficient returns to reinvest?"],
        ["Cash generation", "Does operational cash flow fund ongoing needs without reliance on debt?"],
        ["Cost structure", "Are costs competitive relative to rivals?"],
        ["ROI on projects", "Are strategic investments delivering returns?"],
        ["Budget discipline", "Is the company making and meeting financial commitments?"],
        ["Strategic investment capacity", "Can the company afford to fund the next phase of its strategy?"],
    ]
    story.append(table_std(fin_data, [3*cm, CONTENT_W - 3*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "<b>Two strategic insights:</b> Can the company afford its strategy? "
        "And where is capital best deployed — which parts of the business deserve more investment, and which should be scaled back?"
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 7: RISK ────────────────────────────────────────────────
    story += section("RISK", "Internal Risk & Constraints")
    story.append(body(
        "Every company has internal constraints that could limit or prevent strategy execution. "
        "Identifying them before they become crises allows better prioritisation and more realistic planning."
    ))
    story.append(Spacer(1, 10))

    story.append(body("<b>Common internal risks:</b>"))
    story.append(bullet("Skill gaps — insufficient talent or capability in critical areas"))
    story.append(bullet("Technology limitations — outdated systems that can't support strategic ambitions"))
    story.append(bullet("Compliance issues — regulatory or governance gaps that could create liability"))
    story.append(bullet("Operational weaknesses — unreliable processes that create cost or quality problems"))
    story.append(bullet("High cost structures — cost bases that are too high to compete sustainably"))
    story.append(bullet("Leadership misalignment — different parts of the leadership team pulling in different directions"))
    story.append(Spacer(1, 10))

    story.append(body(
        "<b>What understanding internal risks allows:</b>"
    ))
    story.append(bullet("Better prioritisation — focus resources where constraints are most damaging"))
    story.append(bullet("Realistic strategy — avoid committing to plans the organisation cannot execute"))
    story.append(bullet("Stronger change management — anticipate resistance before launching initiatives"))
    story.append(Spacer(1, 10))

    # ── KEY TERMS ────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Internal environment", "All factors and conditions inside the company that affect its ability to execute strategy"],
        ["Resources (strategic)", "Assets and inputs (financial, human, physical, technological, intangible) the company controls"],
        ["Capabilities (strategic)", "The ability to deploy resources effectively to accomplish a strategic objective"],
        ["VRIO framework", "Framework assessing whether a resource is Valuable, Rare, Inimitable, and Organised to exploit"],
        ["Value (VRIO)", "Whether a resource allows the company to exploit an opportunity or neutralise a threat"],
        ["Rarity (VRIO)", "Whether a resource is held by few competitors (providing advantage) or many (providing parity)"],
        ["Inimitability (VRIO)", "Whether a resource is difficult or costly for competitors to copy"],
        ["Organised to exploit (VRIO)", "Whether the company's structure and systems allow it to capture value from the resource"],
        ["Core competency", "A distinctive capability that passes all VRIO tests and forms the foundation of durable strategy"],
        ["Causal ambiguity", "Inability of competitors to identify exactly what's driving a company's competitive advantage"],
        ["Social complexity", "Advantage built through relationships and culture, not easily replicated through hiring or purchase"],
        ["Internal processes", "Workflows and systems through which strategy is executed day-to-day"],
        ["Organisational structure", "How authority is distributed, decisions are made, and departments coordinate"],
        ["Span of control", "The number of people reporting directly to a manager"],
        ["Corporate culture", "The shared values, beliefs, and norms that shape how people behave in the organisation"],
        ["Strategic investment capacity", "The company's financial ability to fund the next phase of its strategic direction"],
        ["Internal constraints", "Weaknesses or limitations inside the company that could limit strategy execution"],
    ]
    story.append(table_std(terms, [4.5*cm, CONTENT_W - 4.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain the purpose of internal environment analysis and the six-question framework for evaluating a company's internal situation",
        "Identify and categorise a company's resources across financial, human, physical, technological, and intangible dimensions",
        "Apply the VRIO framework to assess whether a resource constitutes a competitive advantage, temporary advantage, or core competency",
        "Explain what organisational structure and governance elements should be evaluated in a strategic internal analysis",
        "Assess how culture and leadership either support or constrain strategy execution",
        "Evaluate a company's financial health from a strategic perspective, identifying whether it has the capacity to fund its strategy",
        "Identify common internal risks and constraints and explain how understanding them leads to more realistic and executable strategy",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 5.1 — Strategy Implementation",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ─────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
