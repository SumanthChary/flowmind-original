import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Copy, Power, PowerOff, Settings, Edit } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId?: string;
  edgeId?: string;
  onAction: (action: string, id?: string) => void;
  onClose: () => void;
}

const ContextMenu = ({ x, y, nodeId, edgeId, onAction, onClose }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAction = (action: string) => {
    onAction(action, nodeId || edgeId);
  };

  const nodeActions = [
    {
      label: 'Edit Properties',
      icon: <Edit size={16} />,
      action: 'edit',
      shortcut: 'Enter'
    },
    {
      label: 'Duplicate',
      icon: <Copy size={16} />,
      action: 'duplicate',
      shortcut: 'Ctrl+D'
    },
    {
      label: 'Toggle Active',
      icon: <Power size={16} />,
      action: 'toggle',
      shortcut: 'Space'
    },
    {
      label: 'Delete',
      icon: <Trash2 size={16} />,
      action: 'delete',
      shortcut: 'Del',
      danger: true
    }
  ];

  const edgeActions = [
    {
      label: 'Delete Connection',
      icon: <Trash2 size={16} />,
      action: 'delete',
      shortcut: 'Del',
      danger: true
    }
  ];

  const actions = nodeId ? nodeActions : edgeActions;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px]"
        style={{
          left: x,
          top: y,
          transform: 'translate(-50%, 0)'
        }}
      >
        {actions.map((action, index) => (
          <button
            key={action.action}
            onClick={() => handleAction(action.action)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
              action.danger ? 'text-error-600 hover:bg-error-50' : 'text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <span className="mr-3">{action.icon}</span>
              {action.label}
            </div>
            {action.shortcut && (
              <span className="text-xs text-gray-400 ml-2">
                {action.shortcut}
              </span>
            )}
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default ContextMenu;