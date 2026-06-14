import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const QuickInsights = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="bg-card-light dark:bg-card-dark p-4 lg:p-6 rounded-xl shadow-premium hover-lift"
  >
    <div className="flex items-center mb-4">
      <TrendingUp size={20} className="lg:w-6 lg:h-6 text-secondary mr-2" />
      <h3 className="text-body-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Quick Insights</h3>
    </div>
    <p className="text-text-secondary-light dark:text-text-secondary-dark">You saved 15% more this month! Keep it up!</p>
  </motion.div>
);

export default QuickInsights;
