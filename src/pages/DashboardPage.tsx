import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  BarChart, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Brain, 
  Code, 
  TestTube, 
  Shield, 
  Globe, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Mail, 
  Database, 
  Workflow, 
  Bot, 
  Sparkles, 
  Target, 
  Rocket, 
  Crown, 
  Star,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Share,
  Filter,
  Search,
  MoreVertical,
  RefreshCw,
  Layers,
  GitBranch,
  Timer,
  MessageSquare,
  FileText,
  Webhook,
  Cpu,
  Network,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWorkflowStore } from '../store/workflowStore';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { 
    workflows, 
    loadAllWorkflows, 
    createWorkflow, 
    deleteWorkflow, 
    executeWorkflow,
    executionLogs,
    getAnalytics 
  } = useWorkflowStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'paused'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  useEffect(() => {
    document.title = "Dashboard | FlowMind";
    loadAllWorkflows();
  }, [loadAllWorkflows]);

  // Memoized calculations for performance
  const dashboardStats = useMemo(() => {
    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter(w => w.status === 'active').length;
    const totalExecutions = executionLogs.length;
    const successfulExecutions = executionLogs.filter(log => log.status === 'success').length;
    const successRate = totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0;
    const timeSaved = successfulExecutions * 5; // Estimate 5 minutes per successful execution

    return {
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      successRate,
      timeSaved
    };
  }, [workflows, executionLogs]);

  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
      const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [workflows, searchTerm, statusFilter]);

  const recentActivity = useMemo(() => {
    return executionLogs
      .slice(0, 10)
      .map(log => ({
        ...log,
        workflowName: workflows.find(w => w.id === log.workflowId)?.name || 'Unknown Workflow'
      }));
  }, [executionLogs, workflows]);

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    try {
      const workflow = createWorkflow(newWorkflowName.trim(), newWorkflowDescription.trim());
      setShowCreateModal(false);
      setNewWorkflowName('');
      setNewWorkflowDescription('');
      toast.success('Workflow created successfully!');
      navigate(`/workflow-builder?id=${workflow.id}`);
    } catch (error) {
      toast.error('Failed to create workflow');
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteWorkflow(workflowId);
        toast.success('Workflow deleted successfully');
      } catch (error) {
        toast.error('Failed to delete workflow');
      }
    }
  };

  const handleExecuteWorkflow = async (workflowId: string) => {
    try {
      await executeWorkflow(workflowId);
      toast.success('Workflow executed successfully!');
    } catch (error) {
      toast.error('Failed to execute workflow');
    }
  };

  const handleDuplicateWorkflow = (workflow: any) => {
    const duplicatedWorkflow = createWorkflow(
      `${workflow.name} (Copy)`,
      workflow.description
    );
    toast.success('Workflow duplicated successfully!');
    navigate(`/workflow-builder?id=${duplicatedWorkflow.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} className="text-green-600" />;
      case 'error': return <AlertCircle size={16} className="text-red-600" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="text-gray-600">
                Manage your AI-powered workflows and monitor automation performance
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus size={18} className="mr-2" />
                New Workflow
              </button>
              <Link
                to="/workflow-builder"
                className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                <Bot size={18} className="mr-2" />
                AI Agent Builder
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Workflow size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardStats.totalWorkflows}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Workflows</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Zap size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardStats.activeWorkflows}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Active</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Activity size={20} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardStats.totalExecutions}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Executions</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp size={20} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardStats.successRate}%</div>
                  <div className="text-xs sm:text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                  <Clock size={20} className="text-teal-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardStats.timeSaved}h</div>
                  <div className="text-xs sm:text-sm text-gray-600">Time Saved</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Advanced Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/workflow-builder"
            className="group bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white hover:from-purple-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Code size={24} />
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Code Editor</h3>
            <p className="text-purple-100 text-sm">Write custom JavaScript functions with AI assistance</p>
          </Link>

          <Link
            to="/workflow-builder"
            className="group bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <TestTube size={24} />
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Testing Suite</h3>
            <p className="text-green-100 text-sm">Comprehensive testing with performance monitoring</p>
          </Link>

          <Link
            to="/workflow-builder"
            className="group bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart size={24} />
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-blue-100 text-sm">Real-time performance metrics and insights</p>
          </Link>

          <Link
            to="/workflow-builder"
            className="group bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Globe size={24} />
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold mb-2">500+ Integrations</h3>
            <p className="text-orange-100 text-sm">Connect with all your favorite tools</p>
          </Link>

          <Link
            to="/workflow-builder"
            className="group bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Shield size={24} />
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Security</h3>
            <p className="text-red-100 text-sm">Enterprise-grade security and compliance</p>
          </Link>

          <Link
            to="/workflow-builder"
            className="group bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Users size={24} />
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-purple-100 text-sm">Real-time collaboration with version control</p>
          </Link>
        </div>

        {/* Workflows Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflows List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Your Workflows</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search workflows..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              {filteredWorkflows.length === 0 ? (
                <div className="text-center py-12">
                  <Workflow size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Create your first AI-powered workflow to get started'
                    }
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
                  >
                    Create Your First Workflow
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredWorkflows.map((workflow) => (
                    <motion.div
                      key={workflow.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {workflow.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                              {workflow.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {workflow.description || 'No description provided'}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Created {new Date(workflow.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{workflow.nodes?.length || 0} nodes</span>
                            <span>•</span>
                            <span>Updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleExecuteWorkflow(workflow.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Execute workflow"
                          >
                            <Play size={16} />
                          </button>
                          <Link
                            to={`/workflow-builder?id=${workflow.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit workflow"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDuplicateWorkflow(workflow)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Duplicate workflow"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteWorkflow(workflow.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete workflow"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">
                          {activity.workflowName}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center px-4 py-3 text-left bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
                >
                  <Plus size={18} className="text-purple-600 mr-3" />
                  <span className="text-purple-700 font-medium">Create New Workflow</span>
                </button>
                <Link
                  to="/workflow-builder"
                  className="w-full flex items-center px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                >
                  <Bot size={18} className="text-blue-600 mr-3" />
                  <span className="text-blue-700 font-medium">AI Agent Builder</span>
                </Link>
                <Link
                  to="/profile"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                >
                  <Settings size={18} className="text-gray-600 mr-3" />
                  <span className="text-gray-700 font-medium">Account Settings</span>
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">API Status</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">AI Processing</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">Email Service</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Workflow Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Workflow</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    value={newWorkflowName}
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                    placeholder="My AI Workflow"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newWorkflowDescription}
                    onChange={(e) => setNewWorkflowDescription(e.target.value)}
                    placeholder="Describe what this workflow does..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWorkflow}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Create Workflow
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;