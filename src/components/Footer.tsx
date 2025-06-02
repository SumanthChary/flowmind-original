import { Link } from 'react-router-dom';
import { BrainCircuit, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 mt-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <BrainCircuit className="h-8 w-8 text-accent-600" />
              <span className="text-xl font-bold text-gray-900">FlowMind</span>
            </Link>
            <p className="mt-4 text-gray-600 text-sm">
              AI-powered universal workflow automation platform that connects your favorite work apps.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://x.com/SumanthChary07" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.github.com/SumanthChary" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent-600 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/sumanthchary" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-accent-600 transition-colors text-sm">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FlowMind, Inc. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-gray-500 text-sm flex items-center">
              <Mail size={16} className="mr-2" /> contact@flowmind.ai
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;