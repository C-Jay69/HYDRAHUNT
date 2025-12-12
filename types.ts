
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

export interface ResumeData {
  id: string;
  title: string;
  folder?: string; // New field for categorization
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  location: string;
  website: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  templateId: string;
  updatedAt?: string;
}

export enum TemplateId {
  CYBER = 'cyber',
  MINIMAL = 'minimal',
  BOLD = 'bold',
  TERMINAL = 'terminal', // Matrix/Hacker style
  BRUTALIST = 'brutalist', // High contrast, raw
  NEON = 'neon', // Dark mode, glowing
  QUANTUM = 'quantum', // Scientific, precise
  GRID = 'grid', // Boxy, organized
  SWISS = 'swiss', // Clean typography, asymmetry
}

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  colors: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}