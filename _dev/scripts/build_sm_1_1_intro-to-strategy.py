"""
Booklesss Lesson PDF — Step 1.1: Introduction to Corporate Strategy
Course: Strategic Management
Style: Slate-navy cover, white body, cardinal red accent, Georgia serif display, Calibri body.
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

# ─────────────────────────────────────────────
#  FONTS
# ─────────────────────────────────────────────
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Georgia",        F + r"\georgia.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold",   F + r"\georgiab.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Italic", F + r"\georgiai.ttf"))
pdfmetrics.registerFontFamily("Georgia", normal="Georgia", bold="Georgia-Bold", italic="Georgia-Italic")

pdfmetrics.registerFont(TTFont("Calibri",        F + r"\calibri.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Bold",   F + r"\calibrib.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Italic", F + r"\calibrii.ttf"))
pdfmetrics.registerFontFamily("Calibri", normal="Calibri", bold="Calibri-Bold", italic="Calibri-Italic")

# ─────────────────────────────────────────────
#  COLOURS
# ─────────────────────────────────────────────
C_DARK      = colors.HexColor("#0F1F35")   # slate-navy cover
C_GRID      = colors.HexColor("#162840")   # cover grid lines
C_RED       = colors.HexColor("#DC2626")   # cardinal red accent
C_RED_DK    = colors.HexColor("#991B1B")   # dark red
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
BG_NOTE     = colors.HexColor("#FEF2F2")
C_NOTE_TXT  = colors.HexColor("#991B1B")

# ─────────────────────────────────────────────
#  PAGE GEOMETRY
# ─────────────────────────────────────────────
W, H        = A4
MX          = 2.2 * cm
MY          = 2.0 * cm
CONTENT_W   = W - 2 * MX

CHANNEL_URL  = "https://bookless10.slack.com/archives/C0AN0T2HGR0"
CHANNEL_NAME = "sm-foundations"

OUT_PATH = r"C:\Users\deeky\OneDrive\Desktop\Booklesss\courses\Strategic Management\content\lesson-01-introduction-to-strategy\Step 1.1 - Introduction to Corporate Strategy.pdf"

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def make_styles():
    return {
        # Cover
        "cover_eyebrow": ParagraphStyle("cover_eyebrow",
            fontName="Calibri-Bold", fontSize=7.5, textColor=C_RED,
            leading=11, spaceAfter=12, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Georgia-Bold", fontSize=30, textColor=C_WHITE,
            leading=36, spaceAfter=12, alignment=TA_LEFT),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Calibri", fontSize=10.5, textColor=C_MIST,
            leading=16, spaceAfter=0, alignment=TA_LEFT),

        # Body
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Calibri-Bold", fontSize=7, textColor=C_RED,
            leading=10, spaceAfter=3, spaceBefore=18, alignment=TA_LEFT),
        "h2": ParagraphStyle("h2",
            fontName="Georgia-Bold", fontSize=15, textColor=C_INK,
            leading=19, spaceAfter=8, alignment=TA_LEFT),
        "h3": ParagraphStyle("h3",
            fontName="Calibri-Bold", fontSize=11, textColor=C_STEEL,
            leading=15, spaceAfter=5, spaceBefore=10, alignment=TA_LEFT),
        "body": ParagraphStyle("body",
            fontName="Calibri", fontSize=10.5, textColor=C_INK,
            leading=17, spaceAfter=6, alignment=TA_LEFT),
        "bullet": ParagraphStyle("bullet",
            fontName="Calibri", fontSize=10.5, textColor=C_INK,
            leading=17, spaceAfter=4, leftIndent=14, bulletIndent=0,
            alignment=TA_LEFT),
        "caption": ParagraphStyle("caption",
            fontName="Calibri-Italic", fontSize=8, textColor=C_MIST,
            leading=12, spaceAfter=4, alignment=TA_LEFT),

        # Callout types
        "warn_text": ParagraphStyle("warn_text",
            fontName="Calibri", fontSize=9.5, textColor=C_WARN_TXT,
            leading=15, alignment=TA_LEFT),
        "info_text": ParagraphStyle("info_text",
            fontName="Calibri", fontSize=9.5, textColor=C_INFO_TXT,
            leading=15, alignment=TA_LEFT),
        "note_text": ParagraphStyle("note_text",
            fontName="Calibri", fontSize=9.5, textColor=C_NOTE_TXT,
            leading=15, alignment=TA_LEFT),

        # Table cells
        "th": ParagraphStyle("th",
            fontName="Calibri-Bold", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "td": ParagraphStyle("td",
            fontName="Calibri", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),

        # Outcomes
        "outcome": ParagraphStyle("outcome",
            fontName="Calibri", fontSize=10.5, textColor=C_INK,
            leading=16, spaceAfter=5, leftIndent=14, alignment=TA_LEFT),
        "next_step": ParagraphStyle("next_step",
            fontName="Calibri-Bold", fontSize=9.5, textColor=C_STEEL,
            leading=14, spaceBefore=14, alignment=TA_LEFT),

        # Channel button
        "btn_eyebrow": ParagraphStyle("btn_eyebrow",
            fontName="Calibri-Bold", fontSize=7, textColor=C_WHITE,
            leading=10, spaceAfter=5, alignment=TA_LEFT),
        "btn_body": ParagraphStyle("btn_body",
            fontName="Calibri-Bold", fontSize=10.5, textColor=C_WHITE,
            leading=16, alignment=TA_LEFT),
        "btn_sub": ParagraphStyle("btn_sub",
            fontName="Calibri", fontSize=9, textColor=colors.HexColor("#FCA5A5"),
            leading=14, alignment=TA_LEFT),
    }

ST = make_styles()

# ─────────────────────────────────────────────
#  CANVAS CALLBACKS
# ─────────────────────────────────────────────
def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # Subtle grid lines
    canvas.setStrokeColor(C_GRID)
    canvas.setLineWidth(0.5)
    for i in range(1, 6):
        canvas.line(0, H * i / 6, W, H * i / 6)
    for i in range(1, 4):
        canvas.line(W * i / 4, 0, W * i / 4, H)
    # Cardinal red left strip
    canvas.setFillColor(C_RED)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    # Ghost step number
    canvas.setFont("Georgia-Bold", 160)
    canvas.setFillColor(colors.HexColor("#182F4A"))
    canvas.drawRightString(W - MX, MY + 40, "1.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Calibri", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "1.1 — Introduction to Corporate Strategy")
    canvas.drawRightString(W - MX, H - MY + 7, "v1 · March 2026")
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFont("Calibri", 7.5)
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
        Paragraph(eyebrow_text, ST["eyebrow"]),
        Paragraph(heading_text, ST["h2"]),
        hairline(),
    ]

def callout(text, style="note"):
    styles_map = {
        "note":  (BG_NOTE,  C_RED,      ST["note_text"]),
        "info":  (BG_INFO,  C_INFO_TXT, ST["info_text"]),
        "warn":  (BG_WARN,  C_WARN_TXT, ST["warn_text"]),
    }
    bg, border_c, txt_style = styles_map[style]
    p = Paragraph(text, txt_style)
    t = Table([[p]], colWidths=[CONTENT_W - 12])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), bg),
        ("BOX",           (0,0), (-1,-1), 0.5, border_c),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 6)])

def channel_button():
    label = Paragraph("JOIN THE DISCUSSION", ST["btn_eyebrow"])
    body  = Paragraph(
        f'<link href="{CHANNEL_URL}">Ask questions, share your answers — '
        f'<u><b>open #{CHANNEL_NAME} in Slack</b></u></link>',
        ST["btn_body"]
    )
    t = Table([[label], [body]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_RED),
        ("TOPPADDING",    (0,0), (-1,-1), 12),
        ("BOTTOMPADDING", (0,0), (-1,-1), 14),
        ("LEFTPADDING",   (0,0), (-1,-1), 14),
        ("RIGHTPADDING",  (0,0), (-1,-1), 14),
    ]))
    return KeepTogether([Spacer(1, 20), t])

# ─────────────────────────────────────────────
#  DOCUMENT BUILD
# ─────────────────────────────────────────────
def build():
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4,
                          leftMargin=MX, rightMargin=MX,
                          topMargin=MY + 20, bottomMargin=MY + 20)

    cover_frame = Frame(0, 0, W, H,
                        leftPadding=MX + 10, rightPadding=MX,
                        topPadding=MY + 30, bottomPadding=MY + 50)
    body_frame  = Frame(MX, MY + 18, CONTENT_W, H - MY * 2 - 36,
                        leftPadding=0, rightPadding=0,
                        topPadding=0, bottomPadding=0)

    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[cover_frame], onPage=cover_bg),
        PageTemplate(id="body",  frames=[body_frame],  onPage=body_page),
    ])

    story = []

    # ── COVER ────────────────────────────────
    story.append(Paragraph("STRATEGIC MANAGEMENT  ·  STEP 1.1", ST["cover_eyebrow"]))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Introduction to\nCorporate Strategy", ST["cover_title"]))
    story.append(Spacer(1, 16))
    story.append(Paragraph("What strategy is, why it matters, and the frameworks\nyour exam will test you on.", ST["cover_sub"]))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── SECTION 1: WHAT IS CORPORATE STRATEGY ─
    story += section("CONCEPT 01", "What Is Corporate Strategy?")
    story.append(Paragraph(
        "Strategy is the overall plan a company adopts to reach its long-term goals and create value "
        "for its stakeholders. It sets direction for the entire organisation — guiding every business "
        "unit, every budget, every hire. It is typically developed by top executives and approved by the board.",
        ST["body"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Mary Coulter defines strategic management as a series of steps in which organisational members "
        "analyse the current situation, decide on strategies, put those strategies into action, and evaluate, "
        "modify or change strategies as needed.",
        ST["body"]))
    story.append(callout(
        "Strategy answers three questions: Where are we now? Where do we want to go? How do we get there?",
        "note"))

    # ── SECTION 2: MINTZBERG'S FIVE Ps ────────
    story += section("CONCEPT 02", "Mintzberg's Five Ps of Strategy")
    story.append(Paragraph(
        "Henry Mintzberg argued that strategy is not a one-off decision. It is a pattern in a stream of "
        "decisions made over time. He identified five ways to think about what strategy actually is:",
        ST["body"]))
    story.append(Spacer(1, 8))

    ps_data = [
        [Paragraph("P", ST["th"]), Paragraph("Perspective", ST["th"]), Paragraph("What it means", ST["th"])],
        [Paragraph("Plan", ST["td"]),
         Paragraph("Deliberate", ST["td"]),
         Paragraph("Strategy as a conscious, systematic process — analyse, choose, implement.", ST["td"])],
        [Paragraph("Play", ST["td"]),
         Paragraph("Competitive", ST["td"]),
         Paragraph("Strategy as a move in a game — outmanoeuvring rivals with offensive or defensive actions.", ST["td"])],
        [Paragraph("Pattern", ST["td"]),
         Paragraph("Emergent", ST["td"]),
         Paragraph("Strategy as a pattern that emerges from consistent actions over time, whether planned or not.", ST["td"])],
        [Paragraph("Position", ST["td"]),
         Paragraph("Environmental", ST["td"]),
         Paragraph("Strategy as the place a firm occupies in its market — how it responds to external forces.", ST["td"])],
        [Paragraph("Perspectives", ST["td"]),
         Paragraph("Cultural", ST["td"]),
         Paragraph("Strategy as the organisation's personality — its ingrained way of seeing and doing things.", ST["td"])],
    ]
    ps_table = Table(ps_data, colWidths=[CONTENT_W * 0.13, CONTENT_W * 0.2, CONTENT_W * 0.67])
    ps_table.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ("LINEBELOW",     (0,0), (-1,-1), 0.5, C_RULE),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    story.append(ps_table)

    # ── SECTION 3: KEY COMPONENTS ─────────────
    story += section("CONCEPT 03", "Key Components of Corporate Strategy")
    story.append(Paragraph(
        "Corporate strategy is not just a mission statement. It has five concrete components that shape "
        "every major decision a company makes:",
        ST["body"]))
    story.append(Spacer(1, 8))

    comp_data = [
        [Paragraph("Component", ST["th"]), Paragraph("What it decides", ST["th"])],
        [Paragraph("Scope", ST["td"]),
         Paragraph("Which industries, markets, and geographies the company will operate in.", ST["td"])],
        [Paragraph("Resource Allocation", ST["td"]),
         Paragraph("How capital, talent, and technology are distributed across business units.", ST["td"])],
        [Paragraph("Synergy", ST["td"]),
         Paragraph("How different parts of the organisation work together to create more value than they would alone.", ST["td"])],
        [Paragraph("Growth Strategy", ST["td"]),
         Paragraph("Decisions on mergers, acquisitions, partnerships, and organic growth.", ST["td"])],
        [Paragraph("Portfolio Management", ST["td"]),
         Paragraph("Balancing high-risk, high-reward ventures against stable, cash-generating businesses.", ST["td"])],
    ]
    comp_table = Table(comp_data, colWidths=[CONTENT_W * 0.28, CONTENT_W * 0.72])
    comp_table.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ("LINEBELOW",     (0,0), (-1,-1), 0.5, C_RULE),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    story.append(comp_table)

    # ── SECTION 4: COMPETITIVE ADVANTAGE ──────
    story += section("CONCEPT 04", "Strategy and Competitive Advantage")
    story.append(Paragraph(
        "Strategy only works if it produces a competitive advantage — something that makes customers "
        "prefer you over rivals. There are two ways to get there:",
        ST["body"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<b>More effectively</b> — deliver products or services that customers value more highly than alternatives.",
        ST["bullet"]))
    story.append(Paragraph(
        "<b>More efficiently</b> — deliver the same products or services at a lower cost.",
        ST["bullet"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "A competitive advantage is <i>sustainable</i> when it gives buyers lasting reasons to prefer your "
        "firm. One-off advantages get copied. Sustainable ones are built into the organisation — through "
        "brand, cost structure, technology, or relationships that rivals cannot easily replicate.",
        ST["body"]))
    story.append(callout(
        "A company is likely to succeed when its actions set it apart from rivals and stake out a market "
        "position that is not crowded with strong competitors.",
        "note"))

    # ── SECTION 5: THE FIVE STRATEGIC APPROACHES ─
    story += section("CONCEPT 05", "The Five Strategic Approaches")
    story.append(Paragraph(
        "Porter identified five approaches firms use to build competitive advantage. Each targets a "
        "different combination of cost, differentiation, and market scope:",
        ST["body"]))
    story.append(Spacer(1, 8))

    approaches_data = [
        [Paragraph("Approach", ST["th"]), Paragraph("How it works", ST["th"]), Paragraph("Who it targets", ST["th"])],
        [Paragraph("Low-Cost Provider", ST["td"]),
         Paragraph("Lowest prices in the industry through operational efficiency and economies of scale.", ST["td"]),
         Paragraph("Broad market — price-sensitive buyers.", ST["td"])],
        [Paragraph("Focused Low-Cost", ST["td"]),
         Paragraph("Lowest prices within a specific niche rather than the whole market.", ST["td"]),
         Paragraph("A defined segment — e.g. budget travellers on short routes.", ST["td"])],
        [Paragraph("Broad Differentiation", ST["td"]),
         Paragraph("Unique products through innovation, design, quality, or brand image. Premium pricing.", ST["td"]),
         Paragraph("Wide audience willing to pay more for something distinct.", ST["td"])],
        [Paragraph("Focused Differentiation", ST["td"]),
         Paragraph("Unique features tailored tightly to a narrow customer group.", ST["td"]),
         Paragraph("Niche — e.g. luxury brands targeting high-income segments.", ST["td"])],
        [Paragraph("Best-Cost Provider", ST["td"]),
         Paragraph("Good quality at a competitive price. Blends efficiency with selective differentiation.", ST["td"]),
         Paragraph("Buyers seeking the sweet spot between quality and affordability.", ST["td"])],
    ]
    approaches_table = Table(approaches_data,
                             colWidths=[CONTENT_W * 0.26, CONTENT_W * 0.44, CONTENT_W * 0.30])
    approaches_table.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ("LINEBELOW",     (0,0), (-1,-1), 0.5, C_RULE),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    story.append(approaches_table)
    story.append(callout(
        "Exam tip: know all five by name and be ready to identify which approach a company is using "
        "from a case description. The difference between broad and focused is market scope, not quality.",
        "info"))

    # ── KEY TERMS ─────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ("Corporate Strategy",    "The overall plan an organisation adopts to achieve long-term goals and create value."),
        ("Competitive Advantage", "An attribute that lets a firm outperform rivals — through lower cost or higher perceived value."),
        ("Sustainable Advantage", "A competitive edge that persists over time because rivals cannot easily copy it."),
        ("Mintzberg's Five Ps",   "Plan, Play, Pattern, Position, Perspectives — five lenses for understanding what strategy is."),
        ("Strategic Management",  "The ongoing process of analysing, deciding, implementing, and evaluating strategy."),
        ("Scope",                 "The range of industries, markets, and geographies a company chooses to compete in."),
        ("Portfolio Management",  "Balancing the mix of business units or products across different risk and return profiles."),
        ("Best-Cost Provider",    "A strategic approach combining efficiency (low cost) with selective differentiation."),
    ]
    terms_data = [[Paragraph("Term", ST["th"]), Paragraph("Definition", ST["th"])]] + \
                 [[Paragraph(t, ST["td"]), Paragraph(d, ST["td"])] for t, d in terms]
    terms_table = Table(terms_data, colWidths=[CONTENT_W * 0.30, CONTENT_W * 0.70])
    terms_table.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), colors.HexColor("#F3F4F6")),
        ("LINEBELOW",     (0,0), (-1,-1), 0.5, C_RULE),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    story.append(terms_table)

    # ── LEARNING OUTCOMES ─────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Define corporate strategy and explain its purpose in an organisation.",
        "Apply Mintzberg's Five Ps to describe how strategy forms in practice.",
        "Identify the three core strategic questions and explain what each addresses.",
        "List and explain the five key components of corporate strategy.",
        "Distinguish between the five strategic approaches and identify which a firm is using.",
        "Explain the difference between competitive advantage and sustainable competitive advantage.",
    ]
    for i, o in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.  {o}", ST["outcome"]))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Next: Step 1.2 — Mission, Vision and Organisational Values", ST["next_step"]))

    # ── CHANNEL BUTTON ────────────────────────
    story.append(channel_button())

    doc.build(story)
    print(f"PDF saved: {OUT_PATH}")

import os
build()
