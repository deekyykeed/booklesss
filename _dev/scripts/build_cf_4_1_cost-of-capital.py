"""
Booklesss Lesson PDF — Step 4.1: Cost of Capital Foundations
Course: BAC4301 Corporate Finance
Style: Deep navy-purple cover, crimson accent, white body, DejaVuSerif display, LiberationSans body.
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
#  COLOURS (CF COURSE PALETTE)
# ─────────────────────────────────────────────
C_COVER_BG   = colors.HexColor("#1A1A2E")      # Deep navy-purple
C_ACCENT     = colors.HexColor("#E94560")      # Crimson/red
C_ACCENT_DK  = colors.HexColor("#9B2335")      # Dark accent
C_GHOST      = colors.HexColor("#251F35")      # Cover ghost number
C_INK        = colors.HexColor("#111827")      # Body text
C_STEEL      = colors.HexColor("#6B7280")      # Secondary text
C_MIST       = colors.HexColor("#9CA3AF")      # Muted text
C_RULE       = colors.HexColor("#E94560")      # Body hairlines/rules
C_WHITE      = colors.white

BG_DISCUSS   = colors.HexColor("#FFF5F5")      # Discussion box background
C_DISCUSS_BAR = colors.HexColor("#E94560")    # Discussion box left bar

# ─────────────────────────────────────────────
#  PAGE GEOMETRY
# ─────────────────────────────────────────────
W, H        = A4
MX          = 2.2 * cm
MY          = 2.0 * cm
HEADER_H    = 28
FOOTER_H    = 28
CONTENT_W   = W - 2 * MX

CHANNEL_NAME = "cf-cost-of-capital"
# Invite link
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Corporate Finance", "BAC4301 - Corporate Finance",
           "lesson-04-cost-of-capital-foundations")
OUT_PATH = os.path.join(OUT_DIR, "Step 4.1 - Cost of Capital Foundations.pdf")

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
        "formula": ParagraphStyle("formula",
            fontName="Body-Bold", fontSize=10, textColor=C_ACCENT,
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
    canvas.setFillColor(C_COVER_BG)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(C_ACCENT)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.setFont("Georgia-Bold", 140)
    canvas.setFillColor(C_GHOST)
    canvas.drawRightString(W - MX, MY + 40, "4.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_ACCENT)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "4.1 — Cost of Capital Foundations")
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
    return HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=10, spaceBefore=4)

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

def discussion_question_with_nudge(questions_text, nudge_text):
    """Discussion box with questions and community nudge line at bottom."""
    q = Paragraph(questions_text, ST["discuss_q"])
    nudge = Paragraph(nudge_text, ST["community_nudge"])
    t = Table([[q], [nudge]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_DISCUSS),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_DISCUSS_BAR),
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
            "The channel for this topic is <b>#cf-cost-of-capital</b> — that's where students going through "
            "BAC4301 are working through this material together, solving problems, and preparing past papers.",
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
        ('BACKGROUND',    (0,0), (-1,-1), colors.HexColor("#FFF5F5")),
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
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
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
    story.append(Paragraph("Cost of Capital\nFoundations", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 4.1 · CAPM, cost of equity and debt, WACC, beta, dividend growth model, cost of capital framework",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Why Cost of Capital Matters ─────────────────
    story += section("FOUNDATIONS", "Why Cost of Capital Matters")
    story.append(body(
        "Cost of capital is the hurdle rate — the minimum return a company must earn on its investments to satisfy both "
        "equity holders and creditors. It answers a fundamental question: what discount rate should we use to evaluate projects, "
        "value companies, and make investment decisions?"
    ))
    story.append(body(
        "Every company is financed by a mix of equity and debt. Equity holders expect returns, creditors expect interest. "
        "The cost of capital blends these expectations into a single weighted rate."
    ))
    story.append(body(
        "In Step 1.1 you learned to calculate NPV using a discount rate. You'll now learn where that rate comes from. "
        "In Step 5.1, you'll see how capital structure decisions (changing the mix of debt and equity) change the cost of capital, "
        "which changes the NPV and value of projects. Cost of capital is the bridge connecting finance theory to real investment decisions."
    ))

    # ── SECTION 2: Cost of Equity using CAPM ───────────────────
    story += section("CAPM", "Cost of Equity: The Capital Asset Pricing Model")
    story.append(body(
        "CAPM is the workhorse formula for estimating the return shareholders demand. It breaks down the required return into "
        "three parts: the risk-free rate, the equity risk premium, and the systematic risk premium (beta)."
    ))
    story.append(h3("The CAPM Formula"))
    story.append(formula_box([
        "Ke  =  Rf  +  β(Rm – Rf)",
        "",
        "Where:  Ke = cost of equity",
        "        Rf = risk-free rate",
        "        β = beta (systematic risk coefficient)",
        "        Rm = return on the market",
        "        (Rm – Rf) = market risk premium",
    ]))

    story.append(h3("Breaking Down Each Component"))
    story.append(Paragraph("<b>Risk-Free Rate (Rf)</b>", ST["h3"]))
    story.append(body(
        "This is the return on a government security (typically a long-dated government bond). "
        "It's the baseline return for zero-risk investing. In Zambia, use the yield on government bonds."
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>Market Risk Premium (Rm – Rf)</b>", ST["h3"]))
    story.append(body(
        "This is the extra return demanded by investors for bearing the risk of investing in the stock market. "
        "Historically, it's been around 5–8% in developed markets. For Zambian companies, use country-specific premiums "
        "(9–12% is common due to emerging market risk)."
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>Beta (β)</b>", ST["h3"]))
    story.append(body(
        "Beta measures how sensitive a company's returns are to overall market movements. A beta of 1.0 means the stock moves "
        "in line with the market. A beta of 1.5 means it's 50% more volatile than the market. A beta of 0.8 means it's 20% less volatile."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Worked Example: EK Co CAPM"))
    story.append(body(
        "EK Co has a beta of 1.20. The risk-free rate is 6%, and the market risk premium is 8%. Calculate the cost of equity."
    ))
    story.append(formula_box([
        "Ke  =  6%  +  1.20 × 8%",
        "   =  6%  +  9.6%",
        "   =  15.6%",
        "",
        "This means EK Co's shareholders expect a 15.6% return to justify holding the stock.",
    ]))

    # ── SECTION 3: Beta and Systematic Risk ─────────────────────
    story += section("BETA", "Understanding Beta")
    story.append(body(
        "Beta is a measure of systematic risk — the risk that cannot be diversified away. "
        "It's calculated from the covariance between a stock's returns and the market's returns, divided by the variance of the market."
    ))
    story.append(h3("Levered vs Unlevered Beta"))
    story.append(body(
        "The beta you observe on the stock market reflects both business risk and financial risk (risk from borrowing). "
        "If you want to separate these, you can unlever the beta (remove financial risk) and re-lever it for a different capital structure."
    ))
    story.append(formula_box([
        "Unlevered Beta (Asset Beta):",
        "    Bu  =  BL / [1 + (1 – Tax) × (D/E)]",
        "",
        "Re-levering for New Capital Structure:",
        "    BL  =  Bu × [1 + (1 – Tax) × (D/E)]",
        "",
        "Where:  BL = levered (equity) beta",
        "        Bu = unlevered (asset) beta",
        "        D/E = debt-to-equity ratio",
    ]))

    story.append(h3("Worked Example: FJ plc"))
    story.append(body(
        "FJ plc is listed on LuSE. Correlation between FJ returns and LuSE is 0.90. FJ's standard deviation is 62.80%; "
        "LuSE's is 53.41%. Calculate beta."
    ))
    story.append(formula_box([
        "Beta  =  Correlation × (σ_stock / σ_market)",
        "      =  0.90 × (62.80% / 53.41%)",
        "      =  0.90 × 1.176",
        "      =  1.058",
    ]))

    # ── SECTION 4: Cost of Debt ────────────────────────────────
    story += section("DEBT", "Cost of Debt")
    story.append(body(
        "The cost of debt is the interest rate the company pays to creditors. "
        "For tax purposes, interest is tax-deductible, so the effective after-tax cost of debt is lower than the gross cost."
    ))
    story.append(h3("Pre-Tax vs After-Tax Cost of Debt"))
    story.append(formula_box([
        "After-tax Cost of Debt  =  Kd × (1 – Tax Rate)",
        "",
        "Example: Gross yield on debt is 10%, tax rate is 30%",
        "After-tax Kd  =  10% × (1 – 0.30)  =  10% × 0.70  =  7%",
    ]))

    story.append(body(
        "The gross cost is found from the yield to maturity on the company's bonds. "
        "If bonds trade at par, YTM equals the coupon rate. If they trade at a discount (below par), YTM is higher. "
        "Credit spreads (the premium over the risk-free rate) reflect default risk."
    ))

    story.append(h3("Yield to Maturity Example"))
    story.append(body(
        "ABC Ltd issued a bond with K100 par value, 8% coupon, 5 years to maturity, currently priced at K96. "
        "The YTM is approximately 8.85% (the discount reflects higher credit risk)."
    ))

    # ── SECTION 5: Cost of Preference Shares ───────────────────
    story += section("PREFERENCE", "Cost of Preference Shares")
    story.append(body(
        "Preference shares sit between debt and equity. They pay a fixed dividend but have no maturity. "
        "The cost is simply the annual dividend divided by the share price."
    ))
    story.append(formula_box([
        "Cost of Preference Shares  =  Annual Dividend / Current Price",
        "",
        "Example: K5 annual dividend, current price K80",
        "Kp  =  K5 / K80  =  6.25%",
    ]))

    # ── SECTION 6: WACC ────────────────────────────────────────
    story += section("WACC", "Weighted Average Cost of Capital (WACC)")
    story.append(body(
        "WACC is the overall cost of capital — the weighted average of the costs of equity and debt based on market values. "
        "This is the discount rate to use for evaluating company-wide projects."
    ))
    story.append(h3("The WACC Formula"))
    story.append(formula_box([
        "WACC  =  [Ve/(Ve + Vd)] × Ke  +  [Vd/(Ve + Vd)] × Kd × (1 – Tax)",
        "",
        "Where:  Ve = market value of equity",
        "        Vd = market value of debt",
        "        Ke = cost of equity",
        "        Kd = cost of debt (pre-tax)",
    ]))

    story.append(h3("Worked Example: TC Co"))
    story.append(body(
        "TC Co is financed by K60m equity (Ke = 12%) and K20m debt (gross Kd = 10%, tax = 30%). Calculate WACC."
    ))
    story.append(formula_box([
        "Equity proportion  =  60 / 80  =  75%",
        "Debt proportion    =  20 / 80  =  25%",
        "",
        "After-tax Kd  =  10% × (1 – 0.30)  =  7%",
        "",
        "WACC  =  0.75 × 12%  +  0.25 × 7%",
        "     =  9%  +  1.75%",
        "     =  10.75%",
    ]))

    # ── SECTION 7: Alternative — Dividend Growth Model ─────────
    story += section("DVM", "Alternative: Dividend Growth Model")
    story.append(body(
        "When CAPM data is unreliable (e.g., unlisted companies, or limited historical data), use the Gordon Growth Model. "
        "It values the stock based on the present value of all future dividends, growing at a constant rate."
    ))
    story.append(h3("The Gordon Growth Model"))
    story.append(formula_box([
        "Cost of Equity (DVM)  =  (D₁ / P₀)  +  g",
        "",
        "Where:  D₁ = expected next dividend",
        "        P₀ = current share price",
        "        g = constant dividend growth rate",
    ]))

    story.append(body(
        "Use this when the company has a long history of stable, predictable dividends. "
        "Don't use it for high-growth companies or those with erratic dividend policies."
    ))

    # ── SECTION 8: Marginal vs Historical WACC ─────────────────
    story += section("MARGINAL", "Marginal vs Historical WACC")
    story.append(body(
        "Marginal WACC is what matters for today's investment decisions. It reflects today's financing costs, not yesterday's. "
        "Use the most recent market data for calculating cost of capital."
    ))
    story.append(h3("Why Marginal Matters"))
    story.append(bullet("Historical WACC can be outdated if interest rates, equity markets, or company risk have changed"))
    story.append(bullet("Marginal WACC reflects the cost of raising new capital today"))
    story.append(bullet("Always use market value weights, not book value, because WACC is a discount rate for forward-looking decisions"))
    story.append(Spacer(1, 8))

    # ── SECTION 9: Flotation Costs ─────────────────────────────
    story += section("FLOTATION", "Incorporating Flotation Costs")
    story.append(body(
        "When a company raises new equity or debt, it incurs issuance costs (legal fees, underwriting, etc.). "
        "These are small but material in valuation, especially for young or small companies."
    ))
    story.append(body(
        "One approach is to add the flotation cost to the initial investment in the project. "
        "Another is to adjust the cost of capital upward. The second method is less transparent but still used in practice."
    ))

    # ── SECTION 10: Project-Specific Cost of Capital ───────────
    story += section("PROJECT RISK", "Project-Specific Discount Rates")
    story.append(body(
        "A company's WACC is appropriate for average-risk projects. But not all projects carry average risk. "
        "A mining exploration project is riskier than a factory replacement project. Use a project-specific discount rate."
    ))
    story.append(h3("Pure Play Beta Approach"))
    story.append(body(
        "To estimate a project's beta, find a quoted company whose business matches the project exactly. "
        "Unlever that company's beta (remove its financial risk), then re-lever it using your company's capital structure. "
        "This gives you the asset beta of the project, which you convert back to an equity beta using your gearing ratio."
    ))
    story.append(h3("Example: Mining Project"))
    story.append(body(
        "Your company is an oil refiner (equity beta 1.1) considering a new mining venture. "
        "You find a pure-play mining company with equity beta 1.6, debt-to-equity 0.5, and tax rate 25%."
    ))
    story.append(formula_box([
        "Step 1: Unlever the mining company's beta",
        "    Bu = 1.6 / [1 + (1 - 0.25) × 0.5]",
        "       = 1.6 / 1.375",
        "       = 1.164",
        "",
        "Step 2: Re-lever using your refinery's D/E of 0.3",
        "    BL = 1.164 × [1 + (1 - 0.25) × 0.3]",
        "       = 1.164 × 1.225",
        "       = 1.427",
        "",
        "Step 3: Calculate project WACC",
        "    Ke (project) = 6% + 1.427 × 8% = 17.4%",
        "",
        "This 17.4% is the discount rate for the mining project.",
    ]))
    story.append(Spacer(1, 8))

    # ── SECTION 11: Cross-References to Other Steps ────────────
    story += section("CONNECTIONS", "How Cost of Capital Links to Other Steps")
    story.append(body(
        "<b>Step 1.1 (Investment Fundamentals):</b> You learned to calculate NPV using a discount rate. "
        "That rate was the cost of capital. Now you know where it comes from."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 2.1 (Advanced Investment Appraisal):</b> APV separates the investment decision from the financing decision. "
        "The Ku (unlevered cost of capital) is the cost of equity assuming the project is all-equity financed. "
        "You'll find Ku using the formulas you learned here."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 5.1 (Capital Structure):</b> Changing the debt-to-equity ratio changes beta (and Ke) and also affects the after-tax cost of debt. "
        "This changes WACC. Capital structure decisions have real value implications through their effect on cost of capital."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 6.1 (Company Valuation):</b> To value a company, you discount all future cash flows at WACC. "
        "Get WACC wrong, and your valuation is wrong."
    ))
    story.append(Spacer(1, 8))

    # ── EXAM TIP ──────────────────────────────────────────────
    story += section("EXAM TIPS", "Common Exam Mistakes & How to Avoid Them")
    story.append(h3("Mistake 1: Using Book Values Instead of Market Values in WACC"))
    story.append(bullet("Book values reflect historical costs, not what the company is worth today. Always use market values."))
    story.append(bullet("For debt, if market value isn't given, use the YTM on bonds or estimate from credit spreads."))
    story.append(Spacer(1, 6))

    story.append(h3("Mistake 2: Forgetting the Tax Effect on Debt Cost"))
    story.append(bullet("Interest is tax-deductible. Always use after-tax cost of debt in WACC: Kd × (1 – Tax)."))
    story.append(bullet("For preference shares and equity, there is no tax effect."))
    story.append(Spacer(1, 6))

    story.append(h3("Mistake 3: Confusing Levered and Unlevered Beta"))
    story.append(bullet("Observed beta on the stock market is levered beta (includes financial risk)."))
    story.append(bullet("Unlever it if you need to compare companies with different leverage, or to find asset beta."))
    story.append(Spacer(1, 6))

    story.append(h3("Mistake 4: Using Historical WACC Instead of Marginal WACC"))
    story.append(bullet("Yesterday's WACC is not today's cost of raising new capital."))
    story.append(bullet("If interest rates have changed, or credit spreads have widened, recalculate WACC."))
    story.append(Spacer(1, 8))

    # ── DISCUSSION QUESTIONS ───────────────────────────────────
    questions = (
        "<b>Question 1:</b> A company with a beta of 1.2, risk-free rate of 6%, and market risk premium of 8% calculates "
        "a CAPM cost of equity of 15.6%. If the company lowers its debt (reduces financial risk), what do you expect to happen "
        "to beta and to the cost of equity? Explain why. "
        "<br/><br/>"
        "<b>Question 2:</b> A Zambian mining company is evaluating a capital project. Should it use its current WACC (12%) "
        "or a project-specific discount rate? What factors would change your answer?"
    )
    nudge = "Work through the CAPM calculation with a company you know (or from a past exam). Post your working in #cf-cost-of-capital — seeing how others set up the problem helps you remember the formula."
    story.append(discussion_question_with_nudge(questions, nudge))

    # ── KEY TERMS ──────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Cost of capital", "The minimum return required by providers of finance (debt and equity) to invest in the company"],
        ["Cost of equity (Ke)", "The return demanded by shareholders for their investment"],
        ["Cost of debt (Kd)", "The interest rate paid on borrowed funds; the gross cost before tax effect"],
        ["CAPM", "Capital Asset Pricing Model; formula linking expected return to risk-free rate, beta, and market risk premium"],
        ["Risk-free rate (Rf)", "The yield on government securities; represents zero-risk return"],
        ["Market risk premium (Rm–Rf)", "The excess return demanded for investing in the stock market vs risk-free securities"],
        ["Beta (β)", "Measure of systematic risk; sensitivity of stock returns to market returns"],
        ["Levered beta", "Beta of equity reflecting both business risk and financial risk from borrowing"],
        ["Unlevered beta", "Beta of assets reflecting business risk only; used to compare companies with different capital structures"],
        ["Hamada equation", "Formula to unlever and re-lever beta when capital structure changes"],
        ["Gordon Growth Model (DVM)", "Dividend valuation model; alternative to CAPM for estimating cost of equity"],
        ["Yield to maturity (YTM)", "The internal rate of return on a bond; equals the cost of debt if the company issued it"],
        ["Credit spread", "Premium over the risk-free rate demanded by creditors due to default risk"],
        ["After-tax cost of debt", "Kd × (1 – tax rate); reflects the tax deductibility of interest"],
        ["WACC", "Weighted average cost of capital; blend of cost of equity and after-tax cost of debt"],
        ["Market value weights", "Proportions of equity and debt based on current market prices, used in WACC calculation"],
        ["Marginal WACC", "The cost of capital for new financing today, not historical average"],
        ["Flotation costs", "Fees and expenses incurred when raising new equity or debt"],
    ]
    story.append(table_std(terms, [4.5*cm, CONTENT_W - 4.5*cm]))
    story.append(Spacer(1, 12))

    # ── SECTION 12: Summary of Key Formulas ───────────────────
    story += section("SUMMARY", "Quick Reference: Key Formulas")
    story.append(h3("Cost of Equity"))
    story.append(formula_box([
        "CAPM:  Ke = Rf + β(Rm – Rf)",
        "DVM:   Ke = (D₁ / P₀) + g",
    ]))
    story.append(h3("Cost of Debt"))
    story.append(formula_box([
        "Pre-tax:    Kd = YTM on bonds",
        "After-tax:  Kd(after-tax) = Kd × (1 – Tax)",
    ]))
    story.append(h3("Beta"))
    story.append(formula_box([
        "Unlever:   Bu = BL / [1 + (1 – Tax) × (D/E)]",
        "Re-lever:  BL = Bu × [1 + (1 – Tax) × (D/E)]",
    ]))
    story.append(h3("WACC"))
    story.append(formula_box([
        "WACC = [Ve/(Ve+Vd)] × Ke + [Vd/(Ve+Vd)] × Kd(after-tax)",
    ]))
    story.append(Spacer(1, 8))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain the concept of cost of capital and why it is the fundamental discount rate for investment decisions",
        "Apply CAPM to calculate the cost of equity given risk-free rate, beta, and market risk premium",
        "Distinguish between systematic and unsystematic risk, and explain beta as a measure of systematic risk",
        "Calculate levered and unlevered beta using the Hamada equation, and re-lever beta for a new capital structure",
        "Calculate the pre-tax and after-tax cost of debt from bond yields and explain the tax shield",
        "Calculate WACC using market value weights and interpret its meaning as the discount rate for company projects",
        "Apply the Dividend Growth Model (Gordon Growth Model) as an alternative to CAPM",
        "Distinguish between marginal WACC (for new decisions) and historical WACC, and explain why marginal matters",
        "Explain how credit risk and credit spreads affect the cost of debt",
        "Incorporate flotation costs into project evaluation and cost of capital calculations",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 5.1 — Capital Structure Decisions",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
