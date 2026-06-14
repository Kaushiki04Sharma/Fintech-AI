import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

// 🟢 IMPROVED: More accurate Goal Projection with financial expertise
const getGoalProjection = (currentAmount, targetAmount, deadline, autoAllocationPercentage) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const timeRemaining = targetDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    const monthsRemaining = daysRemaining > 0 ? daysRemaining / 30.44 : 0;
    const amountRemaining = targetAmount - currentAmount;

    if (amountRemaining <= 0) {
        return "🎉 Goal achieved! Consider setting a new financial target.";
    }

    if (monthsRemaining <= 0) {
        return `Overdue! You need $${amountRemaining.toFixed(2)} more. Review your budget.`;
    }

    const requiredMonthlySaving = amountRemaining / monthsRemaining;
    const weeklySaving = requiredMonthlySaving / 4.33; // Average weeks per month

    // Financial advice based on allocation
    let advice = "";
    if (autoAllocationPercentage && autoAllocationPercentage > 0) {
        advice = `Auto-allocating ${autoAllocationPercentage}% of income helps. `;
    }

    if (requiredMonthlySaving > targetAmount * 0.1) { // High saving rate
        return `${advice}Requires $${requiredMonthlySaving.toFixed(2)}/month ($${weeklySaving.toFixed(2)}/week). Consider increasing income or reducing expenses.`;
    } else if (requiredMonthlySaving > targetAmount * 0.05) {
        return `${advice}On track with $${requiredMonthlySaving.toFixed(2)}/month needed. Stay consistent!`;
    } else {
        return `${advice}Easily achievable at $${requiredMonthlySaving.toFixed(2)}/month. Great planning!`;
    }
};

const MyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    autoAllocationPercentage: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/goals`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
          ...formData,
          targetAmount: parseFloat(formData.targetAmount),
          autoAllocationPercentage: formData.autoAllocationPercentage 
            ? parseInt(formData.autoAllocationPercentage) 
            : null
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        fetchGoals();
        setShowForm(false);
        setFormData({ name: '', targetAmount: '', deadline: '', autoAllocationPercentage: '' });
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/goals/${goalId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setDeleteConfirm(null);
        fetchGoals();
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
      >
        <div>
          <h1 className="text-h2 text-text-primary-light dark:text-text-primary-dark">My Goals</h1>
          <p className="text-subtitle mt-2">Track and manage your financial objectives</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary inline-flex items-center whitespace-nowrap"
        >
          <Plus size={20} className="mr-2" />
          {showForm ? 'Cancel' : 'Add Goal'}
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="card p-6 space-y-6"
          >
            <h3 className="text-h3 text-text-primary-light dark:text-text-primary-dark">Create a New Goal</h3>
            <div className="divider"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Goal Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="number"
                placeholder="Target Amount"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Auto-Allocate % (0-100)"
                value={formData.autoAllocationPercentage}
                onChange={(e) => setFormData({ ...formData, autoAllocationPercentage: e.target.value })}
                className="input-field"
                min="0"
                max="100"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Create Goal
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {goals.length === 0 && !showForm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <Target size={48} className="mx-auto text-primary/50 mb-4" />
          <h3 className="text-h3 text-text-primary-light dark:text-text-primary-dark mb-2">No Goals Yet</h3>
          <p className="text-subtitle">Create your first financial goal to get started</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-primary/10 mr-3">
                    <Target size={20} className="text-primary" />
                  </div>
                  <h3 className="text-body-lg font-bold text-text-primary-light dark:text-text-primary-dark">{goal.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="badge-success">{Math.min(100, (goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}%</span>
                  {deleteConfirm === goal.id ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                        title="Confirm delete"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-1 rounded bg-gray-400 text-white hover:bg-gray-500 transition-colors text-xs"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(goal.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="divider mb-4"></div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">Progress</span>
                  <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                    ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  ></motion.div>
                </div>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {goal.deadline ? getGoalProjection(goal.currentAmount, goal.targetAmount, goal.deadline, goal.autoAllocationPercentage) : 'Set a deadline for projections.'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGoals;