export interface ContactInfo {
  name: string;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
}

export interface ResumeSections {
  summary: string;
  experience: string;
  projects: string;
  skills: string;
  education: string;
  certifications: string;
  other: string;
}

export interface ParsedResume {
  filename: string;
  word_count: number;
  char_count: number;
  contact: ContactInfo;
  sections: ResumeSections;
  skills: Record<string, string[]>;
  bullets: string[];
  raw_text: string;
}

export interface ScoreBreakdown {
  section_score: number; // max 25
  impact_score: number;  // max 25
  brevity_score: number; // max 20
  keyword_score: number; // max 30
}

export interface MetricsFound {
  metric_count: number;
  action_verb_count: number;
  total_words: number;
  detected_skills_count: number;
}

export interface KeywordGap {
  matched_core: string[];
  missing_core: string[];
  matched_bonus: string[];
  missing_bonus: string[];
  core_match_percent: number;
}

export interface ImprovementItem {
  type: 'critical' | 'recommended' | 'minor';
  title: string;
  desc: string;
}

export interface OptimizedBullet {
  original: string;
  rewritten: string;
  reasons: string[];
  score_before: number;
  score_after: number;
}

export interface ATSAnalysis {
  overall_score: number;
  tier: string;
  tier_color: string;
  breakdown: ScoreBreakdown;
  metrics_found: MetricsFound;
  keyword_gap: KeywordGap;
  improvements: ImprovementItem[];
  optimized_bullets: OptimizedBullet[];
}

export interface AnalysisResponse {
  success: boolean;
  parsed: ParsedResume;
  analysis: ATSAnalysis;
  target_role: string;
}
