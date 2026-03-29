"""
Booklesss Lesson PDF — Step 3.1: Interest Rate Risk Management
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

CHANNEL_NAME = "tm-risk"
# Invite link — works for strangers (join flow) AND existing members (redirects to workspace)
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Treasury Management", "content",
           "lesson-03-interest-rate-risk")
OUT_PATH = os.path.join(OUT_DIR, "Step 3.1 - Interest Rate Risk Management.pdf")

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
        # Soft community closer — calm, peer-to-peer
        "community": ParagraphStyle("community",
            fontName="Body", fontSize=9.5, textColor=C_STEEL,
            leading=15, spaceAfter=5, alignment=TA_LEFT),
        "community_link": ParagraphStyle("community_link",
            fontName="Body-Bold", fontSize=9.5, textColor=C_GREEN_DK,
            leading=15, alignment=TA_LEFT),
        # Discussion question — genuine, not a CTA
        "discuss_q": ParagraphStyle("discuss_q",
            fontName="Body-Italic", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, alignment=TA_LEFT),
        # Community nudge in discussion box
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
    canvas.drawRightString(W - MX, MY + 40, "3.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "3.1 — Interest Rate Risk Management")
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
    """Discussion box with questions and community nudge line at bottom."""
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
    """Soft, peer-to-peer mention of the study group. Works for strangers and existing members."""
    elements = [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "This is one step in the Treasury Management series running in the Booklesss study group on Slack. "
            "The channel for this topic is <b>#tm-risk</b> — that's where students going through "
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

    # topPadding=MY + 20 keeps title in the WhatsApp preview zone (top ~15% of page)
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
    story.append(Paragraph("Interest Rate Risk\nManagement", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 3.1 · Measuring and hedging interest rate exposure through FRAs, swaps, futures, and options",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: What is Interest Rate Risk ─────────────────────
    story += section("FOUNDATIONS", "What Is Interest Rate Risk?")
    story.append(body(
        "Interest rate risk is the potential loss in a firm's profitability and market value arising from unexpected "
        "changes in interest rate levels. Every company with floating-rate debt, variable-rate borrowings, or "
        "fixed-income investments is exposed to this risk. When you borrow at a floating rate pegged to LIBOR or "
        "the Bank of Zambia policy rate, a rise in that reference rate directly increases your borrowing cost. "
        "Equally, if you hold fixed-rate bonds and interest rates rise, the market value of those bonds falls."
    ))
    story.append(Spacer(1, 8))
    story.append(h3("Types of Interest Rate Risk"))
    story.append(bullet("<b>Repricing risk:</b> Arises when assets and liabilities have different repricing dates. "
        "For example, a 5-year loan funding a 3-year investment means a repricing gap after 3 years."))
    story.append(bullet("<b>Basis risk:</b> Occurs when the reference rates on a firm's assets and liabilities move "
        "differently. A loan on LIBOR+2% funding an asset on prime rate creates basis risk."))
    story.append(bullet("<b>Yield curve risk:</b> Changes in the shape of the yield curve (the term structure of rates) "
        "affect firms differently depending on whether they borrow long or short term."))
    story.append(bullet("<b>Options risk (embedded options):</b> Bonds with embedded call or put options create asymmetric "
        "risk — borrowers can refinance if rates fall; lenders cannot fully capture upside if rates rise."))
    story.append(Spacer(1, 6))

    # ── SECTION 2: Measuring Interest Rate Exposure ─────────────────
    story += section("MEASUREMENT", "Measuring Interest Rate Exposure")
    story.append(body(
        "Treasury cannot manage what it cannot measure. Three key tools quantify interest rate sensitivity: "
        "gap analysis (repricing schedule), duration, and basis point value."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("1. Gap Analysis (Repricing Schedule)"))
    story.append(body(
        "Gap analysis groups assets and liabilities by their repricing dates. The <b>interest rate gap</b> in any "
        "time bucket is the difference between rate-sensitive assets (RSA) and rate-sensitive liabilities (RSL) maturing "
        "or repricing in that period."
    ))
    story.append(formula_box([
        "Gap = RSA — RSL",
    ]))
    story.append(body(
        "A positive gap means more assets reprice up than liabilities — if rates rise, net interest income rises. "
        "A negative gap means more liabilities reprice — if rates rise, net interest income falls. Gap analysis helps "
        "treasury decide whether to hedge."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("2. Duration"))
    story.append(body(
        "Duration measures the weighted-average time to receive a bond's cash flows, expressed in years. It is the "
        "primary measure of interest rate sensitivity for fixed-income securities. A bond with 5-year duration will "
        "lose approximately 5% in value if yields rise by 1% (100 basis points)."
    ))
    story.append(formula_box([
        "Price change (%) ≈ −Duration × Yield change (%)",
    ]))
    story.append(Spacer(1, 6))
    story.append(h3("3. Basis Point Value (BPV)"))
    story.append(body(
        "The dollar impact of a 1 basis point (0.01%) move in interest rates. For a ZMW 1 million notional principal, "
        "a 1 bp move in a 6-month rate implies a change in interest cost of ZMW 1m × 0.0001 × 0.5 = ZMW 50 per annum."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 3: Hedging with Forward Rate Agreements ─────────────
    story += section("INSTRUMENTS", "Hedging with Forward Rate Agreements (FRAs)")
    story.append(body(
        "A Forward Rate Agreement (FRA) is an over-the-counter contract in which two parties lock in an interest rate "
        "today for a loan or deposit to be made at a specified future date. Unlike bonds, FRAs require no principal exchange — "
        "only the interest rate difference is settled in cash."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("How FRAs Work"))
    story.append(body(
        "Suppose it is March and a company has a ZMW 1 million loan resetting in 6 months. The treasurer fears rates "
        "will rise. Current 6-month rates are 7%, but an FRA dealer quotes 7.5% for a 6-month loan starting in 6 months. "
        "The company buys the FRA at 7.5%."
    ))
    story.append(Spacer(1, 6))
    story.append(callout(
        "<b>Scenario 1 (Rates Rise to 8%):</b> The company pays the market rate of 8% on its loan but receives "
        "(8.0% − 7.5%) × ZMW 1m × 0.5 = ZMW 2,500 from the FRA counterparty. "
        "Net cost: 8.0% − 0.5% = 7.5%. The FRA locked in the 7.5% rate. "
        "<br/><br/>"
        "<b>Scenario 2 (Rates Fall to 6%):</b> The company pays the market rate of 6% on its loan but pays "
        "(7.5% − 6.0%) × ZMW 1m × 0.5 = ZMW 7,500 to the FRA counterparty. "
        "Net cost: 6.0% + 1.5% = 7.5%. The FRA still locks in 7.5%, sacrificing the benefit of falling rates.",
        style="info"
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 4: Interest Rate Swaps ─────────────────────────────
    story += section("SWAPS", "Interest Rate Swaps (IRS)")
    story.append(body(
        "An Interest Rate Swap (IRS) is an agreement between two parties to exchange periodic interest payments on "
        "a notional principal amount. One party pays fixed; the other pays floating. The notional principal is never "
        "exchanged — only the interest difference flows between parties. Swaps are longer-term than FRAs (typically 2–10 years) "
        "and allow firms to transform their debt structure without refinancing."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Why Companies Use Swaps"))
    story.append(bullet("<b>Transform debt structure:</b> A company borrowing at floating can swap into fixed (or vice versa)."))
    story.append(bullet("<b>Exploit comparative advantage:</b> If one party has a lower fixed-rate cost and another has a lower floating rate, "
        "a swap can benefit both (as in the Zambia Sugar / Lafarge example)."))
    story.append(bullet("<b>Longer horizon:</b> Swaps typically cover 2–10 years, longer than FRAs."))
    story.append(Spacer(1, 6))
    story.append(h3("Worked Example: The Zambia Sugar / Lafarge Swap"))
    story.append(body(
        "Zambia Sugar Plc has a AAA credit rating and can borrow at 10% fixed or LIBOR+0.3% floating. "
        "Lafarge Cement Plc has a BBB rating and can borrow at 11% fixed or LIBOR+0.5% floating. "
        "Zambia Sugar wants floating cost; Lafarge wants fixed cost."
    ))
    story.append(Spacer(1, 4))

    swap_data = [
        ["Party", "Market Fixed Rate", "Market Floating Rate"],
        ["Zambia Sugar", "10%", "LIBOR + 0.3%"],
        ["Lafarge", "11%", "LIBOR + 0.5%"],
        ["Advantage (Fixed/Floating)", "1% (absolute)", "0.2% (comparative)"],
    ]
    story.append(table_std(swap_data, [3.5*cm, 4*cm, 4*cm]))
    story.append(Spacer(1, 8))

    story.append(body(
        "<b>Swap structure:</b> Zambia Sugar borrows at 10% fixed; Lafarge borrows at LIBOR+0.5% floating. "
        "They agree that Zambia Sugar pays LIBOR to Lafarge, and Lafarge pays 10.1% to Zambia Sugar."
    ))
    story.append(Spacer(1, 4))

    swap_result = [
        ["Zambia Sugar", "Pays to market: 10%", "Receives from Lafarge: 10.1%", "Pays to Lafarge: LIBOR",
         "Net cost: LIBOR − 0.1% (saves 0.4% vs LIBOR+0.3%)"],
        ["Lafarge", "Pays to market: LIBOR+0.5%", "Receives from Zambia Sugar: LIBOR", "Pays to Zambia Sugar: 10.1%",
         "Net cost: 10.6% (saves 0.4% vs 11%)"],
    ]
    story.append(body("Outcome for each party:"))
    story.append(Spacer(1, 4))

    outcome_text = (
        "<b>Zambia Sugar:</b> Borrows at 10%, receives 10.1% from Lafarge, pays LIBOR to Lafarge. "
        "Net cost = LIBOR − 0.1%, a saving of 0.4% versus borrowing at LIBOR+0.3%. "
        "<br/><br/>"
        "<b>Lafarge:</b> Borrows at LIBOR+0.5%, receives LIBOR from Zambia Sugar, pays 10.1% to Zambia Sugar. "
        "Net cost = 10.6%, a saving of 0.4% versus borrowing at 11%."
    )
    story.append(callout(outcome_text, style="note"))
    story.append(Spacer(1, 8))

    # ── SECTION 5: Interest Rate Futures ───────────────────────────
    story += section("FUTURES", "Interest Rate Futures")
    story.append(body(
        "Interest rate futures are standardised, exchange-traded contracts that lock in a borrowing or lending rate "
        "for a future date. Unlike over-the-counter FRAs, futures are liquid and can be closed out (sold or bought back) "
        "at any time. However, they require margin payments and come in fixed contract sizes."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Pricing and Hedging"))
    story.append(body(
        "Interest rate futures prices are quoted as 100 minus the implied interest rate. "
        "If a 3-month Euribor futures contract is quoted at 97, the implied rate is 3% (100 − 97). "
        "If the rate is expected to rise to 4%, the price falls to 96. A borrower who sells (shorts) the contract "
        "gains when rates rise (contract price falls); a lender who buys (goes long) gains when rates fall."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Worked Example: Hedging with Futures"))
    story.append(body(
        "In June, a company has a variable-rate loan of ZMW 1 million resetting in 3 months at a new rate. "
        "Current 3-month rates are 5%; the company fears a rise to 6%. "
        "A ZMW 1 million futures contract is quoted at 95 (implying 5%)."
    ))
    story.append(Spacer(1, 4))
    story.append(callout(
        "<b>Hedge action:</b> The company sells 1 futures contract at 95. "
        "<br/><b>If rates rise to 6% in September:</b> The company pays an extra 1% on its loan = ZMW 2,500. "
        "But the futures contract now trades at 94 (100 − 6). The company buys it back at 94, gaining 1% on the contract, "
        "or ZMW 2,500 per quarter. The gain offsets the higher borrowing cost. "
        "<br/><b>Effective hedge cost:</b> The margin requirement (typically 1–2% of notional) and daily mark-to-market volatility. "
        "But the rate is locked in.",
        style="note"
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 6: Interest Rate Options ───────────────────────────
    story += section("OPTIONS", "Interest Rate Options (Caps, Floors, Collars)")
    story.append(body(
        "Interest rate options give the buyer the right, but not the obligation, to borrow or lend at a fixed rate. "
        "Unlike FRAs and swaps (which are binding), options are asymmetric: the buyer pays an upfront premium and then "
        "has the choice to exercise or not based on market rates."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Three Main Types"))
    story.append(bullet("<b>Interest Rate Cap:</b> Borrower buys the right to pay a maximum fixed rate. "
        "If rates rise above the cap, the seller reimburses the difference. If rates stay below, the borrower walks away "
        "(but loses the premium paid)."))
    story.append(bullet("<b>Interest Rate Floor:</b> Lender buys the right to receive a minimum fixed rate. "
        "If rates fall below the floor, the seller reimburses the difference."))
    story.append(bullet("<b>Interest Rate Collar:</b> Borrower buys a cap and simultaneously sells a floor. "
        "The premium from selling the floor offsets the cost of the cap, reducing the net cost of the hedge."))
    story.append(Spacer(1, 6))
    story.append(h3("Worked Example: Cap vs FRA"))
    story.append(body(
        "XYZ Plc has a ZMW 1 million loan resetting in 3 months. Current rates: 7%. "
        "A 3-month FRA is available at 7.5%; a cap at 7.5% strike with 0.3% premium costs ZMW 1,500 (ZMW 1m × 0.003 × 0.5)."
    ))
    story.append(Spacer(1, 4))

    cap_vs_fra = [
        ["Scenario", "FRA Outcome", "Cap Outcome"],
        ["Rates rise to 8%",
         "Locked in at 7.5% — receive ZMW 2,500 from FRA counterparty. Net interest = ZMW 40,500.",
         "Pay market 8% on loan. Cap reimburses (8.0% − 7.5%). Premium paid = ZMW 1,500. Net = ZMW 41,500."],
        ["Rates fall to 6%",
         "Locked in at 7.5% — pay ZMW 7,500 to FRA counterparty. Net interest = ZMW 40,500.",
         "Pay market 6%. Cap not exercised. Premium paid = ZMW 1,500. Net = ZMW 36,000."],
    ]
    story.append(table_std(cap_vs_fra, [2*cm, 3.5*cm, 3.5*cm]))
    story.append(Spacer(1, 6))
    story.append(body(
        "The FRA locks in 7.5% regardless of market rates. "
        "The cap protects against rates rising above 7.5% but lets the borrower benefit if rates fall (minus the premium). "
        "This optionality costs ZMW 1,500, but the upside is valuable in uncertain environments."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 7: Zambian Context ─────────────────────────────────
    story += section("CONTEXT", "Interest Rate Risk in Zambia")
    story.append(body(
        "Zambia's monetary policy is set by the Bank of Zambia Monetary Policy Committee (MPC). "
        "In early 2023, the policy rate was in the range of 10–12% per annum, with inflation running at 13–15%. "
        "Corporate borrowing rates typically track the policy rate with a spread (prime rate = policy rate + 3–5% for standard lending). "
        "A rise in the policy rate cascades quickly through the banking system to floating-rate borrowers and new fixed-rate loans."
    ))
    story.append(Spacer(1, 6))
    story.append(callout(
        "<b>Why this matters:</b> Zambian companies operating with variable-rate debt face material cost increases when the MPC "
        "raises rates to fight inflation. Treasury must actively monitor MPC statements and forward guidance to anticipate rate changes, "
        "then decide whether to hedge (lock in fixed rates via swaps or FRAs) or accept the risk.",
        style="warn"
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 8: Discussion ───────────────────────────────────────
    story += section("DISCUSSION", "Test Your Understanding")
    story.append(discussion_question_with_nudge(
        "<b>Question 1:</b> A company borrows ZMW 5 million on a 3-year floating rate pegged to the Bank of Zambia policy rate + 2%. "
        "The current policy rate is 11%. If it rises to 13%, what is the company's incremental annual cost? How would you use an IRS to hedge? "
        "<br/><br/>"
        "<b>Question 2:</b> Explain why a borrower might prefer a 2-year interest rate cap over a 2-year FRA. "
        "When would a collar be a better choice than a cap?",
        "Work through both questions with real numbers. Post your working in #tm-risk — "
        "seeing how others structure their hedges is half the learning."
    ))
    story.append(Spacer(1, 12))

    # ── KEY TERMS ───────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Interest rate risk", "Potential loss in firm value or profitability from unexpected changes in interest rates"],
        ["Repricing risk", "Mismatch in repricing dates of assets vs liabilities; gap is positive (asset-heavy) or negative (liability-heavy)"],
        ["Basis risk", "Risk that reference rates on assets and liabilities move differently, creating unhedged exposure"],
        ["Yield curve risk", "Changes in the term structure of rates affecting firms differently based on debt maturity"],
        ["Embedded options risk", "Asymmetric risk from bonds with call/put options; affects borrowers and lenders differently"],
        ["Gap analysis", "Scheduling of rate-sensitive assets (RSA) and liabilities (RSL) by repricing date to measure exposure"],
        ["Duration", "Weighted-average time to cash flows; measure of bond interest rate sensitivity"],
        ["Basis point value (BPV)", "Dollar impact of a 1 bp (0.01%) change in interest rates on a given notional principal"],
        ["Forward Rate Agreement (FRA)", "OTC contract locking in an interest rate for a future loan/deposit; settlement in cash only"],
        ["Interest Rate Swap (IRS)", "Exchange of fixed and floating interest payments on a notional principal; transforms debt structure"],
        ["Notional principal", "The amount on which interest payments are calculated in a swap or FRA; not physically exchanged"],
        ["Basis spread", "Difference between fixed-rate cost and floating-rate cost; opportunity for swap arbitrage"],
        ["Interest rate futures", "Exchange-traded, standardised contracts locking in future borrowing/lending rates"],
        ["Hedge ratio", "The number of contracts (or notional size) required to offset exposure in the underlying loan/investment"],
        ["Interest rate cap", "Option giving the buyer the right to pay a maximum fixed rate; seller reimburses if rates exceed cap"],
        ["Interest rate floor", "Option giving the buyer the right to receive a minimum fixed rate; seller reimburses if rates fall below floor"],
        ["Collar", "Combination of long cap + short floor; reduces net premium cost while capping upside"],
        ["Prime rate", "Benchmark lending rate set by central bank or leading commercial banks (in Zambia, set by Bank of Zambia + spread)"],
        ["Policy rate", "Official interest rate set by the central bank's Monetary Policy Committee; transmission mechanism for monetary policy"],
    ]
    story.append(table_std(terms, [4.5*cm, CONTENT_W - 4.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Define interest rate risk and explain the four main types (repricing, basis, yield curve, options)",
        "Conduct a gap analysis to identify positive and negative repricing gaps in a balance sheet",
        "Calculate duration and basis point value to quantify interest rate sensitivity",
        "Structure and evaluate a forward rate agreement (FRA) for a specific interest rate scenario",
        "Design an interest rate swap to transform floating debt into fixed (or vice versa)",
        "Use interest rate futures to hedge a floating-rate loan; calculate margin requirements and gains/losses",
        "Compare interest rate options (caps, floors, collars) against FRAs and swaps; explain when options are preferable",
        "Apply interest rate hedging techniques in a Zambian context with Bank of Zambia policy rate movements",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 3.2 — Foreign Exchange Risk Management",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
