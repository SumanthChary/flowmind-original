import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, CheckCircle, AlertCircle, AlertTriangle, Trash2, Download, Filter } from 'lucide-react';
import { useWorkflowStore, ExecutionLog } from '../../store/workflowStore';

interface ExecutionLogsPanelProps {
  workflowId: string;
  onClose: () => void;
}

const ExecutionLogsPanel = ({ workflowId, onClose }: ExecutionLogsPanelProps) => {
  const { getLogsForWorkflow, clearLogs } = useWorkflowStore();
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'warning'>('all');

  useEffect(() => {
    const workflowLogs = getLogsForWorkflow(workflowId);
    setLogs(workflowLogs);
  }, [workflowId, getLogsForWorkflow]);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-success-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-error-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-warning-600" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success-50 border-success-200';
      case 'error':
        return 'bg-error-50 border-error-200';
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs for this workflow?')) {
      clearLogs(workflowId);
      setLogs([]);
    }
  };

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `workflow-logs-${workflowId}-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <motion.div 
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="w-80 bg-white border-l border-gray-200 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock size={20} className="mr-2" />
            Execution Logs
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          >
            <option value="all">All logs</option>
            <option value="success">Success only</option>
            <option value="error">Errors only</option>
            <option value="warning">Warnings only</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleExportLogs}
            disabled={logs.length === 0}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
          >
            <Download size={16} className="mr-1" />
            Export
          </button>
          <button
            onClick={handleClearLogs}
            disabled={logs.length === 0}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors disabled:opacity-50 text-sm"
          >
            <Trash2 size={16} className="mr-1" />
            Clear
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              {logs.length === 0 ? 'No execution logs yet' : 'No logs match the current filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 border rounded-lg ${getStatusColor(log.status)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(log.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {log.nodeId === 'workflow' ? 'Workflow' : `Node: ${log.nodeId}`}
                      </span>
                      {log.duration && (
                        <span className="text-xs text-gray-500">
                          {log.duration}ms
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{log.message}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    {log.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                          View data
                        </summary>
                        <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {logs.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-success-600">
                {logs.filter(l => l.status === 'success').length}
              </div>
              <div className="text-xs text-gray-600">Success</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-error-600">
                {logs.filter(l => l.status === 'error').length}
              </div>
              <div className="text-xs text-gray-600">Errors</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-warning-600">
                {logs.filter(l => l.status === 'warning').length}
              </div>
              <div className="text-xs text-gray-600">Warnings</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ExecutionLogsPanel;