import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import WorkflowBuilder from '../components/workflow/WorkflowBuilder';

const WorkflowBuilderPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Workflow Builder | FlowMind";
  }, []);

  const handleSave = (workflow: any) => {
    console.log('Saving workflow:', workflow);
    // Here you would typically save to your backend/database
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-accent-600 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Auto-saved 2 minutes ago</span>
        </div>
      </div>

      {/* Workflow Builder */}
      <div className="flex-1">
        <WorkflowBuilder onSave={handleSave} />
      </div>
    </div>
  );
};

export default WorkflowBuilderPage;