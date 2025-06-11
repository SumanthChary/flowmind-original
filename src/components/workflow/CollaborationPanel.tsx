import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Crown, 
  Edit, 
  Eye, 
  MoreVertical,
  Mail,
  Clock,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { workflowService } from '../../services/workflowService';
import toast from 'react-hot-toast';

interface Collaborator {
  workflowId: string;
  userId: string;
  userName: string;
  lastSeen: string;
  cursor?: { x: number; y: number };
  selection?: string[];
  role?: 'owner' | 'editor' | 'viewer';
  avatar?: string;
}

interface CollaborationPanelProps {
  workflowId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ 
  workflowId, 
  isOpen, 
  onClose 
}) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCollaborators();
      joinCollaboration();
      
      // Subscribe to real-time updates
      const unsubscribe = workflowService.collaboration.subscribe(
        workflowId,
        () => {}, // Workflow updates handled elsewhere
        (updatedCollaborators) => {
          setCollaborators(updatedCollaborators.map(c => ({
            ...c,
            role: c.role || 'viewer' // Default role
          })));
        }
      );

      return () => {
        unsubscribe();
        workflowService.collaboration.leave(workflowId);
      };
    }
  }, [isOpen, workflowId]);

  const loadCollaborators = async () => {
    try {
      setLoading(true);
      const activeCollaborators = await workflowService.collaboration.getActive(workflowId);
      setCollaborators(activeCollaborators.map(c => ({
        ...c,
        role: c.role || 'viewer'
      })));
    } catch (error) {
      toast.error('Failed to load collaborators');
      console.error('Load collaborators error:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinCollaboration = async () => {
    try {
      await workflowService.collaboration.join(workflowId);
    } catch (error) {
      console.error('Join collaboration error:', error);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setInviting(true);
    try {
      // In a real implementation, this would send an invitation
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInvite(false);
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'owner' | 'editor' | 'viewer') => {
    try {
      // Update role in backend
      setCollaborators(prev => 
        prev.map(c => c.userId === userId ? { ...c, role: newRole } : c)
      );
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!confirm('Remove this collaborator from the workflow?')) return;

    try {
      setCollaborators(prev => prev.filter(c => c.userId !== userId));
      toast.success('Collaborator removed');
    } catch (error) {
      toast.error('Failed to remove collaborator');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (lastSeen: string) => {
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);
    
    if (diffMinutes < 5) return 'bg-success-500';
    if (diffMinutes < 30) return 'bg-warning-500';
    return 'bg-gray-400';
  };

  const formatLastSeen = (lastSeen: string) => {
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Active now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return lastSeenDate.toLocaleDateString();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown size={14} className="text-warning-600" />;
      case 'editor':
        return <Edit size={14} className="text-accent-600" />;
      case 'viewer':
        return <Eye size={14} className="text-gray-500" />;
      default:
        return <Eye size={14} className="text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-accent-600" />
            <h3 className="text-lg font-semibold text-gray-900">Collaboration</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <button
          onClick={() => setShowInvite(true)}
          className="w-full flex items-center justify-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
        >
          <UserPlus size={16} className="mr-2" />
          Invite Collaborator
        </button>
      </div>

      {/* Collaborators List */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : collaborators.length === 0 ? (
          <div className="text-center py-8">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No active collaborators</h4>
            <p className="text-gray-600 text-sm">
              Invite team members to collaborate on this workflow
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {collaborators.map((collaborator) => (
              <motion.div
                key={collaborator.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  {collaborator.avatar ? (
                    <img
                      src={collaborator.avatar}
                      alt={collaborator.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getInitials(collaborator.userName)}
                      </span>
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.lastSeen)}`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {collaborator.userName}
                    </h4>
                    {getRoleIcon(collaborator.role || 'viewer')}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    {formatLastSeen(collaborator.lastSeen)}
                  </p>
                  
                  {collaborator.selection && collaborator.selection.length > 0 && (
                    <div className="text-xs text-accent-600">
                      Editing {collaborator.selection.length} node{collaborator.selection.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                
                <div className="relative group">
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                  
                  <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <div className="p-2">
                      <div className="text-xs text-gray-500 mb-2">Change Role</div>
                      <div className="space-y-1">
                        {['owner', 'editor', 'viewer'].map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(collaborator.userId, role as any)}
                            className={`w-full flex items-center px-2 py-1 text-sm rounded transition-colors ${
                              collaborator.role === role
                                ? 'bg-accent-100 text-accent-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {getRoleIcon(role)}
                            <span className="ml-2 capitalize">{role}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <hr className="my-1" />
                    <button
                      onClick={() => handleRemoveCollaborator(collaborator.userId)}
                      className="w-full flex items-center px-3 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      Remove Access
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Invite Collaborator</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  >
                    <option value="editor">Editor - Can edit the workflow</option>
                    <option value="viewer">Viewer - Can only view the workflow</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowInvite(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={inviting || !inviteEmail.trim()}
                  className="flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inviting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Mail size={16} className="mr-2" />
                  )}
                  Send Invitation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Active collaborators</span>
            <span>{collaborators.filter(c => getStatusColor(c.lastSeen) === 'bg-success-500').length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total collaborators</span>
            <span>{collaborators.length}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CollaborationPanel;