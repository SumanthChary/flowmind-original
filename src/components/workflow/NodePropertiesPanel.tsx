import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Save, 
  Trash2, 
  Copy, 
  Power, 
  PowerOff, 
  Settings,
  Mail,
  Calendar,
  FileText,
  Database,
  Webhook,
  Filter,
  Timer,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Brain,
  Globe,
  Code,
  Zap
} from 'lucide-react';
import { WorkflowNode } from '../../store/workflowStore';
import toast from 'react-hot-toast';

// Icon mapping for node properties
const iconMap: Record<string, React.ReactNode> = {
  Mail: <Mail size={20} />,
  Calendar: <Calendar size={20} />,
  FileText: <FileText size={20} />,
  Database: <Database size={20} />,
  Webhook: <Webhook size={20} />,
  Filter: <Filter size={20} />,
  Timer: <Timer size={20} />,
  MessageSquare: <MessageSquare size={20} />,
  Brain: <Brain size={20} />,
  Globe: <Globe size={20} />,
  Code: <Code size={20} />,
  Zap: <Zap size={20} />,
};

interface NodePropertiesPanelProps {
  node: WorkflowNode;
  onClose: () => void;
  onUpdate: (updates: Partial<WorkflowNode['data']>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleActive: () => void;
}

const NodePropertiesPanel = ({
  node,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
  onToggleActive,
}: NodePropertiesPanelProps) => {
  const [label, setLabel] = useState(node.data.label);
  const [config, setConfig] = useState(node.data.config);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    onUpdate({ label, config });
    setHasChanges(false);
    toast.success('Node updated successfully');
  };

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    setHasChanges(true);
  };

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    setHasChanges(true);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      onDelete();
      toast.success('Node deleted');
    }
  };

  const getStatusIcon = () => {
    switch (node.data.status) {
      case 'running':
        return <Clock size={16} className="text-warning-600 animate-spin" />;
      case 'success':
        return <CheckCircle size={16} className="text-success-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-error-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  // Safe icon rendering
  const renderNodeIcon = () => {
    if (typeof node.data.icon === 'string') {
      return iconMap[node.data.icon] || <Settings size={20} />;
    }
    return <Settings size={20} />;
  };

  const renderNodeSpecificConfig = () => {
    switch (node.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger Type
              </label>
              <select
                value={config.triggerType || 'email'}
                onChange={(e) => handleConfigChange('triggerType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value="email">Email Received</option>
                <option value="webhook">Webhook</option>
                <option value="schedule">Schedule</option>
                <option value="file">File Upload</option>
              </select>
            </div>
            
            {config.triggerType === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Filter
                </label>
                <input
                  type="text"
                  value={config.emailFilter || ''}
                  onChange={(e) => handleConfigChange('emailFilter', e.target.value)}
                  placeholder="sender@example.com or subject contains 'urgent'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>
            )}
            
            {config.triggerType === 'schedule' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Cron)
                </label>
                <input
                  type="text"
                  value={config.schedule || '0 9 * * *'}
                  onChange={(e) => handleConfigChange('schedule', e.target.value)}
                  placeholder="0 9 * * * (daily at 9 AM)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Type
              </label>
              <select
                value={config.actionType || 'email'}
                onChange={(e) => handleConfigChange('actionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value="email">Send Email</option>
                <option value="slack">Send Slack Message</option>
                <option value="calendar">Create Calendar Event</option>
                <option value="database">Update Database</option>
                <option value="webhook">Call Webhook</option>
              </select>
            </div>
            
            {config.actionType === 'email' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <input
                    type="email"
                    value={config.emailTo || ''}
                    onChange={(e) => handleConfigChange('emailTo', e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={config.emailSubject || ''}
                    onChange={(e) => handleConfigChange('emailSubject', e.target.value)}
                    placeholder="Email subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={config.emailMessage || ''}
                    onChange={(e) => handleConfigChange('emailMessage', e.target.value)}
                    placeholder="Email message content"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
            
            {config.actionType === 'slack' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel
                  </label>
                  <input
                    type="text"
                    value={config.slackChannel || ''}
                    onChange={(e) => handleConfigChange('slackChannel', e.target.value)}
                    placeholder="#general"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={config.slackMessage || ''}
                    onChange={(e) => handleConfigChange('slackMessage', e.target.value)}
                    placeholder="Slack message content"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition Type
              </label>
              <select
                value={config.conditionType || 'equals'}
                onChange={(e) => handleConfigChange('conditionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="greater">Greater Than</option>
                <option value="less">Less Than</option>
                <option value="exists">Exists</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field to Check
              </label>
              <input
                type="text"
                value={config.field || ''}
                onChange={(e) => handleConfigChange('field', e.target.value)}
                placeholder="email.subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value
              </label>
              <input
                type="text"
                value={config.value || ''}
                onChange={(e) => handleConfigChange('value', e.target.value)}
                placeholder="Expected value"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'delay':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay Duration
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={config.duration || 1}
                  onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
                  min="1"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
                <select
                  value={config.unit || 'minutes'}
                  onChange={(e) => handleConfigChange('unit', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Processing Type
              </label>
              <select
                value={config.aiType || 'text_analysis'}
                onChange={(e) => handleConfigChange('aiType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value="text_analysis">Text Analysis</option>
                <option value="sentiment_analysis">Sentiment Analysis</option>
                <option value="data_extraction">Data Extraction</option>
                <option value="content_generation">Content Generation</option>
                <option value="classification">Classification</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <select
                value={config.model || 'gpt-4'}
                onChange={(e) => handleConfigChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
                <option value="gemini-pro">Gemini Pro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Prompt (Optional)
              </label>
              <textarea
                value={config.prompt || ''}
                onChange={(e) => handleConfigChange('prompt', e.target.value)}
                placeholder="Custom instructions for AI processing..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
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
          <h3 className="text-lg font-semibold text-gray-900">Node Properties</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Node Type Display */}
        <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-4">
          <div className="text-accent-600 mr-3">
            {renderNodeIcon()}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{node.data.label}</div>
            <div className="text-sm text-gray-500 capitalize">{node.type}</div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <button
              onClick={onToggleActive}
              className={`p-1 rounded transition-colors ${
                node.data.active 
                  ? 'text-success-600 hover:bg-success-50' 
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
              title={node.data.active ? 'Deactivate node' : 'Activate node'}
            >
              {node.data.active ? <Power size={16} /> : <PowerOff size={16} />}
            </button>
          </div>
        </div>

        {/* Status Information */}
        {node.data.status && node.data.status !== 'idle' && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50">
            <div className="text-sm font-medium text-gray-700 mb-1">Status</div>
            <div className="flex items-center justify-between">
              <span className={`text-sm capitalize ${
                node.data.status === 'success' ? 'text-success-600' :
                node.data.status === 'error' ? 'text-error-600' :
                node.data.status === 'running' ? 'text-warning-600' :
                'text-gray-600'
              }`}>
                {node.data.status}
              </span>
              {node.data.executionTime && (
                <span className="text-xs text-gray-500">
                  {node.data.executionTime}ms
                </span>
              )}
            </div>
            {node.data.lastExecuted && (
              <div className="text-xs text-gray-500 mt-1">
                Last executed: {new Date(node.data.lastExecuted).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* Execution Results */}
        {node.data.output && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-sm font-medium text-blue-900 mb-2">Execution Results</div>
            <div className="text-xs bg-white p-2 rounded border max-h-32 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-gray-700">
                {JSON.stringify(node.data.output, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Basic Properties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Node ID
          </label>
          <input
            type="text"
            value={node.id}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            placeholder="Node label"
          />
        </div>

        {/* Node-specific Configuration */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <Settings size={16} className="mr-2" />
            Configuration
          </h4>
          {renderNodeSpecificConfig()}
        </div>

        {/* Advanced Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Advanced</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.retryOnError || false}
                onChange={(e) => handleConfigChange('retryOnError', e.target.checked)}
                className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
              />
              <span className="ml-2 text-sm text-gray-700">Retry on error</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.logExecution || true}
                onChange={(e) => handleConfigChange('logExecution', e.target.checked)}
                className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
              />
              <span className="ml-2 text-sm text-gray-700">Log execution</span>
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout (seconds)
              </label>
              <input
                type="number"
                value={config.timeout || 30}
                onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                min="1"
                max="300"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-200 space-y-3">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="w-full flex items-center justify-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onDuplicate}
            className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <Copy size={16} className="mr-1" />
            Duplicate
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center px-3 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors text-sm"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NodePropertiesPanel;