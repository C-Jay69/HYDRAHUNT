
import { ResumeData } from '../types';
import { MOCK_RESUME } from '../constants';
import { supabase } from './supabase';

const LOCAL_STORAGE_KEY = 'viberesume_data';

// --- HYBRID STORAGE HELPER ---
// We need to know the current user ID to fetch from Supabase.
// Since this is a standalone service, we'll check the session directly.

const getCurrentUserId = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
};

// --- READ OPERATIONS ---

export const getResumes = async (): Promise<ResumeData[]> => {
  const userId = await getCurrentUserId();

  if (userId) {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
        console.error('Supabase fetch error:', error);
        return [];
    }
    
    // Parse the JSON data field if needed, assuming Supabase stores unstructured data in a 'data' column
    // OR mapping columns to ResumeData. 
    // For this simple integration, let's assume the table 'resumes' has a 'content' jsonb column.
    return data.map((row: any) => ({
        ...row.content, 
        id: row.id, // Ensure ID matches DB ID
        updatedAt: row.updated_at
    }));
  } 
  
  // Fallback to Local Storage for Guest
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [MOCK_RESUME];
};

export const getResume = async (id: string): Promise<ResumeData | undefined> => {
  const resumes = await getResumes();
  return resumes.find(r => r.id === id);
};

export const getFolders = async (): Promise<string[]> => {
  const resumes = await getResumes();
  const folders = new Set(resumes.map(r => r.folder || 'General'));
  return Array.from(folders).sort();
};

// --- WRITE OPERATIONS ---

export const saveResume = async (resume: ResumeData): Promise<void> => {
  const userId = await getCurrentUserId();
  const updatedResume = { ...resume, updatedAt: new Date().toISOString() };

  if (userId) {
      // Upsert to Supabase
      const { error } = await supabase
        .from('resumes')
        .upsert({ 
            id: resume.id, 
            user_id: userId,
            content: updatedResume, // Storing full object in JSONB column 'content'
            updated_at: new Date().toISOString()
        });
      
      if(error) console.error('Supabase save error:', error);
  } else {
      // Local Storage
      const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const resumes: ResumeData[] = rawData ? JSON.parse(rawData) : [MOCK_RESUME];
      const index = resumes.findIndex(r => r.id === resume.id);
      
      if (index >= 0) {
        resumes[index] = updatedResume;
      } else {
        resumes.push(updatedResume);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumes));
  }
};

export const createResume = async (folder: string = 'General'): Promise<ResumeData> => {
  const newResume: ResumeData = {
    ...MOCK_RESUME,
    id: crypto.randomUUID(),
    title: 'Untitled Resume',
    folder: folder,
    updatedAt: new Date().toISOString(),
  };
  await saveResume(newResume);
  return newResume;
};

export const deleteResume = async (id: string): Promise<void> => {
    const userId = await getCurrentUserId();
    if (userId) {
        await supabase.from('resumes').delete().eq('id', id);
    } else {
        const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (rawData) {
            const resumes: ResumeData[] = JSON.parse(rawData);
            const filtered = resumes.filter(r => r.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        }
    }
};

export const duplicateResume = async (id: string): Promise<ResumeData | null> => {
  const original = await getResume(id);
  if (!original) return null;

  const copy: ResumeData = {
    ...original,
    id: crypto.randomUUID(),
    title: `${original.title} (Copy)`,
    updatedAt: new Date().toISOString(),
  };
  await saveResume(copy);
  return copy;
};
