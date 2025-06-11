import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  X, 
  FolderOpen, 
  Globe, 
  Shield, 
  Users, 
  Bell,
  Palette,
  Code,
  Database,
  Zap
} from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface ProjectSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ isOpen, onClose }) => {
  const { currentWorkflow, updateWorkflow } = useWorkflowStore();
  const [projectName, setProjectName] = useState(currentWorkflow?.name || 'FlowMind Project');
  const [projectDescription, setProjectDescription] = useState(currentWorkflow?.description || '');
  const [projectSettings, setProjectSettings] = useState({
    theme: 'light',
    autoSave: true,
    notifications: true,
    publicAccess: false,
    collaborationEnabled: false,
    apiAccess: true,
    webhookUrl: '',
    customDomain: '',
    timezone: 'UTC',
    language: 'en',
    retentionDays: 30,
    maxExecutions: 10000
  });

  const handleSave = () => {
    if (!currentWorkflow) return;

    updateWorkflow(currentWorkflow.id, {
      name: projectName,
      description: projectDescription,
      settings: {
        ...currentWorkflow.settings,
        ...projectSettings
      }
    });

    toast.success('Project settings saved successfully!');
    onClose();
  };

  const settingsSections = [
    {
      id: 'general',
      title: 'General',
      icon: <Settings size={20} />,
      description: 'Basic project configuration'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <Palette size={20} />,
      description: 'Theme and visual settings'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: <Code size={20} />,
      description: 'API and webhook configuration'
    },
    {
      id: 'collaboration',
      title: 'Collaboration',
      icon: <Users size={20} />,
      description: 'Team and sharing settings'
    },
    {
      id: 'security',
      title: 'Security',
      icon: <Shield size={20} />,
      description: 'Access control and permissions'
    },
    {
      id: 'performance',
      title: 'Performance',
      icon: <Zap size={20} />,
      description: 'Execution and resource limits'
    }
  ];

  const [activeSection, setActiveSection] = useState('general');

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          placeholder="Enter project name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          placeholder="Describe your project"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={projectSettings.timezone}
          onChange={(e) => setProjectSettings(prev => ({ ...prev, timezone: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="Europe/London">London</option>
          <option value="Europe/Paris">Paris</option>
          <option value="Asia/Tokyo">Tokyo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        <select
          value={projectSettings.language}
          onChange={(e) => setProjectSettings(prev => ({ ...prev, language: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
        </select>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['light', 'dark', 'auto'].map((theme) => (
            <button
              key={theme}
              onClick={() => setProjectSettings(prev => ({ ...prev, theme }))}
              className={`p-3 border rounded-lg text-center capitalize transition-colors ${
                projectSettings.theme === theme
                  ? 'border-accent-500 bg-accent-50 text-accent-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">Auto-save</h4>
          <p className="text-sm text-gray-600">Automatically save changes</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={projectSettings.autoSave}
            onChange={(e) => setProjectSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">Notifications</h4>
          <p className="text-sm text-gray-600">Show workflow notifications</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={projectSettings.notifications}
            onChange={(e) => setProjectSettings(prev => ({ ...prev, notifications: e.target.checked }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
        </label>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">API Access</h4>
          <p className="text-sm text-gray-600">Enable REST API access</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={projectSettings.apiAccess}
            onChange={(e) => setProjectSettings(prev => ({ ...prev, apiAccess: e.target.checked }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Webhook URL
        </label>
        <input
          type="url"
          value={projectSettings.webhookUrl}
          onChange={(e) => setProjectSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          placeholder="https://your-webhook-url.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Receive workflow execution notifications
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Domain
        </label>
        <input
          type="text"
          value={projectSettings.customDomain}
          onChange={(e) => setProjectSettings(prev => ({ ...prev, customDomain: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          placeholder="workflows.yourdomain.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Custom domain for webhook endpoints
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">API Keys</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Public Key</span>
            <code className="text-xs bg-white px-2 py-1 rounded border">pk_live_...</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Secret Key</span>
            <code className="text-xs bg-white px-2 py-1 rounded border">sk_live_...</code>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCollaborationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">Enable Collaboration</h4>
          <p className="text-sm text-gray-600">Allow team members to edit workflows</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={projectSettings.collaborationEnabled}
            onChange={(e) => setProjectSettings(prev => ({ ...prev, collaborationEnabled: e.target.checked }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">Public Access</h4>
          <p className="text-sm text-gray-600">Make workflows publicly viewable</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={projectSettings.publicAccess}
            onChange={(e) => setProjectSettings(prev => ({ ...prev, publicAccess: e.target.checked }))}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
        </label>
      </div>

      {projectSettings.collaborationEnabled && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Team Members</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-accent-600">JD</span>
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
              </div>
              <select className="text-xs border border-gray-300 rounded px-2 py-1">
                <option>Owner</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </div>
          </div>
          <button className="mt-3 text-sm text-accent-600 hover:text-accent-700">
            + Invite team member
          </button>
        </div>
      )}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">Security Notice</h4>
        <p className="text-sm text-yellow-700">
          These settings affect the security of your workflows. Changes may impact access control and data protection.
        </p>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Access Control</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-accent-600 focus:ring-accent-500" defaultChecked />
            <span className="ml-2 text-sm text-gray-700">Require authentication for webhook access</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-accent-600 focus:ring-accent-500" defaultChecked />
            <span className="ml-2 text-sm text-gray-700">Enable IP whitelist for API access</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-accent-600 focus:ring-accent-500" />
            <span className="ml-2 text-sm text-gray-700">Require two-factor authentication</span>
          </label>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Data Protection</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-accent-600 focus:ring-accent-500" defaultChecked />
            <span className="ml-2 text-sm text-gray-700">Encrypt sensitive data at rest</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-accent-600 focus:ring-accent-500" defaultChecked />
            <span className="ml-2 text-sm text-gray-700">Enable audit logging</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-accent-600 focus:ring-accent-500" />
            <span className="ml-2 text-sm text-gray-700">Auto-delete logs after 90 days</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Retention (days)
        </label>
        <input
          type="number"
          value={projectSettings.retentionDays}
          onChange={(e) => setProjectSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          min="1"
          max="365"
        />
        <p className="text-xs text-gray-500 mt-1">
          How long to keep execution logs and data
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Executions per Month
        </label>
        <input
          type="number"
          value={projectSettings.maxExecutions}
          onChange={(e) => setProjectSettings(prev => ({ ...prev, maxExecutions: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          min="100"
          max="1000000"
        />
        <p className="text-xs text-gray-500 mt-1">
          Limit to prevent unexpected costs
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Current Usage</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Executions this month</span>
            <span className="font-medium">1,247 / {projectSettings.maxExecutions.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-accent-600 h-2 rounded-full" style={{ width: '12.47%' }}></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Storage used</span>
            <span className="font-medium">2.3 GB / 10 GB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-success-600 h-2 rounded-full" style={{ width: '23%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'collaboration':
        return renderCollaborationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'performance':
        return renderPerformanceSettings();
      default:
        return renderGeneralSettings();
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex overflow-hidden"
      >
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Project Settings</h2>
          </div>
          
          <nav className="space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-accent-100 text-accent-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{section.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{section.title}</div>
                  <div className="text-xs opacity-75">{section.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {settingsSections.find(s => s.id === activeSection)?.title}
              </h3>
              <p className="text-sm text-gray-600">
                {settingsSections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderSectionContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectSettings;