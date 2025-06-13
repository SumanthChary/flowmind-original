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
  Activity,
  Edit,
  Save,
  RotateCcw
} from 'lucide-react';
import { WorkflowNode, useWorkflowStore } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface NodeInspectorProps {
  node: WorkflowNode | null;
  isOpen: boolean;
  onClose: () => void;
}

const NodeInspector: React.FC<NodeInspectorProps> = ({ 
  node, 
  isOpen, 
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'output' | 'edit'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedNode, setEditedNode] = useState<WorkflowNode | null>(null);
  const { updateNode, executeWorkflow, currentWorkflow } = useWorkflowStore();

  React.useEffect(() => {
    if (node) {
      setEditedNode({ ...node });
    }
  }, [node]);

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

  const handleSaveChanges = () => {
    if (!editedNode) return;
    
    updateNode(editedNode.id, editedNode.data);
    setIsEditing(false);
    toast.success('Node updated successfully!');
  };

  const handleResetChanges = () => {
    setEditedNode(node ? { ...node } : null);
    setIsEditing(false);
  };

  const handleRunSingleNode = async () => {
    if (!currentWorkflow || !node) return;
    
    try {
      // Update node status to running
      updateNode(node.id, { status: 'running' });
      toast.info('Running node...');
      
      // Simulate node execution
      setTimeout(() => {
        updateNode(node.id, { 
          status: 'success',
          lastExecuted: new Date().toISOString(),
          executionTime: Math.floor(Math.random() * 2000) + 500,
          output: {
            message: `Node "${node.data.label}" executed successfully`,
            timestamp: new Date().toISOString(),
            nodeType: node.type,
            singleExecution: true
          }
        });
        toast.success('Node executed successfully!');
      }, 2000);
    } catch (error) {
      updateNode(node.id, { status: 'error' });
      toast.error('Node execution failed');
    }
  };

  const updateConfigValue = (key: string, value: any) => {
    if (!editedNode) return;
    
    setEditedNode({
      ...editedNode,
      data: {
        ...editedNode.data,
        config: {
          ...editedNode.data.config,
          [key]: value
        }
      }
    });
  };

  const updateNodeLabel = (label: string) => {
    if (!editedNode) return;
    
    setEditedNode({
      ...editedNode,
      data: {
        ...editedNode.data,
        label
      }
    });
  };

  const renderConfigEditor = () => {
    if (!editedNode) return null;

    const config = editedNode.data.config || {};

    switch (editedNode.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Type</label>
              <select
                value={config.triggerType || 'email'}
                onChange={(e) => updateConfigValue('triggerType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
              >
                <option value="email">Email</option>
                <option value="webhook">Webhook</option>
                <option value="schedule">Schedule</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            {config.triggerType === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Filter</label>
                <input
                  type="text"
                  value={config.emailFilter || ''}
                  onChange={(e) => updateConfigValue('emailFilter', e.target.value)}
                  placeholder="support@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
                />
              </div>
            )}
            {config.triggerType === 'webhook' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                <input
                  type="text"
                  value={config.webhookUrl || ''}
                  onChange={(e) => updateConfigValue('webhookUrl', e.target.value)}
                  placeholder="https://api.example.com/webhook"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
                />
              </div>
            )}
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
              <select
                value={config.actionType || 'email'}
                onChange={(e) => updateConfigValue('actionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
              >
                <option value="email">Send Email</option>
                <option value="slack">Send Slack Message</option>
                <option value="database">Update Database</option>
                <option value="api">API Call</option>
              </select>
            </div>
            {config.actionType === 'email' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email To</label>
                  <input
                    type="email"
                    value={config.emailTo || 'enjoywithpandu@gmail.com'}
                    onChange={(e) => updateConfigValue('emailTo', e.target.value)}
                    placeholder="enjoywithpandu@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={config.emailSubject || ''}
                    onChange={(e) => updateConfigValue('emailSubject', e.target.value)}
                    placeholder="FlowMind Notification"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={config.emailMessage || ''}
                    onChange={(e) => updateConfigValue('emailMessage', e.target.value)}
                    placeholder="Your workflow has completed successfully!"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AI Type</label>
              <select
                value={config.aiType || 'text_analysis'}
                onChange={(e) => updateConfigValue('aiType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
              >
                <option value="text_analysis">Text Analysis</option>
                <option value="sentiment_analysis">Sentiment Analysis</option>
                <option value="data_extraction">Data Extraction</option>
                <option value="content_generation">Content Generation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <select
                value={config.model || 'gemini-pro'}
                onChange={(e) => updateConfigValue('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
              >
                <option value="gemini-pro">Gemini Pro</option>
                <option value="gpt-4">GPT-4</option>
                <option value="claude-3">Claude 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
              <textarea
                value={config.prompt || ''}
                onChange={(e) => updateConfigValue('prompt', e.target.value)}
                placeholder="Analyze the input data and provide insights..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition Type</label>
              <select
                value={config.conditionType || 'equals'}
                onChange={(e) => updateConfigValue('conditionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="greater">Greater Than</option>
                <option value="less">Less Than</option>
                <option value="exists">Exists</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
              <input
                type="text"
                value={config.field || ''}
                onChange={(e) => updateConfigValue('field', e.target.value)}
                placeholder="status, priority, sentiment"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
              <input
                type="text"
                value={config.value || ''}
                onChange={(e) => updateConfigValue('value', e.target.value)}
                placeholder="urgent, high, positive"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500">
            <Settings size={32} className="mx-auto mb-2 opacity-50" />
            <p>No configuration options available for this node type</p>
          </div>
        );
    }
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
            onClick={handleRunSingleNode}
            className="text-green-600 hover:text-green-700 transition-colors"
            title="Run this node"
          >
            <Play size={16} />
          </button>
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
          { id: 'edit', label: 'Edit', icon: <Edit size={16} /> },
          { id: 'output', label: 'Output', icon: <Code size={16} /> }
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

          {activeTab === 'edit' && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Edit Node</h4>
                <div className="flex space-x-2">
                  {isEditing && (
                    <button
                      onClick={handleResetChanges}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Reset changes"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Node Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Node Label</label>
                  <input
                    type="text"
                    value={editedNode?.data.label || ''}
                    onChange={(e) => {
                      updateNodeLabel(e.target.value);
                      setIsEditing(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                {/* Configuration */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Configuration</h5>
                  <div onClick={() => setIsEditing(true)}>
                    {renderConfigEditor()}
                  </div>
                </div>
              </div>
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

                  {/* Email-specific output formatting */}
                  {(node.type === 'action' && node.data.config?.actionType === 'email') && node.data.output?.email_sent && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-2">📧 Email Details</h5>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div><strong>To:</strong> {node.data.output.to}</div>
                        <div><strong>Subject:</strong> {node.data.output.subject}</div>
                        <div><strong>Status:</strong> {node.data.output.delivery_status}</div>
                        <div><strong>Message ID:</strong> {node.data.output.message_id}</div>
                        <div><strong>Sent At:</strong> {new Date(node.data.output.sent_at).toLocaleString()}</div>
                        {node.data.output.realEmail && (
                          <div className="mt-2 p-2 bg-green-100 rounded">
                            <strong>✅ Real Email:</strong> Successfully sent to enjoywithpandu@gmail.com
                          </div>
                        )}
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
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveChanges}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-accent-600 rounded-lg hover:bg-accent-700 transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
            <button
              onClick={handleResetChanges}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={16} className="mr-2" />
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(node)}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Copy size={16} className="mr-2" />
              Copy Node
            </button>
            <button
              onClick={handleRunSingleNode}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play size={16} className="mr-2" />
              Run Node
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NodeInspector;