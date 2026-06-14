import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const ExpenseChart = ({ transactions }) => {
  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return (
          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-card-light dark:bg-card-dark p-4 lg:p-6 rounded-lg shadow-card border border-border-light dark:border-border-dark w-full h-80 flex flex-col justify-center items-center"
          >
              <h3 className="text-base lg:text-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">Expense Breakdown</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">No expense data to display.</p>
          </motion.div>
      );
  }

  const expenseData = transactions.filter(t => t && t.type === 'EXPENSE');
  
  if (expenseData.length === 0) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-card-light dark:bg-card-dark p-4 lg:p-6 rounded-lg shadow-card border border-border-light dark:border-border-dark w-full h-80 flex flex-col justify-center items-center"
        >
            <h3 className="text-base lg:text-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">Expense Breakdown</h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">No expense data to display.</p>
        </motion.div>
    );
  }

  const categories = [...new Set(expenseData.map(t => t.category))];
  
  const data = {
    labels: categories,
    datasets: [{
      data: categories.map(cat => expenseData.filter(t => t.category === cat).reduce((sum, t) => sum + (t.amount || 0), 0)),
      backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 2,
      borderColor: '#ffffff',
    }],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'currentColor',
          font: { size: 12 },
        },
        position: 'right',
        align: 'center',
      },
      tooltip: {
        backgroundColor: 'rgba(59, 130, 246, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-card-light dark:bg-card-dark p-4 lg:p-6 rounded-lg shadow-card border border-border-light dark:border-border-dark w-full"
    >
      <h3 className="text-base lg:text-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">Expense Breakdown</h3>
      <div className="w-full h-64 relative">
        <Doughnut data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default ExpenseChart;