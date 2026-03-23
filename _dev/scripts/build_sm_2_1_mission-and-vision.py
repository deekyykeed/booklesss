"""
Booklesss Lesson PDF — Step 2.1: Vision, Mission & Objectives
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

CHANNEL_NAME = "sm-foundations"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Strategic Management", "content",
           "lesson-02-mission-and-vision")
OUT_PATH = os.path.join(OUT_DIR, "Step 2.1 - Vision, Mission & Objectives.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "2.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "2.1 — Vision, Mission & Objectives")
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
            "The channel for this topic is <b>#sm-foundations</b> — that's where students working through "
            "Strategic Management are discussing ideas like these, sharing past exam questions, and unpacking "
            "what vision and mission really mean in practice.",
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
    story.append(Paragraph("Vision, Mission\n& Objectives", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 2.1 · Charting a company's direction — vision, mission, core values, and objective-setting",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Charting a Company's Direction ────────────────
    story += section("FOUNDATIONS", "Charting a Company's Direction")
    story.append(body(
        "Before a company can execute strategy, it needs to know where it is going. "
        "That sounds obvious — but most strategic failures don't start in execution. "
        "They start because nobody agreed on the destination."
    ))
    story.append(body(
        "Charting a company's direction is the first task of strategic management. "
        "It involves four components that work together to give everyone in the "
        "organisation — from the board to front-line staff — a shared sense of purpose and trajectory."
    ))

    dir_data = [
        ["Component", "The question it answers", "Time horizon"],
        ["Strategic Vision",  "Where are we going and why?",            "Long-term future"],
        ["Mission Statement", "What do we do and for whom, right now?", "Present day"],
        ["Core Values",       "What principles govern how we operate?", "Ongoing"],
        ["Objectives",        "What specific results must we achieve?", "Short & long-term"],
    ]
    story.append(table_std(dir_data, [3.5*cm, 8*cm, CONTENT_W - 11.5*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "These four are not interchangeable. The vision is about future direction. "
        "The mission is about current purpose. Values shape behaviour. "
        "Objectives make everything measurable. You need all four."
    ))

    # ── SECTION 2: Strategic Vision ─────────────────────────────
    story += section("VISION", "The Strategic Vision")
    story.append(body(
        "A strategic vision describes management's aspirations for the company's future "
        "and the course of direction charted to achieve them. It answers one question: "
        "<i>where are we going?</i>"
    ))
    story.append(body(
        "This is not a statement of what the company does today. It's a forward-looking "
        "declaration of the market position the company intends to occupy and how it plans "
        "to get there. The best vision statements use distinctive, specific language — "
        "generic phrases like 'be the best' or 'lead the industry' provide no guidance at all."
    ))

    story.append(h3("What a Good Vision Statement Must Do"))
    for req in [
        "<b>Be graphic.</b> Paint a clear picture of where the company is headed and the market position it is staking out.",
        "<b>Be forward-looking.</b> Describe the strategic course that will prepare the company for the future — not what it does today.",
        "<b>Stay focused.</b> Give managers real guidance in making decisions and allocating resources.",
        "<b>Have flexibility.</b> Allow the directional course to be adjusted as market and technology conditions change.",
        "<b>Be feasible.</b> The path should be within what the company can realistically accomplish over time.",
        "<b>Make good business sense.</b> The direction must be in the long-term interests of shareholders, employees, and other stakeholders.",
        "<b>Be memorable.</b> Ideally reducible to a short phrase or slogan that sticks.",
    ]:
        story.append(bullet(req))
    story.append(Spacer(1, 8))

    story.append(h3("Common Pitfalls to Avoid"))
    pitfall_data = [
        ["Pitfall", "Why it fails"],
        ["Vague or incomplete", "Doesn't specify where the company is headed or how it will get there"],
        ["Focused on the present", "A vision is about 'where we are going' — not what the company does today"],
        ["Overly broad language", "All-inclusive statements that license the company to pursue any opportunity"],
        ["Bland and uninspiring", "Best visions motivate staff and inspire stakeholder confidence"],
        ["Generic superlatives", "'Best in class' and 'most successful' say nothing specific about the path ahead"],
        ["Too long", "A vision that runs on loses its audience — shorter is almost always stronger"],
    ]
    story.append(table_std(pitfall_data, [4.5*cm, CONTENT_W - 4.5*cm]))
    story.append(Spacer(1, 10))

    story.append(callout(
        "Exam tip: when asked to evaluate a vision statement, check it against the criteria above. "
        "Examiners want you to go beyond saying it's 'good' or 'bad' — identify specific elements "
        "that work and specific elements that are missing or weak.",
        "note"))

    # ── SECTION 3: Mission Statement ─────────────────────────────
    story += section("MISSION", "The Mission Statement")
    story.append(body(
        "While the vision is about the future, the mission statement is grounded in the present. "
        "It explains the company's current purpose — why it exists and what it does every day."
    ))
    story.append(body(
        "A well-crafted mission statement identifies: what products or services the company provides, "
        "which buyer needs it is trying to satisfy, which customer groups or markets it serves, "
        "and what sets it apart from its rivals. It communicates to employees, customers, "
        "and stakeholders what the organisation stands for."
    ))

    story.append(h3("An Appropriate Mission Statement Should..."))
    for item in [
        "Identify the firm's products or services",
        "Specify the buyer needs it seeks to satisfy",
        "Identify the customer groups or markets it endeavours to serve",
        "Specify its approach to pleasing customers",
        "Set the firm apart from its rivals — not be interchangeable with competitors",
        "Clarify the firm's business to all stakeholders",
    ]:
        story.append(bullet(item))
    story.append(Spacer(1, 8))

    story.append(body(
        "Notice what a mission statement is <i>not</i>: it is not a vision, not a tagline, "
        "and not a list of values. It answers the present-tense question: "
        "<i>what do we do, for whom, and how?</i>"
    ))

    # Discussion question 1 — mid-content
    story.append(discussion_question(
        "Think about an organisation you interact with regularly — a bank, a university, a retailer. "
        "Could you write their mission statement from what you observe? "
        "What would it tell you if their actual published statement looked nothing like what you wrote?"
    ))

    # ── SECTION 4: Core Values ───────────────────────────────────
    story += section("VALUES", "Core Values")
    story.append(body(
        "Core values are the beliefs, traits, and behavioural norms that employees are expected "
        "to display in conducting the firm's business and pursuing its vision and mission."
    ))
    story.append(body(
        "When strongly espoused and genuinely supported by top management, core values become an "
        "integral part of the firm's culture. They shape how decisions get made when no rulebook "
        "exists for a situation. They also need to match the firm's vision, mission, and strategy "
        "— core values that conflict with strategy create internal contradiction."
    ))

    story.append(body(
        "Patagonia's core values offer a clean example: <i>quality</i> (pursuit of ever-greater "
        "quality in everything), <i>integrity</i> (relationships built on respect), "
        "<i>environmentalism</i> (serve as a catalyst for personal and corporate action), "
        "and <i>not bound by convention</i> (our success lies in developing innovative ways "
        "to do things). Each value connects directly back to their mission of building the best "
        "product while causing no unnecessary harm."
    ))

    story.append(callout(
        "Core values only have meaning if leadership actually lives them. "
        "A company that lists 'integrity' as a core value but tolerates misconduct at the top "
        "has worse credibility than a company that publishes no values at all.",
        "warn"))

    # ── SECTION 5: Setting Objectives ────────────────────────────
    story += section("OBJECTIVES", "Setting Objectives")
    story.append(body(
        "Objectives convert the vision and mission into specific, measurable performance targets. "
        "Without them, the vision remains an aspiration with no way to track progress."
    ))

    story.append(h3("Financial vs Strategic Objectives"))
    story.append(body(
        "Companies need both types — and they serve different purposes."
    ))
    obj_data = [
        ["Type", "What it targets", "Example"],
        ["Financial objectives",  "Financial performance targets the organisation must achieve",
         "Revenue growth of 15% per year; net margin above 12%"],
        ["Strategic objectives",  "Target outcomes that strengthen market standing and competitive position",
         "Overtake the market leader in customer satisfaction scores within 3 years"],
    ]
    story.append(table_std(obj_data, [3.5*cm, 5.5*cm, CONTENT_W - 9*cm]))
    story.append(Spacer(1, 8))

    story.append(body(
        "Financial performance alone is not enough. Current financial results are lagging indicators "
        "— they reflect decisions made in the past. Strategic objectives are leading indicators: "
        "a company that is winning on market standing, customer loyalty, and product quality today "
        "will tend to win financially tomorrow."
    ))

    story.append(h3("Short-Term vs Long-Term Objectives"))
    tl_data = [
        ["Horizon", "Focus", "Risk of ignoring"],
        ["Short-term", "Quarterly and annual performance improvements; satisfying near-term expectations",
         "Organisation drifts without near-term accountability"],
        ["Long-term",  "What to do now to achieve optimal long-term performance",
         "Short-term thinking dominates — sacrificing future position for today's results"],
    ]
    story.append(table_std(tl_data, [2.5*cm, 7*cm, CONTENT_W - 9.5*cm]))
    story.append(Spacer(1, 10))

    story.append(h3("Stretch Objectives and Strategic Intent"))
    story.append(body(
        "Well-stated objectives share four characteristics: they are <b>specific</b>, "
        "<b>quantifiable</b> (measurable), <b>challenging</b> (motivating), and have a "
        "<b>deadline for achievement</b>."
    ))
    story.append(body(
        "Stretch objectives push performance targets high enough to stretch an organisation "
        "to its full potential. They prevent internal inertia and contentment with average results. "
        "A company exhibits <b>strategic intent</b> when it relentlessly pursues an ambitious "
        "strategic objective — concentrating the full force of its resources on achieving it, "
        "even when that objective seems out of proportion to current capabilities."
    ))

    story.append(h3("The Balanced Scorecard"))
    story.append(body(
        "The Balanced Scorecard is a widely used method for combining financial and strategic "
        "objectives, tracking achievement across both dimensions, and giving management a more "
        "complete picture of how well the organisation is performing. It prevents the mistake "
        "of optimising for one type of objective at the expense of the other."
    ))

    # Discussion question 2 — before key terms
    story.append(discussion_question(
        "A company consistently hits its financial targets but keeps missing its strategic objectives "
        "around customer satisfaction and market share. Senior management says: 'as long as profit "
        "is up, we're fine.' What does the theory in this step suggest is actually happening, "
        "and where does it predict this company will be in five years?"
    ))

    # ── KEY TERMS ────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Strategic vision", "A statement of management's aspirations for the company's future and the course of direction charted to achieve them"],
        ["Mission statement", "A brief explanation of a company's present-day purpose — why it exists, what it does, and for whom"],
        ["Core values", "The beliefs, traits, and behavioural norms employees are expected to display in pursuing the firm's vision and mission"],
        ["Objectives", "An organisation's performance targets — the specific results management wants to achieve"],
        ["Financial objectives", "Performance targets related to financial results (revenue, profit, margins, return on investment)"],
        ["Strategic objectives", "Target outcomes that strengthen the company's market standing, competitive position, and future prospects"],
        ["Stretch objectives", "Performance targets set high enough to push the organisation to its full potential"],
        ["Strategic intent", "Relentless pursuit of an ambitious strategic objective, concentrating full resources on that single goal"],
        ["Balanced Scorecard", "A method combining financial and strategic objectives to give management a complete view of organisational performance"],
        ["Short-term objectives", "Near-term performance targets focused on quarterly and annual improvement"],
        ["Long-term objectives", "Targets that force consideration of what to do now to achieve optimal future performance"],
    ]
    story.append(table_std(terms, [5*cm, CONTENT_W - 5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain the four components of charting a company's direction and why each is necessary",
        "Describe what a strategic vision is, list the requirements of a good vision statement, and identify common pitfalls",
        "Distinguish between a vision statement and a mission statement — specifically what each answers and when each applies",
        "Explain what core values are, why they must align with strategy, and what happens when they don't",
        "Differentiate between financial and strategic objectives and explain why strategic performance is a leading indicator",
        "Explain stretch objectives and strategic intent, and describe what a Balanced Scorecard is designed to achieve",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 2.2 — External Environment Analysis (PESTEL & Porter's Five Forces)",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ─────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
