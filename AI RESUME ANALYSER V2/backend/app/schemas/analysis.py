from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SubScores(BaseModel):
    ats_formatting: int = Field(..., description="0-100 Score on layout, fonts, header parseability")
    keyword_match: int = Field(..., description="0-100 Score on industry/JD skill density")
    quantifiable_impact: int = Field(..., description="0-100 Score on metrics, numbers, percentages in bullets")
    brevity_and_style: int = Field(..., description="0-100 Score on conciseness, action verb strength, grammar")

class SkillMatch(BaseModel):
    category: str = Field(..., description="e.g. Core Languages, Frameworks, Cloud & DevOps, Soft Skills")
    matched: List[str] = Field(default_factory=list)
    missing: List[str] = Field(default_factory=list)

class BulletPointOptimization(BaseModel):
    original: str = Field(..., description="Original weak bullet point from the resume")
    improved: str = Field(..., description="High-impact rewritten version using XYZ / Action-Metric formula")
    reason: str = Field(..., description="Why this rewrite improves ATS score and hiring impact")
    impact_level: str = Field(default="High", description="High / Medium / Critical")

class SectionAuditItem(BaseModel):
    section: str = Field(..., description="e.g. Header/Contact, Summary, Experience, Education, Skills, Projects")
    status: str = Field(..., description="Pass, Warning, Critical")
    feedback: str = Field(..., description="Detailed critique")
    recommendation: str = Field(..., description="Specific action to take")

class ActionStep(BaseModel):
    priority: int = Field(..., description="1 to 5")
    title: str = Field(..., description="Short actionable step title")
    description: str = Field(..., description="Elaborated guidance")
    expected_score_boost: str = Field(..., description="e.g. +8 pts")

class AnalysisResponse(BaseModel):
    overall_score: int = Field(..., description="0-100 overall ATS suitability score")
    candidate_name: Optional[str] = Field(None, description="Extracted candidate name")
    detected_role: Optional[str] = Field(None, description="Inferred or target candidate title")
    experience_level: Optional[str] = Field(None, description="Entry / Mid / Senior / Lead")
    summary: str = Field(..., description="Executive critique summary")
    word_count: int = Field(0, description="Total word count of parsed document")
    reading_time_seconds: int = Field(0, description="Estimated recruiter scan time in seconds")
    sub_scores: SubScores
    skill_breakdown: List[SkillMatch] = Field(default_factory=list)
    bullet_improvements: List[BulletPointOptimization] = Field(default_factory=list)
    section_audit: List[SectionAuditItem] = Field(default_factory=list)
    action_plan: List[ActionStep] = Field(default_factory=list)
    raw_text_preview: str = Field(..., description="Cleaned extracted resume text snippet")
    mode_used: str = Field(..., description="'gemini_ai' or 'nlp_heuristic'")

class RewriteBulletRequest(BaseModel):
    bullet: str
    target_role: Optional[str] = None
    target_skill: Optional[str] = None

class RewriteBulletResponse(BaseModel):
    original: str
    improved: str
    metrics_added: bool
    action_verb_used: str
    explanation: str
