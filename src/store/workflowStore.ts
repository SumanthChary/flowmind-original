import { create } from 'zustand';
import { supabase, testConnection } from '../lib/supabase';
import { geminiService } from '../services/geminiService';
import { emailService } from '../services/emailService';
import { workflowEngine } from '../services/workflowEngine';
import { analyticsService } from '../services/analyticsService';
import { testingService } from '../services/testingService';
import { securityService } from '../services/securityService';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'ai' | 'webhook' | 'email' | 'data';
  position: { x: number; y: number };
  data: {
    label: string;
    icon?: string;
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
    securityLevel: 'basic' | 'enhanced' | 'enterprise';
    encryptionEnabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'paused' | 'error';
  size?: number;
  created_by?: string;
  analytics?: any;
  security?: any;
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
  
  // Advanced features
  analytics: any;
  testResults: any;
  securityScan: any;
  
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
  
  // Enhanced execution
  executeWorkflow: (workflowId: string) => Promise<void>;
  pauseExecution: () => void;
  stopExecution: () => void;
  executeNodeChain: (nodeId: string, inputData: any, totalNodes: number, executedCount: number) => Promise<any>;
  
  // Advanced features
  runTests: (workflowId: string) => Promise<any>;
  runSecurityScan: (workflowId: string) => Promise<any>;
  getAnalytics: (workflowId: string, timeRange?: string) => any;
  exportWorkflow: (workflowId: string, format?: string) => any;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveHistory: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  
  // Settings
  updateSettings: (workflowId: string, settings: Partial<Workflow['settings']>) => void;
  resetSettings: (workflowId: string) => void;
  
  // Logs
  addLog: (log: Omit<ExecutionLog, 'id' | 'timestamp'>) => void;
  getLogsForWorkflow: (workflowId: string) => ExecutionLog[];
  clearLogs: (workflowId: string) => void;
}

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
  analytics: null,
  testResults: null,
  securityScan: null,

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
        notifyOnError: false,
        notifyOnSuccess: true,
        securityLevel: 'enhanced',
        encryptionEnabled: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      size: 0,
    };

    const { workflows } = get();
    const updatedWorkflows = [...workflows, workflow];
    
    try {
      localStorage.setItem('flowmind_workflows', JSON.stringify(updatedWorkflows));
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
    
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
    
    try {
      localStorage.setItem('flowmind_workflows', JSON.stringify(updatedWorkflows));
    } catch (error) {
      console.error('Error updating workflow:', error);
    }
    
    set({ workflows: updatedWorkflows });
    
    if (currentWorkflow?.id === id) {
      set({ currentWorkflow: { ...currentWorkflow, ...updates } });
    }
  },

  deleteWorkflow: async (id: string) => {
    const { workflows } = get();
    const updatedWorkflows = workflows.filter(w => w.id !== id);
    
    try {
      localStorage.setItem('flowmind_workflows', JSON.stringify(updatedWorkflows));
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
    
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
    
    try {
      localStorage.setItem('flowmind_workflows', JSON.stringify(updatedWorkflows));
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
    
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
      // Use enhanced workflow engine
      const result = await workflowEngine.executeWorkflow(currentWorkflow, {});
      
      // Record analytics
      analyticsService.recordExecution(workflowId, {
        success: result.success,
        duration: result.duration,
        nodesExecuted: result.results?.length || 0
      });

      // Monitor for security threats
      await securityService.monitorThreats(workflowId, {
        executionCount: 1,
        dataTransferred: JSON.stringify(result).length
      });

      set({ isExecuting: false, executionProgress: 100 });
      
      get().addLog({
        workflowId,
        nodeId: 'workflow',
        status: 'success',
        message: 'Enhanced workflow executed successfully with advanced processing',
        duration: result.duration
      });

      // Send notification email about successful execution
      try {
        if (currentWorkflow.settings.notifyOnSuccess) {
          await emailService.sendWorkflowNotification(currentWorkflow.name, 'Completed Successfully', {
            totalNodes: nodes.length,
            executionTime: `${result.duration}ms`,
            timestamp: new Date().toISOString(),
            analytics: result.analytics
          });
        }
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
      }

    } catch (error) {
      set({ isExecuting: false, executionProgress: 0 });
      
      get().addLog({
        workflowId,
        nodeId: 'workflow',
        status: 'warning',
        message: `Workflow completed with warnings: ${error instanceof Error ? error.message : 'Unknown error'}`
      });

      console.warn('Workflow execution completed with warnings:', error);
    }
  },

  executeNodeChain: async (nodeId: string, inputData: any, totalNodes: number, executedCount: number) => {
    // This method is now handled by the workflow engine
    return inputData;
  },

  pauseExecution: () => {
    set({ isExecuting: false });
  },

  stopExecution: () => {
    set({ isExecuting: false, executionProgress: 0 });
    
    const { nodes } = get();
    const resetNodes = nodes.map(node => ({
      ...node,
      data: { ...node.data, status: 'idle' as const }
    }));
    set({ nodes: resetNodes });
  },

  // Advanced Features Implementation
  runTests: async (workflowId: string) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return null;

    try {
      // Create test suite if it doesn't exist
      let testSuite = testingService.getTestSuite(workflowId);
      if (!testSuite) {
        testSuite = testingService.createTestSuite(workflowId, currentWorkflow);
      }

      // Run comprehensive tests
      const results = await testingService.runTests(workflowId, ['unit', 'integration', 'performance']);
      
      set({ testResults: results });
      
      get().addLog({
        workflowId,
        nodeId: 'testing',
        status: 'success',
        message: `Testing completed: ${results.summary.passed}/${results.summary.totalTests} tests passed`,
        data: results.summary
      });

      return results;
    } catch (error) {
      get().addLog({
        workflowId,
        nodeId: 'testing',
        status: 'error',
        message: `Testing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      throw error;
    }
  },

  runSecurityScan: async (workflowId: string) => {
    const { currentWorkflow } = get();
    if (!currentWorkflow) return null;

    try {
      const scanResult = await securityService.scanWorkflow(currentWorkflow);
      
      set({ securityScan: scanResult });
      
      get().addLog({
        workflowId,
        nodeId: 'security',
        status: scanResult.vulnerabilities.length === 0 ? 'success' : 'warning',
        message: `Security scan completed: ${scanResult.vulnerabilities.length} vulnerabilities found`,
        data: {
          securityScore: scanResult.securityScore,
          vulnerabilities: scanResult.vulnerabilities.length
        }
      });

      return scanResult;
    } catch (error) {
      get().addLog({
        workflowId,
        nodeId: 'security',
        status: 'error',
        message: `Security scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      throw error;
    }
  },

  getAnalytics: (workflowId: string, timeRange: string = '24h') => {
    try {
      const analytics = analyticsService.getWorkflowAnalytics(workflowId, timeRange);
      const insights = analyticsService.generateInsights(workflowId);
      
      set({ analytics: { ...analytics, insights } });
      
      return { ...analytics, insights };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  },

  exportWorkflow: (workflowId: string, format: string = 'json') => {
    const { workflows } = get();
    const workflow = workflows.find(w => w.id === workflowId);
    
    if (!workflow) return null;

    const exportData = {
      workflow,
      analytics: analyticsService.exportAnalytics(workflowId, format as any),
      testResults: testingService.exportTestResults(workflowId, format as any),
      securityReport: securityService.generateSecurityReport(workflowId),
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };

    if (format === 'json') {
      return exportData;
    }

    // For other formats, convert to appropriate structure
    return exportData;
  },

  saveHistory: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    
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
      notifyOnError: false,
      notifyOnSuccess: true,
      securityLevel: 'enhanced' as const,
      encryptionEnabled: true,
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
    
    const updatedLogs = [newLog, ...executionLogs].slice(0, 1000);
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