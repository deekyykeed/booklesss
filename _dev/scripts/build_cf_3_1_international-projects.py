"""
Booklesss Lesson PDF — Step 3.1: International Project Appraisal
Course: BAC4301 Corporate Finance
Style: Deep navy-purple cover, white body, crimson accent, DejaVuSerif display, LiberationSans body.
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
#  COLOURS — CF PALETTE (crimson/navy-purple)
# ─────────────────────────────────────────────
C_DARK      = colors.HexColor("#1A1A2E")
C_CRIMSON   = colors.HexColor("#E94560")
C_CRIMSON_DK= colors.HexColor("#9B2335")
C_GHOST     = colors.HexColor("#251F35")
C_INK       = colors.HexColor("#111827")
C_STEEL     = colors.HexColor("#6B7280")
C_MIST      = colors.HexColor("#9CA3AF")
C_RULE      = colors.HexColor("#E5E7EB")
C_WHITE     = colors.white

BG_DISCUSS  = colors.HexColor("#FFF5F5")
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

CHANNEL_NAME = "cf-investment"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

CF_BASE = "/sessions/brave-funny-mayer/mnt/Booklesss/courses/Corporate Finance/BAC4301 - Corporate Finance"
OUT_DIR  = os.path.join(CF_BASE, "content", "lesson-03-international-projects")
OUT_PATH = os.path.join(OUT_DIR, "Step 3.1 - International Project Appraisal.pdf")

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
            fontName="Body-Bold", fontSize=10, textColor=C_CRIMSON_DK,
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
            fontName="Body-Bold", fontSize=9.5, textColor=C_CRIMSON_DK,
            leading=15, alignment=TA_LEFT),
        "discuss_q": ParagraphStyle("discuss_q",
            fontName="Body-Italic", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, alignment=TA_LEFT),
        "community_nudge": ParagraphStyle("community_nudge",
            fontName="Body-Italic", fontSize=8.5, textColor=C_CRIMSON_DK,
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
    canvas.setFillColor(C_CRIMSON)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.setFont("Georgia-Bold", 140)
    canvas.setFillColor(C_GHOST)
    canvas.drawRightString(W - MX, MY + 40, "3.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_CRIMSON)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "3.1 — International Project Appraisal")
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
    q = Paragraph(questions_text, ST["discuss_q"])
    nudge = Paragraph(nudge_text, ST["community_nudge"])
    t = Table([[q], [nudge]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), BG_DISCUSS),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_CRIMSON),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])

def community_closer():
    elements = [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "This is one step in the Corporate Finance series running in the Booklesss study group on Slack. "
            "The channel for this topic is <b>#cf-investment</b> — that's where students going through "
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
        ('BACKGROUND',    (0,0), (-1,-1), colors.HexColor("#F5F0E8")),
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
    return KeepTogether([Spacer(1, 8), t, Spacer(1, 10)])

# ─────────────────────────────────────────────
#  DOCUMENT BUILD
# ─────────────────────────────────────────────
def build():
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = BaseDocTemplate(OUT_PATH, pagesize=A4, topMargin=MY, bottomMargin=MY, leftMargin=MX, rightMargin=MX)

    cover_template = PageTemplate(
        id="cover",
        frames=[Frame(MX, MY, CONTENT_W, H - 2*MY)],
        onPageEnd=cover_bg,
        pagesize=A4
    )

    body_template = PageTemplate(
        id="body",
        frames=[Frame(MX, MY, CONTENT_W, H - 2*MY)],
        onPageEnd=body_page,
        pagesize=A4
    )

    doc.addPageTemplates([cover_template, body_template])

    story = []

    # ── COVER PAGE ──────────────────────────────────────────────
    story.append(Spacer(1, 60))
    story.append(Paragraph("International Project Appraisal", ST["cover_title"]))
    story.append(Paragraph("Cross-border Investment & FX Risk", ST["cover_sub"]))
    story.append(Spacer(1, 300))
    story.append(Paragraph("STEP 3.1", ST["cover_eyebrow"]))
    story.append(Paragraph("Corporate Finance (BAC4301)", ST["cover_sub"]))
    story.append(PageBreak())
    doc.pageTemplates[0].id = "body"

    # ── SECTION 1: Why International is Different ────────────────
    story += section("CONTEXT", "Why International Appraisal is Different")
    story.append(body(
        "Steps 1.1 and 2.1 assumed a domestic project — all cash flows in Zambian Kwacha, all risks and taxes in Zambia. "
        "But a Zambian firm investing in a South African factory faces new layers of complexity: "
        "cash flows are in South African Rand, tax rates differ, the firm must convert profits back to ZMW (and the exchange rate moves), "
        "the government might restrict fund repatriation, and political risk is higher."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Key Differences"))
    story.append(bullet("<b>Foreign currency cash flows:</b> Profits are earned in the host country's currency and must eventually be converted to home currency."))
    story.append(bullet("<b>Exchange rate uncertainty:</b> Future spot rates are unknown. The ZAR/ZMW rate might move 5%, 20%, or more over a project's life."))
    story.append(bullet("<b>Different tax systems:</b> Corporate tax rates, deductibility rules, and timing of tax payments vary by country. Some countries tax only domestic income; others tax worldwide."))
    story.append(bullet("<b>Repatriation restrictions:</b> Some host countries restrict how much profit can be sent home or require local reinvestment."))
    story.append(bullet("<b>Political risk:</b> Expropriation, currency controls, war, civil unrest — rare but catastrophic. Domestic projects rarely face this."))
    story.append(Spacer(1, 10))

    # ── SECTION 2: Two Appraisal Methods ────────────────────────
    story += section("METHODS", "Two Approaches to International Valuation")
    story.append(h3("Method 1: Foreign Currency Approach"))
    story.append(body(
        "Forecast all cash flows in the host country's currency, discount at the foreign discount rate, convert the NPV to home currency at today's spot rate."
    ))
    story.append(formula_box([
        "Step 1: Calculate NPV in foreign currency (ZAR) using foreign discount rate (r_ZA)",
        "Step 2: Convert NPV to home currency (ZMW) at spot rate today",
        "NPV(ZMW) = NPV(ZAR) × Spot Rate (ZMW/ZAR)",
    ]))
    story.append(body(
        "This is mechanically clean but requires a trustworthy forecast of the foreign discount rate. "
        "It's also sensitive to today's exchange rate — if ZMW weakens, the NPV in ZMW automatically shrinks."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Method 2: Home Currency Approach"))
    story.append(body(
        "Convert each year's foreign currency cash flow to home currency at the expected future spot rate, "
        "then discount at the home discount rate."
    ))
    story.append(formula_box([
        "Step 1: Forecast cash flows in foreign currency",
        "Step 2: Convert each year's CF to home currency at expected forward/spot rate",
        "Step 3: Discount converted CFs at home discount rate (ZMW cost of capital)",
        "",
        "NPV(ZMW) = Σ [FCF(ZAR) × Expected Spot(t)] / (1 + r_home)^t",
    ]))
    story.append(body(
        "This method requires forecasting future exchange rates and is more intuitive to most managers. "
        "Both methods should give the same NPV if market prices are unbiased (i.e., forward rates predict future spots fairly)."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 3: Purchasing Power Parity (PPP) ────────────────
    story += section("FORECASTING", "Predicting Exchange Rates")
    story.append(h3("Purchasing Power Parity (PPP)"))
    story.append(body(
        "PPP says that, in the long run, exchange rates adjust to equalize the purchasing power of currencies. "
        "If Zambian inflation is 7% and South African inflation is 4%, the ZAR should appreciate against the ZMW by roughly 3% per year."
    ))
    story.append(formula_box([
        "Expected Spot Rate(Year t) = Spot Rate Today × [(1 + Inflation Home) / (1 + Inflation Foreign)]^t",
        "",
        "Example: Spot rate today is ZMW 0.1 per ZAR (or ZAR 10 per ZMW).",
        "Zambian inflation = 7%, SA inflation = 4%",
        "Expected rate in Year 1 = 0.1 × (1.07 / 1.04) = 0.1029 ZMW/ZAR",
    ]))
    story.append(body(
        "PPP is useful for long-term forecasts but is imperfect. In the short term, exchange rates are driven by capital flows, interest rate differentials, "
        "and sentiment — not just inflation differences. Still, PPP provides a reasonable anchor for multi-year projections."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Interest Rate Parity (IRP)"))
    story.append(body(
        "IRP links interest rate differentials to forward exchange rates. If ZMW interest rates are 8% and ZAR rates are 5%, "
        "the ZAR should trade at a forward premium (you'll pay more ZMW for a ZAR in the future)."
    ))
    story.append(formula_box([
        "Forward Rate / Spot Rate ≈ (1 + r_home) / (1 + r_foreign)",
        "",
        "If spot = ZMW 0.1 per ZAR, r_ZMW = 8%, r_ZAR = 5%:",
        "Forward = 0.1 × (1.08 / 1.05) = 0.1029 ZMW/ZAR",
    ]))
    story.append(body(
        "IRP is more reliable than PPP over short horizons because interest rates are observable and forward rates are traded. "
        "For project appraisal, use IRP for Years 1–3 and PPP thereafter."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 4: Adjusting the Discount Rate ────────────────
    story += section("RISK", "Country Risk & Adjusting the Discount Rate")
    story.append(body(
        "A South African project is riskier than a domestic Zambian one. The discount rate must reflect this added risk. "
        "Two approaches: (1) Political risk premium, or (2) Sovereign spread."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Political Risk Premium"))
    story.append(body(
        "Add a premium to the base discount rate to account for non-market risk (political instability, currency controls, expropriation). "
        "This premium might be 1–5% depending on the host country's creditworthiness and track record."
    ))
    story.append(formula_box([
        "Adjusted Discount Rate = Base r_home + Political Risk Premium",
        "",
        "Example: Base ZMW cost of capital is 10%. SA political risk premium is 2%.",
        "Adjusted rate = 10% + 2% = 12% for the South African project.",
    ]))
    story.append(Spacer(1, 8))

    story.append(h3("Sovereign Spread"))
    story.append(body(
        "Alternative: use the host country's sovereign risk premium (the spread between its government bond yields and a risk-free rate like US Treasuries). "
        "If South Africa's 10-year bond yields 6% and the US 10-year yields 4%, the sovereign spread is 2%. "
        "Add this to your base discount rate when evaluating projects in South Africa."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 5: Worked Example ────────────────────────────────
    story += section("PRACTICE", "Worked Example: Zambian Firm, South African Project")
    story.append(body(
        "ZamCorp is evaluating a manufacturing plant in South Africa. Initial outlay ZAR 50 million. "
        "Spot rate today: ZMW 0.1 per ZAR. Cost of capital in ZMW: 10%. SA political risk premium: 2% (so discount rate = 12% for SA project). "
        "ZMW inflation: 7%, SA inflation: 4%. Project life: 5 years. Terminal value in Year 5: ZAR 40 million."
    ))
    story.append(Spacer(1, 6))

    story.append(h3("Step 1: Forecast ZAR Cash Flows (as if domestic)"))
    cf_sar = [
        ["Year", "FCF (ZAR millions)"],
        ["1", "8"],
        ["2", "10"],
        ["3", "12"],
        ["4", "14"],
        ["5 (FCF + TV)", "16 + 40 = 56"],
    ]
    story.append(table_std(cf_sar, [2*cm, 3.5*cm]))
    story.append(Spacer(1, 8))

    story.append(h3("Step 2: Forecast Spot Rates (PPP)"))
    story.append(body("Spot today = 0.1 ZMW/ZAR. ZMW inflation 7%, SA inflation 4%:"))
    spot_rates = [
        ["Year", "ZMW/ZAR Spot", "Calculation"],
        ["0", "0.1000", "—"],
        ["1", "0.1029", "0.1 × 1.07/1.04"],
        ["2", "0.1059", "0.1 × (1.07/1.04)²"],
        ["3", "0.1090", "0.1 × (1.07/1.04)³"],
        ["4", "0.1122", "0.1 × (1.07/1.04)⁴"],
        ["5", "0.1155", "0.1 × (1.07/1.04)⁵"],
    ]
    story.append(table_std(spot_rates, [1.8*cm, 2.2*cm, 3.5*cm]))
    story.append(Spacer(1, 8))

    story.append(h3("Step 3: Convert to ZMW and Discount (r = 12%)"))
    conv_npv = [
        ["Year", "ZAR CF", "Spot", "ZMW CF", "DF (12%)", "PV (ZMW)"],
        ["0", "−50", "0.1000", "−5.0", "1.000", "−5.0"],
        ["1", "8", "0.1029", "0.823", "0.893", "0.735"],
        ["2", "10", "0.1059", "1.059", "0.797", "0.844"],
        ["3", "12", "0.1090", "1.308", "0.712", "0.931"],
        ["4", "14", "0.1122", "1.571", "0.636", "0.999"],
        ["5", "56", "0.1155", "6.468", "0.567", "3.667"],
        ["", "", "", "", "<b>NPV (ZMW)</b>", "<b>1.176</b>"],
    ]
    story.append(table_std(conv_npv, [1.5*cm, 1.5*cm, 1.5*cm, 1.5*cm, 1.5*cm, 1.8*cm]))
    story.append(Spacer(1, 8))

    story.append(body(
        "NPV = ZMW 1.176 million. Positive, so the South African project should be accepted. "
        "But note: the ZMW is expected to weaken against the ZAR. In Year 5, the same ZAR 56 million is worth ZMW 6.468 million "
        "(versus ZMW 5.6 million at today's spot), so the real purchasing power is eroded, but the nominal ZMW value is higher."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 6: Special Issues ───────────────────────────────
    story += section("REALISM", "Special Issues in International Projects")
    story.append(h3("Blocked Funds"))
    story.append(body(
        "Some host countries restrict profit repatriation (e.g., only 30% of profits can leave per year). "
        "If cash is stuck, it must be reinvested in the host country. This lowers the project's value to the parent firm. "
        "In appraisal, use APV to subtract the cost of being locked-in, or simply discount blocked cash at a lower rate (if reinvestment is suboptimal)."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Transfer Pricing"))
    story.append(body(
        "Intra-group transactions (e.g., the parent sells equipment to the subsidiary, or charges management fees) distort project cash flows. "
        "Transfer prices must follow OECD guidelines (arm's-length pricing). Use market prices for fair valuation."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Withholding Taxes"))
    story.append(body(
        "Many countries impose withholding tax on dividend repatriation (e.g., 15% tax on dividends sent home). "
        "This is a real cash outflow. Reduce projected dividend by the withholding rate, or treat it as a financing side effect in APV."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Political Risk Mitigation"))
    story.append(body(
        "For high-risk countries, firms use political risk insurance (MIGA — Multilateral Investment Guarantee Agency), "
        "parent company guarantees, or partnership with local firms to share risk. These cost money but protect against expropriation and currency inconvertibility."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 7: Cross-References ────────────────────────────
    story += section("CONNECTIONS", "Linking Back & Forward")
    story.append(body(
        "<b>Step 1.1</b> introduced NPV and the core valuation framework. Step 3.1 extends it to foreign projects with currency, tax, and political complexity."
    ))
    story.append(body(
        "<b>Step 9.1 (Currency Risk Management)</b> will cover hedging strategies in detail — forward contracts, options, money market hedges, and natural hedges. "
        "International project appraisal and currency risk management are flip sides of the same coin: appraisal tells you whether a foreign investment is worth the exposure; hedging tells you how to manage that exposure once you've committed."
    ))
    story.append(Spacer(1, 12))

    # ── DISCUSSION & CLOSING ────────────────────────────────────
    story.append(PageBreak())

    story.append(discussion_question_with_nudge(
        "<i>1. A Zambian company can invest ZMW 10 million in (a) a domestic factory (ZMW-denominated FCF, no FX risk), or (b) a Tanzanian textile mill (TZS-denominated FCF). "
        "Domestic NPV = ZMW 2 million. Foreign NPV = ZMW 1.8 million (after converting TZS to ZMW at expected future rates). "
        "Which project should be chosen? Is NPV the only consideration?</i><br/><br/>"
        "<i>2. A firm is appraising a South African project with cash flows of ZAR 10 million per year for 10 years. "
        "Spot rate is ZMW 0.1 per ZAR. If ZMW inflation is 8% and SA inflation is 3%, forecast the spot rate in Year 5 using PPP. "
        "Discount rate is 12%. What is the ZMW value of the Year 5 cash flow?</i>",
        "Bring your answers to <b>#cf-investment</b> on Slack."))

    story.append(Spacer(1, 12))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Foreign exchange (FX) risk", "Uncertainty in future exchange rates; affects value of foreign-currency cash flows when converted to home currency"],
        ["Spot rate", "Exchange rate for immediate delivery of currency (today's rate)"],
        ["Forward rate", "Agreed exchange rate for future delivery of currency"],
        ["Purchasing Power Parity (PPP)", "Theory that exchange rates adjust to equalize purchasing power; basis for long-term FX forecasting"],
        ["Interest Rate Parity (IRP)", "Theory that forward premium equals interest rate differential; basis for short-term FX forecasting"],
        ["Political risk", "Risk of government action (expropriation, currency controls, war) affecting project value"],
        ["Political risk premium", "Additional discount rate applied to foreign projects to account for political risk"],
        ["Sovereign spread", "Yield spread between host country government bonds and risk-free rate; proxy for country risk"],
        ["Repatriation", "Return of profits from foreign subsidiary to parent company in home currency"],
        ["Blocked funds", "Profits that cannot be repatriated due to host country restrictions; must be reinvested locally"],
        ["Withholding tax", "Tax on dividends or interest paid to non-residents; reduces cash available for repatriation"],
        ["Transfer pricing", "Price set for intra-group transactions; must follow arm's-length principle"],
        ["MIGA", "Multilateral Investment Guarantee Agency; provides political risk insurance for cross-border investment"],
        ["Natural hedge", "Operational alignment of cash inflows/outflows in the same currency, reducing FX exposure"],
        ["Hedging", "Strategy to reduce or eliminate FX risk using forwards, futures, options, or operational techniques"],
    ]
    story.append(table_std(terms, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Identify the unique risks and complexities of international project appraisal versus domestic appraisal",
        "Apply both the foreign currency approach and the home currency approach to international project valuation",
        "Use Purchasing Power Parity (PPP) to forecast long-term exchange rates",
        "Use Interest Rate Parity (IRP) to understand forward premiums and short-term FX movements",
        "Adjust the discount rate for political risk using either a risk premium or sovereign spread",
        "Handle special issues: blocked funds, withholding taxes, transfer pricing, and repatriation restrictions",
        "Evaluate the economic merit of foreign investments in ZMW terms, accounting for all currency and tax effects",
        "Recognize when hedging or political risk insurance is needed to protect the investment",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 4.1 — Cost of Capital (WACC & CAPM)",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
