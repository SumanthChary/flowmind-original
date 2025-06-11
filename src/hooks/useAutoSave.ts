import { useEffect, useRef, useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { workflowService } from '../services/workflowService';
import toast from 'react-hot-toast';

interface UseAutoSaveOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
  createVersionOnSave?: boolean;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export const useAutoSave = (options: UseAutoSaveOptions = {}) => {
  const {
    enabled = true,
    interval = 30000, // 30 seconds default
    createVersionOnSave = false,
    onSaveSuccess,
    onSaveError
  } = options;

  const { currentWorkflow } = useWorkflowStore();
  const lastSavedRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const isSavingRef = useRef(false);

  const saveWorkflow = useCallback(async (immediate = false) => {
    if (!currentWorkflow || isSavingRef.current) return;

    const currentData = JSON.stringify({
      nodes: currentWorkflow.nodes,
      edges: currentWorkflow.edges,
      settings: currentWorkflow.settings
    });

    // Skip if no changes
    if (currentData === lastSavedRef.current && !immediate) return;

    try {
      isSavingRef.current = true;
      
      await workflowService.autoSave(currentWorkflow, {
        immediate,
        createVersion: createVersionOnSave
      });

      lastSavedRef.current = currentData;
      onSaveSuccess?.();
      
      if (immediate) {
        toast.success('Workflow saved successfully');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Save failed');
      onSaveError?.(err);
      
      if (immediate) {
        toast.error(`Failed to save: ${err.message}`);
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [currentWorkflow, createVersionOnSave, onSaveSuccess, onSaveError]);

  const scheduleAutoSave = useCallback(() => {
    if (!enabled || !currentWorkflow) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveWorkflow(false);
    }, interval);
  }, [enabled, currentWorkflow, interval, saveWorkflow]);

  // Auto-save when workflow changes
  useEffect(() => {
    if (enabled && currentWorkflow) {
      scheduleAutoSave();
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentWorkflow?.nodes, currentWorkflow?.edges, currentWorkflow?.settings, scheduleAutoSave]);

  // Save immediately when component unmounts
  useEffect(() => {
    return () => {
      if (currentWorkflow && enabled) {
        saveWorkflow(true);
      }
    };
  }, []);

  const forceSave = useCallback(() => {
    return saveWorkflow(true);
  }, [saveWorkflow]);

  const isUnsaved = useCallback(() => {
    if (!currentWorkflow) return false;
    
    const currentData = JSON.stringify({
      nodes: currentWorkflow.nodes,
      edges: currentWorkflow.edges,
      settings: currentWorkflow.settings
    });
    
    return currentData !== lastSavedRef.current;
  }, [currentWorkflow]);

  return {
    forceSave,
    isUnsaved,
    isSaving: isSavingRef.current
  };
};