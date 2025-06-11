import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  Clock, 
  User, 
  RotateCcw, 
  Eye, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  Tag,
  X
} from 'lucide-react';
import { workflowService } from '../../services/workflowService';
import { useWorkflowStore } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;
  data: string;
  createdAt: string;
  createdBy: string;
  message?: string;
}

interface VersionControlProps {
  workflowId: string;
  isOpen: boolean;
  onClose: () => void;
}

const VersionControl: React.FC<VersionControlProps> = ({ workflowId, isOpen, onClose }) => {
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<Set<number>>(new Set());
  const [createVersionMessage, setCreateVersionMessage] = useState('');
  const [showCreateVersion, setShowCreateVersion] = useState(false);
  const [comparing, setComparing] = useState<{ from: number; to: number } | null>(null);

  const { currentWorkflow, setCurrentWorkflow } = useWorkflowStore();

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, workflowId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const versionHistory = await workflowService.versions.list(workflowId);
      setVersions(versionHistory);
    } catch (error) {
      toast.error('Failed to load version history');
      console.error('Load versions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVersion = async () => {
    if (!currentWorkflow) return;

    try {
      await workflowService.versions.create(
        workflowId, 
        currentWorkflow, 
        createVersionMessage || `Version ${versions.length + 1}`
      );
      
      setCreateVersionMessage('');
      setShowCreateVersion(false);
      await loadVersions();
      toast.success('Version created successfully');
    } catch (error) {
      toast.error('Failed to create version');
      console.error('Create version error:', error);
    }
  };

  const handleRestoreVersion = async (version: number) => {
    if (!confirm(`Restore to version ${version}? This will overwrite the current workflow.`)) {
      return;
    }

    try {
      const restoredWorkflow = await workflowService.versions.restore(workflowId, version);
      setCurrentWorkflow(restoredWorkflow);
      toast.success(`Restored to version ${version}`);
      onClose();
    } catch (error) {
      toast.error('Failed to restore version');
      console.error('Restore version error:', error);
    }
  };

  const toggleExpanded = (version: number) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getVersionChanges = (version: WorkflowVersion) => {
    // This would analyze the version data to show what changed
    // For now, we'll return mock data
    return {
      nodesAdded: Math.floor(Math.random() * 3),
      nodesRemoved: Math.floor(Math.random() * 2),
      nodesModified: Math.floor(Math.random() * 5),
      edgesAdded: Math.floor(Math.random() * 2),
      edgesRemoved: Math.floor(Math.random() * 1)
    };
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <GitBranch size={20} className="text-accent-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Version Control</h2>
              <p className="text-sm text-gray-600">Manage workflow versions and history</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateVersion(true)}
              className="flex items-center px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
            >
              <Tag size={16} className="mr-2" />
              Create Version
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Create Version Modal */}
        <AnimatePresence>
          {showCreateVersion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Create New Version</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version Message
                  </label>
                  <textarea
                    value={createVersionMessage}
                    onChange={(e) => setCreateVersionMessage(e.target.value)}
                    placeholder="Describe what changed in this version..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCreateVersion(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateVersion}
                    className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                  >
                    Create Version
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <GitBranch size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No versions yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Create your first version to start tracking changes to your workflow.
              </p>
              <button
                onClick={() => setShowCreateVersion(true)}
                className="flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                <Tag size={16} className="mr-2" />
                Create First Version
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-3">
                {versions.map((version, index) => {
                  const changes = getVersionChanges(version);
                  const isExpanded = expandedVersions.has(version.version);
                  const isCurrent = index === 0;

                  return (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-lg p-4 transition-all ${
                        isCurrent 
                          ? 'border-accent-300 bg-accent-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <button
                            onClick={() => toggleExpanded(version.version)}
                            className="mt-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-900">
                                Version {version.version}
                              </h3>
                              {isCurrent && (
                                <span className="px-2 py-0.5 bg-accent-100 text-accent-700 text-xs rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {version.message || `Version ${version.version}`}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <User size={12} className="mr-1" />
                                {version.createdBy}
                              </span>
                              <span className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                {formatDate(version.createdAt)}
                              </span>
                            </div>
                            
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 pt-3 border-t border-gray-200"
                              >
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Changes</h4>
                                    <div className="space-y-1">
                                      {changes.nodesAdded > 0 && (
                                        <div className="text-success-600">
                                          +{changes.nodesAdded} nodes added
                                        </div>
                                      )}
                                      {changes.nodesRemoved > 0 && (
                                        <div className="text-error-600">
                                          -{changes.nodesRemoved} nodes removed
                                        </div>
                                      )}
                                      {changes.nodesModified > 0 && (
                                        <div className="text-warning-600">
                                          ~{changes.nodesModified} nodes modified
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Connections</h4>
                                    <div className="space-y-1">
                                      {changes.edgesAdded > 0 && (
                                        <div className="text-success-600">
                                          +{changes.edgesAdded} connections added
                                        </div>
                                      )}
                                      {changes.edgesRemoved > 0 && (
                                        <div className="text-error-600">
                                          -{changes.edgesRemoved} connections removed
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedVersion(version.version)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Preview version"
                          >
                            <Eye size={16} />
                          </button>
                          
                          {!isCurrent && (
                            <button
                              onClick={() => handleRestoreVersion(version.version)}
                              className="p-1 text-gray-400 hover:text-accent-600 transition-colors"
                              title="Restore this version"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                          
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Download version"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              {versions.length} version{versions.length !== 1 ? 's' : ''} total
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-accent-600 hover:text-accent-700 transition-colors">
                <Upload size={14} className="mr-1" />
                Import Version
              </button>
              <button className="flex items-center text-accent-600 hover:text-accent-700 transition-colors">
                <Download size={14} className="mr-1" />
                Export All
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VersionControl;