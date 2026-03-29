"""
Booklesss Lesson PDF — Step 10.1: Dividend Policy
Course: BAC4301 Corporate Finance
Final Step: Capstone synthesis of the entire course.
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

CHANNEL_NAME = "cf-dividends"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Corporate Finance", "content",
           "lesson-10-dividend-policy")
OUT_PATH = os.path.join(OUT_DIR, "Step 10.1 - Dividend Policy.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "10.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_CRIMSON)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "10.1 — Dividend Policy")
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

def community_closer_final():
    """Final community closer — warm acknowledgement of course completion."""
    elements = [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "<b>You've completed the entire Corporate Finance course.</b> "
            "This is one step in the BAC4301 series running in the Booklesss study group on Slack. "
            "The channel for this topic is <b>#cf-dividends</b> — that's where students going through "
            "the full programme are working through this material together, synthesising what they've learned, "
            "and working on case studies that tie all 10 steps together.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            f'If you\'re already there, you know where to find it. '
            f'If not, <link href="{INVITE_URL}"><u><b>join the group here.</b></u></link> '
            f'You\'ve earned a place at the table.',
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
    story.append(Paragraph("Dividend Policy", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 10.1 · The Final Step · MM Theorem, dividend relevance, residual policy, buybacks, scrip dividends, dividend tax, Lintner model, capstone synthesis",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Why Dividend Policy Matters ─────────────────
    story += section("FOUNDATIONS", "Why Dividend Policy Matters")
    story.append(body(
        "Dividend policy is the decision to distribute cash to shareholders (or retain it for growth). "
        "It bridges two earlier topics: capital structure (Step 5.1) and valuation (Step 6.1). "
        "A company that decides to pay dividends is returning cash that could otherwise fund projects or reduce debt."
    ))
    story.append(body(
        "The question is deceptively simple: how much cash should be paid to shareholders, and when? "
        "The answer touches on agency theory (paying dividends reduces free cash flow problem), taxes (dividends are taxed differently from capital gains), "
        "and signalling (dividend changes signal management's confidence in future cash flows)."
    ))
    story.append(body(
        "This is the final step in Corporate Finance. We'll cover three approaches to dividend policy (Modigliani-Miller, traditional theory, residual policy), "
        "then cover practical mechanisms (cash dividends, buybacks, scrip dividends), and finish with a capstone section that ties all 10 steps together."
    ))

    # ── SECTION 2: Modigliani-Miller Dividend Irrelevance ──────
    story += section("MM THEOREM", "Modigliani-Miller Dividend Irrelevance Theorem")
    story.append(body(
        "In a perfect capital market (no taxes, no transaction costs, no market imperfections), "
        "Modigliani and Miller proved that dividend policy is irrelevant to share value. "
        "What matters is the return on investment; how the returns are split between dividends and capital gains doesn't."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("The Logic"))
    story.append(body(
        "If a company increases dividends, it must either reduce growth (fewer projects funded) or increase debt. "
        "Shareholders who receive a dividend can reinvest it at the same return they'd get from the company anyway. "
        "If the company retains the cash and grows at that same return, the shareholder's wealth grows at the same rate. "
        "So paying or retaining doesn't matter — only investment returns matter."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Key Assumptions"))
    for assumption in [
        "No taxes (dividends taxed same as capital gains)",
        "No transaction costs (buying/selling shares is free)",
        "No market imperfections (all investors have same information and expectations)",
        "Investment policy is held constant (only dividend policy changes)",
    ]:
        story.append(bullet(assumption))
    story.append(Spacer(1, 8))

    # ── SECTION 3: Why MM Breaks Down ──────────────────────────
    story += section("REAL WORLD", "Why MM Breaks Down: Five Market Imperfections")
    story.append(h3("1. Taxation"))
    story.append(body(
        "Dividends and capital gains are taxed differently. In most countries, dividend tax is higher than capital gains tax. "
        "A shareholder who receives a dividend pays tax immediately; a shareholder who sells (realising a capital gain) can defer tax or avoid it entirely "
        "if they never sell. This creates a tax disadvantage to high dividends."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("2. Transaction Costs & Fractional Shares"))
    story.append(body(
        "When a company retains earnings and the shareholder wants cash, the shareholder must sell shares (paying brokerage). "
        "This is a transaction cost that could be avoided if the company paid a dividend. "
        "On the other hand, investors who want growth can't manufacture capital gains from a high dividend without reinvestment frictions."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("3. Signalling"))
    story.append(body(
        "A dividend cut may signal that management is worried about future cash flows — bad news that affects share price beyond the cash distribution itself. "
        "A stable or rising dividend signals confidence, supporting the share price."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("4. Agency Costs & Free Cash Flow Problem"))
    story.append(body(
        "If a company has excess cash and limited investment opportunities, management might waste it on value-destroying projects or perks. "
        "Paying a dividend to shareholders removes this temptation and reduces agency costs."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("5. Clientele Effects"))
    story.append(body(
        "Different investors have different preferences. Some want steady income (prefer high dividends); others want growth (prefer low dividends). "
        "Companies attract clienteles that match their dividend policy. A company that cuts dividends loses income-seeking shareholders, "
        "which may depress the share price."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 4: Dividend Relevance Theory ──────────────────
    story += section("THEORY", "Dividend Relevance Theory: The Bird-in-Hand Argument")
    story.append(body(
        "The bird-in-hand theory, attributed to Gordon and others, argues that investors prefer a sure dividend over uncertain capital growth. "
        "A dividend is paid and locked in; capital growth is speculative. Therefore, companies that pay dividends should have higher share prices."
    ))
    story.append(body(
        "This theory is less widely accepted now (MM's logic is stronger), but it captures a psychological truth: many investors do value income. "
        "Moreover, signalling works both ways: a high dividend (especially if it strains cash) signals management confidence."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 5: The Residual Dividend Policy ──────────────
    story += section("POLICY", "Residual Dividend Policy")
    story.append(body(
        "The residual dividend policy says: first, fund all positive NPV projects (Step 1.1 and 2.1); "
        "second, adjust debt to maintain the target capital structure (Step 5.1); third, pay any remaining earnings as dividends."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Formula"))
    story.append(formula_box([
        "Residual Dividend = Earnings – (Equity needed for projects) – (Debt paydown)",
        "Equity needed = (1 – Debt ratio) × Capital Expenditure"
    ]))
    story.append(body(
        "Example: A company earns K100 million. It plans K60 million in capex. Its target debt ratio is 40%, so it needs 60% equity (K36 million) "
        "and 40% debt (K24 million). After funding capex and debt, it has K100 – 36 = K64 million left to pay as a residual dividend."
    ))
    story.append(body(
        "This policy makes sense theoretically (prioritise profitable projects), but it makes dividends volatile. "
        "If capex is high one year and low the next, dividends swing. Investors hate volatile dividends."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 6: Stable Dividend Policy (Lintner) ────────────
    story += section("PRACTICE", "Stable Dividend Policy: The Lintner Model")
    story.append(body(
        "In practice, most companies pay stable (slowly growing) dividends, smoothing out short-term earnings volatility. "
        "The Lintner model captures this: companies set a target payout ratio and adjust dividends gradually toward it, avoiding sudden cuts."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("The Lintner Model"))
    story.append(formula_box([
        "Dividend change = Adjustment factor × (Target payout × Earnings – Previous dividend)",
        "Adjustment factor (typically 0.3) = speed of adjustment to target"
    ]))
    story.append(body(
        "Example: Target payout is 50%. Earnings are K100 million. Previous dividend is K40 million. "
        "Target dividend is K50 million (50% of K100). With adjustment factor 0.3, the new dividend is K40 + 0.3 × (50 – 40) = K43 million. "
        "The increase is gradual, not abrupt."
    ))
    story.append(body(
        "Why this matters: investors rely on dividends for income (pension funds, retirees). Volatile dividends force them to adjust spending. "
        "Stable dividends are valued even if they're lower on average."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 7: Dividend Metrics ────────────────────────────
    story += section("METRICS", "Key Dividend Metrics")
    story.append(h3("Dividend Per Share (DPS)"))
    story.append(body("Total dividends paid / Number of shares outstanding. Reported in annual reports."))
    story.append(Spacer(1, 6))
    story.append(h3("Dividend Yield"))
    story.append(body(
        "Annual dividend per share / Share price. Example: DPS K2, share price K50, yield = 4%. "
        "Yield tells you the income return on the share investment (separate from capital appreciation)."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Payout Ratio"))
    story.append(body(
        "Dividends per share / Earnings per share. Example: DPS K2, EPS K4, payout = 50%. "
        "A 50% payout ratio means the company retains 50% of earnings for growth."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Dividend Cover"))
    story.append(body(
        "Earnings per share / Dividend per share = 1 / Payout ratio. Example: EPS K4, DPS K2, cover = 2. "
        "A cover of 2 means earnings are twice the dividend (room to cut if earnings fall)."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 8: Dividend Mechanisms ─────────────────────────
    story += section("MECHANISMS", "How Dividends Are Paid")
    story.append(h3("Cash Dividend"))
    story.append(body(
        "The company pays cash to shareholders, typically quarterly. A shareholder owns shares on the record date and receives the dividend. "
        "The share price typically falls by the dividend amount on the ex-dividend date (the date the dividend is no longer included in the share value)."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Stock Dividend (Scrip Dividend)"))
    story.append(body(
        "The company issues new shares instead of paying cash. A 10% stock dividend means each shareholder receives 1 new share for every 10 held. "
        "No cash leaves the company; the company preserves liquidity. Shareholders end up with more shares but same pro-rata ownership."
    ))
    story.append(body(
        "Who uses scrip? Fast-growing companies that need cash for capex. Who prefers scrip? Tax-efficient investors (no immediate tax on share issuance). "
        "Who dislikes it? Income investors (they want cash, not shares)."
    ))
    story.append(Spacer(1, 6))
    story.append(h3("Share Buyback (Repurchase)"))
    story.append(body(
        "The company buys back its own shares in the market or via tender offer, retiring them. The number of shares outstanding falls, "
        "and earnings per share rise (same earnings, fewer shares) — but no cash goes to shareholders individually."
    ))
    story.append(body(
        "Buybacks are tax-efficient (capital gains tax deferred until shareholder sells), and they're flexible (company can start or stop). "
        "But they're less visible than dividends and can be seen as a sign the company can't invest profitably."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 9: Dividend and Capital Structure ──────────────
    story += section("INTERACTIONS", "How Dividend Policy Interacts with Capital Structure (Step 5.1)")
    story.append(body(
        "Dividend policy and capital structure are linked. A company that pays high dividends has less cash to retain, so it must borrow more to fund growth. "
        "Conversely, a company that retains earnings can reduce leverage."
    ))
    story.append(body(
        "MM Proposition II (Step 5.1) showed that leverage affects cost of equity. Dividend policy affects the amount retained, which affects leverage. "
        "So indirectly, dividend policy affects WACC and valuation. But if capital structure is held constant, MM says dividend policy is irrelevant."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 10: Zambia Context ──────────────────────────────
    story += section("ZAMBIA", "Dividend Policy in Zambia")
    story.append(body(
        "Zambian listed companies include banks (Zanaco, ABSA), mining (First Quantum Minerals, Konkola Copper Mines), and retail/services (Airtel Zambia, Pick n Pay). "
        "Dividend policy varies widely."
    ))
    story.append(body(
        "Banks typically pay stable dividends (regulatory capital requirements and depositor confidence require this). "
        "Mining companies pay high dividends when commodity prices are high, then cut when prices fall (cyclical payout). "
        "Young retailers reinvest earnings for growth and may not pay dividends."
    ))
    story.append(body(
        "Zambia has a dividend withholding tax (typically 10% on company dividends, higher for non-residents). "
        "This makes dividends less attractive tax-wise than capital gains (unless you hold the share long-term). "
        "As a result, some Zambian companies may prefer buybacks or reinvestment to high dividends."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 11: Cross-References ───────────────────────────
    story += section("CONNECTIONS", "How Dividend Policy Links to All Prior Steps")
    story.append(body(
        "<b>Steps 1.1 & 2.1 (Investment Appraisal):</b> Residual policy says: pay dividends only after funding positive NPV projects. "
        "High growth companies reinvest; mature companies pay dividends."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 3.1 (International Projects):</b> A multinational's dividend policy affects its cash available for international expansion. "
        "High-dividend companies may fund growth via debt instead."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 4.1 (WACC):</b> Dividend yield is part of the total return to equity (CAPM: Re = Rf + β(Rm – Rf) + Dividend yield in some models). "
        "High-dividend stocks may have lower expected capital gains but higher income returns."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 5.1 (Capital Structure):</b> Dividend policy affects retained earnings and leverage. "
        "A company that pays low dividends retains more equity and can reduce debt."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 6.1 (Valuation):</b> The Dividend Discount Model values stocks based on future dividends and growth. "
        "Dividend policy directly determines the cash flows in this model."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Step 7.1 (M&A):</b> Acquirers often examine target dividend history. "
        "A dividend cut signals trouble; a stable dividend signals strength."
    ))
    story.append(Spacer(1, 4))
    story.append(body(
        "<b>Steps 8.1 & 9.1 (Risk Management):</b> Hedging interest rate and FX risk preserves cash for dividends. "
        "A company that hedges smoothly can maintain stable dividends even when rates/FX moves."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 12: CAPSTONE SYNTHESIS ─────────────────────────
    story += section("SYNTHESIS", "The Corporate Finance Toolkit: How It All Fits Together")
    story.append(body(
        "This course has built a toolkit for making corporate finance decisions. Let's synthesize it."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>STEP 1: Evaluate Investment Opportunities</b>", ST["h3"]))
    story.append(body(
        "Steps 1.1 (FCF, NPV, IRR) and 2.1 (APV, MIRR, capital rationing) give you tools to identify projects that create value. "
        "A positive NPV project is one where the return exceeds the cost of capital."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>STEP 2: Consider International & Risk Factors</b>", ST["h3"]))
    story.append(body(
        "Step 3.1 (international project appraisal) incorporates currency risk, political risk, and adjusted discount rates. "
        "Steps 8.1 and 9.1 (interest rate and FX hedging) let you manage those risks."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>STEP 3: Calculate the Cost of Capital</b>", ST["h3"]))
    story.append(body(
        "Step 4.1 (WACC) combines the cost of debt (Rd) and cost of equity (Re) based on capital structure. "
        "This is the hurdle rate for projects and the discount rate for valuation."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>STEP 4: Optimize Capital Structure</b>", ST["h3"]))
    story.append(body(
        "Step 5.1 (MM and trade-off theory) tells you the optimal debt/equity mix. Higher debt lowers WACC (tax shield) but increases financial risk. "
        "You choose a target capital structure and adjust toward it over time."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>STEP 5: Value the Firm</b>", ST["h3"]))
    story.append(body(
        "Step 6.1 (DCF, multiples, bond pricing) gives you frameworks to value the firm. "
        "DCF applies the WACC and projects future cash flows."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>STEP 6: Consider Strategic Moves</b>", ST["h3"]))
    story.append(body(
        "Step 7.1 (M&A) shows how to evaluate and execute acquisitions, mergers, and divestitures to create shareholder value."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>STEP 7: Manage Risk</b>", ST["h3"]))
    story.append(body(
        "Steps 8.1 (interest rate risk) and 9.1 (FX risk) provide tools to hedge operational risks. "
        "A hedged company has more predictable cash flows and lower financial distress risk."
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>STEP 8: Distribute Cash to Shareholders</b>", ST["h3"]))
    story.append(body(
        "Step 10.1 (dividend policy) determines how much cash flows out to shareholders and when. "
        "Residual policy says: pay dividends from cash left after funding all positive NPV projects and maintaining capital structure."
    ))
    story.append(Spacer(1, 10))
    story.append(body(
        "<b>The Flow:</b> Identify projects with positive NPV (Steps 1, 2, 3) → Ensure return exceeds WACC (Steps 4, 5, 6) → "
        "Execute strategically (Step 7) → Manage risks (Steps 8, 9) → Distribute residual cash as dividends (Step 10). "
        "This creates sustainable value for shareholders."
    ))
    story.append(Spacer(1, 8))

    # ── DISCUSSION SECTION WITH NUDGE ─────────────────────────
    story.append(Spacer(1, 4))
    story += section("DISCUSSION", "Think & Discuss — A Capstone Case")
    story.append(discussion_question_with_nudge(
        "A Zambian mining company earns K500 million EBIT. Its WACC is 10%, tax rate 30%, capex is K200 million, "
        "and depreciation is K100 million. It has no debt and targets 40% debt ratio. Next year's earnings will fall (commodity downturn expected). "
        "What dividend should the company pay this year? Should it be higher (to signal confidence), lower (to preserve cash), or stable (smooth payout)? "
        "What about a buyback instead?",
        "Take this to <b>#cf-dividends</b> — synthesise all 10 steps and tell us your framework."
    ))
    story.append(Spacer(1, 10))

    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Dividend policy", "The decision to distribute cash to shareholders via dividends, buybacks, or retained earnings"],
        ["Modigliani-Miller (MM) Theorem", "In perfect markets, dividend policy is irrelevant to firm value; only investment returns matter"],
        ["Dividend irrelevance", "MM's result: paying dividends vs retaining earnings does not affect share value if investment policy is held constant"],
        ["Dividend relevance", "The traditional view: dividend policy matters due to taxes, signalling, and agency costs"],
        ["Signalling", "Dividend changes convey information about management's expectations of future earnings"],
        ["Bird-in-hand theory", "Investors prefer sure dividends over uncertain capital growth"],
        ["Free cash flow problem", "Agency issue: excess cash tempts management to waste it or overpay for acquisitions"],
        ["Residual dividend policy", "Pay dividends from earnings remaining after funding all positive NPV projects and maintaining capital structure"],
        ["Target payout ratio", "The dividend as a percentage of earnings that the company aims to achieve over time"],
        ["Lintner model", "A model where companies adjust dividends gradually toward a target payout ratio"],
        ["Dividend per share (DPS)", "Total dividends divided by shares outstanding"],
        ["Dividend yield", "Annual dividend per share divided by share price; the income return"],
        ["Payout ratio", "Dividends per share divided by earnings per share"],
        ["Dividend cover", "Earnings per share divided by dividend per share; how many times earnings cover the dividend"],
        ["Cash dividend", "Dividend paid in cash to shareholders"],
        ["Stock dividend (scrip dividend)", "Dividend paid in new shares rather than cash"],
        ["Share buyback (repurchase)", "The company buys back and retires its own shares"],
        ["Clientele effect", "Different investors prefer different dividend policies, creating a stable shareholder base for each policy"],
        ["Dividend withholding tax", "Tax on dividends received by shareholders; varies by country and shareholding period"],
    ]
    story.append(table_std(terms, [5*cm, CONTENT_W - 5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Explain the Modigliani-Miller dividend irrelevance theorem and identify its assumptions",
        "Describe how real-world market imperfections (taxes, signalling, agency costs) make dividend policy relevant",
        "Apply the residual dividend policy: calculate dividends from earnings after funding projects and maintaining capital structure",
        "Explain the Lintner model and why companies smooth dividends rather than paying volatile residual amounts",
        "Calculate and interpret key dividend metrics (DPS, yield, payout ratio, cover)",
        "Distinguish between cash dividends, stock dividends, and buybacks, and explain when each is used",
        "Synthesize all 10 steps of Corporate Finance and show how dividend policy completes the toolkit",
        "Evaluate dividend policy for a real company using scenario analysis and forward guidance",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 12))
    story.append(Paragraph(
        "<b>Congratulations! You have completed the BAC4301 Corporate Finance course.</b>",
        ParagraphStyle("completion", fontName="Georgia-Bold", fontSize=11, textColor=C_DARK_RED,
                       leading=16, spaceBefore=10, alignment=TA_CENTER)))

    # ── COMMUNITY CLOSER (FINAL) ────────────────────────────────
    story += community_closer_final()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")
    size = os.path.getsize(OUT_PATH)
    print(f"File size: {size / 1024:.1f} KB")

if __name__ == "__main__":
    build()
