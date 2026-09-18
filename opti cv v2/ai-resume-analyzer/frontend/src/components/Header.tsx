'use client';

import React from 'react';
import { Sparkles, FileText, ChevronDown, CheckCircle2, RotateCcw, Target, Zap } from 'lucide-react';

interface HeaderProps {
  targetRole: string;
  onSelectRole: (role: string) => void;
  isBackendOnline: boolean;
  onReset: () => void;
  hasData: boolean;
  onOpenCustomJd: () => void;
  hasCustomJd: boolean;
}

const ROLES = [
  'Full Stack Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'AI / Machine Learning Engineer',
  'DevOps & Cloud Architect',
  'Data Scientist',
  'Product Manager'
];

export function Header({
  targetRole,
  onSelectRole,
  isBackendOnline,
  onReset,
  hasData,
  onOpenCustomJd,
  hasCustomJd
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#06070a]/90 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 via-emerald-500/10 to-transparent border border-cyan-500/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white font-mono">OPTI.CV</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              v2.0
            </span>
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline">AI Resume Intelligence Workstation</span>
        </div>
      </div>

      {/* Target Role & JD Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Role Select Dropdown */}
        <div className="relative flex items-center">
          <span className="text-[11px] text-slate-400 mr-2 hidden md:inline font-medium">Target Role:</span>
          <div className="relative">
            <select
              value={targetRole}
              onChange={(e) => onSelectRole(e.target.value)}
              className="appearance-none bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.1] hover:border-cyan-500/40 text-xs text-slate-200 font-medium py-1.5 pl-3 pr-8 rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
            >
              {ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#0f1117] text-slate-200 py-1">
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Custom Job Description Modal Button */}
        <button
          onClick={onOpenCustomJd}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
            hasCustomJd
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
              : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-cyan-500/40 hover:text-white'
          }`}
          title="Match against a specific job posting"
        >
          <Target className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{hasCustomJd ? 'Custom JD Active' : 'Match Job Spec'}</span>
          {hasCustomJd && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
        </button>

        {/* Reset / Clear Button */}
        {hasData && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-all duration-200"
            title="Upload a different resume"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">New Resume</span>
          </button>
        )}

        {/* Backend Connectivity Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400">
          <span
            className={`w-2 h-2 rounded-full ${
              isBackendOnline
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(0,255,157,0.8)] animate-pulse'
                : 'bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.6)]'
            }`}
          />
          <span className="font-mono text-[10px] hidden sm:inline">
            {isBackendOnline ? 'FastAPI Live' : 'Edge Hybrid'}
          </span>
        </div>
      </div>
    </header>
  );
}
