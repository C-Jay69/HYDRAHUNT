
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabase';
import { syncGuestResumes } from '../services/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>; // Magic Link
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@hydrahunt.com';
const ADMIN_KEY = 'hydra_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check for Admin Bypass first
    const adminSession = localStorage.getItem(ADMIN_KEY);
    if (adminSession) {
        setAdminUser();
        setIsLoading(false);
        return;
    }

    // 2. Check active Supabase sessions
    const checkSupabaseSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await mapSupabaseUser(session.user);
        } else {
            setIsLoading(false);
        }
    };
    checkSupabaseSession();

    // 3. Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // If we are in admin mode, ignore Supabase "signed out" events if they happen
      if (localStorage.getItem(ADMIN_KEY)) return;

      if (session?.user) {
        await mapSupabaseUser(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setAdminUser = () => {
      setUser({
          id: 'ADMIN_OVERRIDE',
          name: 'COMMANDER (ADMIN)',
          email: ADMIN_EMAIL,
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256'
      });
  };

  const mapSupabaseUser = async (sbUser: any) => {
    setIsLoading(true);
    
    // Attempt to sync local storage data to the new account
    try {
        await syncGuestResumes(sbUser.id);
    } catch (e) {
        console.warn("Background sync error:", e);
    }

    const newUser: User = {
      id: sbUser.id,
      name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Hunter',
      email: sbUser.email || '',
      avatar: sbUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sbUser.email}`
    };
    setUser(newUser);
    setIsLoading(false);
  };

  const login = async (email: string) => {
    setIsLoading(true);

    // --- ADMIN OVERRIDE ---
    if (email.toLowerCase() === ADMIN_EMAIL) {
        localStorage.setItem(ADMIN_KEY, 'true');
        setAdminUser();
        setIsLoading(false);
        return;
    }

    // Standard Supabase Login
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      alert(error.message);
      setIsLoading(false);
    } else {
      alert('Magic link sent to your email!');
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
         redirectTo: window.location.origin
      }
    });
    if (error) {
        console.error(error);
        alert("Google Login Failed: " + error.message);
        setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    if (localStorage.getItem(ADMIN_KEY)) {
        localStorage.removeItem(ADMIN_KEY);
        setUser(null);
    } else {
        await supabase.auth.signOut();
        setUser(null);
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
