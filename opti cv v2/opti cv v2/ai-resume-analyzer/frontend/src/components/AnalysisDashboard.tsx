'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gauge,
  KeyRound,
  Wand2,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  Tag,
  Lightbulb,
  Send
} from 'lucide-react';
import { ATSAnalysis } from '../lib/types';
import { ScoreGauge } from './ScoreGauge';
import { optimizeSingleBullet } from '../lib/api';

interface AnalysisDashboardProps {
  analysis: ATSAnalysis;
  targetRole: string;
}

type TabKey = 'scorecard' | 'keywords' | 'bullets' | 'insights';

export function AnalysisDashboard({ analysis, targetRole }: AnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('scorecard');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [customBulletInput, setCustomBulletInput] = useState('');
  const [customOptimizedResult, setCustomOptimizedResult] = useState<any>(null);
  const [isOptimizingCustom, setIsOptimizingCustom] = useState(false);

  const {
    overall_score,
    tier,
    tier_color,
    breakdown,
    metrics_found,
    keyword_gap,
    improvements,
    optimized_bullets
  } = analysis;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCustomBulletOptimize = async () => {
    if (!customBulletInput.trim()) return;
    setIsOptimizingCustom(true);
    try {
      const res = await optimizeSingleBullet(customBulletInput, targetRole);
      setCustomOptimizedResult(res);
    } catch {
      //
    } finally {
      setIsOptimizingCustom(false);
    }
  };

  const tabs: { id: TabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'scorecard', label: 'ATS Scorecard', icon: <Gauge className="w-3.5 h-3.5" /> },
    {
      id: 'keywords',
      label: 'Keyword Gap',
      icon: <KeyRound className="w-3.5 h-3.5" />,
      badge: `${keyword_gap.core_match_percent}%`
    },
    { id: 'bullets', label: 'Bullet Optimizer', icon: <Wand2 className="w-3.5 h-3.5" /> },
    { id: 'insights', label: 'Executive Insights', icon: <FileCheck2 className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="h-full flex flex-col bg-[#07090e]/80 backdrop-blur-xl">
      {/* Pane Subheader / Tab Navigation */}
      <div className="p-2.5 md:p-3 border-b border-white/[0.06] flex items-center justify-between overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/[0.08] rounded-xl w-full sm:w-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive ? 'text-cyan-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-white/[0.08] border border-cyan-500/30 rounded-lg"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'scorecard' && (
            <motion.div
              key="tab-scorecard"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Radial Dial & Pillar Summary */}
              <div className="glass-card rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 justify-between border-t border-t-cyan-500/20">
                <ScoreGauge
                  score={overall_score}
                  tier={tier}
                  tierColor={tier_color}
                  breakdown={breakdown}
                />

                {/* Telemetry Metric Counts */}
                <div className="w-full md:w-56 space-y-2 text-xs">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Resume Telemetry
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/[0.04]">
                    <span className="text-slate-400">Numerical Data Points</span>
                    <span className="font-mono text-emerald-400 font-semibold">{metrics_found.metric_count}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/[0.04]">
                    <span className="text-slate-400">Strong Action Verbs</span>
                    <span className="font-mono text-cyan-400 font-semibold">{metrics_found.action_verb_count}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/[0.04]">
                    <span className="text-slate-400">Extracted Skills</span>
                    <span className="font-mono text-indigo-400 font-semibold">{metrics_found.detected_skills_count}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/[0.04]">
                    <span className="text-slate-400">Total Word Count</span>
                    <span className="font-mono text-slate-200 font-semibold">{metrics_found.total_words}</span>
                  </div>
                </div>
              </div>

              {/* Actionable Prioritized Improvements */}
              <div className="glass-card rounded-2xl p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    High-Priority ATS Fixes ({improvements.length})
                  </h3>
                </div>

                {improvements.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Outstanding! No critical ATS red flags detected in your resume structure.</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {improvements.map((imp, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                          imp.type === 'critical'
                            ? 'bg-rose-500/[0.06] border-rose-500/20 text-slate-200'
                            : imp.type === 'recommended'
                            ? 'bg-amber-500/[0.06] border-amber-500/20 text-slate-200'
                            : 'bg-cyan-500/[0.06] border-cyan-500/20 text-slate-200'
                        }`}
                      >
                        <AlertCircle
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            imp.type === 'critical'
                              ? 'text-rose-400'
                              : imp.type === 'recommended'
                              ? 'text-amber-400'
                              : 'text-cyan-400'
                          }`}
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-white">{imp.title}</span>
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold ${
                                imp.type === 'critical'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : imp.type === 'recommended'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-cyan-500/20 text-cyan-300'
                              }`}
                            >
                              {imp.type}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11.5px]">{imp.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'keywords' && (
            <motion.div
              key="tab-keywords"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Match Header Card */}
              <div className="glass-card rounded-2xl p-5 border-t border-t-emerald-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Target Role Alignment: {targetRole}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ATS algorithms match keywords from the job description with high semantic weight.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/[0.08] self-start">
                    <span className="text-xs text-slate-400">Core Match:</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {keyword_gap.core_match_percent}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-700 rounded-full"
                    style={{ width: `${keyword_gap.core_match_percent}%` }}
                  />
                </div>

                {/* Missing Skills Section */}
                {keyword_gap.missing_core.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Missing High-Impact Skills ({keyword_gap.missing_core.length})</span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(keyword_gap.missing_core.join(', '), 999)
                        }
                        className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedIndex === 999 ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedIndex === 999 ? 'Copied' : 'Copy Missing'}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {keyword_gap.missing_core.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/[0.08] border border-rose-500/25 text-rose-300 text-xs font-medium flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          <span>{sk}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Skills Section */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Matched Core Skills ({keyword_gap.matched_core.length})</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {keyword_gap.matched_core.map((sk) => (
                      <span
                        key={sk}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/25 text-emerald-300 text-xs font-medium flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{sk}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'bullets' && (
            <motion.div
              key="tab-bullets"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Interactive Bullet Transformer Box */}
              <div className="glass-card rounded-2xl p-4 md:p-5 border-t border-t-cyan-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Interactive Bullet Transformer (Google X-Y-Z Formula)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Type or paste any resume bullet point to rewrite it with strong action verbs and quantified impact metrics.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customBulletInput}
                    onChange={(e) => setCustomBulletInput(e.target.value)}
                    placeholder="e.g. Worked on frontend website and improved page load times."
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomBulletOptimize()}
                    className="flex-1 px-3.5 py-2 rounded-xl glass-input text-xs font-sans text-slate-200"
                  />
                  <button
                    disabled={!customBulletInput.trim() || isOptimizingCustom}
                    onClick={handleCustomBulletOptimize}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black text-xs font-semibold hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    {isOptimizingCustom ? (
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Enhance</span>
                  </button>
                </div>

                {/* Custom Output Result */}
                {customOptimizedResult && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/20 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                        Optimized Output
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(customOptimizedResult.rewritten, 888)
                        }
                        className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        {copiedIndex === 888 ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedIndex === 888 ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-white font-medium mb-2 leading-relaxed">
                      {customOptimizedResult.rewritten}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {customOptimizedResult.reasons.map((r: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                        >
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Automatic Extracted Bullets Rewrites */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume Bullet Point Rewrites ({optimized_bullets.length})</span>
                </div>

                {optimized_bullets.map((item, idx) => (
                  <div key={idx} className="glass-card rounded-xl p-4 space-y-3">
                    {/* Before */}
                    <div className="text-xs">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span className="text-rose-400 uppercase font-semibold">Original Bullet</span>
                        <span>Score: {item.score_before}/100</span>
                      </div>
                      <p className="text-slate-300 bg-black/30 p-2.5 rounded-lg border border-white/[0.04]">
                        {item.original}
                      </p>
                    </div>

                    {/* After */}
                    <div className="text-xs">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span className="text-emerald-400 uppercase font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> AI Enhanced (Google Formula)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">Score: {item.score_after}/100</span>
                          <button
                            onClick={() => handleCopy(item.rewritten, idx)}
                            className="p-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors"
                            title="Copy optimized text"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-white font-medium bg-emerald-500/[0.05] p-2.5 rounded-lg border border-emerald-500/20 leading-relaxed">
                        {item.rewritten}
                      </p>
                    </div>

                    {/* Rationale Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.reasons.map((reason, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-slate-400"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="tab-insights"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Recruiter 6-Second Scan Readiness */}
              <div className="glass-card rounded-2xl p-5 border-t border-t-indigo-500/20">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-indigo-400" />
                  <span>Recruiter 6-Second Scan Checklist</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <ChecklistRow
                    title="Clear Contact Info & Professional Links"
                    passed={breakdown.section_score >= 10}
                    detail="Ensures recruiters can contact you with 1 click without hunting."
                  />
                  <ChecklistRow
                    title="Quantifiable Outcomes & Business Metrics"
                    passed={metrics_found.metric_count >= 5}
                    detail={`Identified ${metrics_found.metric_count} numerical milestones (Ideal: 6+).`}
                  />
                  <ChecklistRow
                    title="Target Role Alignment & Skill Density"
                    passed={keyword_gap.core_match_percent >= 60}
                    detail={`${keyword_gap.core_match_percent}% match with standard ${targetRole} requirements.`}
                  />
                  <ChecklistRow
                    title="Concise Word Count & Layout Brevity"
                    passed={metrics_found.total_words >= 350 && metrics_found.total_words <= 950}
                    detail={`${metrics_found.total_words} words. Optimal for modern 1-page / 2-page ATS parsers.`}
                  />
                </div>
              </div>

              {/* Career Seniority Assessment */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Estimated Seniority Fit</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Based on action verb patterns, technical stack breadth, and metrics quantification:
                </p>
                <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-slate-400">Positioning Level:</span>
                  <span className="font-semibold text-cyan-300 font-mono">
                    {overall_score >= 80 ? 'Mid-to-Senior / Staff Level' : overall_score >= 65 ? 'Mid-Level Professional' : 'Associate / Entry Level'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChecklistRow({ title, passed, detail }: { title: string; passed: boolean; detail: string }) {
  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-black/20 border border-white/[0.04]">
      {passed ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
      )}
      <div>
        <div className="font-semibold text-white text-xs">{title}</div>
        <p className="text-slate-400 text-[11px] mt-0.5">{detail}</p>
      </div>
    </div>
  );
}
