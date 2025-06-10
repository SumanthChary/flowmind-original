import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, RotateCcw, Settings, Bell, Clock, Shield, Zap } from 'lucide-react';
import { Workflow, useWorkflowStore } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface WorkflowSettingsPanelProps {
  workflow: Workflow;
  onClose: () => void;
}

const WorkflowSettingsPanel = ({ workflow, onClose }: WorkflowSettingsPanelProps) => {
  const { updateSettings, resetSettings } = useWorkflowStore();
  const [settings, setSettings] = useState(workflow.settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(workflow.id, settings);
    setHasChanges(false);
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      resetSettings(workflow.id);
      setSettings(workflow.settings);
      setHasChanges(false);
      toast.success('Settings reset to default');
    }
  };

  return (
    <motion.div 
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="w-80 bg-white border-l border-gray-200 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Settings size={20} className="mr-2" />
            Workflow Settings
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          Configure workflow behavior and execution settings
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* General Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <Zap size={16} className="mr-2" />
            General
          </h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Auto-save</span>
                <p className="text-xs text-gray-500">Automatically save changes</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Enable logging</span>
                <p className="text-xs text-gray-500">Log workflow execution details</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableLogging}
                onChange={(e) => handleSettingChange('enableLogging', e.target.checked)}
                className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
              />
            </label>
          </div>
        </div>

        {/* Execution Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <Clock size={16} className="mr-2" />
            Execution
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Execution timeout (seconds)
              </label>
              <input
                type="number"
                value={settings.executionTimeout / 1000}
                onChange={(e) => handleSettingChange('executionTimeout', parseInt(e.target.value) * 1000)}
                min="10"
                max="3600"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum time to wait for workflow completion
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retry attempts
              </label>
              <input
                type="number"
                value={settings.retryAttempts}
                onChange={(e) => handleSettingChange('retryAttempts', parseInt(e.target.value))}
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of times to retry failed nodes
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <Bell size={16} className="mr-2" />
            Notifications
          </h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Notify on success</span>
                <p className="text-xs text-gray-500">Get notified when workflow succeeds</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyOnSuccess}
                onChange={(e) => handleSettingChange('notifyOnSuccess', e.target.checked)}
                className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Notify on error</span>
                <p className="text-xs text-gray-500">Get notified when workflow fails</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyOnError}
                onChange={(e) => handleSettingChange('notifyOnError', e.target.checked)}
                className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <Shield size={16} className="mr-2" />
            Security
          </h4>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">Workflow ID</div>
              <div className="text-xs text-gray-500 font-mono">{workflow.id}</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">Created</div>
              <div className="text-xs text-gray-500">
                {new Date(workflow.createdAt).toLocaleString()}
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">Last Modified</div>
              <div className="text-xs text-gray-500">
                {new Date(workflow.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Advanced</h4>
          <div className="space-y-4">
            <div className="p-4 border border-warning-200 bg-warning-50 rounded-lg">
              <div className="text-sm font-medium text-warning-800 mb-2">
                Danger Zone
              </div>
              <p className="text-xs text-warning-700 mb-3">
                These actions cannot be undone. Please proceed with caution.
              </p>
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center px-3 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors text-sm"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="w-full flex items-center justify-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} className="mr-2" />
          Save Settings
        </button>
      </div>
    </motion.div>
  );
};

export default WorkflowSettingsPanel;