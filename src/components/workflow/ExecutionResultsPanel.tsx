import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download, 
  Copy,
  Eye,
  BarChart,
  Activity,
  Zap,
  Database,
  Mail,
  MessageSquare,
  Brain
} from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface ExecutionResultsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExecutionResultsPanel: React.FC<ExecutionResultsPanelProps> = ({ isOpen, onClose }) => {
  const { nodes, edges, executionLogs, currentWorkflow } = useWorkflowStore();

  if (!isOpen) return null;

  const workflowLogs = currentWorkflow 
    ? executionLogs.filter(log => log.workflowId === currentWorkflow.id)
    : [];

  const getNodeResults = () => {
    return nodes
      .filter(node => node.data.output || node.data.status !== 'idle')
      .map(node => {
        const nodeLogs = workflowLogs.filter(log => log.nodeId === node.id);
        return {
          ...node,
          logs: nodeLogs,
          lastLog: nodeLogs[0]
        };
      });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-success-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-error-600" />;
      case 'running':
        return <Clock size={16} className="text-warning-600 animate-spin" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Zap size={16} className="text-primary-600" />;
      case 'ai':
        return <Brain size={16} className="text-purple-600" />;
      case 'action':
        return <Activity size={16} className="text-accent-600" />;
      case 'condition':
        return <BarChart size={16} className="text-warning-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  const copyResult = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('Result copied to clipboard!');
  };

  const exportResults = () => {
    const results = {
      workflow: currentWorkflow?.name,
      executedAt: new Date().toISOString(),
      nodes: getNodeResults().map(node => ({
        id: node.id,
        label: node.data.label,
        type: node.type,
        status: node.data.status,
        output: node.data.output,
        executionTime: node.data.executionTime,
        lastExecuted: node.data.lastExecuted
      })),
      logs: workflowLogs
    };

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `workflow-results-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Results exported successfully!');
  };

  const nodeResults = getNodeResults();
  const successCount = nodeResults.filter(n => n.data.status === 'success').length;
  const errorCount = nodeResults.filter(n => n.data.status === 'error').length;
  const totalExecutionTime = nodeResults.reduce((sum, n) => sum + (n.data.executionTime || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-4 top-20 bottom-4 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-success-500 to-accent-600 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <BarChart size={18} className="text-white" />
          </div>
          <div className="text-white">
            <h3 className="font-semibold">Execution Results</h3>
            <p className="text-xs text-success-100">Live workflow data</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportResults}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
            title="Export results"
          >
            <Download size={16} />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-success-600">{successCount}</div>
            <div className="text-xs text-gray-600">Success</div>
          </div>
          <div>
            <div className="text-lg font-bold text-error-600">{errorCount}</div>
            <div className="text-xs text-gray-600">Errors</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{totalExecutionTime}ms</div>
            <div className="text-xs text-gray-600">Total Time</div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {nodeResults.length === 0 ? (
          <div className="text-center py-8">
            <Activity size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
            <p className="text-gray-600 text-sm">
              Run your workflow to see execution results and data here.
            </p>
          </div>
        ) : (
          nodeResults.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-4 ${
                node.data.status === 'success' ? 'border-success-200 bg-success-50' :
                node.data.status === 'error' ? 'border-error-200 bg-error-50' :
                'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getNodeIcon(node.type)}
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{node.data.label}</h4>
                    <p className="text-xs text-gray-500 capitalize">{node.type} node</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(node.data.status)}
                  {node.data.executionTime && (
                    <span className="text-xs text-gray-500">{node.data.executionTime}ms</span>
                  )}
                </div>
              </div>

              {/* Execution Output */}
              {node.data.output && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Output Data:</span>
                    <button
                      onClick={() => copyResult(node.data.output)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy output"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                  <div className="bg-white border rounded p-2 max-h-32 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(node.data.output, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Last Execution */}
              {node.data.lastExecuted && (
                <div className="text-xs text-gray-500">
                  Last executed: {new Date(node.data.lastExecuted).toLocaleString()}
                </div>
              )}

              {/* Recent Logs */}
              {node.logs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs font-medium text-gray-700 mb-2 block">Recent Activity:</span>
                  <div className="space-y-1">
                    {node.logs.slice(0, 2).map((log) => (
                      <div key={log.id} className="text-xs text-gray-600 flex items-center">
                        {getStatusIcon(log.status)}
                        <span className="ml-2">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            {nodeResults.length} node{nodeResults.length !== 1 ? 's' : ''} executed
          </span>
          <span>
            {workflowLogs.length} log{workflowLogs.length !== 1 ? 's' : ''} total
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ExecutionResultsPanel;