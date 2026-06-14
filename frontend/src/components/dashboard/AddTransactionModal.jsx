import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const AddTransactionModal = ({ isOpen, setIsOpen, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'EXPENSE',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const modalRef = useRef(null);
  const amountRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [isOpen]);

  // Accessibility: focus and keyboard support
  useEffect(() => {
    if (!isOpen) return undefined;

    // Focus the first field when modal opens
    setTimeout(() => {
      amountRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      if (e.key === 'Tab') {
        // Simple focus trap
        const focusable = modalRef.current?.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsOpen(false);
        setFormData({
          amount: '',
          category: '',
          type: 'EXPENSE',
          date: new Date().toISOString().split('T')[0],
          description: '',
        });
        setErrors({});
        if (onSuccess) onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to add transaction' }));
        setErrors({ general: errorData.message });
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      amount: '',
      category: '',
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setErrors({});
  };

  return (
    <>
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-start md:items-center justify-center p-6 pt-[80px] md:pt-0"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-card-light dark:bg-card-dark p-6 sm:p-8 rounded-2xl shadow-2xl border border-border-light dark:border-border-dark w-full max-w-[720px] mx-auto max-h-[85vh] overflow-y-auto z-[10000]"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-transaction-title"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 id="add-transaction-title" className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Add New Transaction</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {errors.general && <p className="text-red-500 text-center mb-4 text-sm">{errors.general}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    ref={amountRef}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={`input-field`}
                    required
                  />
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Food, Rent"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`input-field`}
                    required
                  />
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`input-field`}
                    required
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">Description (Optional)</label>
                <textarea
                  placeholder="Add a note..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={clearForm}
                  className="flex-1 p-3 border border-border-light dark:border-border-dark rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Clear Form
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 p-3 border border-border-light dark:border-border-dark rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" />
                      Add Transaction
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default AddTransactionModal;