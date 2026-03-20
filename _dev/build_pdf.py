import sys
sys.stdout.reconfigure(encoding='utf-8')

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# Register Calibri
FONTS = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Calibri",        FONTS + r"\calibri.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Bold",   FONTS + r"\calibrib.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Italic", FONTS + r"\calibrii.ttf"))
pdfmetrics.registerFontFamily("Calibri",
    normal="Calibri", bold="Calibri-Bold", italic="Calibri-Italic")

# Colours
BG       = colors.HexColor("#F5F0E8")
NAVY     = colors.HexColor("#1B2A4A")
AMBER    = colors.HexColor("#C17E3A")
BODY     = colors.HexColor("#2C2C2C")
WHITE    = colors.white
LT_CREAM = colors.HexColor("#EDE8DC")
LT_AMBER = colors.HexColor("#FDF3E3")
LT_GREEN = colors.HexColor("#EAF5EA")

OUT = r"C:\Users\deeky\OneDrive\Desktop\Booklesss\Treasury Management\lesson-01-foundations\notes\1_1_introduction-to-tm.pdf"

W, H = A4
MARGIN = 2.5 * cm
USABLE = W - 2 * MARGIN

def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFont("Calibri", 8)
    canvas.setFillColor(NAVY)
    canvas.drawString(MARGIN, H - MARGIN + 10, "BBF4302 Treasury Management")
    canvas.drawRightString(W - MARGIN, H - MARGIN + 10, "Step 1.1")
    canvas.setStrokeColor(AMBER)
    canvas.setLineWidth(1.2)
    canvas.line(MARGIN, H - MARGIN + 5, W - MARGIN, H - MARGIN + 5)
    canvas.setFont("Calibri", 8)
    canvas.setFillColor(AMBER)
    canvas.drawCentredString(W / 2, MARGIN - 12, "— " + str(doc.page) + " —")
    canvas.restoreState()

def S(name, **kw):
    defaults = dict(fontName="Calibri", fontSize=10, textColor=BODY, leading=15)
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)

s_body   = S("body")
s_h1     = S("h1",  fontName="Calibri-Bold",   fontSize=22, textColor=NAVY, leading=28, spaceAfter=4)
s_sub    = S("sub", fontName="Calibri",         fontSize=11, textColor=AMBER, leading=16, spaceAfter=2)
s_tag    = S("tag", fontName="Calibri-Italic",  fontSize=11, textColor=BODY, leading=16, spaceAfter=18)
s_h2     = S("h2",  fontName="Calibri-Bold",   fontSize=14, textColor=NAVY, leading=20, spaceBefore=18, spaceAfter=6)
s_h3     = S("h3",  fontName="Calibri-Bold",   fontSize=11, textColor=AMBER, leading=16, spaceBefore=10, spaceAfter=3)
s_bul    = S("bul", leftIndent=14, spaceAfter=3)
s_warn   = S("warn",fontName="Calibri-Italic", fontSize=9.5, textColor=colors.HexColor("#7A4A10"), leading=14)
s_ok     = S("ok",  fontSize=10, textColor=colors.HexColor("#1E5E2A"), leading=15)
s_ok_hd  = S("okh", fontName="Calibri-Bold",   fontSize=11, textColor=colors.HexColor("#1E5E2A"), leading=16, spaceAfter=4)
s_nxt    = S("nxt", fontName="Calibri-Italic",  fontSize=9.5, textColor=colors.HexColor("#1E5E2A"), leading=14)

def H2(t): return Paragraph(t, s_h2)
def H3(t): return Paragraph(t, s_h3)
def B(t):  return Paragraph("&bull;  " + t, s_bul)
def P(t):  return Paragraph(t, s_body)
def SP(n=8): return Spacer(1, n)

def styled_table(data, col_widths):
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("FONTNAME",       (0,0), (-1,-1), "Calibri"),
        ("FONTSIZE",       (0,0), (-1,-1), 9.5),
        ("TEXTCOLOR",      (0,0), (-1,-1), BODY),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [LT_CREAM, BG]),
        ("GRID",           (0,0), (-1,-1), 0.4, colors.HexColor("#D4C9B0")),
        ("TOPPADDING",     (0,0), (-1,-1), 5),
        ("BOTTOMPADDING",  (0,0), (-1,-1), 5),
        ("LEFTPADDING",    (0,0), (-1,-1), 7),
        ("RIGHTPADDING",   (0,0), (-1,-1), 7),
        ("BACKGROUND",     (0,0), (-1,0), NAVY),
        ("TEXTCOLOR",      (0,0), (-1,0), WHITE),
        ("FONTNAME",       (0,0), (-1,0), "Calibri-Bold"),
    ]))
    return t

def callout(paras, fill, border):
    rows = [[p] for p in paras]
    t = Table(rows, colWidths=[USABLE - 24])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), fill),
        ("BOX",           (0,0), (-1,-1), 1.5, border),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
        ("TOPPADDING",    (0,0), (0,0),   10),
        ("BOTTOMPADDING", (0,-1),(-1,-1), 10),
        ("TOPPADDING",    (0,1), (-1,-2), 3),
        ("BOTTOMPADDING", (0,1), (-1,-2), 3),
    ]))
    return t

story = []

# Cover
story += [
    SP(10),
    Paragraph("Introduction to Treasury Management", s_h1),
    Paragraph("BBF4302 Treasury Management &middot; Step 1.1", s_sub),
    Paragraph("What does a treasury department actually do &mdash; and why does every organisation need one?", s_tag),
    SP(4),
]

# Section 1
story += [
    H2("What is Treasury Management?"),
    P("The treasury department is the <b>financial centre</b> of any organisation. Its core job is to protect the organisation&rsquo;s money and make sure there is always enough cash to keep things running."),
    SP(6),
    P("Think of it this way: the rest of the business makes decisions &mdash; treasury makes sure those decisions can actually be paid for."),
    SP(6),
    P("Three things treasury is always responsible for:"),
    SP(4),
    B("<b>Safeguarding</b> financial assets &mdash; cash, investments, receivables"),
    B("<b>Managing liabilities</b> &mdash; loans, debt, obligations"),
    B("<b>Ensuring daily liquidity</b> &mdash; the organisation never runs out of cash to operate"),
    SP(4),
]

# Section 2
story += [
    H2("The 3 Key Decisions of the Finance Function"),
    P("Treasury sits at the centre of three fundamental financial decisions every organisation must make."),
    SP(6),
    H3("1. Investment Decision &mdash; where do we put our resources?"),
    B("Which projects to fund (capital budgeting)"),
    B("How much to invest in working capital (stock, debtors)"),
    B("When to invest or divest"),
    H3("2. Financing Decision &mdash; how do we raise the money?"),
    B("Choosing the right mix of debt and equity"),
    B("Understanding cost of funds and building a sound capital structure"),
    B("Managing the difference between profit and cash"),
    H3("3. Dividend Decision &mdash; what do we do with profits?"),
    B("How much to pay out vs. retain for growth"),
    B("The level and growth of dividends affects the company&rsquo;s market value"),
    SP(4),
]

# Section 3 - 10 functions table
story += [
    H2("The 10 Main Functions of Treasury"),
    SP(4),
    styled_table(
        [["#", "Function", "What it means"]] + [
            [str(i+1), fn, desc] for i, (fn, desc) in enumerate([
                ("Cash Forecasting",        "Compile short and long-term cash forecasts"),
                ("Working Capital Mgmt",    "Monitor levels and trends of current assets and liabilities"),
                ("Cash Management",         "Ensure sufficient cash for daily operations"),
                ("Investment Management",   "Invest excess cash appropriately"),
                ("Risk Management",         "Manage exposure to interest rate and FX movements"),
                ("Management Advice",       "Brief management on market conditions"),
                ("Credit Rating Relations", "Liaise with rating agencies when issuing debt"),
                ("Bank Relationships",      "Manage the company's banking relationships"),
                ("Fund Raising",            "Maintain investor relationships for capital raising"),
                ("Credit Granting",         "Approve credit extended to customers"),
            ])
        ],
        [0.8*cm, 5.2*cm, USABLE - 6.0*cm]
    ),
    SP(4),
]

# Section 4
story += [
    H2("Three Levels of Treasury Work"),
    P("Treasury staff operate at three levels &mdash; from big-picture strategy down to day-to-day tasks."),
    SP(6),
    H3("Strategic"),
    P("Long-term, board-level decisions:"),
    B("Capital structure of the business"),
    B("Dividend and retention policies"),
    B("Capital raising and assessing likely returns"),
    H3("Tactical"),
    P("Medium-term, management decisions:"),
    B("Managing cash investments"),
    B("Deciding whether and how to hedge currency or interest rate risk"),
    H3("Operational"),
    P("Day-to-day execution:"),
    B("Transferring cash between accounts"),
    B("Placing surplus cash in short-term instruments"),
    B("Dealing with banks on transactions"),
    SP(4),
]

# Section 5
story += [
    H2("Cost Centre vs Profit Centre"),
    P("How treasury is measured depends on how it&rsquo;s structured."),
    SP(6),
    H3("Cost Centre &mdash; most common"),
    B("Treasury is a support function, not expected to generate profit"),
    B("Funded by an internal budget"),
    B("Risk: management focuses on cutting costs rather than recognising treasury&rsquo;s value"),
    H3("Profit Centre &mdash; large corporates and financial firms"),
    B("Treasury expected to generate income through trading, hedging, or FX management"),
    B("Business units charged a market rate for treasury services"),
    B("Risk: temptation to speculate"),
    SP(8),
    styled_table(
        [["", "Cost Centre", "Profit Centre"],
         ["Goal",           "Minimise cost",      "Generate income"],
         ["Accountability", "Budget",              "P&amp;L"],
         ["Main risk",      "Undervalued",         "Speculation"],
         ["Common in",      "Most organisations",  "Banks, MNCs, financial firms"]],
        [3.0*cm, (USABLE - 3.0*cm) / 2, (USABLE - 3.0*cm) / 2]
    ),
    SP(10),
    callout(
        [Paragraph("<b>Watch out:</b> The profit centre model creates a temptation to speculate. Nick Leeson at Barings Bank is the most famous example &mdash; a rogue treasury trader brought down an entire 200-year-old bank in 1995.", s_warn)],
        LT_AMBER, AMBER
    ),
    SP(4),
]

# Section 6
story += [H2("The 6 Treasury Controls"), P("Because treasury handles large sums of money, strong controls are non-negotiable."), SP(6)]
for i, (name, desc) in enumerate([
    ("Segregation of Duties",    "Front office (trading) must be separated from back office (settlement). The person making a trade cannot also confirm it."),
    ("Delegation of Authority",  "Clear limits on who can authorise what. Decision-making power must sit with the right people."),
    ("Transaction Limits",       "Caps on individual transaction sizes. Prevents staff from investing in high-risk instruments."),
    ("Approvals",                "All trades approved by a senior manager. A separate person reconciles every transaction."),
    ("Internal Audits",          "Regular checks to verify actual transactions match company policy."),
    ("Automation &mdash; STP",   "Straight-Through Processing automates routine transactions end-to-end, reducing manual errors."),
]):
    story += [H3(str(i+1) + ". " + name), P(desc), SP(2)]
story.append(SP(4))

# Section 7
story += [
    H2("Centralised vs Decentralised Treasury"),
    P("Should an organisation run treasury from one place, or let each region manage its own?"),
    SP(6),
    H3("Centralised &mdash; managed from HQ or one country"),
    B("Stronger controls, economies of scale, lower costs, tax advantages for MNCs"),
    B("Less flexibility for local operations"),
    H3("Decentralised &mdash; each subsidiary manages its own treasury"),
    B("Local expertise: knowledge of local banking, language, customs"),
    B("Downside: duplication of effort, higher compliance burden"),
    H3("Hybrid / Regional Treasury Centres"),
    B("Large MNCs set up regional centres (e.g. one for Africa, one for Europe)"),
    B("Local input feeds into a central treasury management system"),
    SP(8),
    styled_table(
        [["", "Centralised", "Decentralised", "Hybrid"],
         ["Control",         "High", "Low",  "Medium"],
         ["Local expertise", "Low",  "High", "Medium"],
         ["Cost efficiency", "High", "Low",  "Medium"]],
        [3.0*cm, (USABLE-3.0*cm)/3, (USABLE-3.0*cm)/3, (USABLE-3.0*cm)/3]
    ),
    SP(4),
]

# Section 8 - Key Terms
story += [
    H2("Key Terms"),
    SP(4),
    styled_table(
        [["Term", "Definition"]] + [
            [t, d] for t, d in [
                ("Treasury Department",     "Financial centre of an organisation &mdash; manages cash, assets, liabilities, and risk"),
                ("Liquidity",               "Having enough cash to meet obligations when they fall due"),
                ("Cost Centre",             "A unit measured by costs, not expected to generate profit"),
                ("Profit Centre",           "A unit expected to generate income"),
                ("Segregation of Duties",   "Separating incompatible tasks (e.g. trading vs. settlement)"),
                ("STP",                     "Straight-Through Processing &mdash; automated end-to-end transaction processing"),
                ("Front Office",            "The dealing/trading function of treasury"),
                ("Back Office",             "Settlement, confirmation, and reconciliation"),
                ("Centralised Treasury",    "All treasury functions managed from one location"),
                ("Delegation of Authority", "Formal assignment of decision-making power to appropriate levels"),
            ]
        ],
        [4.5*cm, USABLE - 4.5*cm]
    ),
    SP(12),
]

# Section 9 - Outcomes
outcomes = [
    "Define treasury management and explain the role of the treasury department",
    "Identify the 3 key decisions of the finance function &mdash; investment, financing, dividend",
    "List and explain the 10 main functions of a treasury department",
    "Distinguish between strategic, tactical, and operational treasury tasks",
    "Compare cost centre and profit centre approaches &mdash; including the risks of each",
    "Explain the 6 treasury controls and why segregation of duties is critical",
    "Compare centralised, decentralised, and hybrid treasury structures",
]
outcome_paras = (
    [Paragraph("What You Should Now Be Able To Do", s_ok_hd), SP(4)]
    + [Paragraph(str(i+1) + ".  " + o, s_ok) for i, o in enumerate(outcomes)]
    + [SP(8), Paragraph("Next: Step 2.1 &mdash; Working Capital &amp; Liquidity Management", s_nxt)]
)
story.append(callout(outcome_paras, LT_GREEN, colors.HexColor("#2E7D32")))

doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN + 0.4*cm, bottomMargin=MARGIN,
)
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print("Saved to: " + OUT)
