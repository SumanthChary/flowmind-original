import { useEffect, useState, useMemo, useCallback } from 'react';
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
  Workflow,
  AlertCircle,
  Activity,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWorkflowStore } from '../store/workflowStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user, profile } = useAuthStore();
  const { workflows, executionLogs, loadAllWorkflows, deleteWorkflow } = useWorkflowStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | FlowMind";
  }, []);

  // Load workflows when component mounts
  useEffect(() => {
    const loadWorkflows = async () => {
      setLoading(true);
      await loadAllWorkflows();
      setLoading(false);
    };
    
    if (user) {
      loadWorkflows();
    }
  }, [user, loadAllWorkflows]);

  // Memoize expensive calculations
  const dashboardData = useMemo(() => {
    const activeWorkflows = workflows.filter(w => w.status === 'active');
    const totalExecutions = executionLogs.length;
    const successfulExecutions = executionLogs.filter(log => log.status === 'success').length;
    const successRate = totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0;
    
    // Calculate time saved (estimate 5 minutes per successful execution)
    const timeSavedMinutes = successfulExecutions * 5;
    const timeSavedHours = Math.round(timeSavedMinutes / 60 * 10) / 10;

    return {
      activeWorkflows,
      totalExecutions,
      successfulExecutions,
      successRate,
      timeSavedHours
    };
  }, [workflows, executionLogs]);

  const displayName = useMemo(() => 
    profile?.full_name || user?.email?.split('@')[0] || 'User',
    [profile?.full_name, user?.email]
  );

  const initials = useMemo(() => 
    displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    [displayName]
  );

  // Memoize stats to prevent recalculation
  const stats = useMemo(() => [
    {
      title: 'Active Workflows',
      value: dashboardData.activeWorkflows.length.toString(),
      change: workflows.length > dashboardData.activeWorkflows.length ? `+${workflows.length - dashboardData.activeWorkflows.length} draft` : 'All active',
      changeType: 'positive' as const,
      icon: <Zap size={20} className="text-primary-600" />,
      trend: workflows.length > 0 ? '+15%' : '0%'
    },
    {
      title: 'Tasks Automated',
      value: dashboardData.totalExecutions.toLocaleString(),
      change: dashboardData.totalExecutions > 0 ? `${dashboardData.successfulExecutions} successful` : 'No executions yet',
      changeType: dashboardData.totalExecutions > 0 ? 'positive' as const : 'neutral' as const,
      icon: <CheckCircle size={20} className="text-success-600" />,
      trend: dashboardData.totalExecutions > 0 ? '+23%' : '0%'
    },
    {
      title: 'Time Saved',
      value: dashboardData.timeSavedHours > 0 ? `${dashboardData.timeSavedHours}h` : '0h',
      change: 'This month',
      changeType: 'neutral' as const,
      icon: <Clock size={20} className="text-accent-600" />,
      trend: dashboardData.timeSavedHours > 0 ? '+8%' : '0%'
    },
    {
      title: 'Success Rate',
      value: `${dashboardData.successRate}%`,
      change: dashboardData.totalExecutions > 0 ? `${dashboardData.successfulExecutions}/${dashboardData.totalExecutions} runs` : 'No data',
      changeType: dashboardData.successRate >= 90 ? 'positive' as const : dashboardData.successRate >= 70 ? 'neutral' as const : 'negative' as const,
      icon: <Target size={20} className="text-success-600" />,
      trend: dashboardData.successRate > 0 ? `${dashboardData.successRate >= 90 ? '+' : ''}${dashboardData.successRate - 90}%` : '0%'
    }
  ], [dashboardData, workflows.length]);

  // Memoize recent workflows with real data
  const recentWorkflows = useMemo(() => 
    workflows
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 6)
      .map(workflow => {
        const workflowLogs = executionLogs.filter(log => log.workflowId === workflow.id);
        const lastExecution = workflowLogs[0];
        const successCount = workflowLogs.filter(log => log.status === 'success').length;
        const workflowSuccessRate = workflowLogs.length > 0 ? Math.round((successCount / workflowLogs.length) * 100) : 0;
        
        return {
          id: workflow.id,
          name: workflow.name,
          description: workflow.description || 'No description',
          status: workflow.status,
          executions: workflowLogs.length,
          lastRun: lastExecution ? new Date(lastExecution.timestamp).toLocaleString() : 'Never',
          success: workflowSuccessRate,
          updated_at: workflow.updated_at,
          size: workflow.size || 0
        };
      }),
    [workflows, executionLogs]
  );

  // Memoize recent activity from execution logs
  const recentActivity = useMemo(() => 
    executionLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map(log => {
        const workflow = workflows.find(w => w.id === log.workflowId);
        return {
          id: log.id,
          type: log.status === 'success' ? 'task_completed' : 'task_failed',
          title: log.message,
          description: workflow ? `Workflow: ${workflow.name}` : 'Unknown workflow',
          time: new Date(log.timestamp).toLocaleString(),
          icon: log.status === 'success' ? 
            <CheckCircle size={16} className="text-success-600" /> : 
            <AlertCircle size={16} className="text-error-600" />,
          status: log.status
        };
      }),
    [executionLogs, workflows]
  );

  const handleDeleteWorkflow = async (workflowId: string, workflowName: string) => {
    if (confirm(`Are you sure you want to delete "${workflowName}"? This action cannot be undone.`)) {
      try {
        await deleteWorkflow(workflowId);
      } catch (error) {
        console.error('Failed to delete workflow:', error);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Memoized components to prevent unnecessary re-renders
  const StatsGrid = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.title} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
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
              <div className={`text-sm font-medium ${
                stat.trend.startsWith('+') ? 'text-success-600' : 
                stat.trend.startsWith('-') ? 'text-error-600' : 
                'text-gray-600'
              }`}>
                {stat.trend}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  ), [stats]);

  const WorkflowsList = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white rounded-xl shadow-soft p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Workflows</h2>
        <Link 
          to="/workflow-builder"
          className="btn-primary flex items-center"
        >
          <Plus size={16} className="mr-2" />
          New Workflow
        </Link>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : recentWorkflows.length === 0 ? (
        <div className="text-center py-8">
          <Workflow size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
          <p className="text-gray-600 mb-4">Create your first workflow to start automating tasks</p>
          <Link 
            to="/workflow-builder"
            className="btn-primary inline-flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Create Workflow
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recentWorkflows.map((workflow, index) => (
            <motion.div 
              key={workflow.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4 hover:border-accent-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      workflow.status === 'active' 
                        ? 'bg-success-100 text-success-700' 
                        : workflow.status === 'paused'
                        ? 'bg-warning-100 text-warning-700'
                        : workflow.status === 'error'
                        ? 'bg-error-100 text-error-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {workflow.status}
                    </span>
                    {workflow.executions > 0 && (
                      <span className="text-xs text-gray-500">{workflow.success}% success</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{workflow.executions} executions</span>
                    <span>Last run: {workflow.lastRun}</span>
                    <span>Updated: {formatDate(workflow.updated_at)}</span>
                    <span>{formatFileSize(workflow.size)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/workflow-builder?id=${workflow.id}`}
                    className="p-2 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                    title="Edit workflow"
                  >
                    <Edit size={16} />
                  </Link>
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Duplicate workflow"
                  >
                    <Copy size={16} />
                  </button>
                  <button className={`p-2 rounded-lg transition-colors ${
                    workflow.status === 'active' 
                      ? 'text-warning-600 hover:bg-warning-50' 
                      : 'text-success-600 hover:bg-success-50'
                  }`}>
                    {workflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <div className="relative group">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <MoreVertical size={16} />
                    </button>
                    <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <Link
                        to={`/workflow-builder?id=${workflow.id}`}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Edit Workflow
                      </Link>
                      <button
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Duplicate
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => handleDeleteWorkflow(workflow.id, workflow.name)}
                        className="block w-full text-left px-3 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  ), [recentWorkflows, loading, handleDeleteWorkflow, formatDate, formatFileSize]);

  const PerformanceChart = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white rounded-xl shadow-soft p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
      {dashboardData.totalExecutions > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Success Rate</span>
            <span className="text-sm font-medium">{dashboardData.successRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-success-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${dashboardData.successRate}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{dashboardData.successfulExecutions}</div>
              <div className="text-xs text-gray-600">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error-600">
                {executionLogs.filter(log => log.status === 'error').length}
              </div>
              <div className="text-xs text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{dashboardData.totalExecutions}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart2 size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No execution data yet</p>
            <p className="text-sm text-gray-400">Run some workflows to see performance metrics</p>
          </div>
        </div>
      )}
    </motion.div>
  ), [dashboardData, executionLogs]);

  const ActivityPanel = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="bg-white rounded-xl shadow-soft p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
          View all
        </button>
      </div>
      
      {recentActivity.length === 0 ? (
        <div className="text-center py-4">
          <Activity size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
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
      )}
    </motion.div>
  ), [recentActivity]);

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
                {workflows.length > 0 
                  ? `You have ${dashboardData.activeWorkflows.length} active workflows running.`
                  : "Ready to create your first workflow?"
                }
              </p>
            </motion.div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
                {executionLogs.filter(log => log.status === 'error').length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-error-500 rounded-full"></span>
                )}
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
        {StatsGrid}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workflows */}
            {WorkflowsList}

            {/* Performance Chart */}
            {PerformanceChart}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
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
            {ActivityPanel}

            {/* Navigation */}
            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
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