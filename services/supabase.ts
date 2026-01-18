
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const hasCreds = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const supabase = hasCreds 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : ({
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOtp: async (_opts: any) => ({ error: { message: 'Supabase not configured' } }),
        signInWithOAuth: async (_opts: any) => ({ error: { message: 'Supabase not configured' } }),
        signOut: async () => ({})
      },
      from: (_table: string) => ({
        select: async () => ({ data: [], error: { message: 'Supabase not configured' } }),
        upsert: async () => ({ error: { message: 'Supabase not configured' } }),
        delete: async () => ({ error: { message: 'Supabase not configured' } }),
        eq: (_col: string, _val: any) => ({ select: async () => ({ data: [], error: { message: 'Supabase not configured' } }) })
      })
    } as any);
