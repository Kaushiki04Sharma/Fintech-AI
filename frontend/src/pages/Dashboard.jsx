import { DollarSign, TrendingUp, CreditCard, Activity, Plus } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import IncomeTrendChart from '../components/dashboard/IncomeTrendChart';
import ProactiveTip from '../components/dashboard/ProactiveTip';
import GoalPreview from '../components/dashboard/GoalPreview';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';
import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { user, authError, refreshAuth } = useAuth();

  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setDataLoaded(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data || []);
      } else {
        console.error('Failed to fetch transactions with status:', response.status);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
      setTimeout(() => setDataLoaded(true), 100);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  if (loading) return <Loader />;

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const totalBalance = safeTransactions.reduce(
    (sum, t) => (t.type === 'INCOME' ? sum + t.amount : sum - t.amount),
    0
  );
  const totalIncome = safeTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = safeTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

  const activity = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0;

  const monthlySavings = totalIncome - totalExpenses;

  const statCards = [
    { title: 'Total Balance', value: `$${totalBalance.toFixed(2)}`, icon: DollarSign },
    { title: 'Monthly Savings', value: `$${monthlySavings.toFixed(2)}`, icon: TrendingUp },
    { title: 'Total Expenses', value: `$${totalExpenses.toFixed(2)}`, icon: CreditCard },
    { title: 'Activity', value: `${activity}%`, icon: Activity },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-dots dark:bg-grid opacity-30 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
        >
          <div>
            <h1 className="text-h2 text-gradient mb-2">Dashboard</h1>
            <p className="text-subtitle mt-2 flex items-center">
              <span className="inline-block w-2 h-2 bg-secondary-500 rounded-full mr-2 animate-pulse"></span>
              Track your finances at a glance
            </p>
          </div>
          {/* Add Transaction Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="btn-primary inline-flex items-center whitespace-nowrap shadow-glow"
          >
            <Plus size={20} className="mr-2" /> Add Transaction
          </motion.button>
        </motion.div>

        {authError ? (
          <div className="card p-4 mb-4 border-l-4 border-yellow-400 text-yellow-800 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center justify-between">
            <div>{authError}</div>
            <div className="ml-4">
              <button onClick={refreshAuth} className="btn-primary">Retry</button>
            </div>
          </div>
        ) : safeTransactions.length === 0 && dataLoaded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-12 text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Plus size={32} className="text-primary" />
              </div>
            </div>
            <h2 className="text-h3 text-text-primary-light dark:text-text-primary-dark mb-2">Welcome to FinWise!</h2>
            <p className="text-subtitle mb-6">Start tracking your finances today</p>
          </motion.div>
        ) : dataLoaded ? (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {statCards.map((card, index) => (
                <StatCard key={index} {...card} />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <ProactiveTip />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 min-h-[400px]">
                <IncomeTrendChart transactions={safeTransactions} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="min-h-[400px]">
                  <ExpenseChart transactions={safeTransactions} />
                </div>
                <GoalPreview />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-96">
            <Loader />
          </div>
        )}

        <AddTransactionModal
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          onSuccess={fetchTransactions}
        />
      </div>
    </>
  );
};

export default Dashboard;
