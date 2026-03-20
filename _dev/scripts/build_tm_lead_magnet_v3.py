"""
Booklesss Lead Magnet — Treasury Management v3
Style: Swiss editorial. Dark covers. White body. Emerald accent.
Georgia serif for display. Trebuchet MS for body.
Completely different personality from v2.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, KeepTogether, HRFlowable, PageBreak, NextPageTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ─────────────────────────────────────────────
#  FONTS  —  Georgia (serif display) + Trebuchet MS (body)
# ─────────────────────────────────────────────
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Georgia",       F + r"\georgia.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold",  F + r"\georgiab.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Italic",F + r"\georgiai.ttf"))
pdfmetrics.registerFontFamily(
    "Georgia", normal="Georgia", bold="Georgia-Bold", italic="Georgia-Italic")

pdfmetrics.registerFont(TTFont("Trebuchet",        F + r"\trebuc.ttf"))
pdfmetrics.registerFont(TTFont("Trebuchet-Bold",   F + r"\trebucbd.ttf"))
pdfmetrics.registerFont(TTFont("Trebuchet-Italic", F + r"\trebucit.ttf"))
pdfmetrics.registerFontFamily(
    "Trebuchet", normal="Trebuchet", bold="Trebuchet-Bold", italic="Trebuchet-Italic")

# ─────────────────────────────────────────────
#  COLOUR SYSTEM  —  Dark + White + Emerald
# ─────────────────────────────────────────────
C_DARK      = colors.HexColor("#0D1117")   # near-black cover/CTA bg
C_INK       = colors.HexColor("#111827")   # primary text (gray-900)
C_STEEL     = colors.HexColor("#6B7280")   # secondary text (gray-500)
C_MIST      = colors.HexColor("#9CA3AF")   # meta / captions (gray-400)
C_RULE      = colors.HexColor("#E5E7EB")   # divider lines (gray-200)
C_GHOST     = colors.HexColor("#F9FAFB")   # subtle backgrounds (gray-50)
C_GREEN     = colors.HexColor("#10B981")   # single accent — emerald
C_GREEN_DK  = colors.HexColor("#065F46")   # dark emerald (text on pale green)
C_WHITE     = colors.white

# Callout backgrounds
BG_WARN     = colors.HexColor("#FEF3C7")   # amber-50
C_WARN_TXT  = colors.HexColor("#92400E")   # amber-800
BG_INFO     = colors.HexColor("#EFF6FF")   # blue-50
C_INFO_TXT  = colors.HexColor("#1D4ED8")   # blue-700
BG_NOTE     = colors.HexColor("#ECFDF5")   # emerald-50
C_NOTE_TXT  = colors.HexColor("#065F46")   # emerald-800

W, H = A4
MARGIN_X  = 2.2*cm
MARGIN_Y  = 2*cm
FOOTER_H  = 28

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def S():
    return {
        # ── Cover ──
        "cover_tag": ParagraphStyle("cover_tag",
            fontName="Trebuchet-Bold", fontSize=7.5, textColor=C_GREEN,
            leading=11, spaceAfter=10, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Georgia-Bold", fontSize=33, textColor=C_WHITE,
            leading=38, spaceAfter=14, alignment=TA_LEFT),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Trebuchet", fontSize=10.5, textColor=C_MIST,
            leading=16, spaceAfter=5, alignment=TA_LEFT),
        "cover_deadline": ParagraphStyle("cover_deadline",
            fontName="Trebuchet-Bold", fontSize=8.5, textColor=C_GREEN,
            leading=13, spaceAfter=0, alignment=TA_LEFT),

        # ── Body ──
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Trebuchet-Bold", fontSize=7, textColor=C_GREEN,
            leading=10, spaceBefore=20, spaceAfter=3, alignment=TA_LEFT),
        "h2": ParagraphStyle("h2",
            fontName="Georgia-Bold", fontSize=19, textColor=C_INK,
            leading=24, spaceBefore=2, spaceAfter=8, alignment=TA_LEFT),
        "h3": ParagraphStyle("h3",
            fontName="Trebuchet-Bold", fontSize=10.5, textColor=C_STEEL,
            leading=15, spaceBefore=12, spaceAfter=4, alignment=TA_LEFT),
        "body": ParagraphStyle("body",
            fontName="Trebuchet", fontSize=10.5, textColor=C_INK,
            leading=17, spaceBefore=0, spaceAfter=5, alignment=TA_LEFT),
        "body_bold": ParagraphStyle("body_bold",
            fontName="Trebuchet-Bold", fontSize=10.5, textColor=C_INK,
            leading=17, spaceBefore=0, spaceAfter=5, alignment=TA_LEFT),
        "formula": ParagraphStyle("formula",
            fontName="Georgia-Bold", fontSize=11.5, textColor=C_INK,
            leading=17, spaceBefore=4, spaceAfter=4, alignment=TA_LEFT),
        "formula_note": ParagraphStyle("formula_note",
            fontName="Trebuchet-Italic", fontSize=9, textColor=C_STEEL,
            leading=13, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        "caption": ParagraphStyle("caption",
            fontName="Trebuchet-Italic", fontSize=8.5, textColor=C_MIST,
            leading=12, spaceBefore=2, spaceAfter=2, alignment=TA_LEFT),
        "warn_body": ParagraphStyle("warn_body",
            fontName="Trebuchet", fontSize=10, textColor=C_WARN_TXT,
            leading=15, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        "info_body": ParagraphStyle("info_body",
            fontName="Trebuchet", fontSize=10, textColor=C_INFO_TXT,
            leading=15, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        "note_body": ParagraphStyle("note_body",
            fontName="Trebuchet", fontSize=10, textColor=C_NOTE_TXT,
            leading=15, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        "example_body": ParagraphStyle("example_body",
            fontName="Trebuchet", fontSize=10.5, textColor=C_INK,
            leading=16, spaceBefore=0, spaceAfter=3, alignment=TA_LEFT),
        "example_bold": ParagraphStyle("example_bold",
            fontName="Georgia-Bold", fontSize=11, textColor=C_INK,
            leading=16, spaceBefore=0, spaceAfter=3, alignment=TA_LEFT),
        "result_line": ParagraphStyle("result_line",
            fontName="Georgia-Bold", fontSize=12, textColor=C_GREEN_DK,
            leading=17, spaceBefore=4, spaceAfter=0, alignment=TA_LEFT),

        # ── CTA ──
        "cta_tag": ParagraphStyle("cta_tag",
            fontName="Trebuchet-Bold", fontSize=7.5, textColor=C_GREEN,
            leading=11, spaceBefore=0, spaceAfter=6, alignment=TA_LEFT),
        "cta_h1": ParagraphStyle("cta_h1",
            fontName="Georgia-Bold", fontSize=26, textColor=C_WHITE,
            leading=32, spaceBefore=0, spaceAfter=10, alignment=TA_LEFT),
        "cta_body": ParagraphStyle("cta_body",
            fontName="Trebuchet", fontSize=10.5, textColor=C_MIST,
            leading=17, spaceBefore=0, spaceAfter=5, alignment=TA_LEFT),
        "cta_bullet": ParagraphStyle("cta_bullet",
            fontName="Trebuchet", fontSize=10.5, textColor=C_WHITE,
            leading=17, spaceBefore=4, spaceAfter=4,
            leftIndent=14, firstLineIndent=-14, alignment=TA_LEFT),
        "offer_label": ParagraphStyle("offer_label",
            fontName="Trebuchet-Bold", fontSize=7, textColor=C_GREEN,
            leading=10, spaceBefore=0, spaceAfter=4, alignment=TA_LEFT),
        "offer_price": ParagraphStyle("offer_price",
            fontName="Georgia-Bold", fontSize=28, textColor=C_WHITE,
            leading=33, spaceBefore=0, spaceAfter=4, alignment=TA_LEFT),
        "offer_sub": ParagraphStyle("offer_sub",
            fontName="Trebuchet", fontSize=9, textColor=C_MIST,
            leading=13, spaceBefore=0, spaceAfter=0, alignment=TA_LEFT),
        "cta_link": ParagraphStyle("cta_link",
            fontName="Trebuchet-Bold", fontSize=11, textColor=C_GREEN,
            leading=16, spaceBefore=10, spaceAfter=4, alignment=TA_LEFT),
    }


# ─────────────────────────────────────────────
#  CALLOUT HELPERS
# ─────────────────────────────────────────────
def left_bar_box(rows_and_styles, bar_color=C_GREEN, bg=C_GHOST):
    """Box with a 2pt coloured left bar — for worked examples."""
    data = [[Paragraph(text, style)] for text, style in rows_and_styles]
    t = Table(data, colWidths=[W - 2*MARGIN_X])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), bg),
        ("LINEBEFORE",    (0,0), (0,-1),  2.5, bar_color),
        ("TOPPADDING",    (0,0), (-1,-1), 9),
        ("BOTTOMPADDING", (0,0), (-1,-1), 9),
        ("LEFTPADDING",   (0,0), (-1,-1), 14),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
    ]))
    return t


def tinted_callout(rows_and_styles, bg, border_color):
    """Tinted callout box — warnings, notes, info."""
    data = [[Paragraph(text, style)] for text, style in rows_and_styles]
    t = Table(data, colWidths=[W - 2*MARGIN_X])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), bg),
        ("BOX",           (0,0), (-1,-1), 0.5, border_color),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
    ]))
    return t


# ─────────────────────────────────────────────
#  PAGE CALLBACKS
# ─────────────────────────────────────────────
def cover_bg(canvas, doc):
    canvas.saveState()
    # Full dark background
    canvas.setFillColor(C_DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # Emerald left accent strip
    canvas.setFillColor(C_GREEN)
    canvas.rect(0, 0, 4, H, fill=1, stroke=0)
    # Subtle grid texture — light horizontal lines
    canvas.setStrokeColor(colors.HexColor("#1F2937"))
    canvas.setLineWidth(0.3)
    for y in range(40, int(H), 40):
        canvas.line(0, y, W, y)
    canvas.restoreState()


def body_bg(canvas, doc):
    canvas.saveState()
    # White background
    canvas.setFillColor(C_WHITE)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)

    # Large ghost section number — decorative
    pg = doc.page - 1  # page 2 = concept 1, etc.
    if 1 <= pg <= 3:
        num = str(pg).zfill(2)
        canvas.saveState()
        canvas.setFillColor(colors.HexColor("#F3F4F6"))
        canvas.setFont("Georgia-Bold", 160)
        canvas.drawRightString(W - 1.4*cm, H - 5.5*cm, num)
        canvas.restoreState()

    # Footer hairline + text
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_X, FOOTER_H + 4, W - MARGIN_X, FOOTER_H + 4)
    canvas.setFillColor(C_STEEL)
    canvas.setFont("Trebuchet", 7.5)
    canvas.drawString(MARGIN_X, FOOTER_H - 7, "Booklesss  |  booklesss.framer.ai")
    canvas.drawRightString(W - MARGIN_X, FOOTER_H - 7, f"{doc.page}")
    canvas.drawCentredString(W/2, FOOTER_H - 7, "BBF4302 — Treasury Management")

    # Header hairline (pages after cover)
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_X, H - MARGIN_Y + 6, W - MARGIN_X, H - MARGIN_Y + 6)
    canvas.setFillColor(C_MIST)
    canvas.setFont("Trebuchet", 7.5)
    canvas.drawString(MARGIN_X, H - MARGIN_Y + 10, "3 Exam Concepts — Treasury Management")
    canvas.drawRightString(W - MARGIN_X, H - MARGIN_Y + 10, "Booklesss  ·  2026")
    canvas.restoreState()


def cta_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    # Emerald left strip
    canvas.setFillColor(C_GREEN)
    canvas.rect(0, 0, 4, H, fill=1, stroke=0)
    # Ghost grid
    canvas.setStrokeColor(colors.HexColor("#1F2937"))
    canvas.setLineWidth(0.3)
    for y in range(40, int(H), 40):
        canvas.line(0, y, W, y)
    canvas.restoreState()


# ─────────────────────────────────────────────
#  DOCUMENT
# ─────────────────────────────────────────────
OUT = r"C:\Users\deeky\OneDrive\Desktop\Booklesss\marketing\lead-magnets\tm-lead-magnet_v3.pdf"

doc = BaseDocTemplate(
    OUT, pagesize=A4,
    leftMargin=MARGIN_X, rightMargin=MARGIN_X,
    topMargin=MARGIN_Y + 14, bottomMargin=FOOTER_H + 16,
    title="3 Treasury Management Concepts — Booklesss",
    author="Booklesss"
)

cover_frame = Frame(MARGIN_X + 4, FOOTER_H + 16,
                    W - MARGIN_X - 4 - MARGIN_X, H - MARGIN_Y - FOOTER_H - 32, id="cover")
body_frame  = Frame(MARGIN_X, FOOTER_H + 16,
                    W - 2*MARGIN_X, H - 2*MARGIN_Y - FOOTER_H - 14, id="body")
cta_frame   = Frame(MARGIN_X + 4, FOOTER_H + 16,
                    W - MARGIN_X - 4 - MARGIN_X, H - MARGIN_Y - FOOTER_H - 32, id="cta")

doc.addPageTemplates([
    PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_bg),
    PageTemplate(id="Body",  frames=[body_frame],  onPage=body_bg),
    PageTemplate(id="CTA",   frames=[cta_frame],   onPage=cta_bg),
])

s = S()
story = []

# ─────────────────────────────────────────────
#  PAGE 1 — COVER
# ─────────────────────────────────────────────
story.append(NextPageTemplate("Cover"))
story.append(Spacer(1, 3.2*cm))
story.append(Paragraph("FREE GUIDE  ·  BBF4302  ·  ZCAS UNIVERSITY", s["cover_tag"]))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "3 Treasury Management\nConcepts That Will\nShow Up in Your Exam.",
    s["cover_title"]))
story.append(Spacer(1, 16))
story.append(HRFlowable(width="30%", thickness=1, color=C_GREEN, spaceAfter=16))
story.append(Paragraph(
    "Written for ZCAS students. Worked examples in Kwacha.\n"
    "Based on past paper patterns from BBF4302.",
    s["cover_sub"]))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "Founding member rate — K550/month — closes April 18, 2026",
    s["cover_deadline"]))

# ─────────────────────────────────────────────
#  PAGE 2 — CONCEPT 01: CCC
# ─────────────────────────────────────────────
story.append(NextPageTemplate("Body"))
story.append(PageBreak())

story.append(Paragraph("CONCEPT  01  OF  03", s["eyebrow"]))
story.append(Paragraph("The Cash Conversion Cycle", s["h2"]))
story.append(Paragraph(
    "The CCC measures how long money is locked up before a business gets paid back. "
    "One number. Three ratios. It tells you how efficiently a company manages its cash.",
    s["body"]))

story.append(Paragraph("The Formula", s["h3"]))
story.append(left_bar_box([
    ("CCC  =  Days Inventory  +  Days Receivables  −  Days Payables", s["example_bold"]),
    ("Lower = better. Less time cash is tied up means less borrowing needed.", s["example_body"]),
]))

story.append(Paragraph("Zambeef — Worked Example", s["h3"]))

ccc_data = [
    ["Metric", "Figures", "Result"],
    ["Days Inventory",   "K2,600 ÷ K9,200 × 365",  "103 days"],
    ["Days Receivables", "K1,700 ÷ K15,000 × 365", "41 days"],
    ["Days Payables",    "K1,600 ÷ K9,200 × 365",  "63 days"],
    ["CCC", "103 + 41 − 63", "81 days"],
]
col_w = [4.5*cm, 8*cm, 3*cm]
ccc_tbl = Table(ccc_data, colWidths=col_w)
ccc_tbl.setStyle(TableStyle([
    ("FONTNAME",     (0,0), (-1,0),  "Trebuchet-Bold"),
    ("FONTNAME",     (0,1), (-1,-2), "Trebuchet"),
    ("FONTNAME",     (0,-1),(-1,-1), "Georgia-Bold"),
    ("FONTSIZE",     (0,0), (-1,-1), 9.5),
    ("TEXTCOLOR",    (0,0), (-1,0),  C_STEEL),
    ("TEXTCOLOR",    (0,1), (-1,-2), C_INK),
    ("TEXTCOLOR",    (0,-1),(-1,-1), C_GREEN_DK),
    ("LINEBELOW",    (0,0), (-1,0),  0.8, C_INK),
    ("LINEBELOW",    (0,1), (-1,-2), 0.4, C_RULE),
    ("LINEBELOW",    (0,-1),(-1,-1), 0.8, C_GREEN),
    ("BACKGROUND",   (0,-1),(-1,-1), BG_NOTE),
    ("TOPPADDING",   (0,0), (-1,-1), 6),
    ("BOTTOMPADDING",(0,0), (-1,-1), 6),
    ("LEFTPADDING",  (0,0), (-1,-1), 4),
    ("RIGHTPADDING", (0,0), (-1,-1), 4),
    ("ALIGN",        (2,0), (2,-1),  "CENTER"),
]))
story.append(ccc_tbl)
story.append(Spacer(1, 10))
story.append(tinted_callout([
    ("Zambeef waits 81 days between paying for inputs and collecting cash. "
     "Cutting this number is a core treasury management objective.", s["note_body"])
], BG_NOTE, C_GREEN))

# ─────────────────────────────────────────────
#  PAGE 3 — CONCEPT 02 + 03
# ─────────────────────────────────────────────
story.append(PageBreak())

story.append(Paragraph("CONCEPT  02  OF  03", s["eyebrow"]))
story.append(Paragraph("The Cost of Ignoring a Cash Discount", s["h2"]))
story.append(Paragraph(
    "A supplier offers 2/10 net 30 — 2% off if you pay within 10 days, "
    "full amount due in 30. Most students skip past it. "
    "Run the numbers and ignoring it costs the equivalent of a 37% loan.",
    s["body"]))

story.append(Paragraph("The Formula", s["h3"]))
story.append(left_bar_box([
    ("Discount Cost  =  [ D ÷ (100 − D) ]  ×  [ 365 ÷ (N − T) ]", s["example_bold"]),
    ("D = discount %   |   N = net days   |   T = discount period", s["formula_note"]),
]))
story.append(Spacer(1, 8))
story.append(left_bar_box([
    ("2/10 net 30  →  [ 2 ÷ 98 ]  ×  [ 365 ÷ 20 ]  =  37.2% p.a.", s["result_line"]),
    ("If your bank charges 8%, always take the discount. "
     "Ignoring it is the same as borrowing at 37%.", s["example_body"]),
], bar_color=C_GREEN))

story.append(Spacer(1, 18))
story.append(HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=18))

story.append(Paragraph("CONCEPT  03  OF  03", s["eyebrow"]))
story.append(Paragraph("Segregation of Duties", s["h2"]))
story.append(Paragraph(
    "The most tested treasury control across every past paper. "
    "The rule: whoever authorises a transaction cannot also be the person who records it.",
    s["body"]))

story.append(Paragraph("Why it matters — Barings Bank, 1995", s["h3"]))
story.append(tinted_callout([
    ("Nick Leeson traded and confirmed his own positions with no oversight. "
     "By the time anyone noticed, he had hidden £800 million in losses. "
     "Barings Bank — 233 years old — collapsed in weeks.", s["warn_body"]),
    (" ", s["warn_body"]),
    ("One control missing. One bank gone.", s["warn_body"]),
], BG_WARN, colors.HexColor("#D97706")))

story.append(Spacer(1, 10))
story.append(tinted_callout([
    ("In the exam: you get a scenario and identify what's wrong. "
     "If one person has too much access — that is your answer, every time.", s["note_body"]),
], BG_NOTE, C_GREEN))

# ─────────────────────────────────────────────
#  PAGE 4 — CTA
# ─────────────────────────────────────────────
story.append(NextPageTemplate("CTA"))
story.append(PageBreak())

story.append(Spacer(1, 2*cm))
story.append(Paragraph("THESE 3 CONCEPTS ARE FROM LESSON 1 OF 11", s["cta_tag"]))
story.append(Paragraph("There are 8 more lessons\nwhere these came from.", s["cta_h1"]))
story.append(Spacer(1, 4))
story.append(HRFlowable(width="25%", thickness=1, color=C_GREEN, spaceAfter=14))

story.append(Paragraph("What's inside Booklesss:", s["cta_body"]))
for b in [
    "All 11 Treasury Management lessons — notes, quizzes, past paper breakdowns",
    "Weekly quiz with a live leaderboard",
    "Study channels per topic — ask questions, get answers",
    "Zambian context throughout — ZMW, ZCAS past papers, local companies",
]:
    story.append(Paragraph(f"—  {b}", s["cta_bullet"]))

story.append(Spacer(1, 22))

offer = Table([
    [Paragraph("FOUNDING MEMBER RATE", s["offer_label"])],
    [Paragraph("K550 / month", s["offer_price"])],
    [Paragraph(
        "Locked in for life  ·  Closes April 18, 2026  ·  Standard rate: K800/month",
        s["offer_sub"])],
], colWidths=[W - 2*MARGIN_X - 8])
offer.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,-1), colors.HexColor("#0A1628")),
    ("LINEBEFORE",    (0,0), (0,-1),  2.5, C_GREEN),
    ("TOPPADDING",    (0,0), (-1,-1), 12),
    ("BOTTOMPADDING", (0,0), (-1,-1), 12),
    ("LEFTPADDING",   (0,0), (-1,-1), 16),
    ("RIGHTPADDING",  (0,0), (-1,-1), 16),
]))
story.append(offer)

story.append(Paragraph("booklesss20.slack.com", s["cta_link"]))
story.append(Paragraph("booklesss.framer.ai", s["cta_body"]))

# ─────────────────────────────────────────────
#  BUILD
# ─────────────────────────────────────────────
doc.build(story)
print(f"Saved: {OUT}")
