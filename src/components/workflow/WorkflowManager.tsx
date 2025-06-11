import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2, 
  Play, 
  Pause, 
  Eye,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Upload,
  GitBranch,
  Users,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { workflowService } from '../../services/workflowService';
import { useWorkflowStore } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface WorkflowListItem {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'active' | 'paused' | 'error';
  size: number;
  owner?: string;
  collaborators?: number;
}

interface WorkflowManagerProps {
  onSelectWorkflow: (workflowId: string) => void;
  onCreateNew: () => void;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({ onSelectWorkflow, onCreateNew }) => {
  const [workflows, setWorkflows] = useState<WorkflowListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'updated_at' | 'created_at'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWorkflows, setSelectedWorkflows] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { createWorkflow } = useWorkflowStore();

  // Debounced search
  const debouncedSearch = useMemo(() => {
    const timer = setTimeout(() => {
      loadWorkflows();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, sortBy, sortOrder, currentPage]);

  const loadWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      const result = await workflowService.list({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        sortBy,
        sortOrder,
        status: statusFilter === 'all' ? undefined : statusFilter
      });

      setWorkflows(result.workflows);
      setTotalPages(result.totalPages);
    } catch (error) {
      toast.error('Failed to load workflows');
      console.error('Load workflows error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const handleRefresh = async () => {
    setRefreshing(true);
    workflowService.cache.clear();
    await loadWorkflows();
    setRefreshing(false);
    toast.success('Workflows refreshed');
  };

  const handleDuplicate = async (workflow: WorkflowListItem) => {
    try {
      const originalWorkflow = await workflowService.load(workflow.id);
      if (!originalWorkflow) throw new Error('Workflow not found');

      const duplicatedWorkflow = createWorkflow(
        `${workflow.name} (Copy)`,
        workflow.description
      );

      // Copy nodes and edges
      duplicatedWorkflow.nodes = originalWorkflow.nodes.map(node => ({
        ...node,
        id: `${node.id}-copy-${Date.now()}`
      }));

      duplicatedWorkflow.edges = originalWorkflow.edges.map(edge => ({
        ...edge,
        id: `${edge.id}-copy-${Date.now()}`,
        source: `${edge.source}-copy-${Date.now()}`,
        target: `${edge.target}-copy-${Date.now()}`
      }));

      await workflowService.autoSave(duplicatedWorkflow, { immediate: true });
      await loadWorkflows();
      toast.success('Workflow duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate workflow');
      console.error('Duplicate error:', error);
    }
  };

  const handleDelete = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      // Implementation would delete from database
      await loadWorkflows();
      toast.success('Workflow deleted successfully');
    } catch (error) {
      toast.error('Failed to delete workflow');
      console.error('Delete error:', error);
    }
  };

  const handleBulkAction = async (action: 'delete' | 'export' | 'duplicate') => {
    if (selectedWorkflows.size === 0) {
      toast.error('No workflows selected');
      return;
    }

    try {
      switch (action) {
        case 'delete':
          if (!confirm(`Delete ${selectedWorkflows.size} workflows?`)) return;
          // Bulk delete implementation
          break;
        case 'export':
          // Bulk export implementation
          toast.success(`Exported ${selectedWorkflows.size} workflows`);
          break;
        case 'duplicate':
          // Bulk duplicate implementation
          toast.success(`Duplicated ${selectedWorkflows.size} workflows`);
          break;
      }
      
      setSelectedWorkflows(new Set());
      await loadWorkflows();
    } catch (error) {
      toast.error(`Failed to ${action} workflows`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-success-500" />;
      case 'paused':
        return <Pause size={16} className="text-warning-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-error-500" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
            <p className="text-gray-600">Manage and organize your automation workflows</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onCreateNew}
              className="flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              New Workflow
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="error">Error</option>
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            >
              <option value="updated_at-desc">Recently Updated</option>
              <option value="created_at-desc">Recently Created</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedWorkflows.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-accent-50 border border-accent-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-accent-700">
                {selectedWorkflows.size} workflow{selectedWorkflows.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('duplicate')}
                  className="px-3 py-1 text-sm bg-white border border-accent-300 text-accent-700 rounded hover:bg-accent-50 transition-colors"
                >
                  <Copy size={14} className="mr-1 inline" />
                  Duplicate
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 text-sm bg-white border border-accent-300 text-accent-700 rounded hover:bg-accent-50 transition-colors"
                >
                  <Download size={14} className="mr-1 inline" />
                  Export
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 text-sm bg-error-600 text-white rounded hover:bg-error-700 transition-colors"
                >
                  <Trash2 size={14} className="mr-1 inline" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Workflow List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        ) : workflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <GitBranch size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first workflow to get started'}
            </p>
            <button
              onClick={onCreateNew}
              className="flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Create Workflow
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-3">
              {workflows.map((workflow) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-accent-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => onSelectWorkflow(workflow.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedWorkflows.has(workflow.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          const newSelected = new Set(selectedWorkflows);
                          if (e.target.checked) {
                            newSelected.add(workflow.id);
                          } else {
                            newSelected.delete(workflow.id);
                          }
                          setSelectedWorkflows(newSelected);
                        }}
                        className="mt-1 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{workflow.name}</h3>
                          {getStatusIcon(workflow.status)}
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            workflow.status === 'active' ? 'bg-success-100 text-success-700' :
                            workflow.status === 'paused' ? 'bg-warning-100 text-warning-700' :
                            workflow.status === 'error' ? 'bg-error-100 text-error-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {workflow.status}
                          </span>
                        </div>
                        
                        {workflow.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {workflow.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            Updated {formatDate(workflow.updated_at)}
                          </span>
                          <span className="flex items-center">
                            <User size={12} className="mr-1" />
                            {workflow.owner || 'You'}
                          </span>
                          <span>{formatFileSize(workflow.size)}</span>
                          {workflow.collaborators && workflow.collaborators > 0 && (
                            <span className="flex items-center">
                              <Users size={12} className="mr-1" />
                              {workflow.collaborators} collaborator{workflow.collaborators > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPreview(workflow.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Preview"
                      >
                        <Eye size={16} />
                      </button>
                      
                      <div className="relative group">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectWorkflow(workflow.id);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Edit size={14} className="mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(workflow);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Copy size={14} className="mr-2" />
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Export single workflow
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Download size={14} className="mr-2" />
                            Export
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(workflow.id);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Workflow Preview</h3>
                  <button
                    onClick={() => setShowPreview(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-500">Workflow preview would be rendered here</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkflowManager;