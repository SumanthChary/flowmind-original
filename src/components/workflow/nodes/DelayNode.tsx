import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface DelayNodeData {
  label: string;
  icon: React.ReactNode;
  type: string;
  config: Record<string, any>;
}

const DelayNode = ({ data, selected }: NodeProps<DelayNodeData>) => {
  return (
    <motion.div
      className={`px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 border-2 min-w-[200px] ${
        selected ? 'border-gray-300' : 'border-transparent'
      }`}
      whileHover={{ scale: 1.02 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
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
          <div className="text-gray-100 text-xs">Delay</div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-gray-500"
      />
    </motion.div>
  );
};

export default DelayNode;