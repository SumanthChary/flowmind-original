import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setUser(session?.user ?? null);
  useAuthStore.getState().setLoading(false);
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setUser(session?.user ?? null);
});