"""
Booklesss Lesson PDF — Step 3.2: Foreign Exchange Risk Management
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
OUT_PATH = os.path.join(OUT_DIR, "Step 3.2 - Foreign Exchange Risk Management.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "3.2")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "3.2 — Foreign Exchange Risk Management")
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
    story.append(Paragraph("Foreign Exchange Risk\nManagement", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 3.2 · Transaction and translation risk, forward contracts, options, and hedging strategies",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Types of FX Exposure ────────────────────────
    story += section("FOUNDATIONS", "Types of Foreign Exchange Exposure")
    story.append(body(
        "Foreign exchange (FX) risk arises whenever a company deals in multiple currencies. "
        "Unlike interest rate risk (which is independent of foreign currency), FX risk affects firms with international "
        "operations, cross-border receivables/payables, or foreign investments. Three types of FX exposure exist:"
    ))
    story.append(Spacer(1, 6))

    story.append(h3("1. Transaction Exposure"))
    story.append(body(
        "Arises from committed foreign currency cash flows. For example, an export sale to a US customer with payment "
        "due in 90 days is a transaction exposure. If the USD weakens against the ZMW, the Zambian company receives fewer kwacha "
        "for each dollar when it converts the payment. Transaction exposure is the most immediate and quantifiable FX risk."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("2. Translation Exposure"))
    story.append(body(
        "Arises from the need to consolidate foreign subsidiary financial statements into the parent company's home currency. "
        "When a foreign subsidiary's assets, liabilities, or earnings are restated in the parent's currency, exchange rate changes "
        "affect reported equity and earnings. Translation exposure is an accounting issue — it doesn't reflect cash flow changes — "
        "but it affects reported financial performance and may trigger loan covenant violations."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("3. Economic Exposure"))
    story.append(body(
        "Arises from the long-term impact of exchange rate changes on a company's competitive position and future cash flows. "
        "If the kwacha strengthens, Zambian exporters become less price-competitive internationally, reducing future sales and cash flows. "
        "Economic exposure is the hardest to quantify and hedge, but it is the most strategically important."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 2: FX Quotations and Cross Rates ───────────────
    story += section("MECHANICS", "Exchange Rate Quotations and Cross Rates")
    story.append(body(
        "Most currencies are quoted in two ways. An <b>indirect quote</b> (or 'American terms') expresses how much foreign "
        "currency is needed to buy one unit of the home currency — e.g., USD/ZMW 12.50 means you need 12.50 kwacha per dollar. "
        "A <b>direct quote</b> (or 'European terms') expresses how much home currency buys one unit of foreign currency — e.g., ZMW/USD 0.0800 "
        "means one dollar costs 0.08 kwacha (the inverse of the indirect quote)."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Bid-Ask Spreads"))
    story.append(body(
        "Banks always quote two rates: the <b>bid rate</b> (the rate at which they buy currency from you) and the <b>ask/offer rate</b> "
        "(the rate at which they sell to you). For example, a bank might quote USD/ZMW 12.48–12.52, meaning they will buy dollars at 12.48 kwacha/USD "
        "and sell dollars at 12.52 kwacha/USD. The bank profits from the spread (12.52 − 12.48 = 0.04 kwacha per dollar)."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Cross Rates"))
    story.append(body(
        "A <b>cross rate</b> is an exchange rate between two currencies, neither of which is the US dollar. For example, GBP/ZMW "
        "is a cross rate. Cross rates are calculated from two pairs that both involve the dollar (or another common base). "
        "If GBP/USD is 1.27 and USD/ZMW is 12.50, then GBP/ZMW = 1.27 × 12.50 = 15.875."
    ))
    story.append(formula_box([
        "Cross Rate (GBP/ZMW) = (GBP/USD) × (USD/ZMW)",
    ]))
    story.append(Spacer(1, 8))

    # ── SECTION 3: Spot vs Forward Rates ───────────────────────
    story += section("FORWARD", "Forward Contracts and Forward Rates")
    story.append(body(
        "The <b>spot rate</b> is the current exchange rate for immediate delivery (settlement in 1–2 days). "
        "A <b>forward rate</b> is the rate agreed today for delivery at a future date (e.g., 3, 6, or 12 months ahead). "
        "Forward rates are derived from spot rates and interest rate differentials between the two countries."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Forward Rate Calculation"))
    story.append(body(
        "If the home currency (e.g., ZMW) has a higher interest rate than the foreign currency (e.g., USD), "
        "the kwacha is at a <b>forward discount</b> — you must pay more kwacha per dollar in the forward market than spot. "
        "Conversely, if USD rates are higher, the kwacha is at a <b>forward premium</b> — you pay fewer kwacha per dollar forward."
    ))
    story.append(formula_box([
        "Forward Rate = Spot Rate × (1 + i_home) / (1 + i_foreign)",
    ]))
    story.append(Spacer(1, 6))

    story.append(h3("Worked Example: USD/ZMW Forward Rate"))
    story.append(body(
        "Current spot rate: USD/ZMW 12.50. Current interest rates: USD 4% per annum, ZMW 12% per annum. "
        "Calculate the 6-month forward rate."
    ))
    story.append(Spacer(1, 4))
    story.append(callout(
        "Forward Rate = 12.50 × [(1 + 0.12/2) / (1 + 0.04/2)] "
        "<br/>= 12.50 × [1.06 / 1.02] "
        "<br/>= 12.50 × 1.0392 "
        "<br/>= 13.00 kwacha/USD "
        "<br/><br/>"
        "The kwacha is at a forward discount (you pay 13.00 forward vs 12.50 spot) because ZMW rates are higher. "
        "This compensates foreign lenders for holding a higher-yielding but potentially depreciating currency.",
        style="note"
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 4: Business Practice Hedging ───────────────────
    story += section("STRATEGIES", "Business Practice Hedging Strategies")
    story.append(body(
        "Before resorting to financial hedges (forwards, options, futures), treasury should consider operational strategies "
        "that reduce FX exposure at the source."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("1. Insist on Home Currency Payment"))
    story.append(body(
        "The simplest strategy: require foreign customers to pay in kwacha. This shifts all FX risk to them. "
        "Large, dominant firms can enforce this; smaller firms may lose deals to competitors willing to accept foreign currency."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("2. Currency Surcharges"))
    story.append(body(
        "Invoice in home currency but add a clause allowing a surcharge if the exchange rate moves significantly. "
        "For example, if ZMW weakens by more than 2%, the customer pays a surcharge to compensate for the FX loss."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("3. Accelerate Collections / Extend Payables"))
    story.append(body(
        "If you expect a currency to depreciate, collect receivables in that currency as quickly as possible and delay "
        "payables as long as possible (minimize exposure). Conversely, if a currency is expected to appreciate, accelerate payables "
        "and delay collections. This is a form of FX speculation, so use it carefully."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("4. Source from the Same Country"))
    story.append(body(
        "If a company receives cash in USD from US customers, it should source materials and supplies in USD, offsetting "
        "the exposure. This is called a <b>natural hedge</b> — FX gains and losses offset. "
        "It is more cost-effective than financial hedges in the long term."
    ))
    story.append(Spacer(1, 4))

    story.append(h3("5. Netting"))
    story.append(body(
        "<b>Bilateral netting:</b> If Company A owes Company B ZMW 10 million in USD and Company B owes Company A USD 2 million, "
        "only the net USD 8 million flows from A to B. Multinational companies use <b>multilateral netting</b> — a centralized "
        "clearing house nets payables and receivables across all subsidiaries, reducing gross FX flows."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 5: Forward Contracts ───────────────────────────
    story += section("FORWARDS", "Forward Exchange Contracts")
    story.append(body(
        "A forward contract commits the buyer to purchase (or the seller to sell) a fixed amount of currency at a predetermined "
        "forward rate on a specified future date. Unlike options, forwards are binding on both parties — there is no choice to walk away. "
        "This makes forwards cheaper than options but riskier if the market moves in your favour."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Worked Example: Hedging a USD Receivable"))
    story.append(body(
        "A Zambian exporter is due to receive USD 500,000 from a US buyer in 3 months. Spot rate: USD/ZMW 12.50. "
        "3-month forward rate: USD/ZMW 13.00. The exporter fears kwacha appreciation (fewer kwacha per dollar). "
        "The exporter enters a forward contract to sell USD 500,000 at 13.00 ZMW/USD in 3 months."
    ))
    story.append(Spacer(1, 4))
    story.append(callout(
        "<b>Scenario 1 (Spot moves to 12.00 ZMW/USD — kwacha appreciates):</b> "
        "If not hedged, the exporter receives only 500,000 × 12.00 = ZMW 6,000,000. "
        "With the forward hedge, the exporter locks in 500,000 × 13.00 = ZMW 6,500,000. "
        "The hedge gains ZMW 500,000. "
        "<br/><br/>"
        "<b>Scenario 2 (Spot moves to 14.00 ZMW/USD — kwacha depreciates):</b> "
        "If not hedged, the exporter receives 500,000 × 14.00 = ZMW 7,000,000. "
        "With the forward hedge, the exporter locks in 500,000 × 13.00 = ZMW 6,500,000. "
        "The hedge costs ZMW 500,000 in foregone gains.",
        style="note"
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 6: Currency Futures ────────────────────────────
    story += section("FUTURES", "Currency Futures")
    story.append(body(
        "Like interest rate futures, currency futures are standardised, exchange-traded contracts for a fixed amount "
        "of currency (e.g., USD 62,500) at a future date. They require margin, are marked-to-market daily, and can be "
        "closed out before maturity. The main advantage over forwards: liquidity and lower counterparty risk. The disadvantage: "
        "less flexibility in contract size and date."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Worked Example: Hedging a Large USD Receivable with Futures"))
    story.append(body(
        "XYZ Ltd, a Zambian manufacturing company, expects to receive USD 2,650,000 from US customers in 3 months (August). "
        "Spot rate (June): USD/ZMW 10.11. September USD/ZMW futures are quoted at 9.92. "
        "XYZ fears kwacha appreciation (it wants to lock in the highest kwacha per dollar possible)."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "Standard USD/ZMW futures contract size: USD 62,500. "
        "Number of contracts needed: USD 2,650,000 / USD 62,500 = 42 contracts."
    ))
    story.append(Spacer(1, 4))
    story.append(callout(
        "<b>Hedge action:</b> XYZ sells 42 September USD/ZMW futures at 9.92. "
        "<br/><br/>"
        "<b>If spot moves to 8.25 (kwacha appreciates):</b> "
        "Spot receipt would be: USD 2,650,000 × 8.25 = ZMW 21,862,500. "
        "Futures gain: (9.92 − 8.25) × 42 × USD 62,500 = ZMW 4,383,750. "
        "Total cash: ZMW 21,862,500 + ZMW 4,383,750 = ZMW 26,246,250. "
        "This is much better than the unhedged ZMW 21,862,500.",
        style="note"
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 7: Currency Options ────────────────────────────
    story += section("OPTIONS", "Currency Options and Strategies")
    story.append(body(
        "A currency option gives the buyer the right, but not the obligation, to exchange currencies at a strike price on or before "
        "a future date. <b>Call options</b> on foreign currency give the right to buy; <b>put options</b> give the right to sell. "
        "Like interest rate options, currency options require an upfront premium but offer flexibility — if the market moves in your favour, "
        "you walk away and keep the premium loss; if it moves against you, you exercise and lock in the strike rate."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Puts, Calls, and Real-World Strategies"))
    story.append(body(
        "An importer expecting to pay USD 1 million in 6 months buys a <b>USD put option</b> (the right to sell ZMW or buy USD at a fixed rate). "
        "This limits downside if the kwacha weakens but lets the importer benefit if the kwacha strengthens — minus the premium paid. "
        "An exporter expecting to receive USD buys a <b>USD call option</b> (the right to buy USD at a fixed rate, which is equivalent to "
        "selling ZMW at a fixed kwacha/USD rate)."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Options vs Forwards vs Futures"))
    opt_comp = [
        ["Feature", "Forward Contract", "Futures", "Options"],
        ["Binding", "Yes, both parties must transact", "Yes, both parties must transact", "No, buyer may walk away"],
        ["Customization", "Full (any amount, date)", "Limited (standardised size/dates)", "Limited (standardised size/dates)"],
        ["Cost", "Low (no upfront premium)", "Low (margin only)", "High (premium upfront)"],
        ["Liquidity", "Low (no secondary market)", "High (exchange traded)", "Medium (less liquid than futures)"],
        ["Counterparty Risk", "High (bilateral agreement)", "Low (exchange guaranteed)", "Medium (exchange guaranteed)"],
        ["Best Use", "Exact amount and date needed", "General hedging, frequent adjustment", "Want optionality and upside capture"],
    ]
    story.append(table_std(opt_comp, [2*cm, 2.5*cm, 2.5*cm, 2.5*cm]))
    story.append(Spacer(1, 8))

    # ── SECTION 8: Zambian FX Context ──────────────────────────
    story += section("CONTEXT", "FX Risk in Zambia")
    story.append(body(
        "The Zambian kwacha is a free-floating currency. Since 2015, it has depreciated significantly against the US dollar and other "
        "major currencies, driven by inflation, capital outflows, and commodity price shocks. At the time of writing (early 2023), "
        "the exchange rate was approximately ZMW 20–25 per USD (though it has recovered to 12–13 in recent quarters). "
        "For Zambian companies with USD receivables or borrowings, this volatility is material."
    ))
    story.append(Spacer(1, 6))

    story.append(callout(
        "<b>Policy context:</b> The Bank of Zambia manages FX markets and occasionally intervenes to stabilize the kwacha, "
        "though it has stepped back from active intervention in recent years, allowing market forces to prevail. "
        "Companies must monitor MPC statements and BoZ FX market updates to anticipate volatility. "
        "For firms with large USD receivables, forward contracts and options are essential tools to lock in rates and manage earnings volatility.",
        style="warn"
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 9: Discussion ──────────────────────────────────
    story += section("DISCUSSION", "Test Your Understanding")
    story.append(discussion_question_with_nudge(
        "<b>Question 1:</b> A Zambian supplier ships goods to a South African customer for ZAR 1 million, payment due in 60 days. "
        "Current spot rate: ZMW/ZAR 0.0680. 60-day forward rate: ZMW/ZAR 0.0650. The supplier expects the kwacha to weaken. "
        "Should the supplier hedge with a forward contract? Calculate the kwacha proceeds under both spot and forward scenarios. "
        "<br/><br/>"
        "<b>Question 2:</b> Compare the use of a forward contract vs. a USD put option for an importer expecting to pay USD 100,000 "
        "in 3 months. What are the key differences in risk and reward?",
        "Work through real examples with your own data. Post in #tm-risk — comparing hedging strategies is where the learning sticks."
    ))
    story.append(Spacer(1, 12))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Foreign exchange risk", "Potential loss from unexpected changes in exchange rates affecting reported earnings or cash flows"],
        ["Transaction exposure", "FX risk from committed foreign currency cash flows (receivables, payables, future contracts)"],
        ["Translation exposure", "FX risk from consolidating foreign subsidiary statements into parent currency; affects reported equity/earnings"],
        ["Economic exposure", "Long-term FX risk from exchange rate impacts on competitive position and future cash flows"],
        ["Indirect quote", "Exchange rate expressing foreign currency units per home currency unit (e.g., USD/ZMW 12.50)"],
        ["Direct quote", "Exchange rate expressing home currency units per foreign currency unit (e.g., ZMW/USD 0.0800)"],
        ["Bid-ask spread", "Difference between bank's buying rate (bid) and selling rate (ask/offer); the bank's profit margin"],
        ["Cross rate", "Exchange rate between two currencies, neither of which is the US dollar; calculated from two dollar pairs"],
        ["Spot rate", "Current exchange rate for immediate (1–2 day) delivery"],
        ["Forward rate", "Exchange rate agreed today for delivery at a future date (3, 6, 12 months, etc.)"],
        ["Forward discount", "When the forward rate is higher (in indirect quote terms) than the spot — home currency is at a discount"],
        ["Forward premium", "When the forward rate is lower than the spot — home currency is at a premium"],
        ["Forward contract", "OTC agreement to exchange currencies at a fixed rate on a future date; binding on both parties"],
        ["Currency futures", "Exchange-traded, standardised contracts for currency delivery; highly liquid but less flexible than forwards"],
        ["Natural hedge", "Offsetting FX exposure by sourcing and selling in the same foreign currency"],
        ["Bilateral netting", "Agreement between two parties to exchange net cash flows rather than gross flows"],
        ["Multilateral netting", "Centralized clearing of payables and receivables across multiple subsidiaries"],
        ["Currency call option", "Right to buy foreign currency at a strike rate; used by importers and those expecting to receive foreign currency"],
        ["Currency put option", "Right to sell foreign currency at a strike rate; used by exporters and those expecting to pay foreign currency"],
    ]
    story.append(table_std(terms, [4*cm, CONTENT_W - 4*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Distinguish between transaction, translation, and economic FX exposure",
        "Interpret bid-ask spreads and calculate cross rates between currency pairs",
        "Calculate forward exchange rates using interest rate parity formula",
        "Structure a forward contract to hedge a specific FX receivable or payable",
        "Compare the costs and benefits of forwards vs. futures vs. options for FX hedging",
        "Use currency futures to hedge a large transaction exposure and calculate gains/losses",
        "Design a collar strategy (combination of options) to cap downside while preserving upside",
        "Evaluate operational hedging strategies (netting, natural hedges, sourcing) and when each is appropriate",
        "Apply FX hedging techniques to Zambian corporations dealing in USD, ZAR, and other regional currencies",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 4.1 — Debt Management",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
