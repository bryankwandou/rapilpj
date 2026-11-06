import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
import fitz

IDENTITY = [
    ("Team name", "Tide Ledger"),
    ("Project title", "RapiLPJ: Checking Student Organization Activity Reports Before Submission"),
    ("Selected case", "Case 1: Smarter Campus and Learning"),
    ("Members", "Vincentius Bryan Kwandou (leader), Valentino Filemon Limer, Putra Purwanugraha Tengbunan, Marvel Harjosetio"),
]
SECTIONS = [
    ("1. Problem", "Student organization treasurers must submit an accountability report (LPJ) after every funded activity before funds are released. Faculty rules are detailed and vary, covering receipt stamps, matching totals, attendance sheets, revenue stamps, taxes, and deadlines. At Brawijaya's Faculty of Computer Science, late or incomplete reports are returned, and the organization's next proposal can be delayed or rejected [5]."),
    ("2. Intended Users", "Treasurers and secretaries of Indonesian student organizations, such as study program associations, student executive boards, and clubs, who prepare activity reports several times each semester, often without accounting training."),
    ("3. Supporting Observations or Evidence", "We read five official faculty documents. Brawijaya's Faculty of Cultural Studies requires stamped original receipts, one attendance sheet per meal session, and identical totals across the approval page, expense table, and receipts [1]. UGM's Faculty of Economics and Business requires a revenue stamp on receipts of Rp5,000,000 or more and asks that fading thermal receipts be scanned [2]. An ITS department sets a ten-day deadline [3], and ITS Biology requires one entry per receipt with tax included [4]. Interviews in a published study found that officers struggled to classify and record expenses [6]. We have not yet measured how often reports are revised. A treasurer survey is our first validation step."),
    ("4. Proposed Solution and Core User Flow", "RapiLPJ is a web checker. A treasurer selects their faculty's rule set, enters the activity date, the approved total, meal sessions, and attendance sheets, and lists the planned budget and each receipt with simple checkboxes. RapiLPJ then lists every problem in plain Indonesian, each linked to the official rule behind it, and shows planned versus actual spending per item. The treasurer can export the table as CSV or print it. A working prototype covers these flows for five faculty rule sets, including working-day deadlines."),
    ("5. How It Differs from Existing Alternatives", "Some campuses run online systems for submitting reports and tracking status; those we found serve only their own campus and focus on submission rather than checking. Spreadsheets and templates record numbers but do not check rules. RapiLPJ checks a report before submission and cites the faculty document for each rule. Our search found no comparable public tool for treasurers, although the search was not exhaustive."),
    ("6. Planned Technologies", "A static web application in HTML, CSS, and JavaScript. No account or server is used, so financial records stay in the browser. Rules are stored as structured data with source links. AI is not used, because checks must be exact and auditable."),
    ("7. Expected Benefit and Development Plan", "Expected benefit: fewer returned reports and faster preparation. We will survey 30 treasurers and compare preparation time and errors with and without the tool for 10 treasurers. No user results exist yet. Plan: week 1 survey and receipt photo upload; week 2 add rule sets from more faculties; week 3 run the comparison and fix issues. The main risk is outdated or missing rules, addressed through visible sources and a custom rule set."),
]
SOURCES = "[1] Pedoman Laporan Pertanggung Jawaban, FIB Universitas Brawijaya, fib.ub.ac.id. [2] Prosedur Pengajuan Proposal dan LPJ ke SIPRO, FEB UGM, bpm.feb.ugm.ac.id. [3] SOP HIMA, Departemen Desain Interior ITS, its.ac.id. [4] SOP Laporan Pertanggung Jawaban Kegiatan Mahasiswa Biologi, ITS, its.ac.id. [5] Surat Edaran Mekanisme Proposal dan LPJ Ormawa, FILKOM Universitas Brawijaya, 2026, filkom.ub.ac.id. [6] Study of student organization financial records at STIESNU Bengkulu, ejournal.iainkerinci.ac.id (al-Dzahab). AI disclosure: Claude supported research, prototype code, and drafting."

words = sum(len(re.findall(r"\S+", h + " " + b)) for h, b in SECTIONS)
assert 300 <= words <= 500, words
print("words", words)
base = ParagraphStyle("b", fontName="Helvetica", fontSize=9.6, leading=12.4, spaceAfter=5.5)
small = ParagraphStyle("s", parent=base, fontSize=7.8, leading=10, textColor=colors.HexColor("#333333"))
cell = ParagraphStyle("c", parent=base, spaceAfter=0)
out = r"E:\Download\rapilpj\abstract\TideLedger_Abstract_STACK2026.pdf"
doc = SimpleDocTemplate(out, pagesize=A4, leftMargin=2.2*cm, rightMargin=2.2*cm, topMargin=1.8*cm, bottomMargin=1.6*cm, title="RapiLPJ Abstract", author="Tide Ledger")
t = Table([[Paragraph(f"<b>{a}</b>", cell), Paragraph(b, cell)] for a, b in IDENTITY], colWidths=[3.2*cm, 13.4*cm])
t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), .5, colors.HexColor("#999999")), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#eeeeee"))]))
flow = [t, Spacer(1, 9), Paragraph("<b>Abstract</b>", base)] + [Paragraph(f"<b>{h}.</b> {b}", base) for h, b in SECTIONS] + [Paragraph(f"<b>Source Acknowledgments.</b> {SOURCES}", small)]
doc.build(flow)
d = fitz.open(out); print("pages", len(d))
d[0].get_pixmap(dpi=80).save(r"E:\Download\rapilpj\abstract\preview.png")
