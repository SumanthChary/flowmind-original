import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 p-3 rounded-lg bg-accent-50 w-fit">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;