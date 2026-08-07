import io

import pytesseract
from docx import Document as DocxDocument
from openpyxl import load_workbook
from PIL import Image
from pypdf import PdfReader

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".xlsx", ".xls", ".png", ".jpg", ".jpeg", ".txt"}


class UnsupportedFileTypeError(ValueError):
    pass


def extract_text(filename: str, content: bytes) -> str:
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in SUPPORTED_EXTENSIONS:
        raise UnsupportedFileTypeError(f"不支持的文件类型：{ext or '（无扩展名）'}")

    if ext == ".pdf":
        return _extract_pdf(content)
    if ext == ".docx":
        return _extract_docx(content)
    if ext in (".xlsx", ".xls"):
        return _extract_xlsx(content)
    if ext in (".png", ".jpg", ".jpeg"):
        return _extract_image_ocr(content)
    if ext == ".txt":
        return content.decode("utf-8", errors="ignore")
    raise UnsupportedFileTypeError(f"不支持的文件类型：{ext}")


def _extract_pdf(content: bytes) -> str:
    reader = PdfReader(io.BytesIO(content))
    return "\n".join(page.extract_text() or "" for page in reader.pages).strip()


def _extract_docx(content: bytes) -> str:
    doc = DocxDocument(io.BytesIO(content))
    return "\n".join(p.text for p in doc.paragraphs if p.text).strip()


def _extract_xlsx(content: bytes) -> str:
    workbook = load_workbook(io.BytesIO(content), data_only=True, read_only=True)
    lines: list[str] = []
    for sheet in workbook.worksheets:
        for row in sheet.iter_rows(values_only=True):
            cells = [str(cell) for cell in row if cell is not None]
            if cells:
                lines.append(" | ".join(cells))
    return "\n".join(lines).strip()


def _extract_image_ocr(content: bytes) -> str:
    image = Image.open(io.BytesIO(content))
    return pytesseract.image_to_string(image, lang="chi_sim+eng").strip()
