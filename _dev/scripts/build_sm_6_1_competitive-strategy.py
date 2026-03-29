"""
Booklesss Lesson PDF — Step 6.1: Competitive Strategy
Course: Strategic Management (FINAL STEP)
Style: Slate-navy cover, white body, gold accent, DejaVuSerif display, LiberationSans body.
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
#  FONTS  (Linux VM — DejaVu + Liberation)
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
#  COLOURS  (Strategic Management palette)
# ─────────────────────────────────────────────
C_DARK      = colors.HexColor("#0F1F35")   # slate-navy cover
C_GRID      = colors.HexColor("#1A3050")   # subtle grid lines on cover
C_GOLD      = colors.HexColor("#C9920A")   # warm gold accent
C_GOLD_DK   = colors.HexColor("#7A5A08")   # dark gold for links / formulas
C_INK       = colors.HexColor("#111827")   # primary text
C_STEEL     = colors.HexColor("#6B7280")   # secondary text
C_MIST      = colors.HexColor("#9CA3AF")   # meta / captions
C_RULE      = colors.HexColor("#E5E7EB")   # light dividers
C_AMBER     = colors.HexColor("#C9920A")   # gold hairlines (SM brand)
C_WHITE     = colors.white

BG_WARN     = colors.HexColor("#FEF3C7")
C_WARN_TXT  = colors.HexColor("#92400E")
BG_INFO     = colors.HexColor("#EFF6FF")
C_INFO_TXT  = colors.HexColor("#1D4ED8")
BG_NOTE     = colors.HexColor("#FFFBEB")
C_NOTE_TXT  = colors.HexColor("#78350F")

# ─────────────────────────────────────────────
#  PAGE GEOMETRY
# ─────────────────────────────────────────────
W, H        = A4
MX          = 2.2 * cm
MY          = 2.0 * cm
HEADER_H    = 28
FOOTER_H    = 28
CONTENT_W   = W - 2 * MX

CHANNEL_NAME = "sm-strategy"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Strategic Management", "content",
           "lesson-06-competitive-strategy")
OUT_PATH = os.path.join(OUT_DIR, "Step 6.1 - Competitive Strategy.pdf")

# ─────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────
def make_styles():
    return {
        "cover_eyebrow": ParagraphStyle("cover_eyebrow",
            fontName="Body-Bold", fontSize=7.5, textColor=C_GOLD,
            leading=11, spaceAfter=10, alignment=TA_LEFT),
        "cover_title": ParagraphStyle("cover_title",
            fontName="Georgia-Bold", fontSize=27, textColor=C_WHITE,
            leading=33, spaceAfter=10, alignment=TA_LEFT),
        "cover_sub": ParagraphStyle("cover_sub",
            fontName="Body", fontSize=10, textColor=C_MIST,
            leading=15, spaceAfter=0, alignment=TA_LEFT),
        "eyebrow": ParagraphStyle("eyebrow",
            fontName="Body-Bold", fontSize=7, textColor=C_GOLD,
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
            fontName="Body-Bold", fontSize=9.5, textColor=C_GOLD_DK,
            leading=15, alignment=TA_LEFT),
        "discuss_q": ParagraphStyle("discuss_q",
            fontName="Body-Italic", fontSize=10, textColor=C_INK,
            leading=16, spaceAfter=4, alignment=TA_LEFT),
        "nudge": ParagraphStyle("nudge",
            fontName="Body-Italic", fontSize=8.5, textColor=C_GOLD_DK,
            leading=13, spaceAfter=8, alignment=TA_LEFT),
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
    canvas.setFillColor(C_GOLD)
    canvas.rect(0, 0, 5, H, fill=1, stroke=0)
    canvas.setFont("Georgia-Bold", 120)
    canvas.setFillColor(colors.HexColor("#1A3050"))
    canvas.drawRightString(W - MX, MY + 40, "6.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "6.1 — Competitive Strategy")
    canvas.drawRightString(W - MX, H - MY + 7, "v1 · March 2026")
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFont("Body", 7.5)
    canvas.drawString(MX, MY - 14, "Booklesss | booklesss.framer.ai")
    canvas.drawCentredString(W / 2, MY - 14, "Strategic Management")
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
        "warn": (BG_WARN, C_WARN_TXT, ST["warn_text"]),
        "info": (BG_INFO, C_INFO_TXT, ST["info_text"]),
        "note": (BG_NOTE, C_NOTE_TXT, ST["note_text"]),
    }
    bg, border_col, st = styles_map.get(style, styles_map["info"])
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

def discussion_question(text):
    """A genuine thought question — not a CTA, just something worth sitting with."""
    q = Paragraph(text, ST["discuss_q"])
    t = Table([[q]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), colors.HexColor("#FFFDF0")),
        ('LINEBEFORE',    (0,0), (-1,-1), 2.5, C_GOLD),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 12),
        ('RIGHTPADDING',  (0,0), (-1,-1), 12),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])

def community_closer():
    """Warm closer for the final step."""
    elements = [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "This is the final step in the Strategic Management series — and you've made it here. "
            "The channel is <b>#sm-strategy</b>, where students are connecting all six steps into a coherent whole: "
            "understanding how vision becomes mission, how external analysis becomes internal analysis, "
            "how analysis becomes strategy, how strategy becomes implementation, and how all of that culminates in competitive positioning.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            "Take the strategic frameworks you've learned and apply them to a real Zambian business. "
            "That's where theory becomes power.",
            ST["community"]),
        Spacer(1, 6),
        Paragraph(
            f'<link href="{INVITE_URL}"><u><b>Join the conversation here.</b></u></link>',
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
    story.append(Paragraph("STRATEGIC MANAGEMENT", ST["cover_eyebrow"]))
    story.append(Paragraph("Competitive\nStrategy", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 6.1 · Porter's generic strategies, competitive positioning, VRIO and competitive advantage, industry lifecycle, Blue Ocean, and the full strategic management process",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: FOUNDATIONS ────────────────────────────────────────
    story += section("CONTEXT", "Competitive Strategy: The Final Piece")
    story.append(body(
        "You have now learned how to analyse the external environment (Step 3.1) and assess internal capabilities (Step 4.1). "
        "You know how to implement strategy (Step 5.1). Now comes the question every strategist must answer: "
        "<b>How will you compete differently and better than rivals?</b>"
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "Competitive strategy is where you choose your <b>playing field</b> (which customers, markets, or segments to focus on) and your "
        "<b>playing style</b> (how you will beat rivals in that field). This choice is fundamental. Get it right, and the whole organisation aligns. "
        "Get it wrong, and the best execution of the wrong strategy is still a waste."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 2: PORTER'S GENERIC STRATEGIES ────────────────────────────────────────
    story += section("FRAMEWORK", "Porter's Generic Strategies: Three Ways to Compete")
    story.append(body(
        "Michael Porter identified three fundamentally different ways to win in an industry. "
        "All successful strategies fit into one of these categories. Attempting to pursue multiple strategies simultaneously usually fails — "
        "it dilutes focus and creates internal confusion."
    ))
    story.append(Spacer(1, 10))

    # Cost Leadership
    story.append(h3("1. Cost Leadership"))
    story.append(body(
        "Win by being the <b>lowest-cost producer</b> in the industry. Set your prices equal to or slightly below competitors, "
        "and your lower cost structure means higher profits. Competitors can't match your price without losing money."
    ))
    story.append(Spacer(1, 6))
    story.append(body("<b>Requirements:</b>"))
    story.append(bullet("Efficient-scale facilities and aggressive cost reduction"))
    story.append(bullet("Tight cost control across all functions"))
    story.append(bullet("Avoidance of marginal customer accounts (focus on profitable segments)"))
    story.append(bullet("Minimisation of costs in R&D, service, sales, advertising"))
    story.append(Spacer(1, 6))
    story.append(body("<b>Risks:</b>"))
    story.append(bullet("Technological change can obsolete your efficient facility"))
    story.append(bullet("Competitors can copy cost advantages through learning or new investments"))
    story.append(bullet("Fixation on cost can blind you to product/market changes"))
    story.append(bullet("Cost inflation can erode your price advantage"))
    story.append(Spacer(1, 10))

    # Differentiation
    story.append(h3("2. Differentiation"))
    story.append(body(
        "Win by offering something <b>uniquely valuable</b> that competitors can't easily replicate. "
        "Customers are willing to pay a price premium to get that uniqueness. You don't compete on price — you compete on value."
    ))
    story.append(Spacer(1, 6))
    story.append(body("<b>Dimensions of differentiation:</b>"))
    story.append(bullet("Brand image and design (e.g., luxury brands command premiums)"))
    story.append(bullet("Technology and innovation (e.g., proprietary processes)"))
    story.append(bullet("Customer service (e.g., responsiveness and reliability)"))
    story.append(bullet("Features and functionality (e.g., unique capabilities)"))
    story.append(bullet("Distribution network (e.g., unmatched availability)"))
    story.append(Spacer(1, 6))
    story.append(body("<b>Risks:</b>"))
    story.append(bullet("Price premium is vulnerable if competitors narrow the perceived difference"))
    story.append(bullet("Customer needs for differentiation can shift (e.g., market becomes price-sensitive)"))
    story.append(bullet("Imitation over time erodes uniqueness as industries mature"))
    story.append(Spacer(1, 10))

    # Focus
    story.append(h3("3. Focus (Cost Focus + Differentiation Focus)"))
    story.append(body(
        "Win by dominating a <b>narrow market segment</b> (by geography, customer type, product range, or need). "
        "Become the expert in that segment — better than cost leaders at serving it, and more capable than differentiators "
        "at understanding its specific needs."
    ))
    story.append(Spacer(1, 6))
    story.append(body(
        "<b>Cost Focus:</b> Be the lowest-cost producer for your narrow segment (e.g., Zambian mobile-money providers targeting unbanked populations). "
        "<b>Differentiation Focus:</b> Be uniquely tailored to your segment's specific needs (e.g., specialty pharmaceuticals for rare diseases)."
    ))
    story.append(Spacer(1, 6))
    story.append(body("<b>Risk:</b> Segment shrinks or attractiveness declines. Also vulnerable to competitors who broaden their focus."))
    story.append(Spacer(1, 12))

    story.append(callout(
        "<b>Critical principle:</b> Stuck in the Middle (trying to be all things to all people) is the worst strategic position. "
        "Choose one generic strategy and commit fully to it.",
        "warn"))
    story.append(Spacer(1, 10))

    # ── SECTION 3: STRATEGIC CLOCK ────────────────────────────────────────
    story += section("EXTENSIONS", "The Strategic Clock: Beyond Porter's Three")
    story.append(body(
        "Bowman's Strategic Clock extends Porter by mapping eight competitive positions: "
        "low cost, low cost + some differentiation, differentiation, focused differentiation, hybrid, and others. "
        "Most successful strategies fall into recognisable positions on this clock. "
        "Attempting unusual combinations (e.g., high cost + no differentiation) is a losing position."
    ))
    story.append(Spacer(1, 10))

    # ── SECTION 4: VALUE DISCIPLINE MODEL ────────────────────────────────────────
    story += section("FRAMEWORK", "The Value Discipline Model: Operational Excellence, Product Leadership, Customer Intimacy")
    story.append(body(
        "Treacy and Wiersema propose that winning companies master one of three disciplines — "
        "and are 'good enough' at the other two, but they don't try to lead in all three."
    ))
    story.append(Spacer(1, 10))

    vdm_data = [
        ["Discipline", "Definition", "How to win", "Examples"],
        ["Operational Excellence", "Be the most efficient, lowest-cost provider", "Streamline processes, reduce costs, rapid execution", "Walmart, Southwest Airlines"],
        ["Product Leadership", "Offer the most advanced, feature-rich offering", "Invest in R&D, rapid innovation cycles", "Apple, Tesla, pharmaceutical innovators"],
        ["Customer Intimacy", "Know your customers better than anyone; tailor solutions", "Deep relationships, customisation, responsiveness", "Luxury brands, specialist consultants"],
    ]
    story.append(table_std(vdm_data, [2*cm, 2.5*cm, 2.5*cm, 2.5*cm]))
    story.append(Spacer(1, 10))

    # ── SECTION 5: BLUE OCEAN STRATEGY ────────────────────────────────────────
    story += section("INNOVATION", "Blue Ocean Strategy: Creating Uncontested Markets")
    story.append(body(
        "W. Chan Kim and Renée Mauborgne identified two types of markets: <b>Red Oceans</b> (existing markets where competitors battle, "
        "the water turns red with blood) and <b>Blue Oceans</b> (new, uncontested markets where competition is irrelevant)."
    ))
    story.append(Spacer(1, 8))
    story.append(body(
        "Blue Ocean strategy is not incremental differentiation within existing categories — it's <b>value innovation</b>: "
        "simultaneously reducing cost and increasing perceived value by redefining what the industry is about."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("The ERRC Grid: Eliminate, Reduce, Raise, Create"))
    story.append(body(
        "To identify Blue Ocean opportunities, ask four questions:"
    ))
    story.append(Spacer(1, 6))
    story.append(bullet("<b>Eliminate:</b> What industry factors should be eliminated? (What customers don't value)"))
    story.append(bullet("<b>Reduce:</b> What should be reduced below industry standard? (Where can you cut costs without harming value?)"))
    story.append(bullet("<b>Raise:</b> What should be raised above industry standard? (What new value do customers want?)"))
    story.append(bullet("<b>Create:</b> What should be created that the industry has never offered? (What entirely new value?)"))
    story.append(Spacer(1, 10))

    story.append(h3("Blue Ocean Example: Zambian Financial Services"))
    story.append(body(
        "Traditional banks compete on branches, hours, and product range (Red Ocean). "
        "A Blue Ocean competitor might <b>eliminate</b> physical branches and complex applications (eliminate costs), "
        "<b>reduce</b> transaction fees and bureaucracy, <b>raise</b> speed and convenience (mobile-first), "
        "and <b>create</b> new value like microloans for informal traders or savings accounts designed for daily earners. "
        "Suddenly the industry is not about traditional banking — it's about financial inclusion, a much larger and underserved market."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 6: VRIO AND COMPETITIVE ADVANTAGE ────────────────────────────────────────
    story += section("SUSTAINABILITY", "Linking VRIO (Step 4.1) to Competitive Advantage")
    story.append(body(
        "Remember the VRIO framework from Step 4.1? It determines whether your competitive strategy is sustainable. "
        "If your differentiation is based on a resource that <b>any competitor can copy</b>, your advantage is temporary. "
        "If it's based on a VRIN (Valuable, Rare, Inimitable, organised) resource, your competitive position is defensible."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("VRIO Applied to Competitive Strategies"))
    story.append(body(
        "A cost-leadership strategy built on unique supply chain relationships (hard to copy, inimitable) = sustainable advantage. "
        "A differentiation strategy built on brand (built over decades, hard to copy) = sustainable advantage. "
        "A differentiation strategy built on temporary feature differences (easy for competitors to copy) = temporary advantage."
    ))
    story.append(Spacer(1, 10))

    story.append(callout(
        "<b>Strategic insight:</b> Before committing to a competitive strategy, check: Is my source of advantage VRIN? "
        "If not, this strategy is vulnerable.",
        "info"))
    story.append(Spacer(1, 12))

    # ── SECTION 7: INDUSTRY LIFECYCLE ────────────────────────────────────────
    story += section("DYNAMICS", "Competitive Strategy Across Industry Lifecycle")
    story.append(body(
        "Different competitive strategies fit different industry stages. A strategy that works in growth won't work in maturity."
    ))
    story.append(Spacer(1, 10))

    lifecycle_data = [
        ["Stage", "Market dynamic", "Winning strategy", "Why"],
        ["Introduction", "Small market, high uncertainty, few competitors", "Innovation focus, build brand, educate market", "First-mover advantage, capture share before competition arrives"],
        ["Growth", "Market expanding rapidly, many new entrants", "Rapid scaling, market share gains, broad appeal", "Winner-take-most dynamics; grab share before consolidation"],
        ["Maturity", "Market saturated, intense price competition, consolidation", "Cost leadership or focused differentiation", "Price competition means low-cost players win; or niche dominance"],
        ["Decline", "Market shrinking, commoditised, shakeout", "Cost leadership or milk the cash cow", "Only cost players can survive; or harvest profits from loyal customers"],
    ]
    story.append(table_std(lifecycle_data, [1.5*cm, 2.2*cm, 2.8*cm, 3*cm]))
    story.append(Spacer(1, 12))

    # ── SECTION 8: COMPETITIVE DYNAMICS ────────────────────────────────────────
    story += section("INTERACTION", "Competitive Dynamics: First-Mover vs Fast-Follower")
    story.append(body(
        "<b>First-movers</b> (pioneers entering a market first) have advantages: build brand, lock in customers, establish standards. "
        "But they also bear the cost of market education and product development. <b>Fast-followers</b> learn from first-movers' mistakes, "
        "invest less in R&D, and can often capture share with a better offering."
    ))
    story.append(Spacer(1, 10))

    story.append(body(
        "Neither is always right. The question is: <b>In your industry, do pioneers win or do fast-followers dominate?</b> "
        "And <b>what resources do you have to pursue either strategy?</b>"
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Game Theory: Co-opetition and Prisoner's Dilemma"))
    story.append(body(
        "Sometimes firms compete directly (price wars erode everyone's profits). Sometimes they cooperate "
        "(set industry standards together, share distribution channels). Understanding when to compete and when to cooperate is a strategic choice. "
        "The Prisoner's Dilemma shows why competitors often end up in mutually destructive price wars even when cooperation would benefit everyone."
    ))
    story.append(Spacer(1, 12))

    # ── SECTION 9: ZAMBIAN COMPETITIVE EXAMPLES ────────────────────────────────────────
    story += section("CONTEXT", "Competitive Strategy in Zambia: Real Examples")
    story.append(body(
        "Let's map competitive strategies in three Zambian industries:"
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Banking"))
    story.append(bullet("<b>Cost Leadership:</b> Rural community banks with basic products, low fees, focus on volume"))
    story.append(bullet("<b>Differentiation:</b> Premium banks (standard chartered, barclays) with superior service, relationship banking, specialised products"))
    story.append(bullet("<b>Focus (Cost):</b> Digital banks targeting unbanked populations with mobile-money platforms"))
    story.append(Spacer(1, 10))

    story.append(h3("Retail (grocery/supermarket)"))
    story.append(bullet("<b>Cost Leadership:</b> Large supermarket chains (Shoprite) with scale economies, high volume, competitive pricing"))
    story.append(bullet("<b>Differentiation:</b> Specialist retailers (organic, imported goods) commanding price premiums"))
    story.append(bullet("<b>Focus:</b> Neighbourhood convenience stores vs CBD supermarkets — different customer segments"))
    story.append(Spacer(1, 10))

    story.append(h3("Telecommunications"))
    story.append(bullet("<b>Cost Leadership:</b> Mega operators (Vodacom, MTN, Airtel) with massive scale and cost advantages"))
    story.append(bullet("<b>Differentiation:</b> Premium service for business customers, reliability, data speeds"))
    story.append(bullet("<b>Focus:</b> Emerging competitors targeting specific segments (rural, prepaid users, data-centric)"))
    story.append(Spacer(1, 12))

    # ── SECTION 10: INTEGRATION — THE FULL STRATEGIC PROCESS ────────────────────────────────────────
    story += section("SYNTHESIS", "Integrating All Six Steps: The Complete Strategic Journey")
    story.append(callout(
        "This section is a capstone. You've completed six distinct steps. Now see how they connect into one coherent whole.",
        "info"))
    story.append(Spacer(1, 10))

    story.append(h3("Step 1.1: Foundation — What is Strategy?"))
    story.append(body(
        "You learned that strategy is a coherent set of actions aimed at gaining sustainable advantage. "
        "It answers: What are we trying to achieve, and how will we achieve it better than rivals?"
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Step 2.1: Direction — Vision, Mission, Objectives"))
    story.append(body(
        "You defined your destination (vision), purpose (mission), and measurable targets (SMART objectives). "
        "This is the <b>why</b> and <b>what</b>. Everything downstream must point back here."
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Step 3.1: External Analysis — Opportunities and Threats"))
    story.append(body(
        "You mapped the external environment: <b>PESTEL</b> factors, <b>Porter's Five Forces</b>, competitors, industry structure, lifecycle stage. "
        "This revealed: What's possible? What threats must we navigate? Where are the opportunities?"
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Step 4.1: Internal Analysis — Strengths and Weaknesses"))
    story.append(body(
        "You assessed internal capabilities using <b>VRIO</b>: What are we genuinely good at? "
        "What's our competitive position? Where can we build advantage? This revealed: <b>What can we realistically achieve?</b>"
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Step 5.1: Implementation — Turning Strategy into Action"))
    story.append(body(
        "You learned how to <b>execute</b>: Align structure to strategy, measure using Balanced Scorecard, "
        "manage change, allocate resources, and hold people accountable. This answered: <b>How do we actually do it?</b>"
    ))
    story.append(Spacer(1, 10))

    story.append(h3("Step 6.1: Competitive Strategy — How We'll Win"))
    story.append(body(
        "You chose your competitive position: Will we compete on cost? Differentiation? Focus? "
        "Is our advantage sustainable (VRIN)? This answers the ultimate question: <b>How will we beat rivals?</b>"
    ))
    story.append(Spacer(1, 12))

    story.append(callout(
        "<b>The Full Picture:</b> Vision → External Analysis → Internal Analysis → Competitive Strategy → Implementation. "
        "Strategy is not a plan you write once. It's a continuous cycle of analysis, positioning, execution, and adaptation. "
        "When external conditions change (Step 3.1 insights shift), you must reassess competitive positioning (Step 6.1) "
        "and potentially reset implementation (Step 5.1). Strategic management is iterative.",
        "warn"))
    story.append(Spacer(1, 12))

    # ── SECTION 11: DISCUSSION ────────────────────────────────────────
    story.append(discussion_question(
        "<b>Q1:</b> Pick a Zambian company. Identify what you believe their competitive strategy is (cost leadership, differentiation, or focus). "
        "What evidence supports this? Are they succeeding? What would change if they shifted to a different strategy?"
    ))
    story.append(discussion_question(
        "<b>Q2:</b> Take the same company. Walk through the full strategic journey: "
        "What's their vision (2.1)? What external factors constrain them (3.1)? What are their real capabilities (4.1)? "
        "How well are they executing (5.1)? Given all that, is their competitive strategy (6.1) the right one?"
    ))
    story.append(Paragraph(
        "Share your analysis in #sm-strategy. Real company cases make abstract frameworks concrete.",
        ST["nudge"]))
    story.append(Spacer(1, 6))

    # ── KEY TERMS ────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Competitive strategy", "The approach a firm takes to compete in its industry and gain advantage over rivals"],
        ["Porter's generic strategies", "Three fundamental strategic positions: cost leadership, differentiation, and focus"],
        ["Cost leadership", "Competing by offering the lowest cost to customers while maintaining acceptable quality"],
        ["Differentiation", "Competing by offering unique, valuable features that customers are willing to pay a premium for"],
        ["Focus strategy", "Competing by dominating a narrow market segment with either cost or differentiation"],
        ["Stuck in the middle", "A losing position where a firm is neither a cost leader nor differentiated, and not focused"],
        ["Strategic clock", "Bowman's extension of Porter showing eight competitive positions on a two-dimensional map"],
        ["Value discipline", "Treacy & Wiersema's model: operational excellence, product leadership, or customer intimacy"],
        ["Blue Ocean strategy", "Creating uncontested markets through value innovation rather than competing in existing red oceans"],
        ["ERRC grid", "Eliminate, Reduce, Raise, Create — framework for identifying Blue Ocean opportunities"],
        ["First-mover advantage", "Benefits gained by entering a market before competitors (brand, customer lock-in, standards)"],
        ["Fast-follower strategy", "Entering a market after pioneers, learning from their mistakes, capturing share with improved offerings"],
        ["Co-opetition", "Simultaneously competing and cooperating with rivals to enlarge the market"],
        ["Sustainable competitive advantage", "An advantage based on VRIN resources that competitors cannot easily copy"],
        ["Industry lifecycle", "Stages of industry evolution: introduction, growth, maturity, decline — each requiring different strategies"],
    ]
    story.append(table_std(terms, [3.5*cm, CONTENT_W - 3.5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ────────────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Identify and articulate the three generic strategies and explain when each is appropriate",
        "Diagnose why a firm pursuing multiple strategies simultaneously is vulnerable to being 'stuck in the middle'",
        "Apply Porter's Five Forces (Step 3.1) to explain which generic strategy is most viable in a given industry",
        "Link VRIO resources (Step 4.1) to competitive positioning and assess whether an advantage is sustainable",
        "Map a company's competitive strategy onto the Strategic Clock and explain its position relative to rivals",
        "Apply the ERRC grid to identify Blue Ocean opportunities in a mature industry",
        "Analyse competitive dynamics (first-mover vs fast-follower, game theory, co-opetition) and recommend strategic responses",
        "Assess whether a company's competitive strategy is aligned with its stage in the industry lifecycle",
        "Integrate all six steps (vision → external → internal → competitive → implementation) into a coherent strategic narrative",
        "Critique a real Zambian company's competitive strategy and recommend repositioning if needed",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>You have completed the Strategic Management course.</b>",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ─────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
