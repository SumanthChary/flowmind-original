import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  const plan = location.state?.plan;

  useEffect(() => {
    if (!plan) {
      navigate('/pricing');
      return;
    }
    
    document.title = `Checkout - ${plan.title} | FlowMind`;
  }, [plan, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here we'll integrate Stripe later
      toast.error('Payment processing is not available yet');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container py-8">
        <button 
          onClick={() => navigate('/pricing')}
          className="flex items-center text-gray-600 hover:text-accent-600 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Pricing
        </button>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-soft p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Complete your purchase
            </h1>

            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="font-medium text-gray-900 mb-2">
                {plan.title} Plan
              </h2>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="text-2xl font-bold text-gray-900">
                {plan.price.monthly}
                <span className="text-base font-normal text-gray-600">/month</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Information
                </label>
                <div className="relative">
                  <CreditCard size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Card number"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Address
                </label>
                <input
                  type="text"
                  placeholder="Street address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="ZIP code"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Lock size={16} className="mr-2" />
                Your payment information is secure and encrypted
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary btn-lg"
              >
                {loading ? 'Processing...' : `Pay ${plan.price.monthly}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;