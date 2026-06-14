import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, HelpCircle, Sparkles, ChevronDown } from 'lucide-react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import { runHelpChat } from '../../utils/gemini';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: Date.now(), sender: 'ai', text: "Hello! I'm your FinWise assistant. How can I help you navigate the platform today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const userMessage = { id: Date.now(), sender: 'user', text: trimmedMessage };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const reply = await runHelpChat(trimmedMessage);
      const aiMessage = { id: Date.now() + 1, sender: 'ai', text: reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send help message:", error);
      const errorMessage = { id: Date.now() + 1, sender: 'ai', text: "I'm having a little trouble connecting to my help system. Try asking again in a moment!" };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[90vw] max-w-[380px] h-[500px] max-h-[70vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4 border border-border-light/50 dark:border-border-dark/50 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Dark mode overlay */}
            <div className="absolute inset-0 dark:bg-card-dark/95 transition-colors pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 px-6 py-5 flex justify-between items-center border-b border-border-light/50 dark:border-border-dark/50 bg-gradient-to-r from-primary-500/10 to-purple-600/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">Site Support</h3>
                  <div className="flex items-center text-[10px] text-green-500 font-bold uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={chatContainerRef} className="relative z-10 flex-1 p-6 overflow-y-auto space-y-2 bg-dots scrollbar-premium">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>

            {/* Input Area */}
            <div className="relative z-10 p-5 bg-card-light/50 dark:bg-card-dark/50 border-t border-border-light/50 dark:border-border-dark/50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask for help..."
                  className="w-full pl-5 pr-12 py-3.5 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark focus:border-primary-500 dark:focus:border-primary-500 transition-all outline-none text-sm text-text-primary-light dark:text-text-primary-dark shadow-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  className="absolute right-2 w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50 transition-all"
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"></div>
        <div className="relative text-white">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                className="relative"
              >
                <MessageSquare size={28} />
                <div className="absolute -top-1 -right-1">
                  <Sparkles size={14} className="text-white animate-pulse" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pulse effect */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-2xl border-4 border-primary/20 animate-ping pointer-events-none"></div>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;