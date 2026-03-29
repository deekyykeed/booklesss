"""
Booklesss Lesson PDF — Step 4.1: Debt Management
Course: BBF4302 Treasury Management
Style: Deep navy cover, white body, emerald accent, DejaVuSerif display, LiberationSans body.
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
#  COLOURS
# ─────────────────────────────────────────────
C_DARK      = colors.HexColor("#0B1D3A")
C_GRID      = colors.HexColor("#132646")
C_GREEN     = colors.HexColor("#10B981")
C_GREEN_DK  = colors.HexColor("#065F46")
C_INK       = colors.HexColor("#111827")
C_STEEL     = colors.HexColor("#6B7280")
C_MIST      = colors.HexColor("#9CA3AF")
C_RULE      = colors.HexColor("#E5E7EB")
C_AMBER     = colors.HexColor("#C17E3A")
C_WHITE     = colors.white

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

CHANNEL_NAME = "tm-investment"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Treasury Management", "content",
           "lesson-04-debt-investment-management")
OUT_PATH = os.path.join(OUT_DIR, "Step 4.1 - Debt Management.pdf")

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def make_styles():
    return {
        "cover_eyebrow": ParagraphStyle("cover_eyebrow",
            fontName="Body-Bold", fontSize=7.5, textColor=C_GREEN,
            leading=11, spaceAfter=10, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Georgia-Bold", fontSize=28, textColor=C_WHITE,
            leading=34, spaceAfter=10, alignment=TA_LEFT),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Body", fontSize=10, textColor=C_MIST,
            leading=15, spaceAfter=0, alignment=TA_LEFT),
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Body-Bold", fontSize=7, textColor=C_AMBER,
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
            fontName="Body-Bold", fontSize=10, textColor=C_GREEN_DK,
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
            fontName="Body-Bold", fontSize=9.5, textColor=C_GREEN_DK,
            leading=15, alignment=TA_LEFT),
        "discuss_q": ParagraphStyle("discuss_q",
            fontName="Body-Italic", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, alignment=TA_LEFT),
        "community_nudge": ParagraphStyle("community_nudge",
            fontName="Body-Italic", fontSize=8.5, textColor=C_GREEN_DK,
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
    canvas.setStrokeColor(C_GRID)
    canvas.setLineWidth(0.5)
    for i in range(1, 6):
        canvas.line(0, H * i / 6, W, H * i / 6)
    for i in range(1, 4):
        canvas.line(W * i / 4, 0, W * i / 4, H)
    canvas.setFillColor(C_GREEN)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.setFont("Georgia-Bold", 140)
    canvas.setFillColor(colors.HexColor("#0F2847"))
    canvas.drawRightString(W - MX, MY + 40, "4.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "4.1 — Debt Management")
    canvas.drawRightString(W - MX, H - MY + 7, "v1 · March 2026")
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFont("Body", 7.5)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(W / 2, MY - 14, "BBF4302 — Treasury Management")
    canvas.drawRightString(W - MX, MY - 14, f"Page {page_num}")
    canvas.restoreState()

# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────
def hairline():
    return HRFlowable(width="100%", thickness=0.5, color=C_AMBER, spaceAfter=10, spaceBefore=4)

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
        ('BACKGROUND',    (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_GREEN),
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
            "This is one step in the Treasury Management series running in the Booklesss study group on Slack. "
            "The channel for this topic is <b>#tm-investment</b> — that's where students going through "
            "BBF4302 are working through this material together, sharing past paper questions, and picking "
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
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_GREEN),
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
        ('LINEBELOW',     (0,0), (-1, 0), 1,   C_AMBER),
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
    story.append(Paragraph("BBF4302 TREASURY MANAGEMENT", ST["cover_eyebrow"]))
    story.append(Paragraph("Debt Management", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 4.1 · Sources of debt, short vs long-term debt, loan covenants, bond pricing, credit ratings, debt portfolio, restructuring",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: The Debt Management Function ────────────────
    story += section("OVERVIEW", "The Debt Management Function")
    story.append(body(
        "Corporate debt is central to financing strategy. A company needs working capital, funds for expansion, equipment purchases, and working capital management. "
        "Debt (along with equity) provides the cash to do these things. But debt is not free — it has a cost, and that cost varies based on the source, term, and credit quality."
    ))
    story.append(body(
        "The treasury function manages debt in the company's best interest. This means three things:"
    ))
    story.append(bullet("Minimise the cost of borrowing across all sources and maturities"))
    story.append(bullet("Manage the risk of debt — refinancing risk, interest rate risk, currency risk"))
    story.append(bullet("Maintain continued access to credit at reasonable rates"))
    story.append(Spacer(1, 8))

    story.append(body(
        "The trade-off between cost and risk is central to debt management. A cheaper source of funds might require a longer commitment (refinancing risk) "
        "or might be available only when needed least. Treasury must balance these forces constantly."
    ))

    # ── SECTION 2: Sources of Debt ─────────────────────────────
    story += section("SOURCES", "Sources of Debt")
    story.append(body(
        "Companies access funds from multiple sources. The choice of source depends on the amount needed, the duration, the company's credit rating, and market conditions."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("1. Bank Loans"))
    story.append(body(
        "The most common form of corporate debt. Banks lend on a secured (collateral required) or unsecured basis, depending on the borrower's creditworthiness. "
        "Loans can be fixed rate or variable rate (tied to a base rate like the Bank of Zambia repo rate)."
    ))
    story.append(bullet("Short-term: overdrafts, short-term loans (3-12 months)"))
    story.append(bullet("Medium-term: 3-5 year loans common for capital expenditure"))
    story.append(bullet("Secured loans carry lower rates because the lender has recourse to collateral"))
    story.append(Spacer(1, 4))

    story.append(h3("2. Bond / Debenture Issuance"))
    story.append(body(
        "Large corporates and governments issue bonds — long-term debt securities sold to investors. "
        "A bond is a promise to pay principal at maturity and interest (the coupon) at regular intervals. "
        "Bonds can be fixed or floating rate, secured or unsecured, convertible to equity (for corporates), or straight debt."
    ))
    story.append(bullet("Bonds typically mature in 3-20 years"))
    story.append(bullet("Investors can hold to maturity or sell in the secondary market"))
    story.append(bullet("Bond prices move inversely to interest rates — when rates rise, bond prices fall"))
    story.append(Spacer(1, 4))

    story.append(h3("3. Commercial Paper"))
    story.append(body(
        "Unsecured, short-term promissory notes issued by large, creditworthy companies. CP matures in 1-270 days, typically 30-90 days. "
        "It is issued at a discount to face value and carries lower rates than bank loans because it is short-term and issued by blue-chip companies."
    ))
    story.append(bullet("Must be renewed frequently (roll-over risk)"))
    story.append(bullet("Only available to large, highly-rated companies"))
    story.append(bullet("Active secondary market provides liquidity"))
    story.append(Spacer(1, 4))

    story.append(h3("4. Leasing"))
    story.append(body(
        "An alternative to debt financing for equipment. The company leases equipment from a lessor, paying rent over the lease term. "
        "This transfers the residual value risk to the lessor; the company avoids the upfront capital cost and obsolescence risk."
    ))
    story.append(bullet("Operating lease: short-term, flexible, resembles a rental"))
    story.append(bullet("Finance lease: long-term, effectively a purchase on credit"))
    story.append(Spacer(1, 4))

    story.append(h3("5. Hire Purchase"))
    story.append(body(
        "A form of instalment buying used for equipment. The finance company buys the equipment and the company hires it with an option to purchase at the end. "
        "Ownership transfers to the company once the final payment is made."
    ))
    story.append(Spacer(1, 8))

    story.append(callout(
        "<b>Zambia context:</b> Bank loans dominate corporate borrowing. Bonds are less common in Zambia due to shallow capital markets. "
        "However, the government regularly issues bonds domestically (ZMW and USD denominated). Commercial paper is rare. "
        "Leasing and hire purchase are used for equipment but less common than in developed markets.",
        "info"))

    # ── SECTION 3: Short-Term vs Long-Term Debt ────────────────
    story += section("MATCHING", "Short-Term vs Long-Term Debt: The Matching Principle")
    story.append(body(
        "A core principle in finance is the matching principle: the maturity of the source of funds should match the maturity of the use. "
        "Short-term assets should be financed with short-term debt; long-term assets with long-term debt."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Short-Term Debt"))
    story.append(body("Used for: working capital (inventory, receivables), seasonal cash needs, temporary shortfalls"))
    for adv in [
        "Lower interest rates (the yield curve is usually upward sloping)",
        "Flexible — can be renewed or replaced with different terms",
        "Matches the duration of working capital needs",
    ]:
        story.append(bullet(adv))
    story.append(h3("Disadvantages"))
    for dis in [
        "Refinancing risk — must find new funds when the loan matures",
        "Interest rate risk — rates may rise when the loan is renewed",
        "Overdraft availability may be cancelled at any time",
    ]:
        story.append(bullet(dis))
    story.append(Spacer(1, 8))

    story.append(h3("Long-Term Debt"))
    story.append(body("Used for: capital expenditure, fixed assets, long-term financing"))
    for adv in [
        "Certainty of funds — locked in for the full term",
        "No refinancing risk",
        "Matches the life of the asset being financed",
    ]:
        story.append(bullet(adv))
    story.append(h3("Disadvantages"))
    for dis in [
        "Higher interest rates",
        "Less flexibility — cannot be repaid early without penalty",
        "Commitment extends beyond the period for which funds may be needed",
    ]:
        story.append(bullet(dis))
    story.append(Spacer(1, 10))

    # ── SECTION 4: Loan Covenants ──────────────────────────────
    story += section("COVENANTS", "Loan Covenants")
    story.append(body(
        "A loan covenant is a restriction imposed by the lender on the borrower's activities. "
        "Covenants protect the lender by constraining the borrower's ability to take actions that might impair its ability to repay."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Affirmative Covenants (the borrower must)"))
    for cov in [
        "Maintain minimum working capital ratios or current ratios",
        "Maintain minimum interest coverage ratio (EBIT / Interest expense)",
        "Provide quarterly or annual financial statements to the lender",
        "Maintain insurance on assets financed by the loan",
        "Pay all taxes on time",
    ]:
        story.append(bullet(cov))
    story.append(Spacer(1, 6))

    story.append(h3("Restrictive Covenants (the borrower cannot)"))
    for cov in [
        "Issue additional debt beyond a specified level without lender consent",
        "Dispose of assets financed by the loan",
        "Pay dividends if doing so would violate a debt-to-equity ratio",
        "Make capital expenditures above a certain amount",
        "Change the nature of the business without lender consent",
    ]:
        story.append(bullet(cov))
    story.append(Spacer(1, 8))

    story.append(body(
        "Violations of covenants can trigger default, giving the lender the right to demand early repayment. "
        "This restriction on treasury's flexibility is the cost of borrowing — the lower the lender's risk, the lower the interest rate."
    ))

    # ── SECTION 5: Bond Valuation ──────────────────────────────
    story += section("BONDS", "Bond Pricing & Valuation")
    story.append(body(
        "When a company issues a bond, it specifies a coupon rate (the annual interest paid) and a face value (the principal repaid at maturity). "
        "The price at which the bond trades in the market depends on the market interest rate."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Bond Valuation Formula"))
    story.append(formula_box([
        "Bond Price  =  C / (1 + r) + C / (1 + r)² + ... + (C + FV) / (1 + r)ⁿ",
        "",
        "Where:  C = annual coupon payment",
        "        r = market interest rate (yield)",
        "        FV = face value (principal)",
        "        n = years to maturity",
    ]))
    story.append(Spacer(1, 6))

    story.append(h3("Worked Example: Zambian Corporate Bond"))
    story.append(body(
        "A Zambian manufacturing company issues a 5-year bond with face value K1,000,000, coupon rate 12% per annum (K120,000 paid annually). "
        "Current market yields for similar bonds are 14%."
    ))
    story.append(formula_box([
        "Bond Price  =  K120,000 / 1.14 + K120,000 / 1.14² + K120,000 / 1.14³ + K120,000 / 1.14⁴ + (K120,000 + K1,000,000) / 1.14⁵",
        "",
        "           =  K105,263 + K92,338 + K80,996 + K71,052 + K651,451",
        "           =  K1,001,100",
        "",
        "Wait — this bond is worth more than face value. Why?",
        "",
        "The bond is issued at par (K1,000,000) with a 12% coupon. Market rates are 14% at the time of sale.",
        "If the company issues at par, it's underpriced. The company has two options:",
        "1. Issue at 12.67% coupon instead, or",
        "2. Issue at face value but at a discount (investors pay K989,000, coupon is 12%, yield is 14%)",
        "",
        "In practice, the company issues at par with a coupon that yields 14% to investors.",
    ]))
    story.append(Spacer(1, 8))

    story.append(h3("Duration and Interest Rate Risk"))
    story.append(body(
        "Duration measures how sensitive a bond's price is to interest rate changes. "
        "A longer-duration bond (longer maturity, lower coupon) is more sensitive to rate changes. "
        "This is why long-term bond prices fall more sharply when rates rise than short-term bond prices do."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 6: Credit Ratings ──────────────────────────────
    story += section("RATINGS", "Credit Ratings")
    story.append(body(
        "Credit rating agencies (Moody's, Standard & Poor's, Fitch) assess the credit risk of borrowers. "
        "A rating reflects the agency's judgment of the likelihood that the issuer will default on its obligations."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Rating Scale"))
    ratings_data = [
        ["Rating", "S&P Grade", "Moody's Grade", "Interpretation"],
        ["AAA", "Prime", "Aaa", "Highest credit quality"],
        ["AA", "High Grade", "Aa", "Very high credit quality"],
        ["A", "Upper Medium Grade", "A", "Upper medium grade"],
        ["BBB", "Medium Grade", "Baa", "Medium grade"],
        ["BB", "Non-Investment Grade", "Ba", "Speculative"],
        ["B", "Highly Speculative", "B", "High default risk"],
        ["CCC", "In Default", "Caa", "In or near default"],
    ]
    story.append(table_std(ratings_data, [1.5*cm, 2*cm, 2*cm, 4*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "Investment grade (BBB and above) are considered safe for institutional investors. "
        "Below BBB is speculative grade — higher yield but higher default risk."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Zambia's Sovereign Rating"))
    story.append(body(
        "Zambia's sovereign credit rating affects the cost of borrowing for both government and corporates. "
        "A lower sovereign rating signals higher risk to international investors, which raises borrowing costs. "
        "Ratings are published by the three major agencies; they differ but move in the same direction. "
        "For students, the key insight is: credit ratings matter. A downgrade in a country's rating can tighten credit markets and raise rates."
    ))

    # ── DISCUSSION QUESTIONS ───────────────────────────────────
    questions = (
        "<b>Question 1:</b> A Zambian company has been offered bank financing at 18% on a 3-year loan, or a bond issuance with a 15% coupon. "
        "The company estimates its cost of equity at 20%. Why might the bond be cheaper? What risks does the company take on by issuing bonds instead of using bank loans? "
        "<br/><br/>"
        "<b>Question 2:</b> A company with a BBB credit rating approaches a bank for a 10-year loan. "
        "The bank proposes affirmative covenants (minimum interest coverage of 3.0x) and restrictive covenants (no additional debt without bank consent). "
        "How do these covenants protect the bank? How might they constrain the company's treasury function?"
    )
    nudge = "Work through a bond valuation problem or covenant analysis with real numbers. Post your answer in #tm-investment — discussing how ratings and covenants affect borrowing decisions is key to the module."
    story.append(discussion_question_with_nudge(questions, nudge))

    # ── SECTION 7: Debt Portfolio ──────────────────────────────
    story += section("PORTFOLIO", "Debt Portfolio Management")
    story.append(body(
        "A company's debt portfolio includes all outstanding borrowings — bank loans, bonds, leases, hire purchases, trade credit. "
        "Treasury must manage the mix to minimise cost while managing refinancing risk and interest rate risk."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Mix of Fixed and Floating Rate Debt"))
    story.append(body("Fixed rate debt locks in the cost. If rates rise, the company benefits. If rates fall, the company is locked in at the higher rate."))
    story.append(body("Floating rate debt moves with rates. If rates rise, the company's interest expense rises. If rates fall, it benefits."))
    story.append(body(
        "Treasury must decide: what is the right mix? This depends on the company's view of future rates, its ability to absorb rate increases (cash flow), "
        "and its risk tolerance. A company with stable, high cash flows can tolerate more floating rate debt. A company with volatile cash flows might prefer fixed."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Maturity Profile"))
    story.append(body(
        "Treasury should manage the maturity profile of debt — the distribution of maturities across time. "
        "A company that borrows K10 million due in Year 1, K10 million in Year 2, and K10 million in Year 3 faces refinancing risk each year, "
        "but it avoids a large refinancing spike in a single year. "
        "A company that borrows K30 million due in Year 1 faces a large refinancing need — if market conditions deteriorate or the company's credit rating drops, "
        "rolling over the debt becomes expensive or impossible."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 8: Debt Restructuring ──────────────────────────
    story += section("RESTRUCTURING", "Debt Restructuring")
    story.append(body(
        "When a company's cash flows deteriorate or rates fall sharply, it may consider restructuring its debt — negotiating new terms with creditors. "
        "This might mean extending maturity, reducing the coupon, or converting debt to equity."
    ))
    story.append(body(
        "Restructuring is preferable to default because it avoids the legal and reputational costs of default. "
        "But it signals financial stress and may damage the company's credit rating."
    ))
    story.append(Spacer(1, 10))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Debt", "Money owed by a company to creditors, repayable with interest"],
        ["Loan covenant", "Restrictions imposed by a lender on the borrower's activities"],
        ["Affirmative covenant", "A covenant that requires the borrower to take certain actions"],
        ["Restrictive covenant", "A covenant that prohibits the borrower from taking certain actions"],
        ["Bond", "A long-term debt security issued by a borrower and purchased by investors"],
        ["Coupon", "The annual interest paid on a bond, usually as a percentage of face value"],
        ["Face value", "The principal amount of a bond, repaid at maturity"],
        ["Yield", "The effective interest rate earned on a bond, based on the price paid"],
        ["Discount", "When a bond trades below face value (because market rates exceed coupon)"],
        ["Premium", "When a bond trades above face value (because coupon exceeds market rates)"],
        ["Duration", "A measure of how sensitive a bond's price is to interest rate changes"],
        ["Commercial paper", "Short-term, unsecured promissory notes, typically 1-270 days"],
        ["Credit rating", "An assessment of creditworthiness issued by a rating agency"],
        ["Investment grade", "Credit rating of BBB or better; considered safe for institutional investors"],
        ["Speculative grade", "Credit rating below BBB; higher risk, higher yield"],
        ["Matching principle", "The duration of financing should match the duration of the use"],
        ["Refinancing risk", "The risk that a loan cannot be renewed on the same terms"],
        ["Debt restructuring", "Negotiating new terms with creditors to improve the borrower's position"],
    ]
    story.append(table_std(terms, [4.5*cm, CONTENT_W - 4.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain the objectives of debt management and the role of the treasurer",
        "Identify the main sources of corporate debt and their characteristics (cost, duration, flexibility)",
        "Apply the matching principle to choose between short-term and long-term debt",
        "Explain loan covenants and how they protect lenders while constraining borrower flexibility",
        "Price a bond given face value, coupon, market yield, and years to maturity",
        "Interpret credit ratings and explain their impact on borrowing costs",
        "Manage a debt portfolio by balancing fixed vs floating rate debt and maturity profiles",
        "Explain debt restructuring and when it might be appropriate",
        "Cross-reference interest rate risk management (3.1) and foreign currency risk (3.2) in debt decisions",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 4.2 — Investment Management",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
