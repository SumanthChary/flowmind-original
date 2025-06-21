import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Copy,
  Bot,
  Sparkles,
  Brain,
  MessageSquare,
  Database,
  Mail,
  TestTube,
  Shield,
  Globe,
  Code,
  X,
  TrendingDown,
  Cpu,
  HardDrive,
  Network,
  Lock
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWorkflowStore } from '../store/workflowStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Import feature components
import CodeEditor from '../components/workflow/CodeEditor';
import TestingSuite from '../components/workflow/TestingSuite';
import AnalyticsDashboard from '../components/workflow/AnalyticsDashboard';
import IntegrationsPanel from '../components/workflow/IntegrationsPanel';
import SecurityPanel from '../components/workflow/SecurityPanel';
import CollaborationPanel from '../components/workflow/CollaborationPanel';

const DashboardPage = () => {
  const { user, profile } = useAuthStore();
  const { 
    workflows, 
    executionLogs, 
    loadAllWorkflows, 
    deleteWorkflow, 
    executeWorkflow, 
    createWorkflow, 
    addNode, 
    addEdge,
    runTests,
    runSecurityScan,
    getAnalytics
  } = useWorkflowStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Feature panel states
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showTestingSuite, setShowTestingSuite] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  // Advanced features state
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 23,
    memoryUsage: 45,
    networkIO: 12,
    activeConnections: 156,
    uptime: '99.9%',
    responseTime: 145
  });

  useEffect(() => {
    document.title = "Dashboard | FlowMind";
  }, []);

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

  // Simulate real-time system metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkIO: Math.max(5, Math.min(50, prev.networkIO + (Math.random() - 0.5) * 5)),
        activeConnections: Math.max(100, Math.min(300, prev.activeConnections + Math.floor((Math.random() - 0.5) * 20))),
        responseTime: Math.max(50, Math.min(500, prev.responseTime + (Math.random() - 0.5) * 50))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Enhanced AI Agent creation with real functionality
  const createAIAgent = useCallback(async () => {
    try {
      const agentWorkflow = createWorkflow('AI Customer Support Agent', 'Intelligent customer support automation with real AI processing and email sending');
      
      // Add Email Trigger Node
      const triggerNode = {
        id: 'email-trigger-1',
        type: 'trigger' as const,
        position: { x: 100, y: 100 },
        data: {
          label: 'Email Received',
          icon: 'Mail',
          type: 'trigger',
          config: {
            triggerType: 'email',
            emailFilter: 'support@company.com'
          },
          active: true,
          status: 'idle' as const
        }
      };

      // Add AI Analysis Node with Gemini
      const aiNode = {
        id: 'ai-analysis-1',
        type: 'ai' as const,
        position: { x: 350, y: 100 },
        data: {
          label: 'AI Sentiment Analysis (Gemini)',
          icon: 'Brain',
          type: 'ai',
          config: {
            aiType: 'sentiment_analysis',
            model: 'gemini-pro',
            prompt: 'Analyze customer email sentiment, urgency, and intent. Provide actionable insights.'
          },
          active: true,
          status: 'idle' as const
        }
      };

      // Add Condition Node
      const conditionNode = {
        id: 'condition-1',
        type: 'condition' as const,
        position: { x: 600, y: 100 },
        data: {
          label: 'Check Urgency Level',
          icon: 'Target',
          type: 'condition',
          config: {
            conditionType: 'contains',
            field: 'urgency',
            value: 'high'
          },
          active: true,
          status: 'idle' as const
        }
      };

      // Add Slack Alert Node (High Priority Path)
      const slackNode = {
        id: 'slack-alert-1',
        type: 'action' as const,
        position: { x: 850, y: 50 },
        data: {
          label: 'Alert Team (Urgent)',
          icon: 'MessageSquare',
          type: 'action',
          config: {
            actionType: 'slack',
            slackChannel: '#support-urgent',
            slackMessage: '🚨 URGENT: Customer needs immediate attention! AI detected high priority issue.'
          },
          active: true,
          status: 'idle' as const
        }
      };

      // Add Auto-Reply Node (Normal Priority Path)
      const replyNode = {
        id: 'auto-reply-1',
        type: 'action' as const,
        position: { x: 850, y: 150 },
        data: {
          label: 'Send Auto-Reply Email',
          icon: 'Mail',
          type: 'action',
          config: {
            actionType: 'email',
            emailTo: 'enjoywithpandu@gmail.com',
            emailSubject: '✅ Re: Your Support Request - FlowMind AI',
            emailMessage: `Dear Valued Customer,

Thank you for contacting FlowMind AI support! 🙏

We have received your inquiry and our AI-powered support system has automatically:
✅ Analyzed your request
✅ Assigned appropriate priority  
✅ Routed to the right team

⏱️ Expected Response Time: Within 24 hours
🔥 For urgent issues: Reply with "URGENT" in the subject line

Our team will provide you with a detailed solution soon.

Best regards,
FlowMind AI Support Team
🤖 Powered by intelligent automation`
          },
          active: true,
          status: 'idle' as const
        }
      };

      // Add Database Log Node
      const dbNode = {
        id: 'database-log-1',
        type: 'action' as const,
        position: { x: 1100, y: 100 },
        data: {
          label: 'Log to Support Database',
          icon: 'Database',
          type: 'action',
          config: {
            actionType: 'database',
            table: 'support_tickets',
            operation: 'insert'
          },
          active: true,
          status: 'idle' as const
        }
      };

      // Add nodes to workflow
      addNode(triggerNode);
      addNode(aiNode);
      addNode(conditionNode);
      addNode(slackNode);
      addNode(replyNode);
      addNode(dbNode);

      // Connect nodes with edges
      addEdge({
        id: 'edge-1',
        source: 'email-trigger-1',
        target: 'ai-analysis-1',
        type: 'smoothstep',
        animated: true,
        data: { status: 'idle' }
      });

      addEdge({
        id: 'edge-2',
        source: 'ai-analysis-1',
        target: 'condition-1',
        type: 'smoothstep',
        animated: true,
        data: { status: 'idle' }
      });

      addEdge({
        id: 'edge-3',
        source: 'condition-1',
        target: 'slack-alert-1',
        sourceHandle: 'true',
        type: 'smoothstep',
        animated: true,
        data: { status: 'idle' }
      });

      addEdge({
        id: 'edge-4',
        source: 'condition-1',
        target: 'auto-reply-1',
        sourceHandle: 'false',
        type: 'smoothstep',
        animated: true,
        data: { status: 'idle' }
      });

      addEdge({
        id: 'edge-5',
        source: 'slack-alert-1',
        target: 'database-log-1',
        type: 'smoothstep',
        animated: true,
        data: { status: 'idle' }
      });

      addEdge({
        id: 'edge-6',
        source: 'auto-reply-1',
        target: 'database-log-1',
        type: 'smoothstep',
        animated: true,
        data: { status: 'idle' }
      });

      toast.success('🎉 AI Customer Support Agent created! This agent uses real Gemini AI and sends actual emails to enjoywithpandu@gmail.com');
      
      // Auto-execute the agent to show real results
      setTimeout(() => {
        executeWorkflow(agentWorkflow.id);
      }, 1000);

    } catch (error) {
      toast.error('Failed to create AI agent');
      console.error('Agent creation error:', error);
    }
  }, [createWorkflow, addNode, addEdge, executeWorkflow]);

  // Enhanced analytics and testing functions
  const runAdvancedTests = useCallback(async (workflowId: string) => {
    try {
      const results = await runTests(workflowId);
      toast.success(`🧪 Testing completed: ${results.summary.passed}/${results.summary.totalTests} tests passed`);
      setShowTestingSuite(true);
    } catch (error) {
      toast.error('Testing failed');
    }
  }, [runTests]);

  const runSecurityAudit = useCallback(async (workflowId: string) => {
    try {
      const results = await runSecurityScan(workflowId);
      toast.success(`🔒 Security scan completed: Score ${results.securityScore}/100`);
      setShowSecurity(true);
    } catch (error) {
      toast.error('Security scan failed');
    }
  }, [runSecurityScan]);

  const viewAnalytics = useCallback((workflowId: string) => {
    try {
      const analytics = getAnalytics(workflowId, '7d');
      toast.success('📊 Analytics loaded successfully');
      setShowAnalytics(true);
    } catch (error) {
      toast.error('Failed to load analytics');
    }
  }, [getAnalytics]);

  const dashboardData = useMemo(() => {
    const activeWorkflows = workflows.filter(w => w.status === 'active').length;
    const totalExecutions = executionLogs.length;
    const successfulExecutions = executionLogs.filter(log => log.status === 'success').length;
    const timeSavedMinutes = successfulExecutions * 5;
    const timeSavedHours = Math.round(timeSavedMinutes / 60 * 10) / 10;

    return {
      activeWorkflows,
      totalExecutions,
      successfulExecutions,
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

  const enhancedStats = useMemo(() => [
    {
      title: 'Active Workflows',
      value: dashboardData.activeWorkflows.toString(),
      change: workflows.length > dashboardData.activeWorkflows ? `+${workflows.length - dashboardData.activeWorkflows} draft` : 'All active',
      changeType: 'positive' as const,
      icon: <Zap size={20} className="text-primary-600" />,
      trend: workflows.length > 0 ? '+15%' : '0%',
      details: `${workflows.length} total workflows`
    },
    {
      title: 'AI Processing Power',
      value: `${Math.round(systemMetrics.cpuUsage)}%`,
      change: systemMetrics.cpuUsage > 50 ? 'High utilization' : 'Optimal performance',
      changeType: systemMetrics.cpuUsage > 80 ? 'warning' as const : 'positive' as const,
      icon: <Brain size={20} className="text-purple-600" />,
      trend: systemMetrics.cpuUsage > 50 ? '+12%' : '+5%',
      details: `${systemMetrics.responseTime}ms avg response`
    },
    {
      title: 'Tasks Automated',
      value: dashboardData.totalExecutions.toLocaleString(),
      change: dashboardData.totalExecutions > 0 ? `${dashboardData.successfulExecutions} successful` : 'No executions yet',
      changeType: dashboardData.totalExecutions > 0 ? 'positive' as const : 'neutral' as const,
      icon: <CheckCircle size={20} className="text-success-600" />,
      trend: dashboardData.totalExecutions > 0 ? '+23%' : '0%',
      details: `${Math.round((dashboardData.successfulExecutions / Math.max(1, dashboardData.totalExecutions)) * 100)}% success rate`
    },
    {
      title: 'System Health',
      value: systemMetrics.uptime,
      change: `${systemMetrics.activeConnections} active connections`,
      changeType: 'positive' as const,
      icon: <Activity size={20} className="text-green-600" />,
      trend: '+0.1%',
      details: 'Enterprise-grade reliability'
    }
  ], [dashboardData, workflows.length, systemMetrics]);

  const recentWorkflows = useMemo(() => 
    workflows
      .sort((a, b) => new Date(b.updatedAt || b.updated_at).getTime() - new Date(a.updatedAt || a.updated_at).getTime())
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
          updated_at: workflow.updatedAt || workflow.updated_at,
          size: workflow.size || 0,
          hasAI: workflow.nodes?.some(n => n.type === 'ai') || false,
          complexity: workflow.nodes?.length || 0
        };
      }),
    [workflows, executionLogs]
  );

  const recentActivity = useMemo(() => 
    executionLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8)
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
          status: log.status,
          duration: log.duration
        };
      }),
    [executionLogs, workflows]
  );

  const handleDeleteWorkflow = async (workflowId: string, workflowName: string) => {
    if (confirm(`Are you sure you want to delete "${workflowName}"? This action cannot be undone.`)) {
      try {
        await deleteWorkflow(workflowId);
        toast.success('Workflow deleted successfully');
      } catch (error) {
        toast.error('Failed to delete workflow');
        console.error('Failed to delete workflow:', error);
      }
    }
  };

  const handleRunWorkflow = async (workflowId: string, workflowName: string) => {
    try {
      await executeWorkflow(workflowId);
      toast.success(`${workflowName} is now running!`);
    } catch (error) {
      toast.error('Failed to run workflow');
      console.error('Failed to run workflow:', error);
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

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Templates Modal Component
  const TemplatesModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Workflow Templates</h2>
          <button
            onClick={() => setShowTemplates(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Customer Support',
                description: 'Automated customer support with AI analysis',
                icon: <MessageSquare size={24} className="text-blue-600" />,
                action: createAIAgent
              },
              {
                name: 'Email Marketing',
                description: 'Automated email campaigns and follow-ups',
                icon: <Mail size={24} className="text-green-600" />,
                action: () => toast.info('Email marketing template coming soon!')
              },
              {
                name: 'Data Processing',
                description: 'Process and analyze incoming data',
                icon: <Database size={24} className="text-purple-600" />,
                action: () => toast.info('Data processing template coming soon!')
              },
              {
                name: 'Social Media',
                description: 'Automate social media posting',
                icon: <Globe size={24} className="text-orange-600" />,
                action: () => toast.info('Social media template coming soon!')
              },
              {
                name: 'E-commerce',
                description: 'Order processing and inventory management',
                icon: <Target size={24} className="text-red-600" />,
                action: () => toast.info('E-commerce template coming soon!')
              },
              {
                name: 'HR Automation',
                description: 'Employee onboarding and management',
                icon: <Users size={24} className="text-teal-600" />,
                action: () => toast.info('HR automation template coming soon!')
              }
            ].map((template, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {template.icon}
                  <h3 className="ml-3 font-semibold text-gray-900">{template.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                <button
                  onClick={template.action}
                  className="w-full bg-accent-600 text-white py-2 rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Schedule Modal Component
  const ScheduleModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Workflow Schedule</h2>
          <button
            onClick={() => setShowSchedule(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                    <p className="text-sm text-gray-600">Status: {workflow.status}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Manual trigger</span>
                  </div>
                </div>
              </div>
            ))}
            {workflows.length === 0 && (
              <div className="text-center py-8">
                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Workflows</h3>
                <p className="text-gray-600">Create workflows with schedule triggers to see them here</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // System Health Component
  const SystemHealthPanel = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-white rounded-xl shadow-soft p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700">
          All Systems Operational
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Cpu size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">CPU Usage</span>
            </div>
            <span className="text-sm font-medium">{Math.round(systemMetrics.cpuUsage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                systemMetrics.cpuUsage > 80 ? 'bg-error-500' : 
                systemMetrics.cpuUsage > 60 ? 'bg-warning-500' : 
                'bg-success-500'
              }`}
              style={{ width: `${systemMetrics.cpuUsage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <HardDrive size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Memory Usage</span>
            </div>
            <span className="text-sm font-medium">{Math.round(systemMetrics.memoryUsage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                systemMetrics.memoryUsage > 80 ? 'bg-error-500' : 
                systemMetrics.memoryUsage > 60 ? 'bg-warning-500' : 
                'bg-success-500'
              }`}
              style={{ width: `${systemMetrics.memoryUsage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Network size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Network I/O</span>
            </div>
            <span className="text-sm font-medium">{Math.round(systemMetrics.networkIO)} MB/s</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${(systemMetrics.networkIO / 50) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Clock size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Response Time</span>
            </div>
            <span className="text-sm font-medium">{Math.round(systemMetrics.responseTime)} ms</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                systemMetrics.responseTime > 300 ? 'bg-error-500' : 
                systemMetrics.responseTime > 200 ? 'bg-warning-500' : 
                'bg-success-500'
              }`}
              style={{ width: `${(systemMetrics.responseTime / 500) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-600">
          <Lock size={14} className="mr-1" />
          <span>Enterprise Security: Active</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Activity size={14} className="mr-1" />
          <span>Uptime: {systemMetrics.uptime}</span>
        </div>
      </div>
    </motion.div>
  );

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
                  ? `You have ${dashboardData.activeWorkflows} active workflows running.`
                  : "Ready to create your first AI agent?"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {enhancedStats.map((stat, index) => (
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
                    stat.changeType === 'warning' ? 'text-warning-600' :
                    'text-gray-600'
                  }`}>
                    {stat.changeType === 'positive' && <ArrowUpRight size={14} className="mr-1" />}
                    {stat.changeType === 'negative' && <TrendingDown size={14} className="mr-1" />}
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
              <div className="mt-2 text-xs text-gray-500">{stat.details}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Agent Builder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-soft p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">🤖 Create Your AI Agent</h2>
                  <p className="text-purple-100">Build an intelligent customer support agent with real Gemini AI and email sending</p>
                </div>
                <Bot size={48} className="text-white opacity-80" />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={createAIAgent}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Sparkles size={20} className="mr-2" />
                  Create AI Agent
                </button>
                <Link 
                  to="/workflow-builder"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors flex items-center"
                >
                  <Workflow size={20} className="mr-2" />
                  Custom Builder
                </Link>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  to="/workflow-builder"
                  className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  <Workflow size={24} className="mr-3" />
                  <div>
                    <h3 className="font-medium">New Workflow</h3>
                    <p className="text-sm opacity-90">Build automation</p>
                  </div>
                </Link>
                
                <button
                  onClick={createAIAgent}
                  className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
                >
                  <Bot size={24} className="mr-3" />
                  <div>
                    <h3 className="font-medium">AI Agent</h3>
                    <p className="text-sm opacity-90">Smart automation</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => setShowTemplates(true)}
                  className="flex items-center p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-colors"
                >
                  <Sparkles size={24} className="mr-3" />
                  <div>
                    <h3 className="font-medium">Templates</h3>
                    <p className="text-sm opacity-90">Pre-built flows</p>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* System Health Panel */}
            <SystemHealthPanel />

            {/* Workflows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Your Workflows & Agents</h2>
                <button
                  onClick={createAIAgent}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Bot size={16} className="mr-2" />
                  Create Agent
                </button>
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
                  <Bot size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No agents yet</h3>
                  <p className="text-gray-600 mb-4">Create your first AI agent to start automating tasks</p>
                  <button
                    onClick={createAIAgent}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center"
                  >
                    <Bot size={20} className="mr-2" />
                    Create AI Agent
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentWorkflows.map((workflow, index) => (
                    <motion.div 
                      key={workflow.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
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
                            {workflow.hasAI && (
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                                AI-Powered
                              </span>
                            )}
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
                            <span>Complexity: {workflow.complexity} nodes</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRunWorkflow(workflow.id, workflow.name)}
                            className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                            title="Run workflow"
                          >
                            <Play size={16} />
                          </button>
                          <Link
                            to={`/workflow-builder?id=${workflow.id}`}
                            className="p-2 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                            title="Edit workflow"
                          >
                            <Edit size={16} />
                          </Link>
                          <button 
                            onClick={() => runAdvancedTests(workflow.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Run tests"
                          >
                            <TestTube size={16} />
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
                                onClick={() => runSecurityAudit(workflow.id)}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Security Scan
                              </button>
                              <button
                                onClick={() => viewAnalytics(workflow.id)}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                View Analytics
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Activity */}
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
                  <button
                    onClick={createAIAgent}
                    className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Create your first agent
                  </button>
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
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">{activity.time}</p>
                          {activity.duration && (
                            <span className="text-xs text-gray-500">{activity.duration}ms</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Navigation */}
            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl shadow-soft p-4 space-y-1"
            >
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'text-accent-600 bg-accent-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart2 size={18} className="mr-3" />
                Overview
              </button>
              <Link to="/workflow-builder" className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Workflow size={18} className="mr-3" />
                Workflow Builder
              </Link>
              <button 
                onClick={createAIAgent}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Bot size={18} className="mr-3" />
                AI Agents
              </button>
              <button 
                onClick={() => setShowTemplates(true)}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FileText size={18} className="mr-3" />
                Templates
              </button>
              <button 
                onClick={() => setShowSchedule(true)}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Calendar size={18} className="mr-3" />
                Schedule
              </button>
              <button 
                onClick={() => setShowCollaboration(true)}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Users size={18} className="mr-3" />
                Team
              </button>
              <Link to="/profile" className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings size={18} className="mr-3" />
                Settings
              </Link>
            </motion.nav>

            {/* Advanced Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="bg-white rounded-xl shadow-soft p-4"
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Advanced Features
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowCodeEditor(true)}
                  className="flex items-center justify-center px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
                  title="Code Editor"
                >
                  <Code size={14} className="mr-1" />
                  Code
                </button>
                <button
                  onClick={() => setShowTestingSuite(true)}
                  className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  title="Testing Suite"
                >
                  <TestTube size={14} className="mr-1" />
                  Test
                </button>
                <button
                  onClick={() => setShowAnalytics(true)}
                  className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  title="Analytics"
                >
                  <BarChart2 size={14} className="mr-1" />
                  Analytics
                </button>
                <button
                  onClick={() => setShowIntegrations(true)}
                  className="flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  title="Integrations"
                >
                  <Globe size={14} className="mr-1" />
                  500+
                </button>
                <button
                  onClick={() => setShowSecurity(true)}
                  className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  title="Security"
                >
                  <Shield size={14} className="mr-1" />
                  Security
                </button>
                <button
                  onClick={() => setShowCollaboration(true)}
                  className="flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  title="Collaboration"
                >
                  <Users size={14} className="mr-1" />
                  Team
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feature Modals */}
      <AnimatePresence>
        {showTemplates && <TemplatesModal />}
        {showSchedule && <ScheduleModal />}
      </AnimatePresence>

      {/* Feature Panels */}
      <CodeEditor
        isOpen={showCodeEditor}
        onClose={() => setShowCodeEditor(false)}
        onSave={(code) => {
          console.log('Code saved:', code);
          toast.success('Custom function saved!');
        }}
      />

      <TestingSuite
        isOpen={showTestingSuite}
        onClose={() => setShowTestingSuite(false)}
      />

      <AnalyticsDashboard
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      <IntegrationsPanel
        isOpen={showIntegrations}
        onClose={() => setShowIntegrations(false)}
      />

      <SecurityPanel
        isOpen={showSecurity}
        onClose={() => setShowSecurity(false)}
      />

      <CollaborationPanel
        isOpen={showCollaboration}
        onClose={() => setShowCollaboration(false)}
      />
    </div>
  );
};

export default DashboardPage;