// HydraHunt Frontend Types

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export enum SubscriptionTier {
  SCOUT = 'SCOUT',
  HUNTER = 'HUNTER',
  HYDRA = 'HYDRA'
}

export enum TemplateId {
  CYBER = 'cyber',
  MINIMAL = 'minimal',
  BOLD = 'bold',
  TERMINAL = 'terminal',
  BRUTALIST = 'brutalist',
  NEON = 'neon',
  QUANTUM = 'quantum',
  GRID = 'grid',
  SWISS = 'swiss',
}

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  colors: string[];
}

export interface ResumeData {
  id: string;
  userId: string;
  title: string;
  folder?: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  summary: string;
  templateId: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  lethalityScore?: number;
  atsScore?: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  subscriptionTier: SubscriptionTier;
}

export interface JobStrike {
  id: string;
  userId: string;
  resumeId?: string;
  jobTitle: string;
  company: string;
  location: string;
  jobUrl?: string;
  description?: string;
  status: 'PENDING' | 'CONFIRMED' | 'TERMINATED' | 'INTERVIEWING' | 'OFFER';
  matchScore?: number;
  appliedAt: string;
  notes?: string;
}

export interface JobTarget {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  jobUrl: string;
  source?: string;
  matchScore?: number;
  missingSkills?: string[];
  status: 'NEW' | 'APPLIED' | 'SKIPPED';
  isArchived: boolean;
}

export interface AnalysisReport {
  score: number;
  critique: string;
  improvements: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface GeneralAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface ATSAnalysis {
  score: number;
  passAts: boolean;
  keywords: { found: string[]; missing: string[] };
  issues: string[];
  suggestions: string[];
}

export interface TransitionAnalysis {
  feasibility: number; // 0-100
  gaps: string[];
  strengths: string[];
  roadmap: string[];
  courses: string[];
}

export interface JobListing {
  title: string;
  company: string;
  location: string;
  salary?: string;
  url: string;
  matchScore: number;
}

// UI State Types
export type View = 'landing' | 'dashboard' | 'editor' | 'templates' | 'pricing' | 'login' | 'converter';

export type EditorTab = 'personal' | 'experience' | 'education' | 'skills' | 'intel';

export type AiStep =
  | 'input'
  | 'analyzing'
  | 'report'
  | 'fixing'
  | 'fix_success'
  | 'suggesting_roles'
  | 'roles_result'
  | 'transition_input'
  | 'transition_analyzing'
  | 'transition_report'
  | 'job_hunt_input'
  | 'job_hunt_scanning'
  | 'job_hunt_results'
  | 'chat'
  | 'input_job_fit'
  | 'initial_scan'
  | 'initial_results'
  | 'ats_scanning'
  | 'ats_results';
