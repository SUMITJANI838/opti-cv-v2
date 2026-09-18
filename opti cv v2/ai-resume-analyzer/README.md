# AI Resume Analyzer (OPTI.CV v2.0)

An ultra-minimal, unscrollable luxury AI Resume Intelligence Workstation engineered with Obsidian & Glassmorphic aesthetics, butter-smooth Framer Motion physics, dynamic PDF/DOCX resume extraction, and real-time ATS matrix evaluation.

---

## 💎 Design System & UX Highlights
- **Zero Outer Scroll Canvas (`100vh`)**: Fixed viewport layout with dual independently scrollable glass panes and sleek micro-scrollbars.
- **Definite Glowing Boundaries**: Frosted glass pane dividers with subtle hairline vertical gradient light rays.
- **Obsidian & Aurora Palette**: Deep `#06070a` backdrop accented by diffused Neon Mint (`#00FF9D`), Luminous Cyan (`#00E5FF`), and Electric Violet (`#818CF8`).
- **Dynamic File Ingestion**: Ingests actual user-uploaded `.pdf`, `.docx`, and `.txt` files — no hardcoded mock data.
- **Google X-Y-Z Bullet Enhancer**: Real-time bullet point transformer with action verbs and quantifiable business metrics.
- **Semantic Keyword Gap Matrix**: Live match percentage and missing core skills breakdown against target roles or custom Job Descriptions.

---

## 📂 Project Structure

```
ai-resume-analyzer/
├── .agents/
│   └── agents/
│       ├── frontend-architect.md   # Design system & UI/UX spec
│       └── backend-engineer.md     # FastAPI schema & ATS algorithms
├── backend/                        # FastAPI Python Service
│   ├── main.py                     # API router, CORS, upload endpoints
│   ├── parser.py                   # Multi-format PDF/DOCX/TXT parser
│   ├── analyzer.py                 # ATS scoring & keyword gap engine
│   ├── test_api.py                 # Comprehensive backend tests
│   └── requirements.txt
├── frontend/                       # Next.js 16 + React 19 + Tailwind v4 + Framer Motion
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Dark root layout
│   │   │   ├── page.tsx            # Master dual-pane unscrollable workstation
│   │   │   └── globals.css         # Glassmorphism & custom scrollbars
│   │   ├── components/
│   │   │   ├── Header.tsx          # Role selector, custom JD trigger & status
│   │   │   ├── DropZone.tsx        # Drag & drop upload, paste mode & sample loader
│   │   │   ├── ResumeViewer.tsx    # Left pane structured & raw viewer
│   │   │   ├── AnalysisDashboard.tsx # Right pane 4-tab ATS intelligence hub
│   │   │   ├── ScoreGauge.tsx      # SVG radial animated dial & 4-pillar meters
│   │   │   └── CustomJDModal.tsx   # Custom Job Description matching modal
│   │   └── lib/
│   │       ├── api.ts              # API client with offline edge fallback
│   │       └── types.ts            # Full TypeScript interfaces
└── run_app.py                      # One-click launcher for both services
```

---

## 🚀 Quick Start Guide

### 1. Launch All Services (Recommended)
```bash
python run_app.py
```
This will start both:
- **FastAPI Backend**: `http://127.0.0.1:8000` (Swagger docs at `/docs`)
- **Next.js Frontend**: `http://localhost:3000`

### 2. Manual Startup

**Backend**:
```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing
Run backend unit tests:
```bash
cd backend
python test_api.py
```
