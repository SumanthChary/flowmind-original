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
  Maximize2,
  Play,
  Zap,
  Target,
  Mail,
  Database,
  Timer,
  Filter,
  Workflow,
  Brain,
  Settings,
  Trash2,
  RotateCcw
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
  workflow?: any;
  actionButtons?: Array<{
    label: string;
    action: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary';
  }>;
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
      content: "👋 Hi! I'm your AI Workflow Assistant. I can help you build powerful automation workflows step by step. What would you like to automate today?",
      timestamp: new Date(),
      suggestions: [
        "Build a customer support workflow",
        "Create an email automation",
        "Set up a data processing pipeline",
        "Automate social media posting"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { 
    currentWorkflow, 
    addNode, 
    executeWorkflow,
    nodes,
    edges,
    saveWorkflow
  } = useWorkflowStore();

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

  const analyzeWorkflow = () => {
    if (!currentWorkflow || nodes.length === 0) {
      return {
        hasNodes: false,
        hasTrigger: false,
        hasActions: false,
        hasConditions: false,
        isComplete: false,
        suggestions: [
          "Start by adding a trigger node (Email, Webhook, or Schedule)",
          "Add action nodes to perform tasks",
          "Use condition nodes for smart routing"
        ]
      };
    }

    const triggers = nodes.filter(n => n.type === 'trigger');
    const actions = nodes.filter(n => n.type === 'action');
    const conditions = nodes.filter(n => n.type === 'condition');
    const hasConnections = edges.length > 0;

    return {
      hasNodes: nodes.length > 0,
      hasTrigger: triggers.length > 0,
      hasActions: actions.length > 0,
      hasConditions: conditions.length > 0,
      hasConnections,
      isComplete: triggers.length > 0 && actions.length > 0 && hasConnections,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      suggestions: [
        !triggers.length ? "Add a trigger to start your workflow" : null,
        !actions.length ? "Add action nodes to perform tasks" : null,
        !hasConnections ? "Connect your nodes with edges" : null,
        triggers.length > 0 && actions.length > 0 && hasConnections ? "Your workflow looks good! Try running it." : null
      ].filter(Boolean)
    };
  };

  const buildEmailAutomationWorkflow = () => {
    if (!currentWorkflow) return;

    // Email trigger
    const triggerNode = {
      id: `trigger-${Date.now()}`,
      type: 'trigger' as const,
      position: { x: 100, y: 100 },
      data: {
        label: 'Email Received',
        icon: 'Mail',
        type: 'trigger',
        config: { triggerType: 'email', emailFilter: 'support@company.com' },
        active: true,
        status: 'idle' as const
      }
    };

    // AI analysis
    const aiNode = {
      id: `ai-${Date.now()}`,
      type: 'ai' as const,
      position: { x: 350, y: 100 },
      data: {
        label: 'AI Email Analysis',
        icon: 'Brain',
        type: 'ai',
        config: { 
          aiType: 'text_analysis',
          model: 'gemini-pro',
          prompt: 'Analyze email content for sentiment and urgency'
        },
        active: true,
        status: 'idle' as const
      }
    };

    // Auto-reply action
    const replyNode = {
      id: `action-${Date.now()}`,
      type: 'action' as const,
      position: { x: 600, y: 100 },
      data: {
        label: 'Send Auto-Reply',
        icon: 'Mail',
        type: 'action',
        config: { 
          actionType: 'email',
          emailTo: 'enjoywithpandu@gmail.com',
          emailSubject: 'Thank you for your email',
          emailMessage: 'We have received your email and will respond within 24 hours.'
        },
        active: true,
        status: 'idle' as const
      }
    };

    addNode(triggerNode);
    addNode(aiNode);
    addNode(replyNode);

    // Auto-save workflow
    if (currentWorkflow) {
      const updatedWorkflow = {
        ...currentWorkflow,
        nodes: [...nodes, triggerNode, aiNode, replyNode]
      };
      saveWorkflow(updatedWorkflow);
    }

    toast.success('Email automation workflow created!');
  };

  const buildDataProcessingWorkflow = () => {
    if (!currentWorkflow) return;

    // Webhook trigger
    const triggerNode = {
      id: `trigger-${Date.now()}`,
      type: 'trigger' as const,
      position: { x: 100, y: 100 },
      data: {
        label: 'Data Webhook',
        icon: 'Webhook',
        type: 'trigger',
        config: { triggerType: 'webhook' },
        active: true,
        status: 'idle' as const
      }
    };

    // AI processing
    const aiNode = {
      id: `ai-${Date.now()}`,
      type: 'ai' as const,
      position: { x: 350, y: 100 },
      data: {
        label: 'AI Data Processing',
        icon: 'Brain',
        type: 'ai',
        config: { 
          aiType: 'data_extraction',
          model: 'gemini-pro',
          prompt: 'Extract and analyze key insights from the data'
        },
        active: true,
        status: 'idle' as const
      }
    };

    // Database action
    const dbNode = {
      id: `action-${Date.now()}`,
      type: 'action' as const,
      position: { x: 600, y: 100 },
      data: {
        label: 'Store Results',
        icon: 'Database',
        type: 'action',
        config: { 
          actionType: 'database',
          table: 'processed_data',
          operation: 'insert'
        },
        active: true,
        status: 'idle' as const
      }
    };

    addNode(triggerNode);
    addNode(aiNode);
    addNode(dbNode);

    // Auto-save workflow
    if (currentWorkflow) {
      const updatedWorkflow = {
        ...currentWorkflow,
        nodes: [...nodes, triggerNode, aiNode, dbNode]
      };
      saveWorkflow(updatedWorkflow);
    }

    toast.success('Data processing workflow created!');
  };

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    const workflowAnalysis = analyzeWorkflow();

    // Workflow analysis responses
    if (lowerMessage.includes('analyze') || lowerMessage.includes('check') || lowerMessage.includes('workflow')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🔍 **Workflow Analysis:**

${workflowAnalysis.hasNodes ? `✅ You have ${workflowAnalysis.nodeCount} nodes` : '❌ No nodes yet'}
${workflowAnalysis.hasTrigger ? '✅ Trigger node added' : '❌ Missing trigger node'}
${workflowAnalysis.hasActions ? '✅ Action nodes present' : '❌ No action nodes'}
${workflowAnalysis.hasConnections ? `✅ ${workflowAnalysis.edgeCount} connections` : '❌ Nodes not connected'}

**Next Steps:**
${workflowAnalysis.suggestions.map(s => `• ${s}`).join('\n')}`,
        timestamp: new Date(),
        actionButtons: workflowAnalysis.isComplete ? [
          {
            label: 'Run Workflow',
            action: () => currentWorkflow && executeWorkflow(currentWorkflow.id),
            icon: <Play size={16} />,
            variant: 'primary' as const
          }
        ] : [
          {
            label: 'Add Email Trigger',
            action: () => {
              const node = {
                id: `trigger-${Date.now()}`,
                type: 'trigger' as const,
                position: { x: 100, y: 100 },
                data: {
                  label: 'Email Trigger',
                  icon: 'Mail',
                  type: 'trigger',
                  config: { triggerType: 'email' },
                  active: true,
                  status: 'idle' as const
                }
              };
              addNode(node);
              toast.success('Email trigger added!');
            },
            icon: <Mail size={16} />,
            variant: 'secondary' as const
          }
        ]
      };
    }

    // Email automation
    if (lowerMessage.includes('email')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `📧 **Email Automation Workflow**

I'll help you create an intelligent email automation system:

**What it does:**
1. **Monitors emails** → Watches your inbox for new messages
2. **AI Analysis** → Analyzes content, sentiment, and urgency
3. **Smart Responses** → Sends appropriate auto-replies
4. **Real Processing** → Uses actual AI and sends real emails

This workflow will handle customer emails automatically with real results!`,
        timestamp: new Date(),
        actionButtons: [
          {
            label: 'Build Email Workflow',
            action: buildEmailAutomationWorkflow,
            icon: <Mail size={16} />,
            variant: 'primary' as const
          }
        ],
        suggestions: [
          "How does AI analysis work?",
          "Can I customize the auto-reply?",
          "Show me the workflow steps",
          "Add more email actions"
        ]
      };
    }

    // Data processing
    if (lowerMessage.includes('data') || lowerMessage.includes('process')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `📊 **Data Processing Pipeline**

Let me create a powerful data processing workflow:

**Features:**
• **Webhook Trigger** → Receives data from any source
• **AI Processing** → Extracts insights with Gemini AI
• **Smart Storage** → Saves results to database
• **Real-time Processing** → Handles data as it arrives

Perfect for processing customer data, analytics, or any automated data pipeline!`,
        timestamp: new Date(),
        actionButtons: [
          {
            label: 'Build Data Pipeline',
            action: buildDataProcessingWorkflow,
            icon: <Database size={16} />,
            variant: 'primary' as const
          }
        ]
      };
    }

    // Code generation
    if (lowerMessage.includes('code') || lowerMessage.includes('function')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I'll help you create custom JavaScript functions for your workflow:",
        timestamp: new Date(),
        code: `// Email Processing Function
function processIncomingEmail(emailData) {
  try {
    // Extract key information
    const analysis = {
      sender: emailData.from,
      subject: emailData.subject,
      urgency: detectUrgency(emailData.body),
      sentiment: analyzeSentiment(emailData.body),
      category: categorizeEmail(emailData.body)
    };
    
    // Determine response strategy
    if (analysis.urgency === 'high') {
      return {
        action: 'escalate',
        priority: 'urgent',
        autoReply: true,
        template: 'urgent-response'
      };
    } else {
      return {
        action: 'auto-reply',
        priority: 'normal',
        template: 'standard-response',
        delay: '5 minutes'
      };
    }
  } catch (error) {
    console.error('Email processing error:', error);
    return { error: error.message };
  }
}

function detectUrgency(text) {
  const urgentKeywords = ['urgent', 'asap', 'emergency', 'critical', 'immediate'];
  return urgentKeywords.some(keyword => 
    text.toLowerCase().includes(keyword)
  ) ? 'high' : 'normal';
}`,
        suggestions: [
          "Explain this code",
          "Add error handling",
          "Create validation function",
          "Generate API call function"
        ]
      };
    }

    // Help with specific nodes
    if (lowerMessage.includes('trigger') || lowerMessage.includes('start')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🚀 **Trigger Nodes - Starting Your Workflow**

Triggers are the starting point of every workflow. Here are your options:

**📧 Email Trigger**
• Monitors your inbox for new emails
• Can filter by sender, subject, or content
• Perfect for customer support automation

**🔗 Webhook Trigger**
• Receives data from external services
• Real-time processing as data arrives
• Great for API integrations

**⏰ Schedule Trigger**
• Runs workflows on a schedule
• Daily, weekly, or custom timing
• Perfect for reports and maintenance

**⚡ Manual Trigger**
• Start workflows manually
• Great for testing and one-time tasks

Which type of trigger would work best for your automation?`,
        timestamp: new Date(),
        actionButtons: [
          {
            label: 'Add Email Trigger',
            action: () => {
              const node = {
                id: `trigger-${Date.now()}`,
                type: 'trigger' as const,
                position: { x: 100, y: 100 },
                data: {
                  label: 'Email Trigger',
                  icon: 'Mail',
                  type: 'trigger',
                  config: { triggerType: 'email' },
                  active: true,
                  status: 'idle' as const
                }
              };
              addNode(node);
              toast.success('Email trigger added!');
            },
            icon: <Mail size={16} />,
            variant: 'secondary' as const
          }
        ]
      };
    }

    // Default helpful response
    const responses = [
      {
        content: `🚀 **Let's Build Something Amazing!**

I can help you create powerful workflows for:

**Popular Automations:**
• Customer support systems with AI
• Email marketing campaigns  
• Data processing pipelines
• Social media automation
• E-commerce order processing

**What I Can Do:**
• Analyze your current workflow
• Suggest improvements and optimizations
• Generate custom JavaScript code
• Guide you step-by-step through building
• Test and debug your workflows

What type of automation would you like to build today?`,
        suggestions: [
          "Build email automation workflow",
          "Create data processing pipeline",
          "Set up customer support system",
          "Analyze my current workflow"
        ]
      },
      {
        content: `🎯 **Workflow Building Made Simple**

I'll guide you through creating professional workflows:

**Step 1:** Choose your trigger (Email, Webhook, Schedule)
**Step 2:** Add AI processing for intelligent decisions
**Step 3:** Set up conditions for smart routing
**Step 4:** Configure actions (Email, Slack, Database)
**Step 5:** Test and deploy with real results

Ready to start? Tell me what you want to automate and I'll help you build it!`,
        suggestions: [
          "Start with email trigger",
          "Add AI analysis node",
          "Create condition logic",
          "Set up database actions"
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

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: "👋 Chat cleared! How can I help you build your workflow?",
      timestamp: new Date(),
      suggestions: [
        "Build a customer support workflow",
        "Create an email automation",
        "Set up a data processing pipeline",
        "Automate social media posting"
      ]
    }]);
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
            <h3 className="font-semibold">AI Workflow Assistant</h3>
            {!isMinimized && <p className="text-xs text-accent-100">Powered by FlowMind AI</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isMinimized && (
            <button
              onClick={clearChat}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
          )}
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
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
                      
                      {/* Action Buttons */}
                      {message.actionButtons && (
                        <div className="mt-3 space-y-2">
                          {message.actionButtons.map((button, index) => (
                            <button
                              key={index}
                              onClick={button.action}
                              className={`flex items-center justify-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                button.variant === 'primary'
                                  ? 'bg-accent-600 text-white hover:bg-accent-700'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {button.icon && <span className="mr-2">{button.icon}</span>}
                              {button.label}
                            </button>
                          ))}
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
                placeholder="Ask me about workflows..."
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