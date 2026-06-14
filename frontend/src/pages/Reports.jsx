import { motion } from 'framer-motion';
import IncomeTrendChart from '../components/dashboard/IncomeTrendChart';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import TransactionTable from '../components/reports/TransactionTable';
import BudgetReport from '../components/reports/BudgetReport';
import { BarChart3 } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('30');
  const { user } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setDataLoaded(false); // 🟢 Reset dataLoaded when fetching
    try {
      const now = new Date();
      let startDate;
      if (filter === '30') startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      else if (filter === '180') startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      else if (filter === '365') startDate = new Date(now.getFullYear(), 0, 1);

      const query = startDate ? `?startDate=${startDate.toISOString()}` : '';
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions${query}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch transactions for reports with status:', response.status);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Failed to fetch transactions for reports:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
      setTimeout(() => setDataLoaded(true), 100); // 🟢 Ensure state is set before rendering charts
    }
  }, [filter]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  const handleTransactionDelete = () => {
    fetchTransactions(); // refresh
  };

  if (loading) return <Loader />;

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
      >
        <div>
          <h1 className="text-h2 text-text-primary-light dark:text-text-primary-dark">Reports</h1>
          <p className="text-subtitle mt-2">Analyze your financial performance</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-full sm:w-48"
        >
          <option value="30">Last 30 Days</option>
          <option value="180">Last 6 Months</option>
          <option value="365">Year-to-Date</option>
        </select>
      </motion.div>

      {!dataLoaded ? (
        <div className="flex items-center justify-center h-96">
          <Loader />
        </div>
      ) : safeTransactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 text-center"
        >
          <BarChart3 size={48} className="mx-auto text-primary/50 mb-4" />
          <h3 className="text-h3 text-text-primary-light dark:text-text-primary-dark mb-2">No Data Available</h3>
          <p className="text-subtitle">Add transactions to generate reports</p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full overflow-hidden">
              <IncomeTrendChart transactions={safeTransactions} />
            </div>
            <div className="w-full overflow-hidden">
              <ExpenseChart transactions={safeTransactions} />
            </div>
          </div>
          <div className="w-full overflow-hidden">
            <BudgetReport />
          </div>
          <div className="w-full overflow-x-auto">
            <TransactionTable transactions={safeTransactions} onDelete={handleTransactionDelete} />
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Reports;