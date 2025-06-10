import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface TriggerNodeData {
  label: string;
  icon: React.ReactNode;
  type: string;
  config: Record<string, any>;
}

const TriggerNode = ({ data, selected }: NodeProps<TriggerNodeData>) => {
  return (
    <motion.div
      className={`px-4 py-3 shadow-lg rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 border-2 min-w-[200px] ${
        selected ? 'border-primary-300' : 'border-transparent'
      }`}
      whileHover={{ scale: 1.02 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
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
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-primary-500"
      />
    </motion.div>
  );
};

export default TriggerNode;