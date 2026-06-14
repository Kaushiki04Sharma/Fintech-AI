import { motion } from 'framer-motion';
import { PieChart, RefreshCw, BarChart3, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const BudgetReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/budget-report`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || 'Failed to generate budget report');
      }
    } catch (err) {
      console.error('Budget report error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) return (
    <div className="card p-8 h-64 flex flex-col items-center justify-center space-y-4">
      <RefreshCw size={32} className="text-primary animate-spin" />
      <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Generating your budget analysis...</p>
    </div>
  );

  if (error) return (
    <div className="card p-8 h-64 flex flex-col items-center justify-center space-y-4 border-l-4 border-red-500">
      <AlertCircle size={32} className="text-red-500" />
      <p className="text-red-500 font-bold">Analysis Failed</p>
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark text-center px-4">{error}</p>
      <button onClick={fetchReport} className="btn-primary mt-2">Try Again</button>
    </div>
  );

  if (!report) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative card p-6 lg:p-8 overflow-hidden"
    >
      {/* Background Decorative Icon */}
      <div className="absolute -right-8 -bottom-8 opacity-[0.03] dark:opacity-[0.05]">
        <PieChart size={200} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 relative z-10">
        <div className="flex items-center">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500/10 to-purple-600/10 mr-3">
            <BarChart3 size={24} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            AI Budget Analysis (50/30/20)
          </h3>
        </div>
        <button
          onClick={fetchReport}
          className="flex items-center text-xs font-bold text-primary px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all"
        >
          <RefreshCw size={14} className="mr-1.5" /> Re-Analyze
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        {report.data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="card bg-gradient-to-br from-card-light/50 to-background-light/50 dark:from-card-dark/50 dark:to-background-dark/50 p-6 flex flex-col items-center border-border-light/30 transition-all hover:shadow-glow-sm"
          >
            <div className={`text-3xl font-black mb-2 ${item.category === 'Needs' ? 'text-primary' :
                item.category === 'Wants' ? 'text-secondary' :
                  'text-green-500'
              }`}>
              {item.percentage}%
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark mb-3">
              {item.category}
            </div>
            <div className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4 relative z-10 bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl border border-primary/10">
        <div className="flex items-center mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
          <p className="font-bold text-text-primary-light dark:text-text-primary-dark">{report.summary}</p>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark font-medium">
          {report.explanation}
        </p>
      </div>
    </motion.div>
  );
};

export default BudgetReport;