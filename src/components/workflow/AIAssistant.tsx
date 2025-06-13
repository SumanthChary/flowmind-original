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
  Settings
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
    addEdge, 
    createWorkflow, 
    executeWorkflow,
    nodes,
    edges 
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

  const buildCustomerSupportWorkflow = () => {
    if (!currentWorkflow) {
      const workflow = createWorkflow('AI Customer Support', 'Intelligent customer support automation');
    }

    // Clear existing nodes
    const triggerNode = {
      id: `trigger-${Date.now()}`,
      type: 'trigger' as const,
      position: { x: 100, y: 100 },
      data: {
        label: 'Email Received',
        icon: <Mail size={18} />,
        type: 'trigger',
        config: { triggerType: 'email', emailFilter: 'support@company.com' },
        active: true,
        status: 'idle' as const
      }
    };

    const aiNode = {
      id: `ai-${Date.now()}`,
      type: 'ai' as const,
      position: { x: 350, y: 100 },
      data: {
        label: 'AI Analysis',
        icon: <Brain size={18} />,
        type: 'ai',
        config: { aiType: 'text_analysis' },
        active: true,
        status: 'idle' as const
      }
    };

    const conditionNode = {
      id: `condition-${Date.now()}`,
      type: 'condition' as const,
      position: { x: 600, y: 100 },
      data: {
        label: 'Check Urgency',
        icon: <Filter size={18} />,
        type: 'condition',
        config: { conditionType: 'contains', field: 'sentiment', value: 'urgent' },
        active: true,
        status: 'idle' as const
      }
    };

    const actionNode = {
      id: `action-${Date.now()}`,
      type: 'action' as const,
      position: { x: 850, y: 100 },
      data: {
        label: 'Send Response',
        icon: <Mail size={18} />,
        type: 'action',
        config: { actionType: 'email' },
        active: true,
        status: 'idle' as const
      }
    };

    addNode(triggerNode);
    addNode(aiNode);
    addNode(conditionNode);
    addNode(actionNode);

    // Connect nodes
    addEdge({
      id: `edge-1-${Date.now()}`,
      source: triggerNode.id,
      target: aiNode.id,
      type: 'smoothstep',
      animated: true,
      data: { status: 'idle' }
    });

    addEdge({
      id: `edge-2-${Date.now()}`,
      source: aiNode.id,
      target: conditionNode.id,
      type: 'smoothstep',
      animated: true,
      data: { status: 'idle' }
    });

    addEdge({
      id: `edge-3-${Date.now()}`,
      source: conditionNode.id,
      target: actionNode.id,
      sourceHandle: 'true',
      type: 'smoothstep',
      animated: true,
      data: { status: 'idle' }
    });

    toast.success('Customer support workflow created!');
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
            label: 'Add Trigger',
            action: () => {
              const node = {
                id: `trigger-${Date.now()}`,
                type: 'trigger' as const,
                position: { x: 100, y: 100 },
                data: {
                  label: 'Email Trigger',
                  icon: <Mail size={18} />,
                  type: 'trigger',
                  config: { triggerType: 'email' },
                  active: true,
                  status: 'idle' as const
                }
              };
              addNode(node);
              toast.success('Trigger node added!');
            },
            icon: <Zap size={16} />,
            variant: 'secondary' as const
          }
        ]
      };
    }

    // Customer support workflow
    if (lowerMessage.includes('customer') || lowerMessage.includes('support')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🎯 **Customer Support Workflow**

I'll help you build an intelligent customer support system that:

1. **Receives emails** → Monitors support inbox
2. **AI Analysis** → Analyzes sentiment & urgency  
3. **Smart Routing** → Routes urgent vs normal requests
4. **Auto Response** → Sends appropriate replies
5. **Team Alerts** → Notifies team for urgent issues

This workflow will handle customer emails automatically and provide real results!`,
        timestamp: new Date(),
        actionButtons: [
          {
            label: 'Build This Workflow',
            action: buildCustomerSupportWorkflow,
            icon: <Bot size={16} />,
            variant: 'primary' as const
          }
        ],
        suggestions: [
          "What email filters should I use?",
          "How does AI analysis work?",
          "Show me the workflow steps",
          "Add database logging"
        ]
      };
    }

    // Email automation
    if (lowerMessage.includes('email')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `📧 **Email Automation Workflow**

Let me help you create an email automation system:

**Trigger Options:**
• New email received (Gmail, Outlook)
• Schedule-based sending
• Form submissions
• Database updates

**AI Processing:**
• Sentiment analysis
• Content extraction
• Priority detection
• Auto-categorization

**Actions:**
• Send personalized replies
• Forward to team members
• Create support tickets
• Update CRM records`,
        timestamp: new Date(),
        actionButtons: [
          {
            label: 'Start Email Workflow',
            action: () => {
              const triggerNode = {
                id: `email-trigger-${Date.now()}`,
                type: 'trigger' as const,
                position: { x: 100, y: 100 },
                data: {
                  label: 'Email Received',
                  icon: <Mail size={18} />,
                  type: 'trigger',
                  config: { triggerType: 'email' },
                  active: true,
                  status: 'idle' as const
                }
              };
              addNode(triggerNode);
              toast.success('Email trigger added! Add more nodes to complete your workflow.');
            },
            icon: <Mail size={16} />,
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
        code: `// Customer Email Processor
function processCustomerEmail(emailData) {
  try {
    // Extract key information
    const analysis = {
      sender: emailData.from,
      subject: emailData.subject,
      urgency: detectUrgency(emailData.body),
      sentiment: analyzeSentiment(emailData.body),
      category: categorizeEmail(emailData.body)
    };
    
    // Determine response type
    if (analysis.urgency === 'high') {
      return {
        action: 'escalate',
        priority: 'urgent',
        assignTo: 'senior-support',
        autoReply: false
      };
    } else {
      return {
        action: 'auto-reply',
        priority: 'normal',
        template: 'standard-response',
        autoReply: true
      };
    }
  } catch (error) {
    return { error: error.message };
  }
}

function detectUrgency(text) {
  const urgentKeywords = ['urgent', 'asap', 'emergency', 'critical'];
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

    // Default helpful response
    const responses = [
      {
        content: `🚀 **Let's Build Something Amazing!**

I can help you create powerful workflows for:

**Popular Automations:**
• Customer support systems
• Email marketing campaigns  
• Data processing pipelines
• Social media automation
• E-commerce order processing

**What I Can Do:**
• Analyze your current workflow
• Suggest improvements
• Generate custom code
• Guide you step-by-step
• Test and debug workflows

What type of automation interests you most?`,
        suggestions: [
          "Build customer support workflow",
          "Create email automation",
          "Set up data processing",
          "Analyze my current workflow"
        ]
      },
      {
        content: `🎯 **Workflow Building Made Easy**

I'll guide you through creating professional workflows:

**Step 1:** Choose your trigger (Email, Webhook, Schedule)
**Step 2:** Add AI processing for smart decisions
**Step 3:** Set up conditions for routing
**Step 4:** Configure actions (Email, Slack, Database)
**Step 5:** Test and deploy

Ready to start? Tell me what you want to automate!`,
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