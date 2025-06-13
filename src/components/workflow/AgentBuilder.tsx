import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Plus, 
  Settings, 
  Play, 
  Save, 
  Brain, 
  Zap, 
  Target,
  MessageSquare,
  Database,
  Globe,
  Code,
  Mail,
  Calendar,
  FileText,
  Webhook,
  Filter,
  Timer,
  Users,
  BarChart,
  Shield,
  Sparkles
} from 'lucide-react';
import { useWorkflowStore, WorkflowNode } from '../../store/workflowStore';
import toast from 'react-hot-toast';

const AgentBuilder: React.FC = () => {
  const { createWorkflow, addNode, addEdge, executeWorkflow } = useWorkflowStore();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');

  const agentTemplates = [
    {
      id: 'customer-support',
      name: 'Customer Support Agent',
      description: 'Handles customer inquiries, tickets, and support requests automatically',
      icon: <MessageSquare size={24} className="text-blue-600" />,
      nodes: [
        { type: 'trigger', label: 'Email Received', config: { triggerType: 'email' }, icon: 'Mail' },
        { type: 'ai', label: 'Analyze Intent', config: { aiType: 'text_analysis' }, icon: 'Brain' },
        { type: 'condition', label: 'Check Priority', config: { field: 'priority', value: 'high' }, icon: 'Filter' },
        { type: 'action', label: 'Send Response', config: { actionType: 'email' }, icon: 'Mail' },
        { type: 'action', label: 'Create Ticket', config: { actionType: 'database' }, icon: 'Database' }
      ]
    },
    {
      id: 'data-processor',
      name: 'Data Processing Agent',
      description: 'Processes, transforms, and analyzes data from multiple sources',
      icon: <Database size={24} className="text-green-600" />,
      nodes: [
        { type: 'trigger', label: 'Data Webhook', config: { triggerType: 'webhook' }, icon: 'Webhook' },
        { type: 'data', label: 'Clean Data', config: { transformType: 'filter' }, icon: 'Filter' },
        { type: 'ai', label: 'Extract Insights', config: { aiType: 'data_extraction' }, icon: 'Brain' },
        { type: 'action', label: 'Store Results', config: { actionType: 'database' }, icon: 'Database' },
        { type: 'action', label: 'Send Report', config: { actionType: 'email' }, icon: 'Mail' }
      ]
    },
    {
      id: 'content-creator',
      name: 'Content Creation Agent',
      description: 'Generates, reviews, and publishes content across platforms',
      icon: <FileText size={24} className="text-purple-600" />,
      nodes: [
        { type: 'trigger', label: 'Schedule Trigger', config: { triggerType: 'schedule' }, icon: 'Timer' },
        { type: 'ai', label: 'Generate Content', config: { aiType: 'content_generation' }, icon: 'Brain' },
        { type: 'ai', label: 'Review Quality', config: { aiType: 'text_analysis' }, icon: 'Brain' },
        { type: 'condition', label: 'Quality Check', config: { field: 'quality_score', value: '80' }, icon: 'Filter' },
        { type: 'action', label: 'Publish Content', config: { actionType: 'api' }, icon: 'Globe' }
      ]
    },
    {
      id: 'sales-assistant',
      name: 'Sales Assistant Agent',
      description: 'Manages leads, follows up with prospects, and tracks sales pipeline',
      icon: <Target size={24} className="text-orange-600" />,
      nodes: [
        { type: 'trigger', label: 'New Lead', config: { triggerType: 'webhook' }, icon: 'Webhook' },
        { type: 'ai', label: 'Score Lead', config: { aiType: 'data_extraction' }, icon: 'Brain' },
        { type: 'condition', label: 'High Value Lead', config: { field: 'score', value: '75' }, icon: 'Filter' },
        { type: 'action', label: 'Assign to Sales', config: { actionType: 'slack' }, icon: 'MessageSquare' },
        { type: 'delay', label: 'Wait 2 Days', config: { duration: 2, unit: 'days' }, icon: 'Timer' },
        { type: 'action', label: 'Follow Up Email', config: { actionType: 'email' }, icon: 'Mail' }
      ]
    },
    {
      id: 'monitoring-agent',
      name: 'System Monitoring Agent',
      description: 'Monitors systems, detects issues, and alerts the team',
      icon: <Shield size={24} className="text-red-600" />,
      nodes: [
        { type: 'trigger', label: 'Health Check', config: { triggerType: 'schedule' }, icon: 'Timer' },
        { type: 'webhook', label: 'Check APIs', config: { method: 'GET' }, icon: 'Webhook' },
        { type: 'condition', label: 'System Healthy', config: { field: 'status_code', value: '200' }, icon: 'Filter' },
        { type: 'action', label: 'Alert Team', config: { actionType: 'slack' }, icon: 'MessageSquare' },
        { type: 'action', label: 'Create Incident', config: { actionType: 'database' }, icon: 'Database' }
      ]
    },
    {
      id: 'custom-agent',
      name: 'Custom Agent',
      description: 'Build your own agent from scratch with custom logic',
      icon: <Bot size={24} className="text-gray-600" />,
      nodes: []
    }
  ];

  const buildAgent = async () => {
    if (!agentName.trim()) {
      toast.error('Please enter an agent name');
      return;
    }

    const template = agentTemplates.find(t => t.id === selectedTemplate);
    if (!template) {
      toast.error('Please select an agent template');
      return;
    }

    try {
      // Create new workflow
      const workflow = createWorkflow(agentName, agentDescription || template.description);
      
      if (template.nodes.length > 0) {
        // Add nodes with proper positioning
        const nodes: WorkflowNode[] = template.nodes.map((nodeTemplate, index) => ({
          id: `${nodeTemplate.type}-${Date.now()}-${index}`,
          type: nodeTemplate.type as any,
          position: { 
            x: 100 + (index % 3) * 250, 
            y: 100 + Math.floor(index / 3) * 150 
          },
          data: {
            label: nodeTemplate.label,
            type: nodeTemplate.type,
            icon: nodeTemplate.icon, // Store as string identifier
            config: nodeTemplate.config,
            active: true,
            status: 'idle' as const
          }
        }));

        // Add nodes to workflow
        nodes.forEach(node => addNode(node));

        // Connect nodes in sequence
        for (let i = 0; i < nodes.length - 1; i++) {
          const sourceNode = nodes[i];
          const targetNode = nodes[i + 1];
          
          // Special handling for condition nodes
          let sourceHandle = undefined;
          if (sourceNode.type === 'condition') {
            sourceHandle = 'true'; // Connect to true path by default
          }

          addEdge({
            id: `edge-${i}`,
            source: sourceNode.id,
            target: targetNode.id,
            sourceHandle,
            type: 'smoothstep',
            animated: true,
            data: { status: 'idle' }
          });
        }

        toast.success(`${template.name} created successfully!`);
      } else {
        toast.success('Custom agent workspace created!');
      }

    } catch (error) {
      toast.error('Failed to create agent');
      console.error('Agent creation error:', error);
    }
  };

  const runAgentDemo = async () => {
    const template = agentTemplates.find(t => t.id === selectedTemplate);
    if (!template || !agentName.trim()) {
      toast.error('Please create an agent first');
      return;
    }

    try {
      // Create a demo workflow and execute it
      const workflow = createWorkflow(`${agentName} Demo`, 'Demo execution');
      
      // Add a simple demo flow
      const triggerNode: WorkflowNode = {
        id: 'demo-trigger',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: {
          label: 'Demo Trigger',
          type: 'trigger',
          icon: 'Zap', // Store as string identifier
          config: { triggerType: 'manual' },
          active: true,
          status: 'idle'
        }
      };

      const aiNode: WorkflowNode = {
        id: 'demo-ai',
        type: 'ai',
        position: { x: 350, y: 100 },
        data: {
          label: 'AI Processing',
          type: 'ai',
          icon: 'Brain', // Store as string identifier
          config: { aiType: 'text_analysis' },
          active: true,
          status: 'idle'
        }
      };

      const actionNode: WorkflowNode = {
        id: 'demo-action',
        type: 'action',
        position: { x: 600, y: 100 },
        data: {
          label: 'Complete Task',
          type: 'action',
          icon: 'Mail', // Store as string identifier
          config: { actionType: 'email' },
          active: true,
          status: 'idle'
        }
      };

      addNode(triggerNode);
      addNode(aiNode);
      addNode(actionNode);

      addEdge({
        id: 'demo-edge-1',
        source: 'demo-trigger',
        target: 'demo-ai',
        type: 'smoothstep',
        animated: true,
        data: { status: 'idle' }
      });

      addEdge({
        id: 'demo-edge-2',
        source: 'demo-ai',
        target: 'demo-action',
        type: 'smoothstep',
        animated: true,
        data: { status: 'idle' }
      });

      // Execute the demo
      await executeWorkflow(workflow.id);
      
      toast.success('Agent demo completed! Check the execution logs.');
    } catch (error) {
      toast.error('Demo execution failed');
      console.error('Demo error:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Bot size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agent Builder</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create intelligent agents that can handle complex tasks automatically. Choose from pre-built templates or build your own custom agent.
        </p>
      </motion.div>

      {/* Agent Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-soft p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Agent Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name
            </label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="My AI Assistant"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
              placeholder="Describe what your agent does"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Agent Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Choose Agent Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentTemplates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex items-center mb-3">
                {template.icon}
                <h3 className="text-lg font-semibold ml-3">{template.name}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {template.nodes.length} nodes
                </span>
                {selectedTemplate === template.id && (
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={buildAgent}
          disabled={!selectedTemplate || !agentName.trim()}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} className="mr-2" />
          Build Agent
        </button>
        
        <button
          onClick={runAgentDemo}
          className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Play size={20} className="mr-2" />
          Run Demo
        </button>
      </motion.div>

      {/* Agent Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-8">Agent Capabilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Brain size={32} className="text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">AI Processing</h3>
            <p className="text-sm text-gray-600">Natural language understanding</p>
          </div>
          <div className="text-center">
            <Zap size={32} className="text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Real-time Actions</h3>
            <p className="text-sm text-gray-600">Instant response and execution</p>
          </div>
          <div className="text-center">
            <Globe size={32} className="text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">API Integration</h3>
            <p className="text-sm text-gray-600">Connect to any service</p>
          </div>
          <div className="text-center">
            <BarChart size={32} className="text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm text-gray-600">Performance tracking</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AgentBuilder;