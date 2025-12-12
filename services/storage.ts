
import { ResumeData, TemplateId } from '../types';
import { MOCK_RESUME } from '../constants';

const STORAGE_KEY = 'viberesume_data';

export const getResumes = (): ResumeData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [MOCK_RESUME];
};

export const getResume = (id: string): ResumeData | undefined => {
  const resumes = getResumes();
  return resumes.find(r => r.id === id);
};

export const saveResume = (resume: ResumeData): void => {
  const resumes = getResumes();
  const index = resumes.findIndex(r => r.id === resume.id);
  
  const updatedResume = { ...resume, updatedAt: new Date().toISOString() };

  if (index >= 0) {
    resumes[index] = updatedResume;
  } else {
    resumes.push(updatedResume);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
};

export const createResume = (folder: string = 'General'): ResumeData => {
  const newResume: ResumeData = {
    ...MOCK_RESUME,
    id: crypto.randomUUID(),
    title: 'Untitled Resume',
    folder: folder,
    updatedAt: new Date().toISOString(),
  };
  saveResume(newResume);
  return newResume;
};

export const deleteResume = (id: string): void => {
  const resumes = getResumes().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
};

export const getFolders = (): string[] => {
  const resumes = getResumes();
  const folders = new Set(resumes.map(r => r.folder || 'General'));
  return Array.from(folders).sort();
};

export const duplicateResume = (id: string): ResumeData | null => {
  const original = getResume(id);
  if (!original) return null;

  const copy: ResumeData = {
    ...original,
    id: crypto.randomUUID(),
    title: `${original.title} (Copy)`,
    updatedAt: new Date().toISOString(),
  };
  saveResume(copy);
  return copy;
};
