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
  profilesTableExists: boolean | null; // null = not checked, true = exists, false = doesn't exist
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setProfilesTableExists: (exists: boolean | null) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'updated_at'>>) => Promise<void>;
  signOut: () => Promise<void>;
  checkProfilesTableExists: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,
  profilesTableExists: null, // Start with null to indicate not checked
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  setProfilesTableExists: (exists) => set({ profilesTableExists: exists }),
  
  checkProfilesTableExists: async () => {
    const { profilesTableExists } = get();
    
    // Return cached result if already checked
    if (profilesTableExists !== null) {
      return profilesTableExists;
    }

    try {
      // Try a minimal query to check if table exists
      // Use limit 0 to avoid fetching any actual data
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(0);

      if (error) {
        // Check for table not found errors
        if (error.code === '42P01' || 
            error.message?.includes('does not exist') || 
            error.message?.includes('relation')) {
          set({ profilesTableExists: false });
          return false;
        }
        
        // For other errors, log and assume table doesn't exist to be safe
        console.warn('Profiles table check failed:', error);
        set({ profilesTableExists: false });
        return false;
      }
      
      // No error means table exists
      set({ profilesTableExists: true });
      return true;
    } catch (error: any) {
      // Handle any unexpected errors
      console.warn('Profiles table existence check failed:', error);
      set({ profilesTableExists: false });
      return false;
    }
  },
  
  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      // Check if profiles table exists first
      const tableExists = await get().checkProfilesTableExists();
      
      if (!tableExists) {
        // Create temporary profile immediately without any database calls
        const tempProfile: Profile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString()
        };
        set({ profile: tempProfile });
        return;
      }

      // Table exists, proceed with database query
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        // If we get a table not found error here, update our cache
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          set({ profilesTableExists: false });
          // Create temporary profile
          const tempProfile: Profile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
            avatar_url: user.user_metadata?.avatar_url || null,
            updated_at: new Date().toISOString()
          };
          set({ profile: tempProfile });
          return;
        }
        
        throw error;
      }

      if (data) {
        set({ profile: data });
      } else {
        // Profile doesn't exist, create it
        try {
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
            throw createError;
          }
          
          set({ profile: newProfile });
        } catch (insertError: any) {
          // If insert fails due to table not existing, create temp profile
          if (insertError.code === '42P01' || insertError.message?.includes('does not exist')) {
            set({ profilesTableExists: false });
            const tempProfile: Profile = {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
              avatar_url: user.user_metadata?.avatar_url || null,
              updated_at: new Date().toISOString()
            };
            set({ profile: tempProfile });
            return;
          }
          throw insertError;
        }
      }
    } catch (error: any) {
      // For any error, create a fallback profile
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
    const { user, profile, profilesTableExists } = get();
    if (!user || !profile) return;

    // Always update local profile immediately for responsive UI
    const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
    set({ profile: updatedProfile });

    // If we know the table doesn't exist, don't make any database calls
    if (profilesTableExists === false) {
      // Show migration notice only once per session
      if (!sessionStorage.getItem('migration-notice-shown')) {
        toast('Profile updated locally. Run database migration for persistence.', {
          icon: 'ℹ️',
          duration: 4000,
        });
        sessionStorage.setItem('migration-notice-shown', 'true');
      }
      return;
    }

    // If we haven't checked table existence yet, check it first
    if (profilesTableExists === null) {
      const tableExists = await get().checkProfilesTableExists();
      if (!tableExists) {
        // Table doesn't exist, show notice and return
        if (!sessionStorage.getItem('migration-notice-shown')) {
          toast('Profile updated locally. Database migration required for persistence.', {
            icon: 'ℹ️',
            duration: 4000,
          });
          sessionStorage.setItem('migration-notice-shown', 'true');
        }
        return;
      }
    }

    // Table exists, proceed with database update
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        // Check if table was deleted after our check
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          set({ profilesTableExists: false });
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

      // Success - fetch updated profile to ensure consistency
      await get().fetchProfile();
      
    } catch (error: any) {
      // Revert optimistic update on error
      set({ profile });
      
      // Only show error for non-table-existence errors
      if (!(error?.code === '42P01' || error?.message?.includes('does not exist'))) {
        console.error('Error updating profile:', error);
        throw error;
      }
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Reset all state
      set({ 
        user: null, 
        profile: null, 
        profilesTableExists: null // Reset to null so it gets checked again on next login
      });
      
      // Clear session storage
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
    
    // Get current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth initialization error:', error);
      return;
    }
    
    store.setUser(session?.user ?? null);
    store.setInitialized(true);
    
    // If user exists, handle profile setup
    if (session?.user) {
      // Check table existence and handle profile accordingly
      const tableExists = await store.checkProfilesTableExists();
      
      if (tableExists) {
        // Table exists, fetch profile from database
        store.fetchProfile().catch(() => {
          // Silently handle errors during initialization
        });
      } else {
        // Table doesn't exist, create temporary profile immediately
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
      
      // Check table existence before attempting any database operations
      const tableExists = await store.checkProfilesTableExists();
      
      if (tableExists) {
        // Table exists, fetch profile from database
        store.fetchProfile().catch(() => {
          // Silently handle errors during auth state changes
        });
      } else {
        // Table doesn't exist, create temporary profile immediately
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
      store.setProfilesTableExists(null); // Reset to null for next login
      sessionStorage.removeItem('migration-notice-shown');
    }
  }, 100); // 100ms debounce
});