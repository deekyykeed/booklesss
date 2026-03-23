"""
Booklesss Lesson PDF — Step 2.1: Working Capital & Liquidity Management
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
OUT_PATH = os.path.join(OUT_DIR, "Step 2.1 - Working Capital & Liquidity Management.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "2.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "2.1 — Working Capital & Liquidity Management")
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
    story.append(Paragraph("Working Capital &\nLiquidity Management", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 2.1 · The cash cycle, working capital policy, debtor management, and factoring",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: What is Working Capital? ────────────────────
    story += section("FOUNDATIONS", "What is Working Capital?")
    story.append(body(
        "Working capital is current assets minus current liabilities. That's the technical "
        "definition. In practice, it's the pool of cash and near-cash resources a business "
        "has available to keep running day-to-day."
    ))
    story.append(body(
        "If current assets exceed current liabilities, the company has a surplus — usually "
        "sitting in bank deposits or short-term investments. If liabilities exceed assets, "
        "there's a deficit, and the company is typically running on an overdraft or short-term loan."
    ))
    story.append(body(
        "Treasury's job is to manage this pool as efficiently as possible. Too little working "
        "capital and the business can't pay its suppliers. Too much and money sits idle "
        "earning nothing when it could be in productive assets."
    ))
    story.append(callout(
        "Even a profitable business can fail without adequate working capital. "
        "Cash is king — not profit. A company can be profitable on paper and still collapse "
        "if it can't meet its near-term obligations.",
        "warn"))

    # ── SECTION 2: Working Capital Policy ──────────────────────
    story += section("STRATEGY", "Working Capital Policy")
    story.append(body(
        "Every company makes two decisions that together define its working capital policy."
    ))
    story.append(h3("1. The Investment Decision — how much to hold"))
    story.append(body(
        "Companies must hold minimum levels of cash and inventory to keep operations running. "
        "The question is: how much safety stock on top of that minimum?"
    ))

    inv_data = [
        ["Policy", "What it means", "Return", "Risk"],
        ["Aggressive", "Minimal safety stock. Lean inventory, tight cash buffers.",
         "Higher — less idle capital", "Higher — can't respond to demand spikes"],
        ["Conservative", "Large safety stocks. Generous cash buffers.",
         "Lower — more capital tied up", "Lower — rarely caught short"],
        ["Moderate", "Balanced approach between the two extremes.",
         "Middle ground", "Middle ground"],
    ]
    story.append(table_std(inv_data, [2.8*cm, 6*cm, (CONTENT_W-8.8*cm)/2, (CONTENT_W-8.8*cm)/2]))
    story.append(Spacer(1, 10))

    story.append(h3("2. The Financing Decision — how to fund it"))
    story.append(body(
        "This is about the mix of short-term vs long-term debt used to finance the asset base."
    ))

    fin_data = [
        ["Policy", "How it works", "Return", "Risk"],
        ["Aggressive", "Part of the permanent asset base funded by short-term debt.",
         "Highest — short-term debt costs less", "Highest — must be rolled over"],
        ["Conservative", "Permanent assets funded by long-term debt only.",
         "Lowest", "Lowest"],
        ["Maturity matching", "Match funding maturity to asset life.",
         "Middle", "Middle"],
    ]
    story.append(table_std(fin_data, [2.8*cm, 6*cm, (CONTENT_W-8.8*cm)/2, (CONTENT_W-8.8*cm)/2]))
    story.append(Spacer(1, 8))
    story.append(callout(
        "Exam tip: in both decisions, aggressive = higher return AND higher risk. "
        "Conservative = lower return AND lower risk. Always state both sides when the "
        "exam asks you to evaluate a policy.",
        "note"))

    # ── SECTION 3: The Cash Conversion Cycle ───────────────────
    story += section("MEASUREMENT", "The Cash Conversion Cycle")
    story.append(body(
        "The operating cycle is the time between paying cash for inputs and receiving cash from "
        "sales. The cash conversion cycle (CCC) measures this precisely:"
    ))
    story.append(formula_box([
        "CCC  =  Days Inventory  +  Days Receivables  —  Days Payables",
        "",
        "Days Inventory    =  (Inventory ÷ Cost of Goods Sold)  ×  365",
        "Days Receivables  =  (Accounts Receivable ÷ Revenue)  ×  365",
        "Days Payables     =  (Accounts Payable ÷ Cost of Goods Sold)  ×  365",
    ]))

    story.append(body(
        "The longer the CCC, the more working capital the business needs to fund. "
        "A company with a 90-day CCC has to finance 90 days of operations before cash comes in."
    ))

    story.append(h3("Worked Example — Zanaco Distributors Ltd"))
    story.append(Spacer(1, 4))
    data_data = [
        ["Item", "Value (ZMW)"],
        ["Inventory", "K2,600,000"],
        ["Accounts Receivable", "K1,700,000"],
        ["Accounts Payable", "K1,600,000"],
        ["Annual Revenue", "K15,000,000"],
        ["Cost of Goods Sold", "K9,200,000"],
    ]
    story.append(table_std(data_data, [8*cm, CONTENT_W - 8*cm]))
    story.append(Spacer(1, 10))
    story.append(formula_box([
        "Step 1:  Days Inventory  =  (K2,600,000 ÷ K9,200,000)  ×  365  =  103.15 days",
        "Step 2:  Days Receivables  =  (K1,700,000 ÷ K15,000,000)  ×  365  =  41.37 days",
        "Step 3:  Days Payables  =  (K1,600,000 ÷ K9,200,000)  ×  365  =  63.48 days",
        "",
        "CCC  =  103.15  +  41.37  —  63.48  =  81.04 days",
        "",
        "Cash Turnover  =  365 ÷ 81.04  =  4.5 times per year",
    ]))
    story.append(body(
        "Zanaco Distributors takes just over 81 days from paying for goods to collecting cash. "
        "Cash turns over 4.5 times a year. Shortening any component — collecting faster, "
        "turning inventory quicker, paying suppliers later — directly reduces funding requirements."
    ))

    # Discussion question 1 — mid-content, genuine
    story.append(discussion_question(
        "Something worth sitting with: if Zanaco ran this same calculation next year and the "
        "CCC jumped from 81 days to 120 days — what's the most likely cause, and which "
        "number would you look at first to diagnose it?"
    ))

    story.append(h3("Steps to Shorten the CCC"))
    for step in [
        "Collect debts faster — reduce debtor days through tighter credit terms or discounts",
        "Turn inventory faster — reduce stock holding periods and production time",
        "Reduce raw material inventory — order more frequently in smaller quantities",
        "Negotiate longer supplier credit — extend payable days without damaging relationships",
    ]:
        story.append(bullet(step))
    story.append(Spacer(1, 6))

    # ── SECTION 4: Debtor Management ───────────────────────────
    story += section("DEBTORS", "Debtor Management & Credit Control")
    story.append(body(
        "Extending credit to customers ties up cash. The goal is to find the level of credit "
        "and discount terms that maximises profit — not just minimises days outstanding."
    ))
    story.append(body(
        "Good credit management involves assessing which customers to extend credit to, "
        "setting individual limits, and having a clear process for overdue accounts."
    ))

    story.append(h3("Assessing a Customer's Creditworthiness"))
    for source in [
        "Bank references — Zambian banks provide references on their customers",
        "Trade references — existing suppliers can confirm payment history",
        "Published accounts — annual reports indicate general financial health",
        "Credit Reference Bureau — Zambia's credit registry holds borrowing data across banks",
        "Own sales records — for existing customers, the sales ledger shows payment patterns",
    ]:
        story.append(bullet(source))
    story.append(Spacer(1, 6))

    story.append(h3("Cash Discounts — Cost to the Buyer"))
    story.append(body(
        "Credit terms like '2/10 net 30' mean: take a 2% discount if you pay within 10 days, "
        "or pay the full amount by day 30. The buyer has to decide whether the discount is worth it."
    ))
    story.append(formula_box([
        "Annual cost of NOT taking the discount:",
        "",
        "Cost  =  [D ÷ (100 - D)]  ×  [365 ÷ (N - T)]",
        "",
        "Where:  D = discount %,  N = net period,  T = discount period",
    ]))

    story.append(h3("Worked Example — 2/10 net 30"))
    story.append(body(
        "A buyer is offered terms 2/10 net 30. Short-term borrowing rate is 8%. "
        "Should they take the discount?"
    ))
    story.append(formula_box([
        "Cost  =  [2 ÷ (100 - 2)]  ×  [365 ÷ (30 - 10)]",
        "      =  0.0204  ×  18.25",
        "      =  37.23% per annum",
        "",
        "Borrowing cost: 8% p.a.",
        "Decision: borrow at 8% and take the discount — forgoing it costs 37.23%.",
    ]))
    story.append(callout(
        "Always compare the annual cost of forgoing the discount against the cost of "
        "short-term borrowing. If borrowing is cheaper, take the discount. "
        "37.23% vs 8% makes this a straightforward call.",
        "note"))

    # ── SECTION 5: Factoring ────────────────────────────────────
    story += section("OUTSOURCING", "Factoring vs Invoice Discounting")
    story.append(body(
        "Rather than managing receivables in-house, companies can outsource them. "
        "Two options: factoring and invoice discounting."
    ))

    story.append(h3("Factoring"))
    story.append(body(
        "A factoring company takes on your sales ledger. It advances a percentage of invoice "
        "value immediately (typically 80–85%), then pays the remainder — less its fees — when "
        "the customer settles. Full-service factors also assess customer credit and chase overdue accounts."
    ))
    story.append(body(
        "Non-recourse factoring means the factor absorbs credit risk. Recourse factoring means "
        "the risk stays with you."
    ))

    story.append(h3("Worked Example — Mutengo Plc"))
    story.append(body(
        "Mutengo Plc imports commodities sold to reliable customers. "
        "Monthly invoices: K300,000. Average credit period: 2.5 months."
    ))
    for term in [
        "Service fee: 2.5% of total invoices",
        "Advance: 85% of invoiced amounts at 13% p.a. interest",
        "Admin cost savings: K95,000 per year avoided",
    ]:
        story.append(bullet(term))
    story.append(Spacer(1, 6))
    story.append(formula_box([
        "Annual sales:  K300,000 × 12  =  K3,600,000",
        "",
        "Factoring fee:  2.5% × K3,600,000                  =  K90,000",
        "Interest:  (2.5/12) × K3,600,000 × 85% × 13%      =  K82,875",
        "Total factoring cost:                                K172,875",
        "Less: admin cost savings:                          - K95,000",
        "Net cost of factoring:                               K77,875",
        "",
        "Alternative — bank overdraft on K637,500 at 12.5%  =  K79,688",
        "Factoring saving:                                    ~K1,800",
    ]))
    story.append(body(
        "Factoring saves Mutengo about K1,800 per year versus the overdraft — and eliminates "
        "the burden of running the sales ledger. For a company that doesn't want credit "
        "management as a core function, the numbers make sense."
    ))

    story.append(h3("Invoice Discounting"))
    story.append(body(
        "Invoice discounting provides the same finance without handing over your sales ledger. "
        "Customers don't know a third party is involved. It's cheaper than factoring and keeps "
        "the customer relationship entirely in your hands."
    ))

    comp_data = [
        ["", "Factoring", "Invoice Discounting"],
        ["Sales ledger", "Factor manages it", "Company manages it"],
        ["Customer awareness", "Customers know", "Customers don't know"],
        ["Cost", "Higher", "Lower"],
        ["Best for", "Full outsourcing", "Finance only"],
        ["Credit risk (non-recourse)", "Factor absorbs", "Company retains"],
    ]
    story.append(table_std(comp_data,
        [4.5*cm, (CONTENT_W - 4.5*cm)/2, (CONTENT_W - 4.5*cm)/2]))
    story.append(Spacer(1, 8))

    # Discussion question 2 — end of content, before key terms
    story.append(discussion_question(
        "One that exam questions like to test: under what circumstances would you recommend "
        "factoring over invoice discounting even if factoring costs more? Think about what "
        "else the company gains beyond the finance itself."
    ))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Working capital", "Current assets minus current liabilities — the short-term funding available to run operations"],
        ["Cash conversion cycle", "Days inventory + days receivables - days payables: time from cash outflow to cash inflow"],
        ["Days inventory", "(Inventory ÷ COGS) × 365 — average days inventory is held before being sold"],
        ["Days receivables", "(Receivables ÷ Revenue) × 365 — average days to collect payment from customers"],
        ["Days payables", "(Payables ÷ COGS) × 365 — average days taken to pay suppliers"],
        ["Aggressive WC policy", "Minimal safety stocks and/or short-term financing — higher return, higher risk"],
        ["Conservative WC policy", "Large safety stocks and long-term financing — lower return, lower risk"],
        ["Factoring", "Outsourcing the sales ledger to a finance company that advances cash against invoices"],
        ["Invoice discounting", "Finance advanced against invoices; company retains the sales ledger"],
        ["Non-recourse factoring", "The factor absorbs credit risk — if the customer doesn't pay, the factor covers it"],
        ["Trade discount", "Reduction offered for early payment, e.g. 2/10 net 30"],
    ]
    story.append(table_std(terms, [5.5*cm, CONTENT_W - 5.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Define working capital and explain why a profitable business can still fail without adequate liquidity",
        "Distinguish between aggressive, conservative, and moderate working capital policies for both investment and financing decisions",
        "Calculate the cash conversion cycle and identify which components to target to shorten it",
        "Assess whether a buyer should take a trade discount using the annual cost formula",
        "Explain how factoring works and calculate the net cost of a factoring arrangement",
        "Compare factoring and invoice discounting and explain when each is more appropriate",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 2.2 — Inventory Management, EOQ & Creditor Management",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
