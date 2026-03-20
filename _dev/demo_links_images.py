import sys
sys.stdout.reconfigure(encoding='utf-8')

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                 TableStyle, HRFlowable, Image as RLImage)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Circle
from reportlab.graphics import renderPDF
from reportlab.platypus.flowables import Flowable
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageDraw, ImageFont
import io, os

# ── Fonts ─────────────────────────────────────────────────────────────────────
F = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Calibri",        F + r"\calibri.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Bold",   F + r"\calibrib.ttf"))
pdfmetrics.registerFont(TTFont("Calibri-Italic", F + r"\calibrii.ttf"))

# ── Colours ───────────────────────────────────────────────────────────────────
BG      = colors.HexColor("#F5F0E8")
NAVY    = colors.HexColor("#1B2A4A")
AMBER   = colors.HexColor("#C17E3A")
TEAL    = colors.HexColor("#0E6B6B")
BODY    = colors.HexColor("#2C2C2C")
LINK    = colors.HexColor("#1155CC")
WHITE   = colors.white
MID_GRY = colors.HexColor("#888888")
LT_NAV  = colors.HexColor("#E8ECF3")
LT_TEAL = colors.HexColor("#E0F0F0")
LT_AMB  = colors.HexColor("#FDF3E3")
ROSE    = colors.HexColor("#8B2635")

W, H    = A4
MARGIN  = 2.5 * cm
USABLE  = W - 2 * MARGIN
OUT     = r"C:\Users\deeky\OneDrive\Desktop\Booklesss\demo_links_images.pdf"

def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFont("Calibri", 8)
    canvas.setFillColor(MID_GRY)
    canvas.drawString(MARGIN, H - MARGIN + 10, "Booklesss — Links, Images & Media Demo")
    canvas.drawRightString(W - MARGIN, H - MARGIN + 10, "Calibri")
    canvas.setStrokeColor(AMBER)
    canvas.setLineWidth(1)
    canvas.line(MARGIN, H - MARGIN + 5, W - MARGIN, H - MARGIN + 5)
    canvas.setFillColor(AMBER)
    canvas.drawCentredString(W / 2, MARGIN - 12, "— " + str(doc.page) + " —")
    canvas.restoreState()

def S(name, **kw):
    d = dict(fontName="Calibri", fontSize=10, textColor=BODY, leading=16)
    d.update(kw)
    return ParagraphStyle(name, **d)

s_body  = S("body", spaceAfter=6)
s_label = S("lbl", fontName="Calibri-Bold", fontSize=8, textColor=MID_GRY, spaceAfter=4, spaceBefore=16)
s_h1    = S("h1", fontName="Calibri-Bold", fontSize=20, textColor=NAVY, leading=26, spaceAfter=10)
s_h2    = S("h2", fontName="Calibri-Bold", fontSize=14, textColor=NAVY, leading=20, spaceBefore=20, spaceAfter=8)
s_note  = S("note", fontName="Calibri-Italic", fontSize=9, textColor=MID_GRY, leading=14)

def SP(n=8): return Spacer(1, n)
def HR(): return HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#D4C9B0"), spaceAfter=8)

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 1 — HYPERLINKS
# ══════════════════════════════════════════════════════════════════════════════

story = [SP(10)]
story.append(Paragraph("Lesson 1.1 — Introduction to Treasury Management", s_h1))
story.append(HR())

story.append(Paragraph("Links", s_h2))
story.append(Paragraph(
    "PDF supports fully clickable hyperlinks. Click any of the links below — "
    "they open in your browser just like a webpage.", s_body))
story.append(SP(6))

# Inline text link using ReportLab's <a href> tag
story.append(Paragraph("— Label", S("lbl2", fontName="Calibri-Bold", fontSize=8, textColor=MID_GRY, spaceAfter=2)))
story.append(Paragraph(
    '<a href="https://gamma.app" color="#1155CC"><u>View Gamma Deck — Lesson 1.1</u></a>',
    S("link1", fontName="Calibri-Bold", fontSize=12, textColor=LINK, leading=18)))

story.append(SP(8))
story.append(Paragraph("— Resource link with context", S("lbl3", fontName="Calibri-Bold", fontSize=8, textColor=MID_GRY, spaceAfter=2)))
story.append(Paragraph(
    'Full lecture notes available in the Booklesss Slack workspace: '
    '<a href="https://booklesss20.slack.com" color="#1155CC"><u>booklesss20.slack.com</u></a>',
    s_body))

story.append(SP(8))
story.append(Paragraph("— Button-style link using a table cell", S("lbl4", fontName="Calibri-Bold", fontSize=8, textColor=MID_GRY, spaceAfter=2)))

# Button link — a coloured table cell wrapping a linked paragraph
btn = Table([[
    Paragraph(
        '<a href="https://gamma.app" color="#FFFFFF"><b>Open Gamma Deck &rarr;</b></a>',
        S("btn", fontName="Calibri-Bold", fontSize=11, textColor=WHITE, leading=16)
    )
]], colWidths=[6 * cm])
btn.setStyle(TableStyle([
    ("BACKGROUND",   (0,0), (-1,-1), NAVY),
    ("ALIGN",        (0,0), (-1,-1), "CENTER"),
    ("LEFTPADDING",  (0,0), (-1,-1), 14),
    ("RIGHTPADDING", (0,0), (-1,-1), 14),
    ("TOPPADDING",   (0,0), (-1,-1), 10),
    ("BOTTOMPADDING",(0,0), (-1,-1), 10),
    ("ROUNDEDCORNERS", [6]),
]))
story.append(btn)

story.append(SP(8))
story.append(Paragraph("— Multiple inline links in running text", S("lbl5", fontName="Calibri-Bold", fontSize=8, textColor=MID_GRY, spaceAfter=2)))
story.append(Paragraph(
    'For this topic, see '
    '<a href="https://gamma.app" color="#1155CC"><u>the Gamma deck</u></a>, '
    'the <a href="https://booklesss20.slack.com" color="#1155CC"><u>#bbf4302-foundations</u></a> '
    'channel, or the '
    '<a href="https://booklesss.framer.ai" color="#1155CC"><u>Booklesss website</u></a>.',
    s_body))

story.append(SP(4))
story.append(Paragraph(
    "Note: links are fully clickable in any PDF viewer (Adobe, browser PDF, Preview on Mac).",
    s_note))

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 2 — IMAGES
# ══════════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Images", s_h2))
story.append(Paragraph(
    "Images embed directly into the PDF at full resolution. PNG and JPG both work. "
    "Below are three examples — a banner, a diagram screenshot placeholder, and a photo.", s_body))
story.append(SP(8))

# ── Generate placeholder images with Pillow ────────────────────────────────────

def pil_to_buf(pil_img):
    """Convert a Pillow image to a BytesIO buffer for ReportLab."""
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    buf.seek(0)
    return buf

# Image 1: Course banner
banner_w, banner_h = 900, 200
banner = Image.new("RGB", (banner_w, banner_h), color=(27, 42, 74))
draw = ImageDraw.Draw(banner)
# Amber accent strip
draw.rectangle([0, 0, banner_w, 8], fill=(193, 126, 58))
draw.rectangle([0, banner_h-8, banner_w, banner_h], fill=(193, 126, 58))
# Text (using default font since we can't load TTF into Pillow easily here)
draw.text((40, 60),  "BBF4302 — Treasury Management", fill=(255, 255, 255))
draw.text((40, 110), "Lesson 1.1: Introduction to Treasury Management", fill=(193, 126, 58))
draw.text((40, 150), "Booklesss  |  booklesss.framer.ai", fill=(136, 136, 136))

banner_rl = pil_to_buf(banner)
story.append(Paragraph("— Course banner (generated image)", S("lbl6", fontName="Calibri-Bold", fontSize=8, textColor=MID_GRY, spaceAfter=4)))
story.append(RLImage(banner_rl, width=USABLE, height=USABLE * (banner_h/banner_w)))
story.append(SP(12))

# Image 2: Diagram placeholder (like a Gamma screenshot)
diag_w, diag_h = 800, 400
diag = Image.new("RGB", (diag_w, diag_h), color=(240, 245, 240))
dd = ImageDraw.Draw(diag)
# Simple pyramid
pts = [(400, 40), (100, 360), (700, 360)]
dd.polygon(pts, fill=(14, 107, 107), outline=(255,255,255))
dd.text((330, 100), "Strategic",   fill=(255,255,255))
dd.text((280, 200), "Tactical",    fill=(255,255,255))
dd.text((250, 300), "Operational", fill=(255,255,255))
dd.text((20, 10), "Gamma screenshot — paste your actual Gamma image here", fill=(136,136,136))

diag_rl = pil_to_buf(diag)
story.append(Paragraph("— Diagram image (paste actual Gamma screenshot here)", S("lbl7", fontName="Calibri-Bold", fontSize=8, textColor=MID_GRY, spaceAfter=4)))
story.append(RLImage(diag_rl, width=USABLE * 0.8, height=USABLE * 0.8 * (diag_h/diag_w)))
story.append(SP(12))

# Image 2: small logo-style badge
badge_sz = 160
badge = Image.new("RGBA", (badge_sz, badge_sz), color=(0,0,0,0))
bd = ImageDraw.Draw(badge)
bd.ellipse([0, 0, badge_sz-1, badge_sz-1], fill=(27, 42, 74))
bd.text((20, 55), "B", fill=(193, 126, 58))
bd.text((50, 70), "BOOKLESSS", fill=(255,255,255))

badge_rl = pil_to_buf(badge)

# Inline: image + text side by side using a table
inline = Table([
    [RLImage(badge_rl, width=2.8*cm, height=2.8*cm),
     Paragraph(
         "Images can be placed inline with text using a table layout. "
         "This works well for logos, icons, or any graphic that needs to sit "
         "beside a paragraph. The image scales to whatever size you set and "
         "stays sharp because it is embedded at full resolution.",
         s_body
     )]
], colWidths=[3.2*cm, USABLE - 3.2*cm])
inline.setStyle(TableStyle([
    ("VALIGN",       (0,0), (-1,-1), "MIDDLE"),
    ("LEFTPADDING",  (0,0), (0,-1), 0),
    ("RIGHTPADDING", (0,0), (0,-1), 12),
    ("TOPPADDING",   (0,0), (-1,-1), 0),
    ("BOTTOMPADDING",(0,0), (-1,-1), 0),
]))
story.append(Paragraph("— Image inline with text", S("lbl8", fontName="Calibri-Bold", fontSize=8, textColor=MID_GRY, spaceAfter=4)))
story.append(inline)

# ══════════════════════════════════════════════════════════════════════════════
# SECTION 3 — VIDEO NOTE
# ══════════════════════════════════════════════════════════════════════════════

story.append(Paragraph("Video", s_h2))
story.append(Paragraph(
    "PDF does not support embedded video in a way that works reliably across "
    "all viewers (phones, browsers, Adobe). The practical solution is a "
    "<b>clickable thumbnail</b> — an image that looks like a video player, "
    "linked to the actual video URL.", s_body))
story.append(SP(8))

# Video thumbnail placeholder
thumb_w, thumb_h = 800, 450
thumb = Image.new("RGB", (thumb_w, thumb_h), color=(20, 20, 30))
td = ImageDraw.Draw(thumb)
# Play button triangle
cx, cy = thumb_w//2, thumb_h//2
r = 60
td.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(193, 126, 58))
td.polygon([(cx-20, cy-35), (cx-20, cy+35), (cx+40, cy)], fill=(255,255,255))
td.text((20, 20), "Lesson 1.1 — Introduction to Treasury Management", fill=(255,255,255))
td.text((20, thumb_h-30), "Click to watch on YouTube", fill=(136,136,136))
td.rectangle([0, 0, thumb_w-1, thumb_h-1], outline=(193,126,58), width=3)

thumb_rl = pil_to_buf(thumb)
story.append(Paragraph("— Clickable video thumbnail (click the image)", S("lbl9", fontName="Calibri-Bold", fontSize=8, textColor=MID_GRY, spaceAfter=4)))

# Wrap the image in an anchor — done at canvas level via a custom flowable
class LinkedImage(Flowable):
    def __init__(self, img_reader, width, height, url):
        Flowable.__init__(self)
        self.img_reader = img_reader
        self.width  = width
        self.height = height
        self.url    = url
    def draw(self):
        from reportlab.lib.utils import ImageReader
        self.canv.drawImage(ImageReader(self.img_reader), 0, 0,
                            width=self.width, height=self.height,
                            preserveAspectRatio=True)
        self.canv.linkURL(self.url,
                          (0, 0, self.width, self.height),
                          relative=1)

thumb_h_scaled = USABLE * 0.65 * (thumb_h / thumb_w)
story.append(LinkedImage(thumb_rl, USABLE * 0.65, thumb_h_scaled,
                         "https://youtube.com"))

story.append(SP(8))
story.append(Paragraph(
    "Clicking the thumbnail above opens the video in a browser. "
    "You can do the same with a Gamma link, a Loom recording, or any URL. "
    "The image itself can be an actual screenshot from your video.",
    s_note))

# ── Build ──────────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN + 0.4*cm, bottomMargin=MARGIN,
)
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print("Saved: " + OUT)
