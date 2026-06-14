import { Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatBubble = ({ message }) => {
  const { sender, text } = message;
  const isUser = sender === 'user';

  const variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  if (isUser) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        className="flex items-start space-x-3 justify-end mb-6"
      >
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="text-[10px] font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest mb-1 px-1">
            You
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary-600 p-4 rounded-2xl rounded-tr-none text-white shadow-lg break-words leading-relaxed font-medium">
              {text}
            </div>
          </div>
          <div className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark mt-1 px-1 opacity-50">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="flex-shrink-0 mt-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/10 to-purple-500/10 flex items-center justify-center border border-primary/20">
            <User size={18} className="text-primary" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="flex items-start space-x-3 mb-6"
    >
      <div className="flex-shrink-0 mt-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500/10 to-primary-500/10 flex items-center justify-center border border-secondary/20 relative">
          <Bot size={18} className="text-secondary" />
          <div className="absolute -top-1 -right-1">
            <Sparkles size={10} className="text-secondary animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%]">
        <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 px-1">
          FinWise AI
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary-500/10 to-primary-500/10 rounded-2xl blur-sm opacity-50"></div>
          <div className="relative bg-card-light/95 dark:bg-card-dark/95 backdrop-blur-md p-4 rounded-2xl rounded-tl-none border border-border-light/50 dark:border-border-dark/50 text-text-primary-light dark:text-text-primary-dark shadow-sm break-words leading-relaxed font-medium">
            {text}
          </div>
        </div>
        <div className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark mt-1 px-1 opacity-50">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;