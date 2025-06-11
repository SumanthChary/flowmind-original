import { create } from 'zustand';
import { Node, Edge, Connection, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';
import { supabase } from '../lib/supabase';
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
  created_at: string;
  updated_at: string;
  created_by?: string;
  lastExecuted?: string;
  status: 'draft' | 'active' | 'paused' | 'error';
  version?: number;
  size?: number;
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
  collaborators: any[];
  
  // Actions
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  createWorkflow: (name: string, description?: string) => Workflow;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  saveWorkflow: (workflow: Workflow) => Promise<void>;
  loadWorkflow: (id: string) => Promise<Workflow | null>;
  loadAllWorkflows: () => Promise<void>;
  
  // ReactFlow integration
  onNodesChangeRF: (changes: NodeChange[]) => void;
  onEdgesChangeRF: (changes: EdgeChange[]) => void;
  
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
  
  // Collaboration
  setCollaborators: (collaborators: any[]) => void;
  
  // Performance
  getWorkflowSize: (workflow: Workflow) => number;
  validateWorkflowSize: (workflow: Workflow) => boolean;
}

const defaultSettings: WorkflowSettings = {
  autoSave: true,
  executionTimeout: 300000, // 5 minutes
  retryAttempts: 3,
  enableLogging: true,
  notifyOnError: true,
  notifyOnSuccess: false,
};

// Utility functions for data compression
const compressWorkflowData = (workflow: Workflow): string => {
  const essentialData = {
    nodes: workflow.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        label: node.data.label,
        type: node.data.type,
        config: node.data.config,
        active: node.data.active
      }
    })),
    edges: workflow.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type
    })),
    viewport: workflow.viewport,
    settings: workflow.settings
  };
  
  return JSON.stringify(essentialData);
};

const decompressWorkflowData = (compressed: string): { nodes: WorkflowNode[]; edges: WorkflowEdge[]; viewport: any; settings: WorkflowSettings } => {
  try {
    return JSON.parse(compressed);
  } catch (error) {
    console.error('Failed to decompress workflow data:', error);
    return { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 }, settings: defaultSettings };
  }
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
  collaborators: [],

  setCurrentWorkflow: (workflow) => {
    set({ currentWorkflow: workflow });
    if (workflow) {
      // Initialize history with current state
      set({ 
        history: [{ nodes: [...workflow.nodes], edges: [...workflow.edges] }],
        historyIndex: 0 
      });
    }
  },

  createWorkflow: (name, description) => {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      settings: { ...defaultSettings },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'draft',
      version: 1,
      size: 0
    };

    set((state) => ({
      workflows: [...state.workflows, workflow],
      currentWorkflow: workflow,
      history: [{ nodes: [], edges: [] }],
      historyIndex: 0,
    }));

    return workflow;
  },

  updateWorkflow: (id, updates) => {
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, ...updates, updated_at: new Date().toISOString() } : w
      ),
      currentWorkflow:
        state.currentWorkflow?.id === id
          ? { ...state.currentWorkflow, ...updates, updated_at: new Date().toISOString() }
          : state.currentWorkflow,
    }));
  },

  deleteWorkflow: async (id) => {
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        workflows: state.workflows.filter((w) => w.id !== id),
        currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
      }));

      toast.success('Workflow deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete workflow');
    }
  },

  saveWorkflow: async (workflow) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const compressedData = compressWorkflowData(workflow);
      const size = new Blob([compressedData]).size;

      const workflowData = {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description || '',
        data: compressedData,
        status: workflow.status,
        size: size,
        updated_at: new Date().toISOString(),
        created_by: user.id
      };

      // Check if workflow exists
      const { data: existingWorkflow } = await supabase
        .from('workflows')
        .select('id')
        .eq('id', workflow.id)
        .single();

      let result;
      if (existingWorkflow) {
        // Update existing workflow
        result = await supabase
          .from('workflows')
          .update(workflowData)
          .eq('id', workflow.id)
          .select()
          .single();
      } else {
        // Insert new workflow
        result = await supabase
          .from('workflows')
          .insert({
            ...workflowData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Update local state
      const savedWorkflow = {
        ...workflow,
        created_at: result.data.created_at,
        updated_at: result.data.updated_at,
        created_by: result.data.created_by,
        size: result.data.size
      };

      set((state) => ({
        workflows: state.workflows.some(w => w.id === workflow.id)
          ? state.workflows.map((w) => (w.id === workflow.id ? savedWorkflow : w))
          : [...state.workflows, savedWorkflow],
        currentWorkflow: state.currentWorkflow?.id === workflow.id ? savedWorkflow : state.currentWorkflow,
      }));

      toast.success('Workflow saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save workflow');
      throw error;
    }
  },

  loadWorkflow: async (id) => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      const decompressed = decompressWorkflowData(data.data);
      const workflow: Workflow = {
        id: data.id,
        name: data.name,
        description: data.description,
        nodes: decompressed.nodes,
        edges: decompressed.edges,
        viewport: decompressed.viewport,
        settings: decompressed.settings,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.created_by,
        status: data.status,
        size: data.size
      };

      set((state) => ({
        workflows: state.workflows.some((w) => w.id === id)
          ? state.workflows.map((w) => (w.id === id ? workflow : w))
          : [...state.workflows, workflow],
        currentWorkflow: workflow,
        history: [{ nodes: [...workflow.nodes], edges: [...workflow.edges] }],
        historyIndex: 0,
      }));

      return workflow;
    } catch (error) {
      console.error('Load error:', error);
      toast.error('Failed to load workflow');
      return null;
    }
  },

  loadAllWorkflows: async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('workflows')
        .select('id, name, description, created_at, updated_at, status, size, created_by')
        .eq('created_by', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const workflows = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        settings: defaultSettings,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        status: item.status as 'draft' | 'active' | 'paused' | 'error',
        size: item.size
      }));

      set({ workflows });
    } catch (error) {
      console.error('Load workflows error:', error);
    }
  },

  onNodesChangeRF: (changes) => {
    set((state) => {
      if (!state.currentWorkflow) return state;
      
      const updatedNodes = applyNodeChanges(changes, state.currentWorkflow.nodes);
      const updatedWorkflow = {
        ...state.currentWorkflow,
        nodes: updatedNodes,
        updated_at: new Date().toISOString(),
      };
      
      return {
        currentWorkflow: updatedWorkflow,
        workflows: state.workflows.map(w => 
          w.id === updatedWorkflow.id ? updatedWorkflow : w
        ),
      };
    });
  },

  onEdgesChangeRF: (changes) => {
    set((state) => {
      if (!state.currentWorkflow) return state;
      
      const updatedEdges = applyEdgeChanges(changes, state.currentWorkflow.edges);
      const updatedWorkflow = {
        ...state.currentWorkflow,
        edges: updatedEdges,
        updated_at: new Date().toISOString(),
      };
      
      return {
        currentWorkflow: updatedWorkflow,
        workflows: state.workflows.map(w => 
          w.id === updatedWorkflow.id ? updatedWorkflow : w
        ),
      };
    });
  },

  addNode: (node) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: [...currentWorkflow.nodes, node],
      updated_at: new Date().toISOString(),
    };

    set((state) => ({
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      ),
    }));
  },

  updateNode: (id, updates) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    const updatedNodes = currentWorkflow.nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
    );

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: updatedNodes,
      updated_at: new Date().toISOString(),
    };

    set((state) => ({
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      ),
    }));
  },

  deleteNode: (id) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    const updatedNodes = currentWorkflow.nodes.filter((node) => node.id !== id);
    const updatedEdges = currentWorkflow.edges.filter(
      (edge) => edge.source !== id && edge.target !== id
    );

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: updatedNodes,
      edges: updatedEdges,
      updated_at: new Date().toISOString(),
    };

    set((state) => ({
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      ),
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
      id: `${originalNode.id}-copy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: originalNode.position.x + 50,
        y: originalNode.position.y + 50,
      },
      data: {
        ...originalNode.data,
        label: `${originalNode.data.label} (Copy)`,
      },
    };

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: [...currentWorkflow.nodes, duplicatedNode],
      updated_at: new Date().toISOString(),
    };

    set((state) => ({
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      ),
    }));
  },

  toggleNodeActive: (id) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return;

    const updatedNodes = currentWorkflow.nodes.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, active: !node.data.active } }
        : node
    );

    const updatedWorkflow = {
      ...currentWorkflow,
      nodes: updatedNodes,
      updated_at: new Date().toISOString(),
    };

    set((state) => ({
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      ),
    }));
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  addEdge: (edge) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    const updatedWorkflow = {
      ...currentWorkflow,
      edges: [...currentWorkflow.edges, edge],
      updated_at: new Date().toISOString(),
    };

    set((state) => ({
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      ),
    }));
  },

  deleteEdge: (id) => {
    const { currentWorkflow, addToHistory } = get();
    if (!currentWorkflow) return;

    addToHistory(currentWorkflow.nodes, currentWorkflow.edges);

    const updatedWorkflow = {
      ...currentWorkflow,
      edges: currentWorkflow.edges.filter((edge) => edge.id !== id),
      updated_at: new Date().toISOString(),
    };

    set((state) => ({
      currentWorkflow: updatedWorkflow,
      workflows: state.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      ),
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
    const { workflows, addLog, currentWorkflow } = get();
    const workflow = workflows.find((w) => w.id === workflowId) || currentWorkflow;
    
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    if (workflow.nodes.length === 0) {
      throw new Error('Workflow has no nodes to execute');
    }

    set({ isExecuting: true, executionProgress: 0 });

    try {
      const activeNodes = workflow.nodes.filter((node) => node.data.active);
      const totalNodes = activeNodes.length;

      if (totalNodes === 0) {
        throw new Error('No active nodes to execute');
      }

      // Update workflow status
      const updatedWorkflow = {
        ...workflow,
        status: 'active' as const,
        lastExecuted: new Date().toISOString(),
      };

      set((state) => ({
        currentWorkflow: state.currentWorkflow?.id === workflow.id ? updatedWorkflow : state.currentWorkflow,
        workflows: state.workflows.map(w => w.id === workflow.id ? updatedWorkflow : w),
      }));

      for (let i = 0; i < activeNodes.length; i++) {
        const node = activeNodes[i];
        const startTime = Date.now();

        // Update node status to running
        const runningWorkflow = {
          ...updatedWorkflow,
          nodes: updatedWorkflow.nodes.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, status: 'running' as const } }
              : n
          ),
        };

        set((state) => ({
          currentWorkflow: state.currentWorkflow?.id === workflow.id ? runningWorkflow : state.currentWorkflow,
          workflows: state.workflows.map(w => w.id === workflow.id ? runningWorkflow : w),
        }));

        // Simulate node execution
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

        const executionTime = Date.now() - startTime;
        const success = Math.random() > 0.1; // 90% success rate

        // Update node status
        const completedWorkflow = {
          ...runningWorkflow,
          nodes: runningWorkflow.nodes.map((n) =>
            n.id === node.id
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    status: success ? 'success' as const : 'error' as const,
                    lastExecuted: new Date().toISOString(),
                    executionTime,
                  },
                }
              : n
          ),
        };

        set((state) => ({
          currentWorkflow: state.currentWorkflow?.id === workflow.id ? completedWorkflow : state.currentWorkflow,
          workflows: state.workflows.map(w => w.id === workflow.id ? completedWorkflow : w),
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

      // Mark workflow as completed
      const finalWorkflow = {
        ...updatedWorkflow,
        status: 'active' as const,
        lastExecuted: new Date().toISOString(),
      };

      set((state) => ({
        currentWorkflow: state.currentWorkflow?.id === workflow.id ? finalWorkflow : state.currentWorkflow,
        workflows: state.workflows.map(w => w.id === workflow.id ? finalWorkflow : w),
      }));

    } catch (error) {
      addLog({
        workflowId,
        nodeId: 'workflow',
        status: 'error',
        message: `Workflow execution failed: ${error}`,
      });
      throw error;
    } finally {
      set({ isExecuting: false, executionProgress: 0 });
    }
  },

  pauseExecution: () => {
    set({ isExecuting: false });
  },

  resumeExecution: () => {
    set({ isExecuting: true });
  },

  stopExecution: () => {
    set({ isExecuting: false, executionProgress: 0 });
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
      const updatedWorkflow = {
        ...currentWorkflow,
        nodes: previousState.nodes,
        edges: previousState.edges,
        updated_at: new Date().toISOString(),
      };
      
      set((state) => ({
        currentWorkflow: updatedWorkflow,
        workflows: state.workflows.map(w => 
          w.id === updatedWorkflow.id ? updatedWorkflow : w
        ),
        historyIndex: historyIndex - 1,
      }));
    }
  },

  redo: () => {
    const { history, historyIndex, currentWorkflow } = get();
    if (historyIndex < history.length - 1 && currentWorkflow) {
      const nextState = history[historyIndex + 1];
      const updatedWorkflow = {
        ...currentWorkflow,
        nodes: nextState.nodes,
        edges: nextState.edges,
        updated_at: new Date().toISOString(),
      };
      
      set((state) => ({
        currentWorkflow: updatedWorkflow,
        workflows: state.workflows.map(w => 
          w.id === updatedWorkflow.id ? updatedWorkflow : w
        ),
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
          ? { ...w, settings: { ...w.settings, ...settings }, updated_at: new Date().toISOString() }
          : w
      ),
      currentWorkflow:
        state.currentWorkflow?.id === workflowId
          ? { ...state.currentWorkflow, settings: { ...state.currentWorkflow.settings, ...settings }, updated_at: new Date().toISOString() }
          : state.currentWorkflow,
    }));
  },

  resetSettings: (workflowId) => {
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId ? { ...w, settings: { ...defaultSettings }, updated_at: new Date().toISOString() } : w
      ),
      currentWorkflow:
        state.currentWorkflow?.id === workflowId
          ? { ...state.currentWorkflow, settings: { ...defaultSettings }, updated_at: new Date().toISOString() }
          : state.currentWorkflow,
    }));
  },

  addLog: (log) => {
    const newLog: ExecutionLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  setCollaborators: (collaborators) => {
    set({ collaborators });
  },

  getWorkflowSize: (workflow) => {
    const data = JSON.stringify({
      nodes: workflow.nodes,
      edges: workflow.edges,
      settings: workflow.settings
    });
    return new Blob([data]).size;
  },

  validateWorkflowSize: (workflow) => {
    const size = get().getWorkflowSize(workflow);
    return size <= 1024 * 1024; // 1MB limit
  }
}));