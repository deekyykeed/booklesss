"""
Booklesss Lesson PDF — Step 4.2: Investment Management
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
OUT_PATH = os.path.join(OUT_DIR, "Step 4.2 - Investment Management.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "4.2")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "4.2 — Investment Management")
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
    story.append(Paragraph("Investment Management", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 4.2 · Treasury investment policy, short-term instruments, medium-term instruments, portfolio construction, performance measurement",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Investment Objectives ───────────────────────
    story += section("FOUNDATIONS", "Treasury Investment Objectives")
    story.append(body(
        "Companies generate cash surpluses from operations, asset sales, and borrowing. "
        "This cash sits in bank accounts earning nothing until it's needed. "
        "Treasury's job is to invest these surpluses safely and profitably while maintaining liquidity."
    ))
    story.append(body(
        "When investing surplus cash, treasury faces a hierarchy of objectives — not all equally important:"
    ))
    story.append(Spacer(1, 4))

    story.append(h3("1. Safety (Capital Preservation)"))
    story.append(body(
        "The first rule is: don't lose the principal. A loss of capital is a failure of treasury's core function. "
        "This means avoiding default risk, credit risk, and unnecessary market risk. "
        "The safest investments — government bonds, bank deposits, money market funds — pay lower returns. But that's the trade-off."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("2. Liquidity (Accessibility)"))
    story.append(body(
        "Cash may be needed tomorrow for payroll, or in three months for a capital expenditure. "
        "Treasury must maintain a ladder of maturities so that funds are available when needed. "
        "This might mean passing up higher yields on longer-term instruments to keep funds in call deposits and short-term securities."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("3. Yield (Return on Investment)"))
    story.append(body(
        "Only after safety and liquidity are satisfied does treasury pursue higher yields. "
        "Yield is the residual objective — you earn what the market will give you on the remaining surplus after meeting the other two goals."
    ))
    story.append(Spacer(1, 8))

    story.append(callout(
        "<b>Key insight:</b> The hierarchy is strict. Do not sacrifice safety for yield. Do not sacrifice liquidity for yield. "
        "Too many corporate treasurers have learned this the hard way by investing in high-yield instruments that defaulted or became illiquid during a crisis.",
        "warn"))

    # ── SECTION 2: Investment Policy Statement ─────────────────
    story += section("POLICY", "Investment Policy Statement")
    story.append(body(
        "A treasury investment policy is a written document that sets the rules for investment. It covers:"
    ))
    story.append(Spacer(1, 4))

    policy_items = [
        ["Item", "Purpose"],
        ["Approved instruments", "Which securities can treasury buy (e.g., T-bills only, or also bank CDs and corporate bonds)"],
        ["Credit rating limits", "Minimum credit rating (e.g., no investment below BBB for corporates)"],
        ["Counterparty limits", "Maximum exposure to any single bank or institution (concentration risk)"],
        ["Maturity limits", "Maximum maturity allowed (e.g., no investments beyond 1 year for the operating reserve)"],
        ["Diversification", "How to spread risk across multiple issuers and instruments"],
        ["Reporting requirements", "How treasury reports on investment performance to management/board"],
        ["Review and approval process", "Who approves investment policy; how often it's reviewed"],
    ]
    story.append(table_std(policy_items, [3*cm, CONTENT_W - 3*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "The policy is approved by the board of directors or the audit committee. It protects both treasury and the company — "
        "it removes discretion and sets clear guardrails. If an investment goes bad, treasury can point to the policy and say, "
        "'We invested within the approved guidelines.'"
    ))

    # ── SECTION 3: Short-Term Investment Instruments ───────────
    story += section("SHORT-TERM", "Short-Term Investment Instruments")
    story.append(body(
        "Short-term instruments mature in less than one year. They are highly liquid and low-risk."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Treasury Bills (ZMW)"))
    story.append(body(
        "Issued by the Bank of Zambia (BoZ) on behalf of government. Bills mature in 91, 182, or 364 days. "
        "They are issued at a discount to par — you pay K99 for a K100 bill due in 91 days, earning K1 = 1.01% yield. "
        "T-bills are the safest investment available in Zambia (backed by government); they are also the most liquid (active secondary market). "
        "The downside: T-bill yields are usually the lowest available. In 2023–2024, BoZ T-bills yielded 25–27% due to inflation fighting; "
        "this is unusually high for Zambia."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Call Deposits"))
    story.append(body(
        "Current accounts at commercial banks that pay interest. The bank can require 7 or 30 days' notice before withdrawal, "
        "but in practice, money is available on request. Rates are lower than term deposits (the price of flexibility) but higher than cash in a non-interest-bearing account. "
        "Call deposits carry credit risk — the bank could fail — but this risk is typically rated as low for major Zambian banks."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Term Deposits"))
    story.append(body(
        "Fixed-term deposits (30, 60, 90, 120 days) at commercial banks. Rates increase with term length (the yield curve is upward sloping). "
        "Early withdrawal is usually not permitted, or it incurs a penalty. These are suitable for cash forecasted to be available for the full term."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Money Market Funds"))
    story.append(body(
        "Pooled investments in T-bills, call deposits, and commercial paper. A money market fund offers instant liquidity, professional management, "
        "and diversification. The fund manager invests your cash in a mix of instruments; you can withdraw at any time at net asset value (NAV). "
        "Returns fluctuate based on the underlying instruments. Money market funds are common in developed markets; they're less common in Zambia but growing."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 4: Medium-Term Instruments ─────────────────────
    story += section("MEDIUM-TERM", "Medium-Term Investment Instruments")
    story.append(body(
        "Medium-term instruments mature in 1-5 years. They offer higher yields than short-term instruments but carry more interest rate risk."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Bonds"))
    story.append(body(
        "Government and corporate bonds with maturity of 2-10 years. They pay regular coupons (interest) and return principal at maturity. "
        "Bond prices move inversely to market interest rates — if rates rise, bond prices fall. This creates market risk for treasury if it needs to sell before maturity. "
        "However, if treasury holds to maturity, the price fluctuation doesn't matter."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Bond Yield Calculation"))
    story.append(body(
        "Bonds are quoted by their yield, not their price. The yield accounts for the coupon, the purchase price, and the time to maturity."
    ))
    story.append(formula_box([
        "Yield to Maturity (YTM) is the internal rate of return on the bond given the purchase price.",
        "",
        "Example: A 5-year government bond with 8% coupon, face value K1,000,000",
        "If purchased at par (K1,000,000), YTM = 8%",
        "If purchased at discount (K950,000), YTM > 8% (the lower price increases the return)",
        "If purchased at premium (K1,050,000), YTM < 8% (the higher price reduces the return)",
    ]))
    story.append(Spacer(1, 8))

    # ── SECTION 5: Credit Risk in Investments ──────────────────
    story += section("CREDIT", "Credit Risk & Diversification")
    story.append(body(
        "When treasury invests in instruments issued by banks or corporations, it faces credit risk — the risk that the issuer defaults. "
        "Government bonds (in a stable country) carry negligible credit risk. Bank deposits carry credit risk equal to the bank's solvency. "
        "Corporate bonds carry higher credit risk based on the company's credit rating."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Counterparty Limits"))
    story.append(body(
        "An investment policy typically sets a limit on exposure to any single bank or issuer. For example:"
    ))
    story.append(bullet("No more than 20% of investable cash with any single bank"))
    story.append(bullet("No corporate bonds below A rating"))
    story.append(bullet("No single issuer to receive more than K500,000"))
    story.append(Spacer(1, 6))

    story.append(h3("Diversification"))
    story.append(body(
        "Spreading investments across multiple instruments and issuers reduces concentration risk. "
        "A portfolio of 50% T-bills, 30% call deposits across 3 banks, and 20% in short-dated corporate bonds is more diversified than 100% in one bank CD."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 6: Portfolio Construction ───────────────────────
    story += section("CONSTRUCTION", "Portfolio Construction Strategies")
    story.append(body(
        "Treasury uses several approaches to structure an investment portfolio. Each has different risk and return characteristics."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Laddering Strategy"))
    story.append(body(
        "Create a ladder of maturities — equal amounts invested in 1-month, 3-month, 6-month, and 12-month instruments. "
        "Each month/quarter, as the shortest-maturity instrument matures, reinvest it in the longest-maturity allowed by the policy. "
        "This maintains constant liquidity while capturing the yield curve's upward slope."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("Bullet Strategy"))
    story.append(body(
        "Invest all funds in instruments maturing on a specific future date — e.g., all in 6-month bonds. "
        "This matches a known cash need. If cash is needed in 6 months, buying all 6-month instruments guarantees the funds will be available. "
        "The downside: no portfolio rebalancing, and if rates rise sharply, you're locked in at the lower rate."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("Barbell Strategy"))
    story.append(body(
        "Invest in both short-term and long-term instruments (the 'barbell'), avoiding medium-term instruments. "
        "For example, 60% in 30-day deposits and 40% in 3-year bonds. This provides both liquidity and yield. "
        "It works well if you expect rates to move — if rates fall, the long bonds appreciate; if rates rise, the short-term reinvests at higher rates."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 7: Worked Example ──────────────────────────────
    story += section("EXAMPLE", "Worked Example: Building a Portfolio")
    story.append(body(
        "<b>Scenario:</b> A Zambian manufacturer has ZMW 5 million surplus cash. "
        "The treasurer forecasts that K2 million will be needed in 3 months (quarterly tax payment), "
        "K1.5 million in 6 months (dividend payment), and K1.5 million will be available for the full 12 months. "
        "The investment policy allows T-bills, bank CDs, call deposits (minimum credit rating A), and short-dated government bonds (maximum 2-year maturity)."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Current Yields"))
    yields = [
        ["Instrument", "Maturity", "Yield"],
        ["Call deposit (Bank A)", "On-demand", "10%"],
        ["Term deposit (Bank A)", "30 days", "11%"],
        ["Term deposit (Bank A)", "90 days", "12%"],
        ["T-bill", "91 days", "13%"],
        ["T-bill", "182 days", "14%"],
        ["Government bond", "1 year", "15%"],
        ["Government bond", "2 year", "16%"],
    ]
    story.append(table_std(yields, [3.5*cm, 2.5*cm, 2*cm]))
    story.append(Spacer(1, 10))

    story.append(h3("Portfolio Construction"))
    story.append(body(
        "<b>Tranche 1 (Liquidity reserve, K500,000):</b> "
        "Available for immediate use (contingencies, payroll). Invest in call deposits at 10%. Annual yield = K50,000."
    ))
    story.append(Spacer(1, 4))

    story.append(body(
        "<b>Tranche 2 (Due in 3 months, K2,000,000):</b> "
        "Needed for tax payment. Invest in 91-day T-bill at 13%. Annual yield = K260,000."
    ))
    story.append(Spacer(1, 4))

    story.append(body(
        "<b>Tranche 3 (Due in 6 months, K1,500,000):</b> "
        "Needed for dividend. Invest in 182-day T-bill at 14%. Annual yield = K210,000."
    ))
    story.append(Spacer(1, 4))

    story.append(body(
        "<b>Tranche 4 (Full 12 months, K1,000,000):</b> "
        "Available for the long term. Invest in 1-year government bond at 15%. Annual yield = K150,000."
    ))
    story.append(Spacer(1, 8))

    story.append(formula_box([
        "Total invested: K5,000,000",
        "Total annual yield: K50,000 + K260,000 + K210,000 + K150,000 = K670,000",
        "Blended yield: K670,000 ÷ K5,000,000 = 13.4%",
        "",
        "Note: The portfolio yields 13.4% while maintaining",
        "complete matching of cash needs with maturities.",
    ]))
    story.append(Spacer(1, 10))

    # ── SECTION 8: Performance Measurement ─────────────────────
    story += section("PERFORMANCE", "Performance Measurement")
    story.append(body(
        "Treasury's investment performance is measured against a benchmark. The benchmark is typically the weighted average of relevant market yields. "
        "For example, a portfolio invested 40% in 91-day T-bills and 60% in 1-year bonds should be measured against a benchmark weighted the same way."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Total Return"))
    story.append(body(
        "Total return includes coupon income plus any capital gains or losses from mark-to-market revaluation. "
        "For a buy-and-hold portfolio, total return equals the yield at purchase."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Performance Monitoring"))
    story.append(body(
        "Treasury reports on performance quarterly or annually, comparing realized return to the benchmark. "
        "Large deviations from the benchmark signal either skill or excessive risk-taking."
    ))
    story.append(Spacer(1, 10))

    # ── DISCUSSION QUESTIONS ───────────────────────────────────
    questions = (
        "<b>Question 1:</b> A company has ZMW 3 million available for investment for 6 months. "
        "Current 6-month T-bill yields 12%; 6-month term deposit at Bank X (rating A) yields 13%; "
        "6-month corporate bond (rating BBB) yields 15%. "
        "The company's investment policy prohibits corporate bonds below A. Which instrument should treasury choose? "
        "What is the expected return? "
        "<br/><br/>"
        "<b>Question 2:</b> Explain the trade-off between a laddering strategy (maintaining constant maturities) "
        "and a bullet strategy (concentrating investments in a single maturity). When is each appropriate?"
    )
    nudge = "Build a small portfolio using current Zambian instruments. Post your allocation, reasoning, and expected yield in #tm-investment — comparing how others solved the same problem deepens your understanding of the trade-offs."
    story.append(discussion_question_with_nudge(questions, nudge))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Treasury investment", "The deployment of surplus cash into securities to earn returns while preserving capital"],
        ["Safety (capital preservation)", "The primary objective: avoid loss of principal through default or imprudent risk"],
        ["Liquidity", "The ability to access cash when needed; a co-primary objective"],
        ["Yield", "The return earned on an investment, subordinate to safety and liquidity"],
        ["Investment policy statement", "A written document setting approved instruments, limits, and controls for treasury investment"],
        ["Credit rating limit", "A minimum acceptable credit rating for investment (e.g., no bonds below BBB)"],
        ["Counterparty limit", "A maximum exposure to any single issuer or institution"],
        ["Treasury bill", "Short-term government debt, issued at discount, maturity up to 1 year"],
        ["Call deposit", "Interest-bearing current account requiring notice (or not, in practice) before withdrawal"],
        ["Term deposit", "Fixed-term bank deposit at a fixed rate, maturity up to 12 months, no early withdrawal"],
        ["Money market fund", "A pooled investment in short-term instruments, offering liquidity and diversification"],
        ["Government bond", "Long-term debt issued by government, paying coupon, maturity 1-10+ years"],
        ["Yield to maturity (YTM)", "The effective return on a bond, accounting for coupon, price, and time to maturity"],
        ["Market risk", "The risk that a bond's price falls due to rising market interest rates"],
        ["Concentration risk", "The risk from overexposure to a single issuer or instrument"],
        ["Laddering", "A portfolio strategy using equal amounts across a range of maturities"],
        ["Bullet strategy", "Concentrating investments in a single maturity matching a known cash need"],
        ["Barbell strategy", "Investing in short-term and long-term instruments, avoiding the middle"],
        ["Total return", "Coupon income plus capital gains/losses from mark-to-market revaluation"],
    ]
    story.append(table_std(terms, [4.5*cm, CONTENT_W - 4.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain the three-tier hierarchy of treasury investment objectives (safety, liquidity, yield) and why the order matters",
        "Design an investment policy statement covering approved instruments, credit limits, maturity limits, and diversification",
        "Calculate yields on treasury bills and bonds; evaluate which instruments to select based on forecast cash needs",
        "Construct a portfolio using a laddering, bullet, or barbell strategy, matching investment maturities to cash forecasts",
        "Assess credit risk and set counterparty limits to prevent concentration risk",
        "Explain the trade-off between yield and liquidity in investment selection",
        "Measure portfolio performance against a benchmark and explain deviations",
        "Connect investment management to debt management (4.1) — both are about balancing cost and risk on the balance sheet",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 4.3 — Clearing & Settlement Systems",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
