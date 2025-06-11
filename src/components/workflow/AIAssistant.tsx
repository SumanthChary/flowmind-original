import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Code, 
  Lightbulb,
  Copy,
  Check,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  code?: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI workflow assistant. I can help you build workflows, write custom JavaScript functions, suggest optimizations, and answer questions about automation. What would you like to create today?",
      timestamp: new Date(),
      suggestions: [
        "Create an email automation workflow",
        "Write a custom JavaScript function",
        "Optimize my existing workflow",
        "Explain workflow best practices"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentWorkflow, addNode } = useWorkflowStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    
    // JavaScript function generation
    if (lowerMessage.includes('javascript') || lowerMessage.includes('function') || lowerMessage.includes('code')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I'll help you create a custom JavaScript function. Here's an example that processes data and handles errors:",
        timestamp: new Date(),
        code: `// Custom data processing function
function processWorkflowData(inputData) {
  try {
    // Validate input
    if (!inputData || typeof inputData !== 'object') {
      throw new Error('Invalid input data');
    }
    
    // Process the data
    const result = {
      processed: true,
      timestamp: new Date().toISOString(),
      data: inputData,
      summary: {
        totalItems: Array.isArray(inputData.items) ? inputData.items.length : 0,
        status: 'success'
      }
    };
    
    // Custom business logic
    if (inputData.email) {
      result.emailDomain = inputData.email.split('@')[1];
    }
    
    return result;
  } catch (error) {
    console.error('Processing error:', error);
    return {
      processed: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Usage in workflow
const processedData = processWorkflowData($input);
return processedData;`,
        suggestions: [
          "Explain this code",
          "Create a validation function",
          "Add error handling",
          "Generate API call function"
        ]
      };
    }

    // Workflow creation suggestions
    if (lowerMessage.includes('email') || lowerMessage.includes('automation')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I'll help you create an email automation workflow! Here's a recommended structure:",
        timestamp: new Date(),
        suggestions: [
          "Add Email Trigger node",
          "Add Condition to filter emails",
          "Add Slack notification action",
          "Add data processing step"
        ]
      };
    }

    // Optimization suggestions
    if (lowerMessage.includes('optimize') || lowerMessage.includes('improve')) {
      const nodeCount = currentWorkflow?.nodes.length || 0;
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `I analyzed your workflow with ${nodeCount} nodes. Here are optimization suggestions:

1. **Performance**: Add error handling to prevent workflow failures
2. **Reliability**: Use retry logic for external API calls
3. **Monitoring**: Add logging nodes to track execution
4. **Efficiency**: Combine similar operations into single nodes

Would you like me to implement any of these optimizations?`,
        timestamp: new Date(),
        suggestions: [
          "Add error handling",
          "Implement retry logic",
          "Add monitoring",
          "Optimize node structure"
        ]
      };
    }

    // Default helpful response
    const responses = [
      {
        content: "I can help you with workflow automation! Here are some things I can do:",
        suggestions: [
          "Create workflow templates",
          "Write custom JavaScript code",
          "Debug workflow issues",
          "Suggest integrations"
        ]
      },
      {
        content: "Let me help you build something amazing! What type of automation are you looking to create?",
        suggestions: [
          "E-commerce order processing",
          "Social media automation",
          "Data synchronization",
          "Customer support workflows"
        ]
      },
      {
        content: "I'm here to make workflow building easier! I can generate code, suggest optimizations, and guide you through best practices.",
        suggestions: [
          "Show me workflow patterns",
          "Generate API integration code",
          "Explain conditional logic",
          "Help with data transformation"
        ]
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: randomResponse.content,
      timestamp: new Date(),
      suggestions: randomResponse.suggestions
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I apologize, but I encountered an error. Please try again or rephrase your question.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className={`fixed right-4 top-20 bg-white rounded-xl shadow-xl border border-gray-200 z-50 flex flex-col ${
        isMinimized ? 'h-16 w-80' : 'h-[600px] w-96'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-accent-500 to-accent-600 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div className="text-white">
            <h3 className="font-semibold">AI Assistant</h3>
            {!isMinimized && <p className="text-xs text-accent-100">Powered by FlowMind AI</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-accent-100 text-accent-600' 
                        : 'bg-gradient-to-br from-accent-400 to-accent-600 text-white'
                    }`}>
                      {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-accent-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Code block */}
                      {message.code && (
                        <div className="mt-3 bg-gray-900 rounded-lg p-3 relative">
                          <button
                            onClick={() => copyCode(message.code!)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                          <pre className="text-sm text-green-400 overflow-x-auto">
                            <code>{message.code}</code>
                          </pre>
                        </div>
                      )}
                      
                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-xs bg-white bg-opacity-10 hover:bg-opacity-20 rounded px-2 py-1 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about workflows..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-accent-600 text-white p-2 rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AIAssistant;