import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, CheckCircle, Shield, Star } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal');
  
  const plan = location.state?.plan;

  useEffect(() => {
    if (!plan) {
      navigate('/pricing');
      return;
    }
    
    document.title = `Checkout - ${plan.title} | FlowMind`;
  }, [plan, navigate]);

  const paypalOptions = {
    "client-id": "AY5Weq09AmUe8wait0pcC5Gf7TCmTTvrLAFDly3KohpMOOta5VyQ1emKA_k6MnD4CzjqFkpAJkWYANPa",
    currency: "USD",
    intent: "capture",
  };

  const handlePayPalSuccess = (details: any) => {
    toast.success('Payment successful! Welcome to FlowMind Pro!');
    console.log('PayPal payment successful:', details);
    navigate('/dashboard');
  };

  const handlePayPalError = (error: any) => {
    toast.error('Payment failed. Please try again.');
    console.error('PayPal payment error:', error);
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate card processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Payment successful! Welcome to FlowMind Pro!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return null;

  const monthlyPrice = parseFloat(plan.price.monthly.replace('$', ''));
  const yearlyPrice = parseFloat(plan.price.yearly.replace('$', ''));

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/pricing')}
          className="flex items-center text-gray-600 hover:text-accent-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Pricing
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.title} Plan</h3>
                  {plan.popular && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="space-y-3 mb-6">
                  {plan.features.slice(0, 5).map((feature: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Monthly Price:</span>
                    <span className="text-2xl font-bold text-gray-900">{plan.price.monthly}/month</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Yearly Price:</span>
                    <span className="text-lg font-semibold text-green-600">{plan.price.yearly}/month (Save 20%)</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <div className="flex items-center mb-3">
                  <Shield size={20} className="text-green-600 mr-2" />
                  <span className="font-semibold text-green-800">Secure Payment</span>
                </div>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center">
                    <CheckCircle size={14} className="mr-2" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle size={14} className="mr-2" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle size={14} className="mr-2" />
                    <span>Money-back guarantee</span>
                  </div>
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">What our customers say:</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex text-yellow-400 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-current" />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">"FlowMind has transformed our workflow automation. Incredible value!"</p>
                      <p className="text-xs text-gray-500 mt-1">- Sarah K., Product Manager</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex text-yellow-400 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-current" />
                      ))}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">"The AI features are game-changing. Best investment we've made."</p>
                      <p className="text-xs text-gray-500 mt-1">- Mike R., CTO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border-2 rounded-xl transition-colors ${
                      paymentMethod === 'paypal'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-blue-600 font-bold text-lg mb-1">PayPal</div>
                      <div className="text-xs text-gray-600">Secure & Fast</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-xl transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <CreditCard size={24} className="mx-auto text-gray-600 mb-1" />
                      <div className="text-xs text-gray-600">Credit Card</div>
                    </div>
                  </button>
                </div>
              </div>

              {paymentMethod === 'paypal' ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <Lock size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Secure PayPal Payment</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      You'll be redirected to PayPal to complete your payment securely. No card details needed.
                    </p>
                  </div>

                  <PayPalScriptProvider options={paypalOptions}>
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "blue",
                        shape: "rect",
                        label: "paypal",
                        height: 50
                      }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: monthlyPrice.toString(),
                                currency_code: "USD"
                              },
                              description: `FlowMind ${plan.title} Plan - Monthly Subscription`
                            }
                          ]
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          handlePayPalSuccess(details);
                        });
                      }}
                      onError={handlePayPalError}
                      onCancel={() => {
                        toast.info('Payment cancelled');
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              ) : (
                <form onSubmit={handleCardSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Information
                    </label>
                    <div className="relative">
                      <CreditCard size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Information
                    </label>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        defaultValue={user?.email || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Street Address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="City"
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                    <Lock size={16} className="mr-2 flex-shrink-0" />
                    <span>Your payment information is secure and encrypted with 256-bit SSL</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-accent-600 to-accent-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-accent-700 hover:to-accent-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Complete Payment - ${plan.price.monthly}`
                    )}
                  </button>
                </form>
              )}

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Shield size={14} className="mr-1" />
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle size={14} className="mr-1" />
                    <span>PCI Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <Lock size={14} className="mr-1" />
                    <span>256-bit Encryption</span>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-500 mt-4">
                  30-day money-back guarantee • Cancel anytime • No hidden fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;