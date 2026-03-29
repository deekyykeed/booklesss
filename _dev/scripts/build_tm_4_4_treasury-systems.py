"""
Booklesss Lesson PDF — Step 4.4: Treasury Management Systems
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

CHANNEL_NAME = "tm-operations"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Treasury Management", "content",
           "lesson-05-clearing-settlement")
OUT_PATH = os.path.join(OUT_DIR, "Step 4.4 - Treasury Management Systems.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "4.4")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "4.4 — Treasury Management Systems")
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
    """Warm community closer for the final step of the course."""
    elements = [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "You've just completed the Treasury Management course. Step 4.4 is the capstone — it brings together everything you've learned across ten steps, "
            "from Working Capital all the way to systems and operations. "
            "The channel for this topic is <b>#tm-operations</b> — that's where treasury professionals in the Booklesss group are sharpening these skills together.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            "This course covers what a treasury team actually does. The work you've studied — managing cash, hedging interest rates, settling FX trades, "
            "selecting investments, reading debt covenants, understanding payment systems, and finally orchestrating it all through a TMS — "
            "is the real heart of corporate finance.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            f'If you\'re already in the group, you know where to find #tm-operations. '
            f'If not, <link href="{INVITE_URL}"><u><b>join here.</b></u></link> Keep building.',
            ST["community_link"]),
    ]
    return elements

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
    story.append(Paragraph("Treasury Management\nSystems", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 4.4 · TMS architecture, deal capture, position management, risk analytics, bank connectivity, implementation, ROI, and integration of all treasury functions",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: What is a TMS? ──────────────────────────────
    story += section("FOUNDATIONS", "What is a Treasury Management System (TMS)?")
    story.append(body(
        "A Treasury Management System is a software application that automates the core functions of a treasury department. "
        "It integrates information from banks, market data providers, the company's ERP system, and internal reporting tools, "
        "and presents that information in real time so treasury staff can make informed decisions."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Why Separate from ERP?"))
    story.append(body(
        "Enterprise Resource Planning (ERP) systems like SAP are designed for the whole company: accounting, payroll, inventory, manufacturing. "
        "They're excellent at tracking transactions for the official accounting ledger. But treasury has specific needs that ERPs don't handle well:"
    ))
    story.append(bullet("Real-time cash visibility across multiple banks and currencies"))
    story.append(bullet("FX trading, position tracking, and hedge accounting"))
    story.append(bullet("Deal capture and marking-to-market of derivatives"))
    story.append(bullet("Settlement and reconciliation of high-value financial transactions"))
    story.append(bullet("Counterparty risk monitoring and exposure aggregation"))
    story.append(body(
        "A TMS fills these gaps. It's built for the speed, precision, and risk visibility that treasury requires."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 2: Core TMS Functions ──────────────────────────
    story += section("ARCHITECTURE", "Core TMS Functions")
    story.append(h3("1. Deal Capture"))
    story.append(body(
        "When a treasury professional completes a deal (borrows at a rate, sells FX, invests in a bond, enters a swap), "
        "the deal is entered into the TMS once. The TMS records the full deal terms: counterparty, amount, rate, maturity, settlement instructions. "
        "This single entry feeds into all downstream processes."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("2. Position Management"))
    story.append(body(
        "The TMS aggregates all deals into positions. Cash position: total cash across all bank accounts, all currencies, all business units. "
        "FX position: net long or short in EUR, GBP, JPY, etc. Debt position: amount borrowed, by counterparty, by tenor. "
        "Investment position: what securities are held, at what cost, at what current value."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("3. Risk Analytics"))
    story.append(body(
        "The TMS calculates Value at Risk (VaR), duration, key rate durations, FX exposure, interest rate sensitivity, and counterparty exposure. "
        "It compares actual positions against policy limits and alerts treasury if limits are breached."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("4. Settlement and Reconciliation"))
    story.append(body(
        "The TMS tracks deals from inception through clearing and settlement. It knows which trades have settled, which are pending, "
        "which have failed. It matches bank confirmations against deal records to catch discrepancies."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("5. Reporting and Dashboard"))
    story.append(body(
        "The TMS provides real-time dashboards showing cash position, portfolio composition, risk metrics, and deal pipeline. "
        "Reports can be generated for management, board, auditors, and regulatory compliance. Custom reports can drill down to individual transactions."
    ))
    story.append(Spacer(1, 10))

    story.append(callout(
        "<b>The common thread:</b> All of these functions revolve around speed and accuracy. "
        "A TMS eliminates manual entry, reduces errors, and gives treasury the visibility it needs to manage risk in real time.",
        "info"))

    # ── SECTION 3: Cash Positioning ────────────────────────────
    story += section("CASH MANAGEMENT", "Cash Positioning in a TMS")
    story.append(body(
        "One of the TMS's most critical functions is aggregating the cash position. "
        "A multinational company might have 50+ bank accounts across 20 countries, in 10 different currencies. "
        "The TMS collects real-time balance data from each bank (via SWIFT, APIs, or bank portals) and presents a single consolidated view."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("What the TMS Shows"))
    story.append(bullet("Total cash by currency: How much USD, EUR, GBP, ZMW, etc. the company holds globally"))
    story.append(bullet("Total cash by bank: How much the company holds with each bank relationship"))
    story.append(bullet("Total unallocated cash: Cash not yet allocated to specific uses (available for investment or transfers)"))
    story.append(bullet("Forecast cash position: Projected cash over the next 10, 30, 90 days based on payment obligations and expected collections"))
    story.append(Spacer(1, 6))
    story.append(h3("Why This Matters"))
    story.append(body(
        "Without a TMS, a treasurer managing 50 accounts has to log into each bank portal separately, write down the balance, convert it to a base currency, "
        "and manually compile a spreadsheet. This takes hours and is error-prone. "
        "With a TMS, the position updates automatically in real time. The treasurer sees it on a dashboard and can make investment or borrowing decisions immediately."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 4: Bank Connectivity ───────────────────────────
    story += section("CONNECTIVITY", "TMS Bank Connectivity and Data Feeds")
    story.append(body(
        "The TMS connects to banks in multiple ways to pull in data and push out payment instructions:"
    ))
    story.append(Spacer(1, 6))
    story.append(h3("SWIFT"))
    story.append(body(
        "Large corporates connect directly to SWIFT through a bank. The TMS sends outgoing payment instructions and receives incoming confirmations via SWIFT MT messages. "
        "This is the standard for high-value and international payments."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Host-to-Host (Direct Bank Links)"))
    story.append(body(
        "Some banks offer direct data feeds to customer systems. The bank and the company maintain a secure connection; the TMS polls for new balances, "
        "confirmations, and bank advice. This is faster than SWIFT for routine, lower-value transactions."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Open Banking APIs"))
    story.append(body(
        "Modern banks and fintech providers offer REST APIs for balance inquiry, payment initiation, and transaction history. "
        "Some TMSs now support these APIs, allowing easier integration with banks that haven't yet implemented SWIFT or host-to-host."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Market Data Feeds"))
    story.append(body(
        "For risk analytics and deal pricing, the TMS receives real-time market data from Bloomberg, Reuters, or other providers. "
        "Interest rates, FX rates, credit spreads — the TMS uses this data to mark positions to market and calculate VaR."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 5: TMS Modules ─────────────────────────────────
    story += section("STRUCTURE", "Front, Middle, Back Office in a TMS")
    story.append(body(
        "A TMS is often organized into three functional areas, mirroring the organizational structure of treasury itself:"
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Front Office"))
    story.append(body(
        "Deal makers' interface. Dealers enter new deals: FX trades, interest rate swaps, bond purchases, lending decisions. "
        "The front office module gives pricing tools, comparative quotes, and deal booking functionality."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Middle Office"))
    story.append(body(
        "Risk and control layer. The middle office monitors positions, calculates risk, checks limits, and enforces policy. "
        "It flags deals that exceed counterparty exposure limits, VaR thresholds, or duration targets. "
        "Large trades may require middle office approval before they settle."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Back Office"))
    story.append(body(
        "Operations and settlement. The back office processes confirmations, reconciles trades to bank statements, "
        "manages settlement instructions, and tracks fails. It's the executor of the front office's decisions and the validator of the middle office's controls."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 6: Selecting a TMS ─────────────────────────────
    story += section("SELECTION", "Choosing a TMS: Build vs Buy")
    story.append(h3("Build (Custom Development)"))
    story.append(body(
        "Some large corporations build proprietary TMS software tailored to their exact processes. "
        "Advantages: perfect fit to the company's workflow, competitive advantage if the system is unique. "
        "Disadvantages: extremely expensive (millions of pounds/dollars), takes years, requires large IT teams, constant maintenance, "
        "and the system becomes obsolete as the market evolves."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Buy (Commercial TMS)"))
    story.append(body(
        "Most companies purchase a commercial TMS. Major vendors include:"
    ))
    story.append(Spacer(1, 4))
    vendors = [
        ["Vendor", "Parent Company", "Typical Use"],
        ["Kyriba", "Wolters Kluwer", "Global mid-market to enterprise cash and liquidity management"],
        ["FIS (Findynvest)", "FIS", "Large enterprise derivatives and debt/investment mgmt"],
        ["ION Treasury", "ION Analytics", "Institutional and corporate treasury systems"],
        ["SAP Treasury and Risk Mgmt (TRM)", "SAP", "Integrated with SAP ERP; mid-market to enterprise"],
        ["Temenos", "Temenos", "Banking and treasury operations for banks"],
    ]
    story.append(table_std(vendors, [2.5*cm, 3.5*cm, 5*cm]))
    story.append(Spacer(1, 10))

    story.append(h3("Selection Criteria"))
    story.append(bullet("Scope: Does it cover all treasury functions you need? (cash, FX, derivatives, debt, investments, settlement?)"))
    story.append(bullet("Scalability: Does it grow with your company and add more bank relationships without major rework?"))
    story.append(bullet("Integration: How easily does it connect to your ERP, banks, and market data providers?"))
    story.append(bullet("Configurability: Can you customize workflows to match your processes without heavy custom coding?"))
    story.append(bullet("User adoption: Is the interface intuitive? Will your team use it or stick to spreadsheets?"))
    story.append(bullet("Cost: Implementation, licensing, annual fees — what's the total cost of ownership?"))
    story.append(bullet("Vendor stability: Is the vendor financially stable and committed to the product?"))
    story.append(Spacer(1, 8))

    # ── SECTION 7: Implementation Challenges ───────────────────
    story += section("IMPLEMENTATION", "TMS Implementation: Common Challenges")
    story.append(h3("Data Migration"))
    story.append(body(
        "Moving historical transaction data from the old system (often spreadsheets or a legacy system) into the new TMS is painstaking. "
        "Data must be validated, cleaned, and mapped to the new system's data structure. Errors here will haunt you for years."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Bank and System Integration"))
    story.append(body(
        "Connecting the TMS to each bank, the ERP, and market data providers requires custom work. "
        "Each connection is unique. Each bank has different APIs, message formats, and response times. "
        "Integration often takes longer than expected and costs more than budgeted."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("User Adoption"))
    story.append(body(
        "Treasury staff who've been using Excel for years may resist the TMS. Training is essential, but even well-trained teams can be slow to change. "
        "If users don't embrace the TMS, they'll use it only partially, creating data quality issues and missing the benefits."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Complexity"))
    story.append(body(
        "A full-featured TMS is complex. Most companies use only a fraction of its capabilities in year one. "
        "It's tempting to disable features that seem unnecessary, but this can cause problems later when the company wants to expand treasury activities. "
        "Thorough training and change management are essential."
    ))
    story.append(Spacer(1, 8))

    story.append(callout(
        "<b>Rule of thumb:</b> Budget 30% for software, 70% for implementation (including data migration, integration, testing, and training). "
        "Budget 18–24 months for a full implementation in a large, complex organization.",
        "warn"))

    # ── SECTION 8: Policy Enforcement ──────────────────────────
    story += section("CONTROL", "How a TMS Enforces Treasury Policy")
    story.append(body(
        "A TMS is the enforcement mechanism for treasury policy. Policy statements like 'We will not exceed 30% debt-to-equity' or 'No counterparty shall exceed USD 100m exposure' "
        "must be built into the system as hard rules or soft warnings."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Hard Limits"))
    story.append(body(
        "A hard limit blocks the transaction entirely. Example: A dealer tries to sell USD 150m of FX to a counterparty with an existing exposure of USD 80m, "
        "and the policy limit is USD 100m per counterparty. The TMS rejects the deal outright."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Soft Limits (Warnings)"))
    story.append(body(
        "A soft limit allows the transaction but requires approval. Example: A deal would bring counterparty exposure to USD 95m (below the USD 100m limit). "
        "The TMS allows it but logs it and notifies the treasurer. If a second deal comes along that would exceed the limit, it needs treasury head approval."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Examples of Policies Enforced"))
    story.append(bullet("Counterparty exposure limits: No more than USD X with any single counterparty"))
    story.append(bullet("Tenor limits: Maximum maturity of debt or swaps the company will enter"))
    story.append(bullet("Currency limits: Maximum net long/short exposure in any currency"))
    story.append(bullet("VaR limits: 99th percentile Value at Risk cannot exceed USD X"))
    story.append(bullet("Leverage ratios: Total debt cannot exceed X times EBITDA"))
    story.append(bullet("Deal approval workflows: Deals above USD X require CFO approval; deals above USD Y require CEO approval"))
    story.append(Spacer(1, 8))

    # ── SECTION 9: ROI of a TMS ────────────────────────────────
    story += section("BUSINESS CASE", "ROI of a Treasury Management System")
    story.append(body(
        "A TMS is expensive, but the benefits can justify the cost. Here are the quantifiable returns:"
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Error Reduction"))
    story.append(body(
        "Manual spreadsheets cause errors: transposition errors, missing payments, double-payments, bank reconciliation mismatches. "
        "A TMS eliminates redundant data entry (enter once, use everywhere) and automates reconciliation. "
        "One failed payment due to human error can cost a company far more than a TMS license fee. One compliance violation can be catastrophic."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Improved Cash Visibility"))
    story.append(body(
        "Better visibility means fewer precautionary cash balances. Without a TMS, a treasurer might maintain 20% excess cash as a safety buffer because she can't see the full position. "
        "With a TMS, that can drop to 5%. The difference is millions in cash that can be invested at higher rates, or used for operating expenses."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Better Investment Returns"))
    story.append(body(
        "With real-time visibility of surplus cash, a treasurer can invest it immediately in higher-yielding instruments (bonds, term deposits) "
        "rather than leaving it idle in low-rate call deposits. Even a 1% return improvement on USD 100m in average balances is USD 1m per year."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Reduced Borrowing Costs"))
    story.append(body(
        "Better cash forecasting means fewer surprise cash shortfalls and less reliance on expensive overdrafts. "
        "The treasury can arrange borrowing in advance at better rates rather than emergency borrowing at premium rates."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Risk Reduction"))
    story.append(body(
        "A TMS that enforces counterparty limits and VaR limits prevents rogue trader scenarios and concentration risk. "
        "The cost of a single large counterparty failure or FX blowup far exceeds the cost of a TMS."
    ))
    story.append(Spacer(1, 8))

    story.append(callout(
        "<b>Quick ROI calculation:</b> A company with USD 500m in average cash balances invests in a TMS at a cost of USD 5m. "
        "The system improves investment returns by 1.5% and reduces borrowing costs by 1% (by better forecasting). "
        "That's 1.5% × 500m + 1% × (seasonal borrowing) = USD 7.5m+ per year in benefits, paying for itself in under a year. "
        "And that doesn't include error avoidance, compliance, and risk reduction.",
        "info"))

    # ── SECTION 10: CAPSTONE — Integration of All 10 Steps ─────
    story += section("CAPSTONE", "How a TMS Integrates All 10 Steps of This Course")
    story.append(body(
        "You've now completed 10 steps of Treasury Management. A TMS is where all of them come together. Here's how:"
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Step 1: Introduction to Treasury"))
    story.append(body(
        "The TMS's dashboard is treasury's command center. It shows the organization's liquidity position, debt levels, risk metrics. "
        "Management sees at a glance whether treasury is meeting its objectives: providing liquidity, managing risk, optimizing returns."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Steps 2.1–2.3: Working Capital Management"))
    story.append(body(
        "The TMS forecasts cash flows (2.3), recommends optimal cash balances (2.1, 2.2), and suggests investment or borrowing decisions. "
        "Notional pooling (2.3) is managed in the TMS, with the system calculating net interest on pooled balances."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Step 3.1: Interest Rate Risk"))
    story.append(body(
        "The TMS monitors interest rate exposures from debt and floating-rate investments. It calculates duration and key rate durations. "
        "When hedging with interest rate swaps or futures (3.1), the TMS tracks the hedge, marks it to market daily, and calculates the offset against the underlying exposure."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Step 3.2: FX Risk"))
    story.append(body(
        "The TMS aggregates all FX exposures (from operations, investments, and financing). It calculates net long/short positions by currency. "
        "When treasury executes FX forwards, money market hedges, or options (3.2), the TMS records these, marks them to market, and reconciles them through CLS or SWIFT settlement (Step 4.3)."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Steps 4.1–4.2: Debt and Investment Management"))
    story.append(body(
        "The TMS tracks every debt facility: term, rate, covenants, drawdown schedule. It monitors covenant compliance (Step 4.1) and alerts if a covenant is at risk of breach. "
        "For investments, the TMS tracks duration, yield, credit rating, and marks the portfolio to market (Step 4.2). "
        "It forecasts maturity ladders and reinvestment decisions."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Step 4.3: Clearing & Settlement Systems"))
    story.append(body(
        "The TMS interfaces with SWIFT and bank APIs to initiate payments and receive settlement instructions. "
        "It tracks every trade from deal date through settlement, knows which trades have cleared and which are pending. "
        "It reconciles SWIFT confirmations against deal records and alerts to settlement exceptions."
    ))
    story.append(Spacer(1, 8))

    story.append(body(
        "In a live TMS environment, these ten steps aren't separate — they're interwoven. The treasurer enters a bond investment (step 4.2), "
        "and the TMS automatically updates the interest rate exposure (step 3.1), the cash position (step 2), the debt-to-equity ratio (step 4.1), and the risk dashboard (step 1). "
        "One transaction flows through all systems. That integration is what makes a TMS powerful."
    ))
    story.append(Spacer(1, 10))

    story.append(callout(
        "<b>The final lesson:</b> Treasury is not ten separate functions. Treasury is one unified function orchestrated through systems, policies, and people. "
        "A TMS is the tool that makes that orchestration possible. You've learned the theory and the tools. A TMS is how professionals apply them in real time.",
        "note"))

    # ── DISCUSSION QUESTIONS ───────────────────────────────────
    questions = (
        "<b>Question 1:</b> A company is evaluating whether to build or buy a TMS. What are the key factors that would push you toward buying an off-the-shelf solution vs building one? "
        "<br/><br/>"
        "<b>Question 2:</b> A treasurer discovers that the TMS dashboard is showing a much lower cash position than the company's accounting ledger. "
        "Why might this happen, and what data integrity problems could explain the gap?"
    )
    nudge = "These are real-world TMS issues. Work through them with your team or classmates. Share your reasoning in #tm-operations."
    story.append(discussion_question_with_nudge(questions, nudge))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Treasury Management System (TMS)", "Software application that automates deal capture, position management, risk analytics, settlement, and reporting for treasury"],
        ["Deal capture", "Entry of a new deal (loan, bond, FX trade, derivative) into the TMS with full term details"],
        ["Position management", "Aggregation of all deals into consolidated positions (cash, FX, debt, investments)"],
        ["Value at Risk (VaR)", "Statistical measure of the maximum loss a portfolio could suffer over a given time horizon at a given confidence level"],
        ["Marking to market", "Revaluing positions daily using current market prices"],
        ["Settlement tracking", "Monitoring deals from inception through clearing to final settlement"],
        ["Front office", "Deal-making and pricing component of a TMS"],
        ["Middle office", "Risk monitoring and control component of a TMS"],
        ["Back office", "Operations, settlement, and reconciliation component of a TMS"],
        ["Build vs buy", "Decision to develop a TMS in-house or purchase a commercial solution"],
        ["Integration", "Connecting a TMS to banks (SWIFT, APIs), ERP systems, and market data providers"],
        ["Hard limit", "Absolute limit enforced by the TMS; transaction is blocked if it exceeds the limit"],
        ["Soft limit", "Warning limit; transaction is allowed but logged and may require approval"],
        ["Cash visibility", "Real-time aggregated view of all bank balances and cash positions across the organization"],
        ["Policy enforcement", "The TMS's role in enforcing treasury policy through automated rules and controls"],
        ["Counterparty exposure", "Total amount the company owes to or has outstanding with a single counterparty"],
        ["Reconciliation", "Matching transactions in the TMS against bank confirmations to ensure accuracy"],
        ["ROI (Return on Investment)", "Benefit gained from a TMS (error reduction, better returns, risk reduction) measured against its cost"],
        ["Data migration", "Moving historical transaction data from legacy systems into the new TMS"],
    ]
    story.append(table_std(terms, [5*cm, CONTENT_W - 5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain what a TMS is and why treasury requires a dedicated system separate from ERP",
        "Identify and describe the five core functions of a TMS: deal capture, position management, risk analytics, settlement, and reporting",
        "Explain how a TMS aggregates cash position across multiple banks and currencies, and why this visibility is critical",
        "Describe the three main connectivity methods for a TMS: SWIFT, host-to-host, and open banking APIs",
        "Explain the role of front office, middle office, and back office functions within a TMS",
        "Evaluate a TMS selection using key criteria: scope, scalability, integration, configurability, user adoption, cost, and vendor stability",
        "Identify common TMS implementation challenges (data migration, integration, user adoption, complexity) and strategies to overcome them",
        "Explain how a TMS enforces treasury policy through hard limits, soft limits, and approval workflows",
        "Quantify the ROI of a TMS through error reduction, cash visibility, better investment returns, reduced borrowing costs, and risk reduction",
        "Demonstrate how a TMS integrates all 10 steps of Treasury Management from working capital through clearing and settlement",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("You have completed BBF4302 — Treasury Management.",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
