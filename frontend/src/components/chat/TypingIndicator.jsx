import { motion } from 'framer-motion';

const TypingIndicator = () => {
  const dotVariants = {
    start: { y: 0 },
    end: { y: -10 },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  };

  return (
    <div className="flex items-center space-x-2 p-3">
      <motion.div
        className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
        variants={dotVariants}
        initial="start"
        animate="end"
        transition={{ ...dotTransition, delay: 0 }}
      />
      <motion.div
        className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
        variants={dotVariants}
        initial="start"
        animate="end"
        transition={{ ...dotTransition, delay: 0.2 }}
      />
      <motion.div
        className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
        variants={dotVariants}
        initial="start"
        animate="end"
        transition={{ ...dotTransition, delay: 0.4 }}
      />
    </div>
  );
};

export default TypingIndicator;
