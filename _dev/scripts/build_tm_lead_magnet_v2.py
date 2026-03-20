"""
Booklesss Lead Magnet — Treasury Management v2
Design standard: taste/minimalist/high-end translated for print
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
from reportlab.platypus.flowables import Flowable
import os

# ─────────────────────────────────────────────
#  FONTS
# ─────────────────────────────────────────────
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Calibri",        F + r"\calibri.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Bold",   F + r"\calibrib.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Italic", F + r"\calibrii.ttf"))
pdfmetrics.registerFontFamily(
    "Calibri", normal="Calibri", bold="Calibri-Bold",
    italic="Calibri-Italic", boldItalic="Calibri-Bold")
pdfmetrics.registerFont(TTFont("ArialBlack", F + r"\ariblk.ttf"))

# ─────────────────────────────────────────────
#  COLOUR SYSTEM  (taste standard for print)
# ─────────────────────────────────────────────
BG_CREAM   = colors.HexColor("#F5F0E8")   # page background
C_INK      = colors.HexColor("#18181B")   # primary text — zinc-950
C_STEEL    = colors.HexColor("#71717A")   # secondary text / subheadings
C_SLATE    = colors.HexColor("#94A3B8")   # meta / captions
C_AMBER    = colors.HexColor("#C17E3A")   # single accent
C_NAVY     = colors.HexColor("#1B2A4A")   # cover + CTA page only
C_TEAL     = colors.HexColor("#0E6B6B")   # secondary accent
C_WHITE    = colors.white

# Muted pastel callout backgrounds
BG_WARNING = colors.HexColor("#FBF3DB")   # pale yellow
BG_INFO    = colors.HexColor("#E1F3FE")   # pale blue
BG_SUCCESS = colors.HexColor("#EDF3EC")   # pale green
BG_EXAMPLE = colors.HexColor("#EDE8DF")   # warm cream (deeper than page)

C_WARN_TEXT = colors.HexColor("#956400")
C_INFO_TEXT = colors.HexColor("#1F6C9F")
C_SUCC_TEXT = colors.HexColor("#346538")

W, H = A4  # 595.27 x 841.89 pts

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def styles():
    return {
        # Cover
        "cover_eyebrow": ParagraphStyle("cover_eyebrow",
            fontName="Calibri-Bold", fontSize=7, textColor=C_AMBER,
            leading=11, spaceAfter=6, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="ArialBlack", fontSize=30, textColor=C_WHITE,
            leading=34, spaceAfter=10, alignment=TA_LEFT),
        "cover_subtitle": ParagraphStyle("cover_subtitle",
            fontName="Calibri", fontSize=11, textColor=colors.HexColor("#C8BFA8"),
            leading=17, spaceAfter=4, alignment=TA_LEFT),
        "cover_tag": ParagraphStyle("cover_tag",
            fontName="Calibri-Bold", fontSize=8, textColor=C_AMBER,
            leading=12, spaceAfter=0, alignment=TA_LEFT),
        # Body page
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Calibri-Bold", fontSize=7, textColor=C_AMBER,
            leading=10, spaceBefore=18, spaceAfter=3, alignment=TA_LEFT),
        "h2": ParagraphStyle("h2",
            fontName="Calibri-Bold", fontSize=16, textColor=C_INK,
            leading=19, spaceBefore=2, spaceAfter=8, alignment=TA_LEFT),
        "h3": ParagraphStyle("h3",
            fontName="Calibri-Bold", fontSize=11, textColor=C_STEEL,
            leading=15, spaceBefore=10, spaceAfter=4, alignment=TA_LEFT),
        "body": ParagraphStyle("body",
            fontName="Calibri", fontSize=10.5, textColor=C_INK,
            leading=17, spaceBefore=0, spaceAfter=5, alignment=TA_LEFT),
        "formula": ParagraphStyle("formula",
            fontName="Calibri-Bold", fontSize=10.5, textColor=C_INK,
            leading=16, spaceBefore=4, spaceAfter=4, alignment=TA_LEFT),
        "caption": ParagraphStyle("caption",
            fontName="Calibri-Italic", fontSize=8, textColor=C_SLATE,
            leading=11, spaceBefore=2, spaceAfter=2, alignment=TA_LEFT),
        "warn_body": ParagraphStyle("warn_body",
            fontName="Calibri", fontSize=10, textColor=C_WARN_TEXT,
            leading=15, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        "info_body": ParagraphStyle("info_body",
            fontName="Calibri", fontSize=10, textColor=C_INFO_TEXT,
            leading=15, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        "succ_body": ParagraphStyle("succ_body",
            fontName="Calibri", fontSize=10, textColor=C_SUCC_TEXT,
            leading=15, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        "example_body": ParagraphStyle("example_body",
            fontName="Calibri", fontSize=10.5, textColor=C_INK,
            leading=16, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        "example_bold": ParagraphStyle("example_bold",
            fontName="Calibri-Bold", fontSize=10.5, textColor=C_INK,
            leading=16, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        # CTA page
        "cta_eyebrow": ParagraphStyle("cta_eyebrow",
            fontName="Calibri-Bold", fontSize=7, textColor=C_AMBER,
            leading=10, spaceBefore=0, spaceAfter=4, alignment=TA_LEFT),
        "cta_h1": ParagraphStyle("cta_h1",
            fontName="ArialBlack", fontSize=22, textColor=C_WHITE,
            leading=27, spaceBefore=0, spaceAfter=10, alignment=TA_LEFT),
        "cta_body": ParagraphStyle("cta_body",
            fontName="Calibri", fontSize=10.5, textColor=colors.HexColor("#C8BFA8"),
            leading=17, spaceBefore=0, spaceAfter=5, alignment=TA_LEFT),
        "cta_bullet": ParagraphStyle("cta_bullet",
            fontName="Calibri", fontSize=10.5, textColor=C_WHITE,
            leading=17, spaceBefore=3, spaceAfter=3,
            leftIndent=12, firstLineIndent=-12, alignment=TA_LEFT),
        "cta_offer_label": ParagraphStyle("cta_offer_label",
            fontName="Calibri-Bold", fontSize=7, textColor=C_AMBER,
            leading=10, spaceBefore=0, spaceAfter=3, alignment=TA_LEFT),
        "cta_offer_price": ParagraphStyle("cta_offer_price",
            fontName="ArialBlack", fontSize=24, textColor=C_WHITE,
            leading=28, spaceBefore=0, spaceAfter=4, alignment=TA_LEFT),
        "cta_offer_sub": ParagraphStyle("cta_offer_sub",
            fontName="Calibri", fontSize=9, textColor=colors.HexColor("#C8BFA8"),
            leading=13, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        "cta_link": ParagraphStyle("cta_link",
            fontName="Calibri-Bold", fontSize=10.5, textColor=C_AMBER,
            leading=15, spaceBefore=8, spaceAfter=0, alignment=TA_LEFT),
    }


# ─────────────────────────────────────────────
#  CALLOUT BOX HELPER
# ─────────────────────────────────────────────
def callout_box(content_rows, bg_color, border_color, style, pad=10):
    """Single-column table acting as a callout box."""
    tbl = Table([[Paragraph(row, style)] for row in content_rows],
                colWidths=[W - 4*cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), bg_color),
        ("BOX",         (0,0), (-1,-1), 0.5, border_color),
        ("TOPPADDING",  (0,0), (-1,-1), pad),
        ("BOTTOMPADDING",(0,0),(-1,-1), pad),
        ("LEFTPADDING", (0,0), (-1,-1), pad),
        ("RIGHTPADDING",(0,0), (-1,-1), pad),
        ("ROWBACKGROUNDS",(0,0),(-1,-1),[bg_color]),
    ]))
    return tbl


def worked_example_box(rows, style_bold, style_normal):
    """Cream box with amber left bar — for worked examples."""
    data = []
    for r in rows:
        is_bold = r.startswith("**") and r.endswith("**")
        text = r.strip("*") if is_bold else r
        s = style_bold if is_bold else style_normal
        data.append([Paragraph(text, s)])
    tbl = Table(data, colWidths=[W - 4*cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), BG_EXAMPLE),
        ("LINEBEFORE",  (0,0), (0,-1),  2, C_AMBER),
        ("TOPPADDING",  (0,0), (-1,-1), 8),
        ("BOTTOMPADDING",(0,0),(-1,-1), 8),
        ("LEFTPADDING", (0,0), (-1,-1), 12),
        ("RIGHTPADDING",(0,0), (-1,-1), 10),
    ]))
    return tbl


# ─────────────────────────────────────────────
#  PAGE TEMPLATES
# ─────────────────────────────────────────────
MARGIN_X = 2*cm
MARGIN_Y = 1.8*cm
FOOTER_H = 28

def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_NAVY)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # Amber accent bar — bottom quarter
    canvas.setFillColor(C_AMBER)
    canvas.rect(0, 0, W, 6, fill=1, stroke=0)
    # Subtle texture: light teal rectangle top-right
    canvas.setFillColor(colors.HexColor("#0E3A3A"))
    canvas.rect(W*0.6, H*0.55, W*0.4, H*0.45, fill=1, stroke=0)
    canvas.restoreState()


def body_bg(canvas, doc):
    canvas.saveState()
    # Cream background
    canvas.setFillColor(BG_CREAM)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # Footer rule — 0.5pt amber hairline
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_X, FOOTER_H + 2, W - MARGIN_X, FOOTER_H + 2)
    # Footer text
    canvas.setFillColor(C_STEEL)
    canvas.setFont("Calibri", 7.5)
    canvas.drawString(MARGIN_X, FOOTER_H - 8, "Booklesss  |  booklesss.framer.ai")
    canvas.drawRightString(W - MARGIN_X, FOOTER_H - 8, f"Page {doc.page}")
    canvas.drawCentredString(W/2, FOOTER_H - 8, "BBF4302 — Treasury Management")
    # Header rule (pages 2+)
    if doc.page > 1:
        canvas.setStrokeColor(C_AMBER)
        canvas.setLineWidth(0.5)
        canvas.line(MARGIN_X, H - MARGIN_Y + 4, W - MARGIN_X, H - MARGIN_Y + 4)
        canvas.setFillColor(C_SLATE)
        canvas.setFont("Calibri", 7.5)
        canvas.drawString(MARGIN_X, H - MARGIN_Y + 8, "3 Exam Concepts — Treasury Management")
        canvas.drawRightString(W - MARGIN_X, H - MARGIN_Y + 8, "v2  ·  2026")
    canvas.restoreState()


def cta_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_NAVY)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(C_AMBER)
    canvas.rect(0, 0, W, 6, fill=1, stroke=0)
    canvas.restoreState()


# ─────────────────────────────────────────────
#  DOCUMENT BUILD
# ─────────────────────────────────────────────
OUT = r"C:\Users\deeky\OneDrive\Desktop\Booklesss\marketing\lead-magnets\tm-lead-magnet_v2.pdf"

doc = BaseDocTemplate(
    OUT, pagesize=A4,
    leftMargin=MARGIN_X, rightMargin=MARGIN_X,
    topMargin=MARGIN_Y + 16, bottomMargin=FOOTER_H + 16,
    title="3 Treasury Management Concepts — Booklesss",
    author="Booklesss"
)

cover_frame = Frame(MARGIN_X, FOOTER_H + 16, W - 2*MARGIN_X, H - MARGIN_Y - FOOTER_H - 32,
                    id="cover")
body_frame  = Frame(MARGIN_X, FOOTER_H + 16, W - 2*MARGIN_X, H - 2*MARGIN_Y - FOOTER_H - 16,
                    id="body")
cta_frame   = Frame(MARGIN_X, FOOTER_H + 16, W - 2*MARGIN_X, H - MARGIN_Y - FOOTER_H - 32,
                    id="cta")

doc.addPageTemplates([
    PageTemplate(id="Cover",  frames=[cover_frame], onPage=cover_bg),
    PageTemplate(id="Body",   frames=[body_frame],  onPage=body_bg),
    PageTemplate(id="CTA",    frames=[cta_frame],   onPage=cta_bg),
])

S = styles()
story = []

# ─────────────────────────────────────────────
#  PAGE 1 — COVER
# ─────────────────────────────────────────────
story.append(NextPageTemplate("Cover"))
story.append(Spacer(1, 2.8*cm))
story.append(Paragraph("FREE GUIDE  ·  BBF4302  ·  ZCAS UNIVERSITY", S["cover_eyebrow"]))
story.append(Spacer(1, 4))
story.append(Paragraph("3 Treasury Management\nConcepts That Will\nShow Up in Your Exam", S["cover_title"]))
story.append(Spacer(1, 14))
story.append(HRFlowable(width="40%", thickness=0.5, color=C_AMBER, spaceAfter=14))
story.append(Paragraph("Written for ZCAS students. Worked examples in Kwacha.", S["cover_subtitle"]))
story.append(Spacer(1, 6))
story.append(Paragraph("FOUNDING MEMBER RATE  —  K550/MONTH  —  CLOSES APRIL 18", S["cover_tag"]))

# ─────────────────────────────────────────────
#  PAGE 2 — CONCEPT 01: CCC
# ─────────────────────────────────────────────
story.append(NextPageTemplate("Body"))
story.append(PageBreak())

story.append(Paragraph("CONCEPT  01  OF  03", S["eyebrow"]))
story.append(Paragraph("The Cash Conversion Cycle", S["h2"]))
story.append(Paragraph(
    "The CCC measures how long money is locked up before a business gets paid back. "
    "It pulls three ratios into one number that tells you how efficiently a company manages its cash.",
    S["body"]))

story.append(Paragraph("The Formula", S["h3"]))
story.append(worked_example_box([
    "**CCC  =  Days Inventory  +  Days Receivables  −  Days Payables**",
    "Lower = better. The less time cash is tied up, the less a business needs to borrow.",
], S["example_bold"], S["example_body"]))

story.append(Spacer(1, 10))
story.append(Paragraph("Zambeef — Worked Example", S["h3"]))

# Table — hairline borders, muted
ccc_data = [
    ["Item", "Figure", "Calculation", "Days"],
    ["Inventory", "K2,600", "K2,600 ÷ K9,200 × 365", "103 days"],
    ["Receivables", "K1,700", "K1,700 ÷ K15,000 × 365", "41 days"],
    ["Payables", "K1,600", "K1,600 ÷ K9,200 × 365", "63 days"],
]
ccc_table = Table(ccc_data, colWidths=[3.2*cm, 2.4*cm, 7.2*cm, 2.4*cm])
ccc_table.setStyle(TableStyle([
    ("FONTNAME",    (0,0), (-1,0),  "Calibri-Bold"),
    ("FONTNAME",    (0,1), (-1,-1), "Calibri"),
    ("FONTSIZE",    (0,0), (-1,-1), 9.5),
    ("TEXTCOLOR",   (0,0), (-1,0),  C_WHITE),
    ("BACKGROUND",  (0,0), (-1,0),  C_INK),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[BG_CREAM, BG_EXAMPLE]),
    ("TEXTCOLOR",   (0,1), (-1,-1), C_INK),
    ("GRID",        (0,0), (-1,-1), 0.4, colors.HexColor("#D0CAC0")),
    ("TOPPADDING",  (0,0), (-1,-1), 5),
    ("BOTTOMPADDING",(0,0),(-1,-1), 5),
    ("LEFTPADDING", (0,0), (-1,-1), 7),
    ("RIGHTPADDING",(0,0),(-1,-1),  7),
    ("ALIGN",       (1,0), (-1,-1), "CENTER"),
]))
story.append(ccc_table)
story.append(Spacer(1, 8))

story.append(callout_box(
    ["CCC  =  103  +  41  −  63  =  81 days",
     "Zambeef waits 81 days between paying for inputs and collecting cash. "
     "Cutting this number is a core treasury objective."],
    BG_INFO, C_INFO_TEXT, S["info_body"]
))

# ─────────────────────────────────────────────
#  PAGE 3 — CONCEPT 02 + 03
# ─────────────────────────────────────────────
story.append(PageBreak())

story.append(Paragraph("CONCEPT  02  OF  03", S["eyebrow"]))
story.append(Paragraph("The Cost of Ignoring a Cash Discount", S["h2"]))
story.append(Paragraph(
    "A supplier offers 2/10 net 30 — pay within 10 days, take 2% off. "
    "Or pay the full amount in 30 days. Sounds minor. Run the numbers and it becomes a 37% loan.",
    S["body"]))

story.append(Paragraph("The Formula", S["h3"]))
story.append(worked_example_box([
    "**Discount Cost  =  [ D ÷ (100 − D) ]  ×  [ 365 ÷ (N − T) ]**",
    "D = discount %   |   N = net days   |   T = discount period days",
], S["example_bold"], S["example_body"]))

story.append(Spacer(1, 8))
story.append(Paragraph("Example: 2/10 net 30", S["h3"]))
story.append(worked_example_box([
    "[ 2 ÷ 98 ]  ×  [ 365 ÷ 20 ]  =  37.2% annualised cost",
    "If your business borrows at 8%, always take the discount. "
    "Ignoring it costs the equivalent of a 37% overdraft.",
], S["example_bold"], S["example_body"]))

story.append(Spacer(1, 16))
story.append(HRFlowable(width="100%", thickness=0.5,
             color=colors.HexColor("#D0CAC0"), spaceAfter=16))

story.append(Paragraph("CONCEPT  03  OF  03", S["eyebrow"]))
story.append(Paragraph("Segregation of Duties", S["h2"]))
story.append(Paragraph(
    "The most tested treasury control in past papers. "
    "The rule: whoever authorises a transaction cannot be the same person who records it.",
    S["body"]))

story.append(Paragraph("Why it matters — Barings Bank, 1995", S["h3"]))
story.append(callout_box(
    ["Nick Leeson traded and confirmed his own positions with no oversight. "
     "By the time anyone noticed, he had hidden £800 million in losses. "
     "Barings Bank — 233 years old — collapsed in weeks.",
     " ",
     "One control missing. One bank gone."],
    BG_WARNING, C_WARN_TEXT, S["warn_body"]
))

story.append(Spacer(1, 10))
story.append(callout_box(
    ["In the exam: you get a scenario and you identify what's wrong. "
     "If one person has too much access — that is your answer. Every time."],
    BG_SUCCESS, C_SUCC_TEXT, S["succ_body"]
))

# ─────────────────────────────────────────────
#  PAGE 4 — CTA
# ─────────────────────────────────────────────
story.append(NextPageTemplate("CTA"))
story.append(PageBreak())

story.append(Spacer(1, 1.8*cm))
story.append(Paragraph("THESE 3 CONCEPTS ARE FROM LESSON 1 OF 11", S["cta_eyebrow"]))
story.append(Paragraph("There are 8 more lessons\nwhere these came from.", S["cta_h1"]))
story.append(Spacer(1, 6))
story.append(HRFlowable(width="35%", thickness=0.5, color=C_AMBER, spaceAfter=12))

story.append(Paragraph("What's inside Booklesss:", S["cta_body"]))
bullets = [
    "All 11 Treasury Management lessons — notes, quizzes, past paper breakdowns",
    "Weekly quiz with a live leaderboard",
    "Study channels per topic — ask questions, get answers",
    "Zambian context throughout — ZMW, ZCAS past papers, local companies",
]
for b in bullets:
    story.append(Paragraph(f"—  {b}", S["cta_bullet"]))

story.append(Spacer(1, 18))

# Offer box
offer_data = [[
    Paragraph("FOUNDING MEMBER RATE", S["cta_offer_label"]),
], [
    Paragraph("K550 / month", S["cta_offer_price"]),
], [
    Paragraph("Locked in for life  ·  Closes April 18, 2026  ·  After that: K800/month", S["cta_offer_sub"]),
]]
offer_box = Table(offer_data, colWidths=[W - 4*cm])
offer_box.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,-1), colors.HexColor("#0E2A3F")),
    ("BOX",           (0,0), (-1,-1), 1, C_AMBER),
    ("TOPPADDING",    (0,0), (-1,-1), 10),
    ("BOTTOMPADDING", (0,0), (-1,-1), 10),
    ("LEFTPADDING",   (0,0), (-1,-1), 14),
    ("RIGHTPADDING",  (0,0), (-1,-1), 14),
]))
story.append(offer_box)

story.append(Spacer(1, 16))
story.append(Paragraph("Join at  booklesss20.slack.com", S["cta_link"]))
story.append(Paragraph("Questions? Find us at booklesss.framer.ai", S["cta_body"]))

# ─────────────────────────────────────────────
#  BUILD
# ─────────────────────────────────────────────
doc.build(story)
print(f"Saved: {OUT}")
