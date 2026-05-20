import PyPDF2
import docx
import pandas as pd
import tempfile

def extract_text(file, filename):
    ext = filename.lower().strip().split('.')[-1]

    print("Filename received:", filename)
    print("Extension detected:", ext)

    # -------- PDF --------
    if ext == "pdf":
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text

    # -------- DOCX --------
    elif "docx" in filename.lower():
        print("🔥 DOCX BLOCK ENTERED")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
            tmp.write(file.read())
            tmp_path = tmp.name

        file.seek(0)

        doc = docx.Document(tmp_path)
        return "\n".join([para.text for para in doc.paragraphs])

    # -------- TXT --------
    elif ext == "txt":
        file.seek(0)
        return file.read().decode("utf-8")

    # -------- EXCEL --------
    elif ext in ["xlsx", "xls"]:
     file.seek(0)

    try:
        df = pd.read_excel(file, sheet_name=None)  # read all sheets

        text = ""
        for sheet_name, sheet_df in df.items():
            text += f"\nSheet: {sheet_name}\n"
            text += sheet_df.to_string()

        if not text.strip():
            text = "Empty Excel file"

        return text

    except Exception as e:
        print("Excel read error:", e)
        return None

    # -------- UNSUPPORTED --------
    else:
        print("❌ Unsupported file:", filename)
        return None