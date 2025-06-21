import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { 
  Database, 
  Power, 
  PowerOff, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Filter,
  Shuffle,
  Settings
} from 'lucide-react';
import { WorkflowNode } from '../../../store/workflowStore';

// Icon mapping for DataNode
const iconMap: Record<string, React.ReactNode> = {
  Database: <Database size={18} />,
  Filter: <Filter size={18} />,
  Shuffle: <Shuffle size={18} />,
  Settings: <Settings size={18} />,
};

const DataNode = ({ data, selected }: NodeProps<WorkflowNode['data']>) => {
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
      return iconMap[data.icon] || <Database size={18} />;
    }
    return <Database size={18} />;
  };

  const getTransformType = () => {
    const transformType = data.config?.transformType || 'filter';
    switch (transformType) {
      case 'map': return 'Data Mapping';
      case 'filter': return 'Data Filter';
      case 'transform': return 'Transform';
      case 'aggregate': return 'Aggregate';
      default: return 'Data Processing';
    }
  };

  return (
    <motion.div
      className={`px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 border-2 min-w-[200px] relative ${
        selected ? 'border-teal-300' : 'border-transparent'
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
        className="w-3 h-3 bg-white border-2 border-teal-500"
      />
      
      <div className="flex items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-lg mr-3">
          <div className="text-white">
            {renderIcon()}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">{data.label}</div>
          <div className="text-teal-100 text-xs">{getTransformType()}</div>
        </div>
      </div>
      
      {/* Processing info */}
      {data.config?.recordsProcessed && (
        <div className="mt-2 text-xs text-teal-100">
          Processed: {data.config.recordsProcessed} records
        </div>
      )}
      
      {/* Execution info */}
      {data.lastExecuted && (
        <div className="mt-2 text-xs text-teal-100">
          Last: {new Date(data.lastExecuted).toLocaleTimeString()}
          {data.executionTime && ` (${data.executionTime}ms)`}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-teal-500"
      />
    </motion.div>
  );
};

export default DataNode;