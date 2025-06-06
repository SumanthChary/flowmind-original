import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

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
  profileLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setProfileLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  profileLoading: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setProfileLoading: (profileLoading) => set({ profileLoading }),
  setInitialized: (initialized) => set({ initialized }),
  
  fetchProfile: async () => {
    const { user, profile } = get();
    if (!user || profile) return; // Don't fetch if already have profile
    
    set({ profileLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        set({ profile: data });
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: user.user_metadata?.full_name || '',
              avatar_url: null,
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          set({ profile: newProfile });
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      set({ profileLoading: false });
    }
  },
  
  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user || !profile) return;

    // Optimistic update
    const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
    set({ profile: updatedProfile });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        // Revert on error
        set({ profile });
        throw error;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
}));

// Initialize auth state with faster loading
const initializeAuth = async () => {
  const store = useAuthStore.getState();
  
  try {
    // Get session immediately without waiting
    const { data: { session } } = await supabase.auth.getSession();
    
    store.setUser(session?.user ?? null);
    store.setInitialized(true);
    store.setLoading(false);
    
    // Fetch profile in background if user exists
    if (session?.user) {
      store.fetchProfile();
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    store.setLoading(false);
    store.setInitialized(true);
  }
};

// Initialize immediately
initializeAuth();

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    store.setUser(session.user);
    store.fetchProfile();
  } else if (event === 'SIGNED_OUT') {
    store.setUser(null);
    store.setProfile(null);
  }
});