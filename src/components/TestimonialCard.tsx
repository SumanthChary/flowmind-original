import { motion } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
}

const TestimonialCard = ({ quote, name, role, company, avatarUrl }: TestimonialCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 h-full flex flex-col"
    >
      <div className="mb-4">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent-300">
          <path d="M10.667 13.333H5.33366C5.33366 8.00001 9.33366 5.33334 13.3337 4.00001C13.3337 9.33334 10.667 10.6667 10.667 13.333ZM24.0003 13.333H18.667C18.667 8.00001 22.667 5.33334 26.667 4.00001C26.667 9.33334 24.0003 10.6667 24.0003 13.333Z" fill="currentColor"/>
        </svg>
      </div>
      <p className="text-gray-700 italic mb-6 flex-grow">{quote}</p>
      <div className="flex items-center">
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{role}, {company}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;