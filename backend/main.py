from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
from rag import process_pdf, ask_question

app = FastAPI(title="DocuMind AI Backend")

# Setup CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow nextjs default port or all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure temp directory exists for uploads
os.makedirs("temp_uploads", exist_ok=True)

class ChatRequest(BaseModel):
    message: str

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    file_path = f"temp_uploads/{file.filename}"
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Process the PDF using LangChain
        process_pdf(file_path)
        
        # Clean up the temp file
        os.remove(file_path)
        
        return {"status": "success", "message": f"Successfully processed {file.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message is required.")
        
    try:
        answer = ask_question(request.message)
        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
