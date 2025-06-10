import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { Zap, Power, PowerOff, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { WorkflowNode } from '../../../store/workflowStore';

const TriggerNode = ({ data, selected }: NodeProps<WorkflowNode['data']>) => {
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

  return (
    <motion.div
      className={`px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 border-2 min-w-[200px] relative ${
        selected ? 'border-primary-300' : 'border-transparent'
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

      <div className="flex items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-lg mr-3">
          <div className="text-white">
            {data.icon || <Zap size={18} />}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">{data.label}</div>
          <div className="text-primary-100 text-xs">Trigger</div>
        </div>
      </div>
      
      {/* Execution info */}
      {data.lastExecuted && (
        <div className="mt-2 text-xs text-primary-100">
          Last: {new Date(data.lastExecuted).toLocaleTimeString()}
          {data.executionTime && ` (${data.executionTime}ms)`}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-primary-500"
      />
    </motion.div>
  );
};

export default TriggerNode;