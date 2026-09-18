from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn
import os

from parser import parse_resume_file, extract_skills, extract_contact_info, segment_sections, extract_bullets
from analyzer import calculate_ats_score, optimize_bullet_text, ROLE_BENCHMARKS

app = FastAPI(
    title="AI Resume Analyzer API",
    description="High-performance backend for parsing and evaluating resumes with ATS scoring & keyword analysis",
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

class BulletRequest(BaseModel):
    bullet: str
    target_role: Optional[str] = "Full Stack Engineer"

class TextAnalysisRequest(BaseModel):
    text: str
    target_role: Optional[str] = "Full Stack Engineer"
    custom_jd: Optional[str] = None

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "engine": "FastAPI + Hybrid AI & ATS Engine",
        "version": "2.0.0",
        "supported_formats": ["pdf", "docx", "txt", "md"]
    }

@app.get("/api/roles")
async def get_roles():
    roles_summary = []
    for role_name, data in ROLE_BENCHMARKS.items():
        roles_summary.append({
            "name": role_name,
            "core_skills_sample": data["core_skills"][:6]
        })
    return {"roles": roles_summary}

@app.post("/api/analyze")
async def analyze_resume_file(
    file: UploadFile = File(...),
    target_role: str = Form("Full Stack Engineer"),
    custom_jd: Optional[str] = Form(None)
):
    try:
        content_bytes = await file.read()
        if not content_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        filename = file.filename or "resume.pdf"
        parsed_data = parse_resume_file(filename, content_bytes)
        analysis_result = calculate_ats_score(parsed_data, target_role, custom_jd)

        return {
            "success": True,
            "parsed": parsed_data,
            "analysis": analysis_result,
            "target_role": target_role
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze resume: {str(e)}")

@app.post("/api/analyze-text")
async def analyze_resume_text(payload: TextAnalysisRequest):
    try:
        raw_text = payload.text.strip()
        if not raw_text:
            raise HTTPException(status_code=400, detail="Resume text is empty.")

        contact = extract_contact_info(raw_text)
        sections = segment_sections(raw_text)
        skills = extract_skills(raw_text)
        combined_exp = sections.get("experience", "") + "\n" + sections.get("projects", "")
        bullets = extract_bullets(combined_exp if combined_exp.strip() else raw_text)

        parsed_data = {
            "filename": "pasted_resume.txt",
            "word_count": len(raw_text.split()),
            "char_count": len(raw_text),
            "contact": contact,
            "sections": sections,
            "skills": skills,
            "bullets": bullets,
            "raw_text": raw_text
        }

        analysis_result = calculate_ats_score(parsed_data, payload.target_role or "Full Stack Engineer", payload.custom_jd)

        return {
            "success": True,
            "parsed": parsed_data,
            "analysis": analysis_result,
            "target_role": payload.target_role
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze text: {str(e)}")

@app.post("/api/optimize-bullet")
async def optimize_single_bullet(payload: BulletRequest):
    try:
        res = optimize_bullet_text(payload.bullet, payload.target_role or "Full Stack Engineer")
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to optimize bullet: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
