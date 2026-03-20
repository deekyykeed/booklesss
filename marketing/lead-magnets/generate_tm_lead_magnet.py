"""
Booklesss — Lead Magnet PDF Generator
Script:  generate_tm_lead_magnet.py
Output:  tm-lead-magnet_v1.pdf
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, KeepTogether, HRFlowable, PageBreak,
    NextPageTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ── Paths ──────────────────────────────────────────────────────────────────
FONT_DIR = r"C:\Windows\Fonts"
OUT_DIR  = r"C:\Users\deeky\OneDrive\Desktop\Booklesss\marketing\lead-magnets"
OUT_FILE = os.path.join(OUT_DIR, "tm-lead-magnet_v1.pdf")

# ── Brand colours ──────────────────────────────────────────────────────────
CREAM  = colors.HexColor("#F5F0E8")
NAVY   = colors.HexColor("#1B2A4A")
AMBER  = colors.HexColor("#C17E3A")
TEAL   = colors.HexColor("#0E6B6B")
BODY   = colors.HexColor("#2C2C2C")
WHITE  = colors.white
LIGHT  = colors.HexColor("#E8E3D8")
GREY   = colors.HexColor("#888888")
AMBER_BG = colors.HexColor("#FDF3E3")

# ── Page geometry ──────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN    = 2.5 * cm
CONTENT_W = PAGE_W - 2 * MARGIN
FOOTER_Y  = 1.2 * cm

# ── Register fonts ─────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont("Calibri",        os.path.join(FONT_DIR, "calibri.ttf")))
pdfmetrics.registerFont(TTFont("Calibri-Bold",   os.path.join(FONT_DIR, "calibrib.ttf")))
pdfmetrics.registerFont(TTFont("Calibri-Italic", os.path.join(FONT_DIR, "calibrii.ttf")))
pdfmetrics.registerFontFamily(
    "Calibri",
    normal="Calibri",
    bold="Calibri-Bold",
    italic="Calibri-Italic",
    boldItalic="Calibri-Bold",
)

COURSE_SHORT = "BBF4302 TM"
LESSON_SHORT = "Treasury Management Lead Magnet"

# ── Page painters ──────────────────────────────────────────────────────────
def draw_cream_page(canvas, doc):
    """Standard cream page with amber rules + footer."""
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    canvas.setStrokeColor(AMBER)
    canvas.setLineWidth(1)
    # Top rule
    canvas.line(MARGIN, PAGE_H - MARGIN + 0.3 * cm, PAGE_W - MARGIN, PAGE_H - MARGIN + 0.3 * cm)
    # Bottom rule above footer
    canvas.line(MARGIN, FOOTER_Y + 0.55 * cm, PAGE_W - MARGIN, FOOTER_Y + 0.55 * cm)

    canvas.setFont("Calibri", 8)
    canvas.setFillColor(BODY)
    canvas.drawString(MARGIN, FOOTER_Y + 0.15 * cm, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(PAGE_W / 2, FOOTER_Y + 0.15 * cm,
                             f"{COURSE_SHORT}  ·  3 Concepts for Your Exam")
    canvas.drawRightString(PAGE_W - MARGIN, FOOTER_Y + 0.15 * cm, f"Page {doc.page}")
    canvas.restoreState()

def draw_navy_cover(canvas, doc):
    """Page 1 — navy cover."""
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Bottom amber strip
    canvas.setFillColor(AMBER)
    canvas.rect(0, 0, PAGE_W, 2.2 * cm, fill=1, stroke=0)

    # Tag
    canvas.setFont("Calibri-Bold", 10)
    canvas.setFillColor(AMBER)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H * 0.80, "FREE GUIDE")

    # Amber accent line under tag
    canvas.setStrokeColor(AMBER)
    canvas.setLineWidth(1)
    canvas.line(MARGIN * 2.5, PAGE_H * 0.78, PAGE_W - MARGIN * 2.5, PAGE_H * 0.78)

    # Main title
    canvas.setFont("Calibri-Bold", 26)
    canvas.setFillColor(WHITE)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H * 0.66, "3 Treasury Management")
    canvas.drawCentredString(PAGE_W / 2, PAGE_H * 0.58, "Concepts That Will Show")
    canvas.drawCentredString(PAGE_W / 2, PAGE_H * 0.50, "Up in Your Exam")

    # Subtitle
    canvas.setFont("Calibri-Italic", 13)
    canvas.setFillColor(colors.HexColor("#C8C0B0"))
    canvas.drawCentredString(PAGE_W / 2, PAGE_H * 0.42,
                             "Real explanations. Worked examples in Kwacha.")
    canvas.drawCentredString(PAGE_W / 2, PAGE_H * 0.38, "No textbook fluff.")

    # Bottom strip text
    canvas.setFont("Calibri-Bold", 10)
    canvas.setFillColor(NAVY)
    canvas.drawCentredString(PAGE_W / 2, 0.85 * cm,
                             "BBF4302 Treasury Management  ·  ZCAS University  ·  booklesss.framer.ai")

    canvas.restoreState()

def draw_teal_page(canvas, doc):
    """Page 4 — teal CTA background with amber rules + footer."""
    canvas.saveState()
    canvas.setFillColor(TEAL)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    canvas.setStrokeColor(AMBER)
    canvas.setLineWidth(1)
    canvas.line(MARGIN, PAGE_H - MARGIN + 0.3 * cm, PAGE_W - MARGIN, PAGE_H - MARGIN + 0.3 * cm)
    canvas.line(MARGIN, FOOTER_Y + 0.55 * cm, PAGE_W - MARGIN, FOOTER_Y + 0.55 * cm)

    canvas.setFont("Calibri", 8)
    canvas.setFillColor(colors.HexColor("#CCEEEE"))
    canvas.drawString(MARGIN, FOOTER_Y + 0.15 * cm, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(PAGE_W / 2, FOOTER_Y + 0.15 * cm,
                             f"{COURSE_SHORT}  ·  3 Concepts for Your Exam")
    canvas.drawRightString(PAGE_W - MARGIN, FOOTER_Y + 0.15 * cm, f"Page {doc.page}")
    canvas.restoreState()

# ── Styles ─────────────────────────────────────────────────────────────────
def make_styles():
    s = {}
    s["h1"] = ParagraphStyle("h1", fontName="Calibri-Bold", fontSize=18,
                              textColor=NAVY, leading=24, spaceAfter=6, spaceBefore=10)
    s["h2"] = ParagraphStyle("h2", fontName="Calibri-Bold", fontSize=14,
                              textColor=NAVY, leading=18, spaceAfter=4, spaceBefore=12)
    s["h2_white"] = ParagraphStyle("h2_white", fontName="Calibri-Bold", fontSize=18,
                                    textColor=WHITE, leading=24, spaceAfter=8, spaceBefore=4,
                                    alignment=TA_CENTER)
    s["body"] = ParagraphStyle("body", fontName="Calibri", fontSize=10.5,
                                textColor=BODY, leading=16, spaceAfter=6, alignment=TA_JUSTIFY)
    s["body_white"] = ParagraphStyle("body_white", fontName="Calibri", fontSize=11,
                                      textColor=WHITE, leading=17, spaceAfter=7,
                                      alignment=TA_JUSTIFY)
    s["formula"] = ParagraphStyle("formula", fontName="Calibri-Bold", fontSize=12,
                                   textColor=NAVY, leading=18, alignment=TA_CENTER,
                                   spaceAfter=4, spaceBefore=4)
    s["example_title"] = ParagraphStyle("example_title", fontName="Calibri-Bold", fontSize=10,
                                         textColor=colors.HexColor("#7B4A00"), leading=14,
                                         spaceAfter=4)
    s["example_body"] = ParagraphStyle("example_body", fontName="Calibri", fontSize=10,
                                        textColor=colors.HexColor("#4A2D00"), leading=15,
                                        spaceAfter=3, alignment=TA_JUSTIFY)
    s["example_body_bold"] = ParagraphStyle("example_body_bold", fontName="Calibri-Bold",
                                             fontSize=10, textColor=colors.HexColor("#4A2D00"),
                                             leading=15, spaceAfter=3)
    s["bullet_white"] = ParagraphStyle("bullet_white", fontName="Calibri", fontSize=11,
                                        textColor=WHITE, leading=17, leftIndent=12,
                                        spaceAfter=4)
    s["offer_title"] = ParagraphStyle("offer_title", fontName="Calibri-Bold", fontSize=22,
                                       textColor=NAVY, leading=28, alignment=TA_CENTER,
                                       spaceAfter=4)
    s["offer_sub"] = ParagraphStyle("offer_sub", fontName="Calibri", fontSize=12,
                                     textColor=NAVY, leading=18, alignment=TA_CENTER,
                                     spaceAfter=4)
    s["offer_note"] = ParagraphStyle("offer_note", fontName="Calibri-Italic", fontSize=10,
                                      textColor=colors.HexColor("#4A2D00"), leading=14,
                                      alignment=TA_CENTER, spaceAfter=2)
    s["cta_link"] = ParagraphStyle("cta_link", fontName="Calibri-Bold", fontSize=14,
                                    textColor=NAVY, leading=20, alignment=TA_CENTER,
                                    spaceAfter=4)
    s["small_grey"] = ParagraphStyle("small_grey", fontName="Calibri-Italic", fontSize=8.5,
                                      textColor=WHITE, leading=12, alignment=TA_CENTER,
                                      spaceAfter=2)
    s["footer_note"] = ParagraphStyle("footer_note", fontName="Calibri", fontSize=9,
                                       textColor=WHITE, leading=13, alignment=TA_CENTER,
                                       spaceAfter=0)
    return s

# ── Helpers ────────────────────────────────────────────────────────────────
def gap(h=8):
    return Spacer(1, h)

def amber_rule():
    return HRFlowable(width="100%", thickness=1, color=AMBER, spaceAfter=6, spaceBefore=4)

def concept_heading(text, styles):
    return [Paragraph(text, styles["h2"]), amber_rule()]

def formula_box(formula_text, styles):
    t = Table([[Paragraph(formula_text, styles["formula"])]],
              colWidths=[CONTENT_W - 0.4 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), colors.HexColor("#EAF4F4")),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("TOPPADDING",    (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("BOX",           (0, 0), (-1, -1), 1.5, TEAL),
    ]))
    return t

def amber_example_box(rows_content, styles):
    t = Table([[rows_content]], colWidths=[CONTENT_W - 0.4 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), AMBER_BG),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("TOPPADDING",    (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("BOX",           (0, 0), (-1, -1), 1.5, AMBER),
    ]))
    return t

def offer_box(rows_content, styles):
    t = Table([[rows_content]], colWidths=[CONTENT_W - 1.0 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), AMBER),
        ("LEFTPADDING",   (0, 0), (-1, -1), 16),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 16),
        ("TOPPADDING",    (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("BOX",           (0, 0), (-1, -1), 2, colors.HexColor("#8A5520")),
    ]))
    return t

# ── Build PDF ──────────────────────────────────────────────────────────────
def build_pdf():
    styles = make_styles()

    cover_frame  = Frame(0, 0, PAGE_W, PAGE_H,
                         leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    normal_frame = Frame(MARGIN, FOOTER_Y + 1.3 * cm,
                         CONTENT_W, PAGE_H - MARGIN - FOOTER_Y - 1.8 * cm,
                         leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    teal_frame   = Frame(MARGIN, FOOTER_Y + 1.3 * cm,
                         CONTENT_W, PAGE_H - MARGIN - FOOTER_Y - 1.8 * cm,
                         leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    cover_tmpl  = PageTemplate(id="cover",  frames=[cover_frame],  onPage=draw_navy_cover)
    normal_tmpl = PageTemplate(id="normal", frames=[normal_frame], onPage=draw_cream_page)
    teal_tmpl   = PageTemplate(id="teal",   frames=[teal_frame],   onPage=draw_teal_page)

    doc = BaseDocTemplate(
        OUT_FILE,
        pagesize=A4,
        pageTemplates=[cover_tmpl, normal_tmpl, teal_tmpl],
        title="3 Treasury Management Concepts That Will Show Up in Your Exam",
        author="Booklesss",
    )

    story = []

    # ── PAGE 1 — COVER ────────────────────────────────────────────────────
    story.append(NextPageTemplate("normal"))
    story.append(PageBreak())

    # ── PAGE 2 — CONCEPT 1 ────────────────────────────────────────────────
    story.extend(concept_heading(
        "1. The Cash Conversion Cycle — and why it matters more than you think", styles))

    story.append(Paragraph(
        "The CCC tells you how long a business has its money tied up before it gets paid. "
        "Examiners love it because it connects inventory, debtors, and creditors in one number.",
        styles["body"]))
    story.append(gap(8))

    story.append(KeepTogether(formula_box(
        "CCC = Days Inventory + Days Receivables − Days Payables", styles)))

    story.append(gap(10))

    # Worked example content
    ex_content = [
        Paragraph("Worked Example — Zambeef Ltd", styles["example_title"]),
        Paragraph(
            "Inventory = K2,600  |  COGS = K9,200  |  Receivables = K1,700  "
            "|  Revenue = K15,000  |  Payables = K1,600",
            styles["example_body"]),
        gap(6),
        Paragraph(
            "Days Inventory = K2,600 ÷ K9,200 × 365 = <b>103 days</b>",
            styles["example_body"]),
        Paragraph(
            "Days Receivables = K1,700 ÷ K15,000 × 365 = <b>41 days</b>",
            styles["example_body"]),
        Paragraph(
            "Days Payables = K1,600 ÷ K9,200 × 365 = <b>63 days</b>",
            styles["example_body"]),
        gap(4),
        Paragraph(
            "<b>CCC = 103 + 41 − 63 = 81 days</b>",
            styles["example_body_bold"]),
        gap(6),
        Paragraph(
            "What it means: Zambeef waits 81 days between paying for inputs and collecting "
            "cash from sales. The shorter this number, the less money the business needs to borrow.",
            styles["example_body"]),
    ]
    story.append(KeepTogether(amber_example_box(ex_content, styles)))

    # Force to page 3
    story.append(NextPageTemplate("normal"))
    story.append(PageBreak())

    # ── PAGE 3 — CONCEPTS 2 & 3 ───────────────────────────────────────────
    story.extend(concept_heading(
        "2. The Cost of Not Taking a Cash Discount", styles))

    story.append(Paragraph(
        "Many businesses offer <b>2/10 net 30</b> — pay within 10 days and get 2% off, "
        "or pay the full amount within 30 days.",
        styles["body"]))
    story.append(Paragraph(
        "Most people think ignoring the discount is fine. The maths says otherwise.",
        styles["body"]))
    story.append(gap(8))

    story.append(KeepTogether(formula_box(
        "Discount Cost = [D ÷ (100 − D)]  ×  [365 ÷ (N − T)]", styles)))

    story.append(gap(8))

    disc_content = [
        Paragraph("Example: 2/10 net 30", styles["example_title"]),
        Paragraph(
            "[2 ÷ 98]  ×  [365 ÷ 20]  =  <b>37.2% annualised cost</b>",
            styles["example_body_bold"]),
        gap(4),
        Paragraph(
            "If you can borrow at 8%, you should always take the discount. "
            "Paying late on a 2/10 net 30 term costs the equivalent of a 37% loan.",
            styles["example_body"]),
    ]
    story.append(KeepTogether(amber_example_box(disc_content, styles)))

    story.append(gap(16))

    story.extend(concept_heading(
        "3. Segregation of Duties — why it always comes up", styles))

    story.append(Paragraph(
        "Treasury controls exist because treasury handles large sums of money. "
        "The most tested control is <b>segregation of duties</b>: "
        "the person who makes a trade cannot also confirm it.",
        styles["body"]))
    story.append(gap(6))

    sod_content = [
        Paragraph("Nick Leeson — Barings Bank, 1995", styles["example_title"]),
        Paragraph(
            "Leeson had no segregation of duties. He traded AND confirmed his own trades, "
            "hiding £800 million in losses. Barings Bank — 200 years old — collapsed. "
            "One person with too much access ended a whole bank.",
            styles["example_body"]),
    ]
    story.append(KeepTogether(amber_example_box(sod_content, styles)))

    story.append(gap(8))
    story.append(Paragraph(
        "Examiners will give you a scenario and ask which control is missing. "
        "Nine times out of ten, it's this one.",
        styles["body"]))

    # Force to page 4 — teal CTA
    story.append(NextPageTemplate("teal"))
    story.append(PageBreak())

    # ── PAGE 4 — CTA ──────────────────────────────────────────────────────
    story.append(Paragraph(
        "There are 8 more lessons where these came from.",
        styles["h2_white"]))
    story.append(HRFlowable(width="100%", thickness=1, color=AMBER,
                             spaceAfter=10, spaceBefore=4))

    story.append(Paragraph(
        "Booklesss is a study community built specifically for ZCAS students. "
        "Every lesson is rewritten in plain English, with worked examples in Kwacha "
        "and weekly quizzes to test yourself.",
        styles["body_white"]))

    story.append(gap(10))
    story.append(Paragraph("<b>What's inside:</b>", styles["body_white"]))

    whats_in = [
        "- All 11 Treasury Management lessons",
        "- Weekly quizzes with leaderboard",
        "- Past paper breakdowns",
        "- Study channels for each topic",
        "- Ask questions, get answers",
    ]
    for item in whats_in:
        story.append(Paragraph(item, styles["bullet_white"]))

    story.append(gap(18))

    # Founding offer box
    offer_content = [
        Paragraph("K550/month — locked in for life", styles["offer_title"]),
        Paragraph("Offer closes April 12, 2026", styles["offer_sub"]),
        Paragraph("After that: K800/month", styles["offer_note"]),
        gap(8),
        Paragraph("Join at  booklesss20.slack.com", styles["cta_link"]),
    ]
    story.append(KeepTogether(offer_box(offer_content, styles)))

    story.append(gap(14))
    story.append(Paragraph(
        "[bit.ly/booklesss-GROUP — update this link per group]",
        styles["small_grey"]))
    story.append(gap(6))
    story.append(Paragraph(
        "Questions? DM on WhatsApp or email via the website.",
        styles["footer_note"]))

    doc.build(story)
    print(f"Saved: {OUT_FILE}")


if __name__ == "__main__":
    build_pdf()
