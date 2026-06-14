import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, MessageSquare, Trash2, Zap, Brain } from 'lucide-react';
import ChatBubble from '../components/chat/ChatBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import { useAuth } from '../context/AuthContext';

const AIAdvisor = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: Date.now(), sender: 'ai', text: "Hello! I am your AI Financial Coach. Ask me anything about your budget, spending habits, or financial goals." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const { user } = useAuth();

  const suggestions = [
    "How can I save $500 this month?",
    "Analyze my spending habits",
    "Should I invest in stocks or crypto?",
    "Plan a budget for my next vacation"
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend = message) => {
    const trimmedMessage = textToSend.trim();
    if (!trimmedMessage) return;

    const userMessage = { id: Date.now(), sender: 'user', text: trimmedMessage };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: trimmedMessage })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      const aiMessage = { id: Date.now() + 1, sender: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = { id: Date.now() + 1, sender: 'ai', text: "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment!" };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      sender: 'ai',
      text: "Chat cleared! How else can I help you today?"
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          <div className="relative mr-4">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Bot size={28} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-card-dark rounded-full"></div>
          </div>
          <div>
            <h2 className="text-h2 text-gradient">FinWise AI Advisor</h2>
            <div className="flex items-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-widest mt-1">
              <Zap size={12} className="text-yellow-500 mr-1" /> Powered by Gemini
            </div>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearChat}
          className="flex items-center px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border border-red-500/20"
        >
          <Trash2 size={16} className="mr-2" /> Clear History
        </motion.button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col card overflow-hidden border-primary/10"
        >
          {/* Messages Strip */}
          <div ref={chatContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto bg-dots scrollbar-premium">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 bg-card-light/50 dark:bg-card-dark/50 border-t border-border-light/30 dark:border-border-dark/30 backdrop-blur-md">
            <div className="relative max-w-4xl mx-auto">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message FinWise AI..."
                className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white dark:bg-card-dark border-2 border-border-light/50 dark:border-border-dark/50 focus:border-primary-500 dark:focus:border-primary-500 transition-all duration-300 focus:shadow-glow-sm shadow-premium outline-none text-text-primary-light dark:text-text-primary-dark"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSend()}
                disabled={isLoading || !message.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center shadow-lg disabled:opacity-50 disabled:scale-100 transition-all"
              >
                <Send size={18} />
              </motion.button>
            </div>
            <p className="text-[10px] text-center text-text-secondary-light dark:text-text-secondary-dark mt-3 opacity-60">
              AI can make mistakes. Consider checking important financial decisions.
            </p>
          </div>
        </motion.div>

        {/* Sidebar Help / Suggestions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col w-72 space-y-6"
        >
          <div className="card p-6 bg-gradient-to-br from-primary/5 to-purple-600/5 border-primary/20">
            <h3 className="text-sm font-bold mb-4 flex items-center text-primary-600 dark:text-primary-400">
              <Sparkles size={16} className="mr-2" /> Try Asking
            </h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={() => handleSend(suggestion)}
                  className="w-full text-left p-3 rounded-xl bg-white dark:bg-card-dark/50 border border-border-light/50 dark:border-border-dark/50 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-all duration-200"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="card p-6 border-secondary/20 bg-gradient-to-br from-secondary/5 to-blue-600/5">
            <h3 className="text-sm font-bold mb-3 flex items-center text-secondary-600 dark:text-secondary-400">
              <Brain size={16} className="mr-2" /> Capabilities
            </h3>
            <ul className="space-y-3">
              {[
                "Personalized budget plans",
                "Spending habit analysis",
                "Goal achievement strategies",
                "Investment basics & guidance"
              ].map((text, i) => (
                <li key={i} className="flex items-start text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 mr-3 flex-shrink-0"></div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIAdvisor;