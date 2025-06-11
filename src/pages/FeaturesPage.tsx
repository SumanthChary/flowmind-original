import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Workflow, 
  Sparkles, 
  BrainCircuit, 
  LineChart, 
  Code, 
  Globe, 
  ShieldCheck, 
  Users, 
  BarChart, 
  Search,
  Bot,
  Layers,
  GitBranch,
  Timer,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Webhook,
  Filter,
  Target,
  Hash,
  Eye,
  Repeat,
  Shuffle,
  TestTube,
  Settings,
  Lock,
  Bell,
  Cloud,
  Smartphone,
  Monitor,
  Headphones
} from 'lucide-react';

const FeatureSection = ({ 
  title, 
  description, 
  image, 
  imageAlt, 
  features, 
  isReversed = false,
  bgColor = 'bg-white'
}: {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  features: { icon: React.ReactNode; title: string; description: string }[];
  isReversed?: boolean;
  bgColor?: string;
}) => {
  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="container">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`${isReversed ? 'lg:order-2' : ''}`}>
            <h2 className="heading-2 text-gray-900 mb-4">{title}</h2>
            <p className="subtitle mb-8">{description}</p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-accent-100 text-accent-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-1 text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`${isReversed ? 'lg:order-1' : ''}`}>
            <img 
              src={image} 
              alt={imageAlt} 
              className="rounded-lg shadow-medium w-full h-auto object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 h-full"
  >
    <div className="flex flex-col h-full">
      <div className="mb-4 p-3 rounded-lg bg-accent-50 w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
    </div>
  </motion.div>
);

const FeaturesPage = () => {
  useEffect(() => {
    document.title = "Features | FlowMind - Complete Workflow Automation Platform";
  }, []);

  const coreFeatures = [
    {
      icon: <Workflow size={24} className="text-accent-600" />,
      title: "Visual Workflow Builder",
      description: "Drag-and-drop interface with 50+ node types including triggers, actions, conditions, and AI-powered components."
    },
    {
      icon: <Bot size={24} className="text-accent-600" />,
      title: "AI Assistant & Chat",
      description: "Built-in AI assistant that helps you build workflows, write custom JavaScript functions, and optimize automation."
    },
    {
      icon: <Code size={24} className="text-accent-600" />,
      title: "Custom JavaScript Functions",
      description: "Advanced code editor with syntax highlighting, auto-completion, and real-time testing for custom logic."
    },
    {
      icon: <Globe size={24} className="text-accent-600" />,
      title: "500+ Integrations",
      description: "Connect with all major platforms including Gmail, Slack, Notion, Salesforce, and hundreds more via APIs."
    },
    {
      icon: <TestTube size={24} className="text-accent-600" />,
      title: "Advanced Testing Suite",
      description: "Comprehensive testing tools with mock data, edge case testing, and performance monitoring."
    },
    {
      icon: <LineChart size={24} className="text-accent-600" />,
      title: "Real-time Analytics",
      description: "Detailed execution logs, performance metrics, and visual dashboards to monitor your automations."
    },
    {
      icon: <ShieldCheck size={24} className="text-accent-600" />,
      title: "Enterprise Security",
      description: "SOC 2 certified with end-to-end encryption, role-based access control, and audit logging."
    },
    {
      icon: <Users size={24} className="text-accent-600" />,
      title: "Team Collaboration",
      description: "Real-time collaboration with version control, comments, and granular permission management."
    },
    {
      icon: <Zap size={24} className="text-accent-600" />,
      title: "High Performance",
      description: "Lightning-fast execution with auto-scaling, load balancing, and 99.9% uptime guarantee."
    }
  ];

  const nodeTypes = [
    { icon: <Mail size={20} />, name: "Email Triggers", description: "Gmail, Outlook, IMAP" },
    { icon: <Webhook size={20} />, name: "Webhooks", description: "HTTP endpoints & APIs" },
    { icon: <Timer size={20} />, name: "Schedulers", description: "Cron jobs & intervals" },
    { icon: <Database size={20} />, name: "Databases", description: "MySQL, PostgreSQL, MongoDB" },
    { icon: <MessageSquare size={20} />, name: "Chat Platforms", description: "Slack, Discord, Teams" },
    { icon: <Calendar size={20} />, name: "Calendars", description: "Google, Outlook, CalDAV" },
    { icon: <FileText size={20} />, name: "Documents", description: "Google Docs, Notion, Airtable" },
    { icon: <Filter size={20} />, name: "Conditions", description: "If/Then, Switch/Case logic" },
    { icon: <Repeat size={20} />, name: "Loops", description: "For each, While loops" },
    { icon: <Shuffle size={20} />, name: "Transformers", description: "Data mapping & processing" },
    { icon: <Bot size={20} />, name: "AI Nodes", description: "GPT, sentiment analysis" },
    { icon: <Hash size={20} />, name: "Utilities", description: "Encryption, validation" }
  ];

  const aiFeatures = [
    {
      icon: <Bot size={18} />,
      title: "Intelligent Workflow Suggestions",
      description: "AI analyzes your data patterns and suggests optimal workflow structures and optimizations."
    },
    {
      icon: <Code size={18} />,
      title: "Code Generation",
      description: "Generate custom JavaScript functions, API calls, and data transformations with natural language."
    },
    {
      icon: <Sparkles size={18} />,
      title: "Smart Error Detection",
      description: "Proactive error detection and automatic suggestions for fixes before workflows fail."
    },
    {
      icon: <Target size={18} />,
      title: "Performance Optimization",
      description: "AI-powered recommendations to improve execution speed and reduce resource usage."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-hero-pattern">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="heading-1 text-gray-900 mb-6"
            >
              The Most Advanced
              <br />
              <span className="text-primary-600">Workflow Automation Platform</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="subtitle mb-8 max-w-3xl mx-auto"
            >
              FlowMind combines the power of AI with enterprise-grade features to create the ultimate workflow automation platform. Build, test, and deploy complex automations with ease.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <span className="px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                🤖 AI-Powered
              </span>
              <span className="px-4 py-2 bg-success-100 text-success-700 rounded-full text-sm font-medium">
                🔒 Enterprise Security
              </span>
              <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                ⚡ Real-time Execution
              </span>
              <span className="px-4 py-2 bg-warning-100 text-warning-700 rounded-full text-sm font-medium">
                🔧 Custom Code Support
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              Everything You Need for Advanced Automation
            </h2>
            <p className="subtitle">
              FlowMind provides enterprise-grade features that rival n8n, Zapier, and other leading platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <FeatureSection
        title="AI-Powered Workflow Intelligence"
        description="Our advanced AI assistant doesn't just help you build workflows—it makes them smarter, faster, and more reliable."
        image="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="AI-Powered Workflow Intelligence"
        features={aiFeatures}
      />

      {/* Node Types Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              50+ Node Types for Every Use Case
            </h2>
            <p className="subtitle">
              From simple triggers to complex AI processing, we have the building blocks for any automation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nodeTypes.map((node, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-4 shadow-soft border border-gray-100 text-center"
              >
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="text-accent-600">
                    {node.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{node.name}</h3>
                <p className="text-xs text-gray-600">{node.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Code Editor */}
      <FeatureSection
        title="Professional Code Editor"
        description="Write custom JavaScript functions with our advanced IDE featuring syntax highlighting, auto-completion, debugging tools, and real-time testing."
        image="https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="Professional Code Editor"
        features={[
          {
            icon: <Code size={18} />,
            title: "Syntax Highlighting",
            description: "Full JavaScript support with intelligent code completion and error detection."
          },
          {
            icon: <TestTube size={18} />,
            title: "Real-time Testing",
            description: "Test your functions instantly with mock data and see results in real-time."
          },
          {
            icon: <Layers size={18} />,
            title: "Code Snippets",
            description: "Pre-built snippets for common operations like API calls, data validation, and transformations."
          },
          {
            icon: <Settings size={18} />,
            title: "Advanced Debugging",
            description: "Step-through debugging, console logging, and performance profiling tools."
          }
        ]}
        isReversed={true}
        bgColor="bg-white"
      />

      {/* Testing & Monitoring */}
      <FeatureSection
        title="Comprehensive Testing & Monitoring"
        description="Ensure your workflows are bulletproof with our advanced testing suite and real-time monitoring capabilities."
        image="https://images.pexels.com/photos/590020/pexels-photo-590020.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="Testing & Monitoring"
        features={[
          {
            icon: <TestTube size={18} />,
            title: "Automated Testing",
            description: "Run comprehensive tests with edge cases, performance benchmarks, and error scenarios."
          },
          {
            icon: <BarChart size={18} />,
            title: "Performance Analytics",
            description: "Track execution times, success rates, and resource usage with detailed dashboards."
          },
          {
            icon: <Bell size={18} />,
            title: "Smart Alerts",
            description: "Get notified instantly when workflows fail or performance degrades."
          },
          {
            icon: <Eye size={18} />,
            title: "Real-time Monitoring",
            description: "Watch your workflows execute in real-time with live status updates and logs."
          }
        ]}
        bgColor="bg-gray-50"
      />

      {/* Enterprise Features */}
      <FeatureSection
        title="Enterprise-Grade Security & Collaboration"
        description="Built for teams with enterprise security, compliance features, and advanced collaboration tools."
        image="https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="Enterprise Security"
        features={[
          {
            icon: <ShieldCheck size={18} />,
            title: "SOC 2 Compliance",
            description: "Enterprise-grade security with end-to-end encryption and audit logging."
          },
          {
            icon: <Users size={18} />,
            title: "Team Collaboration",
            description: "Real-time collaboration with role-based permissions and version control."
          },
          {
            icon: <Lock size={18} />,
            title: "Advanced Access Control",
            description: "Granular permissions, SSO integration, and IP whitelisting for maximum security."
          },
          {
            icon: <Cloud size={18} />,
            title: "Scalable Infrastructure",
            description: "Auto-scaling cloud infrastructure with 99.9% uptime and global CDN."
          }
        ]}
        isReversed={true}
        bgColor="bg-white"
      />

      {/* Platform Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              Why Choose FlowMind Over Competitors?
            </h2>
            <p className="subtitle">
              See how FlowMind compares to other leading automation platforms.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-medium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-accent-600">FlowMind</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">n8n</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Zapier</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Make</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">AI Assistant & Chat</td>
                    <td className="px-6 py-4 text-center"><CheckCircle size={20} className="text-success-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Advanced Code Editor</td>
                    <td className="px-6 py-4 text-center"><CheckCircle size={20} className="text-success-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle size={20} className="text-success-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-gray-400">Limited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Real-time Collaboration</td>
                    <td className="px-6 py-4 text-center"><CheckCircle size={20} className="text-success-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Testing Suite</td>
                    <td className="px-6 py-4 text-center"><CheckCircle size={20} className="text-success-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-400">Basic</td>
                    <td className="px-6 py-4 text-center text-gray-400">✗</td>
                    <td className="px-6 py-4 text-center text-gray-400">Basic</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Enterprise Security</td>
                    <td className="px-6 py-4 text-center"><CheckCircle size={20} className="text-success-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center text-gray-400">Self-hosted only</td>
                    <td className="px-6 py-4 text-center"><CheckCircle size={20} className="text-success-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle size={20} className="text-success-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile & Cross-Platform */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              Works Everywhere You Do
            </h2>
            <p className="subtitle">
              Access your workflows from any device with our responsive design and mobile-optimized interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Monitor size={32} className="text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Desktop</h3>
              <p className="text-gray-600">Full-featured experience with advanced editing capabilities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Smartphone size={32} className="text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile</h3>
              <p className="text-gray-600">Monitor and manage workflows on the go</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Headphones size={32} className="text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Expert support whenever you need help</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build the Future of Automation?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of teams who have chosen FlowMind for their workflow automation needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center">
                Start Free Trial
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/workflow-builder" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Try Demo
              </Link>
            </div>
            <p className="text-sm text-primary-200 mt-6">
              No credit card required • 14-day free trial • Full feature access
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;