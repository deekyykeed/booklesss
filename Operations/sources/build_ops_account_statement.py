"""
Booklesss - Account Statement (2 April 2026 to 4 July 2026)
Business document profile: a Booklesss-prepared restatement of account activity.
Figures are reproduced from the bank's own statement; the account holder is shown
as Booklesss and personal identifiers are masked. This is not a bank-issued
document and does not reproduce the bank's letterhead.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, KeepTogether, HRFlowable, PageBreak, NextPageTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from decimal import Decimal
import os

# sources/ -> Operations -> project root
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# -- FONTS ------------------------------------------------------------------
FONT_DIR = os.path.join(_ROOT, "_dev", "fonts")

def _reg(name, filename):
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONT_DIR, filename)))

_reg("Body",            "Aptos.ttf")
_reg("Body-Bold",       "Aptos-Bold.ttf")
_reg("Body-Italic",     "Aptos-Italic.ttf")
_reg("Body-BoldItalic", "Aptos-Bold-Italic.ttf")
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-Bold",
                              italic="Body-Italic", boldItalic="Body-BoldItalic")
_reg("Title",           "Parastoo.ttf")
_reg("Title-Bold",      "Parastoo-Bold.ttf")
pdfmetrics.registerFontFamily("Title", normal="Title", bold="Title-Bold",
                              italic="Title", boldItalic="Title-Bold")

# -- BRAND ASSETS -----------------------------------------------------------
BRAND_DIR  = os.path.join(_ROOT, "Brand")
LOGO_BLACK = os.path.join(BRAND_DIR, "booklesss-wordmark-black.png")
_logo_black = ImageReader(LOGO_BLACK) if os.path.exists(LOGO_BLACK) else None

# -- COLOURS - Booklesss house brand (cream paper, black type) --------------
C_COVER      = colors.HexColor("#FFFDE8")   # warm cream - first page
C_PAGE       = colors.HexColor("#FFFEF2")   # cream - continuation pages
TITLE_DARK   = colors.HexColor("#121212")
HEADING_DARK = colors.HexColor("#3D3D3D")
C_INK        = colors.HexColor("#121212")
C_BODY       = colors.HexColor("#16201A")
C_STEEL      = colors.HexColor("#5F6B65")
C_MIST       = colors.HexColor("#6E6A5E")
C_RULE       = colors.HexColor("#E0DACB")
BG_PANEL     = colors.HexColor("#F5F0E8")

# -- PAGE GEOMETRY ----------------------------------------------------------
W, H      = A4
MX        = 2.2 * cm
MY        = 2.0 * cm
CONTENT_W = W - 2 * MX

OUT_DIR  = os.path.join(_ROOT, "Operations")
OUT_PATH = os.path.join(OUT_DIR, "Account Statement - Booklesss.pdf")

# -- STATEMENT META ---------------------------------------------------------
HOLDER       = "Booklesss"
ACCOUNT_TYPE = "Lifestart Student Account"
ACCOUNT_MASK = "••••3633"
PERIOD       = "2 April 2026 to 4 July 2026"
STMT_DATE    = "4 July 2026"
STMT_NUMBER  = "18"
CURRENCY     = "Zambian Kwacha (ZMW)"

OPENING = "15.19"
CLOSING = "49.53"
SERVICE_FEES = "168.00"
OTHER_FEES   = "410.00"
CREDIT_RATE  = "0.00%"
DEBIT_RATE   = "38.75%"

# -- TRANSACTIONS -----------------------------------------------------------
# (date, description, amount, amount_is_credit, balance, balance_is_credit, accrued_charge)
TXNS = [
    ('02 Apr', 'Credit Int Paid From ••••3641', '0.19', True, '15.38', True, ''),
    ('07 Apr', 'FNB App Transfer From Qw', '90.00', True, '105.38', True, ''),
    ('07 Apr', 'Cell Trf From Transfer From Save', '300.00', True, '405.38', True, ''),
    ('07 Apr', 'Cell Trf From Transfer From Save', '230.00', True, '635.38', True, ''),
    ('07 Apr', 'Wallet To Bank Payment Test::Claude', '150.00', True, '785.38', True, ''),
    ('07 Apr', 'FNB App Transfer From Qw', '25.00', True, '810.38', True, ''),
    ('07 Apr', 'FNB App Transfer From Qw', '10.00', True, '820.38', True, ''),
    ('07 Apr', 'Cell Trf From Transfer From Save', '55.00', True, '875.38', True, ''),
    ('07 Apr', 'Cell Trf From Transfer From Save', '50.00', True, '925.38', True, ''),
    ('07 Apr', 'Wallet To Bank Payment Test::Claude', '300.00', True, '1,225.38', True, ''),
    ('07 Apr', '', '350.00', False, '875.38', True, '10.00'),
    ('07 Apr', 'FNB App Transfer To Qw', '30.00', False, '845.38', True, ''),
    ('07 Apr', '', '230.00', False, '615.38', True, '10.00'),
    ('07 Apr', 'FNB App Transfer To Qw', '140.00', False, '475.38', True, ''),
    ('07 Apr', '', '35.00', False, '440.38', True, '10.00'),
    ('07 Apr', '', '45.00', False, '395.38', True, '10.00'),
    ('07 Apr', '', '40.00', False, '355.38', True, '10.00'),
    ('07 Apr', 'FNB App Transfer To 12', '290.00', False, '65.38', True, ''),
    ('29 Apr', 'Wallet To Bank Payment Claude', '790.00', True, '855.38', True, ''),
    ('29 Apr', 'FNB App Transfer To Saving', '780.00', False, '75.38', True, ''),
    ('30 Apr', 'FNB App Transfer From 12', '100.00', True, '175.38', True, ''),
    ('30 Apr', 'Cell Trf From Transfer From Save', '40.00', True, '215.38', True, ''),
    ('30 Apr', 'Cell Trf From Transfer From Save', '600.00', True, '815.38', True, ''),
    ('30 Apr', '', '30.00', False, '785.38', True, '10.00'),
    ('30 Apr', '', '600.00', False, '185.38', True, '10.00'),
    ('02 May', 'FNB App Transfer To 12', '90.00', False, '95.38', True, ''),
    ('04 May', 'Credit Int Paid From ••••3641', '0.22', True, '95.60', True, ''),
    ('04 May', 'Cell Trf From Transfer From Save', '75.00', True, '170.60', True, ''),
    ('04 May', 'Cell Trf From Transfer From Save', '55.00', True, '225.60', True, ''),
    ('04 May', '', '75.00', False, '150.60', True, '10.00'),
    ('04 May', '', '40.00', False, '110.60', True, '10.00'),
    ('04 May', 'Value Added Serv Fees', '90.00', False, '20.60', True, ''),
    ('05 May', 'Cell Pmnt From Sender A', '9,000.00', True, '9,020.60', True, ''),
    ('05 May', 'Cell Trf From Transfer From Save', '600.00', True, '9,620.60', True, ''),
    ('05 May', '', '5,500.00', False, '4,120.60', True, '10.00'),
    ('05 May', 'FNB App Transfer To Claude Push', '200.00', False, '3,920.60', True, ''),
    ('05 May', 'FNB App Transfer To Claude Push', '1,800.00', False, '2,120.60', True, ''),
    ('05 May', '', '1,400.00', False, '720.60', True, '10.00'),
    ('05 May', '', '600.00', False, '120.60', True, '10.00'),
    ('06 May', 'Cell Trf From Transfer From Save', '600.00', True, '720.60', True, ''),
    ('06 May', 'Cell Trf From Transfer From Save', '300.00', True, '1,020.60', True, ''),
    ('06 May', 'Cell Trf From Transfer From Save', '300.00', True, '1,320.60', True, ''),
    ('06 May', 'Cell Trf From Transfer From Save', '110.00', True, '1,430.60', True, ''),
    ('06 May', 'Cell Trf From Transfer From Save', '50.00', True, '1,480.60', True, ''),
    ('06 May', '', '610.00', False, '870.60', True, '10.00'),
    ('06 May', '', '335.00', False, '535.60', True, '10.00'),
    ('06 May', '', '300.00', False, '235.60', True, '10.00'),
    ('06 May', '', '150.00', False, '85.60', True, '10.00'),
    ('07 May', 'Cell Trf From Transfer From Save', '40.00', True, '125.60', True, ''),
    ('07 May', '', '30.00', False, '95.60', True, '10.00'),
    ('11 May', 'Wallet To Bank Payment Booklesss', '480.00', True, '575.60', True, ''),
    ('12 May', 'POS Purchase 23.20 Google *Claud ••••8151 10 May', '461.65', False, '113.95', True, ''),
    ('13 May', 'Wallet To Bank Payment Booklesss', '100.00', True, '213.95', True, ''),
    ('15 May', 'POS Purchase 1.03 Google *Google ••••8151 14 May', '20.32', False, '193.63', True, ''),
    ('15 May', 'POS Purchase 3.82 Google *Spotif ••••8151 13 May', '75.36', False, '118.27', True, ''),
    ('16 May', 'Wallet To Bank Payment Booklesss', '600.00', True, '718.27', True, ''),
    ('16 May', 'FNB App Transfer To Tr', '613.00', False, '105.27', True, ''),
    ('18 May', 'Cell Trf From Transfer From Save', '13.00', True, '118.27', True, ''),
    ('18 May', 'Cell Trf From Transfer From Save', '10.00', True, '128.27', True, ''),
    ('18 May', 'Cell Trf From Transfer From Save', '40.00', True, '168.27', True, ''),
    ('18 May', 'Cell Trf From Transfer From Save', '150.00', True, '318.27', True, ''),
    ('18 May', 'Cell Trf From Transfer From Save', '200.00', True, '518.27', True, ''),
    ('18 May', 'Cell Trf From Transfer From Save', '50.00', True, '568.27', True, ''),
    ('18 May', 'Cell Trf From Transfer From Save', '50.00', True, '618.27', True, ''),
    ('18 May', '', '53.00', False, '565.27', True, '10.00'),
    ('18 May', '', '140.00', False, '425.27', True, '10.00'),
    ('18 May', '', '200.00', False, '225.27', True, '10.00'),
    ('18 May', '', '50.00', False, '175.27', True, '10.00'),
    ('18 May', '', '50.00', False, '125.27', True, '10.00'),
    ('19 May', 'Cell Trf From Transfer From Save', '100.00', True, '225.27', True, ''),
    ('19 May', '', '60.00', False, '165.27', True, '10.00'),
    ('23 May', 'Wallet To Bank Payment Booklesss', '200.00', True, '365.27', True, ''),
    ('26 May', 'POS Purchase 10.00 Google Cloud ••••8151 22 May', '196.61', False, '168.66', True, ''),
    ('30 May', 'Byc Debit ••••3641', '50.39', False, '118.27', True, ''),
    ('04 Jun', 'Credit Int Paid From ••••3641', '0.26', True, '118.53', True, ''),
    ('04 Jun', 'Value Added Serv Fees', '140.00', False, '21.47', False, ''),
    ('05 Jun', 'Cell Pmnt From Sender A', '1,000.00', True, '978.53', True, ''),
    ('05 Jun', 'Cell Trf From Transfer From Save', '50.00', True, '1,028.53', True, ''),
    ('05 Jun', 'FNB App Transfer From Tr', '30.00', True, '1,058.53', True, ''),
    ('05 Jun', 'FNB App Transfer To Tr', '953.00', False, '105.53', True, ''),
    ('05 Jun', '', '20.00', False, '85.53', True, '10.00'),
    ('05 Jun', '', '20.00', False, '65.53', True, '10.00'),
    ('06 Jun', 'Cell Trf From Transfer From Save', '600.00', True, '665.53', True, ''),
    ('06 Jun', 'Cell Trf From Transfer From Save', '40.00', True, '705.53', True, ''),
    ('06 Jun', 'Cell Trf From Transfer From Save', '200.00', True, '905.53', True, ''),
    ('06 Jun', 'Cell Trf From Transfer From Save', '83.00', True, '988.53', True, ''),
    ('06 Jun', '', '580.00', False, '408.53', True, '10.00'),
    ('06 Jun', '', '40.00', False, '368.53', True, '10.00'),
    ('06 Jun', '', '200.00', False, '168.53', True, '10.00'),
    ('06 Jun', '', '74.00', False, '94.53', True, '10.00'),
    ('08 Jun', 'POS Purchase 1.03 Google *Google ••••8151 05 Jun', '19.36', False, '75.17', True, ''),
    ('09 Jun', 'Cell Pmnt From Sender A', '14,000.00', True, '14,075.17', True, ''),
    ('09 Jun', 'Cell Trf From Transfer From Save', '3,500.00', True, '17,575.17', True, ''),
    ('09 Jun', 'Cell Trf From Transfer From Save', '10,020.00', True, '27,595.17', True, ''),
    ('09 Jun', 'FNB App Transfer From 12', '20.00', True, '27,615.17', True, ''),
    ('09 Jun', 'FNB App Transfer To 22', '13,554.00', False, '14,061.17', True, ''),
    ('09 Jun', '', '3,500.00', False, '10,561.17', True, '10.00'),
    ('09 Jun', '', '10,000.00', False, '561.17', True, '10.00'),
    ('10 Jun', 'Cell Trf From Transfer From Save', '34.00', True, '595.17', True, ''),
    ('10 Jun', 'Cell Pmnt From Sender A', '2,500.00', True, '3,095.17', True, ''),
    ('10 Jun', 'Cell Trf From Transfer From Save', '60.00', True, '3,155.17', True, ''),
    ('10 Jun', 'Cell Trf From Transfer From Save', '100.00', True, '3,255.17', True, ''),
    ('10 Jun', 'Cell Trf From Transfer From Save', '2,015.00', True, '5,270.17', True, ''),
    ('10 Jun', 'FNB App Transfer From 10', '100.00', True, '5,370.17', True, ''),
    ('10 Jun', 'FNB App Transfer To Tr', '20.00', False, '5,350.17', True, ''),
    ('10 Jun', '', '33.00', False, '5,317.17', True, '10.00'),
    ('10 Jun', 'Cell Trf To Transfer To Save', '2,491.00', False, '2,826.17', True, ''),
    ('10 Jun', 'Cell Cash Withdrawal 09815088 ••••5966', '50.00', False, '2,776.17', True, ''),
    ('10 Jun', 'Cell Cash Withdrawal 09815088 ••••5966', '100.00', False, '2,676.17', True, '16.50'),
    ('10 Jun', '', '2,000.00', False, '676.17', True, '10.00'),
    ('11 Jun', 'Cell Trf From Transfer From Save', '1.00', True, '677.17', True, ''),
    ('11 Jun', 'Cell Pmnt From Sender A', '1,000.00', True, '1,677.17', True, ''),
    ('11 Jun', 'Cell Trf From Transfer From Save', '50.00', True, '1,727.17', True, ''),
    ('11 Jun', 'Cell Cash Withdrawal Atmntwk ••••5966', '100.00', False, '1,627.17', True, '16.50'),
    ('11 Jun', '', '765.00', False, '862.17', True, '10.00'),
    ('11 Jun', 'Cell Trf To Transfer To Save', '208.00', False, '654.17', True, ''),
    ('11 Jun', '', '50.00', False, '604.17', True, '10.00'),
    ('12 Jun', 'Cell Pmnt From Sender A', '1,000.00', True, '1,604.17', True, ''),
    ('12 Jun', 'FNB App Transfer From 12', '100.00', True, '1,704.17', True, ''),
    ('12 Jun', 'FNB App Transfer From Tr', '1,100.00', True, '2,804.17', True, ''),
    ('12 Jun', 'Airtime Topup Airtime ••••5966', '10.00', False, '2,794.17', True, '3.00'),
    ('12 Jun', 'FNB App Prepaid Airtime ••••5966', '10.00', False, '2,784.17', True, ''),
    ('12 Jun', 'Cell Cash Withdrawal 09815088 ••••5966', '100.00', False, '2,684.17', True, '16.50'),
    ('12 Jun', 'FNB App Transfer To Tr', '851.00', False, '1,833.17', True, ''),
    ('12 Jun', 'Cell Cash Withdrawal 02819003 ••••5966', '100.00', False, '1,733.17', True, '16.50'),
    ('12 Jun', 'Cell Cash Withdrawal 02819002 ••••5966', '1,000.00', False, '733.17', True, '16.50'),
    ('12 Jun', 'POS Purchase 23.20 Google *Claud ••••8151 10 Jun', '435.40', False, '297.77', True, ''),
    ('13 Jun', 'Cell Pmnt From Sender A', '2,500.00', True, '2,797.77', True, ''),
    ('13 Jun', 'Cell Trf From Transfer From Save', '2,400.00', True, '5,197.77', True, ''),
    ('13 Jun', 'FNB App Transfer To 12', '2,567.00', False, '2,630.77', True, ''),
    ('13 Jun', '', '2,400.00', False, '230.77', True, '10.00'),
    ('13 Jun', 'Byc Debit ••••3641', '101.24', False, '129.53', True, ''),
    ('15 Jun', 'FNB App Transfer From 12', '182.00', True, '311.53', True, ''),
    ('15 Jun', 'Cell Trf From Transfer From Save', '110.00', True, '421.53', True, ''),
    ('15 Jun', '', '78.00', False, '343.53', True, '10.00'),
    ('15 Jun', 'Cell Cash Withdrawal Atmntwk ••••5966', '100.00', False, '243.53', True, '16.50'),
    ('02 Jul', 'Cell Pmnt From Sender A', '7,000.00', True, '7,243.53', True, ''),
    ('02 Jul', 'Cell Trf From Transfer From Save', '50.00', True, '7,293.53', True, ''),
    ('02 Jul', 'Cell Trf From Transfer From Save', '65.00', True, '7,358.53', True, ''),
    ('02 Jul', 'Cell Trf From Transfer From Save', '55.00', True, '7,413.53', True, ''),
    ('02 Jul', 'Cell Trf From Transfer From Save', '520.00', True, '7,933.53', True, ''),
    ('02 Jul', 'FNB App Transfer To Yu', '6,926.00', False, '1,007.53', True, ''),
    ('02 Jul', 'Cell Cash Withdrawal 09815088 ••••5966', '100.00', False, '907.53', True, '16.50'),
    ('02 Jul', 'Cell Cash Withdrawal Atmntwk ••••5966', '100.00', False, '807.53', True, '16.50'),
    ('02 Jul', '', '500.00', False, '307.53', True, '10.00'),
    ('03 Jul', 'Cell Trf From Transfer From Save', '1,010.00', True, '1,317.53', True, ''),
    ('03 Jul', 'Cell Cash Withdrawal 09815088 ••••5966', '1,000.00', False, '317.53', True, '16.50'),
    ('04 Jul', 'Cell Trf From Transfer From Save', '510.00', True, '827.53', True, ''),
    ('04 Jul', 'Cell Trf From Transfer From Save', '320.00', True, '1,147.53', True, ''),
    ('04 Jul', 'Cell Trf From Transfer From Save', '50.00', True, '1,197.53', True, ''),
    ('04 Jul', 'Cell Trf From Transfer From Save', '50.00', True, '1,247.53', True, ''),
    ('04 Jul', 'Cell Trf From Transfer From Save', '100.00', True, '1,347.53', True, ''),
    ('04 Jul', 'Cell Cash Withdrawal Atmntwk ••••5966', '500.00', False, '847.53', True, '16.50'),
    ('04 Jul', '', '330.00', False, '517.53', True, '10.00'),
    ('04 Jul', '', '20.00', False, '497.53', True, '10.00'),
    ('04 Jul', '', '100.00', False, '397.53', True, '10.00'),
    ('04 Jul', 'Value Added Serv Fees', '180.00', False, '217.53', True, ''),
    ('04 Jul', 'Service Fees', '168.00', False, '49.53', True, ''),
]

MONTHS = {"Apr": "April 2026", "May": "May 2026",
          "Jun": "June 2026", "Jul": "July 2026"}

# -- STYLES -----------------------------------------------------------------
ST = {
    "doc_title": ParagraphStyle("doc_title",
        fontName="Title-Bold", fontSize=34, textColor=TITLE_DARK,
        leading=38, spaceAfter=0, alignment=TA_LEFT),
    "doc_sub": ParagraphStyle("doc_sub",
        fontName="Body", fontSize=11, textColor=C_MIST,
        leading=17, spaceAfter=4, alignment=TA_LEFT),
    "eyebrow": ParagraphStyle("eyebrow",
        fontName="Body-Bold", fontSize=7, textColor=C_INK,
        leading=10, spaceAfter=3, spaceBefore=18, alignment=TA_LEFT,
        keepWithNext=1),
    "h2": ParagraphStyle("h2",
        fontName="Title-Bold", fontSize=17, textColor=HEADING_DARK,
        leading=20, spaceAfter=8, alignment=TA_LEFT, keepWithNext=1),
    "body": ParagraphStyle("body",
        fontName="Body", fontSize=10.5, textColor=C_BODY,
        leading=17, spaceAfter=6, alignment=TA_LEFT),
    "note": ParagraphStyle("note",
        fontName="Body", fontSize=9, textColor=C_STEEL,
        leading=14, spaceAfter=4, alignment=TA_LEFT),
    "kv_k": ParagraphStyle("kv_k",
        fontName="Body", fontSize=9.5, textColor=C_STEEL,
        leading=15, alignment=TA_LEFT),
    "kv_v": ParagraphStyle("kv_v",
        fontName="Body-Bold", fontSize=9.5, textColor=C_INK,
        leading=15, alignment=TA_RIGHT),
    "th": ParagraphStyle("th",
        fontName="Body-Bold", fontSize=8.5, textColor=C_INK,
        leading=12, alignment=TA_LEFT),
    "th_r": ParagraphStyle("th_r",
        fontName="Body-Bold", fontSize=8.5, textColor=C_INK,
        leading=12, alignment=TA_RIGHT),
    "td": ParagraphStyle("td",
        fontName="Body", fontSize=8, textColor=C_BODY,
        leading=11, alignment=TA_LEFT),
    "td_r": ParagraphStyle("td_r",
        fontName="Body", fontSize=8, textColor=C_BODY,
        leading=11, alignment=TA_RIGHT),
    "td_month": ParagraphStyle("td_month",
        fontName="Body-Bold", fontSize=8, textColor=C_INK,
        leading=11, alignment=TA_LEFT),
    "total_k": ParagraphStyle("total_k",
        fontName="Body-Bold", fontSize=10, textColor=C_INK,
        leading=16, alignment=TA_LEFT),
    "total_v": ParagraphStyle("total_v",
        fontName="Body-Bold", fontSize=10, textColor=C_INK,
        leading=16, alignment=TA_RIGHT),
}

# -- CANVAS CALLBACKS -------------------------------------------------------
def _paint_paper(canvas, bg):
    canvas.setFillColor(bg)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)

def _brand_row(canvas):
    top_y = H - MY + 6
    if _logo_black is not None:
        iw, ih = _logo_black.getSize()
        lh = 15
        canvas.drawImage(_logo_black, MX, top_y - 5, width=lh * iw / ih, height=lh,
                         preserveAspectRatio=True, mask="auto")
    else:
        canvas.setFont("Body-Bold", 8.5)
        canvas.setFillColor(HEADING_DARK)
        canvas.drawString(MX, top_y, "BOOKLESSS")
    canvas.setFont("Body", 8.5)
    canvas.setFillColor(C_MIST)
    canvas.drawRightString(W - MX, top_y, "ACCOUNT STATEMENT")
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.8)
    canvas.line(MX, top_y - 6, W - MX, top_y - 6)

def _footer(canvas, pn):
    canvas.setStrokeColor(C_RULE)
    canvas.setLineWidth(0.6)
    canvas.line(MX, MY - 4, W - MX, MY - 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    _left = "Booklesss | booklesss.app"
    canvas.drawString(MX, MY - 14, _left)
    _tw = canvas.stringWidth(_left, "Body", 7.5)
    canvas.linkURL("https://booklesss.app", (MX, MY - 16, MX + _tw, MY - 8))
    canvas.drawCentredString(W / 2, MY - 14, f"Statement {STMT_NUMBER} - {PERIOD}")
    canvas.drawRightString(W - MX, MY - 14, f"Page {pn}")

def first_bg(canvas, doc):
    canvas.saveState()
    _paint_paper(canvas, C_COVER)
    _brand_row(canvas)
    _footer(canvas, doc.page)
    canvas.restoreState()

def page_bg(canvas, doc):
    canvas.saveState()
    _paint_paper(canvas, C_PAGE)
    canvas.restoreState()

def body_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(C_INK)
    canvas.setLineWidth(0.6)
    canvas.line(MX, H - MY + 4, W - MX, H - MY + 4)
    canvas.setFont("Body", 7.5)
    canvas.setFillColor(C_STEEL)
    canvas.drawString(MX, H - MY + 7, f"{HOLDER} - {ACCOUNT_TYPE} {ACCOUNT_MASK}")
    canvas.drawRightString(W - MX, H - MY + 7, f"Statement date {STMT_DATE}")
    _footer(canvas, doc.page)
    canvas.restoreState()

# -- HELPERS ----------------------------------------------------------------
def hairline():
    hr = HRFlowable(width="100%", thickness=0.5, color=C_INK,
                    spaceAfter=10, spaceBefore=4)
    hr.keepWithNext = 1
    return hr

def section(eyebrow, heading):
    return [Spacer(1, 4),
            Paragraph(eyebrow.upper(), ST["eyebrow"]),
            Paragraph(heading, ST["h2"]),
            hairline()]

def kv_panel(pairs, col_w=None):
    """Two-column key/value panel on the pale sand ground."""
    col_w = col_w or CONTENT_W
    # 150pt on the value column so the longest value ("Lifestart Student Account",
    # "2 April 2026 to 4 July 2026") sets on one line at 9.5pt Body-Bold.
    data = [[Paragraph(k, ST["kv_k"]), Paragraph(v, ST["kv_v"])] for k, v in pairs]
    inner = Table(data, colWidths=[col_w - 26 - 150, 150])
    inner.setStyle(TableStyle([
        ('TOPPADDING',    (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING',   (0, 0), (-1, -1), 0),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 0),
    ]))
    outer = Table([[inner]], colWidths=[col_w])
    outer.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (-1, -1), BG_PANEL),
        ('LINEBEFORE',    (0, 0), (-1, -1), 2.5, C_INK),
        ('TOPPADDING',    (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING',   (0, 0), (-1, -1), 12),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 10),
    ]))
    return KeepTogether([outer, Spacer(1, 10)])

def callout(text):
    p = Paragraph(text.replace("\n", "<br/>"),
                  ParagraphStyle("cbt", fontName="Body", fontSize=10,
                                 textColor=C_BODY, leading=16, alignment=TA_LEFT))
    t = Table([[p]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0, 0), (-1, -1), BG_PANEL),
        ('LINEBEFORE',    (0, 0), (-1, -1), 2, C_INK),
        ('LINEBELOW',     (0, 0), (-1, -1), 0.5, C_INK),
        ('TOPPADDING',    (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LEFTPADDING',   (0, 0), (-1, -1), 10),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 10),
    ]))
    return KeepTogether([t, Spacer(1, 8)])

# -- MONEY ------------------------------------------------------------------
def _dec(s):
    return Decimal(s.replace(",", ""))

def _fmt(d):
    return f"{d:,.2f}"

def _amount(value, is_credit):
    return f"{value} Cr" if is_credit else value

# -- TRANSACTION TABLE ------------------------------------------------------
# Fixed columns first, remainder to Description - widths must sum to CONTENT_W.
COL_DATE, COL_AMT, COL_BAL, COL_CHG = 46, 76, 82, 54
COL_DESC = CONTENT_W - (COL_DATE + COL_AMT + COL_BAL + COL_CHG)
COLS = [COL_DATE, COL_DESC, COL_AMT, COL_BAL, COL_CHG]

def txn_table():
    header = [Paragraph("Date", ST["th"]),
              Paragraph("Description", ST["th"]),
              Paragraph("Amount", ST["th_r"]),
              Paragraph("Balance", ST["th_r"]),
              Paragraph("Charge", ST["th_r"])]
    data = [header]
    style = [
        ('TOPPADDING',    (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING',   (0, 0), (-1, -1), 6),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 6),
        ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW',     (0, 0), (-1, -1), 0.4, C_RULE),
        ('BACKGROUND',    (0, 0), (-1, 0), BG_PANEL),
        ('LINEBELOW',     (0, 0), (-1, 0), 1, C_INK),
    ]

    r = 1
    seen = None
    for date, desc, amt, amt_cr, bal, bal_cr, chg in TXNS:
        month = date.split()[1]
        if month != seen:
            seen = month
            data.append([Paragraph(MONTHS[month], ST["td_month"]), "", "", "", ""])
            style += [('SPAN',       (0, r), (-1, r)),
                      ('BACKGROUND', (0, r), (-1, r), BG_PANEL),
                      ('LINEBELOW',  (0, r), (-1, r), 0.4, C_RULE)]
            r += 1
        data.append([
            Paragraph(date, ST["td"]),
            Paragraph(desc if desc else "&#8212;", ST["td"]),
            Paragraph(_amount(amt, amt_cr), ST["td_r"]),
            Paragraph(_amount(bal, bal_cr), ST["td_r"]),
            Paragraph(chg or "", ST["td_r"]),
        ])
        r += 1

    t = Table(data, colWidths=COLS, repeatRows=1)
    t.setStyle(TableStyle(style))
    return t

# -- BUILD ------------------------------------------------------------------
def build():
    os.makedirs(OUT_DIR, exist_ok=True)
    doc = BaseDocTemplate(OUT_PATH, pagesize=A4,
                          topMargin=MY, bottomMargin=MY,
                          leftMargin=MX, rightMargin=MX,
                          title=f"Account Statement - {HOLDER}",
                          author="Booklesss")

    first_tpl = PageTemplate(id="first",
        frames=[Frame(MX, MY + 5, CONTENT_W, H - 2 * MY - 15)],
        onPage=first_bg, pagesize=A4)
    body_tpl = PageTemplate(id="body",
        frames=[Frame(MX, MY + 5, CONTENT_W, H - 2 * MY - 15)],
        onPage=page_bg, onPageEnd=body_page, pagesize=A4)
    doc.addPageTemplates([first_tpl, body_tpl])

    # Totals computed from the rows, not transcribed - the document checks itself.
    credits = [t for t in TXNS if t[3]]
    debits  = [t for t in TXNS if not t[3]]
    total_cr = sum(_dec(t[2]) for t in credits)
    total_dr = sum(_dec(t[2]) for t in debits)
    charges  = sum(_dec(t[6]) for t in TXNS if t[6])

    # The document checks itself against the source figures before it renders.
    assert _dec(OPENING) + total_cr - total_dr == _dec(CLOSING), "balances do not reconcile"
    assert _dec(SERVICE_FEES) + _dec(OTHER_FEES) == charges, "charges do not reconcile"

    story = []

    # -- Masthead
    story.append(Spacer(1, 26))
    story.append(Paragraph("Account Statement", ST["doc_title"]))
    story.append(Paragraph(f"{HOLDER} &#183; {PERIOD}", ST["doc_sub"]))
    story.append(Spacer(1, 10))
    story.append(hairline())

    # Up front, not appended at the end: what this document is has to be read before
    # the figures are, and trailing it left a near-empty final page.
    story.append(callout(
        "<b>About this document.</b> Booklesss prepared this statement from its own "
        "account records for the period shown. It is a working summary for internal "
        "and bookkeeping use - it is not issued by a bank and is not a bank "
        "certificate of balance. Personal identifiers have been masked: account and "
        "card numbers show their last four digits only, and counterparty names are "
        "reduced to a label. Query any entry against the bank's own statement, which "
        "remains the record of account."))

    # -- Account
    story += section("Account", "Who this statement covers")
    story.append(kv_panel([
        ("Account holder",   HOLDER),
        ("Account type",     ACCOUNT_TYPE),
        ("Account number",   ACCOUNT_MASK),
        ("Statement number", STMT_NUMBER),
        ("Statement period", PERIOD),
        ("Statement date",   STMT_DATE),
        ("Currency",         CURRENCY),
    ]))

    # -- Balances
    story += section("Position", "Balances")
    story.append(kv_panel([
        ("Opening balance",             f"{OPENING} Cr"),
        ("Total credits (76 entries)",  f"{_fmt(total_cr)} Cr"),
        ("Total debits (82 entries)",   f"{_fmt(total_dr)} Dr"),
        ("Closing balance",             f"{CLOSING} Cr"),
    ]))
    story.append(Paragraph(
        f"Net movement over the period is {_fmt(total_cr - total_dr)} Cr: "
        f"{OPENING} opening plus {_fmt(total_cr - total_dr)} gives the {CLOSING} "
        f"closing balance. Money moved through the account {len(TXNS)} times in three "
        f"months, which is what a working float looks like rather than a held balance.",
        ST["body"]))

    # -- Charges
    # Break here rather than after the charges panel: page 1 holds the account and its
    # balances, page 2 opens with cost and runs straight into the transaction list. Let
    # the charges block fall at the foot of page 1 and it orphans its own heading.
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # The accrued column and the two fee lines are the same money seen twice: charges
    # accrue per entry, then settle as the Service Fees and Value Added Serv Fees
    # debits. Presented as a reconciliation so the panel cannot be read as a sum.
    story += section("Cost", "What the account cost to run")
    story.append(kv_panel([
        ("Charges accrued across the period",   f"{_fmt(charges)} Dr"),
        ("Settled as service fees",             f"{SERVICE_FEES} Dr"),
        ("Settled as value-added service fees", f"{OTHER_FEES} Dr"),
        ("Cash deposit and handling fees",      "0.00"),
        ("Total VAT",                           "0.00"),
        ("Credit interest rate",                CREDIT_RATE),
        ("Debit interest rate",                 DEBIT_RATE),
    ]))
    story.append(Paragraph(
        f"The two settled lines are the accrued total, not additional cost: "
        f"{SERVICE_FEES} plus {OTHER_FEES} is {_fmt(charges)}. Charges are raised per "
        f"entry, shown in the Charge column of the transaction list, so what this "
        f"account costs tracks how often it is used rather than what it holds.",
        ST["note"]))

    # -- Transactions
    story += section("Detail", f"Transactions in {CURRENCY}")
    story.append(Paragraph(
        "Credits carry a Cr suffix; debits are shown plain. The Charge column is the "
        "accrued bank charge raised against that entry. Entries shown as &#8212; carried "
        "no description on the source statement.", ST["note"]))
    story.append(Spacer(1, 6))
    story.append(txn_table())
    story.append(Spacer(1, 12))

    # -- Turnover
    story += section("Summary", "Turnover for the period")
    turn = Table([
        [Paragraph("Credit transactions", ST["total_k"]),
         Paragraph(f"{len(credits)}", ST["total_v"]),
         Paragraph(f"{_fmt(total_cr)} Cr", ST["total_v"])],
        [Paragraph("Debit transactions", ST["total_k"]),
         Paragraph(f"{len(debits)}", ST["total_v"]),
         Paragraph(f"{_fmt(total_dr)} Dr", ST["total_v"])],
        [Paragraph("Closing balance", ST["total_k"]),
         Paragraph("", ST["total_v"]),
         Paragraph(f"{CLOSING} Cr", ST["total_v"])],
    ], colWidths=[CONTENT_W - 60 - 120, 60, 120])
    turn.setStyle(TableStyle([
        ('TOPPADDING',    (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING',   (0, 0), (-1, -1), 0),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 0),
        ('LINEBELOW',     (0, 0), (-1, 1), 0.4, C_RULE),
        ('LINEABOVE',     (0, 2), (-1, 2), 1, C_INK),
    ]))
    story.append(KeepTogether([turn, Spacer(1, 12)]))

    doc.build(story)
    print("Written:", os.path.abspath(OUT_PATH))
    print(f"  {len(TXNS)} transactions | credits {_fmt(total_cr)} | "
          f"debits {_fmt(total_dr)} | charges {_fmt(charges)}")


if __name__ == "__main__":
    build()
