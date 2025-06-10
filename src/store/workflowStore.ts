import { create } from 'zustand';
import { Node, Edge, Connection } from 'reactflow';
import toast from 'react-hot-toast';

export interface WorkflowNode extends Node {
  data: {
    label: string;
    icon: React.ReactNode;
    type: string;
    config: Record<string, any>;
    active: boolean;
    status?: 'idle' | 'running' | 'success' | 'error';
    lastExecuted?: string;
    executionTime?: number;
  };
}

export interface WorkflowEdge extends Edge {
  data?: {
    status?: 'idle' | 'active' | 'success' | 'error';
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport: any;
  settings: WorkflowSettings;
  createdAt: string;
  updatedAt: string;
  lastExecuted?: string;
  status: 'draft' | 'active' | 'paused' | 'error';
}

export interface WorkflowSettings {
  autoSave: boolean;
  executionTimeout: number;
  retryAttempts: number;
  enableLogging: boolean;
  notifyOnError: boolean;
  notifyOnSuccess: boolean;
}

export interface ExecutionLog {
  id: string;
  workflowId: string;
  nodeId: string;
  timestamp: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
  data?: any;
}

interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  executionLogs: ExecutionLog[];
  isExecuting: boolean;
  executionProgress: number;
  selectedNodeId: string | null;
  history: Array<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }>;
  historyIndex: number;
  
  // Actions
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  createWorkflow: (name: string, description?: string) => Workflow;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  saveWorkflow: (workflow: Workflow) => void;
  loadWorkflow: (id: string) => Workflow | null;
  
  // Node management
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, updates: Partial<WorkflowNode['data']>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  toggleNodeActive: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  
  // Edge management
  addEdge: (edge: WorkflowEdge) => void;
  deleteEdge: (id: string) => void;
  validateConnection: (connection: Connection) => boolean;
  
  // Execution
  executeWorkflow: (workflowId: string) => Promise<void>;
  pauseExecution: () => void;
  resumeExecution: () => void;
  stopExecution: () => void;
  
  // History
  addToHistory: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Settings
  updateSettings: (workflowId: string, settings: Partial<WorkflowSettings>) => void;
  resetSettings: (workflowId: string) => void;
  
  // Logs
  addLog: (log: Omit<ExecutionLog, 'id' | 'timestamp'>) => void;
  clearLogs: (workflowId?: string) => void;
  getLogsForWorkflow: (workflowId: string) => ExecutionLog[];
}

const defaultSettings: WorkflowSettings = {
  autoSave: true,
  executionTimeout: 300000, // 5 minutes
  retryAttempts: 3,
  enableLogging: true,
  notifyOnError: true,
  notifyOnSuccess: false,
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  executionLogs: [],
  isExecuting: false,
  executionProgress: 0,
  selectedNodeId: null,
  history: [],
  historyIndex: -1,

  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),

  createWorkflow: (name, description) => {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name,
      description,
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      settings: { ...defaultSettings },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };

    set((state) => ({
      workflows: [...state.workflows, workflow],
      currentWorkflow: workflow,
    }));

    return workflow;
  },

  updateWorkflow: (id, updates) => {
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      ),
      currentWorkflow:
        state.currentWorkflow?.id === id
          ? { ...state.currentWorkflow, ...updates, updatedAt: new Date().toISOString() }
          : state.currentWorkflow,
    }));
  },

  deleteWorkflow: (id) => {
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
      currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
    }));
  },

  saveWorkflow: (workflow) => {
    try {
      localStorage.setItem(`workflow-${workflow.id}`, JSON.stringify(workflow));
      set((state) => ({
        workflows: state.workflows.map((w) => (w.id === workflow.id ? workflow : w)),
      }));
      toast.success('Workflow saved successfully!');
    } catch (error) {
      toast.error('Failed to save workflow');
      console.error('Save error:', error);
    }
  },

  loadWorkflow: (id) => {
    try {
      const saved = localStorage.getItem(`workflow-${id}`);
      if (saved) {
        const workflow = JSON.parse(saved);
        set((state) => ({
          workflows: state.workflows.some((w) => w.id === id)
            ? state.workflows.map((w) => (w.id === id ? workflow : w))
            : [...state.workflows, workflow],
          currentWorkflow: workflow,
        }));
        return workflow;
      }
    } catch (error) {
      toast.error('Failed to load workflow');
      console.error('Load error:', error);
    }
    return null;
  },

  addNode: (node) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    const newNodes = [...currentWorkflow.nodes, node];
    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    set((state) => ({
      currentWorkflow: state.currentWorkflow
        ? { ...state.currentWorkflow, nodes: newNodes }
        : null,
    }));
  },

  updateNode: (id, updates) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    set((state) => ({
      currentWorkflow: state.currentWorkflow
        ? {
            ...state.currentWorkflow,
            nodes: state.currentWorkflow.nodes.map((node) =>
              node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
            ),
          }
        : null,
    }));
  },

  deleteNode: (id) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    set((state) => ({
      currentWorkflow: state.currentWorkflow
        ? {
            ...state.currentWorkflow,
            nodes: state.currentWorkflow.nodes.filter((node) => node.id !== id),
            edges: state.currentWorkflow.edges.filter(
              (edge) => edge.source !== id && edge.target !== id
            ),
          }
        : null,
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  duplicateNode: (id) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    const originalNode = currentWorkflow.nodes.find((node) => node.id === id);
    if (!originalNode) return;

    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    const duplicatedNode: WorkflowNode = {
      ...originalNode,
      id: `${originalNode.id}-copy-${Date.now()}`,
      position: {
        x: originalNode.position.x + 50,
        y: originalNode.position.y + 50,
      },
      data: {
        ...originalNode.data,
        label: `${originalNode.data.label} (Copy)`,
      },
    };

    set((state) => ({
      currentWorkflow: state.currentWorkflow
        ? {
            ...state.currentWorkflow,
            nodes: [...state.currentWorkflow.nodes, duplicatedNode],
          }
        : null,
    }));
  },

  toggleNodeActive: (id) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    set((state) => ({
      currentWorkflow: state.currentWorkflow
        ? {
            ...state.currentWorkflow,
            nodes: state.currentWorkflow.nodes.map((node) =>
              node.id === id
                ? { ...node, data: { ...node.data, active: !node.data.active } }
                : node
            ),
          }
        : null,
    }));
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  addEdge: (edge) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    set((state) => ({
      currentWorkflow: state.currentWorkflow
        ? {
            ...state.currentWorkflow,
            edges: [...state.currentWorkflow.edges, edge],
          }
        : null,
    }));
  },

  deleteEdge: (id) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    set((state) => ({
      currentWorkflow: state.currentWorkflow
        ? {
            ...state.currentWorkflow,
            edges: state.currentWorkflow.edges.filter((edge) => edge.id !== id),
          }
        : null,
    }));
  },

  validateConnection: (connection) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return false;

    const sourceNode = currentWorkflow.nodes.find((node) => node.id === connection.source);
    const targetNode = currentWorkflow.nodes.find((node) => node.id === connection.target);

    if (!sourceNode || !targetNode) return false;

    // Prevent self-connections
    if (connection.source === connection.target) return false;

    // Check for existing connection
    const existingConnection = currentWorkflow.edges.find(
      (edge) =>
        edge.source === connection.source &&
        edge.target === connection.target &&
        edge.sourceHandle === connection.sourceHandle &&
        edge.targetHandle === connection.targetHandle
    );

    if (existingConnection) return false;

    // Type-specific validation
    if (sourceNode.type === 'trigger' && targetNode.type === 'trigger') return false;

    return true;
  },

  executeWorkflow: async (workflowId) => {
    const { workflows, addLog } = get();
    const workflow = workflows.find((w) => w.id === workflowId);
    
    if (!workflow) {
      toast.error('Workflow not found');
      return;
    }

    if (workflow.nodes.length === 0) {
      toast.error('Workflow has no nodes to execute');
      return;
    }

    set({ isExecuting: true, executionProgress: 0 });

    try {
      const activeNodes = workflow.nodes.filter((node) => node.data.active);
      const totalNodes = activeNodes.length;

      for (let i = 0; i < activeNodes.length; i++) {
        const node = activeNodes[i];
        const startTime = Date.now();

        // Update node status
        set((state) => ({
          currentWorkflow: state.currentWorkflow
            ? {
                ...state.currentWorkflow,
                nodes: state.currentWorkflow.nodes.map((n) =>
                  n.id === node.id
                    ? { ...n, data: { ...n.data, status: 'running' } }
                    : n
                ),
              }
            : null,
        }));

        // Simulate node execution
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

        const executionTime = Date.now() - startTime;
        const success = Math.random() > 0.1; // 90% success rate

        // Update node status
        set((state) => ({
          currentWorkflow: state.currentWorkflow
            ? {
                ...state.currentWorkflow,
                nodes: state.currentWorkflow.nodes.map((n) =>
                  n.id === node.id
                    ? {
                        ...n,
                        data: {
                          ...n.data,
                          status: success ? 'success' : 'error',
                          lastExecuted: new Date().toISOString(),
                          executionTime,
                        },
                      }
                    : n
                ),
              }
            : null,
          executionProgress: ((i + 1) / totalNodes) * 100,
        }));

        // Add log entry
        addLog({
          workflowId,
          nodeId: node.id,
          status: success ? 'success' : 'error',
          message: success
            ? `${node.data.label} executed successfully`
            : `${node.data.label} execution failed`,
          duration: executionTime,
        });

        if (!success && workflow.settings.retryAttempts === 0) {
          throw new Error(`Node ${node.data.label} failed to execute`);
        }
      }

      toast.success('Workflow executed successfully!');
    } catch (error) {
      toast.error(`Workflow execution failed: ${error}`);
      addLog({
        workflowId,
        nodeId: 'workflow',
        status: 'error',
        message: `Workflow execution failed: ${error}`,
      });
    } finally {
      set({ isExecuting: false, executionProgress: 0 });
    }
  },

  pauseExecution: () => {
    set({ isExecuting: false });
    toast.info('Workflow execution paused');
  },

  resumeExecution: () => {
    set({ isExecuting: true });
    toast.info('Workflow execution resumed');
  },

  stopExecution: () => {
    set({ isExecuting: false, executionProgress: 0 });
    toast.info('Workflow execution stopped');
  },

  addToHistory: (nodes, edges) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ nodes: [...nodes], edges: [...edges] });
      
      // Limit history to 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    const { history, historyIndex, currentWorkflow } = get();
    if (historyIndex > 0 && currentWorkflow) {
      const previousState = history[historyIndex - 1];
      set((state) => ({
        currentWorkflow: state.currentWorkflow
          ? {
              ...state.currentWorkflow,
              nodes: previousState.nodes,
              edges: previousState.edges,
            }
          : null,
        historyIndex: historyIndex - 1,
      }));
    }
  },

  redo: () => {
    const { history, historyIndex, currentWorkflow } = get();
    if (historyIndex < history.length - 1 && currentWorkflow) {
      const nextState = history[historyIndex + 1];
      set((state) => ({
        currentWorkflow: state.currentWorkflow
          ? {
              ...state.currentWorkflow,
              nodes: nextState.nodes,
              edges: nextState.edges,
            }
          : null,
        historyIndex: historyIndex + 1,
      }));
    }
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  updateSettings: (workflowId, settings) => {
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? { ...w, settings: { ...w.settings, ...settings } }
          : w
      ),
      currentWorkflow:
        state.currentWorkflow?.id === workflowId
          ? { ...state.currentWorkflow, settings: { ...state.currentWorkflow.settings, ...settings } }
          : state.currentWorkflow,
    }));
  },

  resetSettings: (workflowId) => {
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId ? { ...w, settings: { ...defaultSettings } } : w
      ),
      currentWorkflow:
        state.currentWorkflow?.id === workflowId
          ? { ...state.currentWorkflow, settings: { ...defaultSettings } }
          : state.currentWorkflow,
    }));
  },

  addLog: (log) => {
    const newLog: ExecutionLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      executionLogs: [newLog, ...state.executionLogs].slice(0, 1000), // Keep last 1000 logs
    }));
  },

  clearLogs: (workflowId) => {
    set((state) => ({
      executionLogs: workflowId
        ? state.executionLogs.filter((log) => log.workflowId !== workflowId)
        : [],
    }));
  },

  getLogsForWorkflow: (workflowId) => {
    const { executionLogs } = get();
    return executionLogs.filter((log) => log.workflowId === workflowId);
  },
}));