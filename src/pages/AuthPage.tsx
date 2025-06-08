import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Loader2, ArrowLeft, Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'signup'>(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailValid, setEmailValid] = useState(false);

  useEffect(() => {
    document.title = mode === 'login' ? 'Sign In | FlowMind' : 'Sign Up | FlowMind';
  }, [mode]);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  // Password strength calculation
  useEffect(() => {
    if (mode === 'signup') {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[a-z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
      setPasswordStrength(strength);
    }
  }, [password, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!emailValid) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });
        if (error) throw error;
        toast.success('Account created successfully! You are now logged in.');
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
    navigate(`/auth?mode=${mode === 'login' ? 'signup' : 'login'}`, { replace: true });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-error-500';
    if (passwordStrength < 75) return 'bg-warning-500';
    return 'bg-success-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-medium p-8 border border-gray-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              className="flex justify-center items-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 p-3 rounded-xl">
                <BrainCircuit className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-gray-600">
              {mode === 'login' 
                ? 'Sign in to access your workflows' 
                : 'Start automating your work today'
              }
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 p-4 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm flex items-start"
              >
                <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all hover:border-gray-400"
                      placeholder="John Doe"
                      required
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all hover:border-gray-400 ${
                    email && (emailValid ? 'border-success-300' : 'border-error-300')
                  }`}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
                {email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailValid ? (
                      <CheckCircle size={18} className="text-success-500" />
                    ) : (
                      <AlertCircle size={18} className="text-error-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all hover:border-gray-400"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {mode === 'signup' && password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Password strength</span>
                    <span className={`font-medium ${
                      passwordStrength < 50 ? 'text-error-600' : 
                      passwordStrength < 75 ? 'text-warning-600' : 'text-success-600'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Password should contain:</p>
                    <ul className="mt-1 space-y-1">
                      <li className={`flex items-center ${password.length >= 8 ? 'text-success-600' : 'text-gray-400'}`}>
                        <CheckCircle size={12} className="mr-1" />
                        At least 8 characters
                      </li>
                      <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-success-600' : 'text-gray-400'}`}>
                        <CheckCircle size={12} className="mr-1" />
                        One uppercase letter
                      </li>
                      <li className={`flex items-center ${/[a-z]/.test(password) ? 'text-success-600' : 'text-gray-400'}`}>
                        <CheckCircle size={12} className="mr-1" />
                        One lowercase letter
                      </li>
                      <li className={`flex items-center ${(/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) ? 'text-success-600' : 'text-gray-400'}`}>
                        <CheckCircle size={12} className="mr-1" />
                        One number or special character
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading || !emailValid || (mode === 'signup' && passwordStrength < 50)}
              className="w-full bg-gradient-to-r from-accent-600 to-accent-700 text-white py-3 px-4 rounded-lg font-medium hover:from-accent-700 hover:to-accent-800 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </motion.button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                disabled={loading}
                className="ml-1 text-accent-600 hover:text-accent-800 font-medium transition-colors disabled:opacity-50 hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Additional Info */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 text-xs text-gray-500 text-center border-t border-gray-100 pt-6"
              >
                <p>
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-accent-600 hover:text-accent-800 transition-colors underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-accent-600 hover:text-accent-800 transition-colors underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-4">What you'll get:</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center text-gray-600">
                <CheckCircle size={14} className="text-success-500 mr-2 flex-shrink-0" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle size={14} className="text-success-500 mr-2 flex-shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle size={14} className="text-success-500 mr-2 flex-shrink-0" />
                <span>500+ integrations</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle size={14} className="text-success-500 mr-2 flex-shrink-0" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500 mb-4">Trusted by 50,000+ teams worldwide</p>
          <div className="flex justify-center items-center space-x-6 opacity-60">
            <div className="text-xs text-gray-400">🔒 SOC 2 Certified</div>
            <div className="text-xs text-gray-400">🛡️ GDPR Compliant</div>
            <div className="text-xs text-gray-400">⭐ 4.9/5 Rating</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;