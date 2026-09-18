'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Sparkles, Check } from 'lucide-react';

interface CustomJDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (jdText: string) => void;
  currentJd: string;
}

export function CustomJDModal({ isOpen, onClose, onApply, currentJd }: CustomJDModalProps) {
  const [jdText, setJdText] = useState(currentJd);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg glass-panel rounded-2xl p-6 relative border border-cyan-500/30 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Match Specific Job Posting</h3>
              <p className="text-xs text-slate-400">Paste the job description (JD) requirements below.</p>
            </div>
          </div>

          <div className="my-4">
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description text here (Responsibilities, Required Qualifications, Tech Stack)..."
              rows={8}
              className="w-full p-3.5 rounded-xl glass-input text-xs font-mono text-slate-200 placeholder:text-slate-400 leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            {currentJd ? (
              <button
                onClick={() => {
                  setJdText('');
                  onApply('');
                  onClose();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 underline"
              >
                Clear Custom JD
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!jdText.trim()}
                onClick={() => {
                  onApply(jdText);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Job Specs</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
