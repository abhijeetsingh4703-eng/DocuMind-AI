import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.retrievers import BM25Retriever
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()

# Global state — no model downloads, no vector DB, starts instantly!
all_splits = []
retriever = None
llm = ChatGroq(model="llama-3.1-8b-instant", api_key=os.environ.get("GROQ_API_KEY", ""))

def process_pdf(file_path: str):
    global all_splits, retriever

    # 1. Load PDF
    loader = PyPDFLoader(file_path)
    docs = loader.load()

    # 2. Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    new_splits = text_splitter.split_documents(docs)

    # 3. Add to in-memory BM25 index (no downloads needed!)
    all_splits.extend(new_splits)
    retriever = BM25Retriever.from_documents(all_splits, k=4)

def ask_question(query: str) -> str:
    global retriever, llm

    if retriever is None:
        return "Please upload a document first before asking questions."

    system_prompt = (
        "You are DocuMind AI, an intelligent assistant designed to help users understand their documents. "
        "Use the following pieces of retrieved context to answer the question. "
        "If you don't know the answer based on the context, just say that you don't know. "
        "Keep the answer concise and well-formatted.\n\n"
        "{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "input": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    try:
        response = rag_chain.invoke(query)
        return response
    except Exception as e:
        return f"An error occurred: {str(e)}"
