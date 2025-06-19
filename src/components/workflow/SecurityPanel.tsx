import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Settings, 
  Download, 
  Upload, 
  RefreshCw, 
  X,
  FileText,
  Clock,
  Globe,
  Database,
  Wifi,
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SecurityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'warning';
  icon: React.ReactNode;
  details: string[];
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'warning' | 'error';
}

const SecurityPanel: React.FC<SecurityPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'access' | 'audit' | 'compliance'>('overview');
  const [showApiKey, setShowApiKey] = useState(false);

  const securityFeatures: SecurityFeature[] = [
    {
      id: 'encryption',
      name: 'End-to-End Encryption',
      description: 'All data encrypted in transit and at rest using AES-256',
      status: 'active',
      icon: <Lock size={20} className="text-green-600" />,
      details: [
        'AES-256 encryption for data at rest',
        'TLS 1.3 for data in transit',
        'Key rotation every 90 days',
        'Hardware security modules (HSM)'
      ]
    },
    {
      id: 'soc2',
      name: 'SOC 2 Type II Certified',
      description: 'Independently audited security controls and compliance',
      status: 'active',
      icon: <Shield size={20} className="text-blue-600" />,
      details: [
        'Annual SOC 2 Type II audits',
        'Security controls monitoring',
        'Availability and confidentiality',
        'Processing integrity verification'
      ]
    },
    {
      id: 'rbac',
      name: 'Role-Based Access Control',
      description: 'Granular permissions and user role management',
      status: 'active',
      icon: <Users size={20} className="text-purple-600" />,
      details: [
        'Custom role definitions',
        'Principle of least privilege',
        'Multi-factor authentication',
        'Session management'
      ]
    },
    {
      id: 'audit',
      name: 'Comprehensive Audit Logging',
      description: 'Complete activity tracking and forensic capabilities',
      status: 'active',
      icon: <FileText size={20} className="text-orange-600" />,
      details: [
        'Real-time activity logging',
        'Immutable audit trails',
        'Automated threat detection',
        'Compliance reporting'
      ]
    },
    {
      id: 'backup',
      name: 'Automated Backups',
      description: 'Regular encrypted backups with point-in-time recovery',
      status: 'active',
      icon: <Database size={20} className="text-teal-600" />,
      details: [
        'Hourly automated backups',
        'Cross-region replication',
        'Point-in-time recovery',
        'Encrypted backup storage'
      ]
    },
    {
      id: 'monitoring',
      name: '24/7 Security Monitoring',
      description: 'Continuous threat detection and incident response',
      status: 'active',
      icon: <Eye size={20} className="text-red-600" />,
      details: [
        'Real-time threat detection',
        'Automated incident response',
        'Security operations center',
        'Vulnerability scanning'
      ]
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: '1',
      action: 'User login',
      user: 'john.doe@company.com',
      timestamp: '2024-01-15 14:30:25',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      action: 'Workflow executed',
      user: 'system',
      timestamp: '2024-01-15 14:28:15',
      ip: '10.0.0.1',
      status: 'success'
    },
    {
      id: '3',
      action: 'API key generated',
      user: 'admin@company.com',
      timestamp: '2024-01-15 14:25:10',
      ip: '192.168.1.101',
      status: 'success'
    },
    {
      id: '4',
      action: 'Failed login attempt',
      user: 'unknown@example.com',
      timestamp: '2024-01-15 14:20:05',
      ip: '203.0.113.1',
      status: 'warning'
    },
    {
      id: '5',
      action: 'Permission denied',
      user: 'guest@company.com',
      timestamp: '2024-01-15 14:15:30',
      ip: '192.168.1.102',
      status: 'error'
    }
  ];

  const complianceStandards = [
    {
      name: 'SOC 2 Type II',
      status: 'Certified',
      validUntil: '2024-12-31',
      icon: <Shield size={16} className="text-green-600" />
    },
    {
      name: 'GDPR',
      status: 'Compliant',
      validUntil: 'Ongoing',
      icon: <Globe size={16} className="text-blue-600" />
    },
    {
      name: 'ISO 27001',
      status: 'Certified',
      validUntil: '2024-08-15',
      icon: <Lock size={16} className="text-purple-600" />
    },
    {
      name: 'HIPAA',
      status: 'Ready',
      validUntil: 'On Request',
      icon: <FileText size={16} className="text-teal-600" />
    }
  ];

  const generateApiKey = () => {
    const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    toast.success('New API key generated successfully!');
    return newKey;
  };

  const downloadAuditLog = () => {
    const auditData = {
      exported_at: new Date().toISOString(),
      logs: auditLogs,
      total_entries: auditLogs.length
    };

    const dataStr = JSON.stringify(auditData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `audit-log-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Audit log exported successfully!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'warning':
        return <AlertCircle size={16} className="text-yellow-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <CheckCircle size={16} className="text-gray-400" />;
    }
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-purple-600 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">Enterprise Security</h2>
              <p className="text-sm text-red-100">SOC 2 certified with enterprise-grade protection</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-white text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>All systems secure</span>
            </div>
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
            { id: 'overview', label: 'Security Overview', icon: <Shield size={16} /> },
            { id: 'access', label: 'Access Control', icon: <Key size={16} /> },
            { id: 'audit', label: 'Audit Logs', icon: <FileText size={16} /> },
            { id: 'compliance', label: 'Compliance', icon: <CheckCircle size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Security Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle size={32} className="text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-900">Secure</div>
                  <div className="text-sm text-green-700">All systems protected</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Shield size={32} className="text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-900">SOC 2 Certified</div>
                  <div className="text-sm text-blue-700">Independently audited</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <Lock size={32} className="text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-900">Encrypted</div>
                  <div className="text-sm text-purple-700">End-to-end protection</div>
                </div>
              </div>

              {/* Security Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityFeatures.map((feature) => (
                  <div key={feature.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                          <div className={`w-3 h-3 rounded-full ${
                            feature.status === 'active' ? 'bg-green-500' :
                            feature.status === 'warning' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                        <ul className="space-y-1">
                          {feature.details.map((detail, index) => (
                            <li key={index} className="text-xs text-gray-500 flex items-center">
                              <CheckCircle size={12} className="text-green-500 mr-2" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-6">
              {/* API Keys */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Production API Key</div>
                      <div className="text-sm text-gray-600">
                        {showApiKey ? 'sk_live_1234567890abcdef' : '••••••••••••••••••••'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-2 text-gray-600 hover:text-gray-900"
                      >
                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={generateApiKey}
                        className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <RefreshCw size={14} className="mr-1" />
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Permissions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Permissions</h3>
                <div className="space-y-3">
                  {[
                    { user: 'john.doe@company.com', role: 'Admin', lastActive: '2 minutes ago' },
                    { user: 'jane.smith@company.com', role: 'Editor', lastActive: '1 hour ago' },
                    { user: 'bob.wilson@company.com', role: 'Viewer', lastActive: '1 day ago' }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{user.user}</div>
                        <div className="text-sm text-gray-600">Last active: {user.lastActive}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                        <button className="p-1 text-gray-600 hover:text-gray-900">
                          <Settings size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              {/* Audit Controls */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
                <button
                  onClick={downloadAuditLog}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download size={16} className="mr-2" />
                  Export Logs
                </button>
              </div>

              {/* Audit Logs Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.ip}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(log.status)}
                            <span className="ml-2 text-sm capitalize">{log.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              {/* Compliance Standards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complianceStandards.map((standard, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {standard.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{standard.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            standard.status === 'Certified' || standard.status === 'Compliant' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {standard.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Valid until: {standard.validUntil}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Details</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Data Protection</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• GDPR compliant data processing</li>
                      <li>• Right to be forgotten implementation</li>
                      <li>• Data portability features</li>
                      <li>• Privacy by design architecture</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Security Controls</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• SOC 2 Type II certified controls</li>
                      <li>• Regular penetration testing</li>
                      <li>• Vulnerability management program</li>
                      <li>• Incident response procedures</li>
                    </ul>
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

export default SecurityPanel;