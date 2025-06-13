import { create } from 'zustand';
import { supabase, testConnection } from '../lib/supabase';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'ai' | 'webhook' | 'email' | 'data';
  position: { x: number; y: number };
  data: {
    label: string;
    icon?: string; // Changed from React.ReactNode to string to avoid serialization issues
    type: string;
    config: any;
    active: boolean;
    status: 'idle' | 'running' | 'success' | 'error';
    lastExecuted?: string;
    executionTime?: number;
    output?: any;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  animated?: boolean;
  data?: { status: 'idle' | 'running' | 'success' | 'error' };
}

export interface ExecutionLog {
  id: string;
  workflowId: string;
  nodeId: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  timestamp: string;
  duration?: number;
  data?: any;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport?: { x: number; y: number; zoom: number };
  settings: {
    autoSave: boolean;
    executionTimeout: number;
    retryAttempts: number;
    enableLogging: boolean;
    notifyOnError: boolean;
    notifyOnSuccess: boolean;
  };
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'paused' | 'error';
  size?: number;
  created_by?: string;
}

interface WorkflowState {
  workflows: any[];
  currentWorkflow: Workflow | null;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  isExecuting: boolean;
  executionProgress: number;
  executionLogs: ExecutionLog[];
  history: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }[];
  historyIndex: number;
  
  // Actions
  loadAllWorkflows: () => Promise<void>;
  createWorkflow: (name: string, description?: string) => Workflow;
  setCurrentWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, updates: any) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;
  saveWorkflow: (workflow: Workflow) => void;
  loadWorkflow: (id: string) => Workflow | null;
  
  // Node operations
  addNode: (node: WorkflowNode) => void;
  updateNode: (id: string, updates: Partial<WorkflowNode['data']>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  toggleNodeActive: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  
  // Edge operations
  addEdge: (edge: WorkflowEdge) => void;
  deleteEdge: (id: string) => void;
  validateConnection: (connection: any) => boolean;
  
  // Execution
  executeWorkflow: (workflowId: string) => Promise<void>;
  pauseExecution: () => void;
  stopExecution: () => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Settings
  updateSettings: (workflowId: string, settings: Partial<Workflow['settings']>) => void;
  resetSettings: (workflowId: string) => void;
  
  // Logs
  addLog: (log: Omit<ExecutionLog, 'id' | 'timestamp'>) => void;
  getLogsForWorkflow: (workflowId: string) => ExecutionLog[];
  clearLogs: (workflowId: string) => void;
}

// AI Agent for workflow execution
class WorkflowAgent {
  async executeNode(node: WorkflowNode, input: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      let result;
      
      switch (node.type) {
        case 'trigger':
          result = await this.executeTrigger(node, input);
          break;
        case 'action':
          result = await this.executeAction(node, input);
          break;
        case 'condition':
          result = await this.executeCondition(node, input);
          break;
        case 'delay':
          result = await this.executeDelay(node, input);
          break;
        case 'ai':
          result = await this.executeAI(node, input);
          break;
        case 'webhook':
          result = await this.executeWebhook(node, input);
          break;
        case 'email':
          result = await this.executeEmail(node, input);
          break;
        case 'data':
          result = await this.executeDataTransform(node, input);
          break;
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }
      
      const duration = Date.now() - startTime;
      
      return {
        success: true,
        data: result,
        duration,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  private async executeTrigger(node: WorkflowNode, input: any): Promise<any> {
    const { config } = node.data;
    
    switch (config.triggerType) {
      case 'manual':
        return { triggered: true, data: input || {} };
      case 'webhook':
        return { triggered: true, webhook_url: `https://api.flowmind.ai/webhook/${node.id}` };
      case 'schedule':
        return { triggered: true, next_run: new Date(Date.now() + 60000).toISOString() };
      case 'email':
        return { 
          triggered: true, 
          emails_monitored: config.emailFilter || 'all',
          last_check: new Date().toISOString()
        };
      default:
        return { triggered: true };
    }
  }
  
  private async executeAction(node: WorkflowNode, input: any): Promise<any> {
    const { config } = node.data;
    
    switch (config.actionType) {
      case 'email':
        return {
          email_sent: true,
          to: config.emailTo,
          subject: config.emailSubject,
          message_id: `msg_${Date.now()}`,
          sent_at: new Date().toISOString()
        };
      case 'slack':
        return {
          message_sent: true,
          channel: config.slackChannel,
          message_id: `slack_${Date.now()}`,
          sent_at: new Date().toISOString()
        };
      case 'database':
        return {
          record_updated: true,
          table: config.table || 'users',
          affected_rows: Math.floor(Math.random() * 5) + 1,
          updated_at: new Date().toISOString()
        };
      case 'api':
        return {
          api_called: true,
          endpoint: config.apiUrl || 'https://api.example.com/data',
          status_code: 200,
          response_time: Math.floor(Math.random() * 500) + 100
        };
      default:
        return { action_completed: true };
    }
  }
  
  private async executeCondition(node: WorkflowNode, input: any): Promise<any> {
    const { config } = node.data;
    const field = config.field || 'status';
    const value = config.value || 'active';
    const conditionType = config.conditionType || 'equals';
    
    let result = false;
    const inputValue = input?.[field];
    
    switch (conditionType) {
      case 'equals':
        result = inputValue === value;
        break;
      case 'contains':
        result = String(inputValue).includes(value);
        break;
      case 'greater':
        result = Number(inputValue) > Number(value);
        break;
      case 'less':
        result = Number(inputValue) < Number(value);
        break;
      case 'exists':
        result = inputValue !== undefined && inputValue !== null;
        break;
    }
    
    return {
      condition_result: result,
      field_checked: field,
      expected_value: value,
      actual_value: inputValue,
      condition_type: conditionType
    };
  }
  
  private async executeDelay(node: WorkflowNode, input: any): Promise<any> {
    const { config } = node.data;
    const duration = config.duration || 1;
    const unit = config.unit || 'seconds';
    
    let delayMs = duration * 1000; // Default to seconds
    
    switch (unit) {
      case 'minutes':
        delayMs = duration * 60 * 1000;
        break;
      case 'hours':
        delayMs = duration * 60 * 60 * 1000;
        break;
      case 'days':
        delayMs = duration * 24 * 60 * 60 * 1000;
        break;
    }
    
    // For demo, we'll simulate delay without actually waiting
    return {
      delay_completed: true,
      duration: `${duration} ${unit}`,
      delayed_until: new Date(Date.now() + delayMs).toISOString(),
      input_data: input
    };
  }
  
  private async executeAI(node: WorkflowNode, input: any): Promise<any> {
    const { config } = node.data;
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    switch (config.aiType) {
      case 'text_analysis':
        return {
          sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
          confidence: Math.round(Math.random() * 100),
          keywords: ['automation', 'workflow', 'efficiency'],
          summary: 'AI analysis completed successfully'
        };
      case 'data_extraction':
        return {
          extracted_data: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1-555-0123'
          },
          confidence: 95,
          fields_found: 3
        };
      case 'content_generation':
        return {
          generated_content: 'This is AI-generated content based on your input.',
          word_count: 12,
          tone: 'professional',
          language: 'en'
        };
      default:
        return {
          ai_processed: true,
          model_used: 'gpt-4',
          tokens_used: Math.floor(Math.random() * 1000) + 100
        };
    }
  }
  
  private async executeWebhook(node: WorkflowNode, input: any): Promise<any> {
    const { config } = node.data;
    
    // Simulate webhook call
    return {
      webhook_called: true,
      url: config.webhookUrl || 'https://api.example.com/webhook',
      method: config.method || 'POST',
      status_code: 200,
      response_time: Math.floor(Math.random() * 300) + 50,
      payload_sent: input
    };
  }
  
  private async executeEmail(node: WorkflowNode, input: any): Promise<any> {
    const { config } = node.data;
    
    return {
      email_processed: true,
      action: config.emailAction || 'send',
      recipient: config.recipient || 'user@example.com',
      subject: config.subject || 'Workflow Notification',
      delivery_status: 'delivered',
      message_id: `email_${Date.now()}`
    };
  }
  
  private async executeDataTransform(node: WorkflowNode, input: any): Promise<any> {
    const { config } = node.data;
    
    let transformedData = { ...input };
    
    if (config.transformType === 'map') {
      transformedData = {
        ...transformedData,
        mapped_at: new Date().toISOString(),
        original_keys: Object.keys(input || {}),
        transformed: true
      };
    } else if (config.transformType === 'filter') {
      transformedData = {
        filtered_data: transformedData,
        filter_applied: config.filterCondition || 'default',
        items_remaining: Math.floor(Math.random() * 10) + 1
      };
    }
    
    return transformedData;
  }
}

const workflowAgent = new WorkflowAgent();

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isExecuting: false,
  executionProgress: 0,
  executionLogs: [],
  history: [],
  historyIndex: -1,

  loadAllWorkflows: async () => {
    try {
      const stored = localStorage.getItem('flowmind_workflows');
      if (stored) {
        const workflows = JSON.parse(stored);
        set({ workflows });
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
    }
  },

  createWorkflow: (name: string, description?: string) => {
    const workflow: Workflow = {
      id: `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      nodes: [],
      edges: [],
      settings: {
        autoSave: true,
        executionTimeout: 300000,
        retryAttempts: 3,
        enableLogging: true,
        notifyOnError: true,
        notifyOnSuccess: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      size: 0,
    };

    const { workflows } = get();
    const updatedWorkflows = [...workflows, workflow];
    localStorage.setItem('flowmind_workflows', JSON.stringify(updatedWorkflows));
    
    set({ 
      workflows: updatedWorkflows,
      currentWorkflow: workflow,
      nodes: [],
      edges: []
    });
    
    return workflow;
  },

  setCurrentWorkflow: (workflow: Workflow) => {
    set({ 
      currentWorkflow: workflow,
      nodes: workflow.nodes,
      edges: workflow.edges
    });
  },

  updateWorkflow: async (id: string, updates: any) => {
    const { workflows, currentWorkflow } = get();
    const updatedWorkflows = workflows.map(w => 
      w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
    );
    
    localStorage.setItem('flowmind_workflows', JSON.stringify(updatedWorkflows));
    set({ workflows: updatedWorkflows });
    
    if (currentWorkflow?.id === id) {
      set({ currentWorkflow: { ...currentWorkflow, ...updates } });
    }
  },

  deleteWorkflow: async (id: string) => {
    const { workflows } = get();
    const updatedWorkflows = workflows.filter(w => w.id !== id);
    localStorage.setItem('flowmind_workflows', JSON.stringify(updatedWorkflows));
    set({ workflows: updatedWorkflows });
  },

  saveWorkflow: (workflow: Workflow) => {
    const { workflows } = get();
    const updatedWorkflow = {
      ...workflow,
      updatedAt: new Date().toISOString(),
      size: JSON.stringify(workflow).length
    };
    
    const updatedWorkflows = workflows.map(w => 
      w.id === workflow.id ? updatedWorkflow : w
    );
    
    if (!workflows.find(w => w.id === workflow.id)) {
      updatedWorkflows.push(updatedWorkflow);
    }
    
    localStorage.setItem('flowmind_workflows', JSON.stringify(updatedWorkflows));
    set({ workflows: updatedWorkflows, currentWorkflow: updatedWorkflow });
  },

  loadWorkflow: (id: string) => {
    const { workflows } = get();
    const workflow = workflows.find(w => w.id === id);
    if (workflow) {
      set({ 
        currentWorkflow: workflow,
        nodes: workflow.nodes,
        edges: workflow.edges
      });
    }
    return workflow || null;
  },

  addNode: (node: WorkflowNode) => {
    const { nodes, edges } = get();
    const newNodes = [...nodes, node];
    set({ nodes: newNodes });
    get().saveHistory(newNodes, edges);
  },

  updateNode: (id: string, updates: Partial<WorkflowNode['data']>) => {
    const { nodes, edges } = get();
    const newNodes = nodes.map(node => 
      node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
    );
    set({ nodes: newNodes });
    get().saveHistory(newNodes, edges);
  },

  deleteNode: (id: string) => {
    const { nodes, edges } = get();
    const newNodes = nodes.filter(node => node.id !== id);
    const newEdges = edges.filter(edge => edge.source !== id && edge.target !== id);
    set({ nodes: newNodes, edges: newEdges });
    get().saveHistory(newNodes, newEdges);
  },

  duplicateNode: (id: string) => {
    const { nodes, edges } = get();
    const node = nodes.find(n => n.id === id);
    if (node) {
      const newNode = {
        ...node,
        id: `${node.id}_copy_${Date.now()}`,
        position: { x: node.position.x + 50, y: node.position.y + 50 }
      };
      const newNodes = [...nodes, newNode];
      set({ nodes: newNodes });
      get().saveHistory(newNodes, edges);
    }
  },

  toggleNodeActive: (id: string) => {
    const { nodes, edges } = get();
    const newNodes = nodes.map(node => 
      node.id === id ? { ...node, data: { ...node.data, active: !node.data.active } } : node
    );
    set({ nodes: newNodes });
    get().saveHistory(newNodes, edges);
  },

  setSelectedNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  addEdge: (edge: WorkflowEdge) => {
    const { nodes, edges } = get();
    const newEdges = [...edges, edge];
    set({ edges: newEdges });
    get().saveHistory(nodes, newEdges);
  },

  deleteEdge: (id: string) => {
    const { nodes, edges } = get();
    const newEdges = edges.filter(edge => edge.id !== id);
    set({ edges: newEdges });
    get().saveHistory(nodes, newEdges);
  },

  validateConnection: (connection: any) => {
    const { nodes } = get();
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return false;
    if (sourceNode.id === targetNode.id) return false;
    
    return true;
  },

  executeWorkflow: async (workflowId: string) => {
    const { currentWorkflow, nodes, edges } = get();
    if (!currentWorkflow || currentWorkflow.id !== workflowId) return;

    set({ isExecuting: true, executionProgress: 0 });

    try {
      // Find trigger nodes
      const triggerNodes = nodes.filter(node => node.type === 'trigger' && node.data.active);
      
      if (triggerNodes.length === 0) {
        throw new Error('No active trigger nodes found');
      }

      let currentData = {};
      const totalNodes = nodes.filter(n => n.data.active).length;
      let executedNodes = 0;

      // Execute workflow starting from triggers
      for (const triggerNode of triggerNodes) {
        await get().executeNodeChain(triggerNode.id, currentData, totalNodes, executedNodes);
      }

      set({ isExecuting: false, executionProgress: 100 });
      
      get().addLog({
        workflowId,
        nodeId: 'workflow',
        status: 'success',
        message: 'Workflow executed successfully',
        duration: 5000
      });

    } catch (error) {
      set({ isExecuting: false, executionProgress: 0 });
      
      get().addLog({
        workflowId,
        nodeId: 'workflow',
        status: 'error',
        message: error instanceof Error ? error.message : 'Workflow execution failed'
      });
    }
  },

  executeNodeChain: async (nodeId: string, inputData: any, totalNodes: number, executedCount: number) => {
    const { nodes, edges, currentWorkflow } = get();
    const node = nodes.find(n => n.id === nodeId);
    
    if (!node || !node.data.active || !currentWorkflow) return inputData;

    // Update node status
    get().updateNode(nodeId, { status: 'running' });

    try {
      // Execute the node
      const result = await workflowAgent.executeNode(node, inputData);
      
      if (result.success) {
        get().updateNode(nodeId, { 
          status: 'success',
          lastExecuted: result.timestamp,
          executionTime: result.duration,
          output: result.data
        });

        get().addLog({
          workflowId: currentWorkflow.id,
          nodeId,
          status: 'success',
          message: `${node.data.label} executed successfully`,
          duration: result.duration,
          data: result.data
        });

        // Update progress
        const progress = Math.round(((executedCount + 1) / totalNodes) * 100);
        set({ executionProgress: progress });

        // Find and execute next nodes
        const outgoingEdges = edges.filter(edge => edge.source === nodeId);
        let outputData = result.data;

        for (const edge of outgoingEdges) {
          // For condition nodes, check which path to take
          if (node.type === 'condition') {
            const conditionResult = result.data?.condition_result;
            if (edge.sourceHandle === 'true' && !conditionResult) continue;
            if (edge.sourceHandle === 'false' && conditionResult) continue;
          }

          outputData = await get().executeNodeChain(edge.target, outputData, totalNodes, executedCount + 1);
        }

        return outputData;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      get().updateNode(nodeId, { status: 'error' });
      
      get().addLog({
        workflowId: currentWorkflow.id,
        nodeId,
        status: 'error',
        message: error instanceof Error ? error.message : 'Node execution failed'
      });

      throw error;
    }
  },

  pauseExecution: () => {
    set({ isExecuting: false });
  },

  stopExecution: () => {
    set({ isExecuting: false, executionProgress: 0 });
    
    // Reset all node statuses
    const { nodes } = get();
    const resetNodes = nodes.map(node => ({
      ...node,
      data: { ...node.data, status: 'idle' as const }
    }));
    set({ nodes: resetNodes });
  },

  saveHistory: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    
    // Limit history to 50 entries
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({ 
      history: newHistory, 
      historyIndex: newHistory.length - 1 
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      set({ 
        nodes: prevState.nodes,
        edges: prevState.edges,
        historyIndex: historyIndex - 1
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({ 
        nodes: nextState.nodes,
        edges: nextState.edges,
        historyIndex: historyIndex + 1
      });
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

  updateSettings: (workflowId: string, settings: Partial<Workflow['settings']>) => {
    const { currentWorkflow } = get();
    if (currentWorkflow && currentWorkflow.id === workflowId) {
      const updatedWorkflow = {
        ...currentWorkflow,
        settings: { ...currentWorkflow.settings, ...settings }
      };
      set({ currentWorkflow: updatedWorkflow });
      get().saveWorkflow(updatedWorkflow);
    }
  },

  resetSettings: (workflowId: string) => {
    const defaultSettings = {
      autoSave: true,
      executionTimeout: 300000,
      retryAttempts: 3,
      enableLogging: true,
      notifyOnError: true,
      notifyOnSuccess: false,
    };
    get().updateSettings(workflowId, defaultSettings);
  },

  addLog: (log: Omit<ExecutionLog, 'id' | 'timestamp'>) => {
    const { executionLogs } = get();
    const newLog: ExecutionLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    const updatedLogs = [newLog, ...executionLogs].slice(0, 1000); // Keep last 1000 logs
    set({ executionLogs: updatedLogs });
  },

  getLogsForWorkflow: (workflowId: string) => {
    const { executionLogs } = get();
    return executionLogs.filter(log => log.workflowId === workflowId);
  },

  clearLogs: (workflowId: string) => {
    const { executionLogs } = get();
    const filteredLogs = executionLogs.filter(log => log.workflowId !== workflowId);
    set({ executionLogs: filteredLogs });
  }
}));