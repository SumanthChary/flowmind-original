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
  Headphones
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import IntegrationLogo from '../components/IntegrationLogo';

const HomePage = () => {
  useEffect(() => {
    document.title = "FlowMind | AI-Powered Workflow Automation";
  }, []);

  const stats = [
    { number: "50,000+", label: "Active Users" },
    { number: "2M+", label: "Tasks Automated" },
    { number: "99.9%", label: "Uptime" },
    { number: "500+", label: "Integrations" }
  ];

  const securityFeatures = [
    {
      icon: <Shield size={20} className="text-primary-600" />,
      title: "Enterprise Security",
      description: "SOC 2 Type II certified with end-to-end encryption"
    },
    {
      icon: <Lock size={20} className="text-primary-600" />,
      title: "GDPR Compliant",
      description: "Full compliance with international data protection regulations"
    },
    {
      icon: <Award size={20} className="text-primary-600" />,
      title: "ISO 27001",
      description: "Certified information security management system"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-hero-pattern">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-4">
                <Sparkles size={16} className="mr-2" />
                Trusted by 50,000+ teams worldwide
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="heading-1 text-gray-900 mb-6"
            >
              Automate Everything.
              <br />
              <span className="text-primary-600">Focus on What Matters.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="subtitle mb-8 max-w-3xl mx-auto"
            >
              FlowMind connects your favorite work apps and handles the busywork—so you can do your best work, effortlessly. Join thousands of teams saving 20+ hours per week.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Link to="/pricing" className="btn-primary btn-lg">
                Start Free Trial
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <a href="#demo" className="btn-secondary btn-lg">
                Watch Demo
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-gray-600"
            >
              No credit card required • 14-day free trial • Setup in 5 minutes
            </motion.p>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Trusted By Section */}
          <div className="mt-16">
            <p className="text-center text-sm font-medium text-gray-500 mb-8">
              TRUSTED BY INNOVATIVE COMPANIES
            </p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 opacity-60">
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1747713947896905728/nqz0zVVo_400x400.jpg" 
                alt="Vercel" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1751988397024690176/AwhYtaHS_400x400.jpg" 
                alt="Supabase" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1753742272341680128/nVGLYWrz_400x400.jpg" 
                alt="Cloudflare" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1753797158255386624/kBFPY-xT_400x400.jpg" 
                alt="Railway" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1752104478083870720/1KNTO_hc_400x400.jpg" 
                alt="Planetscale" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1753741414915198976/UabMwEKY_400x400.jpg" 
                alt="Prisma" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-16 bg-white" id="demo">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-2 text-gray-900 mb-4">
                See FlowMind in Action
              </h2>
              <p className="subtitle">
                Watch how easy it is to automate your workflows in just minutes
              </p>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-medium bg-gray-900">
              <div className="aspect-video bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6 hover:bg-opacity-30 transition-all">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white ml-1">
                    <path d="M8 5v14l11-7z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              Everything You Need to Automate
            </h2>
            <p className="subtitle">
              FlowMind provides all the tools you need to create powerful automation workflows without any technical expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Workflow size={24} className="text-accent-600" />}
              title="Visual Workflow Builder"
              description="Create complex automation workflows with our intuitive drag-and-drop interface. No coding required."
            />
            <FeatureCard
              icon={<BrainCircuit size={24} className="text-accent-600" />}
              title="AI-Powered Suggestions"
              description="Our AI analyzes your work patterns and suggests optimizations to save you even more time."
            />
            <FeatureCard
              icon={<Zap size={24} className="text-accent-600" />}
              title="Lightning Fast Setup"
              description="Get started in minutes with pre-built templates and one-click integrations."
            />
            <FeatureCard
              icon={<Globe size={24} className="text-accent-600" />}
              title="500+ Integrations"
              description="Connect with all your favorite tools including Slack, Gmail, Notion, and hundreds more."
            />
            <FeatureCard
              icon={<LineChart size={24} className="text-accent-600" />}
              title="Advanced Analytics"
              description="Track performance, measure time savings, and optimize your workflows with detailed insights."
            />
            <FeatureCard
              icon={<Shield size={24} className="text-accent-600" />}
              title="Enterprise Security"
              description="SOC 2 certified with enterprise-grade security, encryption, and compliance features."
            />
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              Enterprise-Grade Security You Can Trust
            </h2>
            <p className="subtitle">
              Your data security is our top priority. FlowMind meets the highest industry standards for security and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="flex justify-center items-center space-x-8 mb-6">
              <img src="https://via.placeholder.com/120x60/e5e7eb/6b7280?text=SOC+2" alt="SOC 2 Certified" className="h-12 opacity-70" />
              <img src="https://via.placeholder.com/120x60/e5e7eb/6b7280?text=GDPR" alt="GDPR Compliant" className="h-12 opacity-70" />
              <img src="https://via.placeholder.com/120x60/e5e7eb/6b7280?text=ISO+27001" alt="ISO 27001" className="h-12 opacity-70" />
            </div>
            <p className="text-gray-600">
              Trusted by Fortune 500 companies and startups alike. Your data is encrypted in transit and at rest.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              Works With Your Favorite Tools
            </h2>
            <p className="subtitle">
              FlowMind seamlessly integrates with 500+ popular work apps, so you can automate your entire tech stack.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            <IntegrationLogo name="Gmail" icon={<Mail size={24} />} />
            <IntegrationLogo name="Slack" icon={<Slack size={24} />} />
            <IntegrationLogo name="Notion" icon={<FileText size={24} />} />
            <IntegrationLogo name="Google Calendar" icon={<Calendar size={24} />} />
            <IntegrationLogo name="Trello" icon={<Trello size={24} />} />
            <IntegrationLogo name="GitHub" icon={<Code size={24} />} />
          </div>

          <div className="text-center">
            <Link to="/features" className="inline-flex items-center text-accent-600 hover:text-accent-700 font-medium">
              View all 500+ integrations
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="subtitle">
              See how FlowMind is transforming workflows for teams of all sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <TestimonialCard
              quote="FlowMind has completely transformed how our marketing team works. We've automated our content calendar, social media posting, and analytics reporting—saving us 15+ hours every week."
              name="Sarah Johnson"
              role="Marketing Director"
              company="Acme Inc."
              avatarUrl="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
            <TestimonialCard
              quote="As a product manager, I juggle dozens of tasks across multiple tools. FlowMind connects everything and ensures nothing falls through the cracks. It's like having a personal assistant."
              name="Michael Chen"
              role="Product Manager"
              company="TechCorp"
              avatarUrl="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
            <TestimonialCard
              quote="Setting up FlowMind took minutes, not days like other automation tools. The AI suggestions have helped us discover workflow optimizations we never would have thought of ourselves."
              name="Emma Rodriguez"
              role="Operations Lead"
              company="Startup Studio"
              avatarUrl="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
          </div>

          {/* Review Stats */}
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">4.9/5</div>
                <div className="text-gray-600">Average rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">10,000+</div>
                <div className="text-gray-600">Happy customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">99%</div>
                <div className="text-gray-600">Would recommend</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="heading-2 text-gray-900 mb-4">
                  World-Class Support When You Need It
                </h2>
                <p className="subtitle mb-6">
                  Our expert support team is here to help you succeed. Get answers fast with our comprehensive resources and dedicated support.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Headphones size={20} className="text-accent-600 mr-3" />
                    <span>24/7 live chat support</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={20} className="text-accent-600 mr-3" />
                    <span>Average response time: 2 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={20} className="text-accent-600 mr-3" />
                    <span>Dedicated success manager for Enterprise</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-soft p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Headphones size={24} className="text-accent-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-gray-600">Our team is standing by to help you get started</p>
                </div>
                <button className="w-full btn-primary">
                  Start Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join 50,000+ teams who have automated their work with FlowMind. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center">
                Start Free Trial
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/features" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Learn More
              </Link>
            </div>
            <p className="text-sm text-primary-200 mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;