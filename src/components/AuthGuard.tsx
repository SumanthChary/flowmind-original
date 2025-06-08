import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 pt-20">
    <div className="container py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-soft">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading, initialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !loading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, loading, initialized, navigate]);

  // Show loading only if not initialized or still loading
  if (!initialized || loading) {
    return <LoadingSkeleton />;
  }

  // If no user, return null (will redirect)
  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;