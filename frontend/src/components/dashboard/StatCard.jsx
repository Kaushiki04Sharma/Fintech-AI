import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  const isPositiveTrend = trend === 'up';

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="relative group"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>

      {/* Main card */}
      <div className="relative card p-6 hover:shadow-card-hover transition-all duration-300">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-2 uppercase tracking-wide">
                {title}
              </p>
              <motion.p
                className="text-3xl md:text-4xl font-black text-text-primary-light dark:text-text-primary-dark"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                {value}
              </motion.p>

              {/* Trend indicator */}
              {trend && (
                <motion.div
                  className={`flex items-center mt-2 text-sm font-bold ${isPositiveTrend
                      ? 'text-secondary-600 dark:text-secondary-400'
                      : 'text-red-600 dark:text-red-400'
                    }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {isPositiveTrend ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : (
                    <TrendingDown size={16} className="mr-1" />
                  )}
                  <span>{trendValue || '0%'}</span>
                </motion.div>
              )}
            </div>

            {/* Icon with animation */}
            {Icon && (
              <motion.div
                variants={iconVariants}
                className="relative"
              >
                {/* Icon glow */}
                <div className="absolute inset-0 bg-primary-500/20 rounded-xl blur-xl group-hover:bg-primary-500/40 transition-all duration-300"></div>

                {/* Icon container */}
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary-500/10 to-purple-600/10 group-hover:from-primary-500/20 group-hover:to-purple-600/20 border border-primary-200/50 dark:border-primary-800/50 transition-all duration-300">
                  <Icon size={28} className="text-primary-600 dark:text-primary-400" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Animated progress bar */}
          <motion.div
            className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "75%" }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
