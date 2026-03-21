"""
Booklesss Lead Magnet v5 — Treasury Management
"3 Questions Your TM Exam Will Ask (And How to Answer Them)"
Style: Deep navy cover, white body, emerald accent, Georgia + Trebuchet.
Tracking: tm WhatsApp group
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
import os

# ─────────────────────────────────────────────
#  FONTS
# ─────────────────────────────────────────────
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Georgia",        F + r"\georgia.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold",   F + r"\georgiab.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Italic", F + r"\georgiai.ttf"))
pdfmetrics.registerFontFamily("Georgia", normal="Georgia", bold="Georgia-Bold", italic="Georgia-Italic")

pdfmetrics.registerFont(TTFont("Trebuchet",        F + r"\trebuc.ttf"))
pdfmetrics.registerFont(TTFont("Trebuchet-Bold",   F + r"\trebucbd.ttf"))
pdfmetrics.registerFont(TTFont("Trebuchet-Italic", F + r"\trebucit.ttf"))
pdfmetrics.registerFontFamily("Trebuchet", normal="Trebuchet", bold="Trebuchet-Bold", italic="Trebuchet-Italic")

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
BG_NOTE     = colors.HexColor("#ECFDF5")
C_NOTE_TXT  = colors.HexColor("#065F46")
BG_EXAMPLE  = colors.HexColor("#F9FAFB")

SLACK_LINK   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"
TRACKING     = "https://bit.ly/booklesss-tm"
DEADLINE     = "April 18, 2026"
RATE         = "K550/month"

W, H        = A4
MX          = 2.2 * cm
MY          = 2.0 * cm
FOOTER_H    = 28
HEADER_H    = 28
CONTENT_W   = W - 2 * MX

OUT_PATH = r"C:\Users\deeky\OneDrive\Desktop\Booklesss\marketing\lead-magnets\3 Questions Your TM Exam Will Ask - Booklesss.pdf"

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def make_styles():
    return {
        # Cover
        "cover_tag": ParagraphStyle("cover_tag",
            fontName="Trebuchet-Bold", fontSize=7.5, textColor=C_GREEN,
            leading=11, spaceAfter=14, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Georgia-Bold", fontSize=28, textColor=C_WHITE,
            leading=34, spaceAfter=14, alignment=TA_LEFT),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Trebuchet", fontSize=10.5, textColor=C_MIST,
            leading=17, spaceAfter=18, alignment=TA_LEFT),
        "cover_deadline": ParagraphStyle("cover_deadline",
            fontName="Trebuchet-Bold", fontSize=8.5, textColor=C_GREEN,
            leading=13, alignment=TA_LEFT),

        # Body
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Trebuchet-Bold", fontSize=7, textColor=C_AMBER,
            leading=10, spaceAfter=3, spaceBefore=20, alignment=TA_LEFT),
        "h2": ParagraphStyle("h2",
            fontName="Georgia-Bold", fontSize=16, textColor=C_INK,
            leading=20, spaceAfter=8, alignment=TA_LEFT),
        "h3": ParagraphStyle("h3",
            fontName="Trebuchet-Bold", fontSize=11, textColor=C_STEEL,
            leading=15, spaceAfter=5, spaceBefore=10, alignment=TA_LEFT),
        "body": ParagraphStyle("body",
            fontName="Trebuchet", fontSize=10, textColor=C_INK,
            leading=17, spaceAfter=6, alignment=TA_LEFT),
        "bullet": ParagraphStyle("bullet",
            fontName="Trebuchet", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, leftIndent=14, alignment=TA_LEFT),

        # Callouts
        "warn_text": ParagraphStyle("warn_text",
            fontName="Trebuchet", fontSize=9.5, textColor=C_WARN_TXT,
            leading=15, alignment=TA_LEFT),
        "note_text": ParagraphStyle("note_text",
            fontName="Trebuchet", fontSize=9.5, textColor=C_NOTE_TXT,
            leading=15, alignment=TA_LEFT),
        "example_label": ParagraphStyle("example_label",
            fontName="Trebuchet-Bold", fontSize=8, textColor=C_AMBER,
            leading=11, spaceAfter=4, alignment=TA_LEFT),
        "example_body": ParagraphStyle("example_body",
            fontName="Trebuchet", fontSize=9.5, textColor=C_INK,
            leading=15, alignment=TA_LEFT),

        # Table cells
        "th": ParagraphStyle("th",
            fontName="Trebuchet-Bold", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "td": ParagraphStyle("td",
            fontName="Trebuchet", fontSize=9, textColor=C_INK,
            leading=13, alignment=TA_LEFT),
        "td_green": ParagraphStyle("td_green",
            fontName="Trebuchet-Bold", fontSize=9, textColor=C_GREEN_DK,
            leading=13, alignment=TA_LEFT),

        # CTA page
        "cta_eyebrow": ParagraphStyle("cta_eyebrow",
            fontName="Trebuchet-Bold", fontSize=8, textColor=C_GREEN,
            leading=12, spaceAfter=10, alignment=TA_LEFT),
        "cta_title": ParagraphStyle("cta_title",
            fontName="Georgia-Bold", fontSize=24, textColor=C_WHITE,
            leading=30, spaceAfter=14, alignment=TA_LEFT),
        "cta_body": ParagraphStyle("cta_body",
            fontName="Trebuchet", fontSize=10.5, textColor=C_MIST,
            leading=17, spaceAfter=6, alignment=TA_LEFT),
        "cta_bullet": ParagraphStyle("cta_bullet",
            fontName="Trebuchet", fontSize=10.5, textColor=C_WHITE,
            leading=17, spaceAfter=5, leftIndent=14, alignment=TA_LEFT),
        "cta_offer_label": ParagraphStyle("cta_offer_label",
            fontName="Trebuchet-Bold", fontSize=7.5, textColor=C_GREEN,
            leading=11, spaceAfter=5, alignment=TA_LEFT),
        "cta_offer_rate": ParagraphStyle("cta_offer_rate",
            fontName="Georgia-Bold", fontSize=22, textColor=C_WHITE,
            leading=26, spaceAfter=4, alignment=TA_LEFT),
        "cta_offer_sub": ParagraphStyle("cta_offer_sub",
            fontName="Trebuchet", fontSize=9, textColor=C_MIST,
            leading=14, spaceAfter=0, alignment=TA_LEFT),
        "cta_link": ParagraphStyle("cta_link",
            fontName="Trebuchet-Bold", fontSize=9, textColor=C_GREEN,
            leading=14, alignment=TA_LEFT),

        # Nudge box
        "nudge_text": ParagraphStyle("nudge_text",
            fontName="Trebuchet", fontSize=9.5, textColor=C_WARN_TXT,
            leading=15, alignment=TA_LEFT),
        "nudge_bold": ParagraphStyle("nudge_bold",
            fontName="Trebuchet-Bold", fontSize=9.5, textColor=C_WARN_TXT,
            leading=15, alignment=TA_LEFT),
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
    canvas.setFont("Georgia-Bold", 130)
    canvas.setFillColor(colors.HexColor("#0F2847"))
    canvas.drawRightString(W - MX, MY + 30, "TM")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Trebuchet", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "3 Questions Your TM Exam Will Ask")
    canvas.drawRightString(W - MX, H - MY + 7, "Booklesss — Free Guide")
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(W / 2, MY - 14, "BBF4302 Treasury Management")
    canvas.drawRightString(W - MX, MY - 14, f"Page {doc.page}")
    canvas.restoreState()

def cta_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_DARK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setStrokeColor(C_GRID)
    canvas.setLineWidth(0.5)
    for i in range(1, 6):
        canvas.line(0, H * i / 6, W, H * i / 6)
    canvas.setFillColor(C_GREEN)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.restoreState()

# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────
def hairline():
    return HRFlowable(width="100%", thickness=0.5, color=C_AMBER, spaceAfter=10, spaceBefore=2)

def section(eyebrow_text, heading_text):
    return [
        Spacer(1, 6),
        Paragraph(eyebrow_text.upper(), ST["eyebrow"]),
        Paragraph(heading_text, ST["h2"]),
        hairline(),
    ]

def body(text):
    return Paragraph(text, ST["body"])

def bullet(text):
    return Paragraph(f"  {text}", ST["bullet"])

def callout_warn(text):
    p = Paragraph(text, ST["warn_text"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_WARN),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_AMBER),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, C_AMBER),
        ('TOPPADDING',    (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 8)])

def callout_note(text):
    p = Paragraph(text, ST["note_text"])
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_NOTE),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_GREEN),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, C_GREEN),
        ('TOPPADDING',    (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 8)])

def example_box(label, content_rows):
    label_p = Paragraph(label, ST["example_label"])
    content_p = Paragraph(content_rows, ST["example_body"])
    t = Table([[label_p], [content_p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_EXAMPLE),
        ('LINEBEFORE',    (0,0), (-1,-1), 3, C_AMBER),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 10)])

def table_std(data, col_widths):
    rows = []
    for i, row in enumerate(data):
        styled = []
        for j, cell in enumerate(row):
            if i == 0:
                styled.append(Paragraph(str(cell), ST["th"]))
            elif j == len(row) - 1 and i == len(data) - 1:
                styled.append(Paragraph(str(cell), ST["td_green"]))
            else:
                styled.append(Paragraph(str(cell), ST["td"]))
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
        ('BACKGROUND',    (0,-1),(-1,-1), BG_NOTE),
    ]))
    return t

def nudge_box():
    lines = [
        Paragraph("These 3 concepts are from Step 1.1 of the full Treasury Management course.", ST["nudge_text"]),
        Spacer(1, 4),
        Paragraph(f"Inside Booklesss: all 10 steps, worked examples, past paper breakdowns, and a study community. Founding rate closes <b>{DEADLINE}</b>.", ST["nudge_text"]),
    ]
    t = Table([lines], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_WARN),
        ('LINEBEFORE',    (0,0), (-1,-1), 3,   C_AMBER),
        ('LINEABOVE',     (0,0), (-1, 0), 0.5, C_AMBER),
        ('LINEBELOW',     (0,0), (-1,-1), 0.5, C_AMBER),
        ('TOPPADDING',    (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING',   (0,0), (-1,-1), 14),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
        ('VALIGN',        (0,0), (-1,-1), 'TOP'),
    ]))
    return KeepTogether([Spacer(1, 16), t])

# ─────────────────────────────────────────────
#  DOCUMENT BUILD
# ─────────────────────────────────────────────
def build():
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4,
                          leftMargin=MX, rightMargin=MX,
                          topMargin=MY + HEADER_H, bottomMargin=MY + FOOTER_H)

    cover_frame = Frame(0, 0, W, H,
                        leftPadding=MX + 10, rightPadding=MX,
                        topPadding=H * 0.25, bottomPadding=MY + 50)
    body_frame  = Frame(MX, MY + FOOTER_H, CONTENT_W,
                        H - MY*2 - HEADER_H - FOOTER_H,
                        leftPadding=0, rightPadding=0,
                        topPadding=0, bottomPadding=0)
    cta_frame   = Frame(0, 0, W, H,
                        leftPadding=MX + 10, rightPadding=MX,
                        topPadding=H * 0.18, bottomPadding=MY + 50)

    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_bg),
        PageTemplate(id="Body",  frames=[body_frame],  onPage=body_page),
        PageTemplate(id="CTA",   frames=[cta_frame],   onPage=cta_bg),
    ])

    story = []

    # ── COVER ──────────────────────────────────────────────────
    story.append(Paragraph("BBF4302 TREASURY MANAGEMENT  —  FREE GUIDE", ST["cover_tag"]))
    story.append(Paragraph("3 Questions Your\nTM Exam Will Ask\n(And How to\nAnswer Them)", ST["cover_title"]))
    story.append(Paragraph(
        "Real concepts. Worked examples. Written by students who passed.",
        ST["cover_sub"]))
    story.append(Paragraph(
        f"Founding member rate: {RATE} — closes {DEADLINE}",
        ST["cover_deadline"]))

    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── CONCEPT 1: Cost Centre vs Profit Centre ─────────────────
    story += section("CONCEPT 01", "Is the Treasury a Cost Centre or a Profit Centre?")
    story.append(body(
        "This question shows up in multiple formats — define it, compare it, give advantages "
        "and disadvantages. Know both sides cold."
    ))
    story.append(Spacer(1, 6))

    comp_data = [
        ["", "Cost Centre", "Profit Centre"],
        ["What it is", "Treasury as support — manages costs, not revenue", "Treasury generates income through trading, hedging, or internal pricing"],
        ["Main advantage", "Simpler to manage. Clear accountability on costs", "Business units pay market rates — cost transparency improves"],
        ["Main risk", "Management focuses on cost, not value delivered", "Temptation to speculate with company funds"],
        ["Used by", "Most organisations", "MNCs, banks, firms with heavy FX or commodity exposure"],
    ]
    story.append(table_std(comp_data, [3.2*cm, (CONTENT_W-3.2*cm)/2, (CONTENT_W-3.2*cm)/2]))
    story.append(Spacer(1, 10))
    story.append(callout_warn(
        "Barings Bank (1995) — Nick Leeson ran a treasury-style profit centre with no "
        "segregation of duties. He hid losses in a secret account until they exceeded "
        "the bank's entire capital. The bank collapsed. This is the exam case for why "
        "controls matter in a profit centre model."
    ))

    # ── CONCEPT 2: Cash Conversion Cycle ───────────────────────
    story += section("CONCEPT 02", "The Cash Conversion Cycle — and How to Calculate It")
    story.append(body(
        "The Cash Conversion Cycle (CCC) tells you how long a business's cash is tied up "
        "in operations before it comes back in. Shorter is better — it means cash moves faster."
    ))
    story.append(Spacer(1, 4))

    formula_data = [
        ["Component", "Formula", "What it measures"],
        ["Receivable Days (RD)", "Trade Receivables / Revenue x 365", "Days to collect from customers"],
        ["Inventory Days (ID)", "Inventory / Cost of Sales x 365", "Days stock sits before being sold"],
        ["Payable Days (PD)", "Trade Payables / Cost of Sales x 365", "Days taken to pay suppliers"],
        ["CCC", "RD + ID - PD", "Net days cash is tied up in working capital"],
    ]
    story.append(table_std(formula_data, [3.8*cm, 6*cm, CONTENT_W - 9.8*cm]))
    story.append(Spacer(1, 10))

    story.append(example_box(
        "WORKED EXAMPLE — ZANACO PLC (ZMW)",
        "Zanaco reports: Trade Receivables K4.2m, Revenue K28m, Inventory K3.6m, "
        "Cost of Sales K19m, Trade Payables K2.9m.<br/><br/>"
        "<b>Receivable Days:</b> (4,200,000 / 28,000,000) x 365 = <b>54.8 days</b><br/>"
        "<b>Inventory Days:</b> (3,600,000 / 19,000,000) x 365 = <b>69.2 days</b><br/>"
        "<b>Payable Days:</b> (2,900,000 / 19,000,000) x 365 = <b>55.7 days</b><br/><br/>"
        "<b>CCC = 54.8 + 69.2 - 55.7 = 68.3 days</b><br/><br/>"
        "Cash is tied up for 68 days on average. Zanaco should look at collecting faster, "
        "turning inventory quicker, or negotiating longer payment terms with suppliers."
    ))
    story.append(callout_note(
        "A negative CCC is possible — and desirable. It means you collect from customers "
        "before you pay suppliers. Supermarkets often achieve this."
    ))

    # ── CONCEPT 3: Treasury Controls ───────────────────────────
    story += section("CONCEPT 03", "Treasury Controls — The 6 You Must Know")
    story.append(body(
        "Treasury handles large sums daily. Controls exist to prevent fraud, errors, and "
        "the kind of catastrophic losses that brought down Barings Bank. Examiners test "
        "these by name — learn all six."
    ))
    story.append(Spacer(1, 6))

    controls_data = [
        ["Control", "What it does"],
        ["1. Segregation of Duties", "Front office (trading) separated from back office (confirmation). No one person can initiate and approve their own transactions."],
        ["2. Delegation of Authority", "Decision-making sits at the right level. Senior sign-off required for high-risk transactions."],
        ["3. Transaction Limits", "Caps on transaction type, size, or instrument. Prevents investment in high-risk instruments."],
        ["4. Approvals", "Senior manager approves all trades. Separate person reconciles and accounts for them."],
        ["5. Internal Audits", "Scheduled reviews match actual transactions against company policy."],
        ["6. Automation / STP", "Straight-Through Processing removes manual steps — reduces errors and fraud opportunities."],
    ]
    story.append(table_std(controls_data, [5.5*cm, CONTENT_W - 5.5*cm]))
    story.append(Spacer(1, 10))

    # ── NUDGE BOX ───────────────────────────────────────────────
    story.append(nudge_box())

    # ── CTA PAGE ────────────────────────────────────────────────
    story.append(NextPageTemplate("CTA"))
    story.append(PageBreak())

    story.append(Paragraph("JOIN BOOKLESSS", ST["cta_eyebrow"]))
    story.append(Paragraph("Get the full\nTreasury Management\ncourse.", ST["cta_title"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph("What's inside:", ParagraphStyle("what_inside",
        fontName="Trebuchet-Bold", fontSize=8, textColor=C_GREEN,
        leading=12, spaceAfter=8, alignment=TA_LEFT)))

    what_inside = [
        "All 10 Treasury Management steps — notes, examples, past paper breakdowns",
        "Working Capital, Risk Management, FX, Debt, Investment — full coverage",
        "Worked ZMW examples for every calculation topic",
        "Study community in Slack — ask questions, get answers",
        "Corporate Finance and Strategic Management courses coming soon",
    ]
    for item in what_inside:
        story.append(Paragraph(f"  + {item}", ST["cta_bullet"]))

    story.append(Spacer(1, 18))

    # Offer box
    offer_inner = [
        [Paragraph("FOUNDING MEMBER RATE", ST["cta_offer_label"])],
        [Paragraph(RATE, ST["cta_offer_rate"])],
        [Paragraph(f"Offer closes {DEADLINE}. Standard rate K800/month after.", ST["cta_offer_sub"])],
    ]
    offer_t = Table(offer_inner, colWidths=[CONTENT_W - 1*cm])
    offer_t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), colors.HexColor("#0A2040")),
        ('LINEBEFORE',    (0,0), (-1,-1), 3, C_GREEN),
        ('TOPPADDING',    (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING',   (0,0), (-1,-1), 16),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
    ]))
    story.append(offer_t)
    story.append(Spacer(1, 16))

    story.append(Paragraph(
        f'<link href="{SLACK_LINK}"><u>Join Booklesss — founding member rate</u></link>',
        ST["cta_link"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        f'<link href="{TRACKING}"><u>Or scan here: booklesss-tm</u></link>',
        ParagraphStyle("tracking", fontName="Trebuchet", fontSize=8,
                       textColor=C_MIST, leading=12, alignment=TA_LEFT)))

    doc.build(story)
    print(f"PDF saved to:\n  {OUT_PATH}")

if __name__ == "__main__":
    build()
