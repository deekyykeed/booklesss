"""
Dikhilani Mvula — Curriculum Vitae 2026
Brand treatment: cream + grain, Parastoo-Bold (name) + Aptos (body)
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
import os

_ROOT     = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FONT_DIR  = os.path.join(_ROOT, "_dev", "fonts")
BRAND_DIR = os.path.join(_ROOT, "_dev", "brand")
GRAIN     = os.path.join(BRAND_DIR, "grain.png")
OUT_PATH  = os.path.join(os.path.dirname(__file__),
                         "Dikhilani_Mvula_CV_2026_Booklesss.pdf")

# ── FONTS ─────────────────────────────────────────────────────────────────────
def _reg(name, fn):
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONT_DIR, fn)))

_reg("Body",            "Aptos.ttf")
_reg("Body-Bold",       "Aptos-Bold.ttf")
_reg("Body-Italic",     "Aptos-Italic.ttf")
_reg("Body-BoldItalic", "Aptos-Bold-Italic.ttf")
pdfmetrics.registerFontFamily("Body",
    normal="Body", bold="Body-Bold",
    italic="Body-Italic", boldItalic="Body-BoldItalic")
_reg("Title-Bold", "Parastoo-Bold.ttf")

# ── BRAND ASSETS ──────────────────────────────────────────────────────────────
_grain = ImageReader(GRAIN) if os.path.exists(GRAIN) else None

# ── COLOURS ───────────────────────────────────────────────────────────────────
C_BG    = colors.HexColor("#FFFEF2")   # cream
C_INK   = colors.HexColor("#121212")   # near-black
C_LABEL = colors.HexColor("#5A5652")   # warm dark grey — section labels
C_DIM   = colors.HexColor("#8A8680")   # warm mid grey — company names, meta
C_RULE  = colors.HexColor("#E0DACB")   # warm hairline

# ── PAGE GEOMETRY ─────────────────────────────────────────────────────────────
W, H      = A4
MX        = 2.2 * cm
MY        = 1.6 * cm
CONTENT_W = W - 2 * MX
LABEL_W   = 3.5 * cm
TEXT_W    = CONTENT_W - LABEL_W

# ── CANVAS CALLBACK ───────────────────────────────────────────────────────────
def page_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_BG)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    if _grain:
        canvas.drawImage(_grain, 0, 0, width=W, height=H, mask="auto")
    canvas.restoreState()

# ── STYLES ────────────────────────────────────────────────────────────────────
ST = {
    "name": ParagraphStyle("name",
        fontName="Title-Bold", fontSize=34, textColor=C_INK,
        leading=38),
    "role": ParagraphStyle("role",
        fontName="Body-Bold", fontSize=9.5, textColor=C_LABEL,
        leading=14, alignment=TA_RIGHT, charSpace=1.2),
    "label": ParagraphStyle("label",
        fontName="Body-Bold", fontSize=8, textColor=C_LABEL,
        leading=12),
    "contact": ParagraphStyle("contact",
        fontName="Body", fontSize=10.5, textColor=C_DIM,
        leading=15.5),
    "job_title": ParagraphStyle("job_title",
        fontName="Body-Bold", fontSize=11.5, textColor=C_INK,
        leading=16.5, spaceAfter=1),
    "company": ParagraphStyle("company",
        fontName="Body-Italic", fontSize=10.5, textColor=C_DIM,
        leading=15.5, spaceAfter=5),
    "bullet": ParagraphStyle("bullet",
        fontName="Body", fontSize=10.5, textColor=C_INK,
        leading=15.5, spaceAfter=1, leftIndent=13, bulletIndent=0,
        bulletFontName="Body", bulletFontSize=10.5),
    "edu_degree": ParagraphStyle("edu_degree",
        fontName="Body-Bold", fontSize=11.5, textColor=C_INK,
        leading=16.5, spaceAfter=1),
    "edu_meta": ParagraphStyle("edu_meta",
        fontName="Body-Italic", fontSize=10.5, textColor=C_DIM,
        leading=15.5, spaceAfter=4),
    "edu_modules": ParagraphStyle("edu_modules",
        fontName="Body", fontSize=9.5, textColor=colors.HexColor("#6A6560"),
        leading=14),
    "skill": ParagraphStyle("skill",
        fontName="Body", fontSize=10.5, textColor=C_INK,
        leading=15.5, spaceAfter=2, leftIndent=13, bulletIndent=0,
        bulletFontName="Body", bulletFontSize=10.5),
    "summary": ParagraphStyle("summary",
        fontName="Body", fontSize=10.5, textColor=C_INK,
        leading=16.5),
}

# ── HELPERS ───────────────────────────────────────────────────────────────────
def rule(before=6, after=12, thick=0.5):
    return HRFlowable(width="100%", thickness=thick, color=C_RULE,
                      spaceBefore=before, spaceAfter=after)

def section_row(lbl, content):
    tbl = Table(
        [[Paragraph(lbl.upper(), ST["label"]), content]],
        colWidths=[LABEL_W, TEXT_W],
        hAlign="LEFT",
    )
    tbl.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
        ("TOPPADDING",    (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (0, 0),  12),
    ]))
    return tbl

def b(text):
    return Paragraph(text, ST["bullet"], bulletText="•")

# ── BUILD ─────────────────────────────────────────────────────────────────────
def build():
    frame = Frame(MX, MY, CONTENT_W, H - 2 * MY,
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc = BaseDocTemplate(OUT_PATH, pagesize=A4,
                          topMargin=MY, bottomMargin=MY,
                          leftMargin=MX, rightMargin=MX)
    doc.addPageTemplates([PageTemplate("body", frames=[frame], onPage=page_bg)])

    story = []

    # ── NAME + ROLE ───────────────────────────────────────────────────────────
    hdr = Table(
        [[Paragraph("Dikhilani Mvula", ST["name"]),
          Paragraph("FINANCE &amp; COMMERCIAL OPERATIONS", ST["role"])]],
        colWidths=[CONTENT_W * 0.58, CONTENT_W * 0.42],
        hAlign="LEFT",
    )
    hdr.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "BOTTOM"),
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
        ("TOPPADDING",    (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(hdr)
    story.append(rule(before=8, after=10, thick=0.8))

    # ── CONTACT ───────────────────────────────────────────────────────────────
    story.append(section_row(
        "contact",
        Paragraph(
            "+260 763 665 966  ·  deekymvula@gmail.com  ·  Kitwe, Zambia",
            ST["contact"]
        )
    ))
    story.append(rule(before=8, after=10))

    # ── PROFESSIONAL SUMMARY ──────────────────────────────────────────────────
    story.append(section_row(
        "profile",
        Paragraph(
            "Finance and commercial operations professional with hands-on experience "
            "across mining procurement, financial reporting, and international supply chain management. "
            "Built track record across Zambia's copper mining sector — managing multi-currency accounts, "
            "leading formal tender submissions, and operating full AP/AR workflows at First Quantum Minerals. "
            "Also the founder of Booklesss, a Zambian edtech startup, where AI tools are applied "
            "to product development and business modelling.",
            ST["summary"]
        )
    ))
    story.append(rule(before=8, after=10))

    # ── PROFESSIONAL EXPERIENCE ───────────────────────────────────────────────
    story.append(section_row("professional experience", [
        Paragraph("Finance Manager  |  Jan 2026 – Present", ST["job_title"]),
        Paragraph("Khadzika Enterprises Limited · Kitwe, Zambia", ST["company"]),
        b("Lead commercial operations for a mining-focused procurement business — managing client "
          "accounts and driving sales pipeline across Mopani Copper Mines, BIA Group, KCM, and CEC"),
        b("Own international procurement across USA and South Africa: supplier selection, "
          "PO issuance, price negotiation, and inbound freight coordination"),
        b("Prepare and submit formal tenders to major mining operators — full BOQ build, "
          "compliance documentation, and deadline-driven portal submission"),
        b("Source specialist industrial products across a network of 50+ suppliers per requirement, "
          "balancing technical specification, cost, and lead time"),
        b("Manage ZRA-compliant multi-currency invoicing and accounts receivable "
          "across an active client portfolio in USD and ZMW"),
    ]))
    story.append(Spacer(1, 8))
    story.append(section_row("", [
        Paragraph("Finance Intern  |  2024 – 2025  (12 months)", ST["job_title"]),
        Paragraph("Kansanshi Mining Plc (First Quantum Minerals) · Solwezi, Zambia",
                  ST["company"]),
        b("Rotated across AP, AR, financial reporting, and budgeting at one of "
          "Zambia's largest copper mining operations"),
        b("Processed high-volume supplier and contractor invoices through multi-level "
          "approval workflows in a large-scale mining procurement environment"),
        b("Delivered month-end close responsibilities including account reconciliations "
          "and financial reporting submissions under formal close procedures"),
    ]))
    story.append(Spacer(1, 8))
    story.append(section_row("", [
        Paragraph("Founder  |  2025 – Present", ST["job_title"]),
        Paragraph("Booklesss · Zambia  (edtech startup)", ST["company"]),
        b("Founded and operate a subscription-based edtech platform serving Zambian university "
          "students — 4 active courses across multiple institutions, direct-to-student acquisition"),
        b("Built the full content production system using AI tools, cutting time from raw lecture "
          "source to publication-ready branded PDF to under a day per lesson step"),
        b("Designed pricing architecture, unit economics model, and reinvestment strategy from scratch; "
          "manage all student acquisition through direct WhatsApp outreach"),
    ]))
    story.append(rule(before=8, after=10))

    # ── EDUCATION ─────────────────────────────────────────────────────────────
    edu = [
        Paragraph("Bachelor of Accounting and Finance", ST["edu_degree"]),
        Paragraph("ZCAS University · Lusaka, Zambia · Graduated 2026",
                  ST["edu_meta"]),
        Paragraph(
            "<font color='#121212'><b>Corporate Finance</b></font> · <font color='#121212'><b>Financial Management</b></font> · <font color='#121212'><b>Financial Reporting</b></font> · "
            "Financial Modelling &amp; Forecasting · Advanced Taxation · Financial Accounting · "
            "Management Accounting · Advanced Management Accounting · Treasury Management · "
            "International Trade &amp; Finance · Investment &amp; Portfolio Management · "
            "Auditing &amp; Assurance Services · Credit Analysis &amp; Lending · "
            "Financial Products &amp; Services · Monetary &amp; Financial Systems · "
            "Regulation of Financial Services · Business &amp; Corporate Law · "
            "Strategic Management · Managing Strategic Risk · Innovation &amp; Entrepreneurship · "
            "Taxation · Cost Accounting · Principles of Accounting · Business Information Systems · "
            "Dissertation · Research Methods · Introduction to Financial Markets · "
            "Introduction to Quantitative Methods · Introduction to Economics · "
            "Introduction to Management · Principles of Marketing · Academic Writing",
            ST["edu_modules"]
        ),
    ]
    story.append(section_row("education", edu))
    story.append(rule(before=8, after=10))

    # ── SKILLS ────────────────────────────────────────────────────────────────
    skills_l = [
        "Financial Analysis &amp; Reporting",
        "International Procurement &amp; Supply Chain Management",
        "Commercial Operations &amp; Business Development",
        "AI Tools &amp; Workflow Automation",
    ]
    skills_r = [
        "Financial Modelling &amp; Unit Economics",
        "Multi-Currency Account Management",
        "Tax Compliance &amp; Regulatory Reporting",
        "Stakeholder &amp; Client Relationship Management",
    ]
    half = TEXT_W / 2
    sk_tbl = Table(
        [[Paragraph(l, ST["skill"], bulletText="•"),
          Paragraph(r, ST["skill"], bulletText="•")]
         for l, r in zip(skills_l, skills_r)],
        colWidths=[half, half],
        hAlign="LEFT",
    )
    sk_tbl.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
        ("TOPPADDING",    (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (0, -1), 8),
    ]))
    story.append(section_row("skills", sk_tbl))

    doc.build(story)
    print("Done: " + OUT_PATH)

if __name__ == "__main__":
    build()
