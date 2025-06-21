import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { 
  Webhook, 
  Power, 
  PowerOff, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Globe,
  Settings
} from 'lucide-react';
import { WorkflowNode } from '../../../store/workflowStore';

// Icon mapping for WebhookNode
const iconMap: Record<string, React.ReactNode> = {
  Webhook: <Webhook size={18} />,
  Globe: <Globe size={18} />,
  Settings: <Settings size={18} />,
};

const WebhookNode = ({ data, selected }: NodeProps<WorkflowNode['data']>) => {
  const getStatusIndicator = () => {
    switch (data.status) {
      case 'running':
        return <Clock size={14} className="text-warning-600 animate-spin" />;
      case 'success':
        return <CheckCircle size={14} className="text-success-600" />;
      case 'error':
        return <AlertCircle size={14} className="text-error-600" />;
      default:
        return null;
    }
  };

  const renderIcon = () => {
    if (typeof data.icon === 'string') {
      return iconMap[data.icon] || <Webhook size={18} />;
    }
    return <Webhook size={18} />;
  };

  const getMethodColor = () => {
    const method = data.config?.method || 'POST';
    switch (method) {
      case 'GET': return 'text-blue-600';
      case 'POST': return 'text-green-600';
      case 'PUT': return 'text-yellow-600';
      case 'DELETE': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      className={`px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 border-2 min-w-[200px] relative ${
        selected ? 'border-indigo-300' : 'border-transparent'
      } ${!data.active ? 'opacity-60' : ''}`}
      whileHover={{ scale: 1.02 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Status indicators */}
      <div className="absolute -top-2 -right-2 flex space-x-1">
        {getStatusIndicator()}
        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
          data.active ? 'bg-success-500' : 'bg-gray-400'
        }`}>
          {data.active ? (
            <Power size={10} className="text-white" />
          ) : (
            <PowerOff size={10} className="text-white" />
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-indigo-500"
      />
      
      <div className="flex items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-lg mr-3">
          <div className="text-white">
            {renderIcon()}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">{data.label}</div>
          <div className="text-indigo-100 text-xs flex items-center">
            <span className={`font-medium ${getMethodColor()}`}>
              {data.config?.method || 'POST'}
            </span>
            <span className="ml-1">Webhook</span>
          </div>
        </div>
      </div>
      
      {/* URL info */}
      {data.config?.url && (
        <div className="mt-2 text-xs text-indigo-100 truncate">
          {data.config.url}
        </div>
      )}
      
      {/* Execution info */}
      {data.lastExecuted && (
        <div className="mt-2 text-xs text-indigo-100">
          Last: {new Date(data.lastExecuted).toLocaleTimeString()}
          {data.executionTime && ` (${data.executionTime}ms)`}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-indigo-500"
      />
    </motion.div>
  );
};

export default WebhookNode;