"""
Booklesss Lesson PDF — Step 1.1: Investment Fundamentals (FCF, NPV)
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
C_DARK      = colors.HexColor("#1A1A2E")  # Deep navy-purple
C_CRIMSON   = colors.HexColor("#E94560")  # Accent crimson
C_CRIMSON_DK= colors.HexColor("#9B2335")  # Dark crimson
C_GHOST     = colors.HexColor("#251F35")  # Ghost number
C_INK       = colors.HexColor("#111827")
C_STEEL     = colors.HexColor("#6B7280")
C_MIST      = colors.HexColor("#9CA3AF")
C_RULE      = colors.HexColor("#E5E7EB")
C_WHITE     = colors.white

BG_DISCUSS  = colors.HexColor("#FFF5F5")  # Discussion box background
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
OUT_DIR  = os.path.join(CF_BASE, "content", "lesson-01-investment-fundamentals")
OUT_PATH = os.path.join(OUT_DIR, "Step 1.1 - Investment Fundamentals.pdf")

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
    canvas.setStrokeColor(C_DARK)
    canvas.setLineWidth(0.5)
    canvas.setFillColor(C_CRIMSON)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.setFont("Georgia-Bold", 140)
    canvas.setFillColor(C_GHOST)
    canvas.drawRightString(W - MX, MY + 40, "1.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_CRIMSON)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "1.1 — Investment Fundamentals (FCF, NPV)")
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
    """Discussion box with questions and community nudge line at bottom."""
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
    """Soft, peer-to-peer mention of the study group."""
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
    return KeepTogether([table_gap := Spacer(1, 8), t, Spacer(1, 10)])

# ─────────────────────────────────────────────
#  DOCUMENT BUILD
# ─────────────────────────────────────────────
def build():
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4, topMargin=MY, bottomMargin=MY, leftMargin=MX, rightMargin=MX)

    # Cover page template
    cover_template = PageTemplate(
        id="cover",
        frames=[Frame(MX, MY, CONTENT_W, H - 2*MY)],
        onPageEnd=cover_bg,
        pagesize=A4
    )

    # Body page template
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
    story.append(Paragraph("Investment Fundamentals", ST["cover_title"]))
    story.append(Paragraph("Free Cash Flows & Net Present Value", ST["cover_sub"]))
    story.append(Spacer(1, 300))
    story.append(Paragraph("STEP 1.1", ST["cover_eyebrow"]))
    story.append(Paragraph("Corporate Finance (BAC4301)", ST["cover_sub"]))
    story.append(PageBreak())
    doc.pageTemplates[0].id = "body"

    # ── SECTION 1: Why Investment Appraisal Matters ──────────────
    story += section("FOUNDATION", "Why Investment Appraisal Matters")
    story.append(body(
        "Every business, every person, faces a capital allocation decision: where should we deploy our scarce money to generate the most value? "
        "Should we expand the factory or upgrade the equipment? Should we enter the South African market or stay focused in Zambia? "
        "Should we acquire competitors or invest in research? These questions matter because capital is finite — once deployed, it cannot be redeployed elsewhere."
    ))
    story.append(body(
        "Investment appraisal is the discipline that answers these questions rigorously. It provides a framework to evaluate projects and decisions on their economic merit, "
        "independent of politics, ego, or hope. At its core: Does this investment create value or destroy it?"
    ))
    story.append(Spacer(1, 8))

    story.append(h3("The Central Question"))
    story.append(body(
        "Imagine you have ZMW 1,000,000 in the bank earning 5% per annum. "
        "A manager proposes a project that requires ZMW 1,000,000 upfront and will return ZMW 1,040,000 in one year. "
        "Should you accept the project? On the surface, both yield ZMW 40,000 in returns. But look deeper:"
    ))
    story.append(Spacer(1, 4))
    story.append(bullet("Bank: ZMW 1,040,000 with certainty, 5% return"))
    story.append(bullet("Project: ZMW 1,040,000 with risk, uncertain timing, management effort required"))
    story.append(body(
        "Without understanding the discount rate — the 'hurdle rate' that reflects your cost of capital — you cannot judge whether the project's return exceeds what you could earn elsewhere. "
        "This lesson shows you how to calculate whether a project is worth doing. (The discount rate itself is derived in Step 4.1 using WACC and CAPM.)"
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 2: Free Cash Flow vs Accounting Profit ──────────
    story += section("CONCEPTS", "Free Cash Flow vs Accounting Profit")
    story.append(body(
        "Here's a trap many managers fall into: they use accounting profit to evaluate projects. Accountants measure profit by matching expenses to revenues in the period incurred. "
        "But investment decisions must be based on cash, not accruals. Here's why:"
    ))
    story.append(Spacer(1, 4))
    story.append(bullet("<b>Depreciation</b> is an accounting expense, not a cash outflow. When you bought the machine three years ago, the cash left your pocket then. Today, depreciation is a non-cash deduction that reduces taxable profit but not cash."))
    story.append(bullet("<b>Accrued revenue</b> counts as profit even if the cash hasn't arrived yet. A customer owes you ZMW 50,000 but hasn't paid — accounting profit rises, but your cash position doesn't."))
    story.append(bullet("<b>Working capital changes</b> tie up cash. Stockpiling inventory before a sale increase looks fine in the income statement but drains cash now."))
    story.append(body(
        "Free Cash Flow (FCF) is the cash available to all investors after the firm has paid its operating expenses, taxes, and reinvested in working capital and fixed assets. "
        "It's the true measure of value creation."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("The FCF Formula"))
    story.append(formula_box([
        "FCF  =  EBIT × (1 − Tax Rate) + Depreciation − Capital Expenditure − Change in Net Working Capital",
        "",
        "or equivalently:",
        "",
        "FCF  =  Operating Cash Flow − Capital Expenditure",
    ]))

    story.append(h3("What Each Component Means"))
    fcf_data = [
        ["Component", "Meaning"],
        ["EBIT × (1-t)", "Earnings before interest and tax, taxed at the corporate rate. This is the after-tax operating profit."],
        ["+ Depreciation", "Non-cash charge. Added back because cash left when the asset was bought, not when depreciated."],
        ["− CapEx", "Cash outflows for equipment, buildings, vehicles — the investments that drive future growth."],
        ["− ΔNWC", "Increase in net working capital (receivables + inventory − payables). A rise in NWC ties up cash."],
    ]
    story.append(table_std(fcf_data, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 10))

    story.append(h3("Worked Example: A Zambian Mining Project"))
    story.append(body(
        "A company is considering a small-scale copper extraction project in the Copperbelt. It will run for 5 years."
    ))
    story.append(Spacer(1, 4))
    example_data = [
        ["Year", "1", "2", "3", "4", "5"],
        ["Revenue (ZMW)", "2,400,000", "2,520,000", "2,645,000", "2,775,000", "2,910,000"],
        ["Operating costs", "1,200,000", "1,260,000", "1,322,500", "1,387,500", "1,455,000"],
        ["EBIT", "1,200,000", "1,260,000", "1,322,500", "1,387,500", "1,455,000"],
        ["Tax @ 30%", "360,000", "378,000", "396,750", "416,250", "436,500"],
        ["EBIT × (1-t)", "840,000", "882,000", "925,750", "971,250", "1,018,500"],
        ["+ Depreciation", "300,000", "300,000", "300,000", "300,000", "300,000"],
        ["− CapEx", "0", "0", "0", "0", "0"],
        ["− ΔNWC", "100,000", "50,000", "30,000", "0", "−180,000"],
        ["<b>FCF</b>", "<b>1,040,000</b>", "<b>1,132,000</b>", "<b>1,195,750</b>", "<b>1,271,250</b>", "<b>1,498,500</b>"],
    ]
    story.append(table_std(example_data, [2.2*cm] * 6))
    story.append(Spacer(1, 8))

    story.append(body(
        "Year 5 shows a negative ΔNWC because the project is winding down and receivables are collected; cash is released."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 3: Terminal Value ──────────────────────────────
    story += section("VALUATION", "Terminal Value")
    story.append(body(
        "Most projects run for a finite period (5, 10, 20 years). But the firm does not shut down at the end of that period — it continues, and that continuing value must be captured. "
        "Terminal value is the value of all cash flows from the end of the forecast period to perpetuity."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Method 1: Perpetuity Growth"))
    story.append(body(
        "Assume the project generates a steady-state FCF that grows at a constant rate <i>g</i> forever:"
    ))
    story.append(formula_box([
        "Terminal Value (Year n)  =  FCF(Year n+1) / (Discount Rate − g)",
        "",
        "Example: FCF in year 5 is ZMW 1,498,500. Assume 2.5% growth and 8% discount rate.",
        "Terminal Value = 1,498,500 × (1.025) / (0.08 − 0.025)",
        "               = 1,535,963 / 0.055",
        "               = ZMW 27,926,600",
    ]))
    story.append(body(
        "The perpetuity formula assumes the project settles into a stable growth rate forever. This works for mature, stable businesses. "
        "For high-growth or cyclical projects, consider Method 2."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Method 2: Exit Multiple"))
    story.append(body(
        "Assume the project (or firm) is sold at the end of Year n for a multiple of EBITDA or FCF. "
        "For example, if mining projects in the region trade at 6× EBITDA:"
    ))
    story.append(formula_box([
        "Terminal Value (Year 5)  =  EBITDA(Year 5) × Exit Multiple",
        "",
        "If EBITDA in Year 5 is ZMW 1,755,000 and the exit multiple is 6×:",
        "Terminal Value = 1,755,000 × 6 = ZMW 10,530,000",
    ]))
    story.append(body(
        "The exit multiple approach is practical when comparable sales data is available. It's also less sensitive to long-run assumptions about discount rates and growth."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 4: Net Present Value (NPV) ────────────────────
    story += section("DECISION", "Net Present Value (NPV)")
    story.append(body(
        "NPV measures the value created by a project in today's money. It is the sum of all discounted cash flows, including the initial investment and terminal value."
    ))
    story.append(formula_box([
        "NPV  =  −Initial Outlay  +  Σ [ FCF(t) / (1 + r)<sup>t</sup> ]  +  TV / (1 + r)<sup>n</sup>",
        "",
        "where r is the discount rate, t is the year, and TV is terminal value in year n.",
    ]))
    story.append(Spacer(1, 6))

    story.append(h3("Decision Rule"))
    story.append(bullet("<b>NPV > 0</b>: Accept the project. It creates value."))
    story.append(bullet("<b>NPV = 0</b>: Indifferent. The project returns exactly the discount rate."))
    story.append(bullet("<b>NPV < 0</b>: Reject the project. It destroys value."))
    story.append(Spacer(1, 8))

    story.append(h3("Worked Example: The Copper Project (Continued)"))
    story.append(body(
        "Initial outlay: ZMW 2,500,000 (now, Year 0). Discount rate: 8%. Terminal value (Year 5): ZMW 27,926,600 (perpetuity method)."
    ))
    story.append(Spacer(1, 4))
    npv_calc = [
        ["Year", "FCF (ZMW)", "Discount Factor", "Present Value (ZMW)"],
        ["0", "−2,500,000", "1.000", "−2,500,000"],
        ["1", "1,040,000", "0.926", "963,440"],
        ["2", "1,132,000", "0.857", "970,324"],
        ["3", "1,195,750", "0.794", "949,586"],
        ["4", "1,271,250", "0.735", "934,369"],
        ["5 (FCF)", "1,498,500", "0.681", "1,020,446"],
        ["5 (TV)", "27,926,600", "0.681", "19,013,862"],
        ["", "", "<b>NPV</b>", "<b>19,352,027</b>"],
    ]
    story.append(table_std(npv_calc, [1.8*cm, 2.5*cm, 2.5*cm, 2.8*cm]))
    story.append(Spacer(1, 8))

    story.append(body(
        "NPV = ZMW 19.35 million. The project is worth taking — it creates huge value. "
        "But this assumes the 8% discount rate is correct and the forecasts are accurate. "
        "Sensitivity analysis (Step 4) will test how robust this conclusion is."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 5: Internal Rate of Return (IRR) ──────────────
    story += section("ALTERNATIVES", "Internal Rate of Return (IRR)")
    story.append(body(
        "IRR is the discount rate at which NPV = 0. It's the 'break-even' discount rate. "
        "If the IRR exceeds your cost of capital, the project should be accepted. If it's below, rejected."
    ))
    story.append(body(
        "For the copper project, the IRR is the rate <i>r</i> that solves: "
        "NPV(r) = 0. By trial and error or Excel's IRR function, r ≈ 34.2%."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("When NPV and IRR Agree"))
    story.append(body(
        "When there is one initial outlay followed by positive cash flows, NPV and IRR almost always point to the same decision. "
        "The copper project has NPV > 0 and IRR (34.2%) > discount rate (8%), so both say accept."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("When NPV and IRR Conflict"))
    story.append(body(
        "Conflicts arise with non-conventional cash flows (e.g., large outflows mid-project) or when comparing projects of different scales:"
    ))
    story.append(Spacer(1, 4))
    story.append(bullet("<b>Scale problem:</b> Project A: Invest ZMW 100,000, get IRR 25%. Project B: Invest ZMW 1,000,000, get IRR 15%. "
        "IRR favors A, but B may create more value (higher NPV) because of its larger scale."))
    story.append(bullet("<b>Reinvestment assumption:</b> IRR assumes cash flows are reinvested at the IRR itself. "
        "That's unrealistic. NPV assumes reinvestment at the discount rate, which is more realistic."))
    story.append(body(
        "<b>Golden rule:</b> Always use NPV to make investment decisions. Use IRR to understand the project's inherent return, not as the primary decision tool."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 6: Payback Period ──────────────────────────────
    story += section("SIMPLICITY", "Payback Period & Discounted Payback")
    story.append(body(
        "Payback period is the time it takes for cumulative cash inflows to recover the initial investment. "
        "It's simple and intuitive — managers often use it as a rough sanity check."
    ))
    story.append(Spacer(1, 4))

    pb_data = [
        ["Year", "FCF (ZMW)", "Cumulative (ZMW)"],
        ["0", "−2,500,000", "−2,500,000"],
        ["1", "1,040,000", "−1,460,000"],
        ["2", "1,132,000", "−328,000"],
        ["3", "1,195,750", "867,750"],
    ]
    story.append(table_std(pb_data, [1.8*cm, 2.2*cm, 3*cm]))
    story.append(body(
        "Payback occurs in Year 3 (somewhere between year 2 and 3, more precisely at 2.27 years). "
        "The project recovers its investment in just over two years — reasonable for a mining venture with 5-year life."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Discounted Payback"))
    story.append(body(
        "Discounted payback applies the same logic but uses present values of cash flows. "
        "It's better than payback because it accounts for the time value of money. However, it still ignores cash flows after the payback point — "
        "if the project generates huge value in years 4 and 5, discounted payback misses it."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Verdict"))
    story.append(body(
        "Use payback as a liquidity check (does the project return cash fast?) but never as the primary decision criterion. "
        "A negative-NPV project that pays back in 2 years is still value-destroying."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 7: Inflation & Taxation ────────────────────────
    story += section("REALISM", "Inflation & Taxation in Appraisal")
    story.append(h3("Real vs Nominal Rates (Fisher Equation)"))
    story.append(body(
        "The discount rate and cash flow growth must be consistent. If inflation is 3% per annum:"
    ))
    story.append(formula_box([
        "(1 + Nominal Rate)  =  (1 + Real Rate) × (1 + Inflation Rate)",
        "",
        "If the real discount rate is 5% and inflation is 3%:",
        "Nominal rate = (1.05 × 1.03) − 1 = 8.15%",
    ]))
    story.append(body(
        "<b>Consistency rule:</b> Forecast nominal cash flows (in ZMW today's, projected forward at expected inflation), "
        "and discount at the nominal rate. Or forecast real cash flows (stripped of inflation) and discount at the real rate. Never mix."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Tax Shield on Depreciation"))
    story.append(body(
        "Depreciation is a non-cash deduction that reduces taxable profit. This saves taxes — the tax shield."
    ))
    story.append(formula_box([
        "Annual Tax Shield  =  Depreciation × Tax Rate",
        "",
        "Example: Depreciation ZMW 300,000, tax rate 30%",
        "Tax Shield = 300,000 × 0.30 = ZMW 90,000 per year in tax savings",
    ]))
    story.append(body(
        "These tax savings should be included in the FCF projections to capture the true benefit of the investment."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 8: Sensitivity Analysis ────────────────────────
    story += section("RISK", "Sensitivity Analysis")
    story.append(body(
        "The NPV of ZMW 19.35 million assumes forecasts are perfect. In reality, revenue could be 10% lower, operating costs could be higher, "
        "the discount rate could rise. Sensitivity analysis tests how much NPV changes when key assumptions change."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Spider Diagram"))
    story.append(body(
        "A spider diagram charts NPV against one-at-a-time changes in key variables. "
        "For the copper project, test what happens if:"
    ))
    story.append(Spacer(1, 4))
    story.append(bullet("Revenue is 10% higher/lower: NPV changes to ±?"))
    story.append(bullet("Operating costs are 10% higher/lower: NPV changes to ±?"))
    story.append(bullet("Discount rate is 1% higher/lower: NPV changes to ±?"))
    story.append(body(
        "The variables with the steepest lines in the spider are the most sensitive. If revenue is the steepest, "
        "focus on getting the sales forecast right."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Switching Value"))
    story.append(body(
        "The switching value is the value of a variable at which NPV flips from positive to negative. "
        "Example: At what discount rate does the copper project have NPV = 0? Answer: 34.2% (the IRR). "
        "Switching values tell you the margin of safety for each assumption."
    ))
    story.append(Spacer(1, 12))

    # ── DISCUSSION & CLOSING ────────────────────────────────────
    story.append(PageBreak())

    story.append(discussion_question_with_nudge(
        "<i>1. A Zambian energy company is evaluating a 10-year wind farm project. "
        "Initial outlay is ZMW 50 million. Annual FCF is projected at ZMW 8 million, growing at 2.5%. "
        "Using an 8% discount rate, what is the NPV? How would the decision change if the discount rate was 10%? "
        "Why does the discount rate matter so much? </i><br/><br/>"
        "<i>2. Two mining projects are being compared. Project A: Invest ZMW 5 million, IRR 30%, NPV ZMW 8 million. "
        "Project B: Invest ZMW 50 million, IRR 15%, NPV ZMW 35 million. The company can only fund one. "
        "Which should be chosen, and why is IRR misleading here?</i>",
        "Bring your answers to <b>#cf-investment</b> on Slack."))

    story.append(Spacer(1, 12))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Free Cash Flow (FCF)", "Operating profit after tax, plus non-cash charges, minus reinvestment in assets and working capital"],
        ["EBIT", "Earnings before interest and tax; operating profit"],
        ["Tax Shield", "Tax saving arising from a deductible expense (e.g., depreciation, interest)"],
        ["Net Present Value (NPV)", "Sum of all discounted cash flows; measure of value created by a project"],
        ["Internal Rate of Return (IRR)", "The discount rate at which NPV = 0"],
        ["Discount Rate", "The rate used to convert future cash flows to present value; reflects cost of capital"],
        ["Terminal Value", "Value of all cash flows from the end of the forecast period to perpetuity"],
        ["Perpetuity Growth", "Terminal value calculated by assuming constant growth forever"],
        ["Exit Multiple", "Terminal value calculated by selling the project at a market multiple"],
        ["Payback Period", "Time required for cumulative cash inflows to recover the initial investment"],
        ["Discounted Payback", "Payback period calculated using discounted (present value) cash flows"],
        ["Sensitivity Analysis", "Testing how NPV changes when key assumptions are varied"],
        ["Switching Value", "The value of a variable at which NPV = 0"],
        ["Real Rate of Return", "Return adjusted for inflation"],
        ["Nominal Rate of Return", "Return in actual (not inflation-adjusted) terms"],
        ["Fisher Equation", "Formula relating real rate, nominal rate, and inflation: (1+r<sub>n</sub>) = (1+r<sub>r</sub>) × (1+π)"],
    ]
    story.append(table_std(terms, [4.5*cm, CONTENT_W - 4.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain why capital allocation decisions matter and how investment appraisal addresses the core question of value creation",
        "Distinguish between accounting profit and free cash flow, and calculate FCF from operating data",
        "Identify the components of terminal value and apply perpetuity and exit multiple methods",
        "Calculate NPV and apply the decision rule (accept if NPV > 0)",
        "Understand IRR as the break-even discount rate and explain when NPV and IRR conflict",
        "Apply payback and discounted payback as secondary checks, not primary decision tools",
        "Account for inflation and taxation (tax shields) in appraisal, maintaining consistency between nominal/real rates",
        "Perform sensitivity analysis to identify which assumptions drive the NPV outcome",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 2.1 — Advanced Investment Appraisal (APV, MIRR, Capital Rationing)",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
