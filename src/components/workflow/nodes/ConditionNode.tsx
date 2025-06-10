import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';

interface ConditionNodeData {
  label: string;
  icon: React.ReactNode;
  type: string;
  config: Record<string, any>;
}

const ConditionNode = ({ data, selected }: NodeProps<ConditionNodeData>) => {
  return (
    <motion.div
      className={`px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r from-warning-500 to-warning-600 border-2 min-w-[200px] ${
        selected ? 'border-warning-300' : 'border-transparent'
      }`}
      whileHover={{ scale: 1.02 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-warning-500"
      />
      
      <div className="flex items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-lg mr-3">
          <div className="text-white">
            {data.icon || <GitBranch size={18} />}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">{data.label}</div>
          <div className="text-warning-100 text-xs">Condition</div>
        </div>
      </div>
      
      {/* Multiple output handles for true/false paths */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 bg-success-500 border-2 border-white"
        style={{ left: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-error-500 border-2 border-white"
        style={{ left: '70%' }}
      />
    </motion.div>
  );
};

export default ConditionNode;