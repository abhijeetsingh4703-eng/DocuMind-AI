# DocuMind AI

DocuMind AI is an intelligent document analysis and QA assistant. It allows users to upload PDF documents and instantly ask questions about their content using Retrieval-Augmented Generation (RAG) powered by Llama 3.1 (via Groq) and LangChain.

## 🚀 Features

- **Upload PDF Documents**: Seamlessly upload and process your PDFs.
- **Intelligent Q&A**: Ask natural language questions about your document and get instant, context-aware answers.
- **Fast Generation**: Powered by the ultra-fast Groq API and Llama 3.1 model.
- **In-Memory BM25 Indexing**: Fast and lightweight local document retrieval without needing complex vector database setups.
- **Modern UI**: Sleek, fast, and responsive user interface built with Next.js.

## 🛠️ Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/) (App Router)
- React
- Vanilla CSS / CSS Modules

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) (Python)
- [LangChain](https://python.langchain.com/) for RAG pipeline orchestration
- [Groq API](https://groq.com/) for LLM inference (Llama-3.1-8b-instant)
- In-memory BM25 Retriever

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.8+)
- A [Groq API Key](https://console.groq.com/)

### 1. Setup the Backend

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

Install the dependencies:
```bash
pip install -r requirements.txt
```

Set up your environment variables:
- Create a `.env` file in the `backend` directory (you can copy `.env.example` if it exists).
- Add your Groq API key:
  ```env
  GROQ_API_KEY=your_api_key_here
  ```

Start the FastAPI backend:
```bash
python main.py
# Or using uvicorn directly: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API will run on `http://localhost:8000`.

### 2. Setup the Frontend

Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
```

Install the dependencies:
```bash
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
The frontend application will be available at `http://localhost:3000`.

---


<img width="1916" height="936" alt="Screenshot 2026-05-25 231417" src="https://github.com/user-attachments/assets/ff9482bd-28a7-4f3a-80b9-ff1fe7b3750f" />
