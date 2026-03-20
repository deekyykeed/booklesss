import sys
sys.stdout.reconfigure(encoding='utf-8')

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Circle, Polygon, Path
from reportlab.graphics import renderPDF
from reportlab.platypus import Flowable

# ── Fonts ─────────────────────────────────────────────────────────────────────
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Calibri",         F + r"\calibri.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Bold",    F + r"\calibrib.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Italic",  F + r"\calibrii.ttf"))
pdfmetrics.registerFont(TTFont("Georgia",         F + r"\georgia.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold",    F + r"\georgiab.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Italic",  F + r"\georgiai.ttf"))
pdfmetrics.registerFont(TTFont("Candara",         F + r"\Candara.ttf"))
pdfmetrics.registerFont(TTFont("Candara-Bold",    F + r"\Candarab.ttf"))
pdfmetrics.registerFont(TTFont("Trebuchet",       F + r"\trebuc.ttf"))
pdfmetrics.registerFont(TTFont("Trebuchet-Bold",  F + r"\trebucbd.ttf"))
pdfmetrics.registerFont(TTFont("Verdana",         F + r"\verdana.ttf"))
pdfmetrics.registerFont(TTFont("Verdana-Bold",    F + r"\verdanab.ttf"))
pdfmetrics.registerFont(TTFont("Impact",          F + r"\impact.ttf"))
pdfmetrics.registerFont(TTFont("Times",           F + r"\times.ttf"))
pdfmetrics.registerFont(TTFont("Times-Bold",      F + r"\timesbd.ttf"))
pdfmetrics.registerFont(TTFont("Times-Italic",    F + r"\timesi.ttf"))
pdfmetrics.registerFont(TTFont("Corbel",          F + r"\corbel.ttf"))
pdfmetrics.registerFont(TTFont("Corbel-Bold",     F + r"\corbelb.ttf"))

# ── Colours ───────────────────────────────────────────────────────────────────
BG       = colors.HexColor("#F5F0E8")
NAVY     = colors.HexColor("#1B2A4A")
AMBER    = colors.HexColor("#C17E3A")
BODY     = colors.HexColor("#2C2C2C")
WHITE    = colors.white
TEAL     = colors.HexColor("#0E6B6B")
ROSE     = colors.HexColor("#8B2635")
LT_NAVY  = colors.HexColor("#E8ECF3")
LT_TEAL  = colors.HexColor("#E0F0F0")
LT_AMBER = colors.HexColor("#FDF3E3")
MID_GREY = colors.HexColor("#888888")

OUT = r"C:\Users\deeky\OneDrive\Desktop\Booklesss\demo_styles.pdf"
W, H = A4
MARGIN = 2.5 * cm
USABLE = W - 2 * MARGIN

def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFont("Calibri", 8)
    canvas.setFillColor(MID_GREY)
    canvas.drawString(MARGIN, H - MARGIN + 10, "Booklesss — PDF Style Demo")
    canvas.drawRightString(W - MARGIN, H - MARGIN + 10, "Experimental")
    canvas.setStrokeColor(AMBER)
    canvas.setLineWidth(1)
    canvas.line(MARGIN, H - MARGIN + 5, W - MARGIN, H - MARGIN + 5)
    canvas.setFillColor(AMBER)
    canvas.drawCentredString(W / 2, MARGIN - 12, "— " + str(doc.page) + " —")
    canvas.restoreState()

def S(name, **kw):
    defaults = dict(fontName="Calibri", fontSize=10, textColor=BODY, leading=15)
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)

s_body  = S("body")
s_label = S("label", fontName="Calibri-Bold", fontSize=8, textColor=MID_GREY, spaceBefore=20, spaceAfter=4)
s_note  = S("note",  fontName="Calibri-Italic", fontSize=9, textColor=MID_GREY, leading=13)

def SP(n=8): return Spacer(1, n)
def P(t, style=None): return Paragraph(t, style or s_body)
def HR(): return HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#D4C9B0"), spaceAfter=6)


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 1 — TITLE FONT EXPERIMENTS
# ══════════════════════════════════════════════════════════════════════════════

story = [SP(10)]

story.append(P("Font Experiments &mdash; Title Styles", S("sec",
    fontName="Calibri-Bold", fontSize=16, textColor=NAVY, leading=22,
    spaceBefore=0, spaceAfter=12)))
story.append(HR())

title_samples = [
    # (font, size, color, label, style note)
    ("Georgia-Bold",   32, NAVY,  "Georgia Bold",
     "Serif, editorial feel. Classic and trustworthy. Great for academic/formal docs."),
    ("Times-Bold",     32, ROSE,  "Times New Roman Bold",
     "Old-school serif. High authority, dense. Works well with colour for contrast."),
    ("Trebuchet-Bold", 28, TEAL,  "Trebuchet MS Bold",
     "Humanist sans-serif. Friendly but professional. Reads well at all sizes."),
    ("Verdana-Bold",   26, NAVY,  "Verdana Bold",
     "Wide, open letterforms. Excellent legibility. Designed for screens, works in print."),
    ("Impact",         34, AMBER, "Impact",
     "Condensed, punchy. High energy. Best for short titles or marketing callouts."),
    ("Candara-Bold",   28, TEAL,  "Candara Bold",
     "Humanist geometry. Modern and warm. Pairs well with Calibri body text."),
    ("Corbel-Bold",    28, ROSE,  "Corbel Bold",
     "Clean, slightly condensed sans. Contemporary. Good for section headers."),
    ("Calibri-Bold",   28, NAVY,  "Calibri Bold (current)",
     "Your current default. Clean, Microsoft-native. Familiar but a little plain at title size."),
]

for font, size, col, label, note in title_samples:
    story.append(P(label.upper(), S("lbl_" + font,
        fontName="Calibri", fontSize=7, textColor=MID_GREY, spaceAfter=2)))
    story.append(P("Introduction to Treasury Management", S("t_" + font,
        fontName=font, fontSize=size, textColor=col, leading=size * 1.3, spaceAfter=2)))
    story.append(P(note, s_note))
    story.append(SP(14))

story.append(SP(4))


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 2 — MATH EQUATIONS
# ══════════════════════════════════════════════════════════════════════════════

story.append(P("Maths &mdash; Equation Styles", S("sec2",
    fontName="Calibri-Bold", fontSize=16, textColor=NAVY, leading=22,
    spaceBefore=20, spaceAfter=12)))
story.append(HR())

s_eq_title = S("eqt", fontName="Calibri-Bold",   fontSize=11, textColor=NAVY, spaceAfter=4, spaceBefore=14)
s_eq       = S("eq",  fontName="Georgia",         fontSize=13, textColor=BODY, leading=22, spaceAfter=4)
s_eq_note  = S("eqn", fontName="Georgia-Italic",  fontSize=10, textColor=TEAL, leading=16, spaceAfter=2)
s_var      = S("var", fontName="Calibri",         fontSize=10, textColor=BODY, leading=16, leftIndent=14)

# EOQ
story += [
    P("Economic Order Quantity (EOQ)", s_eq_title),
    P("EOQ = &radic;( 2ac &divide; h )", s_eq),
    P("The order size that minimises total inventory cost by balancing ordering costs against holding costs.", s_eq_note),
    P("Where:", s_body),
    P("a = annual demand in units", s_var),
    P("c = cost of placing one order (fixed)", s_var),
    P("h = holding cost per unit per year", s_var),
    SP(6),
]

# Worked example box
eq_rows = [
    [P("<b>Worked Example &mdash; Zambeef Ltd</b>", S("wh", fontName="Calibri-Bold", fontSize=10, textColor=NAVY))],
    [P("Annual demand (a) = 1,000 &times; 12 = <b>12,000 units</b>", S("ws", fontName="Calibri", fontSize=10, textColor=BODY, leading=16))],
    [P("EOQ = &radic;( 2 &times; 30 &times; 12,000 &divide; 2.88 )", S("ws2", fontName="Georgia", fontSize=12, textColor=BODY, leading=20))],
    [P("EOQ = &radic;( 720,000 &divide; 2.88 ) = &radic;250,000", S("ws3", fontName="Georgia", fontSize=12, textColor=BODY, leading=20))],
    [P("<b>EOQ = 500 units</b>", S("wsr", fontName="Georgia-Bold", fontSize=14, textColor=TEAL, leading=22))],
]
eq_box = Table(eq_rows, colWidths=[USABLE - 24])
eq_box.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,-1), LT_TEAL),
    ("BOX",           (0,0), (-1,-1), 1.2, TEAL),
    ("LEFTPADDING",   (0,0), (-1,-1), 14),
    ("RIGHTPADDING",  (0,0), (-1,-1), 14),
    ("TOPPADDING",    (0,0), (0,0),   10),
    ("TOPPADDING",    (0,1), (-1,-2), 4),
    ("BOTTOMPADDING", (0,-1),(-1,-1), 10),
    ("BOTTOMPADDING", (0,0), (-1,-2), 4),
]))
story.append(eq_box)
story.append(SP(16))

# Cash Discount Cost formula
story += [
    P("Cost of Not Taking a Cash Discount", s_eq_title),
    P("Discount Cost = [ D &divide; (100 &minus; D) ] &times; [ 365 &divide; (N &minus; T) ]", s_eq),
    P("Calculates the annualised cost of forgoing an early payment discount &mdash; compare against your borrowing rate.", s_eq_note),
    P("Where:", s_body),
    P("D = discount percentage offered (e.g. 2 for a 2% discount)", s_var),
    P("N = net payment period in days (e.g. 30)", s_var),
    P("T = discount period in days (e.g. 10)", s_var),
    SP(6),
]

# Worked example 2
eq2_rows = [
    [P("<b>Example &mdash; Terms: 2/10 net 30</b>", S("wh2", fontName="Calibri-Bold", fontSize=10, textColor=ROSE))],
    [P("= [ 2 &divide; (100 &minus; 2) ] &times; [ 365 &divide; (30 &minus; 10) ]", S("e2a", fontName="Georgia", fontSize=12, textColor=BODY, leading=20))],
    [P("= 0.0204 &times; 18.25", S("e2b", fontName="Georgia", fontSize=12, textColor=BODY, leading=20))],
    [P("<b>= 37.2% annualised cost</b>", S("e2r", fontName="Georgia-Bold", fontSize=14, textColor=ROSE, leading=22))],
    [P("Since your borrowing rate (8%) is lower than 37.2%, you should borrow and take the discount.", S("e2n", fontName="Calibri-Italic", fontSize=9.5, textColor=colors.HexColor("#7A4A10"), leading=14))],
]
eq2_box = Table(eq2_rows, colWidths=[USABLE - 24])
eq2_box.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,-1), LT_AMBER),
    ("BOX",           (0,0), (-1,-1), 1.2, AMBER),
    ("LEFTPADDING",   (0,0), (-1,-1), 14),
    ("RIGHTPADDING",  (0,0), (-1,-1), 14),
    ("TOPPADDING",    (0,0), (0,0),   10),
    ("TOPPADDING",    (0,1), (-1,-2), 4),
    ("BOTTOMPADDING", (0,-1),(-1,-1), 10),
    ("BOTTOMPADDING", (0,0), (-1,-2), 4),
]))
story.append(eq2_box)
story.append(SP(16))

# Cash Conversion Cycle
story += [
    P("Cash Conversion Cycle (CCC)", s_eq_title),
    P("CCC = Days Inventory + Days Receivables &minus; Days Payables", s_eq),
    P("The number of days between paying for inputs and receiving cash from sales. Shorter = better cash flow.", s_eq_note),
    SP(6),
]


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 3 — DIAGRAMS
# ══════════════════════════════════════════════════════════════════════════════

story.append(P("Diagrams &mdash; Built-in Shapes", S("sec3",
    fontName="Calibri-Bold", fontSize=16, textColor=NAVY, leading=22,
    spaceBefore=20, spaceAfter=12)))
story.append(HR())

# ── Diagram 1: Three-level pyramid (Strategic / Tactical / Operational) ───────
story.append(P("Treasury Levels &mdash; Pyramid Diagram", s_eq_title))

DW, DH = USABLE, 7 * cm
d = Drawing(DW, DH)

levels = [
    ("STRATEGIC",    NAVY,  WHITE,  0.25),
    ("TACTICAL",     TEAL,  WHITE,  0.55),
    ("OPERATIONAL",  AMBER, WHITE,  1.00),
]

cx = DW / 2
base_y = 10
tier_h = (DH - 20) / 3

for i, (label, fill, txt_col, width_ratio) in enumerate(levels):
    y = base_y + i * tier_h
    tier_w = DW * width_ratio * 0.82
    x = cx - tier_w / 2
    r = Rect(x, y, tier_w, tier_h - 3,
             fillColor=fill, strokeColor=WHITE, strokeWidth=1.5)
    d.add(r)
    s = String(cx, y + tier_h / 2 - 6, label,
               fontName="Calibri-Bold", fontSize=11,
               fillColor=txt_col, textAnchor="middle")
    d.add(s)

    subtexts = ["Long-term, board level",
                "Medium-term, management",
                "Day-to-day execution"]
    sub = String(cx, y + tier_h / 2 - 18, subtexts[i],
                 fontName="Calibri", fontSize=8,
                 fillColor=txt_col, textAnchor="middle")
    d.add(sub)

story.append(renderPDF.GraphicsFlowable(d))
story.append(SP(14))


# ── Diagram 2: Three-circle Venn — 3 key decisions ────────────────────────────
story.append(P("The 3 Key Decisions &mdash; Relationship Diagram", s_eq_title))

DW2, DH2 = USABLE, 8 * cm
d2 = Drawing(DW2, DH2)

r = 2.2 * cm
cy2 = DH2 / 2
spacing = 3.2 * cm

centres = [
    (DW2/2 - spacing, cy2 - r*0.5, NAVY,  "INVESTMENT",  "Where to\nput resources"),
    (DW2/2 + spacing, cy2 - r*0.5, TEAL,  "FINANCING",   "How to\nraise money"),
    (DW2/2,           cy2 + r*0.8, AMBER, "DIVIDEND",    "What to do\nwith profits"),
]

for (cx2, cy_c, col, label, sub) in centres:
    c = Circle(cx2, cy_c, r, fillColor=col, strokeColor=WHITE,
               strokeWidth=2, fillOpacity=0.75)
    d2.add(c)
    s2 = String(cx2, cy_c + 6, label,
                fontName="Calibri-Bold", fontSize=9,
                fillColor=WHITE, textAnchor="middle")
    d2.add(s2)
    for j, line in enumerate(sub.split("\n")):
        d2.add(String(cx2, cy_c - 8 - j*12, line,
                      fontName="Calibri", fontSize=7.5,
                      fillColor=WHITE, textAnchor="middle"))

# Centre label
mid_x = DW2 / 2
mid_y = cy2 + 8
d2.add(String(mid_x, mid_y, "TREASURY",
              fontName="Calibri-Bold", fontSize=8,
              fillColor=BODY, textAnchor="middle"))

story.append(renderPDF.GraphicsFlowable(d2))
story.append(SP(14))


# ── Diagram 3: Flow chart — Working capital cycle ─────────────────────────────
story.append(P("Cash Conversion Cycle &mdash; Flow Diagram", s_eq_title))

DW3, DH3 = USABLE, 5 * cm
d3 = Drawing(DW3, DH3)

boxes = [
    ("Pay\nSuppliers",  0.04),
    ("Hold\nInventory", 0.27),
    ("Sell\nGoods",     0.50),
    ("Collect\nCash",   0.73),
]

box_w = 3.2 * cm
box_h = 2.4 * cm
by = (DH3 - box_h) / 2

for label, pos in boxes:
    bx = DW3 * pos
    r3 = Rect(bx, by, box_w, box_h,
              fillColor=NAVY, strokeColor=WHITE, strokeWidth=1)
    d3.add(r3)
    for j, line in enumerate(label.split("\n")):
        d3.add(String(bx + box_w/2, by + box_h/2 + 4 - j*14, line,
                      fontName="Calibri-Bold", fontSize=9,
                      fillColor=WHITE, textAnchor="middle"))

# Arrows between boxes
arrow_y = by + box_h / 2
for i in range(len(boxes) - 1):
    ax_start = DW3 * boxes[i][1] + box_w + 2
    ax_end   = DW3 * boxes[i+1][1] - 2
    d3.add(Line(ax_start, arrow_y, ax_end, arrow_y,
                strokeColor=AMBER, strokeWidth=2))
    d3.add(Polygon([ax_end, arrow_y,
                    ax_end - 6, arrow_y + 4,
                    ax_end - 6, arrow_y - 4],
                   fillColor=AMBER, strokeColor=AMBER))

# Loop-back arrow label
d3.add(String(DW3 / 2, by - 14, "The shorter this cycle, the less cash the business needs to borrow",
              fontName="Calibri-Italic", fontSize=8,
              fillColor=TEAL, textAnchor="middle"))

story.append(renderPDF.GraphicsFlowable(d3))
story.append(SP(8))

# ── Build ─────────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN + 0.4*cm, bottomMargin=MARGIN,
)
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print("Saved: " + OUT)
