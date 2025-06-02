import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface IntegrationLogoProps {
  name: string;
  icon: ReactNode;
  darkMode?: boolean;
}

const IntegrationLogo = ({ name, icon, darkMode = false }: IntegrationLogoProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center justify-center p-4 rounded-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white shadow-soft border border-gray-100'
      }`}
    >
      <div className={`h-10 w-10 flex items-center justify-center ${darkMode ? 'text-white' : 'text-gray-700'}`}>
        {icon}
      </div>
      <span className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {name}
      </span>
    </motion.div>
  );
};

export default IntegrationLogo;