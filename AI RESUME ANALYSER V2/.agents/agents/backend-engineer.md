# Backend Engineer Agent Specification

## Role & Responsibilities
- **Domain**: FastAPI, Python 3.12, Document Parsing (PDF, DOCX), NLP / LLM Integration (Gemini API), Heuristic Resume Diagnostics.
- **Objective**: Provide high-speed, reliable, accurate analysis on real user-provided resume documents and target job descriptions.

## Architectural Guidelines
1. **Document Ingestion**:
   - `pdf_parser.py`: Uses `pypdf` to extract text blocks, metadata, and structural layout indicators from PDF files.
   - `docx_parser.py`: Uses `python-docx` to extract text from paragraphs and tables.
   - Text fallback for raw `.txt` / `.md` uploads.
2. **Analysis Pipeline**:
   - Dual-mode architecture:
     - **AI Mode**: Integrates with Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`) via `google-genai` to deliver detailed structural critique, ATS compatibility grading, bullet point rewrites, and skill gap discovery with structured JSON response.
     - **Heuristic NLP Mode**: Offline fallback engine that extracts real metrics, scans for action verbs, computes impact ratios, matches target keywords against 200+ industry taxonomies, and generates actionable improvements without requiring an external API key.
3. **API Contract**:
   - `POST /api/analyze`: Multipart endpoint taking `resume` file and optional `job_description` string + target role.
   - `GET /api/health`: Health status endpoint.
   - `POST /api/rewrite-bullet`: Real-time bullet point rewriter using action verbs + metrics.
