
import { ResumeData } from '../types';
import { MOCK_RESUME } from '../constants';
import { supabase } from './supabase';

const LOCAL_STORAGE_KEY = 'viberesume_data';

// --- HYBRID STORAGE HELPER ---
const getCurrentUserId = async (): Promise<string | null> => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.user?.id || null;
    } catch (e) {
        console.warn("Auth session check failed", e);
        return null;
    }
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
        // Fallback to local storage if DB fetch fails
        return getLocalResumes();
    }
    
    // Parse the JSON data field if needed
    // Supabase JSONB columns are returned as objects automatically by the JS client
    return data.map((row: any) => ({
        ...row.content, 
        id: row.id, // Ensure ID matches DB ID
        updatedAt: row.updated_at
    }));
  } 
  
  return getLocalResumes();
};

const getLocalResumes = (): ResumeData[] => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [MOCK_RESUME];
}

export const getResume = async (id: string): Promise<ResumeData | undefined> => {
  const resumes = await getResumes();
  return resumes.find(r => r.id === id);
};

export const getFolders = async (): Promise<string[]> => {
  const resumes = await getResumes();
  const folders = new Set(resumes.map(r => r.folder || 'General'));
  return Array.from(folders).sort();
};

// --- SYNC OPERATION (GUEST -> CLOUD) ---
export const syncGuestResumes = async (userId: string) => {
  try {
      const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!rawData) return;

      const localResumes: ResumeData[] = JSON.parse(rawData);
      if (!Array.isArray(localResumes) || localResumes.length === 0) return;

      console.log(`[Hydra] Migrating ${localResumes.length} guest resumes to cloud for user ${userId}...`);

      // Upload all to Supabase
      for (const resume of localResumes) {
          // We assume "Guest" resumes don't exist in DB yet, or if they do (by ID collision), we update them.
          const { error } = await supabase.from('resumes').upsert({
              id: resume.id,
              user_id: userId,
              content: resume,
              updated_at: resume.updatedAt || new Date().toISOString()
          });
          
          if (error) {
            console.error(`[Hydra] Failed to sync resume ${resume.id}:`, error.message);
          }
      }

      // Clear local storage to prevent duplicate views and ensure source of truth is now Cloud
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.log("[Hydra] Sync complete. Local storage cleared.");
  } catch (err) {
      console.error("[Hydra] Sync process failed:", err);
  }
};

// --- WRITE OPERATIONS ---

export const saveResume = async (resume: ResumeData): Promise<boolean> => {
  try {
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
          
          if(error) {
              console.error('Supabase save error:', error);
              // Fallback: Save to local storage anyway so user doesn't lose work
              saveToLocalStorage(updatedResume);
              return false;
          } else {
              console.log(`[Hydra] Resume ${resume.id} saved to Cloud.`);
              return true;
          }
      } else {
          // Local Storage
          saveToLocalStorage(updatedResume);
          return true;
      }
  } catch (e) {
      console.error("Save operation failed exception:", e);
      return false;
  }
};

const saveToLocalStorage = (resume: ResumeData) => {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const resumes: ResumeData[] = rawData ? JSON.parse(rawData) : [MOCK_RESUME];
    const index = resumes.findIndex(r => r.id === resume.id);
    
    if (index >= 0) {
      resumes[index] = resume;
    } else {
      resumes.push(resume);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumes));
    console.log(`[Hydra] Resume ${resume.id} saved to Local Storage.`);
}

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
        const { error } = await supabase.from('resumes').delete().eq('id', id);
        if (error) console.error("Delete failed:", error);
    } else {
        const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
        const resumes: ResumeData[] = rawData ? JSON.parse(rawData) : [MOCK_RESUME];
        const filtered = resumes.filter(r => r.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
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
