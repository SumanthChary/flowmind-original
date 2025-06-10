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
  profilesTableExists: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setProfilesTableExists: (exists: boolean) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'updated_at'>>) => Promise<void>;
  signOut: () => Promise<void>;
  checkProfilesTable: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,
  profilesTableExists: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  setProfilesTableExists: (exists) => set({ profilesTableExists: exists }),
  
  checkProfilesTable: async () => {
    try {
      // Try a simple query to check if the table exists
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          set({ profilesTableExists: false });
          return false;
        }
        // Other errors might be permissions related, assume table exists
        set({ profilesTableExists: true });
        return true;
      }
      
      set({ profilesTableExists: true });
      return true;
    } catch (error) {
      console.error('Error checking profiles table:', error);
      set({ profilesTableExists: false });
      return false;
    }
  },
  
  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      // Check if profiles table exists first
      const tableExists = await get().checkProfilesTable();
      
      if (!tableExists) {
        console.warn('Profiles table does not exist. Using user metadata for temporary profile.');
        const tempProfile: Profile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString()
        };
        set({ profile: tempProfile });
        return;
      }

      // Table exists, proceed with normal query
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
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
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
              avatar_url: user.user_metadata?.avatar_url || null,
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        } else {
          set({ profile: newProfile });
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      // Create fallback profile from user data
      const tempProfile: Profile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        avatar_url: user.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString()
      };
      set({ profile: tempProfile });
    }
  },
  
  updateProfile: async (updates) => {
    const { user, profile, profilesTableExists } = get();
    if (!user || !profile) return;

    // Optimistic update for immediate UI feedback
    const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
    set({ profile: updatedProfile });

    // If profiles table doesn't exist, just keep the local update
    if (!profilesTableExists) {
      console.warn('Profiles table does not exist. Keeping local profile changes only.');
      toast.success('Profile updated locally. Database migration required for persistence.');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        // Check if table was deleted after our initial check
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('Profiles table no longer exists. Keeping local changes.');
          set({ profilesTableExists: false });
          toast.success('Profile updated locally. Database migration required for persistence.');
          return;
        }
        // Revert optimistic update on other errors
        set({ profile });
        throw error;
      }

      // Fetch the updated profile to ensure consistency
      await get().fetchProfile();
      toast.success('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // Revert optimistic update on error
      set({ profile });
      toast.error('Failed to update profile. Please try again.');
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null, profilesTableExists: false });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
}));

// Initialize auth state with performance optimization
const initializeAuth = async () => {
  const store = useAuthStore.getState();
  
  try {
    store.setLoading(true);
    
    // Use cached session if available
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth initialization error:', error);
      return;
    }
    
    store.setUser(session?.user ?? null);
    store.setInitialized(true);
    
    // Fetch profile if user exists (non-blocking)
    if (session?.user) {
      // Don't await to make initialization faster
      store.fetchProfile().catch(console.error);
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  } finally {
    store.setLoading(false);
  }
};

// Initialize immediately
initializeAuth();

// Listen for auth changes with debouncing
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
      // Fetch profile asynchronously for better performance
      store.fetchProfile().catch(console.error);
    } else if (event === 'SIGNED_OUT') {
      store.setUser(null);
      store.setProfile(null);
      store.setProfilesTableExists(false);
    }
  }, 100); // 100ms debounce
});