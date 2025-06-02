import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle } from 'lucide-react';
import PricingCard from '../components/PricingCard';

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    document.title = "Pricing | FlowMind";
  }, []);

  const toggleBillingPeriod = () => {
    setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly');
  };

  const pricingPlans = [
    {
      title: "Free",
      description: "For individuals just getting started with automation.",
      price: {
        monthly: "$0",
        yearly: "$0",
      },
      features: [
        { text: "5 active workflows", included: true },
        { text: "100 tasks per month", included: true },
        { text: "Standard integrations (20+ apps)", included: true },
        { text: "Email support", included: true },
        { text: "Advanced integrations", included: false },
        { text: "Team collaboration", included: false },
        { text: "Advanced security", included: false },
        { text: "API access", included: false },
      ],
      ctaText: "Get Started",
      popular: false,
    },
    {
      title: "Pro",
      description: "For professionals who need more power and flexibility.",
      price: {
        monthly: "$19",
        yearly: "$15",
      },
      features: [
        { text: "Unlimited workflows", included: true },
        { text: "1,000 tasks per month", included: true },
        { text: "All integrations (100+ apps)", included: true },
        { text: "Priority support", included: true },
        { text: "Team collaboration (up to 3 users)", included: true },
        { text: "Advanced security", included: true },
        { text: "API access", included: true },
        { text: "Custom functions", included: false },
      ],
      ctaText: "Get Started",
      popular: true,
    },
    {
      title: "Business",
      description: "For teams that need advanced features and more capacity.",
      price: {
        monthly: "$49",
        yearly: "$39",
      },
      features: [
        { text: "Unlimited workflows", included: true },
        { text: "10,000 tasks per month", included: true },
        { text: "All integrations (100+ apps)", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Team collaboration (unlimited users)", included: true },
        { text: "Advanced security & SSO", included: true },
        { text: "API access", included: true },
        { text: "Custom functions", included: true },
      ],
      ctaText: "Get Started",
      popular: false,
    },
  ];

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
              Simple, Transparent
              <br />
              <span className="text-primary-600">Pricing</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="subtitle mb-8 max-w-2xl mx-auto"
            >
              Choose the plan that's right for you. All plans include a 14-day free trial.
            </motion.p>

            {/* Billing Toggle */}
            <div className="flex justify-center items-center space-x-3 mb-12">
              <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button 
                onClick={toggleBillingPeriod}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
              >
                <span 
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                  }`} 
                />
              </button>
              <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              <span className="ml-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Save 20%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 -mt-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                description={plan.description}
                price={plan.price}
                features={plan.features}
                ctaText={plan.ctaText}
                popular={plan.popular}
                billingPeriod={billingPeriod}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">
              Need a Custom Solution?
            </h2>
            <p className="subtitle">
              For larger teams with specific requirements, we offer custom enterprise plans.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-medium border border-gray-200 p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <p className="text-gray-600 mb-6">
                  Custom solutions for organizations with advanced needs.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check size={20} className="text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3">Unlimited everything</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3">Custom integrations</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3">99.99% uptime SLA</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3">Advanced security & compliance</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-3">On-premise deployment option</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-lg font-medium mb-4">
                  Contact us to discuss your specific requirements and get a custom quote.
                </p>
                <button className="btn-primary btn-lg">
                  Contact Sales
                </button>
                <p className="text-sm text-gray-600 mt-3">
                  Typically replies within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="subtitle">
              Have questions about FlowMind? We've got answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div>
                <h3 className="flex items-center text-xl font-medium text-gray-900 mb-2">
                  <HelpCircle size={20} className="text-accent-500 mr-2" />
                  Can I change plans later?
                </h3>
                <p className="text-gray-600 ml-7">
                  Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, you'll be prorated for the remainder of your billing period. If you downgrade, the new plan will take effect at the next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-xl font-medium text-gray-900 mb-2">
                  <HelpCircle size={20} className="text-accent-500 mr-2" />
                  What happens after my free trial?
                </h3>
                <p className="text-gray-600 ml-7">
                  After your 14-day free trial, you'll be asked to select a plan and enter payment information. We'll send you a reminder before your trial ends, and you can cancel anytime.
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-xl font-medium text-gray-900 mb-2">
                  <HelpCircle size={20} className="text-accent-500 mr-2" />
                  Do you offer discounts for nonprofits or education?
                </h3>
                <p className="text-gray-600 ml-7">
                  Yes, we offer special pricing for nonprofits, educational institutions, and open source projects. Please contact our sales team for more information.
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-xl font-medium text-gray-900 mb-2">
                  <HelpCircle size={20} className="text-accent-500 mr-2" />
                  How does task usage work?
                </h3>
                <p className="text-gray-600 ml-7">
                  A task is counted each time a workflow is triggered and executes an action. For example, if you have a workflow that sends an email when a form is submitted, each form submission counts as one task.
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-xl font-medium text-gray-900 mb-2">
                  <HelpCircle size={20} className="text-accent-500 mr-2" />
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 ml-7">
                  We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoicing with net-30 terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;