import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ProactiveTip = () => {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTip();
    }
  }, [user]);

  const fetchTip = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/proactive-tip`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setTip(data.tip);
      } else {
        setTip("Track your spending carefully and set realistic savings goals to build a strong financial future.");
      }
    } catch (error) {
      console.error('Failed to fetch tip:', error);
      setTip('Start by tracking your daily expenses to identify areas where you can save more money.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  if (loading) return (
    <div className="card p-6 h-32 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <RefreshCw size={24} className="text-primary animate-spin" />
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">Analyzing your finances...</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative group overflow-hidden"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>

      <div className="relative card p-6 hover:shadow-card-hover transition-all duration-300">
        {/* Decorative background icon */}
        <div className="absolute -right-4 -bottom-4 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-500">
          <Lightbulb size={120} />
        </div>

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-purple-500/10 mr-3">
              <Sparkles size={18} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">AI Financial Tip</h3>
          </div>
          <button
            onClick={fetchTip}
            title="Refresh tip"
            className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        <motion.p
          key={tip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-text-secondary-light dark:text-text-secondary-dark relative z-10 leading-relaxed font-medium"
        >
          {tip}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ProactiveTip;