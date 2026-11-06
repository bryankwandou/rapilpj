import html, importlib.util, fitz

spec = importlib.util.spec_from_file_location("b", r"E:\Download\rapilpj\abstract\build.py")
src = open(spec.origin, encoding="utf-8").read().split("words = sum")[0]
ns = {}
exec(src.replace("import fitz", "").replace("from reportlab", "#"), ns)
IDENTITY, SECTIONS, SOURCES = ns["IDENTITY"], ns["SECTIONS"], ns["SOURCES"]

TPL = r"C:\Users\arche\.gemini\antigravity\brain\633f260b-a099-4ad2-841c-8c28fffa117f\.user_uploaded\media_1793977102758_f11c67cf.pdf"
OUT = r"E:\Download\rapilpj\abstract\TideLedger_Abstract_STACK2026.pdf"

doc = fitz.open(TPL)
doc.select([len(doc) - 1])
page = doc[0]
box = fitz.Rect(66, 82, 529, 790)
page.add_redact_annot(box)
page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED)

e = html.escape
cell_css = "* { font-family: sans-serif; } body { font-size: 9px; color: #202124; } b { font-weight: bold; }"
y, kx, vx, rx = box.y0, box.x0, box.x0 + 120, box.x1
for a, b in IDENTITY:
    h = 32 if len(b) > 85 else 20
    page.draw_rect(fitz.Rect(kx, y, vx, y + h), color=(0.79, 0.81, 0.84), fill=(0.91, 0.94, 1.0), width=0.6)
    page.draw_rect(fitz.Rect(vx, y, rx, y + h), color=(0.79, 0.81, 0.84), fill=(1, 1, 1), width=0.6)
    page.insert_htmlbox(fitz.Rect(kx + 6, y + 5, vx - 4, y + h), f"<b>{e(a)}</b>", css=cell_css)
    page.insert_htmlbox(fitz.Rect(vx + 6, y + 5, rx - 4, y + h), e(b), css=cell_css)
    y += h
box = fitz.Rect(box.x0, y + 8, box.x1, box.y1)
body = "".join(f'<p><span class="h">{e(h)}.</span> {e(b)}</p>' for h, b in SECTIONS)
content = f"""
<h2>Abstract</h2>
{body}
<p class="src"><span class="h">Source Acknowledgments.</span> {e(SOURCES)}</p>
"""
css = """
* { font-family: sans-serif; }
body { font-size: 9px; line-height: 1.38; color: #202124; }
table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
td { border: 0.6px solid #c9ced6; padding: 4px 6px; font-size: 9px; }
td.k { background: #e8f0fe; font-weight: bold; width: 26%; }
h2 { color: #1a73e8; font-size: 11px; margin: 6px 0 3px; }
p { margin: 0 0 4px; text-align: justify; }
.h { color: #1a73e8; font-weight: bold; }
.src { font-size: 8px; color: #333; }
"""
spare, scale = page.insert_htmlbox(box, content, css=css, scale_low=0)
print("spare", spare, "scale", scale)
doc.save(OUT, garbage=4, deflate=True)
d = fitz.open(OUT)
print("pages", len(d))
d[0].get_pixmap(dpi=110).save(r"E:\Download\rapilpj\abstract\preview.png")
