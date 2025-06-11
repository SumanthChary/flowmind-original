import { supabase } from '../lib/supabase';
import { Workflow, WorkflowNode, WorkflowEdge } from '../store/workflowStore';

// Compression utilities
const compressWorkflow = (workflow: Workflow): string => {
  const essentialData = {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
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
    settings: workflow.settings,
    status: workflow.status
  };
  
  return JSON.stringify(essentialData);
};

const decompressWorkflow = (compressed: string): Partial<Workflow> => {
  try {
    return JSON.parse(compressed);
  } catch (error) {
    throw new Error('Failed to decompress workflow data');
  }
};

// Debounced save function
let saveTimeout: NodeJS.Timeout;
const debouncedSave = (workflowId: string, data: string, delay: number = 2000) => {
  return new Promise<void>((resolve, reject) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      try {
        await saveWorkflowToDatabase(workflowId, data);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
};

// Cache management
interface CacheEntry {
  data: Workflow;
  timestamp: number;
  version: number;
}

class WorkflowCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  set(workflowId: string, workflow: Workflow, version: number): void {
    this.cache.set(workflowId, {
      data: workflow,
      timestamp: Date.now(),
      version
    });
  }

  get(workflowId: string): CacheEntry | null {
    const entry = this.cache.get(workflowId);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(workflowId);
      return null;
    }
    
    return entry;
  }

  invalidate(workflowId: string): void {
    this.cache.delete(workflowId);
  }

  clear(): void {
    this.cache.clear();
  }
}

const workflowCache = new WorkflowCache();

// Database operations
const saveWorkflowToDatabase = async (workflowId: string, compressedData: string): Promise<void> => {
  const { error } = await supabase
    .from('workflows')
    .upsert({
      id: workflowId,
      data: compressedData,
      updated_at: new Date().toISOString(),
      size: new Blob([compressedData]).size
    });

  if (error) throw error;
};

const loadWorkflowFromDatabase = async (workflowId: string): Promise<Workflow | null> => {
  const { data, error } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', workflowId)
    .single();

  if (error || !data) return null;
  
  const decompressed = decompressWorkflow(data.data);
  return {
    ...decompressed,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Workflow;
};

// Version control
interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;
  data: string;
  createdAt: string;
  createdBy: string;
  message?: string;
}

const createVersion = async (
  workflowId: string, 
  workflow: Workflow, 
  message?: string
): Promise<WorkflowVersion> => {
  const compressedData = compressWorkflow(workflow);
  
  // Get current version number
  const { data: versions } = await supabase
    .from('workflow_versions')
    .select('version')
    .eq('workflow_id', workflowId)
    .order('version', { ascending: false })
    .limit(1);

  const nextVersion = versions && versions.length > 0 ? versions[0].version + 1 : 1;

  const versionData = {
    id: `${workflowId}-v${nextVersion}`,
    workflow_id: workflowId,
    version: nextVersion,
    data: compressedData,
    created_at: new Date().toISOString(),
    created_by: (await supabase.auth.getUser()).data.user?.id || 'anonymous',
    message: message || `Version ${nextVersion}`
  };

  const { data, error } = await supabase
    .from('workflow_versions')
    .insert(versionData)
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    workflowId: data.workflow_id,
    version: data.version,
    data: data.data,
    createdAt: data.created_at,
    createdBy: data.created_by,
    message: data.message
  };
};

const getVersionHistory = async (workflowId: string): Promise<WorkflowVersion[]> => {
  const { data, error } = await supabase
    .from('workflow_versions')
    .select('*')
    .eq('workflow_id', workflowId)
    .order('version', { ascending: false });

  if (error) throw error;
  
  return data.map(v => ({
    id: v.id,
    workflowId: v.workflow_id,
    version: v.version,
    data: v.data,
    createdAt: v.created_at,
    createdBy: v.created_by,
    message: v.message
  }));
};

const restoreVersion = async (workflowId: string, version: number): Promise<Workflow> => {
  const { data, error } = await supabase
    .from('workflow_versions')
    .select('data')
    .eq('workflow_id', workflowId)
    .eq('version', version)
    .single();

  if (error || !data) throw new Error('Version not found');
  
  const workflow = decompressWorkflow(data.data) as Workflow;
  
  // Save as current version
  await saveWorkflowToDatabase(workflowId, data.data);
  workflowCache.invalidate(workflowId);
  
  return workflow;
};

// Collaborative editing
interface CollaborationSession {
  workflowId: string;
  userId: string;
  userName: string;
  lastSeen: string;
  cursor?: { x: number; y: number };
  selection?: string[];
}

const joinCollaboration = async (workflowId: string): Promise<void> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const sessionData = {
    workflow_id: workflowId,
    user_id: user.id,
    user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
    last_seen: new Date().toISOString()
  };

  await supabase
    .from('collaboration_sessions')
    .upsert(sessionData);
};

const leaveCollaboration = async (workflowId: string): Promise<void> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return;

  await supabase
    .from('collaboration_sessions')
    .delete()
    .eq('workflow_id', workflowId)
    .eq('user_id', user.id);
};

const getActiveCollaborators = async (workflowId: string): Promise<CollaborationSession[]> => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('collaboration_sessions')
    .select('*')
    .eq('workflow_id', workflowId)
    .gte('last_seen', fiveMinutesAgo);

  if (error) throw error;
  
  return data.map(s => ({
    workflowId: s.workflow_id,
    userId: s.user_id,
    userName: s.user_name,
    lastSeen: s.last_seen,
    cursor: s.cursor,
    selection: s.selection
  }));
};

// Real-time updates
const subscribeToWorkflowChanges = (
  workflowId: string,
  onUpdate: (workflow: Workflow) => void,
  onCollaboratorUpdate: (collaborators: CollaborationSession[]) => void
) => {
  const workflowSubscription = supabase
    .channel(`workflow-${workflowId}`)
    .on('postgres_changes', 
      { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'workflows',
        filter: `id=eq.${workflowId}`
      }, 
      async (payload) => {
        const workflow = decompressWorkflow(payload.new.data) as Workflow;
        workflowCache.set(workflowId, workflow, payload.new.version || 1);
        onUpdate(workflow);
      }
    )
    .subscribe();

  const collaborationSubscription = supabase
    .channel(`collaboration-${workflowId}`)
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'collaboration_sessions',
        filter: `workflow_id=eq.${workflowId}`
      },
      async () => {
        const collaborators = await getActiveCollaborators(workflowId);
        onCollaboratorUpdate(collaborators);
      }
    )
    .subscribe();

  return () => {
    workflowSubscription.unsubscribe();
    collaborationSubscription.unsubscribe();
  };
};

// Validation
const validateWorkflow = (workflow: Workflow): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check workflow size
  const size = new Blob([compressWorkflow(workflow)]).size;
  if (size > 1024 * 1024) { // 1MB limit
    errors.push('Workflow exceeds maximum size of 1MB');
  }
  
  // Check for orphaned nodes
  const nodeIds = new Set(workflow.nodes.map(n => n.id));
  const connectedNodes = new Set();
  
  workflow.edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
    
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge references non-existent source node: ${edge.source}`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge references non-existent target node: ${edge.target}`);
    }
  });
  
  // Check for circular dependencies
  const hasCircularDependency = (nodeId: string, visited: Set<string>, path: Set<string>): boolean => {
    if (path.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    
    visited.add(nodeId);
    path.add(nodeId);
    
    const outgoingEdges = workflow.edges.filter(e => e.source === nodeId);
    for (const edge of outgoingEdges) {
      if (hasCircularDependency(edge.target, visited, path)) {
        return true;
      }
    }
    
    path.delete(nodeId);
    return false;
  };
  
  const visited = new Set<string>();
  for (const node of workflow.nodes) {
    if (!visited.has(node.id) && hasCircularDependency(node.id, visited, new Set())) {
      errors.push('Workflow contains circular dependencies');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Main service interface
export const workflowService = {
  // Auto-save functionality
  autoSave: async (workflow: Workflow, options: { immediate?: boolean; createVersion?: boolean } = {}) => {
    const validation = validateWorkflow(workflow);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    const compressedData = compressWorkflow(workflow);
    
    if (options.immediate) {
      await saveWorkflowToDatabase(workflow.id, compressedData);
    } else {
      await debouncedSave(workflow.id, compressedData);
    }
    
    if (options.createVersion) {
      await createVersion(workflow.id, workflow);
    }
    
    workflowCache.set(workflow.id, workflow, Date.now());
  },

  // Load with caching
  load: async (workflowId: string): Promise<Workflow | null> => {
    // Check cache first
    const cached = workflowCache.get(workflowId);
    if (cached) {
      return cached.data;
    }
    
    // Load from database
    const workflow = await loadWorkflowFromDatabase(workflowId);
    if (workflow) {
      workflowCache.set(workflowId, workflow, 1);
    }
    
    return workflow;
  },

  // List workflows with pagination and filtering
  list: async (options: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'name' | 'updated_at' | 'created_at';
    sortOrder?: 'asc' | 'desc';
    status?: string;
  } = {}) => {
    const {
      page = 1,
      limit = 20,
      search = '',
      sortBy = 'updated_at',
      sortOrder = 'desc',
      status
    } = options;

    let query = supabase
      .from('workflows')
      .select('id, name, description, created_at, updated_at, status, size', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      workflows: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  },

  // Version control
  versions: {
    create: createVersion,
    list: getVersionHistory,
    restore: restoreVersion
  },

  // Collaboration
  collaboration: {
    join: joinCollaboration,
    leave: leaveCollaboration,
    getActive: getActiveCollaborators,
    subscribe: subscribeToWorkflowChanges
  },

  // Validation
  validate: validateWorkflow,

  // Cache management
  cache: {
    invalidate: (workflowId: string) => workflowCache.invalidate(workflowId),
    clear: () => workflowCache.clear()
  }
};