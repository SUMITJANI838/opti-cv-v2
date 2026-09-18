import logging
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import DEBUG, PORT
from app.schemas.analysis import AnalysisResponse, RewriteBulletRequest, RewriteBulletResponse
from app.services.analyzer_service import process_and_analyze_document
from app.services.ai_service import rewrite_bullet_with_ai

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ai_resume_analyzer")

app = FastAPI(
    title="AI Resume Analyzer Engine API",
    description="High-performance backend for analyzing real resume documents against ATS standards & job descriptions.",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AI Resume Analyzer V2",
        "version": "2.0.0"
    }

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(..., description="Resume file (.pdf, .docx, .txt)"),
    job_description: Optional[str] = Form(None, description="Optional target job description"),
    target_role: Optional[str] = Form(None, description="Optional target role/title")
):
    try:
        filename = resume.filename or "resume.pdf"
        logger.info(f"Received resume analysis request for file: {filename}")
        
        file_bytes = await resume.read()
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is empty."
            )
            
        result = process_and_analyze_document(
            filename=filename,
            file_bytes=file_bytes,
            job_description=job_description if job_description and job_description.strip() else None,
            target_role=target_role if target_role and target_role.strip() else None
        )
        return result
        
    except ValueError as ve:
        logger.warning(f"Validation error during analysis: {ve}")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ve))
    except Exception as e:
        logger.error(f"Error processing resume: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze resume: {str(e)}"
        )

@app.post("/api/rewrite-bullet", response_model=RewriteBulletResponse)
async def rewrite_bullet(payload: RewriteBulletRequest):
    try:
        if not payload.bullet.strip():
            raise HTTPException(status_code=400, detail="Bullet content is required.")
        return rewrite_bullet_with_ai(
            bullet=payload.bullet,
            target_role=payload.target_role,
            target_skill=payload.target_skill
        )
    except Exception as e:
        logger.error(f"Error rewriting bullet: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=DEBUG)
