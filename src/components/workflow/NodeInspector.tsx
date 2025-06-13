import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Eye, 
  Code, 
  Settings, 
  Play, 
  Copy, 
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Brain,
  Mail,
  Database,
  Zap,
  Filter,
  Timer,
  MessageSquare,
  Globe,
  Activity
} from 'lucide-react';
import { WorkflowNode } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface NodeInspectorProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNode?: (nodeId: string, updates: any) => void;
}

const NodeInspector: React.FC<NodeInspectorProps> = ({ 
  node, 
  isOpen, 
  onClose, 
  onUpdateNode 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'output' | 'logs'>('overview');

  if (!isOpen || !node) return null;

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Zap size={20} className="text-primary-600" />;
      case 'ai':
        return <Brain size={20} className="text-purple-600" />;
      case 'action':
        return <Activity size={20} className="text-accent-600" />;
      case 'condition':
        return <Filter size={20} className="text-warning-600" />;
      case 'delay':
        return <Timer size={20} className="text-gray-600" />;
      default:
        return <Settings size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success-600 bg-success-100';
      case 'error':
        return 'text-error-600 bg-error-100';
      case 'running':
        return 'text-warning-600 bg-warning-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('Copied to clipboard!');
  };

  const downloadData = (data: any, filename: string) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
    
    toast.success('Data downloaded!');
  };

  const formatExecutionTime = (time?: number) => {
    if (!time) return 'N/A';
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-4 top-20 bottom-4 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center space-x-3">
          {getNodeIcon(node.type)}
          <div>
            <h3 className="font-semibold text-gray-900">{node.data.label}</h3>
            <p className="text-xs text-gray-500 capitalize">{node.type} Node</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.data.status)}`}>
            {node.data.status}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: <Eye size={16} /> },
          { id: 'config', label: 'Config', icon: <Settings size={16} /> },
          { id: 'output', label: 'Output', icon: <Code size={16} /> },
          { id: 'logs', label: 'Logs', icon: <Activity size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-accent-600 border-b-2 border-accent-600 bg-accent-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 space-y-4"
            >
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Node Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-mono text-xs">{node.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="capitalize">{node.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(node.data.status)}`}>
                      {node.data.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active:</span>
                    <span>{node.data.active ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Execution Stats */}
              {(node.data.lastExecuted || node.data.executionTime) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Execution Stats</h4>
                  <div className="space-y-2 text-sm">
                    {node.data.lastExecuted && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Executed:</span>
                        <span>{new Date(node.data.lastExecuted).toLocaleString()}</span>
                      </div>
                    )}
                    {node.data.executionTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Execution Time:</span>
                        <span>{formatExecutionTime(node.data.executionTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Position */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Position</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">X:</span>
                    <span>{node.position.x}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Y:</span>
                    <span>{node.position.y}px</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Configuration</h4>
                <button
                  onClick={() => copyToClipboard(node.data.config)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy configuration"
                >
                  <Copy size={16} />
                </button>
              </div>
              
              {Object.keys(node.data.config || {}).length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(node.data.config, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No configuration data</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'output' && (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Output Data</h4>
                {node.data.output && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(node.data.output)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy output"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => downloadData(node.data.output, `${node.data.label}-output.json`)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Download output"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {node.data.output ? (
                <div className="space-y-4">
                  {/* Quick Summary */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h5 className="font-medium text-green-900 mb-2">Execution Summary</h5>
                    <div className="text-sm text-green-700">
                      {node.data.status === 'success' && (
                        <div className="flex items-center">
                          <CheckCircle size={16} className="mr-2" />
                          Node executed successfully
                        </div>
                      )}
                      {node.data.status === 'error' && (
                        <div className="flex items-center">
                          <AlertCircle size={16} className="mr-2" />
                          Node execution failed
                        </div>
                      )}
                      {node.data.status === 'running' && (
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 animate-spin" />
                          Node is currently running
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Full Output */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Full Output</h5>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto max-h-64 custom-scrollbar">
                      {JSON.stringify(node.data.output, null, 2)}
                    </pre>
                  </div>

                  {/* AI-specific output formatting */}
                  {node.type === 'ai' && node.data.output?.ai_response && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h5 className="font-medium text-purple-900 mb-2">AI Response</h5>
                      <div className="text-sm text-purple-700">
                        <p className="mb-2">{node.data.output.ai_response.text}</p>
                        {node.data.output.ai_response.analysis && (
                          <div className="mt-3 p-3 bg-white rounded border">
                            <h6 className="font-medium mb-2">Analysis Results:</h6>
                            <pre className="text-xs">
                              {JSON.stringify(node.data.output.ai_response.analysis, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Email-specific output formatting */}
                  {(node.type === 'action' && node.data.config?.actionType === 'email') && node.data.output?.email_sent && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-2">Email Details</h5>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div><strong>To:</strong> {node.data.output.to}</div>
                        <div><strong>Subject:</strong> {node.data.output.subject}</div>
                        <div><strong>Status:</strong> {node.data.output.delivery_status}</div>
                        <div><strong>Message ID:</strong> {node.data.output.message_id}</div>
                        <div><strong>Sent At:</strong> {new Date(node.data.output.sent_at).toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Code size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No output data available</p>
                  <p className="text-xs mt-1">Run the workflow to see results</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <h4 className="font-medium text-gray-900 mb-4">Execution Logs</h4>
              
              <div className="text-center py-8 text-gray-500">
                <Activity size={32} className="mx-auto mb-2 opacity-50" />
                <p>Execution logs will appear here</p>
                <p className="text-xs mt-1">Run the workflow to generate logs</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <button
            onClick={() => copyToClipboard(node)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy size={16} className="mr-2" />
            Copy Node
          </button>
          <button
            onClick={() => downloadData(node, `${node.data.label}-node.json`)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NodeInspector;