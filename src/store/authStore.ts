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
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
}

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

// Initialize auth state
const initializeAuth = async () => {
  const store = useAuthStore.getState();
  
  try {
    store.setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    store.setUser(session?.user ?? null);
    store.setInitialized(true);
    
    // Fetch profile if user exists
    if (session?.user) {
      await store.fetchProfile();
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  } finally {
    store.setLoading(false);
  }
};

// Initialize immediately
initializeAuth();

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    store.setUser(session.user);
    await store.fetchProfile();
  } else if (event === 'SIGNED_OUT') {
    store.setUser(null);
    store.setProfile(null);
  }
});