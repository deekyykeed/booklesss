"""
Booklesss Lesson PDF — Step 2.1: Advanced Investment Appraisal (APV, MIRR, Capital Rationing)
Course: BAC4301 Corporate Finance
Style: Deep navy-purple cover, white body, crimson accent, DejaVuSerif display, LiberationSans body.
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
import os, sys

# ─────────────────────────────────────────────
#  FONTS
# ─────────────────────────────────────────────
FD = "/usr/share/fonts/truetype/dejavu"
FL = "/usr/share/fonts/truetype/liberation"

pdfmetrics.registerFont(TTFont("Georgia",        FD + "/DejaVuSerif.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold",   FD + "/DejaVuSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Italic", FD + "/DejaVuSerif-Italic.ttf"))
pdfmetrics.registerFontFamily("Georgia", normal="Georgia", bold="Georgia-Bold", italic="Georgia-Italic")

pdfmetrics.registerFont(TTFont("Body",        FL + "/LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Body-Bold",   FL + "/LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Body-Italic", FL + "/LiberationSans-Italic.ttf"))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold", italic="Body-Italic")

# ─────────────────────────────────────────────
#  COLOURS — CF PALETTE (crimson/navy-purple)
# ─────────────────────────────────────────────
C_DARK      = colors.HexColor("#1A1A2E")
C_CRIMSON   = colors.HexColor("#E94560")
C_CRIMSON_DK= colors.HexColor("#9B2335")
C_GHOST     = colors.HexColor("#251F35")
C_INK       = colors.HexColor("#111827")
C_STEEL     = colors.HexColor("#6B7280")
C_MIST      = colors.HexColor("#9CA3AF")
C_RULE      = colors.HexColor("#E5E7EB")
C_WHITE     = colors.white

BG_DISCUSS  = colors.HexColor("#FFF5F5")
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

CHANNEL_NAME = "cf-investment"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

CF_BASE = "/sessions/brave-funny-mayer/mnt/Booklesss/courses/Corporate Finance/BAC4301 - Corporate Finance"
OUT_DIR  = os.path.join(CF_BASE, "content", "lesson-02-advanced-investment-appraisal")
OUT_PATH = os.path.join(OUT_DIR, "Step 2.1 - Advanced Investment Appraisal.pdf")

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def make_styles():
    return {
        "cover_eyebrow": ParagraphStyle("cover_eyebrow",
            fontName="Body-Bold", fontSize=7.5, textColor=C_CRIMSON,
            leading=11, spaceAfter=10, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Georgia-Bold", fontSize=28, textColor=C_WHITE,
            leading=34, spaceAfter=10, alignment=TA_LEFT),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Body", fontSize=10, textColor=C_MIST,
            leading=15, spaceAfter=0, alignment=TA_LEFT),
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Body-Bold", fontSize=7, textColor=C_CRIMSON,
            leading=10, spaceAfter=3, spaceBefore=18, alignment=TA_LEFT),
        "h2": ParagraphStyle("h2",
            fontName="Georgia-Bold", fontSize=15, textColor=C_INK,
            leading=19, spaceAfter=8, alignment=TA_LEFT),
        "h3": ParagraphStyle("h3",
            fontName="Body-Bold", fontSize=11, textColor=C_STEEL,
            leading=15, spaceAfter=5, spaceBefore=10, alignment=TA_LEFT),
        "body": ParagraphStyle("body",
            fontName="Body", fontSize=10, textColor=C_INK,
            leading=16.5, spaceAfter=6, alignment=TA_LEFT),
        "bullet": ParagraphStyle("bullet",
            fontName="Body", fontSize=10, textColor=C_INK,
            leading=16.5, spaceAfter=4, leftIndent=14, alignment=TA_LEFT),
        "caption": ParagraphStyle("caption",
            fontName="Body-Italic", fontSize=8, textColor=C_MIST,
            leading=12, spaceAfter=4, alignment=TA_LEFT),
        "warn_text": ParagraphStyle("warn_text",
            fontName="Body", fontSize=9.5, textColor=C_WARN_TXT,
            leading=15, alignment=TA_LEFT),
        "info_text": ParagraphStyle("info_text",
            fontName="Body", fontSize=9.5, textColor=C_INFO_TXT,
            leading=15, alignment=TA_LEFT),
        "note_text": ParagraphStyle("note_text",
            fontName="Body", fontSize=9.5, textColor=C_NOTE_TXT,
            leading=15, alignment=TA_LEFT),
        "formula": ParagraphStyle("formula",
            fontName="Body-Bold", fontSize=10, textColor=C_CRIMSON_DK,
            leading=16, alignment=TA_LEFT),
        "th": ParagraphStyle("th",
            fontName="Body-Bold", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "td": ParagraphStyle("td",
            fontName="Body", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "outcome": ParagraphStyle("outcome",
            fontName="Body", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=5, leftIndent=14, alignment=TA_LEFT),
        "next_step": ParagraphStyle("next_step",
            fontName="Body-Bold", fontSize=9.5, textColor=C_STEEL,
            leading=14, spaceBefore=14, alignment=TA_LEFT),
        "community": ParagraphStyle("community",
            fontName="Body", fontSize=9.5, textColor=C_STEEL,
            leading=15, spaceAfter=5, alignment=TA_LEFT),
        "community_link": ParagraphStyle("community_link",
            fontName="Body-Bold", fontSize=9.5, textColor=C_CRIMSON_DK,
            leading=15, alignment=TA_LEFT),
        "discuss_q": ParagraphStyle("discuss_q",
            fontName="Body-Italic", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, alignment=TA_LEFT),
        "community_nudge": ParagraphStyle("community_nudge",
            fontName="Body-Italic", fontSize=8.5, textColor=C_CRIMSON_DK,
            leading=14, spaceAfter=0, alignment=TA_LEFT),
    }

ST = make_styles()

# ─────────────────────────────────────────────
#  CANVAS CALLBACKS
# ─────────────────────────────────────────────
def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(C_CRIMSON)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.setFont("Georgia-Bold", 140)
    canvas.setFillColor(C_GHOST)
    canvas.drawRightString(W - MX, MY + 40, "2.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_CRIMSON)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "2.1 — Advanced Investment Appraisal")
    canvas.drawRightString(W - MX, H - MY + 7, "v1 · March 2026")
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFont("Body", 7.5)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(W / 2, MY - 14, "BAC4301 — Corporate Finance")
    canvas.drawRightString(W - MX, MY - 14, f"Page {page_num}")
    canvas.restoreState()

# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────
def hairline():
    return HRFlowable(width="100%", thickness=0.5, color=C_CRIMSON, spaceAfter=10, spaceBefore=4)

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
    styles_map = {
        "warn": (BG_WARN, C_WARN_TXT, ST["warn_text"], ""),
        "info": (BG_INFO, C_INFO_TXT, ST["info_text"], ""),
        "note": (BG_NOTE, C_NOTE_TXT, ST["note_text"], ""),
    }
    bg, border_col, st, prefix = styles_map.get(style, styles_map["info"])
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

def discussion_question_with_nudge(questions_text, nudge_text):
    q = Paragraph(questions_text, ST["discuss_q"])
    nudge = Paragraph(nudge_text, ST["community_nudge"])
    t = Table([[q], [nudge]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_DISCUSS),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_CRIMSON),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])

def community_closer():
    elements = [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "This is one step in the Corporate Finance series running in the Booklesss study group on Slack. "
            "The channel for this topic is <b>#cf-investment</b> — that's where students going through "
            "BAC4301 are working through this material together, sharing past paper questions, and picking "
            "apart problems like the ones in this step.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            f'If you\'re already there, you know where to find it. '
            f'If not, <link href="{INVITE_URL}"><u><b>join the group here.</b></u></link>',
            ST["community_link"]),
    ]
    return elements

def formula_box(lines):
    content = [Paragraph(line, ST["formula"]) for line in lines]
    inner = Table([[item] for item in content], colWidths=[CONTENT_W - 22])
    inner.setStyle(TableStyle([
        ('TOPPADDING',    (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING',   (0,0), (-1,-1), 0),
        ('RIGHTPADDING',  (0,0), (-1,-1), 0),
    ]))
    outer = Table([[inner]], colWidths=[CONTENT_W])
    outer.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), colors.HexColor("#F5F0E8")),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_CRIMSON),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([outer, Spacer(1, 10)])

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
        ('LINEBELOW',     (0,0), (-1, 0), 1,   C_CRIMSON),
    ]))
    return KeepTogether([Spacer(1, 8), t, Spacer(1, 10)])

# ─────────────────────────────────────────────
#  DOCUMENT BUILD
# ─────────────────────────────────────────────
def build():
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4, topMargin=MY, bottomMargin=MY, leftMargin=MX, rightMargin=MX)

    cover_template = PageTemplate(
        id="cover",
        frames=[Frame(MX, MY, CONTENT_W, H - 2*MY)],
        onPageEnd=cover_bg,
        pagesize=A4
    )

    body_template = PageTemplate(
        id="body",
        frames=[Frame(MX, MY, CONTENT_W, H - 2*MY)],
        onPageEnd=body_page,
        pagesize=A4
    )

    doc.addPageTemplates([cover_template, body_template])

    story = []

    # ── COVER PAGE ──────────────────────────────────────────────
    story.append(Spacer(1, 60))
    story.append(Paragraph("Advanced Investment Appraisal", ST["cover_title"]))
    story.append(Paragraph("APV, MIRR, and Capital Rationing", ST["cover_sub"]))
    story.append(Spacer(1, 300))
    story.append(Paragraph("STEP 2.1", ST["cover_eyebrow"]))
    story.append(Paragraph("Corporate Finance (BAC4301)", ST["cover_sub"]))
    story.append(PageBreak())
    doc.pageTemplates[0].id = "body"

    # ── SECTION 1: Limitations of Basic NPV ──────────────────────
    story += section("MOTIVATION", "Why Basic NPV Isn't Always Enough")
    story.append(body(
        "In Step 1.1, we assumed the firm was all-equity financed and that the capital structure (debt-to-equity ratio) didn't change. "
        "In reality, most firms borrow money. Debt creates a tax shield (interest is tax-deductible), and it also affects the discount rate. "
        "When a project is financed partly by debt, the basic NPV approach — which uses WACC (weighted average cost of capital, Step 4.1) — "
        "implicitly assumes the capital structure is constant."
    ))
    story.append(body(
        "But what if you're evaluating a project that significantly changes the firm's debt level? "
        "Or a subsidiary in another country with its own financing rules? In these cases, the adjusted present value (APV) method is clearer."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 2: Adjusted Present Value (APV) ──────────────────
    story += section("ADVANCED", "Adjusted Present Value (APV)")
    story.append(body(
        "APV separates the value of a project into two parts: (1) the base case value if the project were all-equity financed, "
        "and (2) the value of financing side effects (tax shields, subsidies, etc.)."
    ))
    story.append(formula_box([
        "APV  =  NPV(all-equity) + PV(Financing Side Effects)",
        "",
        "where NPV(all-equity) uses the unlevered cost of equity (Ku), not WACC.",
    ]))
    story.append(Spacer(1, 8))

    story.append(h3("Step-by-Step APV Calculation"))
    story.append(body("<b>Step 1:</b> Calculate the base-case FCF as in Step 1.1, but discount at Ku (the unlevered cost of equity). "
        "This is the project's value as if it were 100% equity-financed."))
    story.append(body("<b>Step 2:</b> Calculate the PV of tax shields and other financing effects. "
        "The most common is the tax shield on debt: PV(Tax Shield) = Debt × Tax Rate. "
        "(Intuitively: if the firm borrows ZMW 1 million at 30% tax rate, it saves ZMW 300,000 in taxes per year forever, worth ZMW 300,000 / Ku."))
    story.append(body("<b>Step 3:</b> Sum the base case NPV and the financing side effects."))
    story.append(Spacer(1, 10))

    story.append(h3("Worked Example: Mining Project with Debt Financing"))
    story.append(body(
        "The copper project from Step 1.1 is being financed with ZMW 1,500,000 debt and ZMW 1,000,000 equity (50/50). "
        "Unlevered cost of equity (Ku) is 9%. Tax rate is 30%."
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>Step 1: Base-Case NPV (all-equity, discount at Ku = 9%)</b>", ST["h3"]))
    apv_calc1 = [
        ["Year", "FCF (ZMW)", "Discount Factor (9%)", "PV (ZMW)"],
        ["0", "−2,500,000", "1.000", "−2,500,000"],
        ["1", "1,040,000", "0.917", "954,080"],
        ["2", "1,132,000", "0.842", "953,144"],
        ["3", "1,195,750", "0.772", "923,159"],
        ["4", "1,271,250", "0.708", "900,246"],
        ["5 (FCF + TV)", "28,425,100", "0.649", "18,459,989"],
        ["", "", "<b>NPV (all-equity)</b>", "<b>19,690,618</b>"],
    ]
    story.append(table_std(apv_calc1, [1.8*cm, 2.5*cm, 2.8*cm, 2.5*cm]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>Step 2: PV of Tax Shield on Debt</b>", ST["h3"]))
    story.append(body(
        "Debt = ZMW 1,500,000, Tax Rate = 30%. Assuming the debt is permanent (perpetual):"
    ))
    story.append(formula_box([
        "PV(Tax Shield)  =  Debt × Tax Rate  /  Cost of Debt",
        "",
        "Assume cost of debt is 6%. Then:",
        "PV(Tax Shield) = 1,500,000 × 0.30 / 0.06 = ZMW 7,500,000",
    ]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>Step 3: APV</b>", ST["h3"]))
    story.append(formula_box([
        "APV  =  19,690,618 + 7,500,000  =  ZMW 27,190,618",
    ]))
    story.append(body(
        "With debt financing, the project's value is ZMW 27.19 million (versus ZMW 19.35 million all-equity). "
        "The difference is the tax shield value of borrowing — a free lunch created by the tax system."
    ))
    story.append(Spacer(1, 12))

    story.append(h3("When to Use APV"))
    story.append(bullet("The project changes the firm's leverage significantly (not just a small change)"))
    story.append(bullet("The project has a different risk profile than the firm (e.g., a foreign subsidiary)"))
    story.append(bullet("The firm is in financial distress (using WACC becomes problematic)"))
    story.append(bullet("Subsidized financing, grants, or other side effects are material"))
    story.append(Spacer(1, 12))

    # ── SECTION 3: Modified IRR (MIRR) ───────────────────────────
    story += section("ALTERNATIVES", "Modified Internal Rate of Return (MIRR)")
    story.append(body(
        "Recall from Step 1.1 that IRR has a flaw: it assumes cash flows are reinvested at the IRR itself. "
        "For a high-IRR project, that's unrealistic. The modified IRR (MIRR) solves this by explicitly specifying "
        "the reinvestment rate and the borrowing rate."
    ))
    story.append(formula_box([
        "MIRR = [PV(Negative CFs at borrowing rate) / FV(Positive CFs at reinvestment rate)] ^ (1/n) - 1",
    ]))
    story.append(Spacer(1, 6))

    story.append(h3("Worked Example"))
    story.append(body(
        "Copper project: Initial outlay ZMW 2,500,000. Year 1–5 FCF as before. "
        "Borrowing rate 6%, reinvestment rate 8%, 5-year horizon."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 1:</b> PV of negative cash flows at 6% borrowing rate = ZMW 2,500,000 (only the initial outlay). "
        "<br/><b>Step 2:</b> FV of positive cash flows at 8% reinvestment rate. Grow each year's FCF to Year 5 at 8%:"
    ))
    story.append(Spacer(1, 4))
    mirr_calc = [
        ["Year", "FCF (ZMW)", "Years to End", "FV at 8% (ZMW)"],
        ["1", "1,040,000", "4", "1,414,269"],
        ["2", "1,132,000", "3", "1,425,926"],
        ["3", "1,195,750", "2", "1,392,572"],
        ["4", "1,271,250", "1", "1,373,150"],
        ["5", "28,425,100", "0", "28,425,100"],
        ["", "", "<b>Total FV</b>", "<b>33,631,017</b>"],
    ]
    story.append(table_std(mirr_calc, [1.8*cm, 2.2*cm, 2*cm, 2.8*cm]))
    story.append(Spacer(1, 8))

    story.append(formula_box([
        "MIRR = [2,500,000 / 33,631,017] ^ (1/5) - 1",
        "",
        "MIRR = [0.07435] ^ (0.20) - 1 = 0.189 or 18.9%",
    ]))
    story.append(body(
        "MIRR is 18.9%, which is more conservative than the unadjusted IRR of 34.2%. "
        "It's also more realistic because it uses the borrowing and reinvestment rates, not the IRR itself."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 4: Capital Rationing ─────────────────────────────
    story += section("CONSTRAINTS", "Capital Rationing")
    story.append(body(
        "In an ideal world, a firm can borrow as much as it needs at the market rate. In practice, firms face limits: "
        "lenders won't advance more, management fears overleverage, or the firm's board caps the investment budget. "
        "This is capital rationing."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Hard vs Soft Rationing"))
    story.append(bullet("<b>Hard rationing:</b> The firm cannot borrow more, no matter what (external constraint)."))
    story.append(bullet("<b>Soft rationing:</b> Management self-imposes a budget limit (internal constraint)."))
    story.append(Spacer(1, 8))

    story.append(h3("Single-Period Rationing: Profitability Index"))
    story.append(body(
        "If the firm has a fixed budget in Year 0 and must choose which projects to accept, use the profitability index (PI). "
        "Rank projects by PI and select the mix with the highest total NPV within the budget."
    ))
    story.append(formula_box([
        "Profitability Index (PI)  =  PV of Future Cash Flows  /  Initial Investment",
        "",
        "or equivalently:",
        "",
        "PI  =  (NPV + Initial Investment)  /  Initial Investment",
    ]))
    story.append(Spacer(1, 8))

    story.append(h3("Worked Example: Project Selection Under Budget Constraint"))
    story.append(body(
        "A Zambian firm has ZMW 5,000,000 to invest and is evaluating four projects. All have a 10% discount rate."
    ))
    story.append(Spacer(1, 4))
    pi_data = [
        ["Project", "Initial Cost (ZMW)", "PV of Flows (ZMW)", "NPV (ZMW)", "PI"],
        ["A", "2,000,000", "2,600,000", "600,000", "1.30"],
        ["B", "2,000,000", "2,400,000", "400,000", "1.20"],
        ["C", "1,500,000", "1,875,000", "375,000", "1.25"],
        ["D", "1,000,000", "1,080,000", "80,000", "1.08"],
    ]
    story.append(table_std(pi_data, [1.5*cm, 2.2*cm, 2.2*cm, 1.8*cm, 1.2*cm]))
    story.append(Spacer(1, 8))

    story.append(body(
        "Ranking by PI: A (1.30) > C (1.25) > B (1.20) > D (1.08). "
        "With ZMW 5 million:"
    ))
    story.append(Spacer(1, 4))
    story.append(bullet("Accept A (cost ZMW 2 million) and C (cost ZMW 1.5 million) and B (cost ZMW 1.5 million). Total cost = ZMW 5 million. Total NPV = ZMW 1,375,000."))
    story.append(bullet("Do not accept D; it would push the total to ZMW 6 million, exceeding the budget."))
    story.append(Spacer(1, 10))

    story.append(h3("Multi-Period Rationing: Linear Programming"))
    story.append(body(
        "If the budget constraint spans multiple periods, linear programming formulates the problem: "
        "Maximize total NPV subject to budget constraints in Year 0, Year 1, etc. and logical constraints (e.g., Project B only if Project A is accepted). "
        "This is typically solved with Excel Solver or specialized software."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 5: Real Options (Conceptual) ────────────────────
    story += section("BEYOND", "A Glimpse: Real Options & Monte Carlo")
    story.append(h3("Real Options"))
    story.append(body(
        "Static NPV assumes a binary decision: accept or reject now. But real projects have flexibility. "
        "You can expand if sales are strong, defer if the market is soft, or abandon if losses mount. "
        "Real options theory values this flexibility."
    ))
    story.append(Spacer(1, 4))
    story.append(bullet("<b>Option to expand:</b> If the copper mine is more productive than expected, you can expand operations next year. NPV > static forecast."))
    story.append(bullet("<b>Option to defer:</b> If commodity prices are volatile, deferring investment by a year gives you more information. NPV of waiting can exceed NPV of investing now."))
    story.append(bullet("<b>Option to abandon:</b> If the project falters, you can sell the equipment or exit. This limits downside risk, raising NPV."))
    story.append(body(
        "Quantifying these options requires stochastic models (e.g., binomial trees, Monte Carlo) — beyond this step, but essential for volatile, long-duration projects."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Monte Carlo Simulation (Conceptual)"))
    story.append(body(
        "Monte Carlo models the uncertainty in cash flows by running thousands of scenarios. Each scenario draws random values for revenue, costs, and discount rates from probability distributions. "
        "The result is a distribution of NPV outcomes, not just a single point estimate. This shows the probability of loss, the upside potential, and the shape of the risk."
    ))
    story.append(body(
        "For a mining project, Monte Carlo might show: 80% probability of NPV > 0, 50% probability of NPV > ZMW 10 million, worst case NPV = −ZMW 2 million. "
        "This is richer than the deterministic NPV of ZMW 19.35 million alone."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 6: Cross-References ────────────────────────────
    story += section("LOOKBACK & FORWARD", "Connecting the Pieces")
    story.append(body(
        "<b>Step 1.1</b> introduced NPV and IRR as the core tools. Step 2.1 extends 1.1 with APV (to handle complex financing), "
        "MIRR (to fix IRR's reinvestment flaw), and capital rationing (to handle budget limits)."
    ))
    story.append(body(
        "<b>Step 4.1 (Cost of Capital)</b> will show how to derive the discount rate (WACC and Ku using CAPM). "
        "The discount rate is the linchpin: it translates future cash into today's value. APV uses Ku; the WACC approach uses the blended rate."
    ))
    story.append(body(
        "<b>Step 5.1 (Capital Structure)</b> will explore the optimal debt-to-equity ratio. "
        "APV's tax shield benefit of debt drives that discussion — more debt = more tax shields, but also more financial risk."
    ))
    story.append(Spacer(1, 12))

    # ── DISCUSSION & CLOSING ────────────────────────────────────
    story.append(PageBreak())

    story.append(discussion_question_with_nudge(
        "<i>1. A Zambian energy firm is evaluating a wind farm. All-equity NPV is ZMW 25 million (discount rate 10%). "
        "The firm will finance it with ZMW 30 million debt (cost 6%, tax rate 30%) and ZMW 20 million equity. "
        "Calculate the APV and explain why it differs from the all-equity NPV. What is the value of the debt tax shield? </i><br/><br/>"
        "<i>2. Three projects have NPVs of ZMW 5M, ZMW 3M, and ZMW 2M with initial costs ZMW 6M, ZMW 5M, and ZMW 4M respectively. "
        "The firm has ZMW 10M to invest. Which projects should be chosen? Calculate the profitability index for each and rank them. "
        "Does highest NPV always mean highest PI? Why or why not?</i>",
        "Bring your answers to <b>#cf-investment</b> on Slack."))

    story.append(Spacer(1, 12))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Adjusted Present Value (APV)", "Project value separated into base-case (all-equity) NPV plus financing side effects"],
        ["Unlevered cost of equity (Ku)", "Cost of equity assuming the project is financed entirely by equity (no debt)"],
        ["Tax shield (debt)", "Annual tax saving from deductible interest expense"],
        ["Modified IRR (MIRR)", "IRR that explicitly specifies reinvestment and borrowing rates, more realistic than IRR"],
        ["Capital rationing", "Constraint on the amount of capital available for investment"],
        ["Hard rationing", "External constraint; firm cannot borrow more at any price"],
        ["Soft rationing", "Internal constraint; management self-imposes a budget limit"],
        ["Profitability Index (PI)", "Ratio of PV of future cash flows to initial investment; used to rank projects under capital constraints"],
        ["Single-period rationing", "Budget constraint applies only in Year 0 (e.g., ZMW 5M to invest today)"],
        ["Multi-period rationing", "Budget constraints span multiple years; requires linear programming"],
        ["Real option", "Managerial flexibility to expand, defer, or abandon a project in response to market changes"],
        ["Option to expand", "Value of the right to scale up a project if conditions are favourable"],
        ["Option to defer", "Value of waiting to invest, conditional on new information"],
        ["Option to abandon", "Value of exiting a project to limit losses or redeploy capital elsewhere"],
        ["Monte Carlo simulation", "Stochastic model that generates distribution of outcomes by running thousands of scenarios"],
    ]
    story.append(table_std(terms, [4*cm, CONTENT_W - 4*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Distinguish between base-case NPV (all-equity) and APV, and apply APV when financing side effects are material",
        "Calculate the PV of tax shields on debt and other financing benefits",
        "Understand MIRR as an improvement on IRR and calculate MIRR using explicit reinvestment and borrowing rates",
        "Distinguish between hard and soft capital rationing and explain when each arises",
        "Apply the profitability index to rank and select projects under single-period budget constraints",
        "Identify when linear programming is needed for multi-period capital rationing",
        "Conceptually understand real options (expand, defer, abandon) and why static NPV can undervalue flexible projects",
        "Explain how Monte Carlo simulation extends deterministic NPV by showing the distribution of outcomes under uncertainty",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 3.1 — International Project Appraisal",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
