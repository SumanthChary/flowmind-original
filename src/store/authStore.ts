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
  tableCheckComplete: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setProfilesTableExists: (exists: boolean) => void;
  setTableCheckComplete: (complete: boolean) => void;
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
  tableCheckComplete: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  setProfilesTableExists: (exists) => set({ profilesTableExists: exists }),
  setTableCheckComplete: (complete) => set({ tableCheckComplete: complete }),
  
  checkProfilesTable: async () => {
    const { tableCheckComplete, profilesTableExists } = get();
    
    // Return cached result if check was already completed
    if (tableCheckComplete) {
      return profilesTableExists;
    }

    try {
      // Use a more targeted approach to check table existence
      // This query will fail gracefully if the table doesn't exist
      const { error } = await supabase.rpc('check_table_exists', { table_name: 'profiles' });
      
      // If the RPC doesn't exist, fall back to a simple select
      if (error && error.code === '42883') {
        const { error: selectError } = await supabase
          .from('profiles')
          .select('id')
          .limit(0); // Don't actually fetch any data
        
        if (selectError) {
          if (selectError.code === '42P01' || 
              selectError.message?.includes('does not exist') || 
              selectError.message?.includes('relation')) {
            set({ profilesTableExists: false, tableCheckComplete: true });
            return false;
          }
        }
        
        set({ profilesTableExists: true, tableCheckComplete: true });
        return true;
      }
      
      set({ profilesTableExists: true, tableCheckComplete: true });
      return true;
    } catch (error: any) {
      // Handle network or other unexpected errors
      if (error?.code === '42P01' || 
          error?.message?.includes('does not exist') ||
          error?.message?.includes('relation')) {
        set({ profilesTableExists: false, tableCheckComplete: true });
        return false;
      }
      
      // For other errors, assume table exists to avoid blocking functionality
      console.warn('Unable to verify profiles table existence:', error);
      set({ profilesTableExists: true, tableCheckComplete: true });
      return true;
    }
  },
  
  fetchProfile: async () => {
    const { user, profilesTableExists, tableCheckComplete } = get();
    if (!user) return;
    
    try {
      // Always check table existence first if not already done
      let tableExists = profilesTableExists;
      if (!tableCheckComplete) {
        tableExists = await get().checkProfilesTable();
      }
      
      if (!tableExists) {
        // Create temporary profile without making any database requests
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
        // Check if this is a table not found error that slipped through
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          set({ profilesTableExists: false, tableCheckComplete: true });
          const tempProfile: Profile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
            avatar_url: user.user_metadata?.avatar_url || null,
            updated_at: new Date().toISOString()
          };
          set({ profile: tempProfile });
          return;
        }
        
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
    } catch (error: any) {
      // Create fallback profile from user data for any error
      const tempProfile: Profile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        avatar_url: user.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString()
      };
      set({ profile: tempProfile });
      
      // Only log non-table-existence errors
      if (!(error?.code === '42P01' || error?.message?.includes('does not exist'))) {
        console.error('Error in fetchProfile:', error);
      }
    }
  },
  
  updateProfile: async (updates) => {
    const { user, profile, profilesTableExists, tableCheckComplete } = get();
    if (!user || !profile) return;

    // Optimistic update for immediate UI feedback
    const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
    set({ profile: updatedProfile });

    // Check table existence if not already done
    let tableExists = profilesTableExists;
    if (!tableCheckComplete) {
      tableExists = await get().checkProfilesTable();
    }

    // If profiles table doesn't exist, just keep the local update
    if (!tableExists) {
      // Show a subtle notification only once per session
      if (!sessionStorage.getItem('migration-notice-shown')) {
        toast('Profile updated locally. Run database migration for persistence.', {
          icon: 'ℹ️',
          duration: 4000,
        });
        sessionStorage.setItem('migration-notice-shown', 'true');
      }
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
          set({ profilesTableExists: false, tableCheckComplete: true });
          if (!sessionStorage.getItem('migration-notice-shown')) {
            toast('Profile updated locally. Database migration required for persistence.', {
              icon: 'ℹ️',
              duration: 4000,
            });
            sessionStorage.setItem('migration-notice-shown', 'true');
          }
          return;
        }
        // Revert optimistic update on other errors
        set({ profile });
        throw error;
      }

      // Fetch the updated profile to ensure consistency
      await get().fetchProfile();
      toast.success('Profile updated successfully!');
      
    } catch (error: any) {
      // Revert optimistic update on error
      set({ profile });
      
      // Only show error toast for non-table-existence errors
      if (!(error?.code === '42P01' || error?.message?.includes('does not exist'))) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again.');
      }
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ 
        user: null, 
        profile: null, 
        profilesTableExists: false, 
        tableCheckComplete: false 
      });
      // Clear session storage on sign out
      sessionStorage.removeItem('migration-notice-shown');
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
    
    // Check table existence first, then fetch profile if user exists
    if (session?.user) {
      // Check table existence first to prevent unnecessary API calls
      const tableExists = await store.checkProfilesTable();
      if (tableExists) {
        // Only fetch profile if table exists
        store.fetchProfile().catch(() => {
          // Silently handle errors during initialization
        });
      } else {
        // Create temporary profile immediately if table doesn't exist
        const tempProfile: Profile = {
          id: session.user.id,
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
          avatar_url: session.user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString()
        };
        store.setProfile(tempProfile);
      }
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
      
      // Check table existence before attempting to fetch profile
      const tableExists = await store.checkProfilesTable();
      if (tableExists) {
        // Fetch profile asynchronously for better performance
        store.fetchProfile().catch(() => {
          // Silently handle errors during auth state changes
        });
      } else {
        // Create temporary profile immediately if table doesn't exist
        const tempProfile: Profile = {
          id: session.user.id,
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
          avatar_url: session.user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString()
        };
        store.setProfile(tempProfile);
      }
    } else if (event === 'SIGNED_OUT') {
      store.setUser(null);
      store.setProfile(null);
      store.setProfilesTableExists(false);
      store.setTableCheckComplete(false);
      sessionStorage.removeItem('migration-notice-shown');
    }
  }, 100); // 100ms debounce
});