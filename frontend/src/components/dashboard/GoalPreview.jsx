import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const GoalPreview = () => {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTopGoal();
    }
  }, [user]);

  const fetchTopGoal = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/goals`, {
        credentials: 'include',
      });
      if (response.ok) {
        const goals = await response.json();
        if (goals.length > 0) {
          // Get the goal with the highest progress or just the first one
          setGoal(goals[0]);
        }
        setError(null);
      } else {
        const err = await response.json().catch(() => null);
        setError(err?.message || `Failed to fetch goals (status ${response.status})`);
      }
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="card p-6 h-40 animate-pulse flex flex-col space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="card p-6 border-l-4 border-red-500 flex items-center justify-center h-40">
      <p className="text-red-500 text-sm font-medium text-center">{error}</p>
    </div>
  );

  if (!goal)
    return (
      <Link to="/goals">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-8 text-center flex flex-col items-center justify-center border-dashed border-2 border-border-light/50 h-40 group hover:border-primary/50 transition-all duration-300"
        >
          <div className="p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 mb-3 transition-colors">
            <Target size={32} className="text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium group-hover:text-primary transition-colors">No goals yet. Create one!</p>
        </motion.div>
      </Link>
    );

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysRemaining = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Link to="/goals" className="block outline-none">
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className="relative group h-full"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>

        <div className="relative card p-6 hover:shadow-card-hover transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-secondary-500/10 to-primary-500/10 mr-3">
                <Target size={20} className="text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark truncate pr-2 max-w-[150px]">
                {goal.name}
              </h3>
            </div>
            <div className="flex items-center text-xs font-bold text-secondary uppercase tracking-wider">
              <TrendingUp size={14} className="mr-1" />
              {Math.min(100, progress).toFixed(0)}%
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-secondary bg-secondary/10">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold inline-block text-text-primary-light dark:text-text-primary-dark">
                    ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-gray-100 dark:bg-gray-800/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-secondary to-primary rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 shimmer rounded-full"></div>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border-light/30 dark:border-border-dark/30">
              <div className="flex items-center text-text-secondary-light dark:text-text-secondary-dark text-xs">
                <Calendar size={14} className="mr-1.5" />
                {daysRemaining !== null ? (
                  daysRemaining > 0 ? `${daysRemaining} days left` : 'Deadline passed'
                ) : 'No deadline'}
              </div>
              <div className="flex items-center text-primary text-xs font-bold group-hover:translate-x-1 transition-transform">
                View All <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default GoalPreview;
