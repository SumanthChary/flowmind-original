import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Workflow, Sparkles, BrainCircuit, LineChart, Mail, Slack, FileText, Calendar, Trello, Code } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import IntegrationLogo from '../components/IntegrationLogo';

const HomePage = () => {
  useEffect(() => {
    document.title = "FlowMind | AI-Powered Workflow Automation";
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-hero-pattern">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="heading-1 text-gray-900 mb-6"
            >
              Automate Everything.
              <br />
              <span className="text-primary-600">Focus on What Matters.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="subtitle mb-8 max-w-2xl mx-auto"
            >
              FlowMind connects your favorite work apps and handles the busywork—so you can do your best work, effortlessly.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/pricing" className="btn-primary btn-lg">
                Get Started Free
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <a href="#demo" className="btn-secondary btn-lg">
                See Live Demo
              </a>
            </motion.div>
          </div>

          {/* Trusted By Section */}
          <div className="mt-16">
            <p className="text-center text-sm font-medium text-gray-500 mb-6">
              TRUSTED BY TEAMS WORLDWIDE
            </p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1682688295257493510/Y9VWUlPF_400x400.jpg" 
                alt="Company Logo" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1676995077979607040/ld7MwLmC_400x400.jpg" 
                alt="Company Logo" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1741956737773891584/XuQwx55r_400x400.jpg" 
                alt="Company Logo" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg" 
                alt="Company Logo" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1727080063071084544/7pZLnLQx_400x400.jpg" 
                alt="Company Logo" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ opacity: 1 }}
                src="https://pbs.twimg.com/profile_images/1679072590520729600/dZQOx1Jc_400x400.jpg" 
                alt="Company Logo" 
                className="h-8 mx-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              Supercharge Your Workflow
            </h2>
            <p className="subtitle">
              FlowMind seamlessly connects your favorite apps and automates repetitive tasks, so you can focus on what really matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Workflow size={24} className="text-accent-600" />}
              title="Smart Automation"
              description="Create powerful automation workflows without writing a single line of code. Connect apps, trigger actions, and watch the magic happen."
            />
            <FeatureCard
              icon={<BrainCircuit size={24} className="text-accent-600" />}
              title="AI-Powered Suggestions"
              description="Our AI analyzes your work patterns and suggests optimizations to your workflows, helping you save more time every day."
            />
            <FeatureCard
              icon={<Zap size={24} className="text-accent-600" />}
              title="Lightning Fast Setup"
              description="Get started in minutes, not days. Our intuitive interface makes it easy to create complex workflows with just a few clicks."
            />
            <FeatureCard
              icon={<Sparkles size={24} className="text-accent-600" />}
              title="Customizable Templates"
              description="Choose from hundreds of pre-built templates or create your own. Customize every aspect to match your unique needs."
            />
            <FeatureCard
              icon={<LineChart size={24} className="text-accent-600" />}
              title="Powerful Analytics"
              description="Gain insights into your automation performance with detailed analytics. Optimize your workflows for maximum efficiency."
            />
            <FeatureCard
              icon={<Code size={24} className="text-accent-600" />}
              title="Developer-Friendly"
              description="For power users, our API and custom function support lets you extend FlowMind's capabilities to fit complex scenarios."
            />
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
              FlowMind seamlessly integrates with 100+ popular work apps, so you can automate your entire tech stack.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <IntegrationLogo name="Gmail" icon={<Mail size={24} />} />
            <IntegrationLogo name="Slack" icon={<Slack size={24} />} />
            <IntegrationLogo name="Notion" icon={<FileText size={24} />} />
            <IntegrationLogo name="Google Calendar" icon={<Calendar size={24} />} />
            <IntegrationLogo name="Trello" icon={<Trello size={24} />} />
            <IntegrationLogo name="GitHub" icon={<Code size={24} />} />
          </div>

          <div className="text-center mt-12">
            <Link to="/features" className="inline-flex items-center text-accent-600 hover:text-accent-700 font-medium">
              View all integrations
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="subtitle">
              See how FlowMind is transforming workflows for teams of all sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-gray-900 mb-4">
              Ready to Automate Your Workflow?
            </h2>
            <p className="subtitle mb-8">
              Join thousands of teams who have transformed their productivity with FlowMind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing" className="btn-primary btn-lg">
                Get Started Free
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/features" className="btn-secondary btn-lg">
                Learn More
              </Link>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              No credit card required. Free 14-day trial.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;