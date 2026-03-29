"""
Booklesss Lesson PDF — Step 7.1: Mergers & Acquisitions
Course: BAC4301 Corporate Finance
Style: Deep navy cover, crimson accent, DejaVuSerif display, LiberationSans body.
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
C_COVER     = colors.HexColor("#1A1A2E")
C_ACCENT    = colors.HexColor("#E94560")
C_ACCENT_DK = colors.HexColor("#9B2335")
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

CHANNEL_NAME = "cf-ma-valuation"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Corporate Finance", "BAC4301 - Corporate Finance",
           "lesson-07-mergers-acquisitions")
OUT_PATH = os.path.join(OUT_DIR, "Step 7.1 - Mergers & Acquisitions.pdf")

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def make_styles():
    return {
        "cover_eyebrow": ParagraphStyle("cover_eyebrow",
            fontName="Body-Bold", fontSize=7.5, textColor=C_ACCENT,
            leading=11, spaceAfter=10, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Georgia-Bold", fontSize=28, textColor=C_WHITE,
            leading=34, spaceAfter=10, alignment=TA_LEFT),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Body", fontSize=10, textColor=C_MIST,
            leading=15, spaceAfter=0, alignment=TA_LEFT),
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Body-Bold", fontSize=7, textColor=C_ACCENT,
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
            fontName="Body-Bold", fontSize=10, textColor=C_ACCENT_DK,
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
            fontName="Body-Bold", fontSize=9.5, textColor=C_ACCENT_DK,
            leading=15, alignment=TA_LEFT),
        "discuss_q": ParagraphStyle("discuss_q",
            fontName="Body-Italic", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, alignment=TA_LEFT),
        "community_nudge": ParagraphStyle("community_nudge",
            fontName="Body-Italic", fontSize=8.5, textColor=C_ACCENT_DK,
            leading=14, spaceAfter=0, alignment=TA_LEFT),
    }

ST = make_styles()

# ─────────────────────────────────────────────
#  CANVAS CALLBACKS
# ─────────────────────────────────────────────
def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(C_COVER)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#2D2D4A"))
    canvas.setLineWidth(0.5)
    for i in range(1, 6):
        canvas.line(0, H * i / 6, W, H * i / 6)
    for i in range(1, 4):
        canvas.line(W * i / 4, 0, W * i / 4, H)
    canvas.setFillColor(C_ACCENT)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.setFont("Georgia-Bold", 140)
    canvas.setFillColor(C_GHOST)
    canvas.drawRightString(W - MX, MY + 40, "7.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_ACCENT)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "7.1 — Mergers & Acquisitions")
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
    return HRFlowable(width="100%", thickness=0.5, color=C_ACCENT, spaceAfter=10, spaceBefore=4)

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
        ('BACKGROUND',    (0,0), (-1,-1), BG_DISCUSS),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_ACCENT),
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
            "This is one step in the Corporate Finance series running in the Booklesss study group on Slack. "
            "The channel for this topic is <b>#cf-ma-valuation</b> — that's where students going through "
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
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_ACCENT),
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
        ('LINEBELOW',     (0,0), (-1, 0), 1,   C_ACCENT),
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
    story.append(Paragraph("BAC4301 CORPORATE FINANCE", ST["cover_eyebrow"]))
    story.append(Paragraph("Mergers & Acquisitions", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 7.1 · Types of M&A, strategic rationale, synergy valuation, deal pricing, financing, hostile takeovers, due diligence, integration, EMH, regulation",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Types of M&A ──────────────────────────────
    story += section("TYPES", "Types of M&A")
    story.append(body(
        "Mergers and acquisitions are fundamentally about combining two businesses. "
        "The terminology varies by context and jurisdiction, but the distinction between merger and acquisition is important."
    ))
    story.append(h3("Merger"))
    story.append(body(
        "A merger is a friendly combination in which two roughly equal-sized companies voluntarily combine into a new entity. "
        "For example, Company A and Company B merge to form Company C. "
        "Both sets of shareholders must approve the deal, and ownership is pooled."
    ))
    story.append(h3("Acquisition (or Takeover)"))
    story.append(body(
        "An acquisition occurs when one company (usually the larger) acquires or takes control of another (the target). "
        "The target company ceases to exist as a legal entity and becomes a subsidiary or is integrated into the acquirer. "
        "Acquisitions can be friendly (with board and shareholder approval) or hostile (without target management's blessing)."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Forms of Acquisition"))
    story.append(bullet(
        "<b>Horizontal:</b> Two companies in the same industry at the same stage of production combine. "
        "Example: Bank A acquires Bank B. Creates market consolidation and potential cost synergies."
    ))
    story.append(bullet(
        "<b>Vertical:</b> Two companies at different stages of the same production chain combine. "
        "Example: A mining company acquires a refinery (forward integration) or a coal supplier (backward integration). "
        "Secures supply or distribution."
    ))
    story.append(bullet(
        "<b>Conglomerate:</b> Two companies in unrelated industries combine. "
        "Example: A beverage company acquires a telecommunications firm. "
        "Achieves diversification, but often destroys value if synergies are unclear."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 2: Strategic Rationale ──────────────────────
    story += section("STRATEGY", "Why Companies Pursue M&A")
    story.append(body(
        "M&A can create value if there are genuine synergies. However, empirical evidence suggests that <b>most deals destroy value</b> for the acquiring company's shareholders. "
        "The acquirer typically pays a significant premium over the target's standalone value, and this premium is often not justified by actual synergies realised post-deal."
    ))
    story.append(h3("Value-Creating Motives"))
    story.append(bullet(
        "<b>Revenue synergies:</b> Combine sales forces, eliminate duplicate customers, cross-sell products, or enter new geographies faster than organic growth."
    ))
    story.append(bullet(
        "<b>Cost synergies:</b> Eliminate duplicate head office functions, consolidate procurement to negotiate better supplier terms, close redundant manufacturing facilities."
    ))
    story.append(bullet(
        "<b>Capabilities:</b> Acquire technology, patents, or talent that would be expensive or time-consuming to develop internally."
    ))
    story.append(bullet(
        "<b>Financial capacity:</b> A large acquirer with a strong credit rating can borrow more cheaply than a smaller target. Refinancing target debt at a lower rate creates value."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Value-Destroying Motives (Managerial Empire-Building)"))
    story.append(bullet(
        "<b>Diversification:</b> Management may pursue unrelated diversification for risk reduction, but shareholders can diversify their own portfolios more cheaply. "
        "Value is typically destroyed unless the conglomerate can extract cost synergies."
    ))
    story.append(bullet(
        "<b>Overpayment:</b> A bidder wins an auction by overpaying relative to the target's intrinsic value. "
        "The 'winner's curse' is common in competitive M&A."
    ))
    story.append(bullet(
        "<b>Managerial ego:</b> Managers pursue acquisitions to build empires or avoid becoming takeover targets themselves, regardless of shareholder value."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 3: Valuation and Deal Pricing ──────────────────────
    story += section("PRICING", "Synergy Valuation and Deal Pricing")
    story.append(body(
        "The maximum price an acquirer should pay is the target's standalone value plus the present value of synergies. "
        "The minimum price is the target's standalone value (the price at which target shareholders are indifferent). "
        "The actual price agreed is negotiated within this range."
    ))
    story.append(h3("Deal Pricing Range"))
    story.append(formula_box([
        "Maximum Price = Standalone Value (Target) + PV(Synergies)",
        "Minimum Price = Standalone Value (Target)",
        "Negotiation Zone = Maximum Price − Minimum Price",
    ]))
    story.append(body(
        "In a competitive auction, the winner typically pays close to the maximum price, leaving little value for the acquirer. "
        "The acquirer must be confident that the synergies are real and will be realised on schedule."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Worked Example: Synergy Calculation"))
    story.append(body(
        "Target Ltd (Zambian engineering firm) has a standalone value of ZMW 5,000m. "
        "The acquirer expects to realise annual cost synergies of ZMW 300m starting year 2 (year 1 is integration), "
        "and annual revenue synergies of ZMW 200m starting year 3. Cost of capital is 10%."
    ))
    syn_data = [
        ["Year", "Cost Synergies (ZMW m)", "Revenue Synergies (ZMW m)", "Total Synergy (ZMW m)", "Discount Factor", "PV (ZMW m)"],
        ["1", "0", "0", "0", "0.909", "0"],
        ["2", "300", "0", "300", "0.826", "248"],
        ["3", "300", "200", "500", "0.751", "376"],
        ["4", "300", "200", "500", "0.683", "342"],
        ["5", "300", "200", "500", "0.621", "311"],
    ]
    story.append(table_std(syn_data, [1.8*cm, 2*cm, 2*cm, 2*cm, 1.8*cm, 1.7*cm]))
    story.append(Spacer(1, 6))
    story.append(body(
        "Sum of PV of synergies (5 years): ZMW 1,277m. "
        "Terminal value (perpetuity from year 6): ZMW 500m / 0.10 = ZMW 5,000m, discounted to year 5 at 0.621 = ZMW 3,105m. "
        "Total PV of synergies: ZMW 1,277m + ZMW 3,105m = ZMW 4,382m."
    ))
    story.append(body(
        "<b>Maximum price the acquirer can justify: ZMW 5,000m + ZMW 4,382m = ZMW 9,382m.</b> "
        "If the auction wins at ZMW 8,500m, the acquirer retains ZMW 882m of synergy value. "
        "If it wins at ZMW 9,500m, it has overpaid by ZMW 118m."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 4: Financing M&A ──────────────────────────
    story += section("FINANCE", "Financing the Acquisition")
    story.append(body(
        "Acquisitions can be financed with cash, stock (equity), debt, or a mix. "
        "The choice of financing affects the acquiring company's leverage, cost of capital, and shareholder dilution."
    ))
    story.append(h3("Cash Payment"))
    story.append(bullet("Pro: Clean, no shareholder dilution, rapid deal closure"))
    story.append(bullet("Con: Uses up cash reserves, may require debt financing (increases leverage and interest burden)")
    )
    story.append(h3("Stock Payment"))
    story.append(bullet("Pro: No cash outlay, target shareholders become shareholders in the combined entity (skin in the game), lower risk")
    )
    story.append(bullet("Con: Dilutes existing shareholders' ownership and earnings per share (EPS), requires target shareholder approval")
    )
    story.append(h3("Worked Example: Cash vs Stock"))
    story.append(body(
        "Acquirer plc: 100m shares at ZMW 20 = ZMW 2,000m market cap. Current earnings: ZMW 200m (EPS: ZMW 2.00). "
        "Target ltd: Valued at ZMW 1,000m in a cash offer or ZMW 1,200m in a stock offer. "
        "Cost of capital: 10%."
    ))
    story.append(body(
        "<b>Scenario 1 — Cash:</b> Acquire for ZMW 1,000m, financed by debt at 6%. "
        "Annual interest cost: ZMW 60m. New earnings: ZMW 200m − ZMW 60m = ZMW 140m. "
        "Shares remain 100m. New EPS: ZMW 1.40. Shareholder dilution: −30% in EPS."
    ))
    story.append(body(
        "<b>Scenario 2 — Stock:</b> Acquire for ZMW 1,200m, issuing 60m new shares at ZMW 20. "
        "New shares outstanding: 160m. "
        "Target earnings integrated: ZMW 200m + ZMW 150m (target) = ZMW 350m. "
        "New EPS: ZMW 350m / 160m = ZMW 2.19. Shareholder dilution: +9.5% in EPS (but on a diluted base)."
    ))
    story.append(body(
        "The stock deal looks better on EPS, but note: the acquirer is paying ZMW 1,200m vs ZMW 1,000m (20% premium). "
        "If synergies don't materialize, the stock deal destroys more value."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 5: Hostile Takeovers and Defense Mechanisms ──────────────
    story += section("HOSTILE", "Hostile Takeovers and Defence Mechanisms")
    story.append(body(
        "A hostile takeover occurs when the acquirer bypasses or overrides target management and appeals directly to target shareholders "
        "(or the board ousts management to accept the bid). Hostile takeovers are contentious and expensive."
    ))
    story.append(h3("Common Defence Mechanisms"))
    story.append(bullet(
        "<b>Poison Pill (Shareholder Rights Plan):</b> If a bidder acquires >15% without consent, existing shareholders (except the bidder) "
        "can buy additional shares at a discount, massive diluting the bidder's stake."
    ))
    story.append(bullet(
        "<b>White Knight:</b> The target board solicits a competing, friendlier bid from a third party (white knight) to outbid the hostile acquirer."
    ))
    story.append(bullet(
        "<b>Crown Jewels Defence:</b> The target sells its most valuable assets to a friendly third party, making itself less attractive to the hostile bidder."
    ))
    story.append(bullet(
        "<b>PAC-MAN Defence:</b> The target company makes a counter-offer to acquire the would-be aggressor, turning the tables."
    ))
    story.append(bullet(
        "<b>Golden Parachutes:</b> Generous severance packages for top executives that trigger if the company is taken over, raising the cost of acquisition."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 6: Due Diligence ──────────────────────────
    story += section("DILIGENCE", "Due Diligence")
    story.append(body(
        "Due diligence is the process of investigating the target company before the deal closes. "
        "It uncovers hidden liabilities, validates projections, and identifies integration risks."
    ))
    story.append(h3("Key Areas of Due Diligence"))
    story.append(bullet("Financial: Audited accounts, tax history, contingent liabilities, working capital requirements"))
    story.append(bullet("Legal: Contracts, litigation risks, intellectual property, regulatory compliance, environmental liability"))
    story.append(bullet("Commercial: Market position, customer concentration, supplier relationships, competitive threats"))
    story.append(bullet("Operational: Plant condition, technology, supply chain vulnerabilities, key person risk"))
    story.append(bullet("Environmental & Social: Compliance with ESG regulations, carbon footprint, labour practices"))
    story.append(Spacer(1, 8))

    story.append(body(
        "Good due diligence can save acquirers from costly surprises post-deal. "
        "A target that looks attractive on paper may hide regulatory fines, customer defections, or obsolete technology."
    ))
    story.append(Spacer(1, 8))

    # ── SECTION 7: Post-Merger Integration ──────────────────────────
    story += section("INTEGRATION", "Post-Merger Integration (PMI)")
    story.append(body(
        "The first 100 days post-close are critical. Failure to integrate quickly and effectively is a major reason deals destroy value."
    ))
    story.append(h3("The 100-Day Plan"))
    story.append(bullet("Days 1-30: Stabilise the target (no mass redundancies, keep key customers, maintain momentum)")
    )
    story.append(bullet("Days 31-60: Begin integration (combine sales, consolidate procurement, eliminate duplicate functions)"
    )
    )
    story.append(bullet("Days 61-100: Accelerate synergy capture (system integration, cultural alignment, communicate wins)"
    )
    )
    story.append(Spacer(1, 8))

    story.append(h3("Common Integration Challenges"))
    story.append(bullet("<b>Cultural clash:</b> Different management styles, values, and risk tolerance. Kills morale and talent retention."))
    story.append(bullet("<b>System integration:</b> Merging IT systems is complex and expensive. Often the largest hidden cost."))
    story.append(bullet("<b>Customer defection:</b> Key customers may leave if they fear service disruption or loss of relationships."))
    story.append(bullet("<b>Talent loss:</b> Best people in the target often leave during integration, taking knowledge and client relationships."))
    story.append(Spacer(1, 8))

    story.append(body(
        "<b>Reality check:</b> Empirical studies suggest 70% of acquisitions fail to create shareholder value. "
        "The main culprits are overpayment and poor integration. Acquirers are often overconfident about their ability to realise synergies."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 8: Efficient Market Hypothesis and M&A ──────────────────────
    story += section("EMH", "Efficient Market Hypothesis and M&A")
    story.append(body(
        "The Efficient Market Hypothesis (EMH) has significant implications for M&A strategy and timing."
    ))
    story.append(h3("Three Forms of EMH"))
    story.append(bullet(
        "<b>Weak Form:</b> Current prices reflect all past price and volume data. No investor can beat the market using technical analysis."
    ))
    story.append(bullet(
        "<b>Semi-Strong Form:</b> Current prices reflect all publicly available information. Fundamental analysis cannot consistently beat the market. "
        "Stock markets are generally believed to be semi-strong efficient."
    ))
    story.append(bullet(
        "<b>Strong Form:</b> Current prices reflect all information, public and private. Insiders cannot beat the market. "
        "This form is generally <b>not</b> empirically supported (insider trading clearly happens)."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Implications for M&A"))
    story.append(bullet(
        "<b>Target stock price:</b> Under semi-strong EMH, the pre-announcement price reflects all public information. "
        "The acquirer cannot systematically overpay if markets are efficient, because mispricing should not exist."
    ))
    story.append(bullet(
        "<b>Timing:</b> If markets are efficient, the acquirer cannot 'time' the market. "
        "An overvalued target (relative to fundamentals) is still overvalued, and using overvalued stock to pay for the target destroys value."
    ))
    story.append(bullet(
        "<b>Announcement effect:</b> Under semi-strong EMH, stock prices adjust quickly to M&A announcements. "
        "Target stock rises (acquisition premium), acquirer stock often falls (market doubts synergy assumptions)."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 9: Regulation and Zambian Context ──────────────────────
    story += section("REGULATION", "Regulation and Zambian Context")
    story.append(body(
        "M&A is heavily regulated to protect competition, foreign investment rules, and public interest."
    ))
    story.append(h3("Competition Authorities"))
    story.append(body(
        "Most countries have competition authorities that review large M&A deals to prevent monopolistic outcomes. "
        "In Zambia, the Competition Commission reviews mergers that may substantially lessen competition. "
        "A horizontal merger in a concentrated market may be prohibited or approved with conditions (e.g., divestiture of overlapping assets)."
    ))
    story.append(h3("Foreign Investment"))
    story.append(body(
        "Zambia has rules on foreign ownership of certain assets (mining, land, financial services). "
        "Foreign acquirers may require government approval for acquisitions in sensitive sectors. "
        "Zambia's Investment Centre (ZIC) facilitates large inbound M&A but may impose conditions."
    ))
    story.append(h3("Sovereign Wealth and State-Owned Enterprises"))
    story.append(body(
        "Some Zambian assets carry government stakes (e.g., ZCCM-IH holds copper assets). "
        "Acquisitions involving state-owned entities may require ZCCM-IH or government consent. "
        "This adds complexity and can slow deal closure."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 10: Cross-References to Other Steps ──────────────────────
    story += section("LINKS", "Cross-References to Other Steps")
    story.append(body(
        "<b>Step 4.1 — Cost of Capital:</b> Post-acquisition, the acquirer's WACC often changes due to new debt financing and different business risk. "
        "Recalculate cost of equity (beta changes) and cost of debt."
    ))
    story.append(body(
        "<b>Step 5.1 — Capital Structure:</b> Acquisitions are typically financed with new debt, changing the acquirer's leverage ratio and optimal capital structure. "
        "The combined entity may need to rebalance its debt/equity mix."
    ))
    story.append(body(
        "<b>Step 6.1 — Company Valuation:</b> DCF, P/E multiples, and EV/EBITDA are all used to value the target in an acquisition. "
        "The deal price is negotiated within a valuation range."
    ))
    story.append(Spacer(1, 10))

    # ── DISCUSSION QUESTIONS ──────────────────────────────────
    story += section("DISCUSSION", "Discussion Questions")
    q1 = "A bank acquires a smaller competitor for ZMW 800m (30% premium to market cap). The deal is expected to generate ZMW 50m annual cost synergies. At a cost of capital of 9%, what is the minimum synergy realization rate (as a % of projected ZMW 50m) needed to justify the deal?"
    q2 = "EMH suggests stock market prices are fair, yet M&A studies show acquirers often overpay. How do you reconcile this? Is it overpayment, or is EMH too strong an assumption in the context of M&A?"
    story.append(discussion_question_with_nudge(q1, f"→ Continue this discussion in #cf-ma-valuation on Slack."))
    story.append(discussion_question_with_nudge(q2, f"→ Continue this discussion in #cf-ma-valuation on Slack."))
    story.append(Spacer(1, 8))

    # ── SECTION 11: Value Creation and Destruction Metrics ──────────────────────
    story += section("METRICS", "Measuring M&A Success: Creating vs Destroying Value")
    story.append(body(
        "How do we know if an M&A deal succeeded? The standard metric is whether shareholder value was created or destroyed."
    ))
    story.append(h3("For the Acquiring Company"))
    story.append(body(
        "<b>Abnormal Return (Event Study):</b> Compare the acquirer's stock return around the announcement date "
        "to the return of a control portfolio with similar risk. A negative abnormal return suggests the market doubts the deal will create value."
    ))
    story.append(body(
        "<b>Long-term Return:</b> Track the combined company's stock performance over 3-5 years post-close. "
        "Most studies find that acquirer shareholders underperform the market or a control portfolio."
    ))
    story.append(h3("For the Target Company"))
    story.append(body(
        "Target shareholders almost always win in an M&A deal. They receive a takeover premium (typically 25-50%), "
        "so their return is positive even if the deal ultimately destroys value for the combined entity. "
        "The acquirer overpays for the premium paid to target shareholders."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Why Do Most Deals Fail?"))
    story.append(bullet("<b>Overpayment:</b> The acquirer pays a premium above the target's standalone value plus realistic synergies"))
    story.append(bullet("<b>Optimism bias:</b> Management overestimates synergy realization and underestimates integration costs"))
    story.append(bullet("<b>Integration failure:</b> Good strategies fail in execution. Cultural clashes, talent loss, system integration delays"))
    story.append(bullet("<b>Adverse selection:</b> The willingness to sell may indicate the target is problematic (lemons problem)"))
    story.append(bullet("<b>Market conditions:</b> Economic downturns can crush projected synergies before they materialize"))
    story.append(Spacer(1, 10))

    # ── SECTION 12: M&A in Zambia and Emerging Markets ──────────────────────
    story += section("EMERGING", "M&A in Zambia and Emerging Markets")
    story.append(body(
        "M&A dynamics in Zambia differ from developed markets in important ways."
    ))
    story.append(h3("Liquidity and Exit Markets"))
    story.append(body(
        "The Lusaka Securities Exchange is small and illiquid. Few companies can be acquired through a public tender offer. "
        "Instead, most deals are negotiated directly with controlling shareholders or are structured as asset purchases. "
        "The ability to exit via a secondary sale is limited, so acquirers often hold for the long term."
    ))
    story.append(h3("Regulatory and Political Risk"))
    story.append(body(
        "Zambia's political and economic environment has historically been volatile. "
        "Acquisitions of strategic assets (mining, utilities, financial services) may be blocked or conditioned on government approval. "
        "Currency risk (Kwacha depreciation) can erase post-acquisition value gains. "
        "Valuations must account for a sovereign risk premium."
    ))
    story.append(h3("Cross-Border M&A"))
    story.append(body(
        "Many Zambian acquisitions are by South African or international buyers. "
        "Conversely, Zambian companies expanding into other African markets use M&A as a growth lever. "
        "Cross-border deals add complexity: tax treaties, foreign exchange controls, and political approval requirements."
    ))
    story.append(Spacer(1, 12))
    # ── KEY TERMS ───────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Merger", "A friendly combination of two companies into a new entity with the agreement of both shareholders"],
        ["Acquisition", "One company takes control of another; the target ceases to exist as a legal entity"],
        ["Takeover", "The act of acquiring control of a company"],
        ["Horizontal merger", "Combination of two companies in the same industry at the same stage of production"],
        ["Vertical integration", "Combination of companies at different stages of the same production chain"],
        ["Conglomerate", "Combination of companies in unrelated industries"],
        ["Synergy", "The additional value created by combining two companies (revenue or cost-based)"],
        ["Synergy realization", "The actual achievement of projected synergies post-deal"],
        ["Deal pricing", "The price paid for the target; negotiated between standalone value and standalone + synergies"],
        ["Hostile takeover", "Acquisition without consent of target management; often involves appeal directly to shareholders"],
        ["Poison pill", "Shareholder rights plan that discourages hostile bids by diluting the bidder's stake"],
        ["White knight", "A friendly third party recruited to make a competing bid against a hostile acquirer"],
        ["Crown jewels", "A company's most valuable assets; sale of these makes the company less attractive to hostile bidder"],
        ["PAC-MAN defence", "The target makes a counter-offer to acquire the would-be acquirer"],
        ["Due diligence", "Investigation of the target company to uncover liabilities and validate assumptions"],
        ["Post-merger integration (PMI)", "The process of combining two companies after deal close"],
        ["Efficient Market Hypothesis", "Prices reflect available information and investors cannot consistently beat the market"],
        ["Semi-strong EMH", "Prices reflect all publicly available information"],
    ]
    story.append(table_std(terms, [5*cm, CONTENT_W - 5*cm]))
    story.append(Spacer(1, 12))

    # ── SECTION 13: Valuation Methods as the Backbone of M&A (Step 6.1 Recap) ──────────────────────
    story += section("VALLINK", "Why Valuation (Step 6.1) is the Foundation of M&A")
    story.append(body(
        "M&A cannot happen without valuation. The methods covered in Step 6.1 — DCF, multiples, asset-based, and bond pricing — "
        "are the tools used every day by investment bankers, private equity firms, and corporate development teams to price deals."
    ))
    story.append(h3("The Deal Team's Workflow"))
    story.append(body(
        "When a company is sold or acquired, the deal team builds a valuation model within days. "
        "They use DCF to establish the intrinsic value, comparable multiples to sense-check against peers, "
        "and sensitivity analysis to understand how different scenarios change value. "
        "This process is iterative: as due diligence uncovers new information, assumptions are revised and the valuation is updated."
    ))
    story.append(h3("Valuation as a Negotiation Tool"))
    story.append(body(
        "The seller's banker says the company is worth ZMW 12,000m (based on DCF and multiples). "
        "The buyer's banker says ZMW 8,500m (using more conservative assumptions). "
        "The negotiation happens within this range. The buyer doesn't want to overpay; the seller doesn't want to leave money on the table. "
        "Valuation techniques provide the facts and assumptions that anchor this negotiation."
    ))
    story.append(body(
        "Without solid valuation methods, M&A becomes a guessing game. "
        "With them, deal makers can defend their positions with data and logic."
    ))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ───────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Define mergers, acquisitions, and takeovers; distinguish horizontal, vertical, and conglomerate combinations",
        "Identify value-creating and value-destroying motives for M&A",
        "Calculate the maximum price an acquirer can justify based on standalone value and synergy value",
        "Compare cash vs stock financing and understand the impact on shareholder dilution and risk allocation",
        "Explain hostile takeover mechanisms and common defence strategies",
        "List the key areas of due diligence and why they matter",
        "Describe the 100-day post-merger integration plan and common integration pitfalls",
        "Apply the Efficient Market Hypothesis to M&A announcements and timing",
        "Understand Zambian regulatory context for M&A (competition, foreign investment, state shareholding)",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 8.1 — Interest Rate Risk Management",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")
    print(f"File size: {os.path.getsize(OUT_PATH) / 1024:.1f} KB")

if __name__ == "__main__":
    build()
