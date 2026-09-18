# AI Resume Analyzer V2 (ResumeIQ Pro)

A minimal, unscrollable, high-precision AI Resume Analyzer & ATS Diagnostic Cockpit built with **Next.js 15**, **Tailwind CSS**, **Framer Motion**, and **FastAPI**.

---

## 💎 Features

- **Unscrollable Viewport (100vh)**: Fluid, non-slop minimal dashboard layout with multi-layered glassmorphism (`backdrop-blur-2xl`) and ambient aurora lighting.
- **Definite Dual-Pane Split**:
  - **Left Panel (Document Hub)**: Multi-format file ingestion (`.pdf`, `.docx`, `.txt`), optional job description & target role tailoring, extracted raw text preview drawer.
  - **Right Panel (Diagnostic Matrix)**: SVG animated ATS Score gauge, 4-pillar sub-scores (Formatting, Keywords, Impact, Brevity), Skill Gap Matrix, Bullet Point Optimizer with live sandbox transformer, Section Audit, and Priority Action Checklist.
- **Real Resume Processing**: No hardcoded / pre-feeded data. Extracts real text and matches against real job descriptions.
- **Dual AI & NLP Engine**:
  - Automatically runs Google Gemini 2.5 Flash if `GEMINI_API_KEY` is provided.
  - Seamlessly falls back to an advanced heuristic NLP engine with 500+ taxonomy rules and metric extractors if offline or no key is provided.
- **1-Click Actions**: Bullet copy, live bullet transformation sandbox, and executive report export in Markdown / Print format.

---

## 📁 Project Architecture

```
ai-resume-analyzer/
├── .agents/
│   └── agents/
│       ├── frontend-architect.md
│       └── backend-engineer.md
├── backend/
│   ├── app/
│   │   ├── parsers/        # PDF, DOCX, and Raw text parsers
│   │   ├── services/       # NLP heuristic engine & Gemini AI service
│   │   ├── schemas/        # Pydantic data schemas
│   │   ├── config.py
│   │   └── main.py         # FastAPI routes & CORS
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js 15 App router (100vh unscrollable layout)
│   │   ├── components/     # Left & Right glassmorphic panels
│   │   └── lib/            # Types and API client
│   ├── tailwind.config.ts
│   └── package.json
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Start the FastAPI Backend
```bash
# In project root:
.\venv\Scripts\activate
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Start the Next.js Frontend
```bash
# In a new terminal:
cd frontend
npm.cmd run dev
```

Visit **`http://localhost:3000`** in your browser.
