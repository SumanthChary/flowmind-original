import React, { useState, useMemo } from 'react';
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
  Globe
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
  const { workflows, executionLogs, nodes } = useWorkflowStore();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<string>('executions');

  // Calculate analytics data
  const analyticsData = useMemo(() => {
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

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      avgExecutionTime,
      successRate,
      timeSeriesData,
      activeWorkflows: workflows.filter(w => w.status === 'active').length,
      totalWorkflows: workflows.length
    };
  }, [executionLogs, workflows, timeRange]);

  const metricCards: MetricCard[] = [
    {
      title: 'Total Executions',
      value: analyticsData.totalExecutions.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: <Activity size={20} className="text-blue-600" />
    },
    {
      title: 'Success Rate',
      value: `${Math.round(analyticsData.successRate)}%`,
      change: '+5%',
      changeType: 'positive',
      icon: <CheckCircle size={20} className="text-green-600" />
    },
    {
      title: 'Avg Execution Time',
      value: `${Math.round(analyticsData.avgExecutionTime)}ms`,
      change: '-8%',
      changeType: 'positive',
      icon: <Clock size={20} className="text-purple-600" />
    },
    {
      title: 'Active Workflows',
      value: analyticsData.activeWorkflows.toString(),
      change: '+3',
      changeType: 'positive',
      icon: <Zap size={20} className="text-orange-600" />
    }
  ];

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
      icon: <Database size={16} />
    },
    {
      name: 'Network I/O',
      value: '12 MB/s',
      status: 'good',
      icon: <Globe size={16} />
    },
    {
      name: 'Error Rate',
      value: '0.2%',
      status: 'excellent',
      icon: <AlertCircle size={16} />
    }
  ];

  const topWorkflows = workflows
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

  const exportAnalytics = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      timeRange,
      summary: analyticsData,
      workflows: topWorkflows,
      performanceMetrics,
      timeSeriesData: analyticsData.timeSeriesData
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
              <h2 className="text-xl font-bold">Real-time Analytics Dashboard</h2>
              <p className="text-sm text-blue-100">Monitor workflow performance and metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
              onClick={() => window.location.reload()}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Execution Timeline Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Timeline</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {analyticsData.timeSeriesData.map((data, index) => {
                  const maxExecutions = Math.max(...analyticsData.timeSeriesData.map(d => d.executions));
                  const height = maxExecutions > 0 ? (data.executions / maxExecutions) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%`, minHeight: data.executions > 0 ? '4px' : '0px' }}
                        title={`${data.executions} executions`}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                        {new Date(data.time).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">{metric.icon}</div>
                      <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        metric.status === 'excellent' ? 'bg-green-500' :
                        metric.status === 'good' ? 'bg-blue-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Workflows */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Workflows</h3>
              <div className="space-y-3">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {executionLogs.slice(0, 8).map((log, index) => (
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Trend</h3>
            <div className="h-32 flex items-end justify-between space-x-1">
              {analyticsData.timeSeriesData.map((data, index) => {
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
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;