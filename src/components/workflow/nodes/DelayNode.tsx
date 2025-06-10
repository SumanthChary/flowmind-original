import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { Clock, Power, PowerOff, AlertCircle, CheckCircle } from 'lucide-react';
import { WorkflowNode } from '../../../store/workflowStore';

const DelayNode = ({ data, selected }: NodeProps<WorkflowNode['data']>) => {
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

  const getDurationText = () => {
    const duration = data.config?.duration || 1;
    const unit = data.config?.unit || 'minutes';
    return `${duration} ${unit}`;
  };

  return (
    <motion.div
      className={`px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 border-2 min-w-[200px] relative ${
        selected ? 'border-gray-300' : 'border-transparent'
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
        className="w-3 h-3 bg-white border-2 border-gray-500"
      />
      
      <div className="flex items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-lg mr-3">
          <div className="text-white">
            {data.icon || <Clock size={18} />}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">{data.label}</div>
          <div className="text-gray-100 text-xs">Delay • {getDurationText()}</div>
        </div>
      </div>
      
      {/* Execution info */}
      {data.lastExecuted && (
        <div className="mt-2 text-xs text-gray-100">
          Last: {new Date(data.lastExecuted).toLocaleTimeString()}
          {data.executionTime && ` (${data.executionTime}ms)`}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-gray-500"
      />
    </motion.div>
  );
};

export default DelayNode;