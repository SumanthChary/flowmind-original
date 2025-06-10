import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

const LoadingSkeleton = () => {
  // Memoize skeleton to prevent re-renders
  const skeletonItems = useMemo(() => Array.from({ length: 4 }, (_, i) => i), []);
  const workflowItems = useMemo(() => Array.from({ length: 3 }, (_, i) => i), []);
  const activityItems = useMemo(() => Array.from({ length: 5 }, (_, i) => i), []);
  const sidebarItems = useMemo(() => Array.from({ length: 3 }, (_, i) => i), []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {skeletonItems.map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-soft">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-soft p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-4">
                    {workflowItems.map((j) => (
                      <div key={j} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1 space-y-6">
              {sidebarItems.map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-soft p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-3">
                    {activityItems.map((j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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