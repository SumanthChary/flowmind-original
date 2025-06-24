import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ArrowRight, 
  Zap, 
  Workflow, 
  Sparkles, 
  BrainCircuit, 
  LineChart, 
  Mail, 
  Slack, 
  FileText, 
  Calendar, 
  Trello, 
  Code,
  Shield,
  Users,
  Clock,
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  Globe,
  Lock,
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Monitor,
  Smartphone,
  Tablet,
  Bot,
  Target,
  Database,
  MessageSquare,
  Cpu,
  Network,
  Activity,
  BarChart,
  Settings,
  Eye,
  TestTube,
  GitBranch,
  Layers,
  Filter,
  Timer,
  Webhook,
  Brain,
  Lightbulb,
  Rocket,
  Trophy,
  Crown,
  Gem,
  Infinity,
  Flame
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import IntegrationLogo from '../components/IntegrationLogo';

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    document.title = "FlowMind | AI-Powered Workflow Automation Platform";
  }, []);

  const stats = [
    { number: "1M+", label: "AI Operations", icon: <Brain size={24} className="text-purple-600" /> },
    { number: "50K+", label: "Active Users", icon: <Users size={24} className="text-blue-600" /> },
    { number: "99.9%", label: "Uptime SLA", icon: <Shield size={24} className="text-green-600" /> },
    { number: "500+", label: "Integrations", icon: <Globe size={24} className="text-orange-600" /> }
  ];

  const testimonials = [
    {
      quote: "FlowMind's AI agents have revolutionized our customer support. We've reduced response time by 90% while maintaining 98% customer satisfaction. The real AI processing is incredible!",
      name: "Sarah Chen",
      role: "VP of Operations",
      company: "TechCorp Inc.",
      avatarUrl: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
      metrics: "90% faster response time"
    },
    {
      quote: "The workflow automation capabilities are mind-blowing. Our team saves 40+ hours per week, and the AI insights help us make better business decisions. This is the future of work!",
      name: "Michael Rodriguez",
      role: "CTO",
      company: "InnovateLabs",
      avatarUrl: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
      metrics: "40+ hours saved weekly"
    },
    {
      quote: "FlowMind's security and compliance features gave us confidence to automate sensitive processes. The enterprise-grade encryption and audit trails are exactly what we needed.",
      name: "Emma Thompson",
      role: "Chief Security Officer",
      company: "SecureFinance",
      avatarUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
      metrics: "100% compliance achieved"
    }
  ];

  const advancedFeatures = [
    {
      icon: <Brain size={32} className="text-purple-600" />,
      title: "Real AI Processing",
      description: "Powered by Gemini Pro with actual AI analysis, sentiment detection, and intelligent decision making",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Zap size={32} className="text-blue-600" />,
      title: "Lightning Execution",
      description: "Sub-second workflow execution with real-time processing and instant notifications",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Shield size={32} className="text-green-600" />,
      title: "Enterprise Security",
      description: "SOC 2 certified with end-to-end encryption, audit trails, and compliance monitoring",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <TestTube size={32} className="text-orange-600" />,
      title: "Advanced Testing",
      description: "Comprehensive test suites with performance monitoring and quality assurance",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <BarChart size={32} className="text-indigo-600" />,
      title: "Real-time Analytics",
      description: "Live performance metrics, success rates, and actionable business insights",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: <Globe size={32} className="text-teal-600" />,
      title: "500+ Integrations",
      description: "Connect with every major platform including Gmail, Slack, Salesforce, and more",
      gradient: "from-teal-500 to-blue-600"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <motion.div
            style={{ y: y1 }}
            className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          />
          <motion.div
            style={{ y: y2 }}
            className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            transition={{ delay: 1 }}
          />
        </div>

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6 sm:mb-8">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium">Winner of 2025 AI Innovation Award</span>
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-yellow-400" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight"
            >
              The Future of
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                AI Automation
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
            >
              Build intelligent workflows with real AI processing, send actual emails, and automate complex business processes. 
              <span className="text-purple-400 font-semibold"> Powered by Gemini AI</span> with enterprise-grade security.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4"
            >
              <Link 
                to="/pricing" 
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-base sm:text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start Building AI Agents
                  <Rocket size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </Link>
              <Link 
                to="/workflow-builder" 
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-base sm:text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
              >
                <Play size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                Live Demo
              </Link>
            </motion.div>

            {/* Live Demo Preview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative max-w-5xl mx-auto px-4"
            >
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-900/50">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-white text-xs sm:text-sm font-medium">FlowMind AI Workflow Builder</div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="text-white hover:text-purple-400 transition-colors"
                    >
                      {isVideoPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                  {/* Simulated Workflow Canvas */}
                  <div className="absolute inset-2 sm:inset-4 grid grid-cols-4 gap-2 sm:gap-4">
                    {/* Email Trigger Node */}
                    <motion.div
                      animate={{ scale: isVideoPlaying ? [1, 1.05, 1] : 1 }}
                      transition={{ duration: 2, repeat: isVideoPlaying ? Infinity : 0 }}
                      className="bg-blue-600 rounded-lg p-2 sm:p-3 flex items-center justify-center text-white shadow-lg"
                    >
                      <Mail size={16} className="sm:w-5 sm:h-5" />
                    </motion.div>
                    
                    {/* AI Processing Node */}
                    <motion.div
                      animate={{ scale: isVideoPlaying ? [1, 1.05, 1] : 1 }}
                      transition={{ duration: 2, delay: 0.5, repeat: isVideoPlaying ? Infinity : 0 }}
                      className="bg-purple-600 rounded-lg p-2 sm:p-3 flex items-center justify-center text-white shadow-lg"
                    >
                      <Brain size={16} className="sm:w-5 sm:h-5" />
                    </motion.div>
                    
                    {/* Condition Node */}
                    <motion.div
                      animate={{ scale: isVideoPlaying ? [1, 1.05, 1] : 1 }}
                      transition={{ duration: 2, delay: 1, repeat: isVideoPlaying ? Infinity : 0 }}
                      className="bg-yellow-600 rounded-lg p-2 sm:p-3 flex items-center justify-center text-white shadow-lg"
                    >
                      <Filter size={16} className="sm:w-5 sm:h-5" />
                    </motion.div>
                    
                    {/* Action Node */}
                    <motion.div
                      animate={{ scale: isVideoPlaying ? [1, 1.05, 1] : 1 }}
                      transition={{ duration: 2, delay: 1.5, repeat: isVideoPlaying ? Infinity : 0 }}
                      className="bg-green-600 rounded-lg p-2 sm:p-3 flex items-center justify-center text-white shadow-lg"
                    >
                      <CheckCircle size={16} className="sm:w-5 sm:h-5" />
                    </motion.div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                    >
                      {isVideoPlaying ? <Pause size={24} className="sm:w-8 sm:h-8" /> : <Play size={24} className="sm:w-8 sm:h-8" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 sm:py-20 bg-white relative overflow-hidden">
        <div className="container px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Join thousands of companies automating their workflows with AI-powered intelligence
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section ref={featuresRef} className="py-16 sm:py-20 bg-gray-50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Revolutionary AI-Powered Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Experience the next generation of workflow automation with real AI processing and enterprise-grade capabilities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className="mb-4 sm:mb-6">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              See how FlowMind is transforming workflows for teams of all sizes
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 sm:p-8 lg:p-12 text-center"
            >
              <div className="flex justify-center mb-4 sm:mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg sm:text-xl lg:text-2xl text-gray-800 mb-6 sm:mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img
                  src={testimonials[currentTestimonial].avatarUrl}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                />
                <div className="text-center sm:text-left">
                  <div className="font-bold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                  <div className="text-gray-500">{testimonials[currentTestimonial].company}</div>
                  <div className="text-purple-600 font-semibold text-sm mt-1">{testimonials[currentTestimonial].metrics}</div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-12 text-purple-100 px-4">
              Join 50,000+ teams who have automated their work with FlowMind. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Link 
                to="/pricing" 
                className="w-full sm:w-auto bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link 
                to="/features" 
                className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-white hover:text-purple-600 transition-colors"
              >
                Learn More
              </Link>
            </div>
            <p className="text-sm text-purple-200 mt-4 sm:mt-6 px-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;