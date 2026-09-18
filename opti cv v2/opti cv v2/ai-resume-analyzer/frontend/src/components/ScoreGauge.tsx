'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  tier: string;
  tierColor: string;
  breakdown: {
    section_score: number;
    impact_score: number;
    brevity_score: number;
    keyword_score: number;
  };
}

export function ScoreGauge({ score, tier, tierColor, breakdown }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = animatedScore;
    const target = score;
    const diff = target - current;
    if (diff === 0) return;

    const duration = 800;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = diff / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      current += increment;
      if (stepCount >= steps) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Main Radial Dial */}
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: tierColor }}
        />

        <svg width="170" height="170" className="transform -rotate-90">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#00FF9D" />
              <stop offset="100%" stopColor={tierColor} />
            </linearGradient>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="transparent"
            stroke="url(#trackGradient)"
            strokeWidth="9"
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx="85"
            cy="85"
            r={radius}
            fill="transparent"
            stroke="url(#scoreGradient)"
            strokeWidth="9"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
              {animatedScore}
            </span>
            <span className="text-xs text-slate-400 ml-0.5 font-mono">/100</span>
          </div>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-cyan-400/90 mt-0.5">
            ATS Score
          </span>
        </div>
      </div>

      {/* Tier Badge */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
        style={{
          backgroundColor: `${tierColor}10`,
          borderColor: `${tierColor}30`,
          color: tierColor
        }}
      >
        {score >= 75 ? (
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5" />
        )}
        <span>{tier}</span>
      </motion.div>

      {/* 4 Pillars Mini-Bars */}
      <div className="w-full grid grid-cols-2 gap-2 mt-5">
        <PillarBar label="Section Flow" current={breakdown.section_score} max={25} color="#00E5FF" />
        <PillarBar label="Impact & Data" current={breakdown.impact_score} max={25} color="#00FF9D" />
        <PillarBar label="Brevity & Tone" current={breakdown.brevity_score} max={20} color="#818CF8" />
        <PillarBar label="Keyword Match" current={breakdown.keyword_score} max={30} color="#F59E0B" />
      </div>
    </div>
  );
}

function PillarBar({ label, current, max, color }: { label: string; current: number; max: number; color: string }) {
  const percent = Math.min(100, Math.round((current / max) * 100));
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-2 flex flex-col justify-between">
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-slate-200 font-mono text-[10px]">{current}/{max}</span>
      </div>
      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
