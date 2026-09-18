import json
import logging
from typing import Optional
from app.config import GEMINI_API_KEY
from app.schemas.analysis import AnalysisResponse, RewriteBulletResponse
from app.services.nlp_engine import analyze_resume_nlp

logger = logging.getLogger(__name__)

def analyze_resume_with_gemini(resume_text: str, jd_text: Optional[str] = None, target_role: Optional[str] = None) -> AnalysisResponse:
    """
    Uses Gemini API to perform deep structural, semantic, and ATS critique
    on the user's actual resume text.
    """
    if not GEMINI_API_KEY or not GEMINI_API_KEY.strip():
        logger.info("No GEMINI_API_KEY found. Using heuristic NLP engine.")
        return analyze_resume_nlp(resume_text, jd_text, target_role)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=GEMINI_API_KEY)

        system_instruction = """
You are an Elite Executive Tech Recruiter and Chief ATS Optimization Architect.
Analyze the user's REAL resume text meticulously against modern Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo) and optional Job Description.

You MUST return a clean, strictly valid JSON matching this schema:
{
  "overall_score": 78,
  "candidate_name": "Extracted Name or Candidate",
  "detected_role": "Target or Inferred Title",
  "experience_level": "Entry / Mid / Senior / Lead",
  "summary": "2-3 concise, punchy sentences summarizing overall ATS readiness and competitive edge.",
  "word_count": 480,
  "reading_time_seconds": 90,
  "sub_scores": {
    "ats_formatting": 85,
    "keyword_match": 72,
    "quantifiable_impact": 65,
    "brevity_and_style": 88
  },
  "skill_breakdown": [
    {
      "category": "Languages & Core",
      "matched": ["Python", "TypeScript"],
      "missing": ["Go", "SQL"]
    },
    {
      "category": "Frameworks & Web",
      "matched": ["React", "FastAPI"],
      "missing": ["Next.js"]
    },
    {
      "category": "Cloud & Infrastructure",
      "matched": ["Docker", "AWS"],
      "missing": ["Kubernetes", "Terraform"]
    }
  ],
  "bullet_improvements": [
    {
      "original": "Exact weak line from candidate's resume",
      "improved": "Rewritten XYZ bullet (Action Verb + Context + Quantified Metric/Outcome)",
      "reason": "Why this change is superior for ATS and human reviewers",
      "impact_level": "High"
    }
  ],
  "section_audit": [
    {
      "section": "Contact Information",
      "status": "Pass",
      "feedback": "All links and details valid",
      "recommendation": "Maintain standard header"
    },
    {
      "section": "Experience",
      "status": "Warning",
      "feedback": "Bullets lack quantifiable metrics",
      "recommendation": "Add % and $ metrics"
    }
  ],
  "action_plan": [
    {
      "priority": 1,
      "title": "Quantify Career Achievements",
      "description": "Add at least 3 concrete numbers or percent metrics to recent roles.",
      "expected_score_boost": "+10 pts"
    }
  ]
}
Return pure JSON only. No markdown fences, no preamble.
"""

        user_content = f"--- RESUME CONTENT ---\n{resume_text}\n"
        if jd_text:
            user_content += f"\n--- TARGET JOB DESCRIPTION ---\n{jd_text}\n"
        if target_role:
            user_content += f"\n--- TARGET ROLE ---\n{target_role}\n"

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_content,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                temperature=0.1
            )
        )

        raw_json = response.text.strip()
        data = json.loads(raw_json)
        
        # Inject metadata
        data["raw_text_preview"] = resume_text[:1200] + ("..." if len(resume_text) > 1200 else "")
        data["mode_used"] = "gemini_ai"
        
        return AnalysisResponse(**data)
        
    except Exception as e:
        logger.error(f"Gemini API analysis failed: {e}. Falling back to NLP engine.")
        res = analyze_resume_nlp(resume_text, jd_text, target_role)
        return res

def rewrite_bullet_with_ai(bullet: str, target_role: Optional[str] = None, target_skill: Optional[str] = None) -> RewriteBulletResponse:
    """
    Rewrites a single bullet point using AI or heuristic XYZ template.
    """
    if GEMINI_API_KEY and GEMINI_API_KEY.strip():
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=GEMINI_API_KEY)
            prompt = f"Rewrite this resume bullet point into a high-impact Google XYZ formula (Accomplished [X], as measured by [Y], by doing [Z]).\nBullet: {bullet}\nRole: {target_role or 'Tech Specialist'}\nSkill to emphasize: {target_skill or 'General'}\nOutput valid JSON with fields: original, improved, metrics_added (bool), action_verb_used (string), explanation (string)."

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            data = json.loads(response.text.strip())
            return RewriteBulletResponse(**data)
        except Exception as e:
            logger.warning(f"AI bullet rewrite fallback: {e}")

    # Heuristic rewrite
    return RewriteBulletResponse(
        original=bullet,
        improved=f"Architected and delivered {bullet.lstrip('•-* ')}, increasing throughput by 32% and reducing deployment cycle time from 4 days to 35 minutes.",
        metrics_added=True,
        action_verb_used="Architected",
        explanation="Infused senior action verb and quantified performance impact."
    )
