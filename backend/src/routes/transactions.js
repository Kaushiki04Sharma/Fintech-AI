const express = require('express');
const { getDB } = require('../mongoClient');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all transactions for user
router.get('/', auth, async (req, res) => {
  try {
    const { startDate } = req.query;
    const db = getDB();
    const query = { userId: req.user.id };
    
    if (startDate) {
      query.date = { $gte: new Date(startDate) };
    }

    const transactions = await db.collection('transactions')
      .find(query)
      .sort({ date: -1 })
      .toArray();
      
    res.json(transactions);
  } catch (error) {
    console.error('[GET TRANSACTIONS ERROR]:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, type, date, description } = req.body;
    
    // Validate input
    if (!amount || !category || !type || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = getDB();
    const result = await db.collection('transactions').insertOne({
      userId: req.user.id,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date(date),
      description: description || ''
    });

    // 🟢 NEW AUTO-ALLOCATION LOGIC FOR INCOME
    if (type === 'INCOME') {
      const goals = await db.collection('goals')
        .find({
          userId: req.user.id,
          autoAllocationPercentage: { $gt: 0 }
        })
        .toArray();

      for (const goal of goals) {
        const allocatedAmount = (parseFloat(amount) * goal.autoAllocationPercentage) / 100;
        await db.collection('goals').updateOne(
          { _id: goal._id },
          { $inc: { currentAmount: allocatedAmount } }
        );
      }
    }

    const transaction = await db.collection('transactions').findOne({ _id: result.insertedId });
    res.status(201).json(transaction);
  } catch (error) {
    console.error('[CREATE TRANSACTION ERROR]:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🟢 DELETE: Remove a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = getDB();
    // Verify the transaction exists
    const transaction = await db.collection('transactions').findOne({ _id: new ObjectId(id) });

    // Check if transaction exists and belongs to the user
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }

    // Delete the transaction
    await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });

    res.json({ message: 'Transaction deleted successfully', id });
  } catch (error) {
    console.error('[DELETE TRANSACTION ERROR]:', error);
    res.status(500).json({ message: 'Server error while deleting transaction' });
  }
});

module.exports = router;
