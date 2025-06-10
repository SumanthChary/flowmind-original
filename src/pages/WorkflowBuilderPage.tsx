import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Play, Settings, Clock } from 'lucide-react';
import WorkflowBuilder from '../components/workflow/WorkflowBuilder';
import { useWorkflowStore } from '../store/workflowStore';
import toast from 'react-hot-toast';

const WorkflowBuilderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('id');
  
  const { 
    currentWorkflow, 
    createWorkflow, 
    loadWorkflow, 
    setCurrentWorkflow,
    saveWorkflow 
  } = useWorkflowStore();

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    document.title = "Workflow Builder | FlowMind";
    
    if (workflowId) {
      // Load existing workflow
      const workflow = loadWorkflow(workflowId);
      if (!workflow) {
        toast.error('Workflow not found');
        navigate('/dashboard');
      }
    } else {
      // Create new workflow
      if (!currentWorkflow) {
        const newWorkflow = createWorkflow('Untitled Workflow', 'A new automation workflow');
        setCurrentWorkflow(newWorkflow);
      }
    }
  }, [workflowId, navigate, loadWorkflow, createWorkflow, currentWorkflow, setCurrentWorkflow]);

  const handleSave = (workflow: any) => {
    saveWorkflow(workflow);
    setLastSaved(new Date());
  };

  const getLastSavedText = () => {
    if (!lastSaved) return 'Never saved';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Saved just now';
    if (diffMins === 1) return 'Saved 1 minute ago';
    if (diffMins < 60) return `Saved ${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return 'Saved 1 hour ago';
    if (diffHours < 24) return `Saved ${diffHours} hours ago`;
    
    return lastSaved.toLocaleDateString();
  };

  if (!currentWorkflow) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-accent-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentWorkflow.name}
            </h1>
            {currentWorkflow.description && (
              <p className="text-sm text-gray-600">{currentWorkflow.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 flex items-center">
            <Clock size={16} className="mr-1" />
            {getLastSavedText()}
          </span>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentWorkflow.status === 'active' ? 'bg-success-100 text-success-700' :
              currentWorkflow.status === 'paused' ? 'bg-warning-100 text-warning-700' :
              currentWorkflow.status === 'error' ? 'bg-error-100 text-error-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {currentWorkflow.status}
            </span>
          </div>
        </div>
      </div>

      {/* Workflow Builder */}
      <div className="flex-1">
        <WorkflowBuilder 
          workflowId={currentWorkflow.id}
          onSave={handleSave} 
        />
      </div>
    </div>
  );
};

export default WorkflowBuilderPage;