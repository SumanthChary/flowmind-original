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
  Download, 
  Upload, 
  Zap, 
  Settings, 
  Plus,
  Mail,
  Calendar,
  FileText,
  Database,
  Webhook,
  Filter,
  Timer,
  MessageSquare,
  Pause,
  Square,
  RotateCcw,
  RotateCw,
  Trash2,
  Copy,
  Power,
  PowerOff,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  X,
  FolderOpen,
  FileDown,
  FileUp,
  TestTube,
  Bot,
  Code,
  Sparkles,
  Globe,
  Layers,
  GitBranch,
  Shuffle,
  Target,
  Repeat,
  Hash,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

// Custom Node Components
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import DelayNode from './nodes/DelayNode';

// Store
import { useWorkflowStore, WorkflowNode, WorkflowEdge } from '../../store/workflowStore';

// Components
import NodePropertiesPanel from './NodePropertiesPanel';
import WorkflowSettingsPanel from './WorkflowSettingsPanel';
import ExecutionLogsPanel from './ExecutionLogsPanel';
import ContextMenu from './ContextMenu';
import WorkflowTester from './WorkflowTester';
import AIAssistant from './AIAssistant';
import CodeEditor from './CodeEditor';
import ProjectSettings from './ProjectSettings';

// Node types mapping
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

// Enhanced node templates with more options and unique identifiers
const nodeTemplates = [
  // Triggers
  {
    id: 'email-trigger',
    type: 'trigger',
    label: 'Email Trigger',
    icon: <Mail size={20} />,
    description: 'Trigger when email is received',
    category: 'Triggers',
    config: { triggerType: 'email' }
  },
  {
    id: 'webhook-trigger',
    type: 'trigger',
    label: 'Webhook',
    icon: <Webhook size={20} />,
    description: 'Trigger via HTTP webhook',
    category: 'Triggers',
    config: { triggerType: 'webhook' }
  },
  {
    id: 'schedule-trigger',
    type: 'trigger',
    label: 'Schedule',
    icon: <Timer size={20} />,
    description: 'Trigger on schedule',
    category: 'Triggers',
    config: { triggerType: 'schedule' }
  },
  {
    id: 'file-trigger',
    type: 'trigger',
    label: 'File Upload',
    icon: <FileText size={20} />,
    description: 'Trigger when file is uploaded',
    category: 'Triggers',
    config: { triggerType: 'file' }
  },
  {
    id: 'form-trigger',
    type: 'trigger',
    label: 'Form Submit',
    icon: <Target size={20} />,
    description: 'Trigger when form is submitted',
    category: 'Triggers',
    config: { triggerType: 'form' }
  },
  {
    id: 'api-trigger',
    type: 'trigger',
    label: 'API Call',
    icon: <Globe size={20} />,
    description: 'Trigger via API endpoint',
    category: 'Triggers',
    config: { triggerType: 'api' }
  },

  // Actions
  {
    id: 'send-email-action',
    type: 'action',
    label: 'Send Email',
    icon: <Mail size={20} />,
    description: 'Send an email message',
    category: 'Actions',
    config: { actionType: 'email' }
  },
  {
    id: 'calendar-action',
    type: 'action',
    label: 'Create Calendar Event',
    icon: <Calendar size={20} />,
    description: 'Create a calendar event',
    category: 'Actions',
    config: { actionType: 'calendar' }
  },
  {
    id: 'document-action',
    type: 'action',
    label: 'Create Document',
    icon: <FileText size={20} />,
    description: 'Create a new document',
    category: 'Actions',
    config: { actionType: 'document' }
  },
  {
    id: 'database-action',
    type: 'action',
    label: 'Update Database',
    icon: <Database size={20} />,
    description: 'Update database record',
    category: 'Actions',
    config: { actionType: 'database' }
  },
  {
    id: 'slack-action',
    type: 'action',
    label: 'Send Slack Message',
    icon: <MessageSquare size={20} />,
    description: 'Send message to Slack',
    category: 'Actions',
    config: { actionType: 'slack' }
  },
  {
    id: 'api-action',
    type: 'action',
    label: 'Call API',
    icon: <Webhook size={20} />,
    description: 'Make HTTP API call',
    category: 'Actions',
    config: { actionType: 'api' }
  },
  {
    id: 'transform-action',
    type: 'action',
    label: 'Transform Data',
    icon: <Shuffle size={20} />,
    description: 'Transform and process data',
    category: 'Actions',
    config: { actionType: 'transform' }
  },
  {
    id: 'notification-action',
    type: 'action',
    label: 'Send Notification',
    icon: <AlertCircle size={20} />,
    description: 'Send push notification',
    category: 'Actions',
    config: { actionType: 'notification' }
  },

  // Logic & Control
  {
    id: 'if-condition',
    type: 'condition',
    label: 'If/Then',
    icon: <Filter size={20} />,
    description: 'Conditional logic',
    category: 'Logic',
    config: { conditionType: 'if' }
  },
  {
    id: 'switch-condition',
    type: 'condition',
    label: 'Switch/Case',
    icon: <GitBranch size={20} />,
    description: 'Multiple condition branches',
    category: 'Logic',
    config: { conditionType: 'switch' }
  },
  {
    id: 'loop-condition',
    type: 'condition',
    label: 'Loop',
    icon: <Repeat size={20} />,
    description: 'Repeat actions in a loop',
    category: 'Logic',
    config: { conditionType: 'loop' }
  },
  {
    id: 'merge-condition',
    type: 'condition',
    label: 'Merge',
    icon: <Layers size={20} />,
    description: 'Merge multiple data streams',
    category: 'Logic',
    config: { conditionType: 'merge' }
  },

  // Utilities
  {
    id: 'delay-timer',
    type: 'delay',
    label: 'Delay',
    icon: <Timer size={20} />,
    description: 'Wait for specified time',
    category: 'Utilities',
    config: { delayType: 'timer', duration: 5, unit: 'minutes' }
  },
  {
    id: 'wait-event',
    type: 'delay',
    label: 'Wait for Event',
    icon: <Clock size={20} />,
    description: 'Wait for external event',
    category: 'Utilities',
    config: { delayType: 'event' }
  },
  {
    id: 'code-function',
    type: 'action',
    label: 'Code Function',
    icon: <Code size={20} />,
    description: 'Execute custom JavaScript',
    category: 'Utilities',
    config: { actionType: 'code' }
  },
  {
    id: 'hash-function',
    type: 'action',
    label: 'Hash/Encrypt',
    icon: <Hash size={20} />,
    description: 'Hash or encrypt data',
    category: 'Utilities',
    config: { actionType: 'hash' }
  },

  // AI & ML
  {
    id: 'ai-text',
    type: 'action',
    label: 'AI Text Processing',
    icon: <Bot size={20} />,
    description: 'Process text with AI',
    category: 'AI & ML',
    config: { actionType: 'ai-text' }
  },
  {
    id: 'ai-image',
    type: 'action',
    label: 'AI Image Analysis',
    icon: <Eye size={20} />,
    description: 'Analyze images with AI',
    category: 'AI & ML',
    config: { actionType: 'ai-image' }
  },
  {
    id: 'ai-sentiment',
    type: 'action',
    label: 'Sentiment Analysis',
    icon: <Sparkles size={20} />,
    description: 'Analyze text sentiment',
    category: 'AI & ML',
    config: { actionType: 'ai-sentiment' }
  }
];

interface EnhancedWorkflowBuilderProps {
  workflowId?: string;
  onSave?: (workflow: any) => void;
}

const EnhancedWorkflowBuilderContent = ({ workflowId, onSave }: EnhancedWorkflowBuilderProps) => {
  const {
    currentWorkflow,
    isExecuting,
    executionProgress,
    selectedNodeId,
    onNodesChangeRF,
    onEdgesChangeRF,
    addNode,
    updateNode,
    deleteNode,
    duplicateNode,
    toggleNodeActive,
    setSelectedNode,
    addEdge: addWorkflowEdge,
    deleteEdge,
    validateConnection,
    executeWorkflow,
    pauseExecution,
    stopExecution,
    undo,
    redo,
    canUndo,
    canRedo,
    saveWorkflow,
    loadWorkflow,
    createWorkflow,
    setCurrentWorkflow,
  } = useWorkflowStore();

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [draggedTemplate, setDraggedTemplate] = useState<typeof nodeTemplates[0] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showTester, setShowTester] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId?: string;
    edgeId?: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get nodes and edges directly from the store
  const nodes = currentWorkflow?.nodes || [];
  const edges = currentWorkflow?.edges || [];

  // Filter templates based on search and category
  const filteredTemplates = nodeTemplates.filter(template => {
    const matchesSearch = template.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(nodeTemplates.map(t => t.category)))];

  const onConnect = useCallback(
    (params: Connection) => {
      if (validateConnection(params)) {
        const newEdge: WorkflowEdge = {
          ...params,
          id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'smoothstep',
          animated: true,
          data: { status: 'idle' },
        };
        addWorkflowEdge(newEdge);
        toast.success('Connection created successfully');
      } else {
        toast.error('Invalid connection');
      }
    },
    [validateConnection, addWorkflowEdge]
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

      const newNode: WorkflowNode = {
        id: `${draggedTemplate.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: draggedTemplate.type,
        position,
        data: {
          label: draggedTemplate.label,
          icon: draggedTemplate.icon,
          type: draggedTemplate.type,
          config: { ...draggedTemplate.config },
          active: true,
          status: 'idle',
        },
      };

      addNode(newNode);
      setDraggedTemplate(null);
      toast.success(`${draggedTemplate.label} added to workflow`);
    },
    [reactFlowInstance, draggedTemplate, addNode]
  );

  const onDragStart = (event: React.DragEvent, template: typeof nodeTemplates[0]) => {
    event.dataTransfer.effectAllowed = 'move';
    setDraggedTemplate(template);
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
  };

  const onDragEnd = () => {
    setDraggedTemplate(null);
  };

  const handleSave = async () => {
    if (!currentWorkflow || !reactFlowInstance) {
      toast.error('No workflow to save');
      return;
    }

    setIsSaving(true);
    try {
      const flow = reactFlowInstance.toObject();
      const updatedWorkflow = {
        ...currentWorkflow,
        nodes: flow.nodes,
        edges: flow.edges,
        viewport: flow.viewport,
        updatedAt: new Date().toISOString(),
      };

      saveWorkflow(updatedWorkflow);
      if (onSave) {
        onSave(updatedWorkflow);
      }
      toast.success('Workflow saved successfully!');
    } catch (error) {
      toast.error('Failed to save workflow');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    if (!currentWorkflow) {
      toast.error('No workflow to execute');
      return;
    }
    
    if (currentWorkflow.nodes.length === 0) {
      toast.error('Workflow has no nodes to execute');
      return;
    }

    try {
      await executeWorkflow(currentWorkflow.id);
    } catch (error) {
      toast.error('Failed to execute workflow');
      console.error('Execution error:', error);
    }
  };

  const handleExport = () => {
    if (!reactFlowInstance || !currentWorkflow) {
      toast.error('No workflow to export');
      return;
    }

    try {
      const flow = reactFlowInstance.toObject();
      const exportData = {
        workflow: {
          ...currentWorkflow,
          nodes: flow.nodes,
          edges: flow.edges,
          viewport: flow.viewport,
        },
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        metadata: {
          nodeCount: flow.nodes.length,
          edgeCount: flow.edges.length,
          exportFormat: 'json'
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${currentWorkflow.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Workflow exported successfully!');
    } catch (error) {
      toast.error('Failed to export workflow');
      console.error('Export error:', error);
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);

        if (!importData.workflow || !importData.metadata) {
          throw new Error('Invalid workflow file format');
        }

        const supportedVersions = ['1.0.0', '1.1.0'];
        if (!supportedVersions.includes(importData.version)) {
          toast.error(`Unsupported version: ${importData.version}`);
          return;
        }

        const importedWorkflow = {
          ...importData.workflow,
          id: `imported-${Date.now()}`,
          name: `${importData.workflow.name} (Imported)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setCurrentWorkflow(importedWorkflow);
        toast.success('Workflow imported successfully!');
      } catch (error) {
        toast.error(`Failed to import workflow: ${error}`);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const handleNewWorkflow = () => {
    const newWorkflow = createWorkflow('New Workflow', 'A new automation workflow');
    setCurrentWorkflow(newWorkflow);
    toast.success('New workflow created!');
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    setContextMenu(null);
  }, [setSelectedNode]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
    });
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      edgeId: edge.id,
    });
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setContextMenu(null);
  }, [setSelectedNode]);

  const handleContextMenuAction = (action: string, id?: string) => {
    if (!id) return;

    try {
      switch (action) {
        case 'delete':
          if (contextMenu?.nodeId) {
            deleteNode(id);
            toast.success('Node deleted');
          } else if (contextMenu?.edgeId) {
            deleteEdge(id);
            toast.success('Connection deleted');
          }
          break;
        case 'duplicate':
          duplicateNode(id);
          toast.success('Node duplicated');
          break;
        case 'toggle':
          toggleNodeActive(id);
          const node = nodes.find(n => n.id === id);
          toast.success(`Node ${node?.data.active ? 'deactivated' : 'activated'}`);
          break;
        case 'edit':
          setSelectedNode(id);
          break;
      }
    } catch (error) {
      toast.error('Action failed');
      console.error('Context menu action error:', error);
    }
    setContextMenu(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            handleSave();
            break;
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'r':
            event.preventDefault();
            handleRun();
            break;
          case 'n':
            event.preventDefault();
            handleNewWorkflow();
            break;
          case 'o':
            event.preventDefault();
            handleImport();
            break;
          case 'e':
            event.preventDefault();
            handleExport();
            break;
          case '/':
            event.preventDefault();
            setShowAI(true);
            break;
        }
      }
      
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
          toast.success('Node deleted');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, handleSave, handleRun, undo, redo, deleteNode]);

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof nodeTemplates>);

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Enhanced Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: sidebarCollapsed ? -240 : 0 }}
        className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">FlowMind Builder</h2>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeOff size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Drag and drop to build your automation</p>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1 mb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      selectedCategory === category
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </>
          )}
          
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-full flex justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Eye size={18} />
            </button>
          )}
        </div>

        {!sidebarCollapsed && (
          <>
            {/* File Operations */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={handleNewWorkflow}
                  className="flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  title="New workflow (Ctrl+N)"
                >
                  <Plus size={16} className="mr-1" />
                  New
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center justify-center px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm disabled:opacity-50"
                  title="Save workflow (Ctrl+S)"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save size={16} className="mr-1" />
                      Save
                    </>
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={handleImport}
                  className="flex items-center justify-center px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  title="Import workflow (Ctrl+O)"
                >
                  <FileUp size={16} />
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  title="Export workflow (Ctrl+E)"
                >
                  <FileDown size={16} />
                </button>
                <button
                  onClick={() => setShowTester(!showTester)}
                  className={`flex items-center justify-center px-2 py-2 rounded-lg transition-colors text-sm ${
                    showTester ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                  title="Test suite"
                >
                  <TestTube size={16} />
                </button>
                <button
                  onClick={() => setShowAI(!showAI)}
                  className={`flex items-center justify-center px-2 py-2 rounded-lg transition-colors text-sm ${
                    showAI ? 'bg-accent-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                  title="AI Assistant (Ctrl+/)"
                >
                  <Bot size={16} />
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </div>

            {/* Actions */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleRun}
                  disabled={isExecuting || !currentWorkflow?.nodes.length}
                  className="flex items-center justify-center px-3 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50 text-sm"
                  title="Run workflow (Ctrl+R)"
                >
                  <Play size={16} className="mr-1" />
                  {isExecuting ? 'Running...' : 'Run'}
                </button>
                <button
                  onClick={stopExecution}
                  disabled={!isExecuting}
                  className="flex items-center justify-center px-3 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors disabled:opacity-50 text-sm"
                  title="Stop execution"
                >
                  <Square size={16} className="mr-1" />
                  Stop
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mt-2">
                <button
                  onClick={undo}
                  disabled={!canUndo()}
                  className="flex items-center justify-center px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                  title="Undo (Ctrl+Z)"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo()}
                  className="flex items-center justify-center px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <RotateCw size={16} />
                </button>
                <button
                  onClick={() => setShowCodeEditor(true)}
                  className="flex items-center justify-center px-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  title="Code Editor"
                >
                  <Code size={16} />
                </button>
                <div className="flex items-center justify-center px-2 py-2 bg-gray-100 rounded-lg text-sm">
                  {isExecuting ? `${Math.round(executionProgress)}%` : '0%'}
                </div>
              </div>
            </div>

            {/* Node Templates */}
            <div className="flex-1 overflow-y-auto p-4">
              {Object.entries(groupedTemplates).map(([category, templates]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {templates.map((template) => (
                      <motion.div
                        key={template.id}
                        className={`p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-accent-300 hover:shadow-sm transition-all ${
                          draggedTemplate?.id === template.id ? 'opacity-50' : ''
                        }`}
                        draggable
                        onDragStart={(e) => onDragStart(e, template)}
                        onDragEnd={onDragEnd}
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
          </>
        )}
      </motion.div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {currentWorkflow?.name || 'Untitled Workflow'}
              </h1>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {nodes.length} nodes, {edges.length} connections
              </span>
              {isExecuting && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-success-600">Executing...</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowProjectSettings(true)}
                className="p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                title="Project settings"
              >
                <FolderOpen size={18} />
              </button>
              <button 
                onClick={() => setShowLogs(!showLogs)}
                className={`p-2 rounded-lg transition-colors ${
                  showLogs ? 'bg-accent-100 text-accent-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Execution logs"
              >
                <Clock size={18} />
              </button>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  showSettings ? 'bg-accent-100 text-accent-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Workflow settings"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ReactFlow Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeRF}
            onEdgesChange={onEdgesChangeRF}
            onConnect={onConnect}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            className="bg-gray-50"
            deleteKeyCode={['Delete', 'Backspace']}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1} 
              color="#e5e7eb"
            />
            <Controls 
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
            />
            <MiniMap 
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
              nodeColor={(node) => {
                switch (node.type) {
                  case 'trigger': return '#3b68ed';
                  case 'action': return '#8b5cf6';
                  case 'condition': return '#f59e0b';
                  case 'delay': return '#6b7280';
                  default: return '#8b5cf6';
                }
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant 
        isOpen={showAI} 
        onClose={() => setShowAI(false)} 
      />

      {/* Code Editor */}
      <CodeEditor 
        isOpen={showCodeEditor} 
        onClose={() => setShowCodeEditor(false)} 
      />

      {/* Project Settings */}
      <ProjectSettings 
        isOpen={showProjectSettings} 
        onClose={() => setShowProjectSettings(false)} 
      />

      {/* Test Suite Panel */}
      <AnimatePresence>
        {showTester && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Test Suite</h3>
              <button 
                onClick={() => setShowTester(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <WorkflowTester />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Properties Panel */}
      <AnimatePresence>
        {selectedNode && (
          <NodePropertiesPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={(updates) => updateNode(selectedNode.id, updates)}
            onDelete={() => {
              deleteNode(selectedNode.id);
              setSelectedNode(null);
              toast.success('Node deleted');
            }}
            onDuplicate={() => {
              duplicateNode(selectedNode.id);
              toast.success('Node duplicated');
            }}
            onToggleActive={() => {
              toggleNodeActive(selectedNode.id);
              toast.success(`Node ${selectedNode.data.active ? 'deactivated' : 'activated'}`);
            }}
          />
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && currentWorkflow && (
          <WorkflowSettingsPanel
            workflow={currentWorkflow}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* Execution Logs Panel */}
      <AnimatePresence>
        {showLogs && currentWorkflow && (
          <ExecutionLogsPanel
            workflowId={currentWorkflow.id}
            onClose={() => setShowLogs(false)}
          />
        )}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            nodeId={contextMenu.nodeId}
            edgeId={contextMenu.edgeId}
            onAction={handleContextMenuAction}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>
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