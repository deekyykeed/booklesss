"""
Booklesss Lesson PDF — 1.1: Introduction to Treasury Management
Course: BBF4302 Treasury Management
Style: Deep navy cover, white body, emerald accent, Georgia serif display, Trebuchet body.
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
from reportlab.lib.utils import ImageReader
import os

# ─────────────────────────────────────────────
#  FONTS
# ─────────────────────────────────────────────
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Georgia",        F + r"\georgia.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold",   F + r"\georgiab.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Italic", F + r"\georgiai.ttf"))
pdfmetrics.registerFontFamily("Georgia", normal="Georgia", bold="Georgia-Bold", italic="Georgia-Italic")

pdfmetrics.registerFont(TTFont("Trebuchet",        F + r"\trebuc.ttf"))
pdfmetrics.registerFont(TTFont("Trebuchet-Bold",   F + r"\trebucbd.ttf"))
pdfmetrics.registerFont(TTFont("Trebuchet-Italic", F + r"\trebucit.ttf"))
pdfmetrics.registerFontFamily("Trebuchet", normal="Trebuchet", bold="Trebuchet-Bold", italic="Trebuchet-Italic")

# ─────────────────────────────────────────────
#  COLOURS
# ─────────────────────────────────────────────
C_DARK      = colors.HexColor("#0B1D3A")   # navy cover
C_GRID      = colors.HexColor("#132646")   # cover grid lines
C_GREEN     = colors.HexColor("#10B981")   # emerald accent
C_GREEN_DK  = colors.HexColor("#065F46")   # dark emerald
C_INK       = colors.HexColor("#111827")   # primary text
C_STEEL     = colors.HexColor("#6B7280")   # secondary text
C_MIST      = colors.HexColor("#9CA3AF")   # meta / captions
C_RULE      = colors.HexColor("#E5E7EB")   # light dividers
C_AMBER     = colors.HexColor("#C17E3A")   # amber eyebrows / hairlines
C_WHITE     = colors.white

BG_WARN     = colors.HexColor("#FEF3C7")
C_WARN_TXT  = colors.HexColor("#92400E")
BG_INFO     = colors.HexColor("#EFF6FF")
C_INFO_TXT  = colors.HexColor("#1D4ED8")
BG_NOTE     = colors.HexColor("#ECFDF5")
C_NOTE_TXT  = colors.HexColor("#065F46")

# ─────────────────────────────────────────────
#  PAGE GEOMETRY
# ─────────────────────────────────────────────
W, H        = A4
MX          = 2.2 * cm
MY          = 2.0 * cm
HEADER_H    = 28
FOOTER_H    = 28
CONTENT_W   = W - 2 * MX

CHANNEL_URL  = "https://bookless10.slack.com/archives/C0ANULGE6SU"
CHANNEL_NAME = "tm-operations"

OUT_PATH = r"C:\Users\deeky\OneDrive\Desktop\Booklesss\courses\Treasury Management\content\lesson-01-treasury-foundations\Step 1.1 - Introduction to Treasury Management.pdf"

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def make_styles():
    return {
        # Cover
        "cover_eyebrow": ParagraphStyle("cover_eyebrow",
            fontName="Trebuchet-Bold", fontSize=7.5, textColor=C_GREEN,
            leading=11, spaceAfter=12, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Georgia-Bold", fontSize=30, textColor=C_WHITE,
            leading=36, spaceAfter=12, alignment=TA_LEFT),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Trebuchet", fontSize=10.5, textColor=C_MIST,
            leading=16, spaceAfter=0, alignment=TA_LEFT),

        # Body
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Trebuchet-Bold", fontSize=7, textColor=C_AMBER,
            leading=10, spaceAfter=3, spaceBefore=18, alignment=TA_LEFT),
        "h2": ParagraphStyle("h2",
            fontName="Georgia-Bold", fontSize=15, textColor=C_INK,
            leading=19, spaceAfter=8, alignment=TA_LEFT),
        "h3": ParagraphStyle("h3",
            fontName="Trebuchet-Bold", fontSize=11, textColor=C_STEEL,
            leading=15, spaceAfter=5, spaceBefore=10, alignment=TA_LEFT),
        "body": ParagraphStyle("body",
            fontName="Trebuchet", fontSize=10, textColor=C_INK,
            leading=16.5, spaceAfter=6, alignment=TA_LEFT),
        "bullet": ParagraphStyle("bullet",
            fontName="Trebuchet", fontSize=10, textColor=C_INK,
            leading=16.5, spaceAfter=4, leftIndent=14, bulletIndent=0,
            alignment=TA_LEFT),
        "caption": ParagraphStyle("caption",
            fontName="Trebuchet-Italic", fontSize=8, textColor=C_MIST,
            leading=12, spaceAfter=4, alignment=TA_LEFT),

        # Callout types
        "warn_text": ParagraphStyle("warn_text",
            fontName="Trebuchet", fontSize=9.5, textColor=C_WARN_TXT,
            leading=15, alignment=TA_LEFT),
        "info_text": ParagraphStyle("info_text",
            fontName="Trebuchet", fontSize=9.5, textColor=C_INFO_TXT,
            leading=15, alignment=TA_LEFT),
        "note_text": ParagraphStyle("note_text",
            fontName="Trebuchet", fontSize=9.5, textColor=C_NOTE_TXT,
            leading=15, alignment=TA_LEFT),

        # Table cells
        "th": ParagraphStyle("th",
            fontName="Trebuchet-Bold", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "td": ParagraphStyle("td",
            fontName="Trebuchet", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),

        # Outcomes
        "outcome": ParagraphStyle("outcome",
            fontName="Trebuchet", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=5, leftIndent=14, alignment=TA_LEFT),
        "next_step": ParagraphStyle("next_step",
            fontName="Trebuchet-Bold", fontSize=9.5, textColor=C_STEEL,
            leading=14, spaceBefore=14, alignment=TA_LEFT),

        # Channel button
        "btn_eyebrow": ParagraphStyle("btn_eyebrow",
            fontName="Trebuchet-Bold", fontSize=7, textColor=C_WHITE,
            leading=10, spaceAfter=5, alignment=TA_LEFT),
        "btn_body": ParagraphStyle("btn_body",
            fontName="Trebuchet-Bold", fontSize=10.5, textColor=C_WHITE,
            leading=16, alignment=TA_LEFT),
        "btn_sub": ParagraphStyle("btn_sub",
            fontName="Trebuchet", fontSize=9, textColor=colors.HexColor("#A7F3D0"),
            leading=14, alignment=TA_LEFT),
    }

ST = make_styles()

# ─────────────────────────────────────────────
#  CANVAS CALLBACKS
# ─────────────────────────────────────────────
def cover_bg(canvas, doc):
    canvas.saveState()
    # Navy background
    canvas.setFillColor(C_DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # Grid lines
    canvas.setStrokeColor(C_GRID)
    canvas.setLineWidth(0.5)
    for i in range(1, 6):
        canvas.line(0, H * i / 6, W, H * i / 6)
    for i in range(1, 4):
        canvas.line(W * i / 4, 0, W * i / 4, H)
    # Emerald left strip
    canvas.setFillColor(C_GREEN)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    # Ghost lesson number
    canvas.setFont("Georgia-Bold", 160)
    canvas.setFillColor(colors.HexColor("#0F2847"))
    canvas.drawRightString(W - MX, MY + 40, "1.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    # Header hairline + text
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Trebuchet", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "1.1 — Introduction to Treasury Management")
    canvas.drawRightString(W - MX, H - MY + 7, "v1 · March 2026")
    # Footer hairline + text
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFont("Trebuchet", 7.5)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(W / 2, MY - 14, "BBF4302 — Treasury Management")
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
    styles = {
        "warn":    (BG_WARN, C_WARN_TXT, ST["warn_text"], "⚠ "),
        "info":    (BG_INFO, C_INFO_TXT, ST["info_text"], ""),
        "note":    (BG_NOTE, C_NOTE_TXT, ST["note_text"], ""),
    }
    bg, border_col, st, prefix = styles.get(style, styles["info"])
    p = Paragraph(prefix + text, st)
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

def channel_button():
    label   = Paragraph("JOIN THE DISCUSSION", ST["btn_eyebrow"])
    main    = Paragraph(
        f'<link href="{CHANNEL_URL}">Ask questions, share your answers — <u><b>open #{CHANNEL_NAME} in Slack</b></u></link>',
        ST["btn_body"])
    t = Table([[label], [main]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), C_GREEN),
        ('TOPPADDING',    (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING',   (0,0), (-1,-1), 16),
        ('RIGHTPADDING',  (0,0), (-1,-1), 16),
    ]))
    return KeepTogether([Spacer(1, 20), t])

# ─────────────────────────────────────────────
#  DOCUMENT BUILD
# ─────────────────────────────────────────────
def build():
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4, leftMargin=MX, rightMargin=MX,
                          topMargin=MY + HEADER_H, bottomMargin=MY + FOOTER_H)

    cover_frame = Frame(0, 0, W, H, leftPadding=MX + 10, rightPadding=MX,
                        topPadding=H * 0.28, bottomPadding=MY + 40)
    body_frame  = Frame(MX, MY + FOOTER_H, CONTENT_W, H - MY*2 - HEADER_H - FOOTER_H,
                        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_bg),
        PageTemplate(id="Body",  frames=[body_frame],  onPage=body_page),
    ])

    story = []

    # ── COVER ──────────────────────────────────────────────────
    story.append(Paragraph("BBF4302 TREASURY MANAGEMENT", ST["cover_eyebrow"]))
    story.append(Paragraph("Introduction to\nTreasury Management", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Step 1.1 · What treasury is, what it does, and how it works", ST["cover_sub"]))
    story.append(Spacer(1, 16))
    story.append(Paragraph("Booklesss · booklesss.framer.ai", ParagraphStyle("cover_brand",
        fontName="Trebuchet-Bold", fontSize=8, textColor=colors.HexColor("#374151"),
        leading=12, alignment=TA_LEFT)))

    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: What is Treasury? ───────────────────────────
    story += section("FOUNDATIONS", "What is Treasury?")
    story.append(body(
        "Treasury is the financial centre of an organisation. Its core job is to protect the "
        "company's financial assets, manage its liabilities, and make sure cash is available when it's needed."
    ))
    story.append(body(
        "Day-to-day, that means keeping suppliers paid, meeting debt obligations, and ensuring "
        "surplus cash earns rather than sits idle. The treasury team executes decisions made by "
        "senior management — they don't set strategy, they carry it out. And they have a major "
        "role in identifying and reducing financial risk."
    ))
    story.append(callout(
        "The structure of a treasury department varies by company size, industry, and organisational complexity.",
        "info"))

    # ── SECTION 2: Three Finance Decisions ─────────────────────
    story += section("CORE CONCEPTS", "The Three Finance Decisions")
    story.append(body("Every finance function operates within three broad decision areas:"))
    story.append(h3("1. Investment Decision"))
    story.append(body(
        "How does the company deploy its available resources? This covers long-term project "
        "commitments, working capital investment (stock, debtors), and internal or external "
        "investment decisions."
    ))
    story.append(h3("2. Financing Decision"))
    story.append(body(
        "How does the company raise the money it needs? This means finding the right mix of "
        "debt and equity, understanding the cost of funds, managing capital structure, and "
        "handling risk and hedging."
    ))
    story.append(h3("3. Dividend Policy"))
    story.append(body(
        "What happens to profits? How much is paid out to shareholders and how much is retained "
        "to fund growth. Dividend levels directly affect the company's market value."
    ))

    # ── SECTION 3: 11 Functions ────────────────────────────────
    story += section("SCOPE", "The 11 Main Functions of Treasury")
    story.append(body("The treasurer's responsibilities go well beyond holding cash:"))
    story.append(Spacer(1, 6))

    functions_data = [
        ["#", "Function", "What it means"],
        ["1", "Cash forecasting", "Pulls short and long-term forecasts from all subsidiaries"],
        ["2", "Working capital mgmt", "Monitors working capital levels and trends"],
        ["3", "Cash management", "Keeps sufficient cash available for operations at all times"],
        ["4", "Investment management", "Invests surplus cash appropriately"],
        ["5", "Risk management", "Manages interest rate and FX exposure"],
        ["6", "Management advice", "Advises leadership on market conditions"],
        ["7", "Credit rating relations", "Liaises with agencies when issuing marketable debt"],
        ["8", "Bank relationships", "Manages banking fees, terms, and ongoing communications"],
        ["9", "Fund raising", "Maintains investor relationships for capital raising"],
        ["10", "Credit granting", "Grants credit to customers on behalf of the business"],
        ["11", "Other activities", "M&A support, company insurance, and similar matters"],
    ]
    story.append(table_std(functions_data, [1.2*cm, 5.5*cm, CONTENT_W - 1.2*cm - 5.5*cm]))
    story.append(Spacer(1, 12))

    # ── SECTION 4: Strategic / Tactical / Operational ──────────
    story += section("TASK LEVELS", "Strategic, Tactical & Operational")
    story.append(body("Treasury work happens at three levels. Knowing which is which matters in the exam."))
    story.append(Spacer(1, 4))

    levels_data = [
        ["Level", "Focus", "Examples"],
        ["Strategic", "Long-term policy", "Capital structure, dividend policy, capital raising, investment returns"],
        ["Tactical", "Medium-term decisions", "Cash investment management, hedging currency or interest rate risk"],
        ["Operational", "Daily execution", "Transmitting cash, placing surplus funds, bank communications"],
    ]
    story.append(table_std(levels_data, [3.2*cm, 4*cm, CONTENT_W - 7.2*cm]))
    story.append(Spacer(1, 6))
    story.append(callout(
        "Exam tip: classify by time horizon. Strategic = long-term policy. Tactical = medium-term decisions. Operational = daily execution.",
        "note"))

    # ── SECTION 5: Cost vs Profit Centre ───────────────────────
    story += section("STRUCTURE", "Cost Centre vs Profit Centre")
    story.append(body(
        "How a company classifies its treasury function changes how it's managed and measured."
    ))
    story.append(h3("Cost Centre (Most Common)"))
    story.append(body(
        "Treasury is treated as a support function — not expected to generate profit, just manage "
        "costs. The risk here is that management fixates on what treasury costs rather than "
        "what it contributes, which can starve the function of budget and staff."
    ))
    story.append(h3("Profit Centre"))
    story.append(body(
        "Used by companies heavily involved in global finance, FX trading, or commodities. "
        "Treasury actively generates income through trading, hedging, or internal service pricing."
    ))
    story.append(Spacer(1, 4))
    cp_data = [
        ["", "Advantages", "Disadvantages"],
        ["Profit Centre",
         "Business units pay market rates — cost transparency improves. Treasurer incentivised to operate efficiently.",
         "Temptation to speculate. Internal disputes over charges. Higher admin costs."],
    ]
    story.append(table_std(cp_data, [3*cm, (CONTENT_W-3*cm)/2, (CONTENT_W-3*cm)/2]))
    story.append(Spacer(1, 8))
    story.append(callout(
        "⚠ Nick Leeson at Barings Bank (1995) is the exam case. He ran treasury-style operations with no oversight, hid losses in a secret account, and brought down the bank. The lesson: unchecked profit-centre thinking without controls is catastrophic.",
        "warn"))

    # ── SECTION 6: Treasury Controls ───────────────────────────
    story += section("CONTROLS", "Treasury Controls")
    story.append(body(
        "Because treasury handles large sums, controls are non-negotiable. Six to know:"
    ))
    controls = [
        ("1. Segregation of Duties",
         "Front office (dealing/trading) must be separate from back office (confirmation and settlement). No one person initiates and confirms their own transactions."),
        ("2. Delegation of Authority",
         "The right level of decision-making must sit with the right people. High-risk decisions require senior sign-off; routine ones should not."),
        ("3. Limits",
         "Caps on transaction size, type, or instrument. Prevents staff from investing in instruments with excessive risk of capital loss."),
        ("4. Approvals",
         "All trades approved by a senior manager. A separate person reconciles and accounts for every transaction."),
        ("5. Internal Audits",
         "Scheduled audits match actual transactions against company policy — catching drift before it becomes a problem."),
        ("6. Automation / STP",
         "Straight-Through Processing removes manual steps from routine transactions, reducing errors and fraud opportunities."),
    ]
    for title, desc in controls:
        story.append(h3(title))
        story.append(body(desc))

    # ── SECTION 7: Centralisation ───────────────────────────────
    story += section("STRUCTURE", "Centralised, Decentralised & Hybrid")
    story.append(body(
        "How treasury is structured geographically depends on how the business operates."
    ))

    struct_data = [
        ["Structure", "How it works", "Advantage", "Disadvantage"],
        ["Centralised",
         "All operations run from HQ",
         "Stronger controls, economies of scale, lower costs, tax advantages for MNCs",
         "Field offices lose autonomy; local knowledge not captured"],
        ["Decentralised",
         "Subsidiaries manage their own treasury under group guidelines",
         "Local staff know local banking, regulations, language and customs",
         "Duplication of effort and resources across units"],
        ["Hybrid",
         "Regional centres — centralised within regions, decentralised across them",
         "Combines central control with local knowledge",
         "More complex to set up and manage"],
    ]
    story.append(table_std(struct_data, [2.8*cm, 4.5*cm, (CONTENT_W-7.3*cm)/2, (CONTENT_W-7.3*cm)/2]))
    story.append(Spacer(1, 8))
    story.append(callout(
        "The hybrid model is increasingly common. Modern Treasury Management Systems allow local teams to input data centrally — giving HQ oversight without removing local responsiveness.",
        "info"))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")

    terms = [
        ["Term", "Definition"],
        ["Treasury", "The function responsible for managing an organisation's financial assets, liabilities, and cash"],
        ["Cost centre", "A department measured by costs incurred, not profits generated"],
        ["Profit centre", "A department expected to generate income through trading or internal pricing"],
        ["Segregation of duties", "Splitting trading and confirmation roles between different staff to prevent fraud"],
        ["Delegation of authority", "Assigning decision-making power to appropriate levels within the treasury team"],
        ["STP", "Straight-Through Processing — automated transaction processing with no manual intervention"],
        ["Centralised treasury", "All treasury operations managed from a single location, typically HQ"],
        ["Decentralised treasury", "Subsidiaries manage their own treasury within group-wide guidelines"],
        ["Hybrid treasury", "Regional centres combining aspects of centralised and decentralised structures"],
    ]
    story.append(table_std(terms, [5*cm, CONTENT_W - 5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")

    outcomes = [
        "Define the treasury function and explain its role within an organisation",
        "Classify treasury activities as strategic, tactical, or operational",
        "Compare cost centre and profit centre structures, with advantages and disadvantages of each",
        "List the six main treasury controls and explain why segregation of duties matters",
        "Distinguish between centralised, decentralised, and hybrid treasury structures",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 1.2 — Treasury Systems & Operations", ST["next_step"]))

    # ── CHANNEL BUTTON ──────────────────────────────────────────
    story.append(channel_button())

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
