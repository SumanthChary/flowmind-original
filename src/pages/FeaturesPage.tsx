import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Workflow, Sparkles, BrainCircuit, LineChart, Code, Globe, ShieldCheck, Users, BarChart, Search } from 'lucide-react';

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

const FeaturesPage = () => {
  useEffect(() => {
    document.title = "Features | FlowMind";
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-hero-pattern">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="heading-1 text-gray-900 mb-6"
            >
              Powerful Features for 
              <br />
              <span className="text-primary-600">Modern Teams</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="subtitle mb-8 max-w-2xl mx-auto"
            >
              FlowMind combines the power of AI with intuitive design to create the ultimate workflow automation platform.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <FeatureSection
        title="AI-Powered Workflow Automation"
        description="Create complex automation workflows with our intuitive visual builder. Connect your favorite apps and let AI handle the busywork."
        image="https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="AI-Powered Workflow Automation"
        features={[
          {
            icon: <BrainCircuit size={18} />,
            title: "AI Suggestions",
            description: "Our AI analyzes your work patterns and suggests optimizations to your workflows."
          },
          {
            icon: <Workflow size={18} />,
            title: "Visual Workflow Builder",
            description: "Drag-and-drop interface to build workflows without coding knowledge."
          },
          {
            icon: <Sparkles size={18} />,
            title: "Smart Triggers",
            description: "Set up conditional triggers that activate workflows based on specific events."
          }
        ]}
      />

      <FeatureSection
        title="Seamless App Integrations"
        description="Connect with 100+ popular work apps out of the box. Our extensive integration library ensures compatibility with your entire tech stack."
        image="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="Seamless App Integrations"
        features={[
          {
            icon: <Globe size={18} />,
            title: "Universal Connectivity",
            description: "Connect with any app that has an API, even if we don't have a native integration."
          },
          {
            icon: <Code size={18} />,
            title: "Custom Functions",
            description: "Write custom JavaScript functions to extend functionality for complex scenarios."
          },
          {
            icon: <Search size={18} />,
            title: "Smart App Discovery",
            description: "AI suggests relevant apps based on your workflow needs and existing stack."
          }
        ]}
        isReversed={true}
        bgColor="bg-gray-50"
      />

      <FeatureSection
        title="Enterprise-Grade Security"
        description="FlowMind is built with security at its core. Your data is encrypted, and you have complete control over permissions and access."
        image="https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="Enterprise-Grade Security"
        features={[
          {
            icon: <ShieldCheck size={18} />,
            title: "End-to-End Encryption",
            description: "All your data is encrypted in transit and at rest using industry-standard protocols."
          },
          {
            icon: <Users size={18} />,
            title: "Role-Based Access Control",
            description: "Define precise permissions for team members to control who can create, edit, or view workflows."
          },
          {
            icon: <LineChart size={18} />,
            title: "Audit Logs",
            description: "Comprehensive logs of all activities for compliance and security monitoring."
          }
        ]}
      />

      <FeatureSection
        title="Analytics & Reporting"
        description="Gain insights into your automation performance and team productivity with detailed analytics and customizable dashboards."
        image="https://images.pexels.com/photos/7947840/pexels-photo-7947840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        imageAlt="Analytics & Reporting"
        features={[
          {
            icon: <BarChart size={18} />,
            title: "Performance Metrics",
            description: "Track execution times, success rates, and resource usage for all your workflows."
          },
          {
            icon: <Zap size={18} />,
            title: "Time Savings Calculator",
            description: "See exactly how much time your team is saving with automation, quantified in hours and cost."
          },
          {
            icon: <LineChart size={18} />,
            title: "Custom Dashboards",
            description: "Build tailored dashboards that show the metrics most important to your business."
          }
        ]}
        isReversed={true}
        bgColor="bg-gray-50"
      />

      {/* CTA Section */}
      <section className="py-20 bg-primary-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-gray-900 mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="subtitle mb-8">
              Join thousands of teams who have boosted their productivity with FlowMind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing" className="btn-primary btn-lg">
                Get Started Free
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/pricing" className="btn-secondary btn-lg">
                View Pricing
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

export default FeaturesPage;