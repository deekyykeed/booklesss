"""
Booklesss Lesson PDF — Step 2.3: Cash Management & Cash Flow Forecasting
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
OUT_PATH = os.path.join(OUT_DIR, "Step 2.3 - Cash Management & Cash Flow Forecasting.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "2.3")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "2.3 — Cash Management & Cash Flow Forecasting")
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
    story.append(Paragraph("Cash Management\n& Cash Flow Forecasting", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 2.3 · Baumol model, Miller-Orr model, cash flow forecasting methods, surplus investment and bank overdrafts",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Why Cash Management Matters ─────────────────
    story += section("FOUNDATIONS", "Why Cash Management Matters")
    story.append(body(
        "Cash holds the central position in short-term financing decisions. "
        "Holding cash has an opportunity cost — money in the vault earns no interest when it could be generating returns elsewhere. "
        "Treasury must balance the liquidity of cash against the profitability forgone by holding it."
    ))
    story.append(body(
        "The principle is straightforward: cash should be held only until the marginal value of liquidity equals the value of interest lost. "
        "Beyond that point, excess cash is simply idle capital."
    ))
    story.append(body(
        "Cash management, at its heart, is two things: optimising the amount of cash available to meet obligations, and maximising the interest earned on surplus funds not required immediately. "
        "Both require careful planning and execution."
    ))
    story.append(body(
        "The time value of money plays a key role here. Banks pay higher interest on longer-notice accounts (the longer you tie up the money, the better the rate), "
        "and they charge higher rates on overdrafts compared to term loans (the more flexible the facility, the more expensive it is). "
        "Treasury's job is to switch money between accounts to minimise aggregate costs, accounting for the transaction costs of moving funds and the interest rate differentials between accounts."
    ))

    # ── SECTION 2: Baumol Model ───────────────────────────────
    story += section("BAUMOL MODEL", "Baumol Model of Cash Management")
    story.append(body(
        "The Baumol model is a straightforward approach that helps companies find the desirable cash balance when cash needs are known with certainty. "
        "It captures the central trade-off in cash management: the liquidity benefit of holding money against the interest forgone on cash balances that are sitting idle."
    ))
    story.append(h3("Key Variables"))
    for var in [
        "Nominal interest rate (i): the opportunity cost of holding cash",
        "Level of real income (desired transactions): the annual volume of cash needs",
        "Fixed cost of transferring assets (F): the cost to move money in or out of the account",
    ]:
        story.append(bullet(var))
    story.append(Spacer(1, 6))

    story.append(h3("Assumptions"))
    for assumption in [
        "Cash needs are known with certainty; disbursements occur uniformly throughout the period",
        "Opportunity cost is known and constant over the period",
        "Transaction costs are known and constant (the cost to move money doesn't change with the amount moved)",
    ]:
        story.append(bullet(assumption))
    story.append(Spacer(1, 8))

    story.append(h3("The Formula"))
    story.append(formula_box([
        "C  =  √(2AF / O)",
        "",
        "Where:  C = optimum cash balance",
        "        A = annual cash disbursements",
        "        F = fixed cost per transaction",
        "        O = opportunity cost (interest rate)",
    ]))

    story.append(h3("Worked Example — ABC Ltd"))
    story.append(body(
        "ABC Ltd disburses K300,000 per year. The bank pays 10% per annum on money held. "
        "Each withdrawal from the investment account costs K20 in fees."
    ))
    story.append(formula_box([
        "C  =  √(2 × K20 × K300,000 / 0.10)",
        "   =  √(K120,000,000)",
        "   =  K11,000",
        "",
        "Number of transactions  =  K300,000 ÷ K11,000  =  27 per year",
        "Average balance held  =  K11,000 ÷ 2  =  K5,500",
        "",
        "Annual transaction cost  =  27 × K20  =  K540",
        "Annual opportunity cost  =  K5,500 × 10%  =  K550",
        "Total annual cost  =  K1,090",
    ]))
    story.append(body(
        "The Baumol model tells ABC Ltd that the optimal balance is K11,000. "
        "At that level, the cost of making 27 transactions (K540) roughly equals the interest forgone on the average K5,500 held (K550). "
        "Any balance higher or lower would increase total costs."
    ))

    # ── SECTION 3: Miller-Orr Model ────────────────────────────
    story += section("MILLER-ORR MODEL", "Miller-Orr Model of Cash Management")
    story.append(body(
        "The Miller-Orr model, developed by M.H. Miller and Daniel Orr, relaxes the Baumol assumption that cash flows are certain. "
        "It's a stochastic model designed for the real world, where cash inflows and outflows are unpredictable."
    ))
    story.append(body(
        "Instead of calculating a single optimum balance, Miller-Orr establishes control limits: "
        "an upper control limit (where you buy marketable securities), a lower control limit (where you sell marketable securities to raise cash), "
        "and a return point (where you return the balance after a transaction)."
    ))
    story.append(h3("The Formula"))
    story.append(formula_box([
        "Z  =  3∛(3 × transaction cost × variance / 4 × interest rate)",
        "",
        "Upper control limit  =  Lower limit  +  Z",
        "Return point  =  Lower limit  +  (Z / 3)",
    ]))

    story.append(h3("Worked Example — Miller-Orr Calculation"))
    story.append(body(
        "A company sets a lower cash limit of K1,000. The daily interest rate is 0.025% (0.0000025 decimal). "
        "The standard deviation of daily cash flows is K500; variance is K250,000. The cost to buy or sell securities is K20."
    ))
    story.append(formula_box([
        "Z  =  3∛[(3 ÷ 4) × K20 × K250,000 / 0.000025]",
        "   =  3∛[0.75 × K5,000,000 / 0.000025]",
        "   =  3∛[K150,000,000,000]",
        "   =  3 × K5,313.63",
        "   =  K7,400 (rounded)",
        "",
        "Upper control limit  =  K1,000  +  K7,400  =  K8,400",
        "Return point  =  K1,000  +  (K7,400 ÷ 3)  =  K1,000  +  K2,467  =  K3,467",
    ]))
    story.append(body(
        "The model tells management: if cash falls to K1,000, sell securities to raise cash. "
        "If cash rises to K8,400, buy securities. After each transaction, target a return point of K3,467."
    ))

    story.append(callout(
        "<b>Exam tip:</b> Baumol assumes certainty; Miller-Orr handles uncertainty. "
        "Know which to use. You may be asked to calculate the spread (Z), upper control limit, or return point. "
        "Miller-Orr is almost always the right choice for real-world exams because cash flows are rarely certain.",
        "note"))

    # ── DISCUSSION QUESTIONS ───────────────────────────────────
    questions = (
        "<b>Question 1:</b> A company's cash flows are highly unpredictable due to seasonal demand. "
        "Which model — Baumol or Miller-Orr — is more appropriate, and what data would you need to apply it? "
        "<br/><br/>"
        "<b>Question 2:</b> ABC Ltd's treasurer is considering raising the lower cash limit in the Miller-Orr model. "
        "What effect does this have on the upper limit and return point?"
    )
    nudge = "Try working through both models with a business you know. Post your workings in #tm-working-capital — it helps to see how others set up the problem."
    story.append(discussion_question_with_nudge(questions, nudge))

    # ── SECTION 4: Cash Flow Forecasting ───────────────────────
    story += section("FORECASTING", "Cash Flow Forecasting")
    story.append(body(
        "Cash forecasting assists treasury in planning cash management activities. "
        "It helps schedule transfers between accounts, fund disbursements, make short-term investment or borrowing decisions, and establish target cash balances."
    ))
    story.append(h3("Three Steps to Forecasting"))
    for step in [
        "Estimate future inflows and outflows",
        "Generate a pro forma cash position for the forecast period",
        "Identify how to cover deficits (through borrowing or asset sales) or invest surpluses (in short-term instruments)",
    ]:
        story.append(bullet(step))
    story.append(Spacer(1, 8))

    story.append(h3("Purpose of Cash Forecasting"))
    purpose_data = [
        ["Purpose", "Description"],
        ["Managing liquidity", "Forecast the net cash position to identify excesses or shortages for investment or borrowing decisions"],
        ["Controlling financial activities", "Identify unanticipated inventory changes, delays in accounts receivable collection, mistimed payments, or fraud"],
        ["Meeting strategic objectives", "Project future funding requirements to support growth and strategic expansion plans"],
        ["Budgeting capital", "Help evaluate proposed capital expenditures and their impact on cash available for operations"],
        ["Managing costs", "Minimise excess bank balances (which earn low interest), reduce short-term borrowing costs, and increase investment income"],
        ["Managing currency exposure", "Assess the degree of FX exposure and plan hedging if needed"],
        ["Regulatory compliance", "Ensure compliance with regulatory requirements (minimum capital ratios, imprest tax accounts, etc.)"],
    ]
    story.append(table_std(purpose_data, [4*cm, CONTENT_W - 4*cm]))
    story.append(Spacer(1, 12))

    # ── Forecasting Methods ────────────────────────────────────
    story.append(h3("Receipts and Disbursements Method"))
    story.append(body(
        "The receipts and disbursements forecast projects cash in and cash out, then nets them to show the forecast cash position."
    ))
    story.append(bullet("Receipts schedule: projection of collections from customers, plus other inflows (interest income, dividends, asset sales)"))
    story.append(bullet("Disbursement schedule: forecasting cash out for purchases, payroll, taxes, interest, dividends, rent, debt repayment, capital expenditure"))
    story.append(bullet("Combined forecast: netting receipts against disbursements and comparing to the minimum cash balance required"))
    story.append(Spacer(1, 6))

    story.append(h3("Distribution Forecasts"))
    story.append(body(
        "Distribution forecasts estimate the daily impact of a single event on cash flows over a period, using historical patterns to project how the event unfolds. "
        "A large customer payment, for example, may be collected over several days. Historical data shows the pattern of collection, which is then applied to future payments."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Statistical Methods"))
    story.append(body(
        "Three common statistical approaches:"
    ))
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>Simple Moving Average</b>", ST["h3"]))
    story.append(body(
        "A rolling average of past values. The forecast for the next period is the average of the previous n periods."
    ))
    story.append(formula_box([
        "Forecast (day 6)  =  (Day 1 + Day 2 + Day 3 + Day 4 + Day 5) ÷ 5",
        "",
        "Example:",
        "Past 5 days: K110,000, K120,000, K115,000, K122,000, K126,000",
        "Forecast = (K110,000 + K120,000 + K115,000 + K122,000 + K126,000) ÷ 5 = K118,600",
        "",
        "Actual day 6 = K124,000",
        "Forecast error = K124,000 - K118,600 = K5,400",
    ]))

    story.append(Paragraph("<b>Exponential Smoothing</b>", ST["h3"]))
    story.append(body(
        "A weighted average that gives more weight to recent observations and less weight to older ones. "
        "The smoothing constant α (alpha) controls how much weight recent data receives (0 < α < 1)."
    ))
    story.append(formula_box([
        "Forecast (t+1)  =  α × Actual (t)  +  (1 - α) × Forecast (t)",
        "",
        "Example with α = 0.40:",
        "Forecast (day 7) = 0.40 × K124,000 + 0.60 × K118,600",
        "                 = K49,600 + K71,160",
        "                 = K120,760",
    ]))

    story.append(Paragraph("<b>Correlation and Regression</b>", ST["h3"]))
    story.append(body(
        "Identifies association between a cash flow and another variable (e.g., sales volume, production units, customer orders). "
        "The regression equation Y = a + bX quantifies the relationship and allows forecasting based on the independent variable."
    ))
    story.append(Spacer(1, 6))

    # ── SECTION 5: Managing Surpluses ──────────────────────────
    story += section("SURPLUSES", "Managing Cash Surpluses & Short-Term Investment")
    story.append(body(
        "Cash surpluses arise for many reasons — seasonal variations, uneven project timing, unexpected recoveries from receivables. "
        "When cash sits idle, it earns nothing unless it's invested. The key is finding the right home for it."
    ))
    story.append(body(
        "When deciding where to invest surplus cash, ask four questions: "
        "How long can the cash be tied up? How much is available? What return can be earned? What's the risk of early withdrawal?"
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Short-Term Investment Vehicles"))
    invest_data = [
        ["Instrument", "Description", "Key Feature"],
        ["Treasury bills", "Government short-term debt, issued at discount to par", "Good liquidity, fixed maturity, low risk"],
        ["Call deposits", "Current accounts paying interest, notice period required", "Combines liquidity with interest, can access with notice"],
        ["Term deposits", "Fixed amount for fixed period (30, 60, 90, 120 days), tiered rates", "Higher rates for longer commitment, no early access"],
        ["Certificates of deposit", "Fixed-rate instruments issued by commercial banks", "Tradeable on discount market, reasonable liquidity"],
        ["Money market accounts", "Variable-rate investment in money markets", "Flexible, market-linked returns, instant access"],
    ]
    story.append(table_std(invest_data, [3*cm, 5.5*cm, 5*cm]))
    story.append(Spacer(1, 10))

    story.append(h3("Treasury Bill Yield Calculation"))
    story.append(body(
        "Treasury bills are issued at a discount to their par value. The yield depends on the purchase price and days to maturity."
    ))
    story.append(formula_box([
        "Yield  =  (100 - Purchase Price) ÷ Purchase Price  ×  100",
        "",
        "Annualised Return  =  Yield  ×  365 ÷ Days to Maturity",
        "",
        "Example: 91-day T-bill purchased at K99",
        "Yield = (100 - 99) ÷ 99 × 100 = 1.01%",
        "Annualised yield = 1.01%  ×  365 ÷ 91 = 4.05%",
    ]))
    story.append(body(
        "A K99 purchase of a 91-day bill yields 4.05% annualised — better than a call deposit at 2%, but the money is tied up for three months."
    ))

    # ── SECTION 6: Bank Overdrafts ─────────────────────────────
    story += section("BORROWING", "Bank Overdrafts")
    story.append(body(
        "A bank overdraft is a short-term advance on the current account, repayable within 12 months, "
        "up to an agreed limit. Interest is charged on the daily balance outstanding (not on the full facility)."
    ))
    story.append(body(
        "Overdrafts are used by companies for working capital gaps and by individuals for salary timing or consumer purchases. "
        "They're the default short-term borrowing tool for many businesses."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Advantages"))
    adv_data = [
        ["Advantage", "Detail"],
        ["Flexibility", "Draw funds only when needed; repay when you have cash. No drawn-down fees."],
        ["Minimal documentation", "Easier and faster to arrange than a term loan. Less legal paperwork."],
        ["Interest efficiency", "Interest is paid on the overdrawn amount, not on the full facility. Secured overdrafts usually have lower rates."],
    ]
    story.append(table_std(adv_data, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 10))

    story.append(h3("Disadvantages"))
    for disadv in [
        "Repayable on demand — the bank can call the facility with notice",
        "Collateral required — the bank will demand security (personal guarantee, asset charge, or cash deposit)",
        "Interest rate risk — the rate is variable, floating with base rate changes",
        "Cost varies by perceived risk — healthier businesses get better rates",
    ]:
        story.append(bullet(disadv))
    story.append(Spacer(1, 8))

    # ── SECTION 7: Cash Concentration ──────────────────────────
    story += section("CONCENTRATION", "Cash Concentration")
    story.append(body(
        "Large, multi-site organisations maintain different bank accounts across regions or business units. "
        "Money scattered across many accounts makes it hard to fund centralised payments, invest surpluses efficiently, or track the true cash position. "
        "The solution is cash concentration — pooling cash from multiple accounts."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Physical Sweeping"))
    story.append(body(
        "Physical sweeping moves cash between accounts. Three approaches:"
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Zero Balance Account (ZBA)</b>", ST["h3"]))
    story.append(body(
        "The bank automatically sweeps cash from subsidiary accounts into the concentration account at the end of each day. "
        "Each subsidiary ZBA is reduced to zero on the sweep. Funds are transferred back to the subsidiary when it has a debit balance."
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Constant Balancing</b>", ST["h3"]))
    story.append(body(
        "The bank maintains a pre-determined minimum balance in each subsidiary account. "
        "Any amount above the minimum is swept to the concentration account. "
        "If the subsidiary balance falls below the minimum, funds are transferred back."
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>Trigger Balances</b>", ST["h3"]))
    story.append(body(
        "Sweeping occurs only when a subsidiary account balance exceeds a trigger level (e.g., K100,000). "
        "This reduces the frequency of sweeps (perhaps weekly or monthly) but requires a higher trigger balance."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Notional Pooling"))
    story.append(body(
        "Notional pooling calculates interest on the combined credit and debit balances of all subsidiary accounts without physically transferring funds. "
        "Each subsidiary retains daily cash management privileges (can move its own money), but interest is earned on the net balance of the pool."
    ))
    story.append(body(
        "The advantage: interest earnings are higher than separate accounts, and it avoids intercompany loans and bank transfer fees. "
        "The disadvantage: notional pooling is not permitted in some countries (parts of Africa, Asia, and Latin America). "
        "Global pooling can offset multicurrency balances without executing foreign exchange transactions."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Comparison: Physical Sweeping vs Notional Pooling"))
    compare_data = [
        ["Feature", "Physical Sweeping (ZBA)", "Notional Pooling"],
        ["Funds physically moved", "Yes", "No"],
        ["Intercompany loans", "May arise", "Not required"],
        ["Bank transfer fees", "Yes", "No"],
        ["Permitted everywhere", "Generally yes", "Restricted in some countries"],
        ["Subsidiary autonomy", "Reduced (account zeroed daily)", "Maintained"],
    ]
    story.append(table_std(compare_data, [4*cm, (CONTENT_W - 4*cm)/2, (CONTENT_W - 4*cm)/2]))
    story.append(Spacer(1, 12))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Cash management", "The practice of optimising the cash available to meet obligations while maximising returns on surplus funds"],
        ["Opportunity cost (cash)", "The interest or return forgone by holding non-interest-bearing cash"],
        ["Baumol model", "A deterministic model that calculates the optimum cash balance when cash flows are certain"],
        ["Miller-Orr model", "A stochastic model that establishes control limits and a return point for cash management under uncertainty"],
        ["Control limits (upper/lower)", "In Miller-Orr, the thresholds at which the company buys/sells securities"],
        ["Return point", "In Miller-Orr, the balance to which cash is returned after a transaction"],
        ["Cash flow forecasting", "Predicting future cash inflows and outflows to plan working capital management"],
        ["Receipts and disbursements forecast", "A detailed schedule of projected cash in and cash out"],
        ["Moving average", "A forecast based on the average of past values"],
        ["Exponential smoothing", "A forecast that weights recent observations more heavily than older ones"],
        ["Treasury bill", "Short-term government debt issued at a discount"],
        ["Call deposit", "An interest-bearing current account requiring notice before withdrawal"],
        ["Term deposit", "An interest-bearing deposit locked in for a fixed period"],
        ["Certificate of deposit", "A fixed-rate bank instrument, typically tradeable"],
        ["Bank overdraft", "A short-term advance on the current account, repayable on demand"],
        ["Cash concentration", "Pooling cash from multiple accounts into a single account"],
        ["Zero balance account (ZBA)", "A subsidiary account that is swept daily to zero, with funds transferred to a concentration account"],
        ["Notional pooling", "Interest calculation on combined balances without physically moving funds"],
    ]
    story.append(table_std(terms, [5*cm, CONTENT_W - 5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain the concept of cash management and the trade-off between liquidity and profitability",
        "Apply the Baumol model to calculate the optimum cash balance under certainty",
        "Apply the Miller-Orr model to determine the spread, upper limit and return point under uncertainty",
        "Distinguish between Baumol and Miller-Orr and identify which model is appropriate in a given context",
        "Identify the purposes of cash flow forecasting and explain the main forecasting methods",
        "Calculate treasury bill yields and evaluate short-term investment vehicles for surplus cash",
        "Explain the advantages and disadvantages of bank overdrafts as a source of short-term finance",
        "Distinguish between physical sweeping and notional pooling as cash concentration strategies",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 3.1 — Interest Rate Risk Management",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
