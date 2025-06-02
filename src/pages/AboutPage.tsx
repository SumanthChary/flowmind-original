import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Award, Zap, Heart } from 'lucide-react';

const AboutPage = () => {
  useEffect(() => {
    document.title = "About | FlowMind";
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
              We're on a Mission to
              <br />
              <span className="text-primary-600">Eliminate Busywork</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="subtitle mb-8 max-w-2xl mx-auto"
            >
              FlowMind was founded with a simple idea: everyone deserves to focus on meaningful work, not repetitive tasks.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                FlowMind began in 2023 when our founders, who were working at a fast-growing startup, became frustrated with the amount of time they spent switching between tools and performing repetitive tasks.
              </p>
              <p className="text-gray-600 mb-4">
                They envisioned a platform that could seamlessly connect all their favorite work apps and automate the busywork, allowing them to focus on creative and strategic tasks that truly required human intelligence.
              </p>
              <p className="text-gray-600">
                Today, FlowMind has grown into a powerful workflow automation platform used by thousands of teams worldwide, from solo entrepreneurs to Fortune 500 companies. Our mission remains the same: to give people back their time so they can focus on what truly matters.
              </p>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="FlowMind Team" 
                className="rounded-lg shadow-medium w-full h-auto object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">Our Values</h2>
            <p className="subtitle">
              These core principles guide everything we do at FlowMind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">People First</h3>
              <p className="text-gray-600">
                We believe in treating our customers, partners, and team members with respect and empathy. Your success is our success.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Award size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We're committed to building the best product possible. We sweat the details and constantly push ourselves to improve.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Zap size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We're not afraid to challenge the status quo and think differently. We embrace new ideas and technologies.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Heart size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-gray-600">
                We believe in open communication and honest feedback. We share our successes and our failures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">Meet Our Team</h2>
            <p className="subtitle">
              We're a diverse group of passionate individuals working together to transform how people work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Team Member" 
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">Alex Johnson</h3>
              <p className="text-gray-600">Co-Founder & CEO</p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Team Member" 
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">Sarah Chen</h3>
              <p className="text-gray-600">Co-Founder & CTO</p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/8159657/pexels-photo-8159657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Team Member" 
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">Michael Rodriguez</h3>
              <p className="text-gray-600">Head of Product</p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Team Member" 
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">Emma Wilson</h3>
              <p className="text-gray-600">Head of Design</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              And many more talented individuals who make FlowMind possible.
            </p>
            <a href="#" className="text-accent-600 hover:text-accent-700 font-medium inline-flex items-center">
              Join our team
              <ArrowRight size={16} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-gray-900 mb-4">
              Ready to Join Us on Our Mission?
            </h2>
            <p className="subtitle mb-8">
              Start automating your workflows today and focus on what truly matters.
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

export default AboutPage;