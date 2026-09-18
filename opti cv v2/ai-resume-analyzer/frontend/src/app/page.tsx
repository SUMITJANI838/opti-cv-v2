'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Header } from '../components/Header';
import { DropZone } from '../components/DropZone';
import { ResumeViewer } from '../components/ResumeViewer';
import { AnalysisDashboard } from '../components/AnalysisDashboard';
import { CustomJDModal } from '../components/CustomJDModal';
import { checkBackendHealth, analyzeResumeFile, analyzeResumeText } from '../lib/api';
import { AnalysisResponse } from '../lib/types';
import { Sparkles, Shield, Cpu, Zap, FileText, BarChart3 } from 'lucide-react';

const SAMPLE_RESUME_TEXT = `
ALEXANDER WRIGHT
San Francisco, CA | alex.wright@email.com | (555) 019-2834 | linkedin.com/in/alexwright | github.com/alexwright | alexwright.dev

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Engineer with 6+ years of experience architecting high-scale distributed web applications, cloud-native microservices, and modern AI integrations. Proven track record in reducing infrastructure latency by 45% and leading high-velocity engineering teams.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, Go, SQL, HTML5, CSS3, Bash
- Frontend: React, Next.js, Tailwind CSS, Redux, Zustand, Framer Motion, GraphQL
- Backend & DB: Node.js, FastAPI, PostgreSQL, Redis, MongoDB, Microservices, gRPC
- Cloud & DevOps: AWS (Lambda, ECS, S3), Docker, Kubernetes, CI/CD, GitHub Actions, Terraform
- AI / ML: OpenAI API, Gemini API, LangChain, RAG Architecture, Vector DBs

WORK EXPERIENCE
Senior Full Stack Engineer | CloudScale Tech | 2022 – Present
• Architected and deployed microservices architecture handling 15M+ daily requests with 99.99% uptime SLA.
• Engineered real-time data ingestion pipeline using Next.js, WebSockets, and Redis, reducing page load latency by 45%.
• Spearheaded database migration from legacy monolithic MySQL to partitioned PostgreSQL, cutting query latency from 420ms to 48ms.
• Mentored a team of 6 software engineers, standardizing code quality with strict automated CI/CD linting & testing suites.

Full Stack Software Engineer | Apex Solutions | 2020 – 2022
• Developed responsive enterprise analytics dashboard using React, TypeScript, and Tailwind CSS for 45,000+ active business users.
• Automated payment processing integration with Stripe API and webhooks, reducing checkout failure rate by 32%.
• Built automated end-to-end testing workflows with Jest and Playwright, elevating test coverage from 52% to 91%.
• Optimized bundle size by 38% utilizing dynamic code-splitting and asset compression.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2016 – 2020
`;

export default function Home() {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [customJd, setCustomJd] = useState('');
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState<File | null>(null);
  const [lastUploadedText, setLastUploadedText] = useState<string | null>(null);
  const [mobileActivePane, setMobileActivePane] = useState<'source' | 'analysis'>('analysis');

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((status) => setIsBackendOnline(status));
    const interval = setInterval(() => {
      checkBackendHealth().then((status) => setIsBackendOnline(status));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle Confetti for high scores
  useEffect(() => {
    if (data?.analysis?.overall_score && data.analysis.overall_score >= 80) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00E5FF', '#00FF9D', '#818CF8']
      });
    }
  }, [data]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setLastUploadedFile(file);
    setLastUploadedText(null);
    try {
      const response = await analyzeResumeFile(file, targetRole, customJd);
      setData(response);
    } catch (err) {
      console.error('File parsing failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async (text: string) => {
    setIsLoading(true);
    setLastUploadedText(text);
    setLastUploadedFile(null);
    try {
      const response = await analyzeResumeText(text, targetRole, customJd);
      setData(response);
    } catch (err) {
      console.error('Text parsing failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    handleTextSubmit(SAMPLE_RESUME_TEXT);
  };

  // Re-run analysis when target role or custom JD changes
  const handleRoleChange = async (newRole: string) => {
    setTargetRole(newRole);
    if (lastUploadedFile) {
      setIsLoading(true);
      const res = await analyzeResumeFile(lastUploadedFile, newRole, customJd);
      setData(res);
      setIsLoading(false);
    } else if (lastUploadedText || data) {
      setIsLoading(true);
      const textToUse = lastUploadedText || data?.parsed?.raw_text || SAMPLE_RESUME_TEXT;
      const res = await analyzeResumeText(textToUse, newRole, customJd);
      setData(res);
      setIsLoading(false);
    }
  };

  const handleApplyCustomJd = async (newJd: string) => {
    setCustomJd(newJd);
    if (lastUploadedFile) {
      setIsLoading(true);
      const res = await analyzeResumeFile(lastUploadedFile, targetRole, newJd);
      setData(res);
      setIsLoading(false);
    } else if (lastUploadedText || data) {
      setIsLoading(true);
      const textToUse = lastUploadedText || data?.parsed?.raw_text || SAMPLE_RESUME_TEXT;
      const res = await analyzeResumeText(textToUse, targetRole, newJd);
      setData(res);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setLastUploadedFile(null);
    setLastUploadedText(null);
  };

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-[#06070a] relative select-none">
      {/* Diffused Luxury Ambient Glows */}
      <div className="absolute top-[-10%] left-[10%] w-[45vw] h-[45vh] rounded-full bg-cyan-500/[0.04] blur-[120px] pointer-events-none animate-ambient-pulse" />
      <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vh] rounded-full bg-emerald-500/[0.035] blur-[140px] pointer-events-none animate-ambient-pulse" />
      <div className="absolute top-[40%] right-[30%] w-[35vw] h-[35vh] rounded-full bg-indigo-500/[0.025] blur-[150px] pointer-events-none" />

      {/* Header */}
      <Header
        targetRole={targetRole}
        onSelectRole={handleRoleChange}
        isBackendOnline={isBackendOnline}
        onReset={handleReset}
        hasData={Boolean(data)}
        onOpenCustomJd={() => setIsJdModalOpen(true)}
        hasCustomJd={Boolean(customJd.trim())}
      />

      {/* Mobile / Tablet Segmented Sub-Bar (Hidden on Desktop >= lg) */}
      {data && (
        <div className="lg:hidden h-11 bg-[#090b10] border-b border-white/[0.08] px-4 flex items-center justify-center shrink-0 z-20">
          <div className="flex items-center p-0.5 bg-black/40 border border-white/[0.08] rounded-lg text-xs w-full max-w-xs justify-between">
            <button
              onClick={() => setMobileActivePane('source')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-md font-medium transition-all ${
                mobileActivePane === 'source'
                  ? 'bg-white/[0.1] text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume Source</span>
            </button>
            <button
              onClick={() => setMobileActivePane('analysis')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-md font-medium transition-all ${
                mobileActivePane === 'analysis'
                  ? 'bg-white/[0.1] text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>AI Scorecard</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex-1 overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          {!data ? (
            /* Empty State / Upload Landing */
            <motion.div
              key="landing-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full flex flex-col items-center justify-center p-6 overflow-y-auto custom-scrollbar"
            >
              {/* Minimal Hero Title */}
              <div className="text-center max-w-xl mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next-Gen ATS Resume Intelligence</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Optimize your resume with <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">precision AI</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Real-time ATS parsing, semantic keyword gap analysis, and Google formula bullet rewrites on your uploaded resume.
                </p>
              </div>

              {/* Upload Box */}
              <DropZone
                onFileUpload={handleFileUpload}
                onTextSubmit={handleTextSubmit}
                onLoadSample={handleLoadSample}
                isLoading={isLoading}
              />

              {/* Feature Highlights Minimal Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl w-full mt-8">
                <div className="p-3 rounded-xl glass-card flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Dynamic User Uploads</div>
                    <div className="text-[10px] text-slate-400">PDF, Word, or text parsing</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl glass-card flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">ATS Matrix Scoring</div>
                    <div className="text-[10px] text-slate-400">4-pillar weighted evaluation</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl glass-card flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">X-Y-Z Bullet Enhancer</div>
                    <div className="text-[10px] text-slate-400">High-impact metric rewrites</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Workstation Dual-Pane Layout */
            <motion.div
              key="workstation-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
            >
              {/* Left Pane: Resume Source & Structure Viewer (Independently Scrollable) */}
              <div
                className={`h-full lg:col-span-5 flex flex-col overflow-hidden glow-boundary-v border-r border-white/[0.08] ${
                  mobileActivePane === 'source' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                <ResumeViewer resume={data.parsed} />
              </div>

              {/* Right Pane: AI Intelligence Dashboard (Independently Scrollable) */}
              <div
                className={`h-full lg:col-span-7 flex flex-col overflow-hidden bg-[#06070a]/90 ${
                  mobileActivePane === 'analysis' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                <AnalysisDashboard
                  analysis={data.analysis}
                  targetRole={targetRole}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Job Description Modal */}
      <CustomJDModal
        isOpen={isJdModalOpen}
        onClose={() => setIsJdModalOpen(false)}
        onApply={handleApplyCustomJd}
        currentJd={customJd}
      />
    </main>
  );
}
