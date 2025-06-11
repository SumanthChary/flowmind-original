import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Menu, X } from 'lucide-react';
import EnhancedWorkflowBuilder from '../components/workflow/EnhancedWorkflowBuilder';
import { useWorkflowStore } from '../store/workflowStore';
import toast from 'react-hot-toast';

const WorkflowBuilderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('id');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { 
    currentWorkflow, 
    createWorkflow, 
    loadWorkflow, 
    updateWorkflow 
  } = useWorkflowStore();

  useEffect(() => {
    document.title = "Workflow Builder | FlowMind";
    
    if (workflowId) {
      loadWorkflow(workflowId);
    } else if (!currentWorkflow) {
      const initWorkflow = async () => {
        const newId = await createWorkflow('Untitled Workflow', 'A new automation workflow');
        if (newId) {
          navigate(`/workflow-builder?id=${newId}`, { replace: true });
        }
      };
      initWorkflow();
    }
  }, [workflowId, navigate, loadWorkflow, createWorkflow, currentWorkflow]);

  const handleSave = async (workflow: any) => {
    if (currentWorkflow) {
      await updateWorkflow(currentWorkflow.id, {
        name: workflow.name,
        description: workflow.description,
        data: JSON.stringify({ nodes: workflow.nodes, edges: workflow.edges }),
        updated_at: new Date().toISOString()
      });
      toast.success('Workflow saved!');
    }
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-accent-600 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Back</span>
        </button>
        
        <h1 className="text-lg font-semibold text-gray-900 truncate mx-4">
          {currentWorkflow.name}
        </h1>
        
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4 items-center justify-between">
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
            <p className="text-sm text-gray-600">
              {currentWorkflow.description || 'No description'}
            </p>
          </div>
        </div>
        
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-xl p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Workflow Info</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium inline-block ${
                  currentWorkflow.status === 'active' ? 'bg-success-100 text-success-700' :
                  currentWorkflow.status === 'paused' ? 'bg-warning-100 text-warning-700' :
                  currentWorkflow.status === 'error' ? 'bg-error-100 text-error-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {currentWorkflow.status}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-600">
                  {currentWorkflow.description || 'No description'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Workflow Builder */}
      <div className="flex-1 overflow-hidden">
        <EnhancedWorkflowBuilder 
          workflowId={currentWorkflow.id}
          onSave={handleSave} 
        />
      </div>
    </div>
  );
};

export default WorkflowBuilderPage;