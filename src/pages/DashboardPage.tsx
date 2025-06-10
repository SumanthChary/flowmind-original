import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  Bell, 
  BarChart2, 
  Calendar, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Plus, 
  Zap, 
  Target, 
  ArrowUpRight,
  Play,
  Pause,
  MoreVertical,
  Workflow
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    document.title = "Dashboard | FlowMind";
  }, []);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const stats = [
    {
      title: 'Active Workflows',
      value: '12',
      change: '+2 this week',
      changeType: 'positive' as const,
      icon: <Zap size={20} className="text-primary-600" />,
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
    },
    {
      title: 'Success Rate',
      value: '94%',
      change: '+2% improvement',
      changeType: 'positive' as const,
      icon: <Target size={20} className="text-success-600" />,
      trend: '+2%'
    }
  ];

  const workflows = [
    {
      id: 1,
      name: 'Email to Slack Notifications',
      description: 'Forward important emails to team Slack channel',
      status: 'active',
      executions: 156,
      lastRun: '2 hours ago',
      success: 98
    },
    {
      id: 2,
      name: 'Customer Onboarding',
      description: 'Automated welcome sequence for new users',
      status: 'active',
      executions: 89,
      lastRun: '4 hours ago',
      success: 95
    },
    {
      id: 3,
      name: 'Lead Scoring & CRM Update',
      description: 'Score leads and update CRM automatically',
      status: 'active',
      executions: 234,
      lastRun: '1 day ago',
      success: 92
    },
    {
      id: 4,
      name: 'Data Backup Workflow',
      description: 'Daily backup of critical business data',
      status: 'paused',
      executions: 45,
      lastRun: '3 days ago',
      success: 100
    }
  ];

  const recentActivity = [
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your workflows today.
              </p>
            </motion.div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-error-500 rounded-full"></span>
              </button>
              <Link to="/profile" className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={displayName} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-accent-600">
                      {initials}
                    </span>
                  </div>
                )}
                <span className="font-medium">{displayName}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow"
            >
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
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workflows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Active Workflows</h2>
                <Link 
                  to="/workflow-builder"
                  className="btn-primary flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  New Workflow
                </Link>
              </div>
              <div className="space-y-4">
                {workflows.map((workflow, index) => (
                  <motion.div 
                    key={workflow.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-accent-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            workflow.status === 'active' 
                              ? 'bg-success-100 text-success-700' 
                              : 'bg-warning-100 text-warning-700'
                          }`}>
                            {workflow.status}
                          </span>
                          <span className="text-xs text-gray-500">{workflow.success}% success</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{workflow.executions} executions</span>
                          <span>Last run: {workflow.lastRun}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className={`p-2 rounded-lg transition-colors ${
                          workflow.status === 'active' 
                            ? 'text-warning-600 hover:bg-warning-50' 
                            : 'text-success-600 hover:bg-success-50'
                        }`}>
                          {workflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Performance Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart2 size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Performance charts coming soon</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl p-6 text-white"
            >
              <h3 className="font-semibold mb-2">Create New Workflow</h3>
              <p className="text-accent-100 text-sm mb-4">
                Automate your tasks in minutes
              </p>
              <Link 
                to="/workflow-builder"
                className="w-full bg-white text-accent-600 font-medium py-2 px-4 rounded-lg hover:bg-accent-50 transition-colors flex items-center justify-center"
              >
                <Workflow size={16} className="mr-2" />
                Get Started
              </Link>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {activity.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white rounded-xl shadow-soft p-4 space-y-1"
            >
              <a href="#" className="flex items-center px-4 py-3 text-sm font-medium text-accent-600 bg-accent-50 rounded-lg transition-colors">
                <BarChart2 size={18} className="mr-3" />
                Overview
              </a>
              <Link to="/workflow-builder" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Workflow size={18} className="mr-3" />
                Workflow Builder
              </Link>
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
              <Link to="/profile" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings size={18} className="mr-3" />
                Settings
              </Link>
            </motion.nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;