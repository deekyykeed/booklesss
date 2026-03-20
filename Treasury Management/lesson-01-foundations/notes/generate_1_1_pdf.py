"""
Booklesss — Lesson PDF Generator
Script:  generate_1_1_pdf.py
Output:  1_1_introduction-to-tm_v1.pdf
Course:  BBF4302 Treasury Management — Lesson 1.1
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, KeepTogether, HRFlowable, PageBreak
)
from reportlab.platypus.flowables import Flowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ── Paths ──────────────────────────────────────────────────────────────────
FONT_DIR = r"C:\Windows\Fonts"
OUT_DIR  = r"C:\Users\deeky\OneDrive\Desktop\Booklesss\Treasury Management\lesson-01-foundations\notes"
OUT_FILE = os.path.join(OUT_DIR, "1_1_introduction-to-tm_v1.pdf")

# ── Brand colours ──────────────────────────────────────────────────────────
CREAM  = colors.HexColor("#F5F0E8")
NAVY   = colors.HexColor("#1B2A4A")
AMBER  = colors.HexColor("#C17E3A")
TEAL   = colors.HexColor("#0E6B6B")
BODY   = colors.HexColor("#2C2C2C")
WHITE  = colors.white
LIGHT  = colors.HexColor("#E8E3D8")   # subtle table stripe
WARN   = colors.HexColor("#FFF3E0")   # warning box bg

# ── Page geometry ──────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN = 2.5 * cm
CONTENT_W = PAGE_W - 2 * MARGIN
FOOTER_Y  = 1.2 * cm

# ── Register fonts ─────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont("Calibri",       os.path.join(FONT_DIR, "calibri.ttf")))
pdfmetrics.registerFont(TTFont("Calibri-Bold",  os.path.join(FONT_DIR, "calibrib.ttf")))
pdfmetrics.registerFont(TTFont("Calibri-Italic",os.path.join(FONT_DIR, "calibrii.ttf")))
pdfmetrics.registerFontFamily(
    "Calibri",
    normal="Calibri",
    bold="Calibri-Bold",
    italic="Calibri-Italic",
    boldItalic="Calibri-Bold",
)

COURSE_SHORT = "BBF4302 TM"
LESSON_SHORT = "1.1 Intro to Treasury Management"

# ── Page decorators ────────────────────────────────────────────────────────
def draw_page_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.restoreState()

def draw_header_footer(canvas, doc):
    draw_page_background(canvas, doc)
    canvas.saveState()

    # Amber rule below header area
    rule_y = PAGE_H - MARGIN + 0.3 * cm
    canvas.setStrokeColor(AMBER)
    canvas.setLineWidth(1)
    canvas.line(MARGIN, rule_y, PAGE_W - MARGIN, rule_y)

    # Amber rule above footer
    footer_rule_y = FOOTER_Y + 0.55 * cm
    canvas.line(MARGIN, footer_rule_y, PAGE_W - MARGIN, footer_rule_y)

    # Footer text
    canvas.setFont("Calibri", 8)
    canvas.setFillColor(BODY)

    # Left
    canvas.drawString(MARGIN, FOOTER_Y + 0.15 * cm, "Booklesss | booklesss.framer.ai")

    # Centre
    centre_text = f"{COURSE_SHORT}  ·  {LESSON_SHORT}"
    canvas.drawCentredString(PAGE_W / 2, FOOTER_Y + 0.15 * cm, centre_text)

    # Right — page number
    canvas.drawRightString(PAGE_W - MARGIN, FOOTER_Y + 0.15 * cm, f"Page {doc.page}")

    canvas.restoreState()

def draw_cover_page(canvas, doc):
    """Fully custom cover — no normal header/footer."""
    canvas.saveState()

    # Navy background
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Amber strip top
    canvas.setFillColor(AMBER)
    canvas.rect(0, PAGE_H - 1.2 * cm, PAGE_W, 1.2 * cm, fill=1, stroke=0)

    # Amber strip bottom
    canvas.rect(0, 0, PAGE_W, 1.2 * cm, fill=1, stroke=0)

    # Tag
    canvas.setFont("Calibri-Bold", 12)
    canvas.setFillColor(AMBER)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H * 0.72, "LESSON 1.1")

    # Title
    canvas.setFont("Calibri-Bold", 30)
    canvas.setFillColor(WHITE)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H * 0.60, "Introduction to")
    canvas.drawCentredString(PAGE_W / 2, PAGE_H * 0.53, "Treasury Management")

    # Divider
    canvas.setStrokeColor(AMBER)
    canvas.setLineWidth(1.5)
    canvas.line(MARGIN * 2, PAGE_H * 0.49, PAGE_W - MARGIN * 2, PAGE_H * 0.49)

    # Subtitle
    canvas.setFont("Calibri", 16)
    canvas.setFillColor(LIGHT)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H * 0.43, "BBF4302 Treasury Management")

    # Branding footer line
    canvas.setFont("Calibri", 10)
    canvas.setFillColor(NAVY)
    canvas.drawCentredString(PAGE_W / 2, 0.45 * cm, "booklesss.framer.ai  |  booklesss20.slack.com")

    canvas.restoreState()

# ── Paragraph styles ───────────────────────────────────────────────────────
def make_styles():
    s = {}

    s["section_title"] = ParagraphStyle(
        "section_title",
        fontName="Calibri-Bold",
        fontSize=14,
        textColor=NAVY,
        spaceAfter=6,
        spaceBefore=14,
        leading=18,
    )
    s["body"] = ParagraphStyle(
        "body",
        fontName="Calibri",
        fontSize=10.5,
        textColor=BODY,
        leading=15,
        spaceAfter=6,
        alignment=TA_JUSTIFY,
    )
    s["body_bold"] = ParagraphStyle(
        "body_bold",
        fontName="Calibri-Bold",
        fontSize=10.5,
        textColor=BODY,
        leading=15,
        spaceAfter=4,
    )
    s["bullet"] = ParagraphStyle(
        "bullet",
        fontName="Calibri",
        fontSize=10.5,
        textColor=BODY,
        leading=15,
        leftIndent=14,
        spaceAfter=3,
        bulletIndent=4,
    )
    s["numbered"] = ParagraphStyle(
        "numbered",
        fontName="Calibri",
        fontSize=10.5,
        textColor=BODY,
        leading=15,
        leftIndent=20,
        spaceAfter=3,
    )
    s["table_header"] = ParagraphStyle(
        "table_header",
        fontName="Calibri-Bold",
        fontSize=9.5,
        textColor=WHITE,
        leading=13,
        alignment=TA_CENTER,
    )
    s["table_cell"] = ParagraphStyle(
        "table_cell",
        fontName="Calibri",
        fontSize=9.5,
        textColor=BODY,
        leading=13,
        alignment=TA_LEFT,
    )
    s["table_cell_bold"] = ParagraphStyle(
        "table_cell_bold",
        fontName="Calibri-Bold",
        fontSize=9.5,
        textColor=BODY,
        leading=13,
    )
    s["warn_title"] = ParagraphStyle(
        "warn_title",
        fontName="Calibri-Bold",
        fontSize=10.5,
        textColor=colors.HexColor("#7B2D00"),
        leading=14,
        spaceAfter=3,
    )
    s["warn_body"] = ParagraphStyle(
        "warn_body",
        fontName="Calibri",
        fontSize=10,
        textColor=colors.HexColor("#5C2200"),
        leading=14,
        alignment=TA_JUSTIFY,
    )
    s["see_also_title"] = ParagraphStyle(
        "see_also_title",
        fontName="Calibri-Bold",
        fontSize=10.5,
        textColor=TEAL,
        spaceAfter=4,
        leading=14,
    )
    s["see_also_body"] = ParagraphStyle(
        "see_also_body",
        fontName="Calibri",
        fontSize=10,
        textColor=BODY,
        leading=14,
        spaceAfter=2,
    )
    s["lo_item"] = ParagraphStyle(
        "lo_item",
        fontName="Calibri",
        fontSize=10.5,
        textColor=BODY,
        leading=15,
        leftIndent=20,
        spaceAfter=4,
    )
    return s

# ── Helper flowables ───────────────────────────────────────────────────────
def section_rule():
    return HRFlowable(width="100%", thickness=0.5, color=AMBER, spaceAfter=4, spaceBefore=2)

def amber_rule():
    return HRFlowable(width="100%", thickness=1, color=AMBER, spaceAfter=6, spaceBefore=0)

def teal_rule():
    return HRFlowable(width="100%", thickness=1, color=TEAL, spaceAfter=6, spaceBefore=0)

def gap(h=6):
    return Spacer(1, h)

def section_heading(text, styles):
    return [
        Spacer(1, 10),
        Paragraph(text, styles["section_title"]),
        amber_rule(),
    ]

def bullet_item(text, styles):
    return Paragraph(f"• {text}", styles["bullet"])

def numbered_item(n, text, styles):
    return Paragraph(f"<b>{n}.</b> {text}", styles["numbered"])

def warning_box(title, body_text, styles):
    content = [
        Paragraph(title, styles["warn_title"]),
        Paragraph(body_text, styles["warn_body"]),
    ]
    t = Table([[content]], colWidths=[CONTENT_W - 0.4 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), WARN),
        ("LEFTPADDING",   (0, 0), (-1, -1), 10),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 10),
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#C17E3A")),
        ("ROUNDEDCORNERS", [4]),
    ]))
    return t

def see_also_box(items, styles):
    rows = [[Paragraph("SEE ALSO", styles["see_also_title"])]]
    for item in items:
        rows.append([Paragraph(item, styles["see_also_body"])])
    t = Table(rows, colWidths=[CONTENT_W - 0.4 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#E0F0F0")),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("BOX", (0, 0), (-1, -1), 1, TEAL),
    ]))
    return t

# ── Table builder helpers ──────────────────────────────────────────────────
TC = colors.HexColor

def std_table(header_row, data_rows, col_widths, styles):
    """Build a table with navy header and alternating cream/white rows."""
    header = [Paragraph(h, styles["table_header"]) for h in header_row]
    rows = [header]
    for i, row in enumerate(data_rows):
        rows.append([Paragraph(str(cell), styles["table_cell"]) for cell in row])

    t = Table(rows, colWidths=col_widths, repeatRows=1)
    style = [
        # Header
        ("BACKGROUND",    (0, 0), (-1, 0),  NAVY),
        ("TEXTCOLOR",     (0, 0), (-1, 0),  WHITE),
        ("FONTNAME",      (0, 0), (-1, 0),  "Calibri-Bold"),
        ("FONTSIZE",      (0, 0), (-1, 0),  9.5),
        ("ALIGN",         (0, 0), (-1, 0),  "CENTER"),
        ("BOTTOMPADDING", (0, 0), (-1, 0),  7),
        ("TOPPADDING",    (0, 0), (-1, 0),  7),
        # Body rows
        ("FONTNAME",      (0, 1), (-1, -1), "Calibri"),
        ("FONTSIZE",      (0, 1), (-1, -1), 9.5),
        ("TEXTCOLOR",     (0, 1), (-1, -1), BODY),
        ("TOPPADDING",    (0, 1), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 7),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 7),
        ("GRID",          (0, 0), (-1, -1), 0.5, colors.HexColor("#C8C0B0")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [CREAM, LIGHT]),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ]
    t.setStyle(TableStyle(style))
    return t

# ── Build document ─────────────────────────────────────────────────────────
def build_pdf():
    styles = make_styles()

    # Two page templates: cover (no header/footer) and normal
    cover_frame  = Frame(0, 0, PAGE_W, PAGE_H, leftPadding=0, rightPadding=0,
                         topPadding=0, bottomPadding=0)
    normal_frame = Frame(MARGIN, FOOTER_Y + 1.3 * cm,
                         CONTENT_W, PAGE_H - MARGIN - FOOTER_Y - 1.8 * cm,
                         leftPadding=0, rightPadding=0,
                         topPadding=0, bottomPadding=0)

    cover_tmpl  = PageTemplate(id="cover",  frames=[cover_frame],
                               onPage=draw_cover_page)
    normal_tmpl = PageTemplate(id="normal", frames=[normal_frame],
                               onPage=draw_header_footer)

    doc = BaseDocTemplate(
        OUT_FILE,
        pagesize=A4,
        pageTemplates=[cover_tmpl, normal_tmpl],
        title="Introduction to Treasury Management",
        author="Booklesss",
    )

    story = []

    # ── COVER (page 1) ─────────────────────────────────────────────────────
    story.append(NextPageTemplate("normal"))
    story.append(PageBreak())

    # ── SECTION 1 ─────────────────────────────────────────────────────────
    story.extend(section_heading("Section 1 — What is Treasury Management?", styles))
    story.append(Paragraph(
        "The treasury department is the financial centre of any organisation. Its core job is to "
        "protect the organisation's money and make sure there is always enough cash to keep things running.",
        styles["body"]))
    story.append(Paragraph(
        "Think of it this way: the rest of the business makes decisions — treasury makes sure those "
        "decisions can actually be paid for.",
        styles["body"]))
    story.append(Paragraph("<b>Three things treasury is always responsible for:</b>", styles["body"]))
    story.append(bullet_item("Safeguarding financial assets — cash, investments, receivables", styles))
    story.append(bullet_item("Managing liabilities — loans, debt, obligations", styles))
    story.append(bullet_item("Ensuring daily liquidity — the organisation never runs out of cash to operate", styles))

    # ── SECTION 2 ─────────────────────────────────────────────────────────
    story.extend(section_heading("Section 2 — The 3 Key Decisions of the Finance Function", styles))
    story.append(Paragraph(
        "Treasury sits at the centre of three fundamental financial decisions:", styles["body"]))
    story.append(numbered_item(1,
        "<b>Investment Decision</b> — which projects to fund, how much to invest in working capital, "
        "when to invest or divest", styles))
    story.append(numbered_item(2,
        "<b>Financing Decision</b> — choosing the right mix of debt and equity, understanding cost of "
        "funds, managing the difference between profit and cash", styles))
    story.append(numbered_item(3,
        "<b>Dividend Decision</b> — how much to pay out vs. retain for growth, dividend level affects "
        "company market value", styles))

    # ── SECTION 3 ─────────────────────────────────────────────────────────
    story.extend(section_heading("Section 3 — The 10 Main Functions of Treasury", styles))

    fn_headers = ["#", "Function", "What it means"]
    fn_data = [
        ["1", "Cash Forecasting",           "Compile short and long-term cash forecasts"],
        ["2", "Working Capital Management", "Monitor levels and trends of current assets and liabilities"],
        ["3", "Cash Management",            "Ensure sufficient cash for daily operations"],
        ["4", "Investment Management",      "Invest excess cash appropriately"],
        ["5", "Risk Management",            "Manage exposure to interest rate and FX movements"],
        ["6", "Management Advice",          "Brief management on market conditions"],
        ["7", "Credit Rating Relations",    "Liaise with rating agencies when issuing debt"],
        ["8", "Bank Relationships",         "Manage the company's banking relationships"],
        ["9", "Fund Raising",               "Maintain investor relationships for capital raising"],
        ["10","Credit Granting",            "Approve credit extended to customers"],
    ]
    fn_widths = [1.0 * cm, 5.5 * cm, CONTENT_W - 6.5 * cm]
    story.append(std_table(fn_headers, fn_data, fn_widths, styles))

    # ── SECTION 4 ─────────────────────────────────────────────────────────
    story.extend(section_heading("Section 4 — Three Levels of Treasury Work", styles))

    lv_headers = ["Level", "Timeframe", "Key Activities"]
    lv_data = [
        ["Strategic",    "Long-term, board-level",         "Capital structure, dividend and retention policies, capital raising"],
        ["Tactical",     "Medium-term, management",        "Managing cash investments, deciding whether/how to hedge"],
        ["Operational",  "Day-to-day execution",           "Transferring cash between accounts, placing surplus cash, dealing with banks"],
    ]
    col1 = 3.0 * cm; col2 = 4.5 * cm; col3 = CONTENT_W - col1 - col2
    story.append(std_table(lv_headers, lv_data, [col1, col2, col3], styles))

    # ── SECTION 5 ─────────────────────────────────────────────────────────
    story.extend(section_heading("Section 5 — Cost Centre vs Profit Centre", styles))

    cp_headers = ["",                "Cost Centre",                       "Profit Centre"]
    cp_data = [
        ["Goal",          "Support operations within budget",  "Generate income through trading/hedging"],
        ["Accountability","Measured by cost control",          "Measured by profit generated"],
        ["Main risk",     "Being undervalued",                 "Speculation / rogue trading"],
        ["Common in",     "Most organisations",                "Large corporates and banks"],
    ]
    cw = CONTENT_W / 3
    story.append(std_table(cp_headers, cp_data, [cw, cw, cw], styles))
    story.append(gap(8))
    story.append(KeepTogether(warning_box(
        "WARNING — Nick Leeson at Barings Bank",
        "Nick Leeson was a rogue trader who brought down Barings Bank — a 200-year-old institution — in "
        "1995. Operating as a profit centre with no segregation of duties, he was able to trade AND "
        "confirm his own trades, hiding £800 million in losses until the bank collapsed. This is the "
        "definitive case study for why treasury controls matter.",
        styles)))

    # ── SECTION 6 ─────────────────────────────────────────────────────────
    story.extend(section_heading("Section 6 — The 6 Treasury Controls", styles))
    controls = [
        ("Segregation of Duties",    "Front office (trading) separated from back office (settlement)"),
        ("Delegation of Authority",  "Clear limits on who can authorise what"),
        ("Transaction Limits",       "Caps on individual transaction sizes"),
        ("Approvals",                "All trades approved by senior manager; separate person reconciles"),
        ("Internal Audits",          "Regular checks vs company policy"),
        ("Automation (STP)",         "Straight-Through Processing automates routine transactions"),
    ]
    for i, (ctrl, desc) in enumerate(controls, 1):
        story.append(Paragraph(f"<b>{i}. {ctrl}</b> — {desc}", styles["numbered"]))
    story.append(gap(4))

    # ── SECTION 7 ─────────────────────────────────────────────────────────
    story.extend(section_heading("Section 7 — Centralised vs Decentralised Treasury", styles))

    cd_headers = ["",                  "Centralised",                       "Decentralised",                          "Hybrid"]
    cd_data = [
        ["Control",       "Stronger, uniform controls",        "Varies by region",                       "Centrally set, locally applied"],
        ["Local expertise","Limited",                          "High — local banking/language/customs",  "Local input feeds central TMS"],
        ["Cost efficiency","High — economies of scale",        "Lower — duplication of effort",          "Moderate"],
        ["Best for",      "MNCs, tax-efficient structures",    "Regional/local businesses",              "Large MNCs with diverse markets"],
    ]
    cw4 = CONTENT_W / 4
    story.append(std_table(cd_headers, cd_data, [cw4, cw4, cw4, cw4], styles))

    # ── SECTION 8 ─────────────────────────────────────────────────────────
    story.extend(section_heading("Section 8 — Key Terms", styles))

    kt_headers = ["Term", "Definition"]
    kt_data = [
        ["Treasury Department",    "Financial centre of an organisation"],
        ["Liquidity",              "Having enough cash to meet obligations when due"],
        ["Cost Centre",            "Unit measured by costs, not expected to generate profit"],
        ["Profit Centre",          "Unit expected to generate income"],
        ["Segregation of Duties",  "Separating incompatible tasks (trading vs settlement)"],
        ["STP",                    "Straight-Through Processing"],
        ["Front Office",           "The dealing/trading function"],
        ["Back Office",            "Settlement, confirmation, reconciliation"],
        ["Centralised Treasury",   "All functions managed from one location"],
        ["Delegation of Authority","Formal assignment of decision-making power"],
    ]
    story.append(std_table(kt_headers, kt_data,
                           [5.5 * cm, CONTENT_W - 5.5 * cm], styles))

    # ── SECTION 9 ─────────────────────────────────────────────────────────
    story.extend(section_heading("Section 9 — What You Should Now Be Able To Do", styles))
    los = [
        "Define treasury management and explain the role of the treasury department",
        "Identify the 3 key decisions of the finance function",
        "List and explain the 10 main functions of a treasury department",
        "Distinguish between strategic, tactical, and operational treasury tasks",
        "Compare cost centre and profit centre approaches",
        "Explain the 6 treasury controls and why segregation of duties is critical",
        "Compare centralised, decentralised, and hybrid treasury structures",
    ]
    for i, lo in enumerate(los, 1):
        story.append(Paragraph(f"{i}.  {lo}", styles["lo_item"]))

    # ── SEE ALSO box ───────────────────────────────────────────────────────
    story.append(gap(12))
    story.append(KeepTogether(see_also_box([
        "→  1.2  Working Capital & Liquidity Management",
        "→  1.3  Inventory Management, EOQ & Creditor Management",
        "→  2.1  Cash Management",
        "",
        "Full course: booklesss20.slack.com  |  Join before April 12 — K550/month founding rate",
    ], styles)))

    doc.build(story)
    print(f"Saved: {OUT_FILE}")


# ── NextPageTemplate flowable ──────────────────────────────────────────────
from reportlab.platypus import NextPageTemplate

if __name__ == "__main__":
    build_pdf()
