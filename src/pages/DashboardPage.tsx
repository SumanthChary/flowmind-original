import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Bell, BarChart2, Calendar, FileText, Users, Folder, TrendingUp, Clock, CheckCircle, AlertCircle, Plus, Zap, Target, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

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

  // Memoize user display data and stats
  const { userDisplayData, stats, recentActivity, workflows } = useMemo(() => {
    if (!user) return { userDisplayData: null, stats: [], recentActivity: [], workflows: [] };
    
    const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    const statsData = [
      {
        title: 'Active Workflows',
        value: '12',
        change: '+2 this week',
        changeType: 'positive' as const,
        icon: <BarChart2 size={20} className="text-primary-600" />,
        trend: '+15%'
      },
      {
        title: 'Tasks Automated',
        value: '1,247',
        change: '+15% from last month',
        changeType: 'positive' as const,
        icon: <CheckCircle size={20} className="text-success-600" />,
        trend: '+23%'
      },
      {
        title: 'Time Saved',
        value: '24.5h',
        change: 'This month',
        changeType: 'neutral' as const,
        icon: <Clock size={20} className="text-accent-600" />,
        trend: '+8%'
      }
    ];

    const activityData = [
      {
        id: 1,
        type: 'workflow_created',
        title: 'New workflow: Email to Slack notifications',
        description: 'Automatically sends Slack messages when important emails arrive',
        time: '2 hours ago',
        icon: <FileText size={16} className="text-primary-600" />,
        status: 'success'
      },
      {
        id: 2,
        type: 'task_completed',
        title: 'Automated 15 customer onboarding emails',
        description: 'Welcome sequence completed for new signups',
        time: '4 hours ago',
        icon: <CheckCircle size={16} className="text-success-600" />,
        status: 'success'
      },
      {
        id: 3,
        type: 'integration_added',
        title: 'Connected Google Calendar integration',
        description: 'Calendar events now sync with project management',
        time: '1 day ago',
        icon: <Calendar size={16} className="text-accent-600" />,
        status: 'success'
      },
      {
        id: 4,
        type: 'workflow_triggered',
        title: 'Lead scoring workflow executed',
        description: 'Processed 23 new leads and updated CRM',
        time: '2 days ago',
        icon: <TrendingUp size={16} className="text-primary-600" />,
        status: 'success'
      },
      {
        id: 5,
        type: 'error',
        title: 'Workflow "Data Sync" needs attention',
        description: 'API rate limit reached - workflow paused',
        time: '3 days ago',
        icon: <AlertCircle size={16} className="text-error-600" />,
        status: 'error'
      }
    ];

    const workflowsData = [
      {
        id: 1,
        name: 'Email to Slack Notifications',
        description: 'Forward important emails to team Slack channel',
        status: 'active',
        executions: 156,
        lastRun: '2 hours ago'
      },
      {
        id: 2,
        name: 'Customer Onboarding',
        description: 'Automated welcome sequence for new users',
        status: 'active',
        executions: 89,
        lastRun: '4 hours ago'
      },
      {
        id: 3,
        name: 'Lead Scoring & CRM Update',
        description: 'Score leads and update CRM automatically',
        status: 'active',
        executions: 234,
        lastRun: '1 day ago'
      },
      {
        id: 4,
        name: 'Data Backup Workflow',
        description: 'Daily backup of critical business data',
        status: 'paused',
        executions: 45,
        lastRun: '3 days ago'
      }
    ];
    
    return {
      userDisplayData: { displayName, initials },
      stats: statsData,
      recentActivity: activityData,
      workflows: workflowsData
    };
  }, [user, profile]);

  if (loading || !user || !userDisplayData) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userDisplayData.displayName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your workflows today.
              </p>
            </motion.div>
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-error-500 rounded-full"></span>
              </button>
              <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={userDisplayData.displayName} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-accent-600">
                      {userDisplayData.initials}
                    </span>
                  </div>
                )}
                <span className="font-medium">{userDisplayData.displayName}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-soft p-4 space-y-1"
            >
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
            </motion.nav>

            {/* Quick Create */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl p-6 text-white"
            >
              <h3 className="font-semibold mb-2">Create New Workflow</h3>
              <p className="text-accent-100 text-sm mb-4">
                Automate your tasks in minutes
              </p>
              <button className="w-full bg-white text-accent-600 font-medium py-2 px-4 rounded-lg hover:bg-accent-50 transition-colors flex items-center justify-center">
                <Plus size={16} className="mr-2" />
                Get Started
              </button>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
            >
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    {stat.icon}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <div className={`text-sm flex items-center ${
                        stat.changeType === 'positive' ? 'text-success-600' : 
                        stat.changeType === 'negative' ? 'text-error-600' : 
                        'text-gray-600'
                      }`}>
                        {stat.changeType === 'positive' && <ArrowUpRight size={14} className="mr-1" />}
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">vs last month</span>
                      <div className="text-sm font-medium text-success-600">{stat.trend}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.status === 'error' ? 'bg-error-100' : 'bg-gray-100'
                        }`}>
                          {activity.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Active Workflows */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Active Workflows</h2>
                  <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
                    Manage all
                  </button>
                </div>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="border border-gray-200 rounded-lg p-4 hover:border-accent-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              workflow.status === 'active' 
                                ? 'bg-success-100 text-success-700' 
                                : 'bg-warning-100 text-warning-700'
                            }`}>
                              {workflow.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{workflow.executions} executions</span>
                            <span>Last run: {workflow.lastRun}</span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 bg-white rounded-xl shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target size={24} className="text-success-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">94%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-success-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap size={24} className="text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">67%</div>
                  <div className="text-sm text-gray-600">API Usage</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Folder size={24} className="text-accent-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">23%</div>
                  <div className="text-sm text-gray-600">Storage Used</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-accent-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;