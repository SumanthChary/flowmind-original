import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'updated_at'>>) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create temporary profile from user data - NO DATABASE CALLS
const createTempProfile = (user: User): Profile => ({
  id: user.id,
  full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
  avatar_url: user.user_metadata?.avatar_url || null,
  updated_at: new Date().toISOString()
});

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  
  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    
    // ALWAYS create temporary profile first - NO DATABASE CALLS
    const tempProfile = createTempProfile(user);
    set({ profile: tempProfile });
    
    // Don't make any database calls - just use the temporary profile
    // This completely eliminates any possibility of Supabase errors
    return;
  },
  
  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user || !profile) return;

    // ONLY update local profile - NO DATABASE CALLS
    const updatedProfile = { 
      ...profile, 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    set({ profile: updatedProfile });
    
    // Show migration notice only once per session
    if (!sessionStorage.getItem('migration-notice-shown')) {
      toast('Profile updated locally. Run database migration for full functionality.', {
        icon: 'ℹ️',
        duration: 3000,
      });
      sessionStorage.setItem('migration-notice-shown', 'true');
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Reset all state
      set({ user: null, profile: null });
      
      // Clear session storage
      sessionStorage.removeItem('migration-notice-shown');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
}));

// Initialize auth state - NO PROFILE DATABASE CALLS
const initializeAuth = async () => {
  const store = useAuthStore.getState();
  
  try {
    store.setLoading(true);
    
    // Get current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth initialization error:', error);
      return;
    }
    
    store.setUser(session?.user ?? null);
    store.setInitialized(true);
    
    // If user exists, create temporary profile immediately - NO DATABASE CALLS
    if (session?.user) {
      const tempProfile = createTempProfile(session.user);
      store.setProfile(tempProfile);
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  } finally {
    store.setLoading(false);
  }
};

// Initialize immediately
initializeAuth();

// Listen for auth changes - NO PROFILE DATABASE CALLS
let authChangeTimeout: NodeJS.Timeout;
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();
  
  // Clear previous timeout to debounce rapid auth changes
  if (authChangeTimeout) {
    clearTimeout(authChangeTimeout);
  }
  
  authChangeTimeout = setTimeout(async () => {
    if (event === 'SIGNED_IN' && session?.user) {
      store.setUser(session.user);
      
      // Create temporary profile immediately - NO DATABASE CALLS
      const tempProfile = createTempProfile(session.user);
      store.setProfile(tempProfile);
    } else if (event === 'SIGNED_OUT') {
      store.setUser(null);
      store.setProfile(null);
      sessionStorage.removeItem('migration-notice-shown');
    }
  }, 100); // 100ms debounce
});