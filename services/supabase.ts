
import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const SUPABASE_URL = 'https://hilzudqxmtatbmidpiku.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpbHp1ZHF4bXRhdGJtaWRwaWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTgzNjYsImV4cCI6MjA3OTM5NDM2Nn0.Hno95rxgRWuf4o6W_0Op90VgS4PzrJyWdxDZnCNjqWo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
