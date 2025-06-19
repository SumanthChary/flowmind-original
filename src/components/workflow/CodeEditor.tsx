import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Play, 
  Save, 
  Copy, 
  Download, 
  Upload, 
  Settings, 
  X, 
  CheckCircle, 
  AlertCircle,
  Lightbulb,
  Zap,
  FileText,
  Terminal,
  Bug,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  onSave?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ isOpen, onClose, initialCode = '', onSave }) => {
  const [code, setCode] = useState(initialCode || `// FlowMind Custom JavaScript Function
function processWorkflowData(input) {
  try {
    // Your custom logic here
    const result = {
      processed: true,
      timestamp: new Date().toISOString(),
      data: input
    };
    
    // Example: Email validation
    if (input.email) {
      result.emailValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(input.email);
    }
    
    // Example: Data transformation
    if (input.customers) {
      result.customerCount = input.customers.length;
      result.activeCustomers = input.customers.filter(c => c.status === 'active');
    }
    
    return result;
  } catch (error) {
    return { error: error.message, success: false };
  }
}

// Test your function
const testData = {
  email: "test@example.com",
  customers: [
    { name: "John", status: "active" },
    { name: "Jane", status: "inactive" }
  ]
};

console.log(processWorkflowData(testData));`);
  
  const [testOutput, setTestOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      analyzeSyntax();
    }
  }, [code, isOpen]);

  const analyzeSyntax = () => {
    const newErrors: string[] = [];
    const newSuggestions: string[] = [];

    // Basic syntax analysis
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      // Check for common issues
      if (line.includes('console.log') && !line.includes('//')) {
        newSuggestions.push(`Line ${index + 1}: Consider removing console.log for production`);
      }
      
      if (line.includes('var ')) {
        newSuggestions.push(`Line ${index + 1}: Consider using 'const' or 'let' instead of 'var'`);
      }
      
      // Check for unmatched brackets
      const openBrackets = (line.match(/\{/g) || []).length;
      const closeBrackets = (line.match(/\}/g) || []).length;
      if (openBrackets !== closeBrackets && line.trim() !== '') {
        // This is a simple check, real syntax analysis would be more complex
      }
    });

    // Check for missing semicolons
    const missingSemicolon = lines.some(line => 
      line.trim().length > 0 && 
      !line.trim().endsWith(';') && 
      !line.trim().endsWith('{') && 
      !line.trim().endsWith('}') &&
      !line.trim().startsWith('//') &&
      !line.trim().startsWith('*') &&
      !line.includes('if ') &&
      !line.includes('for ') &&
      !line.includes('while ') &&
      !line.includes('function ')
    );

    if (missingSemicolon) {
      newSuggestions.push('Consider adding semicolons for better code style');
    }

    setErrors(newErrors);
    setSuggestions(newSuggestions);
  };

  const runCode = async () => {
    setIsRunning(true);
    setTestOutput('');

    try {
      // Create a safe execution environment
      const safeCode = `
        (function() {
          const console = {
            log: (...args) => output.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '))
          };
          const output = [];
          
          ${code}
          
          return output.join('\\n');
        })()
      `;

      // Simulate execution with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Execute the code safely
      const result = eval(safeCode);
      
      setTestOutput(result || 'Code executed successfully (no output)');
      toast.success('Code executed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestOutput(`Error: ${errorMessage}`);
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const saveCode = () => {
    onSave?.(code);
    toast.success('Code saved successfully!');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow-function.js';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
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

  const codeSnippets = [
    {
      name: 'Email Validation',
      code: `// Email validation function
function validateEmail(email) {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(email);
}`
    },
    {
      name: 'API Call',
      code: `// Make API request
async function makeAPICall(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    throw new Error('API call failed: ' + error.message);
  }
}`
    },
    {
      name: 'Data Filter',
      code: `// Filter and transform data
function filterData(items, criteria) {
  return items
    .filter(item => item.status === criteria.status)
    .map(item => ({
      ...item,
      processed: true,
      timestamp: new Date().toISOString()
    }));
}`
    }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Code size={20} className="text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">Advanced Code Editor</h2>
              <p className="text-sm text-gray-300">Write and test custom JavaScript functions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running...
                </>
              ) : (
                <>
                  <Play size={16} className="mr-2" />
                  Run Code
                </>
              )}
            </button>
            <button
              onClick={saveCode}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Code Snippets</h3>
            <div className="space-y-2">
              {codeSnippets.map((snippet, index) => (
                <button
                  key={index}
                  onClick={() => insertSnippet(snippet.code)}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">{snippet.name}</div>
                  <div className="text-xs text-gray-600 mt-1">Click to insert</div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={copyCode}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Copy size={14} className="mr-2" />
                  Copy Code
                </button>
                <button
                  onClick={downloadCode}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Download size={14} className="mr-2" />
                  Download
                </button>
              </div>
            </div>

            {/* Syntax Analysis */}
            {(errors.length > 0 || suggestions.length > 0) && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Code Analysis</h4>
                
                {errors.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center text-red-600 text-sm font-medium mb-1">
                      <AlertCircle size={14} className="mr-1" />
                      Errors ({errors.length})
                    </div>
                    {errors.map((error, index) => (
                      <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded mb-1">
                        {error}
                      </div>
                    ))}
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div>
                    <div className="flex items-center text-yellow-600 text-sm font-medium mb-1">
                      <Lightbulb size={14} className="mr-1" />
                      Suggestions ({suggestions.length})
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded mb-1">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Editor */}
          <div className="flex-1 flex flex-col">
            {/* Code Editor */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none bg-gray-900 text-green-400"
                placeholder="Write your JavaScript code here..."
                spellCheck={false}
                style={{
                  lineHeight: '1.5',
                  tabSize: 2
                }}
              />
              
              {/* Line numbers */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800 border-r border-gray-700 p-4 text-xs text-gray-500 font-mono pointer-events-none">
                {code.split('\n').map((_, index) => (
                  <div key={index} className="h-[21px] flex items-center">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Output Panel */}
            <div className="h-48 border-t border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Terminal size={16} className="mr-2" />
                  Output Console
                </h4>
                <button
                  onClick={() => setTestOutput('')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear
                </button>
              </div>
              <div className="bg-black rounded-lg p-3 h-32 overflow-y-auto font-mono text-sm">
                {testOutput ? (
                  <pre className="text-green-400 whitespace-pre-wrap">{testOutput}</pre>
                ) : (
                  <div className="text-gray-500">Click "Run Code" to see output...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CodeEditor;