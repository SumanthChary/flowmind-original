import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  LineChart, 
  Activity, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  RefreshCw,
  Calendar,
  Filter,
  X,
  Eye,
  Target,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Network,
  Workflow,
  Brain,
  Mail,
  MessageSquare,
  FileText,
  Sparkles,
  Lightbulb,
  ArrowRight,
  Maximize,
  Minimize
} from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ isOpen, onClose }) => {
  const { workflows, executionLogs, nodes, getAnalytics } = useWorkflowStore();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<string>('executions');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load analytics data
  useEffect(() => {
    if (isOpen) {
      loadAnalyticsData();
    }
  }, [isOpen, timeRange, selectedWorkflow]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // If a specific workflow is selected, get its analytics
      if (selectedWorkflow !== 'all') {
        const data = getAnalytics(selectedWorkflow, timeRange);
        setAnalyticsData(data);
      } else {
        // Otherwise, aggregate analytics for all workflows
        setAnalyticsData(calculateAggregateAnalytics());
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate analytics data
  const calculateAggregateAnalytics = () => {
    const now = new Date();
    const timeRangeMs = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    };

    const cutoffTime = new Date(now.getTime() - timeRangeMs[timeRange]);
    const recentLogs = executionLogs.filter(log => new Date(log.timestamp) > cutoffTime);

    const totalExecutions = recentLogs.length;
    const successfulExecutions = recentLogs.filter(log => log.status === 'success').length;
    const failedExecutions = recentLogs.filter(log => log.status === 'error').length;
    const avgExecutionTime = recentLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / totalExecutions || 0;
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

    // Generate time series data
    const timeSeriesData = [];
    const intervals = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const intervalMs = timeRangeMs[timeRange] / intervals;

    for (let i = 0; i < intervals; i++) {
      const intervalStart = new Date(cutoffTime.getTime() + i * intervalMs);
      const intervalEnd = new Date(cutoffTime.getTime() + (i + 1) * intervalMs);
      
      const intervalLogs = recentLogs.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= intervalStart && logTime < intervalEnd;
      });

      timeSeriesData.push({
        time: intervalStart.toISOString(),
        executions: intervalLogs.length,
        successes: intervalLogs.filter(log => log.status === 'success').length,
        failures: intervalLogs.filter(log => log.status === 'error').length,
        avgDuration: intervalLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / intervalLogs.length || 0
      });
    }

    // Calculate node type distribution
    const nodeTypes = nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate workflow complexity
    const workflowComplexity = workflows.map(workflow => ({
      id: workflow.id,
      name: workflow.name,
      nodeCount: workflow.nodes?.length || 0,
      edgeCount: workflow.edges?.length || 0,
      complexity: (workflow.nodes?.length || 0) + (workflow.edges?.length || 0)
    })).sort((a, b) => b.complexity - a.complexity);

    // Generate insights
    const insights = generateInsights({
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      avgExecutionTime,
      successRate,
      timeSeriesData,
      nodeTypes,
      workflowComplexity
    });

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      avgExecutionTime,
      successRate,
      timeSeriesData,
      activeWorkflows: workflows.filter(w => w.status === 'active').length,
      totalWorkflows: workflows.length,
      nodeTypes,
      workflowComplexity,
      insights
    };
  };

  // Generate insights based on analytics data
  const generateInsights = (data: any) => {
    const insights = [];

    // Performance insights
    if (data.avgExecutionTime > 5000) {
      insights.push({
        type: 'performance',
        title: 'High Execution Time',
        description: 'Your workflows are taking longer than optimal to execute.',
        recommendation: 'Consider optimizing complex nodes or splitting workflows into smaller parts.',
        icon: <Clock size={16} className="text-warning-600" />
      });
    }

    // Success rate insights
    if (data.successRate < 95 && data.totalExecutions > 10) {
      insights.push({
        type: 'reliability',
        title: 'Low Success Rate',
        description: `Your workflow success rate is ${Math.round(data.successRate)}%, which is below the recommended 95%.`,
        recommendation: 'Add error handling and retry mechanisms to improve reliability.',
        icon: <AlertCircle size={16} className="text-error-600" />
      });
    }

    // Node distribution insights
    if (data.nodeTypes && data.nodeTypes.ai > 0) {
      insights.push({
        type: 'ai',
        title: 'AI Usage Detected',
        description: `You're using ${data.nodeTypes.ai} AI nodes across your workflows.`,
        recommendation: 'Consider adding caching to reduce API costs for repetitive AI operations.',
        icon: <Brain size={16} className="text-purple-600" />
      });
    }

    // Workflow complexity insights
    if (data.workflowComplexity && data.workflowComplexity[0]?.complexity > 20) {
      insights.push({
        type: 'complexity',
        title: 'Complex Workflow Detected',
        description: `"${data.workflowComplexity[0].name}" has high complexity with ${data.workflowComplexity[0].nodeCount} nodes.`,
        recommendation: 'Consider breaking down complex workflows into smaller, reusable components.',
        icon: <Workflow size={16} className="text-blue-600" />
      });
    }

    // Add general insights if we don't have many specific ones
    if (insights.length < 2) {
      insights.push({
        type: 'general',
        title: 'Automation Opportunity',
        description: 'You could automate more of your workflow processes.',
        recommendation: 'Explore templates in the marketplace to discover new automation opportunities.',
        icon: <Lightbulb size={16} className="text-yellow-600" />
      });
    }

    return insights;
  };

  const metricCards: MetricCard[] = useMemo(() => [
    {
      title: 'Total Executions',
      value: analyticsData?.totalExecutions.toLocaleString() || '0',
      change: '+12%',
      changeType: 'positive',
      icon: <Activity size={20} className="text-blue-600" />
    },
    {
      title: 'Success Rate',
      value: `${Math.round(analyticsData?.successRate || 0)}%`,
      change: '+5%',
      changeType: 'positive',
      icon: <CheckCircle size={20} className="text-green-600" />
    },
    {
      title: 'Avg Execution Time',
      value: `${Math.round(analyticsData?.avgExecutionTime || 0)}ms`,
      change: '-8%',
      changeType: 'positive',
      icon: <Clock size={20} className="text-purple-600" />
    },
    {
      title: 'Active Workflows',
      value: analyticsData?.activeWorkflows?.toString() || '0',
      change: '+3',
      changeType: 'positive',
      icon: <Zap size={20} className="text-orange-600" />
    }
  ], [analyticsData]);

  const performanceMetrics = [
    {
      name: 'CPU Usage',
      value: '23%',
      status: 'good',
      icon: <Cpu size={16} />
    },
    {
      name: 'Memory Usage',
      value: '45%',
      status: 'good',
      icon: <HardDrive size={16} />
    },
    {
      name: 'Network I/O',
      value: '12 MB/s',
      status: 'good',
      icon: <Network size={16} />
    },
    {
      name: 'Error Rate',
      value: '0.2%',
      status: 'excellent',
      icon: <AlertCircle size={16} />
    }
  ];

  const topWorkflows = useMemo(() => {
    if (!workflows || !executionLogs) return [];
    
    return workflows
      .map(workflow => {
        const workflowLogs = executionLogs.filter(log => log.workflowId === workflow.id);
        return {
          ...workflow,
          executions: workflowLogs.length,
          successRate: workflowLogs.length > 0 ? 
            (workflowLogs.filter(log => log.status === 'success').length / workflowLogs.length) * 100 : 0
        };
      })
      .sort((a, b) => b.executions - a.executions)
      .slice(0, 5);
  }, [workflows, executionLogs]);

  const nodeTypeDistribution = useMemo(() => {
    if (!analyticsData?.nodeTypes) return [];
    
    const nodeTypes = analyticsData.nodeTypes;
    const total = Object.values(nodeTypes).reduce((sum: any, count: any) => sum + count, 0);
    
    return Object.entries(nodeTypes).map(([type, count]: [string, any]) => ({
      type,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: getNodeTypeColor(type)
    }));
  }, [analyticsData]);

  const getNodeTypeColor = (type: string): string => {
    switch (type) {
      case 'trigger': return 'bg-blue-500';
      case 'action': return 'bg-green-500';
      case 'condition': return 'bg-yellow-500';
      case 'ai': return 'bg-purple-500';
      case 'delay': return 'bg-gray-500';
      case 'webhook': return 'bg-indigo-500';
      case 'email': return 'bg-red-500';
      case 'data': return 'bg-teal-500';
      default: return 'bg-gray-400';
    }
  };

  const getNodeTypeIcon = (type: string): React.ReactNode => {
    switch (type) {
      case 'trigger': return <Zap size={16} className="text-blue-600" />;
      case 'action': return <Activity size={16} className="text-green-600" />;
      case 'condition': return <Filter size={16} className="text-yellow-600" />;
      case 'ai': return <Brain size={16} className="text-purple-600" />;
      case 'delay': return <Clock size={16} className="text-gray-600" />;
      case 'webhook': return <Globe size={16} className="text-indigo-600" />;
      case 'email': return <Mail size={16} className="text-red-600" />;
      case 'data': return <Database size={16} className="text-teal-600" />;
      default: return <Workflow size={16} className="text-gray-600" />;
    }
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      timeRange,
      summary: analyticsData,
      workflows: topWorkflows,
      performanceMetrics,
      timeSeriesData: analyticsData.timeSeriesData,
      nodeDistribution: nodeTypeDistribution,
      insights: analyticsData.insights
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics-${timeRange}-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Analytics data exported!');
  };

  const toggleSectionExpansion = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  if (!isOpen) return null;

  return (
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <BarChart size={20} className="text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">Advanced Analytics Dashboard</h2>
              <p className="text-sm text-blue-100">Comprehensive workflow performance and metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg border border-white border-opacity-30"
            >
              <option value="all" className="text-gray-900">All Workflows</option>
              {workflows.map(workflow => (
                <option key={workflow.id} value={workflow.id} className="text-gray-900">
                  {workflow.name}
                </option>
              ))}
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg border border-white border-opacity-30"
            >
              <option value="24h" className="text-gray-900">Last 24 Hours</option>
              <option value="7d" className="text-gray-900">Last 7 Days</option>
              <option value="30d" className="text-gray-900">Last 30 Days</option>
              <option value="90d" className="text-gray-900">Last 90 Days</option>
            </select>
            <button
              onClick={exportAnalytics}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
            <button
              onClick={loadAnalyticsData}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading analytics data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricCards.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                      {metric.icon}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                        <div className={`text-sm flex items-center ${
                          metric.changeType === 'positive' ? 'text-green-600' : 
                          metric.changeType === 'negative' ? 'text-red-600' : 
                          'text-gray-600'
                        }`}>
                          {metric.changeType === 'positive' && <TrendingUp size={14} className="mr-1" />}
                          {metric.changeType === 'negative' && <TrendingDown size={14} className="mr-1" />}
                          {metric.change}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Insights Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Sparkles size={18} className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h3>
                  </div>
                  <button
                    onClick={() => toggleSectionExpansion('insights')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedSection === 'insights' ? <Minimize size={18} /> : <Maximize size={18} />}
                  </button>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
                  expandedSection === 'insights' ? 'md:grid-cols-1' : ''
                }`}>
                  {analyticsData?.insights?.slice(0, expandedSection === 'insights' ? undefined : 2).map((insight: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          {insight.icon}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          <div className="mt-2 flex items-center text-sm text-accent-600 font-medium">
                            <Lightbulb size={14} className="mr-1" />
                            <span>{insight.recommendation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {analyticsData?.insights?.length > 2 && expandedSection !== 'insights' && (
                  <button
                    onClick={() => setExpandedSection('insights')}
                    className="mt-4 text-sm text-accent-600 hover:text-accent-700 font-medium flex items-center"
                  >
                    View all {analyticsData.insights.length} insights
                    <ArrowRight size={14} className="ml-1" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Execution Timeline Chart */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Execution Timeline</h3>
                    <button
                      onClick={() => toggleSectionExpansion('timeline')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedSection === 'timeline' ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                  </div>
                  <div className={`h-64 ${expandedSection === 'timeline' ? 'h-96' : ''}`}>
                    <div className="h-full flex items-end justify-between space-x-2">
                      {analyticsData?.timeSeriesData?.map((data: any, index: number) => {
                        const maxExecutions = Math.max(...(analyticsData?.timeSeriesData?.map((d: any) => d.executions) || [0]));
                        const height = maxExecutions > 0 ? (data.executions / maxExecutions) * 100 : 0;
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 relative group"
                              style={{ height: `${height}%`, minHeight: data.executions > 0 ? '4px' : '0px' }}
                            >
                              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {data.executions} executions
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                              {new Date(data.time).toLocaleDateString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Node Type Distribution */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Node Type Distribution</h3>
                    <button
                      onClick={() => toggleSectionExpansion('nodeTypes')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedSection === 'nodeTypes' ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                  </div>
                  <div className={`space-y-4 ${expandedSection === 'nodeTypes' ? 'h-96 overflow-y-auto' : ''}`}>
                    {nodeTypeDistribution.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex items-center w-32">
                          {getNodeTypeIcon(item.type)}
                          <span className="ml-2 text-sm font-medium capitalize">{item.type}</span>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${item.color}`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-sm font-medium">{item.count}</span>
                          <span className="text-xs text-gray-500 ml-1">({item.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Workflows */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Top Performing Workflows</h3>
                    <button
                      onClick={() => toggleSectionExpansion('topWorkflows')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedSection === 'topWorkflows' ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                  </div>
                  <div className={`space-y-3 ${expandedSection === 'topWorkflows' ? 'h-96 overflow-y-auto' : ''}`}>
                    {topWorkflows.map((workflow, index) => (
                      <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{workflow.name}</div>
                            <div className="text-xs text-gray-600">{workflow.executions} executions</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {Math.round(workflow.successRate)}%
                          </div>
                          <div className="text-xs text-gray-600">success rate</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <button
                      onClick={() => toggleSectionExpansion('recentActivity')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedSection === 'recentActivity' ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                  </div>
                  <div className={`space-y-3 ${expandedSection === 'recentActivity' ? 'h-96 overflow-y-auto' : ''}`}>
                    {executionLogs.slice(0, expandedSection === 'recentActivity' ? 20 : 8).map((log, index) => (
                      <div key={log.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {log.status === 'success' ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <AlertCircle size={16} className="text-red-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{log.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                            {log.duration && ` • ${log.duration}ms`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Success Rate Trend */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Success Rate Trend</h3>
                  <button
                    onClick={() => toggleSectionExpansion('successRate')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedSection === 'successRate' ? <Minimize size={18} /> : <Maximize size={18} />}
                  </button>
                </div>
                <div className={`h-32 ${expandedSection === 'successRate' ? 'h-64' : ''}`}>
                  <div className="h-full flex items-end justify-between space-x-1">
                    {analyticsData?.timeSeriesData?.map((data: any, index: number) => {
                      const successRate = data.executions > 0 ? (data.successes / data.executions) * 100 : 0;
                      const height = successRate;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className={`w-full rounded-t transition-all duration-300 ${
                              successRate >= 90 ? 'bg-green-500' :
                              successRate >= 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ height: `${height}%`, minHeight: successRate > 0 ? '4px' : '0px' }}
                            title={`${Math.round(successRate)}% success rate`}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Workflow Complexity Analysis */}
              {analyticsData?.workflowComplexity && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Workflow Complexity Analysis</h3>
                    <button
                      onClick={() => toggleSectionExpansion('complexity')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedSection === 'complexity' ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                  </div>
                  <div className={`space-y-4 ${expandedSection === 'complexity' ? 'h-96 overflow-y-auto' : ''}`}>
                    {analyticsData.workflowComplexity.slice(0, expandedSection === 'complexity' ? undefined : 5).map((workflow: any, index: number) => (
                      <div key={workflow.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">{workflow.name}</div>
                          <div className="text-sm font-medium text-gray-700">
                            Complexity: {workflow.complexity}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Workflow size={14} className="mr-1" />
                            <span>{workflow.nodeCount} nodes</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <ArrowRight size={14} className="mr-1" />
                            <span>{workflow.edgeCount} connections</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;