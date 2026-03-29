"""
Booklesss Lesson PDF — Step 6.1: Company Valuation
Course: BAC4301 Corporate Finance
Style: Deep navy cover, crimson accent, DejaVuSerif display, LiberationSans body.
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
#  COLOURS — CF Crimson Palette
# ─────────────────────────────────────────────
C_COVER     = colors.HexColor("#1A1A2E")
C_ACCENT    = colors.HexColor("#E94560")
C_ACCENT_DK = colors.HexColor("#9B2335")
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

CHANNEL_NAME = "cf-ma-valuation"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Corporate Finance", "BAC4301 - Corporate Finance",
           "lesson-06-company-valuation")
OUT_PATH = os.path.join(OUT_DIR, "Step 6.1 - Company Valuation.pdf")

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def make_styles():
    return {
        "cover_eyebrow": ParagraphStyle("cover_eyebrow",
            fontName="Body-Bold", fontSize=7.5, textColor=C_ACCENT,
            leading=11, spaceAfter=10, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Georgia-Bold", fontSize=28, textColor=C_WHITE,
            leading=34, spaceAfter=10, alignment=TA_LEFT),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Body", fontSize=10, textColor=C_MIST,
            leading=15, spaceAfter=0, alignment=TA_LEFT),
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Body-Bold", fontSize=7, textColor=C_ACCENT,
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
            fontName="Body-Bold", fontSize=10, textColor=C_ACCENT_DK,
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
            fontName="Body-Bold", fontSize=9.5, textColor=C_ACCENT_DK,
            leading=15, alignment=TA_LEFT),
        "discuss_q": ParagraphStyle("discuss_q",
            fontName="Body-Italic", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, alignment=TA_LEFT),
        "community_nudge": ParagraphStyle("community_nudge",
            fontName="Body-Italic", fontSize=8.5, textColor=C_ACCENT_DK,
            leading=14, spaceAfter=0, alignment=TA_LEFT),
    }

ST = make_styles()

# ─────────────────────────────────────────────
#  CANVAS CALLBACKS
# ─────────────────────────────────────────────
def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_COVER)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#2D2D4A"))
    canvas.setLineWidth(0.5)
    for i in range(1, 6):
        canvas.line(0, H * i / 6, W, H * i / 6)
    for i in range(1, 4):
        canvas.line(W * i / 4, 0, W * i / 4, H)
    canvas.setFillColor(C_ACCENT)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.setFont("Georgia-Bold", 140)
    canvas.setFillColor(C_GHOST)
    canvas.drawRightString(W - MX, MY + 40, "6.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_ACCENT)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "6.1 — Company Valuation")
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
    return HRFlowable(width="100%", thickness=0.5, color=C_ACCENT, spaceAfter=10, spaceBefore=4)

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
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_ACCENT),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])

def community_closer():
    """Soft, peer-to-peer mention of the study group. Works for strangers and existing members."""
    elements = [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "This is one step in the Corporate Finance series running in the Booklesss study group on Slack. "
            "The channel for this topic is <b>#cf-ma-valuation</b> — that's where students going through "
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
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_ACCENT),
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
        ('LINEBELOW',     (0,0), (-1, 0), 1,   C_ACCENT),
    ]))
    return t

# ─────────────────────────────────────────────
#  DOCUMENT BUILD
# ─────────────────────────────────────────────
def build():
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4, leftMargin=MX, rightMargin=MX,
                          topMargin=MY + HEADER_H, bottomMargin=MY + FOOTER_H)

    cover_frame = Frame(0, 0, W, H,
                        leftPadding=MX + 10, rightPadding=MX,
                        topPadding=MY + 20,
                        bottomPadding=MY + 40)
    body_frame  = Frame(MX, MY + FOOTER_H, CONTENT_W,
                        H - MY*2 - HEADER_H - FOOTER_H,
                        leftPadding=0, rightPadding=0,
                        topPadding=0, bottomPadding=0)

    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_bg),
        PageTemplate(id="Body",  frames=[body_frame],  onPage=body_page),
    ])

    story = []

    # ── COVER ──────────────────────────────────────────────────
    story.append(Paragraph("BAC4301 CORPORATE FINANCE", ST["cover_eyebrow"]))
    story.append(Paragraph("Company Valuation", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 6.1 · DCF, WACC, terminal value, P/E multiples, EV/EBITDA, asset-based valuation, bond pricing, valuation ranges",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Why Valuation Matters ──────────────────────────
    story += section("FOUNDATIONS", "Why Valuation Matters")
    story.append(body(
        "Valuation is the process of determining what an asset, business, or security is worth. "
        "It is fundamental to investment decisions, mergers and acquisitions, initial public offerings (IPOs), "
        "employee share schemes, and commercial disputes."
    ))
    story.append(body(
        "In corporate finance, valuation answers the question: How much should I be willing to pay for this company, "
        "or what is this company worth to a potential buyer? The answer depends on the cash flows the acquirer expects to generate, "
        "the risk of those cash flows, and the alternative returns available elsewhere."
    ))
    story.append(body(
        "The principle underlying all valuation methods is simple: an asset is worth the present value of the cash flows it will generate in the future. "
        "What differs between methods is how we estimate those cash flows and the discount rate we apply."
    ))

    # ── SECTION 2: Discounted Cash Flow (DCF) ──────────────────
    story += section("DCF VALUATION", "Discounted Cash Flow Valuation")
    story.append(body(
        "The discounted cash flow (DCF) method is the most theoretically sound approach to valuation. "
        "It values a company by discounting all future cash flows expected to be generated by that company back to the present."
    ))
    story.append(h3("Two Flavours of DCF"))
    story.append(bullet(
        "<b>Free Cash Flow to the Firm (FCFF):</b> Cash available to all investors (debt and equity) before financing costs. "
        "Discounted at the Weighted Average Cost of Capital (WACC)."
    ))
    story.append(bullet(
        "<b>Free Cash Flow to Equity (FCFE):</b> Cash available to equity holders after debt payments and reinvestment. "
        "Discounted at the cost of equity."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("The General DCF Formula"))
    story.append(formula_box([
        "Company Value = Sum of [FCF_t / (1 + r)^t] + Terminal Value / (1 + r)^n",
        "",
        "Where:  FCF_t = Free cash flow in year t",
        "        r = Discount rate (WACC for FCFF, cost of equity for FCFE)",
        "        n = Number of years in forecast period",
    ]))

    story.append(h3("Terminal Value"))
    story.append(body(
        "Terminal value represents the value of all cash flows beyond the explicit forecast period. "
        "Two common approaches:"
    ))
    story.append(bullet(
        "<b>Gordon Growth Model</b>: Terminal Value = FCF_{final} × (1 + g) / (r − g), "
        "where g is the perpetual growth rate (typically 2-3%)."
    ))
    story.append(bullet(
        "<b>Exit Multiple</b>: Terminal Value = Final Year EBITDA × Exit Multiple. "
        "Assumes the company is sold at an EBITDA multiple comparable to current market multiples."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Worked Example: Zambian Manufacturer"))
    story.append(body(
        "Consider Zambia Manufacturing Ltd, a copper fabrication firm with the following projections:"
    ))
    dcf_data = [
        ["Year", "FCFF (ZMW'm)", "Discount Factor @ 9%", "PV of FCFF (ZMW'm)"],
        ["2026", "450", "0.917", "412"],
        ["2027", "520", "0.842", "438"],
        ["2028", "600", "0.772", "463"],
        ["2029", "680", "0.708", "481"],
        ["2030", "750", "0.649", "487"],
    ]
    story.append(table_std(dcf_data, [2.5*cm, 2.8*cm, 3.5*cm, 3.2*cm]))
    story.append(Spacer(1, 6))
    story.append(body(
        "Sum of PV of explicit period FCFF: ZMW 2,281m. "
        "Terminal Value (using Gordon Growth, g=2.5%): ZMW 750m × 1.025 / (0.09 − 0.025) = ZMW 12,923m. "
        "PV of Terminal Value (ZMW 12,923m / 1.549): ZMW 8,340m."
    ))
    story.append(body(
        "<b>Enterprise Value (Firm Value) = ZMW 2,281m + ZMW 8,340m = ZMW 10,621m</b>"
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 3: Cost of Capital Link ──────────────────────────
    story += section("COST OF CAPITAL", "WACC as the Discount Rate (Link to Step 4.1)")
    story.append(body(
        "The discount rate in DCF valuation is critical. For FCFF, we use the Weighted Average Cost of Capital (WACC), "
        "which reflects the cost of raising capital from both debt and equity holders."
    ))
    story.append(body(
        "From Step 4.1 — Cost of Capital, recall that WACC is calculated as: "
        "WACC = (E/V) × r_e + (D/V) × r_d × (1 − T_c), "
        "where E and D are the market values of equity and debt, V is total firm value, r_e is cost of equity (from CAPM), "
        "r_d is cost of debt, and T_c is the corporate tax rate."
    ))
    story.append(body(
        "For FCFE valuation, we use only the cost of equity as the discount rate, because FCFE already accounts for debt repayment."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 4: Relative Valuation ──────────────────────────────
    story += section("MULTIPLES", "Relative Valuation Using Multiples")
    story.append(body(
        "While DCF is theoretically sound, practitioners often use relative valuation methods as a sanity check. "
        "Relative valuation compares the target company to similar companies or transactions."
    ))

    story.append(h3("Price-to-Earnings (P/E) Multiple"))
    story.append(body(
        "P/E is perhaps the most widely quoted multiple. It divides the share price by earnings per share. "
        "A high P/E suggests the market expects strong future growth; a low P/E suggests the market is pessimistic."
    ))
    story.append(body(
        "<b>To apply P/E:</b> (1) Identify comparable listed companies in the same industry; (2) Calculate the average P/E ratio; "
        "(3) Multiply target EPS by the average P/E to derive an equity value."
    ))
    story.append(body(
        "<b>Pitfalls:</b> P/E can be distorted by cyclicality (a company near a cyclical peak looks cheap but may not be), "
        "accounting differences (companies in different countries may use different accounting standards), "
        "and capital structure (highly levered companies have inflated earnings)."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("EV/EBITDA Multiple"))
    story.append(body(
        "Enterprise Value / EBITDA is often preferred to P/E by practitioners because it eliminates differences in tax rates, "
        "capital structure, and depreciation policy — all of which distort P/E."
    ))
    story.append(body(
        "Enterprise Value = Market Cap + Total Debt − Cash"
    ))
    story.append(body(
        "EBITDA is a measure of operating profit that is independent of financing and tax decisions. "
        "A target company valued at an 8× EV/EBITDA multiple is more comparable across sectors than a target valued at a 12× P/E multiple."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 5: Asset-Based Valuation ──────────────────────────
    story += section("ASSET-BASED", "Asset-Based Valuation")
    story.append(body(
        "For some companies — particularly asset-heavy businesses, financial institutions, or distressed situations — "
        "asset-based valuation may be appropriate."
    ))
    story.append(h3("Net Asset Value (NAV)"))
    story.append(body(
        "NAV = Total Assets − Total Liabilities. "
        "This is the book value of equity. It is most appropriate for companies with significant tangible assets "
        "(real estate, equipment, natural resources) and is often used in banking and insurance."
    ))
    story.append(h3("Replacement Cost"))
    story.append(body(
        "Replacement cost asks: How much would it cost to replace all the assets of this company with equivalent assets today? "
        "It is useful for valuing utilities, mining companies, and other capital-intensive businesses where the market value of assets may differ significantly from book value."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 6: Dividend Discount Model ──────────────────────────
    story += section("DIVIDEND", "Dividend Valuation Models")
    story.append(body(
        "For mature companies that pay stable, predictable dividends, the Gordon Growth Model (introduced in Step 1.1) is useful: "
        "Share Price = D_1 / (r_e − g), where D_1 is the expected next dividend, r_e is the cost of equity, and g is the perpetual growth rate."
    ))
    story.append(body(
        "This model is most appropriate for utility companies, real estate investment trusts (REITs), and other dividend-focused businesses. "
        "For high-growth companies that reinvest earnings, dividend models undervalue the firm."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 7: Bond Valuation ──────────────────────────────
    story += section("BONDS", "Bond Valuation")
    story.append(body(
        "A bond is a promise to pay coupon interest and return the face value at maturity. The value of a bond is the present value of all future cash flows:"
    ))
    story.append(formula_box([
        "Bond Price = [C / (1+y)^1] + [C / (1+y)^2] + ... + [C + FV / (1+y)^n]",
        "",
        "Where:  C = Annual coupon payment",
        "        FV = Face value (redemption value)",
        "        y = Yield to maturity (YTM)",
        "        n = Years to maturity",
    ]))
    story.append(body(
        "<b>Key relationships:</b> When market interest rates rise, bond prices fall (and vice versa). "
        "A bond trading at par has a coupon equal to the YTM. A bond trading at a premium has a coupon > YTM. "
        "A bond trading at a discount has a coupon < YTM."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Worked Example: Government Bond"))
    story.append(body(
        "A Zambian government bond has a face value of ZMW 10,000, coupon rate of 8% (paying ZMW 800 annually), "
        "3 years to maturity, and the market yield is 10%."
    ))
    story.append(body(
        "Price = 800 / 1.10 + 800 / 1.10² + 10,800 / 1.10³ = 727 + 661 + 8,108 = ZMW 9,496"
    ))
    story.append(body(
        "The bond is trading at a discount (price < face value) because the coupon rate (8%) is below the market yield (10%)."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Duration and Convexity"))
    story.append(body(
        "Bond duration measures the weighted average time to receive cash flows; it approximates the price sensitivity to yield changes. "
        "A bond with duration of 5 years will fall approximately 5% in price if yields rise by 1%. "
        "Longer-duration bonds are more price-sensitive to yield changes."
    ))
    story.append(body(
        "Convexity is a second-order effect that captures the curvature of the price-yield relationship. "
        "Convexity is always positive for a standard (non-callable) bond, meaning price appreciation is greater when yields fall than price depreciation when yields rise by the same amount."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 8: Valuation Range ──────────────────────────────
    story += section("FOOTBALL FIELD", "The Valuation Range")
    story.append(body(
        "Different valuation methods often yield different answers. That is expected — different methods capture different aspects of value."
    ))
    story.append(body(
        "A professional valuer typically employs multiple methods and creates a <b>football field chart</b> showing the range of values. "
        "The valuation might range from ZMW 8,500m (asset-based, conservative) to ZMW 12,000m (DCF, optimistic), with the market trading at ZMW 10,000m."
    ))
    story.append(body(
        "The width of the range reflects uncertainty. If methods cluster tightly, you can be more confident in the valuation. "
        "If they diverge widely, you need to understand why — and potentially probe further into assumptions or the quality of comparables."
    ))
    story.append(Spacer(1, 8))
    story.append(Spacer(1, 8))

    story.append(h3("The Three Scenarios Approach"))
    story.append(body(
        "Rather than a single valuation, professionals often create three scenarios:"
    ))
    story.append(bullet("<b>Bear case (downside):</b> Conservative assumptions. Revenues grow 2-3%, margins compress due to competition."))
    story.append(bullet("<b>Base case (expected):</b> Reasonable assumptions grounded in history and industry analysis."))
    story.append(bullet("<b>Bull case (upside):</b> Optimistic assumptions. New markets open, margins expand, synergies realised."))
    story.append(body(
        "Each scenario generates a different valuation. The financial model might show: "
        "Bear ZMW 7,500m (20% probability), Base ZMW 10,000m (50% probability), Bull ZMW 13,500m (30% probability). "
        "Probability-weighted value = 0.20 × 7,500 + 0.50 × 10,000 + 0.30 × 13,500 = ZMW 10,350m."
    ))
    story.append(body(
        "This approach is more honest than a single 'most likely' value. "
        "It forces the valuer to articulate the downside and upside risks explicitly."
    ))
    story.append(Spacer(1, 8))


    # ── SECTION 9: Sensitivity Analysis ──────────────────────────────
    story += section("SENSITIVITY", "Sensitivity Analysis in DCF")
    story.append(body(
        "DCF valuations are highly sensitive to key assumptions: the terminal growth rate, the discount rate (WACC), "
        "and the forecast cash flows. Small changes in these assumptions can dramatically alter the valuation."
    ))
    story.append(body(
        "Professional valuers conduct sensitivity analysis by varying one or two key assumptions and recalculating firm value. "
        "A two-way sensitivity table (varying WACC on one axis and terminal growth on the other) shows how valuation responds to changes in these critical inputs."
    ))
    story.append(body(
        "<b>Example:</b> If WACC varies from 8% to 11% and terminal growth from 2% to 4%, the valuation range might be ZMW 8,200m to ZMW 13,100m. "
        "This wide range illustrates why investors must have high conviction in their assumptions or accept a wide range of possible values."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 10: Zambian Context ──────────────────────────────
    story += section("ZAMBIA", "Valuation in the Zambian Context")
    story.append(body(
        "Zambia has a small, illiquid equity market. Many valuable companies are unlisted or closely held. "
        "For these companies, valuation using market multiples is difficult because there are few comparable listed peers."
    ))
    story.append(body(
        "<b>Solutions:</b> (1) Use DCF with conservative assumptions about cost of capital and growth. "
        "(2) Use listed companies from other African countries as comparables (e.g., South African or Botswanan firms in the same sector). "
        "(3) Use transaction multiples from M&A deals in the region, adjusted for company-specific risk. "
        "(4) For asset-heavy businesses, favour asset-based valuation over multiples."
    ))
    story.append(body(
        "Valuations of Zambian companies must account for sovereign risk (Zambia's credit rating affects borrowing costs), "
        "currency risk (Kwacha volatility), and political risk. These risks increase the required return, widening the valuation discount."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 14: Equity Value vs Enterprise Value ──────────────────────
    story += section("EQUITY", "Reconciling Equity Value and Enterprise Value")
    story.append(body(
        "Two key concepts in valuation are often confused: enterprise value (EV) and equity value (EQ)."
    ))
    story.append(h3("Enterprise Value"))
    story.append(body(
        "Enterprise Value is the value of the operating business to all investors (debt and equity holders). "
        "It is calculated as: EV = Market Cap (Equity) + Total Debt − Cash & Equivalents. "
        "Alternatively, EV = PV(FCFF), where FCFF is discounted at the WACC."
    ))
    story.append(h3("Equity Value"))
    story.append(body(
        "Equity Value is the value available to equity holders alone (after paying creditors). "
        "It is calculated as: Equity Value = Enterprise Value − Net Debt. "
        "Alternatively, Equity Value = PV(FCFE), where FCFE is discounted at the cost of equity."
    ))
    story.append(h3("Reconciliation Example"))
    story.append(body(
        "A Zambian company has an enterprise value (operating business value) of ZMW 10,000m. "
        "It has total debt of ZMW 2,500m and cash of ZMW 300m. "
        "Equity Value = ZMW 10,000m − (ZMW 2,500m − ZMW 300m) = ZMW 10,000m − ZMW 2,200m = ZMW 7,800m. "
        "This is the value available to shareholders."
    ))
    story.append(body(
        "If the company has 100m shares outstanding, the intrinsic value per share = ZMW 7,800m ÷ 100m = ZMW 78 per share. "
        "The market price should gravitate to this intrinsic value (in an efficient market) or the difference represents the margin of safety (or overvaluation)."
    ))
    story.append(Spacer(1, 10))

    # ── DISCUSSION QUESTIONS ──────────────────────────────────
    story += section("DISCUSSION", "Discussion Questions")
    q1 = "A mining company generates FCFF of ZMW 500m per year (growing at 3% perpetually). Cost of capital is 8%. Using the Gordon Growth Model, what is the enterprise value? How would you reconcile this to the company's current market cap of ZMW 9,000m if it differs?"
    q2 = "You are valuing an unlisted pharmaceutical firm. DCF gives you ZMW 6,000m; comparable multiples give you ZMW 5,200m; and asset-based gives you ZMW 4,100m. What explains the divergence? Which method would you trust most, and why?"
    story.append(discussion_question_with_nudge(q1, f"→ Continue this discussion in #cf-ma-valuation on Slack."))
    story.append(discussion_question_with_nudge(q2, f"→ Continue this discussion in #cf-ma-valuation on Slack."))
    story.append(Spacer(1, 8))

    # ── SECTION 11: Valuation in Practice ──────────────────────────
    story += section("PRACTICE", "Valuation in Practice: Challenges and Adjustments")
    story.append(body(
        "While the theory of valuation is elegant, practitioners face many real-world challenges that complicate the models."
    ))
    story.append(h3("Non-Controlling vs Controlling Interest"))
    story.append(body(
        "A minority stake in a company may be worth less than a pro-rata share of the whole company "
        "because the minority shareholder has no control over decisions. "
        "A controlling interest commands a premium because the new owner can change strategy, management, and capital allocation."
    ))
    story.append(bullet(
        "<b>Minority discount:</b> Typically 20-40% reduction to reflect lack of control"
    ))
    story.append(bullet(
        "<b>Control premium:</b> Typically 25-50% increase to reflect decision-making power (opposite side of the same coin)"
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Liquidity Discounts"))
    story.append(body(
        "A publicly-listed company's shares are liquid — they can be sold immediately at the listed price. "
        "Unlisted company shares are illiquid — it may take months or years to find a buyer. "
        "This illiquidity commands a discount of 20-50% depending on the company's profitability, growth, and addressable market."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Adjusting for Synergies"))
    story.append(body(
        "When an acquirer values a target, the valuation should assume the company continues as a standalone entity "
        "(unless the acquirer is already a competitor). "
        "Synergies are quantified separately and added to the standalone valuation to determine the maximum bid price. "
        "This forces discipline: the acquirer cannot hide overpayment within inflated DCF assumptions."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 12: Common Valuation Mistakes ──────────────────────────
    story += section("MISTAKES", "Common Valuation Mistakes")
    story.append(body(
        "Valuers frequently make predictable errors that lead to systematically wrong values."
    ))
    story.append(h3("1. Ignoring Base Case Risk"))
    story.append(body(
        "DCF forecasts assume a 'base case' outcome (e.g., 10% annual growth). "
        "But there is a range of possible outcomes. "
        "A professional valuation should scenario-test (best case, base case, worst case) and weight them by probability."
    ))
    story.append(h3("2. Mismatching Discount Rate to Risk"))
    story.append(body(
        "Using the wrong cost of capital is fatal. "
        "If you discount a high-risk startup's cash flows at the cost of equity for a stable utility, you massively overvalue the startup. "
        "Conversely, discounting a utility's cash flows at high-tech discount rates undervalues it."
    ))
    story.append(h3("3. Perpetual Growth > GDP Growth"))
    story.append(body(
        "A company cannot grow faster than the economy indefinitely. "
        "If you assume a perpetual growth rate of 4% for a company in a country with 2% GDP growth, the valuation is likely too high. "
        "Terminal growth should be capped at or below nominal GDP growth."
    ))
    story.append(h3("4. Overfitting to Comparables"))
    story.append(body(
        "A company trading at a 15× P/E might be a growth story or it might be overvalued. "
        "Applying that same 15× multiple to a similar-looking company without understanding why the first trades at a premium is dangerous. "
        "Deep industry and company knowledge is essential."
    ))
    story.append(Spacer(1, 12))
    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Valuation", "The process of determining the worth of an asset, business, or security"],
        ["DCF (Discounted Cash Flow)", "A valuation method that sums the present values of all future cash flows"],
        ["FCFF (Free Cash Flow to Firm)", "Cash available to all investors before financing; discounted at WACC"],
        ["FCFE (Free Cash Flow to Equity)", "Cash available to equity holders after debt payments; discounted at cost of equity"],
        ["Terminal value", "The value of all cash flows beyond the explicit forecast period"],
        ["Gordon Growth Model", "Perpetual growth formula: Value = FCF × (1+g) / (r−g)"],
        ["P/E ratio", "Price-to-Earnings ratio; market price per share divided by earnings per share"],
        ["EV/EBITDA", "Enterprise Value divided by EBITDA; avoids tax and financing distortions"],
        ["Comparable company analysis", "Valuation by comparing to similar listed companies"],
        ["Trading multiples", "Multiples from recent market transactions (P/E, EV/EBITDA, etc.)"],
        ["Net Asset Value (NAV)", "Total assets minus total liabilities; book value of equity"],
        ["Replacement cost", "The cost to replace all assets of a company with equivalent assets today"],
        ["Dividend discount model", "Valuation based on the present value of future dividends"],
        ["Bond pricing", "Present value of coupon payments and face value"],
        ["Yield to maturity (YTM)", "The internal rate of return on a bond held to maturity"],
        ["Duration", "Weighted average time to receipt of bond cash flows; price sensitivity measure"],
        ["Convexity", "Second-order effect measuring curvature of bond price-yield relationship"],
        ["Football field chart", "A visual showing the range of values from multiple valuation methods"],
        ["Market capitalization", "Share price × number of shares outstanding"],
        ["Sensitivity analysis", "Testing how valuation changes with variations in key assumptions"],
    ]
    story.append(table_std(terms, [4.5*cm, CONTENT_W - 4.5*cm]))
    story.append(Spacer(1, 12))

    # ── SECTION 13: Valuation in M&A Context (Forward Link to Step 7.1) ──────────────────────
    story += section("MALINK", "Using Valuation in Mergers (Looking Ahead to Step 7.1)")
    story.append(body(
        "Step 7.1 — Mergers & Acquisitions applies all of these valuation methods to the specific context of buying or selling a company. "
        "In an M&A deal, the valuer's job is to establish the range of defensible prices for the target company."
    ))
    story.append(h3("DCF in Acquisition Pricing"))
    story.append(body(
        "An acquirer builds a DCF model of the target company assuming it remains independent (base case), "
        "then builds a second model incorporating post-acquisition synergies (acquisition case). "
        "The difference is the maximum justified bid price."
    ))
    story.append(h3("Comparable Company Multiples in Dealmaking"))
    story.append(body(
        "Deal teams use EV/EBITDA and P/E multiples from comparable listed companies to 'gut-check' the DCF. "
        "If the target's implied multiple (price ÷ EBITDA) is 2-3× above peers, alarm bells should ring. "
        "This forces discipline: valuations must be grounded in reality, not wishful thinking about synergies."
    ))
    story.append(body(
        "In Step 7.1, we'll see exactly how these valuation methods are wielded in the negotiation and pricing of a real deal."
    ))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain the principle that an asset is worth the present value of its future cash flows",
        "Distinguish between FCFF and FCFE, and choose the appropriate discount rate for each",
        "Calculate terminal value using both the Gordon Growth Model and the exit multiple approach",
        "Build a full DCF valuation model with realistic Zambian company projections",
        "Apply P/E and EV/EBITDA multiples to value a target company, and identify the pitfalls of each",
        "Calculate the price and yield of bonds; explain the inverse relationship between price and yield",
        "Understand asset-based and dividend discount valuations, and when to apply each",
        "Reconcile differences between methods and create a valuation football field chart",
        "Conduct sensitivity analysis and interpret how assumptions affect valuation outcomes",
        "Value unlisted companies in the Zambian context using comparable listed peers",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 7.1 — Mergers & Acquisitions",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")
    print(f"File size: {os.path.getsize(OUT_PATH) / 1024:.1f} KB")

if __name__ == "__main__":
    build()
