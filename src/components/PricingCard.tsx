import { Check } from 'lucide-react';
import Button from './Button';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: {
    monthly: string;
    yearly: string;
  };
  features: PricingFeature[];
  ctaText: string;
  popular?: boolean;
  billingPeriod: 'monthly' | 'yearly';
}

const PricingCard = ({ 
  title, 
  description, 
  price, 
  features, 
  ctaText, 
  popular = false,
  billingPeriod,
}: PricingCardProps) => {
  return (
    <div className={`
      rounded-xl p-8 h-full flex flex-col
      ${popular 
        ? 'bg-accent-50 border-2 border-accent-500 shadow-medium relative' 
        : 'bg-white border border-gray-200 shadow-soft'}
    `}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="mb-6">
        <span className="text-4xl font-bold">
          {billingPeriod === 'monthly' ? price.monthly : price.yearly}
        </span>
        <span className="text-gray-500 ml-2">
          / {billingPeriod === 'monthly' ? 'month' : 'year'}
        </span>
        
        {billingPeriod === 'yearly' && (
          <div className="mt-2 text-sm text-success-700 font-medium">
            Save 20% with annual billing
          </div>
        )}
      </div>
      
      <div className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5 ${
              feature.included ? 'text-success-500' : 'text-gray-400'
            }`}>
              {feature.included ? <Check size={16} /> : <span>-</span>}
            </div>
            <span className={`ml-3 text-sm ${
              feature.included ? 'text-gray-700' : 'text-gray-500'
            }`}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>
      
      <Button 
        variant={popular ? 'primary' : 'outline'}
        fullWidth
        size="lg"
      >
        {ctaText}
      </Button>
    </div>
  );
};

export default PricingCard;