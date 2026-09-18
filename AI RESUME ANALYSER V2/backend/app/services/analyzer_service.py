import os
from typing import Optional, Tuple, Dict, Any
from app.parsers import extract_text_from_pdf, extract_text_from_docx, extract_text_from_raw
from app.services.ai_service import analyze_resume_with_gemini
from app.schemas.analysis import AnalysisResponse

def process_and_analyze_document(
    filename: str,
    file_bytes: bytes,
    job_description: Optional[str] = None,
    target_role: Optional[str] = None
) -> AnalysisResponse:
    """
    Identifies document format, parses real text, and executes AI/NLP analysis.
    """
    ext = os.path.splitext(filename)[1].lower()
    
    if ext == ".pdf":
        text, meta = extract_text_from_pdf(file_bytes)
    elif ext in [".docx", ".doc"]:
        text, meta = extract_text_from_docx(file_bytes)
    else:
        text, meta = extract_text_from_raw(file_bytes)
        
    if not text or not text.strip():
        raise ValueError("Could not extract any readable text from the uploaded document. Please check if the file is an image scan or password-protected.")
        
    return analyze_resume_with_gemini(
        resume_text=text,
        jd_text=job_description,
        target_role=target_role
    )
