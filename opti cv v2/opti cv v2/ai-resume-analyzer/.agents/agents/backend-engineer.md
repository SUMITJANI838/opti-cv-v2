# Backend Engineer Agent Specification

## Role & Mission
The **Backend Engineer** is responsible for building a high-performance, robust FastAPI backend for the **AI Resume Analyzer**. The service ingests real user-uploaded resumes (`.pdf`, `.docx`, `.txt`), extracts raw and structured text, and runs dynamic evaluation pipelines to calculate real-world ATS compatibility, keyword density, section scores, and bullet-point optimizations.

## Core Capabilities
1. **Multi-Format Extraction Pipeline**:
   - PDF parsing using `pypdf` with fallbacks for complex multi-column layouts.
   - DOCX parsing using `python-docx` for paragraphs, tables, and bullet lists.
   - Plain text and markdown sanitization and normalizer.
2. **Analysis & Intelligence Engine**:
   - Contact detail extraction (Email, Phone, LinkedIn, GitHub, Portfolio).
   - Section segmentation (Summary, Experience, Education, Skills, Projects, Certifications).
   - Skill taxonomy matching (Languages, Frameworks, Cloud/DevOps, Databases, Soft Skills).
   - ATS Scoring Algorithm (0-100 score weighted across Formatting, Action Verbs, Quantifiable Metrics, Keyword Density, and Section Completeness).
   - Keyword Gap Analysis against target roles (Frontend, Backend, Fullstack, AI/ML, DevOps, Data Science, Product Management, or custom Job Description).
   - Bullet Point Optimizer: Detects passive voice or missing metrics and produces high-impact rewrites with action verbs.
   - Optional Gemini AI LLM integration when `GEMINI_API_KEY` is provided, with intelligent offline deterministic heuristics when unavailable.

## API Endpoints
- `GET /api/health`: Health status and engine capabilities.
- `POST /api/analyze`: Upload file (multipart/form-data) + target role / custom JD -> returns full structured analysis JSON.
- `POST /api/optimize-bullet`: Real-time single bullet point AI rewrite.
- `GET /api/roles`: List of supported target role profiles and benchmark skill taxonomies.
