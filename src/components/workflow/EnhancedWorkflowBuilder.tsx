import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
  NodeTypes,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Save, 
  Plus,
  Mail,
  Calendar,
  FileText,
  Database,
  Webhook,
  Filter,
  Timer,
  MessageSquare,
  Code,
  Bot,
  Eye,
  EyeOff,
  Menu,
  X,
  Zap,
  Globe,
  Sparkles,
  Brain,
  Settings,
  BarChart,
  Pause,
  Square,
  RotateCcw,
  RotateCw,
  Trash2,
  Power,
  PowerOff,
  Copy,
  Edit,
  Download,
  Upload,
  Share,
  Layers,
  GitBranch,
  TestTube,
  Shield,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import DelayNode from './nodes/DelayNode';
import AINode from './nodes/AINode';
import NodeInspector from './NodeInspector';
import CodeEditor from './CodeEditor';
import TestingSuite from './TestingSuite';
import AnalyticsDashboard from './AnalyticsDashboard';
import IntegrationsPanel from './IntegrationsPanel';
import SecurityPanel from './SecurityPanel';
import CollaborationPanel from './CollaborationPanel';

import { useWorkflowStore } from '../../store/workflowStore';
import AgentBuilder from './AgentBuilder';

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
  ai: AINode,
};

const nodeTemplates = [
  // Triggers
  {
    id: 'email-trigger',
    type: 'trigger',
    label: 'Email Trigger',
    icon: 'Mail',
    description: 'Trigger when email is received',
    category: 'Triggers',
    config: { triggerType: 'email', emailFilter: '' }
  },
  {
    id: 'webhook-trigger',
    type: 'trigger',
    label: 'Webhook',
    icon: 'Webhook',
    description: 'Trigger via HTTP webhook',
    category: 'Triggers',
    config: { triggerType: 'webhook', webhookUrl: '' }
  },
  {
    id: 'schedule-trigger',
    type: 'trigger',
    label: 'Schedule',
    icon: 'Timer',
    description: 'Trigger on schedule',
    category: 'Triggers',
    config: { triggerType: 'schedule', schedule: '0 9 * * *' }
  },
  {
    id: 'manual-trigger',
    type: 'trigger',
    label: 'Manual Trigger',
    icon: 'Zap',
    description: 'Trigger manually',
    category: 'Triggers',
    config: { triggerType: 'manual' }
  },
  
  // Actions
  {
    id: 'send-email-action',
    type: 'action',
    label: 'Send Email',
    icon: 'Mail',
    description: 'Send an email message',
    category: 'Actions',
    config: { 
      actionType: 'email', 
      emailTo: 'enjoywithpandu@gmail.com',
      emailSubject: 'FlowMind Notification',
      emailMessage: 'Your workflow has completed successfully!'
    }
  },
  {
    id: 'calendar-action',
    type: 'action',
    label: 'Create Calendar Event',
    icon: 'Calendar',
    description: 'Create a calendar event',
    category: 'Actions',
    config: { actionType: 'calendar', title: '', date: '', time: '' }
  },
  {
    id: 'slack-action',
    type: 'action',
    label: 'Send Slack Message',
    icon: 'MessageSquare',
    description: 'Send message to Slack',
    category: 'Actions',
    config: { actionType: 'slack', channel: '#general', message: '' }
  },
  {
    id: 'database-action',
    type: 'action',
    label: 'Update Database',
    icon: 'Database',
    description: 'Update database record',
    category: 'Actions',
    config: { actionType: 'database', table: '', operation: 'insert' }
  },
  {
    id: 'api-action',
    type: 'action',
    label: 'API Call',
    icon: 'Globe',
    description: 'Make HTTP API request',
    category: 'Actions',
    config: { actionType: 'api', url: '', method: 'POST' }
  },
  
  // AI Nodes
  {
    id: 'ai-analysis',
    type: 'ai',
    label: 'AI Analysis',
    icon: 'Brain',
    description: 'AI text analysis and processing',
    category: 'AI',
    config: { 
      aiType: 'text_analysis',
      model: 'gemini-pro',
      prompt: 'Analyze the input data and provide insights'
    }
  },
  {
    id: 'ai-sentiment',
    type: 'ai',
    label: 'Sentiment Analysis',
    icon: 'Brain',
    description: 'Analyze sentiment of text',
    category: 'AI',
    config: { 
      aiType: 'sentiment_analysis',
      model: 'gemini-pro',
      prompt: 'Analyze the sentiment of the following text'
    }
  },
  {
    id: 'ai-extraction',
    type: 'ai',
    label: 'Data Extraction',
    icon: 'Brain',
    description: 'Extract data using AI',
    category: 'AI',
    config: { 
      aiType: 'data_extraction',
      model: 'gemini-pro',
      prompt: 'Extract key information from the input'
    }
  },
  
  // Logic
  {
    id: 'if-condition',
    type: 'condition',
    label: 'If/Then',
    icon: 'Filter',
    description: 'Conditional logic',
    category: 'Logic',
    config: { conditionType: 'equals', field: 'status', value: 'active' }
  },
  {
    id: 'delay-timer',
    type: 'delay',
    label: 'Delay',
    icon: 'Timer',
    description: 'Wait for specified time',
    category: 'Logic',
    config: { duration: 1, unit: 'minutes' }
  }
];

// Icon mapping for template display
const iconMap: Record<string, React.ReactNode> = {
  Mail: <Mail size={20} />,
  Webhook: <Webhook size={20} />,
  Timer: <Timer size={20} />,
  Calendar: <Calendar size={20} />,
  MessageSquare: <MessageSquare size={20} />,
  Database: <Database size={20} />,
  Globe: <Globe size={20} />,
  Brain: <Brain size={20} />,
  Filter: <Filter size={20} />,
  Zap: <Zap size={20} />,
  Code: <Code size={20} />,
  FileText: <FileText size={20} />,
  GitBranch: <GitBranch size={20} />,
  Layers: <Layers size={20} />,
};

interface EnhancedWorkflowBuilderProps {
  workflowId?: string;
  onSave?: (workflow: any) => void;
}

const EnhancedWorkflowBuilderContent = ({ workflowId, onSave }: EnhancedWorkflowBuilderProps) => {
  const { 
    currentWorkflow,
    isExecuting,
    executionProgress,
    executeWorkflow,
    pauseExecution,
    stopExecution,
    undo,
    redo,
    canUndo,
    canRedo,
    saveWorkflow,
    selectedNodeId,
    setSelectedNode,
    addNode,
    updateNode,
    deleteNode
  } = useWorkflowStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [draggedTemplate, setDraggedTemplate] = useState<typeof nodeTemplates[0] | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAgentBuilder, setShowAgentBuilder] = useState(false);
  const [showNodeInspector, setShowNodeInspector] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showTestingSuite, setShowTestingSuite] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, nodeId: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync with workflow store
  useEffect(() => {
    if (currentWorkflow) {
      setNodes(currentWorkflow.nodes || []);
      setEdges(currentWorkflow.edges || []);
    }
  }, [currentWorkflow, setNodes, setEdges]);

  // Get selected node for inspector
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'smoothstep',
        animated: true,
        data: { status: 'idle' }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      
      // Update workflow store
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          edges: [...edges, newEdge]
        };
        saveWorkflow(updatedWorkflow);
      }
    },
    [edges, setEdges, currentWorkflow, saveWorkflow]
  );

  const onInit = (instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setSelectedNode(node.id);
    setShowNodeInspector(true);
    setContextMenu(null);
  }, [setSelectedNode]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id
    });
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setShowNodeInspector(false);
    setContextMenu(null);
  }, [setSelectedNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current || !draggedTemplate) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${draggedTemplate.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: draggedTemplate.type,
        position,
        data: {
          label: draggedTemplate.label,
          icon: draggedTemplate.icon,
          type: draggedTemplate.type,
          config: { ...draggedTemplate.config },
          active: true,
          status: 'idle' as const,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      addNode(newNode);
      setDraggedTemplate(null);
      
      // Auto-save
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          nodes: [...nodes, newNode]
        };
        saveWorkflow(updatedWorkflow);
      }
      
      toast.success(`${draggedTemplate.label} added to canvas`);
    },
    [reactFlowInstance, draggedTemplate, nodes, setNodes, addNode, currentWorkflow, saveWorkflow]
  );

  const onDragStart = (event: React.DragEvent, template: typeof nodeTemplates[0]) => {
    event.dataTransfer.effectAllowed = 'move';
    setDraggedTemplate(template);
  };

  const handleSave = useCallback(() => {
    if (!reactFlowInstance || !currentWorkflow) return;
    
    setIsLoading(true);
    
    try {
      const flow = reactFlowInstance.toObject();
      const updatedWorkflow = {
        ...currentWorkflow,
        nodes: flow.nodes,
        edges: flow.edges,
        viewport: flow.viewport,
        updatedAt: new Date().toISOString()
      };
      
      saveWorkflow(updatedWorkflow);
      onSave?.(updatedWorkflow);
      toast.success('Workflow saved successfully!');
    } catch (error) {
      toast.error('Failed to save workflow');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [reactFlowInstance, currentWorkflow, saveWorkflow, onSave]);

  const handleRun = useCallback(async () => {
    if (!currentWorkflow) return;
    
    try {
      await executeWorkflow(currentWorkflow.id);
    } catch (error) {
      console.error('Execution error:', error);
    }
  }, [currentWorkflow, executeWorkflow]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && confirm(`Delete "${node.data.label}"?`)) {
      setNodes((nds) => nds.filter(n => n.id !== nodeId));
      setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
      deleteNode(nodeId);
      setContextMenu(null);
      
      // Auto-save
      if (currentWorkflow) {
        const updatedNodes = nodes.filter(n => n.id !== nodeId);
        const updatedEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
        const updatedWorkflow = {
          ...currentWorkflow,
          nodes: updatedNodes,
          edges: updatedEdges
        };
        saveWorkflow(updatedWorkflow);
      }
      
      toast.success('Node deleted');
    }
  }, [nodes, edges, setNodes, setEdges, deleteNode, currentWorkflow, saveWorkflow]);

  const handleToggleNodeActive = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const updatedNode = {
        ...node,
        data: { ...node.data, active: !node.data.active }
      };
      
      setNodes((nds) => nds.map(n => n.id === nodeId ? updatedNode : n));
      updateNode(nodeId, { active: !node.data.active });
      setContextMenu(null);
      
      // Auto-save
      if (currentWorkflow) {
        const updatedNodes = nodes.map(n => n.id === nodeId ? updatedNode : n);
        const updatedWorkflow = {
          ...currentWorkflow,
          nodes: updatedNodes
        };
        saveWorkflow(updatedWorkflow);
      }
      
      toast.success(node.data.active ? 'Node deactivated' : 'Node activated');
    }
  }, [nodes, setNodes, updateNode, currentWorkflow, saveWorkflow]);

  const handleDuplicateNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const newNode = {
        ...node,
        id: `${node.id}-copy-${Date.now()}`,
        position: { x: node.position.x + 50, y: node.position.y + 50 }
      };
      
      setNodes((nds) => [...nds, newNode]);
      addNode(newNode);
      setContextMenu(null);
      
      // Auto-save
      if (currentWorkflow) {
        const updatedWorkflow = {
          ...currentWorkflow,
          nodes: [...nodes, newNode]
        };
        saveWorkflow(updatedWorkflow);
      }
      
      toast.success('Node duplicated');
    }
  }, [nodes, setNodes, addNode, currentWorkflow, saveWorkflow]);

  const handleExportWorkflow = useCallback(() => {
    if (!currentWorkflow) return;
    
    const exportData = {
      workflow: currentWorkflow,
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentWorkflow.name.replace(/\s+/g, '-').toLowerCase()}-workflow.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Workflow exported successfully!');
  }, [currentWorkflow, nodes, edges]);

  const groupedTemplates = nodeTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof nodeTemplates>);

  if (showAgentBuilder) {
    return (
      <div className="h-full">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Agent Builder</h2>
          <button
            onClick={() => setShowAgentBuilder(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>
        <AgentBuilder />
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div 
            initial={{ x: isMobile ? -320 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -320 : 0, opacity: isMobile ? 0 : 1 }}
            className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} w-80 bg-white border-r border-gray-200 flex flex-col`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">FlowMind Builder</h2>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Drag and drop nodes to build your automation workflow</p>
            </div>

            {/* Actions */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={handleRun}
                  disabled={isExecuting || !nodes.length}
                  className="flex items-center justify-center px-3 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {isExecuting ? <Pause size={16} className="mr-1" /> : <Play size={16} className="mr-1" />}
                  {isExecuting ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center justify-center px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  ) : (
                    <Save size={16} className="mr-1" />
                  )}
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
              
              {isExecuting ? (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={pauseExecution}
                    className="flex items-center justify-center px-2 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors text-sm"
                  >
                    <Pause size={16} />
                  </button>
                  <button
                    onClick={stopExecution}
                    className="flex items-center justify-center px-2 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors text-sm"
                  >
                    <Square size={16} />
                  </button>
                  <div className="flex items-center justify-center px-2 py-2 bg-gray-100 rounded-lg text-sm">
                    {Math.round(executionProgress)}%
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={undo}
                    disabled={!canUndo()}
                    className="flex items-center justify-center px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                    title="Undo"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={redo}
                    disabled={!canRedo()}
                    className="flex items-center justify-center px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                    title="Redo"
                  >
                    <RotateCw size={16} />
                  </button>
                  <button
                    onClick={() => setShowAgentBuilder(true)}
                    className="flex items-center justify-center px-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    title="AI Agent Builder"
                  >
                    <Bot size={16} />
                  </button>
                  <button
                    onClick={handleExportWorkflow}
                    className="flex items-center justify-center px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    title="Export Workflow"
                  >
                    <Download size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Feature Buttons */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Advanced Features
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowCodeEditor(true)}
                  className="flex items-center justify-center px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
                  title="Code Editor"
                >
                  <Code size={14} className="mr-1" />
                  Code
                </button>
                <button
                  onClick={() => setShowTestingSuite(true)}
                  className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  title="Testing Suite"
                >
                  <TestTube size={14} className="mr-1" />
                  Test
                </button>
                <button
                  onClick={() => setShowAnalytics(true)}
                  className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  title="Analytics"
                >
                  <BarChart size={14} className="mr-1" />
                  Analytics
                </button>
                <button
                  onClick={() => setShowIntegrations(true)}
                  className="flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  title="Integrations"
                >
                  <Globe size={14} className="mr-1" />
                  500+
                </button>
                <button
                  onClick={() => setShowSecurity(true)}
                  className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  title="Security"
                >
                  <Shield size={14} className="mr-1" />
                  Security
                </button>
                <button
                  onClick={() => setShowCollaboration(true)}
                  className="flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  title="Collaboration"
                >
                  <Users size={14} className="mr-1" />
                  Team
                </button>
              </div>
            </div>

            {/* Node Templates */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {Object.entries(groupedTemplates).map(([category, templates]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {templates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        className="p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-accent-300 hover:shadow-sm transition-all"
                        draggable
                        onDragStart={(e) => onDragStart(e, template)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="text-accent-600 mr-2">
                            {iconMap[template.icon] || <Bot size={20} />}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            {template.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{template.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isMobile ? <Menu size={18} /> : <Eye size={18} />}
                </button>
              )}
              <span className="text-sm text-gray-600">
                {nodes.length} nodes, {edges.length} connections
              </span>
              {isExecuting && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-success-600">Executing... {Math.round(executionProgress)}%</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAgentBuilder(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center"
              >
                <Bot size={16} className="mr-2" />
                AI Agent
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm disabled:opacity-50"
              >
                <Save size={16} className="mr-2" />
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* ReactFlow Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onNodeContextMenu={onNodeContextMenu}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
            deleteKeyCode={['Backspace', 'Delete']}
            multiSelectionKeyCode={['Meta', 'Ctrl']}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1} 
              color="#e5e7eb"
            />
            <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm" />
            <MiniMap 
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
              nodeColor="#8b5cf6"
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              setSelectedNode(contextMenu.nodeId);
              setShowNodeInspector(true);
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit size={16} className="mr-2" />
            Edit Node
          </button>
          <button
            onClick={() => handleDuplicateNode(contextMenu.nodeId)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy size={16} className="mr-2" />
            Duplicate
          </button>
          <button
            onClick={() => handleToggleNodeActive(contextMenu.nodeId)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {nodes.find(n => n.id === contextMenu.nodeId)?.data.active ? (
              <>
                <PowerOff size={16} className="mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Power size={16} className="mr-2" />
                Activate
              </>
            )}
          </button>
          <hr className="my-1" />
          <button
            onClick={() => handleDeleteNode(contextMenu.nodeId)}
            className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      )}

      {/* Feature Panels */}
      <NodeInspector
        node={selectedNode}
        isOpen={showNodeInspector}
        onClose={() => {
          setShowNodeInspector(false);
          setSelectedNode(null);
        }}
        onUpdate={(nodeId, updates) => {
          const updatedNode = nodes.find(n => n.id === nodeId);
          if (updatedNode) {
            const newNode = {
              ...updatedNode,
              data: { ...updatedNode.data, ...updates }
            };
            setNodes((nds) => nds.map(n => n.id === nodeId ? newNode : n));
            updateNode(nodeId, updates);
            
            // Auto-save
            if (currentWorkflow) {
              const updatedNodes = nodes.map(n => n.id === nodeId ? newNode : n);
              const updatedWorkflow = {
                ...currentWorkflow,
                nodes: updatedNodes
              };
              saveWorkflow(updatedWorkflow);
            }
          }
        }}
      />

      <CodeEditor
        isOpen={showCodeEditor}
        onClose={() => setShowCodeEditor(false)}
        onSave={(code) => {
          console.log('Code saved:', code);
          toast.success('Custom function saved!');
        }}
      />

      <TestingSuite
        isOpen={showTestingSuite}
        onClose={() => setShowTestingSuite(false)}
      />

      <AnalyticsDashboard
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      <IntegrationsPanel
        isOpen={showIntegrations}
        onClose={() => setShowIntegrations(false)}
      />

      <SecurityPanel
        isOpen={showSecurity}
        onClose={() => setShowSecurity(false)}
      />

      <CollaborationPanel
        isOpen={showCollaboration}
        onClose={() => setShowCollaboration(false)}
      />
    </div>
  );
};

const EnhancedWorkflowBuilder = (props: EnhancedWorkflowBuilderProps) => {
  return (
    <ReactFlowProvider>
      <EnhancedWorkflowBuilderContent {...props} />
    </ReactFlowProvider>
  );
};

export default EnhancedWorkflowBuilder;