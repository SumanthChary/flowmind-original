import { useState } from 'react';
import { X, ArrowRight, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, initialMode }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle authentication here
    console.log('Form submitted', { mode, email, password, name });
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-medium max-w-md w-full mx-auto overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-6 py-4 border-b border-gray-100">
            <div className="flex justify-center items-center">
              <BrainCircuit className="h-6 w-6 text-accent-600 mr-2" />
              <h2 className="text-xl font-bold text-center text-gray-900">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="absolute right-6 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {mode === 'login' && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-accent-600 hover:text-accent-800">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary btn-lg flex justify-center items-center"
              >
                {mode === 'login' ? 'Log in' : 'Sign up'} 
                <ArrowRight size={18} className="ml-2" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={switchMode}
                  className="ml-1 text-accent-600 hover:text-accent-800 font-medium"
                >
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>

            {mode === 'signup' && (
              <p className="mt-4 text-xs text-gray-500 text-center">
                By signing up, you agree to our{' '}
                <a href="#" className="text-accent-600 hover:text-accent-800">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-accent-600 hover:text-accent-800">
                  Privacy Policy
                </a>
                .
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthModal;