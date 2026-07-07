"""
Dikhilani Mvula — CV tailored for KoBold Metals Software Engineer role
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

_ROOT     = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
FONT_DIR  = os.path.join(_ROOT, "_dev", "fonts")
BRAND_DIR = os.path.join(_ROOT, "_dev", "brand")
GRAIN     = os.path.join(BRAND_DIR, "grain.png")
_KHADZIKA = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "Khadzika"))
OUT_PATH  = os.path.join(_KHADZIKA, "_Admin", "CV", "Dikhilani_Mvula_CV_KoBold.pdf")

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
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
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
          Paragraph("SOFTWARE ENGINEER", ST["role"])]],
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
            "Python developer who builds production data systems from scratch and has worked inside a major copper mining operation. "
            "Spent 12 months embedded at Kansanshi Mining Plc (First Quantum Minerals) — one of Zambia's largest copper operations — "
            "processing financial data across procurement, AP/AR, and reporting workflows, and developing direct insight into "
            "where manual processes limit how the organisation makes decisions. "
            "Subsequently founded Booklesss and built a structured ingest pipeline end-to-end: "
            "raw unstructured source material in, AI-assisted transformation, automated structured output — "
            "designed, operated, and iterated on alone, applying LLMs at the processing layer for NLP on inconsistently formatted inputs. "
            "The combination is rare: hands-on Python pipeline engineering and ground-level exposure to how a major copper mine actually handles data. "
            "Most engineers build systems for mining without ever having worked inside one.",
            ST["summary"]
        )
    ))
    story.append(rule(before=8, after=10))

    # ── PROFESSIONAL EXPERIENCE ───────────────────────────────────────────────
    story.append(section_row("experience", [
        Paragraph("Founder &amp; Technical Lead  |  2025 – Present", ST["job_title"]),
        Paragraph("Booklesss · Zambia  (edtech startup)", ST["company"]),
        b("Designed and built a Python-based content production pipeline end-to-end — "
          "source ingest, AI-assisted processing, and automated PDF generation via ReportLab — "
          "reducing time from raw lecture material to publication-ready output to under one day per lesson"),
        b("Architected the full data system: folder structure, build scripts, asset resolution, "
          "and output routing — all scripts are self-contained and reproducible from source"),
        b("Integrated AI language models directly into the content workflow using the Claude API — "
          "applying prompt engineering and structured outputs to transform unstructured lecture "
          "material into structured, formatted documents at scale"),
        b("Owned the full product lifecycle: problem definition, system design, implementation, "
          "iteration on user feedback, and ongoing operations — solo, with no engineering team"),
        b("Built unit economics model and pricing architecture using financial modelling; "
          "manage four active courses across two Zambian universities"),
    ]))
    story.append(Spacer(1, 8))
    story.append(section_row("", [
        Paragraph("Finance Intern  |  2024 – 2025  (12 months)", ST["job_title"]),
        Paragraph("Kansanshi Mining Plc (First Quantum Minerals) · Solwezi, Zambia",
                  ST["company"]),
        b("Embedded inside one of Zambia's largest copper mining operations — "
          "processed high-volume financial data across AP, AR, budgeting, and reporting workflows "
          "in an enterprise mining systems environment"),
        b("Worked directly with procurement data at scale: supplier invoices, contractor records, "
          "and multi-level approval pipelines across a complex operational structure"),
        b("Delivered month-end close responsibilities under formal reporting procedures — "
          "gained direct exposure to how financial data flows through a large mining organisation "
          "and where manual processes create bottlenecks"),
        b("Built direct insight into where mining data systems break down: which information flows reliably "
          "through the organisation and which requires manual intervention — a perspective rarely available "
          "to engineers who have not worked inside a major mining operation"),
    ]))
    story.append(Spacer(1, 8))
    story.append(section_row("", [
        Paragraph("Finance Manager  |  Jan 2026 – Present", ST["job_title"]),
        Paragraph("Khadzika Enterprises Limited · Kitwe, Zambia", ST["company"]),
        b("Manage commercial operations for a mining-focused procurement business — "
          "clients include Mopani Copper Mines, BIA Group, KCM, and CEC"),
        b("Coordinate international supply chains across USA and South Africa: "
          "supplier sourcing, specification matching, and inbound freight"),
        b("Own financial data end-to-end: multi-currency invoicing, accounts receivable, "
          "and ZRA-compliant reporting in both USD and ZMW"),
        b("Built and maintain the internal Python tooling that runs the business: automated PDF generation "
          "for quotations, delivery notes, and financial documents — pipeline engineering applied "
          "to live commercial operations"),
    ]))
    story.append(rule(before=8, after=10))

    # ── EDUCATION ─────────────────────────────────────────────────────────────
    edu = [
        Paragraph("Bachelor of Accounting and Finance", ST["edu_degree"]),
        Paragraph("ZCAS University · Lusaka, Zambia · Graduated 2026",
                  ST["edu_meta"]),
        Paragraph(
            "<font color='#121212'><b>Business Information Systems</b></font> · "
            "<font color='#121212'><b>Research Methods</b></font> · "
            "<font color='#121212'><b>Dissertation</b></font> · "
            "Financial Modelling &amp; Forecasting · Corporate Finance · "
            "Treasury Management · Investment &amp; Portfolio Management · "
            "Financial Management · Financial Reporting · Strategic Management · "
            "International Trade &amp; Finance · Introduction to Quantitative Methods · "
            "Introduction to Economics · Innovation &amp; Entrepreneurship · "
            "Introduction to Management",
            ST["edu_modules"]
        ),
    ]
    story.append(section_row("education", edu))
    story.append(rule(before=8, after=10))

    # ── SKILLS ────────────────────────────────────────────────────────────────
    skills_l = [
        "Python (scripting, data pipelines, automation)",
        "AI/LLM Integration &amp; Prompt Engineering",
        "Data Pipeline Design &amp; Ingest Workflows",
        "Mining Sector Domain Knowledge (Zambia)",
    ]
    skills_r = [
        "System Design &amp; End-to-End Ownership",
        "Financial Data Analysis &amp; Modelling",
        "Technical Communication with Domain Experts",
        "International Supply Chain &amp; Procurement",
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
