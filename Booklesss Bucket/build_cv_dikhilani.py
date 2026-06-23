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

_ROOT     = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
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
MY        = 2.0 * cm
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
        fontName="Body-Bold", fontSize=9, textColor=C_LABEL,
        leading=13, alignment=TA_RIGHT, charSpace=1.2),
    "label": ParagraphStyle("label",
        fontName="Body-Bold", fontSize=7.5, textColor=C_LABEL,
        leading=11),
    "contact": ParagraphStyle("contact",
        fontName="Body", fontSize=9.5, textColor=C_DIM,
        leading=14),
    "job_title": ParagraphStyle("job_title",
        fontName="Body-Bold", fontSize=10.5, textColor=C_INK,
        leading=15, spaceAfter=1),
    "company": ParagraphStyle("company",
        fontName="Body-Italic", fontSize=9.5, textColor=C_DIM,
        leading=14, spaceAfter=5),
    "bullet": ParagraphStyle("bullet",
        fontName="Body", fontSize=9.5, textColor=C_INK,
        leading=15, spaceAfter=2, leftIndent=12, bulletIndent=0,
        bulletFontName="Body", bulletFontSize=9.5),
    "edu_degree": ParagraphStyle("edu_degree",
        fontName="Body-Bold", fontSize=10.5, textColor=C_INK,
        leading=15, spaceAfter=1),
    "edu_meta": ParagraphStyle("edu_meta",
        fontName="Body-Italic", fontSize=9.5, textColor=C_DIM,
        leading=14, spaceAfter=4),
    "edu_modules": ParagraphStyle("edu_modules",
        fontName="Body", fontSize=9, textColor=C_DIM,
        leading=13),
    "skill": ParagraphStyle("skill",
        fontName="Body", fontSize=9.5, textColor=C_INK,
        leading=15, spaceAfter=2, leftIndent=12, bulletIndent=0,
        bulletFontName="Body", bulletFontSize=9.5),
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
    story.append(rule(before=10, after=14, thick=0.8))

    # ── CONTACT ───────────────────────────────────────────────────────────────
    story.append(section_row(
        "contact",
        Paragraph(
            "+260 763 665 966  ·  deekymvula@gmail.com  ·  Kitwe, Zambia",
            ST["contact"]
        )
    ))
    story.append(rule(before=12, after=14))

    # ── PROFESSIONAL EXPERIENCE ───────────────────────────────────────────────
    exp = [
        Paragraph("Finance Manager  |  Jan 2026 – Present", ST["job_title"]),
        Paragraph("Khadzika Enterprises Limited · Kitwe, Zambia", ST["company"]),
        b("Originate and deliver commercial quotations for industrial equipment, tools, and "
          "consumables to mining clients — BIA Group, Mopani Copper Mines, KCM, and CEC"),
        b("Manage international supply chains across USA and South Africa: PO issuance, "
          "supplier negotiation, and inbound freight coordination"),
        b("Lead formal tender submissions to major mining companies — full BOQ preparation "
          "and statutory compliance documentation"),
        b("Operate ZRA Smart Invoice portal: compliant tax invoicing and multi-currency "
          "statements of account in USD and ZMW"),
        b("Oversee international freight clearance, customs documentation, and clearing agent liaison"),
        b("Drive market sourcing across 50+ supplier contacts per task for specialised industrial products"),
        b("Build client pipeline through prospect identification, direct outreach, and quotation follow-up"),
        Spacer(1, 10),
        Paragraph("Finance Intern  |  2024 – 2025  (12 months)", ST["job_title"]),
        Paragraph("Kansanshi Mining Plc (First Quantum Minerals) · Solwezi, Zambia",
                  ST["company"]),
        b("Completed structured rotation across AP, AR, financial reporting, and budgeting "
          "at one of Zambia's largest copper mining operations"),
        b("Processed and routed high-volume supplier and contractor invoices through formal "
          "approval workflows, gaining deep exposure to mining procurement cycles"),
        b("Supported month-end reconciliations and contributed to financial reporting "
          "under formal close procedures"),
        Spacer(1, 10),
        Paragraph("Founder  |  2025 – Present", ST["job_title"]),
        Paragraph("Booklesss · Zambia  (edtech startup)", ST["company"]),
        b("Building a Slack-based study platform delivering branded finance lecture notes "
          "for ZCAS and UNZA students across 4 active courses"),
        b("Designed the full product pipeline using AI tools — course research to branded, "
          "publication-ready study documents — cutting production time per step significantly"),
        b("Modelled unit economics, pricing tiers, and reinvestment strategy; "
          "managing student acquisition through direct WhatsApp outreach"),
    ]
    story.append(section_row("professional experience", exp))
    story.append(rule(before=12, after=14))

    # ── EDUCATION ─────────────────────────────────────────────────────────────
    edu = [
        Paragraph("Bachelor of Accounting and Finance", ST["edu_degree"]),
        Paragraph("ZCAS University · Lusaka, Zambia · Graduated 2026",
                  ST["edu_meta"]),
        Paragraph(
            "Financial Accounting · Financial Management · Corporate Finance · "
            "Advanced Taxation · Financial Reporting · Auditing &amp; Assurance · "
            "Financial Modelling &amp; Forecasting · International Trade &amp; Finance · "
            "Investment &amp; Portfolio Management · Management Accounting · "
            "Business &amp; Corporate Law",
            ST["edu_modules"]
        ),
    ]
    story.append(section_row("education", edu))
    story.append(rule(before=12, after=14))

    # ── SKILLS ────────────────────────────────────────────────────────────────
    skills_l = [
        "Financial reporting &amp; ZRA compliance (Smart Invoice portal)",
        "Multi-currency account management (USD, ZAR, ZMW)",
        "International procurement &amp; supplier management",
        "AI-augmented research, content &amp; product operations",
    ]
    skills_r = [
        "Tender preparation &amp; portal submission (mining sector)",
        "Microsoft Office — Excel (financial modelling), Word",
        "Business correspondence &amp; client relationship management",
        "Business &amp; unit economics modelling",
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
