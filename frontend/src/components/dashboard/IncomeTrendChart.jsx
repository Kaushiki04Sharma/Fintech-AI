import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Chart as ChartJS } from 'chart.js';
import { useRef } from 'react';

const IncomeTrendChart = ({ transactions }) => {
  const chartRef = useRef(null);

  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return (
          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-card border border-border-light dark:border-border-dark w-full h-80 flex flex-col justify-center items-center"
          >
              <h3 className="text-body-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">Income Trend</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">No income data to display.</p>
          </motion.div>
      );
  }
  
  const incomeData = transactions.filter(t => t && t.type === 'INCOME').sort((a, b) => new Date(a.date) - new Date(b.date));

  if (incomeData.length === 0) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-card border border-border-light dark:border-border-dark w-full h-80 flex flex-col justify-center items-center"
        >
            <h3 className="text-body-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">Income Trend</h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">No income data to display.</p>
        </motion.div>
    );
  }

  // FIX: 'data' ko function ki jagah direct object banaya gaya hai
  // react-chartjs-2 ka Line component data prop mein OBJECT expect karta hai, function nahi
  const chartData = {
    labels: incomeData.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Income',
      data: incomeData.map(t => t.amount || 0),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#22c55e',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(34, 197, 94, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#64748b' },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-card border border-border-light dark:border-border-dark w-full"
    >
      <h3 className="text-body-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">Income Trend</h3>
      <div className="w-full h-64 relative">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </motion.div>
  );
};

export default IncomeTrendChart;