"""
Booklesss Lesson PDF — Step 3.1: The External Environment
Course: Strategic Management
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
C_AMBER     = colors.HexColor("#C17E3A")   # amber hairlines (global brand)
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

CHANNEL_NAME = "sm-environment"
INVITE_URL   = "https://join.slack.com/t/bookless10/shared_invite/zt-3t42wx6yq-8OFwcZTqTbPpC2Dg0q__Cg"

OUT_DIR  = os.path.join(os.path.dirname(__file__), "..", "..",
           "courses", "Strategic Management", "content",
           "lesson-03-external-environment")
OUT_PATH = os.path.join(OUT_DIR, "Step 3.1 - The External Environment.pdf")

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
    canvas.drawRightString(W - MX, MY + 40, "3.1")
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    canvas.setStrokeColor(C_AMBER)
    canvas.setLineWidth(0.5)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, "3.1 — The External Environment")
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
    """Soft, peer-to-peer mention of the study group."""
    elements = [
        Spacer(1, 20),
        HRFlowable(width="100%", thickness=0.5, color=C_RULE, spaceAfter=14),
        Paragraph(
            "This is one step in the Strategic Management series running in the Booklesss study group on Slack. "
            "The channel for this topic is <b>#sm-environment</b> — that's where students working through "
            "Strategic Management are discussing ideas like these, sharing past exam questions, and unpacking "
            "how to read the environment that surrounds a business.",
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
    story.append(Paragraph("STRATEGIC MANAGEMENT", ST["cover_eyebrow"]))
    story.append(Paragraph("The External\nEnvironment", ST["cover_title"]))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Step 3.1 · PESTEL analysis, Porter's Five Forces, and SWOT as tools for reading the environment",
        ST["cover_sub"]))
    story.append(Spacer(1, 14))
    story.append(Paragraph("Booklesss · booklesss.framer.ai",
        ParagraphStyle("cover_brand", fontName="Body-Bold", fontSize=8,
                       textColor=colors.HexColor("#374151"), leading=12, alignment=TA_LEFT)))
    story.append(NextPageTemplate("Body"))
    story.append(PageBreak())

    # ── SECTION 1: Why the External Environment Matters ────────────────
    story += section("FOUNDATIONS", "Why the External Environment Matters")
    story.append(body(
        "The external environment encompasses all factors outside the company that affect its operations "
        "but are not directly controlled by it. Strategy that ignores the environment doesn't stay relevant for long. "
        "Companies that fail to read their environment — markets shift, regulations change, new competitors emerge — "
        "find themselves blindsided by disruption they should have seen coming."
    ))
    story.append(body(
        "Analysis of the external environment happens at two distinct levels, each with its own tools and frameworks."
    ))

    env_data = [
        ["Level", "What it covers", "Analysis tool", "Question answered"],
        ["Macro environment", "Broad factors affecting all industries — politics, economics, technology, regulation, social trends", "PESTEL", "What are the big-picture forces shaping all industries?"],
        ["Industry/competitive environment", "Forces specific to the company's industry — competitor intensity, buyer power, supplier power, substitutes, new entrants", "Porter's Five Forces", "How intense is competition in our industry, and what constrains our profit potential?"],
    ]
    story.append(table_std(env_data, [2.5*cm, 5*cm, 3.5*cm, CONTENT_W - 11*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "Understanding both levels allows companies to anticipate threats before they materialise, "
        "identify emerging opportunities that competitors may not yet recognise, "
        "and adapt strategy to dynamic conditions. Companies that read the environment proactively "
        "gain time to respond. Companies that ignore it until it's too late pay the price."
    ))

    # ── SECTION 2: PESTEL ─────────────────────────────────────────────
    story += section("PESTEL", "PESTEL Analysis")
    story.append(body(
        "PESTEL is a framework for analysing six broad categories of macro-environmental factors. "
        "Each category can shift independently, but they also interact with one another. "
        "A company must monitor all six continuously, not just the ones that seem immediately relevant."
    ))

    pestel_data = [
        ["Factor", "What it covers", "Example"],
        ["Political", "Government policies, political stability, tax policy, trade regulations, foreign policy, government spending",
         "Changes in Zambia's mining regulations affecting copper export companies"],
        ["Economic", "Inflation, interest rates, exchange rates, unemployment, GDP growth, disposable income",
         "Rising interest rates increasing the cost of borrowing for Zambian businesses"],
        ["Social", "Demographic changes, consumer preferences, cultural trends, lifestyle shifts, education levels",
         "Growing urban middle class in Zambia creating demand for packaged goods and financial services"],
        ["Technological", "Innovations that change how business is done — e-commerce, automation, AI, digital platforms, mobile services",
         "Mobile money platforms (Zamtel Kwacha, MTN MoMo) disrupting traditional banking"],
        ["Environmental (Ecological)", "Climate change, environmental regulations, sustainability requirements, carbon reduction, resource scarcity",
         "Environmental compliance requirements for mining companies on the Copperbelt"],
        ["Legal", "Laws, data protection, consumer rights, labour laws, product compliance, intellectual property",
         "Zambia's Data Protection Act affecting how companies collect and store customer information"],
    ]
    story.append(table_std(pestel_data, [2*cm, 4.5*cm, CONTENT_W - 6.5*cm]))
    story.append(Spacer(1, 10))

    story.append(callout(
        "<b>Exam tip:</b> PESTEL factors are rarely isolated. A change in government (Political) often triggers "
        "new regulations (Legal) which carry economic costs (Economic). Examiners reward answers that link factors "
        "across categories and show how change in one area cascades through others.",
        "note"))

    # ── SECTION 3: PORTER'S FIVE FORCES ───────────────────────────────
    story += section("PORTER", "Porter's Five Forces")
    story.append(body(
        "Porter's Five Forces is a framework for analysing the competitive intensity of an industry. "
        "The stronger these five forces, the harder it is to earn above-average profits. "
        "Understanding which forces are most intense in your industry tells you where to focus strategy."
    ))

    story.append(h3("Force 1 — Threat of New Entrants"))
    story.append(body(
        "New entrants bring extra capacity and compete for market share, driving down prices and squeezing existing "
        "competitors' margins. The strength of this threat depends entirely on barriers to entry — the obstacles that "
        "make it difficult or expensive for a new company to enter. Low barriers mean high threat; high barriers mean "
        "the threat is contained. Barriers include capital requirements (how much upfront investment is needed?), "
        "brand loyalty (how sticky are existing customers?), regulatory licences (can you legally operate?), "
        "economies of scale (do incumbents have cost advantages?), and access to distribution (can you reach customers?). "
        "Example: mobile telecoms in Zambia has high barriers — spectrum licences are limited and expensive, "
        "infrastructure investment is enormous, and existing players (Airtel, MTN, Vodacom) have already built out networks. "
        "This limits new entrants and protects incumbents' profitability."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Force 2 — Bargaining Power of Buyers"))
    story.append(body(
        "Buyers with power can demand lower prices, better quality, or more service — squeezing supplier margins. "
        "Buyer power is high when: buyers are few and large (they represent a significant share of the supplier's revenue), "
        "products are undifferentiated (customers see suppliers as interchangeable), switching costs are low (it's cheap and "
        "easy to change suppliers), or buyers can integrate backward (they could produce the product themselves). "
        "Example: large Zambian supermarket chains like Shoprite and Spar have enormous bargaining power over small local "
        "food producers. These retailers represent a huge portion of a small producer's revenue, so they can demand lower prices "
        "and longer payment terms — and the producer has no choice but to accept or lose the business."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Force 3 — Bargaining Power of Suppliers"))
    story.append(body(
        "Powerful suppliers can charge higher prices or reduce quality, squeezing the company's margins. "
        "Supplier power is high when: suppliers are concentrated (few suppliers dominate the market), inputs are unique or "
        "critical (you can't do business without them), switching costs are high (changing suppliers is expensive or disruptive), "
        "or no substitutes exist (there are no alternative inputs). Example: Zambia's dependence on imported fuel gives international "
        "oil suppliers significant power over local fuel distributors. When global oil prices spike, distributors have no choice but "
        "to pay more — they can't switch suppliers or find substitutes. This limits their ability to absorb costs without raising "
        "prices to consumers."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Force 4 — Threat of Substitute Products or Services"))
    story.append(body(
        "Substitutes limit the price ceiling an industry can charge. If a substitute offers equivalent value at a lower cost, "
        "customers will switch. The threat is high when: substitutes offer equivalent value at lower cost, switching costs are low, "
        "and buyers perceive the substitute as a viable alternative. Example: mobile money services pose a direct threat to traditional "
        "banking. A customer can send money, pay bills, and access credit through mobile money (MTN, Airtel, Zamtel) without opening a "
        "bank account. For many, this is sufficient — lowering banks' ability to charge fees and capture customers."
    ))
    story.append(Spacer(1, 8))

    story.append(h3("Force 5 — Intensity of Industry Rivalry"))
    story.append(body(
        "Rivalry is the central force — it's shaped by all four others. High rivalry occurs when: many competitors of similar size "
        "compete, industry growth is slow (forcing competitors to fight for share), product differentiation is low (customers see competitors "
        "as interchangeable), fixed costs are high (companies must keep producing to cover costs), or exit barriers are high (it's expensive "
        "or difficult to leave the industry). Example: Zambian commercial banking has moderate-to-high rivalry. Multiple players compete "
        "(Zanaco, Stanbic, FNB, Absa, Atlas Mara) with similar products and pricing. As mobile money reduces switching costs and expands "
        "alternatives, rivalry is likely to intensify further."
    ))
    story.append(Spacer(1, 10))

    forces_summary = [
        ["Force", "High threat when", "Low threat when"],
        ["New entrants", "Low barriers to entry, capital accessible, weak brand loyalty, few regulations", "High barriers (capital, licences, scale, brand), difficult to access distribution"],
        ["Buyer power", "Few large buyers, undifferentiated products, low switching costs, threat of backward integration", "Many fragmented buyers, differentiated products, high switching costs, no integration threat"],
        ["Supplier power", "Few suppliers, unique/critical inputs, high switching costs, no substitutes", "Many suppliers, non-critical inputs, low switching costs, substitutes available"],
        ["Substitutes", "Substitutes offer equal value at lower cost, low switching costs, perceived as viable", "Substitutes offer inferior value, high switching costs, not perceived as acceptable"],
        ["Rivalry", "Many similar-sized competitors, slow growth, low differentiation, high fixed costs, high exit barriers", "Few competitors, fast growth, high differentiation, low fixed costs, low exit barriers"],
    ]
    story.append(table_std(forces_summary, [2.5*cm, 5*cm, CONTENT_W - 7.5*cm]))
    story.append(Spacer(1, 10))

    story.append(discussion_question(
        "Pick any industry operating in Zambia — retail, banking, telecoms, agriculture, manufacturing, or another. "
        "Walk through Porter's Five Forces for that industry. Which single force do you think most constrains profitability "
        "right now, and why? What would have to change for that constraint to ease?"
    ))

    # ── SECTION 4: SWOT ───────────────────────────────────────────────
    story += section("SWOT", "SWOT as a Bridge Tool")
    story.append(body(
        "SWOT links external analysis to internal assessment. It combines external factors (Opportunities and Threats, "
        "derived from PESTEL and Porter's Five Forces) with internal factors (Strengths and Weaknesses, from internal analysis). "
        "Used correctly, SWOT is a bridge between what's happening outside the company and what the company is actually capable of."
    ))

    swot_data = [
        ["", "Internal", "External"],
        ["Positive", "<b>Strengths:</b> Internal characteristics that give the company a competitive advantage (better technology, stronger brand, lower costs, skilled team)",
         "<b>Opportunities:</b> External factors or trends that could improve the company's competitive position if leveraged (growing market, new regulations favoring you, emerging customer needs)"],
        ["Negative", "<b>Weaknesses:</b> Internal characteristics that disadvantage the company (higher costs, weaker brand, limited technology, skill gaps)",
         "<b>Threats:</b> External factors or trends that could damage the company's position (declining market, new regulations against you, new competitors, substitute products)"],
    ]
    story.append(table_std(swot_data, [1.5*cm, CONTENT_W/2 - 0.75*cm, CONTENT_W/2 - 0.75*cm]))
    story.append(Spacer(1, 10))

    story.append(body(
        "The power of SWOT lies in pairing it with PESTEL or Porter's Five Forces. Used alone, SWOT can be generic — "
        "almost any company can say it has 'rising customer expectations' as an opportunity. But paired with a rigorous PESTEL analysis, "
        "you know exactly which social or technological trends are driving those expectations and which industries will be most affected. "
        "Paired with Porter's Five Forces, you understand which opportunities and threats will actually affect competitive intensity in "
        "your industry. PESTEL tells you what the threats and opportunities ARE. SWOT tells you how well your company is positioned to "
        "deal with them."
    ))
    story.append(Spacer(1, 8))

    story.append(discussion_question(
        "A company completes a PESTEL analysis and identifies three key trends: (1) rising inflation, (2) stricter environmental regulations, "
        "and (3) growing smartphone penetration in emerging markets. How would each of these show up in a SWOT analysis — and would they always "
        "be a threat, or could some of them be an opportunity depending on the company's strengths? Give an example of each."
    ))

    # ── KEY TERMS ────────────────────────────────────────────────
    story += section("REFERENCE", "Key Terms")
    terms = [
        ["Term", "Definition"],
        ["Macro environment", "Broad factors that affect all industries — analysed using PESTEL"],
        ["Industry environment", "Competitive forces specific to an industry — analysed using Porter's Five Forces"],
        ["PESTEL", "Framework analysing six categories of macro-environmental factors: Political, Economic, Social, Technological, Environmental, Legal"],
        ["Political factors", "Government policies, political stability, tax policy, trade regulations, foreign policy"],
        ["Economic factors", "Inflation, interest rates, exchange rates, unemployment, GDP growth, disposable income"],
        ["Social factors", "Demographic changes, consumer preferences, cultural trends, lifestyle shifts"],
        ["Technological factors", "Innovations that change how business is done — e-commerce, automation, AI, digital platforms"],
        ["Environmental factors", "Climate change, environmental regulations, sustainability requirements, resource scarcity"],
        ["Legal factors", "Laws, data protection, consumer rights, labour laws, product compliance"],
        ["Porter's Five Forces", "Framework analysing five competitive forces that determine industry attractiveness"],
        ["Threat of new entrants", "The risk that new competitors will enter the industry and increase competition"],
        ["Bargaining power of buyers", "The power buyers have to demand lower prices, better quality, or more service"],
        ["Bargaining power of suppliers", "The power suppliers have to charge higher prices or reduce quality"],
        ["Threat of substitutes", "The risk that substitute products or services will replace existing offerings"],
        ["Industry rivalry", "The intensity of competition among existing competitors in an industry"],
        ["Barriers to entry", "Obstacles that make it difficult or expensive for new competitors to enter an industry"],
        ["SWOT analysis", "Framework linking external factors (opportunities, threats) to internal factors (strengths, weaknesses)"],
        ["Opportunities", "External factors or trends that could improve the company's competitive position"],
        ["Threats", "External factors or trends that could damage the company's competitive position"],
    ]
    story.append(table_std(terms, [5*cm, CONTENT_W - 5*cm]))
    story.append(Spacer(1, 12))

    # ── LEARNING OUTCOMES ────────────────────────────────────────
    story += section("OUTCOMES", "What You Should Now Be Able To Do")
    outcomes = [
        "Distinguish between the macro environment and the industry/competitive environment, and explain why both must be analysed",
        "Identify and explain all six PESTEL factors with examples from Zambian or African business contexts",
        "Explain each of Porter's Five Forces, what makes each one strong or weak, and how together they determine industry attractiveness",
        "Identify the key drivers of high or low bargaining power for buyers, suppliers, and the threat of new entrants",
        "Explain what SWOT is and how it functions as a bridge between external analysis (PESTEL, Porter's Five Forces) and internal assessment",
        "Apply PESTEL, Porter's Five Forces, and SWOT to analyse a real industry, identifying key constraints on profitability",
    ]
    for i, outcome in enumerate(outcomes, 1):
        story.append(Paragraph(f"{i}.   {outcome}", ST["outcome"]))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Next: 4.1 — Internal Environment (SWOT, Value Chain & VRIO Framework)",
                            ST["next_step"]))

    # ── COMMUNITY CLOSER ─────────────────────────────────────────
    story += community_closer()

    doc.build(story)
    print(f"\nPDF saved to:\n  {OUT_PATH}\n")

if __name__ == "__main__":
    build()
