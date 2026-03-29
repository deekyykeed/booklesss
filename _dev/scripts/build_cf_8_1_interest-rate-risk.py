"""
Booklesss Lesson PDF — Step 8.1: Interest Rate Risk Management
Course: BAC4301 Corporate Finance
CF Perspective: How interest rate risk affects WACC, bond valuation, and corporate finance decisions.
Style: Crimson/deep navy palette, DejaVuSerif display, LiberationSans body.
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
C_NAVY      = colors.HexColor("#1A1A2E")  # deep navy-purple (cover bg)
C_CRIMSON   = colors.HexColor("#E94560")  # crimson accent
C_DARK_RED  = colors.HexColor("#9B2335")  # dark accent
C_GHOST     = colors.HexColor("#251F35")  # ghost number
C_INK       = colors.HexColor("#111827")
C_STEEL     = colors.HexColor("#6B7280")
C_MIST      = colors.HexColor("#9CA3AF")
C_RULE      = colors.HexColor("#E5E7EB")
C_WHITE     = colors.white
C_BG_BOX    = colors.HexColor("#FFF5F5")  # discussion box bg

# ─────────────────────────────────────────────
#  PAGE GEOMETRY
# ─────────────────────────────────────────────
W, H        = A4
MX          = 2.2 * cm
MY          = 2.0 * cm
HEADER_H    = 28
FOOTER_H    = 28
CONTENT_W   = W - 2 * MX

CHANNEL_NAME = "cf-risk"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Corporate Finance", "content",
           "lesson-08-interest-rate-risk")
OUT_PATH = os.path.join(OUT_DIR, "Step 8.1 - Interest Rate Risk Management.pdf")

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
        "info_text": ParagraphStyle("info_text",
            fontName="Body", fontSize=9.5, textColor=colors.HexColor("#1D4ED8"),
            leading=15, alignment=TA_LEFT),
        "formula": ParagraphStyle("formula",
            fontName="Body-Bold", fontSize=10, textColor=C_DARK_RED,
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
            fontName="Body-Bold", fontSize=9.5, textColor=C_DARK_RED,
            leading=15, alignment=TA_LEFT),
        "discuss_q": ParagraphStyle("discuss_q",
            fontName="Body-Italic", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, alignment=TA_LEFT),
        "community_nudge": ParagraphStyle("community_nudge",
            fontName="Body-Italic", fontSize=8.5, textColor=C_DARK_RED,
            leading=14, spaceAfter=0, alignment=TA_LEFT),
    }

ST = make_styles()

# ─────────────────────────────────────────────
#  CANVAS CALLBACKS
# ─────────────────────────────────────────────
def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_NAVY)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#251F35"))
    canvas.setLineWidth(0.5)
    for i in range(1, 6):
        canvas.line(0, H * i / 6, W, H * i / 6)
    for i in range(1, 4):
        canvas.line(W * i / 4, 0, W * i / 4, H)
    canvas.setFillColor(C_CRIMSON)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.setFont("Georgia-Bold", 140)
    canvas.setFillColor(C_GHOST)
    canvas.drawRightString(W - MX, MY + 40, "8.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_CRIMSON)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "8.1 — Interest Rate Risk Management")
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
    bg = colors.HexColor("#EFF6FF")
    border_col = colors.HexColor("#1D4ED8")
    st = ST["info_text"]
    p = Paragraph(text, st)
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
        ('BACKGROUND',    (0,0), (-1,-1), C_BG_BOX),
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
            "The channel for this topic is <b>#cf-risk</b> — that's where students going through "
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
        ('BACKGROUND',    (0,0), (-1,-1), colors.HexColor("#FFF5F5")),
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
    return KeepTogether([t, Spacer(1, 8)])

# ─────────────────────────────────────────────
#  BUILD
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
    story.append(Paragraph("Interest Rate Risk\nManagement", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 8.1 · IR risk types, duration, hedging with FRAs/swaps/futures/options, corporate treasurer framework",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Why Interest Rate Risk Matters ──────────────
    story += section("FOUNDATIONS", "Why Interest Rate Risk Matters")
    story.append(body(
        "Interest rates are the price of credit and savings. When interest rates change, they affect every corporate finance decision: "
        "the cost of debt (WACC, Step 4.1), the value of bonds (Step 6.1), and the valuation of long-term projects (Step 1.1 onwards)."
    ))
    story.append(body(
        "A company with large borrowing plans or existing floating-rate debt faces interest rate exposure. If rates rise, debt becomes more expensive; "
        "if rates fall, the company may lock in higher rates unnecessarily. The treasurer's job is to identify this exposure and decide whether to hedge."
    ))
    story.append(body(
        "Interest rate risk has multiple sources: repricing risk (when your debt refinances at a new rate), basis risk (when the benchmark rate and your cost don't move together), "
        "yield curve risk (when the shape of the term structure changes), and options risk (when embedded options in debt or assets become valuable)."
    ))
    story.append(body(
        "This step shows how interest rates affect corporate value and walks you through the main hedging instruments: forward rate agreements (FRAs), "
        "interest rate swaps, futures, and options. We'll finish with a decision framework for when to hedge."
    ))

    # ── SECTION 2: How IR Changes Affect Company Value ────────
    story += section("VALUATION IMPACT", "How Interest Rate Changes Affect Company Value")
    story.append(body(
        "Interest rates change affect company value through two channels:"
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Effect on WACC (Step 4.1)</b>", ST["h3"]))
    story.append(body(
        "WACC = (E/V) × Re + (D/V) × Rd × (1 − Tc), where Rd is the cost of debt. "
        "When interest rates rise, Rd rises, WACC rises, and the value of all future cash flows falls (discount rate effect). "
        "The reverse occurs when rates fall."
    ))
    story.append(body(
        "A one percentage point increase in interest rates might raise WACC from 8% to 9%. "
        "For a company worth K10 billion today, a 1% rise in discount rate typically falls value by 10-15%."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Effect on Bond Prices (Step 6.1)</b>", ST["h3"]))
    story.append(body(
        "Bond value is the present value of coupon and principal: P = C / (1+y) + C / (1+y)² + ... + (C + FV) / (1+y)^n, "
        "where y is the yield to maturity. If rates (y) rise, P falls. If rates fall, P rises."
    ))
    story.append(body(
        "A corporate treasurer managing a bond portfolio (e.g., from a pension fund or insurance subsidiary) is exposed: "
        "if rates rise, the portfolio value falls. Duration measures this sensitivity."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 3: Types of Interest Rate Risk ────────────────
    story += section("RISK TYPES", "Types of Interest Rate Risk")
    story.append(h3("Repricing Risk"))
    story.append(body(
        "When a loan or bond matures and must be refinanced at a new rate. Example: a 3-year revolving credit facility "
        "renews every year; the company is exposed to the 1-year rate at each rollover."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Basis Risk"))
    story.append(body(
        "When your actual borrowing rate and a benchmark (e.g., ZIBOR or T-bill) don't move in lockstep. "
        "You might borrow at ZIBOR + 2%. If ZIBOR rises 1% but your spread widens to +2.5%, you face basis risk."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Yield Curve Risk"))
    story.append(body(
        "When the term structure of interest rates changes shape. For example, the 1-year rate might rise but the 5-year rate falls. "
        "A company borrowing short-term and lending long-term is exposed."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Options Risk (Embedded Options)"))
    story.append(body(
        "When a bond or loan contains an embedded option. A callable bond gives the issuer the option to refinance if rates fall; "
        "the bondholder's upside is capped. A putable bond gives the holder the option to return the bond if rates rise; the issuer's downside is capped."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 4: Duration ────────────────────────────────────
    story += section("BOND METRICS", "Duration and Its Role")
    story.append(body(
        "Duration measures the average time you wait to receive cash flows from a bond, weighted by present value. "
        "It's a key metric because it tells you how sensitive a bond price is to interest rate changes."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Macaulay Duration</b>", ST["h3"]))
    story.append(body(
        "Macaulay Duration = Σ(t × PV of CF_t) / Bond Price. A bond with duration 5 years means the effective maturity is 5 years. "
        "For a 10-year bond paying high coupons, duration is less than 10 years because you get cash back sooner."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Modified Duration</b>", ST["h3"]))
    story.append(body(
        "Modified Duration ≈ Macaulay Duration / (1 + y). It tells you the % price change per 1% change in yield: "
        "ΔP / P ≈ −MD × Δy. A bond with modified duration 4.5 falls 4.5% in price if yields rise 1%."
    ))
    story.append(body(
        "A treasurer managing a bond portfolio uses duration to hedge: if duration is 5 and the portfolio is K100 million, "
        "a 1% rate increase causes a K4.5 million loss. The treasurer can hedge by shorting bonds or using interest rate derivatives."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 5: Hedging with FRAs ──────────────────────────
    story += section("HEDGING TOOLS", "Hedging with Forward Rate Agreements (FRAs)")
    story.append(body(
        "A Forward Rate Agreement (FRA) is a contract to fix the interest rate on a notional principal for a period in the future. "
        "It's the most direct way to hedge repricing risk."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("FRA Mechanics"))
    story.append(body(
        "An FRA is typically denoted 3x6 (means: rate applies from month 3 to month 6), 6x12, or 1x4. "
        "The FRA buyer locks in the rate (agrees to pay fixed, receive floating). The FRA seller agrees to pay fixed, receive floating."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("FRA Worked Example — Zambia Context"))
    callout_text = ("A Zambian mining company borrows K50 million on a floating rate (ZIBOR + 2%) in 3 months for 6 months. "
        "The treasurer is concerned ZIBOR will rise from today's 12% to 14%, costing an extra K50,000 in interest over 6 months. "
        "The treasurer buys a 3x6 FRA at 13.5%. "
        "Outcome: If ZIBOR rises to 14%, the FRA pays off. The company pays 14% + 2% = 16% on the loan, but receives compensation on the FRA, "
        "effectively locking in 13.5% + 2% = 15.5%. If ZIBOR falls to 11%, the company pays 11% + 2% = 13%, and the FRA costs them money, "
        "capping the benefit at 13.5% + 2% = 15.5%.")
    story.append(callout(callout_text))
    story.append(Spacer(1, 8))

    # ── SECTION 6: Interest Rate Swaps ────────────────────────
    story += section("SWAPS", "Interest Rate Swaps")
    story.append(body(
        "An interest rate swap allows two parties to exchange interest payment obligations. The most common is the plain-vanilla "
        "fixed-for-floating swap: one side pays fixed, the other pays floating, on a notional principal that never changes hands."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Fixed-for-Floating Swap: How a Corporate Uses It"))
    story.append(body(
        "Suppose a company has K100 million of floating-rate debt at ZIBOR + 2%. Management worries ZIBOR will rise. "
        "They enter a 5-year swap: the company pays a fixed rate (say 14%) and receives ZIBOR."
    ))
    story.append(body(
        "Cash flows:"
    ))
    story.append(bullet("Company pays: ZIBOR + 2% to the bank (debt) + 14% to the swap counterparty (swap side)"))
    story.append(bullet("Company receives: ZIBOR from the swap counterparty"))
    story.append(bullet("Net: Company pays 14% + 2% = 16% fixed"))
    story.append(body(
        "The swap has converted floating-rate debt into fixed-rate debt. If ZIBOR rises to 16%, the company still pays only 16% all-in "
        "(because 16% + 2% on the debt is offset by the swap). If ZIBOR falls to 10%, the company pays only 16% (swap keeps them at fixed)."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 7: Interest Rate Futures ──────────────────────
    story += section("FUTURES", "Interest Rate Futures")
    story.append(body(
        "Interest rate futures are exchange-traded contracts that allow standardised hedging of interest rate risk. "
        "They're used for short-term borrowing (3-month bill futures, 1-year note futures) and longer-term hedging (5-year, 10-year bond futures)."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Hedging a Future Borrowing with Futures"))
    story.append(body(
        "Suppose a company will borrow K50 million in 3 months for 12 months at the 1-year rate. "
        "If rates rise, borrowing costs rise. To hedge, the company shorts 1-year note futures today."
    ))
    story.append(body(
        "Mechanics: If the 1-year rate rises from 12% to 13%, the company's borrowing cost rises by K50,000 × 1% = K50,000. "
        "But the short futures position gains: each basis point move = (contract size / 10,000) × price change. "
        "If the contract is worth K100,000 notional, a 100 bp rise is worth ~K1,000 per contract. With 50 contracts, the gain is K50,000."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 8: Interest Rate Options ──────────────────────
    story += section("OPTIONS", "Interest Rate Options: Caps, Floors, Collars")
    story.append(body(
        "Unlike forwards and swaps (which lock in a rate), options give the buyer the right (not obligation) to exercise. "
        "The buyer pays a premium upfront."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Interest Rate Caps"))
    story.append(body(
        "A cap is a call option on interest rates. If ZIBOR rises above the cap rate (e.g., 14%), the cap pays off; "
        "if ZIBOR stays below, the option expires worthless. The company pays a premium upfront but keeps the upside if rates fall."
    ))
    story.append(body(
        "Example: Company borrowing at ZIBOR + 2% buys a 14% cap. If ZIBOR is 15%, the cap pays 1%, offsetting the extra 1% cost. "
        "If ZIBOR is 12%, the cap doesn't apply; the company pays 14% (12% + 2%) all-in."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Interest Rate Floors"))
    story.append(body(
        "A floor is a put option. If rates fall below the floor rate, the floor pays off. "
        "Investors or lenders use floors to protect against earning less on their assets."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Collars"))
    story.append(body(
        "A collar combines a cap and a floor: company buys a cap at 14% and sells a floor at 12%. "
        "The premium on the floor offsets the premium on the cap, making it low- or zero-cost. The company's cost is capped at 14% and floored at 12%."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 9: Swaptions ───────────────────────────────────
    story += section("ADVANCED TOOLS", "Swaptions: Options on Swaps")
    story.append(body(
        "A swaption is an option to enter into a swap at a future date. It's useful when a company is uncertain about future borrowing needs. "
        "A swaption buyer can lock in a swap rate today; if market rates move favourably, the buyer can ignore the option and borrow at the better market rate."
    ))
    story.append(body(
        "Example: A company plans a major expansion in 2 years but isn't sure yet. They buy a 2-year payer swaption "
        "(option to enter a 5-year swap paying 14% fixed, receiving ZIBOR). If in 2 years the market 5-year fixed rate is 16%, "
        "they exercise and lock in 14%. If the market rate is 12%, they ignore the option and borrow at 12%."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 10: Treasurer's Decision Framework ────────────
    story += section("FRAMEWORK", "The Corporate Treasurer's Decision Framework")
    story.append(body(
        "When do you hedge? How much? With which instrument? Here's a practical framework:"
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>1. Identify the Exposure</b>", ST["h3"]))
    story.append(bullet("Is it repricing risk (debt matures soon), basis risk, yield curve risk, or embedded options?"))
    story.append(bullet("What's the notional amount and the maturity?"))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>2. Quantify the Impact</b>", ST["h3"]))
    story.append(bullet("If rates rise 1%, how much does the company lose? Is it material (>1% of EBIT)?"))
    story.append(bullet("Use scenario analysis or stress testing (what if rates rise 200 bp?)."))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>3. Decide: Hedge or Accept?</b>", ST["h3"]))
    story.append(bullet("If the exposure is small relative to earnings, accept it (hedging cost may exceed benefit)."))
    story.append(bullet("If material, hedge. Hedging allows the company to plan confidently (fixed cash flows, predictable WACC)."))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>4. Choose the Instrument</b>", ST["h3"]))
    story.append(body(
        "<b>FRA or swap (if you want to lock in a rate, period):</b> Use if the exposure is certain and you want to fix cost. "
        "Disadvantage: no upside if rates move favourably. Cost: bid-ask spread and a small percentage upfront (FRA) or zero (swap, though counterparty risk applies)."
    ))
    story.append(body(
        "<b>Futures (if you want leverage, liquidity, and mark-to-market convenience):</b> Highly liquid, no counterparty risk (exchange-cleared), "
        "but basis risk (contract specs may not match your exposure exactly). Cost: margin and trading costs."
    ))
    story.append(body(
        "<b>Options (if you want asymmetry: protection with upside):</b> Cap, floor, or swaption. Cost: premium upfront (1-2% of notional per year, depending on maturity and volatility). "
        "Benefit: if rates move in your favour, you profit; if they move against, the loss is capped."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>5. Monitor and Rebalance</b>", ST["h3"]))
    story.append(bullet("Hedges don't last forever. As debt is repaid, reduce hedge size."))
    story.append(bullet("If market conditions change materially, revisit the hedge."))
    story.append(Spacer(1, 8))

    # ── SECTION 11: Zambia Context ─────────────────────────────
    story += section("ZAMBIA", "Interest Rate Risk in Zambia")
    story.append(body(
        "The Bank of Zambia (BoZ) sets the benchmark policy rate (currently around 10-11% as of early 2026). "
        "When the BoZ raises rates to fight inflation, commercial bank prime lending rates rise. A Zambian company borrowing at prime + 3% faces repricing risk."
    ))
    story.append(body(
        "Most Zambian corporate debt is short- to medium-term (1-3 years) and floats at prime or ZIBOR. "
        "Long-term fixed-rate debt is rare because local banks prefer to lend short and roll over. This creates refinancing risk: "
        "when a 3-year facility rolls over, the company must refinance at the new BoZ rate environment."
    ))
    story.append(body(
        "Hedging tools (swaps, options) are less developed in Zambia than in developed markets. Most hedging is done via forward contracts "
        "or by borrowing fixed-rate from development finance institutions (e.g., African Development Bank) at a slightly higher rate but with certainty."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 12: Cross-References ───────────────────────────
    story += section("CONNECTIONS", "Cross-References to Other Steps")
    story.append(body(
        "<b>Step 4.1 (Cost of Capital):</b> WACC is sensitive to the cost of debt. A 1% change in interest rates changes WACC and all valuations. "
        "This step shows how to manage that risk."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 5.1 (Capital Structure):</b> Floating-rate debt and its refinancing risk interact with capital structure decisions. "
        "A highly leveraged company with floating-rate debt is more exposed."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 6.1 (Valuation & Bond Pricing):</b> Bond prices fall when interest rates rise. A treasurer managing a bond portfolio "
        "uses duration and hedging to manage this."
    ))
    story.append(Spacer(1, 8))

    # ── DISCUSSION SECTION WITH NUDGE ─────────────────────────
    story.append(Spacer(1, 4))
    story += section("DISCUSSION", "Think & Discuss")
    story.append(discussion_question_with_nudge(
        "A Zambian copper miner has K200 million of floating-rate debt at prime + 2%. The BoZ is expected to raise the policy rate by 200 bp over the next 18 months. "
        "The company's current interest expense is K25 million per year. Should the company hedge? If so, which instrument would you choose and why?",
        "Take this to <b>#cf-risk</b> — what would you hedge?"
    ))
    story.append(Spacer(1, 10))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Interest rate risk", "The exposure to loss arising from changes in market interest rates"],
        ["Repricing risk", "The risk that debt matures and must be refinanced at a new rate"],
        ["Basis risk", "The risk that a benchmark rate and actual borrowing rate don't move in tandem"],
        ["Yield curve risk", "The risk that the term structure of interest rates changes shape"],
        ["Options risk", "The risk from embedded options in bonds or loans that benefit one party when rates change"],
        ["Duration", "The average time to receive cash flows from a bond; measures interest rate sensitivity"],
        ["Modified duration", "The % price change per 1% change in yield; used to calculate bond price sensitivity"],
        ["Forward rate agreement (FRA)", "A contract to fix an interest rate on a notional principal for a future period"],
        ["Interest rate swap", "A contract to exchange interest payment obligations (fixed for floating, typically)"],
        ["Interest rate futures", "Exchange-traded contracts on short- or long-term interest rates; used for hedging"],
        ["Interest rate cap", "An option that pays off if interest rates rise above a strike rate"],
        ["Interest rate floor", "An option that pays off if interest rates fall below a strike rate"],
        ["Interest rate collar", "A combination of a cap and a floor, often zero-cost"],
        ["Swaption", "An option to enter into an interest rate swap at a future date"],
        ["Tick value", "The dollar amount of the minimum price movement in a futures contract"],
        ["Notional principal", "The principal amount used to calculate interest payments in a swap or FRA; doesn't change hands"],
        ["Counterparty risk", "The risk that the other party to a swap or forward contract defaults"],
    ]
    story.append(table_std(terms, [5*cm, CONTENT_W - 5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain how interest rate changes affect company value through WACC and bond pricing",
        "Identify the main types of interest rate risk (repricing, basis, yield curve, options)",
        "Calculate and interpret modified duration for a bond portfolio",
        "Explain how a corporate treasurer uses a forward rate agreement to hedge repricing risk",
        "Describe the mechanics of an interest rate swap and how it converts floating-rate debt to fixed-rate debt",
        "Explain the role of interest rate futures in hedging and calculate tick values",
        "Distinguish between interest rate options (caps, floors, collars) and explain when each is used",
        "Apply the treasurer's decision framework to decide whether to hedge and which instrument to use",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 9.1 — Currency Risk Management",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")
    size = os.path.getsize(OUT_PATH)
    print(f"File size: {size / 1024:.1f} KB")

if __name__ == "__main__":
    build()
