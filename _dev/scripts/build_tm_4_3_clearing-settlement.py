"""
Booklesss Lesson PDF — Step 4.3: Clearing & Settlement Systems
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
OUT_PATH = os.path.join(OUT_DIR, "Step 4.3 - Clearing & Settlement Systems.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "4.3")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "4.3 — Clearing & Settlement Systems")
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
    """Soft, peer-to-peer mention of the study group."""
    elements = [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "This is one step in the Treasury Management series running in the Booklesss study group on Slack. "
            "The channel for this topic is <b>#tm-operations</b> — that's where students going through "
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
    story.append(Paragraph("Clearing & Settlement\nSystems", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 4.3 · Settlement risk, gross vs net settlement, RTGS systems, CLS Bank, SWIFT, securities settlement, Zambia's payment systems",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Clearing vs Settlement ──────────────────────
    story += section("FOUNDATIONS", "What is Clearing and Settlement?")
    story.append(body(
        "Clearing and settlement are two distinct stages in the payment process that work together to move value from one party to another. "
        "Many people use these terms interchangeably, but treasury professionals must understand the difference."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Clearing"))
    story.append(body(
        "Clearing is all the steps involved in transferring ownership of funds from one party to another — except the final step. "
        "It covers everything from the moment a payment instruction is issued to the moment the money is about to change hands. "
        "Clearing includes validation of payment details, matching of sender and receiver accounts, and preparation of settlement instructions."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Settlement"))
    story.append(body(
        "Settlement is the finalization of the payment. It's the moment when the funds actually transfer, when a new party takes possession of the money, "
        "when the accounts are debited and credited, and when the transaction becomes final and irrevocable. "
        "Settlement is the point at which the risk ends: both parties have received what they expected."
    ))
    story.append(Spacer(1, 8))
    story.append(callout(
        "<b>For treasury:</b> Understanding clearing vs settlement matters because risk exists during clearing. "
        "Until settlement is complete, either party could fail, leaving the other exposed. This is why settlement systems are carefully managed.",
        "info"))

    # ── SECTION 2: Settlement Risk & Herstatt Risk ─────────────
    story += section("RISK", "Settlement Risk and Herstatt Risk")
    story.append(body(
        "Settlement risk is the risk that one party to a transaction fails before settlement is complete, leaving the other party exposed. "
        "It's particularly acute in foreign exchange transactions because FX settlements occur in two different countries at different times."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("How FX Settlement Risk Arises"))
    story.append(body(
        "When a company trades EUR for USD, one bank must settle euros in Frankfurt (on European time), and another must settle dollars in New York (on US time). "
        "Because the time zones are different, one side of the transaction settles hours before the other. "
        "For example, euros settle first (during Frankfurt business hours), but dollars settle later (New York is 6 hours behind). "
        "If the counterparty fails after sending euros but before sending dollars, the company loses the euros and never receives the dollars."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("The Herstatt Risk Story"))
    story.append(body(
        "Herstatt risk gets its name from Herstatt Bank, a German bank that failed in 1974 during the Bretton Woods era. "
        "Herstatt had entered into foreign exchange transactions, received payments in deutsche marks, but failed to deliver dollars to counterparties. "
        "The bank's collapse left counterparties with losses — they had sent deutschmarks but never received dollars. "
        "This single failure highlighted a systemic risk in the global payment system and prompted regulators to build safer settlement infrastructure."
    ))
    story.append(Spacer(1, 8))
    story.append(callout(
        "<b>Still relevant today:</b> Herstatt risk is why the CLS Bank system exists (discussed below). Every large FX transaction today is routed through CLS "
        "to eliminate the timing gap that made Herstatt possible.",
        "warn"))

    # ── SECTION 3: Gross vs Net Settlement ──────────────────────
    story += section("SETTLEMENT TYPES", "Gross Settlement vs Net Settlement")
    story.append(body(
        "There are two main ways to settle payments: gross basis and net basis. The choice depends on the size of the transaction, its urgency, and cost tolerance."
    ))
    story.append(Spacer(1, 8))
    story.append(h3("Gross Settlement (RTGS)"))
    story.append(body(
        "In gross settlement, each payment is settled individually and in full. "
        "Bank A pays the full amount owed to Bank B for each transaction separately, and the transaction is final immediately. "
        "This is <b>Real-Time Gross Settlement (RTGS)</b> — transactions are processed in real time, one by one, settled individually and immediately."
    ))
    story.append(bullet("Used for: high-value payments, time-critical transactions (securities trades, large corporate payments)"))
    story.append(bullet("Cost: high (each transaction incurs bank fees)"))
    story.append(bullet("Liquidity requirement: high (banks must have funds pre-positioned to settle each transaction)"))
    story.append(bullet("Risk: lower (payment is final immediately; no unsettled exposure overnight)"))
    story.append(Spacer(1, 8))
    story.append(h3("Net Settlement (DNS)"))
    story.append(body(
        "In net settlement, transactions are accumulated throughout the day, then offset against each other. "
        "Only the net difference between banks is settled. For example, if Bank A owes Bank B K100m but Bank B owes Bank A K80m, "
        "only K20m changes hands — the net position. This is <b>Deferred Net Settlement (DNS)</b> — settlement waits until the end of the day."
    ))
    story.append(bullet("Used for: lower-value payments, routine transactions (utility bills, payroll, interbank transfers)"))
    story.append(bullet("Cost: low (many transactions offset, reducing the number of actual fund transfers)"))
    story.append(bullet("Liquidity requirement: low (only net amounts need to be transferred)"))
    story.append(bullet("Risk: higher (many unsettled transactions sit overnight, creating exposure if a bank fails)"))
    story.append(Spacer(1, 8))
    story.append(callout(
        "<b>Choice depends on transaction size:</b> High-value payments must use RTGS (gross) because the risk of overnight exposure is too great. "
        "Low-value payments can wait for end-of-day netting (DNS) because the cost savings outweigh the risk.",
        "info"))

    # ── SECTION 4: SWIFT ───────────────────────────────────────
    story += section("INFRASTRUCTURE", "SWIFT — The Global Payment Messaging System")
    story.append(body(
        "SWIFT (Society for Worldwide Interbank Financial Telecommunications) is a secure, standardized messaging network used by banks worldwide to exchange payment instructions. "
        "SWIFT doesn't move money; it carries the messages that instruct banks to move money."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Key SWIFT Message Types"))
    swift_msgs = [
        ["Message Type", "Use", "Example"],
        ["MT103", "Customer credit transfer", "Company sends payment instruction to its bank"],
        ["MT202", "Bank-to-bank transfer", "Banks settle accounts with each other (core for RTGS)"],
        ["MT300", "FX trade confirmation", "Banks confirm FX deal terms"],
        ["MT320", "Instruction to settle securities", "Settlement of bond or share trades"],
    ]
    story.append(table_std(swift_msgs, [2.5*cm, 4*cm, 5.5*cm]))
    story.append(Spacer(1, 10))

    story.append(h3("SWIFT in Treasury Operations"))
    story.append(body(
        "Large corporates can connect directly to the SWIFT network through their banks. Treasury staff can initiate payments, confirm FX trades, and instruct securities settlements directly. "
        "Smaller firms send instructions to their bank, which translates them into SWIFT messages. "
        "SWIFT messages are standardized (same format worldwide), highly secure, and legally binding."
    ))
    story.append(bullet("Security: SWIFT uses encryption and digital signatures to prevent fraud"))
    story.append(bullet("Coverage: most banks worldwide are SWIFT members, including all major Zambian banks"))
    story.append(bullet("Audit trail: every message is timestamped and logged, essential for compliance and dispute resolution"))

    # ── SECTION 5: CLS Bank & FX Settlement ────────────────────
    story += section("FX SETTLEMENT", "CLS Bank: Eliminating Herstatt Risk")
    story.append(body(
        "CLS Bank International was created to solve the Herstatt problem. "
        "It's a central counterparty that stands in the middle of every FX trade settled through it, ensuring that both sides of the transaction settle simultaneously."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("How CLS Works"))
    story.append(bullet("Bilateral payment: Company A and Bank A agree to trade EUR for USD"))
    story.append(bullet("CLS receives the instruction: Both sides send settlement instructions to CLS"))
    story.append(bullet("Pre-funding: Both banks pre-fund CLS accounts in their local currencies"))
    story.append(bullet("Simultaneous settlement: CLS debits Bank A's EUR account and credits its USD account at the exact same moment"))
    story.append(bullet("Counterparty eliminated: CLS is the buyer to one side and the seller to the other, so neither bank faces the other's credit risk"))
    story.append(Spacer(1, 8))
    story.append(h3("Why This Matters"))
    story.append(body(
        "CLS eliminates the timing gap that made Herstatt possible. Because settlement is simultaneous in both currencies, "
        "neither party can fail after receiving one side of the trade without settling the other. "
        "This is called <b>Payment versus Payment (PvP)</b> — the exchange happens atomically. "
        "Today, nearly all major FX trades flow through CLS."
    ))
    story.append(Spacer(1, 8))
    story.append(callout(
        "<b>For treasury:</b> When you trade FX with CLS settlement, you eliminate Herstatt risk. Your bank will default to CLS settlement for most currency pairs. "
        "Insist on it — it's safer and has become the market standard.",
        "note"))

    # ── SECTION 6: Securities Settlement & DvP ────────────────
    story += section("SECURITIES", "Delivery versus Payment (DvP)")
    story.append(body(
        "When a company buys or sells securities (bonds, shares, T-bills), the same timing risk exists: one side settles (securities move) before the other (cash moves). "
        "Delivery versus Payment (DvP) is the securities equivalent of CLS's PvP."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Traditional Risk: Fails"))
    story.append(body(
        "A 'fail' occurs when one party delivers securities but the other fails to pay, or vice versa. "
        "For example, a company buys K10m of government bonds and the seller delivers them, but the seller's bank fails before paying. "
        "The buyer holds the bonds but never received the cash. DvP systems synchronise both transfers so this can't happen."
    ))
    story.append(Spacer(1, 8))
    story.append(h3("How DvP Works"))
    story.append(body(
        "A central securities depository (CSD) or central counterparty (CCP) sits between buyers and sellers. "
        "It uses the same simultaneous settlement principle as CLS: securities are transferred from seller to buyer's account in the depository, "
        "and cash is transferred from buyer to seller's bank in the settlement system — both at the exact same moment. "
        "If either side fails, neither transfer completes."
    ))
    story.append(Spacer(1, 8))
    story.append(callout(
        "<b>Clearing and settlement of securities:</b> Clearing involves matching and confirmation of the trade. Settlement (DvP) involves simultaneous transfer of cash and securities. "
        "This is why securities trades take 1–2 days to settle (T+1 or T+2) rather than instantly — settlement infrastructure takes time to process.",
        "info"))

    # ── SECTION 7: Zambia's Payment Systems ────────────────────
    story += section("LOCAL SYSTEMS", "Zambia's Electronic Payment Systems")
    story.append(body(
        "The Bank of Zambia oversees systemically important payment systems (SIPS) — systems whose failure could trigger wider economic problems. "
        "Three major systems handle payments in Zambia: ZIPSS (RTGS), EFT (deferred net), and CIC (cheque clearing)."
    ))
    story.append(Spacer(1, 8))
    story.append(h3("ZIPSS — Zambia's RTGS System"))
    story.append(body(
        "ZIPSS (Zambia Interbank Payment and Settlement System) is a real-time gross settlement system operated by the Bank of Zambia. "
        "It's used for high-value, time-critical payments: VAT remittances, securities trading, large interbank transfers."
    ))
    story.append(bullet("Processing: Transactions are settled continuously in real time; each transaction is final immediately"))
    story.append(bullet("Liquidity: Banks must pre-fund ZIPSS accounts; no overdrafts allowed"))
    story.append(bullet("Risk: Negligible settlement risk because pre-funding and real-time settlement eliminate counterparty exposure"))
    story.append(bullet("Monitoring: Banks can track their ZIPSS balance throughout the day"))
    story.append(bullet("No limits: ZIPSS accepts both small and large payments; there are no minimum or maximum transaction amounts"))
    story.append(Spacer(1, 8))

    story.append(h3("EFT — Electronic Funds Transfer (Deferred Net)"))
    story.append(body(
        "EFT is a deferred net settlement system for routine, lower-value payments. "
        "Common uses: wage and salary payments, utility bills, tax payments, loan disbursements. "
        "Transactions are batched daily and settled at the end of the day."
    ))
    story.append(bullet("Credit timing: Funds typically credit within the same day"))
    story.append(bullet("Amount limits: Higher than cheques but lower than ZIPSS"))
    story.append(bullet("Security: Payments are guaranteed by commercial banks; the system is safe and secure"))
    story.append(bullet("Coverage: Almost all commercial banks in Zambia participate"))
    story.append(Spacer(1, 8))

    story.append(h3("CIC — Cheque Image Clearing System"))
    story.append(body(
        "CIC is a cheque clearing system using cheque truncation (CTS). Instead of physically moving paper cheques between banks, "
        "cheques are scanned into digital images, which are cleared electronically. This is faster and lower-risk than handling physical paper."
    ))
    story.append(bullet("Settlement speed: T+1 (one clearing day) — vast improvement from the old T+3"))
    story.append(bullet("Risk reduction: No manual handling or physical transport of cheques; cheques can't be lost in transit"))
    story.append(bullet("Velocity: Faster cash flow for businesses, since cheques clear in one day instead of three"))
    story.append(bullet("Standardization: CTS has standardized the clearing period across Zambia"))
    story.append(Spacer(1, 12))

    story.append(callout(
        "<b>For Zambian treasury:</b> Choose ZIPSS for urgent, high-value payments (securities, VAT, urgent corporate payments). "
        "Use EFT for routine, lower-value payments (payroll, routine supplier payments). Cheques are still accepted but are slower and riskier; "
        "they're being phased out in favour of electronic payments.",
        "warn"))

    # ── SECTION 8: Central Counterparties ──────────────────────
    story += section("INFRASTRUCTURE", "Central Counterparties (CCPs)")
    story.append(body(
        "A central counterparty is an institution that stands between all buyers and sellers in a market. "
        "For every trade, the CCP becomes the buyer to the seller and the seller to the buyer. "
        "This mutualization of counterparty risk is what allows modern financial markets to function."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Examples of CCPs"))
    story.append(bullet("CLS Bank: FX settlement"))
    story.append(bullet("LCH Group: Derivatives clearing (interest rate swaps, currency swaps)"))
    story.append(bullet("National securities depositories: Securities settlement (DvP)"))
    story.append(Spacer(1, 6))

    story.append(h3("Why CCPs Reduce Risk"))
    story.append(body(
        "Instead of Company A worrying about Company B's creditworthiness (will they pay?), "
        "Company A only worries about the CCP's creditworthiness (which is usually the strongest party in the chain because it's regulated and well-capitalized). "
        "The CCP manages the risk through daily mark-to-market, daily margin collection, and default fund capital."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 9: Settlement Conventions ──────────────────────
    story += section("CONVENTIONS", "Settlement Timing: T+1, T+2, and When It Matters")
    story.append(body(
        "T+0 means same-day settlement. T+1 means settlement one business day after the trade. T+2 means two business days after. "
        "These are conventions — agreed standards across the market."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Why Not Settle Immediately (T+0)?"))
    story.append(body(
        "Clearing takes time. Trades must be validated, matched, confirmed. Documentation must be prepared. Settlement instructions must be routed through banks and payment systems. "
        "For most securities, T+2 (two business days) is the standard because that's how long these steps take. "
        "Zambia's cheque system uses T+1 because electronic clearing is faster than the old physical sorting."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("The Cost of a Fail"))
    story.append(body(
        "If a trade fails to settle on time (say, securities don't arrive when cash is due), both parties suffer. "
        "The buyer has cash but no securities; the seller has securities but no cash. "
        "Modern settlement systems impose penalties for fails — the failing party must pay interest or a fine. "
        "This incentivizes everyone to settle on time."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 10: Treasury Cut-Off Times ──────────────────────
    story += section("OPERATIONS", "Treasury Cut-Off Times and Daylight Overdrafts")
    story.append(body(
        "Each payment system has a cut-off time — after which transactions submitted that day won't settle until the next day. "
        "Treasury staff must understand these cut-offs to ensure payments settle when promised."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Why Cut-Offs Matter"))
    story.append(body(
        "If a company promises to pay a customer by 2 pm, it must submit the SWIFT payment instruction before the bank's cut-off time (often noon or 1 pm). "
        "Submitting after cut-off means the payment won't settle until the next day — the promise is broken. "
        "Missed cut-offs are a major source of disputes and relationship damage."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Daylight Overdrafts"))
    story.append(body(
        "A daylight overdraft occurs when a bank allows a customer's account to go negative during the day, with the expectation that the account will be funded before the end of the day. "
        "Example: A company has K5m in its account at 8 am. It receives invoices totalling K12m due by 4 pm. "
        "It makes all the payments using the bank's daylight facility (allowing a K7m overdraft), and by 5 pm it has received K15m in customer collections, "
        "bringing its account to K8m positive. The account was never in overdraft at the end of the day. "
        "Banks charge fees for daylight overdrafts because they carry intraday settlement risk."
    ))
    story.append(Spacer(1, 8))

    # ── CROSS-REFERENCE TO EARLIER STEPS ────────────────────────
    story += section("INTEGRATION", "How Settlement Connects to Earlier Steps")
    story.append(h3("Step 3.2 — FX Risk"))
    story.append(body(
        "FX forwards, money market hedges, and FX options are all settled through CLS or similar systems. "
        "Understanding settlement risk and PvP is essential to understanding why CLS exists and how to use it safely."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Step 4.2 — Investment Management"))
    story.append(body(
        "Treasury invests in T-bills, bonds, and other securities. All of these settle via DvP systems. "
        "Understanding settlement conventions (T+1, T+2) is essential to cash planning — your cash isn't actually available "
        "until settlement completes, not when you hit 'buy'."
    ))
    story.append(Spacer(1, 6))
    story.append(body(
        "When Step 4.4 (Treasury Systems) integrates all these steps, the TMS must track not just deals, "
        "but settlement status — which trades have cleared, which are awaiting settlement, which have failed."
    ))
    story.append(Spacer(1, 10))

    # ── DISCUSSION QUESTIONS ───────────────────────────────────
    questions = (
        "<b>Question 1:</b> A company uses RTGS for all payments above K5m and EFT for everything below. "
        "Why does this make sense? What risk is RTGS protecting against that EFT doesn't? "
        "<br/><br/>"
        "<b>Question 2:</b> A company buys government bonds at 4 pm with T+2 settlement. When should it expect the cash to leave its bank account? "
        "What could go wrong between trade and settlement?"
    )
    nudge = "Work through these scenarios using real Zambian banking. Post your reasoning in #tm-operations — these are live decisions treasury teams make."
    story.append(discussion_question_with_nudge(questions, nudge))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Clearing", "All steps in a payment transaction except final settlement"],
        ["Settlement", "Final transfer of funds; the point at which risk ends"],
        ["Settlement risk", "Risk that one party fails during clearing, before settlement completes"],
        ["Herstatt risk", "Settlement risk specific to FX; named after the 1974 Herstatt Bank failure"],
        ["Gross settlement (RTGS)", "Individual transactions settled one by one, immediately, in full"],
        ["Net settlement (DNS)", "Transactions offset against each other; only net difference settled"],
        ["SWIFT", "Global secure messaging network for bank-to-bank payment instructions"],
        ["MT103", "SWIFT message for customer credit transfer (payment instruction)"],
        ["MT202", "SWIFT message for bank-to-bank transfer"],
        ["CLS Bank", "Central counterparty for FX settlement; eliminates Herstatt risk"],
        ["Payment versus Payment (PvP)", "Simultaneous settlement of both sides of an FX trade"],
        ["Delivery versus Payment (DvP)", "Simultaneous settlement of securities and cash"],
        ["ZIPSS", "Zambia's real-time gross settlement system (high-value payments)"],
        ["EFT", "Zambia's electronic funds transfer system (routine, lower-value payments)"],
        ["Cheque Image Clearing (CIC)", "Zambia's cheque clearing system using digital truncation (T+1)"],
        ["T+1, T+2", "Settlement timing conventions (T+1 = one business day after trade)"],
        ["Fail", "Failure to settle a trade on time; incurs penalties and interest"],
        ["Cut-off time", "Latest time to submit payment instructions for same-day settlement"],
        ["Daylight overdraft", "Negative account balance during the day, expected to be positive by end of day"],
        ["Central counterparty (CCP)", "Institution that sits between all buyers and sellers, mutualized risk"],
    ]
    story.append(table_std(terms, [5.5*cm, CONTENT_W - 5.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Distinguish between clearing and settlement and explain why the distinction matters for risk management",
        "Identify settlement risk (Herstatt risk) in FX transactions and explain how CLS eliminates it",
        "Distinguish between gross settlement (RTGS) and net settlement (DNS), and identify which is appropriate for a given transaction",
        "Explain how SWIFT enables bank-to-bank and customer-to-bank payments; name and describe key SWIFT message types",
        "Describe how CLS Bank and Payment versus Payment (PvP) eliminate FX settlement risk",
        "Explain how Delivery versus Payment (DvP) works in securities settlement and why it prevents settlement fails",
        "Identify the three major Zambian payment systems (ZIPSS, EFT, CIC) and describe their use cases, settlement timing, and risk profiles",
        "Explain the role of cut-off times and daylight overdrafts in treasury operations and cash management",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 4.4 — Treasury Management Systems",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
