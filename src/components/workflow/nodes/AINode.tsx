import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Power, 
  PowerOff, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Sparkles,
  Zap,
  Settings
} from 'lucide-react';
import { WorkflowNode } from '../../../store/workflowStore';

// Icon mapping for AINode
const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain size={18} />,
  Sparkles: <Sparkles size={18} />,
  Zap: <Zap size={18} />,
  Settings: <Settings size={18} />,
};

const AINode = ({ data, selected }: NodeProps<WorkflowNode['data']>) => {
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

  // Safe icon rendering using string identifier
  const renderIcon = () => {
    if (typeof data.icon === 'string') {
      return iconMap[data.icon] || <Brain size={18} />;
    }
    // Fallback for legacy data that might still have React components
    return <Brain size={18} />;
  };

  const getAITypeLabel = () => {
    const aiType = data.config?.aiType || 'text_analysis';
    switch (aiType) {
      case 'text_analysis':
        return 'Text Analysis';
      case 'sentiment_analysis':
        return 'Sentiment';
      case 'data_extraction':
        return 'Data Extract';
      case 'content_generation':
        return 'Content Gen';
      default:
        return 'AI Processing';
    }
  };

  return (
    <motion.div
      className={`px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 border-2 min-w-[200px] relative ${
        selected ? 'border-purple-300' : 'border-transparent'
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
        className="w-3 h-3 bg-white border-2 border-purple-500"
      />
      
      <div className="flex items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-lg mr-3">
          <div className="text-white">
            {renderIcon()}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">{data.label}</div>
          <div className="text-purple-100 text-xs">{getAITypeLabel()}</div>
        </div>
      </div>
      
      {/* Model info */}
      {data.config?.model && (
        <div className="mt-2 text-xs text-purple-100">
          Model: {data.config.model}
        </div>
      )}
      
      {/* Execution info */}
      {data.lastExecuted && (
        <div className="mt-2 text-xs text-purple-100">
          Last: {new Date(data.lastExecuted).toLocaleTimeString()}
          {data.executionTime && ` (${data.executionTime}ms)`}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-purple-500"
      />
    </motion.div>
  );
};

export default AINode;