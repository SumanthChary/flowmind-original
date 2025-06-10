import { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
  NodeTypes,
  useReactFlow,
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
  X
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

// Node types mapping
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

// Sidebar node templates
const nodeTemplates = [
  {
    type: 'trigger',
    label: 'Email Trigger',
    icon: <Mail size={20} />,
    description: 'Trigger when email is received',
    category: 'Triggers'
  },
  {
    type: 'trigger',
    label: 'Webhook',
    icon: <Webhook size={20} />,
    description: 'Trigger via HTTP webhook',
    category: 'Triggers'
  },
  {
    type: 'trigger',
    label: 'Schedule',
    icon: <Timer size={20} />,
    description: 'Trigger on schedule',
    category: 'Triggers'
  },
  {
    type: 'action',
    label: 'Send Email',
    icon: <Mail size={20} />,
    description: 'Send an email message',
    category: 'Actions'
  },
  {
    type: 'action',
    label: 'Create Calendar Event',
    icon: <Calendar size={20} />,
    description: 'Create a calendar event',
    category: 'Actions'
  },
  {
    type: 'action',
    label: 'Create Document',
    icon: <FileText size={20} />,
    description: 'Create a new document',
    category: 'Actions'
  },
  {
    type: 'action',
    label: 'Update Database',
    icon: <Database size={20} />,
    description: 'Update database record',
    category: 'Actions'
  },
  {
    type: 'action',
    label: 'Send Slack Message',
    icon: <MessageSquare size={20} />,
    description: 'Send message to Slack',
    category: 'Actions'
  },
  {
    type: 'condition',
    label: 'If/Then',
    icon: <Filter size={20} />,
    description: 'Conditional logic',
    category: 'Logic'
  },
  {
    type: 'delay',
    label: 'Delay',
    icon: <Timer size={20} />,
    description: 'Wait for specified time',
    category: 'Logic'
  },
];

interface WorkflowBuilderProps {
  workflowId?: string;
  onSave?: (workflow: any) => void;
}

const WorkflowBuilderContent = ({ workflowId, onSave }: WorkflowBuilderProps) => {
  const {
    currentWorkflow,
    isExecuting,
    executionProgress,
    selectedNodeId,
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
  } = useWorkflowStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(currentWorkflow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentWorkflow?.edges || []);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId?: string;
    edgeId?: string;
  } | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Sync with store
  useEffect(() => {
    if (currentWorkflow) {
      setNodes(currentWorkflow.nodes);
      setEdges(currentWorkflow.edges);
    }
  }, [currentWorkflow, setNodes, setEdges]);

  // Update store when nodes/edges change
  useEffect(() => {
    if (currentWorkflow) {
      useWorkflowStore.setState({
        currentWorkflow: {
          ...currentWorkflow,
          nodes,
          edges,
        },
      });
    }
  }, [nodes, edges, currentWorkflow]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (validateConnection(params)) {
        const newEdge: WorkflowEdge = {
          ...params,
          id: `edge-${Date.now()}`,
          type: 'smoothstep',
          animated: true,
          data: { status: 'idle' },
        };
        setEdges((eds) => addEdge(newEdge, eds));
        addWorkflowEdge(newEdge);
      } else {
        toast.error('Invalid connection');
      }
    },
    [validateConnection, setEdges, addWorkflowEdge]
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

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const template = nodeTemplates.find(t => t.type === type);
      if (!template) return;

      const newNode: WorkflowNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: template.label,
          icon: template.icon,
          type: template.type,
          config: {},
          active: true,
          status: 'idle',
        },
      };

      setNodes((nds) => nds.concat(newNode));
      addNode(newNode);
    },
    [reactFlowInstance, setNodes, addNode]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    setDraggedType(nodeType);
  };

  const onDragEnd = () => {
    setDraggedType(null);
  };

  const handleSave = () => {
    if (!currentWorkflow || !reactFlowInstance) return;

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
  };

  const handleRun = async () => {
    if (!currentWorkflow) return;
    await executeWorkflow(currentWorkflow.id);
  };

  const handleExport = () => {
    if (!reactFlowInstance || !currentWorkflow) return;

    const flow = reactFlowInstance.toObject();
    const dataStr = JSON.stringify(flow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentWorkflow.name.replace(/\s+/g, '-')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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

    switch (action) {
      case 'delete':
        if (contextMenu?.nodeId) {
          deleteNode(id);
          setNodes((nds) => nds.filter((node) => node.id !== id));
        } else if (contextMenu?.edgeId) {
          deleteEdge(id);
          setEdges((eds) => eds.filter((edge) => edge.id !== id));
        }
        break;
      case 'duplicate':
        duplicateNode(id);
        break;
      case 'toggle':
        toggleNodeActive(id);
        break;
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
          case 'Delete':
          case 'Backspace':
            if (selectedNodeId) {
              deleteNode(selectedNodeId);
              setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, handleSave, handleRun, undo, redo, deleteNode, setNodes]);

  const groupedTemplates = nodeTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof nodeTemplates>);

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-80 bg-white border-r border-gray-200 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Workflow Builder</h2>
          <p className="text-sm text-gray-600">Drag and drop to build your automation</p>
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
              onClick={handleSave}
              className="flex items-center justify-center px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
              title="Save workflow (Ctrl+S)"
            >
              <Save size={16} className="mr-1" />
              Save
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            {isExecuting ? (
              <>
                <button
                  onClick={pauseExecution}
                  className="flex items-center justify-center px-2 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors text-sm"
                  title="Pause execution"
                >
                  <Pause size={16} />
                </button>
                <button
                  onClick={stopExecution}
                  className="flex items-center justify-center px-2 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors text-sm"
                  title="Stop execution"
                >
                  <Square size={16} />
                </button>
                <div className="flex items-center justify-center px-2 py-2 bg-gray-100 rounded-lg text-sm">
                  {Math.round(executionProgress)}%
                </div>
              </>
            ) : (
              <>
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
                  onClick={handleExport}
                  className="flex items-center justify-center px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  title="Export workflow"
                >
                  <Download size={16} />
                </button>
              </>
            )}
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
                {templates.map((template, index) => (
                  <motion.div
                    key={`${template.type}-${index}`}
                    className={`p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-accent-300 hover:shadow-sm transition-all ${
                      draggedType === template.type ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => onDragStart(e, template.type)}
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
      </motion.div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
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

      {/* Properties Panel */}
      <AnimatePresence>
        {selectedNode && (
          <NodePropertiesPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={(updates) => updateNode(selectedNode.id, updates)}
            onDelete={() => {
              deleteNode(selectedNode.id);
              setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
              setSelectedNode(null);
            }}
            onDuplicate={() => duplicateNode(selectedNode.id)}
            onToggleActive={() => toggleNodeActive(selectedNode.id)}
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

const WorkflowBuilder = (props: WorkflowBuilderProps) => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent {...props} />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;