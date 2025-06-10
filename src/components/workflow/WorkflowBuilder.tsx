import { useCallback, useState, useRef } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
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
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

// Custom Node Components
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import DelayNode from './nodes/DelayNode';

// Node types mapping
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { 
      label: 'Email Received',
      icon: <Mail size={20} />,
      type: 'email',
      config: {}
    },
  },
];

const initialEdges: Edge[] = [];

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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
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

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: template.label,
          icon: template.icon,
          type: template.type,
          config: {}
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
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
    if (!reactFlowInstance) return;

    const flow = reactFlowInstance.toObject();
    const workflow = {
      id: workflowId || `workflow-${Date.now()}`,
      name: 'Untitled Workflow',
      nodes: flow.nodes,
      edges: flow.edges,
      viewport: flow.viewport,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (onSave) {
      onSave(workflow);
    }

    // Save to localStorage for now
    localStorage.setItem(`workflow-${workflow.id}`, JSON.stringify(workflow));
    toast.success('Workflow saved successfully!');
  };

  const handleRun = async () => {
    setIsRunning(true);
    toast.loading('Running workflow...', { id: 'workflow-run' });
    
    // Simulate workflow execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsRunning(false);
    toast.success('Workflow executed successfully!', { id: 'workflow-run' });
  };

  const handleExport = () => {
    if (!reactFlowInstance) return;

    const flow = reactFlowInstance.toObject();
    const dataStr = JSON.stringify(flow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'workflow.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const groupedTemplates = nodeTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof nodeTemplates>);

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
              disabled={isRunning}
              className="flex items-center justify-center px-3 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50 text-sm"
            >
              <Play size={16} className="mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm"
            >
              <Save size={16} className="mr-1" />
              Save
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={handleExport}
              className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <Download size={16} className="mr-1" />
              Export
            </button>
            <button className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
              <Upload size={16} className="mr-1" />
              Import
            </button>
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
              <h1 className="text-lg font-semibold text-gray-900">Untitled Workflow</h1>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {nodes.length} nodes, {edges.length} connections
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={18} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Zap size={18} />
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
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            className="bg-gray-50"
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
              nodeColor="#8b5cf6"
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedNode && (
        <motion.div 
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          className="w-80 bg-white border-l border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Node Type
              </label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="text-accent-600 mr-2">
                  {selectedNode.data.icon}
                </div>
                <span className="font-medium">{selectedNode.data.label}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Node ID
              </label>
              <input
                type="text"
                value={selectedNode.id}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label
              </label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => {
                  setNodes((nds) =>
                    nds.map((node) =>
                      node.id === selectedNode.id
                        ? { ...node, data: { ...node.data, label: e.target.value } }
                        : node
                    )
                  );
                  setSelectedNode({
                    ...selectedNode,
                    data: { ...selectedNode.data, label: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            
            {/* Node-specific configuration would go here */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Configuration</h4>
              <p className="text-sm text-gray-500">
                Node-specific settings will appear here based on the selected node type.
              </p>
            </div>
          </div>
        </motion.div>
      )}
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