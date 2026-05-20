from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
import os
from sqlalchemy import text
from db import SessionLocal
from services.embedding import get_embedding
from services.file_processor import extract_text

app = Flask(__name__)
CORS(app)

# ---------------- HOME ----------------
@app.route("/")
def home():
    return "EduGuard AI Backend Running 🚀"


# ---------------- UPLOAD ----------------
@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files["file"]

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = file.filename

    # 🔥 MULTI-FILE SUPPORT
    text_data = extract_text(file, filename)

    if text_data is None:
      return jsonify({"error": "Unsupported file type"}), 400

    # chunking
    chunk_size = 500
    chunks = [text_data[i:i+chunk_size] for i in range(0, len(text_data), chunk_size)]

    db = SessionLocal()

    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)

        db.execute(
            text("""
                INSERT INTO document_chunks (content, embedding, chunk_index, document_name)
                VALUES (:content, :embedding, :chunk_index, :document_name)
            """),
            {
                "content": chunk,
                "embedding": embedding,
                "chunk_index": i,
                "document_name": filename
            }
        )

    db.commit()
    db.close()

    return jsonify({
        "message": "File processed successfully",
        "chunks": len(chunks)
    })


# ---------------- ASK (RAG) ----------------
@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    query = data.get("query")
    docs = data.get("documents")  # list of files
    doc = data.get("document")    # single file fallback

    if not docs and doc:
        docs = [doc]

    query_embedding = get_embedding(query)
    query_embedding_str = "[" + ",".join(map(str, query_embedding)) + "]"

    db = SessionLocal()

    if docs and len(docs) > 0:
        clean_docs = [d.lower().strip() for d in docs]
        result = db.execute(
            text("""
                SELECT content
                FROM document_chunks
                WHERE LOWER(TRIM(document_name)) IN :docs
                ORDER BY embedding <-> CAST(:query_embedding AS vector)
                LIMIT 10
            """),
            {
                "query_embedding": query_embedding_str,
                "docs": tuple(clean_docs)
            }
        )
    else:
        result = db.execute(
            text("""
                SELECT content
                FROM document_chunks
                ORDER BY embedding <-> CAST(:query_embedding AS vector)
                LIMIT 10
            """),
            {"query_embedding": query_embedding_str}
        )

    # remove duplicates
    chunks = list(dict.fromkeys([row[0] for row in result]))[:3]

    context = "\n".join(chunks)

    response = ollama.chat(
        model="mistral",
        messages=[
            {"role": "system", "content": """
You are an AI assistant.
Answer ONLY from the given context.
If answer is not found, say "Not found in document".
Be precise and structured.
"""},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
        ]
    )

    db.close()

    return jsonify({
        "answer": response["message"]["content"],
        "sources": chunks
    })


# ---------------- SEED ----------------
@app.route("/seed", methods=["POST"])
def seed():
    folder_path = "knowledge_base"

    if not os.path.exists(folder_path):
        return jsonify({"error": "knowledge_base folder not found"}), 400

    db = SessionLocal()
    total_chunks = 0

    for filename in os.listdir(folder_path):

        # 🔥 MULTI-FILE SUPPORT
        if filename.endswith((".pdf", ".docx", ".txt", ".xlsx", ".xls")):
            file_path = os.path.join(folder_path, filename)

            with open(file_path, "rb") as f:
                text_data = extract_text(f, filename)

                if not text_data:
                    continue

                chunk_size = 500
                chunks = [text_data[i:i+chunk_size] for i in range(0, len(text_data), chunk_size)]

                for i, chunk in enumerate(chunks):
                    embedding = get_embedding(chunk)

                    db.execute(
                        text("""
                            INSERT INTO document_chunks (content, embedding, chunk_index, document_name)
                            VALUES (:content, :embedding, :chunk_index, :document_name)
                        """),
                        {
                            "content": chunk,
                            "embedding": embedding,
                            "chunk_index": i,
                            "document_name": filename
                        }
                    )

                total_chunks += len(chunks)

    db.commit()
    db.close()

    return jsonify({
        "message": "Knowledge base created",
        "total_chunks": total_chunks
    })


# ---------------- GET DOCUMENTS ----------------
@app.route("/documents", methods=["GET"])
def get_documents():
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT DISTINCT document_name FROM document_chunks"))
        documents = [row[0] for row in result if row[0]]
        db.close()
        return jsonify({"documents": documents})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)