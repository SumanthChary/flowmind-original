import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Bell, User, BarChart2, Calendar, FileText, Users, Folder, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50 pt-20">
    <div className="container py-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {[...Array(6)].map((_, i) => (
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
);

const DashboardPage = () => {
  const { user, profile, loading } = useAuthStore();

  useEffect(() => {
    document.title = "Dashboard | FlowMind";
  }, []);

  const getDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  const stats = [
    {
      title: 'Active Workflows',
      value: '12',
      change: '+2 this week',
      changeType: 'positive' as const,
      icon: <BarChart2 size={20} className="text-primary-600" />
    },
    {
      title: 'Tasks Automated',
      value: '1,247',
      change: '+15% from last month',
      changeType: 'positive' as const,
      icon: <CheckCircle size={20} className="text-success-600" />
    },
    {
      title: 'Time Saved',
      value: '24.5h',
      change: 'This month',
      changeType: 'neutral' as const,
      icon: <Clock size={20} className="text-accent-600" />
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'workflow_created',
      title: 'New workflow: Email to Slack notifications',
      time: '2 hours ago',
      icon: <FileText size={16} className="text-primary-600" />
    },
    {
      id: 2,
      type: 'task_completed',
      title: 'Automated 15 customer onboarding emails',
      time: '4 hours ago',
      icon: <CheckCircle size={16} className="text-success-600" />
    },
    {
      id: 3,
      type: 'integration_added',
      title: 'Connected Google Calendar integration',
      time: '1 day ago',
      icon: <Calendar size={16} className="text-accent-600" />
    },
    {
      id: 4,
      type: 'workflow_triggered',
      title: 'Lead scoring workflow executed',
      time: '2 days ago',
      icon: <TrendingUp size={16} className="text-primary-600" />
    },
    {
      id: 5,
      type: 'error',
      title: 'Workflow "Data Sync" failed - API limit reached',
      time: '3 days ago',
      icon: <AlertCircle size={16} className="text-error-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {getDisplayName()}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your workflows today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-error-500 rounded-full"></span>
              </button>
              <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={getDisplayName()} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-accent-600">
                      {getInitials()}
                    </span>
                  </div>
                )}
                <span className="font-medium">{getDisplayName()}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-soft p-4 space-y-1">
              <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-accent-600 bg-accent-50 rounded-lg transition-colors">
                <BarChart2 size={18} className="mr-3" />
                Overview
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <FileText size={18} className="mr-3" />
                Workflows
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Calendar size={18} className="mr-3" />
                Schedule
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Users size={18} className="mr-3" />
                Team
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Folder size={18} className="mr-3" />
                Projects
              </a>
              <Link to="/profile" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings size={18} className="mr-3" />
                Settings
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-soft">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-success-600' : 
                    stat.changeType === 'negative' ? 'text-error-600' : 
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {activity.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-colors">
                    <div className="flex items-center">
                      <FileText size={18} className="text-accent-600 mr-3" />
                      <span className="font-medium">Create New Workflow</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-colors">
                    <div className="flex items-center">
                      <Users size={18} className="text-accent-600 mr-3" />
                      <span className="font-medium">Invite Team Member</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-colors">
                    <div className="flex items-center">
                      <Calendar size={18} className="text-accent-600 mr-3" />
                      <span className="font-medium">Schedule Workflow</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Workflow Success Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-success-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">API Usage</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Storage Used</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-accent-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;