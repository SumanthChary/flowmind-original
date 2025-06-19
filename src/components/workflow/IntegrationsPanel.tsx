import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Search, 
  Plus, 
  CheckCircle, 
  Settings, 
  X, 
  Star, 
  Zap, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Database, 
  FileText, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Camera, 
  Music, 
  Video, 
  Code, 
  Smartphone, 
  Monitor, 
  Cloud, 
  Lock, 
  Wifi,
  Filter,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface IntegrationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  connected: boolean;
  popular: boolean;
  verified: boolean;
  rating: number;
  setupTime: string;
  features: string[];
}

const IntegrationsPanel: React.FC<IntegrationsPanelProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [connectedOnly, setConnectedOnly] = useState(false);

  const integrations: Integration[] = [
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Send and receive emails, manage labels, and automate email workflows',
      category: 'email',
      icon: <Mail size={24} className="text-red-600" />,
      connected: true,
      popular: true,
      verified: true,
      rating: 4.9,
      setupTime: '2 min',
      features: ['Send emails', 'Read emails', 'Manage labels', 'Attachments']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send messages, create channels, and manage team communications',
      category: 'communication',
      icon: <MessageSquare size={24} className="text-purple-600" />,
      connected: true,
      popular: true,
      verified: true,
      rating: 4.8,
      setupTime: '1 min',
      features: ['Send messages', 'Create channels', 'File uploads', 'User management']
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Create events, manage schedules, and sync calendar data',
      category: 'productivity',
      icon: <Calendar size={24} className="text-blue-600" />,
      connected: false,
      popular: true,
      verified: true,
      rating: 4.7,
      setupTime: '3 min',
      features: ['Create events', 'Update events', 'Delete events', 'Calendar sync']
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Create pages, update databases, and manage workspace content',
      category: 'productivity',
      icon: <FileText size={24} className="text-gray-800" />,
      connected: false,
      popular: true,
      verified: true,
      rating: 4.6,
      setupTime: '5 min',
      features: ['Create pages', 'Update databases', 'Query content', 'File management']
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Manage leads, contacts, opportunities, and CRM data',
      category: 'crm',
      icon: <Users size={24} className="text-blue-500" />,
      connected: false,
      popular: true,
      verified: true,
      rating: 4.5,
      setupTime: '10 min',
      features: ['Lead management', 'Contact sync', 'Opportunity tracking', 'Reports']
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Process payments, manage subscriptions, and handle billing',
      category: 'payment',
      icon: <CreditCard size={24} className="text-indigo-600" />,
      connected: false,
      popular: true,
      verified: true,
      rating: 4.8,
      setupTime: '7 min',
      features: ['Payment processing', 'Subscription management', 'Invoicing', 'Analytics']
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Manage products, orders, and e-commerce operations',
      category: 'ecommerce',
      icon: <ShoppingCart size={24} className="text-green-600" />,
      connected: false,
      popular: true,
      verified: true,
      rating: 4.4,
      setupTime: '8 min',
      features: ['Product management', 'Order processing', 'Inventory sync', 'Customer data']
    },
    {
      id: 'airtable',
      name: 'Airtable',
      description: 'Manage databases, create records, and organize data',
      category: 'database',
      icon: <Database size={24} className="text-orange-600" />,
      connected: false,
      popular: false,
      verified: true,
      rating: 4.3,
      setupTime: '4 min',
      features: ['Database management', 'Record creation', 'Data sync', 'Collaboration']
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Manage repositories, issues, and development workflows',
      category: 'development',
      icon: <Code size={24} className="text-gray-900" />,
      connected: false,
      popular: false,
      verified: true,
      rating: 4.7,
      setupTime: '3 min',
      features: ['Repository management', 'Issue tracking', 'Pull requests', 'Webhooks']
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Send messages, manage servers, and automate community interactions',
      category: 'communication',
      icon: <MessageSquare size={24} className="text-indigo-500" />,
      connected: false,
      popular: false,
      verified: true,
      rating: 4.2,
      setupTime: '2 min',
      features: ['Send messages', 'Server management', 'Role assignment', 'Webhooks']
    },
    {
      id: 'aws',
      name: 'Amazon Web Services',
      description: 'Manage cloud resources, S3 storage, and AWS services',
      category: 'cloud',
      icon: <Cloud size={24} className="text-orange-500" />,
      connected: false,
      popular: false,
      verified: true,
      rating: 4.1,
      setupTime: '15 min',
      features: ['S3 storage', 'Lambda functions', 'EC2 management', 'CloudWatch']
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      description: 'Send messages, schedule meetings, and manage team collaboration',
      category: 'communication',
      icon: <Users size={24} className="text-blue-700" />,
      connected: false,
      popular: false,
      verified: true,
      rating: 4.0,
      setupTime: '5 min',
      features: ['Send messages', 'Schedule meetings', 'File sharing', 'Team management']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: <Globe size={16} /> },
    { id: 'email', name: 'Email', icon: <Mail size={16} /> },
    { id: 'communication', name: 'Communication', icon: <MessageSquare size={16} /> },
    { id: 'productivity', name: 'Productivity', icon: <FileText size={16} /> },
    { id: 'crm', name: 'CRM', icon: <Users size={16} /> },
    { id: 'payment', name: 'Payment', icon: <CreditCard size={16} /> },
    { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingCart size={16} /> },
    { id: 'database', name: 'Database', icon: <Database size={16} /> },
    { id: 'development', name: 'Development', icon: <Code size={16} /> },
    { id: 'cloud', name: 'Cloud', icon: <Cloud size={16} /> }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesConnection = !connectedOnly || integration.connected;
    
    return matchesSearch && matchesCategory && matchesConnection;
  });

  const connectIntegration = (integrationId: string) => {
    // Simulate connection process
    toast.success(`Connected to ${integrations.find(i => i.id === integrationId)?.name}!`);
    
    // In a real app, this would make an API call to connect the integration
    console.log(`Connecting to ${integrationId}...`);
  };

  const disconnectIntegration = (integrationId: string) => {
    toast.success(`Disconnected from ${integrations.find(i => i.id === integrationId)?.name}`);
  };

  const configureIntegration = (integrationId: string) => {
    toast.info(`Opening configuration for ${integrations.find(i => i.id === integrationId)?.name}`);
  };

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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-green-600 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Globe size={20} className="text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">500+ Integrations</h2>
              <p className="text-sm text-blue-100">Connect with all your favorite tools and services</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-white text-sm">
              {integrations.filter(i => i.connected).length} connected
            </div>
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
            {/* Search */}
            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="mb-4">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={connectedOnly}
                  onChange={(e) => setConnectedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Connected only</span>
              </label>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{integrations.length}</div>
                <div className="text-sm text-blue-600">Total Integrations</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {integrations.filter(i => i.connected).length}
                </div>
                <div className="text-sm text-green-600">Connected</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {integrations.filter(i => i.popular).length}
                </div>
                <div className="text-sm text-purple-600">Popular</div>
              </div>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map((integration) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {integration.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                          {integration.verified && (
                            <CheckCircle size={16} className="text-blue-600" />
                          )}
                          {integration.popular && (
                            <Star size={16} className="text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>★ {integration.rating}</span>
                          <span>•</span>
                          <span>{integration.setupTime} setup</span>
                        </div>
                      </div>
                    </div>
                    {integration.connected && (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{integration.description}</p>

                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-700 mb-2">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {integration.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                          +{integration.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {integration.connected ? (
                      <>
                        <button
                          onClick={() => configureIntegration(integration.id)}
                          className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Settings size={14} className="mr-1" />
                          Configure
                        </button>
                        <button
                          onClick={() => disconnectIntegration(integration.id)}
                          className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => connectIntegration(integration.id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus size={14} className="mr-1" />
                        Connect
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredIntegrations.length === 0 && (
              <div className="text-center py-12">
                <Globe size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IntegrationsPanel;