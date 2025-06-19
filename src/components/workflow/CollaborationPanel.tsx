import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Eye, 
  Edit, 
  Share, 
  Settings, 
  Crown, 
  Shield, 
  X,
  CheckCircle,
  AlertCircle,
  Send,
  Paperclip,
  MoreVertical
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'online' | 'offline' | 'away';
  lastActive: string;
  permissions: string[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  nodeId?: string;
  replies?: Comment[];
}

interface Version {
  id: string;
  name: string;
  author: string;
  timestamp: string;
  description: string;
  current: boolean;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ isOpen, onClose }) => {
  const { user, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'team' | 'comments' | 'versions' | 'sharing'>('team');
  const [newComment, setNewComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: profile?.full_name || 'You',
      email: user?.email || '',
      role: 'owner',
      status: 'online',
      lastActive: 'now',
      permissions: ['read', 'write', 'admin', 'share']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'admin',
      status: 'online',
      lastActive: '2 minutes ago',
      permissions: ['read', 'write', 'admin']
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'editor',
      status: 'away',
      lastActive: '1 hour ago',
      permissions: ['read', 'write']
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'viewer',
      status: 'offline',
      lastActive: '1 day ago',
      permissions: ['read']
    }
  ];

  const comments: Comment[] = [
    {
      id: '1',
      author: 'Sarah Johnson',
      content: 'Should we add error handling to the email trigger?',
      timestamp: '2024-01-15 14:30:00',
      nodeId: 'email-trigger-1'
    },
    {
      id: '2',
      author: 'Mike Chen',
      content: 'The AI analysis node is working great! Maybe we can optimize the prompt for better results.',
      timestamp: '2024-01-15 14:25:00',
      nodeId: 'ai-analysis-1'
    },
    {
      id: '3',
      author: 'You',
      content: 'Updated the workflow with the new requirements. Please review when you have a chance.',
      timestamp: '2024-01-15 14:20:00'
    }
  ];

  const versions: Version[] = [
    {
      id: '1',
      name: 'v1.3 - Enhanced AI Processing',
      author: 'You',
      timestamp: '2024-01-15 14:30:00',
      description: 'Added sentiment analysis and improved error handling',
      current: true
    },
    {
      id: '2',
      name: 'v1.2 - Email Integration',
      author: 'Sarah Johnson',
      timestamp: '2024-01-15 12:15:00',
      description: 'Integrated Gmail API and added email templates',
      current: false
    },
    {
      id: '3',
      name: 'v1.1 - Initial Setup',
      author: 'Mike Chen',
      timestamp: '2024-01-15 10:00:00',
      description: 'Basic workflow structure with trigger and action nodes',
      current: false
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown size={16} className="text-yellow-600" />;
      case 'admin':
        return <Shield size={16} className="text-red-600" />;
      case 'editor':
        return <Edit size={16} className="text-blue-600" />;
      case 'viewer':
        return <Eye size={16} className="text-gray-600" />;
      default:
        return <Users size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const inviteTeamMember = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Simulate invitation
    toast.success(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
    setInviteEmail('');
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    // Simulate adding comment
    toast.success('Comment added successfully');
    setNewComment('');
  };

  const shareWorkflow = () => {
    const shareUrl = `${window.location.origin}/workflow/shared/abc123`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">Team Collaboration</h2>
              <p className="text-sm text-purple-100">Real-time collaboration with version control</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-white text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>{teamMembers.filter(m => m.status === 'online').length} online</span>
            </div>
            <button
              onClick={shareWorkflow}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Share size={16} className="mr-2" />
              Share
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'team', label: 'Team Members', icon: <Users size={16} /> },
            { id: 'comments', label: 'Comments', icon: <MessageSquare size={16} /> },
            { id: 'versions', label: 'Version History', icon: <GitBranch size={16} /> },
            { id: 'sharing', label: 'Sharing Settings', icon: <Share size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Invite Member */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Invite Team Member</h3>
                <div className="flex space-x-3">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    onClick={inviteTeamMember}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <UserPlus size={16} className="mr-2" />
                    Invite
                  </button>
                </div>
              </div>

              {/* Team Members List */}
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`}></div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{member.name}</span>
                          {getRoleIcon(member.role)}
                        </div>
                        <div className="text-sm text-gray-600">{member.email}</div>
                        <div className="text-xs text-gray-500">Last active: {member.lastActive}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                        member.role === 'owner' ? 'bg-yellow-100 text-yellow-700' :
                        member.role === 'admin' ? 'bg-red-100 text-red-700' :
                        member.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {member.role}
                      </span>
                      {member.role !== 'owner' && (
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* Add Comment */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Add Comment</h3>
                <div className="space-y-3">
                  <textarea
                    placeholder="Share your thoughts or feedback..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex justify-between items-center">
                    <button className="flex items-center text-gray-600 hover:text-gray-900">
                      <Paperclip size={16} className="mr-1" />
                      Attach file
                    </button>
                    <button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      <Send size={16} className="mr-2" />
                      Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm font-medium">
                          {comment.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                          {comment.nodeId && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              Node comment
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-4">
              {versions.map((version) => (
                <div key={version.id} className={`border rounded-lg p-4 ${
                  version.current ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{version.name}</h3>
                        {version.current && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{version.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By {version.author}</span>
                        <span>{new Date(version.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!version.current && (
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                          Restore
                        </button>
                      )}
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sharing' && (
            <div className="space-y-6">
              {/* Share Link */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Share Link</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={`${window.location.origin}/workflow/shared/abc123`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={shareWorkflow}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Copy Link
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Anyone with this link can view the workflow
                </p>
              </div>

              {/* Permission Settings */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Permission Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Public Access</div>
                      <div className="text-sm text-gray-600">Allow anyone to view this workflow</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Allow Comments</div>
                      <div className="text-sm text-gray-600">Let viewers add comments</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Download Access</div>
                      <div className="text-sm text-gray-600">Allow downloading workflow data</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CollaborationPanel;