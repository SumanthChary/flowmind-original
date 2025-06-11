import { create } from 'zustand';
import { supabase, testConnection } from '../lib/supabase';

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  data: string;
  status: string;
  size: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface WorkflowStore {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadWorkflows: () => Promise<void>;
  loadWorkflow: (id: string) => Promise<void>;
  createWorkflow: (name: string, description?: string) => Promise<string | null>;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (id: string) => void;
  clearError: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  nodes: [],
  edges: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadWorkflows: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Test connection first
      const connectionOk = await testConnection();
      if (!connectionOk) {
        throw new Error('Unable to connect to Supabase. Please check your internet connection and Supabase configuration.');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('created_by', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to load workflows: ${error.message}`);
      }

      set({ workflows: data || [], isLoading: false });
    } catch (error) {
      console.error('Load workflows error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workflows';
      set({ error: errorMessage, isLoading: false, workflows: [] });
    }
  },

  loadWorkflow: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Test connection first
      const connectionOk = await testConnection();
      if (!connectionOk) {
        throw new Error('Unable to connect to Supabase. Please check your internet connection and Supabase configuration.');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .eq('created_by', user.id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === 'PGRST116') {
          throw new Error('Workflow not found or access denied');
        }
        throw new Error(`Failed to load workflow: ${error.message}`);
      }

      if (!data) {
        throw new Error('Workflow not found');
      }

      // Parse workflow data
      let parsedData;
      try {
        parsedData = JSON.parse(data.data);
      } catch (parseError) {
        console.error('Failed to parse workflow data:', parseError);
        parsedData = { nodes: [], edges: [] };
      }

      set({
        currentWorkflow: data,
        nodes: parsedData.nodes || [],
        edges: parsedData.edges || [],
        isLoading: false
      });
    } catch (error) {
      console.error('Load workflow error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load workflow';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createWorkflow: async (name: string, description?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Test connection first
      const connectionOk = await testConnection();
      if (!connectionOk) {
        throw new Error('Unable to connect to Supabase. Please check your internet connection and Supabase configuration.');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const initialData = JSON.stringify({ nodes: [], edges: [] });

      const { data, error } = await supabase
        .from('workflows')
        .insert({
          id: workflowId,
          name,
          description,
          data: initialData,
          status: 'draft',
          size: 0,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to create workflow: ${error.message}`);
      }

      // Refresh workflows list
      await get().loadWorkflows();
      
      set({ isLoading: false });
      return data.id;
    } catch (error) {
      console.error('Create workflow error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create workflow';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  updateWorkflow: async (id: string, updates: Partial<Workflow>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Test connection first
      const connectionOk = await testConnection();
      if (!connectionOk) {
        throw new Error('Unable to connect to Supabase. Please check your internet connection and Supabase configuration.');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('workflows')
        .update(updates)
        .eq('id', id)
        .eq('created_by', user.id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to update workflow: ${error.message}`);
      }

      // Update local state
      const { currentWorkflow } = get();
      if (currentWorkflow && currentWorkflow.id === id) {
        set({ currentWorkflow: { ...currentWorkflow, ...updates } });
      }

      // Refresh workflows list
      await get().loadWorkflows();
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Update workflow error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update workflow';
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteWorkflow: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Test connection first
      const connectionOk = await testConnection();
      if (!connectionOk) {
        throw new Error('Unable to connect to Supabase. Please check your internet connection and Supabase configuration.');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to delete workflow: ${error.message}`);
      }

      // Clear current workflow if it was deleted
      const { currentWorkflow } = get();
      if (currentWorkflow && currentWorkflow.id === id) {
        set({ currentWorkflow: null, nodes: [], edges: [] });
      }

      // Refresh workflows list
      await get().loadWorkflows();
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Delete workflow error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete workflow';
      set({ error: errorMessage, isLoading: false });
    }
  },

  setNodes: (nodes: WorkflowNode[]) => set({ nodes }),
  setEdges: (edges: WorkflowEdge[]) => set({ edges }),

  addNode: (node: WorkflowNode) => {
    const { nodes } = get();
    set({ nodes: [...nodes, node] });
  },

  updateNode: (id: string, updates: Partial<WorkflowNode>) => {
    const { nodes } = get();
    set({
      nodes: nodes.map(node => 
        node.id === id ? { ...node, ...updates } : node
      )
    });
  },

  removeNode: (id: string) => {
    const { nodes, edges } = get();
    set({
      nodes: nodes.filter(node => node.id !== id),
      edges: edges.filter(edge => edge.source !== id && edge.target !== id)
    });
  },

  addEdge: (edge: WorkflowEdge) => {
    const { edges } = get();
    set({ edges: [...edges, edge] });
  },

  removeEdge: (id: string) => {
    const { edges } = get();
    set({ edges: edges.filter(edge => edge.id !== id) });
  }
}));