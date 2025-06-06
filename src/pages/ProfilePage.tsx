import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, Camera, Save, Calendar, Shield, Activity } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50 pt-20">
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 animate-pulse">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
          
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-soft p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-soft p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user, profile, updateProfile, signOut, loading, profileLoading } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    document.title = "Profile | FlowMind";
  }, []);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  // Memoize user display data
  const userDisplayData = useMemo(() => {
    if (!user) return null;
    
    const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Unknown';
    const lastUpdated = profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Never';
    
    return { displayName, initials, joinDate, lastUpdated };
  }, [user, profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }
    
    setIsLoading(true);

    try {
      await updateProfile({ full_name: fullName.trim() });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
      console.error('Error signing out:', error);
    }
  };

  if (loading || !user || !userDisplayData) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={userDisplayData.displayName} 
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl font-bold text-white">
                          {userDisplayData.initials}
                        </span>
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-medium hover:shadow-lg transition-shadow">
                      <Camera size={16} className="text-gray-600" />
                    </button>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {userDisplayData.displayName}
                  </h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-error-600 bg-error-50 hover:bg-error-100 rounded-lg transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-6 bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity size={16} className="text-accent-600 mr-2" />
                      <span className="text-sm text-gray-600">Workflows</span>
                    </div>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield size={16} className="text-success-600 mr-2" />
                      <span className="text-sm text-gray-600">Tasks Automated</span>
                    </div>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-primary-600 mr-2" />
                      <span className="text-sm text-gray-600">Time Saved</span>
                    </div>
                    <span className="font-medium">24.5h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Settings */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                        disabled={profileLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={user.email || ''}
                        disabled
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading || profileLoading}
                      className="flex items-center btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Account Information */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Calendar size={16} className="text-primary-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Member Since</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{userDisplayData.joinDate}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Activity size={16} className="text-accent-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Last Updated</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{userDisplayData.lastUpdated}</p>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security & Privacy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button className="btn-secondary text-sm">
                      Enable
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Login Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                    </div>
                    <button className="btn-secondary text-sm">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;