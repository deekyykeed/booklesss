"""
Booklesss Lesson PDF — Step 5.1: Capital Structure Decisions
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
           "lesson-05-capital-structure-decisions")
OUT_PATH = os.path.join(OUT_DIR, "Step 5.1 - Capital Structure Decisions.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "5.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_ACCENT)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "5.1 — Capital Structure Decisions")
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
    story.append(Paragraph("Capital Structure\nDecisions", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 5.1 · Modigliani-Miller, capital structure irrelevance, tax shields, trade-off theory, pecking order, agency costs",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: What is Capital Structure ───────────────────
    story += section("FOUNDATIONS", "What is Capital Structure?")
    story.append(body(
        "Capital structure is the mix of debt and equity used to finance a company's assets. "
        "It's expressed as gearing ratios: debt-to-equity (D/E), debt-to-assets (D/D+E), or as a simple percentage (e.g., '40% debt financed')."
    ))
    story.append(body(
        "The question of optimal capital structure is one of the oldest in finance: <b>does it matter how we finance ourselves?</b> "
        "Should a company borrow a lot (high leverage) or stay mostly equity-financed? "
        "The answer turns out to be subtle and depends on assumptions about taxes, bankruptcy costs, and investor behaviour."
    ))
    story.append(h3("Key Ratios"))
    story.append(bullet("Debt-to-Equity (D/E): Total debt divided by total equity"))
    story.append(bullet("Gearing Ratio: Debt as a proportion of (Debt + Equity), typically expressed as a percentage"))
    story.append(bullet("Equity Ratio: Equity as a proportion of total capital"))
    story.append(Spacer(1, 8))

    # ── SECTION 2: Modigliani-Miller Propositions ──────────────
    story += section("MM", "Modigliani-Miller Propositions")
    story.append(body(
        "In 1958, Franco Modigliani and Merton Miller proved a remarkable result: "
        "in a world with no taxes, no bankruptcy costs, and perfect markets, <b>capital structure is irrelevant</b>. "
        "The value of a company is determined by its assets and investment decisions, not by how it finances itself."
    ))

    story.append(h3("MM Proposition I (No Taxes)"))
    story.append(formula_box([
        "Value of Levered Firm  =  Value of Unlevered Firm",
        "",
        "V_L  =  V_U",
        "",
        "The value is the same regardless of the debt-to-equity mix.",
    ]))

    story.append(body(
        "The intuition: when you borrow, you don't create value. You're just redistributing the cash flows between creditors and shareholders. "
        "A shareholder receiving K100 in dividends from an unleveraged firm gets exactly the same economic benefit as a shareholder in a "
        "levered firm, after accounting for the extra financial risk they bear."
    ))

    story.append(h3("MM Proposition II (No Taxes)"))
    story.append(body(
        "The cost of equity rises as the firm borrows more, exactly offsetting the benefit of cheaper debt financing."
    ))
    story.append(formula_box([
        "Cost of Equity (Levered)  =  Cost of Equity (Unlevered)  +  (D/E) × (Ku – Kd)",
        "",
        "Where:  Ku = cost of equity for unlevered firm",
        "        Kd = cost of debt",
        "        D/E = debt-to-equity ratio",
    ]))

    story.append(body(
        "As debt increases, equity becomes riskier, so shareholders demand higher returns. "
        "This higher cost of equity exactly offsets the benefit of lower-cost debt. Net result: WACC stays constant."
    ))

    # ── SECTION 3: MM with Taxes ───────────────────────────────
    story += section("TAX SHIELD", "MM Proposition I (With Taxes): The Tax Shield")
    story.append(body(
        "Now introduce corporate taxes. Interest payments are tax-deductible, but dividends and retained earnings are not. "
        "This creates a <b>tax shield</b> — the tax savings from deducting interest. "
        "Suddenly, capital structure matters."
    ))
    story.append(h3("The Tax Shield Effect"))
    story.append(formula_box([
        "Value of Levered Firm  =  Value of Unlevered Firm  +  PV(Tax Shield)",
        "",
        "V_L  =  V_U  +  T × D",
        "",
        "Where:  T = corporate tax rate",
        "        D = amount of debt",
        "        (T × D) = annual tax shield if debt is perpetual",
    ]))

    story.append(h3("Worked Example: Tax Shield"))
    story.append(body(
        "ABC Ltd has K1,000 in annual earnings before interest and tax. It borrows K10,000 at 8% interest. Tax rate is 30%."
    ))
    story.append(formula_box([
        "Interest expense  =  K10,000 × 8%  =  K800",
        "Tax shield  =  K800 × 30%  =  K240 per year",
        "",
        "PV of perpetual tax shield  =  K240 / (discount rate)",
        "",
        "If perpetual debt and discounted at 8%:",
        "PV of tax shield  =  K240 / 0.08  =  K3,000",
        "",
        "This K3,000 is the value created by borrowing. It's pure finance gain.",
    ]))

    story.append(body(
        "From this perspective, companies should borrow as much as possible. But in reality, they don't. Why? "
        "Because MM with taxes ignores financial distress costs."
    ))

    # ── SECTION 4: Trade-Off Theory ────────────────────────────
    story += section("TRADE-OFF", "Trade-Off Theory: The Optimal Capital Structure")
    story.append(body(
        "The trade-off theory says the optimal capital structure balances the benefit of the tax shield against the cost of financial distress. "
        "As debt increases, the tax shield increases, but so does the risk of bankruptcy and the costs associated with it."
    ))

    story.append(h3("Costs of Financial Distress"))
    story.append(Paragraph("<b>Direct Costs</b>", ST["h3"]))
    story.append(bullet("Legal and administrative fees for bankruptcy proceedings"))
    story.append(bullet("Court costs, accountant and lawyer fees"))
    story.append(bullet("Can be 1-5% of firm value in bankruptcy"))
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>Indirect Costs</b>", ST["h3"]))
    story.append(bullet("Lost contracts: customers hesitate to buy from a company that might fail"))
    story.append(bullet("Lost employees: talented staff leave to join stable competitors"))
    story.append(bullet("Supplier trust: suppliers may demand cash-on-delivery or higher prices"))
    story.append(bullet("Underinvestment: managers pass up profitable projects because debt covenants restrict them"))
    story.append(bullet("Fire sales: asset sales at distressed prices if cash runs low"))
    story.append(Spacer(1, 8))

    story.append(body(
        "The optimal capital structure is where the tax shield benefit equals the cost of financial distress. "
        "Go below this point (too conservative) and you're leaving tax benefits on the table. "
        "Go above it (too leveraged) and distress costs outweigh tax shields."
    ))

    # ── SECTION 5: Pecking Order Theory ────────────────────────
    story += section("PECKING ORDER", "Pecking Order Theory")
    story.append(body(
        "Pecking order theory says companies prefer a hierarchy of financing sources, driven by information asymmetry. "
        "Managers know more about the company's prospects than external investors do. This creates a preference."
    ))
    story.append(h3("The Pecking Order"))
    story.append(bullet("First choice: internal funds (retained earnings) — no information signal, no flotation costs"))
    story.append(bullet("Second choice: debt — creditors are less sensitive to information asymmetry than equity investors"))
    story.append(bullet("Last choice: equity — issuing equity signals that management thinks the stock is overvalued"))
    story.append(Spacer(1, 8))

    story.append(body(
        "This theory explains why companies rarely issue equity unless they're in financial distress or have major growth opportunities. "
        "It's not about tax shields or optimal ratios; it's about signalling."
    ))

    # ── SECTION 6: Agency Costs ────────────────────────────────
    story += section("AGENCY", "Agency Costs and Capital Structure")
    story.append(body(
        "Agency costs arise from conflicts between managers, shareholders, and creditors. "
        "The right capital structure can mitigate some of these conflicts."
    ))

    story.append(h3("Debt Agency Problems"))
    story.append(bullet("Moral hazard: levered firms may take excessive risks (equity holders' upside unlimited, downside limited to loss)"))
    story.append(bullet("Underinvestment: managers may reject good projects if most cash flows go to debt holders"))
    story.append(bullet("Dividend stripping: leverage used to pay dividends, leaving creditors with depleted assets"))
    story.append(Spacer(1, 6))

    story.append(h3("Equity Agency Problems"))
    story.append(bullet("Managers pursue empire building and empire perks instead of shareholder value"))
    story.append(bullet("Debt discipline: mandatory interest payments force managers to run lean operations"))
    story.append(bullet("Debt covenants: creditors impose restrictions that prevent value-destroying decisions"))
    story.append(Spacer(1, 8))

    story.append(body(
        "The right level of leverage can reduce agency costs by creating discipline and aligning manager incentives with creditors. "
        "Too little debt = agency costs from lax management. Too much = agency costs from excessive financial risk."
    ))

    # ── SECTION 7: Signalling Theory ───────────────────────────
    story += section("SIGNALLING", "Signalling Theory")
    story.append(body(
        "Capital structure decisions send signals to the market. "
        "An increase in leverage signals confidence that the company can service the debt. "
        "An equity issuance signals that the company is expensive (why else would management dilute shareholders?)."
    ))
    story.append(bullet("Debt increase: positive signal of confidence and value creation"))
    story.append(bullet("Equity issuance: negative signal; often followed by stock price decline"))
    story.append(bullet("Dividend increase: strong positive signal of confidence in cash flows"))
    story.append(Spacer(1, 8))

    # ── SECTION 8: Market Timing ───────────────────────────────
    story += section("MARKET TIMING", "Market Timing Theory")
    story.append(body(
        "Market timing theory says companies issue equity when their stock is overvalued and repurchase (or avoid buying back) when undervalued. "
        "This explains why capital structure is often a side effect of opportunistic financing, not a strategic target."
    ))

    # ── SECTION 9: Practical Determinants ──────────────────────
    story += section("PRACTICAL", "Practical Determinants of Capital Structure")
    story.append(body(
        "In practice, capital structure is driven by industry norms, asset composition, profitability, growth, and taxes:"
    ))
    story.append(h3("Determinants"))
    determ_data = [
        ["Factor", "Effect on Leverage"],
        ["Asset tangibility", "High → easier to borrow against tangible assets"],
        ["Profitability", "High → more internal funds, lower need for debt"],
        ["Growth opportunities", "High → prefer equity (preserve borrowing capacity); Low → more debt OK"],
        ["Tax rate", "High → more valuable tax shield, higher optimal debt"],
        ["Volatility (business risk)", "High → lower debt (higher distress cost); Low → can handle more debt"],
        ["Industry norms", "Companies converge toward industry average gearing"],
    ]
    story.append(table_std(determ_data, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 10))

    # ── SECTION 10: WACC and Capital Structure ─────────────────
    story += section("WACC & CS", "How Capital Structure Affects WACC")
    story.append(body(
        "In Step 4.1 you learned that WACC = (Ve/(Ve+Vd)) × Ke + (Vd/(Ve+Vd)) × Kd(1-Tax). "
        "As the company changes its debt ratio, both Ke and Kd change. WACC first decreases (tax shield and cheaper debt), "
        "then increases (higher financial risk and agency costs). There is an optimal D/E ratio where WACC is minimized."
    ))
    story.append(h3("Shape of the WACC Curve"))
    story.append(bullet("At D/E = 0 (100% equity): WACC is high, no tax benefit"))
    story.append(bullet("As D/E increases: WACC falls due to tax shield and use of cheaper debt"))
    story.append(bullet("At optimal D/E: WACC reaches minimum"))
    story.append(bullet("Beyond optimal D/E: WACC rises due to financial distress costs and higher equity risk premium"))
    story.append(Spacer(1, 8))

    # ── SECTION 11: Financial Distress Ratios ──────────────────
    story += section("RATIOS", "Measuring Debt Capacity")
    story.append(body(
        "How much debt is too much? Use coverage and leverage ratios to assess financial distress risk:"
    ))
    story.append(h3("Key Ratios"))
    story.append(bullet("Interest coverage ratio (EBIT/Interest): How many times can earnings cover debt service? >2.5× is healthy."))
    story.append(bullet("Debt-to-EBITDA: How many years of EBITDA needed to repay debt? <2–3× is safe."))
    story.append(bullet("Free cash flow to debt ratio: Annual free cash flow divided by debt outstanding. >20% is healthy."))
    story.append(Spacer(1, 8))

    story.append(h3("Worked Example: Debt Capacity"))
    story.append(body(
        "A Zambian company has EBIT of K50m, interest expense of K10m, and debt of K100m. "
        "EBITDA is K70m (assuming depreciation of K20m). Assess leverage."
    ))
    story.append(formula_box([
        "Interest coverage ratio  =  K50m / K10m  =  5×  (healthy)",
        "",
        "Debt-to-EBITDA  =  K100m / K70m  =  1.43×  (conservative)",
        "",
        "The company has room to borrow more without increasing distress risk.",
    ]))

    # ── SECTION 12: Cross-References and Integration ───────────
    story += section("CONNECTIONS", "How Capital Structure Links to Other Steps")
    story.append(body(
        "<b>Step 4.1 (Cost of Capital Foundations):</b> In that step, you learned that beta increases with leverage (higher D/E = higher equity risk). "
        "This means capital structure decisions directly change the cost of equity and WACC. "
        "A decision to increase debt changes the discount rate for all future projects."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 2.1 (Advanced Investment Appraisal):</b> APV explicitly separates operating value from financing effects. "
        "The APV is: Base case NPV (financed 100% by equity) + PV(financing effects). "
        "Capital structure changes the financing effects, so optimal capital structure is found by maximizing APV, not just minimizing WACC."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 6.1 (Company Valuation):</b> Company value is the PV of all future cash flows discounted at WACC. "
        "But WACC depends on the target capital structure (what gearing ratio will the company maintain?). "
        "Get the capital structure forecast wrong, and your valuation is wrong."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 7.1 (Mergers & Acquisitions):</b> When valuing a target company or evaluating a merger, you need to decide: "
        "should the target's valuation assume its current capital structure, or the acquirer's capital structure? "
        "The answer depends on expected synergies, tax shields, and distress costs — all capital structure questions."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 13: Valuation Example with Capital Structure ───
    story += section("EXAMPLE", "Worked Example: Two Companies, Two Leverage Levels")
    story.append(body(
        "Zambian Mining Ltd and Zambian Refining Ltd each generate K100m in EBIT. Mining is 30% debt financed (conservative), "
        "Refining is 50% debt financed (moderate). Both have tax rate 30%, cost of debt 8%, market risk premium 8%."
    ))
    story.append(h3("Calculate WACC for Each Company"))
    story.append(body(
        "For Mining (30% debt): Assume D = K43m, E = K100m (approximately 30% gearing)"
    ))
    story.append(formula_box([
        "Equity proportion = 100 / 143 = 69.9%",
        "Debt proportion = 43 / 143 = 30.1%",
        "",
        "Assume cost of equity = 12% (low risk, low leverage)",
        "After-tax cost of debt = 8% × (1 - 0.30) = 5.6%",
        "",
        "WACC = 0.699 × 12% + 0.301 × 5.6%",
        "     = 8.39% + 1.69%",
        "     = 10.08%",
    ]))
    story.append(Spacer(1, 6))

    story.append(body(
        "For Refining (50% debt): Assume D = K100m, E = K100m (50% gearing)"
    ))
    story.append(formula_box([
        "Equity proportion = 100 / 200 = 50%",
        "Debt proportion = 100 / 200 = 50%",
        "",
        "Higher leverage increases equity risk.",
        "Assume cost of equity = 14.4% (higher systematic risk from leverage)",
        "After-tax cost of debt = 8% × (1 - 0.30) = 5.6%",
        "",
        "WACC = 0.50 × 14.4% + 0.50 × 5.6%",
        "     = 7.2% + 2.8%",
        "     = 10.0%",
    ]))
    story.append(Spacer(1, 6))

    story.append(body(
        "WACCs are nearly identical (10.08% vs 10.0%), demonstrating that capital structure's effect on cost of equity "
        "is offset by its effect on the proportion of cheaper debt. The trade-off works both ways."
    ))
    story.append(Spacer(1, 8))

    # ── EXAM TIP ──────────────────────────────────────────────
    story += section("EXAM TIPS", "Common Pitfalls in Capital Structure Questions")
    story.append(h3("Pitfall 1: Forgetting the Tax Shield PV Formula"))
    story.append(body(
        "For perpetual debt: PV(Tax Shield) = Tax Rate × Debt Amount. "
        "For temporary debt (e.g., 10-year bonds): use PV of annual tax shields."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Pitfall 2: Confusing Optimal Structure with Target Structure"))
    story.append(body(
        "Optimal structure minimizes WACC. Target structure is what management actually maintains "
        "(or aims for) based on pecking order, signalling, and industry norms. They're not always the same."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Pitfall 3: Assuming Higher Debt Always Increases EPS"))
    story.append(body(
        "Higher debt does increase EPS due to financial leverage (assuming ROA > Kd). But it also increases financial risk. "
        "The market won't value the higher EPS equally — cost of equity rises, offsetting the benefit."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Pitfall 4: Ignoring Agency Costs"))
    story.append(body(
        "Don't fall into the 'more debt = tax shield = always good' trap. Agency costs of debt (moral hazard, underinvestment) "
        "and agency costs of equity (managerial perks) are real. They affect optimal structure."
    ))
    story.append(Spacer(1, 8))

    # ── DISCUSSION QUESTIONS ───────────────────────────────────
    questions = (
        "<b>Question 1:</b> Modigliani-Miller say capital structure is irrelevant with no taxes. "
        "Explain why this doesn't hold in a world with corporate taxes and financial distress costs. "
        "What is the optimal capital structure in such a world? "
        "<br/><br/>"
        "<b>Question 2:</b> A highly profitable, stable company has an interest coverage ratio of 8× and debt-to-EBITDA of 1.0×. "
        "Should it increase leverage? What factors beyond these ratios would you consider?"
    )
    nudge = "Find two companies in the Zambian market with different capital structures. Compare their debt ratios, interest coverage, and WACC. Post your analysis in #cf-cost-of-capital — peer feedback helps identify hidden risks."
    story.append(discussion_question_with_nudge(questions, nudge))

    # ── SECTION 14: Summary Framework ──────────────────────────
    story += section("FRAMEWORK", "Capital Structure Decision Framework")
    story.append(h3("Step 1: Identify the Tax Shield Benefit"))
    story.append(body(
        "Calculate PV(Tax Shield) = Tax Rate × Debt. This is the gain from borrowing. "
        "Higher tax rates → higher optimal leverage. No-tax companies (or those with large loss carryforwards) should borrow less."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("Step 2: Estimate Distress Costs"))
    story.append(body(
        "Direct: What would bankruptcy cost (legal, admin)? Estimate as 1–5% of firm value. "
        "Indirect: What could be lost (customer defection, staff turnover, covenant restrictions)? Harder to quantify but material."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("Step 3: Find the Optimal D/E Ratio"))
    story.append(body(
        "Where PV(Tax Shield) = PV(Distress Costs). Below this, increase debt for value gain. Above this, reduce debt."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("Step 4: Consider Pecking Order and Signalling"))
    story.append(body(
        "Even if optimal theory says borrow more, pecking order may mean: use retained earnings first. "
        "And issuing equity sends a signal. Balance theory with market perception."
    ))
    story.append(Spacer(1, 8))

    # ── KEY TERMS ──────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Capital structure", "The mix of debt and equity used to finance a company's assets"],
        ["Gearing ratio", "Debt as a percentage of (Debt + Equity); measure of financial leverage"],
        ["Modigliani-Miller Propositions", "Theorems showing capital structure irrelevance in perfect markets without taxes"],
        ["MM Proposition I", "In no-tax world, firm value is independent of capital structure"],
        ["MM Proposition II", "Cost of equity rises with financial leverage, offsetting cheaper debt"],
        ["Tax shield", "Tax savings from deducting interest expense; equals Tax Rate × Debt"],
        ["Financial distress costs", "Direct (legal/admin) and indirect (lost sales, talent, access) costs of bankruptcy risk"],
        ["Trade-off theory", "Optimal capital structure balances tax shield benefit against distress cost"],
        ["Pecking order theory", "Companies prefer internal funds > debt > equity due to information asymmetry"],
        ["Agency costs", "Costs arising from conflicts between managers, shareholders, and creditors"],
        ["Moral hazard", "Levered equity holders incentivized to take excessive risks"],
        ["Underinvestment problem", "Levered managers reject good projects because cash flows go to creditors"],
        ["Signalling theory", "Capital structure decisions signal management's confidence to the market"],
        ["Equity issuance signal", "Issuing equity signals managers think the stock is overvalued"],
        ["Market timing", "Issuing debt/equity when market prices are attractive, not to achieve target structure"],
        ["Optimal capital structure", "D/E ratio that minimizes WACC and maximizes firm value"],
        ["Interest coverage ratio", "EBIT divided by interest expense; measure of debt service capacity"],
        ["Debt-to-EBITDA", "Total debt divided by EBITDA; years to repay debt from operating cash flow"],
    ]
    story.append(table_std(terms, [4.5*cm, CONTENT_W - 4.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Define capital structure and explain key gearing ratios (D/E, debt-to-assets, etc.)",
        "State the Modigliani-Miller propositions and explain why capital structure is irrelevant in perfect markets without taxes",
        "Explain the tax shield effect and calculate its present value for perpetual and temporary debt",
        "Describe trade-off theory and the balance between tax shield benefits and financial distress costs",
        "Apply pecking order theory to explain why companies prefer internal funds over debt, and debt over equity",
        "Explain agency costs of debt and equity, and how capital structure can reduce total agency costs",
        "Interpret signalling theory and explain what capital structure decisions signal to the market",
        "Distinguish between practical determinants of capital structure (industry norms, asset tangibility, growth, taxes)",
        "Analyze the WACC curve and identify the optimal capital structure where WACC is minimized",
        "Calculate debt capacity using interest coverage, debt-to-EBITDA, and free cash flow ratios",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 6.1 — Company Valuation",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
