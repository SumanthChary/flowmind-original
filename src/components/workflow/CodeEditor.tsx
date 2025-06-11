import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Play, 
  Save, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle,
  X,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  onSave?: (code: string) => void;
  title?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  isOpen, 
  onClose, 
  initialCode = '', 
  onSave,
  title = 'JavaScript Code Editor'
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const defaultCode = `// FlowMind Custom Function
// Available variables: $input, $node, $workflow

function processData(input) {
  try {
    // Your custom logic here
    const result = {
      processed: true,
      timestamp: new Date().toISOString(),
      data: input
    };
    
    // Example: Process email data
    if (input.email) {
      result.emailDomain = input.email.split('@')[1];
      result.isBusinessEmail = !['gmail.com', 'yahoo.com', 'hotmail.com'].includes(result.emailDomain);
    }
    
    // Example: Data validation
    if (input.amount && typeof input.amount === 'number') {
      result.category = input.amount > 1000 ? 'high-value' : 'standard';
    }
    
    return result;
  } catch (error) {
    return {
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Test the function
const testInput = {
  email: 'user@company.com',
  amount: 1500,
  name: 'John Doe'
};

return processData(testInput);`;

  const runCode = async () => {
    setIsRunning(true);
    setHasError(false);
    setOutput('');

    try {
      // Create a safe execution environment
      const safeCode = `
        (function() {
          // Mock workflow context
          const $input = {
            email: 'test@example.com',
            amount: 750,
            name: 'Test User',
            items: ['item1', 'item2', 'item3']
          };
          
          const $node = {
            id: 'test-node',
            type: 'function',
            name: 'Custom Function'
          };
          
          const $workflow = {
            id: 'test-workflow',
            name: 'Test Workflow'
          };
          
          // User code
          ${code}
        })()
      `;

      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Execute the code
      const result = eval(safeCode);
      
      setOutput(JSON.stringify(result, null, 2));
      setHasError(false);
      toast.success('Code executed successfully!');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setHasError(true);
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(code);
      toast.success('Code saved successfully!');
    } else {
      // Save to localStorage as fallback
      localStorage.setItem('flowmind-custom-code', code);
      toast.success('Code saved to local storage!');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    setCode(defaultCode);
    setOutput('');
    setHasError(false);
  };

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + snippet + code.substring(end);
      setCode(newCode);
      
      // Set cursor position after inserted snippet
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + snippet.length, start + snippet.length);
      }, 0);
    }
  };

  const snippets = [
    {
      name: 'HTTP Request',
      code: `// Make HTTP request
const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + $input.token
  },
  body: JSON.stringify($input.data)
});

const result = await response.json();
return result;`
    },
    {
      name: 'Data Validation',
      code: `// Validate input data
function validateData(data) {
  const errors = [];
  
  if (!data.email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    data: data
  };
}

return validateData($input);`
    },
    {
      name: 'Date Processing',
      code: `// Process dates
const now = new Date();
const inputDate = new Date($input.date);

return {
  current: now.toISOString(),
  input: inputDate.toISOString(),
  daysDifference: Math.floor((now - inputDate) / (1000 * 60 * 60 * 24)),
  isWeekend: [0, 6].includes(inputDate.getDay()),
  quarter: Math.floor(inputDate.getMonth() / 3) + 1
};`
    }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed inset-4 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col ${
        isMaximized ? 'inset-2' : 'max-w-6xl max-h-[80vh] mx-auto my-auto'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
            <Code size={18} className="text-accent-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-600">Write custom JavaScript functions for your workflow</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with snippets */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
          <h4 className="font-medium text-gray-900 mb-3">Code Snippets</h4>
          <div className="space-y-2">
            {snippets.map((snippet, index) => (
              <button
                key={index}
                onClick={() => insertSnippet(snippet.code)}
                className="w-full text-left p-2 text-sm bg-white border border-gray-200 rounded hover:border-accent-300 hover:bg-accent-50 transition-colors"
              >
                {snippet.name}
              </button>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Available Variables</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-white p-2 rounded border">
                <code className="text-accent-600">$input</code>
                <p className="text-gray-600 mt-1">Input data from previous node</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <code className="text-accent-600">$node</code>
                <p className="text-gray-600 mt-1">Current node information</p>
              </div>
              <div className="bg-white p-2 rounded border">
                <code className="text-accent-600">$workflow</code>
                <p className="text-gray-600 mt-1">Workflow context and metadata</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main editor area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center px-3 py-1.5 bg-success-600 text-white rounded hover:bg-success-700 transition-colors disabled:opacity-50 text-sm"
              >
                <Play size={14} className="mr-1" />
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-3 py-1.5 bg-accent-600 text-white rounded hover:bg-accent-700 transition-colors text-sm"
              >
                <Save size={14} className="mr-1" />
                Save
              </button>
              <button
                onClick={copyCode}
                className="flex items-center px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
              >
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={resetCode}
                className="flex items-center px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
              >
                <RotateCcw size={14} className="mr-1" />
                Reset
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Lines: {code.split('\n').length} | Characters: {code.length}
            </div>
          </div>

          {/* Code editor */}
          <div className="flex-1 flex">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm border-none resize-none focus:outline-none bg-gray-900 text-green-400"
                placeholder="Write your JavaScript code here..."
                spellCheck={false}
                style={{
                  tabSize: 2,
                  lineHeight: '1.5'
                }}
              />
              {/* Line numbers */}
              <div className="absolute left-0 top-0 p-4 text-gray-500 text-sm font-mono pointer-events-none select-none">
                {code.split('\n').map((_, index) => (
                  <div key={index} style={{ lineHeight: '1.5' }}>
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Output panel */}
            <div className="w-1/3 border-l border-gray-200 flex flex-col">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-2">
                  {hasError ? (
                    <AlertCircle size={16} className="text-error-600" />
                  ) : (
                    <CheckCircle size={16} className="text-success-600" />
                  )}
                  <span className="font-medium text-sm">
                    {hasError ? 'Error' : 'Output'}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                {output ? (
                  <pre className={`text-sm font-mono whitespace-pre-wrap ${
                    hasError ? 'text-error-600' : 'text-gray-900'
                  }`}>
                    {output}
                  </pre>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    Click "Run" to execute your code and see the output here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeEditor;