import { motion } from 'framer-motion';
import { Table, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react'; // 🟢 FIX: useMemo for stable sorting

const TransactionTable = ({ transactions, onDelete }) => {
  // 🟢 CRITICAL FIX: Explicit check to prevent crashes if data is null/undefined
  if (!transactions || transactions.length === 0) {
      return (
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-card border border-border-light dark:border-border-dark"
          >
              <div className="flex items-center mb-4">
                  <Table size={24} className="text-primary mr-2" />
                  <h3 className="text-body-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Transaction History</h3>
              </div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">No transactions found for the selected filter.</p>
          </motion.div>
      );
  }

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🟢 FIX: Use useMemo for efficient sorting
  const sortedTransactions = useMemo(() => {
    let sortableItems = [...transactions];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle Date and Amount sorting specifically
        if (sortConfig.key === 'date') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (sortConfig.key === 'amount') {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [transactions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (transactionId) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions/${transactionId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setDeleteConfirm(null);
        if (onDelete) onDelete(); // refresh parent
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete' }));
        alert('Failed to delete transaction: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error deleting transaction: ' + (error.message || 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const SortableHeader = ({ name, sortKey }) => (
    <th 
      className="text-left p-3 text-text-secondary-light dark:text-text-secondary-dark cursor-pointer hover:text-primary transition-colors" 
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center">
        {name}
      </div>
    </th>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-card border border-border-light dark:border-border-dark"
    >
      <div className="flex items-center mb-4">
        <Table size={24} className="text-primary mr-2" />
        <h3 className="text-body-lg font-semibold text-text-primary-light dark:text-text-primary-dark">Transaction History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark">
              <SortableHeader name="Date" sortKey="date" />
              <SortableHeader name="Description" sortKey="description" />
              <SortableHeader name="Category" sortKey="category" />
              <SortableHeader name="Type" sortKey="type" />
              <SortableHeader name="Amount" sortKey="amount" />
              <th className="text-center p-3 text-text-secondary-light dark:text-text-secondary-dark">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <motion.tr 
                key={transaction.id} 
                className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="p-3 text-text-primary-light dark:text-text-primary-dark">
                  {new Date(transaction.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </td>
                <td className="p-3 text-text-primary-light dark:text-text-primary-dark truncate">
                  {transaction.description || 'N/A'}
                </td>
                <td className="p-3 text-text-primary-light dark:text-text-primary-dark">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {transaction.category}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.type === 'INCOME' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="p-3 text-right text-text-primary-light dark:text-text-primary-dark font-semibold">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="p-3 text-center">
                  {deleteConfirm === transaction.id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        disabled={isDeleting}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        disabled={isDeleting}
                        className="text-xs px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(transaction.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors hover:scale-110"
                      title="Delete transaction"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TransactionTable;