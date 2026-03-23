"""
Booklesss Lesson PDF — Step 2.2: Inventory Management, EOQ & Creditor Management
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

CHANNEL_NAME = "tm-working-capital"
# Invite link — works for strangers (join flow) AND existing members (redirects to workspace)
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Treasury Management", "content",
           "lesson-02-working-capital-management")
OUT_PATH = os.path.join(OUT_DIR, "Step 2.2 - Inventory Management, EOQ & Creditor Management.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "2.2")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "2.2 — Inventory Management, EOQ & Creditor Management")
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

def discussion_question(text):
    """A genuine thought question embedded in content — not a CTA, just something worth sitting with."""
    q = Paragraph(text, ST["discuss_q"])
    t = Table([[q]], colWidths=[CONTENT_W])
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
            "The channel for this topic is <b>#tm-working-capital</b> — that's where students going through "
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
    story.append(Paragraph("Inventory Management,\nEOQ & Creditor Management", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 2.2 · Types of inventory, JIT purchasing, economic order quantity, and creditor management",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: What is Inventory? ──────────────────────────
    story += section("FOUNDATIONS", "What is Inventory?")
    story.append(body(
        "Inventory is stock of raw materials, work in progress, finished goods, and supplies. "
        "These materials tie up large amounts of firm resources — cash that could otherwise be "
        "used for other investments. The treasury's goal is to hold the optimum level of inventory "
        "that maximises the benefits of holding stock less the costs of doing so."
    ))
    story.append(body(
        "Hold more finished goods and you gain flexibility — you can fill customer orders without "
        "waiting for production — but you pay storage, capital, and obsolescence costs. Hold too little "
        "and you lose sales when you can't meet demand. Finding the right balance is a constant challenge."
    ))

    story.append(h3("Five Types of Inventory"))
    inv_types = [
        ("Raw materials", "Basic inputs to production. Separates timing of supplier deliveries from production scheduling."),
        ("Work in progress", "Items actively in the manufacturing process."),
        ("Finished goods", "Completed items ready for sale. Allows you to fill orders without waiting for production."),
        ("Scrap and obsolete items", "Some inventory becomes obsolete with product changes. Some can be reused (e.g. steel, aluminium) or sold to recyclers."),
        ("Stores and supplies", "Indirect purchases that support production: lubricating oils, maintenance materials, consumables."),
    ]
    for inv_type, desc in inv_types:
        story.append(h3(inv_type))
        story.append(body(desc))

    # ── SECTION 2: Inventory Financing ─────────────────────────
    story += section("FINANCING", "Inventory Financing Alternatives")
    story.append(body(
        "Inventory must be financed. There are five main methods available, each with different "
        "costs and risk profiles."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("1. Trade Credit (Accounts Payable)"))
    story.append(body(
        "The least expensive form of inventory financing. As you buy goods, the supplier allows you "
        "time to pay — typically 30–60 days. This credit is spontaneous: it rises and falls with your "
        "inventory levels. You don't apply for it; it happens automatically."
    ))

    story.append(h3("2. Supply Chain Financing"))
    story.append(body(
        "The seller arranges finance for the buyer based on purchase orders with large buyers. "
        "The buyer chooses it (not the supplier), and the seller gets a lower interest rate because "
        "the large buyer guarantees the order. The buyer avoids recording the debt on its balance sheet."
    ))

    story.append(h3("3. Collateralised Loans"))
    story.append(body(
        "Inventory serves as collateral for a bank loan. The bank lends a predetermined percentage "
        "of inventory value — typically 50–80%. The lien is perfected against the inventory."
    ))

    story.append(h3("4. Asset-Based Loans"))
    story.append(body(
        "The lender advances money based on inventory value, not the company's financial strength. "
        "If the company defaults, the lender takes physical possession of the inventory — either "
        "through a public warehouse or a field warehouse managed by the lender's representative."
    ))

    story.append(h3("5. Floor Planning"))
    story.append(body(
        "Common for high-value durables like cars, trucks, and heavy equipment. The lender grants "
        "loans against individual items by serial number. When the item is sold, the loan is repaid."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 3: Just-In-Time ────────────────────────────────
    story += section("OPERATIONS", "Just-In-Time (JIT) Purchasing")
    story.append(body(
        "JIT minimises inventory by reducing costs and uncertainties. The principle is simple: materials "
        "are received just in time to use, not weeks before."
    ))

    story.append(h3("JIT Purchasing Objectives"))
    for obj in [
        "Reduction of raw material stock",
        "Frequent deliveries of smaller orders from fewer suppliers",
        "Long-term supplier contracts to enable schedule predictability",
        "Quality assurance — supplier is responsible for inspection, not the buyer",
    ]:
        story.append(bullet(obj))

    story.append(h3("JIT Production Objectives"))
    story.append(body(
        "JIT production aims for low-cost, high-quality, on-time production to order. This is achieved by "
        "minimising idle stock between processes."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Benefits of JIT"))
    for benefit in [
        "Reduced inventory levels lower storage and capital costs",
        "Savings in storage space and handling",
        "Increased customer satisfaction — elimination of waste leads to better quality",
        "Weaknesses identified early — bottlenecks, supplier reliability, documentation gaps become visible",
        "Flexibility to supply small batches to meet demand variation",
    ]:
        story.append(bullet(benefit))

    story.append(Spacer(1, 10))
    story.append(discussion_question(
        "JIT was designed for Toyota's manufacturing environment. Think about a Zambian manufacturer "
        "you know of — what are the two biggest practical barriers to implementing JIT successfully in that context, "
        "and how would you address them?"
    ))

    # ── SECTION 4: EOQ ─────────────────────────────────────────
    story += section("OPTIMIZATION", "Economic Order Quantity (EOQ)")
    story.append(body(
        "EOQ is the quantity to order each time that minimises total inventory cost. Total cost is the sum "
        "of ordering costs and holding costs. Ordering costs fall as order size rises (fewer orders), but holding "
        "costs rise (more to store). EOQ is the point where the two balance."
    ))

    story.append(formula_box([
        "EOQ  =  √(2ac ÷ h)",
        "",
        "Where:",
        "  a = annual demand in units",
        "  c = cost of ordering per order (fixed, regardless of quantity)",
        "  h = holding cost per unit per annum",
    ]))

    story.append(h3("Worked Example — XYZ Ltd"))
    story.append(body(
        "XYZ Ltd requires 1,000 units of material X per month. "
        "Cost per order: K30 (regardless of order size). Holding cost: K2.88 per unit per annum."
    ))
    story.append(Spacer(1, 6))

    story.append(formula_box([
        "Step 1: Annual demand  =  1,000 × 12  =  12,000 units",
        "",
        "Step 2: EOQ  =  √(2 × 12,000 × 30 ÷ 2.88)",
        "           =  √(720,000 ÷ 2.88)",
        "           =  √250,000",
        "           =  500 units",
        "",
        "Step 3: Number of orders per year  =  12,000 ÷ 500  =  24 orders",
        "        Time between orders  =  365 ÷ 24  =  ~15.2 days",
    ]))

    story.append(body(
        "XYZ should order 500 units each time they place an order. This means placing 24 orders per year, "
        "approximately once every 15 days. This quantity minimises the combined cost of placing orders and "
        "holding inventory."
    ))

    story.append(callout(
        "Exam tip: EOQ minimises the sum of ordering costs and holding costs. As order size increases, "
        "holding costs rise but ordering frequency (and cost) falls. EOQ is the crossover point. "
        "You may be asked to calculate EOQ, number of orders per year, or time between orders.",
        "warn"))

    # ── SECTION 5: Creditor Management ─────────────────────────
    story += section("PAYABLES", "Creditor Management")
    story.append(body(
        "Trade credit is normally viewed as a free source of finance. The standard treasury policy is "
        "to pay suppliers as late as possible — while honouring your obligations and maintaining good relationships. "
        "This maximises your use of the creditor as a source of working capital finance."
    ))

    story.append(body(
        "But there's a risk: if you delay payment too long, cash-strapped suppliers may struggle and ultimately "
        "fail. That threatens your supply chain and your ability to source materials. Creditor management mirrors "
        "debtor management. The same metrics apply in reverse."
    ))

    story.append(formula_box([
        "Days Payables  =  (Payables ÷ Cost of Goods Sold)  ×  365",
        "",
        "This measures the average number of days you take to pay suppliers.",
    ]))

    story.append(body(
        "Extending payable days reduces the cash conversion cycle and reduces working capital requirements. "
        "But it must be balanced against supplier relationships and supply chain risk. Paying too late "
        "can damage relationships and threaten supply security."
    ))

    story.append(Spacer(1, 10))
    story.append(discussion_question(
        "A company's finance director proposes stretching supplier payment terms from 30 days to 90 days "
        "across all suppliers to improve cash flow. The procurement director objects. "
        "Who do you think has the stronger argument, and what would you recommend instead?"
    ))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Inventory", "Stock of raw materials, work in progress, finished goods, and supplies"],
        ["Raw materials", "Basic inputs to production; separates supplier timing from production scheduling"],
        ["Work in progress (WIP)", "Items actively in the manufacturing process"],
        ["Finished goods", "Completed items ready for sale; allows fulfilling orders without waiting for production"],
        ["Trade credit", "Spontaneous credit from suppliers; rises and falls with inventory levels"],
        ["Supply chain financing", "Seller-arranged finance for buyers based on purchase orders with large buyers"],
        ["Collateralised loan", "Inventory as collateral for a bank loan at a predetermined percentage of value"],
        ["Asset-based lending", "Lending based on inventory value, not financial strength; lender takes possession on default"],
        ["Floor planning", "Loans against high-value durables by serial number; repaid when item is sold"],
        ["Just-in-time (JIT)", "Inventory system where materials arrive just in time to use, minimising stock levels"],
        ["Economic Order Quantity (EOQ)", "Order quantity that minimises total inventory cost (ordering + holding)"],
        ["Ordering costs", "Fixed costs incurred each time an order is placed, regardless of quantity"],
        ["Holding costs", "Costs of storing inventory: capital, storage, obsolescence, insurance"],
        ["Days payables", "(Payables ÷ COGS) × 365 — average days to pay suppliers"],
        ["Creditor management", "Managing supplier relationships and payment timing to optimise working capital"],
    ]
    story.append(table_std(terms, [5.5*cm, CONTENT_W - 5.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Define inventory and identify the five main types and their role in operations",
        "Describe the five methods of inventory financing and explain when each is appropriate",
        "Explain the objectives of JIT purchasing and identify practical barriers in a Zambian manufacturing context",
        "Calculate the Economic Order Quantity and determine the optimal order frequency",
        "Explain days payables and how creditor management affects the cash conversion cycle",
        "Balance the benefits of extending payment terms against supply chain relationship risk",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 2.3 — Cash Management & Cash Flow Forecasting",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
