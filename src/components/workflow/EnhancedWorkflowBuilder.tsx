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
  RotateCw
} from 'lucide-react';
import toast from 'react-hot-toast';

import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import DelayNode from './nodes/DelayNode';

import { useWorkflowStore } from '../../store/workflowStore';
import AgentBuilder from './AgentBuilder';

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

const nodeTemplates = [
  {
    id: 'email-trigger',
    type: 'trigger',
    label: 'Email Trigger',
    icon: <Mail size={20} />,
    description: 'Trigger when email is received',
    category: 'Triggers'
  },
  {
    id: 'webhook-trigger',
    type: 'trigger',
    label: 'Webhook',
    icon: <Webhook size={20} />,
    description: 'Trigger via HTTP webhook',
    category: 'Triggers'
  },
  {
    id: 'schedule-trigger',
    type: 'trigger',
    label: 'Schedule',
    icon: <Timer size={20} />,
    description: 'Trigger on schedule',
    category: 'Triggers'
  },
  {
    id: 'send-email-action',
    type: 'action',
    label: 'Send Email',
    icon: <Mail size={20} />,
    description: 'Send an email message',
    category: 'Actions'
  },
  {
    id: 'calendar-action',
    type: 'action',
    label: 'Create Calendar Event',
    icon: <Calendar size={20} />,
    description: 'Create a calendar event',
    category: 'Actions'
  },
  {
    id: 'slack-action',
    type: 'action',
    label: 'Send Slack Message',
    icon: <MessageSquare size={20} />,
    description: 'Send message to Slack',
    category: 'Actions'
  },
  {
    id: 'database-action',
    type: 'action',
    label: 'Update Database',
    icon: <Database size={20} />,
    description: 'Update database record',
    category: 'Actions'
  },
  {
    id: 'api-action',
    type: 'action',
    label: 'API Call',
    icon: <Globe size={20} />,
    description: 'Make HTTP API request',
    category: 'Actions'
  },
  {
    id: 'ai-action',
    type: 'ai',
    label: 'AI Processing',
    icon: <Brain size={20} />,
    description: 'AI analysis and processing',
    category: 'AI'
  },
  {
    id: 'if-condition',
    type: 'condition',
    label: 'If/Then',
    icon: <Filter size={20} />,
    description: 'Conditional logic',
    category: 'Logic'
  },
  {
    id: 'delay-timer',
    type: 'delay',
    label: 'Delay',
    icon: <Timer size={20} />,
    description: 'Wait for specified time',
    category: 'Logic'
  }
];

interface EnhancedWorkflowBuilderProps {
  workflowId?: string;
  onSave?: (workflow: any) => void;
}

const EnhancedWorkflowBuilderContent = ({ workflowId, onSave }: EnhancedWorkflowBuilderProps) => {
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    addNode, 
    addEdge: addWorkflowEdge,
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
    saveWorkflow
  } = useWorkflowStore();
  
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [draggedTemplate, setDraggedTemplate] = useState<typeof nodeTemplates[0] | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAgentBuilder, setShowAgentBuilder] = useState(false);
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

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'smoothstep',
        animated: true,
        data: { status: 'idle' }
      };
      setEdges(addEdge(newEdge, edges));
      addWorkflowEdge(newEdge);
    },
    [edges, setEdges, addWorkflowEdge]
  );

  const onInit = (instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  };

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
        id: `${draggedTemplate.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: draggedTemplate.type,
        position,
        data: {
          label: draggedTemplate.label,
          icon: draggedTemplate.icon,
          type: draggedTemplate.type,
          config: {},
          active: true,
          status: 'idle',
        },
      };

      setNodes([...nodes, newNode]);
      addNode(newNode);
      setDraggedTemplate(null);
      toast.success(`${draggedTemplate.label} added`);
    },
    [reactFlowInstance, draggedTemplate, nodes, setNodes, addNode]
  );

  const onDragStart = (event: React.DragEvent, template: typeof nodeTemplates[0]) => {
    event.dataTransfer.effectAllowed = 'move';
    setDraggedTemplate(template);
  };

  const handleSave = () => {
    if (!reactFlowInstance || !currentWorkflow) return;
    
    const flow = reactFlowInstance.toObject();
    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: flow.nodes,
      edges: flow.edges,
      viewport: flow.viewport,
    };
    
    saveWorkflow(updatedWorkflow);
    onSave?.(updatedWorkflow);
    toast.success('Workflow saved!');
  };

  const handleRun = async () => {
    if (!currentWorkflow) return;
    await executeWorkflow(currentWorkflow.id);
  };

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
              <p className="text-sm text-gray-600 mb-4">Drag and drop to build your automation</p>
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
                  className="flex items-center justify-center px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
                >
                  <Save size={16} className="mr-1" />
                  Save
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
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={undo}
                    disabled={!canUndo()}
                    className="flex items-center justify-center px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={redo}
                    disabled={!canRedo()}
                    className="flex items-center justify-center px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    <RotateCw size={16} />
                  </button>
                  <button
                    onClick={() => setShowAgentBuilder(true)}
                    className="flex items-center justify-center px-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <Bot size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Node Templates */}
            <div className="flex-1 overflow-y-auto p-4">
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
                            {template.icon}
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
                className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* ReactFlow Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => {
              // Handle node changes
            }}
            onEdgesChange={(changes) => {
              // Handle edge changes  
            }}
            onConnect={onConnect}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
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