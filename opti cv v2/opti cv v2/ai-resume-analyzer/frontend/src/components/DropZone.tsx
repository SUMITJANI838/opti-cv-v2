'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Clipboard, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface DropZoneProps {
  onFileUpload: (file: File) => void;
  onTextSubmit: (text: string) => void;
  onLoadSample: () => void;
  isLoading: boolean;
}

export function DropZone({ onFileUpload, onTextSubmit, onLoadSample, isLoading }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Mode Switcher Pills */}
      <div className="flex items-center p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl mb-6 shadow-inner">
        <button
          onClick={() => setInputMode('upload')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            inputMode === 'upload'
              ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload Document (.pdf, .docx, .txt)</span>
        </button>

        <button
          onClick={() => setInputMode('paste')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            inputMode === 'paste'
              ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clipboard className="w-3.5 h-3.5" />
          <span>Paste Resume Text</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {inputMode === 'upload' ? (
          <motion.div
            key="upload-box"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`w-full relative group cursor-pointer rounded-2xl p-8 md:p-12 border-2 border-dashed transition-all duration-300 flex flex-col items-center text-center glass-card ${
              isDragOver
                ? 'border-cyan-400 bg-cyan-500/[0.07] scale-[1.01]'
                : 'border-white/[0.12] hover:border-cyan-400/40 hover:bg-white/[0.03]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Glowing Aura Ring */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-emerald-500/10 to-transparent border border-cyan-500/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,229,255,0.15)] group-hover:scale-110 transition-transform duration-300">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8 text-cyan-400" />
              )}
            </div>

            <h3 className="text-base md:text-lg font-semibold text-white tracking-tight mb-1.5">
              {isLoading ? 'Analyzing Resume Intelligence...' : 'Drop your resume here or click to browse'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Supports native PDF extraction, Microsoft Word (.docx), and plain text. No data is stored or pre-fed.
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 bg-white/[0.03] border border-white/[0.06] px-3.5 py-1.5 rounded-full">
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client/API Private
              </span>
              <span>•</span>
              <span>Fast ATS Matrix</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="paste-box"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full flex flex-col gap-3"
          >
            <div className="relative">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the raw text of your resume here (Summary, Work Experience, Skills, Education)..."
                rows={9}
                className="w-full p-4 rounded-xl glass-input text-xs font-mono leading-relaxed resize-none text-slate-200 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {pastedText.split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                disabled={!pastedText.trim() || isLoading}
                onClick={() => onTextSubmit(pastedText)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-black shadow-lg shadow-cyan-500/20 hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
              >
                <span>Run Intelligence Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Sample Demo Button */}
      <div className="mt-6 flex items-center gap-2">
        <span className="text-xs text-slate-400">Want to test instantly?</span>
        <button
          onClick={onLoadSample}
          className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/40 hover:decoration-cyan-400 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Alexander Wright (Senior Full Stack Engineer) sample resume</span>
        </button>
      </div>
    </div>
  );
}
