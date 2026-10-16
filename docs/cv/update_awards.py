"""Regenerate the two-page CV with its two authorized award entries.

Derived from the original 2026-10-13 add_award.py overlay source. The
pre-awards PDF is read from its immutable Git revision, so regenerating
never stacks duplicate award entries. Requires pypdf, reportlab, and the
Latin Modern fonts available through TeX's kpsewhich command.

Run from any directory: python docs/cv/update_awards.py
"""
from io import BytesIO
from pathlib import Path
import subprocess

from pypdf import PdfReader, PdfWriter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import EmbeddedType1Face, Font
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[2]
BASE_REVISION = "f597893"
OUTPUT = ROOT / "files/CV_Jiahui_Li.pdf"
CARMON_DESCRIPTION = (
    "A university-wide graduate research award with one primary recipient selected annually."
)
NEURIPS_DESCRIPTION = (
    "Full conference and workshop registration, plus an Atlanta hotel stay."
)


def tex_file(name):
    path = subprocess.check_output(["kpsewhich", name], text=True).strip()
    if not path:
        raise FileNotFoundError(name)
    return path


for alias, stem in [("LMRegular", "lmr10"), ("LMBold", "lmbx10"), ("LMHeading", "lmbx12")]:
    face = EmbeddedType1Face(tex_file(stem + ".afm"), tex_file(stem + ".pfb"))
    pdfmetrics.registerTypeFace(face)
    pdfmetrics.registerFont(Font(alias, face.name, "WinAnsiEncoding"))

source = subprocess.check_output(
    ["git", "show", BASE_REVISION + ":files/CV_Jiahui_Li.pdf"], cwd=ROOT
)
reader = PdfReader(BytesIO(source))
assert len(reader.pages) == 2
assert "Carmon" not in "".join(page.extract_text() for page in reader.pages)
overlay = BytesIO()
c = canvas.Canvas(overlay, pagesize=(612, 792))
c.setFillColorRGB(0, 0, 0)
c.setFont("LMHeading", 12.3537)
c.drawString(36, 191, "HONORS AND AWARDS")
c.setLineWidth(0.448)
c.line(36, 188, 576.72, 188)
c.setFont("LMBold", 9.9626)
c.drawString(36, 175, "UGA James L. Carmon Scholarship Award (2027)")
c.setFont("LMRegular", 9.9626)
c.drawString(36, 163.245, "\u2014 " + CARMON_DESCRIPTION)
c.setFont("LMBold", 9.9626)
c.drawString(36, 143.49, "NeurIPS 2026 Financial Assistance Award")
c.setFont("LMRegular", 9.9626)
c.drawString(36, 131.735, "\u2014 " + NEURIPS_DESCRIPTION)
for description in [CARMON_DESCRIPTION, NEURIPS_DESCRIPTION]:
    assert pdfmetrics.stringWidth("\u2014 " + description, "LMRegular", 9.9626) < 540.72
c.save()
overlay.seek(0)
writer = PdfWriter()
writer.clone_document_from_reader(reader)
writer.pages[1].merge_page(PdfReader(overlay).pages[0])
with OUTPUT.open("wb") as output:
    writer.write(output)

updated = PdfReader(OUTPUT)
assert len(updated.pages) == 2
assert updated.pages[0].get_contents().get_data() == reader.pages[0].get_contents().get_data()
assert updated.pages[0].extract_text() == reader.pages[0].extract_text()
assert updated.pages[1].extract_text().startswith(reader.pages[1].extract_text())
assert updated.pages[1].extract_text().count("Carmon") == 1
assert updated.pages[1].extract_text().count("Financial Assistance Award") == 1
assert CARMON_DESCRIPTION in updated.pages[1].extract_text()
assert NEURIPS_DESCRIPTION in updated.pages[1].extract_text()
for before, after in zip(reader.pages, updated.pages):
    def links(page):
        return [(str(a.get_object().get("/Rect")), str(a.get_object().get("/A")))
                for a in page.get("/Annots", [])]
    assert links(before) == links(after)
print("Verified: two pages, original body and all links preserved, each award present once.")
