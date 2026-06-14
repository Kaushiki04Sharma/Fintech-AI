const express = require('express');
const { getDB } = require('../mongoClient');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all goals for user
router.get('/', auth, async (req, res) => {
  try {
    const db = getDB();
    const goals = await db.collection('goals')
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();
      
    res.json(goals);
  } catch (error) {
    console.error('[GET GOALS ERROR]:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
  try {
    const { name, targetAmount, deadline, autoAllocationPercentage } = req.body;
    
    // Validate input
    if (!name || !targetAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = getDB();
    const result = await db.collection('goals').insertOne({
      userId: req.user.id,
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      deadline: deadline ? new Date(deadline) : null,
      autoAllocationPercentage: autoAllocationPercentage ? parseInt(autoAllocationPercentage) : null,
      createdAt: new Date()
    });
    
    const goal = await db.collection('goals').findOne({ _id: result.insertedId });
    res.status(201).json(goal);
  } catch (error) {
    console.error('[CREATE GOAL ERROR]:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🟢 DELETE: Remove a goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = getDB();
    // Verify the goal exists
    const goal = await db.collection('goals').findOne({ _id: new ObjectId(id) });

    // Check if goal exists and belongs to the user
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this goal' });
    }

    // Delete the goal
    await db.collection('goals').deleteOne({ _id: new ObjectId(id) });

    res.json({ message: 'Goal deleted successfully', id });
  } catch (error) {
    console.error('[DELETE GOAL ERROR]:', error);
    res.status(500).json({ message: 'Server error while deleting goal' });
  }
});

module.exports = router;
