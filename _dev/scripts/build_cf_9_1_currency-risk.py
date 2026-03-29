"""
Booklesss Lesson PDF — Step 9.1: Currency Risk Management
Course: BAC4301 Corporate Finance
CF Perspective: How FX risk affects investment appraisal, valuation, and corporate decisions.
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
           "lesson-09-currency-risk-management")
OUT_PATH = os.path.join(OUT_DIR, "Step 9.1 - Currency Risk Management.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "9.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_CRIMSON)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "9.1 — Currency Risk Management")
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
    story.append(Paragraph("Currency Risk\nManagement", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 9.1 · FX exposure types, forward contracts, money market hedges, FX options, natural hedging, IRP and PPP",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Why Currency Risk Matters ──────────────────
    story += section("FOUNDATIONS", "Why Currency Risk Matters in Corporate Finance")
    story.append(body(
        "Currency risk arises whenever a company has cash flows in foreign currencies. "
        "An exporter earning USD when the home currency is ZMW faces transaction risk (gains or losses on settlement). "
        "A multinational with foreign subsidiaries faces translation risk (consolidation effects) and economic risk (changes in competitiveness)."
    ))
    story.append(body(
        "This step links currency management back to investment appraisal (Step 3.1). When evaluating an international project, "
        "the discount rate must account for FX risk. When a subsidiary abroad generates profits, FX changes affect the valuation of those earnings."
    ))
    story.append(body(
        "Unlike interest rate risk (which is often hedged), currency risk management balances hedging cost against the strategic importance of the exposure. "
        "Many companies accept currency risk on operational cash flows but hedge translation risk from balance sheet consolidation."
    ))
    story.append(body(
        "The chapter covers three types of FX exposure, then walks through the main hedging tools: forward contracts, money market hedges, FX options, "
        "and natural hedging. We'll finish with interest rate parity (IRP) and purchasing power parity (PPP) — two foundations of FX pricing."
    ))

    # ── SECTION 2: Types of FX Exposure ────────────────────────
    story += section("EXPOSURE TYPES", "Three Types of Currency Exposure")
    story.append(h3("Transaction Exposure"))
    story.append(body(
        "Transaction exposure arises when you've committed to a foreign currency cash flow. Example: a Zambian company selling goods to South Africa "
        "agrees to invoice in ZAR. Payment is due in 60 days. If ZMW strengthens against ZAR before payment, the company receives fewer kwacha than expected. "
        "If ZMW weakens, they receive more."
    ))
    story.append(body(
        "Transaction exposure is short-term (weeks or months) and directly measurable: you know the exact foreign currency amount and timing. "
        "It's usually hedged (via forward contracts or options) if material."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Translation Exposure"))
    story.append(body(
        "Translation exposure arises when you consolidate foreign subsidiaries into group financial statements. "
        "A subsidiary's balance sheet in USD must be translated to ZMW at a spot rate. If ZMW strengthens against USD, "
        "the subsidiary's assets appear smaller in kwacha terms (a translation loss, though not a cash loss)."
    ))
    story.append(body(
        "Translation exposure affects reported earnings and equity. Many companies hedge it via long-term forward contracts or by matching "
        "foreign assets with foreign liabilities (a natural hedge). Others accept it as a purely accounting effect and don't hedge."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Economic Exposure"))
    story.append(body(
        "Economic exposure is the risk that sustained FX changes affect your competitive position and future cash flows. "
        "If ZMW weakens persistently against USD, a Zambian exporter becomes more competitive (cheaper to foreign buyers); "
        "but a Zambian importer becomes less competitive (imports become more expensive). Long-term cash flows change."
    ))
    story.append(body(
        "Economic exposure is hard to hedge precisely because it's tied to strategy and competitive dynamics. "
        "Instead, companies manage it through operational choices (sourcing, pricing, production location)."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 3: Forward Contracts ───────────────────────────
    story += section("FORWARD CONTRACTS", "Hedging with Forward Contracts")
    story.append(body(
        "A forward contract is an agreement to exchange currencies at a fixed rate on a future date. "
        "It's the simplest and most common FX hedge for transaction exposure."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Worked Example — Zambia/South Africa"))
    example_text = ("A Zambian electronics importer expects to pay ZAR 2 million to a South African supplier in 3 months. "
        "Today's spot rate is ZMW 12.5 per ZAR (so ZAR 2m costs K25m). The importer worries the kwacha will weaken. "
        "The importer enters a 3-month forward at ZMW 12.9 per ZAR. In 3 months, regardless of the spot rate, the importer "
        "pays K25.8 million (2 million × 12.9). If spot is 13.2, the importer avoids the extra cost. If spot is 12.0, the importer "
        "pays the locked rate (12.9) rather than the better market rate, but that's the price of certainty.")
    story.append(callout(example_text))
    story.append(Spacer(1, 6))
    story.append(h3("Forward Pricing: Interest Rate Parity"))
    story.append(body(
        "The forward rate is determined by interest rate differentials (Interest Rate Parity). "
        "If ZMW interest rates are 12% and ZAR interest rates are 8%, the ZAR will appreciate forward (to offset the interest rate advantage). "
        "Forward rate ≈ Spot × (1 + ZMW rate) / (1 + ZAR rate)."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 4: Money Market Hedge ──────────────────────────
    story += section("MONEY MARKET", "Money Market Hedges")
    story.append(body(
        "A money market hedge uses borrowing and lending in foreign currencies to lock in an exchange rate. "
        "It's an alternative to forwards when the forward market is illiquid."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Worked Example"))
    example2_text = ("A Zambian company will receive USD 1 million in 6 months. Instead of buying a forward, "
        "the company borrows USD 970,000 today at 6% p.a. (USD 970k × 1.03 = USD 1m in 6 months). "
        "It converts the USD to ZMW at today's spot rate (ZMW 12 per USD). So it receives ZMW 11.64 million today (USD 970k × 12). "
        "In 6 months, the USD revenue (USD 1m) exactly repays the USD loan. The company has locked in ZMW 11.64 million. "
        "Compared to a forward at ZMW 12.2 per USD, the money market hedge costs slightly less (12.2 vs 11.64/970k = 12.01 on a 970k basis).")
    story.append(callout(example2_text))
    story.append(Spacer(1, 8))

    # ── SECTION 5: FX Options ──────────────────────────────────
    story += section("FX OPTIONS", "FX Options: Protection with Upside")
    story.append(body(
        "Unlike forwards (which lock in a rate), FX options give the buyer the right (but not obligation) to exchange at a strike rate. "
        "The buyer pays a premium upfront."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("FX Call Option"))
    story.append(body(
        "A call option to buy foreign currency. Example: A Zambian importer buys a 3-month call option to buy USD at ZMW 12.5 per USD, "
        "paying a premium of 0.5% (ZMW 0.0625 per USD). If spot in 3 months is 13.0, the importer exercises and buys at 12.5 (saving 0.5). "
        "If spot is 12.0, the importer doesn't exercise, buys at 12.0, and loses only the premium paid (0.0625)."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("FX Put Option"))
    story.append(body(
        "A put option to sell foreign currency. Example: An exporter receiving USD buys a 3-month put at ZMW 12.5 per USD. "
        "If spot falls to 11.8, the exporter exercises the put, selling at 12.5 (better than 11.8). If spot rises to 13.2, "
        "the exporter doesn't exercise, sells at 13.2, and loses only the premium."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 6: Natural Hedging ─────────────────────────────
    story += section("NATURAL HEDGING", "Natural Hedging: The Preferred Approach")
    story.append(body(
        "The best hedge is often not a financial derivative but a natural match of revenues and costs in the same currency. "
        "A company that earns USD and pays USD has no FX exposure; cash flows net out."
    ))
    story.append(body(
        "Examples: A Zambian mining company exports copper in USD and sources equipment and fuel partly in USD. "
        "The more USD costs it can incur, the less FX risk it faces on USD revenues. Alternatively, a subsidiary in South Africa "
        "can borrow in ZAR (rather than ZMW) so that its debt and assets are in the same currency."
    ))
    story.append(body(
        "Natural hedging requires operational choices (sourcing, pricing, location of operations). It's not perfect (you may not find enough offsetting costs), "
        "but where feasible, it's the cheapest way to manage FX risk."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 7: Cross-Currency Swaps ────────────────────────
    story += section("SWAPS", "Cross-Currency Swaps")
    story.append(body(
        "A cross-currency swap exchanges principal and interest in two different currencies. "
        "It's used for long-term FX management (e.g., a Zambian company with a long-term USD liability wants to convert to ZMW funding)."
    ))
    story.append(body(
        "Unlike a plain-vanilla interest rate swap, a cross-currency swap exchanges principal: one side pays principal in USD at the end, "
        "the other pays principal in ZMW. Each side pays interest in its currency. "
        "The effect: the company has converted USD debt into ZMW debt at a locked FX rate."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 8: Netting ────────────────────────────────────
    story += section("NETTING", "Netting: Reducing Gross FX Exposure")
    story.append(body(
        "Netting is a technique to reduce gross foreign currency exposure by offsetting payables and receivables. "
        "A company with USD payables and USD receivables settles the net amount, reducing the notional exposure."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Bilateral Netting"))
    story.append(body(
        "If subsidiary A owes subsidiary B USD 500k and subsidiary B owes subsidiary A USD 200k, "
        "only the net USD 300k flows. This reduces transaction costs and bank fees."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Multilateral Netting"))
    story.append(body(
        "Large multinationals with many subsidiaries use a netting center. Each subsidiary reports its payables and receivables "
        "in each currency. The netting center calculates the net position and arranges a smaller number of transfers. "
        "This significantly reduces FX transaction volumes."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 9: FX Risk and Investment Appraisal ────────────
    story += section("INVESTMENT", "FX Risk and International Project Appraisal (Step 3.1 Link)")
    story.append(body(
        "When appraising an international project, the discount rate must include a premium for currency risk. "
        "Two approaches:"
    ))
    story.append(bullet("Adjust cash flows: project home currency cash flows using expected future spot rates"))
    story.append(bullet("Adjust discount rate: include a currency risk premium in the discount rate (e.g., +2% if the currency is volatile)"))
    story.append(body(
        "A Zambian mining company evaluating a South African project must account for ZMW/ZAR volatility. "
        "If ZMW is expected to weaken, the project's USD/ZMW-denominated value is higher in kwacha terms, but that's only true "
        "if the company can convert ZAR earnings back to ZMW. If the company reinvests in ZAR, the currency risk is partly naturally hedged."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 10: Zambia and Regional FX Context ─────────────
    story += section("ZAMBIA", "Currency Risk in Zambia and the Southern African Region")
    story.append(body(
        "The kwacha (ZMW) has weakened persistently against the USD over the past decade (from ~K4 per USD in 2010 to K12+ in 2024). "
        "This reflects inflation, external deficits, and commodity (copper) price volatility. Zambian corporates have significant USD exposure."
    ))
    story.append(body(
        "Zambia's largest export, copper, is priced in USD. Mining companies naturally hedge: they earn USD but also incur USD costs (imported fuel, equipment). "
        "However, taxes and dividends are paid in ZMW, creating a long ZMW/short USD position."
    ))
    story.append(body(
        "Import-reliant sectors (retail, manufacturing) have large USD payables and little USD revenue, making them vulnerable to ZMW depreciation. "
        "Many Zambian importers hedge with forwards or options when the kwacha is weak."
    ))
    story.append(body(
        "Regional currency relationships: ZMW trades against ZAR (South Africa), BWP (Botswana), and USD. "
        "A company with multi-country Southern African operations faces ZMW/ZAR, ZMW/BWP, and cross-ZAR/USD exposure."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 11: IRP and PPP ────────────────────────────────
    story += section("THEORY", "Interest Rate Parity (IRP) and Purchasing Power Parity (PPP)")
    story.append(h3("Interest Rate Parity (IRP)"))
    story.append(body(
        "IRP states that the forward premium/discount on a currency equals the interest rate differential between the two countries. "
        "Formula: Forward rate = Spot × (1 + domestic rate) / (1 + foreign rate)."
    ))
    story.append(body(
        "Example: If ZMW rate is 12%, ZAR rate is 8%, and spot is 12 ZMW per ZAR, "
        "the 1-year forward is 12 × (1.12 / 1.08) = 12.44 ZMW per ZAR. The ZAR trades at a premium (forward is higher than spot) "
        "because ZMW interest rates are higher (you need compensation for holding ZMW instead of ZAR)."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Purchasing Power Parity (PPP)"))
    story.append(body(
        "PPP states that the exchange rate between two currencies should equal the ratio of price levels. "
        "If a basket of goods costs K100 in Zambia and ZAR 8 in South Africa, the equilibrium spot rate is K12.5 per ZAR. "
        "If inflation in Zambia is 10% and in South Africa 3%, the ZAR should appreciate by 7% over the year to maintain PPP."
    ))
    story.append(body(
        "In practice, IRP and PPP don't hold exactly (due to transaction costs, capital controls, and market frictions), "
        "but they're useful frameworks for forecasting long-term FX movements."
    ))
    story.append(Spacer(1, 8))

    # ── DISCUSSION SECTION WITH NUDGE ─────────────────────────
    story.append(Spacer(1, 4))
    story += section("DISCUSSION", "Think & Discuss")
    story.append(discussion_question_with_nudge(
        "A Zambian cotton exporter receives revenue in USD but has all expenses in ZMW. Annual USD revenue is K400 million at current rates. "
        "The kwacha is expected to weaken from 12 to 14 per USD over the next 12 months. Should the exporter hedge? "
        "If so, which instruments would you use: forwards, options, or natural hedging?",
        "Take this to <b>#cf-risk</b> — what's the treasurer's best move?"
    ))
    story.append(Spacer(1, 10))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Currency risk (FX risk)", "The exposure to gain or loss from changes in exchange rates"],
        ["Transaction exposure", "The risk on committed foreign currency cash flows (receivables/payables)"],
        ["Translation exposure", "The risk on consolidating foreign subsidiary balance sheets due to spot rate changes"],
        ["Economic exposure", "The risk that sustained FX changes affect competitive position and future cash flows"],
        ["Spot exchange rate", "The rate for immediate settlement (or standard settlement in 2 days)"],
        ["Forward exchange rate", "The rate for settlement at a future date (typically 3 months, 6 months, 1 year)"],
        ["Forward contract", "An agreement to exchange currencies at a fixed rate on a future date"],
        ["Interest rate parity (IRP)", "The principle that forward premiums equal interest rate differentials between countries"],
        ["Money market hedge", "Using borrowing/lending in foreign currencies to lock in an exchange rate"],
        ["FX call option", "The right (not obligation) to buy foreign currency at a strike rate; buyer pays premium"],
        ["FX put option", "The right (not obligation) to sell foreign currency at a strike rate; buyer pays premium"],
        ["Natural hedge", "Matching foreign currency revenues with costs in the same currency"],
        ["Cross-currency swap", "Exchanging principal and interest in two different currencies for long-term FX management"],
        ["Netting", "Offsetting payables and receivables in the same currency to reduce gross exposure"],
        ["Bilateral netting", "Netting between two subsidiaries"],
        ["Multilateral netting", "Netting across many subsidiaries via a central netting center"],
        ["Purchasing power parity (PPP)", "The principle that exchange rates adjust to reflect inflation differentials"],
    ]
    story.append(table_std(terms, [5*cm, CONTENT_W - 5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Identify and distinguish between transaction, translation, and economic FX exposure",
        "Explain how FX risk affects corporate valuation and international project appraisal (linking to Step 3.1)",
        "Calculate and interpret forward exchange rates using interest rate parity",
        "Hedge transaction exposure using forward contracts or money market hedges with worked examples",
        "Use FX options (calls, puts) to protect foreign currency positions while retaining upside",
        "Describe natural hedging strategies for reducing FX exposure operationally",
        "Explain cross-currency swaps for long-term FX management",
        "Apply netting strategies to reduce gross FX exposure across multiple subsidiaries",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 10.1 — Dividend Policy",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")
    size = os.path.getsize(OUT_PATH)
    print(f"File size: {size / 1024:.1f} KB")

if __name__ == "__main__":
    build()
