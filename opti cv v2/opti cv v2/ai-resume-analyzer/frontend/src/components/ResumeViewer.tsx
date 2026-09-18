'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Globe,
  Briefcase,
  Code2,
  GraduationCap,
  FileCode,
  FileText,
  User,
  ExternalLink,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { ParsedResume } from '../lib/types';

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3" />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" />
    </svg>
  );
}

interface ResumeViewerProps {
  resume: ParsedResume;
}

export function ResumeViewer({ resume }: ResumeViewerProps) {
  const [viewMode, setViewMode] = useState<'structured' | 'raw'>('structured');
  const [isCopied, setIsCopied] = useState(false);

  const { contact, skills, sections, bullets, filename, word_count, raw_text } = resume;

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(raw_text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#080a0f]/60 backdrop-blur-xl select-text">
      {/* Pane Subheader */}
      <div className="p-3.5 md:p-4 border-b border-white/[0.06] flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 truncate">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h2 className="text-xs font-semibold text-white tracking-wide truncate max-w-[180px]">
              {filename}
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              {word_count} words • Parsed dynamically
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Copy Raw Button */}
          <button
            onClick={handleCopyRaw}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
            title="Copy extracted text to clipboard"
          >
            {isCopied ? (
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 px-1">
                Copied!
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-cyan-300" />
            )}
          </button>

          {/* View mode toggle */}
          <div className="flex items-center p-0.5 bg-black/40 border border-white/[0.08] rounded-lg text-[11px]">
            <button
              onClick={() => setViewMode('structured')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'structured'
                  ? 'bg-white/[0.08] text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Structured
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'raw'
                  ? 'bg-white/[0.08] text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Text
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5 custom-scrollbar">
        {viewMode === 'structured' ? (
          <>
            {/* Candidate Header Card */}
            <div className="glass-card rounded-xl p-4 border-l-2 border-l-cyan-400">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 flex items-center justify-center border border-white/10 text-cyan-300 font-bold text-xs">
                  {contact.name.charAt(0) || 'C'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{contact.name}</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Identified Profile</span>
                </div>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 mt-3 pt-3 border-t border-white/[0.05]">
                {contact.email && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{contact.phone}</span>
                  </div>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 truncate transition-colors"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">LinkedIn Profile</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                  </a>
                )}
                {contact.github && (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 truncate transition-colors"
                  >
                    <GitHubIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">GitHub Profile</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                  </a>
                )}
                {contact.portfolio && (
                  <a
                    href={contact.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 truncate transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Portfolio</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                  </a>
                )}
              </div>
            </div>

            {/* Technical Skills Categorized Card */}
            {Object.keys(skills).length > 0 && (
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Extracted Skills Inventory
                  </h4>
                </div>

                <div className="space-y-3">
                  {Object.entries(skills).map(([category, skillList]) => (
                    <div key={category} className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                        {category.replace('_', ' ')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {skillList.map((sk) => (
                          <span
                            key={sk}
                            className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.04] hover:bg-cyan-500/10 border border-white/[0.08] hover:border-cyan-500/30 text-slate-200 transition-colors"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience & Projects Section */}
            {(sections.experience || sections.projects || bullets.length > 0) && (
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Experience & Achievements
                  </h4>
                </div>

                {sections.experience && (
                  <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line mb-4 bg-black/20 p-3 rounded-lg border border-white/[0.04]">
                    {sections.experience}
                  </div>
                )}

                {/* Key Bullet Highlights */}
                {bullets.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                      Identified Impact Statements ({bullets.length})
                    </span>
                    <ul className="space-y-2">
                      {bullets.slice(0, 6).map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Education & Academic Background */}
            {sections.education && (
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Education & Credentials
                  </h4>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line bg-black/20 p-3 rounded-lg border border-white/[0.04]">
                  {sections.education}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Raw Text Viewer */
          <div className="glass-card rounded-xl p-4 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed bg-black/30">
            {resume.raw_text}
          </div>
        )}
      </div>
    </div>
  );
}
