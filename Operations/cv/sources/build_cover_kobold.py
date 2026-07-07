"""
Dikhilani Mvula — Cover Letter for KoBold Metals Software Engineer role
Brand treatment: cream + grain, Parastoo-Bold (name) + Aptos (body)
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, HRFlowable
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
OUT_PATH  = os.path.join(_KHADZIKA, "_Admin", "CV", "Dikhilani_Mvula_CoverLetter_KoBold.pdf")

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

_grain = ImageReader(GRAIN) if os.path.exists(GRAIN) else None

# ── COLOURS ───────────────────────────────────────────────────────────────────
C_BG    = colors.HexColor("#FFFEF2")
C_INK   = colors.HexColor("#121212")
C_LABEL = colors.HexColor("#5A5652")
C_DIM   = colors.HexColor("#8A8680")
C_RULE  = colors.HexColor("#E0DACB")

# ── PAGE GEOMETRY ─────────────────────────────────────────────────────────────
W, H      = A4
MX        = 2.2 * cm
MY        = 1.6 * cm
CONTENT_W = W - 2 * MX

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
        fontName="Title-Bold", fontSize=28, textColor=C_INK, leading=34),
    "meta": ParagraphStyle("meta",
        fontName="Body", fontSize=10, textColor=C_DIM, leading=15),
    "date": ParagraphStyle("date",
        fontName="Body-Italic", fontSize=10, textColor=C_DIM, leading=15),
    "to": ParagraphStyle("to",
        fontName="Body-Bold", fontSize=10.5, textColor=C_INK, leading=16),
    "body": ParagraphStyle("body",
        fontName="Body", fontSize=10.5, textColor=C_INK,
        leading=17, spaceAfter=10, alignment=TA_JUSTIFY),
    "sign_name": ParagraphStyle("sign_name",
        fontName="Body-Bold", fontSize=11, textColor=C_INK, leading=16),
    "sign_meta": ParagraphStyle("sign_meta",
        fontName="Body", fontSize=10, textColor=C_DIM, leading=15),
}

def rule(before=6, after=12, thick=0.5):
    return HRFlowable(width="100%", thickness=thick, color=C_RULE,
                      spaceBefore=before, spaceAfter=after)

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

    # ── HEADER ────────────────────────────────────────────────────────────────
    story.append(Paragraph("Dikhilani Mvula", ST["name"]))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "+260 763 665 966  ·  deekymvula@gmail.com  ·  Kitwe, Zambia",
        ST["meta"]
    ))
    story.append(rule(before=10, after=14, thick=0.8))

    # ── DATE + ADDRESSEE ──────────────────────────────────────────────────────
    story.append(Paragraph("1 July 2026", ST["date"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Hiring Team", ST["to"]))
    story.append(Paragraph("KoBold Metals · Zambia", ST["to"]))
    story.append(Spacer(1, 20))

    # ── SALUTATION ────────────────────────────────────────────────────────────
    story.append(Paragraph("Dear Hiring Team,", ST["body"]))
    story.append(Spacer(1, 2))

    # ── BODY ──────────────────────────────────────────────────────────────────
    story.append(Paragraph(
        "Twelve months inside Kansanshi Mining Plc — First Quantum's copper operation "
        "in Solwezi — taught me something that most software engineers never see: "
        "how a large mining organisation actually handles data. "
        "What flows well, where manual bottlenecks form, and where a better-designed system "
        "would directly change the decisions geologists and operations teams make. "
        "That ground-level exposure is what draws me to KoBold's Data Systems Engineering role, "
        "and it is what I believe I bring that most applicants do not.",
        ST["body"]
    ))

    story.append(Paragraph(
        "On the technical side, I build Python pipelines. "
        "At Booklesss, an edtech startup I founded, I designed and implemented a fully "
        "automated content pipeline from scratch — raw source material in, structured "
        "publication-ready output out, with AI language models integrated at the processing layer. "
        "Every part of that system — ingest, transformation, asset resolution, output routing — "
        "I designed, built, and continue to operate alone. "
        "The domain is different from mineral exploration data, but the challenge is identical "
        "to what your team works on: making unstructured, inconsistently formatted source "
        "material accessible to both humans and machines.",
        ST["body"]
    ))

    story.append(Paragraph(
        "I am based in Kitwe — forty minutes from active copper operations — and available for any "
        "technical session or site visit the role requires. The practical question I keep returning to "
        "is one I suspect your team thinks about too: what would better data infrastructure actually "
        "change about the exploration decisions being made on the ground in Zambia? "
        "I would welcome the chance to work on that question with your team.",
        ST["body"]
    ))

    story.append(Spacer(1, 20))
    story.append(Paragraph("Yours sincerely,", ST["body"]))
    story.append(Spacer(1, 16))
    story.append(Paragraph("Dikhilani Mvula", ST["sign_name"]))
    story.append(Paragraph("+260 763 665 966  ·  deekymvula@gmail.com", ST["sign_meta"]))

    doc.build(story)
    print("Done: " + OUT_PATH)

if __name__ == "__main__":
    build()
